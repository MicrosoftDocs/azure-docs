---
title: Synonyms preview tutorial in Azure Search | Microsoft Docs
description: Add the synonyms preview feature to an index in Azure Search.
services: search
manager: jhubbard
documentationcenter: ''
author: HeidiSteen
ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.date: 03/31/2017
ms.author: heidist
---
# Synonym (preview) C# tutorial for Azure Search

Synonyms expand a query by matching on terms considered semantically equivalent to the input term. For example, you might want "car" to match documents containing the terms "automobile" or "vehicle".

In Azure Search, synonyms are defined in a *synonym map*, through *mapping rules* that associate equivalent terms. You can create multiple synonym maps, post them as a service-wide resource available to any index, and then reference which one to use at the field level. At query time, in addition to searching an index, Azure Search does a lookup in a synonym map, if one is specified on fields used in the query.

> [!NOTE]
> The synonyms feature is currently in preview and only supported in the latest preview API and SDK versions (api-version=2016-09-01-Preview, SDK version 4.x-preview). There is no Azure portal support at this time. Preview APIs are not under SLA and preview features may change, so we do not recommend using them in production applications.

## Prerequisites

Tutorial requirements include the following:

* [Visual Studio](https://www.visualstudio.com/downloads/)
* [Azure Search service](search-create-service-portal.md)
* [Preview version of Microsoft.Azure.Search .NET library](https://aka.ms/search-sdk-preview)
* [How to use Azure Search from a .NET Application](https://docs.microsoft.com/azure/search/search-howto-dotnet-sdk)

## Overview

Before-and-after queries demonstrate the value of synonyms. In this tutorial, we use a sample application that executes queries and returns results on a sample index. The sample application creates a small index named "hotels" populated with two documents. The application executes search queries using terms and phrases that do not appear in the index, enables the synonyms feature, then issues the same searches again. The code below demonstrates the overall flow.

```csharp
  static void Main(string[] args)
  {
      SearchServiceClient serviceClient = CreateSearchServiceClient();

      Console.WriteLine("{0}", "Cleaning up resources...\n");
      CleanupResources(serviceClient);

      Console.WriteLine("{0}", "Creating index...\n");
      CreateHotelsIndex(serviceClient);

      ISearchIndexClient indexClient = serviceClient.Indexes.GetClient("hotels");

      Console.WriteLine("{0}", "Uploading documents...\n");
      UploadDocuments(indexClient);

      ISearchIndexClient indexClientForQueries = CreateSearchIndexClient();

      RunQueriesWithNonExistentTermsInIndex(indexClientForQueries);

      Console.WriteLine("{0}", "Adding synonyms...\n");
      UploadSynonyms(serviceClient);
      EnableSynonymsInHotelsIndex(serviceClient);
      Thread.Sleep(10000); // Wait for the changes to propagate

      RunQueriesWithNonExistentTermsInIndex(indexClientForQueries);

      Console.WriteLine("{0}", "Complete.  Press any key to end application...\n");

      Console.ReadKey();
  }
```
The steps to create and populate the sample index are explained in [How to use Azure Search from a .NET Application](https://docs.microsoft.com/azure/search/search-howto-dotnet-sdk).

## "Before" queries

In `RunQueriesWithNonExistentTermsInIndex`, we issue search queries with "five star", "internet", and "economy AND hotel".
```csharp
Console.WriteLine("Search the entire index for the phrase \"five star\":\n");
results = indexClient.Documents.Search<Hotel>("\"five star\"", parameters);
WriteDocuments(results);

Console.WriteLine("Search the entire index for the term 'internet':\n");
results = indexClient.Documents.Search<Hotel>("internet", parameters);
WriteDocuments(results);

Console.WriteLine("Search the entire index for the terms 'economy' AND 'hotel':\n");
results = indexClient.Documents.Search<Hotel>("economy AND hotel", parameters);
WriteDocuments(results);
```
Neither of the two indexed documents contain the terms, so we get the following output from the first `RunQueriesWithNonExistentTermsInIndex`.
~~~
Search the entire index for the phrase "five star":

no document matched

Search the entire index for the term 'internet':

no document matched

Search the entire index for the terms 'economy' AND 'hotel':

no document matched
~~~

## Enable synonyms

Enabling synonyms is a two-step process. We first define and upload synonym rules and then configure fields to use them. The process is outlined in `UploadSynonyms` and `EnableSynonymsInHotelsIndex`.

1. Add a synonym map to your search service. In `UploadSynonyms`, we define four rules in our synonym map 'desc-synonymmap' and upload to the service.
```csharp
    var synonymMap = new SynonymMap()
    {
        Name = "desc-synonymmap",
        Format = "solr",
        Synonyms = "hotel, motel\n
                    internet,wifi\n
                    five star=>luxury\n
                    economy,inexpensive=>budget"
    };

    serviceClient.SynonymMaps.CreateOrUpdate(synonymMap);
```
A synonym map must conform to the open source standard `solr` format. The format is explained in [Synonyms in Azure Search](search-synonyms.md) under the section `Apache Solr synonym format`.

2. Configure searchable fields to use the synonym map in the index definition. In `EnableSynonymsInHotelsIndex`, we enable synonyms on two fields `category` and `tags` by setting the `synonymMaps` property to the name of the newly uploaded synonym map.
```csharp
  Index index = serviceClient.Indexes.Get("hotels");
  index.Fields.First(f => f.Name == "category").SynonymMaps = new[] { "desc-synonymmap" };
  index.Fields.First(f => f.Name == "tags").SynonymMaps = new[] { "desc-synonymmap" };

  serviceClient.Indexes.CreateOrUpdate(index);
```
When you add a synonym map, index rebuilds are not required. You can add a synonym map to your service, and then amend existing field definitions in any index to use the new synonym map. The addition of new attributes has no impact on index availability. The same applies in disabling synonyms for a field. You can simply set the `synonymMaps` property to an empty list.
```csharp
  index.Fields.First(f => f.Name == "category").SynonymMaps = new List<string>();
```

## "After" queries

After the synonym map is uploaded and the index is updated to use the synonym map, the second `RunQueriesWithNonExistentTermsInIndex` call outputs the following:

~~~
Search the entire index for the phrase "five star":

Name: Fancy Stay        Category: Luxury        Tags: [pool, view, wifi, concierge]

Search the entire index for the term 'internet':

Name: Fancy Stay        Category: Luxury        Tags: [pool, view, wifi, concierge]

Search the entire index for the terms 'economy' AND 'hotel':

Name: Roach Motel       Category: Budget        Tags: [motel, budget]
~~~
The first query finds the document from the rule `five star=>luxury`. The second query expands the search using `internet,wifi` and the third using both `hotel, motel` and `economy,inexpensive=>budget` in finding the documents they matched.

Adding synonyms completely changes the search experience. In this tutorial, the original queries failed to return meaningful results even though the documents in our index were relevant. By enabling synonyms, we can expand an index to include terms in common use, with no changes to underlying data in the index.

## Sample application source code
You can find the full source code of the sample application used in this walk through on [GitHub](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToSynonyms).

## Next steps

* Review [How to use synonyms in Azure Search](search-synonyms.md)
* Review [Synonyms REST API documentation](https://aka.ms/rgm6rq)
* Browse the references for the [.NET SDK](https://docs.microsoft.com/dotnet/api/microsoft.azure.search) and [REST API](https://docs.microsoft.com/rest/api/searchservice/).
