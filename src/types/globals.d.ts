declare global {
  interface Window {
    // profitwell(action: "start", { ["user_email"]: string })
    cardano: {
        getBalance: () => Promise<{}>
    }
  }
}

export {}