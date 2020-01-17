---
title: New feature announcements
titleSuffix: Azure Cognitive Search
description: Announcements of new and enhanced features, including a service rename of Azure Search to Azure Cognitive Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/13/2020
---
# What's new in Azure Cognitive Search

Learn what's new in the service. Bookmark this page to keep up to date with the service.

<a name="new-service-name"></a>

## New service name for Azure Search

Azure Search is now renamed to **Azure Cognitive Search** to reflect the expanded use of cognitive skills and AI processing in core operations. While cognitive skills add new capabilities, using AI is strictly optional. You can continue to use Azure Cognitive Search without AI to build rich, full text search solutions over private, heterogenous, text-based content in an index that you create and manage in the cloud. 

API versions, Nuget packages, namespaces, and endpoints are unchanged. Your existing search solutions are unaffected by the service name change.

## Feature announcements

### January 2020

+ [Customer-managed encryption keys](search-security-manage-encryption-keys.md) is now generally available. If you are using REST, you can access the feature using `api-version=2019-05-06`. For managed code, the correct package is still [.NET SDK version 8.0-preview](search-dotnet-sdk-migration-version-9.md) even though the feature is out of preview. 

+ Private access to a search service is available through two mechanisms:

  + You can restrict access to specific IP addresses by using the Management REST API  `api-version=2019-10-01-Preview` to create the service. The preview API has new **IpRule** and **NetworkRuleSet** properties in [CreateOrUpdate API](https://docs.microsoft.com/rest/api/searchmanagement/services/createorupdate). This preview feature is available in selected regions. For more information, see [How to use the Management REST API](https://docs.microsoft.com/rest/api/searchmanagement/search-howto-management-rest-api).

  + Currently available through a limited-access preview, you can provision an Azure Search service that supports Azure Private Endpoint for connections from clients on the same virtual network. For more information, see [Create a Private Endpoint for a secure connection](service-create-private-endpoint.md).

### December 2019

+ [Create app (preview)](search-create-app-portal.md) is a new wizard in the portal that generates a downloadable HTML file. The file comes with embedded script that renders an operational "localhost"-style web app, bound to an index on your search service. Pages are configurable in the wizard and can contain a search bar, results area, sidebar navigation, and typeahead query support. You can modify the HTML offline to extend or customize the workflow or appearance.

+ [Create a private endpoint for secure connections (preview)](service-create-private-endpoint.md) explains how to set up a Private Link for secure connections to your search service. This preview feature is available upon request and uses [Azure Private Link](../private-link/private-link-overview.md) and [Azure Virtual Network](../virtual-network/virtual-networks-overview.md) as part of the solution.

### November 2019 - Ignite Conference

+ [Incremental enrichment (preview)](cognitive-search-incremental-indexing-conceptual.md) adds caching and statefullness to an enrichment pipeline so that you can work on specific steps or phases without losing content that is already processed. Previously, any change to an enrichment pipeline required a full rebuild. With incremental enrichment, the output of costly analysis, especially image analysis, is preserved.

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