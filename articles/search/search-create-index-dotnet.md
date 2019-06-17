---
title: 'Quickstart: Create an index in a C# console application - Azure Search'
description: Learn how to create a full text searchable index in C# using the Azure Search .NET SDK.
author: heidisteen
manager: cgronlun
ms.author: heidist
tags: azure-portal
services: search
ms.service: search
ms.devlang: dotnet
ms.topic: quickstart
ms.date: 05/16/2019

---
# Quickstart: 1 - Create an Azure Search index in C#
> [!div class="op_single_selector"]
> * [C#](search-create-index-dotnet.md)
> * [Portal](search-get-started-portal.md)
> * [PowerShell](search-howto-dotnet-sdk.md)
> * [Python](search-get-started-python.md)
> * [Postman](search-fiddler.md)
>*

This article walks you through the process of creating [an Azure Search index](search-what-is-an-index.md) using C# and the [.NET SDK](https://aka.ms/search-sdk). This quickstart is the first lesson in a three-part exercise for creating, loading, and query an index. Index creation is accomplished by performing these tasks:

> [!div class="checklist"]
> * Create a [`SearchServiceClient`](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.searchserviceclient?view=azure-dotnet) object to connect to a search service.
> * Create an [`Index`](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.index?view=azure-dotnet) object to pass as a parameter to `Indexes.Create`.
> * Call the `Indexes.Create` method on `SearchServiceClient` to send the `Index` to a service.

## Prerequisites

The following services, tools, and data are used in this quickstart. 

+ [Create an Azure Search service](search-create-service-portal.md) or [find an existing service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use a free service for this quickstart.

[Visual Studio 2019](https://visualstudio.microsoft.com/downloads/), any edition. Sample code and instructions were tested on the free Community edition.

+ [DotNetHowTo](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowTo) provides the sample solution, a .NET Core console application written in C#, located in the Azure samples GitHub repository. Download and extract the solution. By default, solutions are read-only. Right-click the solution and clear the read-only attribute so that you can modify files. Data is included in the solution.

## Get a key and URL

Calls to the service require a URL endpoint and an access key on every request. A search service is created with both, so if you added Azure Search to your subscription, follow these steps to get the necessary information:

1. [Sign in to the Azure portal](https://portal.azure.com/), and in your search service **Overview** page, get the URL. An example endpoint might look like `https://mydemo.search.windows.net`.

2. In **Settings** > **Keys**, get an admin key for full rights on the service. There are two interchangeable admin keys, provided for business continuity in case you need to roll one over. You can use either the primary or secondary key on requests for adding, modifying, and deleting objects.

![Get an HTTP endpoint and access key](media/search-fiddler/get-url-key.png "Get an HTTP endpoint and access key")

All requests require an api-key on every request sent to your service. Having a valid key establishes trust, on a per request basis, between the application sending the request and the service that handles it.

## 1 - Configure and build

1. Open the **DotNetHowTo.sln** file in Visual Studio.

1. In appsettings.json, replace the default content with the example below, and then provide the service name and admin api-key for your service. 

   ```json
   {
       "SearchServiceName": "Put your search service name here (not the full URL)",
       "SearchServiceAdminApiKey": "Put your primary or secondary API key here",
    }
   ```
   For the service name, you just need the name itself. For example, if your URL is https://mydemo.search.windows.net, add `mydemo` to the JSON file.

1. Press F5 to build the solution and run the console app. The remaining steps in this exercise and those steps that follow are an exploration of how this code works. 

Alternatively, you can refer to [How to use Azure Search from a .NET Application](search-howto-dotnet-sdk.md) for more detailed coverage of the SDK behaviors. 

<a name="CreateSearchServiceClient"></a>

## 2 - Create a client

To start using the Azure Search .NET SDK, create an instance of the `SearchServiceClient` class. This class has several constructors. The one you want takes your search service name and a `SearchCredentials` object as parameters. `SearchCredentials` wraps your api-key.

The following code can be found in the Program.cs file. It creates a new `SearchServiceClient` using values for the search service name and api-key that are stored in the application's config file (appsettings.json).

```csharp
private static SearchServiceClient CreateSearchServiceClient(IConfigurationRoot configuration)
{
    string searchServiceName = configuration["SearchServiceName"];
    string adminApiKey = configuration["SearchServiceAdminApiKey"];

    SearchServiceClient serviceClient = new SearchServiceClient(searchServiceName, new SearchCredentials(adminApiKey));
    return serviceClient;
}
```

`SearchServiceClient` has an `Indexes` property. This property provides all the methods you need to create, list, update, or delete Azure Search indexes.

> [!NOTE]
> The `SearchServiceClient` class manages connections to your search service. In order to avoid opening too many connections, you should try to share a single instance of `SearchServiceClient` in your application if possible. Its methods are thread-safe to enable such sharing.
> 
> 

<a name="DefineIndex"></a>

## 3 - Construct Index
A single call to the `Indexes.Create` method creates an index. This method takes as a parameter an `Index` object that defines an Azure Search index. Create an `Index` object and initialize it as follows:

1. Set the `Name` property of the `Index` object to the name of your index.

2. Set the `Fields` property of the `Index` object to an array of `Field` objects. The easiest way to create the `Field` objects is by calling the `FieldBuilder.BuildForType` method, passing a model class for the type parameter. A model class has properties that map to the fields of your index. This mapping allows you to bind documents from your search index to instances of your model class.

> [!NOTE]
> If you don't plan to use a model class, you can still define your index by creating `Field` objects directly. You can provide the name of the field to the constructor, along with the data type (or analyzer for string fields). You can also set other properties like `IsSearchable`, `IsFilterable`, to name a few.
>
>

It is important that you keep your search user experience and business needs in mind when designing your index. Each field must be assigned the [attributes](https://docs.microsoft.com/rest/api/searchservice/Create-Index) that control which search features (filtering, faceting, sorting, and so forth) apply to which fields. For any property you do not explicitly set, the `Field` class defaults to disabling the corresponding search feature unless you specifically enable it.

In this example, the index name is "hotels" and fields are defined using a model class. Each property of the model class has attributes that determine the search-related behaviors of the corresponding index field. The model class is defined as follows:

```csharp
using System;
using Microsoft.Azure.Search;
using Microsoft.Azure.Search.Models;
using Microsoft.Spatial;
using Newtonsoft.Json;

// The SerializePropertyNamesAsCamelCase attribute is defined in the Azure Search .NET SDK.
// It ensures that Pascal-case property names in the model class are mapped to camel-case
// field names in the index.
[SerializePropertyNamesAsCamelCase]
public partial class Hotel
{
    [System.ComponentModel.DataAnnotations.Key]
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

Note that exactly one field in your index of type `string` must be the designated as the *key* field by adding the `Key` attribute (see `HotelId` in the above example).

The index definition above uses a language analyzer for the `description_fr` field because it is intended to store French text. For more information, see [Add language analyzers to an Azure Search index](index-add-language-analyzers.md).

> [!NOTE]
> By default, the name of each property in your model class corresponds to the field name in the index. If you want to map all property names to camel-case field names, mark the class with the `SerializePropertyNamesAsCamelCase` attribute. If you want to map to a different name, you can use the `JsonProperty` attribute like the `DescriptionFr` property above. The `JsonProperty` attribute takes precedence over the `SerializePropertyNamesAsCamelCase` attribute.
> 
> 

Now that we've defined a model class, we can create an index definition easily:

```csharp
var definition = new Index()
{
    Name = "hotels",
    Fields = FieldBuilder.BuildForType<Hotel>()
};
```

## 4 - Call Indexes.Create
Now that you have an initialized `Index` object, create the index by calling `Indexes.Create` on your `SearchServiceClient` object:

```csharp
serviceClient.Indexes.Create(definition);
```

For a successful request, the method will return normally. If there is a problem with the request such as an invalid parameter, the method will throw `CloudException`.

When you're done with an index and want to delete it, call the `Indexes.Delete` method on your `SearchServiceClient`. For example:

```csharp
serviceClient.Indexes.Delete("hotels");
```

> [!NOTE]
> The example code in this article uses the synchronous methods of the Azure Search .NET SDK for simplicity. We recommend that you use the asynchronous methods in your own applications to keep them scalable and responsive. For example, in the examples above you could use `CreateAsync` and `DeleteAsync` instead of `Create` and `Delete`.
> 
> 

## Next steps
In this quickstart, you created an empty Azure Search index based on a schema that defines field data types and behaviors. The index is a "bare bones" index consisting of a name and a collection of attributed fields. A more realistic index would include other elements, such as [scoring profiles](index-add-scoring-profiles.md), [suggesters](index-add-suggesters.md) for typeahead  support, [synonyms](search-synonyms.md), and possibly [custom analyzers](index-add-custom-analyzers.md). We recommend that you revisit these capabilities after you understand the basic workflow.

The next quickstart in this series covers how to load the index with searchable content.

> [!div class="nextstepaction"]
> [Load data to an Azure Search index using C#](search-import-data-dotnet.md)
