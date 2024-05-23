---
title: LLM tool for flows in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article introduces you to the large language model (LLM) tool for flows in Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
  - build-2024
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: keli19
ms.author: lagayhar
author: lgayhardt
---

# LLM tool for flows in Azure AI Studio

[!INCLUDE [Feature preview](../../includes/feature-preview.md)]

To use large language models (LLMs) for natural language processing, you use the prompt flow LLM tool.

> [!NOTE]
> For embeddings to convert text into dense vector representations for various natural language processing tasks, see [Embedding tool](embedding-tool.md).

## Prerequisites

Prepare a prompt as described in the [Prompt tool](prompt-tool.md#prerequisites) documentation. The LLM tool and Prompt tool both support [Jinja](https://jinja.palletsprojects.com/en/3.1.x/) templates. For more information and best practices, see [Prompt engineering techniques](../../../ai-services/openai/concepts/advanced-prompt-engineering.md).

## Build with the LLM tool

1. Create or open a flow in [Azure AI Studio](https://ai.azure.com). For more information, see [Create a flow](../flow-develop.md).
1. Select **+ LLM** to add the LLM tool to your flow.

    :::image type="content" source="../../media/prompt-flow/llm-tool.png" alt-text="Screenshot that shows the LLM tool added to a flow in Azure AI Studio." lightbox="../../media/prompt-flow/llm-tool.png":::

1. Select the connection to one of your provisioned resources. For example, select **Default_AzureOpenAI**.
1. From the **Api** dropdown list, select **chat** or **completion**.
1. Enter values for the LLM tool input parameters described in the [Text completion inputs table](#inputs). If you selected the **chat** API, see the [Chat inputs table](#chat-inputs). If you selected the **completion** API, see the [Text completion inputs table](#text-completion-inputs). For information about how to prepare the prompt input, see [Prerequisites](#prerequisites).
1. Add more tools to your flow, as needed. Or select **Run** to run the flow.
1. The outputs are described in the [Outputs table](#outputs).

## Inputs

The following input parameters are available.

### Text completion inputs

| Name                   | Type        | Description                                                                             | Required |
|------------------------|-------------|-----------------------------------------------------------------------------------------|----------|
| prompt                 | string      | Text prompt for the language model.                                                      | Yes      |
| model, deployment_name | string      | The language model to use.                                                               | Yes      |
| max\_tokens            | integer     | The maximum number of tokens to generate in the completion. Default is 16.              | No       |
| temperature            | float       | The randomness of the generated text. Default is 1.                                     | No       |
| stop                   | list        | The stopping sequence for the generated text. Default is null.                          | No       |
| suffix                 | string      | The text appended to the end of the completion.                                              | No       |
| top_p                  | float       | The probability of using the top choice from the generated tokens. Default is 1.        | No       |
| logprobs               | integer     | The number of log probabilities to generate. Default is null.                           | No       |
| echo                   | boolean     | The value that indicates whether to echo back the prompt in the response. Default is false. | No       |
| presence\_penalty      | float       | The value that controls the model's behavior regarding repeating phrases. Default is 0.  | No       |
| frequency\_penalty     | float       | The value that controls the model's behavior regarding generating rare phrases. Default is 0. | No       |
| best\_of               | integer     | The number of best completions to generate. Default is 1.                               | No       |
| logit\_bias            | dictionary  | The logit bias for the language model. Default is empty dictionary.                     | No       |

### Chat inputs

| Name                   | Type        | Description                                                                                    | Required |
|------------------------|-------------|------------------------------------------------------------------------------------------------|----------|
| prompt                 | string      | The text prompt that the language model should reply to.                                              | Yes      |
| model, deployment_name | string      | The language model to use.                                                                      | Yes      |
| max\_tokens            | integer     | The maximum number of tokens to generate in the response. Default is inf.                      | No       |
| temperature            | float       | The randomness of the generated text. Default is 1.                                            | No       |
| stop                   | list        | The stopping sequence for the generated text. Default is null.                                 | No       |
| top_p                  | float       | The probability of using the top choice from the generated tokens. Default is 1.               | No       |
| presence\_penalty      | float       | The value that controls the model's behavior regarding repeating phrases. Default is 0.      | No       |
| frequency\_penalty     | float       | The value that controls the model's behavior regarding generating rare phrases. Default is 0. | No       |
| logit\_bias            | dictionary  | The logit bias for the language model. Default is empty dictionary.                            | No       |

## Outputs

The output varies depending on the API you selected for inputs.

| API        | Return type | Description                              |
|------------|-------------|------------------------------------------|
| Completion | string      | The text of one predicted completion.     |
| Chat       | string      | The text of one response of conversation. |

## Next steps

- [Learn more about how to create a flow](../flow-develop.md)
