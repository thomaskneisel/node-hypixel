import type { RateLimitData } from "..";
import type { Components } from "../types/api";

/**
 * Generic intersection type for result arrays to include metadata as a non-enumerable property.
 * @example
 * ```typescript
 * const result = await client.skyblock.news();
 * console.log(result);
 * // (7) [{…}, {…}, {…}, {…}, {…}, {…}, {…}]
 * console.log(result.meta)
 * // {success: true}
 * ```
 */
export type ResultArray<
  T extends Components.Schemas.ApiSuccess,
  K extends keyof T
> = T[K] & {
  meta: Omit<T, K> & {
    ratelimit: RateLimitData;
  };
};

/** @hidden */
export function getResultArray<
  T extends Components.Schemas.ApiSuccess,
  K extends keyof T
>(response: T, key: K): ResultArray<T, K> {
  if (!(key in response)) {
    throw new TypeError(`Key "${key}" was not in the response.`);
  }
  const items = response[key];
  const { ratelimit } = (response as never) as { ratelimit: RateLimitData };
  if (!Array.isArray(items)) {
    throw new TypeError(`Key "${key}" is not an array.`);
  }
  delete response[key];
  const arr = ([...items] as never) as ResultArray<T, K>;
  Object.defineProperty(arr, "meta", {
    enumerable: false,
    value: { ...response, ratelimit },
  });
  return arr;
}
