---
title: How to deploy Cohere Rerank models as serverless APIs
titleSuffix: Azure Machine Learning
description: Learn to deploy and use Cohere Rerank models with Azure Machine Learning studio.
manager: scottpolly
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: how-to
ms.date: 07/24/2024
ms.reviewer: shubhiraj
ms.author: mopeakande
author: msakande
ms.custom: references_regions, build-2024

#This functionality is also available in Azure AI Studio: /azure/ai-studio/how-to/deploy-models-cohere.md
---

# How to deploy Cohere Rerank models with Azure Machine Learning studio

In this article, you learn about the Cohere Rerank models, how to use Azure Machine Learning studio to deploy them as serverless APIs with pay-as-you-go token-based billing, and how to work with the deployed models.

## Cohere Rerank models

Cohere offers two Rerank models in Azure Machine Learning studio. These models are available in the model catalog for deployment as serverless APIs:

* Cohere Rerank 3 - English
* Cohere Rerank 3 - Multilingual

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

You can browse the Cohere family of models in the [Model Catalog](concept-model-catalog.md) by filtering on the Cohere collection.

### Cohere Rerank 3 - English

Cohere Rerank English is a reranking model used for semantic search and retrieval-augmented generation (RAG). Rerank enables you to significantly improve search quality by augmenting traditional keyword-based search systems with a semantic-based reranking system that can contextualize the meaning of a user's query beyond keyword relevance. Cohere's Rerank delivers higher quality results than embedding-based search, lexical search, and even hybrid search, and it requires only adding a single line of code into your application.

Use Rerank as a ranker after initial retrieval. In other words, after an initial search system finds the top 100 most relevant documents for a larger corpus of documents.

Rerank supports JSON objects as documents where users can specify, at query time, the fields (keys) to use for semantic search. Some other attributes of Rerank include:

* Context window of the model is 4,096 tokens
* The max query length is 2,048 tokens

Rerank English works well for code retrieval, semi-structured data retrieval, and long context.

### Cohere Rerank 3 - Multilingual

Cohere Rerank Multilingual is a reranking model used for semantic search and retrieval-augmented generation (RAG). Rerank Multilingual supports more than 100 languages and can be used to search within a language (for example, to search with a French query on French documents) and across languages (for example, to search with an English query on Chinese documents). Rerank enables you to significantly improve search quality by augmenting traditional keyword-based search systems with a semantic-based reranking system that can contextualize the meaning of a user's query beyond keyword relevance. Cohere's Rerank delivers higher quality results than embedding-based search, lexical search, and even hybrid search, and it requires only adding a single line of code into your application.

Use Rerank as a ranker after initial retrieval. In other words, after an initial search system finds the top 100 most relevant documents for a larger corpus of documents.

Rerank supports JSON objects as documents where users can specify, at query time, the fields (keys) to use for semantic search. Some other attributes of Rerank Multilingual include:

* Context window of the model is 4,096 tokens
* The max query length is 2,048 tokens

Rerank multilingual performs well on multilingual benchmarks such as Miracl.


## Deploy Cohere Rerank models as serverless APIs

Certain models in the model catalog can be deployed as a serverless API with pay-as-you-go billing. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription.

You can deploy the previously mentioned Cohere models as a service with pay-as-you-go billing. Cohere offers these models through the Microsoft Azure Marketplace and can change or update the terms of use and pricing of these models.

### Prerequisites

- An Azure subscription with a valid payment method. Free or trial Azure subscriptions won't work. If you don't have an Azure subscription, create a [paid Azure account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go) to begin.
- An Azure Machine Learning workspace. If you don't have these, use the steps in the [Quickstart: Create workspace resources](quickstart-create-resources.md) article to create them. The serverless API model deployment offering for Cohere Rerank is only available with workspaces created in these regions:

     * East US
     * East US 2
     * North Central US
     * South Central US
     * West US
     * West US 3
     * Sweden Central

    For a list of  regions that are available for each of the models supporting serverless API endpoint deployments, see [Region availability for models in serverless API endpoints](concept-endpoint-serverless-availability.md).

-  Azure role-based access controls (Azure RBAC) are used to grant access to operations. To perform the steps in this article, your user account must be assigned the __Azure AI Developer role__ on the Resource Group.

    For more information on permissions, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

### Create a new deployment

The following steps demonstrate the deployment of Cohere Rerank 3 - English, but you can use the same steps to deploy Cohere Rerank 3 - Multilingual by replacing the model name.

To create a deployment:

1. Go to [Azure Machine Learning studio](https://ml.azure.com/home).
1. Select the workspace in which you want to deploy your models. 
1. Choose the model you want to deploy from the [model catalog](https://ml.azure.com/model/catalog).

   Alternatively, you can initiate deployment by going to your workspace and selecting **Endpoints** > **Serverless endpoints** > **Create**.

1. On the model's overview page in the model catalog, select **Deploy**.

1. In the deployment wizard, select the link to **Azure Marketplace Terms** to learn more about the terms of use. 
1. You can also select the **Marketplace offer details** tab to learn about pricing for the selected model.
1. If this is your first time deploying the model in the workspace, you have to subscribe your workspace for the particular offering of the model. This step requires that your account has the **Azure AI Developer role** permissions on the Resource Group, as listed in the prerequisites. Each workspace has its own subscription to the particular Azure Marketplace offering, which allows you to control and monitor spending. Select **Subscribe and Deploy**. Currently you can have only one deployment for each model within a workspace.

1. Once you subscribe the workspace for the particular Azure Marketplace offering, subsequent deployments of the _same_ offering in the _same_ workspace don't require subscribing again. If this scenario applies to you, there's a **Continue to deploy** option to select.

1. Give the deployment a name. This name becomes part of the deployment API URL. This URL must be unique in each Azure region.

1. Select **Deploy**. Wait until the deployment is finished and you're redirected to the serverless endpoints page.
1. Select the endpoint to open its Details page.
1. You can always find the endpoint's details, URL, and access keys by navigating to **Workspace** > **Endpoints** > **Serverless endpoints**.
1. Take note of the **Target** URL and the **Secret Key**. For more information on using the APIs, see the [reference] (#rerank-api-reference-for-cohere-rerank-models-deployed-as-a-serverless-api) section.

To learn about billing for models deployed with pay-as-you-go, see [Cost and quota considerations for Cohere models deployed as a service](#cost-and-quota-considerations-for-models-deployed-as-a-service).

### Consume the Cohere Rerank models as a service

Cohere Rerank models deployed as serverless APIs can be consumed using the Rerank API.

1. In the **workspace**, select **Endpoints** > **Serverless endpoints**.
1. Find and select the deployment you created.
1. Copy the **Target** URL and the **Key** token values.
1. Cohere currently exposes `v1/rerank` for inference with the Rerank 3 - English and Rerank 3 - Multilingual models schema. For more information on using the APIs, see the [reference](#rerank-api-reference-for-cohere-rerank-models-deployed-as-a-serverless-api) section.

## Rerank API reference for Cohere Rerank models deployed as a serverless API

Cohere Rerank 3 - English and Rerank 3 - Multilingual accept the native Cohere Rerank API on `v1/rerank`. This section contains details about the Cohere Rerank API.

#### v1/rerank request

```json
    POST /v1/rerank HTTP/1.1
    Host: <DEPLOYMENT_URI>
    Authorization: Bearer <TOKEN>
    Content-type: application/json
```

#### v1/rerank request schema

Cohere Rerank 3 - English and Rerank 3 - Multilingual accept the following parameters for a `v1/rerank` API call:

| Property | Type | Default | Description |
| --- | --- | --- | --- |
|`query` |`string` |Required |The search query |
|`documents` |`array` |None |A list of document objects or strings to rerank. |
|`top_n` |`integer` |Length of `documents` |The number of most relevant documents or indices to return. |
|`return_documents` |`boolean` |`FALSE` |If `FALSE`, returns results without the doc text - the API returns a list of {`index`, `relevance_score`} where index is inferred from the list passed into the request. </br>If `TRUE`, returns results with the doc text passed in - the API returns an ordered list of {`index`, `text`, `relevance_score`} where index + text refers to the list passed into the request. |
|`max_chunks_per_doc` |`integer` |None |The maximum number of chunks to produce internally from a document.|
|`rank_fields` |`array of strings` |None |If a JSON object is provided, you can specify which keys you would like to consider for reranking. The model reranks based on the order of the fields passed in (for example, `rank_fields=['title','author','text']` reranks, using the values in `title`, `author`, and `text` in that sequence. If the length of title, author, and text exceeds the context length of the model, the chunking won't reconsider earlier fields).<br> If not provided, the model uses the default text field for ranking. |

#### v1/rerank response schema

Response fields are fully documented on [Cohere's Rerank API reference](https://docs.cohere.com/reference/rerank). The response payload is a dictionary with the following fields:

| Key | Type | Description |
| --- | --- | --- |
| `id` | `string` |An identifier for the response. |
| `results` | `array of objects`|An ordered list of ranked documents, where each document is described by an object that includes `index` and `relevance_score` and, optionally, `text`. |
| `meta` | `array of objects` | An optional meta object containing a list of warning strings. |

<br>

The `results` object is a dictionary with the following fields:

| Key | Type | Description |
| --- | --- | --- |
| `document` | `object` |The document objects or strings that were reranked. |
| `index` | `integer` |The `index` in the original list of documents to which the ranked document belongs. For example, if the first value in the `results` object has an index value of 3, it means in the list of documents passed in, the document at `index=3` had the highest relevance.|
| `relevance_score` | `float` |Relevance scores are normalized to be in the range `[0, 1]`. Scores close to one indicate a high relevance to the query, and scores close to zero indicate low relevance. A score of `0.9` _doesn't_ necessarily mean that a document is twice as relevant as another with a score of `0.45`. |


## Examples

#### Request example

```json
    {
        "query": "What is the capital of the United States?",
        "rank_fields": ["Title", "Content"],
        "documents": [
            {"Title": "Facts about Carson City", "Content": "Carson City is the capital city of the American state of Nevada. "}, 
            {"Title": "North Dakota", "Content" : "North Dakota is a state in the United States. 672,591 people lived in North Dakota in the year 2010. The capital and seat of government is Bismarck."}, 
            {"Title": "Micronesia", "Content" : "Micronesia, officially the Federated States of Micronesia, is an island nation in the Pacific Ocean, northeast of Papua New Guinea. The country is a sovereign state in free association with the United States. The capital city of Federated States of Micronesia is Palikir."}
        ],
        "top_n": 3
    }
```

#### Response example

```json
    {
        "id": "571e6744-3074-457f-8935-08646a3352fb",
        "results": [
            {
                "document": {
                    "Content": "Washington, D.C. (also known as simply Washington or D.C., and officially as the District of Columbia) is the capital of the United States. It is a federal district. The President of the USA and many major national government offices are in the territory. This makes it the political center of the United States of America.",
                    "Title": "Details about Washington D.C"
                },
                "index": 0,
                "relevance_score": 0.98347044
            },
            {
                "document": {
                    "Content": "Carson City is the capital city of the American state of Nevada. ",
                    "Title": "Facts about Carson City"
                },
                "index": 1,
                "relevance_score": 0.07172112
            },
            {
                "document": {
                    "Content": "Micronesia, officially the Federated States of Micronesia, is an island nation in the Pacific Ocean, northeast of Papua New Guinea. The country is a sovereign state in free association with the United States. The capital city of Federated States of Micronesia is Palikir.",
                    "Title": "Micronesia"
                },
                "index": 3,
                "relevance_score": 0.05281402
            },
            {
                "document": {
                    "Content": "North Dakota is a state in the United States. 672,591 people lived in North Dakota in the year 2010. The capital and seat of government is Bismarck.",
                    "Title": "North Dakota"
                },
                "index": 2,
                "relevance_score": 0.03138043
            }
        ]
    }
```

#### More inference examples

| Package | Sample Notebook |
|---|---|
|CLI using CURL and Python web requests| [cohere-rerank.ipynb](https://aka.ms/samples/cohere-rerank/webrequests)|
|LangChain|[langchain.ipynb](https://aka.ms/samples/cohere-rerank/langchain)|
|Cohere SDK|[cohere-sdk.ipynb](https://aka.ms/samples/cohere-rerank/cohere-python-sdk)|

## Cost and quota considerations for models deployed as a service

Quota is managed per deployment. Each deployment has a rate limit of 200,000 tokens per minute and 1,000 API requests per minute. However, we currently limit one deployment per model per project. Contact Microsoft Azure Support if the current rate limits aren't sufficient for your scenarios.

Cohere models deployed as serverless APIs with pay-as-you-go billing are offered by Cohere through the Azure Marketplace and integrated with Azure Machine Learning studio for use. You can find the Azure Marketplace pricing when deploying the model.

Each time a workspace subscribes to a given model offering from Azure Marketplace, a new resource is created to track the costs associated with its consumption. The same resource is used to track costs associated with inference; however, multiple meters are available to track each scenario independently.

For more information on how to track costs, see [Monitor costs for models offered through the Azure Marketplace](../ai-studio/how-to/costs-plan-manage.md#monitor-costs-for-models-offered-through-the-azure-marketplace).


## Related content

- [Model Catalog and Collections](concept-model-catalog.md)
- [Deploy and score a machine learning model by using an online endpoint](how-to-deploy-online-endpoints.md)
- [Plan and manage costs for Azure AI Studio](concept-plan-manage-cost.md)
- [Region availability for models in serverless API endpoints](concept-endpoint-serverless-availability.md)
