import Loader from "./load";
import { WalletApi } from "./types/globals";
import { Buffer } from "buffer";

export async function Cardano() {
  await Loader.load();
  return Loader.Cardano;
};

export async function delegationTx(stakePoolId, walletName) {

  const CardanoWasm = await Cardano();

  const numerator = CardanoWasm.BigNum.zero();
  const denominator = CardanoWasm.BigNum.zero();

  const UnitIntervalZero = CardanoWasm.UnitInterval.new(numerator, denominator);


  const Wallet = await window.cardano[walletName].enable();
  let usedAddresses: string[]

  if (await window.cardano[walletName].isEnabled()) {
    usedAddresses = await Wallet.getUsedAddresses();
  } else {
    console.error("unable to run getUsedAddresses")
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
    .collateral_percentage(150)
    .max_collateral_inputs(3)
    .build();

  const txBuilder = CardanoWasm.TransactionBuilder.new(txBuilderConfig);

  CardanoWasm.SingleCertificateBuilder.new(
    CardanoWasm.Certificate.new_stake_registration(
      CardanoWasm.StakeRegistration.new(
        CardanoWasm.StakeCredential.from_keyhash(
          CardanoWasm.Ed25519KeyHash.from_bytes(
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
  CardanoWasm.SingleCertificateBuilder.new(
    CardanoWasm.Certificate.new_stake_delegation(
      CardanoWasm.StakeDelegation.new(
        CardanoWasm.StakeCredential.from_keyhash(
          CardanoWasm.Ed25519KeyHash.from_bytes(
            Buffer.from(
              "5c2c538662dc6739fc1fa1885008f7b1633d5451d9b25ca1371cf4d9",
              "hex"
            )
          )
        ),
        CardanoWasm.Ed25519KeyHash.from_bytes(Buffer.from(poolKeyHash, "hex"))
      )
    )
  );

  txBuilder.set_ttl(
    CardanoWasm.BigNum.from_str((723413 + 10000).toString())
  );

  // const utxos = getUtxos();

  // const utxosCore = CardanoWasm.TransactionUnspentOutputs.new();
  // utxos.forEach((utxo) => utxosCore.add(utxo));
  const addressHex = Buffer.from(usedAddresses[0], "hex")
  const address = CardanoWasm.BaseAddress.from_address(
    CardanoWasm.Address.from_bytes(addressHex)
  )
    .to_address()
    .to_bech32()

  txBuilder.add_inputs_from(
  //  utxosCore,
   CardanoWasm.Address.from_bech32(address)
  );


  const txBody = txBuilder.build();
  const txHash = CardanoWasm.hash_transaction(txBody);

  console.log("usedAddresses: ", usedAddresses);
  console.log("hex: ", Buffer.from(usedAddresses[1], "hex"));
  console.log("bech32: ", address);
  
  console.log(UnitIntervalZero);

  console.log(txHash);
};
