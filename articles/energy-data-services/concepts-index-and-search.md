---
title: Microsoft Azure Data Manager for Energy - index and search workflow concepts
description: Learn how to use indexing and search workflows
author: vivekkalra
ms.author: vivekkalra
ms.service: energy-data-services
ms.topic: conceptual
ms.date: 02/10/2023
ms.custom: template-concept

#Customer intent: As a developer, I want to understand indexing and search workflows so that I could search for ingested data in the platform.
---
# Azure Data Manager for Energy indexing and search workflows

All data and associated metadata ingested into the platform are indexed to enable search. The metadata is accessible to ensure awareness even when the data isn't available.

## Indexer Service

The `Indexer Service` provides a mechanism for indexing documents that contain structured and unstructured data. 

> [!NOTE]
> This service is not a public service and only meant to be called internally by other core platform services. 
        
### Indexing workflow    

The below diagram illustrates the Indexing workflow:

:::image type="content" source="media/concepts-index-and-search/concept-index-and-search-workflow.png" alt-text="Diagram that shows the indexing and search Workflow.":::

When a customer loads data into the platform, the associated metadata is ingested using the `Storage service`. The `Storage service` provides a set of APIs to manage the entire metadata lifecycle such as ingestion (persistence), modification, deletion, versioning, retrieval, and data schema management. Each storage metadata record created by the `Storage service` contains a *kind* parameter that refers to an underlying *schema*. This schema determines the attributes that will be indexed by the `Indexer service`.
    
When the `Storage service` creates a metadata record, it raises a *recordChangedMessages* event that is collected in the Azure Service Bus (message queue). The `Indexer queue` service pulls the message from the Azure Service Bus, performs basic validation and sends it over to the `Indexer service`. If there are any failures in sending the messages to the `Indexer service`, the `Indexer queue` service retries sending the message up to a maximum allowed configurable retry count. If the retry attempts fail, a negative acknowledgment is sent to the Azure Service Bus, which then archives the message.

When the *recordChangedMessages* event is received by the `Indexer Service`, it fetches the required schemas from the schema cache or through the `Schema service` APIs. The `Indexer Service` then creates a new index within Elasticsearch (if not already present), and then sends a bulk query to create or update the records as needed. If the response from Elasticsearch is a failure response of type *service unavailable* or *request timed out*, then the `Indexer Service` creates *recordChangedMessages* for these failed record IDs and puts the message in the Azure Service Bus. These messages will again be pulled by the `Indexer Queue` service and will follow the same flow as before.
    
:::image type="content" source="media/concepts-index-and-search/concept-indexer-sequence.png" alt-text="Diagram that shows Indexing sequence flow.":::

For more information, see [Indexer service OSDU&trade; documentation](https://community.opengroup.org/osdu/platform/system/indexer-service/-/blob/release/0.15/docs/tutorial/IndexerService.md) provides information on indexer service

## Search workflow
    
`Search service` provides a mechanism for discovering indexed metadata documents. The Search API supports full-text search on string fields, range queries on date, numeric, or string field, etc. along with geo-spatial searches.

For a detailed tutorial on `Search service`, refer [Search service OSDU&trade; documentation](https://community.opengroup.org/osdu/platform/system/search-service/-/blob/release/0.15/docs/tutorial/SearchService.md)
    

## Reindex workflow 
Reindex API allows users to reindex a kind without reingesting the records via storage API. For detailed information, refer to 
[Reindex OSDU&trade; documentation](https://community.opengroup.org/osdu/platform/system/indexer-service/-/blob/release/0.15/docs/tutorial/IndexerService.md#reindex)

OSDU&trade; is a trademark of The Open Group.

## Next steps
<!-- Add a context sentence for the following links -->
> [!div class="nextstepaction"]
> [Domain data management service concepts](concepts-ddms.md)