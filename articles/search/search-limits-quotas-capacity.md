<properties
	pageTitle="Service limits in Azure Search | Microsoft Azure | Hosted cloud search service"
	description="Service limits used for capacity planning and maximum limits on requests and reponses for Azure Search."
	services="search"
	documentationCenter=""
	authors="HeidiSteen"
	manager="mblythe"
	editor=""
    tags="azure-portal"/>

<tags
	ms.service="search"
	ms.devlang="NA"
	ms.workload="search"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.date="05/25/2016"
	ms.author="heidist"/>

# Service limits in Azure Search

Maximum limits on storage, workloads, and quantities of indexes, documents, and other objects depend on whether you add Azure Search at a **Free**, **Basic**, or **Standard** pricing tier.

- **Free** is a multi-tenant shared service that comes with your Azure subscription. It's a no-additional-cost option for existing subscribers that allows you to experiment with the service before signing up for dedicated resources. 
- **Basic (Preview)** provides dedicated computing resources for production workloads at a smaller scale. This tier is currently in Preview and offered at a [50% reduced rate during the Preview period](https://azure.microsoft.com/pricing/details/search/).
- **Standard** runs on dedicated machines, with more storage and processing capacity at every level, including the minimum configuration. Standard comes in two levels (S1 and S2). 

All tiers can be [provisioned in the portal](search-create-service-portal.md), with the exception of S2, which requires a support ticket. Please contact Support or azuresearch_contact@microsoft.com to get started with S2.

## Tier limits

[AZURE.INCLUDE [azure-search-limits](../../includes/azure-search-limits-tier.md)]

## Storage limits ##

[AZURE.INCLUDE [azure-search-limits](../../includes/azure-search-limits-storage.md)]

## Data limits ##

Resource|Free|Basic (Preview) |S1|S2
---|---|---|---|----
Index: maximum fields per index|1000|100 <sup>1</sup>|1000|1000
Index: maximum scoring profiles per index|16|16|16|16
Index: maximum functions per profile|8|8|8|8
Document size per Index API<sup>2</sup> in MB|<16|<16|<16|<16
Indexers: maximum indexing load per invocation|10,000 documents|Limited only by maximum documents|Limited only by maximum documents|Limited only by maximum documents
Indexers: maximum running time|3 minutes|24 hours|24 hours|24 hours
Blob indexer: maximum blob size, MB|16|16|128|256
Blob indexer: maximum characters of content extracted from a blob|32,000|64,000|4 million|4 million

<sup>1</sup> Basic tier is the only tier with a lower limit of 100 fields per index.

<sup>2</sup> Maximum document size when calling an Index API. Document size is actually a limit on the size of the Index API request body. Since you can pass a batch of multiple documents to the Index API at once, the size limit depends on how many documents are in the batch. For a batch with a single document, the maximum document size will be to 16 MB of JSON.

To keep document size down, remember to exclude non-queryable data from the request. Images and other binary data are not directly queryable and shouldn't be stored in the index. To integrate non-queryable data into search results, define a non-searchable field that stores a a URL reference to the resource.

## Workload limits (Queries per second) ##

Resource|Free|Basic (Preview) |S1|S2
---|---|---|---|----
QPS|N/A|~3 per replica|~15 per replica|~60 per replica

Queries per second (QPS) is an approximation based on heuristics, using simulated and actual customer workloads to derive estimated values. Exact QPS throughput will vary depending on your data and the nature of the query.

Although rough estimates are provided above, actual queries-per-second (QPS) is difficult to determine, especially in the Free shared service where throughput is based on available bandwidth and competition for system resources. The compute and storage resources backing the shared service are shared by multiple subscribers, so QPS for your solution will always vary depending on how many other workloads are running at the same time. 

At the standard level, you can estimate QPS more closely because you have control over more of the parameters. See the best practices section in [Manage your search solution](search-manage.md) for guidance on how to calculate QPS for your workloads. 

## API Request limits

- Maximum of 16 MB per request <sup>1</sup>
- Maximum 8 KB URL length
- Maximum 1000 documents per batch of index uploads, merges, or deletes
- Maximum 32 fields in $orderby clause
- Maximum search term size is 32766 bytes (32 KB minus 2 bytes) of UTF-8 encoded text

<sup>1</sup> In Azure Search, the body of a request is subject to an upper limit of 16 MB, imposing a practical limit on the contents of individual fields or collections that are not otherwise constrained by theoretical limits (see [Supported data types](https://msdn.microsoft.com/library/azure/dn798938.aspx) for more information about field composition and restrictions).

## API Response limits

- Maximum 1000 documents returned per page of search results
- Maximum 100 suggestions returned per Suggest API request

## API Key limits

Api-keys are used for service authentication. There are two types. Admin keys are specified in the request header and grant full read-write access to the service. Query keys are read-only, specified on the URL, and typically distributed to client applications.

- Maximum of 2 admin keys per service
- Maximum of 50 query keys per service