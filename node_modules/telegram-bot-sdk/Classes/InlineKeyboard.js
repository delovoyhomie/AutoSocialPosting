"use strict"

class InlineKeyboard {
    constructor(columns) {
        this.columns = columns
        this.inline_keyboard = [[]]
    }

    addButton(button) {
        if (this.inline_keyboard[this.inline_keyboard.length - 1].length < this.columns) this.inline_keyboard[this.inline_keyboard.length - 1].push(button)
        else this.inline_keyboard.push([button])
    }
}

module.exports = InlineKeyboard