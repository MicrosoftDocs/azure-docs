---
title: Create an Azure Search index using the .NET SDK | Microsoft Docs
description: Create an index in code using the Azure Search .NET SDK.
services: search
documentationcenter: ''
author: brjohnstmsft
manager: jhubbard
editor: ''
tags: azure-portal

ms.assetid: 3a851647-fc7b-4fb6-8506-6aaa519e77cd
ms.service: search
ms.devlang: dotnet
ms.workload: search
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.date: 04/21/2017
ms.author: brjohnst

---
# Create an Azure Search index using the .NET SDK
> [!div class="op_single_selector"]
> * [Overview](search-what-is-an-index.md)
> * [Portal](search-create-index-portal.md)
> * [.NET](search-create-index-dotnet.md)
> * [REST](search-create-index-rest-api.md)
> 
> 

This article will walk you through the process of creating an Azure Search [index](https://docs.microsoft.com/rest/api/searchservice/Create-Index) using the [Azure Search .NET SDK](https://aka.ms/search-sdk).

Before following this guide and creating an index, you should have already [created an Azure Search service](search-create-service-portal.md).

> [!NOTE]
> All sample code in this article is written in C#. You can find the full source code [on GitHub](http://aka.ms/search-dotnet-howto). You can also read about the [Azure Search .NET SDK](search-howto-dotnet-sdk.md) for a more detailed walk through of the sample code.
>
>

## Identify your Azure Search service's admin api-key
Now that you have provisioned an Azure Search service, you are almost ready to issue requests against your service endpoint using the .NET SDK. First, you will need to obtain one of the admin api-keys that was generated for the search service you provisioned. The .NET SDK will send this api-key on every request to your service. Having a valid key establishes trust, on a per request basis, between the application sending the request and the service that handles it.

1. To find your service's api-keys, sign in to the [Azure portal](https://portal.azure.com/)
2. Go to your Azure Search service's blade
3. Click on the "Keys" icon

Your service will have *admin keys* and *query keys*.

* Your primary and secondary *admin keys* grant full rights to all operations, including the ability to manage the service, create and delete indexes, indexers, and data sources. There are two keys so that you can continue to use the secondary key if you decide to regenerate the primary key, and vice-versa.
* Your *query keys* grant read-only access to indexes and documents, and are typically distributed to client applications that issue search requests.

For the purposes of creating an index, you can use either your primary or secondary admin key.

<a name="CreateSearchServiceClient"></a>

## Create an instance of the SearchServiceClient class
To start using the Azure Search .NET SDK, you will need to create an instance of the `SearchServiceClient` class. This class has several constructors. The one you want takes your search service name and a `SearchCredentials` object as parameters. `SearchCredentials` wraps your api-key.

The code below creates a new `SearchServiceClient` using values for the search service name and api-key that are stored in the application's config file (`app.config` or `web.config`):

```csharp
string searchServiceName = ConfigurationManager.AppSettings["SearchServiceName"];
string adminApiKey = ConfigurationManager.AppSettings["SearchServiceAdminApiKey"];

SearchServiceClient serviceClient = new SearchServiceClient(searchServiceName, new SearchCredentials(adminApiKey));
```

`SearchServiceClient` has an `Indexes` property. This property provides all the methods you need to create, list, update, or delete Azure Search indexes.

> [!NOTE]
> The `SearchServiceClient` class manages connections to your search service. In order to avoid opening too many connections, you should try to share a single instance of `SearchServiceClient` in your application if possible. Its methods are thread-safe to enable such sharing.
> 
> 

<a name="DefineIndex"></a>

## Define your Azure Search index
A single call to the `Indexes.Create` method will create your index. This method takes as a parameter an `Index` object that defines your Azure Search index. You need to create an `Index` object and initialize it as follows:

1. Set the `Name` property of the `Index` object to the name of your index.
2. Set the `Fields` property of the `Index` object to an array of `Field` objects. The easiest way to create the `Field` objects is by calling the `FieldBuilder.BuildForType` method, passing a model class for the type parameter. A model class has properties that map to the fields of your index. This allows you to bind documents from your search index to instances of your model class.

> [!NOTE]
> If you don't plan to use a model class, you can still define your index by creating `Field` objects directly. You can provide the name of the field to the constructor, along with the data type (or analyzer for string fields). You can also set other properties like `IsSearchable`, `IsFilterable`, etc.
>
>

It is important that you keep your search user experience and business needs in mind when designing your index as each field must be assigned the [appropriate properties](https://docs.microsoft.com/rest/api/searchservice/Create-Index). These properties control which search features (filtering, faceting, sorting full-text search, etc.) apply to which fields. For any property you do not explicitly set, the `Field` class defaults to disabling the corresponding search feature unless you specifically enable it.

For our example, we've named our index "hotels" and defined our fields using a model class. Each property of the model class has attributes which determine the search-related behaviors of the corresponding index field. The model class is defined as follows:

```csharp
// The SerializePropertyNamesAsCamelCase attribute is defined in the Azure Search .NET SDK.
// It ensures that Pascal-case property names in the model class are mapped to camel-case
// field names in the index.
[SerializePropertyNamesAsCamelCase]
public partial class Hotel
{
    [Key]
    [IsFilterable]
    public string HotelId { get; set; }

    [IsFilterable, IsSortable, IsFacetable]
    public double? BaseRate { get; set; }

    [IsSearchable]
    public string Description { get; set; }

    [IsSearchable]
    [Analyzer(AnalyzerName.AsString.FrLucene)]
    [JsonProperty("description_fr")]
    public string DescriptionFr { get; set; }

    [IsSearchable, IsFilterable, IsSortable]
    public string HotelName { get; set; }

    [IsSearchable, IsFilterable, IsSortable, IsFacetable]
    public string Category { get; set; }

    [IsSearchable, IsFilterable, IsFacetable]
    public string[] Tags { get; set; }

    [IsFilterable, IsFacetable]
    public bool? ParkingIncluded { get; set; }

    [IsFilterable, IsFacetable]
    public bool? SmokingAllowed { get; set; }

    [IsFilterable, IsSortable, IsFacetable]
    public DateTimeOffset? LastRenovationDate { get; set; }

    [IsFilterable, IsSortable, IsFacetable]
    public int? Rating { get; set; }

    [IsFilterable, IsSortable]
    public GeographyPoint Location { get; set; }
}
```

We have carefully chosen the attributes for each property based on how we think they will be used in an application. For example, it is likely that people searching for hotels will be interested in keyword matches on the `description` field, so we enable full-text search for that field by adding the `IsSearchable` attribute to the `Description` property.

Please note that exactly one field in your index of type `string` must be the designated as the *key* field by adding the `Key` attribute (see `HotelId` in the above example).

The index definition above uses a language analyzer for the `description_fr` field because it is intended to store French text. See [the Language support topic](https://docs.microsoft.com/rest/api/searchservice/Language-support) as well as the corresponding [blog post](https://azure.microsoft.com/blog/language-support-in-azure-search/) for more information about language analyzers.

> [!NOTE]
> By default, the name of each property in your model class is used as the name of the corresponding field in the index. If you want to map all property names to camel-case field names, mark the class with the `SerializePropertyNamesAsCamelCase` attribute. If you want to map to a different name, you can use the `JsonProperty` attribute like the `DescriptionFr` property above. The `JsonProperty` attribute takes precedence over the `SerializePropertyNamesAsCamelCase` attribute.
> 
> 

Now that we've defined a model class, we can create an index definition very easily:

```csharp
var definition = new Index()
{
    Name = "hotels",
    Fields = FieldBuilder.BuildForType<Hotel>()
};
```

## Create the index
Now that you have an initialized `Index` object, you can create the index simply by calling `Indexes.Create` on your `SearchServiceClient` object:

```csharp
serviceClient.Indexes.Create(definition);
```

For a successful request, the method will return normally. If there is a problem with the request such as an invalid parameter, the method will throw `CloudException`.

When you're done with an index and want to delete it, just call the `Indexes.Delete` method on your `SearchServiceClient`. For example, this is how we would delete the "hotels" index:

```csharp
serviceClient.Indexes.Delete("hotels");
```

> [!NOTE]
> The example code in this article uses the synchronous methods of the Azure Search .NET SDK for simplicity. We recommend that you use the asynchronous methods in your own applications to keep them scalable and responsive. For example, in the examples above you could use `CreateAsync` and `DeleteAsync` instead of `Create` and `Delete`.
> 
> 

## Next steps
After creating an Azure Search index, you will be ready to [upload your content into the index](search-what-is-data-import.md) so you can start searching your data.

