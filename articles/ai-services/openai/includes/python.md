---
title: 'Quickstart: Use the OpenAI Service via the Python SDK'
titleSuffix: Azure OpenAI Service
description: Walkthrough on how to get started with Azure OpenAI and make your first completions call with the Python SDK. 
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
ms.date: 02/02/2023
keywords: 
---

<a href="https://github.com/openai/openai-python" target="_blank">Library source code</a> | <a href="https://pypi.org/project/openai/" target="_blank">Package (PyPi)</a> |

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>
- Access granted to Azure OpenAI in the desired Azure subscription

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.
- <a href="https://www.python.org/" target="_blank">Python 3.7.1 or later version</a>
- The following Python libraries: os, requests, json
- An Azure OpenAI Service resource with a `gpt-35-turbo-instruct` model deployed. For more information about model deployment, see the [resource deployment guide](../how-to/create-resource.md).

> [!div class="nextstepaction"]
> [I ran into an issue with the prerequisites.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=PYTHON&Pillar=AOAI&Product=gpt&Page=quickstart&Section=Prerequisites)

## Set up

Install the OpenAI Python client library with:

```console
pip install openai==0.28.1
```

> [!NOTE]
> This library is maintained by OpenAI and is currently in preview. Refer to the [release history](https://github.com/openai/openai-python/releases) or the [version.py commit history](https://github.com/openai/openai-python/commits/main/openai/version.py) to track the latest updates to the library.

## Retrieve key and endpoint

To successfully make a call against the Azure OpenAI service, you'll need the following:

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively, you can find the value in **Azure OpenAI Studio** > **Playground** > **Code View**. An example endpoint is: `https://docs-test-001.openai.azure.com/`.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either `KEY1` or `KEY2`.|
| `DEPLOYMENT-NAME` | This value will correspond to the custom name you chose for your deployment when you deployed a model. This value can be found under **Resource Management** > **Deployments** in the Azure portal or alternatively under **Management** > **Deployments** in Azure OpenAI Studio.|

Go to your resource in the Azure portal. The **Endpoint and Keys** can be found in the **Resource Management** section. Copy your endpoint and access key as you'll need both for authenticating your API calls. You can use either `KEY1` or `KEY2`. Always having two keys allows you to securely rotate and regenerate keys without causing a service disruption.

:::image type="content" source="../media/quickstarts/endpoint.png" alt-text="Screenshot of the overview blade for an OpenAI Resource in the Azure portal with the endpoint & access keys location circled in red." lightbox="../media/quickstarts/endpoint.png":::

Create and assign persistent environment variables for your key and endpoint.

[!INCLUDE [environment-variables](environment-variables.md)]


> [!div class="nextstepaction"]
> [I ran into an issue with the setup.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=PYTHON&Pillar=AOAI&Product=gpt&Page=quickstart&Section=Set-up)

## Create a new Python application

1. Create a new Python file called quickstart.py. Then open it up in your preferred editor or IDE.

2. Replace the contents of quickstart.py with the following code. Modify the code to add your key, endpoint, and deployment name: 

    ```python
    import os
    import requests
    import json
    import openai

    openai.api_key = os.getenv("AZURE_OPENAI_KEY")
    openai.api_base = os.getenv("AZURE_OPENAI_ENDPOINT") # your endpoint should look like the following https://YOUR_RESOURCE_NAME.openai.azure.com/
    openai.api_type = 'azure'
    openai.api_version = '2023-05-15' # this may change in the future

    deployment_name='REPLACE_WITH_YOUR_DEPLOYMENT_NAME' #This will correspond to the custom name you chose for your deployment when you deployed a model. 

    # Send a completion call to generate an answer
    print('Sending a test completion job')
    start_phrase = 'Write a tagline for an ice cream shop. '
    response = openai.Completion.create(engine=deployment_name, prompt=start_phrase, max_tokens=10)
    text = response['choices'][0]['text'].replace('\n', '').replace(' .', '.').strip()
    print(start_phrase+text)
    ```

    > [!IMPORTANT]
    > For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). For more information about credential security, see the Azure AI services [security](../../security-features.md) article.

1. Run the application with the `python` command on your quickstart file:

    ```console
    python quickstart.py
    ```

## Output

The output will include response text following the `Write a tagline for an ice cream shop.` prompt. Azure OpenAI returned `The coldest ice cream in town!` in this example.

```console
Sending a test completion job
Write a tagline for an ice cream shop. The coldest ice cream in town!
```

Run the code a few more times to see what other types of responses you get as the response won't always be the same.

> [!div class="nextstepaction"]
> [I ran into an issue when running the code sample.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=PYTHON&Pillar=AOAI&Product=gpt&Page=quickstart&Section=Create-python-application)

### Understanding your results

Since our example of `Write a tagline for an ice cream shop.` provides little context, it's normal for the model to not always return expected results. You can adjust the maximum number of tokens if the response seems unexpected or truncated.

Azure OpenAI also performs content moderation on the prompt inputs and generated outputs. The prompts or responses may be filtered if harmful content is detected. For more information, see the [content filter](../concepts/content-filter.md) article.

## Clean up resources

If you want to clean up and remove an OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* Learn more about how to generate the best completion in our [How-to guide on completions](../how-to/completions.md).
* For more examples check out the [Azure OpenAI Samples GitHub repository](https://aka.ms/AOAICodeSamples).
