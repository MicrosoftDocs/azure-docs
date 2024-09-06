---
title: How to create Azure Maps applications using the C# REST SDK
titleSuffix: Azure Maps
description: How to develop applications that incorporate Azure Maps using the C# SDK Developers Guide.
author: sinnypan
ms.author: sipa
ms.date: 08/27/2024
ms.topic: how-to
ms.service: azure-maps
ms.subservice: rest-sdk
ms.custom: devx-track-dotnet
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

:::image type="content" border="false" source="./media/shared/get-key.png" alt-text="Screenshot showing your Azure Maps subscription key in the Azure portal." lightbox="./media/shared/get-key.png":::

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
## Geocode an address

Call the `GetGeocoding` method to get the coordinate of an address.

```csharp
using System;
using Azure; 
using Azure.Maps.Search; 
using Azure.Maps.Search.Models;

// Use Azure Maps subscription key authentication 
var subscriptionKey = Environment.GetEnvironmentVariable("SUBSCRIPTION_KEY") ?? string.Empty;
var credential = new AzureKeyCredential(subscriptionKey);
var client = new MapsSearchClient(credential); 

Response<GeocodingResponse> searchResult = client.GetGeocoding(
    "1 Microsoft Way, Redmond, WA 98052");

for (int i = 0; i < searchResult.Value.Features.Count; i++)
{
    Console.WriteLine("Coordinate:" + string.Join(",", searchResult.Value.Features[i].Geometry.Coordinates));
}
```

## Batch geocode addresses

This sample demonstrates how to perform batch search address.

```csharp
using System;
using Azure; 
using Azure.Maps.Search; 
using System.Collections.Generic;
using Azure.Maps.Search.Models;
using Azure.Maps.Search.Models.Queries;

// Use Azure Maps subscription key authentication 
var subscriptionKey = Environment.GetEnvironmentVariable("SUBSCRIPTION_KEY") ?? string.Empty;
var credential = new AzureKeyCredential(subscriptionKey);
var client = new MapsSearchClient(credential); 

List<GeocodingQuery> queries = new List<GeocodingQuery>
{
    new GeocodingQuery()
    {
        Query ="15171 NE 24th St, Redmond, WA 98052, United States"
    },
    new GeocodingQuery()
    {
        AddressLine = "400 Broad St"
    },
};
Response<GeocodingBatchResponse> results = client.GetGeocodingBatch(queries);

//Print coordinates
for (var i = 0; i < results.Value.BatchItems.Count; i++)
{
    for (var j = 0; j < results.Value.BatchItems[i].Features.Count; j++)
    {
        Console.WriteLine("Coordinates: " + string.Join(",", results.Value.BatchItems[i].Features[j].Geometry.Coordinates));
    }
}
```

## Reverse geocode a coordinates

You can translate coordinates into human-readable street addresses. This process is also called reverse geocoding. 

```csharp
using System;
using Azure; 
using Azure.Maps.Search; 
using Azure.Core.GeoJson;
using Azure.Maps.Search.Models;

// Use Azure Maps subscription key authentication 
var subscriptionKey = Environment.GetEnvironmentVariable("SUBSCRIPTION_KEY") ?? string.Empty;
var credential = new AzureKeyCredential(subscriptionKey);
var client = new MapsSearchClient(credential); 

GeoPosition coordinates = new GeoPosition(-122.138685, 47.6305637);
Response<GeocodingResponse> result = client.GetReverseGeocoding(coordinates);

//Print addresses
for (int i = 0; i < result.Value.Features.Count; i++)
{
    Console.WriteLine(result.Value.Features[i].Properties.Address.FormattedAddress);
}
```

## Batch reverse geocode a set of coordinates

Azure Maps Search also provides some batch query APIs. The Reverse Geocoding Batch API sends batches of queries to [Reverse Geocoding API](/rest/api/maps/search/get-reverse-geocoding) using just a single API call. The API allows caller to batch up to **100** queries.

```csharp
using System;
using Azure; 
using Azure.Maps.Search; 
using System.Collections.Generic;
using Azure.Core.GeoJson;
using Azure.Maps.Search.Models;
using Azure.Maps.Search.Models.Queries;

// Use Azure Maps subscription key authentication 
var subscriptionKey = Environment.GetEnvironmentVariable("SUBSCRIPTION_KEY") ?? string.Empty;
var credential = new AzureKeyCredential(subscriptionKey);
var client = new MapsSearchClient(credential);

List<ReverseGeocodingQuery> items = new List<ReverseGeocodingQuery>
{
    new ReverseGeocodingQuery()
    {
        Coordinates = new GeoPosition(-122.349309, 47.620498)
    },
    new ReverseGeocodingQuery()
    {
        Coordinates = new GeoPosition(-122.138679, 47.630356),
        ResultTypes = new List<ReverseGeocodingResultTypeEnum>(){ ReverseGeocodingResultTypeEnum.Address, ReverseGeocodingResultTypeEnum.Neighborhood }
    },
};
Response<GeocodingBatchResponse> result = client.GetReverseGeocodingBatch(items);
//Print addresses
for (var i = 0; i < result.Value.BatchItems.Count; i++)
{
    Console.WriteLine(result.Value.BatchItems[i].Features[0].Properties.Address.AddressLine);
    Console.WriteLine(result.Value.BatchItems[i].Features[0].Properties.Address.Neighborhood);
}
```

## Get polygons for a given location

This sample demonstrates how to search polygons.

```csharp
using System;
using Azure; 
using Azure.Maps.Search; 
using Azure.Core.GeoJson;
using Azure.Maps.Search.Models;
using Azure.Maps.Search.Models.Options;

// Use Azure Maps subscription key authentication 
var subscriptionKey = Environment.GetEnvironmentVariable("SUBSCRIPTION_KEY") ?? string.Empty;
var credential = new AzureKeyCredential(subscriptionKey);
var client = new MapsSearchClient(credential);

GetPolygonOptions options = new GetPolygonOptions()
{
    Coordinates = new GeoPosition(-122.204141, 47.61256),
    ResultType = BoundaryResultTypeEnum.Locality,
    Resolution = ResolutionEnum.Small,
};
Response<Boundary> result = client.GetPolygon(options);

var count = ((GeoJsonPolygon)((GeoJsonGeometryCollection)result.Value.Geometry).Geometries[0]).Coordinates.Count;
for (var i = 0; i < count; i++)
{
    var coorCount = ((GeoJsonPolygon)((GeoJsonGeometryCollection)result.Value.Geometry).Geometries[0]).Coordinates[i].Count;
    for (var j = 0; j < coorCount; j++)
    {
        Console.WriteLine(string.Join(",",((GeoJsonPolygon)((GeoJsonGeometryCollection)result.Value.Geometry).Geometries[0]).Coordinates[i][j]));
    }
}
```

## Using V1 SDKs for Search and Render

For more information on using Search v1, see [Azure Maps Search client library for .NET](https://www.nuget.org/packages/Azure.Maps.Search/1.0.0-beta.5). For more information on using Render v1, see [Azure Maps Render client library for .NET](https://www.nuget.org/packages/Azure.Maps.Rendering/1.0.0-beta.3).

## Additional information

The [Azure.Maps Namespace] in the .NET documentation.

[.NET Standard versions]: https://dotnet.microsoft.com/platform/dotnet-standard#versions
[.NET standard]: /dotnet/standard/net-standard?tabs=net-standard-2-0
[Authentication with Azure Maps]: azure-maps-authentication.md
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Azure.Maps Namespace]: /dotnet/api/azure.maps
[defaultazurecredential.NET]: /dotnet/api/overview/azure/identity-readme#defaultazurecredential
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
