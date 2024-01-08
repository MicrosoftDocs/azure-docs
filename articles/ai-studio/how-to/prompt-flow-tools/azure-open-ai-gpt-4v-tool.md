---
title: Azure OpenAI GPT-4 Turbo with Vision tool in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article introduces the Azure OpenAI GPT-4 Turbo with Vision tool for flows in Azure AI Studio.
manager: nitinme
ms.service: azure-ai-studio
ms.topic: how-to
ms.date: 1/8/2024
author: lgayhardt
ms.author: lagayhar
ms.reviewer: keli19
---

# Azure OpenAI GPT-4 Turbo with Vision tool in Azure AI studio

[!INCLUDE [Azure AI Studio preview](./includes/preview-ai-studio.md)]

The prompt flow *Azure OpenAI GPT-4 Turbo with Vision* tool enables you to leverage your Azure OpenAI GPT-4 Turbo with Vision model deployment to analyze images and provide textual responses to questions about them.

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription.

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.

- An [Azure AI resource](../how-to/create-azure-ai-resource.md) with a GPT-4 Turbo with Vision model deployed in one of the regions that support GPT-4 Turbo with Vision: Australia East, Switzerland North, Sweden Central, and West US. When you deploy from your project's **Deployments** page, select: `gpt-4` as the model name and `vision-preview` as the model version.

## Connection

Setup connections to provisioned resources in prompt flow.

| Type        | Name     | API KEY  | API Type | API Version |
|-------------|----------|----------|----------|-------------|
| AzureOpenAI | Required | Required | Required | Required    |

## Inputs

| Name                   | Type        | Description                                                                                    | Required |
|------------------------|-------------|------------------------------------------------------------------------------------------------|----------|
| connection             | AzureOpenAI | the Azure OpenAI connection to be used in the tool                                              | Yes      |
| deployment\_name       | string      | the language model to use                                                                      | Yes      |
| prompt                 | string      | The text prompt that the language model will use to generate its response.                    | Yes      |
| max\_tokens            | integer     | the maximum number of tokens to generate in the response. Default is 512.                      | No       |
| temperature            | float       | the randomness of the generated text. Default is 1.                                            | No       |
| stop                   | list        | the stopping sequence for the generated text. Default is null.                                 | No       |
| top_p                  | float       | the probability of using the top choice from the generated tokens. Default is 1.               | No       |
| presence\_penalty      | float       | value that controls the model's behavior with regard to repeating phrases. Default is 0.      | No       |
| frequency\_penalty     | float       | value that controls the model's behavior with regard to generating rare phrases. Default is 0. | No       |

## Outputs

| Return Type | Description                              |
|-------------|------------------------------------------|
| string      | The text of one response of conversation |
