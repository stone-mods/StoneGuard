import { MySystem } from "../system";
import { db, SELECT_GUARD } from "../database";
import { isPlayerInfo } from "../utils";

type GuardInfo = { name: string; owner: string; desc: string };

function showBlock(self: MySystem, player: IEntity, info: GuardInfo) {
  self
    .openModalForm(
      player,
      JSON.stringify({
        type: "modal",
        title: "Region: " + info.name,
        content: info.desc,
        button1: "OK",
        button2: "Sorry"
      })
    )
    .catch(() => {});
}

function target_detect(
  self: MySystem,
  player: IEntity,
  target: IEntity
): GuardInfo | false {
  const info = self.actorInfo(player);
  const target_info = self.actorInfo(target);
  if (!isPlayerInfo(info) || info.permission > 0) return false;
  const ret = db.query(SELECT_GUARD, {
    $x: target_info.pos[0],
    $z: target_info.pos[2],
    $dim: info.dim
  });
  const filtered = Array.from(ret).filter(({ owner }) => owner != info.uuid);
  return filtered.length ? (filtered[0] as GuardInfo) : false;
}

function pos_detect(
  self: MySystem,
  player: IEntity,
  [$x, y, $z]: [number, number, number]
): GuardInfo | false {
  const info = self.actorInfo(player);
  if (!isPlayerInfo(info) || info.permission > 0) return false;
  const ret = db.query(SELECT_GUARD, { $x, $z, $dim: info.dim });
  const filtered = Array.from(ret).filter(({ owner }) => owner != info.uuid);
  return filtered.length ? (filtered[0] as GuardInfo) : false;
}

export function register(self: MySystem) {
  self.checkAttack((player, { target }) => {
    const info = target_detect(self, player, target);
    if (info) {
      showBlock(self, player, info);
      return false;
    }
  });
  self.checkInteract((player, { blockpos }) => {
    const info = pos_detect(self, player, blockpos);
    if (info) {
      showBlock(self, player, info);
      return false;
    }
  });
  self.checkUseOn((player, { blockpos }) => {
    const info = pos_detect(self, player, blockpos);
    if (info) {
      showBlock(self, player, info);
      return false;
    }
  });
  self.checkDestroy((player, { blockpos }) => {
    const info = pos_detect(self, player, blockpos);
    if (info) {
      showBlock(self, player, info);
      return false;
    }
  });
  self.checkUseBlock((player, { blockpos }) => {
    const info = pos_detect(self, player, blockpos);
    if (info) {
      showBlock(self, player, info);
      return false;
    }
  });
}
