<properties
    pageTitle="Create an Azure Search index using the .NET SDK | Microsoft Azure | Hosted cloud search service"
    description="Create an index in code using the Azure Search .NET SDK."
    services="search"
    documentationCenter=""
    authors="brjohnstmsft"
    manager=""
    editor=""
    tags="azure-portal"/>

<tags
    ms.service="search"
    ms.devlang="dotnet"
    ms.workload="search"
    ms.topic="get-started-article"
    ms.tgt_pltfrm="na"
    ms.date="05/31/2016"
    ms.author="brjohnst"/>

# Create an Azure Search index using the .NET SDK
> [AZURE.SELECTOR]
- [Overview](search-what-is-an-index.md)
- [Portal](search-create-index-portal.md)
- [.NET](search-create-index-dotnet.md)
- [REST](search-create-index-rest-api.md)


This article will walk you through the process of creating an Azure Search [index](https://msdn.microsoft.com/library/azure/dn798941.aspx) using the [Azure Search .NET SDK](https://msdn.microsoft.com/library/azure/dn951165.aspx).

Before following this guide and creating an index, you should have already [created an Azure Search service](search-create-service-portal.md).

Note that all sample code in this article is written in C#. You can find the full source code [on GitHub](http://aka.ms/search-dotnet-howto).

## I. Identify your Azure Search service's admin api-key
Now that you have provisioned an Azure Search service, you are almost ready to issue requests against your service endpoint using the .NET SDK. First, you will need to obtain one of the admin api-keys that was generated for the search service you provisioned. The .NET SDK will send this api-key on every request to your service. Having a valid key establishes trust, on a per request basis, between the application sending the request and the service that handles it.

1. To find your service's api-keys you must log into the [Azure Portal](https://portal.azure.com/)
2. Go to your Azure Search service's blade
3. Click on the "Keys" icon

Your service will have *admin keys* and *query keys*.

  - Your primary and secondary *admin keys* grant full rights to all operations, including the ability to manage the service, create and delete indexes, indexers, and data sources. There are two keys so that you can continue to use the secondary key if you decide to regenerate the primary key, and vice-versa.
  - Your *query keys* grant read-only access to indexes and documents, and are typically distributed to client applications that issue search requests.

For the purposes of creating an index, you can use either your primary or secondary admin key.

<a name="CreateSearchServiceClient"></a>
## II. Create an instance of the SearchServiceClient class
To start using the Azure Search .NET SDK, you will need to create an instance of the `SearchServiceClient` class. This class has several constructors. The one you want takes your search service name and a `SearchCredentials` object as parameters. `SearchCredentials` wraps your api-key.

The code below creates a new `SearchServiceClient` using values for the search service name and api-key that are stored in the application's config file (`app.config` or `web.config`):

```csharp
string searchServiceName = ConfigurationManager.AppSettings["SearchServiceName"];
string adminApiKey = ConfigurationManager.AppSettings["SearchServiceAdminApiKey"];

SearchServiceClient serviceClient = new SearchServiceClient(searchServiceName, new SearchCredentials(adminApiKey));
```

`SearchServiceClient` has an `Indexes` property. This property provides all the methods you need to create, list, update, or delete Azure Search indexes.

> [AZURE.NOTE] The `SearchServiceClient` class manages connections to your search service. In order to avoid opening too many connections, you should try to share a single instance of `SearchServiceClient` in your application if possible. Its methods are thread-safe to enable such sharing.

<a name="DefineIndex"></a>
## III. Define your Azure Search index using the `Index` class
A single call to the `Indexes.Create` method will create your index. This method takes as a parameter an `Index` object that defines your Azure Search index. You need to create an `Index` object and initialize it as follows:

1. Set the `Name` property of the `Index` object to the name of your index.
2. Set the `Fields` property of the `Index` object to an array of `Field` objects. Each of the `Field` objects defines the behavior of a field in your index. You can provide the name of the field to the constructor, along with the data type (or analyzer for string fields). You can also set other properties like `IsSearchable`, `IsFilterable`, etc.

It is important that you keep your search user experience and business needs in mind when designing your index as each `Field` must be assigned the [appropriate properties](https://msdn.microsoft.com/library/azure/dn798941.aspx). These properties control which search features (filtering, faceting, sorting full-text search, etc.) apply to which fields. For any property you do not explicitly set, the `Field` class defaults to disabling the corresponding search feature unless you specifically enable it.

For our example, we've named our index "hotels" and defined our fields as follows:

```csharp
var definition = new Index()
{
    Name = "hotels",
    Fields = new[]
    {
        new Field("hotelId", DataType.String)                       { IsKey = true, IsFilterable = true },
        new Field("baseRate", DataType.Double)                      { IsFilterable = true, IsSortable = true, IsFacetable = true },
        new Field("description", DataType.String)                   { IsSearchable = true },
        new Field("description_fr", AnalyzerName.FrLucene),
        new Field("hotelName", DataType.String)                     { IsSearchable = true, IsFilterable = true, IsSortable = true },
        new Field("category", DataType.String)                      { IsSearchable = true, IsFilterable = true, IsSortable = true, IsFacetable = true },
        new Field("tags", DataType.Collection(DataType.String))     { IsSearchable = true, IsFilterable = true, IsFacetable = true },
        new Field("parkingIncluded", DataType.Boolean)              { IsFilterable = true, IsFacetable = true },
        new Field("smokingAllowed", DataType.Boolean)               { IsFilterable = true, IsFacetable = true },
        new Field("lastRenovationDate", DataType.DateTimeOffset)    { IsFilterable = true, IsSortable = true, IsFacetable = true },
        new Field("rating", DataType.Int32)                         { IsFilterable = true, IsSortable = true, IsFacetable = true },
        new Field("location", DataType.GeographyPoint)              { IsFilterable = true, IsSortable = true }
    }
};
```

We have carefully chosen the property values for each `Field` based on how we think they will be used in an application. For example, it is likely that people searching for hotels will be interested in keyword matches on the `description` field, so we enable full-text search for that field by setting `IsSearchable` to `true`.

Please note that exactly one field in your index of type `DataType.String` must be the designated as the _key_ field by setting `IsKey` to `true` (see `hotelId` in the above example).

The index definition above uses a custom language analyzer for the `description_fr` field because it is intended to store French text. See [the Language support topic on MSDN](https://msdn.microsoft.com/library/azure/dn879793.aspx) as well as the corresponding [blog post](https://azure.microsoft.com/blog/language-support-in-azure-search/) for more information about language analyzers.

> [AZURE.NOTE]  Note that by passing `AnalyzerName.FrLucene` in the constructor, the `Field` will automatically be of type `DataType.String` and will have `IsSearchable` set to `true`.

## IV. Create the index
Now that you have an initialized `Index` object, you can create the index simply by calling `Indexes.Create` on your `SearchServiceClient` object:

```csharp
serviceClient.Indexes.Create(definition);
```

For a successful request, the method will return normally. If there is a problem with the request such as an invalid parameter, the method will throw `CloudException`.

When you're done with an index and want to delete it, just call the `Indexes.Delete` method on your `SearchServiceClient`. For example, this is how we would delete the "hotels" index:

```csharp
serviceClient.Indexes.Delete("hotels");
```

> [AZURE.NOTE] The example code in this article uses the synchronous methods of the Azure Search .NET SDK for simplicity. We recommend that you use the asynchronous methods in your own applications to keep them scalable and responsive. For example, in the examples above you could use `CreateAsync` and `DeleteAsync` instead of `Create` and `Delete`.

## Next
After creating an Azure Search index, you will be ready to [upload your content into the index](search-what-is-data-import.md) so you can start searching your data.
