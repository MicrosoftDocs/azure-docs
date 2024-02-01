---
title: "Quickstart: Analyze text content with Python"
description: In this quickstart, get started using the Azure AI Content Safety Python SDK to analyze text content for objectionable material.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.custom: build-2023
ms.topic: include
ms.date: 05/03/2023
ms.author: pafarley
---

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
* Once you have your Azure subscription, <a href="https://aka.ms/acs-create"  title="Create a Content Safety resource"  target="_blank">create a Content Safety resource </a> in the Azure portal to get your key and endpoint. Enter a unique name for your resource, select the subscription you entered on the application form, select a resource group, supported region, and supported pricing tier. Then select **Create**.
  * The resource takes a few minutes to deploy. After it finishes, Select **go to resource**. In the left pane, under **Resource Management**, select **Subscription Key and Endpoint**. The endpoint and either of the keys are used to call APIs.
* [Python 3.x](https://www.python.org/)
  * Your Python installation should include [pip](https://pip.pypa.io/en/stable/). You can check if you have pip installed by running `pip --version` on the command line. Get pip by installing the latest version of Python.

[!INCLUDE [Create environment variables](../env-vars.md)]


## Analyze text content

The following section walks through a sample request with the Python SDK.

1. Open a command prompt, navigate to your project folder, and create a new file named *quickstart.py*.
1. Run this command to install the Azure AI Content Safety library:

    ```console
    python -m pip install azure-ai-contentsafety
    ```

1. Copy the following code into *quickstart.py*:

    ```python
    import os
    from azure.ai.contentsafety import ContentSafetyClient
    from azure.core.credentials import AzureKeyCredential
    from azure.core.exceptions import HttpResponseError
    from azure.ai.contentsafety.models import AnalyzeTextOptions
    
    
    def analyze_text():
        # analyze text
        key = os.environ["CONTENT_SAFETY_KEY"]
        endpoint = os.environ["CONTENT_SAFETY_ENDPOINT"]
    
        # Create an Azure AI Content Safety client
        client = ContentSafetyClient(endpoint, AzureKeyCredential(key))
    
        # Contruct request
        request = AnalyzeTextOptions(text="Your input text")
    
        # Analyze text
        try:
            response = client.analyze_text(request)
        except HttpResponseError as e:
            print("Analyze text failed.")
            if e.error:
                print(f"Error code: {e.error.code}")
                print(f"Error message: {e.error.message}")
                raise
            print(e)
            raise

        if response.hate_result:
            print(f"Hate severity: {response.hate_result.severity}")
        if response.self_harm_result:
            print(f"SelfHarm severity: {response.self_harm_result.severity}")
        if response.sexual_result:
            print(f"Sexual severity: {response.sexual_result.severity}")
        if response.violence_result:
            print(f"Violence severity: {response.violence_result.severity}")
    
    
    if __name__ == "__main__":
        analyze_text()
    ```
1. Replace `"Your input text"` with the text content you'd like to use.
    > [!TIP]
    > Text size and granularity
    >
    > The default maximum length for text submissions is **10K** characters.
1. Then run the application with the `python` command on your quickstart file.

    ```console
    python quickstart.py
    ```
