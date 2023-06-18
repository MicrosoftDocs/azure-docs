---
title: Vector index size documentation
titleSuffix: Azure Cognitive Search
description: Explanation of the factors affecting the size of a vector index.

author: robertklee
ms.author: robertlee
ms.service: cognitive-search
ms.topic: how-to
ms.date: 06/29/2023
---

# Vector index size

When you index documents with vector fields, we construct internal vector indexes and use the algorithm parameters you provide. The size of these vector indexes are restricted by the available memory for your SKU that's reserved for vector search.

We enforce a vector index size quota **for every partition** in your search service. This is a hard limit to ensure your service remains healthy, which means that further indexing attempts once the limit is exceeded will fail. You may resume indexing once you free up available quota by either deleting some vector documents or by scaling up in partitions.

## Factors affecting vector index size

There are three major components that affect the size of your internal vector index:

1. Raw size of the data
1. Overhead from the selected algorithm
1. Overhead from deleting or updating documents within the index

### Raw size of the data

Each vector is a data structure, commonly an array, where each element has a primitive data type, commonly single- or double-precision floating-point numbers. These data structures require physical disk space to store. In this article, we'll refer to this as the **"raw size"** of your data. This will form the basis for estimating the size requirements of your vector documents.

The size of one vector is affected by the dimensionality, also known as the length of the array. Each element of the array requires a fixed number of bytes on disk. Multiply the size of one vector by the number of documents containing that vector field to obtain the _raw size_.

**To estimate the vector index size for your vector data**, first calculate the _raw size_ of the vectors on disk using this formula for **each vector field**: `(number of documents) * (dimensions of vector field) * (size of data type)`. For `Edm.Single`, the data type is single-precision floats (4 bytes).

### Overhead from the selected algorithm

Each approximate-nearest-neighbor algorithm creates additional data structures in memory to enable efficient searching. These consume additional space within memory. 

For HNSW algorithm, this overhead is between 10% to 20%. This overhead increases with larger values of the HNSW parameter `m`, which sets the number of bi-directional links created for every new vector during index construction.

### Overhead from deleting or updating documents within the index

When a vector document is either deleted or updated (updates are internally represented as a delete and insert operation), the underlying document is marked as deleted and skipped during subsequent queries. As new documents are indexed and the vector index grows, the system cleans up these deleted documents and reclaims the resources. This means that there may be a lag between deleting documents and the underlying resources being freed. 

We refer to this as the "deleted documents ratio". Since the deleted documents ratio depends on the indexing characteristics of your service, there's no universal heuristic to estimate this parameter. We observe that half of our customers have a deleted documents ratio less than 10%.

This is another factor impacting the size of your vector index.

### Estimating the total size for your data

To estimate the total size of your vector index, use the following calculation:

**(raw_size) * (1 + algorithm_overhead) * (1 + deleted_docs_ratio)**

For example, using the most popular Azure OpenAI model, `text-embedding-ada-002` with 1,536 dimensions means one document would consume 1,536 Edm.Singles, or 6,144 bytes since each single-precision floating point number is 4 bytes. 100 documents with a single, 1,536-dimensional vector field would consume in total 100 docs x 1536 floats/doc = 153,600 floats, or 614,400 bytes. 1,000 documents with two 768-dimensional vector fields, consume 1000 docs x 2 fields x 768 floats/doc = 1,536,000 floats, or 6,144,000 bytes. This is the **raw_size**.

We'll multiply by a HNSW algorithm overhead of 10% and a deleted document ratio of 10%: `6.144 MB * (1 + 0.10) * (1 + 0.10) = 7.434 MB`.

## Storage vs. vector index size quotas

The storage and vector index size quotas are not separate quotas; vector indexes consume the same underlying storage quota. For example, if your storage quota is exhausted but there is remaining vector quota, you won't be able to index any more documents, regardless if they're vector documents, until you scale up in partitions to increase storage quota or delete documents (either text or vector) to reduce storage usage. Similarly, if vector quota is exhausted but there is remaining storage quota, further indexing attempts will fail until vector quota is freed, either by deleting some vector documents or by scaling up in partitions.