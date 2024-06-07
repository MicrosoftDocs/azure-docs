---
title: How to deploy Jamba-Instruct models with Azure AI Studio
titleSuffix: Azure Machine Learning Studio
description: How to deploy Jamba-Instruct models with Azure AI Studio
manager: scottpolly
ms.service: machine-learning
ms.topic: how-to
ms.date: 05/02/2024
ms.reviewer: haelhamm
ms.custom: references_regions
---

# How to deploy Jamba-Instruct models with Azure AI Studio

In this article, you will learn how to deploy AI21's Jamba-Instruct model through Models-as-a-Service (MaaS), through serverless APIs with pay-as you go billing.

> [!IMPORTANT]
> See our announcements of AI21's Jamba-Instruct model available now on Azure AI Model Catalog through [AI21's blog](https://aka.ms/ai21-jamba-instruct-blog) and [Microsoft Tech Community Blog]([https://aka.ms/ai21-jamba-instruct-announcement]).

Jamba-Instruct model is AI21's production-grade Mamba-based large language model (LLM) which leverages AI21's hybrid Mamba-Transformer architecture. It is an instruction-tuned version of AI21's hybrid SSM-Transformer Jamba model, and is built for reliable commercial use with respect to quality and performance.

To get started with Jamba-Instruct on MaaS, explore our integrations with [LangChain](https://aka.ms/ai21-jamba-instruct-langchain-sample), [LiteLLM](https://aka.ms/ai21-jamba-instruct-litellm-sample), [OpenAI](https://aka.ms/ai21-jamba-instruct-openai-sample) and the [Azure API](https://aka.ms/ai21-jamba-instruct-azure-api-sample).

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## Deploy the Jamba-Instruct model as a serverless API

Certain models in the model catalog can be deployed as a serverless API with pay-as-you-go billing, providing a way to consume them as an API without hosting them on your subscription while keeping the enterprise security and compliance organizations need. This deployment option doesn't require quota from your subscription.

The Jamba-Instruct model is deployed as a serverless API with pay-as-you-go billing are offered by AI21 through Microsoft Azure Marketplace. AI21 may add more terms of use and pricing.

### Azure Marketplace model offerings

On the Azure Marketplace, you'll be able to find:

* [AI21-Jamba-Instruct (preview)](https://aka.ms/azure-marketplace-offer-ai21-jamba-instruct)

### Prerequisites

- An Azure subscription with a valid payment method. Free or trial Azure subscriptions won't work. If you don't have an Azure subscription, create a [paid Azure account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go) to begin.
- An Azure Machine Learning workspace. If you don't have these, use the steps in the [Quickstart: Create workspace resources](quickstart-create-resources.md) article to create them.

    > [!IMPORTANT]
    > The Jamba-Instruct PAYGO model deployment offering is only available in workspaces created in **East US 2** and **Sweden Central**. More regions are coming soon.

- Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __owner__ or __contributor__ role for the Azure subscription. Alternatively, your account can be assigned a custom role that has the following permissions:

    - On the Azure subscription—to subscribe the workspace to the Azure Marketplace offering, once for each workspace, per offering:
      - `Microsoft.MarketplaceOrdering/agreements/offers/plans/read`
      - `Microsoft.MarketplaceOrdering/agreements/offers/plans/sign/action`
      - `Microsoft.MarketplaceOrdering/offerTypes/publishers/offers/plans/agreements/read`
      - `Microsoft.Marketplace/offerTypes/publishers/offers/plans/agreements/read`
      - `Microsoft.SaaS/register/action`
 
    - On the resource group—to create and use the SaaS resource:
      - `Microsoft.SaaS/resources/read`
      - `Microsoft.SaaS/resources/write`
 
    - On the workspace—to deploy endpoints (the Azure Machine Learning data scientist role contains these permissions already):
      - `Microsoft.MachineLearningServices/workspaces/marketplaceModelSubscriptions/*`  
      - `Microsoft.MachineLearningServices/workspaces/serverlessEndpoints/*`

    For more information on permissions, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).


### Create a new deployment

To create a deployment:

1. Go to [Azure Machine Learning studio](https://ml.azure.com/home).
1. Select the workspace in which you want to deploy your models. To use the pay-as-you-go model deployment offering, your workspace must belong to the **East US 2** or **Sweden Central** region.
1. Choose **AI21-Jamba-Instruct** as the model to deploy from the [model catalog](https://aka.ms/aistudio/landing/ai21-labs-jamba-instruct).

   Alternatively, you can initiate deployment by going to your workspace and selecting **Endpoints** > **Serverless endpoints** > **Create**.

1. On the model's overview page, select **Deploy** and then **Serverless API with Azure AI Content Safety**.

1. On the deployment wizard, select the link to **Azure Marketplace Terms** to learn more about the terms of use. You can also select the **Marketplace offer details** tab to learn about pricing for Jamba-Instruct.
1. If this is your first time deploying Jamba-Instruct in the workspace, you have to subscribe your workspace for Jamba-Instruct from Azure Marketplace. This step requires that your account has the Azure subscription permissions and resource group permissions listed in the prerequisites. Each workspace has its own subscription to the particular Azure Marketplace offering, which allows you to control and monitor spending. Select **Subscribe and Deploy**.

    > [!NOTE]
    > Subscribing a workspace to Jamba-Instruct requires that your account has **Contributor** or **Owner** access at the subscription level where the project is created. Alternatively, your user account can be assigned a custom role that has the Azure subscription permissions and resource group permissions listed in the [prerequisites](#prerequisites).

1. Once you sign up the workspace for the particular Azure Marketplace offering, subsequent deployments of the _same_ offering in the _same_ workspace don't require subscribing again. Therefore, you don't need to have the subscription-level permissions for subsequent deployments. If this scenario applies to you, select **Continue to deploy**.

1. Give the deployment a name. This name becomes part of the deployment API URL. This URL must be unique in each Azure region.
1. Select **Deploy**. Wait until the deployment is finished and you're redirected to the serverless endpoints page.
1. Select the endpoint to open its Details page.
1. Select the **Test** tab to start interacting with the model.
1. You can also take note of the **Target** URL and the **Secret Key** to call the deployment and generate completions.   
1. You can always find the endpoint's details, URL, and access keys by navigating to **Workspace** > **Endpoints** > **Serverless endpoints**.

To learn about billing for Jamba-Instruct deployed as a serverless API, see [Cost and quota considerations for Jamba models deployed as a serverless API](#cost-and-quota-considerations-for-jamba-models-deployed-as-a-serverless-api).

### Consume Jamba-Instruct as a serverless API

1. In the **workspace**, select **Endpoints** > **Serverless endpoints**.
1. Find and select the deployment you created.
1. Copy the **Target** URL and the **Key** token values.
1. Make an API request: 

    - For chat completion, use the [`<target_url>/v1/completions`](#completions-api) API.
    - For chat, use the [`<target_url>/v1/chat/completions`](#chat-api) API.

For more information on using the APIs, see the [reference](#reference-for-jamba-models-deployed-a-serverless-api) section.

### Reference for Jamba-Instruct deployed a serverless API

Since Jamba-Instruct is fine-tuned for chat completion, we support the route `/chat/completions` as part of the [Azure AI Model Inference API](reference-model-inference-api.md) for multi-turn chat or single-turn question-answering. AI21's [Jamba Instruct model](https://docs.ai21.com/reference/jamba-instruct-api) can also be used. For more information about the REST endpoint being called, visit [AI21's REST documentation](https://docs.ai21.com/reference/jamba-instruct-api).

The [Azure AI Model Inference API](reference-model-inference-api.md) schema can be found in the [reference for Chat Completions](reference-model-inference-chat-completions.md) article and an [OpenAPI specification can be obtained from the endpoint itself](reference-model-inference-api.md?tabs=rest#getting-started).

Single- and multi-turn chat have the same request and response format, except that question answering (single-turn) involves only a single user message in the request, while multi-turn chat requires that you send the entire chat message history in each request. In a multi-turn chat, the message thread includes all messages from the user and the model, ordered oldest to newest, alternating between `user` and `assistant` role messages, optionally starting with a system
message to provide context. For example, the message stack for the fourth call in a chat request that includes an initial system message would look like this in pseudocode:

```json
[
    {"role": "system", "message": "Some contextual information here"},
    {"role": "user", "message": "User message 1"},
    {"role": "assistant", "message": "System response 1"},
    {"role": "user", "message": "User message 2"},
    {"role": "assistant"; "message": "System response 2"},
    {"role": "user", "message": "User message 3"},
    {"role": "assistant", "message": "System response 3"},
    {"role": "user", "message": "User message 4"}
]
```

#### Chat API

Use the method `POST` to send the request to the `/v1/chat/completions` route:

__Request__

```HTTP/1.1
POST /v1/chat/completions HTTP/1.1
Host: <DEPLOYMENT_URI>
Authorization: Bearer <TOKEN>
Content-type: application/json
```

#### Request schema

Payload is a JSON formatted string containing the following parameters:

| Key           | Type           | Required/Default | Allowed values    | Description                                                                                                                                                                                                                                                                                         |
| ------------- | -------------- | :-----------------:| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `model`       | `string`       | Y    | Must be `jamba-instruct`                                                                                                                                                                                                                                                                            |
| `messages`    | `list[object]` | Y     | A list of objects, one per message, from oldest to newest. The oldest message can be role `system`. All later messages must alternate between user and assistant roles. See the message object definition below.                                                                                    |
| `max_tokens`  | `integer`      | N <br>`4096` |  0 – 4096     | The maximum number of tokens to allow for each generated response message. Typically the best way to limit output length is by providing a length limit in the system prompt (for example, "limit your answers to three sentences")                                                                 |
| `temperature` | `float`        | N <br>`1`  |  0.0 – 2.0      | How much variation to provide in each answer. Setting this value to 0 guarantees the same response to the same question every time. Setting a higher value encourages more variation. Modifies the distribution from which tokens are sampled. We recommend altering this or `top_p`, but not both. |
| `top_p`       | `float`        | N <br>`1`  | 0 < _value_ <=1.0 | Limit the pool of next tokens in each step to the top N percentile of possible tokens, where 1.0 means the pool of all possible tokens, and 0.01 means the pool of only the most likely next tokens.                                                                                                |
| `stop`        | `string` OR `list[string]`      | N <br>  | ""  | String or list of strings containing the word(s) where the API should stop generating output. Newlines are allowed as "\n". The returned text won't contain the stop sequence. |
| `n`           | `integer`      | N <br>`1`  | 1 – 16          | How many responses to generate for each prompt. With Azure AI Playground, `n=1` as we work on multi-response Playground.                                                                                                                                                                                              |
| `stream`   | `boolean`      | N <br>`False` | `True` OR `False` | Whether to enable streaming. If true, results are returned one token at a time. If set to true, `n` must be 1, which is automatically set.                                                                                                                                                                                     |

The `messages` object has the following fields:
  - `role`: [_string, required_] The author or purpose of the message. One of the following values:
    - `user`:  Input provided by the user. Any instructions given here that conflict with instructions given in the `system` prompt take precedence over the `system` prompt instructions.
    - `assistant`:  A response generated by the model.
    - `system`:  Initial instructions to provide general guidance on the tone and voice of the generated message. An initial system message is optional, but recommended to provide guidance on the tone of the chat. For example, "You are a helpful chatbot with a background in earth sciences and a charming French accent."
  - `content`: [_string, required_] The content of the message.


#### Request Example

__Single-turn example__

```JSON
{
    "model": "jamba-instruct",
    "messages": [
    {
      "role":"user",
      "content":"Who was the first emperor of rome?"}
  ],
    "temperature": 0.8,
    "max_tokens": 512
}
```

__Chat example (fourth request containing third user response)__

```JSON
{
  "model": "jamba-instruct",
  "messages": [
     {"role": "system",
      "content": "You are a helpful genie just released from a bottle. You start the conversation with 'Thank you for freeing me! I grant you one wish.'"},
     {"role":"user",
      "content":"I want a new car"},
     {"role":"assistant",
      "content":"🚗 Great choice, I can definitely help you with that! Before I grant your wish, can you tell me what kind of car you're looking for?"},
     {"role":"user",
      "content":"A corvette"},
     {"role":"assistant",
      "content":"Great choice! What color and year?"},
     {"role":"user",
      "content":"1963 black split window Corvette"}
  ],
  "n":3
}
```

#### Response schema

The response depends slightly on whether the result is streamed or not.

**In a non-streamed result**, all responses are delivered together in a single response, which also includes a `usage` property.

**In a streamed result:**

* Each response includes a single token in the `choices` field
* The `choices` object structure is different
* Only the last response includes a `usage` object
* The entire response is wrapped in a `data` object
* The final response object is `data: [DONE]` 

The response payload is a dictionary with the following fields.

| Key       | Type      | Description                                                         |
| --------- | --------- | ------------------------------------------------------------------- |
| `id`      | `string`  | A unique identifier for the request.                                |
| `model`   | `string`  | Name of the model used.                                   |
| `choices` | `list[object`]|The model-generated response text. For a non-streaming response it is a list with `n` items. For a streaming response, it is a single object containing a single token. See the object description below. |
| `created` | `integer` | The Unix timestamp (in seconds) of when the completion was created. |
| `object`  | `string`  | The object type, which is always `chat.completion`.                 |
| `usage`   | `object`  | Usage statistics for the completion request. See below for details. |

The `choices` response object contains the model-generated response. The object has the following fields:

| Key             | Type      | Description                                                                                                                                                                                                                                                                                                                                      |
| --------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `index`         | `integer` | Zero-based index of the message in the list of messages. Might not correspond to the position in the list. For streamed messages this is always zero.                                                                                                                                                                                           |
| `message` OR `delta`      | `object`  | The generated message (or token in a streaming response). Same object type as described in the request with two changes:<br> - In a non-streaming response, this object is called `message`. <br>- In a streaming response, it is called `delta`, and contains either `message` or `role` but never both.                                                                                                                                                                                                                                        |
| `finish_reason` | `string`  | The reason the model stopped generating tokens: <br>- `stop`: The model reached a natural stop point, or a provided stop sequence. <br>- `length`: Max number of tokens have been reached. <br>- `content_filter`: The generated response violated a responsible AI policy. <br>- `null`: Streaming only. In a streaming response, all responses except the last will be `null`. |

The `usage` response object contains the following fields. 

| Key                 | Type      | Value                                                                                                                                                                                                                                                                                                                   |
| ------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `prompt_tokens`     | `integer` | Number of tokens in the prompt. Note that the prompt token count includes extra tokens added by the system to format the prompt list into a single string as required by the model. The number of extra tokens is typically proportional to the number of messages in the thread, and should be relatively small. |
| `completion_tokens` | `integer` | Number of tokens generated in the completion.                                                                                                                                                                                                                                                                           |
| `total_tokens`      | `integer` | Total tokens. 

#### Non-streaming response example

```JSON
{
  "id":"cmpl-524c73beb8714d878e18c3b5abd09f2a",
  "choices":[
    {
      "index":0,
      "message":{
        "role":"assistant",
        "content":"The human nose can detect over 1 trillion different scents, making it one of the most sensitive smell organs in the animal kingdom."
      },
      "finishReason":"stop"
    }
  ],
  "created": 1717487036,
  "usage":{
    "promptTokens":116,
    "completionTokens":30,
    "totalTokens":146
  }
}
```
#### Streaming response example
```JSON
data: {"id": "cmpl-8e8b2f6556f94714b0cd5cfe3eeb45fc", "choices": [{"index": 0, "delta": {"role": "assistant"}, "created": 1717487336, "finish_reason": null}]}
data: {"id": "cmpl-8e8b2f6556f94714b0cd5cfe3eeb45fc", "choices": [{"index": 0, "delta": {"content": ""}, "created": 1717487336, "finish_reason": null}]}
data: {"id": "cmpl-8e8b2f6556f94714b0cd5cfe3eeb45fc", "choices": [{"index": 0, "delta": {"content": " The"}, "created": 1717487336, "finish_reason": null}]}
data: {"id": "cmpl-8e8b2f6556f94714b0cd5cfe3eeb45fc", "choices": [{"index": 0, "delta": {"content": " first e"}, "created": 1717487336, "finish_reason": null}]}
data: {"id": "cmpl-8e8b2f6556f94714b0cd5cfe3eeb45fc", "choices": [{"index": 0, "delta": {"content": "mpe"}, "created": 1717487336, "finish_reason": null}]}
... 115 responses omitted for sanity ...
data: {"id": "cmpl-8e8b2f6556f94714b0cd5cfe3eeb45fc", "choices": [{"index": 0, "delta": {"content": "me"}, "created": 1717487336, "finish_reason": null}]}
data: {"id": "cmpl-8e8b2f6556f94714b0cd5cfe3eeb45fc", "choices": [{"index": 0, "delta": {"content": "."}, "created": 1717487336,"finish_reason": "stop"}], "usage": {"prompt_tokens": 107, "completion_tokens": 121, "total_tokens": 228}}
data: [DONE]
```

## Deploy Jamba models to managed compute

Apart from deploying with the pay-as-you-go managed service, you can also deploy Llama 3 models to managed compute in Azure Machine Learning studio. When deployed to managed compute, you can select all the details about the infrastructure running the model, including the virtual machines to use and the number of instances to handle the load you're expecting. Models deployed to managed compute consume quota from your subscription. All the models in the Jamba family can be deployed to managed compute.

### Create a new deployment

Follow these steps to deploy a model such as `Llama-3-7B-Instruct` to a real-time endpoint in [Azure Machine Learning studio](https://ml.azure.com).

1. Select the workspace in which you want to deploy the model.
1. Choose the model that you want to deploy from the studio's [model catalog](https://ml.azure.com/model/catalog).

   Alternatively, you can initiate deployment by going to your workspace and selecting **Endpoints** > **real-time endpoints** > **Create**.

1. On the model's overview page, select **Deploy** and then **Managed Compute without Azure AI Content Safety**.

1. On the **Deploy with Azure AI Content Safety (preview)** page, select **Skip Azure AI Content Safety** so that you can continue to deploy the model using the UI.

    > [!TIP]
    > In general, we recommend that you select **Enable Azure AI Content Safety (Recommended)** for deployment of the Jamba model. This deployment option is currently only supported using the Python SDK and it happens in a notebook.

1. Select **Proceed**.

    > [!TIP]
    > If you don't have enough quota available in the selected project, you can use the option **I want to use shared quota and I acknowledge that this endpoint will be deleted in 168 hours**.

1. Select the **Virtual machine** and the **Instance count** that you want to assign to the deployment.
1. Select if you want to create this deployment as part of a new endpoint or an existing one. Endpoints can host multiple deployments while keeping resource configuration exclusive for each of them. Deployments under the same endpoint share the endpoint URI and its access keys.
1. Indicate if you want to enable **Inferencing data collection (preview)**.
1. Indicate if you want to enable **Package Model (preview)**.
1. Select **Deploy**. After a few moments, the endpoint's **Details** page opens up.
1. Wait for the endpoint creation and deployment to finish. This step can take a few minutes.
1. Select the endpoint's **Consume** page to obtain code samples that you can use to consume the deployed model in your application.

For more information on how to deploy models to managed compute using the studio, see [Deploying foundation models to endpoints for inferencing](how-to-use-foundation-models.md#deploying-foundation-models-to-endpoints-for-inferencing).


### Consume Jamba models deployed to managed compute

For reference about how to invoke Jamba models deployed to real-time endpoints, see the model's card in Azure Machine Learning studio [model catalog](concept-model-catalog.md). Each model's card has an overview page that includes a description of the model, samples for code-based inferencing, fine-tuning, and model evaluation.

## Cost and quotas

### Cost and quota considerations for Jamba models deployed as a serverless API

Jamba models deployed as a serverless API are offered by AI21 through Azure Marketplace and integrated with Azure Machine Learning studio for use. You can find Azure Marketplace pricing when deploying or fine-tuning models.

Each time a workspace subscribes to a given model offering from Azure Marketplace, a new resource is created to track the costs associated with its consumption. The same resource is used to track costs associated with inference and fine-tuning; however, multiple meters are available to track each scenario independently.

For more information on how to track costs, see [Monitor costs for models offered through the Azure Marketplace](../ai-studio/how-to/costs-plan-manage.md#monitor-costs-for-models-offered-through-the-azure-marketplace).

:::image type="content" source="media/how-to-deploy-models-llama/costs-model-as-service-cost-details.png" alt-text="A screenshot showing different resources corresponding to different model offerings and their associated meters." lightbox="media/how-to-deploy-models-llama/costs-model-as-service-cost-details.png":::

Quota is managed per deployment. Each deployment has a rate limit of 200,000 tokens per minute and 1,000 API requests per minute. However, we currently limit one deployment per model per project. Contact Microsoft Azure Support if the current rate limits aren't sufficient for your scenarios.

### Cost and quota considerations for Jamba models deployed managed compute

For deployment and inferencing of Jamba models with managed compute, you consume virtual machine (VM) core quota that is assigned to your subscription on a per-region basis. When you sign up for Azure Machine Learning studio, you receive a default VM quota for several VM families available in the region. You can continue to create deployments until you reach your quota limit. Once you reach this limit, you can request a quota increase.  

## Content filtering

Models deployed as a serverless API are protected by Azure AI content safety. When deployed to managed compute, you can opt out of this capability. With Azure AI content safety enabled, both the prompt and completion pass through an ensemble of classification models aimed at detecting and preventing the output of harmful content. The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions. Learn more about [Azure AI Content Safety](/azure/ai-services/content-safety/overview).

## Related content

- [Model Catalog and Collections](concept-model-catalog.md)
- [Deploy and score a machine learning model by using an online endpoint](how-to-deploy-online-endpoints.md)
- [Plan and manage costs for Azure AI Studio](../ai-studio/how-to/costs-plan-manage.md)
