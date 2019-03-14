---
title: 'Create an index in code using the .NET API - Azure Search'
description: Learn how to create a full text searchable index using the Azure Search .NET SDK and C# sample code.
author: brjohnstmsft
manager: jlembicz
tags: azure-portal
services: search
ms.service: search
ms.devlang: dotnet
ms.topic: quickstart
ms.date: 03/14/2019
ms.author: brjohnst
ms.custom: seodec2018

---
# Quickstart: Create, load, and query an Azure Search index using the .NET SDK
> [!div class="op_single_selector"]
> * [C#](search-create-index-dotnet.md)
> * [PowerShell (REST)](search-create-index-rest-api.md)
> * [Postman (REST)](search-fiddler.md)
> * [Portal](search-create-index-portal.md)
> 

This article will walk you through the process of creating, loading, and querying an Azure Search [index](what-is-an-index.md) using the [Azure Search .NET SDK](https://aka.ms/search-sdk).

> [!NOTE]
> All sample code in this article is written in C#. You can find the full source code [on GitHub](https://aka.ms/search-dotnet-howto). You can also read about the [Azure Search .NET SDK](search-howto-dotnet-sdk.md) for a more detailed walk through of the sample code.

## Prerequisites

+ [Create an Azure Search service](search-create-service-portal.md). You can use a free service for this quickstart.

+ [Visual Studio 2017](https://visualstudio.microsoft.com/downloads/), any edition. Sample code and instructions were tested on the free Community edition.

+ URL endpoint and admin api-key of your Search service. A search service is created with both, so if you added Azure Search to your subscription, follow these steps to get the necessary information:

    1. In the Azure portal, [find your service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) in the service list.

    2. In **Overview**, get the URL. An example endpoint might look like `https://my-service-name.search.windows.net`.

    3. In **Settings** > **Keys**, get an admin key for full rights on the service. There are two interchangeable admin keys, provided for business continuity in case you need to roll one over. You can use either the primary or secondary key on your request.

    ![Get an HTTP endpoint and access key](media/search-fiddler/get-url-key.png "Get an HTTP endpoint and access key")

    All requests require an api-key on every request sent to your service. Having a valid key establishes trust, on a per request basis, between the application sending the request and the service that handles it.

## 1 - Create a new project

In Visual Studio, create a new Visual C# project. A good template for this quickstart is Visual C# > Get started > Web App. This template gives you an appsettings.json file.  

In appsettings.json, replace the default content with the example below, and then provide the service name and admin api-key for your service. For the service name, you just need the name itself. For example, if your URL is https://mydemo.search.windows.net, add mydemo to the JSON file.


```json
{
    "SearchServiceName": "Put your search service name here",
    "SearchServiceAdminApiKey": "Put your primary or secondary API key here",
}
```

<a name="CreateSearchServiceClient"></a>

## 2 - Create an instance of the SearchServiceClient class
To start using the Azure Search .NET SDK, you will need to create an instance of the `SearchServiceClient` class. This class has several constructors. The one you want takes your search service name and a `SearchCredentials` object as parameters. `SearchCredentials` wraps your api-key.

Copy the following code into the Program.cs file. The code below creates a new `SearchServiceClient` using values for the search service name and api-key that are stored in the application's config file (appsettings.json).

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

## 3 - Define an index schema
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

## 4 - Create the index on the service
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

