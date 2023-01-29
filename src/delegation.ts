import Loader from "./load";
import { WalletApi } from "./types/globals";
import { Buffer } from "buffer";

export async function Cardano() {
  await Loader.load();
  return Loader.Cardano;
}

export async function delegationTx(stakePoolHash, walletName) {
  const CardanoWasm = await Cardano();
  const Wallet = await window.cardano[walletName].enable();
  
  const numerator = CardanoWasm.BigNum.zero();
  const denominator = CardanoWasm.BigNum.zero();
  const UnitIntervalZero = CardanoWasm.UnitInterval.new(numerator, denominator);
  let usedAddresses: string[];
  let rewardAddress: string;

  if (await window.cardano[walletName].isEnabled()) {
    try {

      usedAddresses = await Wallet.getUsedAddresses();
      rewardAddress = await Wallet.getRewardAddresses().then(x => x[0]);
    } catch (err) {
      console.error("broken at line 25", err)
      return
    }
  }

  const txBuilderConfig = CardanoWasm.TransactionBuilderConfigBuilder.new()
    .coins_per_utxo_byte(CardanoWasm.BigNum.from_str("4310"))
    .fee_algo(
      CardanoWasm.LinearFee.new(
        CardanoWasm.BigNum.from_str("44"),
        CardanoWasm.BigNum.from_str("155381")
      )
    )
    .key_deposit(CardanoWasm.BigNum.from_str("2000000"))
    .pool_deposit(CardanoWasm.BigNum.from_str("500000000"))
    .max_tx_size(16384)
    .max_value_size(5000)
    .ex_unit_prices(CardanoWasm.ExUnitPrices.new(UnitIntervalZero, UnitIntervalZero))
    .prefer_pure_change(true)
    .build();

  const txBuilder = CardanoWasm.TransactionBuilder.new(txBuilderConfig);

  const certs = CardanoWasm.Certificates.new()

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
console.log("line 65", certs);

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
    CardanoWasm.BigNum.from_str((723413 + 10000).toString())
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
console.log("Made it to line 102", address);

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

  console.log("usedAddresses: ", usedAddresses);
  console.log("hex: ", Buffer.from(usedAddresses[0], "hex"));
  console.log("bech32: ", address);
  

  const txHash = await Wallet.submitTx(
    Buffer.from(signedTx.to_bytes()).toString("hex")
  );

  console.log(txHash);

  return ([txHash, address]);
};