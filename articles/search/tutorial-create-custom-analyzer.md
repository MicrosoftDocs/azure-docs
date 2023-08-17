---
title: 'Tutorial: create a custom analyzer'
titleSuffix: Azure Cognitive Search
description: Learn how to build a custom analyzer to improve the quality of search results in Azure Cognitive Search.
author: gmndrg
ms.author: gimondra
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 01/05/2023
---

# Tutorial: Create a custom analyzer for phone numbers

[Analyzers](search-analyzers.md) are a key component in any search solution. To improve the quality of search results, it's important to understand how analyzers work and impact these results.

In some cases, like with a free text field, simply selecting the correct [language analyzer](index-add-language-analyzers.md) will improve search results. However, some scenarios such as accurately searching phone numbers, URLs, or emails may require the use of custom analyzers.

This tutorial uses Postman and Azure Cognitive Search's [REST APIs](/rest/api/searchservice/) to:

> [!div class="checklist"]
> * Explain how analyzers work
> * Define a custom analyzer for searching phone numbers
> * Test how the custom analyzer tokenizes text
> * Create separate analyzers for indexing and searching to further improve results

## Prerequisites

The following services and tools are required for this tutorial.

+ [Postman app](https://www.postman.com/downloads/)
+ [Create](search-create-service-portal.md) or [find an existing search service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices)

## Download files

Source code for this tutorial is in the [custom-analyzers](https://github.com/Azure-Samples/azure-search-postman-samples/tree/master/custom-analyzers) folder in the [Azure-Samples/azure-search-postman-samples](https://github.com/Azure-Samples/azure-search-postman-samples) GitHub repository.

## 1 - Create Azure Cognitive Search service

To complete this tutorial, you'll need an Azure Cognitive Search service, which you can [create in the portal](search-create-service-portal.md). You can use the Free tier to complete this walkthrough.

For the next step, you'll need to know the name of your search service and its API Key. If you're unsure how to find those items, check out this [REST quickstart](search-get-started-rest.md).

## 2 - Set up Postman

Next, start Postman and import the collection you downloaded from [Azure-Samples/azure-search-postman-samples](https://github.com/Azure-Samples/azure-search-postman-samples).

To import the collection, go to **Files** > **Import**, then select the collection file you'd like to import.

For each request, you need to:

1. Replace `<YOUR-SEARCH-SERVICE>` with the name of your search service.

1. Replace `<YOUR-ADMIN-API-KEY>` with either the primary or secondary key of your search service.

  :::image type="content" source="media/search-get-started-rest/postman-url.png" alt-text="Postman request URL and header" border="false":::

If you're unfamiliar with Postman, see [Explore Azure Cognitive Search REST APIs](search-get-started-rest.md).

## 3 - Create an initial index

In this step, we'll create an initial index, load documents into the index, and then query the documents to see how our initial searches perform.

### Create index

We'll start by creating a simple index called `tutorial-basic-index` with two fields: `id` and `phone_number`. We haven't defined an analyzer yet so the `standard.lucene` analyzer will be used by default.

To create the index, we send the following request:

```http
PUT https://<YOUR-SEARCH-SERVICE-NAME>.search.windows.net/indexes/tutorial-basic-index?api-version=2019-05-06
  Content-Type: application/json
  api-key: <YOUR-ADMIN-API-KEY>

  {
    "fields": [
      {
        "name": "id",
        "type": "Edm.String",
        "key": true,
        "searchable": true,
        "filterable": false,
        "facetable": false,
        "sortable": true
      },
      {
        "name": "phone_number",
        "type": "Edm.String",
        "sortable": false,
        "searchable": true,
        "filterable": false,
        "facetable": false
      }
    ]
  }
```

### Load data

Next, we'll load data into the index. In some cases, you may not have control over the format of the phone numbers ingested so we'll test against different kinds of formats. Ideally, a search solution will return all matching phone numbers regardless of their format.

Data is loaded into the index using the following request: 

```http
POST https://<YOUR-SEARCH-SERVICE-NAME>.search.windows.net/indexes/tutorial-basic-index/docs/index?api-version=2019-05-06
  Content-Type: application/json
  api-key: <YOUR-ADMIN-API-KEY>

  {
    "value": [
      {
        "@search.action": "upload",  
        "id": "1",
        "phone_number": "425-555-0100"
      },
      {
        "@search.action": "upload",  
        "id": "2",
        "phone_number": "(321) 555-0199"
      },
      {  
        "@search.action": "upload",  
        "id": "3",
        "phone_number": "+1 425-555-0100"
      },
      {  
        "@search.action": "upload",  
        "id": "4",  
        "phone_number": "+1 (321) 555-0199"
      },
      {
        "@search.action": "upload",  
        "id": "5",
        "phone_number": "4255550100"
      },
      {
        "@search.action": "upload",  
        "id": "6",
        "phone_number": "13215550199"
      },
      {
        "@search.action": "upload",  
        "id": "7",
        "phone_number": "425 555 0100"
      },
      {
        "@search.action": "upload",  
        "id": "8",
        "phone_number": "321.555.0199"
      }
    ]  
  }
```

With the data in the index, we're ready to start searching.

### Search

To make the search intuitive, it's best to not expect users to format queries in a specific way. A user could search for `(425) 555-0100` in any of the formats we showed above and will still expect results to be returned. In this step, we'll test out a couple of sample queries to see how they perform.

We start by searching `(425) 555-0100`:

```http
GET https://<YOUR-SEARCH-SERVICE-NAME>.search.windows.net/indexes/tutorial-basic-index/docs?api-version=2019-05-06&search=(425) 555-0100
  Content-Type: application/json
  api-key: <YOUR-ADMIN-API-KEY>  
```

This query returns **three out of four expected results** but also returns **two unexpected results**:

```json
{
    "value": [
        {
            "@search.score": 0.05634898,
            "phone_number": "+1 425-555-0100"
        },
        {
            "@search.score": 0.05634898,
            "phone_number": "425 555 0100"
        },
        {
            "@search.score": 0.05634898,
            "phone_number": "425-555-0100"
        },
        {
            "@search.score": 0.020766128,
            "phone_number": "(321) 555-0199"
        },
        {
            "@search.score": 0.020766128,
            "phone_number": "+1 (321) 555-0199"
        }
    ]
}
```

Next, let's search a number without any formatting `4255550100`

```http
GET https://<YOUR-SEARCH-SERVICE-NAME>.search.windows.net/indexes/tutorial-basic-index/docs?api-version=2019-05-06&search=4255550100
  api-key: <YOUR-ADMIN-API-KEY>
```

This query does even worse, only returning **one of four correct matches**.

```json
{
    "value": [
        {
            "@search.score": 0.6015292,
            "phone_number": "4255550100"
        }
    ]
}
```

If you find these results confusing, you're not alone. In the next section, we'll dig into why we're getting these results.

## 4 - Debug search results

To understand these search results, it's important to first understand how analyzers work. From there, we can test the default analyzer using the [Analyze Text API](/rest/api/searchservice/test-analyzer) and then create an analyzer that meets our needs.

### How analyzers work

An [analyzer](search-analyzers.md) is a component of the [full text search engine](search-lucene-query-architecture.md) responsible for processing text in query strings and indexed documents. Different analyzers manipulate text in different ways depending on the scenario. For this scenario, we need to build an analyzer tailored to phone numbers.

Analyzers consist of three components:

+ [**Character filters**](#CharFilters) that remove or replace individual characters from the input text.
+ A [**Tokenizer**](#Tokenizers) that breaks the input text into tokens, which become keys in the search index.
+ [**Token filters**](#TokenFilters) that manipulate the tokens produced by the tokenizer.

In the diagram below, you can see how these three components work together to tokenize a sentence:

  :::image type="content" source="media/tutorial-create-custom-analyzer/analyzers-explained.png" alt-text="Diagram of Analyzer process to tokenize a sentence":::

These tokens are then stored in an inverted index, which allows for fast, full-text searches.  An inverted index enables full-text search by mapping all unique terms extracted during lexical analysis to the documents in which they occur. You can see an example in the diagram below:

  :::image type="content" source="media/tutorial-create-custom-analyzer/inverted-index-explained.png" alt-text="Example inverted index":::

All of search comes down to searching for the terms stored in the inverted index. When a user issues a query:

1. The query is parsed and the query terms are analyzed.
1. The inverted index is then scanned for documents with matching terms.
1. Finally, the retrieved documents are ranked by the [scoring algorithm](index-ranking-similarity.md).

  :::image type="content" source="media/tutorial-create-custom-analyzer/query-architecture-explained.png" alt-text="Diagram of Analyzer process ranking similarity":::

If the query terms don't match the terms in your inverted index, results won't be returned. To learn more about how queries work, see this article on [full text search](search-lucene-query-architecture.md).

> [!Note]
> [Partial term queries](search-query-partial-matching.md) are an important exception to this rule. These queries (prefix query, wildcard query, regex query) bypass the lexical analysis process unlike regular term queries. Partial terms are only lowercased before being matched against terms in the index. If an analyzer isn't configured to support these types of queries, you'll often receive unexpected results because matching terms don't exist in the index.

### Test analyzer using the Analyze Text API

Azure Cognitive Search provides an [Analyze Text API](/rest/api/searchservice/test-analyzer) that allows you to test analyzers to understand how they process text.

The Analyze Text API is called using the following request:

```http
POST https://<YOUR-SEARCH-SERVICE-NAME>.search.windows.net/indexes/tutorial-basic-index/analyze?api-version=2019-05-06
  Content-Type: application/json
  api-key: <YOUR-ADMIN-API-KEY>

  {
    "text": "(425) 555-0100",
    "analyzer": "standard.lucene"
  }
```

The API then returns a list of the tokens extracted from the text. You can see that the standard Lucene analyzer splits the phone number into three separate tokens:

```json
{
    "tokens": [
        {
            "token": "425",
            "startOffset": 1,
            "endOffset": 4,
            "position": 0
        },
        {
            "token": "555",
            "startOffset": 6,
            "endOffset": 9,
            "position": 1
        },
        {
            "token": "0100",
            "startOffset": 10,
            "endOffset": 14,
            "position": 2
        }
    ]
}
```

Conversely, the phone number `4255550100` formatted without any punctuation is tokenized into a single token.

```json
{
  "text": "4255550100",
  "analyzer": "standard.lucene"
}
```

```json
{
    "tokens": [
        {
            "token": "4255550100",
            "startOffset": 0,
            "endOffset": 10,
            "position": 0
        }
    ]
}
```

Keep in mind that both query terms and the indexed documents are analyzed. Thinking back to the search results from the previous step, we can start to see why those results were returned.

In the first query, the incorrect phone numbers were returned because one of their terms, `555`, matched one of the terms we searched. In the second query, only the one number was returned because it was the only record that had a term matching `4255550100`.

## 5 - Build a custom analyzer

Now that we understand the results we're seeing, let's build a custom analyzer to improve the tokenization logic.

The goal is to provide intuitive search against phone numbers no matter what format the query or indexed string is in. To achieve this result, we'll specify a [character filter](#CharFilters), a [tokenizer](#Tokenizers), and a [token filter](#TokenFilters).

<a name="CharFilters"></a>

### Character filters

Character filters are used to process text before it's fed into the tokenizer. Common uses of character filters include filtering out HTML elements or replacing special characters.

For phone numbers, we want to remove whitespace and special characters because not all phone number formats contain the same special characters and spaces.

```json
"charFilters": [
    {
      "@odata.type": "#Microsoft.Azure.Search.MappingCharFilter",
      "name": "phone_char_mapping",
      "mappings": [
        "-=>",
        "(=>",
        ")=>",
        "+=>",
        ".=>",
        "\\u0020=>"
      ]
    }
  ]
```

The filter above will remove `-` `(` `)` `+` `.` and spaces from the input.

|Input|Output|  
|-|-|  
|`(321) 555-0199`|`3215550199`|  
|`321.555.0199`|`3215550199`|

<a name="Tokenizers"></a>

### Tokenizers

Tokenizers split text into tokens and discard some characters, such as punctuation, along the way. In many cases, the goal of tokenization is to split a sentence into individual words.

For this scenario, we'll use a keyword tokenizer, `keyword_v2`, because we want to capture the phone number as a single term. Note that this isn't the only way to solve this problem. See the [Alternate approaches](#Alternate) section below.

Keyword tokenizers always output the same text it was given as a single term.

|Input|Output|  
|-|-|  
|`The dog swims.`|`[The dog swims.]`|  
|`3215550199`|`[3215550199]`|

<a name="TokenFilters"></a>

### Token filters

Token filters will filter out or modify the tokens generated by the tokenizer. One common use of a token filter is to lowercase all characters using a lowercase token filter. Another common use is filtering out [stopwords](reference-stopwords.md) such as `the`, `and`, or `is`.

While we don't need to use either of those filters for this scenario, we'll use an nGram token filter to allow for partial searches of phone numbers.

```json
"tokenFilters": [
  {
    "@odata.type": "#Microsoft.Azure.Search.NGramTokenFilterV2",
    "name": "custom_ngram_filter",
    "minGram": 3,
    "maxGram": 20
  }
]
```

#### NGramTokenFilterV2

The [nGram_v2 token filter](https://lucene.apache.org/core/6_6_1/analyzers-common/org/apache/lucene/analysis/ngram/NGramTokenFilter.html) splits tokens into n-grams of a given size based on the `minGram` and `maxGram` parameters.

For the phone analyzer, we set `minGram` to `3` because that is the shortest substring we expect users to search. `maxGram` is set to `20` to ensure that all phone numbers, even with extensions, will fit into a single n-gram.

 The unfortunate side effect of n-grams is that some false positives will be returned. We'll fix this in step 7 by building out a separate analyzer for searches that doesn't include the n-gram token filter.

|Input|Output|  
|-|-|  
|`[12345]`|`[123, 1234, 12345, 234, 2345, 345]`|  
|`[3215550199]`|`[321, 3215, 32155, 321555, 3215550, 32155501, 321555019, 3215550199, 215, 2155, 21555, 215550, ... ]`|

### Analyzer

With our character filters, tokenizer, and token filters in place, we're ready to define our analyzer.

```json
"analyzers": [
  {
    "@odata.type": "#Microsoft.Azure.Search.CustomAnalyzer",
    "name": "phone_analyzer",
    "tokenizer": "custom_tokenizer_phone",
    "tokenFilters": [
      "custom_ngram_filter"
    ],
    "charFilters": [
      "phone_char_mapping"
    ]
  }
]
```

|Input|Output|  
|-|-|  
|`12345`|`[123, 1234, 12345, 234, 2345, 345]`|  
|`(321) 555-0199`|`[321, 3215, 32155, 321555, 3215550, 32155501, 321555019, 3215550199, 215, 2155, 21555, 215550, ... ]`|

Notice that any of the tokens in the output can now be searched. If our query includes any of those tokens, the phone number will be returned.

With the custom analyzer defined, recreate the index so that the custom analyzer will be available for testing in the next step. For simplicity, the Postman collection creates a new index named `tutorial-first-analyzer` with the analyzer we defined.

## 6 - Test the custom analyzer

After creating the index, you can now test out the analyzer we created using the following request:

```http
POST https://<YOUR-SEARCH-SERVICE-NAME>.search.windows.net/indexes/tutorial-first-analyzer/analyze?api-version=2019-05-06
  Content-Type: application/json
  api-key: <YOUR-ADMIN-API-KEY>  

  {
    "text": "+1 (321) 555-0199",
    "analyzer": "phone_analyzer"
  }
```

You will then be able to see the collection of tokens resulting from the phone number:

```json
{
    "tokens": [
        {
            "token": "132",
            "startOffset": 1,
            "endOffset": 17,
            "position": 0
        },
        {
            "token": "1321",
            "startOffset": 1,
            "endOffset": 17,
            "position": 0
        },
        {
            "token": "13215",
            "startOffset": 1,
            "endOffset": 17,
            "position": 0
        },
        ...
        ...
        ...
    ]
}
```

## 7 - Build a custom analyzer for queries

After making some sample queries against the index with the custom analyzer, you'll find that recall has improved and all matching phone numbers are now returned. However, the n-gram token filter causes some false positives to be returned as well. This is a common side effect of an n-gram token filter.

To prevent false positives, we'll create a separate analyzer for querying. This analyzer will be the same as the analyzer we created already but **without** the `custom_ngram_filter`.

```json
    {
      "@odata.type": "#Microsoft.Azure.Search.CustomAnalyzer",
      "name": "phone_analyzer_search",
      "tokenizer": "custom_tokenizer_phone",
      "tokenFilters": [],
      "charFilters": [
        "phone_char_mapping"
      ]
    }
```

In the index definition, we then specify both an `indexAnalyzer` and a `searchAnalyzer`.

```json
    {
      "name": "phone_number",
      "type": "Edm.String",
      "sortable": false,
      "searchable": true,
      "filterable": false,
      "facetable": false,
      "indexAnalyzer": "phone_analyzer",
      "searchAnalyzer": "phone_analyzer_search"
    }
```

With this change, you're all set. Recreate the index, index the data, and test the queries again to verify the search works as expected. If you're using the Postman collection, it will create a third index named `tutorial-second-analyzer`.

<a name="Alternate"></a>

## Alternate approaches

The analyzer above was designed to maximize the flexibility for search. However, it does so at the cost of storing many potentially unimportant terms in the index.

The example below shows a different analyzer that can also be used for this task. 

The analyzer works well except for input data such as `14255550100` that makes it difficult to logically chunk the phone number. For example, the analyzer wouldn't be able to separate the country code, `1`, from the area code, `425`. This discrepancy would lead to the number above not being returned if a user didn't include a country code in their search.

```json
"analyzers": [
  {
    "@odata.type": "#Microsoft.Azure.Search.CustomAnalyzer",
    "name": "phone_analyzer_shingles",
    "tokenizer": "custom_tokenizer_phone",
    "tokenFilters": [
      "custom_shingle_filter"
    ]
  }
],
"tokenizers": [
  {
    "@odata.type": "#Microsoft.Azure.Search.StandardTokenizerV2",
    "name": "custom_tokenizer_phone",
    "maxTokenLength": 4
  }
],
"tokenFilters": [
  {
    "@odata.type": "#Microsoft.Azure.Search.ShingleTokenFilter",
    "name": "custom_shingle_filter",
    "minShingleSize": 2,
    "maxShingleSize": 6,
    "tokenSeparator": ""
  }
]
```

You can see in the example below that the phone number is split into the chunks you would normally expect a user to be searching for.

|Input|Output|  
|-|-|  
|`(321) 555-0199`|`[321, 555, 0199, 321555, 5550199, 3215550199]`|

Depending on your requirements, this may be a more efficient approach to the problem.

## Reset and rerun

For simplicity, this tutorial had you create three new indexes. However, it's common to delete and recreate indexes during the early stages of development. You can delete an index in the Azure portal or using the following API call:

```http
DELETE https://<YOUR-SEARCH-SERVICE-NAME>.search.windows.net/indexes/tutorial-basic-index?api-version=2019-05-06
  api-key: <YOUR-ADMIN-API-KEY>
```

## Takeaways

This tutorial demonstrated the process for building and testing a custom analyzer. You created an index, indexed data, and then queried against the index to see what search results were returned. From there, you used the Analyze Text API to see the lexical analysis process in action.

While the analyzer defined in this tutorial offers an easy solution for searching against phone numbers, this same process can be used to build a custom phone analyzer for any scenario you may have.

## Clean up resources

When you're working in your own subscription, it's a good idea to remove the resources that you no longer need at the end of a project. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the All resources or Resource groups link in the left-navigation pane.

## Next steps

Now that you're familiar with how to create a custom analyzer, let's take a look at all of the different filters, tokenizers, and analyzers available to you to build a rich search experience.

> [!div class="nextstepaction"]
> [Custom Analyzers in Azure Cognitive Search](index-add-custom-analyzers.md)
