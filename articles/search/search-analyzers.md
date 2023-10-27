---
title: Analyzers for linguistic and text processing
titleSuffix: Azure AI Search
description: Assign analyzers to searchable text fields in an index to replace default standard Lucene with custom, predefined or language-specific alternatives.
author: HeidiSteen
manager: nitinme
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 07/19/2023
ms.custom: devx-track-csharp
---

# Analyzers for text processing in Azure AI Search

An *analyzer* is a component of the [full text search engine](search-lucene-query-architecture.md) that's responsible for processing strings during indexing and query execution. Text processing (also known as lexical analysis) is transformative, modifying a string through actions such as these:

+ Remove non-essential words ([stopwords](reference-stopwords.md)) and punctuation
+ Split up phrases and hyphenated words into component parts
+ Lower-case any upper-case words
+ Reduce words into primitive root forms for storage efficiency and so that matches can be found regardless of tense

Analysis applies to `Edm.String` fields that are marked as "searchable", which indicates full text search. 

For fields of this configuration, analysis occurs during indexing when tokens are created, and then again during query execution when queries are parsed and the engine scans for matching tokens. A match is more likely to occur when the same analyzer is used for both indexing and queries, but you can set the analyzer for each workload independently, depending on your requirements.

Query types that are *not* full text search, such as filters or fuzzy search, don't go through the analysis phase on the query side. Instead, the parser sends those strings directly to the search engine, using the pattern that you provide as the basis for the match. Typically, these query forms require whole-string tokens to make pattern matching work. To ensure whole term tokens are preserved during indexing, you might need [custom analyzers](index-add-custom-analyzers.md). For more information about when and why query terms are analyzed, see [Full text search in Azure AI Search](search-lucene-query-architecture.md).

For more background on lexical analysis, listen to the following video clip for a brief explanation.

> [!VIDEO https://www.youtube.com/embed/Y_X6USgvB1g?version=3&start=132&end=189]

## Default analyzer  

In Azure AI Search, an analyzer is automatically invoked on all string fields marked as searchable. 

By default, Azure AI Search uses the [Apache Lucene Standard analyzer (standard lucene)](https://lucene.apache.org/core/6_6_1/core/org/apache/lucene/analysis/standard/StandardAnalyzer.html), which breaks text into elements following the ["Unicode Text Segmentation"](https://unicode.org/reports/tr29/) rules. The standard analyzer converts all characters to their lower case form. Both indexed documents and search terms go through the analysis during indexing and query processing.  

You can override the default on a field-by-field basis. Alternative analyzers can be a [language analyzer](index-add-language-analyzers.md) for linguistic processing, a [custom analyzer](index-add-custom-analyzers.md), or a built-in analyzer from the [list of available analyzers](index-add-custom-analyzers.md#built-in-analyzers).

## Types of analyzers

The following list describes which analyzers are available in Azure AI Search.

| Category | Description |
|----------|-------------|
| [Standard Lucene analyzer](https://lucene.apache.org/core/6_6_1/core/org/apache/lucene/analysis/standard/StandardAnalyzer.html) | Default. No specification or configuration is required. This general-purpose analyzer performs well for many languages and scenarios.|
| Built-in analyzers | Consumed as-is and referenced by name. There are two types: language and language-agnostic. </br></br>[Specialized (language-agnostic) analyzers](index-add-custom-analyzers.md#built-in-analyzers) are used when text inputs require specialized processing or minimal processing. Examples of analyzers in this category include **Asciifolding**, **Keyword**, **Pattern**, **Simple**, **Stop**, **Whitespace**. </br></br>[Language analyzers](index-add-language-analyzers.md) are used when you need rich linguistic support for individual languages. Azure AI Search supports 35 Lucene language analyzers and 50 Microsoft natural language processing analyzers. |
|[Custom analyzers](/rest/api/searchservice/Custom-analyzers-in-Azure-Search) | Refers to a user-defined configuration of a combination of existing elements, consisting of one tokenizer (required) and optional filters (char or token).|

A few built-in analyzers, such as **Pattern** or **Stop**, support a limited set of configuration options. To set these options, create a custom analyzer, consisting of the built-in analyzer and one of the alternative options documented in [Built-in analyzers](index-add-custom-analyzers.md#built-in-analyzers). As with any custom configuration, provide your new configuration with a name, such as *myPatternAnalyzer* to distinguish it from the Lucene Pattern analyzer.

## Specifying analyzers

Setting an analyzer is optional. As a general rule, try using the default standard Lucene analyzer first to see how it performs. If queries fail to return the expected results, switching to a different analyzer is often the right solution.

1. If you're using a custom analyzer, add it to the search index under the "analyzer" section. For more information, see [Create Index](/rest/api/searchservice/create-index) and also [Add custom analyzers](index-add-custom-analyzers.md).

1. When defining a field, set it's "analyzer" property to one of the following: a [built-in analyzer](index-add-custom-analyzers.md#built-in-analyzers) such as **keyword**, a [language analyzer](index-add-language-analyzers.md) such as `en.microsoft`, or a custom analyzer (defined in the same index schema).  
 
   ```json
     "fields": [
    {
      "name": "Description",
      "type": "Edm.String",
      "retrievable": true,
      "searchable": true,
      "analyzer": "en.microsoft",
      "indexAnalyzer": null,
      "searchAnalyzer": null
    },
   ```

1. If you're using a [language analyzer](index-add-language-analyzers.md), you must use the "analyzer" property to specify it. The "searchAnalyzer" and "indexAnalyzer" properties don't apply to language analyzers.

1. Alternatively, set "indexAnalyzer" and "searchAnalyzer" to vary the analyzer for each workload. These properties work together as a substitute for the "analyzer" property, which must be null. You might use different analyzers for indexing and queries if one of those activities required a specific transformation not needed by the other.

   ```json
     "fields": [
    {
      "name": "ProductGroup",
      "type": "Edm.String",
      "retrievable": true,
      "searchable": true,
      "analyzer": null,
      "indexAnalyzer": "keyword",
      "searchAnalyzer": "standard"
    },
   ```

## When to add analyzers

The best time to add and assign analyzers is during active development, when dropping and recreating indexes is routine.

Because analyzers are used to tokenize terms, you should assign an analyzer when the field is created. In fact, assigning an analyzer or indexAnalyzer to a field that has already been physically created isn't allowed (although you can change the searchAnalyzer property at any time with no impact to the index).

To change the analyzer of an existing field, you'll have to drop and recreate the entire index (you can't rebuild individual fields). For indexes in production, you can defer a rebuild by creating a new field with the new analyzer assignment, and start using it in place of the old one. Use [Update Index](/rest/api/searchservice/update-index) to incorporate the new field and [mergeOrUpload](/rest/api/searchservice/addupdate-or-delete-documents) to populate it. Later, as part of planned index servicing, you can clean up the index to remove obsolete fields.

To add a new field to an existing index, call [Update Index](/rest/api/searchservice/update-index) to add the field, and [mergeOrUpload](/rest/api/searchservice/addupdate-or-delete-documents) to populate it.

To add a custom analyzer to an existing index, pass the "allowIndexDowntime" flag in [Update Index](/rest/api/searchservice/update-index) if you want to avoid this error:

`"Index update not allowed because it would cause downtime. In order to add new analyzers, tokenizers, token filters, or character filters to an existing index, set the 'allowIndexDowntime' query parameter to 'true' in the index update request. Note that this operation will put your index offline for at least a few seconds, causing your indexing and query requests to fail. Performance and write availability of the index can be impaired for several minutes after the index is updated, or longer for very large indexes."`

## Recommendations for working with analyzers

This section offers advice on how to work with analyzers.

### One analyzer for read-write unless you have specific requirements

Azure AI Search lets you specify different analyzers for indexing and search through the "indexAnalyzer" and "searchAnalyzer" field properties. If unspecified, the analyzer set with the analyzer property is used for both indexing and searching. If the analyzer is unspecified, the default Standard Lucene analyzer is used.

A general rule is to use the same analyzer for both indexing and querying, unless specific requirements dictate otherwise. Be sure to test thoroughly. When text processing differs at search and indexing time, you run the risk of mismatch between query terms and indexed terms when the search and indexing analyzer configurations aren't aligned.

### Test during active development

Overriding the standard analyzer requires an index rebuild. If possible, decide on which analyzers to use during active development, before rolling an index into production.

### Inspect tokenized terms

If a search fails to return expected results, the most likely scenario is token discrepancies between term inputs on the query, and tokenized terms in the index. If the tokens aren't the same, matches fail to materialize. To inspect tokenizer output, we recommend using the [Analyze API](/rest/api/searchservice/test-analyzer) as an investigation tool. The response consists of tokens, as generated by a specific analyzer.

<a name="examples"></a>

## REST examples

The examples below show analyzer definitions for a few key scenarios.

+ [Custom analyzer example](#Custom-analyzer-example)
+ [Assign analyzers to a field example](#Per-field-analyzer-assignment-example)
+ [Mixing analyzers for indexing and search](#Mixing-analyzers-for-indexing-and-search-operations)
+ [Language analyzer example](#Language-analyzer-example)

<a name="Custom-analyzer-example"></a>

### Custom analyzer example

This example illustrates an analyzer definition with custom options. Custom options for char filters, tokenizers, and token filters are specified separately as named constructs, and then referenced in the analyzer definition. Predefined elements are used as-is and referenced by name.

Walking through this example:

+ Analyzers are a property of the field class for a searchable field.

+ A custom analyzer is part of an index definition. It might be lightly customized (for example, customizing a single option in one filter) or customized in multiple places.

+ In this case, the custom analyzer is "my_analyzer", which in turn uses a customized standard tokenizer "my_standard_tokenizer" and two token filters: lowercase and customized asciifolding filter "my_asciifolding".

+ It also defines 2 custom char filters "map_dash" and "remove_whitespace". The first one replaces all dashes with underscores while the second one removes all spaces. Spaces need to be UTF-8 encoded in the mapping rules. The char filters are applied before tokenization and will affect the resulting tokens (the standard tokenizer breaks on dash and spaces but not on underscore).

```json
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
```

<a name="Per-field-analyzer-assignment-example"></a>

### Per-field analyzer assignment example

The Standard analyzer is the default. Suppose you want to replace the default with a different predefined analyzer, such as the pattern analyzer. If you aren't setting custom options, you only need to specify it by name in the field definition.

The "analyzer" element overrides the Standard analyzer on a field-by-field basis. There is no global override. In this example, `text1` uses the pattern analyzer and `text2`, which doesn't specify an analyzer, uses the default.

```json
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
```

<a name="Mixing-analyzers-for-indexing-and-search-operations"></a>

### Mixing analyzers for indexing and search operations

The APIs include index attributes for specifying different analyzers for indexing and search. The searchAnalyzer and indexAnalyzer attributes must be specified as a pair, replacing the single analyzer attribute.


```json
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
```

<a name="Language-analyzer-example"></a>

### Language analyzer example

Fields containing strings in different languages can use a language analyzer, while other fields retain the default (or use some other predefined or custom analyzer). If you use a language analyzer, it must be used for both indexing and search operations. Fields that use a language analyzer can't have different analyzers for indexing and search.

```json
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
```

## C# examples

If you are using the .NET SDK code samples, you can append these examples to use or configure analyzers.

+ [Assign a built-in analyzer](#Assign-a-language-analyzer)
+ [Configure an analyzer](#Define-a-custom-analyzer)

<a name="Assign-a-language-analyzer"></a>

### Assign a language analyzer

Any analyzer that is used as-is, with no configuration, is specified on a field definition. There is no requirement for creating an entry in the **[analyzers]** section of the index. 

Language analyzers are used as-is. To use them, call [LexicalAnalyzer](/dotnet/api/azure.search.documents.indexes.models.lexicalanalyzer), specifying the [LexicalAnalyzerName](/dotnet/api/azure.search.documents.indexes.models.lexicalanalyzername) type providing a text analyzer supported in Azure AI Search.

Custom analyzers are similarly specified on the field definition, but for this to work you must specify the analyzer in the index definition, as described in the next section.

```csharp
    public partial class Hotel
    {
       . . . 
        [SearchableField(AnalyzerName = LexicalAnalyzerName.Values.EnLucene)]
        public string Description { get; set; }

        [SearchableField(AnalyzerName = LexicalAnalyzerName.Values.FrLucene)]
        [JsonPropertyName("Description_fr")]
        public string DescriptionFr { get; set; }

        [SearchableField(AnalyzerName = "url-analyze")]
        public string Url { get; set; }
      . . .
    }
```

<a name="Define-a-custom-analyzer"></a>

### Define a custom analyzer

When customization or configuration is required, add an analyzer construct to an index. Once you define it, you can add it the field definition as demonstrated in the previous example.

Create a [CustomAnalyzer](/dotnet/api/azure.search.documents.indexes.models.customanalyzer) object. A custom analyzer is a user-defined combination of a known tokenizer, zero or more token filter, and zero or more character filter names:

+ [CustomAnalyzer.Tokenizer](/dotnet/api/microsoft.azure.search.models.customanalyzer.tokenizer)
+ [CustomAnalyzer.TokenFilters](/dotnet/api/microsoft.azure.search.models.customanalyzer.tokenfilters)
+ [CustomAnalyzer.CharFilters](/dotnet/api/microsoft.azure.search.models.customanalyzer.charfilters)

The following example creates a custom analyzer named "url-analyze" that uses the [uax_url_email tokenizer](/dotnet/api/microsoft.azure.search.models.customanalyzer.tokenizer) and the [Lowercase token filter](/dotnet/api/microsoft.azure.search.models.tokenfiltername.lowercase).

```csharp
private static void CreateIndex(string indexName, SearchIndexClient adminClient)
{
   FieldBuilder fieldBuilder = new FieldBuilder();
   var searchFields = fieldBuilder.Build(typeof(Hotel));

   var analyzer = new CustomAnalyzer("url-analyze", "uax_url_email")
   {
         TokenFilters = { TokenFilterName.Lowercase }
   };

   var definition = new SearchIndex(indexName, searchFields);

   definition.Analyzers.Add(analyzer);

   adminClient.CreateOrUpdateIndex(definition);
}
```

## Next steps

A detailed description of query execution can be found in [Full text search in Azure AI Search](search-lucene-query-architecture.md). The article uses examples to explain behaviors that might seem counter-intuitive on the surface.

To learn more about analyzers, see the following articles:

+ [Add a language analyzer](index-add-language-analyzers.md)
+ [Add a custom analyzer](index-add-custom-analyzers.md)
+ [Create a search index](search-what-is-an-index.md)
+ [Create a multi-language index](search-language-support.md)
