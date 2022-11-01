---
title: How to create Azure Maps applications using the JavaScript REST SDK
titleSuffix: Azure Maps
description: How to develop applications that incorporate Azure Maps using the JavaScript SDK Developers Guide.
author: stevemunk
ms.author: v-munksteve
ms.date: 10/31/2021
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# JavaScript REST SDK Developers Guide

The Azure Maps JavaScript SDK supports searching using the [Azure Maps search Rest API][search], like searching for an address, fuzzy searching for a point of interest (POI), and searching by coordinates. This article will help you get started building location-aware applications that incorporate the power of Azure Maps.

> [!NOTE]
> Azure Maps JavaScript SDK supports the LTS version of Node.js. For more information, see [Node.js Release Working Group][Node.js Release Working Group].

## Prerequisites

- [Azure Maps account][Azure Maps account].
- [Subscription key][Subscription key] or other form of [authentication][authentication].
- [Node.js][Node.js].

> [!TIP]
> You can create an Azure Maps account programmatically, Here's an example using the Azure CLI:
>
> ```azurecli
> az maps account create --kind "Gen2" --account-name "myMapAccountName" --resource-group "<resource group>" --sku "G2"
> ```

## Install the search package

To use Azure Maps JavaScript SDK, you will need to install the search package. Each of the Azure Maps services including search, routing, rendering and geolocation are each in their own package.

```bash
npm install @azure/maps-search
```

Once the package is installed, create a `search.js` file in the `mapsDemo` directory:

```text
mapsDemo
+-- package.json
+-- package-lock.json
+-- node_modules/
+-- search.js
```

### Azure Maps search service

| Service Name  | NuGet package           |  Samples     |
|---------------|-------------------------|--------------|
| [Search][search readme] | [Azure.Maps.Search][search package] | [search samples][search sample] |

## Create a Node.js project

The example below creates a new directory then a Node.js program named _mapsDemo_ using NPM:

```bash
mkdir mapsDemo
cd mapsDemo
npm init
```

## Create and authenticate a MapsSearchClient

You will need a `credential` object for authentication when creating the `MapsSearchClient` object used to access the Azure Maps search APIs. You can use either an Azure Active Directory (Azure AD) credential or an Azure subscription key to authenticate. For more information on authentication, see [Authentication with Azure Maps][authentication].

> [!TIP]
> The`MapsSearchClient` is the primary interface for developers using the Azure Maps search library. See [search][search] in the REST API documentation to learn more about the search methods available.

### Using an Azure AD credential

You can authenticate with Azure AD using the [Azure Identity library][Azure Identity library]. To use the [DefaultAzureCredential][defaultazurecredential] provider you will need to install the `@azure/identity` package:

```bash
npm install @azure/identity
```

You will need to register the new Azure AD application and grant access to Azure Maps by assigning the required role to your service principal. For more information, see [Host a daemon on non-Azure resources][Host a daemon on non-Azure resources]. During this process you will get an Application (client) ID, a Directory (tenant) ID, and a client secret. Copy these values and store them in a secure place. You will need them in the following steps.

Set the values of the Application (client)client ID, Directory (tenant) ID, and client secret of your Azure AD application, and the map resource’s client ID as environment variables:

| Environment Variable  | Description                                                     |
|-----------------------|-----------------------------------------------------------------|
| AZURE_CLIENT_ID       | Application (client) ID in your registered application          |
| AZURE_CLIENT_SECRET   | The value of the client secret in your registered application   |
| AZURE_TENANT_ID       | Directory (tenant) ID in your registered application            |
| MAPS_CLIENT_ID        | The client ID in your Azure Map account                         |

You can use a `.env` file for these variables. You will need to install the [dotenv][dotenv] package to do this:

```bash
npm install dotenv
```

Next, add a `.env` file in the **mapsDemo** directory and specify these properties:

```text
AZURE_CLIENT_ID="<client-id>"
AZURE_CLIENT_SECRET="<client-secret>"
AZURE_TENANT_ID="<tenant-id>"
MAPS_CLIENT_ID="<maps-client-id>"
```

Once your environent variables are created, you can access them in your JavaScript code:

```JavaScript
const { MapsSearchClient } = require("@azure/maps-search"); 
const { DefaultAzureCredential } = require("@azure/identity"); 
require("dotenv").config(); 
 
const credential = new DefaultAzureCredential(); 
const client = new MapsSearchClient(credential, process.env.MAPS_CLIENT_ID); 
```

### Using a subscription key credential

You can authenticate with your Azure Maps subscription key. Your subscription key can be found in the **Authentication** section in the Azure Maps account (see previous screenshot).

```javascript
const { MapsSearchClient, AzureKeyCredential } = require("@azure/maps-search");

const credential = new AzureKeyCredential("<subscription-key>");
const client = new MapsSearchClient(credential);
```




```bash
npm install @azure/identity
```

You will also need to register a new Azure AD application and grant access to Azure Maps by assigning the suitable role to your service principal. For more information, see [Manage authentication in Azure Maps](how-to-manage-authentication.md).

Set the values of the client ID, tenant ID, and client secret of the AAD application as environment variables: AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_CLIENT_SECRET. 
We suggest using a .env file to handle these variables. To expose the variables in .env file, we need to install dotenv package:

```bash
npm install dotenv
```

Under `mapsDemo/` add a `.env` file and specify the properties:

```text
AZURE_CLIENT_ID="<client-id>"
AZURE_CLIENT_SECRET="<client-secret>"
AZURE_TENANT_ID="<tenant-id>"
MAPS_CLIENT_ID="<maps-client-id>"
```

You will also need to specify the Azure Maps resource you intend to use by specifying the MAPS_CLIENT_ID in the client options. The Azure Maps resource client id can be found in the Authentication sections in the Azure Maps resource. Please refer to the Manage Authentication Documentation on how to find it.
After setting up the environment variables, we’re good to go:

```JavaScript
const { MapsSearchClient } = require("@azure/maps-search");
const { DefaultAzureCredential } = require("@azure/identity");
require("dotenv").config();

const credential = new DefaultAzureCredential();
const client = new MapsSearchClient(credential, process.env.MAPS_CLIENT_ID);
```

Using a Subscription Key Credential
You can authenticate with your Azure Maps Subscription Key. You can find your subscription key following Manage Authentication Documentation.
You need to feed the subscription key to the `AzureKeyCredential` class provided by the @azure/maps-search SDK. For security reasons, we suggest specifying the key in the environment variable. To expose the variables in .env, we need to install dotenv package:

```poweshell
npm install dotenv
```

Under `mapsDemo/` add a `.env` file and specify the property:

```text
MAPS_SUBSCRIPTION_KEY="<subscription-key>"
```

Once the environment variable is ready, we’re good to go.

```JavaScript
const { MapsSearchClient, AzureKeyCredential } = require("@azure/maps-search");
require("dotenv").config();

const credential = new AzureKeyCredential(process.env.MAPS_SUBSCRIPTION_KEY);
const client = new MapsSearchClient(credential);
```

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

```bash
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

[search]: /rest/api/maps/search
[Node.js Release Working Group]: https://github.com/nodejs/release#release-schedule
[Node.js]: https://nodejs.org/en/download/
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Subscription key]: quick-demo-map-app.md#get-the-primary-key-for-your-account

[authentication]: azure-maps-authentication.md
[Azure Identity library]: /javascript/api/overview/azure/identity-readme
[defaultazurecredential]: https://github.com/Azure/azure-sdk-for-js/tree/@azure/maps-search_1.0.0-beta.1/sdk/identity/identity#defaultazurecredential
[Host a daemon on non-Azure resources]: /azure/azure-maps/how-to-secure-daemon-app#host-a-daemon-on-non-azure-resources
[dotenv]: https://github.com/motdotla/dotenv#readme
[tenant ID]: /azure/active-directory/fundamentals/active-directory-how-to-find-tenant
[client-secret]: /azure/key-vault/secrets/quick-create-powershell#retrieve-a-secret-from-key-vault

[Rest API]: /rest/api/maps/

[search package]: https://www.nuget.org/packages/Azure.Maps.Search
[search readme]: https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/maps/Azure.Maps.Search/README.md
[search sample]: https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/maps/Azure.Maps.Search/samples

[FuzzySearch]: /dotnet/api/azure.maps.search.mapssearchclient.fuzzysearch
[Azure.Maps Namespace]: /dotnet/api/azure.maps
