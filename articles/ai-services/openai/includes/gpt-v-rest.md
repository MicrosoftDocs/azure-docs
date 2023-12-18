---
title: 'Quickstart: Use GPT-4 Turbo with Vision on your images and videos with the Azure Open AI REST API'
titleSuffix: Azure OpenAI
description: Get started using the Azure OpenAI REST APIs to deploy and use the GPT-4 Turbo with Vision model.
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
ms.custom: references_regions
ms.date: 11/02/2023
---

Use this article to get started using the Azure OpenAI REST APIs to deploy and use the GPT-4 Turbo with Vision model. 

## Prerequisites

- An Azure subscription. <a href="https://azure.microsoft.com/free/ai-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription. Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at https://aka.ms/oai/access. Open an issue on this repo to contact us if you have an issue. 
- <a href="https://www.python.org/" target="_blank">Python 3.7.1 or later version</a>.
- The following Python libraries: `requests`, `json`.
- An Azure OpenAI Service resource with a GPT-4 Turbo with Vision model deployed. The resource must be in the `SwitzerlandNorth`, `SwedenCentral`, `WestUS`, or `AustraliaEast` Azure region. For more information about model deployment, see [the resource deployment guide](/azure/ai-services/openai/how-to/create-resource).
- For Vision enhancement (optional): An Azure Computer Vision resource in the same region as your Azure OpenAI resource.

## Retrieve key and endpoint

To successfully call the Azure OpenAI APIs, you need the following information about your Azure OpenAI resource:

| Variable | Name | Value |
|---|---|---|
| **Endpoint** | `api_base` | The endpoint value is located under **Keys and Endpoint** for your resource in the Azure portal. Alternatively, you can find the value in **Azure OpenAI Studio** > **Playground** > **Code View**. An example endpoint is: `https://docs-test-001.openai.azure.com/`. |
| **Key** | `api_key` | The key value is also located under **Keys and Endpoint** for your resource in the Azure portal. Azure generates two keys for your resource. You can use either value. |

Go to your resource in the Azure portal. On the navigation pane, select **Keys and Endpoint** under **Resource Management**. Copy the **Endpoint** value and an access key value. You can use either the **KEY 1** or **KEY 2** value. Having two keys allows you to securely rotate and regenerate keys without causing a service disruption.

:::image type="content" source="../media/quickstarts/endpoint.png" alt-text="Screenshot that shows the Keys and Endpoint page for an Azure OpenAI resource in the Azure portal." lightbox="../media/quickstarts/endpoint.png":::

## Create a new Python application

Create a new Python file named _quickstart.py_. Open the new file in your preferred editor or IDE.

#### [Image prompts](#tab/image)

1. Replace the contents of _quickstart.py_ with the following code. 
    
    ```python
    # Packages required:
    import requests 
    import json 
    
    api_base = '<your_azure_openai_endpoint>' 
    deployment_name = '<your_deployment_name>'
    API_KEY = '<your_azure_openai_key>'
    
    base_url = f"{api_base}openai/deployments/{deployment_name}" 
    headers = {   
        "Content-Type": "application/json",   
        "api-key": API_KEY 
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
                        "url": "<URL or base 64 encoded image>"
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

1. Make the following changes:
    1. Enter your endpoint URL and key in the appropriate fields.
    1. Enter your GPT-4 Turbo with Vision deployment name in the appropriate field. 
    1. Change the value of the `"image"` field to the base 64 byte data of your image.
1. Run the application with the `python` command:

    ```console
    python quickstart.py
    ```

#### [Image prompt enhancements](#tab/enhanced)

GPT-4 Turbo with Vision provides exclusive access to Azure AI Services tailored enhancements. When combined with Azure AI Vision, it enhances your chat experience by providing the chat model with more detailed information about visible text in the image and the locations of objects.

The **Optical Character Recognition (OCR)** integration allows the model to produce higher quality responses for dense text, transformed images, and number-heavy financial documents. It also covers a wider range of languages.

The **object grounding** integration brings a new layer to data analysis and user interaction, as the feature can visually distinguish and highlight important elements in the images it processes.

> [!CAUTION]
> Azure AI enhancements for GPT-4 Turbo with Vision will be billed separately from the core functionalities. Each specific Azure AI enhancement for GPT-4 Turbo with Vision has its own distinct charges.

1. Replace the contents of _quickstart.py_ with the following code. 
    
    ```python
    # Packages required:
    import requests 
    import json 
    
    api_base = '<your_azure_openai_endpoint>' 
    deployment_name = '<your_deployment_name>'
    API_KEY = '<your_azure_openai_key>'
    
    base_url = f"{api_base}openai/deployments/{deployment_name}" 
    headers = {   
        "Content-Type": "application/json",   
        "api-key": API_KEY 
    } 
    
    # Prepare endpoint, headers, and request body 
    endpoint = f"{base_url}/extensions/chat/completions?api-version=2023-12-01-preview" 
    data = {
        "model": "gpt-4-vision-preview",
        "enhancements": {
            "ocr": {
              "enabled": True
            },
            "grounding": {
              "enabled": True
            }
        },
        "dataSources": [
        {
            "type": "AzureComputerVision",
            "endpoint": " <your_computer_vision_endpoint> ",
            "key": "<your_computer_vision_key>",
            "indexName": "test-products"
        }],
        "messages": [ 
            { "role": "system", "content": "You are a helpful assistant." }, 
            { "role": "user", 
            "content": [  
                { 
                    "type": "text", 
                    "text": "Describe this picture:" 
                },
                { 
                    "type": "image_url", 
                    "image_url": {
                        "url" : "<URL or base 64 encoded image>"
                    }
                }
            ]} 
        ], 
        "max_tokens": 2000 
    }   
    
    # Make the API call   
    response = requests.post(endpoint, headers=headers, data=json.dumps(data))   

    print(f"Status Code: {response.status_code}")   
    print(response.text)
    ```

1. Make the following changes:
    1. Enter your Azure OpenAI endpoint URL and key in the appropriate fields.
    1. Enter your GPT-4 Turbo with Vision deployment name in the appropriate field. 
    1. Enter your Computer Vision endpoint URL and key in the appropriate fields.
    1. Change the value of the `"image"` field to the base 64 byte data of your image.
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

## Next steps

* Learn more in the [Azure OpenAI overview](../overview.md).
