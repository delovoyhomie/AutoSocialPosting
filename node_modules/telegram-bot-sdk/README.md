# telegram-bot-sdk
## ⚠️ Deprecation
This library is __deprecated__! We recommend to use  [telegraf/telegraf](https://github.com/telegraf/telegraf) instead.

## To do
* Implement HTTPS support for webhook mode
* Implement all **classes** from https://core.telegram.org/bots/api#available-types with their respective parameters as JavaScript classes (ES6 syntax)
* Implement all **methods** from https://core.telegram.org/bots/api#available-methods
* Make all methods (e.g. *getUpdates*) return **proper class objects** (e.g. *Message* or *InlineQueryResult*) instead of plain JSON objects

## Usage
### Initialization
```javascript
// Define functions helpCommand, otherCommand, nonCommandCallback and inlineQueryCallback here
const commands = {
    help: helpCommand,
    other: otherCommand
};

const bot = require('telegram-bot-sdk')('yourTokenHere', commands, nonCommandCallback, inlineQueryCallback);
```

Initializing the module takes 5 paramters (one optional).
* `token` - Your bot's token you received from the BotFather
* `commands` - An object of mapping commands (e.g. *help* for the */help* command) to functions
  * receives two arguments, namely the *message* object itself as well as an array of strings that were separated by a blank space in the message (e.g. `/command1 foo bar`) will result in `['foo', 'bar']` as second argument to the function that is defined for *command1*
* `nonCommandCallback` - A function to be invoked if the received message is neither a command (i.e. not starting with a slash) nor an InlineQuery
  * receives one argument, namely the *message* obejct
* `inlineQueryCallback` - A function to be invoked if the received message is an [InlineQuery](https://core.telegram.org/bots/api#inlinequery)
  * receives one argument, namely the *inline_query* obejct
* `initialOffset` - Optional. Specific offset (https://core.telegram.org/bots/api#getupdates) to receive messages for. Default is 0.

If a new message arrived at Telegram, either one of your command methods, the nonCommand method or the inlineQuery method will be invoked.

### Getting updates
You can either use _long-polling_ or _webhooks_ to get updates from the Telegram API. To get more details, please read the Telegram Bot API docs. _Webhook_ mode is the recommended way for production use. However, since it requires a secured HTTPS connection, you will need an SSL certificate as well as a constant IP or domain name for your bot's webserver. Unfortunately, SSL support is not implemented, yet (see _To Do_ section), so you will need a reverse proxy (like nginx or [Caddy](https://caddyserver.com)) between your bot and the internet, that handles encryption for you. 

__TL:DR:__ If you're experienced, webhook mode with a reverse proxy is the way to go. However, if that's too complicated, you can also use long-polling mode with way less effort.

```javascript
// Start listening or polling for updates (use only one of the following lines!)
bot.listen(3000, '127.0.0.1', 'your_bots_token') // Webhook-mode (recommended) (port, path)
bot.getUpdates(); // Polling-mode
```

### Sending a message
```javascript
var msg = new bot.classes.Message(originalMessage.chat.id, '*Hello Telegram*', 'Markdown');
bot.sendMessage(msg, (err, results) => {
    // do sth.
});
// originalMessage is a message you got as an update where you can extract the chat_id from and send an answer for it
```
The *Message* class' constructor takes the same arguments as stated in https://core.telegram.org/bots/api#sendmessage, while the last five are optional.

### Sending a keyboard
Also refer to https://core.telegram.org/bots/api#replykeyboardmarkup.
```javascript
var keyboard = new bot.classes.ReplyKeyboardMarkup(3, true, true, true);
keyboard.addButton(new bot.classes.KeyboardButton('Button First Row Left'));
keyboard.addButton(new bot.classes.KeyboardButton('Button First Row Center'));
keyboard.addButton(new bot.classes.KeyboardButton('Button First Row Right'));
keyboard.addButton(new bot.classes.KeyboardButton('Button Second Row Left'));
keyboard.addButton(new bot.classes.KeyboardButton('Button Second Row Center'));
keyboard.addButton(new bot.classes.KeyboardButton('Button Second Row Right'));

var msg = new bot.classes.Message({
  chat_id: originalMessage.chat.id,
  text: '*Hello Telegram*',
  parse_mode: 'Markdown',
  reply_markup: keyboard
});
bot.sendMessage(msg, (err, results) => {
    // do sth.
});
```
This will create a [keyboard](https://core.telegram.org/bots#keyboards) with six buttons over two rows (and therefore three columns).

### Answer an inline query
See https://core.telegram.org/bots/inline
**Note / Todo:** This method is not properly implemented, because instead of accepting an [InlineQueryResult](https://core.telegram.org/bots/api#inlinequeryresult) object it accepts the single parameters. We want to support every single type of inline query results.
```javascript
var answer = new bot.classes.InlineQueryResultArticle('1', 'Add a new item.', new bot.classes.InputTextMessageContent('Add *foo* to my collection', 'Markdown'));
bot.answerInlineQuery(query.id, [answer], (result) => {
    // do sth.
});
// query is an inline_query you got as an update where you can extract the id from and send results for it
```

## Contribute
Well, yes, we're just at the end. There are no more methods, yet. So again, **please help me finish this library**, since I don't have enough time to do it alone and make this the first and only Node.js library for Telegram bots (see https://core.telegram.org/bots/samples) :-)
