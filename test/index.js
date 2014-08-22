
var tape = require('tape')
var group = require('../')


var data = [
  {foo: 'bar', value: 1},
  {foo: 'bar', value: 2},
  {foo: 'baz', value: 3},
  {foo: 'bar', value: 4},
  {foo: 'baz', value: 5},
  {foo: 'baz', value: 6}
]

tape('count, sum, groupBy', function (t) {

  var groups =
    data.reduce(
      group()
        .count(true)
        .sum('value')
        .groupBy('foo')
    )

  t.deepEqual(
    groups,
    {
      bar: {count: 3, value: 7},
      baz: {count: 3, value: 14}
    }
  )

  // Okay so we will probably also want
  // to time ranges...
  // or is the first thing to pipe through

  // of course this would fail if the stream isn't sorted by that field.

  t.end()
})

tape('count, sum, groupBy - with as', function (t) {

  var groups =
    data.reduce(
      group()
        .count(true, 'items')
        .sum('value', 'sum')
        .groupBy('foo')
    )

  t.deepEqual(
    groups,
    {
      bar: {items: 3, sum: 7},
      baz: {items: 3, sum: 14}
    }
  )

  // Okay so we will probably also want
  // to time ranges...
  // or is the first thing to pipe through

  // of course this would fail if the stream isn't sorted by that field.

  t.end()
})

