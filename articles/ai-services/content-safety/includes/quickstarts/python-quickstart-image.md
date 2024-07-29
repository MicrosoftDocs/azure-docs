---
title: "Quickstart: Analyze image content with Python"
description: In this quickstart, get started using the Content Azure AI Safety Python SDK to analyze image content for objectionable material.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.custom: build-2023
ms.topic: include
ms.date: 03/07/2024
ms.author: pafarley
---

[Reference documentation](https://pypi.org/project/azure-ai-contentsafety/) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/contentsafety/azure-ai-contentsafety) | [Package (PyPI)](https://pypi.org/project/azure-ai-contentsafety/) | [Samples](https://github.com/Azure-Samples/AzureAIContentSafety/tree/main/python/1.0.0) |


## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
* Once you have your Azure subscription, <a href="https://aka.ms/acs-create"  title="Create a Content Safety resource"  target="_blank">create a Content Safety resource </a> in the Azure portal to get your key and endpoint. Enter a unique name for your resource, select your subscription, and select a resource group, supported region (see [Region availability](/azure/ai-services/content-safety/overview#region-availability)), and supported pricing tier. Then select **Create**.
  * The resource takes a few minutes to deploy. After it finishes, Select **go to resource**. In the left pane, under **Resource Management**, select **Subscription Key and Endpoint**. The endpoint and either of the keys are used to call APIs.
* [Python 3.8 or later](https://www.python.org/)
  * Your Python installation should include [pip](https://pip.pypa.io/en/stable/). You can check if you have pip installed by running `pip --version` on the command line. Get pip by installing the latest version of Python.

[!INCLUDE [Create environment variables](../env-vars.md)]

## Analyze image content

The following section walks through a sample request with the Python SDK.

1. Open a command prompt, navigate to your project folder, and create a new file named *quickstart.py*.
1. Run this command to install the Azure AI Content Safety client library:

    ```console
    python -m pip install azure-ai-contentsafety
    ```

1. Copy the following code into *quickstart.py*:

    ```python
    import os

    from azure.ai.contentsafety import ContentSafetyClient
    from azure.ai.contentsafety.models import AnalyzeImageOptions, ImageData, ImageCategory
    from azure.core.credentials import AzureKeyCredential
    from azure.core.exceptions import HttpResponseError
    
    def analyze_image():
        endpoint = os.environ.get('CONTENT_SAFETY_ENDPOINT')
        key = os.environ.get('CONTENT_SAFETY_KEY')
        image_path = os.path.join("sample_data", "image.jpg")
    
        # Create an Azure AI Content Safety client
        client = ContentSafetyClient(endpoint, AzureKeyCredential(key))
    
        
        # Build request
        with open(image_path, "rb") as file:
            request = AnalyzeImageOptions(image=ImageData(content=file.read()))

        # Analyze image
        try:
            response = client.analyze_image(request)
        except HttpResponseError as e:
            print("Analyze image failed.")
            if e.error:
                print(f"Error code: {e.error.code}")
                print(f"Error message: {e.error.message}")
                raise
            print(e)
            raise

        hate_result = next(item for item in response.categories_analysis if item.category == ImageCategory.HATE)
        self_harm_result = next(item for item in response.categories_analysis if item.category == ImageCategory.SELF_HARM)
        sexual_result = next(item for item in response.categories_analysis if item.category == ImageCategory.SEXUAL)
        violence_result = next(item for item in response.categories_analysis if item.category == ImageCategory.VIOLENCE)
    
        if hate_result:
            print(f"Hate severity: {hate_result.severity}")
        if self_harm_result:
            print(f"SelfHarm severity: {self_harm_result.severity}")
        if sexual_result:
            print(f"Sexual severity: {sexual_result.severity}")
        if violence_result:
            print(f"Violence severity: {violence_result.severity}")
    
    if __name__ == "__main__":
        analyze_image()
    ```

1. Replace `"sample_data"` and `"image.jpg"` with the path and filename of the local you want to use.
1. Then run the application with the `python` command on your quickstart file.

    ```console
    python quickstart.py
    ```
