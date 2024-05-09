---
title: How to deploy Cohere Embed models with Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn how to deploy Cohere Embed models with Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.topic: how-to
ms.date: 04/02/2024
ms.reviewer: shubhiraj
ms.author: mopeakande
author: msakande
ms.custom: [references_regions]
---

# How to deploy Cohere Embed models with Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

In this article, you learn how to use Azure AI Studio to deploy the Cohere Embed models as a service with pay-as you go billing.

Cohere offers two Embed models in [Azure AI Studio](https://ai.azure.com). These models are available with pay-as-you-go token based billing with Models as a Service. 
* Cohere Embed v3 - English
* Cohere Embed v3 - Multilingual

You can browse the Cohere family of models in the [Model Catalog](model-catalog.md) by filtering on the Cohere collection.

## Models 

In this article, you learn how to use Azure AI Studio to deploy the Cohere Embed models as a service with pay-as-you-go billing.

### Cohere Embed v3 - English
Cohere Embed English is the market's leading text representation model used for semantic search, retrieval-augmented generation (RAG), classification, and clustering. Embed English has top performance on the HuggingFace MTEB benchmark and performs well on various industries such as Finance, Legal, and General-Purpose Corpora.

* Embed English has 1,024 dimensions.
* Context window of the model is 512 tokens

### Cohere Embed v3 - Multilingual
Cohere Embed Multilingual is the market's leading text representation model used for semantic search, retrieval-augmented generation (RAG), classification, and clustering. Embed Multilingual supports 100+ languages and can be used to search within a language (for example, search with a French query on French documents) and across languages (for example, search with an English query on Chinese documents). Embed multilingual has SOTA performance on multilingual benchmarks such as Miracl.

* Embed Multilingual has 1,024 dimensions.
* Context window of the model is 512 tokens

## Deploy with pay-as-you-go

Certain models in the model catalog can be deployed as a service with pay-as-you-go, providing a way to consume them as an API without hosting them on your subscription, while keeping the enterprise security and compliance organizations need. This deployment option doesn't require quota from your subscription.

The previously mentioned Cohere models can be deployed as a service with pay-as-you-go, and are offered by Cohere through the Microsoft Azure Marketplace. Cohere can change or update the terms of use and pricing of this model.

### Prerequisites

- An Azure subscription with a valid payment method. Free or trial Azure subscriptions won't work. If you don't have an Azure subscription, create a [paid Azure account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go) to begin.
- An [Azure AI hub resource](../how-to/create-azure-ai-resource.md).

    > [!IMPORTANT]
    > For Cohere family models, the pay-as-you-go model deployment offering is only available with AI hubs created in EastUS2 or Sweden Central region.

- An [Azure AI project](../how-to/create-projects.md) in Azure AI Studio.
- Azure role-based access controls are used to grant access to operations in Azure AI Studio. To perform the steps in this article, your user account must be assigned the __Azure AI Developer role__ on the resource group. For more information on permissions, see [Role-based access control in Azure AI Studio](../concepts/rbac-ai-studio.md).


### Create a new deployment

To create a deployment:

1. Sign in to [Azure AI Studio](https://ai.azure.com).
1. Select **Model catalog** from the **Explore** tab and search for *Cohere*. 

    Alternatively, you can initiate a deployment by starting from your project in AI Studio. From the **Build** tab of your project, select **Deployments** > **+ Create**.

1. In the model catalog, on the model's **Details** page, select **Deploy** and then **Pay-as-you-go**.

    :::image type="content" source="../media/deploy-monitor/cohere-embed/embed-english-deploy-pay-as-you-go.png" alt-text="A screenshot showing how to deploy a model with the pay-as-you-go option." lightbox="../media/deploy-monitor/cohere-embed/embed-english-deploy-pay-as-you-go.png":::

1. Select the project in which you want to deploy your model. To deploy the model, your project must be in the EastUS2 or Sweden Central region.
1. In the deployment wizard, select the link to **Azure Marketplace Terms** to learn more about the terms of use.
1. You can also select the **Marketplace offer details** tab to learn about pricing for the selected model.
1. If it is your first time deploying the model in the project, you have to subscribe your project for the particular offering. This step requires that your account has the **Azure AI Developer role** permissions on the Resource Group, as listed in the prerequisites. Each project has its own subscription to the particular Azure Marketplace offering of the model, which allows you to control and monitor spending. Select **Subscribe and Deploy**. Currently you can have only one deployment for each model within a project.

    :::image type="content" source="../media/deploy-monitor/cohere-embed/embed-english-marketplace-terms.png" alt-text="A screenshot showing the terms and conditions of a given model." lightbox="../media/deploy-monitor/cohere-embed/embed-english-marketplace-terms.png":::

1. Once you subscribe the project for the particular Azure Marketplace offering, subsequent deployments of the _same_ offering in the _same_ project don't require subscribing again. If this scenario applies to you, there's a **Continue to deploy** option to select (Currently you can have only one deployment for each model within a project).

    :::image type="content" source="../media/deploy-monitor/cohere-embed/embed-english-existing-subscription.png" alt-text="A screenshot showing a project that is already subscribed to the offering." lightbox="../media/deploy-monitor/cohere-embed/embed-english-existing-subscription.png":::

1. Give the deployment a name. This name becomes part of the deployment API URL. This URL must be unique in each Azure region.

    :::image type="content" source="../media/deploy-monitor/cohere-embed/embed-english-deployment-name.png" alt-text="A screenshot showing how to indicate the name of the deployment you want to create." lightbox="../media/deploy-monitor/cohere-embed/embed-english-deployment-name.png":::

1. Select **Deploy**. Wait until the deployment is ready and you're redirected to the Deployments page.
1. Select **Open in playground** to start interacting with the model.
1. You can return to the Deployments page, select the deployment, and note the endpoint's **Target** URL and the Secret **Key**. For more information on using the APIs, see the [reference](#embed-api-reference-for-cohere-embed-models-deployed-as-a-service) section.
1. You can always find the endpoint's details, URL, and access keys by navigating to the **Build** tab  and selecting **Deployments** from the Components section.

To learn about billing for the Cohere models deployed with pay-as-you-go, see [Cost and quota considerations for Cohere models deployed as a service](#cost-and-quota-considerations-for-models-deployed-as-a-service).

### Consume the Cohere Embed models as a service

These models can be consumed using the embed API.

1. On the **Build** page, select **Deployments**.

1. Find and select the deployment you created.

1. Copy the **Target** URL and the **Key** value.

1. Cohere exposes two routes for inference with the Embed v3 - English and Embed v3 - Multilingual models. `v1/embeddings` adheres to the Azure AI Generative Messages API schema, and `v1/embed` supports Cohere's native API schema.

    For more information on using the APIs, see the [reference](#embed-api-reference-for-cohere-embed-models-deployed-as-a-service) section.

## Embed API reference for Cohere Embed models deployed as a service

### v1/embeddings 
#### Request

```
    POST /v1/embeddings HTTP/1.1
    Host: <DEPLOYMENT_URI>
    Authorization: Bearer <TOKEN>
    Content-type: application/json
```

#### v1/embeddings request schema

Cohere Embed v3 - English and Embed v3 - Multilingual accept the following parameters for a `v1/embeddings` API call:

| Property | Type | Default | Description |
| --- | --- | --- | --- |
|`input` |`array of strings` |Required |An array of strings for the model to embed. Maximum number of texts per call is 96. We recommend reducing the length of each text to be under 512 tokens for optimal quality. |

#### v1/embeddings response schema

The response payload is a dictionary with the following fields:

| Key | Type | Description |
| --- | --- | --- |
| `id` | `string` | A unique identifier for the completion. |
| `object` | `enum`|The object type, which is always `list` |
| `data` | `array` | The Unix timestamp (in seconds) of when the completion was created. |
| `model` | `string` | The model_id used for creating the embeddings. |
| `usage` | `object` | Usage statistics for the completion request. |

The `data` object is a dictionary with the following fields:

| Key | Type | Description |
| --- | --- | --- |
| `index` | `integer` |The index of the embedding in the list of embeddings. |
| `object` | `enum` | The object type, which is always "embedding". |
| `embedding` | `array` | The embedding vector, which is a list of floats. |

The `usage` object is a dictionary with the following fields:

| Key | Type | Description |
| --- | --- | --- |
| `prompt_tokens` | `integer` | Number of tokens in the prompt. |
| `completion_tokens` | `integer` | Number of tokens generated in the completion. |
| `total_tokens` | `integer` | Total tokens. |


### v1/embeddings examples

Request:

```json
    {    
    "input": ["hi"]
    }
```

Response:

```json
    {
        "id": "87cb11c5-2316-4c88-af3c-4b2b77ed58f3",
        "object": "list",
        "data": [
            {
                "index": 0,
                "object": "embedding",
                "embedding": [
                    1.1513672,
                    1.7060547,
                    ...
                ]
            }
        ],
        "model": "tmp",
        "usage": {
            "prompt_tokens": 1,
            "completion_tokens": 0,
            "total_tokens": 1
        }
    }
```

### v1/embed 
#### Request

```
    POST /v1/embed HTTP/1.1
    Host: <DEPLOYMENT_URI>
    Authorization: Bearer <TOKEN>
    Content-type: application/json
```

#### v1/embed request schema

Cohere Embed v3 - English and Embed v3 - Multilingual accept the following parameters for a `v1/embed` API call:

|Key       |Type   |Default   |Description   |
|---|---|---|---|
|`texts` |`array of strings` |Required |An array of strings for the model to embed. Maximum number of texts per call is 96. We recommend reducing the length of each text to be under 512 tokens for optimal quality. |
|`input_type` |`enum string` |Required |Prepends special tokens to differentiate each type from one another. You shouldn't mix different types together, except when mixing types for for search and retrieval. In this case, embed your corpus with the `search_document` type and embedded queries with type `search_query` type. <br/> `search_document` – In search use-cases, use search_document when you encode documents for embeddings that you store in a vector database. <br/> `search_query` – Use search_query when querying your vector database to find relevant documents. <br/> `classification` – Use classification when using embeddings as an input to a text classifier. <br/> `clustering` – Use clustering to cluster the embeddings.|
|`truncate` |`enum string` |`NONE` |`NONE` –  Returns an error when the input exceeds the maximum input token length. <br/> `START` – Discards the start of the input. <br/> `END` – Discards the end of the input. |
|`embedding_types` |`array of strings` |`float` |Specifies the types of embeddings you want to get back. Can be one or more of the following types. `float`, `int8`, `uint8`, `binary`, `ubinary` |

#### v1/embed response schema

Cohere Embed v3 - English and Embed v3 - Multilingual include the following fields in the response:

|Key       |Type   |Description   |
|---|---|---|
|`response_type` |`enum` |The response type. Returns `embeddings_floats` when `embedding_types` isn't specified, or returns `embeddings_by_type` when `embeddings_types` is specified. |
|`id` |`integer` |An identifier for the response. |
|`embeddings` |`array` or `array of objects` |An array of embeddings, where each embedding is an array of floats with 1,024 elements. The length of the embeddings array is the same as the length of the original texts array.|
|`texts` |`array of strings` |The text entries for which embeddings were returned. |
|`meta`   |`string`   |API usage data, including current version and billable tokens.   |

For more information, see [https://docs.cohere.com/reference/embed](https://docs.cohere.com/reference/embed).

### v1/embed examples

#### embeddings_floats Response

Request:

```json
    {
        "input_type": "clustering",
        "truncate": "START",
        "texts":["hi", "hello"]
    }
```

Response:

```json
    {
        "id": "da7a104c-e504-4349-bcd4-4d69dfa02077",
        "texts": [
            "hi",
            "hello"
        ],
        "embeddings": [
            [
                ...
            ],
            [
                ...
            ]
        ],
        "meta": {
            "api_version": {
                "version": "1"
            },
            "billed_units": {
                "input_tokens": 2
            }
        },
        "response_type": "embeddings_floats"
    }
```

#### Embeddings_by_types response

Request:

```json
    {
        "input_type": "clustering",
        "embedding_types": ["int8", "binary"],
        "truncate": "START",
        "texts":["hi", "hello"]
    }
```

Response:

```json
    {
        "id": "b604881a-a5e1-4283-8c0d-acbd715bf144",
        "texts": [
            "hi",
            "hello"
        ],
        "embeddings": {
            "binary": [
                [
                    ...
                ],
                [
                    ...
                ]
            ],
            "int8": [
                [
                    ...
                ],
                [
                    ...
                ]
            ]
        },
        "meta": {
            "api_version": {
                "version": "1"
            },
            "billed_units": {
                "input_tokens": 2
            }
        },
        "response_type": "embeddings_by_type"
    }
```

#### More inference examples

| **Package**       | **Sample Notebook**                             |
|----------------|----------------------------------------|
| CLI using CURL and Python web requests  | [cohere-embed.ipynb](https://aka.ms/samples/embed-v3/webrequests)|
| OpenAI SDK (experimental)    | [openaisdk.ipynb](https://aka.ms/samples/cohere-embed/openaisdk)                                    |
| LangChain      | [langchain.ipynb](https://aka.ms/samples/cohere-embed/langchain)                                |
| Cohere SDK     | [cohere-sdk.ipynb](https://aka.ms/samples/cohere-embed/cohere-python-sdk)                                 |
| LiteLLM SDK    | [litellm.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/foundation-models/cohere/litellm.ipynb) |

##### Retrieval Augmented Generation (RAG) and tool-use samples
**Description** | **Package** | **Sample Notebook**
--|--|--
Create a local Facebook AI Similarity Search (FAISS) vector index, using Cohere embeddings - Langchain|`langchain`, `langchain_cohere`|[cohere_faiss_langchain_embed.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/foundation-models/cohere/cohere_faiss_langchain_embed.ipynb)
Use Cohere Command R/R+ to answer questions from data in local FAISS vector index - Langchain|`langchain`, `langchain_cohere`|[command_faiss_langchain.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/foundation-models/cohere/command_faiss_langchain.ipynb)
Use Cohere Command R/R+ to answer questions from data in AI search vector index - Langchain|`langchain`, `langchain_cohere`|[cohere-aisearch-langchain-rag.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/foundation-models/cohere/cohere-aisearch-langchain-rag.ipynb)
Use Cohere Command R/R+ to answer questions from data in AI search vector index - Cohere SDK| `cohere`, `azure_search_documents`|[cohere-aisearch-rag.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/foundation-models/cohere/cohere-aisearch-rag.ipynb)
Command R+ tool/function calling, using LangChain|`cohere`, `langchain`, `langchain_cohere`|[command_tools-langchain.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/foundation-models/cohere/command_tools-langchain.ipynb)

## Cost and quotas

### Cost and quota considerations for models deployed as a service

Cohere models deployed as a service are offered by Cohere through the Azure Marketplace and integrated with Azure AI Studio for use. You can find the Azure Marketplace pricing when deploying the model.

Each time a project subscribes to a given offer from the Azure Marketplace, a new resource is created to track the costs associated with its consumption. The same resource is used to track costs associated with inference; however, multiple meters are available to track each scenario independently.

For more information on how to track costs, see [monitor costs for models offered throughout the Azure Marketplace](./costs-plan-manage.md#monitor-costs-for-models-offered-through-the-azure-marketplace).

Quota is managed per deployment. Each deployment has a rate limit of 200,000 tokens per minute and 1,000 API requests per minute. However, we currently limit one deployment per model per project. Contact Microsoft Azure Support if the current rate limits aren't sufficient for your scenarios. 

## Content filtering

Models deployed as a service with pay-as-you-go are protected by [Azure AI Content Safety](../../ai-services/content-safety/overview.md). With Azure AI content safety, both the prompt and completion pass through an ensemble of classification models aimed at detecting and preventing the output of harmful content. The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions. Learn more about [content filtering here](../concepts/content-filtering.md).

## Next steps

- [What is Azure AI Studio?](../what-is-ai-studio.md)
- [Azure AI FAQ article](../faq.yml)
