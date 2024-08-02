---
title: Manage concurrent writes
titleSuffix: Azure AI Search
description: Use optimistic concurrency to avoid mid-air collisions on updates or deletes to Azure AI Search indexes, indexers, data sources.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 04/23/2024
ms.custom:
  - devx-track-csharp
  - ignite-2023
---

# Manage concurrency in Azure AI Search

When managing Azure AI Search resources such as indexes and data sources, it's important to update resources safely, especially if resources are accessed concurrently by different components of your application. When two clients concurrently update a resource without coordination, race conditions are possible. To prevent this, Azure AI Search uses an *optimistic concurrency model*. There are no locks on a resource. Instead, there's an ETag for every resource that identifies the resource version so that you can formulate requests that avoid accidental overwrites.

## How it works

Optimistic concurrency is implemented through access condition checks in API calls writing to indexes, indexers, data sources, skillsets, and synonymMap resources.

All resources have an [*entity tag (ETag)*](https://en.wikipedia.org/wiki/HTTP_ETag) that provides object version information. By checking the ETag first, you can avoid concurrent updates in a typical workflow (get, modify locally, update) by ensuring the resource's ETag matches your local copy.

+ The REST API uses an [ETag](/rest/api/searchservice/common-http-request-and-response-headers-used-in-azure-search) on the request header.

+ The Azure SDK for .NET sets the ETag through an accessCondition object, setting the [If-Match | If-Match-None header](/rest/api/searchservice/common-http-request-and-response-headers-used-in-azure-search) on the resource. Objects that use ETags, such as [SynonymMap.ETag](/dotnet/api/azure.search.documents.indexes.models.synonymmap.etag) and [SearchIndex.ETag](/dotnet/api/azure.search.documents.indexes.models.searchindex.etag), have an accessCondition object.

Every time you update a resource, its ETag changes automatically. When you implement concurrency management, all you're doing is putting a precondition on the update request that requires the remote resource to have the same ETag as the copy of the resource that you modified on the client. If another process changes the remote resource, the ETag doesn't match the precondition and the request fails with HTTP 412. If you're using the .NET SDK, this failure manifests as an exception where the `IsAccessConditionFailed()` extension method returns true.

> [!Note]
> There is only one mechanism for concurrency. It's always used regardless of which API or SDK is used for resource updates.

## Example

The following code demonstrates optimistic concurrency for an update operation. It fails the second update because the object's ETag is changed by a previous update. More specifically, when the ETag in the request header no longer matches the ETag of the object, the search service return a status code of 400 (bad request), and the update fails.

```csharp
using Azure;
using Azure.Search.Documents;
using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;
using System;
using System.Net;
using System.Threading.Tasks;

namespace AzureSearch.SDKHowTo
{
    class Program
    {
        // This sample shows how ETags work by performing conditional updates and deletes
        // on an Azure Search index.
        static void Main(string[] args)
        {
            string serviceName = "PLACEHOLDER FOR YOUR SEARCH SERVICE NAME";
            string apiKey = "PLACEHOLDER FOR YOUR SEARCH SERVICE ADMIN API KEY";

            // Create a SearchIndexClient to send create/delete index commands
            Uri serviceEndpoint = new Uri($"https://{serviceName}.search.windows.net/");
            AzureKeyCredential credential = new AzureKeyCredential(apiKey);
            SearchIndexClient adminClient = new SearchIndexClient(serviceEndpoint, credential);

            // Delete index if it exists
            Console.WriteLine("Check for index and delete if it already exists...\n");
            DeleteTestIndexIfExists(adminClient);

            // Every top-level resource in Azure Search has an associated ETag that keeps track of which version
            // of the resource you're working on. When you first create a resource such as an index, its ETag is
            // empty.
            SearchIndex index = DefineTestIndex();

            Console.WriteLine(
                $"Test searchIndex hasn't been created yet, so its ETag should be blank. ETag: '{index.ETag}'");

            // Once the resource exists in Azure Search, its ETag is populated. Make sure to use the object
            // returned by the SearchIndexClient. Otherwise, you will still have the old object with the
            // blank ETag.
            Console.WriteLine("Creating index...\n");
            index = adminClient.CreateIndex(index);
            Console.WriteLine($"Test index created; Its ETag should be populated. ETag: '{index.ETag}'");


            // ETags prevent concurrent updates to the same resource. If another
            // client tries to update the resource, it will fail as long as all clients are using the right
            // access conditions.
            SearchIndex indexForClientA = index;
            SearchIndex indexForClientB = adminClient.GetIndex("test-idx");

            Console.WriteLine("Simulating concurrent update. To start, clients A and B see the same ETag.");
            Console.WriteLine($"ClientA ETag: '{indexForClientA.ETag}' ClientB ETag: '{indexForClientB.ETag}'");

            // indexForClientA successfully updates the index.
            indexForClientA.Fields.Add(new SearchField("a", SearchFieldDataType.Int32));
            indexForClientA = adminClient.CreateOrUpdateIndex(indexForClientA);

            Console.WriteLine($"Client A updates test-idx by adding a new field. The new ETag for test-idx is: '{indexForClientA.ETag}'");

            // indexForClientB tries to update the index, but fails due to the ETag check.
            try
            {
                indexForClientB.Fields.Add(new SearchField("b", SearchFieldDataType.Boolean));
                adminClient.CreateOrUpdateIndex(indexForClientB);

                Console.WriteLine("Whoops; This shouldn't happen");
                Environment.Exit(1);
            }
            catch (RequestFailedException e) when (e.Status == 400)
            {
                Console.WriteLine("Client B failed to update the index, as expected.");
            }

            // Uncomment the next line to remove test-idx
            //adminClient.DeleteIndex("test-idx");
            Console.WriteLine("Complete.  Press any key to end application...\n");
            Console.ReadKey();
        }


        private static void DeleteTestIndexIfExists(SearchIndexClient adminClient)
        {
            try
            {
                if (adminClient.GetIndex("test-idx") != null)
                {
                    adminClient.DeleteIndex("test-idx");
                }
            }
            catch (RequestFailedException e) when (e.Status == 404)
            {
                //if an exception occurred and status is "Not Found", this is working as expected
                Console.WriteLine("Failed to find index and this is because it's not there.");
            }
        }

        private static SearchIndex DefineTestIndex() =>
            new SearchIndex("test-idx", new[] { new SearchField("id", SearchFieldDataType.String) { IsKey = true } });
    }
}
```

## Design pattern

A design pattern for implementing optimistic concurrency should include a loop that retries the access condition check, a test for the access condition, and optionally retrieves an updated resource before attempting to reapply the changes.

This code snippet illustrates the addition of a synonymMap to an index that already exists.

The snippet gets the "hotels" index, checks the object version on an update operation, throws an exception if the condition fails, and then retries the operation (up to three times), starting with index retrieval from the server to get the latest version.

```csharp
private static void EnableSynonymsInHotelsIndexSafely(SearchServiceClient serviceClient)
{
    int MaxNumTries = 3;

    for (int i = 0; i < MaxNumTries; ++i)
    {
        try
        {
            Index index = serviceClient.Indexes.Get("hotels");
            index = AddSynonymMapsToFields(index);

            // The IfNotChanged condition ensures that the index is updated only if the ETags match.
            serviceClient.Indexes.CreateOrUpdate(index, accessCondition: AccessCondition.IfNotChanged(index));

            Console.WriteLine("Updated the index successfully.\n");
            break;
        }
        catch (Exception e) when (e.IsAccessConditionFailed())
        {
            Console.WriteLine($"Index update failed : {e.Message}. Attempt({i}/{MaxNumTries}).\n");
        }
    }
}

private static Index AddSynonymMapsToFields(Index index)
{
    index.Fields.First(f => f.Name == "category").SynonymMaps = new[] { "desc-synonymmap" };
    index.Fields.First(f => f.Name == "tags").SynonymMaps = new[] { "desc-synonymmap" };
    return index;
}
```

## See also

+ [ETag Struct](/dotnet/api/azure.etag?view=azure-dotnet&preserve-view=true)
+ [Common HTTP request and response headers](/rest/api/searchservice/common-http-request-and-response-headers-used-in-azure-search)
+ [HTTP status codes](/rest/api/searchservice/http-status-codes)
