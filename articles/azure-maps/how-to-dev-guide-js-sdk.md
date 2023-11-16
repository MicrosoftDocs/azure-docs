---
title: How to create Azure Maps applications using the JavaScript REST SDK (preview)
titleSuffix: Azure Maps
description: How to develop applications that incorporate Azure Maps using the JavaScript SDK Developers Guide.
author: sinnypan
ms.author: sipa
ms.date: 11/15/2021
ms.topic: how-to
ms.service: azure-maps
ms.custom: devx-track-js
services: azure-maps
---

# JavaScript/TypeScript REST SDK Developers Guide (preview)

The Azure Maps JavaScript/TypeScript REST SDK (JavaScript SDK) supports searching using the Azure Maps [Search service], like searching for an address, fuzzy searching for a point of interest (POI), and searching by coordinates. This article helps you get started building location-aware applications that incorporate the power of Azure Maps.

> [!NOTE]
> Azure Maps JavaScript SDK supports the LTS version of Node.js. For more information, see [Node.js Release Working Group].

## Prerequisites

- [Azure Maps account].
- [Subscription key] or other form of [Authentication with Azure Maps].
- [Node.js].

> [!TIP]
> You can create an Azure Maps account programmatically, Here's an example using the Azure CLI:
>
> ```azurecli
> az maps account create --kind "Gen2" --account-name "myMapAccountName" --resource-group "<resource group>" --sku "G2"
> ```

## Create a Node.js project

The following example creates a new directory then a Node.js program named _mapsDemo_ using npm:

```powershell
mkdir mapsDemo
cd mapsDemo
npm init
```

## Install the search package

To use Azure Maps JavaScript SDK, you need to install the search package. Each of the Azure Maps services including search, routing, rendering and geolocation are each in their own package.

```powershell
npm install @azure-rest/maps-search
```

Once the package is installed, create a `search.js` file in the `mapsDemo` directory:

```text
mapsDemo
+-- package.json
+-- package-lock.json
+-- node_modules/
+-- search.js
```

### Azure Maps services

| Service name  | npm packages            |  Samples     |
|---------------|-------------------------|--------------|
| [Search][search readme] | [@azure-rest/maps-search][search package] | [search samples][search sample] |
| [Route][js route readme] | [@azure-rest/maps-route][js route package] | [route samples][js route sample] |
| [Render][js render readme] | [@azure-rest/maps-render][js render package]|[render sample][js render sample] |
| [Geolocation][js geolocation readme]|[@azure-rest/maps-geolocation][js geolocation package]|[geolocation sample][js geolocation sample] |

## Create and authenticate a MapsSearchClient

You need a `credential` object for authentication when creating the `MapsSearchClient` object used to access the Azure Maps search APIs. You can use either a Microsoft Entra credential or an Azure subscription key to authenticate. For more information on authentication, see [Authentication with Azure Maps].

> [!TIP]
> The`MapsSearchClient` is the primary interface for developers using the Azure Maps search library. See [Azure Maps Search client library][JS-SDK] to learn more about the search methods available.

<a name='using-an-azure-ad-credential'></a>

### Using a Microsoft Entra credential

You can authenticate with Microsoft Entra ID using the [Azure Identity library]. To use the [DefaultAzureCredential] provider, you need to install the `@azure/identity` package:

```powershell
npm install @azure/identity
```

You need to register the new Microsoft Entra application and grant access to Azure Maps by assigning the required role to your service principal. For more information, see [Host a daemon on non-Azure resources]. The Application (client) ID, a Directory (tenant) ID, and a client secret are returned. Copy these values and store them in a secure place. You need them in the following steps.

Set the values of the Application (client) ID, Directory (tenant) ID, and client secret of your Microsoft Entra application, and the map resource’s client ID as environment variables:

| Environment Variable  | Description                                                     |
|-----------------------|-----------------------------------------------------------------|
| AZURE_CLIENT_ID       | Application (client) ID in your registered application          |
| AZURE_CLIENT_SECRET   | The value of the client secret in your registered application   |
| AZURE_TENANT_ID       | Directory (tenant) ID in your registered application            |
| MAPS_CLIENT_ID        | The client ID in your Azure Map account                         |

You can use a `.env` file for these variables. You need to install the [dotenv] package:

```powershell
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
const MapsSearch = require("@azure-rest/maps-search").default; 
const { DefaultAzureCredential } = require("@azure/identity"); 
require("dotenv").config(); 
 
const credential = new DefaultAzureCredential(); 
const client = MapsSearch(credential, process.env.MAPS_CLIENT_ID); 
```

### Using a subscription key credential

You can authenticate with your Azure Maps subscription key. Your subscription key can be found in the **Authentication** section in the Azure Maps account as shown in the following screenshot:

:::image type="content" source="./media/rest-sdk-dev-guides/subscription-key.png" alt-text="A screenshot showing the subscription key in the Authentication section of an Azure Maps account." lightbox="./media/rest-sdk-dev-guides/subscription-key.png":::

You need to pass the subscription key to the `AzureKeyCredential` class provided by the [Azure Core Authentication Package]. For security reasons, it's better to specify the key as an environment variable than to include it in your source code.

Use a `.env` file to store the subscription key variable to accomplish this. You need to install the [dotenv] package to retrieve the value:

```powershell
npm install dotenv
```

Next, add a `.env` file in the **mapsDemo** directory and specify the property:

```text
MAPS_SUBSCRIPTION_KEY="<subscription-key>"
```

Once your environment variable is created, you can access it in your JavaScript code:

```JavaScript
const MapsSearch = require("@azure-rest/maps-search").default;
const { AzureKeyCredential } = require("@azure/core-auth");
require("dotenv").config();

const credential = new AzureKeyCredential(process.env.MAPS_SUBSCRIPTION_KEY);
const client = MapsSearch(credential);
```

## Fuzzy search an entity

The following code snippet demonstrates how, in a simple console application, to import the `azure-maps-search` package and perform a fuzzy search on “Starbucks” near Seattle:

```JavaScript

const MapsSearch = require("@azure-rest/maps-search").default;
const { isUnexpected } = require("@azure-rest/maps-search");
const { AzureKeyCredential } = require("@azure/core-auth");
require("dotenv").config();

async function main() {
  // Authenticate with Azure Map Subscription Key
  const credential = new AzureKeyCredential(
    process.env. MAPS_SUBSCRIPTION_KEY
  );
  const client = MapsSearch(credential);

  // Setup the fuzzy search query
  const response = await client.path("/search/fuzzy/{format}", "json").get({
    queryParameters: {
      query: "Starbucks",
      lat: 47.61559,
      lon: -122.33817,
      countrySet: ["US"],
    },
  });

  // Handle the error response
  if (isUnexpected(response)) {
    throw response.body.error;
  }
  // Log the result
  console.log(`Starbucks search result nearby Seattle:`);
  response.body.results.forEach((result) => {
    console.log(`\
      * ${result.address.streetNumber} ${result.address.streetName}
        ${result.address.municipality} ${result.address.countryCode} ${
      result.address.postalCode
    }
        Coordinate: (${result.position.lat.toFixed(4)}, ${result.position.lon.toFixed(4)})\
    `);
  });
}

main().catch((err) => {
  console.error(err);
});


```

This code snippet shows how to use the `MapsSearch` method from the Azure Maps Search client library to create a `client` object with your Azure credentials. You can use either your Azure Maps subscription key or the [Microsoft Entra credential](#using-a-microsoft-entra-credential) from the previous section. The `path` parameter specifies the API endpoint, which is "/search/fuzzy/{format}" in this case. The `get` method sends an HTTP GET request with the query parameters, such as `query`, `coordinates`, and `countryFilter`. The query searches for Starbucks locations near Seattle in the US. The SDK returns the results as a [FuzzySearchResult] object and writes them to the console. For more information, see the [FuzzySearchRequest] documentation.

Run `search.js` with Node.js:

```powershell
node search.js 
```

## Search an Address

The [searchAddress] query can be used to get the coordinates of an address. Modify the `search.js` from the sample as follows:

```JavaScript
const MapsSearch = require("@azure-rest/maps-search").default;
const { isUnexpected } = require("@azure-rest/maps-search");
const { AzureKeyCredential } = require("@azure/core-auth");
require("dotenv").config();

async function main() {
  const credential = new AzureKeyCredential(
    process.env. MAPS_SUBSCRIPTION_KEY
  );
  const client = MapsSearch(credential);

  const response = await client.path("/search/address/{format}", "json").get({
    queryParameters: {
      query: "1301 Alaskan Way, Seattle, WA 98101, US",
    },
  });
  if (isUnexpected(response)) {
    throw response.body.error;
  }
  const { lat, lon } = response.body.results[0].position;
  console.log(`The coordinate is: (${lat}, ${lon})`);
}

main().catch((err) => {
  console.error(err);
});

```

The results are ordered by confidence score and in this example only the first result returned with be displayed to the screen.

## Batch reverse search

Azure Maps Search also provides some batch query methods. These methods return Long Running Operations (LRO) objects. The requests might not return all the results immediately, so you can use the poller to wait until completion. The following example demonstrates how to call batched reverse search method:

```JavaScript
  const batchItems = await createBatchItems([
    // This is an invalid query
    { query: [148.858561, 2.294911] },
    { query: [47.61010, -122.34255] },
    { query: [47.61559, -122.33817], radius: 5000 },
  ]);
  const initialResponse = await client.path("/search/address/reverse/batch/{format}", "json").post({
    body: { batchItems },
  });
```

In this example, three queries are passed into the helper function `createBatchItems` that is imported from `@azure-rest/maps-search`. This helper function composed the body of the batch request. The first query is invalid, see [Handing failed requests](#handing-failed-requests) for an example showing how to handle the invalid query.

Use the `getLongRunningPoller` method with the `initialResponse` to get the poller. Then you can use `pollUntilDone` to get the final result:

```JavaScript
  const poller = getLongRunningPoller(client, initialResponse);
  const response = await poller.pollUntilDone();
  logResponseBody(response.body);
```

A common scenario for LRO is to resume a previous operation later. Do that by serializing the poller’s state with the `toString` method, and rehydrating the state with a new poller using the `resumeFrom` option in `getLongRunningPoller`:

```JavaScript
  const serializedState = poller.toString();
  const rehydratedPoller = getLongRunningPoller(client, initialResponse, {
    resumeFrom: serializedState,
  });

  const resumeResponse = await rehydratedPoller.pollUntilDone();
  logResponseBody(response);
```

Once you get the response, you can log it:

```JavaScript
 
function logResponseBody(resBody) {
  const { summary, batchItems } = resBody;

  const { totalRequests, successfulRequests } = summary;
  console.log(`${successfulRequests} out of ${totalRequests} requests are successful.`);

  batchItems.forEach(({ response }, idx) => {
    if (response.error) {
      console.log(`Error in ${idx + 1} request: ${response.error.message}`);
    } else {
      console.log(`Results in ${idx + 1} request:`);
      response.addresses.forEach(({ address }) => {
        console.log(`  ${address.freeformAddress}`);
      });
    }
  });
} 

```

### Handing failed requests

Handle failed requests by checking for the `error` property in the response batch item. See the `logResponseBody` function in the completed batch reverse search following example.

### Completed batch reverse search example

The complete code for the reverse address batch search example:

```JavaScript
const MapsSearch = require("@azure-rest/maps-search").default,
  { createBatchItems, getLongRunningPoller } = require("@azure-rest/maps-search");
const { AzureKeyCredential } = require("@azure/core-auth");
require("dotenv").config();

async function main() {
  const credential = new AzureKeyCredential(process.env.MAPS_SUBSCRIPTION_KEY);
  const client = MapsSearch(credential);

  const batchItems = createBatchItems([
    // This is an invalid query
    { query: [148.858561, 2.294911] },
    {
      query: [47.6101, -122.34255],
    },
    { query: [47.6155, -122.33817], radius: 5000 },
  ]);

  const initialResponse = await client.path("/search/address/reverse/batch/{format}", "json").post({
    body: { batchItems },
  });
  const poller = getLongRunningPoller(client, initialResponse);

  const response = await poller.pollUntilDone();
  logResponseBody(response.body);

  const serializedState = poller.toString();
  const rehydratedPoller = getLongRunningPoller(client, initialResponse, {
    resumeFrom: serializedState,
  });
  const resumeResponse = await rehydratedPoller.pollUntilDone();
  logResponseBody(resumeResponse.body);
}

function logResponseBody(resBody) {
  const { summary, batchItems } = resBody;

  const { totalRequests, successfulRequests } = summary;
  console.log(`${successfulRequests} out of ${totalRequests} requests are successful.`);

  batchItems.forEach(({ response }, idx) => {
    if (response.error) {
      console.log(`Error in ${idx + 1} request: ${response.error.message}`);
    } else {
      console.log(`Results in ${idx + 1} request:`);
      response.addresses.forEach(({ address }) => {
        console.log(`  ${address.freeformAddress}`);
      });
    }
  });
}

main().catch(console.error);

```

## Additional information

- The [Azure Maps Search client library for JavaScript/TypeScript][JS-SDK].

[Authentication with Azure Maps]: azure-maps-authentication.md
[Azure Core Authentication Package]: /javascript/api/@azure/core-auth/
[Azure Identity library]: /javascript/api/overview/azure/identity-readme
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[DefaultAzureCredential]: https://github.com/Azure/azure-sdk-for-js/tree/@azure/maps-search_1.0.0-beta.1/sdk/identity/identity#defaultazurecredential
[dotenv]: https://github.com/motdotla/dotenv#readme
[FuzzySearchRequest]: /javascript/api/@azure-rest/maps-search/fuzzysearch
[FuzzySearchResult]: /javascript/api/@azure-rest/maps-search/searchfuzzysearch200response
[Host a daemon on non-Azure resources]: ./how-to-secure-daemon-app.md#host-a-daemon-on-non-azure-resources
[js geolocation package]: https://www.npmjs.com/package/@azure-rest/maps-geolocation
[js geolocation readme]: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/maps/maps-geolocation-rest/README.md
[js geolocation sample]: https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/maps/maps-geolocation-rest/samples/v1-beta
[js render package]: https://www.npmjs.com/package/@azure-rest/maps-render
[js render readme]: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/maps/maps-render-rest/README.md
[js render sample]: https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/maps/maps-render-rest/samples/v1-beta
[js route package]: https://www.npmjs.com/package/@azure-rest/maps-route
[js route readme]: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/maps/maps-route-rest/README.md
[js route sample]: https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/maps/maps-route-rest/samples/v1-beta
[JS-SDK]: /javascript/api/@azure-rest/maps-search
[Node.js Release Working Group]: https://github.com/nodejs/release#release-schedule
[Node.js]: https://nodejs.org/en/download/
[search package]: https://www.npmjs.com/package/@azure-rest/maps-search
[search readme]: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/maps/maps-search-rest/README.md
[search sample]: https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/maps/maps-search-rest/samples/v1-beta
[Search service]: /rest/api/maps/search
[searchAddress]: /javascript/api/@azure-rest/maps-search/searchaddress
[Subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
