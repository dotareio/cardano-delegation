export const loadWasm = async () => {
    const Wasm = await import('@dcspark/cardano-multiplatform-lib-browser')
    return Wasm;
}