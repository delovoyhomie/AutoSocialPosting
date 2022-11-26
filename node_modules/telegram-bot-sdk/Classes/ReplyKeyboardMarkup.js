"use strict"

class ReplyKeyboardMarkup {
    constructor(columns, resize_keyboard, one_time_keyboard, selective) {
        this.columns = columns
        this.keyboard = [[]]
        this.resize_keybaord = resize_keyboard || undefined
        this.one_time_keyboard = one_time_keyboard || undefined
        this.selective = selective || undefined
    }

    addButton(button) {
        if (this.keyboard[this.keyboard.length - 1].length < this.columns) this.keyboard[this.keyboard.length - 1].push(button)
        else this.keyboard.push([button])
    }
}

module.exports = ReplyKeyboardMarkup