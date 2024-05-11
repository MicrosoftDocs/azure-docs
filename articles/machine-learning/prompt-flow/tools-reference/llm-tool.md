---
title: LLM tool in Azure Machine Learning prompt flow
titleSuffix: Azure Machine Learning
description: The prompt flow LLM tool enables you to take advantage of widely used large language models like OpenAI or Azure OpenAI for natural language processing.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.custom:
  - ignite-2023
ms.topic: reference
author: likebupt
ms.author: keli19
ms.reviewer: lagayhar
ms.date: 11/02/2023
---

# LLM tool

The large language model (LLM) tool in prompt flow enables you to take advantage of widely used large language models like [OpenAI](https://platform.openai.com/), [Azure OpenAI Service](../../../ai-services/openai/overview.md), and models in [Azure Machine Learning studio model catalog](../../concept-model-catalog.md) for natural language processing.
> [!NOTE]
> The previous version of the LLM tool is now being deprecated. Upgrade to latest [promptflow-tools](https://pypi.org/project/promptflow-tools/) package to consume new LLM tools.

Prompt flow provides a few different large language model APIs:

- [Completion](https://platform.openai.com/docs/api-reference/completions): OpenAI's completion models generate text based on provided prompts.
- [Chat](https://platform.openai.com/docs/api-reference/chat): OpenAI's chat models facilitate interactive conversations with text-based inputs and responses.

> [!NOTE]
> Please don't use non-ascii characters in resource group name of Azure OpenAI resource, prompt flow didn't support this case.

## Prerequisites

Create OpenAI resources, Azure OpenAI resources or MaaS deployment with the LLM models (for example: llama2, mistral, cohere etc.) in Azure AI Studio model catalog:

- **OpenAI**:

    - Sign up your account on the [OpenAI website](https://openai.com/).
    - Sign in and [find your personal API key](https://platform.openai.com/account/api-keys).

- **Azure OpenAI**:

    - Create Azure OpenAI resources with [these instructions](../../../ai-services/openai/how-to/create-resource.md).

- **MaaS deployment**:

    Create MaaS deployment for models in Azure AI Studio model catalog. For example, learn how to [Deploy Meta Llama models with pay-as-you-go](../../how-to-deploy-models-llama.md#deploy-meta-llama-models-with-pay-as-you-go).

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
  > - Learn more about [how to specify to use user identity to submit flow run](../how-to-create-manage-runtime.md#create-an-automatic-runtime-preview-on-a-flow-page).
  > - Learn more about [How to configure Azure OpenAI Service with managed identities](../../../ai-services/openai/how-to/managed-identity.md).

## Inputs

The following sections show various inputs.

### Text completion

| Name                   | Type        | Description                                                                             | Required |
|------------------------|-------------|-----------------------------------------------------------------------------------------|----------|
| prompt                 | string      | Text prompt for the language model.                                     | Yes      |
| model, deployment_name | string      | Language model to use.                                                               | Yes      |
| max\_tokens            | integer     | Maximum number of tokens to generate in the completion. Default is 16.              | No       |
| temperature            | float       | Randomness of the generated text. Default is 1.                                     | No       |
| stop                   | list        | Stopping sequence for the generated text. Default is null.                          | No       |
| suffix                 | string      | Text appended to the end of the completion.                                              | No       |
| top_p                  | float       | Probability of using the top choice from the generated tokens. Default is 1.        | No       |
| logprobs               | integer     | Number of log probabilities to generate. Default is null.                           | No       |
| echo                   | boolean     | Value that indicates whether to echo back the prompt in the response. Default is false. | No       |
| presence\_penalty      | float       | Value that controls the model's behavior for repeating phrases. Default is 0.                              | No       |
| frequency\_penalty     | float       | Value that controls the model's behavior for generating rare phrases. Default is 0.                             | No       |
| best\_of               | integer     | Number of best completions to generate. Default is 1.                               | No       |
| logit\_bias            | dictionary  | Logit bias for the language model. Default is an empty dictionary.                     | No       |

### Chat

| Name                   | Type        | Description                                                                                    | Required |
|------------------------|-------------|------------------------------------------------------------------------------------------------|----------|
| prompt                 | string      | Text prompt that the language model uses for a response.                                              | Yes      |
| model, deployment_name | string      | Language model to use.                                                                      | Yes      |
| max\_tokens            | integer     | Maximum number of tokens to generate in the response. Default is inf.                      | No       |
| temperature            | float       | Randomness of the generated text. Default is 1.                                            | No       |
| stop                   | list        | Stopping sequence for the generated text. Default is null.                                 | No       |
| top_p                  | float       | Probability of using the top choice from the generated tokens. Default is 1.               | No       |
| presence\_penalty      | float       | Value that controls the model's behavior for repeating phrases. Default is 0.      | No       |
| frequency\_penalty     | float       | Value that controls the model's behavior for generating rare phrases. Default is 0. | No       |
| logit\_bias            | dictionary  | Logit bias for the language model. Default is an empty dictionary.                            | No       |
| tool\_choice           | object      | value that controls which tool is called by the model. Default is null.                        | No       |
| tools                  | list        | a list of tools the model may generate JSON inputs for. Default is null.                       | No       |
| response_format        | object      | an object specifying the format that the model must output. Default is null.                   | No       |

## Outputs

| Return type | Description                              |
|-------------|------------------------------------------|
| string      | Text of one predicted completion or response of conversation |

## Use the LLM tool

1. Set up and select the connections to OpenAI, Azure OpenAI, or MaaS deployment resources.
1. Configure the large language model API and its parameters.
1. Prepare the prompt with [guidance](prompt-tool.md#write-a-prompt).

## How to write a chat prompt?

_To grasp the fundamentals of creating a chat prompt, begin with the [Write a prompt section](prompt-tool.md#write-a-prompt) for an introductory understanding of Jinja._

We offer a method to distinguish between different roles in a chat prompt, such as "system", "user", "assistant" and "tool". The "system", "user", "assistant" roles can have "name" and "content" properties. The "tool" role, however, should have "tool_call_id" and "content" properties. For an example of a tool chat prompt, please refer to [Sample 3](#sample-3).

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

In LLM tool, the prompt is transformed to match the [OpenAI messages](https://platform.openai.com/docs/api-reference/chat/create#chat-create-messages) structure before sending to OpenAI chat API.

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

In LLM tool, the prompt is transformed to match the [OpenAI messages](https://platform.openai.com/docs/api-reference/chat/create#chat-create-messages) structure before sending to OpenAI chat API.

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
