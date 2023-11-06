---
title: 'Quickstart: Generate images with the Python SDK for Azure OpenAI Service'
titleSuffix: Azure OpenAI Service
description: Learn how to generate images with Azure OpenAI Service by using the Python SDK and the endpoint and access keys for your Azure OpenAI resource.
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
ms.date: 11/06/2023
keywords: 
---

Use this guide to get started generating images with the Azure OpenAI SDK for Python.

[Library source code](https://github.com/openai/openai-python/tree/main/openai) | [Package](https://github.com/openai/openai-python) | [Samples](https://github.com/openai/openai-python/tree/main/examples)

## Prerequisites

#### [DALL-E 3](#tab/dalle3)

- An Azure subscription. <a href="https://azure.microsoft.com/free/ai-services" target="_blank">Create one for free</a>.
- Access granted to DALL-E in the desired Azure subscription.
- <a href="https://www.python.org/" target="_blank">Python 3.7.1 or later version</a>.
- An Azure OpenAI resource created in the `SwedenCentral` region.
- Then, you need to deploy a `dalle3` model with your Azure resource. For more information, see [Create a resource and deploy a model with Azure OpenAI](../how-to/create-resource.md).

#### [DALL-E 2](#tab/dalle2)

- An Azure subscription. <a href="https://azure.microsoft.com/free/ai-services" target="_blank">Create one for free</a>.
- Access granted to DALL-E in the desired Azure subscription.
- <a href="https://www.python.org/" target="_blank">Python 3.7.1 or later version</a>.
- An Azure OpenAI resource created in the `EastUS` region. For more information, see [Create a resource and deploy a model with Azure OpenAI](../how-to/create-resource.md).

---

> [!NOTE]
> Currently, you must submit an application to access Azure OpenAI Service. To apply for access, complete [this form](https://aka.ms/oai/access). If you need assistance, open an issue on this repo to contact Microsoft.

## Set up

### Retrieve key and endpoint

To successfully call the Azure OpenAI APIs, you need the following information about your Azure OpenAI resource:

| Variable | Name | Value |
|---|---|---|
| **Endpoint** | `api_base` | The endpoint value is located under **Keys and Endpoint** for your resource in the Azure portal. Alternatively, you can find the value in **Azure OpenAI Studio** > **Playground** > **Code View**. An example endpoint is: `https://docs-test-001.openai.azure.com/`. |
| **Key** | `api_key` | The key value is also located under **Keys and Endpoint** for your resource in the Azure portal. Azure generates two keys for your resource. You can use either value. |

Go to your resource in the Azure portal. On the navigation pane, select **Keys and Endpoint** under **Resource Management**. Copy the **Endpoint** value and an access key value. You can use either the **KEY 1** or **KEY 2** value. Always having two keys allows you to securely rotate and regenerate keys without causing a service disruption.

:::image type="content" source="../media/quickstarts/endpoint.png" alt-text="Screenshot that shows the Keys and Endpoint page for an Azure OpenAI resource in the Azure portal." lightbox="../media/quickstarts/endpoint.png":::

Create and assign persistent environment variables for your key and endpoint.

[!INCLUDE [environment-variables](environment-variables.md)]


## Create a new Python application

Open a command prompt and browse to your project folder. Create a new python file, _quickstart.py_.

## Install the Python SDK

> [!IMPORTANT]
> The latest release of the [OpenAI Python library](https://pypi.org/project/openai/) does not currently support DALL-E when used with Azure OpenAI. To access DALL-E with Azure OpenAI use version `0.28.1`.

Install the OpenAI Python SDK by using the following command:

#### [DALL-E 3](#tab/dalle3)

```bash
pip install openai
```

#### [DALL-E 2](#tab/dalle2)

```bash
pip install openai==0.28.1
```
---

Install the following libraries as well:

```bash
pip install requests
pip install pillow 
```

## Generate images with DALL-E

Open _quickstart.py in your preferred editor or IDE.

Replace the contents of _quickstart.py_ with the following code. 

#### [DALL-E 3](#tab/dalle3)

```python
from openai import AzureOpenAI
import os
import requests
from PIL import Image
import json

client = AzureOpenAI(
    api_version="2023-12-01-preview",
    api_base=os.environ['AZURE_OPENAI_ENDPOINT'],
    api_key=os.environ["AZURE_OPENAI_API_KEY"],
)

result = client.images.generate(
    model="dalle3", # the name of your DALL-E 3 deployment
    prompt="a close-up of a bear walking throughthe forest",
    n=1
)

json_response = json.loads(result.model_dump_json())

# Set the directory for the stored image
image_dir = os.path.join(os.curdir, 'images')

# If the directory doesn't exist, create it
if not os.path.isdir(image_dir):
    os.mkdir(image_dir)

# Initialize the image path (note the filetype should be png)
image_path = os.path.join(image_dir, 'generated_image.png')

# Retrieve the generated image
image_url = json_response["data"][0]["url"]  # extract image URL from response
generated_image = requests.get(image_url).content  # download the image
with open(image_path, "wb") as image_file:
    image_file.write(generated_image)

# Display the image in the default image viewer
image = Image.open(image_path)
image.show()
```

1. Enter your endpoint URL and key in the appropriate fields. 
1. Change the value of `prompt` to your preferred text.
1. Change the value of `model` to the name of your deployed DALL-E 3 model.

#### [DALL-E 2](#tab/dalle2)

```python
import openai
import os
import requests
from PIL import Image

# Get endpoint and key from environment variables
openai.api_base = os.environ['AZURE_OPENAI_ENDPOINT']
openai.api_key = os.environ['AZURE_OPENAI_KEY']     

# Assign the API version (DALL-E is currently supported for the 2023-06-01-preview API version only)
openai.api_version = '2023-06-01-preview'
openai.api_type = 'azure'

# Create an image by using the image generation API
generation_response = openai.Image.create(
    prompt='A painting of a dog',    # Enter your prompt text here
    size='1024x1024',
    n=2
)

# Set the directory for the stored image
image_dir = os.path.join(os.curdir, 'images')

# If the directory doesn't exist, create it
if not os.path.isdir(image_dir):
    os.mkdir(image_dir)

# Initialize the image path (note the filetype should be png)
image_path = os.path.join(image_dir, 'generated_image.png')

# Retrieve the generated image
image_url = generation_response["data"][0]["url"]  # extract image URL from response
generated_image = requests.get(image_url).content  # download the image
with open(image_path, "wb") as image_file:
    image_file.write(generated_image)

# Display the image in the default image viewer
image = Image.open(image_path)
image.show()
```
1. Enter your endpoint URL and key in the appropriate fields. 
1. Change the value of `prompt` to your preferred text.

---

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post your key publicly. For production, use a secure way of storing and accessing your credentials. For more information, see [Azure Key Vault](../../../key-vault/general/overview.md).

Run the application with the `python` command:

```console
python quickstart.py
```

Wait a few moments to get the response.

## Output

Azure OpenAI stores the output image in the _generated_image.png_ file in your specified directory. The script also displays the image in your default image viewer.

The image generation APIs come with a content moderation filter. If the service recognizes your prompt as harmful content, it doesn't generate an image. For more information, see [Content filtering](../concepts/content-filter.md).

## Clean up resources

If you want to clean up and remove an Azure OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Azure portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* Learn more in this [Azure OpenAI overview](../overview.md).
* Try examples in the [Azure OpenAI Samples GitHub repository](https://github.com/Azure/openai-samples).
