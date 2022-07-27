---
title: 'Quickstart: Use the OpenAI Service via the Python SDK'
titleSuffix: Azure OpenAI
description: Walkthrough on how to get started with Azure OpenAI and make your first completions and search calls with the Python SDK. 
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: include
ms.date: 06/30/2022
keywords: 
---

<a href="https://github.com/openai/openai-python" target="_blank">Library source code</a> | <a href="https://pypi.org/project/openai/" target="_blank">Package (PyPi)</a> |

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>
- Access granted to service in the desired Azure subscription. This service is currently invite only. You can fill out a new use case request here:<a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>
- <a href="https://www.python.org/" target="_blank">Python 3.x</a>
- The following python libraries: os, requests, json
- An Azure OpenAI Service resource with a model deployed. If you don't have a resource/model the process is documented in our [resource deployment guide](../how-to/create-resource.md)

## Set up

1. Install the client library. You can install the client library with:

```console
pip install openai
```

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

1. Create a new python file called quickstart.py. Then open it up in your preferred editor or IDE.

2. Replace the contents of quickstart.py with the following code. Modify the code to add your key, endpoint, and deployment name:

    ```python
    import os
    import requests
    import json
    import openai

    openai.api_key = "REPLACE_WITH_YOUR_API_KEY_HERE"
    openai.api_base =  "REPLACE_WITH_YOUR_ENDPOINT_HERE" # your endpoint should look like the following https://YOUR_RESOURCE_NAME.openai.azure.com/
    openai.api_type = 'azure'
    openai.api_version = '2022-06-01-preview' # this may change in the future

    deployment_id='REPLACE_WITH_YOUR_DEPLOYMENT_NAME' #This will correspond to the custom name you chose for your deployment when you deployed a model. 

    # Send a completion call to generate an answer
    print('Sending a test completion job')
    start_phrase = 'When I go to the store, I want a'
    response = openai.Completion.create(engine=deployment_id, prompt=start_phrase, max_tokens=10)
    text = response['choices'][0]['text'].split('\n')[0]
    print(start_phrase+text)
    ```

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). See the Cognitive Services [security](../../cognitive-services-security.md) article for more information.

1. Run the application with the `python` command on your quickstart file

    ```console
    python quickstart.py
    ```

## Output

```console
Sending a test completion job
"When I go to the store, I want a can of black beans"
```

Run the code a few more times to see what other types of responses you get as the response won't always be the same.

### Understanding your results

Since our example of `When I go to the store, I want a` provides very little context, it's normal for the model to not always return expected results. We're also intentionally limiting the response up to the first newline `\n` character, so occasional truncated responses with only our prompt text may occur as the model's response in that instance was split over multiple lines. If you wish to see the larger responses, you can remove `.split('\n')[0]` from your code and adjust the max number of tokens.

## Clean up resources

If you want to clean up and remove an OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
- [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

Learn more about how to generate the best completion in our [How-to guide on completions](../how-to/completions.md).