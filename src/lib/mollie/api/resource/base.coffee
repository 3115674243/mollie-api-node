###
  Copyright (c) 2016, Mollie B.V.
  All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

  - Redistributions of source code must retain the above copyright notice,
    this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND ANY
  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  DISCLAIMED. IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
  LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
  OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
  DAMAGE.

  @license     Berkeley Software Distribution License (BSD-License 2) http://www.opensource.org/licenses/bsd-license.php
  @author      Mollie B.V. <info@mollie.nl>
  @copyright   Mollie B.V.
  @link        https://www.mollie.nl
###
Mollie = API: Resource: {}
List = require "../object/list"

module.exports = class Mollie.API.Resource.Base
  @resource = "unknown"
  @object = (->)

  constructor: (@api) ->

  copy: (body, object) ->
    for key of object
      if typeof object[key] != "function"
        object[key] = body[key]
    object

  create: (data, callback) ->
    @api.callRest "POST", @constructor.resource, null, data, (body) =>
      return callback body if body.error
      callback @copy(body, new @constructor.object)

  get: (id, callback) ->
    @api.callRest "GET", @constructor.resource, id, null, (body) =>
      return callback body if body.error
      callback @copy(body, new @constructor.object)

  update: (id, data, callback) ->
    @api.callRest "POST", @constructor.resource, id, data, (body) =>
      return callback body if body.error
      callback @copy(body, new @constructor.object)

  delete: (id, callback) ->
    @api.callRest "DELETE", @constructor.resource, id, null, (body) =>
      return callback body if body.error
      callback @copy(body, new @constructor.object)

  all: (callback) ->
    @api.callRest "GET", @constructor.resource, null, null, (body) =>
      return callback body if body.error

      list = new List
      list.totalCount = body.totalCount
      list.offset = body.offset
      list.links  = body.links

      for item of body.data
        list.push @copy(body.data[item], new @constructor.object)

      callback list

