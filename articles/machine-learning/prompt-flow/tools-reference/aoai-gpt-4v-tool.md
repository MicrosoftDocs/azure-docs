---
title: Azure OpenAI GPT-4 Turbo with Vision tool in Azure Machine Learning prompt flow
titleSuffix: Azure Machine Learning
description: The prompt flow Azure OpenAI GPT-4 Turbo with Vision tool enables you to leverage AzureOpenAI GPT-4 Turbo with Vision model deployment to analyze images and provide textual responses to questions about them.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.topic: reference
author: likebupt
ms.author: keli19
ms.reviewer: lagayhar
ms.date: 01/02/2024
---

# Azure OpenAI GPT-4 Turbo with Vision tool (preview)

Azure OpenAI GPT-4 Turbo with Vision tool enables you to leverage your AzureOpenAI GPT-4 Turbo with Vision model deployment to analyze images and provide textual responses to questions about them.

> [!IMPORTANT]
> Azure OpenAI GPT-4 Turbo with Vision tool is currently in public preview. This preview is provided without a service-level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- Create AzureOpenAI resources

    Create Azure OpenAI resources with [instruction](../../../ai-services/openai/how-to/create-resource.md).

- Create a GPT-4 Turbo with Vision deployment

    Go to [Azure OpenAI Studio](https://oai.azure.com/) and sign in with the credentials associated with your Azure OpenAI resource. During or after the sign-in workflow, select the appropriate directory, Azure subscription, and Azure OpenAI resource.

    Under Management, select Deployments and Create a GPT-4 Turbo with Vision deployment by selecting model name: `gpt-4` and model version `vision-preview`.

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
