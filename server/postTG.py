import sys
import telebot
import json
from telebot import types
import mysql.connector
from mysql.connector import connect, Error


if __name__ == "__main__":
    try:
        mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="quickpost")    
    except Error as e:
        print(e)

    mycursor = mydb.cursor()
    args = sys.argv
    text = args[1]
    files_name = list(args[2].split(" "))
    settingsNum = args[4]
    userNum = args[3]

    mycursor.execute("SELECT * FROM users")
    
    settings  = json.loads(mycursor.fetchall()[int(userNum)][3])[(int(settingsNum)+1)]  # settings = json.load(f[int(userNum)]['accounts'])[(int(settingsNum)+1)]
    
    print('!', settingsNum)
    

    token = settings['token']
    chatID = settings['chat_id']

    tg = telebot.TeleBot(token)
    if files_name[0] == 'None':
        tg.send_message(chatID, text=args[1])
    else:
        media_group = []
        for num, file_name in enumerate(files_name):
            file = open(file_name, 'rb')
            if file_name.lower().endswith(('.png', '.jpg', '.jpeg', )):
                media_group.append(types.InputMediaPhoto(
                    media=file, caption=text if num == 0 else ''))
            elif file_name.lower().endswith(('.mp4', '.mov', '.ts', '.mkv', '.avi', '.wmv')):
                media_group.append(types.InputMediaVideo(
                    media=file, caption=text if num == 0 else ''))
            elif file_name.lower().endswith(('.gif', '.mpeg-4', '.ape', '.flac', '.mp3', '.ogg', '.m4a')):
                media_group.append(types.InputMediaAudio(
                    media=file, caption=text if num == 0 else ''))
            else:
                media_group.append(types.InputMediaDocument(
                    media=file, caption=text if num == 0 else ''))

        tg.send_media_group(chatID, media=media_group)
