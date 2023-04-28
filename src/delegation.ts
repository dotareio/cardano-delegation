import Loader from "./load";
import { Buffer } from "buffer";

export async function Cardano() {
  await Loader.load();
  return Loader.Cardano;
}

export async function delegationTx(stakePoolId: string, walletName: string, chosenNetworkId: number = 1) {
  const CardanoWasm = await Cardano();
  if (!window.cardano?.[walletName]) {
    alert(
      "Unable to connect to selected Wallet please make sure that you have the Wallet's browser extension."
    );
    return;
  }
  try {
    const Wallet = await window.cardano[walletName].enable();

    const numerator = CardanoWasm.BigNum.zero();
    const denominator = CardanoWasm.BigNum.zero();
    const UnitIntervalZero = CardanoWasm.UnitInterval.new(
      numerator,
      denominator
    );
    let usedAddresses: string[];
    let rewardAddress: string;
    let walletNetworkId: number;
    let networkId: number = chosenNetworkId;
    let latestBlock: any;
    let feeParams: any;
    var isStakeActive: boolean;
    const bech32stakePoolId: string = await CardanoWasm.Ed25519KeyHash.from_bytes(Buffer.from(stakePoolId, "hex")).to_bech32("pool");

    if (await window.cardano[walletName].isEnabled()) {
      usedAddresses = await Wallet.getUsedAddresses();
      rewardAddress = await Wallet.getRewardAddresses().then((x) => x[0]);
      walletNetworkId = await Wallet.getNetworkId();
    }

    const stakeKey = await CardanoWasm.StakeCredential.from_keyhash(
      CardanoWasm.Ed25519KeyHash.from_bytes(
        Buffer.from(rewardAddress.slice(2), "hex")
      )
    );

    const stakeAddress = CardanoWasm.RewardAddress.new(
      walletNetworkId,
      stakeKey
    )
      .to_address()
      .to_bech32();

    var stakeInfo = await getStakeActivity(stakeAddress, networkId).then(x => x);
    if (stakeInfo.pool_id === bech32stakePoolId) throw new Error("stake address is already delegated to selected pool.")

    var network: string = stakeInfo.network;

    if (!network)
      throw new Error(
        "Could not find stake address inside network, may also be new with no funds."
      );

    if (walletNetworkId !== networkId && networkId !== 2)
      throw new Error("Wallet network does not match staking target network.");

    isStakeActive = stakeInfo.active;
    latestBlock = await getLatestBlock(network).then((x) => x.slot);
    feeParams = await getFeeParams(network);

    const {
      min_fee_a,
      min_fee_b,
      key_deposit,
      pool_deposit,
      max_tx_size,
      max_val_size,
      price_mem,
      price_step,
      coins_per_utxo_word,
      collateral_percent,
      max_collateral_inputs,
    } = feeParams;

    console.log(
      "latest block:",
      latestBlock,
      "stake active?",
      isStakeActive,
      "feeParams: ",
      feeParams
    );
    console.log("network name: ", network, "networkid: ", networkId);

    const txBuilderConfig = CardanoWasm.TransactionBuilderConfigBuilder.new()
      .coins_per_utxo_byte(CardanoWasm.BigNum.from_str(coins_per_utxo_word))
      .fee_algo(
        CardanoWasm.LinearFee.new(
          CardanoWasm.BigNum.from_str(min_fee_a.toString()),
          CardanoWasm.BigNum.from_str(min_fee_b.toString())
        )
      )
      .key_deposit(CardanoWasm.BigNum.from_str(key_deposit))
      .pool_deposit(CardanoWasm.BigNum.from_str(pool_deposit))
      .max_tx_size(Number(max_tx_size))
      .max_value_size(Number(max_val_size))
      .ex_unit_prices(
        CardanoWasm.ExUnitPrices.new(UnitIntervalZero, UnitIntervalZero)
      )
      .prefer_pure_change(true)
      .collateral_percentage(Number(collateral_percent))
      .max_collateral_inputs(max_collateral_inputs)
      .build();

    const txBuilder = CardanoWasm.TransactionBuilder.new(txBuilderConfig);

    if (!isStakeActive) {
      txBuilder.add_cert(
        CardanoWasm.SingleCertificateBuilder.new(
          CardanoWasm.Certificate.new_stake_registration(
            CardanoWasm.StakeRegistration.new(
              CardanoWasm.StakeCredential.from_keyhash(
                CardanoWasm.Ed25519KeyHash.from_bytes(
                  Buffer.from(rewardAddress.slice(2), "hex")
                )
              )
            )
          )
        ).skip_witness()
      );
    }

    txBuilder.add_cert(
      CardanoWasm.SingleCertificateBuilder.new(
        CardanoWasm.Certificate.new_stake_delegation(
          CardanoWasm.StakeDelegation.new(
            CardanoWasm.StakeCredential.from_keyhash(
              CardanoWasm.Ed25519KeyHash.from_bytes(
                Buffer.from(rewardAddress.slice(2), "hex")
              )
            ),
            CardanoWasm.Ed25519KeyHash.from_bytes(
              Buffer.from(stakePoolId, "hex")
            )
          )
        )
      ).payment_key()
    );

    const addressHex = usedAddresses[0];
    const address = CardanoWasm.BaseAddress.from_address(
      CardanoWasm.Address.from_bytes(Buffer.from(addressHex, "hex"))
    )
      .to_address()
      .to_bech32();

    const utxos = await Wallet.getUtxos()

    const utxo = CardanoWasm.TransactionUnspentOutput.from_bytes(Buffer.from(utxos[0], 'hex'))

    txBuilder.add_input(
      CardanoWasm.SingleInputBuilder.new(
        utxo.input(), utxo.output()
      ).payment_key()
    )

    txBuilder.set_ttl(CardanoWasm.BigNum.from_str((latestBlock + 500).toString()
    ));

    const signedTxBuilder = txBuilder.build(0, CardanoWasm.Address.from_bech32(address));

    const transaction = CardanoWasm.Transaction.new(
      signedTxBuilder.body(),
      CardanoWasm.TransactionWitnessSet.new()
    );

    const witness = await Wallet.signTx(
      Buffer.from(transaction.to_bytes(), "hex").toString("hex"),
      false
    );
    const signedTx = CardanoWasm.Transaction.new(
      signedTxBuilder.body(),
      CardanoWasm.TransactionWitnessSet.from_bytes(Buffer.from(witness, "hex")),
      undefined
    );


    const txHash = await Wallet.submitTx(
      Buffer.from(signedTx.to_bytes()).toString("hex")
    );

    console.log(txHash);

    if (window.confirm(`Your Transaction Hash is: ${txHash}. \nIf you click "OK" a new tab will open to CardanoScan to see your transaction. (It may take several minutes to populate.) \nCancel will stay at this website.`)) {
      const prefix = network === "mainnet" ? "" : network === "preview" ? "preview." : "preprod.";
      var newTab = window.open(`https://${prefix}cardanoscan.io/transaction/${txHash}`, '_blank');
      newTab.location.href = `https://${prefix}cardanoscan.io/transaction/${txHash}`;
    };
    return ([txHash, address]);
  } catch (error) {
    switch (error.name) {
      case 'TypeError':
        alert('New tab was blocked from opening, look for pop-up blocked notification to see link.');
        break;
      default:
        if (!error.name) alert(`could not delegate due to: ${error.info}`)
        else {
          alert(`could not delegate due to: ${error}`)
        }
    }
  }
};

export async function getStakeActivity(stakeAddress: string, networkId: number) {
  const isStakeActive = await fetch(`https://api.dotare.io/getStakeInfo/${stakeAddress}/${networkId}`,
    {
      mode: 'cors',
      method: "get",
      headers: { 'Content-Type': 'application/json' }
    })
    .then((response) => { return response })
    .catch(() => { throw new Error("Address has no utxos.") })
  return isStakeActive.json()
}

export async function getFeeParams(network: string | number) {
  const feeParams = await fetch(`https://api.dotare.io/getFeeParams/${network}`,
    {
      mode: "cors",
      method: "get",
      headers: { "Content-Type": "application/json" },
    }
  );
  return feeParams.json();
}

export async function getLatestBlock(network: string | number) {
  const latestBlock = await fetch(`https://api.dotare.io/getLatestBlock/${network}`,
    {
      mode: "cors",
      method: "get",
      headers: { "Content-Type": "application/json" },
    }
  );
  return latestBlock.json();
}
