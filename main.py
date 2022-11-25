import telebot
from token_bot import token
bot=telebot.TeleBot(token)
@bot.message_handler(commands=['start'])
def start_message(message):
  bot.send_message(message.chat.id,"Привет")
bot.polling(none_stop=True)
