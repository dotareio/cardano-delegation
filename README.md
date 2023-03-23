#### A delegation method that uses cip30 to improve the quality of life for developers and delegators.
![](https://img.shields.io/badge/Preview-Up-brightgreen)
![](https://img.shields.io/badge/Pre--Production-Up-brightgreen)
![](https://img.shields.io/badge/Mainnet-Up-brightgreen)

![](https://github.com/dotareio/public/blob/main/cardano-delegation-demo.gif)
##### New changes you will now be able to select network id in parameters (Preview: 0, Mainnet: 1, Pre-Prod: 2)
```
                                Pool ID Hash, WalletName, NetworkId: (Preview: 0, Mainnet: 1, Pre-Prod: 2)
delegationTx('5653f2a1aea5318f43a63e0148076348a475d3c89283a8c1eb498fb7', 'nami', 0)
```
##### default will be mainnet: 1
###### install
```
npm i @dotare/cardano-delegation
```
###### add method 
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
Earn more than ADA
<img src="https://github.com/dotareio/public/blob/main/asset19skal0agalysqpgfx63gswkpzc3hs24h9g9pg0.png" width="50" alt="Royal Pool"> <img src="https://github.com/dotareio/public/blob/main/asset1fy52surzfc4ezrxaynfqqrnk4uz3cha25vcelt.png" width="50" alt="CCCC Pool"> <img src="https://teddyswap.org/assets/img/services/farming.png" width="50" alt="Teddy FISO Pool"> 
*Post Issues:*
https://github.com/dotareio/cardano-delegation/issues/new/choose 
*Templates:* Bug, Feature Request, Security Vuln