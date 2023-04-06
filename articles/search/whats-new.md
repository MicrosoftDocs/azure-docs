---
title: What's new in Azure Cognitive Search
description: Announcements of new and enhanced features, including a service rename of Azure Search to Azure Cognitive Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: overview
ms.date: 03/21/2023
ms.custom: references_regions 
---

# What's new in Azure Cognitive Search

Learn about the latest updates to Azure Cognitive Search functionality, docs, and samples.

> [!NOTE]
> Looking for preview features? Previews are announced here, but we also maintain a [preview features list](search-api-preview.md) so you can find them in one place.

## March 2023

| Item&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Type |  Description |
|-----------------------------|------|--------------|
| [**ChatGPT + Enterprise data with Azure OpenAI and Cognitive Search (GitHub)**](https://github.com/Azure-Samples/azure-search-openai-demo/blob/main/README.md) | Sample | Python code and a template for combining Cognitive Search with the large language models in OpenAI. For background, see this Tech Community blog post: [Revolutionize your Enterprise Data with ChatGPT](https://techcommunity.microsoft.com/t5/ai-applied-ai-blog/revolutionize-your-enterprise-data-with-chatgpt-next-gen-apps-w/ba-p/3762087). <br><br>Key points: <br><br>Use Cognitive Search to consolidate and index searchable content.</br> <br>Query the index for initial search results.</br> <br>Assemble prompts from those results and send to the gpt-35-turbo (preview) model in Azure OpenAI.</br> <br>Return a cross-document answer and provide citations and transparency in your customer-facing app so that users can assess the response.</br>|

## November 2022

| Item&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Type |  Description |
|-----------------------------|------|--------------|
| **Add search to websites** <ul><li>[C#](tutorial-csharp-overview.md)</li><li>[Python](tutorial-python-overview.md)</li><li>[JavaScript](tutorial-javascript-overview.md) </li></ul>| Sample | "Add search to websites" is a tutorial series with sample code available in three languages. This series was updated in November to run with current versions of React and the SDK client libraries. If you're integrating client code with a search index, these samples demonstrate an end-to-end approach to integration. |
| [Visual Studio Code extension for Azure Cognitive Search](https://github.com/microsoft/vscode-azurecognitivesearch/blob/master/README.md) | Feature | **Retired**. This preview feature isn't moving forward to general availability and has been removed from Visual Studio Code Marketplace. See the [documentation](search-get-started-vs-code.md) for details. |
| [Query performance dashboard](https://github.com/Azure-Samples/azure-samples-search-evaluation) | Sample | This Application Insights sample demonstrates an approach for deep monitoring of query usage and performance of an Azure Cognitive Search index. It includes a JSON template that creates a workbook and dashboard in Application Insights and a Jupyter Notebook that populates the dashboard with simulated data. |

## October 2022

|Item &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Type | Description |
|------------------------------|------|-------------|
| [Compliance risk analysis using Azure Cognitive Search](/azure/architecture/guide/ai/compliance-risk-analysis) | Content | Published on Azure Architecture Center, this guide covers the implementation of a compliance risk analysis solution that uses Azure Cognitive Search. |
| [Beiersdorf customer story using Azure Cognitive Search](https://customers.microsoft.com/story/1552642769228088273-Beiersdorf-consumer-goods-azure-cognitive-search) | Content | This customer story showcases semantic search and document summarization to provide researchers with ready access to institutional knowledge. |

## September 2022

|Item &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Type | Description |
|------------------------------|------|-------------|
| [Azure Cognitive Search Lab](https://github.com/Azure-Samples/azure-search-lab/blob/main/README.md) | Sample | This C# sample provides the source code for building a web front-end that accesses all of the REST API calls against an index. This tool is used by support engineers to investigate customer support issues. You can try this [demo site](https://azuresearchlab.azurewebsites.net/) before building your own copy. |
| [Event-driven indexing for Cognitive Search](https://github.com/aditmer/Event-Driven-Indexing-For-Cognitive-Search/blob/main/README.md) | Sample | This C# sample is an Azure Function app that demonstrates event-driven indexing in Azure Cognitive Search. If you've used indexers and skillsets before, you know that indexers can run on demand or on a schedule, but not in response to events. This demo shows you how to set up an indexing pipeline that responds to data update events. |

## August 2022

|Item&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Type | Description |
|------------------------------|------|-------------|
| [Tutorial: Index large data from Apache Spark](search-synapseml-cognitive-services.md) | Content | This tutorial explains how to use the SynapseML open-source library to push data from Apache Spark into a search index. It also shows you how to make calls to Cognitive Services to get AI enrichment without skillsets and indexers. |

## June 2022

|Item&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Type | Description |
|------------------------------|------|-------------|
| [Semantic search (preview)](semantic-search-overview.md) | Feature | New support for Storage Optimized tiers (L1, L2). |
| [Debug Sessions](cognitive-search-debug-session.md) | Feature | **General availability**. Debug sessions, a built-in editor that runs in Azure portal, is now generally available. |

## May 2022

|Item &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Type | Description |
|------------------------------|------|-------------|
| [Power Query connector preview](/previous-versions/azure/search/search-how-to-index-power-query-data-sources) | Feature | **Retired**. This indexer data source was introduced in May 2021 but won't be moving forward. Migrate your data indexing code by November 2022. See the feature documentation for migration guidance. |

## February 2022

|Item &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Type | Description |
|------------------------------|------|-------------|
| [Index aliases](search-how-to-alias.md) | Feature | An index alias is a secondary name that can be used to refer to an index for querying, indexing, and other operations. When index names change, for example if you version the index, instead of updating the references to an index name in your application, you can just update the mapping for your alias. |

## 2021 announcements

| Month | Feature | Description |
|-------|---------|-------------|
| December | [Enhanced configuration for semantic search](semantic-how-to-query-request.md#2---create-a-semantic-configuration) | This configuration is a new addition to the 2021-04-30-Preview API, and is now required for semantic queries and Azure portal.|
| November | [Azure Files indexer (preview)](./search-file-storage-integration.md) | Public preview in the portal and preview REST APIs.|
| July | [Search REST API 2021-04-30-Preview](/rest/api/searchservice/index-preview) | Public preview announcement. |
| July | [Role-based access control for data plane (preview)](search-security-rbac.md) | Public preview announcement. |
| July | [Management REST API 2021-04-01-Preview](/rest/api/searchmanagement/) | Modifies [Create or Update Service](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update) to support new [DataPlaneAuthOptions](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update#dataplaneauthoptions). Public preview announcement. |
| May | [Power Query connector support (preview)](/previous-versions/azure/search/search-how-to-index-power-query-data-sources) | Public preview announcement. | 
| May | [Azure Data Lake Storage Gen2 indexer](search-howto-index-azure-data-lake-storage.md) | Generally available, using REST api-version=2020-06-30 and Azure portal. |
| May | [Azure MySQL indexer (preview)](search-howto-index-mysql.md) | Public preview, REST api-version=2020-06-30-Preview, [.NET SDK 11.2.1](/dotnet/api/azure.search.documents.indexes.models.searchindexerdatasourcetype.mysql), and Azure portal. |
| May | [More queryLanguages for spell check and semantic results](/rest/api/searchservice/preview-api/search-documents#queryLanguage) | See [Announcement (techcommunity blog)](https://techcommunity.microsoft.com/t5/azure-ai/introducing-multilingual-support-for-semantic-search-on-azure/ba-p/2385110). Public preview ([by request](https://aka.ms/SemanticSearchPreviewSignup)). Use [Search Documents (REST)](/rest/api/searchservice/preview-api/search-documents) api-version=2020-06-30-Preview, [Azure.Search.Documents 11.3.0-beta.2](https://www.nuget.org/packages/Azure.Search.Documents/11.3.0-beta.2), or [Search explorer](search-explorer.md) in Azure portal. |
| May| [Full support for customer-managed key (CMK) encryption](search-security-manage-encryption-keys.md#full-double-encryption) | Generally available in all regions, subject to service creation dates. |
| April | [Azure Cosmos DB for Apache Gremlin support (preview)](search-howto-index-cosmosdb-gremlin.md) | Public preview ([by request](https://aka.ms/azure-cognitive-search/indexer-preview)), using api-version=2020-06-30-Preview. |
| March | [Semantic search (preview)](semantic-search-overview.md) | Search results relevance scoring based on semantic models. Public preview ([by request](https://aka.ms/SemanticSearchPreviewSignup)). Use [Search Documents (REST)](/rest/api/searchservice/preview-api/search-documents) api-version=2020-06-30-Preview or [Search explorer](search-explorer.md) in Azure portal. Region and tier restrictions apply. |
| March | [Spell check query terms (preview)](speller-how-to-add.md) | The `speller` option works with any query type (simple, full, or semantic). Public preview, REST only, api-version=2020-06-30-Preview|
| March | [SharePoint indexer (preview)](search-howto-index-sharepoint-online.md) | Public preview, REST only, api-version=2020-06-30-Preview |
| March | [Normalizers (preview)](search-normalizers.md) | Public preview, REST only, api-version=2020-06-30-Preview |
| March | [Custom Entity Lookup skill](cognitive-search-skill-custom-entity-lookup.md ) |  Scans for strings specified in a custom, user-defined list of words and phrases. Generally available. |
| February | [Reset Documents (preview)](search-howto-run-reset-indexers.md) |  Available in the [Search REST API 2020-06-30-Preview](/rest/api/searchservice/index-preview). |
| February | [Availability Zones](search-reliability.md#availability-zones) | Search services with two or more replicas in certain regions gain resiliency by having replicas in two or more distinct physical locations.  The region and date of search service creation determine availability.  |
| February | [Azure CLI](/cli/azure/search) </br>[Azure PowerShell](/powershell/module/az.search/) | New revisions now provide the full range of operations in the Management REST API 2020-08-01, including support for IP firewall rules and private endpoint. Generally available. |
| January | [Solution accelerator for Azure Cognitive Search and QnA Maker](https://github.com/Azure-Samples/search-qna-maker-accelerator) | Pulls questions and answers out of the document and suggest the most relevant answers. A live demo app can be found at [https://aka.ms/qnaWithAzureSearchDemo](https://aka.ms/qnaWithAzureSearchDemo). This feature is an open-source project (no SLA). |

## 2020 announcements

See [2020 Archive for "What's New in Cognitive Search"](/previous-versions/azure/search/search-whats-new-2020) in the content archive.

## 2019 announcements

See [2019 Archive for "What's New in Cognitive Search"](/previous-versions/azure/search/search-whats-new-2019) in the content archive.

<a name="new-service-name"></a>

## Service re-brand announcement

Azure Search was renamed to **Azure Cognitive Search** in October 2019 to reflect the expanded (yet optional) use of cognitive skills and AI processing in service operations. API versions, NuGet packages, namespaces, and endpoints are unchanged. New and existing search solutions are unaffected by the service name change.

## Service updates

[Service update announcements](https://azure.microsoft.com/updates/?product=search&status=all) for Azure Cognitive Search can be found on the Azure web site.
