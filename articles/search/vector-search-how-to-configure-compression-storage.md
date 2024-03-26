---
title: Vector compression and storage
titleSuffix: Azure AI Search
description: Configure vector compression options and vector storage using small data types, compression algorithms, and storage options.

author: heidisteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 04/03/2024
---

# Configure vector compression and storage in Azure AI Search

> [!IMPORTANT]
> These features are in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The [2024-03-01-Preview REST API](/rest/api/searchservice/operation-groups?view=rest-searchservice-2024-03-01-preview&preserve-view=true) provides the new data types, vector compression properties, and the `stored` property.

This article describes vector compression and techniques for minimizing vector storage. You can use these capabilities together or individually.

+ Assign smaller data types for reduced storage
+ Eliminate optional storage of retrievable vectors, reducing storage by up to 50%
+ Apply vector compression for in-memory and on-disk vector storage

Compression and storage configuration occur during index creation. You can Use the Azure portal, [2024-03-01-preview](/rest/api/searchservice/indexes/create-or-update?view=rest-searchservice-2024-03-01-preview&preserve-view=true), or a beta Azure SDK package to configure compression and storage.

## Assign small data types to vector fields

Vector fields store an array of embeddings. The data type tells the search engine that the field is a *vector field*, and it helps determine how much storage is allocated for field content.

Using preview APIs, you can assign smaller data types to reduce the storage requirements of vector fields. 

1. Review the [data types for vector fields](/rest/api/searchservice/supported-data-types#edm-data-types-for-vector-fields):

   + `Collection(Edm.Single)` 32-bit floating point (default)
   + `Collection(Edm.Half)` 16-bit floating point
   + `Collection(Edm.Int16)` 16-bit signed integer
   + `Collection(Edm.SByte)` 8-bit signed integer

1. Choose a data type that's valid for your embedding model's output. For example, text-embedding-ada-002 has an output format of `Float32`, which maps to `Collection(Edm.Single)` in Azure AI Search. You can't use `Int8` because casting from float to `int` primitives is prohibited, but you can cast from `Float32` to `Float16` (or `Collection(Edm.Half)`). 

   The following table provides links to several embedding models that use the smaller data types. 

   | Embedding model        | Native output | Valid types in Azure AI Search |
   |------------------------|---------------|--------------------------------|
   | [text-embedding-ada-002](/azure/ai-services/openai/concepts/models#embeddings) | `Float32` | `Collection(Edm.Single)` or `Collection(Edm.Half)` |
   | [text-embedding-3-small](/azure/ai-services/openai/concepts/models#embeddings) | `Float32` | `Collection(Edm.Single)` or `Collection(Edm.Half)` |
   | [text-embedding-3-large](/azure/ai-services/openai/concepts/models#embeddings) | `Float32` | `Collection(Edm.Single)` or `Collection(Edm.Half)` |
   | [Cohere V3 embedding models with int8 embedding_type](https://docs.cohere.com/reference/embed) | `Int8` | `Collection(Edm.SByte)` |

   > [!NOTE]
   > Links for the text embedding models resolve to Azure OpenAI, but you could also use [OpenAI's models](https://platform.openai.com/docs/guides/embeddings/embedding-models).
   >
   > Binary data types aren't currently supported.
   >
   > Integer data types are in early stages of embedding model support. Specifically, the use cases for `Int816` and `Int16` are just emerging.

1. Make sure you understand the tradeoffs of a smaller type. `Collection(Edm.Half)` has less information, so if your data is homogenous, losing detail or nuance could lead to unacceptable results at query time.

1. Use the Azure portal, [2024-03-01-preview](/rest/api/searchservice/indexes/create-or-update?view=rest-searchservice-2024-03-01-preview&preserve-view=true), or a beta Azure SDK package to assign these data types.

1. Assuming the vector field is marked as retrievable, use [Search explorer](search-explorer.md) or [REST API](/rest/api/searchservice/documents/search-post?view=rest-searchservice-2024-03-01-preview&preserve-view=true) to verify the field content matches the data type. Make sure to use the correct `2024-03-01-preview` API version for the query, otherwise the new properties aren't shown.

   Evidence of choosing the wrong data type, for example choosing `int8` for a `float32` embedding, is field that's indexed as an array of zeros.

> [!NOTE]
> The field's data type is used to create the physical data structure. If you want to change a data type later, either drop and rebuild the index, or create a second field with the new definition.

## Set the `stored` property to remove retrievable storage

The `stored` property is a new boolean that determines whether storage is allocated for retrievable vector field content. The default is true. If you set `stored` to false, the search engine performs indexing and storage of vector content that's used for query execution, but skips storage for retrievable content, reducing overall storage requirements by up to 50 percent. 

Vectors aren't human readable, so setting `stored` to false is useful if the query response is rendered on a search page. If vectors in the query response are used in downstream processing, choose another technique for minimizing storage.

The property is set during index creation on vector fields and is irreversible. Even if you set `retrievable` to true, a vector field that doesn't have a retrievable copy can't provide content in a query response.

In the fields collection of a search index, set stored to override the default (true) for vector fields.

   ```http
   PUT https://[service-name].search.windows.net/indexes/[index-name]?api-version=2024-03-01-Preview  
      Content-Type: application/json  
      api-key: [admin key]  
    
        { 
          "name": "myindex", 
          "fields": [ 
            { 
              "name": "myvector", 
              "type": "Collection(Edm.Single)", 
              "retrievable": false, 
              "stored": false, 
              "dimensions": 1536, 
              "vectorSearchProfile": "vectorProfile" 
            } 
          ] 
        } 
   ```

The `stored` property affects storage on disk, not memory, and it has no effect on queries.

> [!NOTE]
> In `2024-03-01-preview` REST API and in Azure SDK packages that target `2024-03-01-preview`, the `retrievable` property defaults to false for all vector fields and `source` is set to true. In a default configuration, storage is allocated for the retrievable copy, but results aren't returned unless you `retrievable` to true. You can toggle `retrievable` at any time without incurring an index rebuild.

## Configure vector compression

Vector compression reduces memory and disk storage requirements, and it applies to vector fields containing `Float32` data.

TBD

## Example index with vectorCompression, data types, and stored

Here's a JSON example of a search index that specifies `vectorCompression`, a `Float16` data type on vector fields, and a `stored` property set to false.

```json
TBD
```

