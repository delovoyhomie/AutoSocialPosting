"use strict"

const unirest = require('unirest'),
    app = require('express')(),
    bodyParser = require('body-parser'),
    InlineQuery = require('./Classes/InlineQuery'),
    Message = require('./Classes/Message')

const API_BASE_URL = 'https://api.telegram.org/bot{token}/',
    API_GET_UPDATES = 'getUpdates?offset={offset}&timeout=60',
    API_POST_MESSAGE = 'sendMessage',
    API_POST_DOCUMENT = 'sendDocument',
    API_ANSWER_INLINE_QUERY = 'answerInlineQuery'

let _token = '',
    offset = 0,
    _commandCallbacks = null,
    _nonCommandCallback = null,
    _inlineQueryCallback = null

function getUpdates() {
    unirest.get(resolveApiUrl(API_GET_UPDATES, { token: _token, offset: offset })).end((response) => {
        if (response.status != 200) return getUpdates()

        let result = JSON.parse(response.raw_body).result
        if (result.length > 0) {
            for (let i in result) {
                if (result[i].message) processMessage(Object.assign(new Message, result[i].message, { chat_id: result[i].message.chat.id }))
                else if (result[i].inline_query && result[i].inline_query.query.length) _inlineQueryCallback(Object.assign(new InlineQuery, result[i].inline_query))
            }

            offset = parseInt(result[result.length - 1]['update_id']) + 1 // update max offset
        }
        getUpdates()
    })
}

function listen(port, ip4, path) {
    app.use(bodyParser.json())
    app.post('/' + path, function (req, res) {
        if (!req.body) return res.status(400).end()
        let result = req.body
        if (result.message) processMessage(Object.assign(new Message(), result.message, { chat_id: result.message.chat.id }))
        else if (result.inline_query && result.inline_query.query.length) _inlineQueryCallback(Object.assign(new InlineQuery, result.inline_query))
        return res.status(200).end()
    })

    app.listen(port || 3000, ip4 || '127.0.0.1', function () {
        console.log('Example app listening on port ' + port || 3000)
    })
}

function sendMessage(messageObject, callback) {
    unirest.post(resolveApiUrl(API_POST_MESSAGE, { token: _token })).send(messageObject).end(callback)
}

function sendFile(messageObject, callback) {
    const req = unirest.post(resolveApiUrl(API_POST_DOCUMENT, { token: _token }))
        .headers({ 'content-type': 'multipart/form-data' })

    Object.keys(messageObject)
        .filter(key => key !== 'document')
        .filter(key => !!messageObject[key])
        .forEach(key => req.field(key, messageObject[key]))

    req.attach('document', messageObject.document)
    req.end(callback)
}

function answerInlineQuery(id, results, callback) {
    unirest.post(resolveApiUrl(API_ANSWER_INLINE_QUERY, { token: _token })).send({ inline_query_id: id, results: JSON.stringify(results) }).end(callback)
}

function processMessage(message) {
    if (!message || !message.text) return
    let splitted = message.text.split(' ')
    if (splitted[0].indexOf("/") != 0) {
        // Non-command
        _nonCommandCallback(message)
    } else {
        // Command
        let command = splitted[0].substring(1, splitted[0].length)
        if (_commandCallbacks[command] == null) return false // not a valid command?
        _commandCallbacks[command](message, splitted.slice(1))
    }
    return true
}

function resolveApiUrl(urlRouteTemplate, values) {
    let url = API_BASE_URL + urlRouteTemplate
    Object.entries(values).forEach(e => {
        url = url.replace(`{${e[0]}}`, e[1])
    })
    return url
}

function getOffset() {
    return offset
}

function registerCustomRoute(method, path, handler) {
    if (!['get', 'post', 'put', 'delete', 'head', 'options'].includes(method.toLowerCase())) return
    app[method](path, handler)
}

module.exports = function (token, commandCallbacks, nonCommandCallback, inlineQueryCallback, initialOffset) {
    _token = token
    _commandCallbacks = commandCallbacks
    _nonCommandCallback = nonCommandCallback
    _inlineQueryCallback = inlineQueryCallback
    offset = initialOffset || 0

    return {
        getUpdates,
        listen,
        sendMessage,
        sendFile,
        answerInlineQuery,
        getOffset,
        registerCustomRoute,
        classes: {
            InlineKeyboardButton: require('./Classes/InlineKeyboardButton'),
            InlineKeyboard: require('./Classes/InlineKeyboard'),
            ReplyKeyboardMarkup: require('./Classes/ReplyKeyboardMarkup'),
            ReplyKeyboardHide: require('./Classes/ReplyKeyboardHide'),
            KeyboardButton: require('./Classes/KeyboardButton'),
            InputTextMessageContent: require('./Classes/InputTextMessageContent'),
            InlineQueryResultArticle: require('./Classes/InlineQueryResultArticle'),
            InlineQuery: InlineQuery,
            Message: Message,
        },
        setCommandCallbacks: function (commandCallbacks) {
            _commandCallbacks = commandCallbacks
        },
        setNonCommandCallback: function (nonCommandCallback) {
            _nonCommandCallback = nonCommandCallback
        },
        setInlineQueryCallback: function (inlineQueryCallback) {
            _inlineQueryCallback = inlineQueryCallback
        }
    }
}