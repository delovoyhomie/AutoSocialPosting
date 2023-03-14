import vk_api
import requests
import json
from sys import argv

token = None
group_id = None

def upload(name):
    url = vk.photos.getWallUploadServer(group_id=group_id)['upload_url']
    files = {'file': open(f'{name}', 'rb')}
    req = requests.post(url, files=files).json()

    return req

def save(name):
    req = upload(name)
    server, photo, hash = req.values()
    save_wall_photo = vk.photos.saveWallPhoto(group_id=group_id,
                                              photo=photo,
                                              server=server,
                                              hash=hash)
    return save_wall_photo


def get_saved_photo(name):
    save_wall_photo = save(name)
    owner_id = str(save_wall_photo[0]['owner_id'])
    id = str(save_wall_photo[0]['id'])
    saved_photo = f'photo{owner_id}_{id}'
    # print(saved_photo)

    return saved_photo


def post_with_files(text, files):
    saved_photo = ''
    for name in files:
        saved_photo += get_saved_photo(name) + ','
    saved_photo = saved_photo[:-1]
    # print(saved_photo)
    vk.wall.post(owner_id=f'-{group_id}',
                 attachments=saved_photo, message=text)


def post_text(text):
    vk.wall.post(owner_id=f'-{group_id}', message=text)


if __name__ == "__main__":
    text = argv[1]
    files = list(argv[2].split())
    userNum = argv[3]
    settingsNum = argv[4]
    
    f = open('users.json')
    settings = json.load(f)[int(userNum)]['accounts'][(int(settingsNum)+1)]
    f.close()

    token = settings['token']
    group_id = settings['group_id']

    vk_session = vk_api.VkApi(token=token)
    vk = vk_session.get_api()
    

    if files[0] == 'None':
        post_text(text)
    else:
        post_with_files(text, files)
