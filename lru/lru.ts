import { map, switchMap, filter } from "rxjs/operators";
import { LruCacheFn, LruStore, Person } from "./types";


export const lru: LruCacheFn<Person> = function (func, bucketSize) {
  const store: LruStore<number, Person> = new Map();
  let uKey = 0;

  return (source) => {

    const has = (key: number): boolean => store.has(key);

    const remove = (key: number): boolean => store.delete(key);

    const getValue = (key: number): Person | undefined => store.get(key);

    const get = (key: number): Person | undefined => {
      if (!has(key)) {
        return undefined;
      } else {
        const value = getValue(key)!;
        remove(key);
        uKey += 1;
        store.set(uKey, value);
        return getValue(uKey);
      }
    };

    const set = (value: Person): number => {
      if (store.size >= bucketSize) {
        const lruKey = store.keys().next().value;
        remove(lruKey);
      }
      uKey += 1;
      store.set(uKey, value);

      return uKey;
    };

    return source.pipe(
      switchMap((data) =>
        func(data).pipe(
          filter((value) => !!value),
          map((value) => set(value)),
          map((value) => get(value))
        )
      )
    );

  };
};