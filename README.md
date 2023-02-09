![](https://img.shields.io/badge/Preview-Up-brightgreen)
![](https://img.shields.io/badge/Pre--Production-Up-brightgreen)
![](https://img.shields.io/badge/Mainnet-Up-brightgreen)

![](https://github.com/dotareio/public/blob/main/cardano-delegation-demo.gif)

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
            <button onClick={() => { delegationTx('5653f2a1aea5318f43a63e0148076348a475d3c89283a8c1eb498fb7', 'nami') }}>nami</button>
            <button onClick={() => { delegationTx('5653f2a1aea5318f43a63e0148076348a475d3c89283a8c1eb498fb7', 'eternl') }}>eternl</button>
            <button onClick={() => { delegationTx('5653f2a1aea5318f43a63e0148076348a475d3c89283a8c1eb498fb7', 'yoroi') }}>yoroi</button>
            <button onClick={() => { delegationTx('5653f2a1aea5318f43a63e0148076348a475d3c89283a8c1eb498fb7', 'typhoncip30') }}>typhon</button>
            <button onClick={() => { delegationTx('5653f2a1aea5318f43a63e0148076348a475d3c89283a8c1eb498fb7', 'gerowallet') }}>gerowallet</button>
            <button onClick={() => { delegationTx('5653f2a1aea5318f43a63e0148076348a475d3c89283a8c1eb498fb7', 'flint') }}>flint</button>
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
**If you don't have access due to framework library:**

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

Dotare cardano-delegation