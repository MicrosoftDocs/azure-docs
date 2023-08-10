---
title: Vector index size limit
titleSuffix: Azure Cognitive Search
description: Explanation of the factors affecting the size of a vector index.

author: robertklee
ms.author: robertlee
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 07/07/2023
---

# Vector index size limit

> [!IMPORTANT]
> Vector search is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). It's available through the Azure portal, preview REST API, and [beta client libraries](https://github.com/Azure/cognitive-search-vector-pr#readme).

When you index documents with vector fields, Azure Cognitive Search constructs internal vector indexes using the algorithm parameters that you specified for the field. Because Cognitive Search imposes limits on vector index size, it's important that you know how to retrieve metrics about the vector index size, and how to estimate the vector index size requirements for your use case.

## Key points about vector size limits

The size of vector indexes is measured in bytes. The size constraints are based on memory reserved for vector search, but also have implications for storage at the service level. Size constraints vary by service tier (or SKU).

The service enforces a vector index size quota **based on the number of partitions** in your search service, where the quota per partition varies by tier and also by service creation date (see [Vector index size limits](search-limits-quotas-capacity.md#vector-index-size-limits) in service limits). 

Each extra partition that you add to your service increases the available vector index size quota. This quota is a hard limit to ensure your service remains healthy. It also means that if vector size exceeds this limit, any further indexing requests will result in failure. You can resume indexing once you free up available quota by either deleting some vector documents or by scaling up in partitions.

## How to get vector index size

Use the preview REST APIs to return vector index size:

+ [GET Index Statistics](/rest/api/searchservice/preview-api/get-index-statistics) returns quota and usage for a given index.

+ [GET Service Statistics](/rest/api/searchservice/preview-api/get-service-statistics) returns quota and usage for the search service all-up.

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

### Overhead from the selected algorithm

Each approximate-nearest-neighbor algorithm creates other data structures in memory to enable efficient searching. These consume extra space within memory. 

**For HNSW algorithm, this overhead is between 5% to 20%.** 

Overhead is lower for higher dimensions because the raw size of the vectors is larger, but the extra data structures remain a fixed size since they store information on connectivity within the graph. As a result, the contribution of the extra data structures makes up a smaller portion of the overall size. 

Overhead is higher for larger values of the HNSW parameter `m`, which sets the number of bi-directional links created for every new vector during index construction. (The reason is because _m_ contributes roughly _m times 8 to 10_ bytes per document.)

Based on internal tests, a model with _m=4_ and _dims=96_ has an overhead of ~17%, and a model with _m=4_ and _dims=768_ has an overhead of ~5%.

### Overhead from deleting or updating documents within the index

When a document with a vector field is either deleted or updated (updates are internally represented as a delete and insert operation), the underlying document is marked as deleted and skipped during subsequent queries. As new documents are indexed and the internal vector index grows, the system cleans up these deleted documents and reclaims the resources. This means you'll likely observe a lag between deleting documents and the underlying resources being freed.

We refer to this as the "deleted documents ratio". Since the deleted documents ratio depends on the indexing characteristics of your service, there's no universal heuristic to estimate this parameter, and there's no API or script that returns the ratio in effect for your service. We observe that half of our customers have a deleted documents ratio less than 10%. If you tend to perform high-frequency deletions or updates, then you may observe a higher deleted documents ratio.

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