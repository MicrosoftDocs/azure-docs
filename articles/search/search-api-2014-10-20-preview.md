<properties pageTitle="Azure Search Service REST API Version 2014-10-20-Preview" description="Azure Search Service REST API Version 2014-10-20-Preview" services="search" solutions="" documentationCenter="" authors="HeidiSteen" manager="mblythe" editor="" />

<tags ms.service="search" ms.devlang="rest-api" ms.workload="search" ms.topic="article"  ms.tgt_pltfrm="na" ms.date="08/25/2015" ms.author="heidist" />

#Azure Search Service REST API: Version 2014-10-20-Preview

This document describes the pre-release **2014-10-20-Preview** version of the Azure Search Service REST API, released as an update to the first Azure Search Public Preview. Because this version will be phased out soon, we strongly recommend that you use the version associated with the generally available release instead. For guidance on code migration, see [Transition from preview to the generally available API version](search-transition-from-preview.md).

Other API content related to the **2014-10-20-Preview** version includes the following:

- [Scoring Profiles (Azure Search Service REST API: 2014-10-20-Preview)](search-api-scoring-profiles-2014-10-20-preview.md)

Documentation for the current, generally available version of the Azure Search REST API can be found on MSDN. See [Azure Search Service REST API](http://msdn.microsoft.com/library/azure/dn798935.aspx) for more information.

##About the Service REST API

Azure Search is a cloud-based service that you can use to build custom search applications.
Azure Search has the concepts of *search services* and *indexes*, where a search service contains one or more indexes. Your search service is uniquely identified by a fully-qualified domain name (for example: `mysearchservice.search.windows.net`). An api-key is generated when the service is provisioned, and is used to authenticate requests to your Azure Search service.

There are two types of actions that can be executed against the Azure Search Service:

- **Index Management**: This includes administrative tasks that are executed against a search service or search index.

- **Document Actions**: These actions query and manage the corpus for a given index.

The APIs documented in this section provide access to operations on search data, such as index creation and population, document upload, and queries. When calling the API, keep the following points in mind:

- All APIs are defined in terms of HTTP requests and responses in OData JSON format.

- All APIs must be accompanied with an `api-key` in the header or in the query string as described in the notes below.

- All APIs must be issued over HTTPS (on the default port - 443).

- All API requests must include the `api-version` query string parameter. Its value must be set to the version of the current service release, which is shown in the following example:

    GET /indexes?api-version=2014-10-20-Preview

- All API requests can optionally set the `Accept` HTTP header. If unset, the default is assumed to be `application/json`.

A separate API is provided for service administration. Examples of service administration operations include provisioning the service or altering capacity. For more information about this API, see Azure Search Management REST API.

### Endpoint ###

The endpoint for service operations is the URL of the Azure Search service you provisioned: https://*your-service-name*.search.windows.net.


### Versions ###

There are multiple API versions for Azure Search. See [Search Service Versioning](http://msdn.microsoft.com/library/azure/dn864560.aspx) for a list of available versions.


<a name="Authentication"></a>
### Authentication and Access Control###

Authentication to an Azure Search service requires two pieces of information: a search service URL, and an `api-key`. The `api-keys` are generated when the service is created, and can be regenerated on demand after the service is provisioned. An `api-key` is always one of the following:

- an admin key that grants access to all operations, including write operations like creating and deleting indexes.
- a query key that authenticates read-only requests.

You can have 2 admin keys and up to 50 query keys per service. Having 2 admin keys is helpful when you need to rollover one of the keys.

Access control is limited to service administration via the role-based access controls (RBAC) provided in the Azure Preview Portal. Roles are used to set levels of access for service administration. For example, viewing the admin key is restricted to the Owner and Contributor roles, whereas viewing service status is visible to members of any role.

Data operations performed against a Search service endpoint, including index management, index population, and queries, are accessed via `api-keys` exclusively. RBAC does not apply to either index or document-related operations. To learn more about `api-keys` or RBAC in Azure Search, see [Manage your Search service on Microsoft Azure](search-manage.md).

**Note**: In general it is considered poor security practice to pass sensitive data such as `api-key` in the request URI. For this reason, Azure Search will only accept a query key as an `api-key` in the query string, and you should avoid doing so unless the contents of your index should be publicly available. Instead, we recommend passing your `api-key` as a request header.

###Summary of APIs###

The Azure Search Service API supports two syntaxes for entity lookup: [simple](https://msdn.microsoft.com/library/dn798920.aspx) and alternate OData syntax (see [Support for OData (Azure Search API)](http://msdn.microsoft.com/library/azure/dn798932.aspx) for details). The following list shows the simple syntax.

[Create Index](#CreateIndex)

    POST /indexes?api-version=2014-10-20-Preview

[Update Index](#UpdateIndex)

    PUT /indexes/[index name]?api-version=2014-10-20-Preview

[Get Index](#GetIndex)

    GET /indexes/[index name]?api-version=2014-10-20-Preview

[Listing Indexes](#ListIndexes)

    GET /indexes?api-version=2014-10-20-Preview

[Get Index Statistics](#GetIndexStats)

    GET /indexes/[index name]/stats?api-version=2014-10-20-Preview

[Delete an Index](#DeleteIndex)

    DELETE /indexes/[index name]?api-version=2014-10-20-Preview

[Add, Delete, and Update Data within an Index](#AddOrUpdateDocuments)

    POST /indexes/[index name]/docs/index?api-version=2014-10-20-Preview

[Search Documents](#SearchDocs)

    GET /indexes/[index name]/docs?[query parameters]

[Lookup Document](#LookupAPI)

     GET /indexes/[index name]/docs/[key]?[query parameters]

[Count Documents](#CountDocs)

    GET /indexes/[index name]/docs/$count?api-version=2014-10-20-Preview

[Suggestions](#Suggestions)

    GET /indexes/[index name]/docs/suggest?[query parameters]

________________________________________
<a name="IndexOps"></a>
## Index Operations

You can create and manage indexes in Azure Search service via simple HTTP requests (POST, GET, PUT, DELETE) against a given index resource. To create an index, you first POST a JSON document that describes the index schema. The schema defines the fields of the index, their data types, and how they can be used (for example, in full-text searches, filters, sorting, faceting, or suggestions). It also defines scoring profiles, suggesters and other attributes to configure the behavior of the index.

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
## Create Index ##

You can create a new index within an Azure Search service using an HTTP POST request. The body of the request is a JSON document that specifies the index name, fields, attributes to control query behavior, scoring of results, suggesters and CORS options.

    POST https://[service name].search.windows.net/indexes?api-version=[api-version]
    Content-Type: application/json
    api-key: [admin key]

Alternatively, you can use PUT and specify the index name on the URI. If the index does not exist, it will be created.

    PUT https://[search service url]/indexes/[index name]?api-version=[api-version]

**Note**: The maximum number of indexes allowed varies by pricing tier. The free service allows up to 3 indexes. Standard service allows 50 indexes per Search service. See [Limits and constraints](http://msdn.microsoft.com/library/azure/dn798934.aspx) for details.

**Request**

HTTPS is required for all service requests. The **Create Index** request can be constructed using either a POST or PUT method. When using POST, you must provide an index name in the request body along with the index schema definition. With PUT, the index name is part of the URL. If the index doesn't exist, it is created. If it already exists, it is updated to the new definition.

The index name must be lower case, start with a letter or number, have no slashes or dots, and be less than 128 characters. After starting the index name with a letter or number, the rest of the name can include any letter, number and dashes, as long as the dashes are not consecutive.

The `api-version` is required. Valid values include `2014-07-31-Preview` or `2014-10-20-Preview`. You can specify which one to use on each request to get version-specific behaviors, but as a best practice, use the same version throughout your code. The recommended version is `2014-07-31-Preview` for general use. Alternatively, use `2014-10-20-Preview` to evaluate experimental features, such as support for language analyzers expressed through the analyzer index attribute. See [Search Service Versioning](http://msdn.microsoft.com/library/azure/dn864560.aspx) for details about API versions. See [Language support](#LanguageSupport) for details about language analyzers.

**Request Headers**

The following list describes the required and optional request headers.

- `Content-Type`: Required. Set this to `application/json`
- `api-key`: Required. The `api-key` is used to
- authenticate the request to your Search service. It is a string value, unique to your service. The **Create Index** request must include an `api-key` header set to your admin key (as opposed to a query key).

You will also need the service name to construct the request URL. You can get both the service name and `api-key` from your service dashboard in the Azure Preview Portal. See [Get started with Azure Search](search-get-started.md) for page navigation help.

<a name="RequestData"></a>
**Request Body Syntax**

The body of the request contains a schema definition, which includes the list of data fields within documents that will be fed into this index, data types, attributes, as well as an optional list of scoring profiles that are used to score matching documents at query time.

Note that for a POST request, you must specify the index name in the request body.

There can only be one key field in the index. It has to be a string field. This field represents the unique identifier for each document stored within the index.

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
          "suggestions": true | false (default, only Edm.String and Collection(Edm.String) fields can be used for suggestions),
          "key": true | false (default, only Edm.String fields can be keys),
          "retrievable": true (default) | false,
		  "analyzer": "name of text analyzer"
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
      "defaultScoringProfile": (optional) "...",
      "corsOptions": (optional) {
        "allowedOrigins": ["*"] | ["origin_1", "origin_2", ...],
        "maxAgeInSeconds": (optional) max_age_in_seconds (non-negative integer)
      }
    }

Note: Data type `Edm.Int64` is supported starting with API version 2014-10-20-Preview.

**Index Attributes**

The following attributes can be set when creating an index. For details about scoring and scoring profiles, see [Scoring Profiles (Azure Search Service REST API: 2014-10-20-Preview)](search-api-scoring-profiles-2014-10-20-preview.md).

`name` - Sets the name of the field.

`type` - Sets the data type for the field. See [Supported Data Types](#DataTypes) for a list of supported types.

`searchable` - Marks the field as full-text search-able. This means it will undergo analysis such as word-breaking during indexing. If you set a `searchable` field to a value like "sunny day", internally it will be split into the individual tokens "sunny" and "day". This enables full-text searches for these terms. Fields of type `Edm.String` or `Collection(Edm.String)` are `searchable` by default. Fields of other types cannot be `searchable`.

  - **Note**: `searchable` fields consume extra space in your index since Azure Search will store an additional tokenized version of the field value for full-text searches. If you want to save space in your index and you don't need a field to be included in searches, set `searchable` to `false`.

`filterable` - Allows the field to be referenced in `$filter` queries. `filterable` differs from `searchable` in how strings are handled. Fields of type `Edm.String` or `Collection(Edm.String)` that are `filterable` do not undergo word-breaking, so comparisons are for exact matches only. For example, if you set such a field `f` to "sunny day", `$filter=f eq 'sunny'` will find no matches, but `$filter=f eq 'sunny day'` will. All fields are `filterable` by default.

`sortable` - By default the system sorts results by score, but in many experiences users will want to sort by fields in the documents. Fields of type `Collection(Edm.String)` cannot be `sortable`. All other fields are `sortable` by default.

`facetable`- Typically used in a presentation of search results that includes hit count by category (for example, search for digital cameras and see hits by brand, by megapixels, by price, etc.). This option cannot be used with fields of type `Edm.GeographyPoint`. All other fields are `facetable` by default.

  - **Note**: Fields of type `Edm.String` that are `filterable`, `sortable`, or `facetable` can be at most 32KB in length. This is because such fields are treated as a single search term, and the maximum length of a term in Azure Search is 32KB. If you need to store more text than this in a single string field, you will need to explicitly set `filterable`, `sortable`, and `facetable` to `false` in your index definition.

`suggestions` - Sets whether the field can be used for auto-complete for type ahead. This can only be set for fields of type `Edm.String` or `Collection(Edm.String)`. `suggestions` is `false` by default since it requires extra space in your index. **Note**: consider using the `suggesters` property introduced in version 2014-10-20-Preview instead of this option for suggestions. In a future version the `suggestions` property will be deprecated in favor of using a separate `suggesters` specification.

  - **Note**: If a field has none of the above attributes set to `true` (`searchable`, `filterable`, `sortable`, `facetable`, or `suggestions`) the field is effectively excluded from the inverted index. This option is useful for fields that are not used in queries, but are needed in search results. Excluding such fields from the index improves performance.

`key` - Marks the field as containing unique identifiers for documents within the index. Exactly one field must be chosen as the `key` field and it must be of type `Edm.String`. Key fields can be used to look up documents directly via the [Lookup API](#LookupAPI).

`retrievable` - Sets whether the field can be returned in a search result.  This is useful when you want to use a field (for example, margin) as a filter, sorting, or scoring mechanism but do not want the field to be visible to the end user. This attribute must be `true` for `key` fields.

`scoringProfiles` - Defines custom scoring behaviors that let you influence which items appear higher in search results. Scoring profiles are made up of weighted fields and functions. See [Scoring Profiles (Azure Search Service REST API: 2014-10-20-Preview)](search-api-scoring-profiles-2014-10-20-preview.md) for more information about the attributes used in a scoring profile.

`analyzer` - Sets the name of the text analyzer to use for the field. For the allowed set of values see [Language Support](#LanguageSupport). This option can be used only with `searchable` fields. Once the analyzer is chosen, it cannot be changed for the field.


<a name="LanguageSupport"></a>
**Language support**

Searchable fields undergo analysis that most frequently involves word-breaking, text normalization, and filtering out terms. By default, searchable fields in Azure Search are analyzed with the [Apache Lucene Standard analyzer](http://lucene.apache.org/core/4_9_0/analyzers-common/index.html) which breaks text into elements following the["Unicode Text Segmentation"](http://unicode.org/reports/tr29/) rules. Additionally, the standard analyzer converts all characters to their lower case form. Both indexed documents and search terms go through the analysis during indexing and query processing.

Azure Search allows indexing fields in a variety of languages. Each of those languages requires a non-standard text analyzer which accounts for characteristics of a given language. For example, the French analyzer applies a [Light French Stemmer](http://lucene.apache.org/core/4_9_0/analyzers-common/org/apache/lucene/analysis/fr/FrenchLightStemmer.html) to reduce words to their [word stems](http://en.wikipedia.org/wiki/Stemming). Additionally, it removes [elisions](http://en.wikipedia.org/wiki/Elision) and French stop words from the analyzed text.
The analyzer for English extends the standard analyzer. It removes possessives (trailing 's) from words, applies stemming as per [Porter Stemming algorithm](http://tartarus.org/~martin/PorterStemmer/) and removes English [stop words](http://en.wikipedia.org/wiki/Stop_words).

The analyzer can be configured independently for each field in the index definition by setting the `analyzer` property. For example, you can have separate fields for English, French, and Spanish hotel descriptions that exist side-by-side in the same index. The query specifies which language-specific field to return in your search queries.

Below is the list of supported analyzers together with a short description of their features:

<table style="font-size:12">
    <tr>
		<th>Language</th>
		<th>Analyzer name</th>
		<th>Description</th>
	</tr>
    <tr>
		<td>Arabic</td>
		<td>ar.lucene</td>
		<td>
		<ul>
			<li>Implements Arabic orthographic normalization</li>
			<li>Applies light algorithmic stemming</li>
			<li>Filters out Arabic stop wordsr</li>
		</ul>
		</td>
	</tr>
    <tr>
		<td>Brazilian</td>
		<td>pt-Br.lucene</td>
		<td>
		<ul>
			<li>Applies light stemming</li>
			<li>Filters out Brazilian stop words</li>
		</ul>
		</td>
	</tr>
    <tr>
		<td>Chinese Simplified</td>
		<td>zh-Hans.lucene</td>
		<td>
		<ul>
			<li>Uses probabilistic knowledge models to find the optimal word segmentation</li>
			<li>Filters out Chinese stop words</li>
		</ul>
		</td>
	</tr>
    <tr>
		<td>Chinese Traditional</td>
		<td>zh-Hant.lucene</td>
		<td>
		<ul>
			<li>Indexes bigrams (overlapping groups of two adjacent Chinese characters)</li>
			<li>Normalizes character width differences</li>
		</ul>
		</td>
	<tr>
    <tr>
		<td>Czech</td>
		<td>cs.lucene</td>
		<td>
		<ul>
			<li>Applies light stemming</li>
			<li>Filters out Czech stop words</li>
		</ul>
		</td>
	</tr>
    <tr>
		<td>Danish</td>
		<td>da.lucene</td>
		<td>
		<ul>
			<li>Applies light stemming</li>
			<li>Filters out Danish stop words</li>
		</ul>
		</td>
	</tr>
    <tr>
		<td>Dutch</td>
		<td>nl.lucene</td>
		<td>
		<ul>
			<li>Applies light stemming</li>
			<li>Filters out Dutch stop words</li>
		</ul>
		</td>
	</tr>
    <tr>
		<td>German</td>
		<td>de.lucene</td>
		<td>
		<ul>
			<li>Applies light stemming</li>
			<li>Filters out German stop words</li>
		</ul>
		</td>
	</tr>
    <tr>
		<td>Greek</td>
		<td>el.lucene</td>
		<td>
		<ul>
			<li>Applies light stemming</li>
			<li>Filters out Greek stop words</li>
		</ul>
		</td>
	</tr>
    <tr>
		<td>English</td>
		<td>en.lucene</td>
		<td>
		<ul>
			<li>Applies light stemming</li>
			<li>Filters out English stop words</li>
			<li>Removes possessives</li>
		</ul>
		</td>
	</tr>
    <tr>
		<td>Finnish</td>
		<td>fi.lucene</td>
		<td>
		<ul>
			<li>Applies light stemming</li>
			<li>Filters out Finnish stop words</li>
		</ul>
		</td>
	</tr>
    <tr>
		<td>French</td>
		<td>fr.lucene</td>
		<td>
		<ul>
			<li>Applies light stemming</li>
			<li>Filters out French stop words</li>
			<li>Removes ellisions</li>
		</ul>
		</td>
	</tr>
    <tr>
		<td>Hindi</td>
		<td>hi.lucene</td>
		<td>
		<ul>
			<li>Applies light stemming</li>
			<li>Filters out Hindi stop words</li>
			<li>Removes some differences in spelling variations</li>
			<li>Normalizes the Unicode representation of text in Indian languages.</li>
		</ul>
		</td>
	</tr>
    <tr>
		<td>Hungarian</td>
		<td>hu.lucene</td>
		<td>
		<ul>
			<li>Applies light stemming</li>
			<li>Filters out Hungarian stop words</li>
		</ul>
		</td>
	</tr>
    <tr>
		<td>Indonesian (Bahasa)</td>
		<td>id.lucene</td>
		<td>
		<ul>
			<li>Applies light stemming</li>
			<li>Filters out Indonesian stop words</li>
		</ul>
		</td>
	</tr>
    <tr>
		<td>Italian</td>
		<td>it.lucene</td>
		<td>
		<ul>
			<li>Applies light stemming</li>
			<li>Filters out Italian stop words</li>
			<li>Removes ellisions</li>
		</ul>
		</td>
	</tr>
    <tr>
		<td>Japanese</td>
		<td>ja.lucene</td>
		<td>
		<ul>
			<li>Uses morphological analysis</li>
			<li>Normalizes common katakana spelling variations</li>
			<li>Light stopwords/stoptags removal</li>
			<li>Character width-normalization</li>
			<li>Lemmatization - reduces inflected adjectives and verbs to their base form</li>
		</ul>
		</td>
	</tr>
    <tr>
		<td>Korean</td>
		<td>ko.lucene</td>
		<td>
		<ul>
			<li>Indexes bigrams (overlapping groups of two adjacent Chinese characters)</li>
			<li>Normalizes character width differences</li>
		</ul>
		</td>
	</tr>
    <tr>
		<td>Latvian</td>
		<td>lv.lucene</td>
		<td>
		<ul>
			<li>Applies light stemming</li>
			<li>Filters out Latvian stop words</li>
		</ul>
		</td>
	</tr>

    <tr>
		<td>Norwegian</td>
		<td>no.lucene</td>
		<td>
		<ul>
			<li>Applies light stemming</li>
			<li>Filters out Norwegian stop words</li>
		</ul>
		</td>
	</tr>
    <tr>
		<td>Polish</td>
		<td>pl.lucene</td>
		<td>
		<ul>
			<li>Applies algorithmic stemming (Stempel)</li>
			<li>Filters out Polish stop words</li>
		</ul>
		</td>
	</tr>
    <tr>
		<td>Portuguese</td>
		<td>pt-Pt.lucene</td>
		<td>
		<ul>
			<li>Applies light stemming</li>
			<li>Filters out Portuguese stop words</li>
		</ul>
		</td>
	</tr>

    <tr>
		<td>Romanian</td>
		<td>ro.lucene</td>
		<td>
		<ul>
			<li>Applies light stemming</li>
			<li>Filters out Romanian stop words</li>
		</ul>
		</td>
	</tr>
    <tr>
		<td>Russian</td>
		<td>ru.lucene</td>
		<td>
		<ul>
			<li>Applies light stemming</li>
			<li>Filters out Russian stop words</li>
		</ul>
		</td>
	</tr>
    <tr>
		<td>Spanish</td>
		<td>es.lucene</td>
		<td>
		<ul>
			<li>Applies light stemming</li>
			<li>Filters out Spanish stop words</li>
		</ul>
		</td>
	</tr>
    <tr>
		<td>Swedish</td>
		<td>sv.lucene</td>
		<td>
		<ul>
			<li>Applies light stemming</li>
			<li>Filters out Swedish stop words</li>
		</ul>
		</td>
	</tr>
    <tr>
		<td>Turkish</td>
		<td>tr.lucene</td>
		<td>
		<ul>
			<li>Strips all characters after an apostrophe (including the apostrophe itself)</li>
			<li>Applies light stemming</li>
			<li>Filters out Turkish stop words</li>
		</ul>
		</td>
	</tr>
    <tr>
		<td>Thai</td>
		<td>th.lucene</td>
		<td>
		<ul>
			<li>Applies light stemming</li>
			<li>Filters out Thai stop words</li>
		</ul>
		</td>
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

**CORS Options**

Client-side Javascript cannot call any APIs by default since the browser will prevent all cross-origin requests. Enable CORS (Cross-Origin Resource Sharing) by setting the `corsOptions` attribute to allow cross-origin queries to your index. Note that only query APIs support CORS for security reasons. The following options can be set for CORS:

- `allowedOrigins` (required): This is a list of origins that will be granted access to your index. This means that any Javascript code served from those origins will be allowed to query your index (assuming it provides the correct API key). Each origin is typically of the form `protocol://fully-qualified-domain-name:port` although the port is often omitted. See [this article](http://go.microsoft.com/fwlink/?LinkId=330822) for more details.
 - If you want to allow access to all origins, include `*` as a single item in the `allowedOrigins` array. Note that **this is not recommended practice for production search services.** However, it may be useful for development or debugging purposes.
- `maxAgeInSeconds` (optional): Browsers use this value to determine the duration (in seconds) to cache CORS preflight responses. This must be a non-negative integer. The larger this value is, the better performance will be, but the longer it will take for CORS policy changes to take effect. If it is not set, a default duration of 5 minutes will be used.

<a name="Suggesters"></a>
**Suggesters**

A suggester enables auto-complete in searches. Typically partial search strings are sent to the suggestions API while the user is typing and the API returns a set of suggested phrases.

Azure Search is transitioning to a new suggesters API. Version 2014-07-31-Preview had a narrower API for suggestions where a field could be marked with `"suggestions": true` and then prefix suggestions for short strings (3-25 characters) could be performed. Starting with version 2014-10-20-Preview Azure Search has a more powerful version of suggestions based on "suggesters" as described in this section. This new implementation can do prefix and infix matching and has better tolerance for mistakes in search strings. Starting with version 2014-10-20-Preview we strongly recommend the use of the new suggesters API.

The current suggester support works best when used to suggest specific documents rather than loose terms/phrases. Good source fields for this type of suggesters are titles, names and other relatively short phrases that can identify an item. Examples of kinds of fields that tend to be less effective are very repetitive fields such as categories and tags or very long fields such as descriptions or comments fields.

As part of the index definition you can add a single suggester to the `suggesters` collection. The properties that define a suggester are:

- `name`: The name of the suggester. You use the name of the suggester when calling the `suggest` API.
- `searchMode`: The strategy used to search for candidate phrases. The only mode currently supported is `analyzingInfixMatching`, which performs flexible matching of phrases at the beginning or in middle of sentences.
- `sourceFields`: A list of one or more fields that are the source of the content for suggestions. Only fields of type `Edm.String` and `Collection(Edm.String)` may be sources for suggestions. In the current preview version of suggesters only fields that don't have a custom analyzer set can be used.

You can currently only have one suggester in the suggesters collections in the current version of the API.

<a name="CreateUpdateIndexExample"></a>
**Request Body Example**

    {
      "name": "hotels",  
      "fields": [
        {"name": "hotelId", "type": "Edm.String", "key": true, "searchable": false},
        {"name": "baseRate", "type": "Edm.Double"},
        {"name": "description", "type": "Edm.String", "filterable": false, "sortable": false, "facetable": false},
	    {"name": "description_fr", "type": "Edm.String", "filterable": false, "sortable": false, "facetable": false, "analyzer"="fr.lucene"},
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

<a name="UpdateIndex"></a>
## Update Index ##

You can update an existing index within Azure Search using an HTTP PUT request. In the Public Preview, updates can include adding new fields to the existing schema, modifying CORS options, and modifying scoring profiles (see [Scoring Profiles (Azure Search Service REST API: 2014-10-20-Preview)](search-api-scoring-profiles-2014-10-20-preview.md)). You specify the name of the index to update on the request URI:

    PUT https://[search service url]/indexes/[index name]?api-version=[api-version]
    Content-Type: application/json
    api-key: [admin key]

**Important:** Support for index schema updates is limited to operations that don't require rebuilding the search index. Any schema updates that would require re-indexing such as changing field types are not currently supported. New fields can be added at any time, although existing fields cannot be changed or deleted. The same applies to suggesters; New fields may be added to a suggester at the time the fields are added, but fields cannot be removed from suggesters and existing fields cannot be added to suggesters.

When adding a new field to an index, all existing documents in the index will automatically have a null value for that field. No additional storage space will be consumed until new documents are added to the index.

**Request**

HTTPS is required for all service requests. The **Update Index** request is constructed using HTTP PUT. With PUT, the index name is part of the URL. If the index doesn't exist, it is created. If the index already exists, it is updated to the new definition.

The index name must be lower case, start with a letter or number, have no slashes or dots, and be less than 128 characters. After starting the index name with a letter or number, the rest of the name can include any letter, number and dashes, as long as the dashes are not consecutive.

The `api-version` parameter is required. Valid values include `2014-07-31-Preview` or `2014-10-20-Preview`. You can specify which one to use on each request to get version-specific behaviors, but as a best practice, use the same version throughout your code. The recommended version is `2014-07-31-Preview` for general use. Alternatively, use `2014-10-20-Preview` to evaluate experimental features. See [Search Service Versioning](http://msdn.microsoft.com/library/azure/dn864560.aspx) for details.

**Request Headers**

The following list describes the required and optional request headers.

- `Content-Type`: Required. Set this to `application/json`
- `api-key`: Required. The `api-key` is used to authenticate the request to your Search service. It is a string value, unique to your service. The **Update Index** request must include an `api-key` header set to your admin key (as opposed to a query key).

You will also need the service name to construct the request URL. You can get the service name and `api-key` from your service dashboard in the Azure Preview Portal. See [Get started with Azure Search](search-get-started.md) for page navigation help.

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
          "suggestions": true | false (default, only Edm.String and Collection(Edm.String) fields can be used for suggestions),
          "key": true | false (default, only Edm.String fields can be keys),
          "retrievable": true (default) | false,
		  "analyzer": "name of text analyzer"
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
      "defaultScoringProfile": (optional) "...",
      "corsOptions": (optional) {
        "allowedOrigins": ["*"] | ["origin_1", "origin_2", ...],
        "maxAgeInSeconds": (optional) max_age_in_seconds (non-negative integer)
      }
    }

Note: Data type `Edm.Int64` is supported starting with API version 2014-10-20-Preview.

**Response**

For a successful request: "204 No Content".

By default the response body will be empty. However, if the `Prefer` request header is set to `return=representation`, the response body will contain the JSON for the index definition that was updated. In this case, the success status code will be "200 OK".

<a name="ListIndexes"></a>
## List Indexes ##

The **List Indexes** operation returns a list of the indexes currently in your Azure Search service.

    GET https://[service name].search.windows.net/indexes?api-version=[api-version]
    api-key: [admin key]

**Request**

HTTPS is required for all service requests. The **List Indexes** request can be constructed using the GET method.

The `api-version` parameter is required. Valid values include `2014-07-31-Preview` or `2014-10-20-Preview`. You can specify which one to use on each request to get version-specific behaviors, but as a best practice, use the same version throughout your code. The recommended version is `2014-07-31-Preview` for general use. Alternatively, use `2014-10-20-Preview` to evaluate experimental features. See [Search Service Versioning](http://msdn.microsoft.com/library/azure/dn864560.aspx) for details.

**Request Headers**

The following list describes the required and optional request headers.

- `api-key`: Required. The `api-key` is used to authenticate the request to your Search service. It is a string value, unique to your service. The **List Indexes** request must include an `api-key` set to an admin key (as opposed to a query key).

You will also need the service name to construct the request URL. You can get the service name and `api-key` from your service dashboard in the Azure Preview Portal. See [Get started with Azure Search](search-get-started.md) for page navigation help.

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

    GET /indexes?api-version=2014-10-20-Preview&$select=name

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
## Get Index ##

The **Get Index** operation gets the index definition from Azure Search.

    GET https://[service name].search.windows.net/indexes/[index name]?api-version=[api-version]
    api-key: [admin key]

**Request**

HTTPS is required for service requests. The **Get Index** request can be constructed using the GET method.

The [index name] in the request URI specifies which index to return from the indexes collection.

The `api-version` parameter is required. Valid values include `2014-07-31-Preview` or `2014-10-20-Preview`. You can specify which one to use on each request to get version-specific behaviors, but as a best practice, use the same version throughout your code. The recommended version is `2014-07-31-Preview` for general use. Alternatively, use `2014-10-20-Preview` to evaluate experimental features. See [Search Service Versioning](http://msdn.microsoft.com/library/azure/dn864560.aspx) for details.

**Request Headers**

The following list describes the required and optional request headers.

- `api-key`: The `api-key` is used to authenticate the request to your Search service. It is a string value, unique to your service. The **Get Index** request must include an `api-key` set to an admin key (as opposed to a query key).

You will also need the service name to construct the request URL. You can get the service name and `api-key` from your service dashboard in the Azure Preview Portal. See [Get started with Azure Search](search-get-started.md) for page navigation help.

**Request Body**

None.

**Response**

Status Code: 200 OK is returned for a successful response.

See the example JSON in [Creating and Updating an Index](#CreateUpdateIndexExample) for an example of the response payload.

<a name="DeleteIndex"></a>
## Delete Index ##

The **Delete Index** operation removes an index and associated documents from your Azure Search service. You can get the index name from the service dashboard in the Azure Preview portal, or from the API. See [List Indexes](#ListIndexes) for details.

    DELETE https://[service name].search.windows.net/indexes/[index name]?api-version=[api-version]
    api-key: [admin key]

**Request**

HTTPS is required for service requests. The **Delete Index** request can be constructed using the DELETE method.

The [index name] in the request URI specifies which index to delete from the indexes collection.

The `api-version` parameter is required. Valid values include `2014-07-31-Preview` or `2014-10-20-Preview`. You can specify which one to use on each request to get version-specific behaviors, but as a best practice, use the same version throughout your code. The recommended version is `2014-07-31-Preview` for general use. Alternatively, use `2014-10-20-Preview` to evaluate experimental features. See [Search Service Versioning](http://msdn.microsoft.com/library/azure/dn864560.aspx) for details.

**Request Headers**

The following list describes the required and optional request headers.

- `api-key`: Required. The `api-key` is used to authenticate the request to your Search service. It is a string value, unique to your service URL. The **Delete Index** request must include an `api-key` header set to your admin key (as opposed to a query key).

You will also need the service name to construct the request URL. You can get the service name and `api-key` from your service dashboard in the Azure Preview Portal. See [Get started with Azure Search](search-get-started.md) for page navigation help.

**Request Body**

None.

**Response**

Status Code: 204 No Content is returned for a successful response.

<a name="GetIndexStats"></a>
## Get Index Statistics ##

The **Get Index Statistics** operation returns from Azure Search a document count for the current index, plus storage usage.

	GET https://[service name].search.windows.net/indexes/[index name]/stats?api-version=[api-version]
    api-key: [admin key]

**Request**

HTTPS is required for all services requests. The **Get Index Statistics** request can be constructed using the GET method.

The [index name] in the request URI tells the service to return index statistics for the specified index.

The `api-version` parameter is required. Valid values include `2014-07-31-Preview` or `2014-10-20-Preview`. You can specify which one to use on each request to get version-specific behaviors, but as a best practice, use the same version throughout your code. The recommended version is `2014-07-31-Preview` for general use. Alternatively, use `2014-10-20-Preview` to evaluate experimental features. See [Search Service Versioning](http://msdn.microsoft.com/library/azure/dn864560.aspx) for details.

**Request Headers**

The following list describes the required and optional request headers.

- `api-key`: The `api-key` is used to authenticate the request to your Search service. It is a string value, unique to your service. The **Get Index Statistics** request must include an `api-key` set to an admin key (as opposed to a query key).

You will also need the service name to construct the request URL. You can get the service name and `api-key` from your service dashboard in the Azure Preview Portal. See [Get started with Azure Search](search-get-started.md) for page navigation help.

**Request Body**

None.

**Response**

Status Code: 200 OK is returned for a successful response.

The response body is in the following format:

    {
      "documentCount": number,
	  "storageSize": number (size of the index in bytes)
    }

________________________________________
<a name="DocOps"></a>
## Document Operations

In Azure Search, an index is stored in the cloud and populated using JSON documents that you upload to the service. All the documents that you upload comprise the corpus of your search data. Documents contain fields, some of which are tokenized into search terms as they are uploaded. The `/docs` URL segment in the Azure Search API represents the collection of documents in an index. All operations performed on the collection such as uploading, merging, deleting, or querying documents take place in the context of a single index, so the URLs for these operations will always start with `/indexes/[index name]/docs` for a given index name.

Your application code must generate JSON documents to upload to Azure Search. Typically, indexes are populated from a single dataset that you provide.

You should plan on having one document for each item that you want to search. A movie rental application might have one document per movie, a storefront application might have one document per SKU, an online courseware application might have one document per course, a research firm might have one document for each academic paper in their repository, and so on.

Documents consist of one or more fields. Fields can contain text that is tokenized by Azure Search into search terms, as well as non-tokenized or non-text values that can be used in filters or scoring profiles. The names, data types, and search features supported for each field are determined by the index schema. One of the fields in each index schema must be designated as an ID, and each document must have a value for the ID field that uniquely identifies that document in the index. All other document fields are optional and will default to a null value if left unspecified. Note that null values do not take up space in the search index.

Before you can upload documents, you must have already created the index on the service. See [Create Index](#CreateIndex) for details about this first step.

**Note**: This version of the API provides full-text search in English only.

<a name="AddOrUpdateDocuments"></a>
## Add, Update, or Delete Documents ##

You can upload, merge, merge-or-upload or delete documents from a specified index using HTTP POST. For large numbers of updates, batching of documents (up to 1000 documents per batch or about 16 MB per batch) is recommended.

    POST https://[service name].search.windows.net/indexes/[index name]/docs/index?api-version=[api-version]
    Content-Type: application/json
    api-key: [admin key]

**Request**

HTTPS is required for all service requests. You can upload, merge, merge-or-upload or delete documents from a specified index using HTTP POST.

The request URI includes [index name], specifying which index to post documents. You can only post documents to one index at a time.

The `api-version` parameter is required. Valid values include `2014-07-31-Preview` or `2014-10-20-Preview`. You can specify which one to use on each request to get version-specific behaviors, but as a best practice, use the same version throughout your code. The recommended version is `2014-07-31-Preview` for general use. Alternatively, use `2014-10-20-Preview` to evaluate experimental features. See [Search Service Versioning](http://msdn.microsoft.com/library/azure/dn864560.aspx) for details.

**Request Headers**

The following list describes the required and optional request headers.

- `Content-Type`: Required. Set this to `application/json`
- `api-key`: Required. The `api-key` is used to authenticate the request to your Search service. It is a string value, unique to your service. The **Add Documents** request must include an `api-key` header set to your admin key (as opposed to a query key).

You will also need the service name to construct the request URL. You can get the service name and `api-key` from your service dashboard in the Azure Preview Portal. See [Get started with Azure Search](search-get-started.md) for page navigation help.

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

**Document Actions**

- `upload`: An upload action is similar to an "upsert" where the document will be inserted if it is new and updated/replaced if it exists. Note that all fields are replaced in the update case.
- `merge`: Merge updates an existing document with the specified fields. If the document doesn't exist, the merge will fail. Any field you specify in a merge will replace the existing field in the document. This includes fields of type `Collection(Edm.String)`. For example, if the document contains a field "tags" with value `["budget"]` and you execute a merge with value `["economy", "pool"]` for "tags", the final value of the "tags" field will be `["economy", "pool"]`. It will **not** be `["budget", "economy", "pool"]`.
- `mergeOrUpload`: behaves like `merge` if a document with the given key already exists in the index. If the document does not exist it behaves like `upload` with a new document.
- `delete`: Delete removes the specified document from the index. Note that you can specify only the key field value in a `delete` operation. Attempting to specify other fields will result in an HTTP 400 error. If you want to remove an individual field from a document, use `merge` instead and simply set the field explicitly to `null`.

**Response**

Status code: 200 OK is returned for a successful response, meaning that all items have been successfully indexed (as indicated by the 'status' field set to true for all items):

    {
      "value": [
        {
          "key": "unique_key_of_document",
          "status": true,
          "errorMessage": null
        }
      ]
    }  

Status code: 207 is returned when at least one item was not successfully indexed (as indicated by the 'status' field set to false for items that have not been indexed):

    {
      "value": [
        {
          "key": "unique_key_of_document",
          "status": false,
          "errorMessage": "The search service is too busy to process this document. Please try again later."
        }
      ]
    }  

The `errorMessage` property will indicate the reason for the indexing error if possible.

**Note**: If your client code frequently encounters a 207 response, one possible reason is that the system is under load. You can confirm this by checking the `errorMessage` property. If this is the case, we recommend ***throttling indexing requests***. Otherwise, if indexing traffic doesn't subside, the system could start rejecting all requests with 503 errors.

Status code: 429 indicates that you have exceeded your quota on the number of documents per index. You must either create a new index or upgrade for higher capacity limits.

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
## Search Documents ##

A **Search** operation is issued as a GET request and specifies query parameters that give the criteria for selecting matching documents.

    GET https://[service name].search.windows.net/indexes/[index name]/docs?[query parameters]
    api-key: [admin key]

**Request**

HTTPS is required for service requests. The **Search** request can be constructed using the GET method.

The request URI specifies which index to query, for all documents that match the query parameters.

**Query Parameters**

`search=[string]` (optional) - the text to search for. All `searchable` fields are searched by default unless `searchFields` is specified. When searching `searchable` fields, the search text itself is tokenized, so multiple terms can be separated by white space (for example: `search=hello world`). To match any term, use `*` (this can be useful for boolean filter queries). Omitting this parameter has the same effect as setting it to `*`. See [Simple query syntax](https://msdn.microsoft.com/library/dn798920.aspx) for specifics on the search syntax.

  - **Note**: The results can sometimes be surprising when querying over `searchable` fields. The tokenizer includes logic to handle cases common to English text like apostrophes, commas in numbers, etc. For example, `search=123,456` will match a single term 123,456 rather than the individual terms 123 and 456, since commas are used as thousand-separators for large numbers in English. For this reason, we recommend using white space rather than punctuation to separate terms in the `search` parameter.

`searchMode=any|all` (optional, defaults to `any`) - whether any or all of the search terms must be matched in order to count the document as a match.

`searchFields=[string]` (optional) - the list of comma-separated field names to search for the specified text. Target fields must be marked as `searchable`.

`moreLikeThis=[key]` (optional) - finds documents that are similar to the document specified by the document key. Contents in `searchable` fields are considered by default unless `searchFields` is specified. This option cannot be used in a query that contains the text search parameter 'search=[string]'.

`$skip=#` (optional) - the # of search results to skip; Cannot be greater than 100,000. If you need to scan documents in sequence but cannot use `$skip` due to this limitation, consider using `$orderby` on a totally-ordered key and `$filter` with a range query instead.

`$top=#` (optional) - the # of search results to retrieve. This defaults to 50. If you specify a value greater than 1000 and there are more than 1000 results, only the first 1000 results will be returned, along with a link to the next page of results (see `@odata.nextLink` in [the example below](#SearchResponse)).

`$count=true|false` (optional, defaults to `false`) - whether to fetch the total count of results. Setting this value to `true` may have a performance impact. Note that the count returned is an approximation.

`$orderby=[string]` (optional) - a list of comma-separated expressions to sort the results by. Each expression can be either a field name or a call to the `geo.distance()` function. Each expression can be followed by `asc` to indicated ascending, and `desc` to indicate descending. The default is ascending order. Ties will be broken by the match scores of documents. If no `$orderby` is specified, the default sort order is descending by document match score. There is a limit of 32 clauses for `$orderby`.

`$select=[string]` (optional) - a list of comma-separated fields to retrieve. If unspecified, all fields marked as retrievable in the schema are included. You can also explicitly request all fields by setting this parameter to `*`.

`facet=[string]` (zero or more) - a field to facet by. Optionally the string may contain parameters to customize the faceting expressed as comma-separated `name:value` pairs. Valid parameters are:

- `count` (max # of facet terms; default is 10). There is no maximum, but higher values incur a corresponding performance penalty, especially if the faceted field contains a large number of unique terms.
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
- **Note**: `count` and `sort` can be combined in the same facet specification, but they cannot be combined with `interval` or `values`, and `interval` and `values` cannot be combined together.

`$filter=[string]` (optional) - a structured search expression in standard OData syntax. See [OData Expression Syntax](#ODataExpressionSyntax) for details on the subset of the OData expression grammar that Azure Search supports.

`highlight=[string]` (optional) - a set of comma-separated field names used for hit highlights. Only `searchable` fields can be used for hit highlighting.

  `highlightPreTag=[string]` (optional, defaults to `<em>`) - a string tag that prepends to hit highlights. Must be set with `highlightPostTag`. Reserved characters in URL must be percent-encoded (for example, %23 instead of #).

  `highlightPostTag=[string]` (optional, defaults to `</em>`) - a string tag that appends to hit highlights. Must be set with `highlightPreTag`. Reserved characters in URL must be percent-encoded (for example, %23 instead of #).

`scoringProfile=[string]` (optional) - the name of a scoring profile to evaluate match scores for matching documents in order to sort the results.

`scoringParameter=[string]` (zero or more) - indicates the value for each parameter defined in a scoring function (for example, `referencePointParameter`) using the format name:value. For example, if the scoring profile defines a function with a parameter called "mylocation" the query string option would be &scoringParameter=mylocation:-122.2,44.8

`api-version=[string]` (required). Valid values include `2014-07-31-Preview` or `2014-10-20-Preview`. You can specify which one to use on each request to get version-specific behaviors, but as a best practice, use the same version throughout your code. The recommended version is `2014-07-31-Preview` for general use. Alternatively, use `2014-10-20-Preview` to evaluate experimental features. See [Search Service Versioning](http://msdn.microsoft.com/library/azure/dn864560.aspx) for details.

Note: For this operation, the `api-version` is specified as a query parameter.

**Request Headers**

The following list describes the required and optional request headers.

- `api-key`: The `api-key` is used to authenticate the request to your Search service. It is a string value, unique to your service URL. The **Search** request can specify either an admin key or query key for `api-key`.

You will also need the service name to construct the request URL. You can get the service name and `api-key` from your service dashboard in the Azure Preview Portal. See [Get started with Azure Search](search-get-started.md) for page navigation help.

**Request Body**

None.

<a name="SearchResponse"></a>
**Response**

Status Code: 200 OK is returned for a successful response.

    {
      "@odata.count": # (if $count=true was provided in the query),
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
      "@odata.nextLink": (URL to fetch the next page of results if $top is greater than 1000)
    }

**Examples:**

You can find additional examples on the [OData Expression Syntax for Azure Search](https://msdn.microsoft.com/library/azure/dn798921.aspx) page.

1)	Search the Index sorted descending by date.

    GET /indexes/hotels/docs?search=*&$orderby=lastRenovationDate desc&api-version=2014-10-20-Preview

NOTE: Precision of DateTime fields is limited to milliseconds. If you push a timestamp that specifies values any smaller (for example, see the seconds portion of this timestamp: 10:30:09.7552052), the return value will be rounded up (or 10:30:09.7550000, per the example).

2)	In a faceted search, search the index and retrieve facets for categories, rating, tags, as well as items with baseRate in specific ranges:

    GET /indexes/hotels/docs?search=test&facet=category&facet=rating&facet=tags&facet=baseRate,values:80|150|220&api-version=2014-10-20-Preview

3)	Using a filter, narrow down the previous faceted query results after the user clicks on rating 3 and category "Motel":

    GET /indexes/hotels/docs?search=test&facet=tags&facet=baseRate,values:80|150|220&$filter=rating eq 3 and category eq 'Motel'&api-version=2014-10-20-Preview

4) In a faceted search, set an upper limit on unique terms returned in a query. The default is 10, but you can increase or decrease this value using the `count` parameter on the `facet` attribute:

    GET /indexes/hotels/docs?search=test&facet=city,count:5&api-version=2014-10-20-Preview

5)	Search the Index within specific fields; For example, a language-specific field:

    GET /indexes/hotels/docs?search=hôtel&searchFields=description_fr&api-version=2014-10-20-Preview

6) Search the Index across multiple fields. For example, you can store and query searchable fields in multiple languages, all within the same index.  If English and French descriptions co-exist in the same document, you can return any or all in the query results:

	GET /indexes/hotels/docs?search=hotel&searchFields=description,description_fr&api-version=2014-10-20-Preview

Note that you can only query one index at a time. Do not create multiple indexes for each language unless you plan to query one at a time.

7)	Paging - Get the 1st page of items (page size is 10):

    GET /indexes/hotels/docs?search=*&$skip=0&$top=10&api-version=2014-10-20-Preview

8)	Paging - Get the 2nd page of items (page size is 10):

    GET /indexes/hotels/docs?search=*&$skip=10&$top=10&api-version=2014-10-20-Preview

9)	Retrieve a specific set of fields:

    GET /indexes/hotels/docs?search=*&$select=hotelName,description&api-version=2014-10-20-Preview

10)  Retrieve documents matching a specific query expression

    GET /indexes/hotels/docs?$filter=(baseRate ge 60 and baseRate lt 300) or hotelName eq 'Fancy Stay'&api-version=2014-10-20-Preview

11) Search the index and return fragments with hit highlights

    GET /indexes/hotels/docs?search=something&highlight=description&api-version=2014-10-20-Preview

12) Search the index and return documents sorted from closer to farther away from a reference location

    GET /indexes/hotels/docs?search=something&$orderby=geo.distance(location, geography'POINT(-122.12315 47.88121)')&api-version=2014-10-20-Preview

13) Search the index assuming there's a scoring profile called "geo" with two distance scoring functions, one defining a parameter called "currentLocation" and one defining a parameter called "lastLocation"

    GET /indexes/hotels/docs?search=something&scoringProfile=geo&scoringParameter=currentLocation:-122.123,44.77233&scoringParameter=lastLocation:-121.499,44.2113&api-version=2014-10-20-Preview


<a name="LookupAPI"></a>
##Lookup Document##

The **Lookup Document** operation retrieves a document from Azure Search. This is useful when a user clicks on a specific search result, and you want to look up specific details about that document.

    GET https://[service name].search.windows.net/indexes/[index name]/docs/[key]?[query parameters]
    api-key: [admin key]

**Request**

HTTPS is required for service requests. The **Lookup Document** request can be constructed as follows.

    GET /indexes/[index name]/docs/key?[query parameters]

Alternatively, you can use the traditional OData syntax for key lookup:

    GET /indexes('[index name]')/docs('[key]')?[query parameters]

The request URI includes an [index name] and [key], specifying which document to retrieve from which index. You can only get one document at a time. Use **Search** to get multiple documents in a single request.

**Query Parameters**

`$select=[string]` (optional) - a list of comma-separated fields to retrieve. If unspecified or set to `*`, all fields marked as retrievable in the schema are included in the projection.

`api-version=[string]` (required). Valid values include `2014-07-31-Preview` or `2014-10-20-Preview`. You can specify which one to use on each request to get version-specific behaviors, but as a best practice, use the same version throughout your code. The recommended version is `2014-07-31-Preview` for general use. Alternatively, use `2014-10-20-Preview` to evaluate experimental features. See [Search Service Versioning](http://msdn.microsoft.com/library/azure/dn864560.aspx) for details.

Note: For this operation, the `api-version` is specified as a query parameter.

**Request Headers**

The following list describes the required and optional request headers.

- `api-key`: The `api-key` is used to authenticate the request to your Search service. It is a string value, unique to your service URL. The **Lookup Document** request can specify either an admin key or query key for `api-key`.

You will also need the service name to construct the request URL. You can get the service name and `api-key` from your service dashboard in the Azure Preview Portal. See [Get started with Azure Search](search-get-started.md) for page navigation help.

**Request Body**

None.

**Response**

Status Code: 200 OK is returned for a successful response.

    {
      field_name: field_value (fields matching the default or specified projection)
    }

**Example**

Lookup the document that has key '2'

    GET /indexes/hotels/docs/2?api-version=2014-10-20-Preview

Lookup the document that has key '3' using OData syntax:

    GET /indexes('hotels')/docs('3')?api-version=2014-10-20-Preview

<a name="CountDocs"></a>
##Count Documents##

The **Count Documents** operation retrieves a count of the number of documents in a search index. The `$count` syntax is part of the OData protocol.

    GET https://[service name].search.windows.net/indexes/[index name]/docs/$count?api-version=[api-version]
    Accept: text/plain
    api-key: [admin key]

**Request**

HTTPS is required for service requests. The **Count Documents** request can be constructed using the GET method.

The [index name] in the request URI tells the service to return a count of all items in the docs collection of the specified index.

The `api-version` parameter is required. Valid values include `2014-07-31-Preview` or `2014-10-20-Preview`. You can specify which one to use on each request to get version-specific behaviors, but as a best practice, use the same version throughout your code. The recommended version is `2014-07-31-Preview` for general use. Alternatively, use `2014-10-20-Preview` to evaluate experimental features. See [Search Service Versioning](http://msdn.microsoft.com/library/azure/dn864560.aspx) for details.

**Request Headers**

The following list describes the required and optional request headers.

- `Accept`: This value must be set to `text/plain`.
- `api-key`: The `api-key` is used to authenticate the request to your Search service. It is a string value, unique to your service URL. The **Count Documents** request can specify either an admin key or query key for `api-key`.

You will also need the service name to construct the request URL. You can get both the service name and `api-key` from your service dashboard in the Azure Preview Portal. See [Get started with Azure Search](search-get-started.md) for page navigation help.

**Request Body**

None.

**Response**

Status Code: 200 OK is returned for a successful response.

The response body contains the count value as an integer formatted in plain text.

<a name="Suggestions"></a>
##Suggestions##

The **Suggestions** operation retrieves suggestions based on partial search input. It's typically used in search boxes to provide type-ahead suggestions as users are entering search terms.

Suggestions requests aim at suggesting target documents, so the suggested text may be repeated if multiple candidate documents match the same search input. You can use `$select` to retrieve other document fields (including the document key) so that you can tell which document is the source for each suggestion.

    GET https://[service name].search.windows.net/indexes/[index name]/docs/suggest?[query parameters]
    api-key: [admin key]


**Request**

HTTPS is required for service requests. The **Suggestions** request can be constructed using the GET method.

The request URI specifies the name of the index to query. It also includes the partially input search term in the query string.

**Query Parameters**

`search=[string]` - the search text to use to suggest queries. Must be at least 3 characters, and no more than 25 characters.

`highlightPreTag=[string]` (optional) - a string tag that prepends to search hits. Must be set with `highlightPostTag`. Reserved characters in URL must be percent-encoded (for example, %23 instead of #).

`highlightPostTag=[string]` (optional) - a string tag that appends to search hits. Must be set with `highlightPreTag`. Reserved characters in URL must be percent-encoded (for example, %23 instead of #).

`suggesterName=[string]` - (optional) the name of the suggester as specified in the `suggesters` collection that's part of the index definition. If this option is not used, suggestions are based on the previous version's implementation which operates on those fields marked with `"suggestions": true` and only supports prefix matching.

`fuzzy=[boolean]` (optional, default = false) - when set to true this API will find suggestions even if there's a substituted or missing character in the search text. While this provides a better experience in some scenarios it comes at a performance cost as fuzzy suggestion searches are slower and consume more resources.

`searchFields=[string]` (optional) - the list of comma-separated field names to search for the specified search text. Target fields must be enabled for suggestions.

`$top=#` (optional, default = 5) - the number of suggestions to retrieve. Must be a number between 1 and 100.

`$filter=[string]` (optional) - an expression that filters the documents considered for suggestions.

`$orderby=[string]` (optional) - a list of comma-separated expressions to sort the results by. Each expression can be either a field name or a call to the `geo.distance()` function. Each expression can be followed by `asc` to indicated ascending, and `desc` to indicate descending. The default is ascending order. There is a limit of 32 clauses for `$orderby`.

`$select=[string]` (optional) - a list of comma-separated fields to retrieve. If unspecified, only the document key and suggestion text is returned.

`api-version=[string]` (required). Valid values include `2014-07-31-Preview` or `2014-10-20-Preview`. You can specify which one to use on each request to get version-specific behaviors, but as a best practice, use the same version throughout your code. The recommended version is `2014-07-31-Preview` for general use. Alternatively, use `2014-10-20-Preview` to evaluate experimental features. See [Search Service Versioning](http://msdn.microsoft.com/library/azure/dn864560.aspx) for details.

Note: For this operation, the `api-version` is specified as a query parameter.

**Request Headers**

The following list describes the required and optional request headers

- `api-key`: The `api-key` is used to authenticate the request to your Search service. It is a string value, unique to your service URL. The **Suggestions** request can specify either an admin key or query key as the `api-key`.

  You will also need the service name to construct the request URL. You can get both the service name and `api-key` from your service dashboard in the Azure Preview Portal. See [Get started with Azure Search](search-get-started.md) for page navigation help.

**Request Body**

None.

**Response**

Status Code: 200 OK is returned for a successful response.

    {
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

    GET /indexes/hotels/docs/suggest?search=lux&$top=5&suggesterName=sg&api-version=2014-10-20-Preview
