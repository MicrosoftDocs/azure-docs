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

**2023-07-01-Preview** adds:

+ [**algorithmConfigurations**](#vectorsearch) used for selecting a vector search algorithm type and configuring parameters.
+ [**Collection(Edm.Single)**](#fields) data type, required for a vector field. This represents a single-precision floating-point number as the primitive type.
+ [**dimensions**](#fields) property, required for a vector field. This represents the dimensionality of your vector embeddings.
+ [**vectorSearchConfiguration**](#fields) property, required for a vector field. This selects the algorithm configuration you specified.

Both new and existing indexes support vector search. However, there is a small subset of old services that do not support vector search. In this case, a new search service must be created to use it. Updating an existing index to add vector fields requires `allowIndexDowntime` query parameter (see below).

An [index](https://learn.microsoft.com/azure/search/search-what-is-an-index) specifies the index schema, including the fields collection (field names, data types, and attributes), but also additional constructs (vector configuration, semantic search configuration, and CORS configuration) that define other search behaviors.

You can use either POST or PUT on a create request. For either one, the request body provides the object definition.

```http
POST https://[servicename].search.windows.net/indexes?api-version=2023-07-01-preview  
  Content-Type: application/json
  api-key: [admin key]  
```  

**Creating an index** establishes the schema and metadata. Populating the index uses the [Add, Update, or Delete Documents](upload-documents.md) API, or an indexer.

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
      "searchable": true (default where applicable)
      "filterable": false,  
      "sortable": false,  
      "facetable": false,  
      "key": false,
      "retrievable": true (default) | false,  
      "analyzer": "",
      "searchAnalyzer": "",
      "indexAnalyzer": "",
      "normalizer": "",
      "synonymMaps": "",
      "dimensions": integer such as 1536,
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
| [corsOptions](#corsoptions) | Optional. Used for cross-origin queries to your index. | 
| [semantic](#semantic) | Optional.  Defines the parameters of a search index that influence semantic search capabilities. A semantic configuration is required for semantic queries. For more information, see [Create a semantic query](https://learn.microsoft.com/azure/search/semantic-how-to-query-request).|
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

## Definitions

|Link|Description|
|--|--|
| [fields](#bkmk_indexAttrib) | Sets definitions and attributes of a field in a search index. |
| [corsOptions](#corsoptions) | Optional. Used for cross-origin queries to your index. | 
| [semantic](#semantic) | Configures fields used by semantic search for ranking, captions, highlights, and answers.  |
| [vectorSearch](#vectorSearch) | Configures the algorithm used for vector fields.  |

 <a name="bkmk_indexAttrib"> </a>

### fields

Contains information about attributes set on a search field when creating an index.

|Attribute|Description|  
|---------------|-----------------|  
|name|Required. Sets the name of the field, which must be unique within the fields collection of the index or parent field.|  
|type|Required. Sets the data type for the field. Fields can be simple or complex. Simple fields are of primitive types, like `Edm.String` for text or `Edm.Int32` for integers. [Complex fields](https://learn.microsoft.com/azure/search/search-howto-complex-data-types) can have sub-fields that are themselves either simple or complex. This allows you to model objects and arrays of objects, which in turn enables you to upload most JSON object structures to your index. `Collection(Edm.Single)` accommodates single-precision floating point numbers, or double-precision floating point numbers. It's used only for vector fields, and it's required. |  
|key|Required. Set this attribute to true to designate that a field's values uniquely identify documents in the index. The maximum length of values in a key field is 1024 characters. Exactly one top-level field in each index must be chosen as the key field and it must be of type `Edm.String`. Default is `false` for simple fields and `null` for complex fields. </br></br>Key fields can be used to look up documents directly and update or delete specific documents. The values of key fields are handled in a case-sensitive manner when looking up or indexing documents.|  
|retrievable| Indicates whether the field can be returned in a search result. Set this attribute to `false` if you want to use a field (for example, margin) as a filter, sorting, or scoring mechanism but do not want the field to be visible to the end user. This attribute must be `true` for key fields, and it must be `null` for complex fields. This attribute can be changed on existing fields. Setting retrievable to `true` does not cause any increase in index storage requirements. Default is `true` for simple fields and vector fields, and `null` for complex fields.|  
|searchable| Indicates whether the field is in-scope for queries. If it's a string, it will undergo [lexical analysis](https://learn.microsoft.com/azure/search/search-analyzers) such as word-breaking during indexing. If it's a vector, it can be used in vector search. This attribute must be `false` for simple fields of other non-string data types, and it must be `null` for complex fields. </br></br>A searchable field consumes extra space in your index since Azure Cognitive Search will process the contents of those fields and organize them in auxiliary data structures for performant searching. If you want to save space in your index and you don't need a field to be included in searches, set searchable to `false`. See [How full-text search works in Azure Cognitive Search](https://learn.microsoft.com/azure/search/search-lucene-query-architecture) for details. |  
|filterable| Indicates whether to enable the field to be referenced in `$filter` queries. Filterable differs from searchable in how strings are handled. Fields of type `Edm.String` or `Collection(Edm.String)` that are filterable do not undergo lexical analysis, so comparisons are for exact matches only. For example, if you set such a field `f` to "Sunny day", `$filter=f eq 'sunny'` will find no matches, but `$filter=f eq 'Sunny day'` will. This attribute must be `null` for complex fields. Default is `true` for simple fields,  `null` for complex fields, and `false` for vector fields. To reduce index size, set this attribute to `false` on fields that you won't be filtering on.|  
|sortable| Indicates whether to enable the field to be referenced in `$orderby` expressions. By default Azure Cognitive Search sorts results by score, but in many experiences users will want to sort by fields in the documents. A simple field can be sortable only if it is single-valued (it has a single value in the scope of the parent document). </br></br>Simple collection fields cannot be sortable, since they are multi-valued. Simple sub-fields of complex collections are also multi-valued, and therefore cannot be sortable. This is true whether it's an immediate parent field, or an ancestor field, that's the complex collection. Complex fields cannot be sortable and the sortable attribute must be `null` for such fields. The default for sortable is `true` for single-valued simple fields, `false` for multi-valued simple fields and vector fields,and `null` for complex fields.|  
|facetable| Indicates whether to enable the field to be referenced in facet queries. Typically used in a presentation of search results that includes hit count by category (for example, search for digital cameras and see hits by brand, by megapixels, by price, and so on). This attribute must be `null` for complex fields and `false` for vector fields. Fields of type `Edm.GeographyPoint`, `Collection(Edm.GeographyPoint)`, or `Collection(Edm.Single)` cannot be facetable. Default is `true` for all other simple fields. To reduce index size, set this attribute to `false` on fields that you won't be faceting on. |
|analyzer|Sets the lexical analyzer for tokenizing strings during indexing and query operations. Valid values for this property include [language analyzers](https://learn.microsoft.com/azure/search/index-add-language-analyzers), [built-in analyzers](/azure/search/index-add-custom-analyzers#built-in-analyzers), and [custom analyzers](https://learn.microsoft.com/azure/search/index-add-custom-analyzers). The default is `standard.lucene`. This attribute can only be used with searchable string fields, and it can't be set together with either searchAnalyzer or indexAnalyzer. Once the analyzer is chosen and the field is created in the index, it cannot be changed for the field. Must be `null` for [complex fields](https://learn.microsoft.com/azure/search/search-howto-complex-data-types). |  

> [!NOTE]  
> Fields of type `Edm.String` that are filterable, sortable, or facetable can be at most 32 kilobytes in length. This is because values of such fields are treated as a single search term, and the maximum length of a term in Azure Cognitive Search is 32 kilobytes. If you need to store more text than this in a single string field, you will need to explicitly set filterable, sortable, and facetable to `false` in your index definition.
>
> Setting a field as searchable, filterable, sortable, or facetable has an impact on index size and query performance. Don't set those attributes on fields that are not meant to be referenced in query expressions.
>
> If a field is not set to be searchable, filterable, sortable, or facetable, the field can't be referenced in any query expression. This is useful for fields that are not used in queries, but are needed in search results.

<a name="corsoptions"> </a>

### corsOptions

Client-side JavaScript cannot call any APIs by default since the browser will prevent all cross-origin requests. To allow cross-origin queries to your index, enable CORS (Cross-Origin Resource Sharing) by setting the "corsOptions" attribute. For security reasons, only query APIs support CORS. 

|Attribute|Description|  
|---------------|-----------------|  
| allowedOrigins | Required. A comma-delimited list of origins that will be granted access to your index, where each origin is typically of the form protocol://\<fully-qualified-domain-name>:\<port> (although the \<port> is often omitted).  This means that any JavaScript code served from those origins will be allowed to query your index (assuming it provides a valid API key). If you want to allow access to all origins, specify `*` as a single item in the "allowedOrigins" array. This is not recommended for production, but might be useful for development or debugging. |
| maxAgeInSeconds | Optional. Browsers use this value to determine the duration (in seconds) to cache CORS preflight responses. This must be a non-negative integer. The larger this value is, the better performance will be, but the longer it will take for CORS policy changes to take effect. If it is not set, a default duration of 5 minutes will be used. |

<a name="semantic"></a>

### semantic

A semantic configuration is a part of an index definition that's used to configure which fields will be utilized by semantic search for ranking, captions, highlights, and answers. Semantic configurations are made up of a title field, prioritized content fields, and prioritized keyword fields. At least one field needs to be specified between all three sub-properties (titleField, prioritizedKeywordsFields and prioritizedContentFields). Any field of type `Edm.String` or `Collection(Edm.String)` can be used as part of a semantic configuration.

To use semantic search, you must specify the name of a semantic configuration at query time. For more information, see [Create a semantic query](https://learn.microsoft.com/azure/search/semantic-how-to-query-request).

 ```json
{
    "name": "hotels",  
    "fields": [ omitted for brevity ],
    "suggesters": [ omitted for brevity ],
    "analyzers": [ omitted for brevity ],
    "semantic": {
      "configurations": [
        {
          "name": "name of the semantic configuration",
          "prioritizedFields": {
            "titleField": {
                  "fieldName": "..."
                },
            "prioritizedContentFields": [
              {
                "fieldName": "..."
              },
              {
                "fieldName": "..."
              }
            ],
            "prioritizedKeywordsFields": [
              {
                "fieldName": "..."
              },
              {
                "fieldName": "..."
              }
            ]
          }
        }
      ]
    }
}
```

|Attribute|Description|  
|---------------|-----------------|  
|name|Required. The name of the semantic configuration.|  
|prioritizedFields|Required. Describes the title, content, and keyword fields to be used for semantic ranking, captions, highlights, and answers. At least one of the three sub-properties (titleField, prioritizedKeywordsFields and prioritizedContentFields) need to be set. | 
|prioritizedFields.titleField|Defines the title field to be used for semantic ranking, captions, highlights, and answers. If you don't have a title field in your index, leave this blank.| 
|prioritizedFields.prioritizedContentFields|Defines the content fields to be used for semantic ranking, captions, highlights, and answers. For the best result, the selected fields should contain text in natural language form. The order of the fields in the array represents their priority. Fields with lower priority may get truncated if the content is long.| 
|prioritizedFields.prioritizedKeywordsFields|Defines the keyword fields to be used for semantic ranking, captions, highlights, and answers. For the best result, the selected fields should contain a list of keywords. The order of the fields in the array represents their priority. Fields with lower priority may get truncated if the content is long.|

<a name="vectorSearch"></a>

### vectorSearch

A vectorSearch configuration is a part of an index definition that's used to configure the algorithms used for vector fields.

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
|name|Required. The name of the algorithm configuration. |
|kind| Must be '"hnsw"` for the Hierarchical Navigable Small World (HNSW) algorithm. |
|hnswParameters | Parameters for "hnsw" include the following: <br><br>"m": Integer. The number of bi-directional links created for every new element during construction. A default value of 4 will be used if this is omitted or null. Larger values lead to denser graphs, improving query performance, but requires more memory and computation. The allowable range is 4 to 10, and the default is 4. </br></br>"efConstruction": Integer. The size of the dynamic list for the nearest neighbors used during indexing. Larger values lead to a better index quality, but requires more memory and computation. A default value of 400 will be used if this is omitted or null. The allowable range is 100 to 1000. </br></br>"metric": String. The similarity metric to use for vector comparisons. For hnsw, the allowed values are "cosine", "euclidean", and "dotProduct". A default value of "cosine" will be used if this is omitted or null. </br></br>"efSearch": Integer. The size of the dynamic list containing the nearest neighbors, which is used during search time. Increasing this parameter may improve search results, at the expense of slower search. Increasing this parameter leads to diminishing returns. A default value 500 will be used if this is omitted or null. The allowable range will be 100 to 1000. |

## See also

+ [Create a semantic configuration](https://learn.microsoft.com/azure/search/semantic-how-to-query-request)



<!-- Robert, for private preview, we relied on quickstarts and demos to explain how to get vectors into an index, but customers will expect to see a how-to from us that explains this basic task.  You would mention that vector generation isn't part of it, and link out to the other how-to. You'd emphasize that we don't have vector indexes, just vector fields in an index.  

One more point: after revisiting the FAQ, I'm reminded that you cannot add vector fields to an existing index. You have to create a new index with the preview REST API 2023-07-01-preview. -->