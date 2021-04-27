import { Observable } from "rxjs";


type Person = {
  id: number;
  name: string;
};


type LruStore<K, T> = Map<K, T>;


interface Get<T> {
  (id: string): Observable<T>;
}


interface LruCacheFn<R> {
  (func: Get<R>, bucketSize: number): (
    source: Observable<string>
  ) => Observable<R | undefined>;
}


export { Person, LruStore, Get, LruCacheFn };
