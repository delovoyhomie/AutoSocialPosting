import requests 
 
token = "5431073621:AAEJA8y8KBOroztziVtei_tJQk0gqeD6m6U"
params = { 
    'chat_id': "-1001860362263"
} 
 
response = requests.get('https://api.telegram.org/bot'+token+'/getChatAdministrators',params=params) 
print(response.content)