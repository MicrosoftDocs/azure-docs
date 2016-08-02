<properties
    pageTitle="Data upload in Azure Search using the .NET SDK | Microsoft Azure | Hosted cloud search service"
    description="Learn how to upload data to an index in Azure Search using the .NET SDK."
    services="search"
    documentationCenter=""
    authors="brjohnstmsft"
    manager=""
    editor=""
    tags=""/>

<tags
    ms.service="search"
    ms.devlang="dotnet"
    ms.workload="search"
    ms.topic="get-started-article"
    ms.tgt_pltfrm="na"
    ms.date="05/23/2016"
    ms.author="brjohnst"/>

# Upload data to Azure Search using the .NET SDK
> [AZURE.SELECTOR]
- [Overview](search-what-is-data-import.md)
- [.NET](search-import-data-dotnet.md)
- [REST](search-import-data-rest-api.md)

This article will show you how to use the [Azure Search .NET SDK](https://msdn.microsoft.com/library/azure/dn951165.aspx) to import data into an Azure Search index.

Before beginning this walkthrough, you should already have [created an Azure Search index](search-what-is-an-index.md). This article also assumes that you have already created a `SearchServiceClient` object, as shown in [Create an Azure Search index using the .NET SDK](search-create-index-dotnet.md#CreateSearchServiceClient).

Note that all sample code in this article is written in C#. You can find the full source code [on GitHub](http://aka.ms/search-dotnet-howto).

In order to push documents into your index using the .NET SDK, you will need to:

  1. Create a `SearchIndexClient` object to connect to your search index.
  2. Create an `IndexBatch` containing the documents to be added, modified, or deleted.
  3. Call the `Documents.Index` method of your `SearchIndexClient` to send the `IndexBatch` to your search index.

## I. Create an instance of the SearchIndexClient class
To import data into your index using the Azure Search .NET SDK, you will need to create an instance of the `SearchIndexClient` class. You can construct this instance yourself, but it's easier if you already have a `SearchServiceClient` instance to call its `Indexes.GetClient` method. For example, here is how you would obtain a `SearchIndexClient` for the index named "hotels" from a `SearchServiceClient` named `serviceClient`:

```csharp
SearchIndexClient indexClient = serviceClient.Indexes.GetClient("hotels");
```

> [AZURE.NOTE] In a typical search application, index management and population is handled by a separate component from search queries. `Indexes.GetClient` is convenient for populating an index because it saves you the trouble of providing another `SearchCredentials`. It does this by passing the admin key that you used to create the `SearchServiceClient` to the new `SearchIndexClient`. However, in the part of your application that executes queries, it is better to create the `SearchIndexClient` directly so that you can pass in a query key instead of an admin key. This is consistent with the [principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) and will help to make your application more secure. You can find out more about admin keys and query keys in the [Azure Search REST API reference on MSDN](https://msdn.microsoft.com/library/azure/dn798935.aspx).

`SearchIndexClient` has a `Documents` property. This property provides all the methods you need to add, modify, delete, or query documents in your index.

## II. Decide which indexing action to use
To import data using the .NET SDK, you will need to package up your data into an `IndexBatch` object. An `IndexBatch` encapsulates a collection of `IndexAction` objects, each of which contains a document and a property that tells Azure Search what action to perform on that document (upload, merge, delete, etc). Depending on which of the below actions you choose, only certain fields must be included for each document:

Action | Description | Necessary fields for each document | Notes
--- | --- | --- | ---
`Upload` | An `Upload` action is similar to an "upsert" where the document will be inserted if it is new and updated/replaced if it exists. | key, plus any other fields you wish to define | When updating/replacing an existing document, any field that is not specified in the request will have its field set to `null`. This occurs even when the field was previously set to a non-null value.
`Merge` | Updates an existing document with the specified fields. If the document does not exist in the index, the merge will fail. | key, plus any other fields you wish to define | Any field you specify in a merge will replace the existing field in the document. This includes fields of type `DataType.Collection(DataType.String)`. For example, if the document contains a field `tags` with value `["budget"]` and you execute a merge with value `["economy", "pool"]` for `tags`, the final value of the `tags` field will be `["economy", "pool"]`. It will not be `["budget", "economy", "pool"]`.
`MergeOrUpload` | This action behaves like `Merge` if a document with the given key already exists in the index. If the document does not exist, it behaves like `Upload` with a new document. | key, plus any other fields you wish to define | -
`Delete` | Removes the specified document from the index. | key only | Any fields you specify other than the key field will be ignored. If you want to remove an individual field from a document, use `Merge` instead and simply set the field explicitly to null.

You can specify what action you want to use with the various static methods of the `IndexBatch` and `IndexAction` classes, as shown in the next section.

## III. Construct your IndexBatch
Now that you know which actions to perform on your documents, you are ready to construct the `IndexBatch`. The example below shows how to create a batch with a few different actions. Note that our example uses a custom class called `Hotel` that maps to a document in the "hotels" index.

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

> [AZURE.NOTE] In this example, we are applying different actions to different documents. If you wanted to perform the same actions across all documents in the batch, instead of calling `IndexBatch.New`, you could use the other static methods of `IndexBatch`. For example, you could create batches by calling `IndexBatch.Merge`, `IndexBatch.MergeOrUpload`, or `IndexBatch.Delete`. These methods take a collection of documents (objects of type `Hotel` in this example) instead of `IndexAction` objects.

## IV. Import data to the index
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

<a name="HotelClass"></a>
### How the .NET SDK handles documents

You may be wondering how the Azure Search .NET SDK is able to upload instances of a user-defined class like `Hotel` to the index. To help answer that question, let's look at the `Hotel` class, which maps to the index schema defined in [Create an Azure Search index using the .NET SDK](search-create-index-dotnet.md#DefineIndex):

```csharp
[SerializePropertyNamesAsCamelCase]
public partial class Hotel
{
    public string HotelId { get; set; }

    public double? BaseRate { get; set; }

    public string Description { get; set; }

    [JsonProperty("description_fr")]
    public string DescriptionFr { get; set; }

    public string HotelName { get; set; }

    public string Category { get; set; }

    public string[] Tags { get; set; }

    public bool? ParkingIncluded { get; set; }

    public bool? SmokingAllowed { get; set; }

    public DateTimeOffset? LastRenovationDate { get; set; }

    public int? Rating { get; set; }

    public GeographyPoint Location { get; set; }

    // ToString() method omitted for brevity...
}
```

The first thing to notice is that each public property of `Hotel` corresponds to a field in the index definition, but with one crucial difference: The name of each field starts with a lower-case letter ("camel case"), while the name of each public property of `Hotel` starts with an upper-case letter ("Pascal case"). This is a common scenario in .NET applications that perform data-binding where the target schema is outside the control of the application developer. Rather than having to violate the .NET naming guidelines by making property names camel-case, you can tell the SDK to map the property names to camel-case automatically with the `[SerializePropertyNamesAsCamelCase]` attribute.

> [AZURE.NOTE] The Azure Search .NET SDK uses the [NewtonSoft JSON.NET](http://www.newtonsoft.com/json/help/html/Introduction.htm) library to serialize and deserialize your custom model objects to and from JSON. You can customize this serialization if needed. You can find more details in [Upgrading to the Azure Search .NET SDK version 1.1](search-dotnet-sdk-migration.md#WhatsNew). One example of this is the use of the `[JsonProperty]` attribute on the `DescriptionFr` property in the sample code above.

The second important thing about the `Hotel` class are the data types of the public properties. The .NET types of these properties map to their equivalent field types in the index definition. For example, the `Category` string property maps to the `category` field, which is of type `DataType.String`. There are similar type mappings between `bool?` and `DataType.Boolean`, `DateTimeOffset?` and `DataType.DateTimeOffset`, etc. The specific rules for the type mapping are documented with the `Documents.Get` method on [MSDN](https://msdn.microsoft.com/library/azure/dn931291.aspx).

This ability to use your own classes as documents works in both directions; You can also retrieve search results and have the SDK automatically deserialize them to a type of your choice, as shown in the [next article](search-query-dotnet.md).

> [AZURE.NOTE] The Azure Search .NET SDK also supports dynamically-typed documents using the `Document` class, which is a key/value mapping of field names to field values. This is useful in scenarios where you don't know the index schema at design-time, or where it would be inconvenient to bind to specific model classes. All the methods in the SDK that deal with documents have overloads that work with the `Document` class, as well as strongly-typed overloads that take a generic type parameter. Only the latter are used in the sample code in this article. You can find out more about the `Document` class [on MSDN](https://msdn.microsoft.com/library/azure/microsoft.azure.search.models.document.aspx).

**An important note about data types**

When designing your own model classes to map to an Azure Search index, we recommend declaring properties of value types such as `bool` and `int` to be nullable (for example, `bool?` instead of `bool`). If you use a non-nullable property, you have to **guarantee** that no documents in your index contain a null value for the corresponding field. Neither the SDK nor the Azure Search service will help you to enforce this.

This is not just a hypothetical concern: Imagine a scenario where you add a new field to an existing index that is of type `DataType.Int32`. After updating the index definition, all documents will have a null value for that new field (since all types are nullable in Azure Search). If you then use a model class with a non-nullable `int` property for that field, you will get a `JsonSerializationException` like this when trying to retrieve documents:

    Error converting value {null} to type 'System.Int32'. Path 'IntValue'.

For this reason, we recommend that you use nullable types in your model classes as a best practice.

## Next
After populating your Azure Search index, you will be ready to start issuing queries to search for documents. See [Query Your Azure Search Index](search-query-overview.md) for details.
