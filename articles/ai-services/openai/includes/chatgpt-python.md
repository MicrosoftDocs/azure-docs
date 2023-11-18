---
title: 'Quickstart: Use Azure OpenAI Service with the Python SDK'
titleSuffix: Azure OpenAI
description: Walkthrough on how to get started with Azure OpenAI and make your first completions call with the Python SDK. 
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
author: mrbullwinkle
ms.author: mbullwin
ms.date: 11/15/2023
keywords: 
---

[Library source code](https://github.com/openai/openai-python?azure-portal=true) | [Package (PyPi)](https://pypi.org/project/openai?azure-portal=true) | [Enterprise chat app template](/azure/developer/python/get-started-app-chat-template) |

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true)
- Access granted to Azure OpenAI Service in the desired Azure subscription.
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI Service by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access?azure-portal=true).
- [Python 3.7.1 or later version](https://www.python.org?azure-portal=true).
- The following Python libraries: os.
- An Azure OpenAI Service resource with either the `gpt-35-turbo` or the `gpt-4` models deployed. For more information about model deployment, see the [resource deployment guide](../how-to/create-resource.md).

> [!div class="nextstepaction"]
> [I ran into an issue with the prerequisites.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=PYTHON&Pillar=AOAI&Product=Chatgpt&Page=quickstart&Section=Prerequisites)

## Set up

Install the OpenAI Python client library with:

# [OpenAI Python 0.28.1](#tab/python)

```console
pip install openai==0.28.1
```

# [OpenAI Python 1.x](#tab/python-new)

```console
pip install openai
```

---

> [!NOTE]
> This library is maintained by OpenAI and is currently in preview. Refer to the [release history](https://github.com/openai/openai-python/releases) or the [version.py commit history](https://github.com/openai/openai-python/commits/main/openai/version.py) to track the latest updates to the library.

[!INCLUDE [get-key-endpoint](get-key-endpoint.md)]

[!INCLUDE [environment-variables](environment-variables.md)]

> [!div class="nextstepaction"]
> [I ran into an issue with the setup.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=PYTHON&Pillar=AOAI&Product=Chatgpt&Page=quickstart&Section=Set-up)

## Create a new Python application

1. Create a new Python file called quickstart.py. Then open it up in your preferred editor or IDE.

2. Replace the contents of quickstart.py with the following code.

# [OpenAI Python 0.28.1](#tab/python)

You need to set the `engine` variable to the deployment name you chose when you deployed the GPT-3.5-Turbo or GPT-4 models. Entering the model name will result in an error unless you chose a deployment name that is identical to the underlying model name.

```python
import os
import openai
openai.api_type = "azure"
openai.api_base = os.getenv("AZURE_OPENAI_ENDPOINT") 
openai.api_key = os.getenv("AZURE_OPENAI_KEY")
openai.api_version = "2023-05-15"

response = openai.ChatCompletion.create(
    engine="gpt-35-turbo", # engine = "deployment_name".
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Does Azure OpenAI support customer managed keys?"},
        {"role": "assistant", "content": "Yes, customer managed keys are supported by Azure OpenAI."},
        {"role": "user", "content": "Do other Azure AI services support this too?"}
    ]
)

print(response)
print(response['choices'][0]['message']['content'])
```

# [OpenAI Python 1.x](#tab/python-new)

You need to set the `model` variable to the deployment name you chose when you deployed the GPT-3.5-Turbo or GPT-4 models. Entering the model name will result in an error unless you chose a deployment name that is identical to the underlying model name.

```python
import os
from openai import AzureOpenAI

client = AzureOpenAI(
  azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"), 
  api_key=os.getenv("AZURE_OPENAI_KEY"),  
  api_version="2023-05-15"
)

response = client.chat.completions.create(
    model="gpt-35-turbo", # model = "deployment_name".
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Does Azure OpenAI support customer managed keys?"},
        {"role": "assistant", "content": "Yes, customer managed keys are supported by Azure OpenAI."},
        {"role": "user", "content": "Do other Azure AI services support this too?"}
    ]
)

print(response.choices[0].message.content)
```

---

> [!IMPORTANT]
> For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). For more information about credential security, see the Azure AI services [security](../../security-features.md) article.

3. Run the application with the `python` command on your quickstart file:

    ```console
    python quickstart.py
    ```

## Output

```console
{
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Yes, most of the Azure AI services support customer managed keys. However, not all services support it. You can check the documentation of each service to confirm if customer managed keys are supported.",
        "role": "assistant"
      }
    }
  ],
  "created": 1679001781,
  "id": "chatcmpl-6upLpNYYOx2AhoOYxl9UgJvF4aPpR",
  "model": "gpt-3.5-turbo-0301",
  "object": "chat.completion",
  "usage": {
    "completion_tokens": 39,
    "prompt_tokens": 58,
    "total_tokens": 97
  }
}
Yes, most of the Azure AI services support customer managed keys. However, not all services support it. You can check the documentation of each service to confirm if customer managed keys are supported.
```

> [!div class="nextstepaction"]
> [I ran into an issue when running the code sample.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=PYTHON&Pillar=AOAI&Product=Chatgpt&Page=quickstart&Section=Create-python-application)

### Understanding the message structure

The GPT-35-Turbo and GPT-4 models are optimized to work with inputs formatted as a conversation.  The `messages` variable passes an array of dictionaries with different roles in the conversation delineated by system, user, and assistant. The system message can be used to prime the model by including context or instructions on how the model should respond.

The [GPT-35-Turbo & GPT-4 how-to guide](../how-to/chatgpt.md) provides an in-depth introduction into the options for communicating with these new models.

## Clean up resources

If you want to clean up and remove an OpenAI resource, you can delete the resource. Before deleting the resource, you must first delete any deployed models.

- [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* Learn more about how to work with GPT-35-Turbo and the GPT-4 models with [our how-to guide](../how-to/chatgpt.md).
* For more examples, check out the [Azure OpenAI Samples GitHub repository](https://aka.ms/AOAICodeSamples)
