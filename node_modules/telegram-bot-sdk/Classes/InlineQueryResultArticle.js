"use strict"

class InlineQueryResultArticle {
    constructor(type, id, title, input_message_content) {
        this.type = type
        this.id = id
        this.title = title
        this.input_message_content = input_message_content
    }
}

module.exports = InlineQueryResultArticle