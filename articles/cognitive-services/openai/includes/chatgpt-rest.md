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
ms.date: 03/21/2023
keywords: 
---

[REST API Spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/stable/2022-12-01/inference.json?azure-portal=true) |

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true).
- Access granted to the Azure OpenAI service in the desired Azure subscription.
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI Service by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access?azure-portal=true).
- An Azure OpenAI Service resource with either the `gpt-35-turbo`, or the `gpt-4-0314`<sup>1</sup> models deployed. These models are currently available in East US and South Central US. For more information about model deployment, see the [resource deployment guide](../how-to/create-resource.md).

<sup>1</sup> **GPT-4 models are currently in limited preview.** Existing Azure OpenAI customers can [apply for access by filling out this form](TODO: Add link to form from PG).

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

In a bash shell run the following command. You will need to replace `gpt-35-turbo` with the deployment name you chose when you deployed the ChatGPT or GPT-4 models. Entering the model name will result in an error unless you chose a deployment name that is identical to the underlying model name.

```bash
curl https://$OPENAI_API_BASE/openai/deployments/gpt-35-turbo/chat/completions?api-version=2023-03-15-preview \
  -H "Content-Type: application/json" \
  -H "api-key: $OPENAI_API_KEY" \
  -d '{
  "messages": {["role": "user", "content": "Hello!"}]
}'
```

If you want to run this command in a normal Windows command prompt you would need to alter the text to remove the `\` and line breaks.

## Output

```bash
TODO: Add output once I can actually query the API.
```

Output formatting adjusted for readability, actual output is a single block of text without line breaks.

### Understanding the message structure

The ChatGPT and GPT-4 models are optimized work with inputs formatted as a conversation.  The `messages` variable passes an array of dictionaries with different roles in the conversation delineated by system, user, and assistant. The system message can be used to prime the model by including context or instructions on how the model should respond.

The [ChatGPT & GPT-4 how-to guide](../how-to/chatgpt.md) provides an in-depth introduction into the options for communicating with these new models.

## Clean up resources

If you want to clean up and remove an OpenAI resource, you can delete the resource. Before deleting the resource you must first delete any deployed models.

- [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
- [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

* Learn more about how to work with ChatGPT and the new `gpt-35-turbo` model in the [how-to guide on ChatGPT](../how-to/chatgpt.md).
* For more examples check out the [Azure OpenAI Samples GitHub repository](https://github.com/Azure/openai-samples)