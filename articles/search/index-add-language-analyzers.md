---
title: Add language analyzers - Azure Search
description: Multi-lingual lexical text analysis for non-English queries and indexes in Azure Search.
ms.date: 02/14/2019
services: search
ms.service: search
ms.topic: conceptual
author: "Yahnoosh"
ms.author: "jlembicz"
ms.manager: cgronlun
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
# Add language analyzers to an Azure Search index

A *language analyzer* is a specific type of [text analyzer](search-analyzers.md) that performs lexical analysis using the linguistic rules of the target language. Every searchable field has an **analyzer** property. If your index contains translated strings, such as separate fields for English and Chinese text, you could specify language analyzers on each field to access the rich linguistic capabilities of those analyzers.  

Azure Search supports 35 analyzers backed by Lucene, and 50 analyzers backed by proprietary Microsoft natural language processing technology used in Office and Bing.

## Comparing analyzers

Some developers might prefer the more familiar, simple, open-source solution of Lucene. Lucene language analyzers are faster, but the Microsoft analyzers have advanced capabilities, such as lemmatization, word decompounding (in languages like German, Danish, Dutch, Swedish, Norwegian, Estonian, Finish, Hungarian, Slovak) and entity recognition (URLs, emails, dates, numbers). If possible, you should run comparisons of both the Microsoft and Lucene analyzers to decide which one is a better fit. 

Indexing with Microsoft analyzers is on average two to three times slower than their Lucene equivalents, depending on the language. Search performance should not be significantly affected for average size queries. 

### English analyzers

The default analyzer is Standard Lucene, which works well for English, but perhaps not as well as Lucene's English analyzer or Microsoft's English analyzer. 
 
+ Lucene's English analyzer extends the standard analyzer. It removes possessives (trailing 's) from words, applies stemming as per Porter Stemming algorithm, and removes English stop words.  

+ Microsoft's English analyzer performs lemmatization instead of stemming. This means it can handle inflected and irregular word forms much better what results in more relevant search results 

## Configuring analyzers

Language analyzers are used as-is. For each field in the index definition, you can set the **analyzer** property to an analyzer name that specifies the language and linguistics stack (Microsoft or Lucene). The same analyzer will be applied when indexing and searching for that field. For example, you can have separate fields for English, French, and Spanish hotel descriptions that exist side by side in the same index. Alternatively, instead of **analyzer**, you can use **indexAnalyzer** and **searchAnalyzer** to have different analysis rules at indexing time and query time. 

Use the **searchFields** query parameter to specify which language-specific field to search against in your queries. You can review query examples that include the analyzer property in [Search Documents](https://docs.microsoft.com/rest/api/searchservice/search-documents). 

For more information about index properties, see [Create Index &#40;Azure Search Service REST API&#41;](https://docs.microsoft.com/rest/api/searchservice/create-index). For more information about analysis in Azure Search, see [Analyzers in Azure Search](https://docs.microsoft.com/azure/search/search-analyzers).

<a name="language-analyzer-list"></a>

## Language analyzer list 
 Below is the list of supported languages together with Lucene and Microsoft analyzer names.  

|Language|Microsoft Analyzer Name|Lucene Analyzer Name|  
|--------------|-----------------------------|--------------------------|  
|Arabic|ar.microsoft|ar.lucene|  
|Armenian||hy.lucene|  
|Bangla|bn.microsoft||  
|Basque||eu.lucene|  
|Bulgarian|bg.microsoft|bg.lucene|  
|Catalan|ca.microsoft|ca.lucene|  
|Chinese Simplified|zh-Hans.microsoft|zh-Hans.lucene|  
|Chinese Traditional|zh-Hant.microsoft|zh-Hant.lucene|  
|Croatian|hr.microsoft||  
|Czech|cs.microsoft|cs.lucene|  
|Danish|da.microsoft|da.lucene|  
|Dutch|nl.microsoft|nl.lucene|  
|English|en.microsoft|en.lucene|  
|Estonian|et.microsoft||  
|Finnish|fi.microsoft|fi.lucene|  
|French|fr.microsoft|fr.lucene|  
|Galician||gl.lucene|  
|German|de.microsoft|de.lucene|  
|Greek|el.microsoft|el.lucene|  
|Gujarati|gu.microsoft||  
|Hebrew|he.microsoft||  
|Hindi|hi.microsoft|hi.lucene|  
|Hungarian|hu.microsoft|hu.lucene|  
|Icelandic|is.microsoft||  
|Indonesian (Bahasa)|id.microsoft|id.lucene|  
|Irish||ga.lucene|  
|Italian|it.microsoft|it.lucene|  
|Japanese|ja.microsoft|ja.lucene|  
|Kannada|kn.microsoft||  
|Korean|ko.microsoft|ko.lucene|  
|Latvian|lv.microsoft|lv.lucene|  
|Lithuanian|lt.microsoft||  
|Malayalam|ml.microsoft||  
|Malay (Latin)|ms.microsoft||  
|Marathi|mr.microsoft||  
|Norwegian|nb.microsoft|no.lucene|  
|Persian||fa.lucene|  
|Polish|pl.microsoft|pl.lucene|  
|Portuguese (Brazil)|pt-Br.microsoft|pt-Br.lucene|  
|Portuguese (Portugal)|pt-Pt.microsoft|pt-Pt.lucene|  
|Punjabi|pa.microsoft||  
|Romanian|ro.microsoft|ro.lucene|  
|Russian|ru.microsoft|ru.lucene|  
|Serbian (Cyrillic)|sr-cyrillic.microsoft||  
|Serbian (Latin)|sr-latin.microsoft||  
|Slovak|sk.microsoft||  
|Slovenian|sl.microsoft||  
|Spanish|es.microsoft|es.lucene|  
|Swedish|sv.microsoft|sv.lucene|  
|Tamil|ta.microsoft||  
|Telugu|te.microsoft||  
|Thai|th.microsoft|th.lucene|  
|Turkish|tr.microsoft|tr.lucene|  
|Ukrainian|uk.microsoft||  
|Urdu|ur.microsoft||  
|Vietnamese|vi.microsoft||  

 All analyzers with names annotated with **Lucene** are powered by [Apache Lucene's language analyzers](https://lucene.apache.org/core/4_9_0/core/overview-summary.html ).

## See also  
 [Create Index &#40;Azure Search Service REST API&#41;](https://docs.microsoft.com/rest/api/searchservice/create-index)  
 [AnalyzerName Class](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.analyzername)  
 [Video: module 7 of Azure Search MVA presentation](https://channel9.msdn.com/Series/Adding-Microsoft-Azure-Search-to-Your-Websites-and-Apps/07).  

