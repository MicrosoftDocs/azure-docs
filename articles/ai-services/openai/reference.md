---
title: Azure OpenAI Service REST API reference
titleSuffix: Azure OpenAI
description: Learn how to use Azure OpenAI's REST API. In this article, you learn about authorization options,  how to structure a request and receive a response.
manager: nitinme
ms.service: azure-ai-openai
ms.topic: conceptual
ms.date: 05/20/2024
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
ms.custom:
  - ignite-2023
---

# Azure OpenAI Service REST API reference

This article provides details on the inference REST API endpoints for Azure OpenAI.

## Authentication

Azure OpenAI provides two methods for authentication. You can use  either API Keys or Microsoft Entra ID.

- **API Key authentication**: For this type of authentication, all API requests must include the API Key in the ```api-key``` HTTP header. The [Quickstart](./quickstart.md) provides guidance for how to make calls with this type of authentication.

- **Microsoft Entra ID authentication**: You can authenticate an API call using a Microsoft Entra token. Authentication tokens are included in a request as the ```Authorization``` header. The token provided must be preceded by ```Bearer```, for example ```Bearer YOUR_AUTH_TOKEN```. You can read our how-to guide on [authenticating with Microsoft Entra ID](./how-to/managed-identity.md).

### REST API versioning

The service APIs are versioned using the ```api-version``` query parameter. All versions follow the YYYY-MM-DD date structure. For example:

```http
POST https://YOUR_RESOURCE_NAME.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT_NAME/completions?api-version=2024-02-01
```

## Completions

With the Completions operation, the model generates one or more predicted completions based on a provided prompt. The service can also return the probabilities of alternative tokens at each position.

**Create a completion**

```http
POST https://{your-resource-name}.openai.azure.com/openai/deployments/{deployment-id}/completions?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```deployment-id``` | string | Required | The deployment name you chose when you deployed the model.|
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD format.|

**Supported versions**

- `2022-12-01` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/stable/2022-12-01/inference.json)
- `2023-03-15-preview` (retiring July 1, 2024) [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-03-15-preview/inference.json)
- `2023-05-15` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/stable/2023-05-15/inference.json)
- `2023-06-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-06-01-preview/inference.json)
- `2023-07-01-preview` (retiring July 1, 2024) [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-07-01-preview/inference.json)
- `2023-08-01-preview` (retiring July 1, 2024) [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-08-01-preview/inference.json)
- `2023-09-01-preview` (retiring July 1, 2024) [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-09-01-preview/inference.json)
- `2023-10-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-10-01-preview/inference.json)
- `2023-12-01-preview` (retiring July 1, 2024) [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-12-01-preview/inference.json)
- `2024-02-15-preview`[Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-02-15-preview/inference.json)
- `2024-03-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-03-01-preview/inference.json)
- `2024-04-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-04-01-preview/inference.json)
- `2024-05-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-05-01-preview/inference.json)
- `2024-02-01` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/stable/2024-02-01/inference.json)

**Request body**

| Parameter | Type | Required? | Default | Description |
|--|--|--|--|--|
| ```prompt``` | string or array | Optional | ```<\|endoftext\|>``` | The prompt or prompts to generate completions for, encoded as a string, or array of strings. ```<\|endoftext\|>``` is the document separator that the model sees during training, so if a prompt isn't specified the model generates as if from the beginning of a new document. |
| ```max_tokens``` | integer | Optional | 16 | The maximum number of tokens to generate in the completion. The token count of your prompt plus max_tokens can't exceed the model's context length. Most models have a context length of 2048 tokens (except for the newest models, which support 4096). |
| ```temperature``` | number | Optional | 1 | What sampling temperature to use, between 0 and 2. Higher values mean the model takes more risks. Try 0.9 for more creative applications, and 0 (`argmax sampling`) for ones with a well-defined answer. We generally recommend altering this or top_p but not both. |
| ```top_p``` | number | Optional | 1 | An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or temperature but not both. |
| ```logit_bias``` | map | Optional | null | Modify the likelihood of specified tokens appearing in the completion. Accepts a json object that maps tokens (specified by their token ID in the GPT tokenizer) to an associated bias value from -100 to 100. You can use this tokenizer tool (which works for both GPT-2 and GPT-3) to convert text to token IDs. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect varies per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token. As an example, you can pass {"50256": -100} to prevent the <\|endoftext\|> token from being generated. |
| ```user``` | string | Optional | | A unique identifier representing your end-user, which can help monitoring and detecting abuse |
| ```n``` | integer | Optional |  1 | How many completions to generate for each prompt. Note: Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for max_tokens and stop. |
| ```stream``` | boolean | Optional | False | Whether to stream back partial progress. If set, tokens are sent as data-only server-sent events as they become available, with the stream terminated by a data: [DONE] message.| 
| ```logprobs``` | integer | Optional | null | Include the log probabilities on the logprobs most likely tokens, as well the chosen tokens. For example, if logprobs is 10, the API will return a list of the 10 most likely tokens. The API will always return the logprob of the sampled token, so there might be up to logprobs+1 elements in the response. This parameter cannot be used with `gpt-35-turbo`. |
| ```suffix```| string | Optional | null | The suffix that comes after a completion of inserted text. |
| ```echo``` | boolean | Optional | False | Echo back the prompt in addition to the completion. This parameter cannot be used with `gpt-35-turbo`. |
| ```stop``` | string or array | Optional | null | Up to four sequences where the API will stop generating further tokens. The returned text won't contain the stop sequence. For GPT-4 Turbo with Vision, up to two sequences are supported. |
| ```presence_penalty``` | number | Optional | 0 | Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics. |
| ```frequency_penalty``` | number | Optional | 0 | Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim. |
| ```best_of``` | integer | Optional | 1 | Generates best_of completions server-side and returns the "best" (the one with the lowest log probability per token). Results can't be streamed. When used with n, best_of controls the number of candidate completions and n specifies how many to return – best_of must be greater than n. Note: Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for max_tokens and stop. This parameter cannot be used with `gpt-35-turbo`. |

#### Example request

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT_NAME/completions?api-version=2024-02-01\
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_API_KEY" \
  -d "{
  \"prompt\": \"Once upon a time\",
  \"max_tokens\": 5
}"
```

#### Example response

```json
{
    "id": "cmpl-4kGh7iXtjW4lc9eGhff6Hp8C7btdQ",
    "object": "text_completion",
    "created": 1646932609,
    "model": "ada",
    "choices": [
        {
            "text": ", a dark line crossed",
            "index": 0,
            "logprobs": null,
            "finish_reason": "length"
        }
    ]
}
```

In the example response, `finish_reason` equals `stop`. If `finish_reason` equals `content_filter` consult our [content filtering guide](./concepts/content-filter.md) to understand why this is occurring.

## Embeddings
Get a vector representation of a given input that can be easily consumed by machine learning models and other algorithms.

> [!NOTE]
> OpenAI currently allows a larger number of array inputs with `text-embedding-ada-002`. Azure OpenAI currently supports input arrays up to 16 for `text-embedding-ada-002 (Version 2)`. Both require the max input token limit per API request to remain under 8191 for this model.

**Create an embedding**

```http
POST https://{your-resource-name}.openai.azure.com/openai/deployments/{deployment-id}/embeddings?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```deployment-id``` | string | Required | The name of your model deployment. You're required to first deploy a model before you can make calls. |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD format. |

**Supported versions**

- `2023-03-15-preview` (retiring July 1, 2024) [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-03-15-preview/inference.json)
- `2023-05-15` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/stable/2023-05-15/inference.json)
- `2023-06-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-06-01-preview/inference.json)
- `2023-07-01-preview` (retiring July 1, 2024) [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-07-01-preview/inference.json)
- `2023-08-01-preview` (retiring July 1, 2024) [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-08-01-preview/inference.json)
- `2023-09-01-preview` (retiring July 1, 2024) [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-09-01-preview/inference.json)
- `2023-10-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-10-01-preview/inference.json)
- `2023-12-01-preview` (retiring July 1, 2024) [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-12-01-preview/inference.json)
- `2024-02-15-preview`[Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-02-15-preview/inference.json)
- `2024-03-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-03-01-preview/inference.json)
- `2024-04-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-04-01-preview/inference.json)
- `2024-05-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-05-01-preview/inference.json)
- `2024-02-01` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/stable/2024-02-01/inference.json)

**Request body**

| Parameter | Type | Required? | Default | Description |
|--|--|--|--|--|
| ```input```| string or array | Yes | N/A | Input text to get embeddings for, encoded as an array or string. The number of input tokens varies depending on what [model you're using](./concepts/models.md). Only `text-embedding-ada-002 (Version 2)` supports array input.|
| ```user``` | string | No | Null | A unique identifier representing your end-user. This will help Azure OpenAI monitor and detect abuse. **Do not pass PII identifiers instead use pseudoanonymized values such as GUIDs** |
| ```encoding_format```| string | No | `float`| The format to return the embeddings in. Can be either `float` or `base64`. Defaults to `float`. <br><br>[Added in `2024-03-01-preview`].|
| ```dimensions``` | integer | No | | The number of dimensions the resulting output embeddings should have. Only supported in `text-embedding-3` and later models. <br><br>[Added in `2024-03-01-preview`] |

#### Example request

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT_NAME/embeddings?api-version=2024-02-01 \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_API_KEY" \
  -d "{\"input\": \"The food was delicious and the waiter...\"}"
```

#### Example response

```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "embedding": [
        0.018990106880664825,
        -0.0073809814639389515,
        .... (1024 floats total for ada)
        0.021276434883475304,
      ],
      "index": 0
    }
  ],
  "model": "text-similarity-babbage:001"
}
```

## Chat completions

Create completions for chat messages with the GPT-35-Turbo and GPT-4 models. 

**Create chat completions**

```http
POST https://{your-resource-name}.openai.azure.com/openai/deployments/{deployment-id}/chat/completions?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```deployment-id``` | string | Required | The name of your model deployment. You're required to first deploy a model before you can make calls. |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD or YYYY-MM-DD-preview format. |

**Supported versions**

- `2023-03-15-preview` (retiring July 1, 2024) [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-03-15-preview/inference.json)
- `2023-05-15` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/stable/2023-05-15/inference.json)
- `2023-06-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-06-01-preview/inference.json)
- `2023-07-01-preview` (retiring July 1, 2024) [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-07-01-preview/inference.json)
- `2023-08-01-preview` (retiring July 1, 2024) [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-08-01-preview/inference.json)
- `2023-09-01-preview` (retiring July 1, 2024) [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-09-01-preview/inference.json)
- `2023-10-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-10-01-preview/inference.json)
- `2023-12-01-preview` (retiring July 1, 2024) (This version or greater required for Vision scenarios) [Swagger spec](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-12-01-preview)
- `2024-02-15-preview`[Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-02-15-preview/inference.json)
- `2024-03-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-03-01-preview/inference.json)
- `2024-04-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-04-01-preview/inference.json)
- `2024-05-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-05-01-preview/inference.json)
- `2024-02-01` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/stable/2024-02-01/inference.json)

> [!IMPORTANT]
> The `functions` and `function_call` parameters have been deprecated with the release of the [`2023-12-01-preview`](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-12-01-preview/inference.json) version of the API. The replacement for `functions` is the `tools` parameter. The replacement for `function_call` is the `tool_choice` parameter. Parallel function calling which was introduced as part of the [`2023-12-01-preview`](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-12-01-preview/inference.json) is only supported with `gpt-35-turbo` (1106) and `gpt-4` (1106-preview) also known as GPT-4 Turbo Preview. 

| Parameter | Type | Required? | Default | Description |
|--|--|--|--|--|
| ```messages``` | array | Required |  | The collection of context messages associated with this chat completions request. Typical usage begins with a [chat message](#chatmessage) for the System role that provides instructions for the behavior of the assistant, followed by alternating messages between the User and Assistant roles.|
| ```temperature```| number | Optional | 1 | What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. We generally recommend altering this or `top_p` but not both. |
| `role`| string | Yes | N/A | Indicates who is giving the current message. Can be `system`,`user`,`assistant`,`tool`, or `function`.|
| `content` | string or array | Yes | N/A | The content of the message. It must be a string, unless in a Vision-enabled scenario. If it's part of the `user` message, using the GPT-4 Turbo with Vision model, with the latest API version, then `content` must be an array of structures, where each item represents either text or an image: <ul><li> `text`: input text is represented as a structure with the following properties: </li> <ul> <li> `type` = "text" </li> <li> `text` = the input text </li> </ul> <li> `images`: an input image is represented as a structure with the following properties: </li><ul> <li> `type` = "image_url" </li> <li> `image_url` = a structure with the following properties: </li> <ul> <li> `url` = the image URL </li> <li>(optional) `detail` = `high`, `low`, or `auto` </li> </ul> </ul> </ul>|
| `contentPart` | object | No | N/A | Part of a user's multi-modal message. It can be either text type or image type. If text, it will be a text string. If image, it will be a `contentPartImage` object. |
| `contentPartImage` | object | No | N/A | Represents a user-uploaded image. It has a `url` property, which is either a URL of the image or the base 64 encoded image data. It also has a `detail` property which can be `auto`, `low`, or `high`.|
| `enhancements` | object | No | N/A | Represents the Vision enhancement features requested for the chat. It has `grounding` and `ocr` properties, each has a boolean `enabled` property. Use these to request the OCR service and/or the object detection/grounding service [This preview parameter is not available in the `2024-02-01` GA API and is no longer available in preview APIs after `2024-03-01-preview`.]|
| `dataSources` | object | No | N/A | Represents additional resource data. Computer Vision resource data is needed for Vision enhancement. It has a `type` property, which should be `"AzureComputerVision"` and a `parameters` property, which has an `endpoint` and `key` property. These strings should be set to the endpoint URL and access key of your Computer Vision resource.|
| ```n``` | integer | Optional | 1 | How many chat completion choices to generate for each input message. |
| ```stream``` | boolean | Optional | false | If set, partial message deltas will be sent, like in ChatGPT. Tokens will be sent as data-only server-sent events as they become available, with the stream terminated by a `data: [DONE]` message." |
| ```stop``` | string or array | Optional | null | Up to 4 sequences where the API will stop generating further tokens.|
| ```max_tokens``` | integer | Optional | inf | The maximum number of tokens allowed for the generated answer. By default, the number of tokens the model can return will be (4096 - prompt tokens).|
| ```presence_penalty``` | number | Optional | 0 | Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.|
| ```frequency_penalty``` | number | Optional | 0 | Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.|
| ```logit_bias``` | object | Optional | null | Modify the likelihood of specified tokens appearing in the completion. Accepts a json object that maps tokens (specified by their token ID in the tokenizer) to an associated bias value from -100 to 100. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect varies per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.|
| ```user``` | string | Optional | | A unique identifier representing your end-user, which can help Azure OpenAI to monitor and detect abuse.|
|```function_call```|  | Optional | | `[Deprecated in 2023-12-01-preview replacement parameter is tools_choice]`Controls how the model responds to function calls. "none" means the model doesn't call a function, and responds to the end-user. `auto` means the model can pick between an end-user or calling a function. Specifying a particular function via {"name": "my_function"} forces the model to call that function. "none" is the default when no functions are present. `auto` is the default if functions are present. This parameter requires API version [`2023-07-01-preview`](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-07-01-preview/generated.json) |
|```functions``` | [`FunctionDefinition[]`](#functiondefinition-deprecated) | Optional | | `[Deprecated in 2023-12-01-preview replacement paremeter is tools]` A list of functions the model can generate JSON inputs for. This parameter requires API version [`2023-07-01-preview`](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-07-01-preview/generated.json)|
|```tools```| string (The type of the tool. Only [`function`](#function) is supported.)  | Optional | |A list of tools the model can call. Currently, only functions are supported as a tool. Use this to provide a list of functions the model can generate JSON inputs for. This parameter requires API version [`2023-12-01-preview`](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-12-01-preview/generated.json) |
|```tool_choice```| string or object | Optional | none is the default when no functions are present. `auto` is the default if functions are present. | Controls which (if any) function is called by the model. None means the model won't call a function and instead generates a message. `auto` means the model can pick between generating a message or calling a function. Specifying a particular function via {"type: "function", "function": {"name": "my_function"}} forces the model to call that function. This parameter requires API version [`2023-12-01-preview`](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-12-01-preview/inference.json) or later.|
|```top_p``` | number | No | Default:1 <br> Min:0 <br> Max:1 |An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.\nWe generally recommend altering this or `temperature` but not both." |
|```log_probs``` | boolean | No |  | Whether to return log probabilities of the output tokens or not. If true, returns the log probabilities of each output token returned in the `content` of `message`. This option is currently not available on the `gpt-4-vision-preview` model.|
|```top_logprobs``` | integer | No | Min: 0 <br> Max: 5 | An integer between 0 and 5 specifying the number of most likely tokens to return at each token position, each with an associated log probability. `logprobs` must be set to `true` if this parameter is used.|
| ```response_format``` | object | No | | An object specifying the format that the model must output. Used to enable JSON mode. |
|```seed``` | integer | No | 0 | If specified, our system will make a best effort to sample deterministically, such that repeated requests with the same `seed` and parameters should return the same result.Determinism is not guaranteed, and you should refer to the `system_fingerprint` response parameter to monitor changes in the backend.|

Not all parameters are available in every API release.

#### Example request

**Text-only chat**
```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT_NAME/chat/completions?api-version=2024-02-01 \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_API_KEY" \
  -d '{"messages":[{"role": "system", "content": "You are a helpful assistant."},{"role": "user", "content": "Does Azure OpenAI support customer managed keys?"},{"role": "assistant", "content": "Yes, customer managed keys are supported by Azure OpenAI."},{"role": "user", "content": "Do other Azure AI services support this too?"}]}'
```

**Chat with vision**
```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT_NAME/chat/completions?api-version=2023-12-01-preview \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_API_KEY" \
  -d '{"messages":[{"role":"system","content":"You are a helpful assistant."},{"role":"user","content":[{"type":"text","text":"Describe this picture:"},{ "type": "image_url", "image_url": { "url": "https://learn.microsoft.com/azure/ai-services/computer-vision/media/quickstarts/presentation.png", "detail": "high" } }]}]}'
```

**Enhanced chat with vision**

- **Not supported with the GPT-4 Turbo GA model** `gpt-4` **Version:** `turbo-2024-04-09`
- **Not supported wit the** `2024-02-01` **and** `2024-04-01-preview` and newer API releases.

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT_NAME/extensions/chat/completions?api-version=2023-12-01-preview \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_API_KEY" \
  -d '{"enhancements":{"ocr":{"enabled":true},"grounding":{"enabled":true}},"dataSources":[{"type":"AzureComputerVision","parameters":{"endpoint":" <Computer Vision Resource Endpoint> ","key":"<Computer Vision Resource Key>"}}],"messages":[{"role":"system","content":"You are a helpful assistant."},{"role":"user","content":[{"type":"text","text":"Describe this picture:"},{"type":"image_url","image_url":"https://learn.microsoft.com/azure/ai-services/computer-vision/media/quickstarts/presentation.png"}]}]}'
```

#### Example response

```console
{
    "id": "chatcmpl-6v7mkQj980V1yBec6ETrKPRqFjNw9",
    "object": "chat.completion",
    "created": 1679072642,
    "model": "gpt-35-turbo",
    "usage":
    {
        "prompt_tokens": 58,
        "completion_tokens": 68,
        "total_tokens": 126
    },
    "choices":
    [
        {
            "message":
            {
                "role": "assistant",
                "content": "Yes, other Azure AI services also support customer managed keys.
                    Azure AI services offer multiple options for customers to manage keys, such as
                    using Azure Key Vault, customer-managed keys in Azure Key Vault or
                    customer-managed keys through Azure Storage service. This helps customers ensure
                    that their data is secure and access to their services is controlled."
            },
            "finish_reason": "stop",
            "index": 0
        }
    ]
}
```
Output formatting adjusted for ease of reading, actual output is a single block of text without line breaks.

In the example response, `finish_reason` equals `stop`. If `finish_reason` equals `content_filter` consult our [content filtering guide](./concepts/content-filter.md) to understand why this is occurring.

### ChatMessage

A single, role-attributed message within a chat completion interaction.

| Name | Type | Description |
|---|---|---|
| content | string | The text associated with this message payload.|
| function_call | [FunctionCall](#functioncall-deprecated)| The name and arguments of a function that should be called, as generated by the model. |
| name | string | The `name` of the author of this message. `name` is required if role is `function`, and it should be the name of the function whose response is in the `content`. Can contain a-z, A-Z, 0-9, and underscores, with a maximum length of 64 characters.|
|role | [ChatRole](#chatrole) | The role associated with this message payload |

### ChatRole

A description of the intended purpose of a message within a chat completions interaction.

|Name | Type | Description |
|---|---|---|
| assistant | string | The role that provides responses to system-instructed, user-prompted input. |
| function | string | The role that provides function results for chat completions. |
| system | string | The role that instructs or sets the behavior of the assistant. |
| user | string | The role that provides input for chat completions. |

### Function

This is used with the `tools` parameter that was added in API version [`2023-12-01-preview`](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-12-01-preview/inference.json).

|Name | Type | Description |
|---|---|---|
| description | string | A description of what the function does, used by the model to choose when and how to call the function |
| name | string | The name of the function to be called. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64 |
| parameters | object | The parameters the functions accepts, described as a JSON Schema object. See the [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for documentation about the format."|

### FunctionCall-Deprecated

The name and arguments of a function that should be called, as generated by the model. This requires API version [`2023-07-01-preview`](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-07-01-preview/generated.json)

| Name | Type | Description|
|---|---|---|
| arguments | string | The arguments to call the function with, as generated by the model in JSON format. The model doesn't always generate valid JSON, and might fabricate parameters not defined by your function schema. Validate the arguments in your code before calling your function. |
| name | string | The name of the function to call.|

### FunctionDefinition-Deprecated

The definition of a caller-specified function that chat completions can invoke in response to matching user input. This requires API version [`2023-07-01-preview`](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-07-01-preview/generated.json)

|Name | Type| Description|
|---|---|---|
| description | string | A description of what the function does. The model uses this description when selecting the function and interpreting its parameters. |
| name | string | The name of the function to be called. |
| parameters | | The parameters the functions accepts, described as a [JSON Schema](https://json-schema.org/understanding-json-schema/) object.|

## Completions extensions

The documentation for this section has moved. See the [Azure OpenAI On Your Data reference documentation](./references/on-your-data.md) instead.

## Image generation

### Request a generated image (DALL-E 3)

Generate and retrieve a batch of images from a text caption.

```http
POST https://{your-resource-name}.openai.azure.com/openai/deployments/{deployment-id}/images/generations?api-version={api-version} 
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```deployment-id``` | string | Required | The name of your DALL-E 3 model deployment such as *MyDalle3*. You're required to first deploy a DALL-E 3 model before you can make calls. |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD format. |

**Supported versions**

- `2023-12-01-preview (retiring July 1, 2024)` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-12-01-preview/inference.json)
- `2024-02-15-preview`[Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-02-15-preview/inference.json)
- `2024-03-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-03-01-preview/inference.json)
- `2024-04-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-04-01-preview/inference.json)
- `2024-05-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-05-01-preview/inference.json)
- `2024-02-01` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/stable/2024-02-01/inference.json)

**Request body**

| Parameter | Type | Required? | Default | Description |
|--|--|--|--|--|
| `prompt` | string | Required |  | A text description of the desired image(s). The maximum length is 4000 characters. |
| `n` | integer | Optional | 1 | The number of images to generate. Only `n=1` is supported for DALL-E 3. |
| `size` | string | Optional | `1024x1024` | The size of the generated images. Must be one of `1792x1024`, `1024x1024`, or `1024x1792`. |
| `quality` | string | Optional | `standard` | The quality of the generated images. Must be `hd` or `standard`. |
| `response_format` | string | Optional | `url` | The format in which the generated images are returned Must be `url` (a URL pointing to the image) or `b64_json` (the base 64-byte code in JSON format). |
| `style` | string | Optional | `vivid` | The style of the generated images. Must be `natural` or `vivid` (for hyper-realistic / dramatic images). |
| `user` | string | Optional || A unique identifier representing your end-user, which can help to monitor and detect abuse. |

Dalle-2 is now supported in `2024-05-01-preview`.

#### Example request


```console
curl -X POST https://{your-resource-name}.openai.azure.com/openai/deployments/{deployment-id}/images/generations?api-version=2023-12-01-preview \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_API_KEY" \
  -d '{
    "prompt": "An avocado chair",
    "size": "1024x1024",
    "n": 1,
    "quality": "hd", 
    "style": "vivid"
  }'
```

#### Example response

The operation returns a `202` status code and an `GenerateImagesResponse` JSON object containing the ID and status of the operation.

```json
{ 
    "created": 1698116662, 
    "data": [ 
        { 
            "url": "url to the image", 
            "revised_prompt": "the actual prompt that was used" 
        }, 
        { 
            "url": "url to the image" 
        },
        ...
    ]
} 
```

### Request a generated image (DALL-E 2 preview)

Generate a batch of images from a text caption.

```http
POST https://{your-resource-name}.openai.azure.com/openai/images/generations:submit?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD format. |

**Supported versions**

- `2023-06-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-06-01-preview/inference.json)

**Request body**

| Parameter | Type | Required? | Default | Description |
|--|--|--|--|--|
| ```prompt``` | string | Required |  | A text description of the desired image(s). The maximum length is 1000 characters. |
| ```n``` | integer | Optional | 1 | The number of images to generate. Must be between 1 and 5. |
| ```size``` | string | Optional | 1024x1024 | The size of the generated images. Must be one of `256x256`, `512x512`, or `1024x1024`. |

#### Example request

```console
curl -X POST https://YOUR_RESOURCE_NAME.openai.azure.com/openai/images/generations:submit?api-version=2023-06-01-preview \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_API_KEY" \
  -d '{
"prompt": "An avocado chair",
"size": "512x512",
"n": 3
}'
```

#### Example response

The operation returns a `202` status code and an `GenerateImagesResponse` JSON object containing the ID and status of the operation.

```json
{
  "id": "f508bcf2-e651-4b4b-85a7-58ad77981ffa",
  "status": "notRunning"
}
```

### Get a generated image result (DALL-E 2 preview)


Use this API to retrieve the results of an image generation operation. Image generation is currently only available with `api-version=2023-06-01-preview`.

```http
GET https://{your-resource-name}.openai.azure.com/openai/operations/images/{operation-id}?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```operation-id``` | string |  Required | The GUID that identifies the original image generation request. |

**Supported versions**

- `2023-06-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-06-01-preview/inference.json)


#### Example request

```console
curl -X GET "https://{your-resource-name}.openai.azure.com/openai/operations/images/{operation-id}?api-version=2023-06-01-preview"
-H "Content-Type: application/json"
-H "Api-Key: {api key}"
```

#### Example response

Upon success the operation returns a `200` status code and an `OperationResponse` JSON object. The `status` field can be `"notRunning"` (task is queued but hasn't started yet), `"running"`, `"succeeded"`, `"canceled"` (task has timed out), `"failed"`, or `"deleted"`. A `succeeded` status indicates that the generated image is available for download at the given URL. If multiple images were generated, their URLs are all returned in the `result.data` field.

```json
{
  "created": 1685064331,
  "expires": 1685150737,
  "id": "4b755937-3173-4b49-bf3f-da6702a3971a",
  "result": {
    "data": [
      {
        "url": "<URL_TO_IMAGE>"
      },
      {
        "url": "<URL_TO_NEXT_IMAGE>"
      },
      ...
    ]
  },
  "status": "succeeded"
}
```

### Delete a generated image from the server (DALL-E 2 preview)

You can use the operation ID returned by the request to delete the corresponding image from the Azure server. Generated images are automatically deleted after 24 hours by default, but you can trigger the deletion earlier if you want to.

```http
DELETE https://{your-resource-name}.openai.azure.com/openai/operations/images/{operation-id}?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```operation-id``` | string |  Required | The GUID that identifies the original image generation request. |

**Supported versions**

- `2023-06-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-06-01-preview/inference.json)

#### Example request

```console
curl -X DELETE "https://{your-resource-name}.openai.azure.com/openai/operations/images/{operation-id}?api-version=2023-06-01-preview"
-H "Content-Type: application/json"
-H "Api-Key: {api key}"
```

#### Response

The operation returns a `204` status code if successful. This API only succeeds if the operation is in an end state (not `running`).


## Speech to text

You can use a Whisper model in Azure OpenAI Service for speech to text transcription or speech translation. For more information about using a Whisper model, see the [quickstart](./whisper-quickstart.md) and [the Whisper model overview](../speech-service/whisper-overview.md). 

### Request a speech to text transcription

Transcribes an audio file.

```http
POST https://{your-resource-name}.openai.azure.com/openai/deployments/{deployment-id}/audio/transcriptions?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI resource. |
| ```deployment-id``` | string | Required | The name of your Whisper model deployment such as *MyWhisperDeployment*. You're required to first deploy a Whisper model before you can make calls. |
| ```api-version``` | string | Required |The API version to use for this operation. This value follows the YYYY-MM-DD format. |

**Supported versions**

- `2023-09-01-preview` (retiring July 1, 2024) [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-09-01-preview/inference.json)
- `2023-10-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-10-01-preview/inference.json)
- `2023-12-01-preview` (retiring July 1, 2024) [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-12-01-preview/inference.json)
- `2024-02-15-preview`[Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-02-15-preview/inference.json)
- `2024-03-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-03-01-preview/inference.json)
- `2024-04-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-04-01-preview/inference.json)
- `2024-05-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-05-01-preview/inference.json)
- `2024-02-01` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/stable/2024-02-01/inference.json)

**Request body**

| Parameter | Type | Required? | Default | Description |
|--|--|--|--|--|
| ```file```| file | Yes | N/A | The audio file object (not file name) to transcribe, in one of these formats: `flac`, `mp3`, `mp4`, `mpeg`, `mpga`, `m4a`, `ogg`, `wav`, or `webm`.<br/><br/>The file size limit for the Whisper model in Azure OpenAI Service is 25 MB. If you need to transcribe a file larger than 25 MB, break it into chunks. Alternatively you can use the Azure AI Speech [batch transcription](../speech-service/batch-transcription-create.md#use-a-whisper-model) API.<br/><br/>You can get sample audio files from the [Azure AI Speech SDK repository at GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/sampledata/audiofiles). |
| ```language``` | string | No | Null | The language of the input audio such as `fr`. Supplying the input language in [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) format improves accuracy and latency.<br/><br/>For the list of supported languages, see the [OpenAI documentation](https://platform.openai.com/docs/guides/speech-to-text/supported-languages). |
| ```prompt``` | string | No | Null | An optional text to guide the model's style or continue a previous audio segment. The prompt should match the audio language.<br/><br/>For more information about prompts including example use cases, see the [OpenAI documentation](https://platform.openai.com/docs/guides/speech-to-text/supported-languages). |
| ```response_format``` | string | No | json | The format of the transcript output, in one of these options: json, text, srt, verbose_json, or vtt.<br/><br/>The default value is *json*. |
| ```temperature``` | number | No | 0 | The sampling temperature, between 0 and 1.<br/><br/>Higher values like 0.8 makes the output more random, while lower values like 0.2 make it more focused and deterministic. If set to 0, the model uses [log probability](https://en.wikipedia.org/wiki/Log_probability) to automatically increase the temperature until certain thresholds are hit.<br/><br/>The default value is *0*. |
|```timestamp_granularities``` | array | Optional | segment | The timestamp granularities to populate for this transcription. `response_format` must be set `verbose_json` to use timestamp granularities. Either or both of these options are supported: `word`, or `segment`. Note: There is no additional latency for segment timestamps, but generating word timestamps incurs additional latency. [**Added in 2024-04-01-prevew**]|

#### Example request

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT_NAME/audio/transcriptions?api-version=2023-09-01-preview \
  -H "Content-Type: multipart/form-data" \
  -H "api-key: $YOUR_API_KEY" \
  -F file="@./YOUR_AUDIO_FILE_NAME.wav" \
  -F "language=en" \
  -F "prompt=The transcript contains zoology terms and geographical locations." \
  -F "temperature=0" \
  -F "response_format=srt"
```

#### Example response

```srt
1
00:00:00,960 --> 00:00:07,680
The ocelot, Lepardus paradalis, is a small wild cat native to the southwestern United States,

2
00:00:07,680 --> 00:00:13,520
Mexico, and Central and South America. This medium-sized cat is characterized by

3
00:00:13,520 --> 00:00:18,960
solid black spots and streaks on its coat, round ears, and white neck and undersides.

4
00:00:19,760 --> 00:00:27,840
It weighs between 8 and 15.5 kilograms, 18 and 34 pounds, and reaches 40 to 50 centimeters

5
00:00:27,840 --> 00:00:34,560
16 to 20 inches at the shoulders. It was first described by Carl Linnaeus in 1758.

6
00:00:35,360 --> 00:00:42,880
Two subspecies are recognized, L. p. paradalis and L. p. mitis. Typically active during twilight

7
00:00:42,880 --> 00:00:48,480
and at night, the ocelot tends to be solitary and territorial. It is efficient at climbing,

8
00:00:48,480 --> 00:00:54,480
leaping, and swimming. It preys on small terrestrial mammals such as armadillo, opossum,

9
00:00:54,480 --> 00:00:56,480
and lagomorphs.
```

### Request a speech to text translation

Translates an audio file from another language into English. For the list of supported languages, see the [OpenAI documentation](https://platform.openai.com/docs/guides/speech-to-text/supported-languages).

```http
POST https://{your-resource-name}.openai.azure.com/openai/deployments/{deployment-id}/audio/translations?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI resource. |
| ```deployment-id``` | string | Required | The name of your Whisper model deployment such as *MyWhisperDeployment*. You're required to first deploy a Whisper model before you can make calls. |
| ```api-version``` | string | Required |The API version to use for this operation. This value follows the YYYY-MM-DD format. |

**Supported versions**

- `2023-09-01-preview` (retiring July 1, 2024) [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-09-01-preview/inference.json)
- `2023-10-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-10-01-preview/inference.json)
- `2023-12-01-preview` (retiring July 1, 2024) [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-12-01-preview/inference.json)
- `2024-02-15-preview`[Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-02-15-preview/inference.json)
- `2024-03-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-03-01-preview/inference.json)
- `2024-04-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-04-01-preview/inference.json)
- `2024-05-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-05-01-preview/inference.json)
- `2024-02-01` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/stable/2024-02-01/inference.json)

**Request body**

| Parameter | Type | Required? | Default | Description |
|--|--|--|--|--|
| ```file```| file | Yes | N/A | The audio file object (not file name) to transcribe, in one of these formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm.<br/><br/>The file size limit for the Azure OpenAI Whisper model is 25 MB. If you need to transcribe a file larger than 25 MB, break it into chunks.<br/><br/>You can download sample audio files from the [Azure AI Speech SDK repository at GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/sampledata/audiofiles). |
| ```prompt``` | string | No | Null | An optional text to guide the model's style or continue a previous audio segment. The prompt should match the audio language.<br/><br/>For more information about prompts including example use cases, see the [OpenAI documentation](https://platform.openai.com/docs/guides/speech-to-text/supported-languages). |
| ```response_format``` | string | No | json | The format of the transcript output, in one of these options: json, text, srt, verbose_json, or vtt.<br/><br/>The default value is *json*. |
| ```temperature``` | number | No | 0 | The sampling temperature, between 0 and 1.<br/><br/>Higher values like 0.8 makes the output more random, while lower values like 0.2 make it more focused and deterministic. If set to 0, the model uses [log probability](https://en.wikipedia.org/wiki/Log_probability) to automatically increase the temperature until certain thresholds are hit.<br/><br/>The default value is *0*. |

#### Example request

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT_NAME/audio/translations?api-version=2023-09-01-preview \
  -H "Content-Type: multipart/form-data" \
  -H "api-key: $YOUR_API_KEY" \
  -F file="@./YOUR_AUDIO_FILE_NAME.wav" \
  -F "temperature=0" \
  -F "response_format=json"
```

#### Example response

```json
{
  "text": "Hello, my name is Wolfgang and I come from Germany. Where are you heading today?"
}
```

## Text to speech

Synthesize text to speech.

```http
POST https://{your-resource-name}.openai.azure.com/openai/deployments/{deployment-id}/audio/speech?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI resource. |
| ```deployment-id``` | string | Required | The name of your text to speech model deployment such as *MyTextToSpeechDeployment*. You're required to first deploy a text to speech model (such as `tts-1` or `tts-1-hd`) before you can make calls. |
| ```api-version``` | string | Required |The API version to use for this operation. This value follows the YYYY-MM-DD format. |

**Supported versions**

- `2024-02-15-preview`[Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-02-15-preview/inference.json)
- `2024-03-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-03-01-preview/inference.json)
- `2024-04-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-04-01-preview/inference.json)
- `2024-05-01-preview` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2024-05-01-preview/inference.json)

**Request body**

| Parameter | Type | Required? | Default | Description |
|--|--|--|--|--|
| ```model```| string | Yes | N/A | One of the available TTS models: `tts-1` or `tts-1-hd` |
| ```input``` | string | Yes | N/A | The text to generate audio for. The maximum length is 4096 characters. Specify input text in the language of your choice.<sup>1</sup> |
| ```voice``` | string | Yes | N/A | The voice to use when generating the audio. Supported voices are `alloy`, `echo`, `fable`, `onyx`, `nova`, and `shimmer`. Previews of the voices are available in the [OpenAI text to speech guide](https://platform.openai.com/docs/guides/text-to-speech/voice-options). |

<sup>1</sup> The text to speech models generally support the same languages as the Whisper model. For the list of supported languages, see the [OpenAI documentation](https://platform.openai.com/docs/guides/speech-to-text/supported-languages).

### Example request

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT_NAME/audio/speech?api-version=2024-02-15-preview \
 -H "api-key: $YOUR_API_KEY" \
 -H "Content-Type: application/json" \
 -d '{
    "model": "tts-hd",
    "input": "I'm excited to try text to speech.",
    "voice": "alloy"
}' --output speech.mp3
```

### Example response

The speech is returned as an audio file from the previous request.

## Management APIs

Azure OpenAI is deployed as a part of the Azure AI services. All Azure AI services rely on the same set of management APIs for creation, update, and delete operations. The management APIs are also used for deploying models within an Azure OpenAI resource.

[**Management APIs reference documentation**](/rest/api/aiservices/)

## Next steps

Learn about [Models, and fine-tuning with the REST API](/rest/api/azureopenai/fine-tuning).
Learn more about the [underlying models that power Azure OpenAI](./concepts/models.md).
