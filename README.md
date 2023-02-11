![](https://img.shields.io/badge/Preview-Up-brightgreen)
![](https://img.shields.io/badge/Pre--Production-Up-brightgreen)
![](https://img.shields.io/badge/Mainnet-Up-brightgreen)

![](https://github.com/dotareio/public/blob/main/cardano-delegation-demo.gif)
##### New changes you will now be able to select network id in parameters
```
                                Pool ID Hash,                         WalletName, NetworkId: 0 = Preview, 1 = Mainnet, 2 = Pre-Prod
delegationTx('5653f2a1aea5318f43a63e0148076348a475d3c89283a8c1eb498fb7', 'nami', 0)
```
#####default will be mainnet: 1
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
Ways to support:
<div style="background-color:#4682B4">
 <img src="https://fiso.teddyswap.org/teddy-logo.svg">
</div>

https://fiso.teddyswap.org Ticker DOTAR
<br />
https://github.com/dotareio/cardano-delegation/issues/new/choose