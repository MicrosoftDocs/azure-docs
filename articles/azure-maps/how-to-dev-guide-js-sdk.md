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

To use Azure Maps JavaScript SDK, you'll need to install the search package. Each of the Azure Maps services including search, routing, rendering and geolocation are each in their own package.

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

You'll need a `credential` object for authentication when creating the `MapsSearchClient` object used to access the Azure Maps search APIs. You can use either an Azure Active Directory (Azure AD) credential or an Azure subscription key to authenticate. For more information on authentication, see [Authentication with Azure Maps][authentication].

> [!TIP]
> The`MapsSearchClient` is the primary interface for developers using the Azure Maps search library. See [search][search] in the REST API documentation to learn more about the search methods available.

### Using an Azure AD credential

You can authenticate with Azure AD using the [Azure Identity library][Azure Identity library]. To use the [DefaultAzureCredential][defaultazurecredential] provider, you'll need to install the `@azure/identity` package:

```bash
npm install @azure/identity
```

You'll need to register the new Azure AD application and grant access to Azure Maps by assigning the required role to your service principal. For more information, see [Host a daemon on non-Azure resources][Host a daemon on non-Azure resources]. During this process you'll get an Application (client) ID, a Directory (tenant) ID, and a client secret. Copy these values and store them in a secure place. You'll need them in the following steps.

Set the values of the Application (client) ID, Directory (tenant) ID, and client secret of your Azure AD application, and the map resource’s client ID as environment variables:

| Environment Variable  | Description                                                     |
|-----------------------|-----------------------------------------------------------------|
| AZURE_CLIENT_ID       | Application (client) ID in your registered application          |
| AZURE_CLIENT_SECRET   | The value of the client secret in your registered application   |
| AZURE_TENANT_ID       | Directory (tenant) ID in your registered application            |
| MAPS_CLIENT_ID        | The client ID in your Azure Map account                         |

You can use a `.env` file for these variables. You'll need to install the [dotenv][dotenv] package:

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

Once your environment variables are created, you can access them in your JavaScript code:

```JavaScript
const { MapsSearchClient } = require("@azure/maps-search"); 
const { DefaultAzureCredential } = require("@azure/identity"); 
require("dotenv").config(); 
 
const credential = new DefaultAzureCredential(); 
const client = new MapsSearchClient(credential, process.env.MAPS_CLIENT_ID); 
```

### Using a subscription key credential

You can authenticate with your Azure Maps subscription key. Your subscription key can be found in the **Authentication** section in the Azure Maps account as shown in the following screenshot:

:::image type="content" source="./media/rest-sdk-dev-guides/subscription-key.png" alt-text="A screenshot showing the subscription key in the Authentication section in an Azure Maps account." lightbox="./media/rest-sdk-dev-guides/subscription-key.png":::

You need to pass the subscription key to the `AzureKeyCredential` class provided by the @azure/maps-search SDK. For security reasons, we suggest specifying the key in the environment variable. To expose the variables in .env, we need to install dotenv package:

You can use a `.env` file for the subscription key variable. This is a more secure approach that hard coding the value in your source code. You'll need to install the [dotenv][dotenv] package:

```bash
npm install dotenv
```

Next, add a `.env` file in the **mapsDemo** directory and specify the property:

```text
MAPS_SUBSCRIPTION_KEY="<subscription-key>"
```

Once your environment variable is created, you can access it in your JavaScript code:

```JavaScript
const { MapsSearchClient, AzureKeyCredential } = require("@azure/maps-search");
require("dotenv").config();

const credential = new AzureKeyCredential(process.env.MAPS_SUBSCRIPTION_KEY);
const client = new MapsSearchClient(credential);
```

## Fuzzy search an entity

The following code snippet demonstrates how, in a simple console application, to import the `azure-maps-search` package and perform a fuzzy search on“Starbucks” near Seattle:

```JavaScript

const { MapsSearchClient, AzureKeyCredential } = require("@azure/maps-search"); 
require("dotenv").config(); 
 
async function main() { 
  // Authenticate with Azure Map Subscription Key 
  const credential = new AzureKeyCredential(process.env.MAPS_SUBSCRIPTION_KEY); 
  const client = new MapsSearchClient(credential); 
 
  // Setup the fuzzy search query 
  const response = await client.fuzzySearch({ 
    query: "Starbucks", 
    coordinates: [47.639557, -122.128159], 
    countryCodeFilter: ["US"], 
  }); 
 
  // Log the result 
  console.log(`Find ${response.numberResults} results:`); 
  response.results.forEach((r) => { 
    console.log("============="); 

    console.log(`Phone: ${r.pointOfInterest.phone || "Not provided"}`); 

    console.log(`Address: ${r.address.freeformAddress}`); 
  }); 
} 
 
main().catch((err) => { 
  console.error(err); 
}); 

```

In the above code snippet, you create a `MapsSearchClient` object using your Azure credentials. This is done using your Azure Maps Subscription Key, however you could use the [Azure AD credential](#using-an-azure-ad-credential) discussed in the previous section. You then pass the search query and options to the `fuzzySearch` method. Here we want to search for Starbucks (`query: "Starbucks"`) near Seattle (`coordinates: [47.639557, -122.128159], countryFilter: ["US"]`). For more information, see [FuzzySearchRequest][FuzzySearchRequest] in the [Azure Maps Search client library for JavaScript/TypeScript][client library].

The method `fuzzySearch` provided by `MapsSearchClient` will forward the request to Azure Maps REST endpoints. When the results are returned, they're written to the console. For more information, see [SearchAddressResult][SearchAddressResult].

Run `search.js` with Node.js:

```powershell
node search.js 
```

## Search an Address

The `searchAddress` method can be used to get the coordinate of an address. Modify the `search.js` from the sample as follows:

```JavaScript
const { MapsSearchClient, AzureKeyCredential } = require("@azure/maps-search");
require("dotenv").config();

async function main() {
  const credential = new AzureKeyCredential(process.env.MAPS_SUBSCRIPTION_KEY);
  const client = new MapsSearchClient(credential);

  const response = await client.searchAddress(
    "1301 Alaskan Way, Seattle, WA 98101, US"
  );

  console.log(`The coordinate is: ${response.results[0].position}`);}

main().catch((err) => {
  console.error(err);
});
```

The results returned from `client.searchAddress` are ordered by confidence score and in this example only the first result returned with be displayed to the screen.

## Batch reverse search

Azure Maps Search also provides some batch query methods. These methods will return Long Running Operations (LRO) objects. The requests might not return all the results immediately, so you can wait until completion or query the result periodically. The example below demonstrates how to call batched reverse search method:

```JavaScript
    const poller = await client.beginReverseSearchAddressBatch([
    // This is an invalid query
    { coordinates: [148.858561, 2.294911] },
    {
      coordinates: [47.639765, -122.127896],
      options: { radiusInMeters: 5000 },
    },
    { coordinates: [47.621028, -122.34817] },
  ]);
```

In this example, three queries are passed into the _batched reverse search_ request. The first query is invalid, see [Handing failed requests](#handing-failed-requests) for an example showing how to handle the invalid query.

Use the `getResult` method from the poller to check the current result. You check the status using `getOperationState` to see if the poller is still running. If it is, you can keep calling `poll` until the operation is finished:

```JavaScript
  while (poller.getOperationState().status === "running") {
    const partialResponse = poller.getResult();
    logResponse(partialResponse)
    await poller.poll();
  }
```

Alternatively, you can wait until the operation is finished by using `pollUntilDone()`:

```JavaScript
const response = await poller.pollUntilDone();
logResponse(response)
```

A common scenario for LRO is to resume a previous operation later. You do that by serializing the poller’s state with the `toString` method, and rehydrating the state with a new poller with `resumeReverseSearchAddressBatch`:

```JavaScript
  const serializedState = poller.toString();
  const rehydratedPoller = await client.resumeReverseSearchAddressBatch(
    serializedState
  );
  const response = await rehydratedPoller.pollUntilDone();
  logResponse(response);
```

Once you get the response, you can log it:

```JavaScript
function logResponse(response) {
  console.log(
    `${response.totalSuccessfulRequests}/${response.totalRequests} succeed.`
  );
  response.batchItems.forEach((item, idx) => {
    console.log(`The result for ${idx + 1}th request:`);
   // Check if the request is failed
    if (item.response.error) {
      console.error(item.response.error);
    } else {
      item.response.results.forEach((result) => {
        console.log(result.address.freeformAddress);
      });
    }
  });
}
```

### Handing failed requests

Handle failed requests by checking for the `error` property in the response batch item. See the `logResponse` function in the complete example.

### Completed Batch reverse search example

The complete code for the reverse address batch search example:

```JavaScript
const { MapsSearchClient, AzureKeyCredential } = require("@azure/maps-search");
require("dotenv").config();

async function main() {
  const credential = new AzureKeyCredential(process.env.MAPS_SUBSCRIPTION_KEY);
  const client = new MapsSearchClient(credential);

  const poller = await client.beginReverseSearchAddressBatch([
    // This is an invalid query
    { coordinates: [148.858561, 2.294911] },
    {
      coordinates: [47.639765, -122.127896],
      options: { radiusInMeters: 5000 },
    },
    { coordinates: [47.621028, -122.34817] },
  ]);

  // Get the partial result and keep polling
  while (poller.getOperationState().status === "running") {
    const partialResponse = poller.getResult();
    logResponse(partialResponse);
    await poller.poll();
  }

  // You can simply wait for the operation is done
  // const response = await poller.pollUntilDone();
  // logResponse(response)

  // Resume the poller
  const serializedState = poller.toString();
  const rehydratedPoller = await client.resumeReverseSearchAddressBatch(
    serializedState
  );
  const response = await rehydratedPoller.pollUntilDone();
  logResponse(response);
}

function logResponse(response) {
  console.log(
    `${response.totalSuccessfulRequests}/${response.totalRequests} succeed.`
  );
  response.batchItems.forEach((item, idx) => {
    console.log(`The result for ${idx + 1}th request:`);
    if (item.response.error) {
      console.error(item.response.error);
    } else {
      item.response.results.forEach((result) => {
        console.log(result.address.freeformAddress);
      });
    }
  });
}

main().catch((err) => {
  console.error(err);
});
```

## Additional information

- The [Azure.Maps Namespace][Azure.Maps Namespace] in the .NET documentation.

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

[FuzzySearchRequest]: https://azuresdkdocs.blob.core.windows.net/$web/javascript/azure-maps-search/1.0.0-beta.1/interfaces/fuzzysearchrequest.html
[SearchAddressResult]: https://azuresdkdocs.blob.core.windows.net/$web/javascript/azure-maps-search/1.0.0-beta.1/interfaces/searchaddressresult.html
[client library]: https://azuresdkdocs.blob.core.windows.net/$web/javascript/azure-maps-search/1.0.0-beta.1/index.html

[search package]: https://www.nuget.org/packages/Azure.Maps.Search
[search readme]: https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/maps/Azure.Maps.Search/README.md
[search sample]: https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/maps/Azure.Maps.Search/samples

[Azure.Maps Namespace]: /dotnet/api/azure.maps
