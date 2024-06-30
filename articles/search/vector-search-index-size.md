---
title: Vector index limits
titleSuffix: Azure AI Search
description: Explanation of the factors affecting the size of a vector index.

author: robertklee
ms.author: robertlee
ms.service: cognitive-search
ms.custom:
  - build-2024
ms.topic: conceptual
ms.date: 05/21/2024
---

# Vector index size and staying under limits

For each vector field, Azure AI Search constructs an internal vector index using the algorithm parameters specified on the field. Because Azure AI Search imposes quotas on vector index size, you should know how to estimate and monitor vector size to ensure you stay under the limits.

> [!NOTE]
> A note about terminology. Internally, the physical data structures of a search index include raw content (used for retrieval patterns requiring non-tokenized content), inverted indexes (used for searchable text fields), and vector indexes (used for searchable vector fields). This article explains the limits for the internal vector indexes that back each of your vector fields.

> [!TIP]
> [Vector quantization and storage configuration](vector-search-how-to-configure-compression-storage.md) is now in preview. Use capabilities like narrow data types, scalar quantization, and elimination of redundant storage to stay under vector quota and storage quota.

## Key points about quota and vector index size

+ Vector index size is measured in bytes.

+ Vector quotas are based on memory constraints. All searchable vector indexes must be loaded into memory. At the same time, there must also be sufficient memory for other runtime operations. Vector quotas exist to ensure that the overall system remains stable and balanced for all workloads.

+ Vector indexes are also subject to disk quota, in the sense that all indexes are subject disk quota. There's no separate disk quota for vector indexes.

+ Vector quotas are enforced on the search service as a whole, per partition, meaning that if you add partitions, vector quota goes up. Per-partition vector quotas are higher on newer services:

  + [Vector quota for services created after May 17, 2024](search-limits-quotas-capacity.md#vector-limits-on-services-created-after-may-17-2024)
  + [Vector quota for services between April 3, 2024 and May 17, 2024](search-limits-quotas-capacity.md#vector-limits-on-services-created-between-april-3-2024-and-may-17-2024)
  + [Vector quota for services created between July 1, 2023 and April 3, 2024](search-limits-quotas-capacity.md#vector-limits-on-services-created-between-july-1-2023-and-april-3-2024)
  + [Vector quota for services created before July 1, 2023](search-limits-quotas-capacity.md#vector-limits-on-services-created-before-july-1-2023)

## How to check partition size and quantity

If you aren't sure what your search service limits are, here are two ways to get that information:

+ In the Azure portal, in the search service **Overview** page, both the **Properties** tab and **Usage** tab show partition size and storage, and also vector quota and vector index size.

+ In the Azure portal, in the **Scale** page, you can review the number and size of partitions.

## How to check service creation date

Newer services created after April 3, 2024 offer five to ten times more vector storage as older ones at the same tier billing rate. If your service is older, consider creating a new service and migrating your content.

1. In Azure portal, open the resource group that contains your search service.

1. On the leftmost pane, under **Settings**, select **Deployments**.

1. Locate your search service deployment. If there are many deployments, use the filter to look for "search".

1. Select the deployment. If you have more than one, click through to see if it resolves to your search service.

    :::image type="content" source="media/vector-search-index-size/resource-group-deployments.png" alt-text="Screenshot of a filtered deployments list.":::

1. Expand deployment details. You should see *Created* and the creation date.

   :::image type="content" source="media/vector-search-index-size/deployment-details.png" alt-text="Screenshot of the deployment details showing creation date.":::

1. Now that you know the age of your search service, review the vector quota limits based on service creation:

   + [After May 17, 2024](search-limits-quotas-capacity.md#vector-limits-on-services-created-after-may-17-2024)
   + [Between April 3, 2024 and May 17, 2024](search-limits-quotas-capacity.md#vector-limits-on-services-created-between-april-3-2024-and-may-17-2024)
   + [Between July 1, 2023 and April 3, 2024](search-limits-quotas-capacity.md#vector-limits-on-services-created-between-july-1-2023-and-april-3-2024)
   + [Before July 1, 2023](search-limits-quotas-capacity.md#vector-limits-on-services-created-before-july-1-2023)

## How to get vector index size

A request for vector metrics is a data plane operation. You can use the Azure portal, REST APIs, or Azure SDKs to get vector usage at the service level through service statistics and for individual indexes.

### [**Portal**](#tab/portal-vector-quota)

Usage information can be found on the **Overview** page's **Usage** tab. Portal pages refresh every few minutes so if you recently updated an index, wait a bit before checking results.

The following screenshot is for an older Standard 1 (S1) search service, configured for one partition and one replica. 

+ Storage quota is a disk constraint, and it's inclusive of all indexes (vector and nonvector) on a search service.
+ Vector index size quota is a memory constraint. It's the amount of memory required to load all internal vector indexes created for each vector field on a search service. 

The screenshot indicates that indexes (vector and nonvector) consume almost 460 megabytes of available disk storage. Vector indexes consume almost 93 megabytes of memory at the service level. 

:::image type="content" source="media/vector-search-index-size/portal-vector-index-size.png" lightbox="media/vector-search-index-size/portal-vector-index-size.png" alt-text="Screenshot of the Overview page's usage tab showing vector index consumption against quota.":::

Quotas for both storage and vector index size increase or decrease as you add or remove partitions. If you change the partition count, the tile shows a corresponding change in storage and vector quota. 

> [!NOTE]
> On disk, vector indexes aren't 93 megabytes. Vector indexes on disk take up about three times more space than vector indexes in memory. See [How vector fields affect disk storage](#how-vector-fields-affect-disk-storage) for details.

### [**REST**](#tab/rest-vector-quota)

Use the following data plane REST APIs (version 2023-10-01-preview, 2023-11-01, and later) for vector usage statistics:

+ [GET Service Statistics](/rest/api/searchservice/get-service-statistics/get-service-statistics) returns quota and usage for the search service all-up. 
+ [GET Index Statistics](/rest/api/searchservice/indexes/get-statistics) returns usage for a given index.

Usage and quota are reported in bytes.

Here's GET Service Statistics:

```http
GET {{baseUrl}}/servicestats?api-version=2023-11-01  HTTP/1.1
    Content-Type: application/json
    api-key: {{apiKey}}
```

Response includes metrics for `storageSize`, which doesn't distinguish between vector and nonvector indexes. The `vectorIndexSize` statistic shows usage and quota at the service level.  

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

You can also send a GET Index Statistics to get the physical size of the index on disk, plus the in-memory size of the vector fields.

```http
GET {{baseUrl}}/indexes/vector-healthplan-idx/stats?api-version=2023-11-01  HTTP/1.1
    Content-Type: application/json
    api-key: {{apiKey}}
```

Response includes usage information at the index level. This example is based on the index created in the [integrated vectorization quickstart](search-get-started-portal-import-vectors.md) that chunks and vectorizes health plan PDFs. Each chunk contributes to `documentCount`.

```json
{
    "@odata.context": "https://my-demo.search.windows.net/$metadata#Microsoft.Azure.Search.V2023_11_01.IndexStatistics",
    "documentCount": 147,
    "storageSize": 4592870,
    "vectorIndexSize": 915484
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

| EDM data type | Size of the data type |
|---------------|-----------------------|
| `Collection(Edm.Single)` | 4 bytes |
| `Collection(Edm.Half)` | 2 bytes |
| `Collection(Edm.Int16)`| 2 bytes |
| `Collection(Edm.SByte)`| 1 byte |

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
| 3072              | 4                  | 0.5%             |

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

Most of this article provides information about the size of vectors in memory. If you want to know about vector size on disk, the disk consumption for vector data is roughly three times the size of the vector index in memory. For example, if your `vectorIndexSize` usage is at 100 megabytes (10 million bytes), you would have used least 300 megabytes of `storageSize` quota to accommodate your vector indexes.
