








Python code for Entra ID:
```python
# Prerequisite: Assign the app "Cognitive Services User" role to the OpenAI resource

import requests 
import json
from azure.identity import ClientSecretCredential
from msrest.authentication import BasicTokenAuthentication 

api_base = '<your_azure_openai_endpoint>' 
deployment_name = '<your_deployment_name>'
tenant_id = "<tenant_id_for_your_app>"  
client_id = "<client_id_for_your_app>"  
client_secret = "<client_secret_for_your_app>"

# Get Entra ID token using client id and secret  
credential = ClientSecretCredential(tenant_id, client_id, client_secret)
token = credential.get_token("https://cognitiveservices.azure.com/.default")  

base_url = f"{api_base}openai/deployments/{deployment_name}" 
headers = {   
    "Content-Type": "application/json",   
    "Authorization": f"Bearer {token.token}"
} 

# Prepare endpoint, headers, and request body 
endpoint = f"{base_url}/chat/completions?api-version=2023-12-01-preview" 
data = { 
    "messages": [ 
        { "role": "system", "content": "You are a helpful assistant." }, 
        { "role": "user", "content": [  
            { 
                "type": "text", 
                "text": "Describe this picture:" 
            },
            { 
                "type": "image_url",
                "image_url": {
                    "url": "https://live.staticflickr.com/50/165455721_30cca2162d.jpg"
                }
            }
        ] } 
    ], 
    "max_tokens": 2000 
}   

# Make the API call   
response = requests.post(endpoint, headers=headers, data=json.dumps(data))   

print(f"Status Code: {response.status_code}")   
print(response.text)
```