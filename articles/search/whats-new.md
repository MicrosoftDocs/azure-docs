---
title: What's new in the service
titleSuffix: Azure Cognitive Search
description: Announcements of new and enhanced features, including a service rename of Azure Search to Azure Cognitive Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
---
# What's new in Azure Cognitive Search

Learn what's new in the service. Bookmark this page to keep up-to-date with the service.

<a name="new-service-name"></a>

## New service name for Azure Search

Azure Search is now renamed to **Azure Cognitive Search** to reflect the expanded use of cognitive skills and AI processing in core operations. While cognitive skills add new capabilities, using AI is strictly optional. You can continue to use Azure Cognitive Search without AI to build rich, full text search solutions over private, heterogenous, text-based content in an index that you create and manage in the cloud. 

API versions, Nuget packages, namespaces, and endpoints are unchanged. Your existing search solutions are unaffected by the service name change.

## Feature announcements

November 4, 2019 - Ignite Conference

+ [Incremental indexing](cognitive-search-incremental-indexing-conceptual.md), now in preview, allows you to process or re-process only the steps that are absolutely necessary when making modifications to an enrichment pipeline. This is especially useful if you have image content that you previously analyzed. The output of costly analysis is stored and then used as a basis for additional indexing or enrichment.

<!-- 
+ Custom Entity Lookup is a cognitive skill used during indexing that allows you to provide a list of custom entities (such as part numbers, diseases, or names of locations you care about) that should be found within the text. It supports fuzzy matching, case-insensitive matching, and entity synonyms. -->

+ [Document Extraction](cognitive-search-skill-document-extraction.md) is a cognitive skill used during indexing that allows you to extract the contents of a file from within a skillset. Previously, document cracking only occurred prior to skillset execution. With the addition of this skill, you can also perform this operation within skillset execution.

+ [Text Translation](cognitive-search-skill-text-translation.md) is a cognitive skill used during indexing that evaluates text and, for each record, returns the text translated to the specified target language.

+ [Power BI templates](https://github.com/Azure-Samples/cognitive-search-templates/blob/master/README.md) can jumpstart your visualizations and analysis of enriched content in a knowledge store in Power BI desktop. This template is designed for Azure table projections created through the [Import data wizard](knowledge-store-create-portal.md).

## Service updates

[Service update announcements](https://azure.microsoft.com/updates/?product=search&status=all) for Azure Cognitive Search can be found on the Azure web site.