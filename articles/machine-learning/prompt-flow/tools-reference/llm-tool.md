---
title: LLM tool in Azure Machine Learning prompt flow (preview)
titleSuffix: Azure Machine Learning
description: Prompt flow LLM tool enables you to leverage widely used large language models like OpenAI or Azure OpenAI (AOAI) for natural language processing.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
author: likebupt
ms.author: keli19
ms.reviewer: lagayhar
ms.date: 06/30/2023
---

# LLM tool (preview)

Prompt flow LLM tool enables you to leverage widely used large language models like [OpenAI](https://platform.openai.com/) or [Azure OpenAI (AOAI)](../../../cognitive-services/openai/overview.md) for natural language processing.

Prompt flow provides a few different LLM APIs:
- **[Completion](https://platform.openai.com/docs/api-reference/completions)**: OpenAI's completion models generate text based on provided prompts.
- **[Chat](https://platform.openai.com/docs/api-reference/chat)**: OpenAI's chat models facilitate interactive conversations with text-based inputs and responses.

> [!NOTE]
> We now remove the `embedding` option from LLM tool api setting. You can use embedding api with [Embedding tool](embedding-tool.md).

> [!IMPORTANT]
> Prompt flow is currently in public preview. This preview is provided without a service-level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisite
Create OpenAI resources:

- **OpenAI**

    Sign up account [OpenAI website](https://openai.com/)
    Sign in and [Find personal API key](https://platform.openai.com/account/api-keys)

- **Azure OpenAI (AOAI)**

    [Create Azure OpenAI resources](../../../cognitive-services/openai/how-to/create-resource.md?pivots=web-portal).

## **Connections**

Set up connections to provisioned resources in Prompt flow.

| Type        | Name     | API KEY  | API Type | API Version |
|-------------|----------|----------|----------|-------------|
| OpenAI      | Required | Required | -        | -           |
| AzureOpenAI | Required | Required | Required | Required    |

## Inputs

### Text Completion

| Name                   | Type        | Description                                                                             | Required |
|------------------------|-------------|-----------------------------------------------------------------------------------------|----------|
| prompt                 | string      | text prompt that the language model will complete                                       | Yes      |
| model, deployment_name | string      | the language model to use                                                               | Yes      |
| max\_tokens            | integer     | the maximum number of tokens to generate in the completion. Default is 16.              | No       |
| temperature            | float       | the randomness of the generated text. Default is 1.                                     | No       |
| stop                   | list        | the stopping sequence for the generated text. Default is null.                          | No       |
| suffix                 | string      | text appended to the end of the completion                                              | No       |
| top_p                  | float       | the probability of using the top choice from the generated tokens. Default is 1.        | No       |
| logprobs               | integer     | the number of log probabilities to generate. Default is null.                           | No       |
| echo                   | boolean     | value that indicates whether to echo back the prompt in the response. Default is false. | No       |
| presence\_penalty      | float       | value that controls the model's behavior with regard to repeating phrases. Default is 0.                              | No       |
| frequency\_penalty     | float       | value that controls the model's behavior with regard to generating rare phrases. Default is 0.                             | No       |
| best\_of               | integer     | the number of best completions to generate. Default is 1.                               | No       |
| logit\_bias            | dictionary  | the logit bias for the language model. Default is empty dictionary.                     | No       |


### Chat


| Name                   | Type        | Description                                                                                    | Required |
|------------------------|-------------|------------------------------------------------------------------------------------------------|----------|
| prompt                 | string      | text prompt that the language model will response                                              | Yes      |
| model, deployment_name | string      | the language model to use                                                                      | Yes      |
| max\_tokens            | integer     | the maximum number of tokens to generate in the response. Default is inf.                      | No       |
| temperature            | float       | the randomness of the generated text. Default is 1.                                            | No       |
| stop                   | list        | the stopping sequence for the generated text. Default is null.                                 | No       |
| top_p                  | float       | the probability of using the top choice from the generated tokens. Default is 1.               | No       |
| presence\_penalty      | float       | value that controls the model's behavior with regard to repeating phrases. Default is 0.      | No       |
| frequency\_penalty     | float       | value that controls the model's behavior with regard to generating rare phrases. Default is 0. | No       |
| logit\_bias            | dictionary  | the logit bias for the language model. Default is empty dictionary.                            | No       |

## Outputs

| API        | Return Type | Description                              |
|------------|-------------|------------------------------------------|
| Completion | string      | The text of one predicted completion     |
| Chat       | string      | The text of one response of conversation |

## How to use LLM Tool?

1. Setup and select the connections to OpenAI resources
2. Configure LLM model api and its parameters
3. Prepare the Prompt with [guidance](prompt-tool.md#how-to-write-prompt).