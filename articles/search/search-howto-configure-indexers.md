---
title: Configure an indexer
titleSuffix: Azure Cognitive Search
description: Set indexer properties to define the indexer, and then set parameters to modify runtime behaviors.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/28/2021
---

# Configure properties and parameters of an Azure Cognitive Search indexer

An indexer definition is a collection of properties that determine source inputs, any interim processing (optional), and destination outputs. It also includes properties that allow you to schedule or disable an indexer, or map fields between a source and the destination. Parameters is also an indexer property, used to modify runtime behaviors.

Besides the basic properties that apply to all indexers, the data source you're using can add properties and properties that are specific to that type. For example, Blob storage has unique configuration parameters that let you filter on file extensions: `"parameters" : { "configuration" : { "indexedFileNameExtensions" : ".pdf,.docx" } }`.

This article describes basic properties and runtime parameters that are applicable to all indexers. Details about schedules and field mapping can be found at [Schedule indexers](search-howto-schedule-indexers.md) and [Field mappings in search indexers](search-indexer-field-mappings.md).

## TBD

## Next steps