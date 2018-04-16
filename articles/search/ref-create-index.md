---
title: "Create Index (Azure Search Service REST API)"
ms.custom: ""
ms.date: 05/01/2018
ms.prod: "azure"
ms.reviewer: ""
ms.service: search
ms.suite: ""
ms.tgt_pltfrm: ""
ms.topic: rest-api
applies_to:
  - "Azure"
author: "Brjohnstmsft"
ms.author: "brjohnst"
manager: "jhubbard"
translation.priority.mt:
  - "de-de"
  - "es-es"
  - "fr-fr"
  - "it-it"
  - "ja-jp"
  - "ko-kr"
  - "pt-br"
  - "ru-ru"
  - "zh-cn"
  - "zh-tw"
---
# Create Index (Azure Search Service REST API)
  An index is the primary means of organizing and searching documents in Azure Search, similar to how a table organizes records in a database. Each index has a collection of documents that all conform to the index schema (field names, data types, and properties), but indexes also specify additional constructs (suggesters, scoring profiles, and CORS configuration) that define other search behaviors.  

 You can create a new index within an Azure Search service using an HTTP POST or PUT request. The body of the request is a JSON schema that specifies the index and configuration information.  

```  
POST https://[servicename].search.windows.net/indexes?api-version=[api-version]  
Content-Type: application/json   
api-key: [admin key]  
```  

 Alternatively, you can use PUT and specify the index name on the URI. If the index does not exist, it will be created.  

```  
PUT https://[servicename].search.windows.net/indexes/[index name]?api-version=[api-version]  
```  

 Creating an index establishes the schema and metadata. Populating the index is a separate operation. For this step, you can use an indexer (see [Indexer operations &#40;Azure Search Service REST API&#41;](indexer-operations.md), available for supported data sources) or an [Add, Update or Delete Documents &#40;Azure Search Service REST API&#41;](addupdate-or-delete-documents.md). The inverted index is generated when the documents are posted.  

> [!NOTE]  
>  The maximum number of indexes that you can create varies by pricing tier. The free service allows up to 3 indexes. Standard service allows 50 indexes per Search service. See [Service limits for Azure Search](https://azure.microsoft.com/documentation/articles/search-limits-quotas-capacity/) for details.  

## Request  
 HTTPS is required for all service requests. The **Create Index** request can be constructed using either a POST or PUT method. When using POST, provide an index name in the request body along with the index schema definition. With PUT, the index name is part of the URL. If the index doesn't exist, it is created. If it already exists, it is updated to the new definition. Notice that you can only POST or PUT one index at a time.  

 The index name must be lower case, start with a letter or number, have no slashes or dots, and be less than 128 characters. After starting the index name with a letter or number, the rest of the name can include any letter, number and dashes, as long as the dashes are not consecutive.  

 The **api-version** parameter is required. The current version is `api-version=2016-09-01`. See [API versions in Azure Search](https://go.microsoft.com/fwlink/?linkid=834796) for a list of available versions. See [Language support &#40;Azure Search Service REST API&#41;](language-support.md) for details about language analyzers.  

### Request Headers  
 The following table describes the required and optional request headers.  

|Request Header|Description|  
|--------------------|-----------------|  
|*Content-Type:*|Required. Set this to `application/json`|  
|*api-key:*|Required. The `api-key` is used to authenticate the request to your Search service. It is a string value, unique to your service. The **Create Index** request must include an `api-key` header set to your admin key (as opposed to a query key).|  

 You will also need the service name to construct the request URL. You can get both the service name and `api-key` from your service dashboard in the Azure classic portal. See [Create an Azure Search service in the portal](https://azure.microsoft.com/documentation/articles/search-create-service-portal/) for page navigation help.  

### Request Body Syntax  
 The body of the request contains a schema definition, which includes the list of data fields within documents that will be fed into this index.  

 Note that for a POST request, you must specify the index name in the request body.  

 There can only be one **key** field in the index. It has to be a string field. This field represents the unique identifier for each document stored with the index.  

 The main parts of an index include the following:  

-   **name**  

-   **fields** that will be fed into this index, including name, data type, and properties that define allowable actions on that field.  

-   **suggesters** used for type-ahead queries.  

-   **scoringProfiles** used for custom search score ranking. See [Add scoring profiles to a search index &#40;Azure Search Service REST API&#41;](add-scoring-profiles-to-a-search-index.md).  

-   **analyzers**, **charFilters**, **tokenizers**, **tokenFilters** used to define how your documents/queries are broken into indexable/searchable tokens. See [Analysis in Azure Search](https://aka.ms//azsanalysis) for details.

-   **defaultScoringProfile** used to overwrite the default scoring behaviors.  

-   **corsOptions** to allow cross-origin queries against your index.  

 The syntax for structuring the request payload is as follows. A sample request is provided further on in this topic.  

```  
{  
  "name": (optional on PUT; required on POST) "name_of_index",  
  "fields": [  
    {  
      "name": "name_of_field",  
      "type": "Edm.String | Collection(Edm.String) | Edm.Int32 | Edm.Int64 | Edm.Double | Edm.Boolean | Edm.DateTimeOffset | Edm.GeographyPoint",  
      "searchable": true (default where applicable) | false (only Edm.String and Collection(Edm.String) fields can be searchable),  
      "filterable": true (default) | false,  
      "sortable": true (default where applicable) | false (Collection(Edm.String) fields cannot be sortable),  
      "facetable": true (default where applicable) | false (Edm.GeographyPoint fields cannot be facetable),  
      "key": true | false (default, only Edm.String fields can be keys),  
      "retrievable": true (default) | false,  
      "analyzer": "name of the analyzer used for search and indexing", (only if 'searchAnalyzer' and 'indexAnalyzer' are not set)
      "searchAnalyzer": "name of the search analyzer", (only if 'indexAnalyzer' is set and 'analyzer' is not set)
      "indexAnalyzer": "name of the indexing analyzer" (only if 'searchAnalyzer' is set and 'analyzer' is not set)
    }  
  ],  
  "suggesters": [  
    {  
      "name": "name of suggester",  
      "searchMode": "analyzingInfixMatching" (other modes may be added in the future),  
      "sourceFields": ["field1", "field2", ...]  
    }  
  ],  
  "scoringProfiles": [  
    {  
      "name": "name of scoring profile",  
      "text": (optional, only applies to searchable fields) {  
        "weights": {  
          "searchable_field_name": relative_weight_value (positive #'s),  
          ...  
        }  
      },  
      "functions": (optional) [  
        {  
          "type": "magnitude | freshness | distance | tag",  
          "boost": # (positive number used as multiplier for raw score != 1),  
          "fieldName": "...",  
          "interpolation": "constant | linear (default) | quadratic | logarithmic",  
          "magnitude": {  
            "boostingRangeStart": #,  
            "boostingRangeEnd": #,  
            "constantBoostBeyondRange": true | false (default)  
          },  
          "freshness": {  
            "boostingDuration": "..." (value representing timespan leading to now over which boosting occurs)  
          },  
          "distance": {  
            "referencePointParameter": "...", (parameter to be passed in queries to use as reference location)  
            "boostingDistance": # (the distance in kilometers from the reference location where the boosting range ends)  
          },  
          "tag": {  
            "tagsParameter": "..." (parameter to be passed in queries to specify a list of tags to compare against target fields)  
          }  
        }  
      ],  
      "functionAggregation": (optional, applies only when functions are specified)   
        "sum (default) | average | minimum | maximum | firstMatching"  
    }  
  ],  
  "analyzers":(optional)[ ... ],
  "charFilters":(optional)[ ... ],
  "tokenizers":(optional)[ ... ],
  "tokenFilters":(optional)[ ... ],
  "defaultScoringProfile": (optional) "...",  
  "corsOptions": (optional) {  
    "allowedOrigins": ["*"] | ["origin_1", "origin_2", ...],  
    "maxAgeInSeconds": (optional) max_age_in_seconds (non-negative integer)  
  }  
}  
```  

###  <a name="bkmk_indexAttrib"></a> Index Attributes  
 The following attributes can be set when creating an index.  

|Attribute|Description|  
|---------------|-----------------|  
|**name**|Sets the name of the field.|  
|**type**|Sets the data type for the field. See [Supported data types &#40;Azure Search&#41;](supported-data-types.md) for a list of supported types.|  
|**key**|Marks the field as containing unique identifiers for documents within the index. Exactly one field must be chosen as the key field and it must be of type `Edm.String`. Key fields can be used to look up documents directly. See [Lookup Document &#40;Azure Search Service REST API&#41;](lookup-document.md) for details.|  
|**retrievable**|Sets whether the field can be returned in a search result. This is useful when you want to use a field (e.g., margin) as a filter, sorting, or scoring mechanism but do not want the field to be visible to the end user. This attribute must be `true` for `key` fields.|  
|**searchable**|Marks the field as full-text search-able. This means it will undergo analysis such as word-breaking during indexing. If you set a searchable field to a value like "sunny day", internally it will be split into the individual tokens "sunny" and "day". This enables full-text searches for these terms. Fields of type `Edm.String` or `Collection(Edm.String)` are **searchable** by default. Fields of other types are not **searchable**. **Note:**  **searchable** fields consume extra space in your index since Azure Search will store an additional tokenized version of the field value for full-text searches. If you want to save space in your index and you don't need a field to be included in searches, set **searchable** to `false`.|  
|**filterable**|Allows the field to be referenced in **$filter** queries. **filterable** differs from searchable in how strings are handled. Fields of type `Edm.String` or `Collection(Edm.String)` that are **filterable** do not undergo word-breaking, so comparisons are for exact matches only. For example, if you set such a field f to "sunny day", `$filter=f eq 'sunny'` will find no matches, but `$filter=f eq 'sunny day'` will. All fields are **filterable** by default.|  
|**sortable**|By default the system sorts results by score, but in many experiences users will want to sort by fields in the documents. Fields of type `Collection(Edm.String)` cannot be **sortable**. All other fields are **sortable** by default.|  
|**facetable**|Typically used in a presentation of search results that includes hit count by category (e.g. search for digital cameras and see hits by brand, by megapixels, by price, etc.). This option cannot be used with fields of type `Edm.GeographyPoint`. All other fields are **facetable** by default. **Note:**  Fields of type `Edm.String` that are **filterable**, **sortable**, or **facetable** can be at most 32 kilobytes in length. This is because such fields are treated as a single search term, and the maximum length of a term in Azure Search is 32K kilobytes. If you need to store more text than this in a single string field, you will need to explicitly set **filterable**, **sortable**, and **facetable** to `false` in your index definition. **Note:**  If a field has none of the above attributes set to `true` (searchable, filterable, sortable, facetable) the field is effectively excluded from the inverted index. This option is useful for fields that are not used in queries, but are needed in search results. Excluding such fields from the index improves performance.|  
|**analyzer**|Sets the name of the language analyzer to use for the field. For the allowed set of values see [Language support &#40;Azure Search Service REST API&#41;](language-support.md). This option can be used only with **searchable** fields and it can't be set together with either `searchAnalyzer` or `indexAnalyzer`. Once the analyzer is chosen, it cannot be changed for the field.|  
|**searchAnalyzer**|Sets the name of the analyzer used at search time for the field. For the allowed set of values see [Analyzers](https://msdn.microsoft.com/library/mt605304.aspx). This option can be used only with `searchable` fields. It must be set together with `indexAnalyzer` and it cannot be set together with the `analyzer` option. This analyzer can be updated on an existing field.|
|**indexAnalyzer**|Sets the name of the analyzer used at indexing time for the field. For the allowed set of values see [Analyzers](https://msdn.microsoft.com/library/mt605304.aspx). This option can be used only with `searchable` fields. It must be set together with `searchAnalyzer` and it cannot be set together with the `analyzer` option. Once the analyzer is chosen, it cannot be changed for the field.|

###  <a name="bkmk_suggester"></a> Suggesters  
 A `suggester` is a section of the schema that defines which fields in an index are used to support auto-complete or type-ahead queries in searches. Typically partial search strings are sent to the [Suggestions &#40;Azure Search Service REST API&#41;](suggestions.md) while the user is typing a search query, and the API returns a set of suggested phrases. A **suggester** that you define in the index determines which fields are used to build the type-ahead search terms. See [Suggesters](suggesters.md) for configuration details.  

###  <a name="bkmk_scoringprof"></a> Scoring Profiles  
 A scoring profile is a section of the schema that defines custom scoring behaviors that let you influence which items appear higher in the search results. Scoring profiles are made up of field weights and functions. To use them, you specify a profile by name on the query string.  

 A default scoring profile operates behind the scenes to compute a search score for every item in a result set. You can use the internal, unnamed scoring profile. Alternatively, set **defaultScoringProfile** to use a custom profile as the default, invoked whenever a custom profile is not specified on the query string.  

 See [Add scoring profiles to a search index &#40;Azure Search Service REST API&#41;](add-scoring-profiles-to-a-search-index.md) for details.  

###  <a name="bkmk_cors"></a> CORS Options  
 Client-side JavaScript cannot call any APIs by default since the browser will prevent all cross-origin requests. To allow cross-origin queries to your index, enable CORS (Cross-Origin Resource Sharing) by setting the **corsOptions** attribute. Note that for security reasons, only query APIs support CORS. The following options can be set for CORS:  

|||  
|-|-|  
|**allowedOrigins** (required):|This is a list of origins that will be granted access to your index. This means that any JavaScript code served from those origins will be allowed to query your index (assuming it provides the correct `api-key`). Each origin is typically of the form protocol://\<fully-qualified-domain-name>:\<port> although the \<port> is often omitted. See [Cross-origin resource sharing (Wikipedia)](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing) for more details.<br /><br /> If you want to allow access to all origins, include \* as a single item in the **allowedOrigins** array. Note that **this is not recommended practice for production search services**. However, it may be useful for development or debugging purposes.|  
|**maxAgeInSeconds** (optional):|Browsers use this value to determine the duration (in seconds) to cache CORS preflight responses. This must be a non-negative integer. The larger this value is, the better performance will be, but the longer it will take for CORS policy changes to take effect. If it is not set, a default duration of 5 minutes will be used.|  

<a name="CreateUpdateIndexExample"></a>
### Request Body Example  
 You can have up to 1000 fields in each index. See [Service limits for Azure Search](https://azure.microsoft.com/documentation/articles/search-limits-quotas-capacity/) and [Naming rules &#40;Azure Search&#41;](naming-rules.md) for information about maximum limits and allowable characters.  

```  
{
 "name": "hotels",  
 "fields": [
  {"name": "hotelId", "type": "Edm.String", "key": true, "searchable": false},
  {"name": "baseRate", "type": "Edm.Double"},
  {"name": "description", "type": "Edm.String", "filterable": false, "sortable": false, "facetable": false},
  {"name": "description_fr", "type": "Edm.String", "filterable": false, "sortable": false, "facetable": false, "analyzer": "fr.lucene"},
  {"name": "hotelName", "type": "Edm.String"},
  {"name": "category", "type": "Edm.String"},
  {"name": "tags", "type": "Collection(Edm.String)", "analyzer": "tagsAnalyzer"},
  {"name": "parkingIncluded", "type": "Edm.Boolean"},
  {"name": "smokingAllowed", "type": "Edm.Boolean"},
  {"name": "lastRenovationDate", "type": "Edm.DateTimeOffset"},
  {"name": "rating", "type": "Edm.Int32"},
  {"name": "location", "type": "Edm.GeographyPoint"}
 ],
 "suggesters": [
  {
   "name": "sg",
   "searchMode": "analyzingInfixMatching",
   "sourceFields": ["hotelName"]
  }
 ],
 "analyzers": [
  {
   "name": "tagsAnalyzer",
   "@odata.type": "#Microsoft.Azure.Search.CustomAnalyzer",
   "charFilters": [ "html_strip" ],
   "tokenizer": "standard_v2"
  }
 ]
}
```  

## Response  
 For a successful request, you should see status code "201 Created".  

 By default, the response body will contain the JSON for the index definition that was created. However, if the Prefer request header is set to return=minimal, the response body will be empty, and the success status code will be "204 No Content" instead of "201 Created". This is true regardless of whether PUT or POST is used to create the index.   

