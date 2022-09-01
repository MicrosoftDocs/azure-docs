---
title: 'Quickstart: Use the OpenAI Service to make your first completions call with the REST API'
titleSuffix: Azure OpenAI
description: Walkthrough on how to get started with Azure OpenAI and make your first completions call with the REST API. 
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: include
ms.date: 06/30/2022
keywords: 
---

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>
- Access granted to the Azure OpenAI service in the desired Azure subscription

    Currently, access to this service is granted only by application. You can apply for access to the Azure OpenAI service by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.
- <a href="https://www.python.org/" target="_blank">Python 3.7.1 or later version</a>
- The following Python libraries: os, requests, json
- An Azure OpenAI Service resource with a model deployed. If you don't have a resource/model the process is documented in our [resource deployment guide](../how-to/create-resource.md)

## Retrieve key and endpoint

To successfully make a call against the Azure OpenAI service, you'll need the following:

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively, you can find the value in the **Azure OpenAI Studio** > **Playground** > **Code View**. An example endpoint is: `https://docs-test-001.openai.azure.com/`.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either `KEY1` or `KEY2`.|
| `DEPLOYMENT-NAME` | This will correspond to the custom name you chose for your deployment when you deployed a model. This value can be found under **Resource Management** > **Deployments** in the Azure portal or alternatively under **Management** > **Deployments** in Azure OpenAI Studio.|

Go to your resource in the Azure portal. The **Endpoint and Keys** can be found in the **Resource Management** section. Copy your endpoint and access key as you'll need both for authenticating your API calls. You can use either `KEY1` or `KEY2`. Always having two keys allows you to securely rotate and regenerate keys without causing a service disruption.

:::image type="content" source="../media/quickstarts/endpoint.png" alt-text="Screenshot of the overview blade for an OpenAI Resource in the Azure portal with the endpoint & access keys location circled in red." lightbox="../media/quickstarts/endpoint.png":::

## Create a new Python application

Create a new Python file called quickstart.py. Then open it up in your preferred editor or IDE.

1. Replace the contents of quickstart.py with the following code.

    ```python
    import os
    import requests
    import json

    apiKey = "REPLACE_WITH_YOUR_API_KEY_HERE"
    base_url = "REPLACE_WITH_YOUR_ENDPOINT_HERE"
    deploymentName ="REPLACE_WITH_YOUR_DEPLOYMENT_NAME_HERE"

    url = base_url + "openai/deployments/" + deploymentName + "/completions?api-version=2022-06-01-preview"
    prompt = "Once upon a time"
    payload = {        
        "prompt":prompt
        }

    r = requests.post(url, 
          headers={
            "api-key": apiKey,
            "Content-Type": "application/json"
          },
          json = payload
        )

    response = json.loads(r.text)
    formatted_response = json.dumps(response, indent=4)

    print(formatted_response)
    ```

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials. For example, [Azure Key Vault](../../../key-vault/general/overview.md).

1. Run the application with the `python` command on your quickstart file

    ```console
    python quickstart.py
    ```

## Output

The output from the completions API will look as follows.

```json
  {
    "id": "id of your call",
    "object": "text_completion",
    "created": 1589478378,
    "model": "model used",
    "choices": [
        {
        "text": " there was a girl who",
        "index": 0,
        "logprobs": null,
        "finish_reason": "length"
        }
    ]
    }
```

## Clean up resources

If you want to clean up and remove an OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
- [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

Learn more about how to generate the best completion in our [How-to guide on completions](../how-to/completions.md).