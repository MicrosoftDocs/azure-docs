---
title: New feature announcements
titleSuffix: Azure Cognitive Search
description: Announcements of new and enhanced features, including a service rename of Azure Search to Azure Cognitive Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/07/2020
---
# What's new in Azure Cognitive Search

Learn what's new in the service. Bookmark this page to keep up to date with the service.

<a name="new-service-name"></a>

## New service name for Azure Search

Azure Search is now renamed to **Azure Cognitive Search** to reflect the expanded use of cognitive skills and AI processing in core operations. While cognitive skills add new capabilities, using AI is strictly optional. You can continue to use Azure Cognitive Search without AI to build rich, full text search solutions over private, heterogenous, text-based content in an index that you create and manage in the cloud. 

API versions, Nuget packages, namespaces, and endpoints are unchanged. Your existing search solutions are unaffected by the service name change.

## Feature announcements

### January 2020

+ *Restricted IP access and private endpoint (preview)* on a search service endpoint is now available in **api-version=2019-10-01-Preview**. You can set up a secure endpoint using the new **IpRule** and **NetworkRuleSet** properties in the [Create or Update](https://docs.microsoft.com/rest/api/searchmanagement/services/createorupdate) Management REST API. For more information about API versions, see [How to use the Management REST API](https://docs.microsoft.com/rest/api/searchmanagement/search-howto-management-rest-api).

### December 2019

+ [Create app (preview)](search-create-app-portal.md) is a new wizard in the portal that generates a downloadable HTML file. The file comes with embedded script that renders an operational "localhost"-style web app, bound to an index on your search service. Pages are configurable in the wizard and can contain a search bar, results area, sidebar navigation, and typeahead query support. You can modify the HTML offline to extend or customize the workflow or appearance.

### November 2019 - Ignite Conference

+ [Incremental indexing (preview)](cognitive-search-incremental-indexing-conceptual.md) allows you to pick and choose which steps to reprocess when making modifications to an enrichment pipeline. Incremental indexing is useful if you have image content that you previously analyzed. The output of costly analysis is stored and then used as a basis for additional indexing or enrichment.

<!-- 
+ Custom Entity Lookup is a cognitive skill used during indexing that allows you to provide a list of custom entities (such as part numbers, diseases, or names of locations you care about) that should be found within the text. It supports fuzzy matching, case-insensitive matching, and entity synonyms. -->

+ [Document Extraction (preview)](cognitive-search-skill-document-extraction.md) is a cognitive skill used during indexing that allows you to extract the contents of a file from within a skillset. Previously, document cracking only occurred prior to skillset execution. With the addition of this skill, you can also perform this operation within skillset execution.

+ [Text Translation (preview)](cognitive-search-skill-text-translation.md) is a cognitive skill used during indexing that evaluates text and, for each record, returns the text translated to the specified target language.

+ [Power BI templates](https://github.com/Azure-Samples/cognitive-search-templates/blob/master/README.md) can jumpstart your visualizations and analysis of enriched content in a knowledge store in Power BI desktop. This template is designed for Azure table projections created through the [Import data wizard](knowledge-store-create-portal.md).

+ [Azure Data Lake Storage Gen2 (preview)](search-howto-index-azure-data-lake-storage.md), [Cosmos DB Gremlin API (preview)](search-howto-index-cosmosdb.md), and [Cosmos DB Cassandra API (preview)](search-howto-index-cosmosdb.md) are now supported in indexers. You can sign up using [this form](https://aka.ms/azure-cognitive-search/indexer-preview). You will receive a confirmation email once you have been accepted into the preview program.

### July 2019

+ Generally available in [Azure Government Cloud](../azure-government/documentation-government-services-webandmobile.md#azure-cognitive-search).

## Service updates

[Service update announcements](https://azure.microsoft.com/updates/?product=search&status=all) for Azure Cognitive Search can be found on the Azure web site.