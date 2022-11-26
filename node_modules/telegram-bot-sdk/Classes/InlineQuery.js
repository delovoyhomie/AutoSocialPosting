"use strict"

class InlineQuery {
    constructor(id, from, location, query, offset) {
        this.id = id
        this.from = from
        this.location = location
        this.query = query
        this.offset = offset
    }
}

module.exports = InlineQuery