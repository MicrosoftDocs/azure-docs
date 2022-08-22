---
title: Index and search workflow concepts #Required; page title is displayed in search results. Include the brand.
description: Learn how to use indexing and search workflows #Required; article description that is displayed in search results. 
author: vivekkalra #Required; your GitHub user alias, with correct capitalization.
ms.author: vivekkalra #Required; microsoft alias of author; optional team alias.
ms.service: azure #Required; service per approved list. slug assigned by ACOM.
ms.topic: conceptual #Required; leave this attribute/value as-is.
ms.date: 08/22/2022
ms.custom: template-concept #Required; leave this attribute/value as-is.

#Customer intent: As a developer, I want to understand indexing and search workflows so that I could search for ingested data in the platform.
---
# Indexing and Search
    

## Introduction
    
 The Indexer service provides a mechanism for indexing structured and unstructured data.  Documents and indices are saved in a separate persistent store optimized for search operations (Elasticsearch). The Indexer API can index any number of documents.
    
## Required roles and headers to access Indexer APIs 
    
[Indexer API OSDU documentation](https://community.opengroup.org/osdu/platform/system/indexer-service/-/blob/aa1bf0b5dacb40191642d56842f7076c99e222c8/docs/tutorial/IndexerService.md)
    
## Get Indexing Status 
    
[Steps to get indexing status](https://community.opengroup.org/osdu/platform/system/indexer-service/-/blob/aa1bf0b5dacb40191642d56842f7076c99e222c8/docs/tutorial/IndexerService.md#get-indexing-status)
    
## Indexing Flow    

:::image type="content" source="media/concepts-index-and-search/concept-index-and-search-workflow.png" alt-text="Indexing and Search Workflow.":::
    

A storage record is created or updated by the user by calling the Storage service. This record contains data to be ingested, and should conform to the data types mentioned in the underlying schema that the record refers to. All the fields that are present in the schema will be indexed and be searchable by the user.
    

The Storage service creates an event, called 'recordChangedMessages', after consuming the record, and sends it to the message broker that is Azure Service Bus. The records reside in the Service Bus until they're pulled by the next microservice in line, called the Indexer Queue. The Indexer Queue is a worker service with no public APIs. This service pulls records from Service Bus, performs basic validation checks on those messages and sends them to the Indexer Service. If there's a failure in sending the messages to the Indexer Service, the Indexer Queue retries sending the recordChangedMessages with a configurable maximum retry count. If the retry attempt exceeds the maximum allowed retry count, then Indexer Queue sends a negative acknowledgment to the Service Bus, which archives the recordChangedMessages.
    

When the recordChangedMessages event is received by the Indexer Service, it fetches the required schemas from schema cache or schema service, fetches the updated records from storage service and creates an elastic mapping using this information. The Indexer Service then creates a new index within Elasticsearch if not already present, and then sends a bulk query to create or update the records as needed.
If the response from Elasticsearch is a failure response of type "service unavailable" or "request timed out", then Indexer Service creates recordChangedMessages for these failed record IDs and puts the message in Service Bus. These messages will again be pulled by the Indexer Queue service and will follow the same flow as before, to get indexed in Elasticsearch.
    

:::image type="content" source="media/concepts-index-and-search/concept-indexer-sequence.png" alt-text="Indexing sequence flow.":::
    

## Search 
    
  Once the record is present within Elasticsearch, it can be fetched using various search queries.
    For a detailed tutorial on Search service, refer [GitLab Documentation](https://community.opengroup.org/osdu/platform/system/search-service/-/tree/40ce4aea1d13de807eea646317c0f38b6b601bd6/docs/tutorial/SearchService.md)
    

## Re-index workflow 

[Re-index OSDU documentation](https://community.opengroup.org/osdu/platform/system/indexer-service/-/blob/aa1bf0b5dacb40191642d56842f7076c99e222c8/docs/tutorial/IndexerService.md#reindex)
    
## References
    
  - [GitLab Documentation](https://community.opengroup.org/osdu/platform/system/indexer-service/-/blob/aa1bf0b5dacb40191642d56842f7076c99e222c8/docs/tutorial/IndexerService.md)

## Next steps
<!-- Add a context sentence for the following links -->
> [!div class="nextstepaction"]
> [Domain data management service concepts](/concepts-ddms.md)