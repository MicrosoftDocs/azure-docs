---
title: How to deploy Mistral family of models with Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn how to deploy Mistral Large with Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: kritifaujdar
reviewer: fkriti
ms.author: mopeakande
author: msakande
ms.custom: references_regions, build-2024
---

# How to deploy Mistral models with Azure AI Studio

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

In this article, you learn how to use Azure AI Studio to deploy the Mistral family of models as serverless APIs with pay-as-you-go token-based billing.
Mistral AI offers two categories of models in [Azure AI Studio](https://ai.azure.com):

* __Premium models__: Mistral Large and Mistral Small. These models are available as serverless APIs with pay-as-you-go token-based billing in the AI Studio model catalog. 
* __Open models__: Mixtral-8x7B-Instruct-v01, Mixtral-8x7B-v01, Mistral-7B-Instruct-v01, and Mistral-7B-v01. These models are also available in the AI Studio model catalog and can be deployed to managed compute in your own Azure subscription.

You can browse the Mistral family of models in the [Model Catalog](model-catalog-overview.md) by filtering on the Mistral collection.

## Mistral family of models

# [Mistral Large](#tab/mistral-large)

Mistral Large is Mistral AI's most advanced Large Language Model (LLM). It can be used on any language-based task, thanks to its state-of-the-art reasoning and knowledge capabilities.

Additionally, Mistral Large is:

* __Specialized in RAG.__ Crucial information isn't lost in the middle of long context windows (up to 32-K tokens).
* __Strong in coding.__ Code generation, review, and comments. Supports all mainstream coding languages.
* __Multi-lingual by design.__ Best-in-class performance in French, German, Spanish, Italian, and English. Dozens of other languages are supported.
* __Responsible AI compliant.__ Efficient guardrails baked in the model and extra safety layer with the `safe_mode` option.

# [Mistral Small](#tab/mistral-small)

Mistral Small is Mistral AI's most efficient Large Language Model (LLM). It can be used on any language-based task that requires high efficiency and low latency.

Mistral Small is:

- **A small model optimized for low latency.** Very efficient for high volume and low latency workloads. Mistral Small is Mistral's smallest proprietary model, it outperforms Mixtral-8x7B and has lower latency. 
- **Specialized in RAG.** Crucial information isn't lost in the middle of long context windows (up to 32K tokens).
- **Strong in coding.** Code generation, review, and comments. Supports all mainstream coding languages.
- **Multi-lingual by design.** Best-in-class performance in French, German, Spanish, Italian, and English. Dozens of other languages are supported.
- **Responsible AI compliant.** Efficient guardrails baked in the model, and extra safety layer with the `safe_mode` option.

---

## Deploy Mistral family of models as a serverless API

Certain models in the model catalog can be deployed as a serverless API with pay-as-you-go billing. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription.

**Mistral Large** and **Mistral Small** can be deployed as a serverless API with pay-as-you-go billing and are offered by Mistral AI through the Microsoft Azure Marketplace. Mistral AI can change or update the terms of use and pricing of these models.

### Prerequisites

- An Azure subscription with a valid payment method. Free or trial Azure subscriptions won't work. If you don't have an Azure subscription, create a [paid Azure account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go) to begin.
- An [Azure AI Studio hub](../how-to/create-azure-ai-resource.md).

    > [!IMPORTANT]
    > The serverless API model deployment offering for eligible models in the Mistral family is only available in hubs created in the **East US 2** and **Sweden Central** regions. For _Mistral Large_, the serverless API model deployment offering is also available in the **France Central** region.

- An [Azure AI Studio project](../how-to/create-projects.md).
- Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure AI Studio. To perform the steps in this article, your user account must be assigned the __Azure AI Developer role__ on the resource group. For more information on permissions, see [Role-based access control in Azure AI Studio](../concepts/rbac-ai-studio.md).

### Create a new deployment

The following steps demonstrate the deployment of Mistral Large, but you can use the same steps to deploy Mistral Small by replacing the model name.

To create a deployment:

1. Sign in to [Azure AI Studio](https://ai.azure.com).
1. Select **Model catalog** from the left sidebar.
1. Search for and select **Mistral-large** to open its Details page.

    :::image type="content" source="../media/deploy-monitor/mistral/mistral-large-deploy-directly-from-catalog.png" alt-text="A screenshot showing how to access the model details page by going through the model catalog." lightbox="../media/deploy-monitor/mistral/mistral-large-deploy-directly-from-catalog.png"::: 

1. Select **Deploy** to open a serverless API deployment window for the model.
1. Alternatively, you can initiate a deployment by starting from your project in AI Studio. 

    1. From the left sidebar of your project, select **Components** > **Deployments**.
    1. Select **+ Create deployment**.
    1. Search for and select **Mistral-large**. to open the Model's Details page.

       :::image type="content" source="../media/deploy-monitor/mistral/mistral-large-deploy-starting-from-project.png" alt-text="A screenshot showing how to access the model details page by going through the Deployments page in your project." lightbox="../media/deploy-monitor/mistral/mistral-large-deploy-starting-from-project.png"::: 

    1. Select **Confirm** to open a serverless API deployment window for the model.

    :::image type="content" source="../media/deploy-monitor/mistral/mistral-large-deploy-pay-as-you-go.png" alt-text="A screenshot showing how to deploy a model as a serverless API." lightbox="../media/deploy-monitor/mistral/mistral-large-deploy-pay-as-you-go.png":::

1. Select the project in which you want to deploy your model. To deploy the Mistral model, your project must be in the *EastUS2* or *Sweden Central* region. For the Mistral Large model, you can also deploy in a project that's in the *France Central* region.
1. In the deployment wizard, select the link to **Azure Marketplace Terms** to learn more about the terms of use.
1. Select the **Pricing and terms** tab to learn about pricing for the selected model.
1. Select the **Subscribe and Deploy** button. If this is your first time deploying the model in the project, you have to subscribe your project for the particular offering. This step requires that your account has the **Azure AI Developer role** permissions on the resource group, as listed in the prerequisites. Each project has its own subscription to the particular Azure Marketplace offering of the model, which allows you to control and monitor spending. Currently, you can have only one deployment for each model within a project.
1. Once you subscribe the project for the particular Azure Marketplace offering, subsequent deployments of the _same_ offering in the _same_ project don't require subscribing again. If this scenario applies to you, there's a **Continue to deploy** option to select.

    :::image type="content" source="../media/deploy-monitor/mistral/mistral-large-existing-subscription.png" alt-text="A screenshot showing a project that is already subscribed to the offering." lightbox="../media/deploy-monitor/mistral/mistral-large-existing-subscription.png":::

1. Give the deployment a name. This name becomes part of the deployment API URL. This URL must be unique in each Azure region.
    :::image type="content" source="../media/deploy-monitor/mistral/mistral-large-deployment-name.png" alt-text="A screenshot showing how to indicate the name of the deployment you want to create." lightbox="../media/deploy-monitor/mistral/mistral-large-deployment-name.png":::

1. Select **Deploy**. Wait until the deployment is ready and you're redirected to the Deployments page.
1. Select **Open in playground** to start interacting with the model.
1. Return to the Deployments page, select the deployment, and note the endpoint's **Target** URL and the Secret **Key**. For more information on using the APIs, see the [reference](#reference-for-mistral-family-of-models-deployed-as-a-service) section.
1. You can always find the endpoint's details, URL, and access keys by navigating to your **Project overview** page. Then, from the left sidebar of your project, select **Components** > **Deployments**.

To learn about billing for the Mistral AI model deployed as a serverless API with pay-as-you-go token-based billing, see [Cost and quota considerations for Mistral family of models deployed as a service](#cost-and-quota-considerations-for-mistral-family-of-models-deployed-as-a-service).

### Consume the Mistral family of models as a service

You can consume Mistral family models by using the chat API.

1. From your **Project overview** page, go to the left sidebar and select **Components** > **Deployments**.

1. Find and select the deployment you created.

1. Copy the **Target** URL and the **Key** value.

1. Make an API request using to either the [Azure AI Model Inference API](../reference/reference-model-inference-api.md) on the route `/chat/completions` and the native [Mistral Chat API](#mistral-chat-api) on `/v1/chat/completions`.

For more information on using the APIs, see the [reference](#reference-for-mistral-family-of-models-deployed-as-a-service) section.

### Reference for Mistral family of models deployed as a service

Mistral models accept both the [Azure AI Model Inference API](../reference/reference-model-inference-api.md) on the route `/chat/completions` and the native [Mistral Chat API](#mistral-chat-api) on `/v1/chat/completions`. 

### Azure AI Model Inference API

The [Azure AI Model Inference API](../reference/reference-model-inference-api.md) schema can be found in the [reference for Chat Completions](../reference/reference-model-inference-chat-completions.md) article and an [OpenAPI specification can be obtained from the endpoint itself](../reference/reference-model-inference-api.md?tabs=rest#getting-started).

#### Mistral Chat API

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
| `stream`      | `boolean` | `False` | Streaming allows the generated tokens to be sent as data-only server-sent events whenever they become available.  |
| `max_tokens`  | `integer` | `8192`    | The maximum number of tokens to generate in the completion. The token count of your prompt plus `max_tokens` can't exceed the model's context length. |
| `top_p`       | `float`   | `1`     | An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with `top_p` probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering `top_p` or `temperature`, but not both.  |
| `temperature` | `float`   | `1`     | The sampling temperature to use, between 0 and 2. Higher values mean the model samples more broadly the distribution of tokens. Zero means greedy sampling. We recommend altering this parameter or `top_p`, but not both.  |
| `ignore_eos`          | `boolean` | `False`  | Whether to ignore the EOS token and continue generating tokens after the EOS token is generated. |
| `safe_prompt` | `boolean` | `False`  | Whether to inject a safety prompt before all conversations. |

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
        "content": "You are a helpful assistant that translates English to Italian."
        },
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

The response payload is a dictionary with the following fields:

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


The `choices` object is a dictionary with the following fields:

| Key     | Type      | Description  |
|---------|-----------|--------------|
| `index` | `integer` | Choice index. When `best_of` > 1, the index in this array might not be in order and might not be `0` to `n-1`. |
| `messages` or `delta`   | `string`  | Chat completion result in `messages` object. When streaming mode is used, `delta` key is used.  |
| `finish_reason` | `string` | The reason the model stopped generating tokens: <br>- `stop`: model hit a natural stop point or a provided stop sequence. <br>- `length`: if max number of tokens have been reached. <br>- `content_filter`: When RAI moderates and CMP forces moderation <br>- `content_filter_error`: an error during moderation and wasn't able to make decision on the response <br>- `null`: API response still in progress or incomplete.|
| `logprobs` | `object` | The log probabilities of the generated tokens in the output text. |


The `usage` object is a dictionary with the following fields:

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
| `top_logprobs`   | `array` of `dictionary` | Array of dictionary. In each dictionary, the key is the token and the value is the probability. |

#### Example

The following JSON is an example response:

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
#### More inference examples

| **Sample Type**       | **Sample Notebook**                             |
|----------------|----------------------------------------|
| CLI using CURL and Python web requests    | [webrequests.ipynb](https://aka.ms/mistral-large/webrequests-sample)|
| OpenAI SDK (experimental)    | [openaisdk.ipynb](https://aka.ms/mistral-large/openaisdk)                                    |
| LangChain      | [langchain.ipynb](https://aka.ms/mistral-large/langchain-sample)                                  |
| Mistral AI     | [mistralai.ipynb](https://aka.ms/mistral-large/mistralai-sample)                                  |
| LiteLLM        | [litellm.ipynb](https://aka.ms/mistral-large/litellm-sample) 

## Cost and quotas

### Cost and quota considerations for Mistral family of models deployed as a service

Mistral models deployed as a serverless API are offered by Mistral AI through the Azure Marketplace and integrated with Azure AI Studio for use. You can find the Azure Marketplace pricing when deploying the model.

Each time a project subscribes to a given offer from the Azure Marketplace, a new resource is created to track the costs associated with its consumption. The same resource is used to track costs associated with inference; however, multiple meters are available to track each scenario independently.

For more information on how to track costs, see [monitor costs for models offered throughout the Azure Marketplace](./costs-plan-manage.md#monitor-costs-for-models-offered-through-the-azure-marketplace).

Quota is managed per deployment. Each deployment has a rate limit of 200,000 tokens per minute and 1,000 API requests per minute. However, we currently limit one deployment per model per project. Contact Microsoft Azure Support if the current rate limits aren't sufficient for your scenarios. 

## Content filtering

Models deployed as a serverless API with pay-as-you-go billing are protected by [Azure AI Content Safety](../../ai-services/content-safety/overview.md). With Azure AI content safety, both the prompt and completion pass through an ensemble of classification models aimed at detecting and preventing the output of harmful content. The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions. Learn more about [content filtering here](../concepts/content-filtering.md).

## Related content

- [What is Azure AI Studio?](../what-is-ai-studio.md)
- [Azure AI FAQ article](../faq.yml)
