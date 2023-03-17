---
title: Azure OpenAI Service REST API reference
titleSuffix: Azure OpenAI
description: Learn how to use Azure OpenAI's REST API. In this article, you'll learn about authorization options,  how to structure a request and receive a response.
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: conceptual
ms.date: 11/17/2022
author: ChrisHMSFT
ms.author: chrhoder
recommendations: false
ms.custom:
---

# Azure OpenAI Service REST API reference

This article provides details on the REST API endpoints for Azure OpenAI, a service in the Azure Cognitive Services suite. The REST APIs are broken up into two categories:

* **Management APIs**: The Azure Resource Manager (ARM) provides the management layer in Azure that allows you to create, update and delete resource in Azure. All services use a common structure for these operations. [Learn More](../../azure-resource-manager/management/overview.md)
* **Service APIs**: Azure OpenAI provides you with a set of REST APIs for interacting with the resources & models you deploy via the Management APIs.

## Management APIs

Azure OpenAI is deployed as a part of the Azure Cognitive Services. All Cognitive Services rely on the same set of management APIs for creation, update and delete operations. The management APIs are also used for deploying models within an OpenAI resource.

[**Management APIs reference documentation**](/rest/api/cognitiveservices/)

## Authentication

Azure OpenAI provides two methods for authentication. you can use  either API Keys or Azure Active Directory.

- **API Key authentication**: For this type of authentication, all API requests must include the API Key in the ```api-key``` HTTP header. The [Quickstart](./quickstart.md) provides a tutorial for how to make calls with this type of authentication

- **Azure Active Directory authentication**: You can authenticate an API call using an Azure Active Directory token. Authentication tokens are included in a request as the ```Authorization``` header. The token provided must be preceded by ```Bearer```, for example ```Bearer YOUR_AUTH_TOKEN```. You can read our how-to guide on [authenticating with Azure Active Directory](./how-to/managed-identity.md).

### REST API versioning

The service APIs are versioned using the ```api-version``` query parameter. All versions follow the YYYY-MM-DD date structure. For example:

```http
POST https://YOUR_RESOURCE_NAME.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT_NAME/completions?api-version=2022-12-01
```

We currently have the following versions available: ```2022-12-01```

## Completions
With the Completions operation, the model will generate one or more predicted completions based on a provided prompt. The service can also return the probabilities of alternative tokens at each position.

**Create a completion**

```http
POST https://{your-resource-name}.openai.azure.com/openai/deployments/{deployment-id}/completions?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```deployment-id``` | string | Required | The name of your model deployment. You're required to first deploy a model before you can make calls |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD format.  |

**Supported versions**

- `2022-12-01`

**Request body**

| Parameter | Type | Required? | Default | Description |
|--|--|--|--|--|
| ```prompt``` | string or array | Optional | ```<\|endoftext\|>``` | The prompt(s) to generate completions for, encoded as a string, a list of strings, or a list of token lists. Note that ```<\|endoftext\|>``` is the document separator that the model sees during training, so if a prompt isn't specified the model will generate as if from the beginning of a new document. |
| ```max_tokens``` | integer | Optional | 16 | The maximum number of tokens to generate in the completion. The token count of your prompt plus max_tokens can't exceed the model's context length. Most models have a context length of 2048 tokens (except davinci-codex, which supports 4096). |
| ```temperature``` | number | Optional | 1 | What sampling temperature to use. Higher values means the model will take more risks. Try 0.9 for more creative applications, and 0 (`argmax sampling`) for ones with a well-defined answer. We generally recommend altering this or top_p but not both. |
| ```top_p``` | number | Optional | 1 | An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or temperature but not both. |
| ```n``` | integer | Optional |  1 | How many completions to generate for each prompt. Note: Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for max_tokens and stop. |
| ```stream``` | boolean | Optional | False | Whether to stream back partial progress. If set, tokens will be sent as data-only server-sent events as they become available, with the stream terminated by a data: [DONE] message.| 
| ```logprobs``` | integer | Optional | null | Include the log probabilities on the logprobs most likely tokens, as well the chosen tokens. For example, if logprobs is 10, the API will return a list of the 10 most likely tokens. the API will always return the logprob of the sampled token, so there may be up to logprobs+1 elements in the response. This parameter cannot be used with `gpt-35-turbo`. |
| ```echo``` | boolean | Optional | False | Echo back the prompt in addition to the completion. This parameter cannot be used with `gpt-35-turbo`. |
| ```stop``` | string or array | Optional | null | Up to four sequences where the API will stop generating further tokens. The returned text won't contain the stop sequence. |
| ```presence_penalty``` | number | Optional | 0 | Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics. |
| ```frequency_penalty``` | number | Optional | 0 | Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim. |
| ```best_of``` | integer | Optional | 1 | Generates best_of completions server-side and returns the "best" (the one with the lowest log probability per token). Results can't be streamed. When used with n, best_of controls the number of candidate completions and n specifies how many to return – best_of must be greater than n. Note: Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for max_tokens and stop. This parameter cannot be used with `gpt-35-turbo`. |
| ```logit_bias``` | map | Optional | null | Modify the likelihood of specified tokens appearing in the completion. Accepts a json object that maps tokens (specified by their token ID in the GPT tokenizer) to an associated bias value from -100 to 100. You can use this tokenizer tool (which works for both GPT-2 and GPT-3) to convert text to token IDs. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token. As an example, you can pass {"50256": -100} to prevent the <\|endoftext\|> token from being generated. |

#### Example request

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT_NAME/completions?api-version=2022-12-01\
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

## Embeddings
Get a vector representation of a given input that can be easily consumed by machine learning models and other algorithms. 

**Create an embedding**

```http
POST https://{your-resource-name}.openai.azure.com/openai/deployments/{deployment-id}/embeddings?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```deployment-id``` | string | Required | The name of your model deployment. You're required to first deploy a model before you can make calls |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD format.  |

**Supported versions**

- `2022-12-01`

**Request body**

| Parameter | Type | Required? | Default | Description |
|--|--|--|--|--|
| ```input```| string or array | Yes | N/A | Input text to get embeddings for, encoded as a string or array of tokens. To get embeddings for multiple inputs in a single request, pass an array of strings or array of token arrays. Each input must not exceed 2048 tokens in length. Currently we accept a max array of 1. <br> Unless you're embedding code, we suggest replacing newlines (\n) in your input with a single space, as we have observed inferior results when newlines are present.|
| ```user``` | string | No | Null | A unique identifier representing for your end-user. This will help Azure OpenAI monitor and detect abuse. **Do not pass PII identifiers instead use pseudoanonymized values such as GUIDs** |

#### Example request

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT_NAME/embeddings?api-version=2022-12-01\
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

## Next steps

Learn about [managing deployments, models, and finetuning with the REST API](/rest/api/cognitiveservices/azureopenaistable/deployments/create).
Learn more about the [underlying models that power Azure OpenAI](./concepts/models.md).
