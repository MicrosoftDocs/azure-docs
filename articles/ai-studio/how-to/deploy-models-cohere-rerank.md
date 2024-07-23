---
title: How to deploy Cohere Rerank models with Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn how to deploy Cohere Rerank models with Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: shubhiraj
ms.author: mopeakande
author: msakande
ms.custom: references_regions, build-2024
---

# How to deploy Cohere Rerank models with Azure AI Studio

[!INCLUDE [Feature preview](~/reusable-content/ce-skilling/azure/includes/ai-studio/includes/feature-preview.md)]

In this article, you learn how to use Azure AI Studio to deploy the Cohere Rerank models as serverless APIs with pay-as-you-go token-based billing.

Cohere offers two Rerank models in [Azure AI Studio](https://ai.azure.com). These models are available as serverless APIs with pay-as-you-go token-based billing. You can browse the Cohere family of models in the [Model Catalog](model-catalog.md) by filtering on the Cohere collection.

## Cohere Rerank models 

In this section, you learn about the two Cohere Rerank models that are available in the model catalog:

* Cohere Rerank 3 - English
* Cohere Rerank 3 - Multilingual

You can browse the Cohere family of models in the [Model Catalog](model-catalog-overview.md) by filtering on the Cohere collection.

### Cohere Rerank 3 - English
Cohere Rerank English is the market’s leading reranking model used for semantic search and retrieval-augmented generation (RAG). Rerank enables you to significantly improve search quality by augmenting traditional key-word based search systems with a semantic-based reranking system which can contextualize the meaning of a user's query beyond keyword relevance. Cohere's Rerank delivers much higher quality results than just embedding-based search, lexical search and even hybrid search, and it requires only adding a single line of code into your application. 
Rerank should be used as a ranker after initial retrieval (i.e. an initial search system finds the top-100 most relevant documents for a larger corpus of documents). 

Rerank supports JSON objects as documents where users can specify at query time the fields (keys) that semantic search should be applied over.

* Context window of the model is 4096 tokens
* The max query length is 2048 tokens

Rerank English has SOTA performance on benchmarks in Code Retreival, Semi-structured Data Retreival, and Long Context. Cohere evaluated Rerank English on various configurations with BM25 (lexical search) as the initial retrieval step as well as Embeddings as the initial retrieval step <a href="https://github.com/cohere-ai/notebooks/blob/main/public_rerank_benchmarks/bm25_with_rerank.md">BM25 with Rerank v3.0 General Retreival Evaluation Results</a> and <a href="https://github.com/cohere-ai/notebooks/blob/main/public_rerank_benchmarks/embed_with_rerank.md">Embeddings with Rerank v3.0 General Retreival Evaluation Results</a>

### Cohere Rerank 3 - Multilingual
Cohere Rerank Multilingual is the market’s leading reranking model used for semantic search and retrieval-augmented generation (RAG). Rerank Multilingual supports 100+ languages and can be used to search within a language (e.g., search with a French query on French documents) and across languages (e.g., search with an English query on Chinese documents). Rerank enables you to significantly improve search quality by augmenting traditional key-word based search systems with a semantic-based reranking system which can contextualize the meaning of a user's query beyond keyword relevance. Cohere's Rerank delivers much higher quality results than just embedding-based search, lexical search and even hybrid search, and it requires only adding a single line of code into your application. 
Rerank should be used as a ranker after initial retrieval (i.e. an initial search system finds the top-100 most relevant documents for a larger corpus of documents). 

Rerank supports JSON objects as documents where users can specify at query time the fields (keys) that semantic search should be applied over.

* Context window of the model is 4096 tokens
* The max query length is 2048 tokens

Rerank multilingual has SOTA performance on multilingual benchmarks such as Miracl. Cohere evaluated Rerank multilingual on various configurations with BM25 (lexical search) as the initial retrieval step as well as Embeddings as the initial retrieval step <a href="https://github.com/cohere-ai/notebooks/blob/main/public_rerank_benchmarks/miracl.md">Rerank v3.0 Miracl Evaluation Results</a>. 

## Deploy as a serverless API

Certain models in the model catalog can be deployed as a serverless API with pay-as-you-go billing. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription.

The previously mentioned Cohere models can be deployed as a service with pay-as-you-go billing and are offered by Cohere through the Microsoft Azure Marketplace. Cohere can change or update the terms of use and pricing of these models.

### Prerequisites

- An Azure subscription with a valid payment method. Free or trial Azure subscriptions won't work. If you don't have an Azure subscription, create a [paid Azure account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go) to begin.
- An [AI Studio hub](../how-to/create-azure-ai-resource.md). The serverless API model deployment offering for Cohere Embed is only available with hubs created in these regions:

     * East US
     * East US 2
     * North Central US
     * South Central US
     * West US
     * West US 3
     * Sweden Central
    
    For a list of  regions that are available for each of the models supporting serverless API endpoint deployments, see [Region availability for models in serverless API endpoints](deploy-models-serverless-availability.md).

- An [AI Studio project](../how-to/create-projects.md) in Azure AI Studio.
- Azure role-based access controls are used to grant access to operations in Azure AI Studio. To perform the steps in this article, your user account must be assigned the __Azure AI Developer role__ on the resource group. For more information on permissions, see [Role-based access control in Azure AI Studio](../concepts/rbac-ai-studio.md).


### Create a new deployment

The following steps demonstrate the deployment of Cohere Rerank 3 - English, but you can use the same steps to deploy Cohere Rerank 3 - Multilingual by replacing the model name.

To create a deployment:

1. Sign in to [Azure AI Studio](https://ai.azure.com).
1. Select **Model catalog** from the left sidebar.
1. Search for *Cohere*.
1. Select **cohere-rerank-3-english** to open the Model Details page.
1. Select **Deploy** to open a serverless API deployment window for the model.
1. Alternatively, you can initiate a deployment by starting from your project in AI Studio. 

    1. From the left sidebar of your project, select **Components** > **Deployments**.
    1. Select **+ Create deployment**.
    1. Search for and select **Cohere-embed-v3-english**. to open the Model Details page.
    1. Select **Confirm** to open a serverless API deployment window for the model.

1. Select the project in which you want to deploy your model.
1. In the deployment wizard, select the link to **Azure Marketplace Terms** to learn more about the terms of use.
1. Select the **Pricing and terms** tab to learn about pricing for the selected model.
1. Select the **Subscribe and Deploy** button. If this is your first time deploying the model in the project, you have to subscribe your project for the particular offering. This step requires that your account has the **Azure AI Developer role** permissions on the resource group, as listed in the prerequisites. Each project has its own subscription to the particular Azure Marketplace offering of the model, which allows you to control and monitor spending. Currently, you can have only one deployment for each model within a project.
1. Once you subscribe the project for the particular Azure Marketplace offering, subsequent deployments of the _same_ offering in the _same_ project don't require subscribing again. If this scenario applies to you, there's a **Continue to deploy** option to select.

1. Give the deployment a name. This name becomes part of the deployment API URL. This URL must be unique in each Azure region.

1. Select **Deploy**. Wait until the deployment is ready and you're redirected to the Deployments page.
1. Return to the Deployments page, select the deployment, and note the endpoint's **Target** URL and the Secret **Key**. For more information on using the APIs, see the [reference](#rerank-api-reference-for-cohere-embed-models-deployed-as-a-service) section.
1. You can always find the endpoint's details, URL, and access keys by navigating to your **Project overview** page. Then, from the left sidebar of your project, select **Components** > **Deployments**.

To learn about billing for the Cohere models deployed as a serverless API with pay-as-you-go token-based billing, see [Cost and quota considerations for Cohere models deployed as a service](#cost-and-quota-considerations-for-models-deployed-as-a-service).

### Consume the Cohere Rerank models as a service

These models can be consumed using the embed API.

1. From your **Project overview** page, go to the left sidebar and select **Components** > **Deployments**.

1. Find and select the deployment you created.

1. Copy the **Target** URL and the **Key** value.

1. Cohere currently exposes `v1/rerank` for inference with the Rerank 3 - English and Rerank 3 - Multilingual models. schema.

    For more information on using the APIs, see the [reference](#rerank-api-reference-for-cohere-embed-models-deployed-as-a-service) section.

## Rerank API reference for Cohere Embed models deployed as a service

### v1/rerank Request

    POST /v1/rerank HTTP/1.1
    Host: <DEPLOYMENT_URI>
    Authorization: Bearer <TOKEN>
    Content-type: application/json

### v1/rerank Request Schema

Cohere Rerank 3 - English and Rerank 3 - Multilingual accept the following parameters for a `v1/rerank` API call:

| Property | Type | Default | Description |
| --- | --- | --- | --- |
|`query` |`string` |Required |The search query |
|`documents` |`array` |None |A list of document objects or strings to rerank. |
|`top_n` |`integer` |Length of `documents` |The number of most relevant documents or indices to return. |
|`return_documents` |`boolean` |`FALSE` |If `FALSE`, returns results without the doc text - the api will return a list of {`index`, `relevance_score`} where index is inferred from the list passed into the request. </br>If `TRUE`, returns results with the doc text passed in - the api will return an ordered list of {`index`, `text`, `relevance_score`} where index + text refers to the list passed into the request. |
|`max_chunks_per_doc` |`integer` |None |The maximum number of chunks to produce internally from a document.|
|`rank_fields` |`array of strings` |None |If a JSON object is provided, you can specify which keys you would like to have considered for reranking. The model will rerank based on order of the fields passed in (i.e. `rank_fields=['title','author','text']` will rerank using the values in `title`, `author`, `text` sequentially. If the length of title, author, and text exceeds the context length of the model, the chunking will not re-consider earlier fields). If not provided, the model will use the default text field for ranking. |

### v1/rerank Response Schema

Response fields are fully documented on [Cohere's Rerank API reference](https://docs.cohere.com/reference/rerank). The response payload is a dictionary with the following fields:

| Key | Type | Description |
| --- | --- | --- |
| `id` | `string` |An identifier for the response. |
| `results` | `array of objects`|An ordered list of ranked documents, where each document is described by an object that includes `index`, and `relevance_score`, and optionally `text`. |
| `meta` | `array of objects` | An optional meta object containing a list of warning strings |

<br>

The `results` object is a dictionary with the following fields:

| Key | Type | Description |
| --- | --- | --- |
| `document` | `object` |The document objects or strings that were reranked. |
| `index` | `ingeter` |Corresponds to the `index` in the original list of documents to which the ranked document belongs. (i.e. if the first value in the results object has an index value of 3, it means in the list of documents passed in, the document at `index=3` had the highest relevance)|
| `relevance_score` | `float` |Relevance scores are normalized to be in the range `[0, 1]`. Scores close to 1 indicate a high relevance to the query, and scores closer to 0 indicate low relevance. It is _not accurate_ to assume a score of `0.9` means the document is 2x more relevant than a document with a score of `0.45` |


## Examples

**Request**

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

**Response**

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

#### More inference examples

| Package | Sample Notebook |
|---|---|
|CLI using CURL and Python web requests| [cohere-rerank.ipynb](https://aka.ms/samples/cohere-rerank/webrequests)|
|LangChain|[langchain.ipynb](https://aka.ms/samples/cohere-rerank/langchain)|
|Cohere SDK|[cohere-sdk.ipynb](https://aka.ms/samples/cohere-rerank/cohere-python-sdk)|

## Cost and quotas

### Cost and quota considerations for models deployed as a service

Cohere models deployed as a serverless API with pay-as-you-go billing are offered by Cohere through the Azure Marketplace and integrated with Azure AI Studio for use. You can find the Azure Marketplace pricing when deploying the model.

Each time a project subscribes to a given offer from the Azure Marketplace, a new resource is created to track the costs associated with its consumption. The same resource is used to track costs associated with inference; however, multiple meters are available to track each scenario independently.

For more information on how to track costs, see [monitor costs for models offered throughout the Azure Marketplace](./costs-plan-manage.md#monitor-costs-for-models-offered-through-the-azure-marketplace).

Quota is managed per deployment. Each deployment has a rate limit of 200,000 tokens per minute and 1,000 API requests per minute. However, we currently limit one deployment per model per project. Contact Microsoft Azure Support if the current rate limits aren't sufficient for your scenarios. 

## Related content

- [What is Azure AI Studio?](../what-is-ai-studio.md)
- [Azure AI FAQ article](../faq.yml)
- [Region availability for models in serverless API endpoints](deploy-models-serverless-availability.md)
