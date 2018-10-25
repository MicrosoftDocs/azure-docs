---
title: Analyzers in Azure Search | Microsoft Docs
description: Assign analyzers to searchable text fields in an index to replace default standard Lucene with custom, predefined or language-specific alternatives.
services: search
ms.service: search
ms.topic: conceptual
ms.date: 09/11/2017
ms.author: heidist
manager: cgronlun
author: HeidiSteen
---

# Analyzers in Azure Search

An *analyzer* is a component of [full text search](search-lucene-query-architecture.md) responsible for processing text in query strings and indexed documents. The following transformations are typical during analysis:

+ Non-essential words (stopwords) and punctuation are removed.
+ Phrases and hyphenated words are broken down into component parts.
+ Upper-case words are lower-cased.
+ Words are reduced to root forms so that a match can be found regardless of tense.

Linguistic analyzers convert a text input into primitive or root forms that are efficient for information storage and retrieval. Conversion occurs during indexing, when the index is built, and then again during search when the index is read. You are more likely to get the search results you expect if you use the same text analyzer for both operations.

Azure Search uses the [Standard Lucene analyzer](https://lucene.apache.org/core/4_0_0/analyzers-common/org/apache/lucene/analysis/standard/StandardAnalyzer.html) as the default. You can override the default on a field-by-field basis. This article describes the range of choices and offers best practices for custom analysis. It also provides example configurations for key scenarios.

## Supported analyzers

The following list describes which analyzers are supported in Azure Search.

| Category | Description |
|----------|-------------|
| [Standard Lucene analyzer](https://lucene.apache.org/core/4_0_0/analyzers-common/org/apache/lucene/analysis/standard/StandardAnalyzer.html) | Default. No specification or configuration is required. This general-purpose analyzer performs well for most languages and scenarios.|
| Predefined analyzers | Offered as a finished product intended to be used as-is, with limited customization. <br/>There are two types: specialized and language. What makes them "predefined" is that you reference them by name, with no customization. <br/><br/>[Specialized (language agnostic) analyzers](https://docs.microsoft.com/rest/api/searchservice/custom-analyzers-in-azure-search#AnalyzerTable) are used when text inputs require specialized processing or minimal processing. Non-language predefined analyzers include **Asciifolding**, **Keyword**, **Pattern**, **Simple**, **Stop**, **Whitespace**.<br/><br/>[Language analyzers](https://docs.microsoft.com/rest/api/searchservice/language-support) are used when you need rich linguistic support for individual languages. Azure Search supports 35 Lucene language analyzers and 50 Microsoft natural language processing analyzers. |
|[Custom analyzers](https://docs.microsoft.com/rest/api/searchservice/Custom-analyzers-in-Azure-Search) | A user-defined configuration of a combination of existing elements, consisting of one tokenizer (required) and optional filters (char or token).|

You can customize a predefined analyzer, such as **Pattern** or **Stop**, to use alternative options documented in [Predefined Analyzer Reference](https://docs.microsoft.com/rest/api/searchservice/custom-analyzers-in-azure-search#AnalyzerTable). Only a few of the predefined analyzers have options that you can set. As with any customization, provide your new configuration with a name, such as *myPatternAnalyzer* to distinguish it from the Lucene Pattern analyzer.

## How to specify analyzers

1. (for custom analyzers only) Create an **analyzer** section in the index definition. For more information, see [Create Index](https://docs.microsoft.com/rest/api/searchservice/create-index) and also [Custom Analyzers > Create](https://docs.microsoft.com/rest/api/searchservice/Custom-analyzers-in-Azure-Search#create-a-custom-analyzer).

2. On a [field definition](https://docs.microsoft.com/rest/api/searchservice/create-index) in the index, set the **analyzer** property to the name of a target analyzer (for example, `"analyzer" = "keyword"`. Valid values include name of a predefined analyzer, language analyzer, or custom analyzer also defined in the index schema.

3. Optionally, instead of one **analyzer** property, you can set different analyzers for indexing and querying using the **indexAnalyzer** and **searchAnalyzer`** field parameters. 

3. Adding an analyzer to a field definition incurs a write operation on the index. If you add an **analyzer** to an existing index, note the following steps:
 
 | Scenario | Impact | Steps |
 |----------|--------|-------|
 | Add a new field | minimal | If the field doesn't exist yet in the schema, there is no field revision to make because the field does not yet have a physical presence in your index. Use [Update Index](https://docs.microsoft.com/rest/api/searchservice/update-index) and [mergeOrUpload](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents) for this task.|
 | Add an analyzer to an existing indexed field. | rebuild | The inverted index for that field must be recreated from the ground up and the content for those fields must be reindexed. <br/> <br/>For indexes under active development, [delete](https://docs.microsoft.com/rest/api/searchservice/delete-index) and [create](https://docs.microsoft.com/rest/api/searchservice/create-index) the index to pick up the new field definition. <br/> <br/>For indexes in production, you should create a new field to provide the revised definition and start using it. Use [Update Index](https://docs.microsoft.com/rest/api/searchservice/update-index) and [mergeOrUpload](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents) to incorporate the new field. Later, as part of planned index servicing, you can clean up the index to remove obsolete fields. |

## Tips and best practices

This section offers advice on how to work with analyzers.

### One analyzer for read-write unless you have specific requirements

Azure Search lets you specify different analyzers for indexing and search via additional `indexAnalyzer` and `searchAnalyzer` field parameters. If unspecified, the analyzer set with the `analyzer` property is used for both indexing and searching. If `analyzer` is unspecified, the default Standard Lucene analyzer is used.

A general rule is to use the same analyzer for both indexing and querying, unless specific requirements dictate otherwise. Be sure to test thoroughly. When text processing differs at search and indexing time, you run the risk of mismatch between query terms and indexed terms when the search and indexing analyzer configurations are not aligned.

### Test during active development

Overriding the standard analyzer requires an index rebuild. If possible, decide on which analyzers to use during active development, before rolling an index into production.

### Inspect tokenized terms

If a search fails to return expected results, the most likely scenario is token discrepancies between term inputs on the query, and tokenized terms in the index. If the tokens aren't the same, matches fail to materialize. To inspect tokenizer output, we recommend using the [Analyze API](https://docs.microsoft.com/rest/api/searchservice/test-analyzer) as an investigation tool. The response consists of tokens, as generated by a specific analyzer.

### Compare English analyzers

The [Search Analyzer Demo](http://alice.unearth.ai/) is a third-party demo app showing a side-by-side comparison of the standard Lucene analyzer, Lucene's English language analyzer, and Microsoft's English natural language processor. The index is fixed; it contains text from a popular story. For each search input you provide, results from each analyzer are displayed in adjacent panes, giving you a sense of how each analyzer processes the same string. 

## Examples

The examples below show analyzer definitions for a few key scenarios.

<a name="Example1"></a>
### Example 1: Custom options

This example illustrates an analyzer definition with custom options. Custom options for char filters, tokenizers, and token filters are specified separately as named constructs, and then referenced in the analyzer definition. Predefined elements are used as-is and simply referenced by name.

Walking through this example:

* Analyzers are a property of the field class for a searchable field.
* A custom analyzer is part of an index definition. It might be lightly customized (for example, customizing a single option in one filter) or customized in multiple places.
* In this case, the custom analyzer is "my_analyzer", which in turn uses a customized standard tokenizer "my_standard_tokenizer" and two token filters: lowercase and customized asciifolding filter "my_asciifolding".
* It also defines a custom  "map_dash" char filter to replace all dashes with underscores before tokenization (the standard tokenizer breaks on dash but not on underscore).

~~~~
  {
     "name":"myindex",
     "fields":[
        {
           "name":"id",
           "type":"Edm.String",
           "key":true,
           "searchable":false
        },
        {
           "name":"text",
           "type":"Edm.String",
           "searchable":true,
           "analyzer":"my_analyzer"
        }
     ],
     "analyzers":[
        {
           "name":"my_analyzer",
           "@odata.type":"#Microsoft.Azure.Search.CustomAnalyzer",
           "charFilters":[
              "map_dash"
           ],
           "tokenizer":"my_standard_tokenizer",
           "tokenFilters":[
              "my_asciifolding",
              "lowercase"
           ]
        }
     ],
     "charFilters":[
        {
           "name":"map_dash",
           "@odata.type":"#Microsoft.Azure.Search.MappingCharFilter",
           "mappings":["-=>_"]
        }
     ],
     "tokenizers":[
        {
           "name":"my_standard_tokenizer",
           "@odata.type":"#Microsoft.Azure.Search.StandardTokenizerV2",
           "maxTokenLength":20
        }
     ],
     "tokenFilters":[
        {
           "name":"my_asciifolding",
           "@odata.type":"#Microsoft.Azure.Search.AsciiFoldingTokenFilter",
           "preserveOriginal":true
        }
     ]
  }
~~~~

<a name="Example2"></a>
### Example 2: Override the default analyzer

The Standard analyzer is the default. Suppose you want to replace the default with a different predefined analyzer, such as the pattern analyzer. If you are not setting custom options, you only need to specify it by name in the field definition.

The "analyzer" element overrides the Standard analyzer on a field-by-field basis. There is no global override. In this example, `text1` uses the pattern analyzer and `text2`, which doesn't specify an analyzer, uses the default.

~~~~
  {
     "name":"myindex",
     "fields":[
        {
           "name":"id",
           "type":"Edm.String",
           "key":true,
           "searchable":false
        },
        {
           "name":"text1",
           "type":"Edm.String",
           "searchable":true,
           "analyzer":"pattern"
        },
        {
           "name":"text2",
           "type":"Edm.String",
           "searchable":true
        }
     ]
  }
~~~~

<a name="Example3"></a>
### Example 3: Different analyzers for indexing and search operations

The APIs include additional index attributes for specifying different analyzers for indexing and search. The `searchAnalyzer` and `indexAnalyzer` attributes must be specified as a pair, replacing the single `analyzer` attribute.


~~~~
  {
     "name":"myindex",
     "fields":[
        {
           "name":"id",
           "type":"Edm.String",
           "key":true,
           "searchable":false
        },
        {
           "name":"text",
           "type":"Edm.String",
           "searchable":true,
           "indexAnalyzer":"whitespace",
           "searchAnalyzer":"simple"
        },
     ],
  }
~~~~

<a name="Example4"></a>
### Example 4: Language analyzer

Fields containing strings in different languages can use a language analyzer, while other fields retain the default (or use some other predefined or custom analyzer). If you use a language analyzer, it must be used for both indexing and search operations. Fields that use a language analyzer cannot have different analyzers for indexing and search.

~~~~
  {
     "name":"myindex",
     "fields":[
        {
           "name":"id",
           "type":"Edm.String",
           "key":true,
           "searchable":false
        },
        {
           "name":"text",
           "type":"Edm.String",
           "searchable":true,
           "indexAnalyzer":"whitespace",
           "searchAnalyzer":"simple"
        },
        {
           "name":"text_fr",
           "type":"Edm.String",
           "searchable":true,
           "analyzer":"fr.lucene"
        }
     ],
  }
~~~~

## Next steps

+ Review our comprehensive explanation of [how full text search works in Azure Search](search-lucene-query-architecture.md). This article uses examples to explain behaviors that might seem counter-intuitive on the surface.

+ Try additional query syntax from the [Search Documents](https://docs.microsoft.com/rest/api/searchservice/search-documents#examples) example section or from [Simple query syntax](https://docs.microsoft.com/rest/api/searchservice/simple-query-syntax-in-azure-search) in Search explorer in the portal.

+ Learn how to apply [language-specific lexical analyzers](https://docs.microsoft.com/rest/api/searchservice/language-support).

+ [Configure custom analyzers](https://docs.microsoft.com/rest/api/searchservice/custom-analyzers-in-azure-search) for either minimal processing or specialized processing on individual fields.

+ [Compare standard and English analyzers](http://alice.unearth.ai/) in adjacent panes on this demo web site. 

## See also

 [Search Documents REST API](https://docs.microsoft.com/rest/api/searchservice/search-documents) 

 [Simple query syntax](https://docs.microsoft.com/rest/api/searchservice/simple-query-syntax-in-azure-search) 

 [Full Lucene query syntax](https://docs.microsoft.com/rest/api/searchservice/lucene-query-syntax-in-azure-search) 
 
 [Handle search results](https://docs.microsoft.com/azure/search/search-pagination-page-layout)

<!--Image references-->
[1]: ./media/search-lucene-query-architecture/architecture-diagram2.png
