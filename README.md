#### A delegation method that uses cip30 to improve the quality of life for developers and delegators.
![](https://img.shields.io/badge/Preview-Up-brightgreen)
![](https://img.shields.io/badge/Pre--Production-Up-brightgreen)
![](https://img.shields.io/badge/Mainnet-Up-brightgreen)

![npm](https://img.shields.io/npm/dt/@dotare/cardano-delegation?style=for-the-badge)

![](https://github.com/dotareio/public/blob/main/cardano-delegation-demo.gif)
##### default will be mainnet: 1
###### install
```
npm i @dotare/cardano-delegation
```
###### add method 
##### New changes you will now be able to select network id in parameters (Preview: 0, Mainnet: 1, Pre-Prod: 2)
```
                                Pool ID Hash, WalletName, NetworkId: (Preview: 0, Mainnet: 1, Pre-Prod: 2)
delegationTx('5653f2a1aea5318f43a63e0148076348a475d3c89283a8c1eb498fb7', 'nami', 0)
```
###### react example
```
import React from 'react';
import { delegationTx } from '@dotare/cardano-delegation';
function App() {
    return (                                                                                                 //Browser console to find names
        <div>                                                 //Pool ID hash                            // window.cardano.*browser wallet name*
            <button onClick={() => { delegationTx('5653f2a1aea5318f43a63e0148076348a475d3c89283a8c1eb498fb7', 'nami', 0) }}>nami</button>
            <button onClick={() => { delegationTx('5653f2a1aea5318f43a63e0148076348a475d3c89283a8c1eb498fb7', 'eternl', 0) }}>eternl</button>
            <button onClick={() => { delegationTx('5653f2a1aea5318f43a63e0148076348a475d3c89283a8c1eb498fb7', 'yoroi', 0) }}>yoroi</button>
            <button onClick={() => { delegationTx('5653f2a1aea5318f43a63e0148076348a475d3c89283a8c1eb498fb7', 'typhoncip30', 0) }}>typhon</button>
            <button onClick={() => { delegationTx('5653f2a1aea5318f43a63e0148076348a475d3c89283a8c1eb498fb7', 'gerowallet', 0) }}>gerowallet</button>
            <button onClick={() => { delegationTx('5653f2a1aea5318f43a63e0148076348a475d3c89283a8c1eb498fb7', 'flint', 0) }}>flint</button>
        </div>
    );
}
export default App;
```

###### Webpack.config.js
```webpack.config.js
experiments: {
    asyncWebAssembly: true,
},
```
**If you don't have access to webpack.config due to framework library:**

How to load wasm into create-react-app:
https://stackoverflow.com/a/61722010

How to load wasm into Laravel with mix:
https://laravel-mix.com/docs/6.0/quick-webpack-configuration

---
**Ways to support:**

*Delegate:*
https://www.dotare.io/stake-pool/ (proof this package works on wordpress.)

<a href="https://wenlobster.io/"><img src="https://github.com/dotareio/public/blob/main/asset19skal0agalysqpgfx63gswkpzc3hs24h9g9pg0.png" width="50" alt="Royal Pool"></a> <a href="https://ccccoin.io/"><img src="https://github.com/dotareio/public/blob/main/asset1fy52surzfc4ezrxaynfqqrnk4uz3cha25vcelt.png" width="50" alt="CCCC Pool"></a> <a href="https://teddyswap.org/"><img src="https://teddyswap.org/assets/img/services/farming.png" width="50" alt="Teddy FISO Pool"></a> Earn more than just ADA

*Post Issues:*
https://github.com/dotareio/cardano-delegation/issues/new/choose

*Templates:* Question, Bug, Feature Request, Security Vuln

---
**References:**

*As seen on Dapp Central:* [YouTube Channel](https://youtu.be/LHUoFHwWfeM?t=877)

*Powered By:* <a href="https://www.dcspark.io/"><img src="https://github.com/dotareio/public/blob/main/dcspark.svg" width="100"></a> & <a href="https://blockfrost.io/"><img src="https://github.com/dotareio/public/blob/main/blockfrost.svg" width="110"></a>