---
title: How to deploy JAIS models with Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn how to deploy JAIS models with Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: haelhamm
ms.author: ssalgado
author: ssalgadodev
ms.custom: references_regions, build-2024
---

# How to deploy JAIS with Azure AI Studio

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

In this article, you learn how to use Azure AI Studio to deploy the JAIS model as serverless APIs with pay-as-you-go token-based billing.

The JAIS model is available in [Azure AI Studio](https://ai.azure.com) with pay-as-you-go token based billing with Models as a Service. 

You can find the JAIS model in the [Model Catalog](model-catalog.md) by filtering on the JAIS collection.

### Prerequisites

- An Azure subscription with a valid payment method. Free or trial Azure subscriptions will not work. If you don't have an Azure subscription, create a [paid Azure account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go) to begin.
- An [Azure AI Studio hub](../how-to/create-azure-ai-resource.md).

    > [!IMPORTANT]
    > For JAIS models, the serverless API model deployment offering is only available with hubs created in East US 2 or Sweden Central region.

- An [AI Studio project](../how-to/create-projects.md) in Azure AI Studio.
- Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure AI Studio. To perform the steps in this article, your user account must be assigned the __Azure AI Developer role__ on the resource group. For more information on permissions, see [Role-based access control in Azure AI Studio](../concepts/rbac-ai-studio.md).


### JAIS 30b Chat

JAIS 30b Chat is an auto-regressive bi-lingual LLM for **Arabic** & **English**. The tuned versions use supervised fine-tuning (SFT). The model is finetuned with both Arabic and English prompt-response pairs. The finetuning datasets included a wide range of instructional data across various domains. The model covers a wide range of common tasks including question answering, code generation, and reasoning over textual content. To enhance performance in Arabic, the Core42 team developed an in-house Arabic dataset as well as translating some open-source English instructions into Arabic.

*Context length:* JAIS supports a context length of 8K.

*Input:* Model input is text only.

*Output:* Model generates text only.

## Deploy as a serverless API


Certain models in the model catalog can be deployed as a serverless API with pay-as-you-go billing. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription.

The previously mentioned JAIS 30b Chat model can be deployed as a service with pay-as-you-go billing and is offered by Core42 through the Microsoft Azure Marketplace. Core42 can change or update the terms of use and pricing of this model.


### Create a new deployment

To create a deployment:

1. Sign in to [Azure AI Studio](https://ai.azure.com).
1. Select **Model catalog** from the left sidebar.
1. Search for *JAIS* and select the model _Jais-30b-chat_.

    :::image type="content" source="../media/deploy-monitor/jais/jais-search.png" alt-text="A screenshot showing a model in the model catalog." lightbox="../media/deploy-monitor/jais/jais-search.png":::

2.  Select **Deploy** to open a serverless API deployment window for the model.

    :::image type="content" source="../media/deploy-monitor/jais/jais-deploy-pay-as-you-go.png" alt-text="A screenshot showing how to deploy a model with the pay-as-you-go option." lightbox="../media/deploy-monitor/jais/jais-deploy-pay-as-you-go.png":::

1. Select the project in which you want to deploy your model. To deploy the model your project must be in the East US 2 or Sweden Central region.
1. In the deployment wizard, select the link to **Azure Marketplace Terms** to learn more about the terms of use.
1. Select the **Pricing and terms** tab to learn about pricing for the selected model.
1. Select the **Subscribe and Deploy** button. If this is your first time deploying the model in the project, you have to subscribe your project for the particular offering. This step requires that your account has the **Azure AI Developer role** permissions on the resource group, as listed in the prerequisites. Each project has its own subscription to the particular Azure Marketplace offering of the model, which allows you to control and monitor spending. Currently, you can have only one deployment for each model within a project.

    :::image type="content" source="../media/deploy-monitor/jais/jais-marketplace-terms.png" alt-text="A screenshot showing the terms and conditions of a given model." lightbox="../media/deploy-monitor/jais/jais-marketplace-terms.png":::

1. Once you subscribe the project for the particular Azure Marketplace offering, subsequent deployments of the _same_ offering in the _same_ project don't require subscribing again. If this scenario applies to you, there's a **Continue to deploy** option to select.

    :::image type="content" source="../media/deploy-monitor/jais/jais-existing-subscription.png" alt-text="A screenshot showing a project that is already subscribed to the offering." lightbox="../media/deploy-monitor/jais/jais-existing-subscription.png":::

1. Give the deployment a name. This name becomes part of the deployment API URL. This URL must be unique in each Azure region.

    :::image type="content" source="../media/deploy-monitor/jais/jais-deployment-name.png" alt-text="A screenshot showing how to indicate the name of the deployment you want to create." lightbox="../media/deploy-monitor/jais/jais-deployment-name.png":::

1. Select **Deploy**. Wait until the deployment is ready and you're redirected to the Deployments page.
1. Select **Open in playground** to start interacting with the model.
1. You can return to the Deployments page, select the deployment, and note the endpoint's **Target** URL and the Secret **Key**. For more information on using the APIs, see the [reference](#chat-api-reference-for-jais-deployed-as-a-service) section.
1. You can always find the endpoint's details, URL, and access keys by navigating to your **Project overview** page. Then, from the left sidebar of your project, select **Components** > **Deployments**.

To learn about billing for the JAIS models deployed as a serverless API with pay-as-you-go token-based billing, see [Cost and quota considerations for JAIS models deployed as a service](#cost-and-quota-considerations-for-models-deployed-as-a-service)

### Consume the JAIS 30b Chat model as a service

These models can be consumed using the chat API.

1. From your **Project overview** page, go to the left sidebar and select **Components** > **Deployments**.

1. Find and select the deployment you created.

1. Copy the **Target** URL and the **Key** value.

For more information on using the APIs, see the [reference](#chat-api-reference-for-jais-deployed-as-a-service) section.

## Chat API reference for JAIS deployed as a service

### v1/chat/completions

#### Request
```
    POST /v1/chat/completions HTTP/1.1
    Host: <DEPLOYMENT_URI>
    Authorization: Bearer <TOKEN>
    Content-type: application/json
```

#### v1/chat/completions request schema

JAIS 30b Chat accepts the following parameters for a `v1/chat/completions` response inference call:

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `messages` | `array` | `None` | Text input for the model to respond to. |
| `max_tokens` | `integer` | `None` | The maximum number of tokens the model generates as part of the response. Note: Setting a low value might result in incomplete generations. If not specified, generates tokens until end of sequence. |
| `temperature` | `float` | `0.3` | Controls randomness in the model. Lower values make the model more deterministic and higher values make the model more random. |
| `top_p` | `float` |`None`|The cumulative probability of parameter highest probability vocabulary tokens to keep for nucleus sampling, defaults to null.|
| `top_k` | `integer` |`None`|The number of highest probability vocabulary tokens to keep for top-k-filtering, defaults to null.|


A System or User Message supports the following properties:

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `role` | `enum` | Required | `role=system` or `role=user`. |
|`content` |`string` |Required |Text input for the model to respond to. |


An Assistant Message supports the following properties:

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `role` | `enum` | Required | `role=assistant`|
|`content` |`string` |Required |The contents of the assistant message. |


#### v1/chat/completions response schema

The response payload is a dictionary with the following fields:

| Key | Type | Description |
| --- | --- | --- |
| `id` | `string` | A unique identifier for the completion. |
| `choices` | `array` | The list of completion choices the model generated for the input messages. |
| `created` | `integer` | The Unix timestamp (in seconds) of when the completion was created. |
| `model` | `string` | The model_id used for completion. |
| `object` | `string` | chat.completion. |
| `usage` | `object` | Usage statistics for the completion request. |

The `choices` object is a dictionary with the following fields:

| Key | Type | Description |
| --- | --- | --- |
| `index` | `integer` | Choice index. |
| `messages` or `delta` | `string` | Chat completion result in messages object. When streaming mode is used, delta key is used. |
| `finish_reason` | `string` | The reason the model stopped generating tokens. |

The `usage` object is a dictionary with the following fields:

| Key | Type | Description |
| --- | --- | --- |
| `prompt_tokens` | `integer` | Number of tokens in the prompt. |
| `completion_tokens` | `integer` | Number of tokens generated in the completion. |
| `total_tokens` | `integer` | Total tokens. |


#### Examples

##### Arabic
Request:

```json
    "messages": [
        {
        "role": "user",
        "content": "ما هي الأماكن الشهيرة التي يجب زيارتها في الإمارات؟"
        }
    ]
```

Response:

```json
    {
        "id": "df23b9f7-e6bd-493f-9437-443c65d428a1",
        "choices": [
            {
                "index": 0,
                "finish_reason": "stop",
                "message": {
                    "role": "assistant",
                    "content": "هناك العديد من الأماكن المذهلة للزيارة في الإمارات! ومن أشهرها برج خليفة في دبي وهو أطول مبنى في العالم ، ومسجد الشيخ زايد الكبير في أبوظبي والذي يعد أحد أجمل المساجد في العالم ، وصحراء ليوا في الظفرة والتي تعد أكبر صحراء رملية في العالم وتجذب الكثير من السياح لتجربة ركوب الجمال والتخييم في الصحراء. كما يمكن للزوار الاستمتاع بالشواطئ الجميلة في دبي وأبوظبي والشارقة ورأس الخيمة، وزيارة متحف اللوفر أبوظبي للتعرف على تاريخ الفن والثقافة العالمية"
                }
            }
        ],
        "created": 1711734274,
        "model": "jais-30b-chat",
        "object": "chat.completion",
        "usage": {
            "prompt_tokens": 23,
            "completion_tokens": 744,
            "total_tokens": 767
        }
    }
```

##### English
Request:

```json
    "messages": [
        {
        "role": "user",
        "content": "List the emirates of the UAE."
        }
    ]
```

Response:

```json
    {
        "id": "df23b9f7-e6bd-493f-9437-443c65d428a1",
        "choices": [
            {
                "index": 0,
                "finish_reason": "stop",
                "message": {
                    "role": "assistant",
                    "content": "The seven emirates of the United Arab Emirates are: Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al-Quwain, Fujairah, and Ras Al Khaimah."
                }
            }
        ],
        "created": 1711734274,
        "model": "jais-30b-chat",
        "object": "chat.completion",
        "usage": {
            "prompt_tokens": 23,
            "completion_tokens": 60,
            "total_tokens": 83
        }
    }
```

##### More inference examples

| **Sample Type**       | **Sample Notebook**                             |
|----------------|----------------------------------------|
| CLI using CURL and Python web requests    | [webrequests.ipynb](https://aka.ms/jais/webrequests-sample) |
| OpenAI SDK (experimental)    | [openaisdk.ipynb](https://aka.ms/jais/openaisdk) |
| LiteLLM | [litellm.ipynb](https://aka.ms/jais/litellm-sample) |

## Cost and quotas

### Cost and quota considerations for models deployed as a service

JAIS 30b Chat is deployed as a service are offered by Core42 through the Azure Marketplace and integrated with Azure AI Studio for use. You can find the Azure Marketplace pricing when deploying the model.

Each time a project subscribes to a given offer from the Azure Marketplace, a new resource is created to track the costs associated with its consumption. The same resource is used to track costs associated with inference; however, multiple meters are available to track each scenario independently.

For more information on how to track costs, see [monitor costs for models offered throughout the Azure Marketplace](../how-to/costs-plan-manage.md#monitor-costs-for-models-offered-through-the-azure-marketplace).

Quota is managed per deployment. Each deployment has a rate limit of 200,000 tokens per minute and 1,000 API requests per minute. However, we currently limit one deployment per model per project. Contact Microsoft Azure Support if the current rate limits aren't sufficient for your scenarios. 

## Content filtering

Models deployed as a service with pay-as-you-go billing are protected by [Azure AI Content Safety](../../ai-services/content-safety/overview.md). With Azure AI content safety, both the prompt and completion pass through an ensemble of classification models aimed at detecting and preventing the output of harmful content. The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions. Learn more about [content filtering here](../concepts/content-filtering.md).

## Next steps

- [What is Azure AI Studio?](../what-is-ai-studio.md)
- [Azure AI FAQ article](../faq.yml)
