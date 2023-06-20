---
title: Add vector search
titleSuffix: Azure Cognitive Search
description: Create or update a search index to include vector fields.

author: robertklee
ms.author: robertlee
ms.service: cognitive-search
ms.topic: how-to
ms.date: 06/29/2023
---

# Create or Update Index for Vector Search (Preview REST API)

**API Version: 2023-07-01-Preview**

This article supplements [Create or Update Index (Preview API)](https://learn.microsoft.com/rest/api/searchservice/preview-api/create-or-update-index) on [learn.microsoft.com](https://learn.microsoft.com) with content created for vector search scenarios. It focuses on the new additions that enable vector search.

Azure Cognitive Search introduces a new type of field called **vector field**. These can exist alongside your existing fields within your index, allowing for capabilities such as hybrid search, which aggregates results from both vector and traditional search.

Please note the following:

* Azure Cognitive Search does not currently provide vector embedding generation capabilities. You'll need to provide the embeddings yourself by using a service such as Azure OpenAI. Please see the document titled [How to generate embeddings](./vector-search-how-to-generate-embeddings.md) to learn more.
* You don't need a special "vector index" to use vector search. You'll only need to add a "vector field" to a new or existing index.
* Both new and existing indexes support vector search. However, there is a small subset of very old services that do not support vector search. In this case, a new search service must be created to use it. 
* Updating an existing index to add vector fields requires `allowIndexDowntime` query parameter to be `true` (see [below](#uri-parameters)).

The new API version **2023-07-01-Preview** adds the following properties for vector search:

+ [**algorithmConfigurations**](#vectorsearch) used for selecting a vector search algorithm type and configuring algorithm parameters.
+ [**Collection(Edm.Single)**](#fields) data type, required for a vector field. This represents a single-precision floating-point number as the primitive type.
+ [**dimensions**](#fields) property, required for a vector field. This represents the dimensionality of your vector embeddings.
+ [**vectorSearchConfiguration**](#fields) property, required for a vector field. This selects the algorithm configuration you specified.

An [index](https://learn.microsoft.com/azure/search/search-what-is-an-index) specifies the index schema, including the fields collection (field names, data types, and attributes), but also additional constructs (vector configuration, semantic search configuration, CORS configuration, etc) that define other search behaviors.

You can use either POST or PUT on a create request. For either one, the request body provides the object definition.

```http
POST https://[servicename].search.windows.net/indexes?api-version=2023-07-01-preview  
  Content-Type: application/json
  api-key: [admin key]  
```  

**Creating an index** establishes the schema and metadata. Populating the index uses the [Add, Update, or Delete Documents](/rest/api/searchservice/addupdate-or-delete-documents) API, or an indexer.


## Modified definitions for vector search

Adding vector fields for vector search requires modifications to the following elements of the index definition.

|Link|Description|
|--|--|
| [fields](#bkmk_indexAttrib) | Sets definitions and attributes of a field in a search index. |
| [vectorSearch](#vectorSearch) | Configures the algorithm used for vector fields.  |

 <a name="bkmk_indexAttrib"> </a>

### fields

Contains information about attributes set on a search field when creating an index. The following list will only contain changes relevant to vector fields.

|Attribute|Description|  
|---------------|-----------------|  
| name | Required. Sets the name of the field, which must be unique within the fields collection of the index or parent field.|  
| type | Required. Sets the data type for the field. Vector search is only supported on one type currently, which is `Collection(Edm.Single)`. This accommodates single-precision floating point numbers (4 bytes each). It's used only for vector fields. |
| dimensions | Integer. Required for vector fields. **This must match the output embedding size of your embedding model. For example, for a popular Azure OpenAI model `text-embedding-ada-002`, its output dimensions is 1536, so this would be the dimensions to set for that vector field. |
| vectorSearchConfiguration | String. Required for vector fields. Specify an algorithm configuration to use for indexing and querying on the vector field. See section [vectorSearch](#vectorsearch) for information on how to configure an algorithm configuration. |
|retrievable| Indicates whether the field can be returned in a search result. This field can be either `true` or `false` but unlike other field types, this field parameter cannot be changed after index creation. |  
|searchable| Indicates whether the field is in-scope for queries. For vector fields, this must be `true`. |  
|filterable| Indicates whether to enable the field to be referenced in `$filter` queries. For vector fields, this must be `false` or omitted. |  
|sortable| Indicates whether to enable the field to be referenced in `$orderby` expressions. For vector fields, this must be `false` or omitted. |  
|facetable| Indicates whether to enable the field to be referenced in facet queries. TFor vector fields, this must be `false` or omitted. |
|analyzer / normalizer | These lexical components are not relevant for vector fields, so they must be empty, null, or omitted. |  

<a name="vectorSearch"></a>

### vectorSearch

A vectorSearch configuration is a part of an index definition that's used to configure the algorithms used for vector fields. Multiple fields can use the same algorithm configuration. Any algorithm configuration that's used by an existing field cannot be modified or deleted. Any algorithm configurations that aren't referenced by a field may be modified or deleted.

```json
"vectorSearch": {
    "algorithmConfigurations": [
        {
            "name": "my-vector-config",
            "kind": "hnsw",
            "hnswParameters": {
                "m": 4,
                "efConstruction": 400,
                "efSearch": 500,
                "metric": "cosine"
            }
        }
    ]
}
```

|Attribute|Description|  
|---------------|-----------------|  
| name| Required. The name of the algorithm configuration. This is used by field(s) to reference this configuration object. | 
| kind| The algorithm type. Currently, we only support `hnsw` for the Hierarchical Navigable Small World (HNSW) algorithm. | 
| hnswParameters | Optional. Parameters for "hnsw" algorithm. If this object is omitted, default values will be used. |

#### hnswParameters

This object contains the customizations to `hnsw` algorithm parameters. All of these properties are **optional** and default values will be used if any are omitted. You may retrieve these values by retrieving the index definition using GET.

| Attribute | Description |
|-----------|-------------|
| metric | String. The similarity metric to use for vector comparisons. For hnsw, the allowed values are "cosine", "euclidean", and "dotProduct". A default value of "cosine" will be used if this is omitted or null. |
| m        | Integer. The number of bi-directional links created for every new element during construction. A default value of 4 will be used if this is omitted or null. Larger values lead to denser graphs, improving query performance, but requires more memory and computation. The allowable range is 4 to 10, and the default is 4. |
| efConstruction | Integer. The size of the dynamic list for the nearest neighbors used during indexing. Larger values lead to a better index quality, but requires more memory and computation. A default value of 400 will be used if this is omitted or null. The allowable range is 100 to 1000. |
| efSearch | Integer. The size of the dynamic list containing the nearest neighbors, which is used during search time. Increasing this parameter may improve search results, at the expense of slower search. Increasing this parameter leads to diminishing returns. A default value 500 will be used if this is omitted or null. The allowable range will be 100 to 1000. |

Since `efSearch` is a query-time parameter, this value is permitted to be updated even if an existing field is using an algorithm configuration.

## URI Parameters

| Parameter      | Description  |
|----------------|--------------|
| service name | Required. Set this to the unique, user-defined name of your search service. |
| index name  | Required on the URI if using PUT. The name must be lower case, start with a letter or number, have no slashes or dots, and be fewer than 128 characters. Dashes can't be consecutive.  |
| api-version | Required. Use 2023-07-01-preview for this preview. |
| allowIndexDowntime | Optional. False by default. Set to true for certain updates, such as adding or modifying an analyzer, tokenizer, token filter, char filter, or similarity property. The index is taken offline for the duration of the update, usually no more than several seconds. **This parameter is required to be true when adding vector fields to an existing index.** |

## Request Headers

 The following table describes the required and optional request headers.  

|Fields              | Description      |  
|--------------------|------------------|  
|Content-Type        | Required. Set this to `application/json`|  
|api-key             | Optional if you're using [Azure roles](https://learn.microsoft.com//azure/search/search-security-rbac) and a bearer token is provided on the request, otherwise a key is required. An api-key is a unique, system-generated string that authenticates the request to your search service. Create requests must include an `api-key` header set to your admin key (as opposed to a query key). See [Connect to Cognitive Search using key authentication](https://learn.microsoft.com//azure/search/search-security-api-keys) for details.|

## Request Body

The body of the request contains a schema definition, which includes the list of data fields within documents that will be fed into this index.  

The following JSON is a high-level representation of a schema that supports vector search. A schema requires a key field, and that key field can be searchable, filterable, sortable, and facetable. 

A vector search field is of type `Collection(Edm.Single)`. Because vector fields are not textual, a vector fields can't be used as a key, and it doesn't accept analyzers, normalizers, suggesters, or synonyms. It must have a "dimensions" property and an "vectorSearchConfiguration" property. Vector fields must be searchable, and cannot be set as filterable, sortable, nor facetable. Retrievable cannot be changed on an existing vector field.

A schema that supports vector search can also support keyword search. Other non-vector fields in the index can use the analyzers, synonyms, and scoring profiles that you include in your index. For more information about parts of the schema not covered in this article., see [Create or Update Index (preview API)](https://learn.microsoft.com/rest/api/searchservice/preview-api/create-or-update-index).

```json
{  
  "name": (optional on PUT; required on POST) "Name of the index",
  "description": (optional) "Description of the index",  
  "fields": [
    {  
      "name": "name_of_document_key_field",  
      "type": "Edm.String",  
      "searchable": true (default where applicable) | false 
      
      "filterable": true (default) | false,  
      "sortable": true (default where applicable) | false (Collection(Edm.String) fields cannot be sortable),  
      "facetable": true (default where applicable) | false (Edm.GeographyPoint fields cannot be facetable),  
      "key": true,  
      "retrievable": true (default) | false
    },
    {  
      "name": "name_of_vector_field",  
      "type": "Collection(Edm.Single)",  
      "searchable": true (default where applicable),
      "filterable": false (filterable must be false for a vector field),  
      "sortable": false (sortable must be false for a vector field),
      "facetable": false (facetable must be false for a vector field),
      "key": false (key must be false for a vector field),
      "retrievable": true (default) | false (cannot be changed after being created),  
      "analyzer": "",
      "searchAnalyzer": "",
      "indexAnalyzer": "",
      "normalizer": "",
      "synonymMaps": "",
      "dimensions": (integer such as) 1536,
      "vectorSearchConfiguration": "name of vectorSearch configuration"
    }
  ],
  "semantic": (optional) { },
  "vectorSearch": (normally optional, but required for vector search) { },
  "normalizers":(optional) [ ... ],
  "analyzers":(optional) [ ... ],
  "charFilters":(optional) [ ... ],
  "tokenizers":(optional) [ ... ],
  "tokenFilters":(optional) [ ... ],
  "defaultScoringProfile": (optional) "Name of a custom scoring profile to use as the default",  
  "corsOptions": (optional) { },
  "encryptionKey":(optional) { }  
}  
```

 Request contains the following properties:  

|Property|Description|  
|--------------|-----------------|  
|name|Required. The name of the index. An index name must only contain lowercase letters, digits or dashes, cannot start or end with dashes and is limited to 128 characters.|  
|[fields](#bkmk_indexAttrib)| A collection of fields for this index, where each field has a name, a data type that conforms to the Entity Data Model (EDM), and attributes that define allowable actions on that field. The fields collection must have one field of type `Edm.String` with "key" set to "true". This field represents the unique identifier, sometimes called the document ID, for each document stored with the index. <br><br>Vector fields must be of type "Collection(Edm.Single"), which represents single-precision floating-point numbers. Vector fields have a "dimensions" property that sets the output dimensions of the machine learning model used to generate embeddings. For example, if you're using OpenAI's `text-embedding-ada-002`, the output dimensions is 1,536 [as referenced in this document](https://platform.openai.com/docs/guides/embeddings/second-generation-models). The "vectorSearchConfiguration" is set to the name of the "vectorSearch" configuration in your index. You can define multiple configurations in the index, and then specify one per field. |
| [vectorSearch](#vectorSearch) | Optional. However, to configure your vector fields, this is a required object. Defines the configuration properties for vector search. In this preview, configuration consists of one algorithm kind ("hnsw") that's used for query execution.|

## Response

For a successful create request, you should see status code "201 Created". By default, the response body will contain the JSON for the index definition that was created. However, if the Prefer request header is set to return=minimal, the response body will be empty, and the success status code will be "204 No Content" instead of "201 Created". This is true regardless of whether PUT or POST is used to create the index.

## Examples

**Example: vector search**

Vector search is implemented at the field level. To support hybrid query scenarios, create pairs of fields for vector and non-vector queries. The "title", "titleVector", "content", "contentVector" fields follow this convention. If you also want to use semantic search, you'll need non-vector fields for those behaviors.

```json
{
    "name": "{{index-name}}",
    "fields": [
        {
            "name": "id",
            "type": "Edm.String",
            "key": true,
            "filterable": true
        },
        {
            "name": "title",
            "type": "Edm.String",
            "searchable": true,
            "retrievable": true
        },
        {
            "name": "content",
            "type": "Edm.String",
            "searchable": true,
            "retrievable": true
        },
        {
            "name": "category",
            "type": "Edm.String",
            "filterable": true,
            "searchable": true,
            "retrievable": true
        },
        {
            "name": "titleVector",
            "type": "Collection(Edm.Single)",
            "searchable": true,
            "retrievable": true,
            "dimensions": 1536,
            "vectorSearchConfiguration": "my-vector-config"
        },
        {
            "name": "contentVector",
            "type": "Collection(Edm.Single)",
            "searchable": true,
            "retrievable": true,
            "dimensions": 1536,
            "vectorSearchConfiguration": "my-vector-config"
        }
    ],
    "corsOptions": {
        "allowedOrigins": [
            "*"
        ],
        "maxAgeInSeconds": 60
    },
    "vectorSearch": {
        "algorithmConfigurations": [
            {
                "name": "my-vector-config",
                "kind": "hnsw",
                "hnswParameters": {
                    "m": 4,
                    "efConstruction": 400,
                    "metric": "cosine"
                }
            }
        ]
    },
    "semantic": {
        "configurations": [
            {
                "name": "my-semantic-config",
                "prioritizedFields": {
                    "titleField": {
                        "fieldName": "title"
                    },
                    "prioritizedContentFields": [
                        {
                            "fieldName": "content"
                        }
                    ],
                    "prioritizedKeywordsFields": [
                        {
                            "fieldName": "category"
                        }
                    ]
                }
            }
        ]
    }
}
```

**Example: Semantic Configurations**

A semantic configuration is a part of an index definition that's used to configure which fields will be utilized by semantic search for ranking, captions, highlights, and answers. To use semantic search, you must specify the name of a semantic configuration at query time. For more information, see [Create a semantic query](https://learn.microsoft.com/azure/search/semantic-how-to-query-request).

 ```json
{
    "name": "hotels",  
    "fields": [ omitted for brevity ],
    "suggesters": [ omitted for brevity ],
    "analyzers": [ omitted for brevity ],
    "semantic": {
      "configurations": [
        {
          "name": "my-semantic-config",
          "prioritizedFields": {
            "titleField": {
                  "fieldName": "hotelName"
                },
            "prioritizedContentFields": [
              {
                "fieldName": "description"
              },
              {
                "fieldName": "description_fr"
              }
            ],
            "prioritizedKeywordsFields": [
              {
                "fieldName": "tags"
              },
              {
                "fieldName": "category"
              }
            ]
          }
        }
      ]
    }
}
```

**Example: CORS Options**

 Client-side JavaScript cannot call any APIs by default since the browser will prevent all cross-origin requests. To allow cross-origin queries to your index, enable CORS ([Cross-origin resource sharing (Wikipedia)](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)) by setting the `corsOptions` attribute. For security reasons, only query APIs support CORS.

 ```json
{
    "name": "hotels",  
    "fields": [ omitted for brevity ],
    "suggesters": [ omitted for brevity ],
    "analyzers": [ omitted for brevity ],
    "corsOptions": (optional) {  
        "allowedOrigins": ["*"] | ["https://docs.microsoft.com:80", "https://azure.microsoft.com:80", ...],  
        "maxAgeInSeconds": (optional) max_age_in_seconds (non-negative integer)  
      }
}
```
