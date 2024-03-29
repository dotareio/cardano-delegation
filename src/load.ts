class Loader {
  private _wasm: any;

  async load() {
    if (this._wasm) return;
    /**
     * @private
    */
    this._wasm = await import("@dcspark/cardano-multiplatform-lib-browser");
  }

  get Cardano() {
    return this._wasm;
  }
}

export default new Loader();