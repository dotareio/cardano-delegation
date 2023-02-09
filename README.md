![](https://img.shields.io/badge/Preview-Up-brightgreen)
![](https://img.shields.io/badge/Pre--Production-Up-brightgreen)
![](https://img.shields.io/badge/Mainnet-Up-brightgreen)
Please update to newest verison [![npm version](https://badge.fury.io/js/@dotare%2Fcardano-delegation.svg)](https://badge.fury.io/js/@dotare%2Fcardano-delegation)
![](https://github.com/dotareio/public/blob/main/cardano-delegation-demo.gif)

```
import React from 'react';
import { delegationTx } from '@dotare/cardano-delegation';
function App() {
    return (
        <div>                                                 //Pool ID hash                            // window.cardano.*wallet name*
            <button onClick={() => { delegationTx('5653f2a1aea5318f43a63e0148076348a475d3c89283a8c1eb498fb7', 'nami') }}>nami</button>
            <button onClick={() => { delegationTx('5653f2a1aea5318f43a63e0148076348a475d3c89283a8c1eb498fb7', 'yoroi') }}>yoroi</button>
            <button onClick={() => { delegationTx('5653f2a1aea5318f43a63e0148076348a475d3c89283a8c1eb498fb7', 'typhoncip30') }}>typhon</button>
            <button onClick={() => { delegationTx('5653f2a1aea5318f43a63e0148076348a475d3c89283a8c1eb498fb7', 'gerowallet') }}>gerowallet</button>
            <button onClick={() => { delegationTx('5653f2a1aea5318f43a63e0148076348a475d3c89283a8c1eb498fb7', 'eternl') }}>eternl</button>
        </div>
    );
}
export default App;
```

######Webpack.config.js
```webpack.config.js
experiments: {
    asyncWebAssembly: true,
},
```
**If you don't have access due to framework library:**
How to load wasm into create-react-app:
https://stackoverflow.com/a/61722010

---
Ways to support:
<div style="background-color:#4682B4">
 <img src="https://fiso.teddyswap.org/teddy-logo.svg">
</div>

https://fiso.teddyswap.org/ Ticker DOTAR
<br />