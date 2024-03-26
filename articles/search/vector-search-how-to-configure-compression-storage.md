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
+ Apply scalar quantization to compress vectors in memory and on disk

Compression and storage configuration occur during index creation. You can Use the Azure portal, [2024-03-01-preview](/rest/api/searchservice/indexes/create-or-update?view=rest-searchservice-2024-03-01-preview&preserve-view=true), or a beta Azure SDK package to configure compression and storage.

## Assign small data types to vector fields

Vector fields store an array of embeddings. The data type tells the search engine that the field is a *vector field*, and it helps determine how much storage is allocated for field content.

Using preview APIs, you can assign smaller data types to reduce the storage requirements of vector fields. 

1. Review the [data types for vector fields](/rest/api/searchservice/supported-data-types#edm-data-types-for-vector-fields):

   + `Collection(Edm.Single)` 32-bit floating point (default)
   + `Collection(Edm.Half)` 16-bit floating point
   + `Collection(Edm.Int16)` 16-bit signed integer
   + `Collection(Edm.SByte)` 8-bit signed integer

1. Choose a data type that's valid for your embedding model's output, or for vectors that have undergone quantization.

   Most embedding models output 32-bit floating point numbers, but if you apply custom quantization processing, your output might be `Int16` or `Int8`. You can now define vector fields that accept the smaller format.

   Text embedding models have a native output format of `Float32`, which maps to `Collection(Edm.Single)` in Azure AI Search. You can't map that output to `Int8` because casting from float to `int` primitives is prohibited, but you can cast from `Float32` to `Float16` (or `Collection(Edm.Half)`).

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
   > Use cases for integer data types include support for custom quantization, and support for emerging embedding models that emit output in the small integer formats.

1. Make sure you understand the tradeoffs of a smaller type. `Collection(Edm.Half)` has less information, so if your data is homogenous or dense, losing extra detail or nuance could lead to unacceptable results at query time.

1. Use the Azure portal, [2024-03-01-preview](/rest/api/searchservice/indexes/create-or-update?view=rest-searchservice-2024-03-01-preview&preserve-view=true), or a beta Azure SDK package to assign these data types.

1. Assuming the vector field is marked as retrievable, use [Search explorer](search-explorer.md) or [REST API](/rest/api/searchservice/documents/search-post?view=rest-searchservice-2024-03-01-preview&preserve-view=true) to verify the field content matches the data type. Make sure to use the correct `2024-03-01-preview` API version for the query, otherwise the new properties aren't shown.

   Evidence of choosing the wrong data type, for example choosing `int8` for a `float32` embedding, is field that's indexed as an array of zeros.

> [!NOTE]
> The field's data type is used to create the physical data structure. If you want to change a data type later, either drop and rebuild the index, or create a second field with the new definition.

## Set the `stored` property to remove retrievable storage

The `stored` property is a new boolean that determines whether storage is allocated for retrievable vector field content. The default is true. If you set `stored` to false, the search engine performs indexing and storage of vector content that's used for query execution, but skips storage for retrievable content, reducing overall storage requirements by up to 50 percent. 

Vectors aren't human readable, so setting `stored` to false is useful if the query response is rendered on a search page. If vectors in the query response are used in downstream processing, choose another technique for minimizing storage.

The property is set during index creation on vector fields and is irreversible. Even if you set `retrievable` to true, a vector field that doesn't have a retrievable copy can't provide content in a query response. In the `2024-03-01-preview`, if `stored` is false, then `retrievable` must also be false.

In the fields collection of a search index, set stored to override the default (true) for vector fields.

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

The `stored` property affects storage on disk, not memory, and it has no effect on queries.

> [!NOTE]
> In `2024-03-01-preview` REST API and in Azure SDK packages that target `2024-03-01-preview`, the `retrievable` property defaults to false for all vector fields and `source` is set to true. In a default configuration, storage is allocated for the retrievable copy, but results aren't returned unless you `retrievable` to true. You can toggle `retrievable` at any time without incurring an index rebuild.

## Configure vector compression

Vector compression reduces memory and disk storage requirements, and it applies to vector fields containing `Float32` data.

To use vector compression:

+ Add a `vectorSearch.compressions` section to a search index.
+ Add a `vectorSearch.profiles.compression` setting to a vector profile.

In this preview, Azure AI Search adds support for scalar quantization.

### Add compression settings to a search index

In an index definition created using 2024-03-01-preview REST API, add a `compressions` section. Use the following JSON as a template.

```json
"compressions": [

      {  
        "name": "my-scalar-quantization",  
        "kind": "scalarQuantization",  
        "rerankWithOriginalVectors": true,  
        "defaultOversampling": 10.0,  
        "scalarQuantizationParameters": {  
             "quantizedDataType": "int8",  
        }
      }  
   ]
```

**Key points**:

+ `kind` must be set to `scalarQantization`.

+ Reranking uses the original, uncompressed vectors to reevaluate and adjust the ranking of the top results returned by the initial search query. The uncompressed vectors exist in the search index even if `stored` is false.

+ Oversampling considers a broader set of potential results. The formula for potential results consists of the `k` in the query, with an oversampling multiplier. For example, if the query specifies a `k` of 5, and oversampling is 20, then the query effectively requests 100 documents for use in reranking, using the original uncompressed vector for that purpose.

+ `quantizedDataType` must be set to `int8` or `int16`.

### Add a compression setting to a vector profile

A vector compression configuration is added to a vector profile. Vector fields acquire compression settings through the vector profile assignment.

1. Add a compression configuration to a vector profile.

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

1. Assign a vector profile to a vector field. Vector compression reduces content to `Int8`, so start with a `Float32` or `Collection(Edm.Single)` type.

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

### How scalar quantization works in Azure AI Search

Scalar quantization reduces the resolution of each number within each vector embedding. Instead of describing each number as a 32-bit floating point number, it uses an 8-bit integer. It identifies a range of numbers (typically 99th percentile minimum and maximum) and divides them into a finite number of levels or bin”, assigning each bin an identifier. In the case of 8-bit scalar quantization, there are 2 to the eighth power, or 256, possible bins.

Each component of the vector is mapped to the closest representative value within this set of quantization levels in a process akin to rounding a real number to the nearest integer. In the quantized 8-bit vector, the identifier number stands in place of the original value. After quantization, each vector is represented by an array of identifiers for the bins to which its components belong. These quantized vectors require much fewer bits to store compared to the original vector, thus reducing storage requirements and memory footprint. 

## Example index with vectorCompression, data types, and stored property

Here's a JSON example of a search index that specifies `vectorCompression` that used on `Float32` field, a `Float16` data type on second vector field, and a `stored` property set to false. It's a composite of the vector compression and storage features in this preview.

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
            "vectorSearchProfile": "my-vector-profile"
        },
        {
            "name": "Description", 
            "type": "Edm.String",
            "searchable": true, 
            "filterable": false, 
            "retrievable": false, 
            "sortable": false, 
            "facetable": false,
            "stored": false,
        },
        {
            "name": "DescriptionVector",
            "type": "Collection(Edm.Single)",
            "searchable": true,
            "retrievable": true,
            "dimensions": 1536,
            "vectorSearchProfile": "my-vector-profile"
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
              "quantizedDataType": "int8",
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
                "name": "my-vector-profile",
                "compression": "my-scalar-quantization", 
                "algorithm": "my-hnsw-vector-config-1",
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

## Query a compressed vector field using oversampling

This query syntax applies to vector fields using the built-in compression algorithm. On the query, you can override the oversampling default value. 

Oversampling has a dependency on `rerankWithOriginalVectors`. If `rerankWithOriginalVectors` is false in the search index, but you provide an oversampling override in the query, the search engine sets `rerankWithOriginalVectors` to true just for that query.

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

## See also

+ [Get started with REST](search-get-started-rest.md)
+ [Supported data types](/rest/api/searchservice/supported-data-types)
+ [Search REST APIs](/rest/api/searchservice/)