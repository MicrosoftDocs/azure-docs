---
title: 'Quickstart: Use Azure OpenAI Service with the REST API'
titleSuffix: Azure OpenAI
description: Walkthrough on how to get started with Azure OpenAI and make your first completions call with the REST API. 
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: include
author: mrbullwinkle
ms.author: mbullwin
ms.date: 03/01/2023
keywords: 
---

[REST API Spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/stable/2022-12-01/inference.json?azure-portal=true) |

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true).
- Access granted to the Azure OpenAI service in the desired Azure subscription.
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI Service by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access?azure-portal=true).
- An Azure OpenAI Service resource with the `gpt-35-turbo` model deployed. This model is currently available in East US and South Central US. For more information about model deployment, see the [resource deployment guide](../how-to/create-resource.md).

## Set up

### Retrieve key and endpoint

To successfully make a call against Azure OpenAI, you'll need an **endpoint** and a **key**.

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively, you can find the value in the **Azure OpenAI Studio** > **Playground** > **Code View**. An example endpoint is: `https://docs-test-001.openai.azure.com/`.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either `KEY1` or `KEY2`.|

Go to your resource in the Azure portal. The **Endpoint and Keys** can be found in the **Resource Management** section. Copy your endpoint and access key as you'll need both for authenticating your API calls. You can use either `KEY1` or `KEY2`. Always having two keys allows you to securely rotate and regenerate keys without causing a service disruption.

:::image type="content" source="../media/quickstarts/endpoint.png" alt-text="Screenshot of the overview blade for an OpenAI Resource in the Azure portal with the endpoint & access keys location circled in red." lightbox="../media/quickstarts/endpoint.png":::

Create and assign persistent environment variables for your key and endpoint.

### Environment variables

# [Command Line](#tab/command-line)

```CMD
setx OPENAI_API_KEY "REPLACE_WITH_YOUR_KEY_VALUE_HERE" 
```

```CMD
setx OPENAI_API_BASE "REPLACE_WITH_YOUR_ENDPOINT_HERE" 
```

# [PowerShell](#tab/powershell)

```powershell
[System.Environment]::SetEnvironmentVariable('OPENAI_API_KEY', 'REPLACE_WITH_YOUR_KEY_VALUE_HERE', 'User')
```

```powershell
[System.Environment]::SetEnvironmentVariable('OPENAI_API_BASE', 'REPLACE_WITH_YOUR_ENDPOINT_HERE', 'User')
```

# [Bash](#tab/bash)

```Bash
echo export OPENAI_API_KEY="REPLACE_WITH_YOUR_KEY_VALUE_HERE" >> /etc/environment && source /etc/environment
```

```Bash
echo export OPENAI_API_BASE="REPLACE_WITH_YOUR_ENDPOINT_HERE" >> /etc/environment && source /etc/environment
```
---

## REST API

In a bash shell run the following:

```bash
curl https://$OPENAI_API_BASE/openai/deployments/gpt-35-turbo/completions?api-version=2022-12-01 \
  -H "Content-Type: application/json" \
  -H "api-key: $OPENAI_API_KEY" \
  -d '{
  "prompt": "<|im_start|>system\nThe system is an AI assistant that helps people find information.\n<|im_end|>\n<|im_start|>user\nDoes Azure OpenAI support customer managed keys?\n<|im_end|>\n<|im_start|>assistant",
  "max_tokens": 800,
  "temperature": 1,
  "frequency_penalty": 0,
  "presence_penalty": 0,
  "top_p": 0.95,
  "stop": ["<|im_end|>"]
}'
```

## Output

```bash
{"id":"cmpl-6mZPEDkBPasCTxueCy9iVRMY4ZGD4",
"object":"text_completion",
"created":1677033864,
"model":"gpt-35-turbo",
"choices":
[{"text":"\nYes, Azure OpenAI supports customer managed keys. These keys allow customers to manage their own encryption keys for the OpenAI services, rather than relying on Azure's managed keys. This provides an additional layer of security for customers' data and models.","index":0,"logprobs":null,"finish_reason":"stop"}],
"usage":{"prompt_tokens":66,"completion_tokens":52,"total_tokens":118}}
```

Output formatting adjusted for readability, actual output is a single block of text without line breaks.

### Understanding the prompt structure

ChatGPT was trained to use special tokens to delineate different parts of the prompt. Content is provided to the model in between `<|im_start|>` and `<|im_end|>` tokens. The prompt begins with a system message which can be used to prime the model by including context or instructions for the model. After that, the prompt contains a series of messages between the user and the assistant.

The assistant's response to the prompt will then be returned below the `<|im_start|>assistant` token and will end with `<|im_end|>` denoting that the assistant has finished its response.

The [ChatGPT how-to guide](../how-to/chatgpt.md) provides an in-depth introduction into the new prompt structure and how to use the new model effectively.

## Clean up resources

If you want to clean up and remove an OpenAI resource, you can delete the resource. Before deleting the resource you must first delete any deployed models.

- [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
- [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

* Learn more about how to work with ChatGPT and the new `gpt-35-turbo` model in the [how-to guide on ChatGPT](../how-to/chatgpt.md).
* For more examples check out the [Azure OpenAI Samples GitHub repository](https://github.com/Azure/openai-samples)