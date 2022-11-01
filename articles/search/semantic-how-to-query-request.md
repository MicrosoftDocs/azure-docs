---
title: Create a semantic query
titleSuffix: Azure Cognitive Search
description: Set a semantic query type to attach the deep learning models to query processing, inferring intent and context as part of search rank and relevance.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 12/17/2021
---

# Create a query that invokes semantic ranking and returns semantic captions

> [!IMPORTANT]
> Semantic search is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). It's available through the Azure portal, preview REST API, and beta SDKs. These features are billable. For more information about, see [Availability and pricing](semantic-search-overview.md#availability-and-pricing).

Semantic search is a premium feature in Azure Cognitive Search that invokes a semantic ranking algorithm over a result set and returns semantic captions (and optionally [semantic answers](semantic-answers.md)), with highlights over the most relevant terms and phrases. Both captions and answers are returned in query requests formulated using the "semantic" query type.

Captions and answers are extracted verbatim from text in the search document. The semantic subsystem determines what part of your content has the characteristics of a caption or answer, but it does not compose new sentences or phrases. For this reason, content that includes explanations or definitions work best for semantic search.

## Prerequisites

+ A Cognitive Search service at a Standard tier (S1, S2, S3) or Storage Optimized tier (L1, L2), located in one of these regions: Australia East, East US, East US 2, North Central US, South Central US, West US, West US 2, North Europe, UK South, West Europe. If you have an existing S1 or greater service in one of these regions, you can enable semantic search on your service without having to create a new one.

+ [Semantic search enabled on your search service](semantic-search-overview.md#enable-semantic-search). 

+ An existing search index with content in a [supported language](/rest/api/searchservice/preview-api/search-documents#queryLanguage). Semantic search works best on content that is informational or descriptive.

+ A search client for sending queries and updating indexes.

  The search client must support preview REST APIs on the query request. You can use [Postman](search-get-started-rest.md), another web client, or code that makes REST calls to the preview APIs. [Search explorer](search-explorer.md) in Azure portal can be used to submit a semantic query. You can also use [Azure.Search.Documents 11.4.0-beta.5](https://www.nuget.org/packages/Azure.Search.Documents/11.4.0-beta.5).

+ A [query request](/rest/api/searchservice/preview-api/search-documents) must include `queryType=semantic` and other parameters described in this article.

## What's a semantic query type?

In Cognitive Search, a query is a parameterized request that determines query processing and the shape of the response. A *semantic query* has [parameters](#query-using-rest) that invoke the semantic reranking model that can assess the context and meaning of matching results, promote more relevant matches to the top, and return semantic answers and captions.

The approach for listing fields in priority order has changed recently, with semanticConfiguration replacing searchFields. If you are currently using searchFields, please update your code to the 2021-04-30-Preview API version and use semanticConfiguration instead.

### [**Semantic Configuration (recommended)**](#tab/semanticConfiguration)

The following request is representative of a minimal semantic query (without answers).

```http
POST https://[service name].search.windows.net/indexes/[index name]/docs/search?api-version=2021-04-30-Preview      
{    
    "search": " Where was Alan Turing born?",    
    "queryType": "semantic",  
    "semanticConfiguration": "my-semantic-config",
    "queryLanguage": "en-us"  
}
```

### [**searchFields**](#tab/searchFields)

The following request is representative of a minimal semantic query (without answers).

```http
POST https://[service name].search.windows.net/indexes/[index name]/docs/search?api-version=2020-06-30-Preview      
{    
    "search": " Where was Alan Turing born?",    
    "queryType": "semantic",  
    "searchFields": "title,url,body",  
    "queryLanguage": "en-us"  
}
```

---

As with all queries in Cognitive Search, the request targets the documents collection of a single index. Furthermore, a semantic query undergoes the same sequence of parsing, analysis, scanning, and scoring as a non-semantic query. 

The difference lies in relevance and scoring. As defined in this preview release, a semantic query is one whose *results* are reranked using a semantic language model, providing a way to surface the matches deemed most relevant by the semantic ranker, rather than the scores assigned by the default similarity ranking algorithm.

Only the top 50 matches from the initial results can be semantically ranked, and all results include captions in the response. Optionally, you can specify an **`answer`** parameter on the request to extract a potential answer. For more information, see [Semantic answers](semantic-answers.md).

## Create a semantic configuration

> [!NOTE]
> Semantic configurations are a new addition to the 2021-04-30-Preview API and are now required for semantic queries. If using 2020-06-30-Preview, **searchFields** is used instead of **semanticConfiguration**. We recommend upgrading to 2021-04-30-Preview  and using **semanticConfiguration** for best results.

In order to get the best results from semantic search, it's important to give the underlying models hints about which fields in your index are most important for semantic ranking, captions, highlights, and answers. To provide that information, you'll need to create a semantic configuration.

A semantic configuration contains properties to list three different types of fields, which map back to the inputs the underlying models for semantic search expect:

+ **Title field** - A title field should be a concise description of the document, ideally a string that is under 25 words. This could be the title of the document, name of the product, or item in your search index. If you don't have a title in your search index, leave this field blank.
+ **Content fields** - Content fields should contain text in natural language form. Common examples of content are the text of a document, the description of a product, or other free-form text.
+ **Keyword fields** - Keyword fields should be a list of keywords, such as the tags on a document, or a descriptive term, such as the category of an item. 

You can only specify a single title field as part of your semantic configuration but you can specify as many content and keyword fields as you like. However, it's important that you list the content and keyword fields in priority order because lower priority fields may get truncated. Fields listed first will be given higher priority. 

You're only required to specify one field between `titleField`, `prioritizedContentFields`, and `prioritizedKeywordsFields`, but it's best to add the fields to your semantic configuration if they exist in your search index.

Similar to [scoring profiles](index-add-scoring-profiles.md), semantic configurations are a part of your [index definition](/rest/api/searchservice/preview-api/create-or-update-index) and can be updated at any time without rebuilding your index. When you issue a query, you'll add the `semanticConfiguration` that specifies which semantic configuration to use for the query.

### [**Azure portal**](#tab/portal)

1. [Sign in to Azure portal](https://portal.azure.com) and navigate to a search service that has [semantic search enabled](semantic-search-overview.md#enable-semantic-search).

1. Open an index.

1. Select **Semantic Configurations** and then select **Add Semantic Configuration**.

   The **New Semantic Configuration** page opens with options for selecting a title field, content fields, and keyword fields. Make sure to list content fields and keyword fields in priority order.

   Select **OK** to save the changes.

   :::image type="content" source="./media/semantic-search-overview/create-semantic-config.png" alt-text="Screenshot that shows how to create a semantic configuration in the Azure portal." border="true":::

### [**REST API**](#tab/rest)

 ```json
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
```

### [**.NET SDK**](#tab/sdk)

```c#
var definition = new SearchIndex(indexName, searchFields);

SemanticSettings semanticSettings = new SemanticSettings();
semanticSettings.Configurations.Add(new SemanticConfiguration
    (
        "my-semantic-config",
        new PrioritizedFields()
        {
            TitleField = new SemanticField { FieldName = "HotelName" },
            ContentFields = {
            new SemanticField { FieldName = "Description" },
            new SemanticField { FieldName = "Description_fr" }
            },
            KeywordFields = {
            new SemanticField { FieldName = "Tags" },
            new SemanticField { FieldName = "Category" }
            }
        }
    )
);

definition.SemanticSettings = semanticSettings;

adminClient.CreateOrUpdateIndex(definition);
```

---

To see an example of creating a semantic configuration and using it to issue a semantic query, check out the
[semantic search Postman sample](https://github.com/Azure-Samples/azure-search-postman-samples/tree/master/semantic-search).

### Allowed data types

When selecting fields for your semantic configuration, choose only fields of the following [supported data types](/rest/api/searchservice/supported-data-types). If you happen to include an invalid field, there is no error, but those fields won't be used in semantic ranking.

| Data type | Example from hotels-sample-index |
|-----------|----------------------------------|
| Edm.String | HotelName, Category, Description |
| Edm.ComplexType | Address.StreetNumber, Address.City, Address.StateProvince, Address.PostalCode |
| Collection(Edm.String) | Tags (a comma-delimited list of strings) |

> [!NOTE]
> Subfields of Collection(Edm.ComplexType) fields are not currently supported by semantic search and won't be used for semantic ranking, captions, or answers.

## Query in Azure portal

[Search explorer](search-explorer.md) has been updated to include options for semantic queries. To create a semantic query in the portal, follow the steps below:

1. Open the [Azure portal](https://portal.azure.com) and navigate to a search service that has semantic search [enabled](semantic-search-overview.md#enable-semantic-search).

1. Click **Search explorer** at the top of the overview page.

1. Choose an index that has content in a [supported language](/rest/api/searchservice/preview-api/search-documents#queryLanguage).

1. In Search explorer, set query options that enable semantic queries, semantic configurations, and spell correction. You can also paste the required query parameters into the query string.

:::image type="content" source="./media/semantic-search-overview/search-explorer-semantic-query-options-v2.png" alt-text="Screen shot showing query options in Search explorer." border="true":::

## Query using REST

Use the [Search Documents (REST preview)](/rest/api/searchservice/preview-api/search-documents) to formulate the request programmatically. A response includes captions and highlighting automatically. If you want spelling correction or answers in the response, add **`speller`** or **`answers`** to the request.

The following example uses the [hotels-sample-index](search-get-started-portal.md) to create a semantic query request with spell check, semantic answers, and captions:

### [**Semantic Configuration (recommended)**](#tab/semanticConfiguration)

```http
POST https://[service name].search.windows.net/indexes/hotels-sample-index/docs/search?api-version=2021-04-30-Preview      
{
    "search": "newer hotel near the water with a great restaurant",
    "queryType": "semantic",
    "queryLanguage": "en-us",
    "semanticConfiguration": "my-semantic-config",
    "speller": "lexicon",
    "answers": "extractive|count-3",
    "captions": "extractive|highlight-true",
    "highlightPreTag": "<strong>",
    "highlightPostTag": "</strong>",
    "select": "HotelId,HotelName,Description,Category",
    "count": true
}
```

The following table summarizes the parameters used in a semantic query. For a list of all parameters in a request, see [Search Documents (REST preview)](/rest/api/searchservice/preview-api/search-documents)

| Parameter | Type | Description |
|-----------|-------|-------------|
| queryType | String | Valid values include simple, full, and semantic. A value of "semantic" is required for semantic queries. |
| queryLanguage | String | Required for semantic queries. The lexicon you specify applies equally to semantic ranking, captions, answers, and spell check. For more information, see [supported languages (REST API reference)](/rest/api/searchservice/preview-api/search-documents#queryLanguage). |
| semanticConfiguration | String | Required for semantic queries. The name of your [semantic configuration](#create-a-semantic-configuration). </br></br>In contrast with simple and full query types, the order in which fields are listed determines precedence. For more usage instructions, see [Create a semantic configuration](#create-a-semantic-configuration). |
| speller | String | Optional parameter, not specific to semantic queries, that corrects misspelled terms before they reach the search engine. For more information, see [Add spell correction to queries](speller-how-to-add.md). |
| answers |String | Optional parameters that specify whether semantic answers are included in the result. Currently, only "extractive" is implemented. Answers can be configured to return a maximum of ten. The default is one. This example shows a count of three answers: `extractive|count-3`. For more information, see [Return semantic answers](semantic-answers.md).|
| captions |String | Optional parameters that specify whether semantic captions are included in the result. Currently, only "extractive" is implemented. Captions can be configured to return results with or without highlights. The default is for highlights to be returned. This example returns captions without highlights: `extractive|highlight-false`. For more information, see [Return semantic answers](semantic-answers.md).|

### [**searchFields**](#tab/searchFields)

```http
POST https://[service name].search.windows.net/indexes/hotels-sample-index/docs/search?api-version=2020-06-30-Preview      
{
    "search": "newer hotel near the water with a great restaurant",
    "queryType": "semantic",
    "queryLanguage": "en-us",
    "searchFields": "HotelName,Category,Description",
    "speller": "lexicon",
    "answers": "extractive|count-3",
    "highlightPreTag": "<strong>",
    "highlightPostTag": "</strong>",
    "select": "HotelId,HotelName,Description,Category",
    "count": true
}
```

The following table summarizes the parameters used in a semantic query. For a list of all parameters in a request, see [Search Documents (REST preview)](/rest/api/searchservice/preview-api/search-documents)

| Parameter | Type | Description |
|-----------|-------|-------------|
| queryType | String | Valid values include simple, full, and semantic. A value of "semantic" is required for semantic queries. |
| queryLanguage | String | Required for semantic queries. The lexicon you specify applies equally to semantic ranking, captions, answers, and spell check. For more information, see [supported languages (REST API reference)](/rest/api/searchservice/preview-api/search-documents#queryLanguage). |
| searchFields | String | A comma-delimited list of searchable fields. Specifies the fields over which semantic ranking occurs, from which captions and answers are extracted. </br></br>In contrast with simple and full query types, the order in which fields are listed determines precedence. For more usage instructions, see [Step 2: Set searchFields](#searchfields). |
| speller | String | Optional parameter, not specific to semantic queries, that corrects misspelled terms before they reach the search engine. For more information, see [Add spell correction to queries](speller-how-to-add.md). |
| answers |String | Optional parameters that specify whether semantic answers are included in the result. Currently, only "extractive" is implemented. Answers can be configured to return a maximum of ten. The default is one. This example shows a count of three answers: `extractive|count-3`. For more information, see [Return semantic answers](semantic-answers.md).|

---


### Formulate the request

This section steps through query formulation.

### [**Semantic Configuration (recommended)**](#tab/semanticConfiguration)

#### Step 1: Set queryType and queryLanguage

Add the following parameters to the rest. Both parameters are required.

```json
"queryType": "semantic",
"queryLanguage": "en-us",
```

The queryLanguage must be a [supported language](/rest/api/searchservice/preview-api/search-documents#queryLanguage) and it must be consistent with any [language analyzers](index-add-language-analyzers.md) assigned to field definitions in the index schema. For example, you indexed French strings using a French language analyzer (such as "fr.microsoft" or "fr.lucene"), then queryLanguage should also be French language variant.

In a query request, if you are also using [spell correction](speller-how-to-add.md), the queryLanguage you set applies equally to speller, answers, and captions. There is no override for individual parts. Spell check supports [fewer languages](speller-how-to-add.md#supported-languages), so if you are using that feature, you must set queryLanguage to one from that list.

While content in a search index can be composed in multiple languages, the query input is most likely in one. The search engine doesn't check for compatibility of queryLanguage, language analyzer, and the language in which content is composed, so be sure to scope queries accordingly to avoid producing incorrect results.

<a name="searchfields"></a>

#### Step 2: Set semanticConfiguration

Add a semanticConfiguration to the request. A semantic configuration is required and important for getting the best results from semantic search.

```json
"semanticConfiguration": "my-semantic-config",
```

The [semantic configuration](#create-a-semantic-configuration) is used to tell semantic search's models which fields are most important for reranking search results based on semantic similarity. 


#### Step 3: Remove or bracket query features that bypass relevance scoring

Several query capabilities in Cognitive Search do not undergo relevance scoring, and some bypass the full text search engine altogether. If your query logic includes the following features, you will not get relevance scores or semantic ranking on your results:

+ Filters, fuzzy search queries, and regular expressions iterate over untokenized text, scanning for verbatim matches in the content. Search scores for all of the above query forms are a uniform 1.0, and won't provide meaningful input for semantic ranking.

+ Sorting (orderBy clauses) on specific fields will also override search scores and semantic score. Given that semantic score is used to order results, including explicit sort logic will cause an HTTP 400 error to be returned.

#### Step 4: Add answers and captions

Optionally, add "answers" and "captions" if you want to include additional processing that provides an answer and captions. For details about this parameter, see [How to specify semantic answers](semantic-answers.md).

```json
"answers": "extractive|count-3",
"captions": "extractive|highlight-true",
```

Answers (and captions) are extracted from passages found in fields listed in the semantic configuration. This is why you want to include content-rich fields in the prioritizedContentFields of a semantic configuration, so that you can get the best answers and captions in a response. Answers are not guaranteed on every request. To get an answer, the query must look like a question and the content must include text that looks like an answer.

#### Step 5: Add other parameters

Set any other parameters that you want in the request. Parameters such as [speller](speller-how-to-add.md), [select](search-query-odata-select.md), and count improve the quality of the request and readability of the response.

```json
"speller": "lexicon",
"select": "HotelId,HotelName,Description,Category",
"count": true,
"highlightPreTag": "<mark>",
"highlightPostTag": "</mark>",
```

Highlight styling is applied to captions in the response. You can use the default style, or optionally customize the highlight style applied to captions. Captions apply highlight formatting over key passages in the document that summarize the response. The default is `<em>`. If you want to specify the type of formatting (for example, yellow background), you can set the highlightPreTag and highlightPostTag.

### [**searchFields**](#tab/searchFields)

#### Step 1: Set queryType and queryLanguage

Add the following parameters to the rest. Both parameters are required.

```json
"queryType": "semantic",
"queryLanguage": "en-us",
```

The queryLanguage must be a [supported language](/rest/api/searchservice/preview-api/search-documents#queryLanguage) and it must be consistent with any [language analyzers](index-add-language-analyzers.md) assigned to field definitions in the index schema. For example, you indexed French strings using a French language analyzer (such as "fr.microsoft" or "fr.lucene"), then queryLanguage should also be French language variant.

In a query request, if you are also using [spell correction](speller-how-to-add.md), the queryLanguage you set applies equally to speller, answers, and captions. There is no override for individual parts. Spell check supports [fewer languages](speller-how-to-add.md#supported-languages), so if you are using that feature, you must set queryLanguage to one from that list.

While content in a search index can be composed in multiple languages, the query input is most likely in one. The search engine doesn't check for compatibility of queryLanguage, language analyzer, and the language in which content is composed, so be sure to scope queries accordingly to avoid producing incorrect results.

<a name="searchfields"></a>

#### Step 2: Set searchFields

Add searchFields to the request. It's optional but strongly recommended.

```json
"searchFields": "HotelName,Category,Description",
```

The searchFields parameter is used to identify passages to be evaluated for "semantic similarity" to the query. For the preview, we do not recommend leaving searchFields blank as the model requires a hint as to which fields are the most important to process.

In contrast with other parameters, searchFields is not new. You might already be using searchFields in existing code for simple or full Lucene queries. If so, revisit how the parameter is used so that you can check for field order when switching to a semantic query type.

##### Allowed data types

When setting searchFields, choose only fields of the following [supported data types](/rest/api/searchservice/supported-data-types). If you happen to include an invalid field, there is no error, but those fields won't be used in semantic ranking.

| Data type | Example from hotels-sample-index |
|-----------|----------------------------------|
| Edm.String | HotelName, Category, Description |
| Edm.ComplexType | Address.StreetNumber, Address.City, Address.StateProvince, Address.PostalCode |
| Collection(Edm.String) | Tags (a comma-delimited list of strings) |

##### Order of fields in searchFields

Field order is critical because the semantic ranker limits the amount of content it can process while still delivering a reasonable response time. Content from fields at the start of the list are more likely to be included; content from the end could be truncated if the maximum limit is reached. For more information, see [Pre-processing during semantic ranking](semantic-ranking.md#pre-processing).

+ If you're specifying just one field, choose a descriptive field where the answer to semantic queries might be found, such as the main content of a document. 

+ For two or more fields in searchFields:

  + The first field should always be concise (such as a title or name), ideally a string that is under 25 words.

  + If the index has a URL field that is human readable such as `www.domain.com/name-of-the-document-and-other-details`, (rather than machine focused, such as `www.domain.com/?id=23463&param=eis`), place it second in the list (or first if there is no concise title field).

  + Follow the above fields with other descriptive fields, where the answer to semantic queries may be found, such as the main content of a document.

#### Step 3: Remove or bracket query features that bypass relevance scoring

Several query capabilities in Cognitive Search do not undergo relevance scoring, and some bypass the full text search engine altogether. If your query logic includes the following features, you will not get graduated relevance scores that feed into the semantic re-ranking of results:

+ Empty search (`search=0`), wildcard search, fuzzy search, and regular expressions iterate over untokenized text, scanning for verbatim matches in the content, returning an un-scored result set. An un-scored result set assigns a uniform 1.0 on each match, and won't provide meaningful input for semantic ranking. Up to 50 documents will still be passed to the re-ranker, but the document selection is arbitrary.

+ Sorting (orderBy clauses) on specific fields will also override search scores and semantic score. Given that semantic score is used to order results, including explicit sort logic will cause an HTTP 400 error to be returned.

#### Step 4: Add answers

Optionally, add "answers" if you want to include additional processing that provides an answer. For details about this parameter, see [How to specify semantic answers](semantic-answers.md).

```json
"answers": "extractive|count-3",
```

Answers (and captions) are extracted from passages found in fields listed in searchFields. This is why you want to include content-rich fields in searchFields, so that you can get the best answers in a response. Answers are not guaranteed on every request. The query must look like a question, and the content must include text that looks like an answer.

#### Step 5: Add other parameters

Set any other parameters that you want in the request. Parameters such as [speller](speller-how-to-add.md), [select](search-query-odata-select.md), and count improve the quality of the request and readability of the response.

```json
"speller": "lexicon",
"select": "HotelId,HotelName,Description,Category",
"count": true,
"highlightPreTag": "<mark>",
"highlightPostTag": "</mark>",
```

Highlight styling is applied to captions in the response. You can use the default style, or optionally customize the highlight style applied to captions. Captions apply highlight formatting over key passages in the document that summarize the response. The default is `<em>`. If you want to specify the type of formatting (for example, yellow background), you can set the highlightPreTag and highlightPostTag.

---

## Query using Azure SDKs

Beta versions of the Azure SDKs include support for semantic search. Because the SDKs are beta versions, there is no documentation or samples, but you can refer to the REST API section above for insights on how the APIs should work.

### [**Semantic Configuration (recommended)**](#tab/semanticConfiguration)

| Azure SDK | Package |
|-----------|---------|
| .NET | [Azure.Search.Documents package 11.4.0-beta.5](https://www.nuget.org/packages/Azure.Search.Documents/11.4.0-beta.5)  |
| Java | [com.azure:azure-search-documents 11.5.0-beta.5](https://search.maven.org/artifact/com.azure/azure-search-documents/11.5.0-beta.5/jar)  |
| JavaScript | [azure/search-documents 11.3.0-beta.5](https://www.npmjs.com/package/@azure/search-documents/v/11.3.0-beta.5)|
| Python | [azure-search-documents 11.3.0b6](https://pypi.org/project/azure-search-documents/11.3.0b6/) |

### [**searchFields**](#tab/searchFields)

| Azure SDK | Package |
|-----------|---------|
| .NET | [Azure.Search.Documents package 11.3.0-beta.2](https://www.nuget.org/packages/Azure.Search.Documents/11.3.0-beta.2)  |
| Java | [com.azure:azure-search-documents 11.4.0-beta.2](https://search.maven.org/artifact/com.azure/azure-search-documents/11.4.0-beta.2/jar)  |
| JavaScript | [azure/search-documents 11.2.0-beta.2](https://www.npmjs.com/package/@azure/search-documents/v/11.2.0-beta.2)|
| Python | [azure-search-documents 11.2.0b3](https://pypi.org/project/azure-search-documents/11.2.0b3/) |

---

## Evaluate the response

As with all queries, a response is composed of all fields marked as retrievable, or just those fields listed in the select parameter. It includes the original relevance score, and might also include a count, or batched results, depending on how you formulated the request.

In a semantic query, the response has additional elements: a new semantically ranked relevance score, captions in plain text and with highlights, and optionally an answer.

In a client app, you can structure the search page to include a caption as the description of the match, rather than the entire contents of a specific field. This is useful when individual fields are too dense for the search results page.

The response for the above example query returns the following match as the top pick. Captions are returned automatically, with plain text and highlighted versions. Answers are omitted from the example because one could not be determined for this particular query and corpus.

```json
"@odata.count": 35,
"@search.answers": [],
"value": [
    {
        "@search.score": 1.8810667,
        "@search.rerankerScore": 1.1446577133610845,
        "@search.captions": [
            {
                "text": "Oceanside Resort. Luxury. New Luxury Hotel. Be the first to stay. Bay views from every room, location near the pier, rooftop pool, waterfront dining & more.",
                "highlights": "<strong>Oceanside Resort.</strong> Luxury. New Luxury Hotel. Be the first to stay.<strong> Bay</strong> views from every room, location near the pier, rooftop pool, waterfront dining & more."
            }
        ],
        "HotelName": "Oceanside Resort",
        "Description": "New Luxury Hotel. Be the first to stay. Bay views from every room, location near the pier, rooftop pool, waterfront dining & more.",
        "Category": "Luxury"
    },
```

## Next steps

Recall that semantic ranking and responses are built over an initial result set. Any logic that improves the quality of the initial results will carry forward to semantic search. As a next step, review the features that contribute to initial results, including analyzers that affect how strings are tokenized, scoring profiles that can tune results, and the default relevance algorithm.

+ [Analyzers for text processing](search-analyzers.md)
+ [Similarity ranking algorithm](index-similarity-and-scoring.md)
+ [Scoring profiles](index-add-scoring-profiles.md)
+ [Semantic search overview](semantic-search-overview.md)
+ [Semantic ranking algorithm](semantic-ranking.md)
