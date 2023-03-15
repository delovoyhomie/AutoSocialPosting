import requests
import json
from hashlib import md5
import urllib.parse as up
from sys import argv
import mysql.connector
from mysql.connector import connect, Error

try:
    mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="quickpost")    
except Error as e:
    print(e)

mycursor = mydb.cursor()

mycursor.execute("SELECT * FROM users")

class Ok_api:
    def __init__(self, args):
        self.url = 'https://api.ok.ru/fb.do'
        self.keys = args

    def get_sig(self, params):
        try:
            ssk = self.keys['session_secret_key']
            sig = md5((''.join(params)+ssk).encode()).hexdigest()
            return sig
        except Error as e:
            print(e)

    def getUploadUrl(self, gid):
        try:
            params = ['&method=photosV2.getUploadUrl',
                    f'&application_key={self.keys["application_key"]}',
                    '&format=json',
                    f'&gid={gid}']
            params.sort()
            params[0] = '?' + params[0][1:]
            sig = self.get_sig(params)
            req = requests.get(self.url
                            + ''.join(params)
                            + f'&sig={sig}'
                            + f'&access_token={self.keys["access_token"]}')
            return req.json()
        except Error as e:
            print(e)

    def post(self, gid, text, files):
        try:
            media = []
            if text != '':
                media.append({"type": "text", "text": text})
            if files[0] != 'None':
                list = []
                for name in files:
                    req = self.getUploadUrl(gid)
                    print(req)
                    photo_id = req['photo_ids'][0]
                    url = req['upload_url']
                    files = {'file': open(name, 'rb')}
                    req = requests.post(url, files=files).json()
                    token = up.quote_plus(req['photos'][photo_id]['token'])
                    list.append({"id": token})
                media.append({"type": "photo", "list": list})

            media = str(media).replace("'", '"')
            attachment = f'{{"media":{media}}}'
            params = ['&method=mediatopic.post',
                    f'&application_key={self.keys["application_key"]}',
                    f'&attachment={attachment}',
                    '&format=json',
                    '&type=GROUP_THEME',
                    f'&gid={gid}']
            params.sort()
            params[0] = '?' + params[0][1:]

            # print(params)
            sig = self.get_sig(params)
            req = requests.get(self.url
                            + ''.join(params)
                            + f'&sig={sig}'
                            + f'&access_token={self.keys["access_token"]}')
            print(req.json())
            return req.json()
        except Error as e:
            print(e)


if __name__ == "__main__":
    try:
        settingsNum = argv[4]
        userNum = argv[3]
        settings = json.loads(mycursor.fetchall()[int(userNum)][3])[(int(settingsNum)+1)]
        ok = Ok_api(settings)
        text = argv[1]
        files = list(argv[2].split())
        ok.post(settings['gid'], text, files)
    except Error as e:
        print(e)