# pull-sql

restrict sql-like* queries with pull-streams.
(* `select, where, sum, count, avg, group`, but not `join`)

# examples

`SELECT foo, bar, baz FROM _input_ WHERE foo > 10 ORDER BY bar`

``` js
var pull = require('pull-stream')
var sql  = require('pull-sql')

pull(
  //some input that is a stream of js objects.
  _input_,
  sql()
    .select(['foo', 'bar', 'baz'])
    .where(function (row) { return row.foo > 10 })
    .order('bar'),
  //some output.
  pull.collect(function (err, ary) {
    console.log(ary)
  })
)
```

`SELECT count(*) as rows sum('bar') FROM _input_ GROUP BY foo`

note that there is no select call, this not required when using a group.

``` js
var pull = require('pull-stream')
var sql  = require('pull-sql')

pull(
  //some input that is a stream of js objects.
  _input_,
  sql()
    .count('number')
    .sum('bar')
    .group('foo'),
  //some output.
  pull.collect(function (err, ary) {
    console.log(ary)
  })
)
```

## License

MIT
