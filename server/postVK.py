import vk_api
import requests
import json
from sys import argv
import mysql.connector
from mysql.connector import connect, Error

token = None
group_id = None

def upload(name):
    try:
        url = vk.photos.getWallUploadServer(group_id=group_id)['upload_url']
        files = {'file': open(f'{name}', 'rb')}
        req = requests.post(url, files=files).json()

        return req
    except Error as e:
        print(e)

def save(name):
    try:
        req = upload(name)
        server, photo, hash = req.values()
        save_wall_photo = vk.photos.saveWallPhoto(group_id=group_id,
                                                photo=photo,
                                                server=server,
                                                hash=hash)
        return save_wall_photo
    except Error as e:
        print(e)


def get_saved_photo(name):
    try:
        save_wall_photo = save(name)
        owner_id = str(save_wall_photo[0]['owner_id'])
        id = str(save_wall_photo[0]['id'])
        saved_photo = f'photo{owner_id}_{id}'
        # print(saved_photo)

        return saved_photo
    except Error as e:
        print(e)


def post_with_files(text, files):
    try:
        saved_photo = ''
        for name in files:
            saved_photo += get_saved_photo(name) + ','
        saved_photo = saved_photo[:-1]
        # print(saved_photo)
        vk.wall.post(owner_id=f'-{group_id}',
                    attachments=saved_photo, message=text)
    except Error as e:
        print(e)


def post_text(text):
    try:
        vk.wall.post(owner_id=f'-{group_id}', message=text)
    except Error as e:
        print(e)


if __name__ == "__main__":
    try:
        mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="quickpost")    
    except Error as e:
        print(e)

    try:
        mycursor = mydb.cursor()
        text = argv[1]
        files = list(argv[2].split())
        userNum = argv[3]
        settingsNum = argv[4]
        mycursor.execute("SELECT * FROM users")
        settings = json.loads(mycursor.fetchall()[int(userNum)][3])[(int(settingsNum)+1)]
        token = settings['token']
        group_id = settings['group_id']

        vk_session = vk_api.VkApi(token=token)
        vk = vk_session.get_api()
        

        if files[0] == 'None':
            post_text(text)
        else:
            post_with_files(text, files)
    except Error as e:
        print(e)