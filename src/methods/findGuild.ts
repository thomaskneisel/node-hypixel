import type { Components } from "../types/api";
import { Method } from "../util/Method";
import { returnResponseObject } from "../util/ReturnResponseObject";

export class FindGuild extends Method {
  async byName(name: string): Promise<boolean> {
    return returnResponseObject(
      await this.client.call<Components.Schemas.ApiSuccess>("findGuild", {
        byName: name,
      }),
      "success"
    );
  }

  async byUuid(uuid: string): Promise<boolean> {
    return returnResponseObject(
      await this.client.call<Components.Schemas.ApiSuccess>("findGuild", {
        byUuid: uuid,
      }),
      "success"
    );
  }
}