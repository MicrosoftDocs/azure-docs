---
title: Service limits in Azure Search | Microsoft Docs
description: Service limits used for capacity planning and maximum limits on requests and responses for Azure Search.
services: search
documentationcenter: ''
author: HeidiSteen
manager: jhubbard
editor: ''
tags: azure-portal

ms.assetid: 857a8606-c1bf-48f1-8758-8032bbe220ad
ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 11/09/2017
ms.author: heidist

---
# Service limits in Azure Search
Maximum limits on storage, workloads, and quantities of indexes, documents, and other objects depend on whether you [provision Azure Search](search-create-service-portal.md) at a **Free**, **Basic**, or **Standard** pricing tier.

* **Free** is a multi-tenant shared service that comes with your Azure subscription. 
* **Basic** provides dedicated computing resources for production workloads at a smaller scale.
* **Standard** runs on dedicated machines with more storage and processing capacity at every level. Standard comes in four levels: S1, S2, S3, and S3 High Density (S3 HD).

> [!NOTE]
> A service is provisioned at a specific tier. Jumping tiers to gain capacity involves provisioning a new service (there is no in-place upgrade). For more information, see [Choose a SKU or tier](search-sku-tier.md). To learn more about adjusting capacity within a service you've already provisioned, see [Scale resource levels for query and indexing workloads](search-capacity-planning.md).
>

## Per subscription limits
[!INCLUDE [azure-search-limits-per-subscription](../../includes/azure-search-limits-per-subscription.md)]

## Per service limits
[!INCLUDE [azure-search-limits-per-service](../../includes/azure-search-limits-per-service.md)]

## Per index limits
There is a one-to-one correspondence between limits on indexes and limits on indexers. Given a limit of 200 indexes, the maximum limit for indexers is also 200 for the same service.

| Resource | Free | Basic | S1 | S2 | S3 | S3 HD |
| --- | --- | --- | --- | --- | --- | --- |
| Index: maximum fields per index |1000 |100 <sup>1</sup> |1000 |1000 |1000 |1000 |
| Index: maximum scoring profiles per index |100 |100 |100 |100 |100 |100 |
| Index: maximum functions per profile |8 |8 |8 |8 |8 |8 |
| Indexers: maximum indexing load per invocation |10,000 documents |Limited only by maximum documents |Limited only by maximum documents |Limited only by maximum documents |Limited only by maximum documents |N/A <sup>2</sup> |
| Indexers: maximum running time | 1-3 minutes <sup>3</sup> |24 hours |24 hours |24 hours |24 hours |N/A <sup>2</sup> |
| Blob indexer: maximum blob size, MB |16 |16 |128 |256 |256 |N/A <sup>2</sup> |
| Blob indexer: maximum characters of content extracted from a blob |32,000 |64,000 |4 million |4 million |4 million |N/A <sup>2</sup> |

<sup>1</sup> Basic tier is the only SKU with a lower limit of 100 fields per index.

<sup>2</sup> S3 HD doesn't currently support indexers. Contact Azure Support if you have an urgent need for this capability.

<sup>3</sup> Indexer maximum execution time for the Free tier is 3 minutes for blob sources and 1 minute for all other data sources.

## Document size limits
| Resource | Free | Basic | S1 | S2 | S3 | S3 HD |
| --- | --- | --- | --- | --- | --- | --- |
| Individual document size per Index API |<16 MB |<16 MB |<16 MB |<16 MB |<16 MB |<16 MB |

Refers to the maximum document size when calling an Index API. Document size is actually a limit on the size of the Index API request body. Since you can pass a batch of multiple documents to the Index API at once, the size limit actually depends on how many documents are in the batch. For a batch with a single document, the maximum document size is 16 MB of JSON.

To keep document size down, remember to exclude non-queryable data from the request. Images and other binary data are not directly queryable and shouldn't be stored in the index. To integrate non-queryable data into search results, define a non-searchable field that stores a URL reference to the resource.

## Queries per second (QPS)

QPS estimates must be developed independently by every customer. Index size and complexity, query size and complexity, and the amount of traffic are primary determinants of QPS. There is no way to offer meaningful estimates when such factors are unknown.

Estimates are more predictable when calculated on services running on dedicated resources (Basic and Standard tiers). You can estimate QPS more closely because you have control over more of the parameters. For guidance on how to approach estimation, see [Azure Search performance and optimization](search-performance-optimization.md).

## API Request limits
* Maximum of 16 MB per request <sup>1</sup>
* Maximum 8 KB URL length
* Maximum 1000 documents per batch of index uploads, merges, or deletes
* Maximum 32 fields in $orderby clause
* Maximum search term size is 32,766 bytes (32 KB minus 2 bytes) of UTF-8 encoded text

<sup>1</sup> In Azure Search, the body of a request is subject to an upper limit of 16 MB, imposing a practical limit on the contents of individual fields or collections that are not otherwise constrained by theoretical limits (see [Supported data types](https://msdn.microsoft.com/library/azure/dn798938.aspx) for more information about field composition and restrictions).

## API Response limits
* Maximum 1000 documents returned per page of search results
* Maximum 100 suggestions returned per Suggest API request

## API Key limits
Api-keys are used for service authentication. There are two types. Admin keys are specified in the request header and grant full read-write access to the service. Query keys are read-only, specified on the URL, and typically distributed to client applications.

* Maximum of 2 admin keys per service
* Maximum of 50 query keys per service
