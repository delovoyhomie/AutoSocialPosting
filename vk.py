import vk_api, random, time, requests, json

token = "YOUR API USER"
vk_session = vk_api.VkApi(token=token)
vk = vk_session.get_api()

url = vk.photos.getWallUploadServer(group_id=217404735)['upload_url']

files = {'file': open('ph.jpg', 'rb')}
req = requests.post(url, files = files)

save_wall_photo = vk.photos.saveWallPhoto(group_id = 217404735, photo = req.json()['photo'], server = req.json()['server'], hash = req.json()['hash'])
saved_photo = "photo" + str(save_wall_photo[0]['owner_id']) + '_' + str(save_wall_photo[0]['id'])
vk.wall.post_(owner_id = '-217404735', attachments = saved_photo, message = 'fdsfsdfsdfsdfdshjfbsdhjfbsdhjfbdshj' + '☺' + '☺')


# vk.wall.post(owner_id=-217404735, attachments='photo394623374_456239157')