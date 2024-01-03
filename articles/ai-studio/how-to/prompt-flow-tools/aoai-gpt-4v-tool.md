---
title: Azure OpenAI GPT-4 Turbo with Vision tool in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article introduces the Azure OpenAI GPT-4 Turbo with Vision tool for flows in Azure AI Studio.
ms.service: azure-ai-studio
ms.topic: reference
author: likebupt
ms.author: keli19
ms.reviewer: eur
ms.date: 01/02/2024
---

# Azure OpenAI GPT-4 Turbo with Vision tool (preview) in Azure AI studio

Azure OpenAI GPT-4 Turbo with Vision tool enables you to leverage your AzureOpenAI GPT-4 Turbo with Vision model deployment to analyze images and provide textual responses to questions about them.

## Prerequisites

- Create a GPT-4 Turbo with Vision deployment

    In AI studio, select **Deployments** from the left navigation pane and create a deployment by selecting model name: `gpt-4v`.

## Connection

Setup connections to provisioned resources in prompt flow.

| Type        | Name     | API KEY  | API Type | API Version |
|-------------|----------|----------|----------|-------------|
| AzureOpenAI | Required | Required | Required | Required    |

## Inputs

| Name                   | Type        | Description                                                                                    | Required |
|------------------------|-------------|------------------------------------------------------------------------------------------------|----------|
| connection             | AzureOpenAI | the AzureOpenAI connection to be used in the tool                                              | Yes      |
| deployment\_name       | string      | the language model to use                                                                      | Yes      |
| prompt                 | string      | The text prompt that the language model will use to generate it's response.                    | Yes      |
| max\_tokens            | integer     | the maximum number of tokens to generate in the response. Default is 512.                      | No       |
| temperature            | float       | the randomness of the generated text. Default is 1.                                            | No       |
| stop                   | list        | the stopping sequence for the generated text. Default is null.                                 | No       |
| top_p                  | float       | the probability of using the top choice from the generated tokens. Default is 1.               | No       |
| presence\_penalty      | float       | value that controls the model's behavior with regards to repeating phrases. Default is 0.      | No       |
| frequency\_penalty     | float       | value that controls the model's behavior with regards to generating rare phrases. Default is 0. | No       |

## Outputs

| Return Type | Description                              |
|-------------|------------------------------------------|
| string      | The text of one response of conversation |
