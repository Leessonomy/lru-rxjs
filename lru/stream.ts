import { BehaviorSubject, Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { lru } from "./lru";
import { Person } from "./types";


const subject = new BehaviorSubject<Record<string, Person>>({
  "1": {
    id: 1,
    name: "John",
  },
  "2": {
    id: 2,
    name: "Johannes",
  },
  "3": {
    id: 3,
    name: "Alexander",
  },
  "4": {
    id: 4,
    name: "Robert",
  },
});


function get(id: string): Observable<Person> {
  return subject.pipe(map((x) => x[id]));
}


of("1", "1", "2", "2", "3", "5")
  .pipe(lru(get, 3))
  .subscribe((el) => console.log(el, "from cache"));
