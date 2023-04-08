const { DateTime } = require("luxon");

let dt = DateTime.now();

let end = DateTime.fromISO("2023-04-08T09:44:00.537+08:00")
let start = DateTime.fromISO("2023-04-08T09:43:55.646+08:00")

console.log(end.diff(start,"seconds").toObject().seconds)