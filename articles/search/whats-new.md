---
title: What's new in the service
titleSuffix: Azure Cognitive Search
description: Announcements of new and enhanced features, including a service rename of Azure Search to Azure Cognitive Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 10/04/2019
---
# What's new in Azure Cognitive Search

Learn what's new in the service. Bookmark this page to keep up-to-date with the service.

## New service name for Azure Search

Azure Search is now renamed to **Azure Cognitive Search** to reflect the expanded use of cognitive skills and AI processing in core operations. While cognitive skills add new capabilities, using AI is strictly optional. You can continue to use Azure Cognitive Search without AI to build rich, free text search solutions over private, heterogenous content in an index that you create and manage in the cloud.

API versions, Nuget packages, namespaces, and endpoints are unchanged.

## New or enhanced features

November 4, 2019 - Ignite Conference

+ [Knowledge store](knowledge-store-concept-intro.md) is now generally available. If you previously used `api-version=2019-05-06-Preview` to create a knowledge, you can now drop the `-Preview` from the version designation.

+ [Power BI templates](knowledge-store-connect-power-bi.md) can jumpstart your visualizations and analysis of enriched content in a knowledge store.

+ Incremental processing, now in preview, allows you to process and preserve content in chunks so that you can build up an index or knowledge store in phases. This is especially useful if you have image content. You can preserve the output of costly image analysis and then use that output as a basis for additional indexing or enrichment.

+ Lookup Skill is a cognitive skill used during indexing that calls a specific document by its ID for processing within a skillset.

+ Document Cracking Skill is a cognitive skill used during indexing that allows you to extract the contents of a file from within a skillset. Previously, document cracking occurred prior to skillset execution. With the addition of this skill, you can perform this operation within skillset execution.

<!-- + File projections, now in preview ...

+ Indexer data source support now includes ... -->


## Service updates

[Service update announcements](https://azure.microsoft.com/en-us/updates/?product=search&status=all) for Azure Cognitive Search can be found on the Azure web site.