---
title: LLM tool for flows in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article introduces the LLM tool for flows in Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 11/15/2023
ms.reviewer: eur
ms.author: eur
---

# LLM tool for flows in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../../includes/preview-ai-studio.md)]

The prompt flow *LLM* tool enables you to use large language models (LLM) for natural language processing.

> [!NOTE]
> For embeddings to convert text into dense vector representations for various natural language processing tasks, see [Embedding tool](embedding-tool.md).

## Prerequisites

Prepare a prompt as described in the [prompt tool](prompt-tool.md#prerequisites) documentation. The LLM tool and Prompt tool both support [Jinja](https://jinja.palletsprojects.com/en/3.1.x/) templates. For more information and best practices, see [prompt engineering techniques](../../../ai-services/openai/concepts/advanced-prompt-engineering.md).

## Build with the LLM tool

1. Create or open a flow in Azure AI Studio. For more information, see [Create a flow](../flow-develop.md).
1. Select **+ LLM** to add the LLM tool to your flow.

    :::image type="content" source="../../media/prompt-flow/llm-tool.png" alt-text="Screenshot of the LLM tool added to a flow in Azure AI Studio." lightbox="../../media/prompt-flow/llm-tool.png":::

1. Select the connection to one of your provisioned resources. For example, select **Default_AzureOpenAI**.
1. From the **Api** drop-down list, select *chat* or *completion*. 
1. Enter values for the LLM tool input parameters described [here](#inputs). If you selected the *chat* API, see [chat inputs](#chat-inputs). If you selected the *completion* API, see [text completion inputs](#text-completion-inputs). For information about how to prepare the prompt input, see [prerequisites](#prerequisites).
1. Add more tools to your flow as needed, or select **Run** to run the flow.
1. The outputs are described [here](#outputs).


## Inputs

The following are available input parameters:

### Text completion inputs

| Name                   | Type        | Description                                                                             | Required |
|------------------------|-------------|-----------------------------------------------------------------------------------------|----------|
| prompt                 | string      | text prompt for the language model                                                      | Yes      |
| model, deployment_name | string      | the language model to use                                                               | Yes      |
| max\_tokens            | integer     | the maximum number of tokens to generate in the completion. Default is 16.              | No       |
| temperature            | float       | the randomness of the generated text. Default is 1.                                     | No       |
| stop                   | list        | the stopping sequence for the generated text. Default is null.                          | No       |
| suffix                 | string      | text appended to the end of the completion                                              | No       |
| top_p                  | float       | the probability of using the top choice from the generated tokens. Default is 1.        | No       |
| logprobs               | integer     | the number of log probabilities to generate. Default is null.                           | No       |
| echo                   | boolean     | value that indicates whether to echo back the prompt in the response. Default is false. | No       |
| presence\_penalty      | float       | value that controls the model's behavior regarding repeating phrases. Default is 0.  | No       |
| frequency\_penalty     | float       | value that controls the model's behavior regarding generating rare phrases. Default is 0. | No       |
| best\_of               | integer     | the number of best completions to generate. Default is 1.                               | No       |
| logit\_bias            | dictionary  | the logit bias for the language model. Default is empty dictionary.                     | No       |


### Chat inputs

| Name                   | Type        | Description                                                                                    | Required |
|------------------------|-------------|------------------------------------------------------------------------------------------------|----------|
| prompt                 | string      | text prompt that the language model should reply to                                              | Yes      |
| model, deployment_name | string      | the language model to use                                                                      | Yes      |
| max\_tokens            | integer     | the maximum number of tokens to generate in the response. Default is inf.                      | No       |
| temperature            | float       | the randomness of the generated text. Default is 1.                                            | No       |
| stop                   | list        | the stopping sequence for the generated text. Default is null.                                 | No       |
| top_p                  | float       | the probability of using the top choice from the generated tokens. Default is 1.               | No       |
| presence\_penalty      | float       | value that controls the model's behavior regarding repeating phrases. Default is 0.      | No       |
| frequency\_penalty     | float       | value that controls the model's behavior regarding generating rare phrases. Default is 0. | No       |
| logit\_bias            | dictionary  | the logit bias for the language model. Default is empty dictionary.                            | No       |

## Outputs

The output varies depending on the API you selected for inputs.

| API        | Return Type | Description                              |
|------------|-------------|------------------------------------------|
| Completion | string      | The text of one predicted completion     |
| Chat       | string      | The text of one response of conversation |

## Next steps

- [Learn more about how to create a flow](../flow-develop.md)
