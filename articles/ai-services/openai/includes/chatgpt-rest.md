---
title: 'Quickstart: Use Azure OpenAI Service with the REST API'
titleSuffix: Azure OpenAI
description: Walkthrough on how to get started with Azure OpenAI and make your first completions call with the REST API. 
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
author: mrbullwinkle
ms.author: mbullwin
ms.date: 03/21/2023
keywords: 
---

[REST API Spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/stable/2023-05-15/inference.json?azure-portal=true) |

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true).
- Access granted to Azure OpenAI Service in the desired Azure subscription.
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI Service by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access?azure-portal=true).
- An Azure OpenAI Service resource with either the `gpt-35-turbo` or the `gpt-4` models deployed. For more information about model deployment, see the [resource deployment guide](../how-to/create-resource.md).

## Set up

[!INCLUDE [get-key-endpoint](get-key-endpoint.md)]

[!INCLUDE [environment-variables](environment-variables.md)]


> [!div class="nextstepaction"]
> [I ran into an issue with the setup.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST&Pillar=AOAI&Product=Chatgpt&Page=quickstart&Section=Set-up)

## REST API

In a bash shell, run the following command. You will need to replace `gpt-35-turbo` with the deployment name you chose when you deployed the GPT-35-Turbo or GPT-4 models. Entering the model name will result in an error unless you chose a deployment name that is identical to the underlying model name.

```bash
curl $AZURE_OPENAI_ENDPOINT/openai/deployments/gpt-35-turbo/chat/completions?api-version=2023-05-15 \
  -H "Content-Type: application/json" \
  -H "api-key: $AZURE_OPENAI_KEY" \
  -d '{"messages":[{"role": "system", "content": "You are a helpful assistant."},{"role": "user", "content": "Does Azure OpenAI support customer managed keys?"},{"role": "assistant", "content": "Yes, customer managed keys are supported by Azure OpenAI."},{"role": "user", "content": "Do other Azure AI services support this too?"}]}'

```

The format of your first line of the command with an example endpoint would appear as follows `curl https://docs-test-001.openai.azure.com/openai/deployments/{YOUR-DEPLOYMENT_NAME_HERE}/chat/completions?api-version=2023-05-15 \` If you encounter an error double check to make sure that you don't have a doubling of the `/` at the separation between your endpoint and `/openai/deployments`.

If you want to run this command in a normal Windows command prompt you would need to alter the text to remove the `\` and line breaks.

> [!IMPORTANT]
> For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). For more information about credential security, see the Azure AI services [security](../../security-features.md) article.

## Output

```bash
{"id":"chatcmpl-6v7mkQj980V1yBec6ETrKPRqFjNw9",
"object":"chat.completion","created":1679072642,
"model":"gpt-35-turbo",
"usage":{"prompt_tokens":58,
"completion_tokens":68,
"total_tokens":126},
"choices":[{"message":{"role":"assistant",
"content":"Yes, other Azure AI services also support customer managed keys. Azure AI services offer multiple options for customers to manage keys, such as using Azure Key Vault, customer-managed keys in Azure Key Vault or customer-managed keys through Azure Storage service. This helps customers ensure that their data is secure and access to their services is controlled."},"finish_reason":"stop","index":0}]}
```

Output formatting adjusted for ease of reading, actual output is a single block of text without line breaks.

> [!div class="nextstepaction"]
> [I ran into an issue when running the code sample.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST&Pillar=AOAI&Product=Chatgpt&Page=quickstart&Section=Create-sample-code)

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
