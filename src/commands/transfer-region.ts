import { MySystem } from "../system";
import { db, CHOWN_GUARD } from "../database";
import { isPlayerInfo } from "../utils";

export function register(self: MySystem) {
  self.registerCommand("transfer-region", {
    description: "Transfer the ownership of Region",
    permission: 1,
    overloads: [
      {
        parameters: [
          {
            name: "name",
            type: "soft-enum",
            enum: "RegionName"
          },
          {
            name: "target",
            type: "player-selector"
          }
        ],
        handler(origin, [$name, target]) {
          if (target.length != 1) throw "check the selector!";
          const info = this.actorInfo(target[0]);
          if (!isPlayerInfo(info)) throw "unexpected error"
          const $owner = info.uuid;
          db.update(CHOWN_GUARD, { $name, $owner });
          return `transfered`;
        }
      } as CommandOverload<MySystem, ["soft-enum", "player-selector"]>
    ]
  });
}
