---
title: Monitor indexing operations
titleSuffix: Azure Cognitive Search
description: Monitor the duration and status of indexing and indexers, and set up alerts for notification or corrective action should problems arise.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 02/12/2020
---

# Monitor indexing operations in Azure Cognitive Search

Whether you are pushing data to an index from client code, or using an indexer that pulls data into an index, you can use search service APIs and operational logs for oversight into internal processes.

The indexing engine is also where AI enrichment occurs. Document cracking, skillset execution, and subsequent data ingestion into an index or knowledge store are classified as indexing operations.

## Use system APIs

Both the Azure Cognitive Search REST API and the .NET SDK provide programmatic access to service metrics, index and indexer information, and document counts.

+ [GET Service Statistics](/rest/api/searchservice/get-service-statistics)
+ [GET Index Statistics](/rest/api/searchservice/get-index-statistics)
+ [GET Document Counts](/rest/api/searchservice/count-documents)
+ [GET Indexer Status](/rest/api/searchservice/get-indexer-status)

## Index status

Create
Delete
Update definitions
Refresh content

## Indexing status

TBD

## Alerts

events on index
indexing failures
Storage alerts

## Next steps

If you haven't done so already, review the fundamentals of search service monitoring to learn about the full range of oversight capabilities.

> [!div class="nextstepaction"]
> [Monitor operations and activity in Azure Cognitive Search](search-monitor-usage.md)
