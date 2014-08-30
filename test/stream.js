


var pull = require('pull-stream')

var tape = require('tape')

var sql = require('../')

function foobarbaz (query, cb) {
  tape('foobarbaz', function (t) {
    pull(
      pull.values([
        {foo: 1, bar: 'a', baz: true},
        {foo: 2, bar: 'b', baz: false},
        {foo: 3, bar: 'a', baz: true},
        {foo: 4, bar: 'a', baz: false},
        {foo: 5, bar: 'b', baz: true}
      ]),
      query,
      pull.collect(cb.bind(t))
    )
  })
}

foobarbaz(
  sql()
    .select(['foo', 'bar'])
    .group('bar')
    .sum('foo')
    .order('bar')
  ,
  function (err, ary) {
    if(err) throw err
    console.log('cb', ary)
    this.deepEqual(ary, [
      {foo: 7, bar: 'a'},
      {foo: 7, bar: 'b'}
    ])
    this.end()
  }
)

foobarbaz(
  sql().sum('foo'),
  function (err, ary) {
    console.log(ary)
    this.deepEqual([{foo: 15}], ary)
    this.end()
  }
)

