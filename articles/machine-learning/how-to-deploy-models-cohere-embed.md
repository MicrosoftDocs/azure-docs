---
title: How to deploy Cohere Embed models with Azure Machine Learning studio
titleSuffix: Azure Machine Learning
description: Learn how to deploy Cohere Embed models with Azure Machine Learning studio.
manager: scottpolly
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: how-to
ms.date: 04/02/2024
ms.reviewer: mopeakande
reviewer: msakande
ms.author: shubhiraj
author: shubhirajMsft
ms.custom: references_regions, build-2024

#This functionality is also available in Azure AI Studio: /azure/ai-studio/how-to/deploy-models-cohere.md
---

# How to deploy Cohere Embed models with Azure Machine Learning studio
Cohere offers two Embed models in Azure Machine Learning studio. These models are available as serverless APIs with pay-as-you-go, token-based billing.

* Cohere Embed v3 - English
* Cohere Embed v3 - Multilingual
   
You can browse the Cohere family of models in the model catalog by filtering on the Cohere collection. 

## Models

In this article, you learn how to use Azure Machine Learning studio to deploy the Cohere models as a serverless API with pay-as you go billing.

### Cohere Embed v3 - English
Cohere Embed English is the market's leading text representation model used for semantic search, retrieval-augmented generation (RAG), classification, and clustering. Embed English has top performance on the HuggingFace MTEB benchmark and performs well on various industries such as Finance, Legal, and General-Purpose Corpora.

* Embed English has 1,024 dimensions.
* Context window of the model is 512 tokens.

### Cohere Embed v3 - Multilingual
Cohere Embed Multilingual is the market's leading text representation model used for semantic search, retrieval-augmented generation (RAG), classification, and clustering. Embed Multilingual supports 100+ languages and can be used to search within a language (for example, search with a French query on French documents) and across languages (for example, search with an English query on Chinese documents). Embed multilingual has SOTA performance on multilingual benchmarks such as Miracl.

* Embed Multilingual has 1,024 dimensions.
* Context window of the model is 512 tokens.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## Deploy as a serverless API
Certain models in the model catalog can be deployed as a serverless API with pay-as-you-go billing, providing a way to consume them as an API without hosting them on your subscription, while keeping the enterprise security and compliance organizations need. This deployment option doesn't require quota from your subscription.

The previously mentioned Cohere models can be deployed as a service with pay-as-you-go, and are offered by Cohere through the Microsoft Azure Marketplace. Cohere can change or update the terms of use and pricing of this model.

### Prerequisites

- An Azure subscription with a valid payment method. Free or trial Azure subscriptions won't work. If you don't have an Azure subscription, create a [paid Azure account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go) to begin.
- An Azure Machine Learning workspace. If you don't have these, use the steps in the [Quickstart: Create workspace resources](quickstart-create-resources.md) article to create them.

    > [!IMPORTANT]
    > Pay-as-you-go model deployment offering is only available in workspaces created in EastUS2 or Sweden Central region.

-  Azure role-based access controls (Azure RBAC) are used to grant access to operations. To perform the steps in this article, your user account must be assigned the __Azure AI Developer role__ on the Resource Group.

    For more information on permissions, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

### Create a new deployment

To create a deployment:

1. Go to [Azure Machine Learning studio](https://ml.azure.com/home).
1. Select the workspace in which you want to deploy your models. To use the pay-as-you-go model deployment offering, your workspace must belong to the EastUS2 or Sweden Central region.
1. Choose the model you want to deploy from the [model catalog](https://ml.azure.com/model/catalog).

   Alternatively, you can initiate deployment by going to your workspace and selecting **Endpoints** > **Serverless endpoints** > **Create**.

1. On the model's overview page in the model catalog, select **Deploy**.

    :::image type="content" source="media/how-to-deploy-models-cohere-embed/embed-english-deploy-pay-as-you-go.png" alt-text="A screenshot showing how to deploy a model with the pay-as-you-go option." lightbox="media/how-to-deploy-models-cohere-embed/embed-english-deploy-pay-as-you-go.png":::

1. In the deployment wizard, select the link to **Azure Marketplace Terms** to learn more about the terms of use. 
1. You can also select the **Marketplace offer details** tab to learn about pricing for the selected model.
1. If this is your first time deploying the model in the workspace, you have to subscribe your workspace for the particular offering of the model. This step requires that your account has the **Azure AI Developer role** permissions on the Resource Group, as listed in the prerequisites. Each workspace has its own subscription to the particular Azure Marketplace offering, which allows you to control and monitor spending. Select **Subscribe and Deploy**. Currently you can have only one deployment for each model within a workspace.

    :::image type="content" source="media/how-to-deploy-models-cohere-embed/embed-english-marketplace-terms.png" alt-text="A screenshot showing the terms and conditions of a given model." lightbox="media/how-to-deploy-models-cohere-embed/embed-english-marketplace-terms.png":::

1. Once you subscribe the workspace for the particular Azure Marketplace offering, subsequent deployments of the _same_ offering in the _same_ workspace don't require subscribing again. If this scenario applies to you, there's a **Continue to deploy** option to select.

    :::image type="content" source="media/how-to-deploy-models-cohere-embed/embed-english-existing-deployment.png" alt-text="A screenshot showing a workspace that is already subscribed to the offering." lightbox="media/how-to-deploy-models-cohere-embed/embed-english-existing-deployment.png":::

1. Give the deployment a name. This name becomes part of the deployment API URL. This URL must be unique in each Azure region.

    :::image type="content" source="media/how-to-deploy-models-cohere-embed/embed-english-deployment-name.png" alt-text="A screenshot showing how to indicate the name of the deployment you want to create." lightbox="media/how-to-deploy-models-cohere-embed/embed-english-deployment-name.png":::

1. Select **Deploy**. Wait until the deployment is finished and you're redirected to the serverless endpoints page.
1. Select the endpoint to open its Details page.
1. Select the **Test** tab to start interacting with the model.  
1. You can always find the endpoint's details, URL, and access keys by navigating to **Workspace** > **Endpoints** > **Serverless endpoints**.
1. Take note of the **Target** URL and the **Secret Key**. For more information on using the APIs, see the [reference] (#embed-api-reference-for-cohere-embed-models-deployed-as-a-serverless-api) section.

To learn about billing for models deployed with pay-as-you-go, see [Cost and quota considerations for Cohere models deployed as a service](#cost-and-quota-considerations-for-models-deployed-as-a-service).

### Consume the models deployed as a serverless API

The previously mentioned Cohere models can be consumed using the chat API.

1. In the **workspace**, select **Endpoints** > **Serverless endpoints**.
1. Find and select the deployment you created.
1. Copy the **Target** URL and the **Key** token values.
1. Cohere exposes two routes for inference with the Embed v3 - English and Embed v3 - Multilingual models. `v1/embeddings` adheres to the Azure AI Generative Messages API schema, and `v1/embed` supports Cohere's native API schema.

    For more information on using the APIs, see the [reference](#embed-api-reference-for-cohere-embed-models-deployed-as-a-serverless-api) section.

## Embed API reference for Cohere Embed models deployed as a serverless API

Cohere Embed v3 - English and Embed v3 - Multilingual accept both the [Azure AI Model Inference API](reference-model-inference-api.md) on the route `/embeddings` (for text) and `/images/embeddings` (for images), and the native [Cohere Embed v3 API](#cohere-embed-v3) on `/embed`. 

### Azure AI Model Inference API

The [Azure AI Model Inference API](reference-model-inference-api.md) schema can be found in the following articles:

* [Reference for Text Embeddings](reference-model-inference-embeddings.md)
* [Reference for Image Embeddings](reference-model-inference-images-embeddings.md) 

An [OpenAPI specification can be obtained from the endpoint itself](reference-model-inference-api.md?tabs=rest#getting-started).

### Cohere Embed v3

The following contains details about Cohere Embed v3 API.

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
|`input_type` |`enum string` |Required |Prepends special tokens to differentiate each type from one another. You shouldn't mix different types together, except when mixing types for for search and retrieval. In this case, embed your corpus with the `search_document` type and embedded queries with type `search_query` type. <br/> `search_document` – In search use-cases, use search_document when you encode documents for embeddings that you store in a vector database. <br/> `search_query` – Use search_query when querying your vector DB to find relevant documents. <br/> `classification` – Use classification when using embeddings as an input to a text classifier. <br/> `clustering` – Use clustering to cluster the embeddings.|
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

#### Embeddings_floats response

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

#### Additional inference examples

| **Package**       | **Sample Notebook**                             |
|----------------|----------------------------------------|
| CLI using CURL and Python web requests  | [cohere-embed.ipynb](https://aka.ms/samples/embed-v3/webrequests)|
| OpenAI SDK (experimental)    | [openaisdk.ipynb](https://aka.ms/samples/cohere-embed/openaisdk)                                    |
| LangChain      | [langchain.ipynb](https://aka.ms/samples/cohere-embed/langchain)                                |
| Cohere SDK     | [cohere-sdk.ipynb](https://aka.ms/samples/cohere-embed/cohere-python-sdk)                                 |
| LiteLLM SDK    | [litellm.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/foundation-models/cohere/litellm.ipynb) |

##### Retrieval Augmented Generation (RAG) and tool use samples
**Description** | **Package** | **Sample Notebook**
--|--|--
Create a local Facebook AI Similarity Search (FAISS) vector index, using Cohere embeddings - Langchain|`langchain`, `langchain_cohere`|[cohere_faiss_langchain_embed.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/foundation-models/cohere/cohere_faiss_langchain_embed.ipynb)
Use Cohere Command R/R+ to answer questions from data in local FAISS vector index - Langchain|`langchain`, `langchain_cohere`|[command_faiss_langchain.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/foundation-models/cohere/command_faiss_langchain.ipynb)
Use Cohere Command R/R+ to answer questions from data in AI search vector index - Langchain|`langchain`, `langchain_cohere`|[cohere-aisearch-langchain-rag.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/foundation-models/cohere/cohere-aisearch-langchain-rag.ipynb)
Use Cohere Command R/R+ to answer questions from data in AI search vector index - Cohere SDK| `cohere`, `azure_search_documents`|[cohere-aisearch-rag.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/foundation-models/cohere/cohere-aisearch-rag.ipynb)
Command R+ tool/function calling, using LangChain|`cohere`, `langchain`, `langchain_cohere`|[command_tools-langchain.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/foundation-models/cohere/command_tools-langchain.ipynb)

## Cost and quotas

### Cost and quota considerations for models deployed as a service

Cohere models deployed as a service are offered by Cohere through Azure Marketplace and integrated with Azure Machine Learning studio for use. You can find Azure Marketplace pricing when deploying the models.

Each time a workspace subscribes to a given model offering from Azure Marketplace, a new resource is created to track the costs associated with its consumption. The same resource is used to track costs associated with inference; however, multiple meters are available to track each scenario independently.

For more information on how to track costs, see [Monitor costs for models offered through the Azure Marketplace](../ai-studio/how-to/costs-plan-manage.md#monitor-costs-for-models-offered-through-the-azure-marketplace).

Quota is managed per deployment. Each deployment has a rate limit of 200,000 tokens per minute and 1,000 API requests per minute. However, we currently limit one deployment per model per workspace. Contact Microsoft Azure Support if the current rate limits aren't sufficient for your scenarios.

## Content filtering

Models deployed as a service with pay-as-you-go are protected by Azure AI content safety. With Azure AI content safety enabled, both the prompt and completion pass through an ensemble of classification models aimed at detecting and preventing the output of harmful content. The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions. Learn more about [Azure AI Content Safety](/azure/ai-services/content-safety/overview).

## Related content

- [Model Catalog and Collections](concept-model-catalog.md)
- [Deploy and score a machine learning model by using an online endpoint](how-to-deploy-online-endpoints.md)
- [Plan and manage costs for Azure AI Studio](concept-plan-manage-cost.md)
