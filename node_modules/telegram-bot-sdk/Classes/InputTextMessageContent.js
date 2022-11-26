"use strict"

class InputTextMessageContent {
    constructor(message_text, parse_mode, disable_web_page_preview) {
        this.message_text = message_text
        this.parse_mode = parse_mode
        this.disable_web_page_preview = disable_web_page_preview
    }
}

module.exports = InputTextMessageContent