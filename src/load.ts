class Loader {
  private _wasm: any;

  async load() {
    if (this._wasm) return;
    /**
     * @private
    */
    const CSL = "@emurgo/cardano-serialization-lib-browser"; 
    this._wasm = await import(CSL);
  }

  get Cardano() {
    return this._wasm;
  }
}

export default new Loader();