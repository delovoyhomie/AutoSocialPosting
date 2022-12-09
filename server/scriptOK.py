import requests
import json
from hashlib import md5
import urllib.parse as up
from sys import argv

f = open('settingsOK.json')
settings = json.load(f)
f.close()


class Ok_api:
    def __init__(self, args):
        self.url = 'https://api.ok.ru/fb.do'
        self.keys = args

    def get_sig(self, params):
        ssk = self.keys['session_secret_key']
        sig = md5((''.join(params)+ssk).encode()).hexdigest()
        return sig

    def getUploadUrl(self, gid):
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

    def post(self, gid, text, files):
        media = []
        if text != '':
            media.append({"type": "text", "text": text})
        if files != 'None':
            list = []
            for name in files.split():
                req = self.getUploadUrl(gid)
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


if __name__ == "__main__":
    with open("test.txt", "a") as myfile:
        myfile.write("appended text")
    ok = Ok_api(settings)
    text, files = argv[1:]
    ok.post(settings['gid'], text, files)
    print("passed")
