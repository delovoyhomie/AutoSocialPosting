"use strict"

class InlineKeyboardButton {
    constructor(text, url, callback_data, switch_inline_query) {
        this.text = text
        this.url = url
        this.callback_data = callback_data
        this.switch_inline_query = switch_inline_query
    }
}

module.exports = InlineKeyboardButton