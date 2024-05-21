---
title: Reduce vector size
titleSuffix: Azure AI Search
description: Configure vector compression options and vector storage using narrow data types, built-in scalar quantization, and storage options.

author: heidisteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 04/26/2024
---

# Configure vector quantization and reduced storage for smaller vectors in Azure AI Search

> [!IMPORTANT]
> These features are in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The [2024-03-01-Preview REST API](/rest/api/searchservice/operation-groups?view=rest-searchservice-2024-03-01-preview&preserve-view=true) provides the new data types, vector compression properties, and the `stored` property.

This article describes vector quantization and other techniques for compressing vector indexes in Azure AI Search.

## Evaluate the options

As a first step, review the three options for reducing the amount of storage used by vector fields. These options aren't mutually exclusive. 

We recommend scalar quantization because it compresses vector size in memory and on disk with minimal effort, and that tends to provide the most benefit in most scenarios. In contrast, narrow types (except for `Float16`) require a special effort into making them, and `stored` saves on disk storage, which isn't as expensive as memory.

| Approach | Why use this option |
|----------|---------------------|
| Assign smaller primitive data types to vector fields | Narrow data types, such as `Float16`, `Int16`, and `Int8`, consume less space in memory and on disk, but you must have an embedding model that outputs vectors in a narrow data format. Or, you must have custom quantization logic that outputs small data. A third use case that requires less effort is recasting native `Float32` embeddings produced by most models to `Float16`. |
| Eliminate optional storage of retrievable vectors | Vectors returned in a query response are stored separately from vectors used during query execution. If you don't need to return vectors, you can turn off retrievable storage, reducing overall per-field disk storage by up to 50 percent. |
| Add scalar quantization | Use built-in scalar quantization to compress native `Float32` embeddings to `Int8`. This option reduces storage in memory and on disk with no degradation of query performance. Smaller data types like `Int8` produce vector indexes that are less content-rich than those with `Float32` embeddings. To offset information loss, built-in compression includes options for post-query processing using uncompressed embeddings and oversampling to return more relevant results. Reranking and oversampling are specific features of built-in scalar quantization of `Float32` or `Float16` fields and can't be used on embeddings that undergo custom quantization. |

All of these options are defined on an empty index. To implement any of them, use the Azure portal, [2024-03-01-preview REST APIs](/rest/api/searchservice/indexes/create-or-update?view=rest-searchservice-2024-03-01-preview&preserve-view=true), or a beta Azure SDK package.

After the index is defined, you can load and index documents as a separate step.

## Option 1: Assign narrow data types to vector fields

Vector fields store vector embeddings, which are represented as an array of numbers. When you specify a field type, you specify the underlying primitive data type used to hold each number within these arrays. The data type affects how much space each number takes up.

Using preview APIs, you can assign narrow primitive data types to reduce the storage requirements of vector fields. 

1. Review the [data types for vector fields](/rest/api/searchservice/supported-data-types#edm-data-types-for-vector-fields):

   + `Collection(Edm.Single)` 32-bit floating point (default)
   + `Collection(Edm.Half)` 16-bit floating point
   + `Collection(Edm.Int16)` 16-bit signed integer
   + `Collection(Edm.SByte)` 8-bit signed integer

   > [!NOTE]
   > Binary data types aren't currently supported.

1. Choose a data type that's valid for your embedding model's output, or for vectors that undergo custom quantization.

   Most embedding models output 32-bit floating point numbers, but if you apply custom quantization, your output might be `Int16` or `Int8`. You can now define vector fields that accept the smaller format.

   Text embedding models have a native output format of `Float32`, which maps to `Collection(Edm.Single)` in Azure AI Search. You can't map that output to `Int8` because casting from `float` to `int` is prohibited. However, you can cast from `Float32` to `Float16` (or `Collection(Edm.Half)`), and this is an easy way to use narrow data types without extra work.

   The following table provides links to several embedding models that use the narrow data types. 

   | Embedding model        | Native output | Valid types in Azure AI Search |
   |------------------------|---------------|--------------------------------|
   | [text-embedding-ada-002](/azure/ai-services/openai/concepts/models#embeddings) | `Float32` | `Collection(Edm.Single)` or `Collection(Edm.Half)` |
   | [text-embedding-3-small](/azure/ai-services/openai/concepts/models#embeddings) | `Float32` | `Collection(Edm.Single)` or `Collection(Edm.Half)` |
   | [text-embedding-3-large](/azure/ai-services/openai/concepts/models#embeddings) | `Float32` | `Collection(Edm.Single)` or `Collection(Edm.Half)` |
   | [Cohere V3 embedding models with int8 embedding_type](https://docs.cohere.com/reference/embed) | `Int8` | `Collection(Edm.SByte)` |

1. Make sure you understand the tradeoffs of a narrow data type. `Collection(Edm.Half)` has less information, which results in lower resolution. If your data is homogenous or dense, losing extra detail or nuance could lead to unacceptable results at query time because there's less detail that can be used to distinguish nearby vectors apart.

1. [Define and build the index](vector-search-how-to-create-index.md). You can use the Azure portal, [2024-03-01-preview](/rest/api/searchservice/indexes/create-or-update?view=rest-searchservice-2024-03-01-preview&preserve-view=true), or a beta Azure SDK package for this step.

1. Check the results. Assuming the vector field is marked as retrievable, use [Search explorer](search-explorer.md) or [REST API](/rest/api/searchservice/documents/search-post?view=rest-searchservice-2024-03-01-preview&preserve-view=true) to verify the field content matches the data type. Be sure to use the correct `2024-03-01-preview` API version for the query, otherwise the new properties aren't shown.
<!-- 
   Evidence of choosing the wrong data type, for example choosing `int8` for a `float32` embedding, is a field that's indexed as an array of zeros. If you encounter this problem, start over. -->

   To check vector index size, use the Azure portal or the [2024-03-01-preview](/rest/api/searchservice/indexes/get-statistics?view=rest-searchservice-2024-03-01-preview&preserve-view=true).

> [!NOTE]
> The field's data type is used to create the physical data structure. If you want to change a data type later, either drop and rebuild the index, or create a second field with the new definition.

## Option 2: Set the `stored` property to remove retrievable storage

The `stored` property is a new boolean on a vector field definition that determines whether storage is allocated for retrievable vector field content. If you don't need vector content in a query response, you can save up to 50 percent storage per field by setting `stored` to false.

Because vectors aren't human readable, they're typically omitted in a query response that's rendered on a search page. However, if you're using vectors in downstream processing, such as passing query results to a model or process that consumes vector content, you should keep `stored` set to true and choose a different technique for minimizing vector size.

The following example shows the fields collection of a search index. Set `stored` to false to permanently remove retrievable storage for the vector field.

   ```http
   PUT https://[service-name].search.windows.net/indexes/[index-name]?api-version=2024-03-01-preview  
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

**Key points**:

+ Applies to [vector fields](/rest/api/searchservice/supported-data-types#edm-data-types-for-vector-fields) only.

+ Affects storage on disk, not memory, and it has no effect on queries. Query execution uses a separate vector index that's unaffected by the `stored` property.

+ The `stored` property is set during index creation on vector fields and is irreversible. If you want retrievable content later, you must drop and rebuild the index, or create and load a new field that has the new attribution.

+ Defaults are `stored` set to true and `retrievable` set to false. In a default configuration, a retrievable copy is stored, but it's not automatically returned in results. When `stored` is true, you can toggle `retrievable` between true and false at any time without having to rebuild an index. When `stored` is false, `retrievable` must be false and can't be changed.

## Option 3: Configure scalar quantization

Built-in scalar quantization is recommended because it reduces memory and disk storage requirements, and it adds reranking and oversampling to offset the effects of a smaller index. Built-in scalar quantization can be applied to vector fields containing `Float32` or `Float16` data.

To use built-in vector compression:

+ Add `vectorSearch.compressions` to a search index. The compression algorithm supported in this preview is *scalar quantization*.
+ Set optional properties to mitigate the effects of lossy indexing. Both `rerankWithOriginalVectors` and `defaultOversampling` provide optimizations during query execution.
+ Add `vectorSearch.profiles.compression` to a new vector profile.
+ Assign the new vector profile to a new vector field.

### Add compression settings and set optional properties

In an index definition created using [2024-03-01-preview REST API](/rest/api/searchservice/indexes/create-or-update?view=rest-searchservice-2024-03-01-preview&preserve-view=true), add a `compressions` section. Use the following JSON as a template.

```json
"compressions": [

      {  
        "name": "my-scalar-quantization",  
        "kind": "scalarQuantization",  
        "rerankWithOriginalVectors": true,  (optional)
        "defaultOversampling": 10.0,  (optional)
        "scalarQuantizationParameters": {  (optional)
             "quantizedDataType": "int8",  (optional)
        }
      }  
   ]
```

**Key points**:

+ `kind` must be set to `scalarQuantization`. This is the only quantization method supported at this time.

+ `rerankWithOriginalVectors` uses the original, uncompressed vectors to recalculate similarity and rerank the top results returned by the initial search query. The uncompressed vectors exist in the search index even if `stored` is false. This property is optional. Default is true.

+ `defaultOversampling` considers a broader set of potential results to offset the reduction in information from quantization. The formula for potential results consists of the `k` in the query, with an oversampling multiplier. For example, if the query specifies a `k` of 5, and oversampling is 20, then the query effectively requests 100 documents for use in reranking, using the original uncompressed vector for that purpose. Only the top `k` reranked results are returned. This property is optional. Default is 4.

+ `quantizedDataType` must be set to `int8`. This is the only primitive data type supported at this time. This property is optional. Default is `int8`.

### Add a compression setting to a vector profile

Scalar quantization is specified as a property in a *new* vector profile. Creation of a new vector profile is necessary for building compressed indexes in memory.

Within the profile, you must use the Hierarchical Navigable Small Worlds (HNSW) algorithm. Built-in quantization isn't supported with exhaustive KNN.

1. Create a new vector profile and add a compression property.

   ```json
   "profiles": [
      {
         "name": "my-vector-profile",
         "compression": "my-scalar-quantization", 
         "algorithm": "my-hnsw-vector-config-1",
         "vectorizer": null
      }
    ]
   ```

1. Assign a vector profile to a *new* vector field. Scalar quantization reduces content to `Int8`, so make sure your content is either `Float32` or `Float16`. 

   In Azure AI Search, the Entity Data Model (EDM) equivalents of `Float32` and `Float16` types are `Collection(Edm.Single)` and `Collection(Edm.Half)`, respectively. 

   ```json
   {
      "name": "DescriptionVector",
      "type": "Collection(Edm.Single)",
      "searchable": true,
      "retrievable": true,
      "dimensions": 1536,
      "vectorSearchProfile": "my-vector-profile"
   }
   ```

1. [Load the index](search-what-is-data-import.md) using indexers for pull model indexing, or APIs for push model indexing.

### How scalar quantization works in Azure AI Search

Scalar quantization reduces the resolution of each number within each vector embedding. Instead of describing each number as a 32-bit floating point number, it uses an 8-bit integer. It identifies a range of numbers (typically 99th percentile minimum and maximum) and divides them into a finite number of levels or bin, assigning each bin an identifier. In 8-bit scalar quantization, there are 2^8, or 256, possible bins.

Each component of the vector is mapped to the closest representative value within this set of quantization levels in a process akin to rounding a real number to the nearest integer. In the quantized 8-bit vector, the identifier number stands in place of the original value. After quantization, each vector is represented by an array of identifiers for the bins to which its components belong. These quantized vectors require much fewer bits to store compared to the original vector, thus reducing storage requirements and memory footprint. 

## Example index with vectorCompression, data types, and stored property

Here's a composite example of a search index that specifies narrow data types, reduced storage, and vector compression. 

+ "HotelNameVector" provides a narrow data type example, recasting the original `Float32` values to `Float16`, expressed as `Collection(Edm.Half)` in the search index.
+ "HotelNameVector" also has `stored` set to false. Extra embeddings used in a query response are not stored. When `stored` is false, `retrievable` must also be false.
+ "DescriptionVector" provides an example of vector compression. Vector compression is defined in the index, referenced in a profile, and then assigned to a vector field. "DescriptionVector" also has `stored` set to false. 

```json
### Create a new index
POST {{baseUrl}}/indexes?api-version=2024-03-01-preview  HTTP/1.1
    Content-Type: application/json
    api-key: {{apiKey}}

{
    "name": "hotels-vector-quickstart",
    "fields": [
        {
            "name": "HotelId", 
            "type": "Edm.String",
            "searchable": false, 
            "filterable": true, 
            "retrievable": true, 
            "sortable": false, 
            "facetable": false,
            "key": true
        },
        {
            "name": "HotelName", 
            "type": "Edm.String",
            "searchable": true, 
            "filterable": false, 
            "retrievable": true, 
            "sortable": true, 
            "facetable": false
        },
        {
            "name": "HotelNameVector",
            "type": "Collection(Edm.Half)",
            "searchable": true,
            "retrievable": false,
            "dimensions": 1536,
            "stored": false,
            "vectorSearchProfile": "my-vector-profile-no-compression"
        },
        {
            "name": "Description", 
            "type": "Edm.String",
            "searchable": true, 
            "filterable": false, 
            "retrievable": false, 
            "sortable": false, 
            "facetable": false
        },
        {
            "name": "DescriptionVector",
            "type": "Collection(Edm.Single)",
            "searchable": true,
            "retrievable": false,
            "dimensions": 1536,
            "stored": false,
            "vectorSearchProfile": "my-vector-profile-with-compression"
        },
        {
            "name": "Category", 
            "type": "Edm.String",
            "searchable": true, 
            "filterable": true, 
            "retrievable": true, 
            "sortable": true, 
            "facetable": true
        },
        {
            "name": "Tags",
            "type": "Collection(Edm.String)",
            "searchable": true,
            "filterable": true,
            "retrievable": true,
            "sortable": false,
            "facetable": true
        },
        {
            "name": "Address", 
            "type": "Edm.ComplexType",
            "fields": [
                {
                    "name": "City", "type": "Edm.String",
                    "searchable": true, "filterable": true, "retrievable": true, "sortable": true, "facetable": true
                },
                {
                    "name": "StateProvince", "type": "Edm.String",
                    "searchable": true, "filterable": true, "retrievable": true, "sortable": true, "facetable": true
                }
            ]
        },
        {
            "name": "Location",
            "type": "Edm.GeographyPoint",
            "searchable": false, 
            "filterable": true, 
            "retrievable": true, 
            "sortable": true, 
            "facetable": false
        }
    ],
"vectorSearch": {
    "compressions": [
        {
            "name": "my-scalar-quantization",
            "kind": "scalarQuantization",
            "rerankWithOriginalVectors": true,
            "defaultOversampling": 10.0,
                "scalarQuantizationParameters": {
                    "quantizedDataType": "int8"
                }
        }
    ],
    "algorithms": [
        {
            "name": "my-hnsw-vector-config-1",
            "kind": "hnsw",
            "hnswParameters": 
            {
                "m": 4,
                "efConstruction": 400,
                "efSearch": 500,
                "metric": "cosine"
            }
        },
        {
            "name": "my-hnsw-vector-config-2",
            "kind": "hnsw",
            "hnswParameters": 
            {
                "m": 4,
                "metric": "euclidean"
            }
        },
        {
            "name": "my-eknn-vector-config",
            "kind": "exhaustiveKnn",
            "exhaustiveKnnParameters": 
            {
                "metric": "cosine"
            }
        }
    ],
    "profiles": [      
        {
            "name": "my-vector-profile-with-compression",
            "compression": "my-scalar-quantization",
            "algorithm": "my-hnsw-vector-config-1",
            "vectorizer": null
        },
        {
            "name": "my-vector-profile-no-compression",
            "compression": null,
            "algorithm": "my-eknn-vector-config",
            "vectorizer": null
        }
    ]
},
    "semantic": {
        "configurations": [
            {
                "name": "my-semantic-config",
                "prioritizedFields": {
                    "titleField": {
                        "fieldName": "HotelName"
                    },
                    "prioritizedContentFields": [
                        { "fieldName": "Description" }
                    ],
                    "prioritizedKeywordsFields": [
                        { "fieldName": "Tags" }
                    ]
                }
            }
        ]
    }
}
```

## Query a quantized vector field using oversampling

The query syntax in this example applies to vector fields using built-in scalar quantization. By default, vector fields that use scalar quantization also use `rerankWithOriginalVectors` and `defaultOversampling` to mitigate the effects of a smaller vector index. Those settings are [specified in the search index](#add-compression-settings-and-set-optional-properties).

On the query, you can override the oversampling default value. For example, if `defaultOversampling` is 10.0, you can change it to something else in the query request.

You can set the oversampling parameter even if the index doesn't explicitly have a `rerankWithOriginalVectors` or `defaultOversampling` definition. Providing `oversampling` at query time overrides the index settings for that query and executes the query with an effective `rerankWithOriginalVectors` as true.

```http
POST https://[service-name].search.windows.net/indexes/[index-name]/docs/search?api-version=2024-03-01-Preview   
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

+ Applies to vector fields that undergo vector compression, per the vector profile assignment.

+ Overrides the `defaultOversampling` value or introduces oversampling at query time, even if the index's compression configuration didn't specify oversampling or reranking options.

## See also

+ [Get started with REST](search-get-started-rest.md)
+ [Supported data types](/rest/api/searchservice/supported-data-types)
+ [Search REST APIs](/rest/api/searchservice/)