var through = require('pull-through')

var isArray = Array.isArray

function isFunction (f) {
  return 'function' === typeof f
}

function isObject (o) {
  return o && 'object' === typeof o
}

function isString (s) {
  return 'string' === typeof s
}

function isPrimitive (p) {
  return !isObject(p)
}

function has(obj, prop) {
  return Object.hasOwnProperty.call(obj, prop)
}

exports.map = function map (map) {
  console.log(map)
  if(isFunction(map)) return map
  if(isArray(map)) {
      return function (data) {
        var obj = {}
        for(var i in map) {
          if(has(data, map[i]))
            obj[map[i]] = data[map[i]]
        }
        return obj
      }
    }
  if(isObject(map)) {
    return function (data) {
      var obj = {}
      for(var k in map) {
        if(has(data, map[k]))
          obj[map[k]] = data[k]
      }
      return obj
    }
  }
  if(isString(map)) {
    return function (data) {
      return data[map]
    }
  }
}

exports.filter = function (filter) {
  if(isFunction(filter)) return filter

  if(isArray(filter))
    return function (data) {
      for(var i in filter)
        if(!has(data, filter[i]))
          return false
      return true
    }

  if(isObject(filter))
    return function (data) {
      for(var k in filter) {
        if(isPrimitive(filter[k]))
          return data[k] === filter[k]
        if(isRegExp(filter[k]))
          return filter[k].test(data[k])
        if(!exports.filter(filter[k])(data[k]))
          return false
      }
      return true
    }

  if(isString(filter))
    return function (data) {
      return has(data, filter)
    }

  return Boolean
}

exports.comparator = function (a, b) {
  return a < b ? -1 : a > b ? 1 : 0
}

exports.compare = function (s) {
  var id = function (e) { return e }

  if('function' === typeof s)
    id = s

  else if('string' == typeof s)
    id = function (d) { return d[s] }

  return function (a, b) { return exports.comparator(id(a), id(b)) }
}

exports.sort = function (compare) {
  var a = []
  return through(function (d) {
    a.push(d)
  }, function () {
    a.sort(compare || exports.compare)
    while(a.length)
      this.queue(a.shift())
    this.queue(null)
  })
}
