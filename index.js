
var pull = require('pull-stream')

var util = require('./util')
var groupBy = require('./group')

module.exports = function () {
  var streams = [], piped = false, reducer

  function query (read) {
    if(piped) throw new Error('query-stream has already been read')
    piped = true
    return pull.apply(null, [read].concat(streams))
  }

  query.push = function (stream) {
    streams.push(stream)
    return query
  }

  function add(fun, map) {
    return function (opts) {
      if(reducer) {
        reducer = null
      }
      return query.push(map(fun(opts)))
    }
    return query
  }

  function group(name, flatten) {
    return function () {
      var args = [].slice.call(arguments)
      if(!reducer) {
        reducer = groupBy()
        query.push(pull.reduce(reducer))
        if(flatten)
          query.push(pull.flatten())
      }
      reducer[name].apply(reducer, args)
      return query
    }
  }

  query.map    = query.select = add(util.map, pull.map)
  query.where  = query.filter = add(util.filter, pull.filter)
  query.group  = group('groupBy', true)
  query.count  = group('count')
  query.sum    = group('sum')
  query.avg    = group('avg')
  query.sort   = query.order = add(util.compare, util.sort)
  return query
}

