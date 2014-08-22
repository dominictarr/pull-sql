

//QueryStream('count(foo), sum(baz) group by blah')

function createReduce () {
  var rules = [], groups = {}, grouper = function (a) { return a }

  var first = true
  function reduce (a, b) {

    if(first && a != null) {
      first = false
      a = reduce(null, a)
    }

    if(!a) a = {}
    var group = grouper(a, b)
    if(group) {

      for(var i in rules)
        rules[i](group, b)

    }

//    console.log(group)
    return a
  }

  reduce.count = function (name, as) {
    if(name === true) {
      as = as || 'count'
      rules.push(function (a, b) {
        a[as] = (a[as] || 0) + 1
      })
    }
    else {
      as = as || name
      rules.push(function (a, b) {
        if(b[name])
          a[as] = (a[as] || 0) + 1
      })
    }

    return reduce
  }

  reduce.sum = function (name, as) {
    as = as || name
    rules.push(function (a, b) {
      if(b[name] && !isNaN(b[name]))
        a[as] = (a[as] || 0) + +b[name]
    })

    return reduce
  }

  reduce.groupBy = function (name) {
    grouper = function (a, b) {
      if(b[name]) {
        var gname = b[name]
        return a[gname] = (a[gname] || {})
      }
    }

    return reduce
  }

  return reduce

}

module.exports = createReduce

//example.
/*
var reduce =
  createReduce()
    .count('count')
    .sum('foo')
    .average('baz')
    .groupBy('blah')

*/
