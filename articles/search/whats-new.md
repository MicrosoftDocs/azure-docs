---
title: What's new in Azure Cognitive Search
description: Announcements of new and enhanced features, including a service rename of Azure Search to Azure Cognitive Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: overview
ms.date: 10/13/2023
ms.custom: references_regions
---

# What's new in Azure Cognitive Search

Learn about the latest updates to Azure Cognitive Search functionality, docs, and samples.

> [!NOTE]
> Looking for preview features? Previews are announced here, but we also maintain a [preview features list](search-api-preview.md) so you can find them in one place.

## October 2023

| Item&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Type |  Description |
|-----------------------------|------|--------------|
| [**Exhaustive  K-Nearest Neighbors (KNN)**](vector-search-ranking.md#eknn) | Feature | Exhaustive K-Nearest Neighbors (KNN) is a new scoring algorithm for similarity search in vector space. It performs an exhaustive search for the nearest neighbors, useful for situations where high recall is more important than query performance. Available in the 2023-10-01-Preview REST API only. |
| [**Prefilters in vector search**](vector-search-how-to-query.md) | Feature | Evaluates filter criteria before query execution, reducing the amount of content that needs to be searched. Available in the 2023-10-01-Preview REST API only, through a new `vectorFilterMode` property on the query that can be set to `preFilter` (default) or `postFilter`, depending on your requirements. |
| [**2023-10-01-Preview Search REST API**](/rest/api/searchservice/search-service-api-versions#2023-10-01-Preview) | API | New preview version of the Search REST APIs that changes the definition for [vector fields](vector-search-how-to-create-index.md) and [vector queries](vector-search-how-to-query.md). This API version introduces breaking changes from **2023-07-01-Preview**, otherwise it's inclusive of all previous preview features. If you're using earlier previews, switch to **2023-10-01-Preview** with no loss of functionality, assuming you make updates to vector code. |

## August 2023

| Item&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Type |  Description |
|-----------------------------|------|--------------|
| [**Enhanced semantic ranking**](semantic-search-overview.md) | Feature | Upgraded models are rolling out for semantic reranking, and availability is extended to more regions. Maximum unique token counts doubled from 128 to 256. |

## July 2023

| Item&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Type |  Description |
|-----------------------------|------|--------------|
| [**Vector demo (Azure SDK for JavaScript)**](https://github.com/Azure/cognitive-search-vector-pr/blob/main/demo-javascript/code/azure-search-vector-sample.js) | Sample | Uses Node.js and the **@azure/search-documents 12.0.0-beta.2** library to generate embeddings, create and load an index, and run several vector queries. |
| [**Vector demo (Azure SDK for .NET)**](https://github.com/Azure/cognitive-search-vector-pr/blob/main/demo-dotnet/readme.md) | Sample | Uses the **Azure.Search.Documents 11.5.0-beta.3** library to generate embeddings, create and load an index, and run several vector queries. You can also try [this sample](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/samples/Sample07_VectorSearch.md) from the Azure SDK team.|
| [**Vector demo (Azure SDK for Python)**](https://github.com/Azure/cognitive-search-vector-pr/blob/main/demo-python/code/azure-search-vector-image-python-sample.ipynb) | Sample | Uses the latest beta release of the **azure.search.documents** to generate embeddings, create and load an index, and run several vector queries. Visit the [cognitive-search-vector-pr/demo-python](https://github.com/Azure/cognitive-search-vector-pr/blob/main/demo-python) repo for more vector search demos. |

## June 2023

| Item&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Type |  Description |
|-----------------------------|------|--------------|
| [**Vector search public preview**](vector-search-overview.md) | Feature | Adds vector fields to a search index for similarity search over vector representations of data. |
| [**2023-07-01-Preview Search REST API**](/rest/api/searchservice/index-preview) | API | New preview version of the Search REST APIs that adds support for vector search. This API version is inclusive of all preview features. If you're using earlier previews, switch to **2023-07-01-preview** with no loss of functionality.  |
| [**Semantic search availability**](semantic-search-overview.md) | Feature | Semantic search is now available on the Basic tier. |

## May 2023

| Item&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Type |  Description |
|-----------------------------|------|--------------|
| [**Azure RBAC (role-based access control)**](search-security-rbac.md) | Feature | Announcing general availability. |
| [**2022-09-01 Management REST API**](/rest/api/searchmanagement) | API | New stable version of the Management REST APIs, with support for configuring search to use Azure RBAC. The **Az.Search** module of Azure PowerShell and **Az search** module of the Azure CLI are updated to support search service authentication options. You can also use the [**Terraform provider**](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/search_service) to configure authentication options (see this [Terraform quickstart](search-get-started-terraform.md) for details). |

## April 2023

| Item&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Type |  Description |
|-----------------------------|------|--------------|
| [**Multi-region deployment of Azure Cognitive Search for business continuity and disaster recovery**](https://github.com/Azure-Samples/azure-search-multiple-regions) | Sample | Deployment scripts that fully configure a multi-regional solution for Azure Cognitive Search, with options for synchronizing content and request redirection if an endpoint fails.|

## March 2023

| Item&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Type |  Description |
|-----------------------------|------|--------------|
| [**ChatGPT + Enterprise data with Azure OpenAI and Cognitive Search (GitHub)**](https://github.com/Azure-Samples/azure-search-openai-demo/blob/main/README.md) | Sample | Python code and a template for combining Cognitive Search with the large language models in OpenAI. For background, see this Tech Community blog post: [Revolutionize your Enterprise Data with ChatGPT](https://techcommunity.microsoft.com/t5/ai-applied-ai-blog/revolutionize-your-enterprise-data-with-chatgpt-next-gen-apps-w/ba-p/3762087). <br><br>Key points: <br><br>Use Cognitive Search to consolidate and index searchable content.</br> <br>Query the index for initial search results.</br> <br>Assemble prompts from those results and send to the gpt-35-turbo (preview) model in Azure OpenAI.</br> <br>Return a cross-document answer and provide citations and transparency in your customer-facing app so that users can assess the response.</br>|

## 2022 announcements

| Month | Item |
|-------|---------|
| November | **Add search to websites** series, updated versions of React and Azure SDK client libraries: <ul><li>[C#](tutorial-csharp-overview.md)</li><li>[Python](tutorial-python-overview.md)</li><li>[JavaScript](tutorial-javascript-overview.md) </li></ul> "Add search to websites" is a tutorial series with sample code available in three languages. If you're integrating client code with a search index, these samples demonstrate an end-to-end approach to integration. |
| November | **Retired** - [Visual Studio Code extension for Azure Cognitive Search](https://github.com/microsoft/vscode-azurecognitivesearch/blob/master/README.md). |
| November | [Query performance dashboard](https://github.com/Azure-Samples/azure-samples-search-evaluation). This Application Insights sample demonstrates an approach for deep monitoring of query usage and performance of an Azure Cognitive Search index. It includes a JSON template that creates a workbook and dashboard in Application Insights and a Jupyter Notebook that populates the dashboard with simulated data. |
| October | [Compliance risk analysis using Azure Cognitive Search](/azure/architecture/guide/ai/compliance-risk-analysis). On Azure Architecture Center, this guide covers the implementation of a compliance risk analysis solution that uses Azure Cognitive Search. |
| October | [Beiersdorf customer story using Azure Cognitive Search](https://customers.microsoft.com/story/1552642769228088273-Beiersdorf-consumer-goods-azure-cognitive-search). This customer story showcases semantic search and document summarization to provide researchers with ready access to institutional knowledge. |
| September |  [Event-driven indexing for Cognitive Search](https://github.com/aditmer/Event-Driven-Indexing-For-Cognitive-Search/blob/main/README.md). This C# sample is an Azure Function app that demonstrates event-driven indexing in Azure Cognitive Search. If you've used indexers and skillsets before, you know that indexers can run on demand or on a schedule, but not in response to events. This demo shows you how to set up an indexing pipeline that responds to data update events. |
| August | [Tutorial: Index large data from Apache Spark](search-synapseml-cognitive-services.md). This tutorial explains how to use the SynapseML open-source library to push data from Apache Spark into a search index. It also shows you how to make calls to Azure AI services to get AI enrichment without skillsets and indexers. |
| June | [Semantic search (preview)](semantic-search-overview.md). New support for Storage Optimized tiers (L1, L2). |
| June | **General availability** - [Debug Sessions](cognitive-search-debug-session.md).|
| May | **Retired** - [Power Query connector preview](/previous-versions/azure/search/search-how-to-index-power-query-data-sources).  |
| February | [Index aliases](search-how-to-alias.md). An index alias is a secondary name that can be used to refer to an index for querying, indexing, and other operations. When index names change, for example if you version the index, instead of updating the references to an index name in your application, you can just update the mapping for your alias. |

## Previous year's announcements

+ [2021 announcements](/previous-versions/azure/search/search-whats-new-2021)
+ [2020 announcements](/previous-versions/azure/search/search-whats-new-2020)
+ [2019 announcements](/previous-versions/azure/search/search-whats-new-2019)

<a name="new-service-name"></a>

## Service rebrand

Azure Search was renamed to **Azure Cognitive Search** in October 2019 to reflect the expanded (yet optional) use of cognitive skills and AI processing in service operations.

## Service updates

[Service update announcements](https://azure.microsoft.com/updates/?product=search&status=all) for Azure Cognitive Search can be found on the Azure web site.

