<properties
   pageTitle="Language support in Azure Search  | Microsoft Azure"
   description=" Azure Search supports 56 languages, leveraging language analyzers from Lucene and Natural Language Processing technology from Microsoft."
   services="search"
   documentationCenter=""
   authors="yahnoosh"
   manager="pablocas"
   editor=""/>

<tags
   ms.service="search"
   ms.devlang="na"
   ms.workload="search"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.date="10/19/2015"
   ms.author="jlembicz"/>

# Language support in Azure Search

> [AZURE.SELECTOR]
- [Portal](search-language-analyzer.md)
- [REST](https://msdn.microsoft.com/library/azure/dn879793.aspx)
- [.NET](https://msdn.microsoft.com/library/azure/microsoft.azure.search.models.analyzername.aspx)

Learn the best practices of working with content in different languages in Azure Search to support all your Web and mobile search applications that have a global reach.

## Processing natural language
The role of a full-text search engine, in simple terms, is to process and store documents in a way that enables efficient querying and retrieval. At a high level, it all comes down to extracting important words from documents, putting them in an index, and then using the index to find documents that match words of a given query. The process of extracting words from documents and search queries is called lexical analysis. Components that perform lexical analysis are called analyzers.

A good analyzer must be able to cope with the challenges of processing natural language, for example:

  * Handling inflected word forms. For example, users often expect searches for “running” to match words like "run" and "ran".
  * Word breaking, especially in languages like Chinese, Japanese, and Thai, where words are not separated by spaces.
  * Dealing with compound words (multiple words merged together to create a different word).
  * Text normalization.
  * Removing irrelevant words and characters.

In the [Leveraging Multilanguage Capabilities in Azure Search](https://azure.microsoft.com/documentation/videos/07/) Microsoft Virtual Academy presentation, I explain how different approaches to these challenges may affect the important [recall/precision balance](https://en.wikipedia.org/wiki/Precision_and_recall). In some situations, the solution chosen will determine whether an important document is found.

In Azure Search we provide two sets of different language analyzer types described below. Our users have an opportunity to pick what works best for their specific scenario.

## Language analyzers in Azure Search

The concept of language analyzers is familiar to users of the popular open-source full-text search engine [Lucene](http://lucene.apache.org/core/) which works at the core of Azure Search. We exposed [Lucene language analyzers](https://azure.microsoft.com/blog/azure-search-updates-multilanguage-azure-portal-index-management-more/) as the first iteration of our vision to provide multi-language support. Since then, we have worked with the Office team that has been developing Natural Language Processing technology for the past 16 years for products like Word, Windows Desktop Search, SharePoint, and Bing. We were excited to combine the power of open-source with Microsoft’s internal assets to deliver what we call Microsoft language analyzers.

By introducing Microsoft analyzers, we increased the number of [languages supported in Azure Search](https://msdn.microsoft.com/library/azure/dn879793.aspx) from 35 to 56! On top of that, we were able to tap into years of research and development in natural language processing at Microsoft. Here are some of the features that set Microsoft analyzers apart from similar solutions on the market:

  * [Lemmatization](https://en.wikipedia.org/wiki/Lemmatisation) to handle inflected word forms. Microsoft analyzers can reason about the grammar rules of a language. They handle inflection based on voice, mood, tense, person, number, gender, etc.
  * Use of statistical language models for accurate word breaking in languages that don’t separate words with spaces and punctuation like Chinese and Japanese.
  * Decompounding (in German, Danish, Dutch, Swedish, Norwegian, Estonian, Finish, Hungarian, Slovak) so that users can search for segments of compound words.
  * Normalization of different date and currency formats; Handling of URLs and email addresses.

Indexing documents with Microsoft analyzers is 2 to 3 times slower (depending on the language) than their Lucene counterpart. There is simply more processing that needs to be done to get the benefits outlined in this post. We recommend that Azure Search customers with heavy indexing loads compare the two analyzer types, and pick the one that performs best in their scenario. Search requests are typically equally fast regardless of the analyzer type used.

## Using language analyzers

Unleashing the power of language analyzers is as easy as setting one property on a searchable field in the index definition.

Below are screenshots of the Azure portal blades for Azure Search that allow users to define an index schema. From this blade, users can create all of the fields and set the analyzer property for each of them.

> [AZURE.NOTE] You can only set a language analyzer during field definition, when creating a new index from the ground up, or when adding a new field to an existing index. Make sure you fully specify all attributes, including the analyzer, while creating the field. You won't be able to edit the attributes or change the analyzer type once the field is defined.

1. Sign in to the [Azure portal](https://portal.azure.com) and open the service blade of your search service

2. Click **Add an Index** to start a new index or open existing index to set an analyzer on new fields you're adding to an existing index.
3. The Fields blade gives you options for defining the schema of the index, including the Analyzer tab used for choosing a language analyzer.
4. Enter a field name, choose the data type and set any attributes. 
5. Before moving on to the next field, open the **Analyzer** tab. 
6. Scroll to find the field you are defining. 
7. Click the checkbox to mark the field as Searchable.
8. Click the Analyzer area to display the list of available analyzers.
9. Choose the analyzer you want to use.

![][1]
*To select an analyzer, click the Analyzer tab on the Fields blade*

![][2]
*Select one of the supported analyzers for each field*

By default, all searchable fields use the [Standard Lucene analyzer](http://lucene.apache.org/core/4_10_0/analyzers-common/org/apache/lucene/analysis/standard/StandardAnalyzer.html) which is language agnostic.

To view the full list of supported analyzers, see [Language Support in Azure Search](https://msdn.microsoft.com/library/azure/dn879793.aspx).

Once the language analyzer is selected for a field, it will be used with each indexing and search request for that field. When a query is issued against multiple fields using different analyzers, the query will be processed independently by the right analyzers for each field.

Many web and mobile applications serve users around the globe using different languages. It’s possible to define an index for a scenario like this by creating a field for each language supported.

![][3]
*Index definition with a description field for each language supported*

If the language of the agent issuing a query is known, a search request can be scoped to a specific field using the searchFields query parameter. The following query will be issued only against the description in Polish:

`https://[service name].search.windows.net/indexes/[index name]/docs?search=darmowy&searchFields=description_pl&api-version=2015-02-28`

Sometimes the language of the agent issuing a query is not known, in which case the query can be issued against all fields simultaneously. If needed, preference for results in a certain language can be defined using [scoring profiles](https://msdn.microsoft.com/library/azure/dn798928.aspx). In the example below, matches found in the description in English will be scored higher relative to matches in Polish and French:

    "scoringProfiles": [
      {
        "name": "englishFirst",
        "text": {
          "weights": { "description_en": 2 }
        }
      }
    ]

`https://[service name].search.windows.net/indexes/[index name]/docs?search=Microsoft&scoringProfile=englishFirst&api-version=2015-02-28`

If you’re a .NET developer, note that you can configure language analyzers using the [Azure Search .NET SDK](http://www.nuget.org/packages/Microsoft.Azure.Search/0.13.0-preview). The latest release includes support for the Microsoft language analyzers as well.

<!-- Image References -->
[1]: ./media/search-language-support/AnalyzerTab.png
[2]: ./media/search-language-support/SelectAnalyzer.png
[3]: ./media/search-language-support/IndexDefinition.png
