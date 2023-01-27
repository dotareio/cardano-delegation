import Loader from "./load";
import { WalletApi } from "./types/globals";
import { Buffer } from "buffer";
import { Certificates } from "@dcspark/cardano-multiplatform-lib-browser";

export async function Cardano() {
  await Loader.load();
  return Loader.Cardano;
}

export async function delegationTx(stakePoolId, walletName) {
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

  const certs: Certificates = CardanoWasm.Certificates.new()

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

  const poolKeyHash =
    "2a748e3885f6f73320ad16a8331247b81fe01b8d39f57eec9caa5091"; //BERRY
    certs.add(
      CardanoWasm.Certificate.new_stake_delegation(
        CardanoWasm.StakeDelegation.new(
          CardanoWasm.StakeCredential.from_keyhash(
            CardanoWasm.Ed25519KeyHash.from_address(
              Buffer.from(
                rewardAddress.slice(2),
                "hex"
              )
            )
          ),
          CardanoWasm.Ed25519KeyHash.from_bytes(Buffer.from(poolKeyHash, "hex"))
        )
      )
  );

  txBuilder.set_certs(certs);

  txBuilder.set_ttl(
    CardanoWasm.BigNum.from_str((723413 + 10000).toString())
  );

  const addressHex = Buffer.from(usedAddresses[0], "hex")
  const address = CardanoWasm.BaseAddress.from_address(
    CardanoWasm.Address.from_bytes(addressHex)
  )
    .to_address()
    .to_bech32()

  const utxos = await getUtxos(Wallet, CardanoWasm);

  const utxosCore = Loader.Cardano.TransactionUnspentOutputs.new();
  utxos.forEach((utxo) => utxosCore.add(utxo));

  txBuilder.add_inputs_from(
    utxosCore,
    Loader.Cardano.Address.from_bytes(addressHex)
  );

  txBuilder.add_change_if_needed(Loader.Cardano.Address.from_bytes(addressHex));

  const transaction = await txBuilder.construct();

  
  const txBody = txBuilder.build();
  const txHash = CardanoWasm.hash_transaction(txBody);
  
  console.log("usedAddresses: ", usedAddresses);
  console.log("hex: ", Buffer.from(usedAddresses[0], "hex"));
  console.log("bech32: ", address);
  
  console.log(txHash, transaction);

  return transaction;
};



async function getUtxos(Wallet, CardanoWasm) {

  const utxos = await Wallet.getUtxos();

  let Utxos = utxos.map(u => CardanoWasm.TransactionUnspentOutput.from_bytes(
    Buffer.from(
      u,
      'hex'
    )
  ))
  let UTXOS = []
  for (let utxo of Utxos) {
    let assets = _utxoToAssets(utxo)

    UTXOS.push({
      txHash: Buffer.from(
        utxo.input().transaction_id().to_bytes(),
        'hex'
      ).toString('hex'),
      txId: utxo.input().index(),
      amount: assets
    })
  }
  console.log(UTXOS);
  return UTXOS

}

function _utxoToAssets(utxo) {
  let value = utxo.output().amount()
  const assets = [];
  assets.push({
    unit: 'lovelace',
    quantity: value.coin().to_str()
  });
  if (value.multiasset()) {
    const multiAssets = value.multiasset().keys();
    for (let j = 0; j < multiAssets.len(); j++) {
      const policy = multiAssets.get(j);
      const policyAssets = value.multiasset().get(policy);
      const assetNames = policyAssets.keys();
      for (let k = 0; k < assetNames.len(); k++) {
        const policyAsset = assetNames.get(k);
        const quantity = policyAssets.get(policyAsset);
        const asset =
          Buffer.from(
            policy.to_bytes()
          ).toString('hex') + "." +
          Buffer.from(
            policyAsset.name()
          ).toString('ascii')


        assets.push({
          unit: asset,
          quantity: quantity.to_str(),
        });
      }
    }
  }
  return assets;
}
