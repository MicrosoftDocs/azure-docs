<properties
   pageTitle="Azure Search Service REST API Version 2015-02-28-Preview | Microsoft Azure | Azure Search Preview API"
   description="Azure Search Service REST API Version 2015-02-28-Preview includes experimental features such as Natural Language Analyzers and moreLikeThis searches."
   services="search"
   documentationCenter="na"
   authors="brjohnstmsft"
   manager="pablocas"
   editor=""/>

<tags
   ms.service="search"
   ms.devlang="rest-api"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="search"
   ms.date="07/25/2016"
   ms.author="brjohnst"/>

# Azure Search Service REST API: Version 2015-02-28-Preview

This article is the reference documentation for `api-version=2015-02-28-Preview`. This preview extends the current generally available version, [api-version=2015-02-28](https://msdn.microsoft.com/library/dn798935.aspx), by providing the following experimental features:

- `moreLikeThis` query parameter in the [Search Documents](#SearchDocs) API. It finds other documents that are relevant to another specific document.

A few additional parts of the `2015-02-28-Preview` REST API are documented separately. These include:

- [Scoring Profiles](search-api-scoring-profiles-2015-02-28-preview.md)
- [Indexers](search-api-indexers-2015-02-28-preview.md)

Azure Search service is available in multiple versions. Please refer to [Search Service Versioning](http://msdn.microsoft.com/library/azure/dn864560.aspx) for details.

## APIs in this document

Azure Search service API supports two URL syntaxes for API operations: simple and OData (see [Support for OData (Azure Search API)](http://msdn.microsoft.com/library/azure/dn798932.aspx) for details). The following list shows the simple syntax.

[Create Index](#CreateIndex)

    POST /indexes?api-version=2015-02-28-Preview

[Update Index](#UpdateIndex)

    PUT /indexes/[index name]?api-version=2015-02-28-Preview

[Get Index](#GetIndex)

    GET /indexes/[index name]?api-version=2015-02-28-Preview

[Listing Indexes](#ListIndexes)

    GET /indexes?api-version=2015-02-28-Preview

[Get Index Statistics](#GetIndexStats)

    GET /indexes/[index name]/stats?api-version=2015-02-28-Preview

[Test Analyzer](#TestAnalyzer)

    GET /indexes/[index name]/analyze?api-version=2015-02-28-Preview

[Delete an Index](#DeleteIndex)

    DELETE /indexes/[index name]?api-version=2015-02-28-Preview

[Add, Delete, and Update Data within an Index](#AddOrUpdateDocuments)

    POST /indexes/[index name]/docs/index?api-version=2015-02-28-Preview

[Search Documents](#SearchDocs)

    GET /indexes/[index name]/docs?[query parameters]
    POST /indexes/[index name]/docs/search?api-version=2015-02-28-Preview

[Lookup Document](#LookupAPI)

     GET /indexes/[index name]/docs/[key]?[query parameters]

[Count Documents](#CountDocs)

    GET /indexes/[index name]/docs/$count?api-version=2015-02-28-Preview

[Suggestions](#Suggestions)

    GET /indexes/[index name]/docs/suggest?[query parameters]
    POST /indexes/[index name]/docs/suggest?api-version=2015-02-28-Preview

________________________________________
<a name="IndexOps"></a>
## Index Operations

You can create and manage indexes in Azure Search service via simple HTTP requests (POST, GET, PUT, DELETE) against a given index resource. To create an index, you first POST a JSON document that describes the index schema. The schema defines the fields of the index, their data types, and how they can be used (for example, in full-text searches, filters, sorting, or faceting). It also defines scoring profiles, suggesters and other attributes to configure the behavior of the index.

The following example provides an illustration of a schema used for searching on hotel information with the Description field defined in two languages. Notice how attributes control how the field is used. For example the `hotelId` is used as the document key (`"key": true`) and is excluded from full-text searches (`"searchable": false`).

    {
    "name": "hotels",  
    "fields": [
      {"name": "hotelId", "type": "Edm.String", "key": true, "searchable": false},
      {"name": "baseRate", "type": "Edm.Double"},
      {"name": "description", "type": "Edm.String", "filterable": false, "sortable": false, "facetable": false},
	  {"name": "description_fr", "type": "Edm.String", "filterable": false, "sortable": false, "facetable": false, "analyzer": "fr.lucene"},
      {"name": "hotelName", "type": "Edm.String"},
      {"name": "category", "type": "Edm.String"},
      {"name": "tags", "type": "Collection(Edm.String)"},
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
     ]
    }

After the index is created, you'll upload documents that populate the index. See [Add or Update Documents](#AddOrUpdateDocuments) for this next step.

For a video introduction to indexing in Azure Search, see the [Channel 9 Cloud Cover episode on Azure Search](http://go.microsoft.com/fwlink/p/?LinkId=511509).


<a name="CreateIndex"></a>
## Create Index

An index is the primary means of organizing and searching documents in Azure Search, similar to how a table organizes records in a database. Each index has a collection of documents that all conform to the index schema (field names, data types, and properties), but indexes also specify additional constructs (suggesters, scoring profiles, and CORS options) that define other search behaviors.

You can create a new index within an Azure Search service using an HTTP POST or PUT request. The body of the request is a JSON schema that specifies the index and configuration information.

    POST https://[service name].search.windows.net/indexes?api-version=[api-version]
    Content-Type: application/json
    api-key: [admin key]

Alternatively, you can use PUT and specify the index name on the URI. If the index does not exist, it will be created.

    PUT https://[search service url]/indexes/[index name]?api-version=[api-version]

Creating an index determines the structure of the documents stored and used in search operations. Populating the index is a separate operation. For this step, you can use an [indexer](https://msdn.microsoft.com/library/azure/mt183328.aspx) (available for supported data sources) or an [Add, Update, or Delete Documents](https://msdn.microsoft.com/library/azure/dn798930.aspx) operation. The inverted index is generated when the documents are posted.

**Note**: The maximum number of indexes allowed varies by pricing tier. The free service allows up to 3 indexes. Standard service allows 50 indexes per Search service. See [Limits and constraints](http://msdn.microsoft.com/library/azure/dn798934.aspx) for details.

**Request**

HTTPS is required for all service requests. The **Create Index** request can be constructed using either a POST or PUT method. When using POST, you must provide an index name in the request body along with the index schema definition. With PUT, the index name is part of the URL. If the index doesn't exist, it is created. If it already exists, it is updated to the new definition.

The index name must be lower case, start with a letter or number, have no slashes or dots, and be less than 128 characters. After starting the index name with a letter or number, the rest of the name can include any letter, number and dashes, as long as the dashes are not consecutive.

The `api-version` is required. See [Search Service Versioning](http://msdn.microsoft.com/library/azure/dn864560.aspx) for a list of available versions.

**Request Headers**

The following list describes the required and optional request headers.

- `Content-Type`: Required. Set this to `application/json`
- `api-key`: Required. The `api-key` is used to
- authenticate the request to your Search service. It is a string value, unique to your service. The **Create Index** request must include an `api-key` header set to your admin key (as opposed to a query key).

You will also need the service name to construct the request URL. You can get both the service name and `api-key` from your service dashboard in the Azure Portal. See [Create an Azure Search service in the portal](search-create-service-portal.md) for page navigation help.

<a name="RequestData"></a>
**Request Body Syntax**

The body of the request contains a schema definition, which includes the list of data fields within documents that will be fed into this index, data types, attributes, as well as an optional list of scoring profiles that are used to score matching documents at query time.

Note that for a POST request, you must specify the index name in the request body.

There can only be one key field in the index. It has to be a string field. This field represents the unique identifier for each document stored within the index.

The main parts of an index include the following:

- `name`
- `fields` that will be fed into this index, including name, data type, and properties that define allowable actions on that field.
- `suggesters` used for auto-complete or type-ahead queries.
- `scoringProfiles` used for custom search score ranking. See [Add scoring profiles](https://msdn.microsoft.com/library/azure/dn798928.aspx) for details.
- `analyzers`, `charFilters`, `tokenizers`, `tokenFilters` used to define how your documents/queries are broken into indexable/searchable tokens. See [Analysis in Azure Search](https://aka.ms//azsanalysis) for details.
- `defaultScoringProfile` used to overwrite the default scoring behaviors.
- `corsOptions` to allow cross-origin queries against your index.

The syntax for structuring the request payload is as follows. A sample request is provided further on in this topic.

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
              "searchable_field_name": relative_weight_value (positive numbers),
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
                "referencePointParameter": "...", (parameter to be passed in queries to use as reference location, see "scoringParameter" for syntax details)
                "boostingDistance": # (the distance in kilometers from the reference location where the boosting range ends)
              },
			  "tag": {
				"tagsParameter": "..." (parameter to be passed in queries to specify list of tags to compare against target field, see "scoringParameter" for syntax details)
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

**Index Attributes**

The following attributes can be set when creating an index. For details about scoring and scoring profiles, see [Add scoring Profiles](https://msdn.microsoft.com/library/azure/dn798928.aspx).

`name` - Sets the name of the field.

`type` - Sets the data type for the field. See [Supported Data Types](#DataTypes) for a list of supported types.

`searchable` - Marks the field as full-text search-able. This means it will undergo analysis such as word-breaking during indexing. If you set a `searchable` field to a value like "sunny day", internally it will be split into the individual tokens "sunny" and "day". This enables full-text searches for these terms. Fields of type `Edm.String` or `Collection(Edm.String)` are `searchable` by default. Fields of other types cannot be `searchable`.

  - **Note**: `searchable` fields consume extra space in your index since Azure Search will store an additional tokenized version of the field value for full-text searches. If you want to save space in your index and you don't need a field to be included in searches, set `searchable` to `false`.

`filterable` - Allows the field to be referenced in `$filter` queries. `filterable` differs from `searchable` in how strings are handled. Fields of type `Edm.String` or `Collection(Edm.String)` that are `filterable` do not undergo word-breaking, so comparisons are for exact matches only. For example, if you set such a field `f` to "sunny day", `$filter=f eq 'sunny'` will find no matches, but `$filter=f eq 'sunny day'` will. All fields are `filterable` by default.

`sortable` - By default the system sorts results by score, but in many experiences users will want to sort by fields in the documents. Fields of type `Collection(Edm.String)` cannot be `sortable`. All other fields are `sortable` by default.

`facetable`- Typically used in a presentation of search results that includes hit count by category (for example, search for digital cameras and see hits by brand, by megapixels, by price, etc.). This option cannot be used with fields of type `Edm.GeographyPoint`. All other fields are `facetable` by default.

  - **Note**: Fields of type `Edm.String` that are `filterable`, `sortable`, or `facetable` can be at most 32KB in length. This is because such fields are treated as a single search term, and the maximum length of a term in Azure Search is 32KB. If you need to store more text than this in a single string field, you will need to explicitly set `filterable`, `sortable`, and `facetable` to `false` in your index definition.

  - **Note**: If a field has none of the above attributes set to `true` (`searchable`, `filterable`, `sortable`,  or`facetable`) the field is effectively excluded from the inverted index. This option is useful for fields that are not used in queries, but are needed in search results. Excluding such fields from the index improves performance.

`key` - Marks the field as containing unique identifiers for documents within the index. Exactly one field must be chosen as the `key` field and it must be of type `Edm.String`. Key fields can be used to look up documents directly via the [Lookup API](#LookupAPI).

`retrievable` - Sets whether the field can be returned in a search result.  This is useful when you want to use a field (for example, margin) as a filter, sorting, or scoring mechanism but do not want the field to be visible to the end user. This attribute must be `true` for `key` fields.

`analyzer` - Sets the name of the analyzer to use for the field at search time and indexing time. For the allowed set of values see [Analyzers](https://msdn.microsoft.com/library/mt605304.aspx). This option can be used only with `searchable` fields and it can't be set together with either `searchAnalyzer` or `indexAnalyzer`.  Once the analyzer is chosen, it cannot be changed for the field.

`searchAnalyzer` - Sets the name of the analyzer used at search time for the field. For the allowed set of values see [Analyzers](https://msdn.microsoft.com/library/mt605304.aspx). This option can be used only with `searchable` fields. It must be set together with `indexAnalyzer` and it cannot be set together with the `analyzer` option. This analyzer can be updated on an existing field.

`indexAnalyzer` - Sets the name of the analyzer used at indexing time for the field. For the allowed set of values see [Analyzers](https://msdn.microsoft.com/library/mt605304.aspx). This option can be used only with `searchable` fields. It must be set together with `searchAnalyzer` and it cannot be set together with the `analyzer` option. Once the analyzer is chosen, it cannot be changed for the field.

`suggesters` - Sets the search mode and fields that are the source of the content for suggestions. See [Suggesters](#Suggesters) for details.

`scoringProfiles` - Defines custom scoring behaviors that let you influence which items appear higher in search results. Scoring profiles are made up of field weights and functions. See [Add scoring Profiles](https://msdn.microsoft.com/library/azure/dn798928.aspx) for more information about the attributes used in a scoring profile.

<!-- This is a standalone topic in MSDN -->
<a name="LanguageSupport"></a>
**Language support**

Searchable fields undergo analysis that most frequently involves word-breaking, text normalization, and filtering out terms. By default, searchable fields in Azure Search are analyzed with the [Apache Lucene Standard analyzer](http://lucene.apache.org/core/4_9_0/analyzers-common/index.html) which breaks text into elements following the["Unicode Text Segmentation"](http://unicode.org/reports/tr29/) rules. Additionally, the standard analyzer converts all characters to their lower case form. Both indexed documents and search terms go through the analysis during indexing and query processing.

Azure Search supports a variety of languages. Each language requires a non-standard text analyzer which accounts for characteristics of a given language. Azure Search offers two types of analyzers:

- 35 analyzers backed by Lucene.
- 50 analyzers backed by proprietary Microsoft natural language processing technology used in Office and Bing.

Some developers might prefer the more familiar, simple, open-source solution of Lucene. Lucene analyzers are faster, but the Microsoft analyzers have advanced capabilities, such as lemmatization, word decompounding (in languages like German, Danish, Dutch, Swedish, Norwegian, Estonian, Finish, Hungarian, Slovak) and entity recognition (URLs, emails, dates, numbers). If possible, you should run comparisons of both the Microsoft and Lucene analyzers to decide which one is a better fit.

***How they compare***

The Lucene analyzer for English extends the standard analyzer. It removes possessives (trailing 's) from words, applies stemming as per [Porter Stemming algorithm](http://tartarus.org/~martin/PorterStemmer/), and removes English [stop words](http://en.wikipedia.org/wiki/Stop_words).

In comparison, the Microsoft analyzer performs lemmatization instead of stemming. It means it can handle inflected and irregular word forms much better what results in more relevant search results (watch module 7 of [Azure Search MVA presentation](http://www.microsoftvirtualacademy.com/training-courses/adding-microsoft-azure-search-to-your-websites-and-apps) for more details).

Indexing with Microsoft analyzers is on average two to three times slower than their Lucene equivalents, depending on the language. Search performance should not be significantly affected for average size queries.

***Configuration***

For each field in the index definition, you can set the `analyzer` property to an analyzer name that specifies which language and vendor. The same analyzer will be applied when indexing and searching for that field.
For example, you can have separate fields for English, French, and Spanish hotel descriptions that exist side-by-side in the same index. Use the ['searchFields' query parameter](#SearchQueryParameters) to specify which language-specific field to search against in your queries. You can review query examples that include the `analyzer` property in [Search Documents](#SearchDocs). 

***Analyzer list***

Below is the list of supported languages together with Lucene and Microsoft analyzer names.

<table style="font-size:12">
    <tr>
		<th>Language</th>
		<th>Microsoft analyzer name</th>
		<th>Lucene analyzer name</th>
	</tr>
    <tr>
		<td>Arabic</td>
		<td>ar.microsoft</td>
		<td>ar.lucene</td>		
	</tr>
    <tr>
    	<td>Armenian</td>
		<td></td>
    	<td>hy.lucene</td>
  	</tr>
    <tr>
		<td>Bangla</td>
		<td>bn.microsoft</td>
		<td></td>
	</tr>
  	<tr>
    	<td>Basque</td>
		<td></td>
    	<td>eu.lucene</td>
    </tr>
  	<tr>
 		<td>Bulgarian</td>
		<td>bg.microsoft</td>
    	<td>bg.lucene</td>
  	</tr>
  	<tr>
    	<td>Catalan</td>
    	<td>ca.microsoft</td>
		<td>ca.lucene</td>  		
  	</tr>
    <tr>
		<td>Chinese Simplified</td>
		<td>zh-Hans.microsoft</td>
		<td>zh-Hans.lucene</td>		
	</tr>
    <tr>
		<td>Chinese Traditional</td>
		<td>zh-Hant.microsoft</td>
		<td>zh-Hant.lucene</td>		
	<tr>
    <tr>
		<td>Croatian</td>
		<td>hr.microsoft</td>
		<td/></td>
	</tr>
    <tr>
		<td>Czech</td>
		<td>cs.microsoft</td>
		<td>cs.lucene</td>		
	</tr>    
    <tr>
		<td>Danish</td>
		<td>da.microsoft</td>
		<td>da.lucene</td>		
	</tr>    
    <tr>
		<td>Dutch</td>
		<td>nl.microsoft</td>
		<td>nl.lucene</td>	
	</tr>    
    <tr>
		<td>English</td>		
		<td>en.microsoft</td>
		<td>en.lucene</td>		
	</tr>
    <tr>
		<td>Estonian</td>
		<td>et.microsoft</td>
		<td></td>
	</tr>
    <tr>
		<td>Finnish</td>
		<td>fi.microsoft</td>
		<td>fi.lucene</td>		
	</tr>    
    <tr>
		<td>French</td>
		<td>fr.microsoft</td>
		<td>fr.lucene</td>		
	</tr>
    <tr>
    	<td>Galician</td>
	    <td></td>
		<td>gl.lucene</td>    	
  	</tr>
    <tr>
		<td>German</td>
		<td>de.microsoft</td>
		<td>de.lucene</td>		
	</tr>
    <tr>
		<td>Greek</td>
		<td>el.microsoft</td>
		<td>el.lucene</td>		
	</tr>
    <tr>
		<td>Gujarati</td>
		<td>gu.microsoft</td>
		<td></td>
	</tr>
    <tr>
		<td>Hebrew</td>
		<td>he.microsoft</td>
		<td></td>
	</tr>
    <tr>
		<td>Hindi</td>
		<td>hi.microsoft</td>
		<td>hi.lucene</td>		
	</tr>
    <tr>
		<td>Hungarian</td>		
		<td>hu.microsoft</td>
		<td>hu.lucene</td>
	</tr>
    <tr>
		<td>Icelandic</td>
		<td>is.microsoft</td>
		<td></td>
	</tr>
    <tr>
		<td>Indonesian (Bahasa)</td>
		<td>id.microsoft</td>
		<td>id.lucene</td>		
	</tr>
    <tr>
    	<td>Irish</td>
		<td></td>
      	<td>ga.lucene</td>
    </tr>
    <tr>
		<td>Italian</td>
		<td>it.microsoft</td>
		<td>it.lucene</td>		
	</tr>
    <tr>
		<td>Japanese</td>
		<td>ja.microsoft</td>
		<td>ja.lucene</td>
		
	</tr>
    <tr>
		<td>Kannada</td>
		<td>ka.microsoft</td>
		<td></td>
	</tr>
    <tr>
		<td>Korean</td>
		<td>ko.microsoft</td>
		<td>ko.lucene</td>
	</tr>
    <tr>
		<td>Latvian</td>		
		<td>lv.microsoft</td>
		<td>lv.lucene</td>	
	</tr>
    <tr>
		<td>Lithuanian</td>
		<td>lt.microsoft</td>
		<td></td>
	</tr>
    <tr>
		<td>Malayalam</td>
		<td>ml.microsoft</td>
		<td></td>
	</tr>
    <tr>
		<td>Malay (Latin)</td>
		<td>ms.microsoft</td>
		<td></td>
	</tr>
    <tr>
		<td>Marathi</td>
		<td>mr.microsoft</td>
		<td></td>
	</tr>
    <tr>
		<td>Norwegian</td>
		<td>nb.microsoft</td>
		<td>no.lucene</td>		
	</tr>
  	<tr>
    	<td>Persian</td>
		<td></td>
		<td>fa.lucene</td>    	
  	</tr>
    <tr>
		<td>Polish</td>
		<td>pl.microsoft</td>
		<td>pl.lucene</td>		
	</tr>
    <tr>
		<td>Portuguese (Brazil)</td>
		<td>pt-Br.microsoft</td>
		<td>pt-Br.lucene</td>		
	</tr>
    <tr>
		<td>Portuguese (Portugal)</td>
		<td>pt-Pt.microsoft</td>		
		<td>pt-Pt.lucene</td>
	</tr>
    <tr>
		<td>Punjabi</td>
		<td>pa.microsoft</td>
		<td></td>
	</tr>
    <tr>
		<td>Romanian</td>
		<td>ro.microsoft</td>
		<td>ro.lucene</td>
	</tr>
    <tr>
		<td>Russian</td>
		<td>ru.microsoft</td>
		<td>ru.lucene</td>	
	</tr>
    <tr>
		<td>Serbian (Cyrillic)</td>
		<td>sr-cyrillic.microsoft</td>
		<td></td>
	</tr>
    <tr>
		<td>Serbian (Latin)</td>
		<td>sr-latin.microsoft</td>
		<td></td>
	</tr>
    <tr>
		<td>Slovak</td>
		<td>sk.microsoft</td>
		<td></td>
	</tr>
    <tr>
		<td>Slovenian</td>
		<td>sl.microsoft</td>
		<td></td>
	</tr>
    <tr>
		<td>Spanish</td>
		<td>es.microsoft</td>
		<td>es.lucene</td>
	</tr>
    <tr>
		<td>Swedish</td>
		<td>sv.microsoft</td>
		<td>sv.lucene</td>
	</tr>

    <tr>
		<td>Tamil</td>
		<td>ta.microsoft</td>
		<td></td>
	</tr>
    <tr>
		<td>Telugu</td>
		<td>te.microsoft</td>
		<td></td>
	</tr>
    <tr>
		<td>Thai</td>
		<td>th.microsoft</td>
		<td>th.lucene</td>
	</tr>
    <tr>
		<td>Turkish</td>
		<td>tr.microsoft</td>
		<td>tr.lucene</td>		
	</tr>
    <tr>
		<td>Ukrainian</td>
		<td>uk.microsoft</td>
		<td></td>
	</tr>
    <tr>
		<td>Urdu</td>
		<td>ur.microsoft</td>
		<td></td>
	</tr>
    <tr>
		<td>Vietnamese</td>
		<td>vi.microsoft</td>
		<td></td>
	</tr>
	<td colspan="3">Additionally Azure Search provides language-agnostic analyzer configurations</td>
    <tr>
		<td>Standard ASCII Folding</td>
		<td>standardasciifolding.lucene</td>
		<td>
		<ul>
			<li>Unicode text segmentation (Standard Tokenizer)</li>
			<li>ASCII folding filter - converts Unicode characters that don't belong to the set of first 127 ASCII characters into their ASCII equivalents. This is useful for removing diacritics.</li>
		</ul>
		</td>
	</tr>
</table>

All analyzers with names annotated with <i>lucene</i> are powered by [Apache Lucene's language analyzers](http://lucene.apache.org/core/4_9_0/analyzers-common/overview-summary.html). More information about the ASCII folding filter can be found [here](http://lucene.apache.org/core/4_9_0/analyzers-common/org/apache/lucene/analysis/miscellaneous/ASCIIFoldingFilter.html).

**Suggesters**

A `suggester` defines which fields in an index are used to support auto-complete in searches. Typically partial search strings are sent to the [Suggestions API](#Suggestions) while the user is typing a search query, and the API returns a set of suggested phrases. A suggester that you define in the index determines which fields are used to build the type-ahead search terms. See [Suggesters](#Suggesters) for configuration details.

**Scoring profiles**

A `scoringProfile` defines custom scoring behaviors that let you influence which items appear higher in the search results. Scoring profiles are made up of field weights and functions. To use them, you specify a profile by name on the query string.

A default scoring profile operates behind the scenes to compute a search score for every item in a result set. You can use the internal, unnamed scoring profile. Alternatively, set `defaultScoringProfile` to use a custom profile as the default, invoked whenever a custom profile is not specified on the query string.

See [Add scoring profiles to a search index (Azure Search Service REST API)](search-api-scoring-profiles-2015-02-28-preview.md) for details.

**CORS Options**

Client-side Javascript cannot call any APIs by default since the browser will prevent all cross-origin requests. Enable CORS (Cross-Origin Resource Sharing) by setting the `corsOptions` attribute to allow cross-origin queries to your index. Note that only query APIs support CORS for security reasons. The following options can be set for CORS:

- `allowedOrigins` (required): This is a list of origins that will be granted access to your index. This means that any Javascript code served from those origins will be allowed to query your index (assuming it provides the correct API key). Each origin is typically of the form `protocol://fully-qualified-domain-name:port` although the port is often omitted. See [this article](http://go.microsoft.com/fwlink/?LinkId=330822) for more details.
 - If you want to allow access to all origins, include `*` as a single item in the `allowedOrigins` array. Note that **this is not recommended practice for production search services.** However, it may be useful for development or debugging purposes.
- `maxAgeInSeconds` (optional): Browsers use this value to determine the duration (in seconds) to cache CORS preflight responses. This must be a non-negative integer. The larger this value is, the better performance will be, but the longer it will take for CORS policy changes to take effect. If it is not set, a default duration of 5 minutes will be used.

<a name="CreateUpdateIndexExample"></a>
**Request Body Example**

    {
      "name": "hotels",  
      "fields": [
        {"name": "hotelId", "type": "Edm.String", "key": true, "searchable": false},
        {"name": "baseRate", "type": "Edm.Double"},
        {"name": "description", "type": "Edm.String", "filterable": false, "sortable": false, "facetable": false},
	    {"name": "description_fr", "type": "Edm.String", "filterable": false, "sortable": false, "facetable": false, analyzer="fr.lucene"},
        {"name": "hotelName", "type": "Edm.String"},
        {"name": "category", "type": "Edm.String"},
        {"name": "tags", "type": "Collection(Edm.String)"},
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
      ]
    }

**Response**

For a successful request: "201 Created".

By default the response body will contain the JSON for the index definition that was created. If the `Prefer` request header is set to `return=minimal`, the response body will be empty and the success status code will be "204 No Content" instead of "201 Created". This is true regardless of whether PUT or POST was used to create the index.

**Remarks**

Currently, there is limited support for index schema updates. Any schema updates that would require re-indexing such as changing field types are not currently supported. Although existing fields cannot be changed or deleted, new fields can be added to an existing index at any time. When a new field is added, all existing documents in the index will automatically have a null value for that field. No additional storage space will be consumed until new documents are added to the index.

<a name="Suggesters"></a>
## Suggesters

The suggestions feature in Azure Search is a type-ahead or auto-complete query capability, providing a list of potential search terms in response to partial string inputs entered into a search box. You've probably noticed query suggestions when using commercial web search engines: typing ".NET" in Bing produces a list of terms for ".NET 4.5", ".NET Framework 3.5", and so forth. When using the Search service REST API, implementing suggestions in a custom Azure Search application requires the following:

- Enable suggestions by adding a **suggester** construction in your index, giving the name, search mode, and a list of fields for which type-ahead is invoked. For example, if you specify "cityName" as a source field, typing a partial search string of "Sea" will result in "Seattle", "Seaside", and "Seatac" (all three are actual city names) offered up as query suggestions to the user.

- Invoke suggestions by calling the [Suggestions API](#Suggestions) in your application code. Typically partial search strings are sent to the service while the user is typing a search query, and this API returns a set of suggested phrases.

This article explains how to configure a **suggester**. You should also review the [Suggestions API](#Suggestions) for details on how a suggester is used.

**Usage**

`Suggesters` are created in the index and work best when used to suggest specific documents rather than loose terms or phrases. The best candidate fields are titles, names, and other relatively short phrases that can identify an item. Less effective are repetitive fields, such as categories and tags, or very long fields such as descriptions or comments fields.

As part of the index definition, you can add a single suggester to the `suggesters` collection. Properties that define a suggester include the following:

- `name`: The name of the suggester. You use the name of the suggester when calling the `suggest` API.
- `searchMode`: The strategy used to search for candidate phrases. The only mode currently supported is `analyzingInfixMatching`, which performs flexible matching of phrases at the beginning or in the middle of sentences.
- `sourceFields`: A list of one or more fields that are the source of the content for suggestions. Only fields of type `Edm.String` and `Collection(Edm.String)` may be sources for suggestions. Only fields that don't have a custom language analyzer set can be used.

**Suggester Example**

A suggester is part of the index. Only one suggester can exist in the `suggesters` collection in the current version, alongside the fields collection and `scoringProfiles`.

		{
		  "name": "hotels",
		  "fields": [
		     . . .
		   ],
		  "suggesters": [
		    {
		    "name": "sg",
		    "searchMode": "analyzingInfixMatching",
		    "sourceFields: ["hotelName", "category"]
		    }
		  ],
		  "scoringProfiles": [
		     . . .
		  ]
		}

> [AZURE.NOTE]  If you used the public preview version of Azure Search, `suggesters` replaces an older boolean property (`"suggestions": false`) that only supported prefix suggestions for short strings (3-25 characters). Its replacement, `suggesters`, supports infix matching that finds matching terms at the beginning or in the middle of field content, with better tolerance for mistakes in search strings. Starting with the generally available release, this is now the only implementation of the suggestions API. The older `suggestions` property that was introduced in `api-version=2014-07-31-Preview` continues to work in that version, but is not operational in the `2015-02-28` or later versions of Azure Search.

<a name="UpdateIndex"></a>
## Update Index

You can update an existing index within Azure Search using an HTTP PUT request. Updates can include adding new fields to the existing schema, modifying CORS options, and modifying scoring profiles. See [Add scoring Profiles](https://msdn.microsoft.com/library/azure/dn798928.aspx) for more information. You specify the name of the index to update on the request URI:

    PUT https://[search service url]/indexes/[index name]?api-version=[api-version]
    Content-Type: application/json
    api-key: [admin key]

**Important:** Support for index schema updates is limited to operations that don't require rebuilding the search index. Any schema updates that would require re-indexing, such as changing field types, are not currently supported. New fields can be added at any time, although existing fields cannot be changed or deleted. The same applies to `suggesters`. New fields may be added to a suggester at the time the fields are added, but fields cannot be removed from `suggesters` and existing fields cannot be added to `suggesters`.

When adding a new field to an index, all existing documents in the index will automatically have a null value for that field. No additional storage space will be consumed until new documents are added to the index.

**Request**

HTTPS is required for all service requests. The **Update Index** request is constructed using HTTP PUT. With PUT, the index name is part of the URL. If the index doesn't exist, it is created. If the index already exists, it is updated to the new definition.

The index name must be lower case, start with a letter or number, have no slashes or dots, and be less than 128 characters. After starting the index name with a letter or number, the rest of the name can include any letter, number and dashes, as long as the dashes are not consecutive.

`api-version=[string]` (required). The preview version is `api-version=2015-02-28-Preview`. See [Search Service Versioning](http://msdn.microsoft.com/library/azure/dn864560.aspx) for details and alternative versions.

**Request Headers**

The following list describes the required and optional request headers.

- `Content-Type`: Required. Set this to `application/json`
- `api-key`: Required. The `api-key` is used to authenticate the request to your Search service. It is a string value, unique to your service. The **Update Index** request must include an `api-key` header set to your admin key (as opposed to a query key).

You will also need the service name to construct the request URL. You can get the service name and `api-key` from your service dashboard in the Azure Portal. See [Create an Azure Search service in the portal](search-create-service-portal.md) for page navigation help.

**Request Body Syntax**

When updating an existing index, the body must include the original schema definition, plus the new fields you are adding, as well as the modified scoring profiles, suggesters and CORS options, if any. If you are not modifying the scoring profiles and CORS options, you must include the originals from when the index was created. In general the best pattern to use for updates is to retrieve the index definition with a GET, modify it, then update it with PUT.

The schema syntax used to create an index is reproduced here for convenience. See [Create Index](#CreateIndex) for more details.

    {
      "name": (optional) "name_of_index",
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
              "searchable_field_name": relative_weight_value (positive numbers),
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
                "referencePointParameter": "...", (parameter to be passed in queries to use as reference location, see "scoringParameter" for syntax details)
                "boostingDistance": # (the distance in kilometers from the reference location where the boosting range ends)
              },
			  "tag": {
				"tagsParameter": "..." (parameter to be passed in queries to specify list of tags to compare against target field, see "scoringParameter" for syntax details)
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


**Response**

For a successful request: "204 No Content".

By default the response body will be empty. However, if the `Prefer` request header is set to `return=representation`, the response body will contain the JSON for the index definition that was updated. In this case, the success status code will be "200 OK".

**Updating index definition with custom analyzers**

Once an analyzer, a tokenizer, a token filter or a char filter is defined, it cannot be modified. New ones can be added to an existing index only if the `allowIndexDowntime` flag is set to true in the index update request: 

`PUT https://[search service name].search.windows.net/indexes/[index name]?api-version=[api-version]&allowIndexDowntime=true`

Note that this operation will put your index offline for at least a few seconds, causing your indexing and query requests to fail. Performance and write availability of the index can be impaired for several minutes after the index is updated, or longer for very large indexes.

<a name="ListIndexes"></a>
## List Indexes

The **List Indexes** operation returns a list of the indexes currently in your Azure Search service.

    GET https://[service name].search.windows.net/indexes?api-version=[api-version]
    api-key: [admin key]

**Request**

HTTPS is required for all service requests. The **List Indexes** request can be constructed using the GET method.

`api-version=[string]` (required). The preview version is `api-version=2015-02-28-Preview`. See [Search Service Versioning](http://msdn.microsoft.com/library/azure/dn864560.aspx) for details and alternative versions.

**Request Headers**

The following list describes the required and optional request headers.

- `api-key`: Required. The `api-key` is used to authenticate the request to your Search service. It is a string value, unique to your service. The **List Indexes** request must include an `api-key` set to an admin key (as opposed to a query key).

You will also need the service name to construct the request URL. You can get the service name and `api-key` from your service dashboard in the Azure Portal. See [Create an Azure Search service in the portal](search-create-service-portal.md) for page navigation help.

**Request Body**

None.

**Response**

Status Code: 200 OK is returned for a successful response.

Here is an example response body:

    {
      "value": [
        {
          "name": "Books",
          "fields": [
            {"name": "ISBN", ...},
            ...
          ]
        },
        {
          "name": "Games",
          ...
        },
        ...
      ]
    }

Note that you can filter the response down to just the properties you're interested in. For example, if you want only a list of index names, use the OData `$select` query option:

    GET /indexes?api-version=2015-02-28-Preview&$select=name

In this case, the response from the above example would appear as follows:

    {
      "value": [
        {"name": "Books"},
        {"name": "Games"},
        ...
      ]
    }

This is a useful technique to save bandwidth if you have a lot of indexes in your Search service.

<a name="GetIndex"></a>
## Get Index

The **Get Index** operation gets the index definition from Azure Search.

    GET https://[service name].search.windows.net/indexes/[index name]?api-version=[api-version]
    api-key: [admin key]

**Request**

HTTPS is required for service requests. The **Get Index** request can be constructed using the GET method.

The [index name] in the request URI specifies which index to return from the indexes collection.

`api-version=[string]` (required). The preview version is `api-version=2015-02-28-Preview`. See [Search Service Versioning](http://msdn.microsoft.com/library/azure/dn864560.aspx) for details and alternative versions.

**Request Headers**

The following list describes the required and optional request headers.

- `api-key`: The `api-key` is used to authenticate the request to your Search service. It is a string value, unique to your service. The **Get Index** request must include an `api-key` set to an admin key (as opposed to a query key).

You will also need the service name to construct the request URL. You can get the service name and `api-key` from your service dashboard in the Azure Portal. See [Create an Azure Search service in the portal](search-create-service-portal.md) for page navigation help.

**Request Body**

None.

**Response**

Status Code: 200 OK is returned for a successful response.

See the example JSON in [Creating and Updating an Index](#CreateUpdateIndexExample) for an example of the response payload.

<a name="DeleteIndex"></a>
## Delete Index

The **Delete Index** operation removes an index and associated documents from your Azure Search service. You can get the index name from the service dashboard in the Azure portal, or from the API. See [List Indexes](#ListIndexes) for details.

    DELETE https://[service name].search.windows.net/indexes/[index name]?api-version=[api-version]
    api-key: [admin key]

**Request**

HTTPS is required for service requests. The **Delete Index** request can be constructed using the DELETE method.

The [index name] in the request URI specifies which index to delete from the indexes collection.

`api-version=[string]` (required). The preview version is `api-version=2015-02-28-Preview`. See [Search Service Versioning](http://msdn.microsoft.com/library/azure/dn864560.aspx) for details and alternative versions.

**Request Headers**

The following list describes the required and optional request headers.

- `api-key`: Required. The `api-key` is used to authenticate the request to your Search service. It is a string value, unique to your service URL. The **Delete Index** request must include an `api-key` header set to your admin key (as opposed to a query key).

You will also need the service name to construct the request URL. You can get the service name and `api-key` from your service dashboard in the Azure Portal. See [Create an Azure Search service in the portal](search-create-service-portal.md) for page navigation help.

**Request Body**

None.

**Response**

Status Code: 204 No Content is returned for a successful response.

<a name="GetIndexStats"></a>
## Get Index Statistics

The **Get Index Statistics** operation returns from Azure Search a document count for the current index, plus storage usage.

	GET https://[service name].search.windows.net/indexes/[index name]/stats?api-version=[api-version]
    api-key: [admin key]

> [AZURE.NOTE] The returned statistics are collected periodically and may not reflect changes caused by recent indexing operations.

**Request**

HTTPS is required for all services requests. The **Get Index Statistics** request can be constructed using the GET method.

The [index name] in the request URI tells the service to return index statistics for the specified index.

`api-version=[string]` (required). The preview version is `api-version=2015-02-28-Preview`. See [Search Service Versioning](http://msdn.microsoft.com/library/azure/dn864560.aspx) for details and alternative versions.


**Request Headers**

The following list describes the required and optional request headers.

- `api-key`: The `api-key` is used to authenticate the request to your Search service. It is a string value, unique to your service. The **Get Index Statistics** request must include an `api-key` set to an admin key (as opposed to a query key).

You will also need the service name to construct the request URL. You can get the service name and `api-key` from your service dashboard in the Azure Portal. See [Create an Azure Search service in the portal](search-create-service-portal.md) for page navigation help.

**Request Body**

None.

**Response**

Status Code: 200 OK is returned for a successful response.

The response body is in the following format:

    {
      "documentCount": number,
	  "storageSize": number (size of the index in bytes)
    }

<a name="TestAnalyzer"></a>
## Test Analyzer

The **Analyze API** shows how an analyzer breaks text into tokens.

    POST https://[service name].search.windows.net/indexes/[index name]/analyze?api-version=[api-version]
    Content-Type: application/json
    api-key: [admin key]

**Request**

HTTPS is required for all services requests. The **Analyze API** request can be constructed using the POST method.

`api-version=[string]` (required). The preview version is `api-version=2015-02-28-Preview`. See [Search Service Versioning](http://msdn.microsoft.com/library/azure/dn864560.aspx) for details and alternative versions.


**Request Headers**

The following list describes the required and optional request headers.

- `api-key`: The `api-key` is used to authenticate the request to your Search service. It is a string value, unique to your service. The **Analyze API** request must include an `api-key` set to an admin key (as opposed to a query key).

You will also need the index name and the service name to construct the request URL. You can get the service name and `api-key` from your service dashboard in the Azure Portal. See [Create an Azure Search service in the portal](search-create-service-portal.md) for page navigation help.

**Request Body**

    {
      "text": "Text to analyze",
      "analyzer": "analyzer_name"
    }

or

    {
      "text": "Text to analyze",
      "tokenizer": "tokenizer_name",
      "tokenFilters": (optional) [ "token_filter_name" ],
      "charFilters": (optional) [ "char_filter_name" ]
    }

The `analyzer_name`, `tokenizer_name`, `token_filter_name` and `char_filter_name` need to be valid names of predefined or custom analyzers, tokenizers, token filters and char filters for the index. To learn more about the process of lexical analysis see [Analysis in Azure Search](https://aka.ms/azsanalysis).

**Response**

Status Code: 200 OK is returned for a successful response.

The response body is in the following format:

    {
      "tokens": [
        {
          "token": string (token),
          "startOffset": number (index of the first character of the token),
          "endOffset": number (index of the last character of the token),
          "position": number (position of the token in the input text)
        },
        ...
      ]
    }

**Analyze API example**

**Request**

    {
      "text": "Text to analyze",
      "analyzer": "standard"
    }

**Response**

    {
      "tokens": [
        {
          "token": "text",
          "startOffset": 0,
          "endOffset": 4,
          "position": 0
        },
        {
          "token": "to",
          "startOffset": 5,
          "endOffset": 7,
          "position": 1
        },
        {
          "token": "analyze",
          "startOffset": 8,
          "endOffset": 15,
          "position": 2
        }
      ]
    }

________________________________________
<a name="DocOps"></a>
## Document Operations

In Azure Search, an index is stored in the cloud and populated using JSON documents that you upload to the service. All the documents that you upload comprise the corpus of your search data. Documents contain fields, some of which are tokenized into search terms as they are uploaded. The `/docs` URL segment in the Azure Search API represents the collection of documents in an index. All operations performed on the collection such as uploading, merging, deleting, or querying documents take place in the context of a single index, so the URLs for these operations will always start with `/indexes/[index name]/docs` for a given index name.

Your application code must either generate JSON documents to upload to Azure Search or you can use an [indexer](https://msdn.microsoft.com/library/dn946891.aspx) to load documents if the data source is either Azure SQL Database or DocumentDB. Typically, indexes are populated from a single dataset that you provide.

You should plan on having one document for each item that you want to search. A movie rental application might have one document per movie, a storefront application might have one document per SKU, an online courseware application might have one document per course, a research firm might have one document for each academic paper in their repository, and so on.

Documents consist of one or more fields. Fields can contain text that is tokenized by Azure Search into search terms, as well as non-tokenized or non-text values that can be used in filters or scoring profiles. The names, data types, and search features supported for each field are determined by the index schema. One of the fields in each index schema must be designated as an ID, and each document must have a value for the ID field that uniquely identifies that document in the index. All other document fields are optional and will default to a null value if left unspecified. Note that null values do not take up space in the search index.

Before you can upload documents, you must have already created the index on the service. See [Create Index](#CreateIndex) for details about this first step.

<a name="AddOrUpdateDocuments"></a>
## Add, Update, or Delete Documents

You can upload, merge, merge-or-upload or delete documents from a specified index using HTTP POST. For large numbers of updates, batching of documents (up to 1000 documents per batch or about 16 MB per batch) is recommended.

    POST https://[service name].search.windows.net/indexes/[index name]/docs/index?api-version=[api-version]
    Content-Type: application/json
    api-key: [admin key]

**Request**

HTTPS is required for all service requests. You can upload, merge, merge-or-upload or delete documents from a specified index using HTTP POST.

The request URI includes [index name], specifying which index to post documents. You can only post documents to one index at a time.

`api-version=[string]` (required). The preview version is `api-version=2015-02-28-Preview`. See [Search Service Versioning](http://msdn.microsoft.com/library/azure/dn864560.aspx) for details and alternative versions.

**Request Headers**

The following list describes the required and optional request headers.

- `Content-Type`: Required. Set this to `application/json`
- `api-key`: Required. The `api-key` is used to authenticate the request to your Search service. It is a string value, unique to your service. The **Add Documents** request must include an `api-key` header set to your admin key (as opposed to a query key).

You will also need the service name to construct the request URL. You can get the service name and `api-key` from your service dashboard in the Azure Portal. See [Create an Azure Search service in the portal](search-create-service-portal.md) for page navigation help.

**Request Body**

The body of the request contains one or more documents to be indexed. Documents are identified by a unique key. Each document is associated with an action: upload, merge, mergeOrUpload or delete. Upload requests must include the document data as a set of key/value pairs.

    {
      "value": [
        {
          "@search.action": "upload (default) | merge | mergeOrUpload | delete",
          "key_field_name": "unique_key_of_document", (key/value pair for key field from index schema)
          "field_name": field_value (key/value pairs matching index schema)
            ...
        },
        ...
      ]
    }

> [AZURE.NOTE] Document keys can only contain letters, numbers, dashes ("-"), underscores ("_"), and equal signs ("="). For more details, see [Naming rules](https://msdn.microsoft.com/library/azure/dn857353.aspx).

**Document Actions**

- `upload`: An upload action is similar to an "upsert" where the document will be inserted if it is new and updated/replaced if it exists. Note that all fields are replaced in the update case.
- `merge`: Merge updates an existing document with the specified fields. If the document doesn't exist, the merge will fail. Any field you specify in a merge will replace the existing field in the document. This includes fields of type `Collection(Edm.String)`. For example, if the document contains a field "tags" with value `["budget"]` and you execute a merge with value `["economy", "pool"]` for "tags", the final value of the "tags" field will be `["economy", "pool"]`. It will **not** be `["budget", "economy", "pool"]`.
- `mergeOrUpload`: behaves like `merge` if a document with the given key already exists in the index. If the document does not exist it behaves like `upload` with a new document.
- `delete`: Delete removes the specified document from the index. Note that any fields you specify in a `delete` operation, other than the key field, will be ignored. If you want to remove an individual field from a document, use `merge` instead and simply set the field explicitly to `null`.

**Response**

Status code 200 (OK) is returned for a successful response, meaning that all items have been successfully indexed. This is indicated by the `status` property being set to true for all items, as well as the `statusCode` property being set to either 201 (for newly uploaded documents) or 200 (for merged or deleted documents):

    {
      "value": [
        {
          "key": "unique_key_of_new_document",
          "status": true,
          "errorMessage": null,
          "statusCode": 201
        },
        {
          "key": "unique_key_of_merged_document",
          "status": true,
          "errorMessage": null,
          "statusCode": 200
        },
        {
          "key": "unique_key_of_deleted_document",
          "status": true,
          "errorMessage": null,
          "statusCode": 200
        }
      ]
    }  

Status code 207 (Multi-Status) is returned when at least one item was not successfully indexed. Items that have not been indexed have the `status` field set to false. The `errorMessage` and `statusCode` properties will indicate the reason for the indexing error:

    {
      "value": [
        {
          "key": "unique_key_of_document_1",
          "status": false,
          "errorMessage": "The search service is too busy to process this document. Please try again later.",
          "statusCode": 503
        },
        {
          "key": "unique_key_of_document_2",
          "status": false,
          "errorMessage": "Document not found.",
          "statusCode": 404
        },
        {
          "key": "unique_key_of_document_3",
          "status": false,
          "errorMessage": "Index is temporarily unavailable because it was updated with the 'allowIndexDowntime' flag set to 'true'. Please try again later.",
          "statusCode": 422
        }
      ]
    }  

The following table explains the various per-document status codes that can be returned in the response. Note that some indicate problems with the request itself, while others indicate temporary error conditions. The latter you should retry after a delay.

<table style="font-size:12">
    <tr>
		<th>Status code</th>
		<th>Meaning</th>
		<th>Retryable</th>
		<th>Notes</th>
	</tr>
    <tr>
		<td>200</td>
		<td>Document was successfully modified or deleted.</td>
		<td>n/a</td>
		<td>Delete operations are <a href="https://en.wikipedia.org/wiki/Idempotence">idempotent</a>. That is, even if a document key does not exist in the index, attempting a delete operation with that key will result in a 200 status code.</td>
	</tr>
    <tr>
		<td>201</td>
		<td>Document was successfully created.</td>
		<td>n/a</td>
		<td></td>
	</tr>
    <tr>
		<td>400</td>
		<td>There was an error in the document that prevented it from being indexed.</td>
		<td>No</td>
		<td>The error message in the response will indicate what is wrong with the document.</td>
	</tr>
    <tr>
		<td>404</td>
		<td>The document could not be merged because the given key doesn't exist in the index.</td>
		<td>No</td>
		<td>This error does not occur for uploads since they create new documents, and it does not occur for deletes because they are <a href="https://en.wikipedia.org/wiki/Idempotence">idempotent</a>.</td>
	</tr>
    <tr>
		<td>409</td>
		<td>A version conflict was detected when attempting to index a document.</td>
		<td>Yes</td>
		<td>This can happen when you're trying to index the same document more than once concurrently.</td>
	</tr>
    <tr>
		<td>422</td>
		<td>The index is temporarily unavailable because it was updated with the 'allowIndexDowntime' flag set to 'true'.</td>
		<td>Yes</td>
		<td></td>
	</tr>
    <tr>
		<td>503</td>
		<td>Your search service is temporarily unavailable, possibly due to heavy load.</td>
		<td>Yes</td>
		<td>Your code should wait before retrying in this case or you risk prolonging the service unavailability.</td>
	</tr>
</table> 

**Note**: If your client code frequently encounters a 207 response, one possible reason is that the system is under load. You can confirm this by checking the `statusCode` property for 503. If this is the case, we recommend ***throttling indexing requests***. Otherwise, if indexing traffic doesn't subside, the system could start rejecting all requests with 503 errors.

Status code 429 indicates that you have exceeded your quota on the number of documents per index. You must either create a new index or upgrade for higher capacity limits.

**Example:**

    {
      "value": [
        {
          "@search.action": "upload",
          "hotelId": "1",
          "baseRate": 199.0,
          "description": "Best hotel in town",
		  "description_fr": "Meilleur hôtel en ville",
          "hotelName": "Fancy Stay",
		  "category": "Luxury",
          "tags": ["pool", "view", "wifi", "concierge"],
          "parkingIncluded": false,
		  "smokingAllowed": false,
          "lastRenovationDate": "2010-06-27T00:00:00Z",
          "rating": 5,
          "location": { "type": "Point", "coordinates": [-122.131577, 47.678581] }
        },
        {
          "@search.action": "upload",
          "hotelId": "2",
          "baseRate": 79.99,
          "description": "Cheapest hotel in town",
	      "description_fr": "Hôtel le moins cher en ville",
          "hotelName": "Roach Motel",
		  "category": "Budget",
          "tags": ["motel", "budget"],
          "parkingIncluded": true,
		  "smokingAllowed": true,
          "lastRenovationDate": "1982-04-28T00:00:00Z",
          "rating": 1,
          "location": { "type": "Point", "coordinates": [-122.131577, 49.678581] }
        },
        {
          "@search.action": "merge",
          "hotelId": "3",
          "baseRate": 279.99,
          "description": "Surprisingly expensive",
          "lastRenovationDate": null
        },
        {
          "@search.action": "delete",
          "hotelId": "4"
        }
      ]
    }
________________________________________
<a name="SearchDocs"></a>
## Search Documents

A **Search** operation is issued as a GET or POST request and specifies parameters that give the criteria for selecting matching documents.

    GET https://[service name].search.windows.net/indexes/[index name]/docs?[query parameters]
    api-key: [admin or query key]

    POST https://[service name].search.windows.net/indexes/[index name]/docs/search?api-version=[api-version]
    Content-Type: application/json
    api-key: [admin or query key]

**When to use POST instead of GET**

When you use HTTP GET to call the **Search** API, you need to be aware that the length of the request URL cannot exceed 8 KB. This is usually enough for most applications. However, some applications produce very large queries or OData filter expressions. For these applications, using HTTP POST is a better choice because it allows larger filters and queries than GET. With POST, the number of terms or clauses in a query is the limiting factor, not the size of the raw query since the request size limit for POST is approximately 16 MB.

> [AZURE.NOTE] Even though the POST request size limit is very large, search queries and filter expressions cannot be arbitrarily complex. See [Lucene query syntax](https://msdn.microsoft.com/library/mt589323.aspx) and [OData expression syntax](https://msdn.microsoft.com/library/dn798921.aspx) for more information about search query and filter complexity limitations.
**Request**

HTTPS is required for service requests. The **Search** request can be constructed using the GET or POST methods.

The request URI specifies which index to query, for all documents that match the parameters. Parameters are specified on the query string in the case of GET requests, and in the request body in the case of POST requests.

As a best practice when creating GET requests, remember to [URL-encode](https://msdn.microsoft.com/library/system.uri.escapedatastring.aspx) specific query parameters when calling the REST API directly. For **Search** operations, this includes:

- `$filter`
- `facet`
- `highlightPreTag`
- `highlightPostTag`
- `search`
- `moreLikeThis`

URL encoding is only recommended on the above query parameters. If you inadvertently URL-encode the entire query string (everything after the ?), requests will break.

Also, URL encoding is only necessary when calling the REST API directly using GET. No URL encoding is necessary when calling **Search** using POST, or when using the [.NET client library](https://msdn.microsoft.com/library/dn951165.aspx), which handles URL encoding for you.

<a name="SearchQueryParameters"></a>
**Query Parameters**

**Search** accepts several parameters that provide query criteria and also specify search behavior. You provide these parameters in the URL query string when calling **Search** via GET, and as JSON properties in the request body when calling **Search** via POST. The syntax for some parameters is slightly different between GET and POST. These differences are noted as applicable below:

`search=[string]` (optional) - The text to search for. All `searchable` fields are searched by default unless `searchFields` is specified. When searching `searchable` fields, the search text itself is tokenized, so multiple terms can be separated by white space (for example: `search=hello world`). To match any term, use `*` (this can be useful for boolean filter queries). Omitting this parameter has the same effect as setting it to `*`. See [Simple Query Syntax](https://msdn.microsoft.com/library/dn798920.aspx) for specifics on the search syntax.

  - **Note**: The results can sometimes be surprising when querying over `searchable` fields. The tokenizer includes logic to handle cases common to English text like apostrophes, commas in numbers, etc. For example, `search=123,456` will match a single term 123,456 rather than the individual terms 123 and 456, since commas are used as thousand-separators for large numbers in English. For this reason, we recommend using white space rather than punctuation to separate terms in the `search` parameter.

`searchMode=any|all` (optional, defaults to `any`) - whether any or all of the search terms must be matched in order to count the document as a match.

`searchFields=[string]` (optional) - The list of comma-separated field names to search for the specified text. Target fields must be marked as `searchable`.

`queryType=simple|full` (optional, defaults to `simple`) - when set to "simple" search text is interpreted using a simple query language that allows for symbols such as +, * and "". Queries are evaluated across all searchable fields (or fields indicated in `searchFields`) in each document by default. When the query type is set to `full` search text is interpreted using the Lucene query language which allows field-specific and weighted searches. See [Simple Query Syntax](https://msdn.microsoft.com/library/dn798920.aspx) and [Lucene Query Syntax](https://msdn.microsoft.com/library/mt589323.aspx) for specifics on the search syntaxes. 
 
> [AZURE.NOTE] Range search in the Lucene query language is not supported in favor of $filter which offers similar functionality.

`moreLikeThis=[key]` (optional) **Important:** This feature is only available in `2015-02-28-Preview`. This option cannot be used in a query that contains the text search parameter, `search=[string]`. The `moreLikeThis` parameter finds documents that are similar to the document specified by the document key. When a search request is made with `moreLikeThis`, a list of search terms is generated based on the frequency and rarity of terms in the source document. Those terms are then used to make the request. By default, the contents of all `searchable` fields are considered unless `searchFields` is used to restrict which fields are searched.  

`$skip=#` (optional) - the number of search results to skip; Cannot be greater than 100,000. If you need to scan documents in sequence but cannot use `$skip` due to this limitation, consider using `$orderby` on a totally-ordered key and `$filter` with a range query instead.

> [AZURE.NOTE] When calling **Search** using POST, this parameter is named `skip` instead of `$skip`.

`$top=#` (optional) - the number of search results to retrieve. This can be used in conjunction with `$skip` to implement client-side paging of search results.

> [AZURE.NOTE] When calling **Search** using POST, this parameter is named `top` instead of `$top`.

`$count=true|false` (optional, defaults to `false`) - Specifies whether to fetch the total count of results. This is the count of all documents that match the `search` and `$filter` parameters, ignoring `$top` and `$skip`. Setting this value to `true` may have a performance impact. Note that the count returned is an approximation.

> [AZURE.NOTE] When calling **Search** using POST, this parameter is named `count` instead of `$count`.

`$orderby=[string]` (optional) - A list of comma-separated expressions to sort the results by. Each expression can be either a field name or a call to the `geo.distance()` function. Each expression can be followed by `asc` to indicated ascending, and `desc` to indicate descending. The default is ascending order. Ties will be broken by the match scores of documents. If no `$orderby` is specified, the default sort order is descending by document match score. There is a limit of 32 clauses for `$orderby`.

> [AZURE.NOTE] When calling **Search** using POST, this parameter is named `orderby` instead of `$orderby`.

`$select=[string]` (optional) - A list of comma-separated fields to retrieve. If unspecified, all fields marked as retrievable in the schema are included. You can also explicitly request all fields by setting this parameter to `*`.

> [AZURE.NOTE] When calling **Search** using POST, this parameter is named `select` instead of `$select`.

`facet=[string]` (zero or more) - A field to facet by. Optionally the string may contain parameters to customize the faceting expressed as comma-separated `name:value` pairs. Valid parameters are:

- `count` (max number of facet terms; default is 10). There is no maximum, but higher values incur a corresponding performance penalty, especially if the faceted field contains a large number of unique terms.
  - For example: `facet=category,count:5` gets the top five categories in facet results.  
  - **Note**: If the `count` parameter is less than the number of unique terms, the results may not be accurate. This is due to the way faceting queries are distributed across shards. Increasing `count` generally increases the accuracy of the term counts, but at a performance cost.
- `sort` (one of `count` to sort *descending* by count, `-count` to sort *ascending* by count, `value` to sort *ascending* by value, or `-value` to sort *descending* by value)
  - For example: `facet=category,count:3,sort:count` gets the top three categories in facet results in descending order by the number of documents with each city name. For example, if the top three categories are Budget, Motel, and Luxury, and Budget has 5 hits, Motel has 6, and Luxury has 4, then the buckets will be in the order Motel, Budget, Luxury.
  - For example: `facet=rating,sort:-value` produces buckets for all possible ratings, in descending order by value. For example, if the ratings are from 1 to 5, the buckets will be ordered 5, 4, 3, 2, 1, irrespective of how many documents match each rating.
- `values` (pipe-delimited numeric or `Edm.DateTimeOffset` values specifying a dynamic set of facet entry values)
  - For example: `facet=baseRate,values:10|20` produces three buckets: One for base rate 0 up to but not including 10, one for 10 up to but not including 20, and one for 20 or higher.
  - For example: `facet=lastRenovationDate,values:2010-02-01T00:00:00Z` produces two buckets: One for hotels renovated before February 2010, and one for hotels renovated February 1st, 2010 or later.
- `interval` (integer interval greater than 0 for numbers, or `minute`, `hour`, `day`, `week`, `month`, `quarter`, `year` for date time values)
  - For example: `facet=baseRate,interval:100` produces buckets based on base rate ranges of size 100. For example, if base rates are all between $60 and $600, there will be buckets for 0-100, 100-200, 200-300, 300-400, 400-500, and 500-600.
  - For example: `facet=lastRenovationDate,interval:year` produces one bucket for each year when hotels were renovated.
- `timeoffset` ([+-]hh:mm, [+-]hhmm, or [+-]hh) `timeoffset` is optional. It can only be combined with the `interval` option, and only when applied to a field of type `Edm.DateTimeOffset`. The value specifies the UTC time offset to account for in setting time boundaries.
  - For example: `facet=lastRenovationDate,interval:day,timeoffset:-01:00` uses the day boundary that starts at 01:00:00 UTC (midnight in the target time zone)
- **Note**: `count` and `sort` can be combined in the same facet specification, but they cannot be combined with `interval` or `values`, and `interval` and `values` cannot be combined together.
- **Note**: Interval facets on date time are computed based on UTC time if `timeoffset` is not specified. For example: for `facet=lastRenovationDate,interval:day`, the day boundary starts at 00:00:00 UTC. 

> [AZURE.NOTE] When calling **Search** using POST, this parameter is named `facets` instead of `facet`. Also, you specify it as a JSON array of strings where each string is a separate facet expression.

`$filter=[string]` (optional) - A structured search expression in standard OData syntax. See [OData Expression Syntax](#ODataExpressionSyntax) for details on the subset of the OData expression grammar that Azure Search supports.

> [AZURE.NOTE] When calling **Search** using POST, this parameter is named `filter` instead of `$filter`.

`highlight=[string]` (optional) - A set of comma-separated field names used for hit highlights. Only `searchable` fields can be used for hit highlighting.

`highlightPreTag=[string]` (optional, defaults to `<em>`) - A string tag that prepends to hit highlights. Must be set with `highlightPostTag`.

> [AZURE.NOTE] When calling **Search** using GET, reserved characters in the URL must be percent-encoded (for example, %23 instead of #).

`highlightPostTag=[string]` (optional, defaults to `</em>`) - a string tag that appends to hit highlights. Must be set with `highlightPreTag`.

> [AZURE.NOTE] When calling **Search** using GET, reserved characters in the URL must be percent-encoded (for example, %23 instead of #).

`scoringProfile=[string]` (optional) - The name of a scoring profile to evaluate match scores for matching documents in order to sort the results.

`scoringParameter=[string]` (zero or more) - Indicates the values for each parameter defined in a scoring function (for example, `referencePointParameter`) using the format `name-value1,value2,...`.

- For example, if the scoring profile defines a function with a parameter called "mylocation" the query string option would be `&scoringParameter=mylocation--122.2,44.8`. The first dash separates the name from the value list, while the second dash is part of the first value (longitude in this example).
- For scoring parameters such as for tag boosting that can contain commas, you can escape any such values in the list using single quotes. If the values themselves contain single quotes, you can escape them by doubling.
  - For example, if you have a tag boosting parameter called "mytag" and you want to boost on the tag values "Hello, O'Brien" and "Smith", the query string option would be `&scoringParameter=mytag-'Hello, O''Brien',Smith`. Note that quotes are only required for values that contain commas.

> [AZURE.NOTE] When calling **Search** using POST, this parameter is named `scoringParameters` instead of `scoringParameter`. Also, you specify it as a JSON array of strings where each string is a separate `name-values` pair.

`minimumCoverage` (optional, defaults to 100) - a number between 0 and 100 indicating the percentage of the index that must be covered by a search query in order for the query to be reported as a success. By default, the entire index must be available or `Search` will return HTTP status code 503. If you set `minimumCoverage` and `Search` succeeds, it will return HTTP 200 and include a `@search.coverage` value in the response indicating the percentage of the index that was included in the query.

> [AZURE.NOTE] Setting this parameter to a value lower than 100 can be useful for ensuring search availability even for services with only one replica. However, not all matching documents are guaranteed to be present in the search results. If search recall is more important to your application than availability, then it's best to leave `minimumCoverage` at its default value of 100.

`api-version=[string]` (required). The preview version is `api-version=2015-02-28-Preview`. See [Search Service Versioning](http://msdn.microsoft.com/library/azure/dn864560.aspx) for details and alternative versions.

Note: For this operation, the `api-version` is specified as a query parameter in the URL regardless of whether you call **Search** with GET or POST.

**Request Headers**

The following list describes the required and optional request headers.

- `api-key`: The `api-key` is used to authenticate the request to your Search service. It is a string value, unique to your service URL. The **Search** request can specify either an admin key or query key for `api-key`.

You will also need the service name to construct the request URL. You can get the service name and `api-key` from your service dashboard in the Azure Portal. See [Create an Azure Search service in the portal](search-create-service-portal.md) for page navigation help.

**Request Body**

For GET: None.

For POST:

    {
      "count": true | false (default),
      "facets": [ "facet_expression_1", "facet_expression_2", ... ],
      "filter": "odata_filter_expression",
      "highlight": "highlight_field_1, highlight_field_2, ...",
      "highlightPreTag": "pre_tag",
      "highlightPostTag": "post_tag",
      "minimumCoverage": # (% of index that must be covered to declare query successful; default 100),
      "moreLikeThis": "document_key" (mutually exclusive with "search" parameter),
      "orderby": "orderby_expression",
      "scoringParameters": [ "scoring_parameter_1", "scoring_parameter_2", ... ],
      "scoringProfile": "scoring_profile_name",
      "search": "simple_query_expression",
      "searchFields": "field_name_1, field_name_2, ...",
      "searchMode": "any" (default) | "all",
      "select": "field_name_1, field_name_2, ...",
      "skip": # (default 0),
      "top": #
    }

**Continuation of Partial Search Responses**

Sometimes Azure Search can't return all the requested results in a single Search response. This can happen for different reasons, such as when the query requests too many documents by not specifying `$top` or specifying a value for `$top` that is too large. In such cases, Azure Search will include the `@odata.nextLink` annotation in the response body, and also `@search.nextPageParameters` if it was a POST request. You can use the values of these annotations to formulate another Search request to get the next part of the search response. This is called a ***continuation*** of the original Search request, and the annotations are generally called ***continuation tokens***. See [the example below](#SearchResponse) for details on the syntax of these annotations and where they appear in the response body. 

The reasons why Azure Search might return continuation tokens are implementation-specific and subject to change. Robust clients should always be ready to handle cases where fewer documents than expected are returned and a continuation token is included to continue retrieving documents. Also note that you must use the same HTTP method as the original request in order to continue. For example, if you sent a GET request, any continuation requests you send must also use GET (and likewise for POST).

<a name="SearchResponse"></a>
**Response**

Status Code: 200 OK is returned for a successful response.

    {
      "@odata.count": # (if $count=true was provided in the query),
      "@search.coverage": # (if minimumCoverage was provided in the query),
      "@search.facets": { (if faceting was specified in the query)
        "facet_field": [
          {
            "value": facet_entry_value (for non-range facets),
            "from": facet_entry_value (for range facets),
            "to": facet_entry_value (for range facets),
            "count": number_of_documents
          }
        ],
        ...
      },
      "@search.nextPageParameters": { (request body to fetch the next page of results if not all results could be returned in this response and Search was called with POST)
        "count": ... (value from request body if present),
        "facets": ... (value from request body if present),
        "filter": ... (value from request body if present),
        "highlight": ... (value from request body if present),
        "highlightPreTag": ... (value from request body if present),
        "highlightPostTag": ... (value from request body if present),
        "minimumCoverage": ... (value from request body if present),
        "moreLikeThis": ... (value from request body if present),
        "orderby": ... (value from request body if present),
        "scoringParameters": ... (value from request body if present),
        "scoringProfile": ... (value from request body if present),
        "search": ... (value from request body if present),
        "searchFields": ... (value from request body if present),
        "searchMode": ... (value from request body if present),
        "select": ... (value from request body if present),
        "skip": ... (page size plus value from request body if present),
        "top": ... (value from request body if present minus page size),
      },
      "value": [
        {
          "@search.score": document_score (if a text query was provided),
          "@search.highlights": {
            field_name: [ subset of text, ... ],
            ...
          },
          key_field_name: document_key,
          field_name: field_value (retrievable fields or specified projection),
          ...
        },
        ...
      ],
      "@odata.nextLink": (URL to fetch the next page of results if not all results could be returned in this response; Applies to both GET and POST)
    }

**Examples:**

You can find additional examples on the [OData Expression Syntax for Azure Search](https://msdn.microsoft.com/library/azure/dn798921.aspx) page.

1)	Search the Index sorted descending by date.


    GET /indexes/hotels/docs?search=*&$orderby=lastRenovationDate desc&api-version=2015-02-28-Preview

    POST /indexes/hotels/docs/search?api-version=2015-02-28-Preview
    {
      "search": "*",
      "orderby": "lastRenovationDate desc"
    }

2)	In a faceted search, search the index and retrieve facets for categories, rating, tags, as well as items with baseRate in specific ranges:


    GET /indexes/hotels/docs?search=test&facet=category&facet=rating&facet=tags&facet=baseRate,values:80|150|220&api-version=2015-02-28-Preview

    POST /indexes/hotels/docs/search?api-version=2015-02-28-Preview
    {
      "search": "test",
      "facets": [ "category", "rating", "tags", "baseRate,values:80|150|220" ]
    }

3)	Using a filter, narrow down the previous faceted query results after the user clicks on rating 3 and category "Motel":


    GET /indexes/hotels/docs?search=test&facet=tags&facet=baseRate,values:80|150|220&$filter=rating eq 3 and category eq 'Motel'&api-version=2015-02-28-Preview

    POST /indexes/hotels/docs/search?api-version=2015-02-28-Preview
    {
      "search": "test",
      "facets": [ "tags", "baseRate,values:80|150|220" ],
      "filter": "rating eq 3 and category eq 'Motel'"
    }

4) In a faceted search, set an upper limit on unique terms returned in a query. The default is 10, but you can increase or decrease this value using the `count` parameter on the `facet` attribute:


    GET /indexes/hotels/docs?search=test&facet=city,count:5&api-version=2015-02-28-Preview

    POST /indexes/hotels/docs/search?api-version=2015-02-28-Preview
    {
      "search": "test",
      "facets": [ "city,count:5" ]
    }

5)	Search the Index within specific fields; For example, a language-specific field:


    GET /indexes/hotels/docs?search=hôtel&searchFields=description_fr&api-version=2015-02-28-Preview

    POST /indexes/hotels/docs/search?api-version=2015-02-28-Preview
    {
      "search": "hôtel",
      "searchFields": "description_fr"
    }

6) Search the Index across multiple fields. For example, you can store and query searchable fields in multiple languages, all within the same index.  If English and French descriptions co-exist in the same document, you can return any or all in the query results:


	GET /indexes/hotels/docs?search=hotel&searchFields=description,description_fr&api-version=2015-02-28-Preview

	POST /indexes/hotels/docs/search?api-version=2015-02-28-Preview
    {
      "search": "hotel",
      "searchFields": "description, description_fr"
    }

Note that you can only query one index at a time. Do not create multiple indexes for each language unless you plan to query one at a time.

7)	Paging - Get the 1st page of items (page size is 10):


    GET /indexes/hotels/docs?search=*&$skip=0&$top=10&api-version=2015-02-28-Preview

    POST /indexes/hotels/docs/search?api-version=2015-02-28-Preview
    {
      "search": "*",
      "skip": 0,
      "top": 10
    }

8)	Paging - Get the 2nd page of items (page size is 10):


    GET /indexes/hotels/docs?search=*&$skip=10&$top=10&api-version=2015-02-28-Preview

    POST /indexes/hotels/docs/search?api-version=2015-02-28-Preview
    {
      "search": "*",
      "skip": 10,
      "top": 10
    }

9)	Retrieve a specific set of fields:


    GET /indexes/hotels/docs?search=*&$select=hotelName,description&api-version=2015-02-28-Preview

    POST /indexes/hotels/docs/search?api-version=2015-02-28-Preview
    {
      "search": "*",
      "select": "hotelName, description"
    }

10)  Retrieve documents matching a specific filter expression


    GET /indexes/hotels/docs?$filter=(baseRate ge 60 and baseRate lt 300) or hotelName eq 'Fancy Stay'&api-version=2015-02-28-Preview

    POST /indexes/hotels/docs/search?api-version=2015-02-28-Preview
    {
      "filter": "(baseRate ge 60 and baseRate lt 300) or hotelName eq 'Fancy Stay'"
    }

11) Search the index and return fragments with hit highlights


    GET /indexes/hotels/docs?search=something&highlight=description&api-version=2015-02-28-Preview

    POST /indexes/hotels/docs/search?api-version=2015-02-28-Preview
    {
      "search": "something",
      "highlight": "description"
    }

12) Search the index and return documents sorted from closer to farther away from a reference location


    GET /indexes/hotels/docs?search=something&$orderby=geo.distance(location, geography'POINT(-122.12315 47.88121)')&api-version=2015-02-28-Preview

    POST /indexes/hotels/docs/search?api-version=2015-02-28-Preview
    {
      "search": "something",
      "orderby": "geo.distance(location, geography'POINT(-122.12315 47.88121)')"
    }

13) Search the index assuming there's a scoring profile called "geo" with two distance scoring functions, one defining a parameter called "currentLocation" and one defining a parameter called "lastLocation"


    GET /indexes/hotels/docs?search=something&scoringProfile=geo&scoringParameter=currentLocation--122.123,44.77233&scoringParameter=lastLocation--121.499,44.2113&api-version=2015-02-28-Preview

    POST /indexes/hotels/docs/search?api-version=2015-02-28-Preview
    {
      "search": "something",
      "scoringProfile": "geo",
      "scoringParameters": [ "currentLocation--122.123,44.77233", "lastLocation--121.499,44.2113" ]
    }

14) Find documents in the index using [simple query syntax](https://msdn.microsoft.com/library/dn798920.aspx). This query returns hotels where searchable fields contain the terms "comfort" and "location" but not "motel":


    GET /indexes/hotels/docs?search=comfort +location -motel&searchMode=all&api-version=2015-02-28-Preview

    POST /indexes/hotels/docs/search?api-version=2015-02-28-Preview
    {
      "search": "comfort +location -motel",
      "searchMode": "all"
    }

Note the use of `searchMode=all` above. Including this parameter overrides the default of `searchMode=any`, ensuring that `-motel` means "AND NOT" instead of "OR NOT". Without `searchMode=all`, you get "OR NOT" which expands rather than restricts search results, and this can be counter-intuitive to some users.

15) Find documents in the index using [lucene query syntax](https://msdn.microsoft.com/library/mt589323.aspx). This query returns hotels where the category field contains the term "budget" and all searchable fields containing the phrase "recently renovated". Documents containing the phrase "recently renovated" are ranked higher as a result of the term boost value (3)

    GET /indexes/hotels/docs?search=category:budget AND \"recently renovated\"^3&searchMode=all&api-version=2015-02-28-Preview&querytype=full

    POST /indexes/hotels/docs/search?api-version=2015-02-28-Preview
    {
      "search": "category:budget AND \"recently renovated\"^3",
      "queryType": "full",
      "searchMode": "all"
    }

<a name="LookupAPI"></a>
## Lookup Document

The **Lookup Document** operation retrieves a document from Azure Search. This is useful when a user clicks on a specific search result, and you want to look up specific details about that document.

    GET https://[service name].search.windows.net/indexes/[index name]/docs/[key]?[query parameters]
    api-key: [admin or query key]

**Request**

HTTPS is required for service requests. The **Lookup Document** request can be constructed as follows.

    GET /indexes/[index name]/docs/key?[query parameters]

Alternatively, you can use the traditional OData syntax for key lookup:

    GET /indexes('[index name]')/docs('[key]')?[query parameters]

The request URI includes an [index name] and [key], specifying which document to retrieve from which index. You can only get one document at a time. Use **Search** to get multiple documents in a single request.

**Query Parameters**

`$select=[string]` (optional) - a list of comma-separated fields to retrieve. If unspecified or set to `*`, all fields marked as retrievable in the schema are included in the projection.

`api-version=[string]` (required). The preview version is `api-version=2015-02-28-Preview`. See [Search Service Versioning](http://msdn.microsoft.com/library/azure/dn864560.aspx) for details and alternative versions.

Note: For this operation, the `api-version` is specified as a query parameter.

**Request Headers**

The following list describes the required and optional request headers.

- `api-key`: The `api-key` is used to authenticate the request to your Search service. It is a string value, unique to your service URL. The **Lookup Document** request can specify either an admin key or query key for `api-key`.

You will also need the service name to construct the request URL. You can get the service name and `api-key` from your service dashboard in the Azure Portal. See [Create an Azure Search service in the portal](search-create-service-portal.md) for page navigation help.

**Request Body**

None.

**Response**

Status Code: 200 OK is returned for a successful response.

    {
      field_name: field_value (fields matching the default or specified projection)
    }

**Example**

Lookup the document that has key '2'

    GET /indexes/hotels/docs/2?api-version=2015-02-28-Preview

Lookup the document that has key '3' using OData syntax:

    GET /indexes('hotels')/docs('3')?api-version=2015-02-28-Preview

<a name="CountDocs"></a>
## Count Documents

The **Count Documents** operation retrieves a count of the number of documents in a search index. The `$count` syntax is part of the OData protocol.

    GET https://[service name].search.windows.net/indexes/[index name]/docs/$count?api-version=[api-version]
    Accept: text/plain
    api-key: [admin or query key]

**Request**

HTTPS is required for service requests. The **Count Documents** request can be constructed using the GET method.

The [index name] in the request URI tells the service to return a count of all items in the docs collection of the specified index.

`api-version=[string]` (required). The preview version is `api-version=2015-02-28-Preview`. See [Search Service Versioning](http://msdn.microsoft.com/library/azure/dn864560.aspx) for details and alternative versions.

**Request Headers**

The following list describes the required and optional request headers.

- `Accept`: This value must be set to `text/plain`.
- `api-key`: The `api-key` is used to authenticate the request to your Search service. It is a string value, unique to your service URL. The **Count Documents** request can specify either an admin key or query key for `api-key`.

You will also need the service name to construct the request URL. You can get the service name and `api-key` from your service dashboard in the Azure Portal. See [Create an Azure Search service in the portal](search-create-service-portal.md) for page navigation help.

**Request Body**

None.

**Response**

Status Code: 200 OK is returned for a successful response.

The response body contains the count value as an integer formatted in plain text.

<a name="Suggestions"></a>
## Suggestions

The **Suggestions** operation retrieves suggestions based on partial search input. It's typically used in search boxes to provide type-ahead suggestions as users are entering search terms.

Suggestion requests aim at suggesting target documents, so the suggested text may be repeated if multiple candidate documents match the same search input. You can use `$select` to retrieve other document fields (including the document key) so that you can tell which document is the source for each suggestion.

A **Suggestions** operation is issued as a GET or POST request.

    GET https://[service name].search.windows.net/indexes/[index name]/docs/suggest?[query parameters]
    api-key: [admin or query key]

    POST https://[service name].search.windows.net/indexes/[index name]/docs/suggest?api-version=[api-version]
    Content-Type: application/json
    api-key: [admin or query key]

**When to use POST instead of GET**

When you use HTTP GET to call the **Suggestions** API, you need to be aware that the length of the request URL cannot exceed 8 KB. This is usually enough for most applications. However, some applications produce very large queries, specifically OData filter expressions. For these applications, using HTTP POST is a better choice because it allows larger filters than GET. With POST, the number of clauses in a filter is the limiting factor, not the size of the raw filter string since the request size limit for POST is approximately 16 MB.

> [AZURE.NOTE] Even though the POST request size limit is very large, filter expressions cannot be arbitrarily complex. See [OData expression syntax](https://msdn.microsoft.com/library/dn798921.aspx) for more information about filter complexity limitations.

**Request**

HTTPS is required for service requests. The **Suggestions** request can be constructed using the GET or POST methods.

The request URI specifies the name of the index to query. Parameters, such as the partially input search term, are specified on the query string in the case of GET requests, and in the request body in the case of POST requests.

As a best practice when creating GET requests, remember to [URL-encode](https://msdn.microsoft.com/library/system.uri.escapedatastring.aspx) specific query parameters when calling the REST API directly. For **Suggestions** operations, this includes:

- `$filter`
- `highlightPreTag`
- `highlightPostTag`
- `search`

URL encoding is only recommended on the above query parameters. If you inadvertently URL-encode the entire query string (everything after the ?), requests will break.

Also, URL encoding is only necessary when calling the REST API directly using GET. No URL encoding is necessary when calling **Suggestions** using POST, or when using the [.NET client library](https://msdn.microsoft.com/library/dn951165.aspx), which handles URL encoding for you.

**Query Parameters**

**Suggestions** accepts several parameters that provide query criteria and also specify search behavior. You provide these parameters in the URL query string when calling **Suggestions** via GET, and as JSON properties in the request body when calling **Suggestions** via POST. The syntax for some parameters is slightly different between GET and POST. These differences are noted as applicable below:

`search=[string]` - the search text to use to suggest queries. Must be at least 1 character, and no more than 100 characters.

`highlightPreTag=[string]` (optional) - a string tag that prepends to search hits. Must be set with `highlightPostTag`.

> [AZURE.NOTE] When calling **Suggestions** using GET, reserved characters in the URL must be percent-encoded (for example, %23 instead of #).

`highlightPostTag=[string]` (optional) - a string tag that appends to search hits. Must be set with `highlightPreTag`.

> [AZURE.NOTE] When calling **Suggestions** using GET, reserved characters in the URL must be percent-encoded (for example, %23 instead of #).

`suggesterName=[string]` - the name of the suggester as specified in the `suggesters` collection that's part of the index definition. A `suggester` determines which fields are scanned for suggested query terms. See [Suggesters](#Suggesters) for details.

`fuzzy=[boolean]` (optional, default = false) - when set to true this API will find suggestions even if there's a substituted or missing character in the search text. While this provides a better experience in some scenarios it comes at a performance cost as fuzzy suggestion searches are slower and consume more resources.

`searchFields=[string]` (optional) - the list of comma-separated field names to search for the specified search text. Target fields must be enabled for suggestions.

`$top=#` (optional, default = 5) - the number of suggestions to retrieve. Must be a number between 1 and 100.

> [AZURE.NOTE] When calling **Suggestions** using POST, this parameter is named `top` instead of `$top`.

`$filter=[string]` (optional) - an expression that filters the documents considered for suggestions.

> [AZURE.NOTE] When calling **Suggestions** using POST, this parameter is named `filter` instead of `$filter`.

`$orderby=[string]` (optional) - a list of comma-separated expressions to sort the results by. Each expression can be either a field name or a call to the `geo.distance()` function. Each expression can be followed by `asc` to indicated ascending, and `desc` to indicate descending. The default is ascending order. There is a limit of 32 clauses for `$orderby`.

> [AZURE.NOTE] When calling **Suggestions** using POST, this parameter is named `orderby` instead of `$orderby`.

`$select=[string]` (optional) - a list of comma-separated fields to retrieve. If unspecified, only the document key and suggestion text is returned. You can explicitly request all fields by setting this parameter to `*`.

> [AZURE.NOTE] When calling **Suggestions** using POST, this parameter is named `select` instead of `$select`.

`minimumCoverage` (optional, defaults to 80) - a number between 0 and 100 indicating the percentage of the index that must be covered by a suggestions query in order for the query to be reported as a success. By default, at least 80% of the index must be available or `Suggest` will return HTTP status code 503. If you set `minimumCoverage` and `Suggest` succeeds, it will return HTTP 200 and include a `@search.coverage` value in the response indicating the percentage of the index that was included in the query.

> [AZURE.NOTE] Setting this parameter to a value lower than 100 can be useful for ensuring search availability even for services with only one replica. However, not all matching suggestions are guaranteed to be present in the results. If recall is more important to your application than availability, then it's best not to lower `minimumCoverage` below its default value of 80.

`api-version=[string]` (required). The preview version is `api-version=2015-02-28-Preview`. See [Search Service Versioning](http://msdn.microsoft.com/library/azure/dn864560.aspx) for details and alternative versions.

Note: For this operation, the `api-version` is specified as a query parameter in the URL regardless of whether you call **Suggestions** with GET or POST.

**Request Headers**

The following list describes the required and optional request headers

- `api-key`: The `api-key` is used to authenticate the request to your Search service. It is a string value, unique to your service URL. The **Suggestions** request can specify either an admin key or query key as the `api-key`.

You will also need the service name to construct the request URL. You can get the service name and `api-key` from your service dashboard in the Azure Portal. See [Create an Azure Search service in the portal](search-create-service-portal.md) for page navigation help.

**Request Body**

For GET: None.

For POST:

    {
      "filter": "odata_filter_expression",
	  "fuzzy": true | false (default),
      "highlightPreTag": "pre_tag",
      "highlightPostTag": "post_tag",
      "minimumCoverage": # (% of index that must be covered to declare query successful; default 80),
      "orderby": "orderby_expression",
      "search": "partial_search_input",
      "searchFields": "field_name_1, field_name_2, ...",
      "select": "field_name_1, field_name_2, ...",
	  "suggesterName": "suggester_name",
      "top": # (default 5)
    }

**Response**

Status Code: 200 OK is returned for a successful response.

    {
      "@search.coverage": # (if minimumCoverage was provided in the query),
      "value": [
        {
          "@search.text": "...",
          "<key field>": "..."
        },
        ...
      ]
    }

If the projection option is used to retrieve fields they are included in each element of the array:

    {
      "@search.coverage": # (if minimumCoverage was provided in the query),
      "value": [
        {
          "@search.text": "...",
          "<key field>": "..."
          <other projected data fields>
        },
        ...
      ]
    }

**Example**

Retrieve 5 suggestions where the partial search input is 'lux'

    GET /indexes/hotels/docs/suggest?search=lux&$top=5&suggesterName=sg&api-version=2015-02-28-Preview

    POST /indexes/hotels/docs/suggest?api-version=2015-02-28-Preview
    {
      "search": "lux",
      "top": 5,
      "suggesterName": "sg"
    }
