import * as Cardano from "@dcspark/cardano-multiplatform-lib-nodejs";


export async function delegationTx(stakePoolId, walletName) {
  const numerator = Cardano.BigNum.zero();
  const denominator = Cardano.BigNum.zero();

  const UnitIntervalZero = Cardano.UnitInterval.new(numerator, denominator);

  this.Wallet = await window.cardano[walletName].enable();
  const usedAddresses = await this.Wallet.getUsedAddresses;
/*
  const txBuilderConfig = Cardano.TransactionBuilderConfigBuilder.new()
    .coins_per_utxo_byte(Cardano.BigNum.from_str("4310"))
    .fee_algo(
      Cardano.LinearFee.new(
        Cardano.BigNum.from_str("44"),
        Cardano.BigNum.from_str("155381")
      )
    )
    .key_deposit(Cardano.BigNum.from_str("2000000"))
    .pool_deposit(Cardano.BigNum.from_str("500000000"))
    .max_tx_size(16384)
    .max_value_size(5000)
    .ex_unit_prices(Cardano.ExUnitPrices.new(UnitIntervalZero, UnitIntervalZero))
    .collateral_percentage(150)
    .max_collateral_inputs(3)
    .build();

  const txBuilder = Cardano.TransactionBuilder.new(txBuilderConfig);

  Cardano.SingleCertificateBuilder.new(
    Cardano.Certificate.new_stake_registration(
      Cardano.StakeRegistration.new(
        Cardano.StakeCredential.from_keyhash(
          Cardano.Ed25519KeyHash.from_bytes(
            Buffer.from(
              "5c2c538662dc6739fc1fa1885008f7b1633d5451d9b25ca1371cf4d9",
              "hex"
            )
          )
        )
      )
    )
  );

  const poolKeyHash =
    "2a748e3885f6f73320ad16a8331247b81fe01b8d39f57eec9caa5091"; //BERRY
  Cardano.SingleCertificateBuilder.new(
    Cardano.Certificate.new_stake_delegation(
      Cardano.StakeDelegation.new(
        Cardano.StakeCredential.from_keyhash(
          Cardano.Ed25519KeyHash.from_bytes(
            Buffer.from(
              "5c2c538662dc6739fc1fa1885008f7b1633d5451d9b25ca1371cf4d9",
              "hex"
            )
          )
        ),
        Cardano.Ed25519KeyHash.from_bytes(Buffer.from(poolKeyHash, "hex"))
      )
    )
  );

  txBuilder.set_ttl(
    Cardano.BigNum.from_str((723413 + 10000).toString())
  );

  const utxos = getUtxos();

  const utxosCore = Cardano.TransactionUnspentOutputs.new();
  utxos.forEach((utxo) => utxosCore.add(utxo));

  //txBuilder.add_inputs_from(
  //  utxosCore,
  //  Cardano.Address.from_bech32(account.usedAddresses)
  //);


  const txBody = txBuilder.build();
  const txHash = Cardano.hash_transaction(txBody);
*/
  console.log("usedAddresses: ", usedAddresses);

};

const getUtxos = () => {

}

delegationTx('123', 'nami');
