---
title: How to deploy Mistral family of models with Azure Machine Learning studio
titleSuffix: Azure Machine Learning
description: Learn how to deploy Mistral Large with Azure Machine Learning studio.
manager: scottpolly
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: how-to
ms.date: 02/23/2024
ms.reviewer: shubhiraj
reviewer: shubhirajMsft
ms.author: mopeakande
author: msakande
ms.custom: [references_regions]

#This functionality is also available in Azure AI Studio: /azure/ai-studio/how-to/deploy-models-mistral.md
---
# How to deploy Mistral models with Azure Machine Learning studio
Mistral AI offers two categories of models in Azure Machine Learning studio:

- Premium models: Mistral Large. These models are available with pay-as-you-go token based billing with Models as a Service in the studio model catalog. 
- Open models: Mixtral-8x7B-Instruct-v01, Mixtral-8x7B-v01, Mistral-7B-Instruct-v01, and Mistral-7B-v01. These models are also available in the Azure Machine Learning studio model catalog and can be deployed to dedicated VM instances in your own Azure subscription with managed online endpoints.
   
You can browse the Mistral family of models in the model catalog by filtering on the Mistral collection. 

## Mistral Large

In this article, you learn how to use Azure Machine Learning studio to deploy the Mistral Large model as a service with pay-as you go billing.

Mistral Large is Mistral AI's most advanced Large Language Model (LLM). It can be used on any language-based task thanks to its state-of-the-art reasoning and knowledge capabilities.

Additionally, mistral-large is:

- Specialized in RAG. Crucial information isn't lost in the middle of long context windows (up to 32 K tokens).
- Strong in coding. Code generation, review, and comments. Supports all mainstream coding languages.
- Multi-lingual by design. Best-in-class performance in French, German, Spanish, and Italian - in addition to English. Dozens of other languages are supported.
- Responsible AI. Efficient guardrails baked in the model, with additional safety layer with safe_mode option.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## Deploy Mistral Large with pay-as-you-go

Certain models in the model catalog can be deployed as a service with pay-as-you-go, providing a way to consume them as an API without hosting them on your subscription, while keeping the enterprise security and compliance organizations need. This deployment option doesn't require quota from your subscription.

Mistral Large can be deployed as a service with pay-as-you-go, and is offered by Mistral AI through the Microsoft Azure Marketplace. Please note that Mistral AI can change or update the terms of use and pricing of this model.

### Azure Marketplace model offerings

The following models are available in Azure Marketplace for Mistral AI when deployed as a service with pay-as-you-go:

* Mistral Large (preview)

### Prerequisites

- An Azure subscription with a valid payment method. Free or trial Azure subscriptions won't work. If you don't have an Azure subscription, create a [paid Azure account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go) to begin.
- An Azure Machine Learning workspace. If you don't have these, use the steps in the [Quickstart: Create workspace resources](quickstart-create-resources.md) article to create them.

    > [!IMPORTANT]
    > Pay-as-you-go model deployment offering is only available in workspaces created in **East US 2** and **France Central** regions.

-  Azure role-based access controls (Azure RBAC) are used to grant access to operations. To perform the steps in this article, your user account must be assigned the __Azure AI Developer role__ on the Resouce Group.

    For more information on permissions, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

### Create a new deployment

To create a deployment:

1. Go to [Azure Machine Learning studio](https://ml.azure.com/home).
1. Select the workspace in which you want to deploy your models. To use the pay-as-you-go model deployment offering, your workspace must belong to the **East US 2** or **France Central** region.
1. Choose the model (Mistral-large) you want to deploy from the [model catalog](https://ml.azure.com/model/catalog).

   Alternatively, you can initiate deployment by going to your workspace and selecting **Endpoints** > **Serverless endpoints** > **Create**.

1. On the model's overview page in the model catalog, select **Deploy** and then **Pay-as-you-go**.

    :::image type="content" source="media/how-to-deploy-models-mistral/mistral-deploy-pay-as-you-go.png" alt-text="A screenshot showing how to deploy a model with the pay-as-you-go option." lightbox="media/how-to-deploy-models-mistral/mistral-deploy-pay-as-you-go.png":::

1. In the deployment wizard, select the link to **Azure Marketplace Terms** to learn more about the terms of use. 
1. You can also select the **Marketplace offer details** tab to learn about pricing for the selected model.
1. If this is your first time deploying the model in the workspace, you have to subscribe your workspace for the particular offering (for example, Mistral-large). This step requires that your account has the **Azure AI Developer role** permissions on the Resource Group, as listed in the prerequisites. Each workspace has its own subscription to the particular Azure Marketplace offering, which allows you to control and monitor spending. Select **Subscribe and Deploy**. Currently you can have only one deployment for each model within a workspace.

    :::image type="content" source="media/how-to-deploy-models-mistral/mistral-deploy-marketplace-terms.png" alt-text="A screenshot showing the terms and conditions of a given model." lightbox="media/how-to-deploy-models-mistral/mistral-deploy-marketplace-terms.png":::

1. Once you subscribe the workspace for the particular Azure Marketplace offering, subsequent deployments of the _same_ offering in the _same_ workspace don't require subscribing again. If this scenario applies to you, you will see a **Continue to deploy** option to select.

    :::image type="content" source="media/how-to-deploy-models-mistral/mistral-deploy-pay-as-you-go-project.png" alt-text="A screenshot showing a project that is already subscribed to the offering." lightbox="media/how-to-deploy-models-mistral/mistral-deploy-pay-as-you-go-project.png":::

1. Give the deployment a name. This name becomes part of the deployment API URL. This URL must be unique in each Azure region.

    :::image type="content" source="media/how-to-deploy-models-mistral/mistral-deployment-name.png" alt-text="A screenshot showing how to indicate the name of the deployment you want to create." lightbox="media/how-to-deploy-models-mistral/mistral-deployment-name.png":::

1. Select **Deploy**. Wait until the deployment is finished and you're redirected to the serverless endpoints page.
1. Select the endpoint to open its Details page.
1. Select the **Test** tab to start interacting with the model.  
1. You can always find the endpoint's details, URL, and access keys by navigating to **Workspace** > **Endpoints** > **Serverless endpoints**.
1. Take note of the **Target** URL and the **Secret Key** to call the deployment and generate chat completions using the [`<target_url>/v1/chat/completions`](#chat-api) API.

To learn about billing for Mistral models deployed with pay-as-you-go, see [Cost and quota considerations for Mistral models deployed as a service](#cost-and-quota-considerations-for-mistral-large-deployed-as-a-service).

### Consume the Mistral Large model as a service

Mistral Large can be consumed using the chat API.

1. In the **workspace**, select **Endpoints** > **Serverless endpoints**.
1. Find and select the deployment you created.
1. Copy the **Target** URL and the **Key** token values.
1. Make an API request using the [`<target_url>/v1/chat/completions`](#chat-api) API.

   For more information on using the APIs, see the [reference](#reference-for-mistral-large-deployed-as-a-service) section.

### Reference for Mistral large deployed as a service

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
| `stream`      | `boolean` | `False` | Streaming allows the generated tokens to be sent as data-only server-sent events whenever they become available.  |
| `max_tokens`  | `integer` | `8192`    | The maximum number of tokens to generate in the completion. The token count of your prompt plus `max_tokens` can't exceed the model's context length. |
| `top_p`       | `float`   | `1`     | An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with `top_p` probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering `top_p` or `temperature`, but not both.  |
| `temperature` | `float`   | `1`     | The sampling temperature to use, between 0 and 2. Higher values mean the model samples more broadly the distribution of tokens. Zero means greedy sampling. We recommend altering this or `top_p`, but not both.  |
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
| `messages` or `delta`   | `string`  | Chat completion result in `messages` object. When streaming mode is used, `delta` key is used.  |
| `finish_reason` | `string` | The reason the model stopped generating tokens: <br>- `stop`: model hit a natural stop point or a provided stop sequence. <br>- `length`: if max number of tokens have been reached. <br>- `content_filter`: When RAI moderates and CMP forces moderation <br>- `content_filter_error`: an error during moderation and wasn't able to make decision on the response <br>- `null`: API response still in progress or incomplete. |
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

#### Additional inference examples

| **Sample Type**       | **Sample Notebook**                             |
|----------------|----------------------------------------|
| CLI using CURL and Python web requests    | [webrequests.ipynb](https://aka.ms/mistral-large/webrequests-sample)|
| OpenAI SDK (experimental)    | [openaisdk.ipynb](https://aka.ms/mistral-large/openaisdk)                                    |
| LangChain      | [langchain.ipynb](https://aka.ms/mistral-large/langchain-sample)                                  |
| Mistral AI     | [mistralai.ipynb](https://aka.ms/mistral-large/mistralai-sample)                                  |
| LiteLLM        | [litellm.ipynb](https://aka.ms/mistral-large/litellm-sample) 

## Cost and quotas

### Cost and quota considerations for Mistral Large deployed as a service

Mistral models deployed as a service are offered by Mistral AI through Azure Marketplace and integrated with Azure Machine Learning studio for use. You can find Azure Marketplace pricing when deploying the models.

Each time a workspace subscribes to a given model offering from Azure Marketplace, a new resource is created to track the costs associated with its consumption. The same resource is used to track costs associated with inference; however, multiple meters are available to track each scenario independently.

For more information on how to track costs, see [Monitor costs for models offered through the Azure Marketplace](../ai-studio/how-to/costs-plan-manage.md#monitor-costs-for-models-offered-through-the-azure-marketplace).

Quota is managed per deployment. Each deployment has a rate limit of 200,000 tokens per minute and 1,000 API requests per minute. However, we currently limit one deployment per model per project. Contact Microsoft Azure Support if the current rate limits aren't sufficient for your scenarios.

## Content filtering

Models deployed as a service with pay-as-you-go are protected by Azure AI content safety. With Azure AI content safety enabled, both the prompt and completion pass through an ensemble of classification models aimed at detecting and preventing the output of harmful content. The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions. Learn more about [Azure AI Content Safety](/azure/ai-services/content-safety/overview).

## Related content

- [Model Catalog and Collections](concept-model-catalog.md)
- [Deploy and score a machine learning model by using an online endpoint](how-to-deploy-online-endpoints.md)
- [Plan and manage costs for Azure AI Studio](concept-plan-manage-cost.md)
