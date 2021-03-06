import { system, MySystem } from "./system";

declare function resolve(
  name: string
): { register(input: MySystem): void };

system.initialize = function() {
  this.registerRegionNames();
  resolve("commands/query-region").register(this);
  resolve("commands/create-region").register(this);
  resolve("commands/transfer-region").register(this);
  resolve("commands/alter-region").register(this);
  resolve("actions/check-ability").register(this);
};
