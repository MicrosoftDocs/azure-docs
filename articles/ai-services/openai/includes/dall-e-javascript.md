---
title: 'Quickstart: Use the OpenAI Service image generation REST APIs'
titleSuffix: Azure OpenAI Service
description: Walkthrough on how to get started with Azure OpenAI image generation using the REST API. 
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: include
ms.date: 06/04/2023
keywords: 
---

Use this guide to get started calling the image generation APIs using the Python SDK.

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

To successfully make a call against Azure OpenAI, you'll need the following:

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively, you can find the value in **Azure OpenAI Studio** > **Playground** > **Code View**. An example endpoint is: `https://docs-test-001.openai.azure.com/`.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either `KEY1` or `KEY2`.|

Go to your resource in the Azure portal. The **Endpoint and Keys** can be found in the **Resource Management** section. Copy your endpoint and access key as you'll need both for authenticating your API calls. You can use either `KEY1` or `KEY2`. Always having two keys allows you to securely rotate and regenerate keys without causing a service disruption.

## Install the Python SDK

Open the command prompt and navigate to your project folder. Install the OpenAI Python SDK using the following command: 

```bash
pip install openai
```
Install the following libraries as well:

```bash
pip install requests
pip install pillow 
```

## Create a new Python application

Create a new Python file called quickstart.py. Then open it in your preferred editor or IDE.

1. Replace the contents of quickstart.py with the following code. Enter your endpoint URL and key in the appropriate fields.

    ```python
    import openai
    import os
    import requests
    from PIL import Image

    openai.api_base = '<your_openai_endpoint>' # Add your endpoint here
    openai.api_key = '<your_openai_key>'  # Add your api key here

    # At the moment Dall-E is only supported by the 2023-06-01-preview API version
    openai.api_version = '2023-06-01-preview'

    openai.api_type = 'azure'

    # Create an image using the image generation API
    generation_response = openai.Image.create(
        prompt='A painting of a dog',
        size='1024x1024',
        n=2
    )

    # Set the directory where we'll store the image
    image_dir = os.path.join(os.curdir, 'images')
    # If the directory doesn't exist, create it
    if not os.path.isdir(image_dir):
        os.mkdir(image_dir)

    # With the directory in place, we can initialize the image path (note that filetype should be png)
    image_path = os.path.join(image_dir, 'generated_image.png')

    # Now we can retrieve the generated image
    image_url = generation_response["data"][0]["url"]  # extract image URL from response
    generated_image = requests.get(image_url).content  # download the image
    with open(image_path, "wb") as image_file:
        image_file.write(generated_image)

    # Display the image in the default image viewer
    display(Image.open(image_path))
    ```

    > [!IMPORTANT]
    > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials. For example, [Azure Key Vault](../../../key-vault/general/overview.md).

1. Run the application with the `python` command:

    ```console
    python quickstart.py
    ```

    The script will loop until the generated image is ready.

## Output

The output image will be downloaded to _generated_image.png_ at your specified location. The script will also display the image in your default image viewer.

The image generation APIs come with a content moderation filter. If the service recognizes your prompt as harmful content, it won't return a generated image. For more information, see the [content filter](../concepts/content-filter.md) article.

## Clean up resources

If you want to clean up and remove an OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* [Azure OpenAI Overview](../overview.md)
* For more examples check out the [Azure OpenAI Samples GitHub repository](https://github.com/Azure/openai-samples).
