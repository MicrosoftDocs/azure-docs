---
title: Reduce vector size
titleSuffix: Azure AI Search
description: Configure vector compression options and vector storage using narrow data types, built-in scalar or quantization, and storage options.

author: heidisteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 08/14/2024
---

# Reduce vector size through quantization, narrow data types, and storage options

This article explains how to use vector quantization and other techniques for reducing vector size in Azure AI Search. The search index specifies vector field definitions, including properties for stored and narrow data types. Quantization is also specified in the index and assigned to vector field through its vector profile. 

These features are generally available in [2024-07-01 REST API](/rest/api/searchservice/operation-groups?view=rest-searchservice-2024-07-01&preserve-view=true) and in the Azure SDK packages targeting that version. [An example](#example-vector-compression-techniques) at the end of this article shows the variations in vector size for each of the approaches described in this article.

## Evaluate the options

As a first step, review the three approaches for reducing the amount of storage used by vector fields. These approaches aren't mutually exclusive and can be combined for [maximum reduction in vector size](#example-vector-compression-techniques).

We recommend built-in quantization because it compresses vector size in memory *and* on disk with minimal effort, and that tends to provide the most benefit in most scenarios. In contrast, narrow types (except for float16) require a special effort into making them, and `stored` saves on disk storage, which isn't as expensive as memory.

| Approach | Why use this option |
|----------|---------------------|
| [Add scalar or binary quantization](#option-1-configure-quantization) | Use quantization to compress native float32 or float16  embeddings to  int8  (scalar) or Byte (binary). This option reduces storage in memory and on disk with no degradation of query performance. Smaller data types like int8 or Byte produce vector indexes that are less content-rich than those with larger embeddings. To offset information loss, built-in compression includes options for post-query processing using uncompressed embeddings and oversampling to return more relevant results. Reranking and oversampling are specific features of built-in quantization of float32 or float16 fields and can't be used on embeddings that undergo custom quantization. |
| [Assign smaller primitive data types to vector fields](#option-2-assign-narrow-data-types-to-vector-fields) | Narrow data types, such as float16, int16,  int8, and Byte (binary) consume less space in memory and on disk, but you must have an embedding model that outputs vectors in a narrow data format. Or, you must have custom quantization logic that outputs small data. A third use case that requires less effort is recasting native float32 embeddings produced by most models to float16. See [Index binary vectors](vector-search-how-to-index-binary-data.md) for details about binary vectors. |
| [Eliminate optional storage of retrievable vectors](#option-3-set-the-stored-property-to-remove-retrievable-storage) | Vectors returned in a query response are stored separately from vectors used during query execution. If you don't need to return vectors, you can turn off retrievable storage, reducing overall per-field disk storage by up to 50 percent. |

All of these options are defined on an empty index. To implement any of them, use the Azure portal, REST APIs, or an Azure SDK package targeting that API version.

After the index is defined, you can load and index documents as a separate step.

## Option 1: Configure quantization

Quantization is recommended for reducing vector size because it lowers both memory and disk storage requirements for float16 and float32 embeddings. To offset the effects of a smaller index, you can add oversampling and reranking over uncompressed vectors.

Quantization applies to vector fields receiving float-type vectors. In the examples in this article, the field's data type is `Collection(Edm.Single)` for incoming float32 embeddings, but float16 is also supported. When the vectors are received on a field with compression configured, the engine automatically performs quantization to reduce the footprint of the vector data in memory and on disk. 

Two types of quantization are supported:

- Scalar quantization compresses float values into narrower data types. AI Search currently supports int8, which is 8 bits, reducing vector index size fourfold.

- Binary quantization converts floats into binary bits, which takes up 1 bit. This results in up to 28 times reduced vector index size.

To use built-in quantization, follow these steps:

> [!div class="checklist"]
> - Use [Create Index](/rest/api/searchservice/indexes/create) or [Create Or Update Index](/rest/api/searchservice/indexes/create-or-update) to specify vector compression 
> - Add `vectorSearch.compressions` to a search index
> - Add a `scalarQuantization` or `binaryQuantization` configuration and give it a name
> - Set optional properties to mitigate the effects of lossy indexing
> - Create a new vector profile that uses the named configuration
> - Create a new vector field having the new vector profile
> - Load the index with float32 or float16 data that's quantized during indexing with the configuration you defined
> - Optionally, [query quantized data](#query-a-quantized-vector-field-using-oversampling) using the oversampling parameter if you want to override the default

### Add "compressions" to a search index

The following example shows a partial index definition with a fields collection that includes a vector field, and a `vectorSearch.compressions` section. 

This example includes both `scalarQuantization` or `binaryQuantization`. You can specify as many compression configurations as you need, and then assign the ones you want to a vector profile.

```http
POST https://[servicename].search.windows.net/indexes?api-version=2024-07-01

{
  "name": "my-index",
  "fields": [
    { "name": "Id", "type": "Edm.String", "key": true, "retrievable": true, "searchable": true, "filterable": true },
    { "name": "content", "type": "Edm.String", "retrievable": true, "searchable": true },
    { "name": "vectorContent", "type": "Collection(Edm.Single)", "retrievable": false, "searchable": true },
  ],
  "vectorSearch": {
        "profiles": [ ],
        "algorithms": [ ],
        "compressions": [
          {
            "name": "use-scalar",
            "kind": "scalarQuantization",
            "scalarQuantizationParameters": {
              "quantizedDataType": "int8"
            },
            "rerankWithOriginalVectors": true,
            "defaultOversampling": 10
          },
          {
            "name": "use-binary",
            "kind": "binaryQuantization",
            "rerankWithOriginalVectors": true,
            "defaultOversampling": 10
          }
        ]
    }
}
```

**Key points**:

- `kind` must be set to `scalarQuantization` or `binaryQuantization`

- `rerankWithOriginalVectors` uses the original, uncompressed vectors to recalculate similarity and rerank the top results returned by the initial search query. The uncompressed vectors exist in the search index even if `stored` is false. This property is optional. Default is true.

- `defaultOversampling` considers a broader set of potential results to offset the reduction in information from quantization. The formula for potential results consists of the `k` in the query, with an oversampling multiplier. For example, if the query specifies a `k` of 5, and oversampling is 20, then the query effectively requests 100 documents for use in reranking, using the original uncompressed vector for that purpose. Only the top `k` reranked results are returned. This property is optional. Default is 4.

- `quantizedDataType` is optional and applies to scalar quantization only. If you add it, it must be set to `int8`. This is the only primitive data type supported for scalar quantization at this time. Default is `int8`.

### Add the HNSW algorithm

Make sure your index has the Hierarchical Navigable Small Worlds (HNSW) algorithm. Built-in quantization isn't supported with exhaustive KNN.

   ```json
   "vectorSearch": {
       "profiles": [ ],
       "algorithms": [
         {
             "name": "use-hnsw",
             "kind": "hnsw",
             "hnswParameters": {
                 "m": 4,
                 "efConstruction": 400,
                 "efSearch": 500,
                 "metric": "cosine"
             }
         }
       ],
        "compressions": [ <see previous section>] 
   }
   ```

### Create and assign a new vector profile

To use a new quantization configuration, you must create a *new* vector profile. Creation of a new vector profile is necessary for building compressed indexes in memory. Your new profile uses HNSW.

1. In the same index definition, create a new vector profile and add a compression property and an algorithm. Here are two profiles, one for each quantization approach.

   ```json
   "vectorSearch": {
       "profiles": [
          {
             "name": "vector-profile-hnsw-scalar",
             "compression": "use-scalar", 
             "algorithm": "use-hnsw",
             "vectorizer": null
          },
          {
             "name": "vector-profile-hnsw-binary",
             "compression": "use-binary", 
             "algorithm": "use-hnsw",
             "vectorizer": null
          }
        ],
        "algorithms": [  <see previous section> ],
        "compressions": [ <see previous section> ] 
   }
   ```

1. Assign a vector profile to a *new* vector field. The data type of the field is either float32 or float16. 

   In Azure AI Search, the Entity Data Model (EDM) equivalents of float32 and float16 types are `Collection(Edm.Single)` and `Collection(Edm.Half)`, respectively. 

   ```json
   {
      "name": "vectorContent",
      "type": "Collection(Edm.Single)",
      "searchable": true,
      "retrievable": true,
      "dimensions": 1536,
      "vectorSearchProfile": "vector-profile-hnsw-scalar",
   }
   ```

1. [Load the index](search-what-is-data-import.md) using indexers for pull model indexing, or APIs for push model indexing.

### How scalar quantization works in Azure AI Search

Scalar quantization reduces the resolution of each number within each vector embedding. Instead of describing each number as a 16-bit or 32-bit floating point number, it uses an 8-bit integer. It identifies a range of numbers (typically 99th percentile minimum and maximum) and divides them into a finite number of levels or bin, assigning each bin an identifier. In 8-bit scalar quantization, there are 2^8, or 256, possible bins.

Each component of the vector is mapped to the closest representative value within this set of quantization levels in a process akin to rounding a real number to the nearest integer. In the quantized 8-bit vector, the identifier number stands in place of the original value. After quantization, each vector is represented by an array of identifiers for the bins to which its components belong. These quantized vectors require much fewer bits to store compared to the original vector, thus reducing storage requirements and memory footprint. 

### How  binary quantization works in Azure AI Search

Binary quantization compresses high-dimensional vectors by representing each component as a single bit, either 0 or 1. This method drastically reduces the memory footprint and accelerates vector comparison operations, which are crucial for search and retrieval tasks. Benchmark tests show up to 96% reduction in vector index size.

It's particularly effective for embeddings with dimensions greater than 1024. For smaller dimensions, we recommend testing the quality of binary quantization, or trying scalar instead. Additionally, we’ve found BQ performs very well when embeddings are centered around zero. Most popular embedding models such as OpenAI, Cohere, and Mistral are centered around zero. 

## Option 2: Assign narrow data types to vector fields

An easy way to reduce vector size is to store embeddings in a smaller data format. Most embedding models output 32-bit floating point numbers, but if you quantize your vectors, or if your embedding model supports it natively, output might be float16, int16, or int8, which is significantly smaller than float32. You can accommodate these smaller vector sizes by assigning a narrow data type to a vector field. In the vector index, narrow data types consume less storage.

1. Review the [data types used for vector fields](/rest/api/searchservice/supported-data-types#edm-data-types-for-vector-fields) for recommended usage:

   - `Collection(Edm.Single)` 32-bit floating point (default)
   - `Collection(Edm.Half)` 16-bit floating point (narrow)
   - `Collection(Edm.Int16)` 16-bit signed integer (narrow)
   - `Collection(Edm.SByte)` 8-bit signed integer (narrow)
   - `Collection(Edm.Byte)` 8-bit unsigned integer (only allowed with packed binary data types)

1. From that list, determine which data type is valid for your embedding model's output, or for vectors that undergo custom quantization.

   The following table provides links to several embedding models that can use a narrow data type (`Collection(Edm.Half)`) without extra quantization. You can cast from float32 to float16 (using `Collection(Edm.Half)`) with no extra work.

   | Embedding model        | Native output | Assign this type in Azure AI Search |
   |------------------------|---------------|--------------------------------|
   | [text-embedding-ada-002](/azure/ai-services/openai/concepts/models#embeddings) | `Float32` | `Collection(Edm.Single)` or `Collection(Edm.Half)` |
   | [text-embedding-3-small](/azure/ai-services/openai/concepts/models#embeddings) | `Float32` | `Collection(Edm.Single)` or `Collection(Edm.Half)` |
   | [text-embedding-3-large](/azure/ai-services/openai/concepts/models#embeddings) | `Float32` | `Collection(Edm.Single)` or `Collection(Edm.Half)` |
   | [Cohere V3 embedding models with int8 embedding_type](https://docs.cohere.com/reference/embed) | `Int8` | `Collection(Edm.SByte)` |

   Other narrow data types can be used if your model emits embeddings in the smaller data format, or if you have custom quantization that converts vectors to a smaller format.

1. Make sure you understand the tradeoffs of a narrow data type. `Collection(Edm.Half)` has less information, which results in lower resolution. If your data is homogenous or dense, losing extra detail or nuance could lead to unacceptable results at query time because there's less detail that can be used to distinguish nearby vectors apart.

1. [Define and build the index](vector-search-how-to-create-index.md). You can use the Azure portal, [Create or Update Index (REST API)](/rest/api/searchservice/indexes/create-or-update), or an Azure SDK package for this step.

1. Check the results. Assuming the vector field is marked as retrievable, use [Search explorer](search-explorer.md) or [Search - POST](/rest/api/searchservice/documents/search-post?) to verify the field content matches the data type.

   To check vector index size, use the Azure portal or the [GET Statistics (REST API)](/rest/api/searchservice/indexes/get-statistics).

<!-- 
   Evidence of choosing the wrong data type, for example choosing `int8` for a `float32` embedding, is a field that's indexed as an array of zeros. If you encounter this problem, start over. -->

> [!NOTE]
> The field's data type is used to create the physical data structure. If you want to change a data type later, either drop and rebuild the index, or create a second field with the new definition.

## Option 3: Set the `stored` property to remove retrievable storage

The `stored` property is a boolean on a vector field definition that determines whether storage is allocated for retrievable vector field content. The `stored` property is true by default. If you don't need vector content in a query response, you can save up to 50 percent storage per field by setting `stored` to false.

Considerations for setting `stored` to false:

- Because vectors aren't human readable, you can omit them from results sent to LLMs in RAG scenarios, and from results that are rendered on a search page. Keep them, however, if you're using vectors in a downstream process that consumes vector content.

- However, if your indexing strategy includes [partial document updates](search-howto-reindex.md#update-content), such as "merge" or "mergeOrUpload" on a document, be aware that setting `stored` to false blocks updates to any vector fields. On each "merge" or "mergeOrUpload" operation, you must provide vector fields in addition to other nonvector fields that you're updating, or the vector will be dropped. 

Remember that the `stored` attribution is irreversible. It's set during index creation on vector fields when physical data structures are created. If you want retrievable vector content later, you must drop and rebuild the index, or create and load a new field that has the new attribution.

The following example shows the fields collection of a search index. Set `stored` to false to permanently remove retrievable storage for the vector field.

   ```http
   PUT https://[service-name].search.windows.net/indexes/demo-index?api-version=2024-07-01 
      Content-Type: application/json  
      api-key: [admin key]  
    
        { 
          "name": "demo-index", 
          "fields": [ 
            { 
              "name": "vectorContent", 
              "type": "Collection(Edm.Single)", 
              "retrievable": false, 
              "stored": false, 
              "dimensions": 1536, 
              "vectorSearchProfile": "vectorProfile" 
            } 
          ] 
        } 
   ```

**Key points**:

- Applies to [vector fields](/rest/api/searchservice/supported-data-types#edm-data-types-for-vector-fields) only.

- Affects storage on disk, not memory, and it has no effect on queries. Query execution uses a separate vector index that's unaffected by the `stored` property.

- The `stored` property is set during index creation on vector fields and is irreversible. If you want retrievable content later, you must drop and rebuild the index, or create and load a new field that has the new attribution.

- Defaults are `stored` set to true and `retrievable` set to false. In a default configuration, a retrievable copy is stored, but it's not automatically returned in results. When `stored` is true, you can toggle `retrievable` between true and false at any time without having to rebuild an index. When `stored` is false, `retrievable` must be false and can't be changed.

## Example: vector compression techniques

Here's Python code that demonstrates quantization, narrow data types, and use of the stored property: [Code sample: Vector quantization and storage options using Python](https://github.com/Azure/azure-search-vector-samples/blob/main/demo-python/code/vector-quantization-and-storage/README.md). 

This code creates and compares storage and vector index size for each option:

```bash
****************************************
Index Name: compressiontest-baseline
Storage Size: 21.3613MB
Vector Size: 4.8277MB
****************************************
Index Name: compressiontest-compression
Storage Size: 17.7604MB
Vector Size: 1.2242MB
****************************************
Index Name: compressiontest-narrow
Storage Size: 16.5567MB
Vector Size: 2.4254MB
****************************************
Index Name: compressiontest-no-stored
Storage Size: 10.9224MB
Vector Size: 4.8277MB
****************************************
Index Name: compressiontest-all-options
Storage Size: 4.9192MB
Vector Size: 1.2242MB
```

Search APIs report storage and vector size at the index level, so indexes and not fields must be the basis of comparison. Use the [GET Index Statistics](/rest/api/searchservice/indexes/get-statistics) or an equivalent API in the Azure SDKs to obtain vector size.

## Query a quantized vector field using oversampling

Query syntax for a compressed or quantized vector field is the same as for non-compressed vector fields, unless you want to override parameters associated with oversampling or reranking with original vectors.

Recall that the [vector compression definition](#add-compressions-to-a-search-index) in the index has settings for `rerankWithOriginalVectors` and `defaultOversampling` to mitigate the effects of a smaller vector index. You can override the default values to vary the behavior at query time. For example, if `defaultOversampling` is 10.0, you can change it to something else in the query request.

You can set the oversampling parameter even if the index doesn't explicitly have a `rerankWithOriginalVectors` or `defaultOversampling` definition. Providing `oversampling` at query time overrides the index settings for that query and executes the query with an effective `rerankWithOriginalVectors` as true.

```http
POST https://[service-name].search.windows.net/indexes/demo-index/docs/search?api-version=2024-07-01   
  Content-Type: application/json   
  api-key: [admin key]   

    {    
       "vectorQueries": [
            {    
                "kind": "vector",    
                "vector": [8, 2, 3, 4, 3, 5, 2, 1],    
                "fields": "myvector",
                "oversampling": 12.0,
                "k": 5   
            }
      ]    
    }
```

**Key points**:

- Applies to vector fields that undergo vector compression, per the vector profile assignment.

- Overrides the `defaultOversampling` value or introduces oversampling at query time, even if the index's compression configuration didn't specify oversampling or reranking options.

## See also

- [Get started with REST](search-get-started-rest.md)
- [Supported data types](/rest/api/searchservice/supported-data-types)
- [Search REST APIs](/rest/api/searchservice/)