---
title: What's new in Azure AI Search
description: Announcements of new and enhanced features, including a service rename of Azure Cognitive Search to Azure AI Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: overview
ms.date: 05/13/2024
ms.custom:
  - references_regions
---

# What's new in Azure AI Search

**Azure Cognitive Search is now Azure AI Search**. Learn about the latest updates to Azure AI Search functionality, docs, and samples.

> [!NOTE]
> Preview features are announced here, but we also maintain a [preview features list](search-api-preview.md) so you can find them in one place.

## May 2024

| Item&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Type |  Description |
|-----------------------------|------|--------------|
| [OneLake files indexer (preview)](search-how-to-index-onelake-files.md) | Feature | New indexer for OneLake files and OneLake shortcuts. If you use Microsoft Fabric and OneLake for cloud data access to Amazon Web Services (AWS) and Google data sources, use this indexer to import external data into a search index. This vectorizer is available through the Azure portal, the [2024-05-01-preview REST API](/rest/api/searchservice/data-sources/create-or-update?view=rest-searchservice-2024-05-01-preview&preserve-view=true), and Azure SDK beta packages. |
| [Azure AI Vision multimodal embeddings skill (preview)](cognitive-search-skill-vision-vectorize.md) | Skill | New skill that's bound to the [multimodal embeddings API of Azure AI Vision](../ai-services/computer-vision/concept-image-retrieval.md). You can generate embeddings for text or images during indexing. This skill is available through the Azure portal and the [2024-05-01-preview REST API](/rest/api/searchservice/operation-groups?view=rest-searchservice-2024-05-01-preview&preserve-view=true).|
| [Azure AI Vision vectorizer (preview)](vector-search-vectorizer-ai-services-vision.md) | Vectorizer | New vectorizer connects to an Azure AI Vision resource using the [multimodal embeddings API](../ai-services/computer-vision/concept-image-retrieval.md) to generate embeddings at query time. This vectorizer is available through the Azure portal and the [2024-05-01-preview REST API](/rest/api/searchservice/operation-groups?view=rest-searchservice-2024-05-01-preview&preserve-view=true). |
| [Azure AI Studio model catalog vectorizer (preview)](vector-search-vectorizer-azure-machine-learning-ai-studio-catalog.md) | Vectorizer | New vectorizer connects to an embedding model deployed from the [Azure AI Studio model catalog](../ai-studio/how-to/model-catalog.md). This vectorizer is available through the Azure portal and the [2024-05-01-preview REST API](/rest/api/searchservice/operation-groups?view=rest-searchservice-2024-05-01-preview&preserve-view=true). <br><br>[**How to implement integrated vectorization using models from Azure AI Studio**](vector-search-integrated-vectorization-ai-studio.md).|
| [AzureOpenAIEmbedding skill (preview) supports more models on Azure OpenAI](cognitive-search-skill-azure-openai-embedding.md) | Skill | Updates to this skill add support for more embedding models on Azure OpenAI. New `dimensions` and `modelName` properties are used for specifying models. Previously, the dimensions limits were fixed at 1,536 dimensions. It's now configurable. This update is available through the Azure portal and the [2024-05-01-preview REST API](/rest/api/searchservice/operation-groups?view=rest-searchservice-2024-05-01-preview&preserve-view=true).|
| Network security perimeter support (preview) | Feature | A network security perimeter is a new service that provides a secure perimeter for communication, and controlled access to resources outside of the perimeter. Azure AI Search is one of the eight Azure services that can run within a network security perimeter. This feature is provided by the [2024-03-01-preview Management REST API](/rest/api/searchmanagement/operation-groups?view=rest-searchmanagement-2024-03-01-preview&preserve-view=true) and the Azure portal. |
| [More regions for higher capacity tiers](search-limits-quotas-capacity.md#service-limits) | Infrastructure | Higher capacity tiers were announced in April 2024 for selected regions. Starting on May 17, 2024, the list of regions now includes South Africa North​, Germany North​, Germany West Central​, Switzerland West​, East US 2 EUAP/PPE​, and Azure Government (Texas, Arizona, and Virginia).|
| [Larger partitions on L1 and L2 tiers](search-limits-quotas-capacity.md#service-limits) | Infrastructure | Also starting on May 17, 2024: higher capacity partitions are available for Storage Optimized tiers (L1 and L2). L1 and L2 customers must create a new service to benefit from the higher capacity. There's no in-place upgrade at this time. |
| [Larger partitions on S2, S3, and S3 HD tiers](search-limits-quotas-capacity.md#service-limits) | Infrastructure | Partition sizes have increased for Standard 2 (S2), Standard 3 (S3), and Standard 3 High Density (S3 HD) for all services created after April 3, 2024. If you create a new service now, you get the larger partitions. If you created a new service between April 3 and May 17, you get the larger partitions automatically. In short, you don't need to create a new S2 or S3 search service if you're already running on post-April 3 infrastructure. |
| [2024-05-01-preview Search REST API](/rest/api/searchservice/search-service-api-versions#2024-05-01-preview) | API | New preview version of the Search REST APIs provides new skills and vectorizers, new binary data type, OneLake files indexer, new query parameters for vector weights, and recall. See [Upgrade REST APIs](search-api-migration.md) if you have existing code written against the 2023-07-01-preview and need to migrate to this version.|
| Azure SDK beta packages for new features | API | Review the changelogs of the following Azure SDK beta packages for new feature support: [Azure SDK for Python](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/search/azure-search-documents/CHANGELOG.md), [Azure SDK for .NET](https://github.com/Azure/azure-sdk-for-net/blob/Azure.Search.Documents_11.6.0-beta.4/sdk/search/Azure.Search.Documents/CHANGELOG.md), [Azure SDK for Java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/search/azure-search-documents/CHANGELOG.md) |
<!-- | [Custom Web API vectorizer (preview)](vector-search-vectorizer-custom-web-api.md) | Vectorizer | Configure your search queries to call out to a Web API endpoint to generate embeddings at query time.  This vectorizer is available through the [2024-05-01-preview REST API](/rest/api/searchservice/operation-groups?view=rest-searchservice-2024-05-01-preview&preserve-view=true).|-->

## April 2024

| Item&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Type |  Description |
|-----------------------------|------|--------------|
| [Security update addressing information disclosure](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-29063) | API | GET responses [no longer return connection strings or keys](search-api-migration.md#breaking-change-for-client-code-that-reads-connection-information). Applies to GET Skillset, GET Index, and GET Indexer. This change helps protect your Azure assets integrated with AI Search from unauthorized access. |
| [**More storage on Basic and Standard tiers**](search-limits-quotas-capacity.md#service-limits) | Infrastructure |  Basic now supports up to three partitions and three replicas. Basic and Standard (S1, S2, S3) tiers have significantly more storage per partition, at the same per-partition billing rate. Extra capacity is subject to [regional availability](search-limits-quotas-capacity.md#supported-regions-with-higher-storage-limits) and applies to new search services created after April 3, 2024. Currently, there's no in-place upgrade, so please create a new search service to get the extra storage. |
| [**More quota for vectors**](search-limits-quotas-capacity.md#vector-limits-on-services-created-between-april-3-2024-and-may-17-2024) | Infrastructure | Vector quotas are also higher on new services created after April 3, 2024 in selected regions. |
| [**Vector quantization, narrow vector data types, and a new `stored` property (preview)**](vector-search-how-to-configure-compression-storage.md) | Feature | Collectively, these three features add vector compression and smarter storage options. First, *scalar quantization* reduces vector index size in memory and on disk. Second, [narrow data types](/rest/api/searchservice/supported-data-types) reduce per-field storage by storing smaller values. Third, you can use `stored` to opt-out of storing the extra copy of a vector that's used only for search results. If you don't need vectors in a query response, you can set `stored` to false to save on space. |
| [**2024-03-01-preview Search REST API**](/rest/api/searchservice/search-service-api-versions#2024-03-01-preview) | API | New preview version of the Search REST APIs for the new data types, vector compression properties, and vector storage options. |
| [**2024-03-01-preview Management REST API**](/rest/api/searchmanagement/operation-groups?view=rest-searchmanagement-2024-03-01-preview&preserve-view=true) | API | New preview version of the Management REST APIs for control plane operations.  |
| [**2023-07-01-preview deprecation announcement**](/rest/api/searchservice/search-service-api-versions#2023-07-01-preview) | API | Deprecation announced on April 8, 2024. Retirement on July 8, 2024. This was the first REST API that offered vector search support. Newer API versions have a different vector configuration. We recommend [migrating to a newer version](search-api-migration.md) as soon as possible. |

## February 2024

| Item&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Type |  Description |
|-----------------------------|------|--------------|
| New dimension limits | Feature | For vector fields, maximum dimension limits are now `3072`, up from `2048`. |

## 2023 announcements

| Month | Type | Announcement |
|-------|------|-------------|
| November | Feature | [**Vector search, generally available**](vector-search-overview.md). The previous restriction on customer-managed keys (CMK) is now lifted. [Prefiltering](vector-search-how-to-query.md) and [exhaustive K-nearest neighbor algorithm](vector-search-ranking.md) are also now generally available. |
| November | Feature | [**Semantic ranking, generally available**](semantic-search-overview.md)|
| November | Feature | [**Integrated vectorization (preview)**](vector-search-integrated-vectorization.md) adds data chunking and text-to-vector conversions during indexing, and also adds text-to-vector conversions at query time. |
| November | Feature | [**Import and vectorize data wizard (preview)**](search-get-started-portal-import-vectors.md) automates data chunking and vectorization. It targets the [2023-10-01-Preview](/rest/api/searchservice/skillsets/create-or-update?view=rest-searchservice-2023-10-01-preview&preserve-view=true) REST API. | 
| November | Feature | [**Index projections (preview)**](index-projections-concept-intro.md) defines the shape of a secondary index, used for a one-to-many index pattern, where content from an enrichment pipeline can target multiple indexes. | 
| November | API | [**2023-11-01 Search REST API**](/rest/api/searchservice/search-service-api-versions#2023-11-01) is stable version of the Search REST APIs for [vector search](vector-search-overview.md) and [semantic ranking](semantic-how-to-query-request.md). See [Upgrade REST APIs](search-api-migration.md) for migration steps to generally available features.|
| November | API | [**2023-11-01 Management REST API**](/rest/api/searchmanagement/operation-groups?view=rest-searchmanagement-2023-11-01&preserve-view=true) adds APIs that [enable or disable semantic ranking](/rest/api/searchmanagement/services/create-or-update#searchsemanticsearch). |
| November | Skill | [**Azure OpenAI Embedding skill (preview)**](cognitive-search-skill-azure-openai-embedding.md) connects to a deployed embedding model on your Azure OpenAI resource to generate embeddings during skillset execution.|
| November | Skill | [**Text Split skill (preview)**](cognitive-search-skill-textsplit.md) updated in [2023-10-01-Preview](/rest/api/searchservice/skillsets/create-or-update?view=rest-searchservice-2023-10-01-preview&preserve-view=true) to support native data chunking. |
| November | Video | [**How vector search and semantic ranking improve your GPT prompts**](https://www.youtube.com/watch?v=Xwx1DJ0OqCk) explains how hybrid retrieval gives you optimal grounding data for generating useful AI responses and enables search over both concepts and keywords. |
| November | Sample | [**Role-based access control in Generative AI applications**](https://techcommunity.microsoft.com/t5/azure-ai-services-blog/access-control-in-generative-ai-applications-with-azure/ba-p/3956408) explains how to use Microsoft Entra ID and Microsoft Graph API to roll out granular user permissions on chunked content in your index. |
| October | Sample  | [**"Chat with your data" solution accelerator**](https://github.com/Azure-Samples/chat-with-your-data-solution-accelerator). End-to-end RAG pattern that uses Azure AI Search as a retriever. It provides indexing, data chunking, and orchestration. |
| October | Feature | [**Exhaustive  K-Nearest Neighbors (KNN)**](vector-search-overview.md#eknn) scoring algorithm for similarity search in vector space. Available in the 2023-10-01-Preview REST API only. |
| October | Feature | [**Prefilters in vector search**](vector-search-how-to-query.md) evaluate filter criteria before query execution, reducing the amount of content that needs to be searched. Available in the 2023-10-01-Preview REST API only, through a new `vectorFilterMode` property on the query that can be set to `preFilter` (default) or `postFilter`, depending on your requirements. |
| October | API | [**2023-10-01-Preview Search REST API**](/rest/api/searchservice/search-service-api-versions#2023-10-01-Preview), breaking changes the definition for [vector fields](vector-search-how-to-create-index.md) and [vector queries](vector-search-how-to-query.md).|
| August | Feature | [**Enhanced semantic ranking**](semantic-search-overview.md).  Upgraded models are rolling out for semantic reranking, and availability is extended to more regions. Maximum unique token counts doubled from 128 to 256.|
| July | Sample | [**Vector demo (Azure SDK for JavaScript)**](https://github.com/Azure/azure-search-vector-samples/blob/main/demo-javascript/readme.md). Uses Node.js and the **@azure/search-documents 12.0.0-beta.2** library to generate embeddings, create and load an index, and run several vector queries. |
| July | Sample | [**Vector demo (Azure SDK for .NET)**](https://github.com/Azure/azure-search-vector-samples/blob/main/demo-dotnet/DotNetVectorDemo/readme.md).  Uses the **Azure.Search.Documents 11.5.0-beta.3** library to generate embeddings, create and load an index, and run several vector queries. You can also try [this sample](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/search/Azure.Search.Documents/samples/Sample07_VectorSearch.md) from the Azure SDK team.|
| July | Sample | [**Vector demo (Azure SDK for Python)**](https://github.com/Azure/azure-search-vector-samples/tree/main/demo-python.) Uses the latest beta release of the **azure.search.documents** to generate embeddings, create and load an index, and run several vector queries. Visit the [azure-search-vector-samples/demo-python](https://github.com/Azure/azure-search-vector-samples/blob/main/demo-python) repo for more vector search demos. |
| June | Feature | [**Vector search public preview**](vector-search-overview.md). |
| June | Feature | [**Semantic search availability**](semantic-search-overview.md), available on the Basic tier.|
| June | API | [**2023-07-01-Preview Search REST API**](/rest/api/searchservice/index-preview). Support for vector search. |
| May | Feature | [**Azure RBAC (role-based access control, generally available)**](search-security-rbac.md). |
| May | API | [**2022-09-01 Management REST API**](/rest/api/searchmanagement), with support for configuring search to use Azure roles. The **Az.Search** module of Azure PowerShell and **Az search** module of the Azure CLI are updated to support search service authentication options. You can also use the [**Terraform provider**](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/search_service) to configure authentication options (see this [Terraform quickstart](search-get-started-terraform.md) for details). | 
| April | Sample |  [**Multi-region deployment of Azure AI Search for business continuity and disaster recovery**](https://github.com/Azure-Samples/azure-search-multiple-regions). Deployment scripts that fully configure a multi-regional solution for Azure AI Search, with options for synchronizing content and request redirection if an endpoint fails. |
| March |  Sample | [**ChatGPT + Enterprise data with Azure OpenAI and Azure AI Search (GitHub)**](https://github.com/Azure-Samples/azure-search-openai-demo/blob/main/README.md). Python code and a template for combining Azure AI Search with the large language models in OpenAI. For background, see this Tech Community blog post: [Revolutionize your Enterprise Data with ChatGPT](https://techcommunity.microsoft.com/t5/ai-applied-ai-blog/revolutionize-your-enterprise-data-with-chatgpt-next-gen-apps-w/ba-p/3762087). <br><br>Key points: <br><br>Use Azure AI Search to consolidate and index searchable content.</br> <br>Query the index for initial search results.</br> <br>Assemble prompts from those results and send to the gpt-35-turbo (preview) model in Azure OpenAI.</br> <br>Return a cross-document answer and provide citations and transparency in your customer-facing app so that users can assess the response.</br> |

## Previous year's announcements

+ [2022 announcements](/previous-versions/azure/search/search-whats-new-2022)
+ [2021 announcements](/previous-versions/azure/search/search-whats-new-2021)
+ [2020 announcements](/previous-versions/azure/search/search-whats-new-2020)
+ [2019 announcements](/previous-versions/azure/search/search-whats-new-2019)

<a name="new-service-name"></a>

## Service rebrand

This service has had multiple names over the years. Here they are in reverse chronological order:

+ **Azure AI Search** (November 2023) Renamed to align with Azure AI services and customer expectations.
+ **Azure Cognitive Search** (October 2019) Renamed to reflect the expanded (yet optional) use of cognitive skills and AI processing in service operations.
+ **Azure Search** (March 2015) The original name.

## Service updates

[Service update announcements](https://azure.microsoft.com/updates/?product=search&status=all) for Azure AI Search can be found on the Azure web site.

## Feature rename

Semantic search was renamed to [semantic ranking](semantic-search-overview.md) in November 2023 to better describe the feature, which provides L2 ranking of an existing result set.
