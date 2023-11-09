---
title: Add language analyzers to string fields
titleSuffix: Azure AI Search
description: Configure multi-lingual lexical analysis for non-English queries and indexes in Azure AI Search.
author: HeidiSteen
manager: nitinme
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 07/19/2023
---

# Add language analyzers to string fields in an Azure AI Search index

A *language analyzer* is a specific type of [text analyzer](search-analyzers.md) that performs lexical analysis using the linguistic rules of the target language. Every searchable string field has an **analyzer** property. If your content consists of translated strings, such as separate fields for English and Chinese text, you could specify language analyzers on each field to access the rich linguistic capabilities of those analyzers.

## When to use a language analyzer

You should consider a language analyzer when awareness of word or sentence structure adds value to text parsing. A common example is the association of irregular verb forms ("bring" and "brought) or plural nouns ("mice" and "mouse"). Without linguistic awareness, these strings are parsed on physical characteristics alone, which fails to catch the connection. Since large chunks of text are more likely to have this content, fields consisting of descriptions, reviews, or summaries are good candidates for a language analyzer.

You should also consider language analyzers when content consists of non-Western language strings. While the [default analyzer (Standard Lucene)](search-analyzers.md#default-analyzer) is language-agnostic, the concept of using spaces and special characters (hyphens and slashes) to separate strings is more applicable to Western languages than non-Western ones. 

For example, in Chinese, Japanese, Korean (CJK), and other Asian languages, a space isn't necessarily a word delimiter. Consider the following Japanese string. Because it has no spaces, a language-agnostic analyzer would likely analyze the entire string as one token, when in fact the string is actually a phrase.

```
これは私たちの銀河系の中ではもっとも重く明るいクラスの球状星団です。
(This is the heaviest and brightest group of spherical stars in our galaxy.)
```

For the example above, a successful query would have to include the full token, or a partial token using a suffix wildcard, resulting in an unnatural and limiting search experience.

A better experience is to search for individual words: 明るい (Bright), 私たちの (Our), 銀河系 (Galaxy). Using one of the Japanese analyzers available in Azure AI Search is more likely to unlock this behavior because those analyzers are better equipped at splitting the chunk of text into meaningful words in the target language.

## Comparing Lucene and Microsoft Analyzers

Azure AI Search supports 35 language analyzers backed by Lucene, and 50 language analyzers backed by proprietary Microsoft natural language processing technology used in Office and Bing.

Some developers might prefer the more familiar, simple, open-source solution of Lucene. Lucene language analyzers are faster, but the Microsoft analyzers have advanced capabilities, such as lemmatization, word decompounding (in languages like German, Danish, Dutch, Swedish, Norwegian, Estonian, Finnish, Hungarian, Slovak) and entity recognition (URLs, emails, dates, numbers). If possible, you should run comparisons of both the Microsoft and Lucene analyzers to decide which one is a better fit. You can use [Analyze API](/rest/api/searchservice/test-analyzer) to see the tokens generated from a given text using a specific analyzer.

Indexing with Microsoft analyzers is on average two to three times slower than their Lucene equivalents, depending on the language. Search performance shouldn't be significantly affected for average size queries. 

### English analyzers

The default analyzer is Standard Lucene, which works well for English, but perhaps not as well as Lucene's English analyzer or Microsoft's English analyzer.

+ Lucene's English analyzer extends the Standard analyzer. It removes possessives (trailing 's) from words, applies stemming as per Porter Stemming algorithm, and removes English stop words.  

+ Microsoft's English analyzer performs lemmatization instead of stemming. This means it can handle inflected and irregular word forms much better which results in more relevant search results.

## How to specify a language analyzer

Set the analyzer during index creation before it's loaded with data.

1. In the field definition, make sure the field is attributed as "searchable" and is of type Edm.String.

1. Set the "analyzer" property to one of the language analyzers from the [supported analyzers list](#language-analyzer-list).

   The "analyzer" property is the only property that will accept a language analyzer, and it's used for both indexing and queries. Other analyzer-related properties ("searchAnalyzer" and "indexAnalyzer") won't accept a language analyzer.

Language analyzers can't be customized. If an analyzer isn't meeting your requirements, create a [custom analyzer](cognitive-search-working-with-skillsets.md) with the microsoft_language_tokenizer or microsoft_language_stemming_tokenizer, and then add filters for pre- and post-tokenization processing.

The following example illustrates a language analyzer specification in an index:

```json
{
  "name": "hotels-sample-index",
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
    {
      "name": "Description_fr",
      "type": "Edm.String",
      "retrievable": true,
      "searchable": true,
      "analyzer": "fr.microsoft",
      "indexAnalyzer": null,
      "searchAnalyzer": null
    },
```

For more information about creating an index and setting field properties, see [Create Index (REST)](/rest/api/searchservice/create-index). For more information about text analysis, see [Analyzers in Azure AI Search](search-analyzers.md).

<a name="language-analyzer-list"></a>

## Supported language analyzers

 Below is the list of supported languages, with Lucene and Microsoft analyzer names.  

| Language | Microsoft Analyzer Name | Lucene Analyzer Name |
|----------|-------------------------|----------------------|
| Arabic   | ar.microsoft | ar.lucene |
| Armenian |           | hy.lucene |
| Bangla   | bn.microsoft |  |
| Basque   |  | eu.lucene |
| Bulgarian | bg.microsoft | bg.lucene |
| Catalan  | ca.microsoft | ca.lucene |
| Chinese Simplified | zh-Hans.microsoft | zh-Hans.lucene |
| Chinese Traditional | zh-Hant.microsoft | zh-Hant.lucene |
| Croatian | hr.microsoft |  |
| Czech | cs.microsoft | cs.lucene |
| Danish | da.microsoft | da.lucene |
| Dutch | nl.microsoft | nl.lucene |
| English | en.microsoft | en.lucene |
| Estonian | et.microsoft |  |
| Finnish | fi.microsoft | fi.lucene |
| French | fr.microsoft | fr.lucene |
| Galician |  | gl.lucene |
| German | de.microsoft | de.lucene |
| Greek | el.microsoft | el.lucene |
| Gujarati | gu.microsoft |  |
| Hebrew | he.microsoft |  |
| Hindi | hi.microsoft | hi.lucene |
| Hungarian | hu.microsoft | hu.lucene |
| Icelandic | is.microsoft |  |
| Indonesian (Bahasa) | id.microsoft | id.lucene |
| Irish |  | ga.lucene |
| Italian | it.microsoft | it.lucene |
| Japanese | ja.microsoft | ja.lucene |
| Kannada | kn.microsoft |  |
| Korean | ko.microsoft | ko.lucene |
| Latvian | lv.microsoft | lv.lucene |
| Lithuanian | lt.microsoft |  |
| Malayalam | ml.microsoft |  |
| Malay (Latin) | ms.microsoft |  |
| Marathi | mr.microsoft |  |
| Norwegian | nb.microsoft | no.lucene |
| Persian |  | fa.lucene |
| Polish | pl.microsoft | pl.lucene |
| Portuguese (Brazil) | pt-Br.microsoft | pt-Br.lucene |
| Portuguese (Portugal) | pt-Pt.microsoft | pt-Pt.lucene |
| Punjabi | pa.microsoft |  |
| Romanian | ro.microsoft | ro.lucene |
| Russian | ru.microsoft | ru.lucene |
| Serbian (Cyrillic) | sr-cyrillic.microsoft |  |
| Serbian (Latin) | sr-latin.microsoft |  |
| Slovak | sk.microsoft |  |
| Slovenian | sl.microsoft |  |
| Spanish | es.microsoft | es.lucene |
| Swedish | sv.microsoft | sv.lucene |
| Tamil | ta.microsoft |  |
| Telugu | te.microsoft |  |
| Thai | th.microsoft | th.lucene |
| Turkish | tr.microsoft | tr.lucene |
| Ukrainian | uk.microsoft |  |
| Urdu | ur.microsoft |  |
| Vietnamese | vi.microsoft |  |

 All analyzers with names annotated with **Lucene** are powered by [Apache Lucene's language analyzers](https://lucene.apache.org/core/6_6_1/core/overview-summary.html).

## See also  

+ [Create an index](search-what-is-an-index.md)
+ [Create a multi-language index](search-language-support.md)
+ [Create Index (REST API)](/rest/api/searchservice/create-index)  
+ [LexicalAnalyzerName Class (Azure SDK for .NET)](/dotnet/api/azure.search.documents.indexes.models.lexicalanalyzername)
