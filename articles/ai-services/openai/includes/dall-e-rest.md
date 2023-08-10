---
title: 'Quickstart: Use the OpenAI Service image generation REST APIs'
titleSuffix: Azure OpenAI Service
description: Walkthrough on how to get started with Azure OpenAI image generation using the REST API. 
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: include
ms.date: 04/04/2023
keywords: 
---

Use this guide to get started calling the image generation REST APIs using Python.

> [!NOTE]
> The image generation API creates an image from a text prompt. It does not edit existing images or create variations.

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>
- Access granted to DALL-E in the desired Azure subscription
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Existing Azure OpenAI customers need to re-enter the form to get access to DALL-E. Open an issue on this repo to contact us if you have an issue.
- <a href="https://www.python.org/" target="_blank">Python 3.7.1 or later version</a>
- The following Python libraries: os, requests, json
- An Azure OpenAI resource created in the East US region. For more information about model deployment, see the [resource deployment guide](../how-to/create-resource.md).

## Retrieve key and endpoint

To successfully call the Azure OpenAI APIs, you'll need the following:

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively, you can find the value in **Azure OpenAI Studio** > **Playground** > **Code View**. An example endpoint is: `https://docs-test-001.openai.azure.com/`.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either `KEY1` or `KEY2`.|

Go to your resource in the Azure portal and select the **Keys and endpoint** page. Copy your endpoint and key to a temporary location. You can use either `KEY1` or `KEY2`. Always having two keys allows you to securely rotate and regenerate keys without causing a service disruption.

:::image type="content" source="../media/quickstarts/endpoint.png" alt-text="Screenshot of the overview blade for an OpenAI Resource in the Azure portal with the endpoint & access keys location circled in red." lightbox="../media/quickstarts/endpoint.png":::

## Create a new Python application

Create a new Python file called **quickstart.py**. Then open it up in your preferred code editor or IDE.

1. Replace the contents of **quickstart.py** with the following code. Enter your endpoint URL and key in the appropriate fields. Change the value of `"prompt"` to your own custom prompt.

    ```python
    import requests
    import time
    import os
    api_base = 'YOUR_API_ENDPOINT_URL'
    api_key = 'YOUR_OPENAI_KEY'
    api_version = '2023-06-01-preview'
    url = f"{api_base}openai/images/generations:submit?api-version={api_version}"
    headers= { "api-key": api_key, "Content-Type": "application/json" }
    body = {
        "prompt": "a multi-colored umbrella on the beach, disposable camera",
        "size": "1024x1024",
        "n": 1
    }
    submission = requests.post(url, headers=headers, json=body)

    operation_location = submission.headers['operation-location']
    status = ""
    while (status != "succeeded"):
        time.sleep(1)
        response = requests.get(operation_location, headers=headers)
        status = response.json()['status']
    image_url = response.json()['result']['data'][0]['url']
    ```

    > [!IMPORTANT]
    > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials. For example, [Azure Key Vault](../../../key-vault/general/overview.md).

1. Run the application with the `python` command:

    ```console
    python quickstart.py
    ```

    The script will make an image generation API call and then loop until the generated image is ready.

## Output

The output from a successful image generation API call looks like this. The `"url"` field contains a URL where you can download the generated image. The URL stays active for 24 hours.

```json
{
    "created": 1685130482,
    "expires": 1685216887,
    "id": "088e4742-89e8-4c38-9833-c294a47059a3",
    "result":
    {
        "data":
        [
            {
                "url": "<URL_TO_IMAGE>"
            }
        ]
    },
    "status": "succeeded"
}
```

The image generation APIs come with a content moderation filter. If the service recognizes your prompt as harmful content, it won't return a generated image. For more information, see the [content filter](../concepts/content-filter.md) article. The system will return an operation status of `Failed` and the `error.code` in the message will be set to `contentFilter`. Here is an example.

```json
{
   "created": 1589478378,
   "error": {
       "code": "contentFilter",
       "message": "Your task failed as a result of our safety system."
   },
   "id": "9484f239-9a05-41ba-997b-78252fec4b34",
   "status": "failed"
}
```

It's also possible that the generated image itself is filtered. In this case, the error message is set to `Generated image was filtered as a result of our safety system.`. Here is an example.

```json
{
   "created": 1589478378,
   "expires": 1589478399,
   "id": "9484f239-9a05-41ba-997b-78252fec4b34",
   "lastActionDateTime": 1589478378,
   "data": [
       {
           "url": "<URL_TO_IMAGE>"
       },
       {
           "error": {
               "code": "contentFilter",
               "message": "Generated image was filtered as a result of our safety system."
           }
       }
   ],
   "status": "succeeded"
}
```

## Clean up resources

If you want to clean up and remove an OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* [Azure OpenAI Overview](../overview.md)
* For more examples check out the [Azure OpenAI Samples GitHub repository](https://github.com/Azure/openai-samples).
