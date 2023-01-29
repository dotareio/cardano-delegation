class Loader {
  private _wasm: any;
  async load() {
    if (this._wasm) return;
    /**
     * @private
     */
    // eslint-disable-next-line
    this._wasm = await import("@emurgo/cardano-serialization-lib-browser");
  }

  get Cardano() {
    return this._wasm;
  }
}

export default new Loader();