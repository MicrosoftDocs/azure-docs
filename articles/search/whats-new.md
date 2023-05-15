---
title: What's new in Azure Cognitive Search
description: Announcements of new and enhanced features, including a service rename of Azure Search to Azure Cognitive Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: overview
ms.date: 04/10/2023
ms.custom: references_regions 
---

# What's new in Azure Cognitive Search

Learn about the latest updates to Azure Cognitive Search functionality, docs, and samples.

> [!NOTE]
> Looking for preview features? Previews are announced here, but we also maintain a [preview features list](search-api-preview.md) so you can find them in one place.

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
| November | **Add search to websites** updated versions of React and Azure SDK client libraries: <ul><li>[C#](tutorial-csharp-overview.md)</li><li>[Python](tutorial-python-overview.md)</li><li>[JavaScript](tutorial-javascript-overview.md) </li></ul> "Add search to websites" is a tutorial series with sample code available in three languages. This series was . If you're integrating client code with a search index, these samples demonstrate an end-to-end approach to integration. |
| November | **Retired** - [Visual Studio Code extension for Azure Cognitive Search](https://github.com/microsoft/vscode-azurecognitivesearch/blob/master/README.md). |
| November | [Query performance dashboard](https://github.com/Azure-Samples/azure-samples-search-evaluation). This Application Insights sample demonstrates an approach for deep monitoring of query usage and performance of an Azure Cognitive Search index. It includes a JSON template that creates a workbook and dashboard in Application Insights and a Jupyter Notebook that populates the dashboard with simulated data. |
| October | [Compliance risk analysis using Azure Cognitive Search](/azure/architecture/guide/ai/compliance-risk-analysis). Published on Azure Architecture Center, this guide covers the implementation of a compliance risk analysis solution that uses Azure Cognitive Search. |
| October | [Beiersdorf customer story using Azure Cognitive Search](https://customers.microsoft.com/story/1552642769228088273-Beiersdorf-consumer-goods-azure-cognitive-search). This customer story showcases semantic search and document summarization to provide researchers with ready access to institutional knowledge. |
| September | [Azure Cognitive Search Lab](https://github.com/Azure-Samples/azure-search-lab/blob/main/README.md). This C# sample provides the source code for building a web front-end that accesses all of the REST API calls against an index. This tool is used by support engineers to investigate customer support issues. You can try this [demo site](https://azuresearchlab.azurewebsites.net/) before building your own copy. |
| September |  [Event-driven indexing for Cognitive Search](https://github.com/aditmer/Event-Driven-Indexing-For-Cognitive-Search/blob/main/README.md). This C# sample is an Azure Function app that demonstrates event-driven indexing in Azure Cognitive Search. If you've used indexers and skillsets before, you know that indexers can run on demand or on a schedule, but not in response to events. This demo shows you how to set up an indexing pipeline that responds to data update events. |
| August | [Tutorial: Index large data from Apache Spark](search-synapseml-cognitive-services.md). This tutorial explains how to use the SynapseML open-source library to push data from Apache Spark into a search index. It also shows you how to make calls to Cognitive Services to get AI enrichment without skillsets and indexers. |

## June 2022

|Item&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Type | Description |
|------------------------------|------|-------------|
| [Semantic search (preview)](semantic-search-overview.md) | Feature | New support for Storage Optimized tiers (L1, L2). |
| [Debug Sessions](cognitive-search-debug-session.md) | Feature | **General availability**. Debug sessions, a built-in editor that runs in Azure portal, is now generally available. |

## May 2022

|Item &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Type | Description |
|------------------------------|------|-------------|
| [Power Query connector preview](/previous-versions/azure/search/search-how-to-index-power-query-data-sources) | Feature | **Retired**. This indexer data source was introduced in May 2021 but won't be moving forward. Migrate your data indexing code by November 2022. See the feature documentation for migration guidance. |

## Previous year's announcements

+ [2021 announcements](/previous-versions/azure/search/search-whats-new-2021)
+ [2020 announcements](/previous-versions/azure/search/search-whats-new-2020)
+ [2019 announcements](/previous-versions/azure/search/search-whats-new-2019)

<a name="new-service-name"></a>

## Service re-brand

Azure Search was renamed to **Azure Cognitive Search** in October 2019 to reflect the expanded (yet optional) use of cognitive skills and AI processing in service operations.

## Service updates

[Service update announcements](https://azure.microsoft.com/updates/?product=search&status=all) for Azure Cognitive Search can be found on the Azure web site.
