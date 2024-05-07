---
title: How to deploy Phi-3 family of small language models with Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn how to deploy Phi-3 family of small language models with Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.topic: how-to
ms.date: 5/3/2024
ms.reviewer: fkriti
ms.author: mopeakande
author: msakande
ms.custom: [references_regions]
---

# How to deploy Phi-3 family of large language models with Azure AI Studio

In this article, you learn about the Phi-3 family of small language models (SLMs). You also learn how to use Azure AI Studio to deploy models from this set either as a service with pay-as you go billing or with hosted infrastructure in real-time endpoints.

The Phi-3 family of SLMs is a collection of instruction-tuned generative text models.  Phi-3 models are the most capable and cost-effective small language models (SLMs) available, outperforming models of the same size and next size up across a variety of language, reasoning, coding, and math benchmarks.

## Phi-3 family of models
# [Phi-3-mini](#tab/phi-3-mini)

Phi-3 Mini is a 3.8B parameters, lightweight, state-of-the-art open model built upon datasets used for Phi-2 - synthetic data and filtered websites - with a focus on very high-quality, reasoning dense data. The model belongs to the Phi-3 model family, and the Mini version comes in two variants 4K and 128K which is the context length (in tokens) it can support.

- [Phi-3-mini-4k-Instruct](https://ai.azure.com/explore/models/Phi-3-mini-4k-instruct/version/4/registry/azureml)
- [Phi-3-mini-128k-Instruct](https://ai.azure.com/explore/models/Phi-3-mini-128k-instruct/version/4/registry/azureml)

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures. When assessed against benchmarks testing common sense, language understanding, math, code, long context and logical reasoning, Phi-3 Mini-4K-Instruct and Phi-3 Mini-128K-Instruct showcased a robust and state-of-the-art performance among models with less than 13 billion parameters.

# [Phi-3-small](#tab/phi-3-small)
Phi-3-Small is a lightweight, state-of-the-art open model built upon datasets used for Phi-2 - synthetic data and filtered publicly available websites - with a focus on very high-quality, reasoning dense data. The model belongs to the Phi-3 model family, and the small version comes in two variants 8K and 128K which is the context length (in tokens) it can support. 
- Phi-3 Small-8K-Instruct
- Phi-3 Small-128K-Instruct

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures.  

# [Phi-3-medium](#tab/phi-3-medium)
Waiting for the data
---

## Deploy Phi-3 models with pay-as-you-go

Certain models in the model catalog can be deployed as a service with pay-as-you-go, providing a way to consume them as an API without hosting them on your subscription, while keeping the enterprise security and compliance organizations need. This deployment option doesn't require quota from your subscription.


### Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [paid Azure account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go) to begin.
- An [AI Studio hub](../how-to/create-azure-ai-resource.md).

    > [!IMPORTANT]
    > For Phi-3 family models, the pay-as-you-go model deployment offering is only available with hubs created in **East US 2** and **Sweden Central** regions.

- An [AI Studio project](../how-to/create-projects.md).
- Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure AI Studio. To perform the steps in this article, your user account must be assigned the __Azure AI Developer role__ on the resource group.

    For more information on permissions, see [Role-based access control in Azure AI Studio](../concepts/rbac-ai-studio.md).


### Create a new deployment

To create a deployment:

1. Sign in to [Azure AI Studio](https://ai.azure.com).
1. Choose the model you want to deploy from the Azure AI Studio [model catalog](https://ai.azure.com/explore/models). 

    Alternatively, you can initiate deployment by starting from your project in AI Studio. From the **Build** tab of your project, select **Deployments** > **+ Create**.

1. On the model's **Details** page, select **Deploy** and then select **Serverless API with Azure AI COntent Safety**.

1. Select the project in which you want to deploy your models. To useServerless API offering, your workspace must belong to the **East US 2** or **Sweden Central** region. You can customize the **Deployment name**.
1. On the deployment wizard, select the **Pricing and terms** to learn about the pricing and terms of use. 
1. Select **Deploy**. Wait until the deployment is ready and you're redirected to the Deployments page.
   This step requires that your account has the **Azure AI Developer role** permissions on the Resource Group, as listed in the prerequisites.
1. Select **Open in playground** to start interacting with the model.
1. You can return to the Deployments page, select the deployment, and note the endpoint's **Target** URL and the Secret **Key**, which you can use to call the deployment and generate completions.
1. You can always find the endpoint's details, URL, and access keys by navigating to the **Build** tab  and selecting **Deployments** from the Components section.

### Consume Phi-3  models as a service

Models deployed as a service can be consumed using the chat API, depending on the type of model you deployed.

1. On the **Build** page, select **Deployments**.

1. Find and select the deployment you created.

1. Copy the **Target** URL and the **Key** value.

1. Make an API request using the [`/v1/chat/completions`](#chat-api) API using [`<target_url>/v1/chat/completions`](#chat-api).

    For more information on using the APIs, see the [reference](#reference-for-phi-3-models-deployed-as-a-service) section.

### Reference for Phi 3 models deployed as a service

#### Chat API

Use the method `POST` to send the request to the `/v1/chat/completions` route:

__Request__

```rest
POST /v1/chat/completions HTTP/1.1
Host: <DEPLOYMENT_URI>
Authorization: Bearer <TOKEN>
Content-type: application/json
```

#### Request schema

Payload is a JSON formatted string containing the following parameters:

| Key | Type | Default | Description |
|-----|-----|-----|-----|
| `messages`    | `string`  | No default. This value must be specified.  | The message or history of messages to use to prompt the model.  |
| `model`             | `None`  | `string`        | It is kept for compatibility reasons and ignored by API.   
| `stream`      | `boolean` | `False` | Streaming allows the generated tokens to be sent as data-only server-sent events whenever they become available.  |
| `max_tokens`  | `integer` | `256`    | The maximum number of tokens to generate in the completion. The token count of your prompt plus `max_tokens` can't exceed the model's context length. |
| `top_p`       | `float`   | `1`     | An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with `top_p` probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering `top_p` or `temperature`, but not both.  |
| `temperature` | `float`   | `1`     | The sampling temperature to use, between 0 and 2. Higher values mean the model samples more broadly the distribution of tokens. Zero means greedy sampling. We recommend altering this or `top_p`, but not both.  |
| `stop`        | `array`   | `None`  | String or a list of strings containing the word where the API stops generating further tokens. The returned text won't contain the stop sequence. |
| `response_format`   | `text`  | `enum`          | Either `text` or `json`. Use default. Return [422](#error-codes) if unsupported by model.                 |
| `frequency_penalty` | `None`  | `float`         | Returns "The model doesn't support indicating parameter <parameter-name>" if unsupported by model.                                                       |
| `presence_penalty`  | `None`  | `float`         | Returns "The model doesn't support indicating parameter <parameter-name>" if unsupported by model.                                              |
| `seed`              | `None`  | `integer`       | Returns "The model doesn't support indicating parameter <parameter-name>" if unsupported by model.                   |
| `tools`             | `None`  | `list[Tool]`    | Returns "The model doesn't support indicating parameter <parameter-name>" if unsupported by model.       |
| `tool_choice`       | `None`  | `string`        | Returns "The model doesn't support indicating parameter <parameter-name>" if unsupported by model. 
The `messages` object has the following fields:

| Key       | Type      | Value |
|-----------|-----------|------------|
| `content` | `string` | The contents of the message. Content is required for all messages. |
| `role`    | `string` | The role of the message's author. One of `system`, `user`, or `assistant`. |


#### Example

__Body__

```json
{
    "messages":
    [
        { 
        "role": "system", 
        "content": "You are a helpful assistant that translates English to Italian."},
        {
        "role": "user", 
        "content": "Translate the following sentence from English to Italian: I love programming."
        }
    ],
    "temperature": 0.8,
    "max_tokens": 512,
}
```

#### Response schema

The response payload is a dictionary with the following fields.

| Key       | Type      | Description                                                                |
|-----------|-----------|----------------------------------------------------------------------------|
| `id`      | `string`  | A unique identifier for the completion.                                    |
| `choices` | `array`   | The list of completion choices the model generated for the input messages. |
| `created` | `integer` | The Unix timestamp (in seconds) of when the completion was created.        |
| `model`   | `string`  | The model_id used for completion.                                          |
| `object`  | `string`  | The object type, which is always `chat.completion`.                        |
| `usage`   | `object`  | Usage statistics for the completion request.                               |

> [!TIP]
> In the streaming mode, for each chunk of response, `finish_reason` is always `null`, except from the last one which is terminated by a payload `[DONE]`. In each `choices` object, the key for `messages` is changed by `delta`.


The `choices` object is a dictionary with the following fields. 

| Key     | Type      | Description  |
|---------|-----------|--------------|
| `index` | `integer` | Choice index. When `best_of` > 1, the index in this array might not be in order and might not be `0` to `n-1`. |
| `message`| `string`  | Chat completion result in `messages` object. When streaming mode is used, `delta` key is used.  |
| `finish_reason` | `string` | The reason the model stopped generating tokens: <br>- `stop`: model hit a natural stop point or a provided stop sequence. <br>- `length`: if max number of tokens have been reached. <br>- `content_filter`: When RAI moderates and CMP forces moderation <br>- `content_filter_error`: an error during moderation and wasn't able to make decision on the response <br>- `null`: API response still in progress or incomplete.|
| `logprobs` | `object` | The log probabilities of the generated tokens in the output text. |


The `usage` object is a dictionary with the following fields. 

| Key                 | Type      | Value                                         |
|---------------------|-----------|-----------------------------------------------|
| `prompt_tokens`     | `integer` | Number of tokens in the prompt.               |
| `completion_tokens` | `integer` | Number of tokens generated in the completion. |
| `total_tokens`      | `integer` | Total tokens.                                 |

The `logprobs` object is a dictionary with the following fields:

| Key              | Type                    | Value   |
|------------------|-------------------------|---------|
| `text_offsets`   | `array` of `integers`   | The position or index of each token in the completion output. |
| `token_logprobs` | `array` of `float`      | Selected `logprobs` from dictionary in `top_logprobs` array.   |
| `tokens`         | `array` of `string`     | Selected tokens.   |
| `top_logprobs`   | `array` of `dictionary` | Array of dictionary. In each dictionary, the key is the token and the value is the prob. |

#### Example

The following is an example response:

```json
{
    "id": "12345678-1234-1234-1234-abcdefghijkl",
    "object": "chat.completion",
    "created": 2012359,
    "model": "",
    "choices": [
        {
            "index": 0,
            "finish_reason": "stop",
            "message": {
                "role": "assistant",
                "content": "Sure, I\'d be happy to help! The translation of ""I love programming"" from English to Italian is:\n\n""Amo la programmazione.""\n\nHere\'s a breakdown of the translation:\n\n* ""I love"" in English becomes ""Amo"" in Italian.\n* ""programming"" in English becomes ""la programmazione"" in Italian.\n\nI hope that helps! Let me know if you have any other sentences you\'d like me to translate."
            }
        }
    ],
    "usage": {
        "prompt_tokens": 10,
        "total_tokens": 40,
        "completion_tokens": 30
    }
}
```

## Cost and quotas

### Cost and quota considerations for Llama 2 models deployed as a service

You can find the Azure Marketplace pricing when deploying on **Pricing and terms** tab on deployment wizard. 

Quota is managed per deployment. Each deployment has a rate limit of 200,000 tokens per minute and 1,000 API requests per minute. However, we currently limit one deployment per model per project. Contact Microsoft Azure Support if the current rate limits aren't sufficient for your scenarios.



## Next steps

- [What is Azure AI Studio?](../what-is-ai-studio.md)
- [Fine-tune a Llama 2 model in Azure AI Studio](fine-tune-model-llama.md)
- [Azure AI FAQ article](../faq.yml)