import Loader from "./load";
import { Buffer } from "buffer";
import * as internal from "stream";

export async function Cardano() {
  await Loader.load();
  return Loader.Cardano;
}

export async function delegationTx(stakePoolHash, walletName) {
  const CardanoWasm = await Cardano();
  if (!window.cardano[walletName]) {
    alert("Unable to connect to selected Wallet please make sure that you have the Wallet's browser extension.")
    return;
  }

  const Wallet = await window.cardano[walletName].enable();

  const numerator = CardanoWasm.BigNum.zero();
  const denominator = CardanoWasm.BigNum.zero();
  const UnitIntervalZero = CardanoWasm.UnitInterval.new(numerator, denominator);
  let usedAddresses: string[];
  let rewardAddress: string;
  let networkId: number;

  if (await window.cardano[walletName].isEnabled()) {
    try {
      usedAddresses = await Wallet.getUsedAddresses();
      rewardAddress = await Wallet.getRewardAddresses().then(x => x[0]);
      networkId = await Wallet.getNetworkId();
    } catch (err) {
      alert("Unabled to connect to a specific account inside the selected Wallet please check that you have connected a wallet to your selected Wallet Visor.")
      console.log("error: 'could not retrieve addresses.' reason:", err);
      return;
    }
  }

  const stakeKey = await CardanoWasm.StakeCredential.from_keyhash(CardanoWasm.Ed25519KeyHash.from_bytes(Buffer.from(rewardAddress.slice(2), "hex")));
  const stakeAddress = CardanoWasm.RewardAddress.new(networkId, stakeKey).to_address().to_bech32()
  console.log(stakeAddress, stakeKey);

  const latestBlock = await getLatestBlock();
  const isStakeActive = await getStakeActivity(stakeAddress);
  const feeParams = await getFeeParams()
  const { min_fee_a, min_fee_b, key_deposit, pool_deposit, max_tx_size, max_val_size, price_mem, price_step, coins_per_utxo_size } = JSON.parse(feeParams.body)
  
  console.log("latest block:", JSON.parse(latestBlock.body), "stake active?", isStakeActive.active, "feeParams: ", JSON.parse(feeParams.body));

  const txBuilderConfig = CardanoWasm.TransactionBuilderConfigBuilder.new()
    .coins_per_utxo_byte(CardanoWasm.BigNum.from_str(coins_per_utxo_size))
    .fee_algo(
      CardanoWasm.LinearFee.new(
        CardanoWasm.BigNum.from_str(min_fee_a.toString()),
        CardanoWasm.BigNum.from_str(min_fee_b.toString())
      )
    )
    .key_deposit(CardanoWasm.BigNum.from_str(key_deposit))
    .pool_deposit(CardanoWasm.BigNum.from_str(pool_deposit))
    .max_tx_size(max_tx_size)
    .max_value_size(Number(max_val_size))
    .ex_unit_prices(CardanoWasm.ExUnitPrices.new(CardanoWasm.UnitInterval.from_json(price_mem), CardanoWasm.UnitInterval.from_json(price_step)))
    .prefer_pure_change(true)
    .build();

  const txBuilder = CardanoWasm.TransactionBuilder.new(txBuilderConfig);

  const certs = CardanoWasm.Certificates.new()

  if (!isStakeActive) {
    certs.add(
      CardanoWasm.Certificate.new_stake_registration(
        CardanoWasm.StakeRegistration.new(
          CardanoWasm.StakeCredential.from_keyhash(
            CardanoWasm.Ed25519KeyHash.from_bytes(
              Buffer.from(
                rewardAddress.slice(2),
                "hex"
              )
            )
          )
        )
      )
    );
  }

  certs.add(
    CardanoWasm.Certificate.new_stake_delegation(
      CardanoWasm.StakeDelegation.new(
        CardanoWasm.StakeCredential.from_keyhash(
          CardanoWasm.Ed25519KeyHash.from_bytes(
            Buffer.from(
              rewardAddress.slice(2),
              "hex"
            )
          )
        ),
        CardanoWasm.Ed25519KeyHash.from_bytes(Buffer.from(stakePoolHash, "hex"))
      )
    )
  );

  txBuilder.set_certs(certs);

  txBuilder.set_ttl(
    CardanoWasm.BigNum.from_str((latestBlock + 60).toString())
  );

  const addressHex = usedAddresses[0];
  const address = CardanoWasm.BaseAddress.from_address(
    CardanoWasm.Address.from_bytes(Buffer.from(addressHex, "hex"))
  )
    .to_address()
    .to_bech32()

  const utxos = (await Wallet.getUtxos()).map(utxo => CardanoWasm.TransactionUnspentOutput.from_bytes(Buffer.from(utxo, "hex")))

  const utxoOut = CardanoWasm.TransactionUnspentOutputs.new();
  utxos.map((utxo) => utxoOut.add(utxo));

  txBuilder.add_inputs_from(
    utxoOut,
    0
  );

  txBuilder.add_change_if_needed(CardanoWasm.Address.from_bytes(Buffer.from(addressHex, "hex")));

  const txBody = txBuilder.build();

  const transaction = CardanoWasm.Transaction.new(
    txBuilder.build(),
    CardanoWasm.TransactionWitnessSet.new()
  )

  const witness = await Wallet.signTx(
    Buffer.from(transaction.to_bytes(), "hex").toString("hex"),
    false
  )
  const signedTx = CardanoWasm.Transaction.new(
    txBody,
    CardanoWasm.TransactionWitnessSet.from_bytes(Buffer.from(witness, "hex")),
    undefined
  )

  console.log("bech32: ", address);

  const txHash = await Wallet.submitTx(
    Buffer.from(signedTx.to_bytes()).toString("hex")
  );

  console.log(txHash);

  return ([txHash, address]);
};

async function getStakeActivity(stakeAddress:string) {
  const isStakeActive = await fetch(`https://api.dotare.io/getStakeInfo/${stakeAddress}`, {
      mode: 'cors',
      method: "get"
    })
    return isStakeActive.json()
}

async function getFeeParams() {
  const feeParams = await fetch("https://api.dotare.io/getFeeParams", {
    mode: 'cors',
    method: "get"
  })

  return feeParams.json()
}

async function getLatestBlock() {
  const latestBlock = await fetch("https://api.dotare.io/getLatestBlock", {
    mode: 'cors',
    method: "get",
  })
  return latestBlock.json();
}