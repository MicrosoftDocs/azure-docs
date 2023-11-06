---
title: 'Quickstart: Use GPT-4 with Vision on your images and videos with the Azure Open AI REST API'
titleSuffix: Azure OpenAI
description: Get started using the Azure OpenAI REST APIs to deploy and use the GPT-4 with Vision model.
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
ms.date: 11/02/2023
---

Use this article to get started using the Azure OpenAI REST APIs to deploy and use the GPT-4 with Vision model. 

## Prerequisites

- An Azure subscription. <a href="https://azure.microsoft.com/free/ai-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription. Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at https://aka.ms/oai/access. Open an issue on this repo to contact us if you have an issue. 
- <a href="https://www.python.org/" target="_blank">Python 3.7.1 or later version</a>.
- The following Python libraries: `os`, `requests`, `json`.
- An Azure OpenAI Service resource with a GPT-4 Vision model deployed. The resource must be in the `EastUS`, `SwitzerlandNorth`, `SwedenCentral`, `CentralUS`, `WestUS`, or `AustraliaEast` Azure region. For more information about model deployment, see [the resource deployment guide](/azure/ai-services/openai/how-to/create-resource). 

## Retrieve key and endpoint

To successfully call the Azure OpenAI APIs, you need the following information about your Azure OpenAI resource:

| Variable | Name | Value |
|---|---|---|
| **Endpoint** | `api_base` | The endpoint value is located under **Keys and Endpoint** for your resource in the Azure portal. Alternatively, you can find the value in **Azure OpenAI Studio** > **Playground** > **Code View**. An example endpoint is: `https://docs-test-001.openai.azure.com/`. |
| **Key** | `api_key` | The key value is also located under **Keys and Endpoint** for your resource in the Azure portal. Azure generates two keys for your resource. You can use either value. |

Go to your resource in the Azure portal. On the navigation pane, select **Keys and Endpoint** under **Resource Management**. Copy the **Endpoint** value and an access key value. You can use either the **KEY 1** or **KEY 2** value. Always having two keys allows you to securely rotate and regenerate keys without causing a service disruption.

:::image type="content" source="../media/quickstarts/endpoint.png" alt-text="Screenshot that shows the Keys and Endpoint page for an Azure OpenAI resource in the Azure portal." lightbox="../media/quickstarts/endpoint.png":::


## tbd 

Send a POST request to `https://{RESOURCE_NAME}.openai.azure.com/openai/deployments/{DEPLOYMENT_NAME}/chat/completions?api-version=2023-08-01-preview` where 

- RESOURCE_NAME is the name of your Azure OpenAI resource 
- DEPLOYMENT_NAME is the name of your gptv model deployment 

Required headers: 
- Content-Type: application/json 
- api-key: {API_KEY} 

Body: 

This is a sample request body. The format is the same as the chat completions API for GPT-4, except that the message content may be an array containing strings and images. 


```json
{
    "messages": [ 
        {
            "role": "system", 
            "content": "You are a helpful assistant." 
        },
        {
            "role": "user", 
            "content": [ 
                "Describe this picture:", { "image": "base64 encoded image" } 
            ] 
        }
    ],
    "max_tokens": 100, 
    "stream": false 
} 
```


```python
# Packages required: 
# requests 
# azure-identity 
import requests 
import json 
from azure.identity import DefaultAzureCredential 

RESOURCE_NAME = "my-aoai-resource"      # Set this to the name of the Azure OpenAI resource 
DEPLOYMENT_NAME = "my-gptv-deployment"  # Set this to the name of the gptv model deployment 
API_KEY = "############"                # Set this to the API key for the Azure OpenAI resource 

base_url = f"https://{RESOURCE_NAME}.openai.azure.com/openai/deployments/{DEPLOYMENT_NAME}" 
headers = {   
    "Content-Type": "application/json",   
    "api-key": API_KEY 
} 


# Prepare endpoint, headers, and request body 
endpoint = f"{base_url}/chat/completions?api-version=2023-08-01-preview" 
data = { 
    "messages": [ 
        { "role": "system", "content": "You are a helpful assistant." }, # Content can be a string, OR 
        { "role": "user", "content": [                                   # It can be an array containing strings and images. 
            "Describe this picture:", 
            { "image": "base64 encoded image" }                          # Images are represented like this. 
        ] } 
    ], 
    "max_tokens": 100 
}   

# Make the API call   
response = requests.post(endpoint, headers=headers, data=json.dumps(data))   

print(f"Status Code: {response.status_code}")   
print(response.text) 
```

## Create a new Python application

Create a new Python file named _quickstart.py_. Open the new file in your preferred editor or IDE.

1. Replace the contents of _quickstart.py_ with the following code. Enter your endpoint URL and key in the appropriate fields. Change the value of `prompt` to your preferred text.
    

1. Run the application with the `python` command:

    ```console
    python quickstart.py
    ```

    The script makes an image generation API call and then loops until the generated image is ready.



## Clean up resources

If you want to clean up and remove an Azure OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Azure portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* Learn more in the [Azure OpenAI overview](../overview.md).
