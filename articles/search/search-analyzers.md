---
title: Analyzers for linguistic and text processing
titleSuffix: Azure Cognitive Search
description: Assign analyzers to searchable text fields in an index to replace default standard Lucene with custom, predefined or language-specific alternatives.

author: HeidiSteen
manager: nitinme
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 06/05/2020
---

# Analyzers for text processing in Azure Cognitive Search

An *analyzer* is a component of the [full text search engine](search-lucene-query-architecture.md) responsible for processing text in query strings and indexed documents. Processes are transformative, modifying a string through actions such as these:

+ Remove non-essential words (stopwords) and punctuation
+ Split up phrases and hyphenated words into component parts
+ Lower-case any upper-case words
+ Reduce words into primitive root forms for storage efficiency and so that matches can be found regardless of tense

Analysis occurs during indexing when the index is built, and then again during query execution when the index is read. You are more likely to get the search results you expect if you use the same analyzer for both operations.

If you are unfamiliar with text analysis, listen to the following video clip for a brief explanation of how text processing works in Azure Cognitive Search.

> [!VIDEO https://www.youtube.com/embed/Y_X6USgvB1g?version=3&start=132&end=189]

## Default analyzer  

In Azure Cognitive Search queries, a text analyzer is automatically invoked on all string fields marked as searchable. 

By default, Azure Cognitive Search uses the [Apache Lucene Standard analyzer (standard lucene)](https://lucene.apache.org/core/6_6_1/core/org/apache/lucene/analysis/standard/StandardAnalyzer.html), which breaks text into elements following the ["Unicode Text Segmentation"](https://unicode.org/reports/tr29/) rules. Additionally, the standard analyzer converts all characters to their lower case form. Both indexed documents and search terms go through the analysis during indexing and query processing.  

You can override the default on a field-by-field basis. Alternative analyzers can be a [language analyzer](index-add-language-analyzers.md) for linguistic processing, a [custom analyzer](index-add-custom-analyzers.md), or a predefined analyzer from the [list of available analyzers](index-add-custom-analyzers.md#AnalyzerTable).

## Types of analyzers

The following list describes which analyzers are available in Azure Cognitive Search.

| Category | Description |
|----------|-------------|
| [Standard Lucene analyzer](https://lucene.apache.org/core/6_6_1/core/org/apache/lucene/analysis/standard/StandardAnalyzer.html) | Default. No specification or configuration is required. This general-purpose analyzer performs well for many languages and scenarios.|
| Predefined analyzers | Offered as a finished product intended to be used as-is. <br/>There are two types: specialized and language. What makes them "predefined" is that you reference them by name, with no configuration or customization. <br/><br/>[Specialized (language-agnostic) analyzers](index-add-custom-analyzers.md#AnalyzerTable) are used when text inputs require specialized processing or minimal processing. Non-language predefined analyzers include **Asciifolding**, **Keyword**, **Pattern**, **Simple**, **Stop**, **Whitespace**.<br/><br/>[Language analyzers](index-add-language-analyzers.md) are used when you need rich linguistic support for individual languages. Azure Cognitive Search supports 35 Lucene language analyzers and 50 Microsoft natural language processing analyzers. |
|[Custom analyzers](https://docs.microsoft.com/rest/api/searchservice/Custom-analyzers-in-Azure-Search) | Refers to a user-defined configuration of a combination of existing elements, consisting of one tokenizer (required) and optional filters (char or token).|

A few predefined analyzers, such as **Pattern** or **Stop**, support a limited set of configuration options. To set these options, you effectively create a custom analyzer, consisting of the predefined analyzer and one of the alternative options documented in [Predefined Analyzer Reference](index-add-custom-analyzers.md#AnalyzerTable). As with any custom configuration, provide your new configuration with a name, such as *myPatternAnalyzer* to distinguish it from the Lucene Pattern analyzer.

## How to specify analyzers

1. (for custom analyzers only) Create a named **analyzer** section in the index definition. For more information, see [Create Index](https://docs.microsoft.com/rest/api/searchservice/create-index) and also [Add custom analyzers](index-add-custom-analyzers.md).

2. On a [field definition](https://docs.microsoft.com/rest/api/searchservice/create-index) in the index, set the field's **analyzer** property to the name of a target analyzer (for example, `"analyzer" = "keyword"`. Valid values include name of a predefined analyzer, language analyzer, or custom analyzer also defined in the index schema. Plan on assigning analyzer in the index definition phase before the index is created in the service.

3. Optionally, instead of one **analyzer** property, you can set different analyzers for indexing and querying using the **indexAnalyzer** and **searchAnalyzer** field parameters. You would use different analyzers for data preparation and retrieval if one of those activities required a specific transformation not needed by the other.

> [!NOTE]
> It is not possible to use a different [language analyzer](index-add-language-analyzers.md) at indexing time than at query time for a field. That capability is reserved for [custom analyzers](index-add-custom-analyzers.md). For this reason, if you try to set the **searchAnalyzer** or **indexAnalyzer** properties to the name of a language analyzer, the REST API will return an error response. You must use the **analyzer** property instead.

Assigning **analyzer** or **indexAnalyzer** to a field that has already been physically created is not allowed. If any of this is unclear, review the following table for a breakdown of which actions require a rebuild and why.
 
 | Scenario | Impact | Steps |
 |----------|--------|-------|
 | Add a new field | minimal | If the field doesn't exist yet in the schema, there is no field revision to make because the field does not yet have a physical presence in your index. You can use [Update Index](https://docs.microsoft.com/rest/api/searchservice/update-index) to add a new field to an existing index, and [mergeOrUpload](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents) to populate it.|
 | Add an **analyzer** or **indexAnalyzer** to an existing indexed field. | [rebuild](search-howto-reindex.md) | The inverted index for that field must be recreated from the ground up, and the content for those fields must be reindexed. <br/> <br/>For indexes under active development, [delete](https://docs.microsoft.com/rest/api/searchservice/delete-index) and [create](https://docs.microsoft.com/rest/api/searchservice/create-index) the index to pick up the new field definition. <br/> <br/>For indexes in production, you can defer a rebuild by creating a new field to provide the revised definition and start using it in place of the old one. Use [Update Index](https://docs.microsoft.com/rest/api/searchservice/update-index) to incorporate the new field and [mergeOrUpload](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents) to populate it. Later, as part of planned index servicing, you can clean up the index to remove obsolete fields. |

## When to add analyzers

The best time to add and assign analyzers is during active development, when dropping and recreating indexes is routine.

As an index definition solidifies, you can append new analysis constructs to an index, but you will need to pass the **allowIndexDowntime** flag to [Update Index](https://docs.microsoft.com/rest/api/searchservice/update-index) if you want to avoid this error:

*"Index update not allowed because it would cause downtime. In order to add new analyzers, tokenizers, token filters, or character filters to an existing index, set the 'allowIndexDowntime' query parameter to 'true' in the index update request. Note that this operation will put your index offline for at least a few seconds, causing your indexing and query requests to fail. Performance and write availability of the index can be impaired for several minutes after the index is updated, or longer for very large indexes."*

The same holds true when assigning an analyzer to a field. An analyzer is an integral part of the field's definition, so you can only add it when the field is created. If you want to add analyzers to existing fields, you'll have to [drop and rebuild](search-howto-reindex.md) the index, or add a new field with the analyzer you want.

As noted, an exception is the **searchAnalyzer** variant. Of the three ways to specify analyzers (**analyzer**, **indexAnalyzer**, **searchAnalyzer**), only the **searchAnalyzer** attribute can be changed on an existing field.

## Recommendations for working with analyzers

This section offers advice on how to work with analyzers.

### One analyzer for read-write unless you have specific requirements

Azure Cognitive Search lets you specify different analyzers for indexing and search via additional **indexAnalyzer** and **searchAnalyzer** field parameters. If unspecified, the analyzer set with the **analyzer** property is used for both indexing and searching. If `analyzer` is unspecified, the default Standard Lucene analyzer is used.

A general rule is to use the same analyzer for both indexing and querying, unless specific requirements dictate otherwise. Be sure to test thoroughly. When text processing differs at search and indexing time, you run the risk of mismatch between query terms and indexed terms when the search and indexing analyzer configurations are not aligned.

### Test during active development

Overriding the standard analyzer requires an index rebuild. If possible, decide on which analyzers to use during active development, before rolling an index into production.

### Inspect tokenized terms

If a search fails to return expected results, the most likely scenario is token discrepancies between term inputs on the query, and tokenized terms in the index. If the tokens aren't the same, matches fail to materialize. To inspect tokenizer output, we recommend using the [Analyze API](https://docs.microsoft.com/rest/api/searchservice/test-analyzer) as an investigation tool. The response consists of tokens, as generated by a specific analyzer.

<a name="examples"></a>

## REST examples

The examples below show analyzer definitions for a few key scenarios.

+ [Custom analyzer example](#Custom-analyzer-example)
+ [Assign analyzers to a field example](#Per-field-analyzer-assignment-example)
+ [Mixing analyzers for indexing and search](#Mixing-analyzers-for-indexing-and-search-operations)
+ [Language analyzer example](#Language-analyzer-example)

<a name="Custom-analyzer-example"></a>

### Custom analyzer example

This example illustrates an analyzer definition with custom options. Custom options for char filters, tokenizers, and token filters are specified separately as named constructs, and then referenced in the analyzer definition. Predefined elements are used as-is and simply referenced by name.

Walking through this example:

* Analyzers are a property of the field class for a searchable field.
* A custom analyzer is part of an index definition. It might be lightly customized (for example, customizing a single option in one filter) or customized in multiple places.
* In this case, the custom analyzer is "my_analyzer", which in turn uses a customized standard tokenizer "my_standard_tokenizer" and two token filters: lowercase and customized asciifolding filter "my_asciifolding".
* It also defines 2 custom char filters "map_dash" and "remove_whitespace". The first one replaces all dashes with underscores while the second one removes all spaces. Spaces need to be UTF-8 encoded in the mapping rules. The char filters are applied before tokenization and will affect the resulting tokens (the standard tokenizer breaks on dash and spaces but not on underscore).

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
              "map_dash",
              "remove_whitespace"
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
        },
        {
           "name":"remove_whitespace",
           "@odata.type":"#Microsoft.Azure.Search.MappingCharFilter",
           "mappings":["\\u0020=>"]
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

<a name="Per-field-analyzer-assignment-example"></a>

### Per-field analyzer assignment example

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

<a name="Mixing-analyzers-for-indexing-and-search-operations"></a>

### Mixing analyzers for indexing and search operations

The APIs include additional index attributes for specifying different analyzers for indexing and search. The **searchAnalyzer** and **indexAnalyzer** attributes must be specified as a pair, replacing the single **analyzer** attribute.


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

<a name="Language-analyzer-example"></a>

### Language analyzer example

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

## C# examples

If you are using the .NET SDK code samples, you can append these examples to use or configure analyzers.

+ [Assign a built-in analyzer](#Assign-a-language-analyzer)
+ [Configure an analyzer](#Define-a-custom-analyzer)

<a name="Assign-a-language-analyzer"></a>

### Assign a language analyzer

Any analyzer that is used as-is, with no configuration, is specified on a field definition. There is no requirement for creating an analyzer construct. 

This example assigns Microsoft English and French analyzers to description fields. It's a snippet taken from a larger definition of the hotels index, creating using the Hotel class in the hotels.cs file of the [DotNetHowTo](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowTo) sample.

Call [Analyzer](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.analyzer?view=azure-dotnet), specifying the [AnalyzerName](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.analyzername?view=azure-dotnet) type providing a text analyzer supported in Azure Cognitive Search.

```csharp
    public partial class Hotel
    {
       . . . 

        [IsSearchable]
        [Analyzer(AnalyzerName.AsString.EnMicrosoft)]
        [JsonProperty("description")]
        public string Description { get; set; }

        [IsSearchable]
        [Analyzer(AnalyzerName.AsString.FrLucene)]
        [JsonProperty("description_fr")]
        public string DescriptionFr { get; set; }

      . . .
    }
```
<a name="Define-a-custom-analyzer"></a>

### Define a custom analyzer

When customization or configuration is required, you will need to add an analyzer construct to an index. Once you define it, you can add it the field definition as demonstrated in the previous example.

Create a [CustomAnalyzer](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.customanalyzer?view=azure-dotnet) object. For more examples, see [CustomAnalyzerTests.cs](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Microsoft.Azure.Search/tests/Tests/CustomAnalyzerTests.cs).

```csharp
{
   var definition = new Index()
   {
         Name = "hotels",
         Fields = FieldBuilder.BuildForType<Hotel>(),
         Analyzers = new[]
            {
               new CustomAnalyzer()
               {
                     Name = "url-analyze",
                     Tokenizer = TokenizerName.UaxUrlEmail,
                     TokenFilters = new[] { TokenFilterName.Lowercase }
               }
            },
   };

   serviceClient.Indexes.Create(definition);
```

## Next steps

+ Review our comprehensive explanation of [how full text search works in Azure Cognitive Search](search-lucene-query-architecture.md). This article uses examples to explain behaviors that might seem counter-intuitive on the surface.

+ Try additional query syntax from the [Search Documents](https://docs.microsoft.com/rest/api/searchservice/search-documents#bkmk_examples) example section or from [Simple query syntax](query-simple-syntax.md) in Search explorer in the portal.

+ Learn how to apply [language-specific lexical analyzers](index-add-language-analyzers.md).

+ [Configure custom analyzers](index-add-custom-analyzers.md) for either minimal processing or specialized processing on individual fields.

## See also

 [Search Documents REST API](https://docs.microsoft.com/rest/api/searchservice/search-documents) 

 [Simple query syntax](query-simple-syntax.md) 

 [Full Lucene query syntax](query-lucene-syntax.md) 
 
 [Handle search results](search-pagination-page-layout.md)

<!--Image references-->
[1]: ./media/search-lucene-query-architecture/architecture-diagram2.png
