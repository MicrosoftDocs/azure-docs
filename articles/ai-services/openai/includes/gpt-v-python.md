---
title: 'Quickstart: Use GPT-4 Turbo with Vision on your images and videos with the Python SDK'
titleSuffix: Azure OpenAI
description: Get started using the Azure OpenAI Python SDK to deploy and use the GPT-4 Turbo with Vision model.
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
ms.custom: references_regions
ms.date: 01/22/2024
---

Use this article to get started using the Azure OpenAI Python SDK to deploy and use the GPT-4 Turbo with Vision model. 

[Library source code](https://github.com/openai/openai-python?azure-portal=true) | [Package (PyPi)](https://pypi.org/project/openai?azure-portal=true) |


## Prerequisites

- An Azure subscription. <a href="https://azure.microsoft.com/free/ai-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription. 
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at https://aka.ms/oai/access. Open an issue on this repo to contact us if you have an issue. 
- <a href="https://www.python.org/" target="_blank">Python 3.8 or later version</a>.
- The following Python libraries: `os`
- An Azure OpenAI Service resource with a GPT-4 Turbo with Vision model deployed. See [GPT-4 and GPT-4 Turbo Preview model availability](../concepts/models.md#gpt-4-and-gpt-4-turbo-model-availability) for available regions. For more information about resource creation, see the [resource deployment guide](/azure/ai-services/openai/how-to/create-resource).
- For Vision enhancement (optional): An Azure Computer Vision resource in the same region as your Azure OpenAI resource, in the paid (S1) tier.

## Set up 

Install the OpenAI Python client library with:

```console
pip install openai
```


> [!NOTE]
> This library is maintained by OpenAI and is currently in preview. Refer to the [release history](https://github.com/openai/openai-python/releases) or the [version.py commit history](https://github.com/openai/openai-python/commits/main/openai/version.py) to track the latest updates to the library.

[!INCLUDE [get-key-endpoint](get-key-endpoint.md)]

[!INCLUDE [environment-variables](environment-variables.md)]


## Create a new Python application

Create a new Python file named _quickstart.py_. Open the new file in your preferred editor or IDE.

#### [Image prompts](#tab/image)

1. Replace the contents of _quickstart.py_ with the following code. 
    
    ```python
    from openai import AzureOpenAI
    
    api_base = os.getenv("AZURE_OPENAI_ENDPOINT")
    api_key= os.getenv("AZURE_OPENAI_API_KEY")
    deployment_name = '<your_deployment_name>'
    api_version = '2023-12-01-preview' # this might change in the future
    
    client = AzureOpenAI(
        api_key=api_key,  
        api_version=api_version,
        base_url=f"{api_base}/openai/deployments/{deployment_name}"
    )
    
    response = client.chat.completions.create(
        model=deployment_name,
        messages=[
            { "role": "system", "content": "You are a helpful assistant." },
            { "role": "user", "content": [  
                { 
                    "type": "text", 
                    "text": "Describe this picture:" 
                },
                { 
                    "type": "image_url",
                    "image_url": {
                        "url": "<image URL>"
                    }
                }
            ] } 
        ],
        max_tokens=2000 
    )
    
    print(response)
    ```



1. Make the following changes:
    1. Enter the name of your GPT-4 Turbo with Vision deployment in the appropriate field.
    1. Change the value of the `"url"` field to the URL of your image.
        > [!TIP]
        > You can also use a base 64 encoded image data instead of a URL. For more information, see the [GPT-4 Turbo with Vision how-to guide](../how-to/gpt-with-vision.md#use-a-local-image).
1. Run the application with the `python` command:

    ```console
    python quickstart.py
    ```

#### [Image prompt enhancements](#tab/enhanced)

GPT-4 Turbo with Vision provides exclusive access to Azure AI Services tailored enhancements. When combined with Azure AI Vision, it enhances your chat experience by providing the chat model with more detailed information about visible text in the image and the locations of objects.

The **Optical Character Recognition (OCR)** integration allows the model to produce higher quality responses for dense text, transformed images, and number-heavy financial documents. It also covers a wider range of languages.

The **object grounding** integration brings a new layer to data analysis and user interaction, as the feature can visually distinguish and highlight important elements in the images it processes.

> [!CAUTION]
> Azure AI enhancements for GPT-4 Turbo with Vision will be billed separately from the core functionalities. Each specific Azure AI enhancement for GPT-4 Turbo with Vision has its own distinct charges. For details, see the [special pricing information](../concepts/gpt-with-vision.md#special-pricing-information).

1. Replace the contents of _quickstart.py_ with the following code. 
    
    ```python
    from openai import AzureOpenAI
    
    api_base = os.getenv("AZURE_OPENAI_ENDPOINT")
    api_key= os.getenv("AZURE_OPENAI_API_KEY")
    deployment_name = '<your_deployment_name>'
    api_version = '2023-12-01-preview' # this might change in the future
    
    client = AzureOpenAI(
        api_key=api_key,  
        api_version=api_version,
        base_url=f"{api_base}/openai/deployments/{deployment_name}/extensions",
    )
    
    response = client.chat.completions.create(
        model=deployment_name,
        messages=[
            { "role": "system", "content": "You are a helpful assistant." },
            { "role": "user", "content": [  
                { 
                    "type": "text", 
                    "text": "Describe this picture:" 
                },
                { 
                    "type": "image_url",
                    "image_url": {
                        "url": "<image URL>"
                    }
                }
            ] } 
        ],
        extra_body={
            "dataSources": [
                {
                    "type": "AzureComputerVision",
                    "parameters": {
                        "endpoint": "<your_computer_vision_endpoint>",
                        "key": "<your_computer_vision_key>"
                    }
                }],
            "enhancements": {
                "ocr": {
                    "enabled": True
                },
                "grounding": {
                    "enabled": True
                }
            }
        },
        max_tokens=2000
    )
    
    print(response)
    ```

1. Make the following changes:
    1. Enter your GPT-4 Turbo with Vision deployment name in the appropriate field. 
    1. Enter your Computer Vision endpoint URL and key in the appropriate fields.
    1. Change the value of the `"url"` field to the URL of your image.
        > [!TIP]
        > You can also use a base 64 encoded image data instead of a URL. For more information, see the [GPT-4 Turbo with Vision how-to guide](../how-to/gpt-with-vision.md#use-a-local-image).
1. Run the application with the `python` command:

    ```console
    python quickstart.py
    ```

#### [Video prompt enhancements](#tab/video)

Video prompt integration is outside the scope of this quickstart. See the [GPT-4 Turbo with Vision how-to guide](../how-to/gpt-with-vision.md#use-vision-enhancement-with-video) for detailed instructions on setting up video prompts in chat completions programmatically.

---

## Clean up resources

If you want to clean up and remove an Azure OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Azure portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)


