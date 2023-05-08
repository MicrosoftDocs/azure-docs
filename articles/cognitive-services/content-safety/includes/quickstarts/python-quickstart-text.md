---
title: "Quickstart: Analyze text content with Python"
description: In this quickstart, get started using the Content Safety Python SDK to analyze text content for objectionable material.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: content-safety
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

## Create environment variables 

In this example, you'll write your credentials to environment variables on the local machine running the application.

> [!TIP]
> Don't include the key directly in your code, and never post it publicly. See the Cognitive Services [security](/azure/cognitive-services/security-features) article for more authentication options like [Azure Key Vault](/azure/cognitive-services/use-key-vault). 

To set the environment variable for your key and endpoint, open a console window and follow the instructions for your operating system and development environment.

1. To set the `CONTENT_SAFETY_KEY` environment variable, replace `your-key` with one of the keys for your resource.
2. To set the `CONTENT_SAFETY_ENDPOINT` environment variable, replace `your-endpoint` with the endpoint for your resource.

#### [Windows](#tab/windows)

```console
setx CONTENT_SAFETY_KEY your-key
```

```console
setx CONTENT_SAFETY_ENDPOINT your-endpoint
```

After you add the environment variables, you may need to restart any running programs that will read the environment variables, including the console window.

#### [Linux](#tab/linux)

```bash
export CONTENT_SAFETY_KEY=your-key
```

```bash
export CONTENT_SAFETY_ENDPOINT=your-endpoint
```

After you add the environment variables, run `source ~/.bashrc` from your console window to make the changes effective.

---

## Analyze text content

The following section walks through a sample request with the Python SDK.

1. Open a command prompt, navigate to your project folder, and create a new file named *quickstart.py*.
1. Run this command to install the Azure AI Vision client library:

    ```console
    python -m pip install azure-ai-contentsafety
    ```

1. Copy the following code into *quickstart.py*:

    ```python
    import os
    from azure.ai.contentsafety import ContentSafetyClient
    from azure.core.credentials import AzureKeyCredential
    from azure.ai.contentsafety.models import AnalyzeTextOptions, TextCategory
    
    
    def analyze_text():
        endpoint = os.environ.get('CONTENT_SAFETY_ENDPOINT')
        key = os.environ.get('CONTENT_SAFETY_KEY')
    
        # Create an Content Safety client
        client = ContentSafetyClient(endpoint, AzureKeyCredential(key))
    
        # Build request
        request = AnalyzeTextOptions(text="Your input text")
    
        # Analyze text
        try:
            response = client.analyze_text(request)
        except Exception as e:
            print("Error code: {}".format(e.error.code))
            print("Error message: {}".format(e.error.message))
            return
    
        if response.hate_result is not None:
            print("Hate severity: {}".format(response.hate_result.severity))
        if response.self_harm_result is not None:
            print("SelfHarm severity: {}".format(response.self_harm_result.severity))
        if response.sexual_result is not None:
            print("Sexual severity: {}".format(response.self_harm_result.severity))
        if response.violence_result is not None:
            print("Violence severity: {}".format(response.self_harm_result.severity))
    
    
    if __name__ == "__main__":
        analyze_text()
    ```
1. Replace `"Your input text"` with the text content you'd like to use.
1. Then run the application with the `python` command on your quickstart file.

    ```console
    python quickstart.py
    ```
