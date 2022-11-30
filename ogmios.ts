import { createInteractionContext, InteractionContext } from '@cardano-ogmios/client'

const context : InteractionContext = await createInteractionContext(
  err => console.error(err),
  () => console.log("Connection closed."),
  { connection: { port: 1337 } }
)
