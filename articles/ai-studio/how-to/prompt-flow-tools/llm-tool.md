---
title: LLM tool for flows in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article introduces you to the large language model (LLM) tool for flows in Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 2/22/2024
ms.reviewer: keli19
ms.author: lagayhar
author: lgayhardt
---

# LLM tool for flows in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../../includes/preview-ai-studio.md)]

The large language model (LLM) tool in prompt flow enables you to take advantage of widely used large language models like [OpenAI](https://platform.openai.com/), [Azure OpenAI Service](../../../ai-services/openai/overview.md), and models in [Azure AI Studio model catalog](../model-catalog.md) for natural language processing.
> [!NOTE]
> The previous version of the LLM tool is now being deprecated. Please upgrade to latest [promptflow-tools](https://pypi.org/project/promptflow-tools/) package to consume new llm tools.

Prompt flow provides a few different large language model APIs:

- [Completion](https://platform.openai.com/docs/api-reference/completions): OpenAI's completion models generate text based on provided prompts.
- [Chat](https://platform.openai.com/docs/api-reference/chat): OpenAI's chat models facilitate interactive conversations with text-based inputs and responses.

> [!NOTE]
> Don't use non-ascii characters in resource group name of Azure OpenAI resource, prompt flow didn't support this case.

## Prerequisites

Create OpenAI resources, Azure OpenAI resources, or MaaS deployment with the LLM models (for example: llama2, mistral, cohere etc.) in Azure AI Studio model catalog:

- **OpenAI**:

    - Sign up your account on the [OpenAI website](https://openai.com/).
    - Sign in and [find your personal API key](https://platform.openai.com/account/api-keys).

- **Azure OpenAI**:

    - [Create Azure OpenAI resources](../../../ai-services/openai/how-to/create-resource.md).

- **MaaS deployment**:

    [Create MaaS deployment for models in Azure AI Studio model catalog](../../concepts/deployments-overview.md#deploy-models-with-model-as-a-service).

    You can create serverless connection to use this MaaS deployment.

## Connections

Set up connections to provisioned resources in prompt flow.

| Type        | Name     | API key  | API base | API type | API version |
|-------------|----------|----------|----------|----------|-------------|
| OpenAI      | Required | Required | -        | -        | -           |
| Azure OpenAI| Required | Required | Required | Required | Required    |
| Serverless  | Required | Required | Required | -        | -           |

  > [!TIP]
  > - To use Microsoft Entra ID auth type for Azure OpenAI connection, you need assign either the `Cognitive Services OpenAI User` or `Cognitive Services OpenAI Contributor role` to user or user assigned managed identity.
  > - Learn more about [how to specify to use user identity to submit flow run](../create-manage-runtime.md#create-an-automatic-runtime-on-a-flow-page).
  > - Learn more about [How to configure Azure OpenAI Service with managed identities](../../../ai-services/openai/how-to/managed-identity.md).

## Build with the LLM tool

1. Create or open a flow in [Azure AI Studio](https://ai.azure.com). For more information, see [Create a flow](../flow-develop.md).
1. Select **+ LLM** to add the LLM tool to your flow.

    :::image type="content" source="../../media/prompt-flow/llm-tool.png" alt-text="Screenshot that shows the LLM tool added to a flow in Azure AI Studio." lightbox="../../media/prompt-flow/llm-tool.png":::

1. Select the connection to one of your provisioned resources. For example, select **Default_AzureOpenAI**.
1. From the **Api** dropdown list, select **chat** or **completion**.
1. Enter values for the LLM tool input parameters described in the [Text completion inputs table](#inputs). If you selected the **chat** API, see the [Chat inputs table](#chat-inputs). If you selected the **completion** API, see the [Text completion inputs table](#text-completion-inputs). For information about how to prepare the prompt input, see [How to write a prompt](#how-to-write-a-prompt).
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
| tool\_choice           | object      | Value that controls which tool is called by the model. Default is null.                        | No       |
| tools                  | list        | A list of tools the model may generate JSON inputs for. Default is null.                       | No       |
| response_format        | object      | An object specifying the format that the model must output. Default is null.                   | No       |

## Outputs

The output varies depending on the API you selected for inputs.

| Return type | Description                              |
|-------------|------------------------------------------|
| string      | Text of one predicted completion or response of conversation |

## How to write a prompt?

Prepare a prompt as described in the [Prompt tool](prompt-tool.md#prerequisites) documentation. The LLM tool and Prompt tool both support [Jinja](https://jinja.palletsprojects.com/en/3.1.x/) templates. For more information and best practices, see [Prompt engineering techniques](../../../ai-services/openai/concepts/advanced-prompt-engineering.md).

For example, for a chat prompt we offer a method to distinguish between different roles in a chat prompt, such as "system", "user", "assistant" and "tool". The "system", "user", "assistant" roles can have "name" and "content" properties. The "tool" role, however, should have "tool_call_id" and "content" properties. For an example of a tool chat prompt, please refer to [Sample 3](#sample-3).

### Sample 1
```jinja
# system:
You are a helpful assistant.

{% for item in chat_history %}
# user:
{{item.inputs.question}}
# assistant:
{{item.outputs.answer}}
{% endfor %}

# user:
{{question}}
```

In LLM tool, the prompt is transformed to match the [OpenAI messages](https://platform.openai.com/docs/api-reference/chat/create#chat-create-messages) structure before sending to OpenAI chat API.

```
[
    {
        "role": "system",
        "content": "You are a helpful assistant."
    },
    {
        "role": "user",
        "content": "<question-of-chat-history-round-1>"
    },
    {
        "role": "assistant",
        "content": "<answer-of-chat-history-round-1>"
    },
    ...
    {
        "role": "user",
        "content": "<question>"
    }
]
```

### Sample 2
```jinja
# system:
{# For role naming customization, the following syntax is used #}
## name:
Alice
## content:
You are a bot can tell good jokes.
```

In LLM tool, the prompt is transformed to match the [openai messages](https://platform.openai.com/docs/api-reference/chat/create#chat-create-messages) structure before sending to openai chat API.

```
[
    {
        "role": "system",
        "name": "Alice",
        "content": "You are a bot can tell good jokes."
    }
]
```

### Sample 3
This sample illustrates how to write a tool chat prompt.
```jinja
# system:
You are a helpful assistant.
# user:
What is the current weather like in Boston?
# assistant:
{# The assistant message with 'tool_calls' must be followed by messages with role 'tool'. #}
## tool_calls:
{{llm_output.tool_calls}}
# tool:
{#
Messages with role 'tool' must be a response to a preceding message with 'tool_calls'.
Additionally, 'tool_call_id's should match ids of assistant message 'tool_calls'.
#}
## tool_call_id:
{{llm_output.tool_calls[0].id}}
## content:
{{tool-answer-of-last-question}}
# user:
{{question}}
```

In LLM tool, the prompt is transformed to match the [openai messages](https://platform.openai.com/docs/api-reference/chat/create#chat-create-messages) structure before sending to openai chat API.

```
[
    {
        "role": "system",
        "content": "You are a helpful assistant."
    },
    {
        "role": "user",
        "content": "What is the current weather like in Boston?"
    },
    {
        "role": "assistant",
        "content": null,
        "function_call": null,
        "tool_calls": [
            {
                "id": "<tool-call-id-of-last-question>",
                "type": "function",
                "function": "<function-to-call-of-last-question>"
            }
        ]
    },
    {
        "role": "tool",
        "tool_call_id": "<tool-call-id-of-last-question>",
        "content": "<tool-answer-of-last-question>"
    }
    ...
    {
        "role": "user",
        "content": "<question>"
    }
]
```

## Next steps

- [Learn more about how to create a flow](../flow-develop.md)
