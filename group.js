#! /usr/bin/env node

//QueryStream('count(foo), sum(baz) group by blah')

function isFunction (f) {
  return 'function' === typeof f
}

function isString (s) {
  return 'string' === typeof s
}

function createReduce () {
  var rules = [], groups = {}
  var grouper = function (a) { return a }
  var first = true

  function reduce (a, b) {

    if(first && a != null) {
      first = false
      a = reduce(null, a)
    }

    if(!a) a = {}

    reduce.seen ++
    var group = grouper(a, b)
    if(group) {
      if(rules.length) {
        for(var i in rules)
          rules[i](group, b)
      }
    }
    return a
  }

  reduce.seen = 0

  reduce.count = function (name, as) {
    if(!isString(name)) {
      as = as || 'count'
      rules.push(function (a, b) {
        a[as] = (a[as] || 0) + 1
      })
    }
    else {
      as = as || name
      rules.push(function (a, b) {
        if(b[name]) {
          a[as] = (a[as] || 0) + 1
        }
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

  reduce.groupBy = function (name, as) {
    as = as || name
    grouper = function (a, b) {
      if(b[name]) {
        var gname = b[name]
        if(!a[gname]) {
          a[gname] = {}
          a[gname][as] = gname
        }
        return a[gname]
      }
    }

    return reduce
  }
//
//  reduce.where = function (match, value) {
//    if(isFunction(match))
//      where = match
//    else if (isString(match))
//      where = function (a) {
//        return a[match] === value
//      }
//    else
//      where = function (a) {
//        for(var k in match) {
//          if(isFunction(match[k])) {
//            if(!match[k](a[k])) return false
//          }
//          else if(match[k] !== a[k])
//            return false
//        }
//        return true
//      }
//
//    return reduce
//  }
//
  return reduce

}

module.exports = createReduce

