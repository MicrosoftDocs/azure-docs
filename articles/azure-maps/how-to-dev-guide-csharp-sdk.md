---
title: How to create Azure Maps applications using the C# REST SDK
titleSuffix: Azure Maps
description: How to develop applications that incorporate Azure Maps using the C# SDK Developers Guide.
author: stevemunk
ms.author: v-munksteve
ms.date: 10/31/2021
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# C# REST SDK Developers Guide

The Azure Maps C# SDK supports all of the functionality provided in the [Azure Maps Rest API][Rest API], like searching for an address, routing between different coordinates, and getting the geo-location of a specific IP address. This article will help you get started building location-aware applications that incorporate the power of Azure Maps.

> [!NOTE]
> Azure Maps C# SDK supports any .NET version that is compatible with [.NET standard 2.0][.NET standard]. For an interactive table, see [.NET Standard versions][.NET Standard versions].

## Prerequisites

- [Azure Maps account][Azure Maps account].
- [Subscription key][Subscription key] or other form of [authentication][authentication].
- [.NET standard][.NET standard] version 2.0 or higher.

> [!TIP]
> You can create an Azure Maps account programmatically, Here's an example using the Azure CLI:
>
> ```azurecli
> az maps account create --kind "Gen2" --account-name "myMapAccountName" --resource-group "<resource group>" --sku "G2"
> ```

## Create a .NET project

The following PowerShell code snippet demonstrates how to use PowerShell to create a console program `MapsDemo` with .NET 7.0. You can use any .NET standard 2.0-compatible version as the framework.

```powershell
dotnet new console -lang C# -n MapsDemo -f net7.0 
cd MapsDemo 
```

### Install required packages

To use Azure Maps C# SDK, we need to install the required packages. Each of the Azure Maps services including search, routing, rendering and geolocation are each in their own package. Since the Azure Maps C# SDK is in public preview, you need to add the `--prerelease` flag:

```powershell
dotnet add package Azure.Maps.Rendering --prerelease
dotnet add package Azure.Maps.Routing --prerelease
dotnet add package Azure.Maps.Search --prerelease
dotnet add package Azure.Maps.Geolocation --prerelease
```

#### Azure Maps services

| Service Name  | NuGet package           |  Samples     |
|---------------|-------------------------|--------------|
| [Search][search readme] | [Azure.Maps.Search][search package] | [search samples][search sample] |
| [Routing][routing readme] | [Azure.Maps.Routing][routing package] |  [routing samples][routing sample] |
| [Rendering][rendering readme]| [Azure.Maps.Rendering][rendering package]|[rendering sample][rendering sample] |
| [Geolocation][geolocation readme]|[Azure.Maps.Geolocation][geolocation package]|[geolocation sample][geolocation sample]|

### Fuzzy search an entity

The following code snippet demonstrates how, in a simple console application, to import the `Azure.Maps.Search` package and perform a fuzzy search on“Starbucks” near Seattle. In `Program.cs`:

```csharp
using Azure; 
using Azure.Core.GeoJson; 
using Azure.Maps.Search; 
using Azure.Maps.Search.Models; 

// Use Azure Maps subscription key authentication 
var credential = new AzureKeyCredential("Azure_Maps_Subscription_key"); 
var client = new MapsSearchClient(credential); 

SearchAddressResult searchResult = client.FuzzySearch( 
    "Starbucks", new FuzzySearchOptions 
    { 
        Coordinates = new GeoPosition(-122.31, 47.61), 
        Language = SearchLanguage.EnglishUsa 
    }); 


// Print the search results 
foreach (var result in searchResult.Results) 
{ 
    Console.WriteLine($""" 
        * {result.PointOfInterest.Name} 
          {result.Address.StreetNumber} {result.Address.StreetName} 
          {result.Address.Municipality} {result.Address.CountryCode} {result.Address.PostalCode} 
          Coordinate: ({result.Position.Latitude:F4}, {result.Position.Longitude:F4}) 
        """); 
} 
```

In the above code snippet, you create a `MapsSearchClient` object using your Azure credentials, then use that Search Client's [FuzzySearch][FuzzySearch] method passing in the point of interest (POI) name "_Starbucks_" and coordinates _GeoPosition(-122.31, 47.61)_. This all gets wrapped up by the SDK and sent to the Azure Maps REST endpoints. When the search results are returned, they're written out to the screen using `Console.WriteLine`.

The following libraries are used:

1. `Azure.Maps.Search` is required for the `MapsSearchClient` class.
1. `Azure.Maps.Search.Models` is required for the `SearchAddressResult` class.
1. `Azure.Core.GeoJson` is required for the `GeoPosition` struct used by the `FuzzySearchOptions` class.

To run your application, go to the project folder and execute `dotnet run` in PowerShell:

```powershell
dotnet run 
```

You should see a list of Starbucks address and coordinate results:

```text
* Starbucks 
  1600, East Jefferson Street 
  Seattle US 98122 
  Coordinate: (47.6065, -122.3110) 
* Starbucks 
  800, 12th Avenue 
  Seattle US 98122
  Coordinate: (47.6093, -122.3165) 
* Starbucks 
  2201, East Madison Street 
  Seattle US 98112 
  Coordinate: (47.6180, -122.3036) 
* Starbucks
  101, Broadway East 
  Seattle US 98102 
  Coordinate: (47.6189, -122.3213) 
* Starbucks 
  2300, South Jackson Street 
  Seattle US 98144 
  Coordinate: (47.5995, -122.3020) 
* Starbucks 
  1600, East Olive Way 
  Seattle US 98102 
  Coordinate: (47.6195, -122.3251) 
* Starbucks 
  1730, Howell Street 
  Seattle US 98101 
  Coordinate: (47.6172, -122.3298) 
* Starbucks 
  505, 5Th Ave S 
  Seattle US 98104 
  Coordinate: (47.5977, -122.3285) 
* Starbucks 
  121, Lakeside Avenue South 
  Seattle US 98122 
  Coordinate: (47.6020, -122.2851) 
* Starbucks Regional Office 
  220, 1st Avenue South 
  Seattle US 98104 
  Coordinate: (47.6003, -122.3338) 
```

## Search an address

Call the `SearchAddress` method to get the coordinate of an address. Modify the Main program from the sample as follows:

```csharp
// Use Azure Maps subscription key authentication 
var credential = new AzureKeyCredential("Azure_Maps_Subscription_key");
var client = new MapsSearchClient(credential);

SearchAddressResult searchResult = client.SearchAddress(
    "1301 Alaskan Way, Seattle, WA 98101, US");

if (searchResult.Results.Count > 0) 
{
    SearchAddressResultItem result = searchResult.Results.First(); 
    Console.WriteLine($"The Coordinate: ({result.Position.Latitude:F4}, {result.Position.Longitude:F4})"); 
}
```

Results returned by the `SearchAddress` method are ordered by confidence score and because `searchResult.Results.First()` is used, only the coordinates of the first result will be returned.

## Batch reverse search

Azure Maps Search also provides some batch query methods. These methods will return Long Running Operations (LRO) objects. The requests might not return all the results immediately, so users can choose to wait until completion or query the result periodically. The example below demonstrates how to call the batched reverse search methods:

```csharp
var queries = new List<ReverseSearchAddressQuery>() 
{ 
    new ReverseSearchAddressQuery(new ReverseSearchOptions() 
    { 
        Coordinates = new GeoPosition(2.294911, 48.858561) 
    }), 
    new ReverseSearchAddressQuery(new ReverseSearchOptions() 
    { 
        Coordinates = new GeoPosition(-122.127896, 47.639765), 
        RadiusInMeters = 5000 
    }) 
};
```

In the above example, two queries are passed to the batched reverse search request. To get the LRO results, you have few options. The first option is to pass `WaitUntil.Completed` to the method. The request will wait until all requests are finished and return the results:

```csharp
// Wait until the LRO return batch results 
Response<ReverseSearchAddressBatchOperation> waitUntilCompletedResults = client.ReverseSearchAddressBatch(WaitUntil.Completed, queries); 

// Print the result addresses 
printReverseBatchAddresses(waitUntilCompletedResults.Value); 
```

Another option is to pass `WaitUntil.Started`. The request will return immediately, and you'll need to manually poll the results:

```csharp
// Manual polling the batch results 
Response<ReverseSearchAddressBatchOperation> manualPollingOperation = client.ReverseSearchAddressBatch(WaitUntil.Started, queries);

// Keep polling until we get the results
while (true)
{
    manualPollingOperation.Value.UpdateStatus();
    if (manualPollingOperation.Value.HasCompleted) break;
    Task.Delay(1000);
}
printReverseBatchAddresses(manualPollingOperation);
```

We can also call `WaitUntilCompletion()` to explicitly wait for the result:

```csharp
Response<ReverseSearchAddressBatchOperation> manualPollingResult = manualPollingResults.WaitUntilCompleted();

printReverseBatchAddresses(manualPollingResult.Value);
```

The third method requires the operation ID to get the results, which will be cached on the server side for 14 days:

```csharp
  ReverseSearchAddressBatchOperation longRunningOperation = client.ReverseSearchAddressBatch(WaitUntil.Started, queries);

  // Get batch results by ID 
  string operationId = longRunningOperation.Value.Id;

  // After the LRO completes, create a new operation
  // to get the results from the server
  ReverseSearchAddressBatchOperation newOperation = new ReverseSearchAddressBatchOperation(client, operationId);
  Response<ReverseSearchAddressBatchOperation> newOperationResult = newOperation.WaitForCompletion();

printReverseBatchAddresses(newOperationResult);
```

The complete code for reverse address batch search with operation ID:

```csharp
using Azure;
using Azure.Core.GeoJson;
using Azure.Maps.Search;
using Azure.Maps.Search.Models;

// Use Azure Maps subscription key authentication 
var credential = new AzureKeyCredential("Azure_Maps_Subscription_key");
var client = new MapsSearchClient(credential);

var queries = new List<ReverseSearchAddressQuery>()
{
    new ReverseSearchAddressQuery(new ReverseSearchOptions()
    {
        Coordinates = new GeoPosition(2.294911, 48.858561)
    }),
    new ReverseSearchAddressQuery(new ReverseSearchOptions()
    {
        Coordinates = new GeoPosition(-122.127896, 47.639765),
        RadiusInMeters = 5000
    })
};

// Manual polling the batch results
ReverseSearchAddressBatchOperation longRunningOperation = client.ReverseSearchAddressBatch(WaitUntil.Started, queries);

// Get batch results by ID
string operationId = longRunningOperation.Id;

// A few days later, create a new operation and get the result from server
ReverseSearchAddressBatchOperation newOperation = new ReverseSearchAddressBatchOperation(client, operationId);
Response<ReverseSearchAddressBatchResult> newOperationResult = newOperation.WaitForCompletion();
printReverseBatchAddresses(newOperationResult.Value);
void printReverseBatchAddresses(ReverseSearchAddressBatchResult batchResult)
{
    // Print the search results
    for (int i = 0; i < batchResult.Results.Count; i++)
    {
        Console.WriteLine($"Possible addresses for query {i}:");
        var result = batchResult.Results[i];
        foreach (var address in result.Addresses)
        {
            Console.WriteLine($"{address.Address.FreeformAddress}");
        }
    }
}
```

## Additional information

The [Azure.Maps Namespace][Azure.Maps Namespace] in the .NET documentation.

[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Subscription key]: quick-demo-map-app.md#get-the-primary-key-for-your-account

[authentication]: azure-maps-authentication.md
[.NET standard]: /dotnet/standard/net-standard?tabs=net-standard-2-0
[Rest API]: /rest/api/maps/
[.NET Standard versions]: https://dotnet.microsoft.com/platform/dotnet-standard#versions
[search package]: https://www.nuget.org/packages/Azure.Maps.Search
[search readme]: https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/maps/Azure.Maps.Search/README.md
[search sample]: https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/maps/Azure.Maps.Search/samples
[routing package]: https://www.nuget.org/packages/Azure.Maps.Routing
[routing readme]: https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/maps/Azure.Maps.Routing/README.md
[routing sample]: https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/maps/Azure.Maps.Routing/samples
[rendering package]: https://www.nuget.org/packages/Azure.Maps.Rendering
[rendering readme]: https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/maps/Azure.Maps.Rendering/README.md
[rendering sample]: https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/maps/Azure.Maps.Rendering/samples
[geolocation package]: https://www.nuget.org/packages/Azure.Maps.geolocation
[geolocation readme]: https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/maps/Azure.Maps.geolocation/README.md
[geolocation sample]: https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/maps/Azure.Maps.Geolocation/samples
[FuzzySearch]: /dotnet/api/azure.maps.search.mapssearchclient.fuzzysearch
[Azure.Maps Namespace]: /dotnet/api/azure.maps
