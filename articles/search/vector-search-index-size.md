---
title: Vector index size limit
titleSuffix: Azure AI Search
description: Explanation of the factors affecting the size of a vector index.

author: robertklee
ms.author: robertlee
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/07/2023
---

# Vector index size limit

When you index documents with vector fields, Azure AI Search constructs internal vector indexes using the algorithm parameters that you specified for the field. Because Azure AI Search imposes limits on vector index size, it's important that you know how to retrieve metrics about the vector index size, and how to estimate the vector index size requirements for your use case.

## Key points about vector size limits

The size of vector indexes is measured in bytes. The size constraints are based on memory reserved for vector search, but also have implications for storage at the service level. Size constraints vary by service tier (or SKU).

The service enforces a vector index size quota **based on the number of partitions** in your search service, where the quota per partition varies by tier and also by service creation date (see [Vector index size limits](search-limits-quotas-capacity.md#vector-index-size-limits) in service limits). 

Each extra partition that you add to your service increases the available vector index size quota. This quota is a hard limit to ensure your service remains healthy. It also means that if vector size exceeds this limit, any further indexing requests will result in failure. You can resume indexing once you free up available quota by either deleting some vector documents or by scaling up in partitions.

The following limits are for newer search services created *after July 1, 2023*. For more information, including limits for older search services, see [Search service limits](search-limits-quotas-capacity.md). 

| Tier   | Storage (GB) |Partitions | Vector quota per partition (GB) | Vector quota per service (GB) |
| ----- | ------------- | ----------|-------------------------- | ---------------------------- |
| Basic | 2             | 1         | 1                         | 1                |
| S1    | 25            | 12        | 3                         | 36               |
| S2    | 100           | 12        |12                         | 144              |
| S3    | 200           | 12        |36                         | 432              |
| L1    | 1,000         | 12        |12                         | 144              |
| L2    | 2,000         | 12        |36                         | 432              |

**Key points**:

+ Storage quota is the physical storage available to the search service for all search data. Basic has one partition sized at 2 GB that must accommodate all of the data on the service. S1 can have 12 partitions sized at 25 GB each, for a maximum limit of 300 GB for all search data. 

+ Vector quotas for are the vector indexes created for each vector field, and they're enforced at the partition level. On Basic, the sum total of all vector fields can't be more than 1 GB because Basic only has one partition. On S1, which can have up to 12 partitions, the quota for vector data is 3 GB if you've only allocated one partition, or up to 36 GB if you've allocated 12 partitions. For more information about partitions and replicas, see [Estimate and manage capacity](search-capacity-planning.md).

## How to get vector index size

Use the REST APIs to return vector index size:

+ [GET Index Statistics](/rest/api/searchservice/2023-11-01/indexes/get-statistics) returns usage for a given index.

+ [GET Service Statistics](/rest/api/searchservice/2023-11-01/get-service-statistics/get-service-statistics) returns quota and usage for the search service all-up.

For a visual, here's the sample response for a Basic search service that has the quickstart vector search index. `storageSize` and `vectorIndexSize` are reported in bytes. 

```json
{
    "@odata.context": "https://my-demo.search.windows.net/$metadata#Microsoft.Azure.Search.V2023_11_01.IndexStatistics",
    "documentCount": 108,
    "storageSize": 5853396,
    "vectorIndexSize": 1342756
}
```

Return service statistics to compare usage against available quota at the service level:

```json
{
    "@odata.context": "https://my-demo.search.windows.net/$metadata#Microsoft.Azure.Search.V2023_11_01.ServiceStatistics",
    "counters": {
        "documentCount": {
            "usage": 15377,
            "quota": null
        },
        "indexesCount": {
            "usage": 13,
            "quota": 15
        },
        . . .
        "storageSize": {
            "usage": 39862913,
            "quota": 2147483648
        },
        . . .
        "vectorIndexSize": {
            "usage": 2685436,
            "quota": 1073741824
        }
    },
    "limits": {
        "maxFieldsPerIndex": 1000,
        "maxFieldNestingDepthPerIndex": 10,
        "maxComplexCollectionFieldsPerIndex": 40,
        "maxComplexObjectsInCollectionsPerDocument": 3000
    }
}
```

## Factors affecting vector index size

There are three major components that affect the size of your internal vector index:

- Raw size of the data
- Overhead from the selected algorithm
- Overhead from deleting or updating documents within the index

### Raw size of the data

Each vector is an array of single-precision floating-point numbers, in a field of type `Collection(Edm.Single)`. Currently, only single-precision floats are supported. 

Vector data structures require storage, represented in the following calculation as the "raw size" of your data. Use this _raw size_ to estimate the vector index size requirements of your vector fields.

The storage size of one vector is determined by its dimensionality. Multiply the size of one vector by the number of documents containing that vector field to obtain the _raw size_: 

`raw size = (number of documents) * (dimensions of vector field) * (size of data type)`

For `Edm.Single`, the size of the data type is 4 bytes.

### Memory Overhead from the Selected Algorithm  
  
Every approximate nearest neighbor (ANN) algorithm generates additional data structures in memory to enable efficient searching. These structures consume extra space within memory.  
  
**For the HNSW algorithm, the memory overhead ranges between 1% and 20%.**  
  
The memory overhead is lower for higher dimensions because the raw size of the vectors increases, while the extra data structures remain a fixed size since they store information on the connectivity within the graph. Consequently, the contribution of the extra data structures constitutes a smaller portion of the overall size.  
  
The memory overhead is higher for larger values of the HNSW parameter `m`, which determines the number of bi-directional links created for every new vector during index construction. This is because `m` contributes approximately 8 to 10 bytes per document multiplied by `m`.  
  
The following table summarizes the overhead percentages observed in internal tests:  
  
| Dimensions | HNSW Parameter (m) | Overhead Percentage |  
|-------------------|--------------------|---------------------|
| 96                | 4                  | 20%              |    
| 200               | 4                  | 8%               |  
| 768               | 4                  | 2%               |  
| 1536              | 4                  | 1%               |  

These results demonstrate the relationship between dimensions, HNSW parameter `m`, and memory overhead for the HNSW algorithm.  

### Overhead from deleting or updating documents within the index

When a document with a vector field is either deleted or updated (updates are internally represented as a delete and insert operation), the underlying document is marked as deleted and skipped during subsequent queries. As new documents are indexed and the internal vector index grows, the system cleans up these deleted documents and reclaims the resources. This means you'll likely observe a lag between deleting documents and the underlying resources being freed.

We refer to this as the "deleted documents ratio". Since the deleted documents ratio depends on the indexing characteristics of your service, there's no universal heuristic to estimate this parameter, and there's no API or script that returns the ratio in effect for your service. We observe that half of our customers have a deleted documents ratio less than 10%. If you tend to perform high-frequency deletions or updates, then you might observe a higher deleted documents ratio.

This is another factor impacting the size of your vector index. Unfortunately, we don't have a mechanism to surface your current deleted documents ratio.

## Estimating the total size for your data in memory

To estimate the total size of your vector index, use the following calculation:

**`(raw_size) * (1 + algorithm_overhead (in percent)) * (1 + deleted_docs_ratio (in percent))`**

For example, to calculate the **raw_size**, let's assume you're using a popular Azure OpenAI model, `text-embedding-ada-002` with 1,536 dimensions. This means one document would consume 1,536 `Edm.Single` (floats), or 6,144 bytes since each `Edm.Single` is 4 bytes. 1,000 documents with a single, 1,536-dimensional vector field would consume in total 1000 docs x 1536 floats/doc = 1,536,000 floats, or 6,144,000 bytes.

If you have multiple vector fields, you need to perform this calculation for each vector field within your index and add them all together. For example, 1,000 documents with **two** 1,536-dimensional vector fields, consume 1000 docs x **2 fields** x 1536 floats/doc x 4 bytes/float = 12,288,000 bytes. 

To obtain the **vector index size**, multiply this **raw_size** by the **algorithm overhead** and **deleted document ratio**. If your algorithm overhead for your chosen HNSW parameters is 10% and your deleted document ratio is 10%, then we get: `6.144 MB * (1 + 0.10) * (1 + 0.10) = 7.434 MB`.

## How vector fields affect disk storage

Disk storage overhead of vector data is roughly three times the size of vector index size.

### Storage vs. vector index size quotas

The storage and vector index size quotas aren't separate quotas. Vector indexes contribute to the [storage quota for the search service](search-limits-quotas-capacity.md#storage-limits) as a whole. For example, if your storage quota is exhausted but there's remaining vector quota, you can't index any more documents, regardless if they're vector documents, until you scale up in partitions to increase storage quota or delete documents (either text or vector) to reduce storage usage. Similarly, if vector quota is exhausted but there's remaining storage quota, further indexing attempts fail until vector quota is freed, either by deleting some vector documents or by scaling up in partitions.
