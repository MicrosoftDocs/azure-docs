---
title: Synonyms C# example
titleSuffix: Azure AI Search
description: In this C# example, learn how to add the synonyms feature to an index in Azure AI Search. A synonyms map is a list of equivalent terms. Fields with synonym support expand queries to include the user-provided term and all related synonyms.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 06/16/2022
ms.custom: devx-track-csharp
#Customer intent: As a developer, I want to understand synonym implementation, benefits, and tradeoffs.
---
# Example: Add synonyms for Azure AI Search in C#

Synonyms expand a query by matching on terms considered semantically equivalent to the input term. For example, you might want "car" to match documents containing the terms "automobile" or "vehicle". 

In Azure AI Search, synonyms are defined in a *synonym map*, through *mapping rules* that associate equivalent terms. This example covers essential steps for adding and using synonyms with an existing index.

In this example, you will learn how to:

> [!div class="checklist"]
> * Create a synonym map using the [SynonymMap class](/dotnet/api/azure.search.documents.indexes.models.synonymmap). 
> * Set the [SynonymMapsName property](/dotnet/api/azure.search.documents.indexes.models.searchfield.synonymmapnames) on fields that should support query expansion via synonyms.

You can query a synonym-enabled field as you would normally. There is no additional query syntax required to access synonyms.

You can create multiple synonym maps, post them as a service-wide resource available to any index, and then reference which one to use at the field level. At query time, in addition to searching an index, Azure AI Search does a lookup in a synonym map, if one is specified on fields used in the query.

> [!NOTE]
> Synonyms can be created programmatically, but not in the portal.

## Prerequisites

Tutorial requirements include the following:

* [Visual Studio](https://www.visualstudio.com/downloads/)
* [Azure AI Search service](search-create-service-portal.md)
* [Azure.Search.Documents package](https://www.nuget.org/packages/Azure.Search.Documents/)

If you are unfamiliar with the .NET client library, see [How to use Azure AI Search in .NET](search-howto-dotnet-sdk.md).

## Sample code

You can find the full source code of the sample application used in this example on [GitHub](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToSynonyms).

## Overview

Before-and-after queries are used to demonstrate the value of synonyms. In this example, a sample application executes queries and returns results on a sample "hotels" index populated with two documents. First, the application executes search queries using terms and phrases that do not appear in the index. Second, the code enables the synonyms feature, then re-issues the same queries, this time returning results based on matches in the synonym map. 

The code below demonstrates the overall flow.

```csharp
static void Main(string[] args)
{
   SearchIndexClient indexClient = CreateSearchIndexClient();

   Console.WriteLine("Cleaning up resources...\n");
   CleanupResources(indexClient);

   Console.WriteLine("Creating index...\n");
   CreateHotelsIndex(indexClient);

   SearchClient searchClient = indexClient.GetSearchClient("hotels");

   Console.WriteLine("Uploading documents...\n");
   UploadDocuments(searchClient);

   SearchClient searchClientForQueries = CreateSearchClientForQueries();

   RunQueriesWithNonExistentTermsInIndex(searchClientForQueries);

   Console.WriteLine("Adding synonyms...\n");
   UploadSynonyms(indexClient);

   Console.WriteLine("Enabling synonyms in the test index...\n");
   EnableSynonymsInHotelsIndexSafely(indexClient);
   Thread.Sleep(10000); // Wait for the changes to propagate

   RunQueriesWithNonExistentTermsInIndex(searchClientForQueries);

   Console.WriteLine("Complete.  Press any key to end application...\n");

   Console.ReadKey();
}
```

## "Before" queries

In `RunQueriesWithNonExistentTermsInIndex`, issue search queries with "five star", "internet", and "economy AND hotel".

Phrase queries, such as "five star", must be enclosed in quotation marks, and might also need escape characters depending on your client.

```bash
Console.WriteLine("Search the entire index for the phrase \"five star\":\n");
results = searchClient.Search<Hotel>("\"five star\"", searchOptions);
WriteDocuments(results);

Console.WriteLine("Search the entire index for the term 'internet':\n");
results = searchClient.Search<Hotel>("internet", searchOptions);
WriteDocuments(results);

Console.WriteLine("Search the entire index for the terms 'economy' AND 'hotel':\n");
results = searchClient.Search<Hotel>("economy AND hotel", searchOptions);
WriteDocuments(results);
```

Neither of the two indexed documents contain the terms, so we get the following output from the first `RunQueriesWithNonExistentTermsInIndex`:  **no document matched**.

## Enable synonyms

After the "before" queries are run, the sample code enables synonyms. Enabling synonyms is a two-step process. First, define and upload synonym rules. Second, configure fields to use them. The process is outlined in `UploadSynonyms` and `EnableSynonymsInHotelsIndex`.

1. Add a synonym map to your search service. In `UploadSynonyms`, we define four rules in our synonym map 'desc-synonymmap' and upload to the service.

   ```csharp
   private static void UploadSynonyms(SearchIndexClient indexClient)
   {
      var synonymMap = new SynonymMap("desc-synonymmap", "hotel, motel\ninternet,wifi\nfive star=>luxury\neconomy,inexpensive=>budget");

      indexClient.CreateOrUpdateSynonymMap(synonymMap);
   }
   ```

1. Configure searchable fields to use the synonym map in the index definition. In `AddSynonymMapsToFields`, we enable synonyms on two fields `category` and `tags` by setting the `SynonymMapNames` property to the name of the newly uploaded synonym map.

   ```csharp
   private static SearchIndex AddSynonymMapsToFields(SearchIndex index)
   {
      index.Fields.First(f => f.Name == "category").SynonymMapNames.Add("desc-synonymmap");
      index.Fields.First(f => f.Name == "tags").SynonymMapNames.Add("desc-synonymmap");
      return index;
   }
   ```

   When you add a synonym map, index rebuilds are not required. You can add a synonym map to your service, and then amend existing field definitions in any index to use the new synonym map. The addition of new attributes has no impact on index availability. The same applies in disabling synonyms for a field. You can simply set the `SynonymMapNames` property to an empty list.

   ```csharp
   index.Fields.First(f => f.Name == "category").SynonymMapNames.Add("desc-synonymmap");
   ```

## "After" queries

After the synonym map is uploaded and the index is updated to use the synonym map, the second `RunQueriesWithNonExistentTermsInIndex` call outputs the following:

```bash
Search the entire index for the phrase "five star":

Name: Fancy Stay        Category: Luxury        Tags: [pool, view, wifi, concierge]

Search the entire index for the term 'internet':

Name: Fancy Stay        Category: Luxury        Tags: [pool, view, wifi, concierge]

Search the entire index for the terms 'economy' AND 'hotel':

Name: Roach Motel       Category: Budget        Tags: [motel, budget]
```

The first query finds the document from the rule `five star=>luxury`. The second query expands the search using `internet,wifi` and the third using both `hotel, motel` and `economy,inexpensive=>budget` in finding the documents they matched.

Adding synonyms completely changes the search experience. In this example, the original queries failed to return meaningful results even though the documents in our index were relevant. By enabling synonyms, we can expand an index to include terms in common use, with no changes to underlying data in the index.

## Clean up resources

The fastest way to clean up after an example is by deleting the resource group containing the Azure AI Search service. You can delete the resource group now to permanently delete everything in it. In the portal, the resource group name is on the Overview page of Azure AI Search service.

## Next steps

This example demonstrated the synonyms feature in C# code to create and post mapping rules and then call the synonym map on a query. Additional information can be found in the [.NET SDK](/dotnet/api/overview/azure/search.documents-readme) and [REST API](/rest/api/searchservice/) reference documentation.

> [!div class="nextstepaction"]
> [How to use synonyms in Azure AI Search](search-synonyms.md)
