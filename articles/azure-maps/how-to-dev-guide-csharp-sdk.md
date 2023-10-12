---
title: How to create Azure Maps applications using the C# REST SDK
titleSuffix: Azure Maps
description: How to develop applications that incorporate Azure Maps using the C# SDK Developers Guide.
author: sinnypan
ms.author: sipa
ms.date: 11/11/2021
ms.topic: how-to
ms.service: azure-maps
ms.custom: devx-track-dotnet
services: azure-maps
---

# C# REST SDK Developers Guide

The Azure Maps C# SDK supports functionality available in the Azure Maps [Rest API], like searching for an address, routing between different coordinates, and getting the geo-location of a specific IP address. This article introduces the C# REST SDK with examples to help you get started building location-aware applications in C# that incorporates the power of Azure Maps.

> [!NOTE]
> Azure Maps C# SDK supports any .NET version that is compatible with [.NET standard] version 2.0 or higher. For an interactive table, see [.NET Standard versions].

## Prerequisites

- [Azure Maps account].
- [Subscription key] or other form of [Authentication with Azure Maps].
- [.NET standard] version 2.0 or higher.

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

| Service name  | NuGet package           |  Samples     |
|---------------|-------------------------|--------------|
| [Search][search readme] | [Azure.Maps.Search][search package] | [search samples][search sample] |
| [Routing][routing readme] | [Azure.Maps.Routing][routing package] |  [routing samples][routing sample] |
| [Rendering][rendering readme]| [Azure.Maps.Rendering][rendering package]|[rendering sample][rendering sample] |
| [Geolocation][geolocation readme]|[Azure.Maps.Geolocation][geolocation package]|[geolocation sample][geolocation sample]|

## Create and authenticate a MapsSearchClient

The client object used to access the Azure Maps Search APIs require either an `AzureKeyCredential` object to authenticate when using an Azure Maps subscription key or a `TokenCredential` object with the Azure Maps client ID when authenticating using Microsoft Entra ID.  For more information on authentication, see [Authentication with Azure Maps].

<a name='using-an-azure-ad-credential'></a>

### Using a Microsoft Entra credential

You can authenticate with Microsoft Entra ID using the [Azure Identity library][Identity library .NET]. To use the [DefaultAzureCredential][defaultazurecredential.NET] provider, you need to install the Azure Identity client library for .NET:

```powershell
dotnet add package Azure.Identity 
```

You need to register the new Microsoft Entra application and grant access to Azure Maps by assigning the required role to your service principal. For more information, see [Host a daemon on non-Azure resources]. The Application (client) ID, a Directory (tenant) ID, and a client secret are returned. Copy these values and store them in a secure place. You need them in the following steps.

Set the values of the Application (client) ID, Directory (tenant) ID, and client secret of your Microsoft Entra application, and the map resource’s client ID as environment variables:

| Environment Variable | Description                                                   |
|----------------------|---------------------------------------------------------------|
| AZURE_CLIENT_ID      | Application (client) ID in your registered application        |
| AZURE_CLIENT_SECRET  | The value of the client secret in your registered application |
| AZURE_TENANT_ID      | Directory (tenant) ID in your registered application          |
| MAPS_CLIENT_ID       | The client ID in your Azure Map resource                      |

Now you can create environment variables in PowerShell to store these values:

```powershell
$Env:AZURE_CLIENT_ID="Application (client) ID"
$Env:AZURE_CLIENT_SECRET="your client secret"
$Env:AZURE_TENANT_ID="your Directory (tenant) ID"
$Env:MAPS_CLIENT_ID="your Azure Maps client ID"
```

After setting up the environment variables, you can use them in your program to instantiate the `AzureMapsSearch` client:

```csharp
using System;
using Azure.Identity; 
using Azure.Maps.Search; 

var credential = new DefaultAzureCredential(); 
var clientId = Environment.GetEnvironmentVariable("MAPS_CLIENT_ID"); 
var client = new MapsSearchClient(credential, clientId); 

```

> [!IMPORTANT]
> The other environment variables created in the previous code snippet, while not used in the code sample, are required by `DefaultAzureCredential()`. If you do not set these environment variables correctly, using the same naming conventions, you will get run-time errors. For example, if your `AZURE_CLIENT_ID` is missing or invalid you will get an `InvalidAuthenticationTokenTenant` error.

### Using a subscription key credential

You can authenticate with your Azure Maps subscription key. Your subscription key can be found in the **Authentication** section in the Azure Maps account as shown in the following screenshot:

:::image type="content" source="./media/rest-sdk-dev-guides/subscription-key.png" alt-text="A screenshot showing the subscription key in the Authentication section of an Azure Maps account." lightbox="./media/rest-sdk-dev-guides/subscription-key.png":::

Now you can create environment variables in PowerShell to store the subscription key:

```powershell
$Env:SUBSCRIPTION_KEY="your subscription key"
```

Once your environment variable is created, you can access it in your code:

```csharp
using System;
using Azure; 
using Azure.Maps.Search; 

// Use Azure Maps subscription key authentication 
var subscriptionKey = Environment.GetEnvironmentVariable("SUBSCRIPTION_KEY") ?? string.Empty;
var credential = new AzureKeyCredential(subscriptionKey);
var client = new MapsSearchClient(credential); 
```

### Fuzzy search an entity

The following code snippet demonstrates how, in a simple console application, to import the `Azure.Maps.Search` package and perform a fuzzy search on“Starbucks” near Seattle. In `Program.cs`:

```csharp
using System;
using Azure; 
using Azure.Core.GeoJson; 
using Azure.Maps.Search; 
using Azure.Maps.Search.Models; 

// Use Azure Maps subscription key authentication 
var subscriptionKey = Environment.GetEnvironmentVariable("SUBSCRIPTION_KEY") ?? string.Empty;
var credential = new AzureKeyCredential(subscriptionKey);
var client = new MapsSearchClient(credential); 

SearchAddressResult searchResult = client.FuzzySearch( 
    "Starbucks", new FuzzySearchOptions 
    { 
        Coordinates = new GeoPosition(-122.34255, 47.61010), 
        Language = SearchLanguage.EnglishUsa 
    }); 


// Print the search results 
foreach (var result in searchResult.Results) 
{ 
    Console.WriteLine($""" 
        * {result.Address.StreetNumber} {result.Address.StreetName} 
          {result.Address.Municipality} {result.Address.CountryCode} {result.Address.PostalCode} 
          Coordinate: ({result.Position.Latitude:F4}, {result.Position.Longitude:F4}) 
        """); 
} 
```

The above code snippet demonstrates how to create a `MapsSearchClient` object using your Azure credentials, then uses its [FuzzySearch] method, passing in the point of interest (POI) name "_Starbucks_" and coordinates _GeoPosition(-122.31, 47.61)_. The SDK packages and sends the results to the Azure Maps REST endpoints. When the search results are returned, they're written out to the screen using `Console.WriteLine`.

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
* 1912 Pike Place 
  Seattle US 98101 
  Coordinate: 47.61016, -122.34248 
* 2118 Westlake Avenue 
  Seattle US 98121 
  Coordinate: 47.61731, -122.33782 
* 2601 Elliott Avenue 
  Seattle US 98121 
  Coordinate: 47.61426, -122.35261 
* 1730 Howell Street 
  Seattle US 98101 
  Coordinate: 47.61716, -122.3298 
* 220 1st Avenue South 
  Seattle US 98104 
  Coordinate: 47.60027, -122.3338 
* 400 Occidental Avenue South 
  Seattle US 98104 
  Coordinate: 47.5991, -122.33278 
* 1600 East Olive Way 
  Seattle US 98102 
  Coordinate: 47.61948, -122.32505 
* 500 Mercer Street 
  Seattle US 98109 
  Coordinate: 47.62501, -122.34687 
* 505 5Th Ave S 
  Seattle US 98104 
  Coordinate: 47.59768, -122.32849 
* 425 Queen Anne Avenue North 
  Seattle US 98109 
  Coordinate: 47.62301, -122.3571 
```

## Search an address

Call the `SearchAddress` method to get the coordinate of an address. Modify the Main program from the sample as follows:

```csharp
// Use Azure Maps subscription key authentication 
var subscriptionKey = Environment.GetEnvironmentVariable("SUBSCRIPTION_KEY") ?? string.Empty;
var credential = new AzureKeyCredential(subscriptionKey);
var client = new MapsSearchClient(credential); 

SearchAddressResult searchResult = client.SearchAddress(
    "1301 Alaskan Way, Seattle, WA 98101, US");

if (searchResult.Results.Count > 0) 
{
    SearchAddressResultItem result = searchResult.Results.First(); 
    Console.WriteLine($"The Coordinate: ({result.Position.Latitude:F4}, {result.Position.Longitude:F4})"); 
}
```

The `SearchAddress` method returns results ordered by confidence score and since `searchResult.Results.First()` is used, only the coordinates of the first result are returned.

## Batch reverse search

Azure Maps Search also provides some batch query methods. These methods return Long Running Operations (LRO) objects. The requests might not return all the results immediately, so users can choose to wait until completion or query the result periodically. The following example demonstrates how to call the batched reverse search methods:

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

In the above example, two queries are passed to the batched reverse search request. To get the LRO results, you have few options. The first option is to pass `WaitUntil.Completed` to the method. The request waits until all requests are finished and return the results:

```csharp
// Wait until the LRO return batch results 
Response<ReverseSearchAddressBatchOperation> waitUntilCompletedResults = client.ReverseSearchAddressBatch(WaitUntil.Completed, queries); 

// Print the result addresses 
printReverseBatchAddresses(waitUntilCompletedResults.Value); 
```

Another option is to pass `WaitUntil.Started`. The request returns immediately, and you need to manually poll the results:

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

The third method requires the operation ID to get the results, which is cached on the server side for 14 days:

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
using system;
using Azure;
using Azure.Core.GeoJson;
using Azure.Maps.Search;
using Azure.Maps.Search.Models;

// Use Azure Maps subscription key authentication 
var subscriptionKey = Environment.GetEnvironmentVariable("SUBSCRIPTION_KEY") ?? string.Empty;
var credential = new AzureKeyCredential(subscriptionKey);
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

The [Azure.Maps Namespace] in the .NET documentation.

[.NET Standard versions]: https://dotnet.microsoft.com/platform/dotnet-standard#versions
[.NET standard]: /dotnet/standard/net-standard?tabs=net-standard-2-0
[Authentication with Azure Maps]: azure-maps-authentication.md
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Azure.Maps Namespace]: /dotnet/api/azure.maps
[defaultazurecredential.NET]: /dotnet/api/overview/azure/identity-readme#defaultazurecredential
[FuzzySearch]: /dotnet/api/azure.maps.search.mapssearchclient.fuzzysearch
[geolocation readme]: https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/maps/Azure.Maps.Geolocation/README.md
[geolocation sample]: https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/maps/Azure.Maps.Geolocation/samples
[geolocation package]: https://www.nuget.org/packages/Azure.Maps.geolocation
[Host a daemon on non-Azure resources]: ./how-to-secure-daemon-app.md#host-a-daemon-on-non-azure-resources
[Identity library .NET]: /dotnet/api/overview/azure/identity-readme
[rendering package]: https://www.nuget.org/packages/Azure.Maps.Rendering
[rendering readme]: https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/maps/Azure.Maps.Rendering/README.md
[rendering sample]: https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/maps/Azure.Maps.Rendering/samples
[Rest API]: /rest/api/maps/
[routing package]: https://www.nuget.org/packages/Azure.Maps.Routing
[routing readme]: https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/maps/Azure.Maps.Routing/README.md
[routing sample]: https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/maps/Azure.Maps.Routing/samples
[search package]: https://www.nuget.org/packages/Azure.Maps.Search
[search readme]: https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/maps/Azure.Maps.Search/README.md
[search sample]: https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/maps/Azure.Maps.Search/samples
[Subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
