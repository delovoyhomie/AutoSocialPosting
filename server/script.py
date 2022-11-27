import vk_api
import requests
import json
from sys import argv
import os

token = "YOUR API USER";
group_id = YOUR GROUP ID

vk_session = vk_api.VkApi(token=token)
vk = vk_session.get_api()


def upload(name):
    url = vk.photos.getWallUploadServer(group_id=group_id)['upload_url']
    # print(f'{way}/img/{name}')
    files = {f'file': open(f'{name}', 'rb')}
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


def my_post(text, files):
    if text != 'None' and len(files) != 0:
        saved_photo = ''
        for name in files:
            saved_photo += get_saved_photo(name) + ','
        saved_photo = saved_photo[:-1]
        # print(saved_photo)
        vk.wall.post(owner_id=f'-{group_id}',
                     attachments=saved_photo, message=text)
    elif len(files) == 0:
        vk.wall.post(owner_id=f'-{group_id}', message=text)
    elif text == 'None':
        saved_photo = ''
        for name in files:
            saved_photo += get_saved_photo(name) + ','
        saved_photo = saved_photo[:-1]
        vk.wall.post(owner_id=f'-{group_id}', attachments=saved_photo)


def replace(id, text, files):
    if text != 'None' and len(files) != 0:
        saved_photo = ''
        for name in files:
            saved_photo += get_saved_photo(name) + ','
        saved_photo = saved_photo[:-1]
        # print(saved_photo)
        vk.wall.edit(owner_id=f'-{group_id}', post_id=id,
                     attachments=saved_photo, message=text)
    elif len(files) == 0:
        vk.wall.edit(owner_id=f'-{group_id}', post_id=id, message=text)
    elif text == 'None':
        saved_photo = ''
        for name in files:
            saved_photo += get_saved_photo(name) + ','
        saved_photo = saved_photo[:-1]
        vk.wall.edit(owner_id=f'-{group_id}',
                     post_id=id, attachments=saved_photo)


if __name__ == "__main__":
    way = ".";
    # files = os.listdir(path=f"{way}")
    # tmp = []
    # for x in files:
    #     if ('png' in x):
    #         tmp.append(x)
    # files = tmp
    # if ('.DS_Store' in files):
    #     files.remove('.DS_Store')
    # print(files)
    text, id, id_dell, files = argv[1:]
    files = list(files.split())
    print(files)
    if id_dell != 'None':
        vk.wall.delete(owner_id=f'-{group_id}', post_id=id_dell)
    elif id == 'None':
        my_post(text, files)
    else:
        replace(id, text, files)

    # for x in files:
    #     os.remove(f'{way}/img/{x}')
