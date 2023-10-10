---
title: 'Quickstart: Generate images with the REST APIs for Azure OpenAI Service'
titleSuffix: Azure OpenAI Service
description: Learn how to generate images with Azure OpenAI Service by using the REST APIs and the endpoint and access keys for your Azure OpenAI resource.
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
ms.date: 08/08/2023
keywords: 
---

Use this guide to get started calling the Azure OpenAI Service image generation REST APIs by using Python.

## Prerequisites

- An Azure subscription. <a href="https://azure.microsoft.com/free/ai-services" target="_blank">Create one for free</a>.
- Access granted to DALL-E in the desired Azure subscription.
- <a href="https://www.python.org/" target="_blank">Python 3.7.1 or later version</a>.
- The following Python libraries: `os`, `requests`, `json`.
- An Azure OpenAI resource created in the East US region. For more information, see [Create a resource and deploy a model with Azure OpenAI](../how-to/create-resource.md).

> [!NOTE]
> Currently, you must submit an application to access Azure OpenAI Service. To apply for access, complete [this form](https://aka.ms/oai/access). If you need assistance, open an issue on this repo to contact Microsoft.

## Retrieve key and endpoint

To successfully call the Azure OpenAI APIs, you need the following information about your Azure OpenAI resource:

| Variable | Name | Value |
|---|---|---|
| **Endpoint** | `api_base` | The endpoint value is located under **Keys and Endpoint** for your resource in the Azure portal. Alternatively, you can find the value in **Azure OpenAI Studio** > **Playground** > **Code View**. An example endpoint is: `https://docs-test-001.openai.azure.com/`. |
| **Key** | `api_key` | The key value is also located under **Keys and Endpoint** for your resource in the Azure portal. Azure generates two keys for your resource. You can use either value. |

Go to your resource in the Azure portal. On the navigation pane, select **Keys and Endpoint** under **Resource Management**. Copy the **Endpoint** value and an access key value. You can use either the **KEY 1** or **KEY 2** value. Always having two keys allows you to securely rotate and regenerate keys without causing a service disruption.

:::image type="content" source="../media/quickstarts/endpoint.png" alt-text="Screenshot that shows the Keys and Endpoint page for an Azure OpenAI resource in the Azure portal." lightbox="../media/quickstarts/endpoint.png":::

## Create a new Python application

Create a new Python file named _quickstart.py_. Open the new file in your preferred editor or IDE.

1. Replace the contents of _quickstart.py_ with the following code. Enter your endpoint URL and key in the appropriate fields. Change the value of `prompt` to your preferred text.

    ```python
    import requests
    import time
    import os

    api_base = '<your_endpoint>'  # Enter your endpoint here
    api_key = '<your_key>'        # Enter your API key here

    # Assign the API version (DALL-E is currently supported for the 2023-06-01-preview API version only)
    api_version = '2023-06-01-preview'

    # Define the prompt for the image generation
    url = f"{api_base}openai/images/generations:submit?api-version={api_version}"
    headers= { "api-key": api_key, "Content-Type": "application/json" }
    body = {
        "prompt": "a multi-colored umbrella on the beach, disposable camera",  # Enter your prompt text here
        "size": "1024x1024",
        "n": 1
    }
    submission = requests.post(url, headers=headers, json=body)

    # Call the API to generate the image and retrieve the response
    operation_location = submission.headers['operation-location']
    status = ""
    while (status != "succeeded"):
        time.sleep(1)
        response = requests.get(operation_location, headers=headers)
        status = response.json()['status']
    image_url = response.json()['result']['data'][0]['url']

    print(image_url)
    ```

    > [!IMPORTANT]
    > Remember to remove the key from your code when you're done, and never post your key publicly. For production, use a secure way of storing and accessing your credentials. For more information, see [Azure Key Vault](../../../key-vault/general/overview.md).

1. Run the application with the `python` command:

    ```console
    python quickstart.py
    ```

    The script makes an image generation API call and then loops until the generated image is ready.

## Output

The output from a successful image generation API call looks like the following example. The `url` field contains a URL where you can download the generated image. The URL stays active for 24 hours.

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
                "url": "<URL_to_generated_image>"
            }
        ]
    },
    "status": "succeeded"
}
```

The image generation APIs come with a content moderation filter. If the service recognizes your prompt as harmful content, it doesn't generate an image. For more information, see [Content filtering](../concepts/content-filter.md).

The system returns an operation status of `Failed` and the `error.code` value in the message is set to `contentFilter`. Here's an example:

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

It's also possible that the generated image itself is filtered. In this case, the error message is set to `Generated image was filtered as a result of our safety system.`. Here's an example:

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

If you want to clean up and remove an Azure OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Azure portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* Learn more in this [Azure OpenAI overview](../overview.md).
* Try examples in the [Azure OpenAI Samples GitHub repository](https://github.com/Azure/openai-samples).
