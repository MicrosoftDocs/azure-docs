---
title: Vector index limits
titleSuffix: Azure AI Search
description: Explanation of the factors affecting the size of a vector index.

author: robertklee
ms.author: robertlee
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 04/03/2024
---

# Vector index size and staying under vector limits

For each vector field, Azure AI Search constructs an internal vector index using the algorithm parameters specified on the field. Because Azure AI Search imposes quotas on vector index size, you should know how to estimate and monitor vector size to ensure you stay under the limits.

> [!NOTE]
> A note about terminology. Internally, the physical data structures of a search index include raw content (used for retrieval patterns requiring non-tokenized content), inverted indexes (used for searchable text fields), and vector indexes (used for searchable vector fields). This article exlains the limits for the physical vector indexes that back each of your vector fields. 

> [!TIP]
> [Vector quantization and storage configuration](vector-search-how-to-configure-compression-storage.md) is now in preview. You can use smaller data types, apply vector compression, and eliminate some storage requirements if you don't need the data.

## Key points about quota and vector index size

+ Vector index size is measured in bytes.

+ There's no quota at the search index level. Instead vector quotas are enforced at the partition level. Quota varies by service tier (or `SKU`) and the service creation date, with newer services having much higher quotas per partition.

  + [Vector quota for services created after April 3, 2024](search-limits-quotas-capacity.md#vector-limits-on-services-created-after-april-3-2024-in-supported-regions)
  + [Vector quota for services created between July 1, 2023 and April 3, 2024](search-limits-quotas-capacity.md#vector-limits-on-services-created-between-july-1-2023-and-april-3-2024)
  + [Vector quota for services created before July 1, 2023](search-limits-quotas-capacity.md#vector-limits-on-services-created-before-july-1-2023)

+ Vector quotas are primarily designed around memory constraints. All searchable vector indexes must be loaded into memory. At the same time, there must also be sufficient memory for other runtime operations. Vector quotas exist to ensure that the overall system remains stable and balanced for all workloads.

+ Vector quotas are expressed in terms of physical storage, and physical storage is contingent upon partition size and quantity. Each tier offers increasingly powerful and larger partitions. Higher tiers and more partitions give you more vector quota to work with. In [service limits](search-limits-quotas-capacity.md#service-limits), maximum vector quotas are based on the maximum amount of physical space that all vector indexes can consume collectively, assuming all partitions are in use for that service.

  For example, on new services in a supported region, the sum total of all vector indexes on a Basic search service can't be more than 15 GB because Basic can have up to three partitions (5-GB quota per partition). On S1, which can have up to 12 partitions, the quota for vector data is 35 GB per partition, or up to 160 GB if you allocate all 12 partitions.

<!-- The size of vector indexes is measured in bytes. The size constraints are based on memory reserved for vector search, but also have implications for storage at the service level. Size constraints vary by service tier (or SKU).

The service enforces a vector index size quota **based on the number of partitions** in your search service, where the quota per partition varies by tier and also by service creation date (see [Vector index size](search-limits-quotas-capacity.md#vector-index-size-limits) in service limits). 

Each extra partition that you add to your service increases the available vector index size quota. This quota is a hard limit to ensure your service remains healthy. It also means that if vector size exceeds this limit, any further indexing requests result in failure. You can resume indexing once you free up available quota by either deleting some vector documents or by scaling up in partitions.

### Vector limits for services created after April 3, 2024

Higher vector limits exist for new services [in supported regions](search-create-service-portal.md#choose-a-region).

| Tier   | Partitions | Partition size (GB) | Vector quota per partition (GB) | Approx. floats per partition (assuming 15% overhead) |
| ----- | ------------| -----------------  | ------------------------------------------ | ---------------------------- |
| Basic | 3           | 15                  | 5                                          | 1,100 million              |
| S1    | 12          | 160                 | 35                                         | 8,200 million              |
| S2    | 12          | 350                 | 100                                        | 23,500 million             |
| S3    | 12          | 700                 | 200                                        | 47,000 million             |
| L1    | 12          | 1,000               | 12                                         | 2,800 million              |
| L2    | 12          | 2,000               | 36                                         | 8,400 million              |

L1 and L2 currently have the same quota as services created after July 1, 2023.

### Vector limits for services created between July 1, 2023 and April 3, 2024

The following table shows vector quotas by partition, and by service if all partitions are in use. This table is for search services created *after July 1, 2023*. For more information, including limits for older search services and also limits on the approximate number of embeddings per partition, see [Search service limits](search-limits-quotas-capacity.md). 

| Tier  | Partitions | Partition size (GB)  | Vector quota per partition (GB) | Vector quota per service (GB) |
| ----- | ---------- | --------------|-------------------------- | ----------------------------------- |
| Basic | 1          | 2             | 1                         | 1                |
| S1    | 12         | 25            | 3                         | 36               |
| S2    | 12         | 100           | 12                        | 144              |
| S3    | 12         | 200           | 36                        | 432              |
| L1    | 12         | 1,000         | 12                        | 144              |
| L2    | 12         | 2,000         | 36                        | 432              |

**Key points**:

+ Overall storage is a product of the number of partitions you provision multiplied by partition size. Basic has one partition sized at 2 GB that must accommodate all of the data on the service. S1 can have up to 12 partitions, sized at 25 GB each, for a maximum limit of 300 GB for all search data. 

+ Vector quotas for are the vector indexes created for each vector field, and they're enforced at the partition level. On Basic, the sum total of all vector fields can't be more than 1 GB because Basic only has one partition. On S1, which can have up to 12 partitions, the quota for vector data is 3 GB if you allocate just one partition, or up to 36 GB if you allocate all 12 partitions. For more information about partitions and replicas, see [Estimate and manage capacity](search-capacity-planning.md). -->

## How to check partition size and quantity

If you aren't sure what your search service limits are, here are two ways to get that information:

+ In the Azure portal, in the search service **Overview** page, both the **Properties** tab and **Usage** tab show partition size and storage, and also vector quota and vector index size.

+ In the Azure portal, in the **Scale** page, you can review the number and size of partitions.

## How to check service creation date

Newer services created after April 3, 2024 offer five to ten times more vector storage as older ones at the same tier. If your service is older, consider creating a new service and migrating your content.

1. In Azure portal, open the resource group that contains your search service.

1. On the leftmost pane, under **Settings**, select **Deployments**.

1. Locate your search service deployment. If there are many deployments, use the filter to look for "search".

1. Select the deployment. If you have more than one, click through to see if it resolves to your search service.

    :::image type="content" source="media/vector-search-index-size/resource-group-deployments.png" alt-text="Screenshot of a filtered deployments list.":::

1. Expand deployment details. You should see *Created* and the creation date.

   :::image type="content" source="media/vector-search-index-size/deployment-details.png" alt-text="Screenshot of the deployment details showing creation date.":::

1. Now that you know the age of your search service, review the vector quota limits based on service creation:

   + [Before July 1, 2023](search-limits-quotas-capacity.md#vector-limits-on-services-created-before-july-1-2023)
   + [After July 1, 2023](search-limits-quotas-capacity.md#vector-limits-on-services-created-between-july-1-2023-and-april-3-2024)
   + [After April 3, 2024](search-limits-quotas-capacity.md#vector-limits-on-services-created-after-april-3-2024-in-supported-regions)

## How to get vector index size

A request for vector metrics is a data plane operation. You can use the Azure portal, REST APIs, or Azure SDKs to get vector usage at the service level through service statistics and for individual indexes.

### [**Portal**](#tab/portal-vector-quota)

Usage information can be found on the **Overview** page's **Usage** tab. Portal pages refresh every few minutes so if you recently updated an index, wait a bit before checking results.

The following screenshot is for a Standard 1 (S1) tier, configured for one partition and one replica. Vector index quota, measured in megabytes, refers to the internal vector indexes created for each vector field. Overall, indexes consume almost 460 megabytes of available storage, but the vector index component takes up just 93 megabytes of the 460 used on this search service.

:::image type="content" source="media/vector-search-index-size/portal-vector-index-size.png" lightbox="media/vector-search-index-size/portal-vector-index-size.png" alt-text="Screenshot of the Overview page's usage tab showing vector index consumption against quota.":::

The tile on the Usage tab tracks vector index consumption at the search service level. If you increase or decrease search service capacity, the tile reflects the changes accordingly.

### [**REST**](#tab/rest-vector-quota)

Use the following data plane REST APIs (version 2023-10-01-preview, 2023-11-01, and later) for vector usage statistics:

+ [GET Index Statistics](/rest/api/searchservice/indexes/get-statistics) returns usage for a given index.
+ [GET Service Statistics](/rest/api/searchservice/get-service-statistics/get-service-statistics) returns quota and usage for the search service all-up.

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

---

## Factors affecting vector index size

There are three major components that affect the size of your internal vector index:

- Raw size of the data
- Overhead from the selected algorithm
- Overhead from deleting or updating documents within the index

### Raw size of the data

Each vector is usually an array of single-precision floating-point numbers, in a field of type `Collection(Edm.Single)`.  

Vector data structures require storage, represented in the following calculation as the "raw size" of your data. Use this _raw size_ to estimate the vector index size requirements of your vector fields.

The storage size of one vector is determined by its dimensionality. Multiply the size of one vector by the number of documents containing that vector field to obtain the _raw size_: 

`raw size = (number of documents) * (dimensions of vector field) * (size of data type)`

For `Edm.Single`, the size of the data type is 4 bytes. For `Collection(Edm.Single)`, the size of the data type is 4 bytes. For `Collection(Edm.Half)` and `Collection(Edm.Int16)`, the size of the data type is 2 bytes. For `Collection(Edm.SByte)`, the data type is 1 byte.

### Memory overhead from the selected algorithm  
  
Every approximate nearest neighbor (ANN) algorithm generates extra data structures in memory to enable efficient searching. These structures consume extra space within memory.  
  
**For the HNSW algorithm, the memory overhead ranges between 1% and 20%.**  
  
The memory overhead is lower for higher dimensions because the raw size of the vectors increases, while the extra data structures remain a fixed size since they store information on the connectivity within the graph. Consequently, the contribution of the extra data structures constitutes a smaller portion of the overall size.  
  
The memory overhead is higher for larger values of the HNSW parameter `m`, which determines the number of bi-directional links created for every new vector during index construction. This is because `m` contributes approximately 8 bytes to 10 bytes per document multiplied by `m`.  
  
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

We refer to this as the *deleted documents ratio*. Since the deleted documents ratio depends on the indexing characteristics of your service, there's no universal heuristic to estimate this parameter, and there's no API or script that returns the ratio in effect for your service. We observe that half of our customers have a deleted documents ratio less than 10%. If you tend to perform high-frequency deletions or updates, then you might observe a higher deleted documents ratio.

This is another factor impacting the size of your vector index. Unfortunately, we don't have a mechanism to surface your current deleted documents ratio.

## Estimating the total size for your data in memory

Taking the previously described factors into account, to estimate the total size of your vector index, use the following calculation:

**`(raw_size) * (1 + algorithm_overhead (in percent)) * (1 + deleted_docs_ratio (in percent))`**

For example, to calculate the **raw_size**, let's assume you're using a popular Azure OpenAI model, `text-embedding-ada-002` with 1,536 dimensions. This means one document would consume 1,536 `Edm.Single` (floats), or 6,144 bytes since each `Edm.Single` is 4 bytes. 1,000 documents with a single, 1,536-dimensional vector field would consume in total 1000 docs x 1536 floats/doc = 1,536,000 floats, or 6,144,000 bytes.

If you have multiple vector fields, you need to perform this calculation for each vector field within your index and add them all together. For example, 1,000 documents with **two** 1,536-dimensional vector fields, consume 1000 docs x **2 fields** x 1536 floats/doc x 4 bytes/float = 12,288,000 bytes. 

To obtain the **vector index size**, multiply this **raw_size** by the **algorithm overhead** and **deleted document ratio**. If your algorithm overhead for your chosen HNSW parameters is 10% and your deleted document ratio is 10%, then we get: `6.144 MB * (1 + 0.10) * (1 + 0.10) = 7.434 MB`.

## How vector fields affect disk storage

Disk storage overhead of vector data is roughly three times the size of vector index size.

### Storage vs. vector index size quotas

Service storage and vector index size quotas aren't separate quotas. Vector indexes contribute to the [storage quota for the search service](search-limits-quotas-capacity.md#service-limits) as a whole. For example, if your storage quota is exhausted but there's remaining vector quota, you can't index any more documents, regardless if they're vector documents, until you scale up in partitions to increase storage quota or delete documents (either text or vector) to reduce storage usage. Similarly, if vector quota is exhausted but there's remaining storage quota, further indexing attempts fail until vector quota is freed, either by deleting some vector documents or by scaling up in partitions.
