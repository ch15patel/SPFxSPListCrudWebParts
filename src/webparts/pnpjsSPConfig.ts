/*
  Below code works for both WebParts and Extensions as well including React components
  
  **npm dependencies**

  npm install @pnp/sp --save
  npm install @pnp/logging --save

*/

// import pnp and pnp logging system
import { spfi, SPFI, SPFx, ISPFXContext } from "@pnp/sp";
import { LogLevel, PnPLogging } from "@pnp/logging";

// imports for modules you want to use, comment out those you are not going to use
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/batching";
//import "@pnp/graph/users";

let _sp: SPFI;

export const getSP = (context: ISPFXContext): SPFI => {
  // old line 1 :: if (context !== null) { was erroring out, so solution is --> // new line:: if (!!context) { OR if (context !== undefined) {
  if (context !== null) {
    //You must add the @pnp/logging package to include the PnPLogging behavior it is no longer a peer dependency
    // The LogLevel set's at what level a message will be written to the console
    _sp = spfi().using(SPFx(context)).using(PnPLogging(LogLevel.Warning));
  }
  return _sp;
};
