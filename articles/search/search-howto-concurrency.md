---
title: How to manage concurrent writes to an index in Azure Search
description: Optimistic write locks on indexes to avoid collisions on indexing updates
services: search
documentationcenter: ''
author: HeidiSteen
manager: jhubbard
editor: ''
tags: azure-portal

ms.assetid: 
ms.service: search
ms.devlang: 
ms.workload: search
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 06/26/2017
ms.author: heidist

---
# How to manage concurrent writes to an index in Azure Search

In a multi-user development environment, we recommend that you adopt coding practices to avoid overwriting changes to the same object. 

Given a standard workflow (get, modify locally, update), you can avoid concurrent overwrites of the same resource by checking for a version number prior to update. The version number is provided by an [entity tag (Etag)](https://en.wikipedia.org/wiki/HTTP_ETag). The .NET SDK sets the Etag through its **AccessCondition** object, used for setting the [If-Match of If-Match-None header](https://docs.microsoft.com/rest/api/searchservice/common-http-request-and-response-headers-used-in-azure-search) on the resource.

> [!Note]
> There is only one mechanism for concurrency. It's always used regardless of which API is used for resource updates. 

## Optimistic concurrency model

Azure Search supports optimistic concurrency in API calls that write to an index, indexer, datasource, suggester, and synoymMap. Any object inheriting from [IResourceWithETag (.NET SDK)](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.iresourcewithetag?view=azuresearch-3.0.2) or using [an ETag (REST)]https://docs.microsoft.com/rest/api/searchservice/common-http-request-and-response-headers-used-in-azure-search) can implement concurrency awareness.

After the first update, the eTag is different for subsequent updates. Write operations failing due to an eTag version discrepancy return HTTP 412 for REST calls, or for the .NET SDK, the accessCondition check fails. 

## Conceptual examples

The following code snippets demonstrate the concept of an **accessCondition** by including a check on update and delete index operations. If the check fails, the operation fails.

**Scenario 1: Fail an update if the index no longer exists**

The accessCondition checks for an existing Etag on the index. If the ETag does not exist, the index object does not exist, and the update fails as a result. 

        var newIndex = new Index();
        newIndex.Name = "aNewIndex";
        newIndex.Fields.Add(new Field());
        serviceClient.Indexes.CreateOrUpdate(newIndex, accessCondition: AccessCondition.GenerateIfExistsCondition());

**Scenario 2: Update a specific version of the index**

The accessCondition checks for a corresponding ETag on the object definition and the local object. If the ETags do not match, the accessCondition fails and the index is not updated. The update succeeds only if the ETag on the index is unchanged. 

        var index = serviceClient.Indexes.Get("IndexName");
        index.Fields.Add(new Field());
        serviceClient.Indexes.CreateOrUpdate(index, accessCondition: AccessCondition.GenerateIfMatchCondition(index.ETag));

**Scenario 3: Delete an index only if it already exists**

This example is equivalent to scenario 1, but for a delete operation.

        serviceClient.Indexes.Delete("AnIndex", accessCondition: AccessCondition.GenerateIfExistsCondition()); 


**Scenario 4: Delete a specific version of the index**

This example deletes the index only if it matches the original version. If you are actively iterating over the same index structure, you can check the object version prior to writing changes.

         // Create an index and a variant
         var index2 = new Index();
         index2.Name = "secondIndex";
         var index3 = serviceClient.Indexes.Create(index2);

        // Delete fails because the ETag of index2 is no longer the same, per the creation of index3 based on index2
        serviceClient.Indexes.Delete(index2.Name, accessCondition:  AccessCondition.GenerateIfMatchCondition(index2.ETag)); 

        // Delete fails if the ETag of index3 is different from the ETag created with the object
        serviceClient.Indexes.Delete(index3.Name, accessCondition: AccessCondition.GenerateIfMatchCondition(index3.ETag)); 

## HowTo Example (Short)

A common case where checking access conditions is appropriate might include updates to a synonymMap.

        private static void AddNewSynonymsSafely(SearchServiceClient serviceClient)
        {
            var synonymMap = serviceClient.SynonymMaps.Get("desc-synonymmap");
            synonymMap.Synonyms = synonymMap.Synonyms + "\ninternet,wifi";

            // Simulate modifying the synonym map seperately
            AddNewSynonyms(serviceClient);
            
            // This request will fail, because the synonymMap has changed since it was last gotten.
            try
            {
                serviceClient.SynonymMaps.CreateOrUpdate(synonymMap, accessCondition: AccessCondition.GenerateIfMatchCondition(synonymMap.ETag));
            }
            catch (CloudException e) when (e.IsAccessConditionFailed())
            {
                // Since the request failed with an AccessCondition failure GET the latest version of the SynonymMap, apply the change again and update
                synonymMap = serviceClient.SynonymMaps.Get("desc-synonymmap");
                synonymMap.Synonyms = synonymMap.Synonyms + "\ninternet,wifi";
                serviceClient.SynonymMaps.CreateOrUpdate(synonymMap, accessCondition: AccessCondition.GenerateIfMatchCondition(synonymMap.ETag));
            }
        }

        private static void AddNewSynonyms(SearchServiceClient serviceClient)
        {
            var synonymMap = serviceClient.SynonymMaps.Get("desc-synonymmap");
            synonymMap.Synonyms = synonymMap.Synonyms + "\nfive star=>luxury";
            serviceClient.SynonymMaps.CreateOrUpdate(synonymMap);
        }

## HowTo Example (Verbose)

First, the intial code:

```
using System;
using System.Configuration;
using System.Linq;
using System.Threading;
using Microsoft.Azure.Search;
using Microsoft.Azure.Search.Models;
using Microsoft.Spatial;
using Microsoft.Rest.Azure;

namespace AzureSearch.SDKHowToSynonyms
{
    class Program
    {
        // This sample shows how to delete, create, upload documents and query an index with a synonym map
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

            Console.WriteLine("{0}", "Adding more synonyms...\n");

            AddNewSynonymsSafely(serviceClient);

            RunQueriesWithNonExistentTermsInIndex(indexClientForQueries);

            Console.WriteLine("{0}", "Complete.  Press any key to end application...\n");

            Console.ReadKey();
        }

        private static SearchServiceClient CreateSearchServiceClient()
        {
            string searchServiceName = ConfigurationManager.AppSettings["SearchServiceName"];
            string adminApiKey = ConfigurationManager.AppSettings["SearchServiceAdminApiKey"];

            SearchServiceClient serviceClient = new SearchServiceClient(searchServiceName, new SearchCredentials(adminApiKey));
            return serviceClient;
        }

        private static SearchIndexClient CreateSearchIndexClient()
        {
            string searchServiceName = ConfigurationManager.AppSettings["SearchServiceName"];
            string queryApiKey = ConfigurationManager.AppSettings["SearchServiceQueryApiKey"];

            SearchIndexClient indexClient = new SearchIndexClient(searchServiceName, "hotels", new SearchCredentials(queryApiKey));
            return indexClient;
        }

        private static void CleanupResources(SearchServiceClient serviceClient)
        {
            if (serviceClient.Indexes.Exists("hotels"))
            {
                serviceClient.Indexes.Delete("hotels");
            }

            if (serviceClient.SynonymMaps.Exists("desc-synonymmap"))
            {
                serviceClient.SynonymMaps.Delete("desc-synonymmap");
            }
        }

        private static void CreateHotelsIndex(SearchServiceClient serviceClient)
        {
            var definition = new Index()
            {
                Name = "hotels",
                Fields = FieldBuilder.BuildForType<Hotel>()
            };

            serviceClient.Indexes.Create(definition);
        }

        private static void EnableSynonymsInHotelsIndex(SearchServiceClient serviceClient)
        {
            Index index = serviceClient.Indexes.Get("hotels");
            index.Fields.First(f => f.Name == "category").SynonymMaps = new[] { "desc-synonymmap" };
            index.Fields.First(f => f.Name == "tags").SynonymMaps = new[] { "desc-synonymmap" };

            serviceClient.Indexes.CreateOrUpdate(index);
        }

        private static void UploadSynonyms(SearchServiceClient serviceClient)
        {
            var synonymMap = new SynonymMap()
            {
                Name = "desc-synonymmap",
                Format = "solr",
                Synonyms = "hotel, motel\neconomy,inexpensive=>budget"
            };

            serviceClient.SynonymMaps.CreateOrUpdate(synonymMap);
        }
```

Include `accessCondition` to block updates on an object already marked as changed.

```
        private static void AddNewSynonymsSafely(SearchServiceClient serviceClient)
        {
            var synonymMap = serviceClient.SynonymMaps.Get("desc-synonymmap");
            var synonymMap2 = serviceClient.SynonymMaps.Get("desc-synonymmap");

            synonymMap.Synonyms = synonymMap.Synonyms + "\nfive star=>luxury";
            synonymMap2.Synonyms = synonymMap2.Synonyms + "\ninternet,wifi";

            serviceClient.SynonymMaps.CreateOrUpdate(synonymMap, accessCondition: AccessCondition.GenerateIfMatchCondition(synonymMap.ETag));

            // This request will fail, because the synonymMap has changed since it was last gotten.
            try
            {
                serviceClient.SynonymMaps.CreateOrUpdate(synonymMap2, accessCondition: AccessCondition.GenerateIfMatchCondition(synonymMap.ETag));
            }
            catch (CloudException e) when (e.IsAccessConditionFailed())
            {
                // Since the request failed with an AccessCondition failure, GET the latest version of the SynonymMap, apply the change again and update
                synonymMap2 = serviceClient.SynonymMaps.Get("desc-synonymmap");
                synonymMap2.Synonyms = synonymMap2.Synonyms + "\ninternet,wifi";
                serviceClient.SynonymMaps.CreateOrUpdate(synonymMap2, accessCondition: AccessCondition.GenerateIfMatchCondition(synonymMap.ETag));
            }
        }

        private static void UploadDocuments(ISearchIndexClient indexClient)
        {
            var hotels = new Hotel[]
            {
               new Hotel()
                { 
                    HotelId = "1", 
                    BaseRate = 199.0, 
                    Description = "Best hotel in town",
                    DescriptionFr = "Meilleur hôtel en ville",
                    HotelName = "Fancy Stay",
                    Category = "Luxury", 
                    Tags = new[] { "pool", "view", "wifi", "concierge" },
                    ParkingIncluded = false, 
                    SmokingAllowed = false,
                    LastRenovationDate = new DateTimeOffset(2010, 6, 27, 0, 0, 0, TimeSpan.Zero), 
                    Rating = 5, 
                    Location = GeographyPoint.Create(47.678581, -122.131577)
                },
                new Hotel()
                { 
                    HotelId = "2", 
                    BaseRate = 79.99,
                    Description = "Cheapest hotel in town",
                    DescriptionFr = "Hôtel le moins cher en ville",
                    HotelName = "Roach Motel",
                    Category = "Budget",
                    Tags = new[] { "motel", "budget" },
                    ParkingIncluded = true,
                    SmokingAllowed = true,
                    LastRenovationDate = new DateTimeOffset(1982, 4, 28, 0, 0, 0, TimeSpan.Zero),
                    Rating = 1,
                    Location = GeographyPoint.Create(49.678581, -122.131577)
                },
                new Hotel() 
                { 
                    HotelId = "3", 
                    BaseRate = 129.99,
                    Description = "Close to town hall and the river"
                }
            };

            var batch = IndexBatch.Upload(hotels);

            try
            {
                indexClient.Documents.Index(batch);
            }
            catch (IndexBatchException e)
            {
                // Sometimes when your Search service is under load, indexing will fail for some of the documents in
                // the batch. Depending on your application, you can take compensating actions like delaying and
                // retrying. For this simple demo, we just log the failed document keys and continue.
                Console.WriteLine(
                    "Failed to index some of the documents: {0}",
                    String.Join(", ", e.IndexingResults.Where(r => !r.Succeeded).Select(r => r.Key)));
            }

            Console.WriteLine("Waiting for documents to be indexed...\n");
            Thread.Sleep(2000);
        }

        private static void RunQueriesWithNonExistentTermsInIndex(ISearchIndexClient indexClient)
        {
            SearchParameters parameters;
            DocumentSearchResult<Hotel> results;

            Console.WriteLine("Search with terms nonexistent in the index:\n");

            parameters =
                new SearchParameters()
                {
                    SearchFields = new[] { "category", "tags" },
                    Select = new[] { "hotelName", "category", "tags" },
                };

            Console.WriteLine("Search the entire index for the terms 'economy' AND 'hotel':\n");
            results = indexClient.Documents.Search<Hotel>("economy AND hotel", parameters);
            WriteDocuments(results);

            Console.WriteLine("Search the entire index for the phrase \"five star\":\n");
            results = indexClient.Documents.Search<Hotel>("\"five star\"", parameters);
            WriteDocuments(results);

            Console.WriteLine("Search the entire index for the term 'internet':\n");
            results = indexClient.Documents.Search<Hotel>("internet", parameters);
            WriteDocuments(results);
        }

        private static void WriteDocuments(DocumentSearchResult<Hotel> searchResults)
        {
            if (searchResults.Results.Count != 0)
            {
                foreach (SearchResult<Hotel> result in searchResults.Results)
                {
                    Console.WriteLine(result.Document);
                }
            } 
            else
            {
                Console.WriteLine("no document matched");
            }

            Console.WriteLine();
        }
    }
}
```

## Next steps

Try modifying either of the following samples to include Etags or AccessCondition objects.

+ [.NET SDK sample on Github](https://github.com/Azure-Samples/search-dotnet-getting-started) 
+ [REST API sample on Github](https://github.com/Azure-Samples/search-rest-api-getting-started) 

## See also

[Common HTTP request and response headers](https://docs.microsoft.com/rest/api/searchservice/common-http-request-and-response-headers-used-in-azure-search)

[HTTP status codes](https://docs.microsoft.com/rest/api/searchservice/http-status-codes)