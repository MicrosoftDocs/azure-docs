---
title: 'REST API tutorial areate a custom analyzer'
titleSuffix: Azure Cognitive Search
description: Learn how to build a custom analyzer to improve the quality of search results in Azure Cognitive Search.
manager: liamca
author: dereklegenzoff
ms.author: delegenz
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 06/22/2020
---

# Tutorial: Create a custom analyzer for phone numbers

Analyzers are a key component in any search solution. To improve the quality of search results, it's important to understand how analyzers work and impact these results.

In some cases, like with a free text field, simply selecting the correct [language analyzer](index-add-language-analyzers.md) will improve search results. However, some scenarios such as accurately searching phone numbers, URLs, or emails may require the use of custom analyzers.

This tutorial uses Postman and Azure Cognitive Search's [REST APIs](https://docs.microsoft.com/rest/api/searchservice/) to:

> [!div class="checklist"]
> * Explain how analyzers work
> * Define a custom analyzer for searching phone numbers
> * Test how the custom analyzer tokenizes text
> * Create separate analyzers for indexing and searching to further improve results

## Prerequisites

The following services and tools are required for this tutorial.

+ [Postman desktop app](https://www.getpostman.com/)
+ [Create](search-create-service-portal.md) or [find an existing search service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices)

## Download files

Source code for this tutorial is in the [custom-analyzers](https://github.com/Azure-Samples/azure-search-postman-samples/custom-analyzers) folder in the [Azure-Samples/azure-search-postman-samples](https://github.com/Azure-Samples/azure-search-postman-samples) GitHub repository.

## 1 - Create Azure Cognitive Search service

To complete this tutorial, you'll need an Azure Cognitive Search service, which you can [create in the portal](search-create-service-portal.md). You can use the Free tier to complete this walkthrough.

### Get an admin api-key and URL for Azure Cognitive Search

API calls require the service URL and an access key. A search service is created with both, so if you added Azure Cognitive Search to your subscription, follow these steps to get the necessary information:

1. [Sign in to the Azure portal](https://portal.azure.com/), and in your search service **Overview** page, get the URL. An example endpoint might look like `https://mydemo.search.windows.net`.

1. In **Settings** > **Keys**, get an admin key for full rights on the service. There are two interchangeable admin keys, provided for business continuity in case you need to roll one over. You can use either the primary or secondary key on requests for adding, modifying, and deleting objects.

   ![Get an HTTP endpoint and access key](media/search-get-started-postman/get-url-key.png "Get an HTTP endpoint and access key")

## 2 - Set up Postman

Start Postman and import the collection you downloaded from [Azure-Samples/azure-search-postman-samples](https://github.com/Azure-Samples/azure-search-postman-samples).

To import the collection, go to **Files** > **Import**, then select the collection to import.

For each request, you need to:

1. Replace `<YOUR-SEARCH-SERVICE>` with the name of your search service (for example, if the endpoint is https://mydemo.search.windows.net, then the service name is "mydemo").

1. Replace `<YOUR-ADMIN-API-KEY>` with either the primary or secondary key of your search service.

  ![Postman request URL and header](media/search-get-started-postman/postman-url.png "Postman request URL and header")

Alternatively, you can set up each HTTP request from scratch. If you are unfamiliar with Postman, see [Explore Azure Cognitive Search REST APIs using Postman](search-get-started-postman.md).

## 3 - Create an initial index

In this step, we'll create an initial index, load documents into the index, and then query the documents to see how our initial queries perform.

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
        "phone_number": "425-555-2311"
      },
      {          
        "@search.action": "upload",  
        "id": "2",
        "phone_number": "(321) 555-5784"
      },
      {  
        "@search.action": "upload",  
        "id": "3",
        "phone_number": "+1 425-555-2311"
      }, 
      {  
        "@search.action": "upload",  
        "id": "4",  
        "phone_number": "+1 (321) 555-5784"
      },
      {          
        "@search.action": "upload",  
        "id": "5",
        "phone_number": "4255552311"
      },
      {          
        "@search.action": "upload",  
        "id": "6",
        "phone_number": "13215555784"
      },
      {          
        "@search.action": "upload",  
        "id": "7",
        "phone_number": "425 555 2311"
      },
      {          
        "@search.action": "upload",  
        "id": "8",
        "phone_number": "321.555.5784"
      }
    ]  
  }
```

With the data in the index, we're ready to start searching.

### Search

To make the search intuitive, it's best to not expect users to format queries in a specific way. A user could search for `(425) 555-2311` in any of the formats we showed above and will still expect results to be returned. In this step, we'll test out a couple of sample queries to see how they do.

We start by searching `(425) 555-2311`:

```http
GET https://<YOUR-SEARCH-SERVICE-NAME>.search.windows.net/indexes/tutorial-basic-index/docs?api-version=2019-05-06&search=(425) 555-2311
  Content-Type: application/json
  api-key: <YOUR-ADMIN-API-KEY>  
```

This query returns **three out of four expected results** but also returns **two unexpected results**:

```json
{
    "value": [
        {
            "@search.score": 0.05634898,
            "phone_number": "+1 425-555-2311"
        },
        {
            "@search.score": 0.05634898,
            "phone_number": "425 555 2311"
        },
        {
            "@search.score": 0.05634898,
            "phone_number": "425-555-2311"
        },
        {
            "@search.score": 0.020766128,
            "phone_number": "(321) 555-5784"
        },
        {
            "@search.score": 0.020766128,
            "phone_number": "+1 (321) 555-5784"
        }
    ]
}
```

Next, let's search a number without any formatting `425555311`

```http
GET https://<YOUR-SEARCH-SERVICE-NAME>.search.windows.net/indexes/tutorial-basic-index/docs?api-version=2019-05-06&search=425555311
  api-key: <YOUR-ADMIN-API-KEY> 
```

This query does even worse, only returning **one of four correct matches**.

```json
{
    "value": [
        {
            "@search.score": 0.6015292,
            "phone_number": "4255552311"
        }
    ]
}
```

If you find these results confusing, you're not alone. In the next section, we'll dig into why we're getting these results.

## 4 - Debug search results

To understand these search results, it's important to first understand how analyzers work. From there, we can test the default analyzer using the [analyze text API](https://docs.microsoft.com/rest/api/searchservice/test-analyzer) and then create an analyzer that meets our needs.

### How analyzers work

An *analyzer* is a component of the [full text search engine](search-lucene-query-architecture.md) responsible for processing text in query strings and indexed documents. Different analyzers manipulate text in different ways depending on the scenario. For this scenario, we need to build an analyzer tailored to phone numbers.

Analyzers consist of three components: [**character filters**](#CharFilters), [**tokenizers**](#Tokenizers), and [**token filters**](#TokenFilters). These three components work together to convert text into a collection of tokens that are then stored in the search index.

  ![Diagram of Analyzer process](media/tutorial-create-custom-analyzer/analyzer-explained.png)

These tokens are then stored in an inverted index, which allows for fast, full-text searches.

  ![Example inverted index](media/tutorial-create-custom-analyzer/inverted-index.png)

All of search comes down to searching for these tokens. When a user issues a query:

1. The query is analyzed and broken into tokens
1. The inverted index is then scanned for documents with matching tokens
1. Finally, the results are ranked by feeding the matching tokens into a [similarity algorithm](index-ranking-similarity.md) to score the results.

  ![Diagram of Analyzer process](media/tutorial-create-custom-analyzer/query-architecture.png)

If the tokens from your query don't match the tokens in your inverted index, results won't be returned.

> [!Note]
> [Partial term searches](search-query-partial-matching.md) are an important exception to this rule. These searches (prefix search, wildcard search, regex search) bypass the lexical anlysis process so the text isn't split into tokens like other queries. If an analyzer isn't configured to support these types of queries, you'll often receive unexpected results because matching tokens don't exist in the index.

### Test analyzer using the Analyze Text API

Azure Cognitive Search provides an [Analyze Text API](https://docs.microsoft.com/rest/api/searchservice/test-analyzer) that allows you to test analyzers to understand how they tokenize text.

The Analyze Text API is called using the following request:

```http
POST https://<YOUR-SEARCH-SERVICE-NAME>.search.windows.net/indexes/tutorial-basic-index/analyze?api-version=2019-05-06
  Content-Type: application/json
  api-key: <YOUR-ADMIN-API-KEY>

  {
	  "text": "(425) 555-2311",
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
            "token": "2311",
            "startOffset": 10,
            "endOffset": 14,
            "position": 2
        }
    ]
}
```

Alternatively, the phone number `4255552311` formatted without any punctuation is tokenized into a single token.

```json
{
  "text": "4255552311",
  "analyzer": "standard.lucene"
}
```

```json
{
    "tokens": [
        {
            "token": "4255552311",
            "startOffset": 0,
            "endOffset": 10,
            "position": 0
        }
    ]
}
```

Keep in mind that both searches and the data in the index are tokenized. Thinking back to the search results from the previous step, we can start to see why those results were returned.

In the first query, the incorrect phone numbers were returned because one of their tokens (555) matched one of the tokens we searched. In the second query, only the one number was returned because it was the only one that had a token matching `4255552311`.

## 5 - Build a custom analyzer

Now that we understand the results we're seeing, let's build a custom analyzer to improve the tokenization logic.

The goal is to provide intuitive search against phone numbers no matter what format the query or indexed string is in. To achieve this result, we'll specify a [character filter](#CharFilters), a [tokenizer](#Tokenizers), and several [token filters](#TokenFilters).

<a name="CharFilters"></a>

### Character filters

Character filters are used to process text before it's fed into the tokenizer. Common uses of character filters include filtering out HTML elements, removing special characters, or stripping whitespace from a string.

For phone numbers, we want to remove whitespace and special characters because not all phone number formats contain the same special characters and whitespace.

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

The filter above will remove `-` `(` `)` `+` `.` and whitespace from the input.

#### Examples

|Input|Output|  
|-|-|  
|`(321) 555-5784`|`3215555784`|  
|`321.555.5784`|`3215555784`|

<a name="Tokenizers"></a>

### Tokenizers

Tokenizers split text into tokens and discard some characters, such as punctuation, along the way. In many cases, the goal of tokenization is to split a sentence into individual words.

For this scenario, we'll just use the standard tokenizer. The `maxTokenLength` needs to be at least as long as the longest phone number. We set `maxTokenLength` to `20` to be safe in case any phone numbers have extensions.

```json
"tokenizers": [
  {
    "@odata.type": "#Microsoft.Azure.Search.StandardTokenizerV2",
    "name": "custom_tokenizer_phone",
    "maxTokenLength": 20
  }
]
```

|Input|Output|  
|-|-|  
|`The dog swims.`|`[The, dog, swims]`|  
|`(321) 555-5784`|`[321, 555, 5784]`|
|`3215555784`|`[3215555784]`|

<a name="TokenFilters"></a>

### Token filters

Token filters will filter out or modify the tokens generated by the tokenizer. One common use of a token filter is to lowercase all characters using a lowercase token filter. Another common use is using an n-gram filter that splits tokens into n-grams.

We'll use both of those filters for our phone analyzer as well as an ASCII folding token filter. The lowercase token filter doesn't need to be customized so we only need to specify it in the analyzer section in the next step.

```json
"tokenFilters": [
  {
    "@odata.type": "#Microsoft.Azure.Search.AsciiFoldingTokenFilter",
    "name": "custom_ascii_folding_filter",
    "preserveOriginal": true
  },
  {
    "@odata.type": "#Microsoft.Azure.Search.NGramTokenFilterV2",
    "name": "custom_ngram_filter",
    "minGram": 3,
    "maxGram": 20
  }
]
```

#### AsciiFoldingTokenFilter

The [ASCII folding token filter](https://lucene.apache.org/core/6_6_1/analyzers-common/org/apache/lucene/analysis/miscellaneous/ASCIIFoldingFilter.html) converts non-ASCII characters to their ASCII equivalent. The `preserveOriginal` setting determines if the original token is kept.

For phone numbers, ASCII folding shouldn't be necessary but we include it as a best practice.

|Input|Output|  
|-|-|  
|`[Château, de, Versailles]`|`[Chateau, Château, de, Versailles]`|

#### NGramTokenFilterV2

The [nGram_v2 token filter](https://lucene.apache.org/core/6_6_1/analyzers-common/org/apache/lucene/analysis/ngram/NGramTokenFilter.html) splits tokens into n-grams of a given size based on the `minGram` and `maxGram` parameters.

For the phone analyzer, we set `minGram` to `3` because that is the shortest substring we expect users to search. `maxGram` is set to `20` to ensure that all phone numbers, even with extensions, will fit into a single n-gram.

An n-gram token filter is included because it allows for partial searches of phone numbers. The unfortunate side effect of n-grams is that some false positives will be returned. We'll fix this in step 7 by building out a separate analyzer for searches that doesn't include the n-gram token filter.

|Input|Output|  
|-|-|  
|`[12345]`|`[123, 1234, 12345, 234, 2345, 345]`|  
|`[3215555784]`|`[321, 3215, 32155, 321555, 3215555, 32155557, 321555578, 3215555784, 215, 2155, 21555, 215555, ... ]`|

#### Lowercase

The [lowercase token filter](https://lucene.apache.org/core/6_6_1/analyzers-common/org/apache/lucene/analysis/core/LowerCaseFilter.html) normalizes token text to lower case.

For phone numbers, a lowercase token filter shouldn't be necessary but we include it as a best practice.

|Input|Output|  
|-|-|  
|`[Bill, Gates]`|`[bill, gates]`|

### Analyzer

With our character filters, tokenizer, and token filters in place, we're ready to define our analyzer.

```json
"analyzers": [
  {
    "@odata.type": "#Microsoft.Azure.Search.CustomAnalyzer",
    "name": "custom_phone_analyzer",
    "tokenizer": "custom_tokenizer_phone",
    "tokenFilters": [
      "lowercase",
      "custom_ascii_folding_filter",
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
|`(321) 555-5784`|`[321, 3215, 32155, 321555, 3215555, 32155557, 321555578, 3215555784, 215, 2155, 21555, 215555, ... ]`|

Notice that any of the tokens in the output can now be searched. If our query includes any of those tokens, the phone number will be returned.

With the custom analyzer defined, recreate the index, so that the custom analyzer will be available for testing in the next step. For simplicity, the Postman collection creates a new index with the analyzer named `tutorial-first-analyzer`.

## 6 - Test the custom analyzer

After creating the index, you can now test out the analyzer we created using the following request:

```http
POST https://<YOUR-SEARCH-SERVICE-NAME>.search.windows.net/indexes/tutorial-first-analyzer/analyze?api-version=2019-05-06
  Content-Type: application/json
  api-key: <YOUR-ADMIN-API-KEY>  

  {
    "text": "+1 (321) 555-5784",
    "analyzer": "phone_char_mapping"
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

## 7 - Build a custom analyzer for searches

After making some sample searches against the index with the custom analyzer, you'll find that recall has improved and all matching phone numbers are now returned. However, the n-gram token filter causes some false positives to be returned as well. This is a common side effect of an n-gram token filter.

To prevent false positives, we create a separate analyzer for searching. This analyzer will be the same as the analyzer we created but without `custom_ngram_filter`.

```json
    {
      "@odata.type": "#Microsoft.Azure.Search.CustomAnalyzer",
      "name": "custom_phone_analyzer_search",
      "tokenizer": "custom_tokenizer_phone",
      "tokenFilters": [
        "lowercase",
        "custom_ascii_folding_filter"
      ],
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
      "indexAnalyzer": "custom_phone_analyzer",
      "searchAnalyzer": "custom_phone_analyzer_search"
    }
```

With this change, you're all set. Recreate the index, index the data, and test the queries again to verify the search works as expected. If you're using the Postman collection, it will create a third index named `tutorial-second-analyzer`.

## Reset and rerun

For simplicity, this tutorial had you create three new indexes. However, it's common to delete and recreate indexes during the early stages of development. You can delete an index in the Azure portal or using the following API call:

```http
DELETE https://<YOUR-SEARCH-SERVICE-NAME>.search.windows.net/indexes/tutorial-basic-index?api-version=2019-05-06
  api-key: <YOUR-ADMIN-API-KEY>
```

## Takeaways

This tutorial demonstrated the process for building and testing a custom analyzer. You created an index, indexed data, and then queried against the index to see what search results were returned. From there, you used the analyze text API to see the lexical analysis process in action.

While the analyzer defined in this tutorial offers an easy solution for searching against phone numbers, this same process can be used to build a custom phone analyzer for any scenario.

## Clean up resources

When you're working in your own subscription, at the end of a project, it's a good idea to remove the resources that you no longer need. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the All resources or Resource groups link in the left-navigation pane.

## Next steps

Now that you're familiar with how to create a custom analyzer, let's take a look at all of the different filters, tokenizers, and analyzers available to you to build a rich search experience.

> [!div class="nextstepaction"]
> [How full text search works in Azure Cognitive Search](index-add-custom-analyzers.md)
