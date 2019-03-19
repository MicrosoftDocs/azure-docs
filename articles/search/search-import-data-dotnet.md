---
title: 'Load data to an Azure Search index in C# (.NET SDK) - Azure Search'
description: Learn how to upload data to a full text searchable index in Azure Search using C# sample code and the .NET SDK.
author: heidisteen
manager: cgronlun
ms.author: heidist
services: search
ms.service: search
ms.devlang: dotnet
ms.topic: quickstart
ms.date: 03/20/2019

---
# Quickstart: 2 - Load data to an Azure Search index using C#

This article shows you how to import data into [an Azure Search index](search-what-is-an-index.md) using C# and the [.NET SDK](https://aka.ms/search-sdk). Pushing documents into your index is accomplished by performing these tasks:

> [!div class="checklist"]
> * Create a `SearchIndexClient` object to connect to a search index.
> * Create an `IndexBatch` object containing the documents to be added, modified, or deleted.
> * Call the `Documents.Index` method on `SearchIndexClient` to upload documents to an index.

## Prerequisites

[Create an Azure Search index](search-create-index-dotnet.md) and a `SearchServiceClient` object, as shown in ["Create a client"](search-create-index-dotnet.md#CreateSearchServiceClient).


## Create a client
To import data, create an instance of the `SearchIndexClient` class.

You can construct this instance yourself, but it's easier if you already have a `SearchServiceClient` instance to call its `Indexes.GetClient` method. For example, here is how you would obtain a `SearchIndexClient` for the index named "hotels" from a `SearchServiceClient` named `serviceClient`:

```csharp
ISearchIndexClient indexClient = serviceClient.Indexes.GetClient("hotels");
```

> [!NOTE]
> In a typical search application, querying and indexing are handled separately. While `Indexes.GetClient` is convenient because you can reuse objects like `SearchCredentials`, a more robust approach involves creating the `SearchIndexClient` directly so that you can pass in a query key instead of an admin key. This practice is consistent with the [principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) and helps to make your application more secure. For more information about keys, see [Create and manage api-keys for an Azure Search service](search-security-api-keys.md).
> 
> 

`SearchIndexClient` has a `Documents` property. This property provides all the methods you need to add, modify, delete, or query documents in your index.

<a name="construct-indexbatch"></a>

## Construct IndexBatch

To import data using the .NET SDK, package up your data into an `IndexBatch` object. An `IndexBatch` encapsulates a collection of `IndexAction` objects, each of which contains a document and a property that tells Azure Search what action to perform on that document (upload, merge, delete, and mergeOrUpload). For more information about indexing actions, see [Indexing actions: upload, merge, mergeOrUpload, delete](search-what-is-data-import.md#indexing-actions).

Assuming you know which actions to perform on your documents, you are ready to construct the `IndexBatch`. The example below shows how to create a batch with a few different actions. The example uses a custom class called `Hotel` that maps to a document in the "hotels" index.

```csharp
var actions =
    new IndexAction<Hotel>[]
    {
        IndexAction.Upload(
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
            }),
        IndexAction.Upload(
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
            }),
        IndexAction.MergeOrUpload(
            new Hotel()
            {
                HotelId = "3",
                BaseRate = 129.99,
                Description = "Close to town hall and the river"
            }),
        IndexAction.Delete(new Hotel() { HotelId = "6" })
    };

var batch = IndexBatch.New(actions);
```

In this case, we are using `Upload`, `MergeOrUpload`, and `Delete` as our search actions, as specified by the methods called on the `IndexAction` class.

Assume that this example "hotels" index is already populated with a number of documents. Note how we did not have to specify all the possible document fields when using `MergeOrUpload` and how we only specified the document key (`HotelId`) when using `Delete`.

Also, note that you can only include up to 1000 documents in a single indexing request.

> [!NOTE]
> In this example, we are applying different actions to different documents. If you wanted to perform the same actions across all documents in the batch, instead of calling `IndexBatch.New`, you could use the other static methods of `IndexBatch`. For example, you could create batches by calling `IndexBatch.Merge`, `IndexBatch.MergeOrUpload`, or `IndexBatch.Delete`. These methods take a collection of documents (objects of type `Hotel` in this example) instead of `IndexAction` objects.
> 
> 

## Call Documents.Index
Now that you have an initialized `IndexBatch` object, you can send it to the index by calling `Documents.Index` on your `SearchIndexClient` object. The following example shows how to call `Index`, as well as some extra steps you will need to perform:

```csharp
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
```

Note the `try`/`catch` surrounding the call to the `Index` method. The catch block handles an important error case for indexing. If your Azure Search service fails to index some of the documents in the batch, an `IndexBatchException` is thrown by `Documents.Index`. This can happen if you are indexing documents while your service is under heavy load. **We strongly recommend explicitly handling this case in your code.** You can delay and then retry indexing the documents that failed, or you can log and continue like the sample does, or you can do something else depending on your application's data consistency requirements.

Finally, the code in the example above delays for two seconds. Indexing happens asynchronously in your Azure Search service, so the sample application needs to wait a short time to ensure that the documents are available for searching. Delays like this are typically only necessary in demos, tests, and sample applications.

For more information about document processing, see ["How the .NET SDK handles documents"](search-howto-dotnet-sdk.md#how-dotnet-handles-documents).


## Next steps
After populating your Azure Search index, the next step is issuing queries to search for documents. 

> [!div class="nextstepaction"]
> [Query an Azure Search index in C#](search-query-dotnet.md)
