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

The Azure Maps JavaScript/TypeScript REST SDK (JavaScript SDK) supports searching using the Azure Maps [Search service], like searching for an address, searching for boundary of a city or country, and searching by coordinates. This article helps you get started building location-aware applications that incorporate the power of Azure Maps.

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

:::image type="content" border="false" source="./media/shared/get-key.png" alt-text="Screenshot showing your Azure Maps subscription key in the Azure portal." lightbox="./media/shared/get-key.png":::

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

### Using a Shared Access Signature (SAS) Token Credential

Shared access signature (SAS) tokens are authentication tokens created using the JSON Web token (JWT) format and are cryptographically signed to prove authentication for an application to the Azure Maps REST API.

You can get the SAS token using [`AzureMapsManagementClient.accounts.listSas`][listSas] package. Follow the section [Create and authenticate a `AzureMapsManagementClient`][azureMapsManagementClient] to setup first.

Second, follow [Managed identities for Azure Maps][managedIdentity] to create a managed identity for your Azure Maps account. Copy the principal ID (object ID) of the managed identity.

Next, install [Azure Core Authentication Package] package to use `AzureSASCredential`:

```bash
npm install @azure/core-auth
```

Finally, you can use the SAS token to authenticate the client:

```javascript
  const MapsSearch = require("@azure-rest/maps-search").default;
  const { AzureSASCredential } = require("@azure/core-auth");
  const { DefaultAzureCredential } = require("@azure/identity");
  const { AzureMapsManagementClient } = require("@azure/arm-maps");

  const subscriptionId = "<subscription ID of the map account>"
  const resourceGroupName = "<resource group name of the map account>";
  const accountName = "<name of the map account>";
  const mapsAccountSasParameters = {
    start: "<start time in ISO format>", // e.g. "2023-11-24T03:51:53.161Z"
    expiry: "<expiry time in ISO format>", // maximum value to start + 1 day
    maxRatePerSecond: 500,
    principalId: "<principle ID (object ID) of the managed identity>",
    signingKey: "primaryKey",
  };
  const credential = new DefaultAzureCredential();
  const managementClient = new AzureMapsManagementClient(credential, subscriptionId);
  const {accountSasToken} = await managementClient.accounts.listSas(
    resourceGroupName,
    accountName,
    mapsAccountSasParameters
  );
  if (accountSasToken === undefined) {
    throw new Error("No accountSasToken was found for the Maps Account.");
  }
  const sasCredential = new AzureSASCredential(accountSasToken);
  const client = MapsSearch(sasCredential);
```

## Geocoding

The following code snippet demonstrates how, in a simple console application, to import the `@azure-rest/maps-search` package and get the coordinates of an address using [GetGeocoding] query:

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

  const response = await client.path("/geocode", "json").get({
    queryParameters: {
      query: "1301 Alaskan Way, Seattle, WA 98101, US",
    },
  });
  if (isUnexpected(response)) {
    throw response.body.error;
  }
  const [ lon, lat ] = response.body.features[0].geometry.coordinates;
  console.log(`The coordinate is: (${lat}, ${lon})`);
}

main().catch((err) => {
  console.error(err);
});

```

This code snippet shows how to use the `MapsSearch` method from the Azure Maps Search client library to create a `client` object with your Azure credentials. You can use either your Azure Maps subscription key or the [Microsoft Entra credential](#using-a-microsoft-entra-credential). The `path` parameter specifies the API endpoint, which in this case is "/geocode". The `get` method sends an HTTP GET request with the query parameters. The query searches for the coordinate of "1301 Alaskan Way, Seattle, WA 98101, US". The SDK returns the results as a [GeocodingResponseOutput] object and writes them to the console. The results are ordered by confidence score in this example and only the first result is displayed to the screen. For more information, see [GetGeocoding].

Run `search.js` with Node.js:

```powershell
node search.js 
```

## Batch reverse geocoding

Azure Maps Search also provides some batch query methods. The following example demonstrates how to call batched reverse search method:

```JavaScript
  const batchItems = [
    // This is an invalid query
    { coordinates: [2.294911, 148.858561] },
    {
      coordinates: [-122.34255, 47.6101],
    },
    { coordinates: [-122.33817, 47.6155] },
  ];
  const response = await client.path("/reverseGeocode:batch").post({
    body: { batchItems },
  });
```

In this example, three coordinates are included in the `batchItems` of the request body. The first item is invalid, see [Handling failed requests](#handling-failed-requests) for an example showing how to handle the invalid item.

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
      response.features.forEach((feature) => {
        console.log(`  ${feature.properties.address.freeformAddress}`);
      });
    }
  });
} 

```

### Handling failed requests

Handle failed requests by checking for the `error` property in the response batch item. See the `logResponseBody` function in the completed batch reverse search following example.

### Completed batch reverse search example

The complete code for the reverse address batch search example:

```JavaScript
const MapsSearch = require("@azure-rest/maps-search").default,
  { isUnexpected } = require("@azure-rest/maps-search");
const { AzureKeyCredential } = require("@azure/core-auth");
require("dotenv").config();

async function main() {
  const credential = new AzureKeyCredential(process.env.MAPS_SUBSCRIPTION_KEY);
  const client = MapsSearch(credential);

  const batchItems = [
    // This is an invalid query
    { coordinates: [2.294911, 148.858561] },
    {
      coordinates: [-122.34255, 47.6101],
    },
    { coordinates: [-122.33817, 47.6155] },
  ];

  const response = await client.path("/reverseGeocode:batch").post({
    body: { batchItems },
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }

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
      response.features.forEach((feature) => {
        console.log(`  ${feature.properties.address.freeformAddress}`);
      });
    }
  });
} 

main().catch(console.error);

```

## Use V1 SDK

We are working to make all V1 features available in V2, until then, install the following V1 SDK packages if needed:

```bash
npm install @azure-rest/map-search-v1@npm:@azure-rest/map-search@^1.0.0
npm install @azure-rest/map-search-v2@npm:@azure-rest/map-search@^2.0.0
```

Then, you can import the two packages:

```javascript
const MapsSearchV1 = require("@azure-rest/map-search-v1").default;
const MapsSearchV2 = require("@azure-rest/map-search-v2").default;
```

The following example demonstrates creating a function that accepts an address and search POIs around it. Use V2 SDK to get the coordinates of the address(/geocode) and V1 SDK to search POIs around it(/search/nearby).

```javascript
const MapsSearchV1 = require("@azure-rest/map-search-v1").default;
const MapsSearchV2 = require("@azure-rest/map-search-v2").default;
const { AzureKeyCredential } = require("@azure/core-auth");
const { isUnexpected: isUnexpectedV1 } = require("@azure-rest/maps-search-v1");
const { isUnexpected: isUnexpectedV2 } = require("@azure-rest/maps-search-v2");
require("dotenv").config();

/** Initialize the MapsSearchClient */
const clientV1 = MapsSearchV1(new AzureKeyCredential(process.env.MAPS_SUBSCRIPTION_KEY));
const clientV2 = MapsSearchV2(new AzureKeyCredential(process.env.MAPS_SUBSCRIPTION_KEY));

async function searchNearby(address) {
  /** Make a request to the geocoding API */
  const geocodeResponse = await clientV2
    .path("/geocode")
    .get({ queryParameters: { query: address } });
  /** Handle error response */
  if (isUnexpectedV2(geocodeResponse)) {
    throw geocodeResponse.body.error;
  }

  const [lon, lat] = geocodeResponse.body.features[0].geometry.coordinates;
  
  /** Make a request to the search nearby API */
  const nearByResponse = await clientV1.path("/search/nearby/{format}", "json").get({
    queryParameters: { lat, lon },
  });
  /** Handle error response */
  if (isUnexpectedV1(nearByResponse)) {
    throw nearByResponse.body.error;
  }
  /** Log response body */
  for(const results of nearByResponse.body.results) {
    console.log(
      `${result.poi ? result.poi.name + ":" : ""} ${result.address.freeformAddress}. (${
        result.position.lat
      }, ${result.position.lon})\n`
    );
  }
}

async function main(){
  searchNearBy("15127 NE 24th Street, Redmond, WA 98052");
}

main().catch((err) => {
    console.log(err);
})
```

## Additional information

- The [Azure Maps Search client library for JavaScript/TypeScript][JS-SDK].

[Authentication with Azure Maps]: azure-maps-authentication.md
[Azure Core Authentication Package]: /javascript/api/@azure/core-auth/
[Azure Identity library]: /javascript/api/overview/azure/identity-readme
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[DefaultAzureCredential]: https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity#defaultazurecredential
[azureMapsManagementClient]: https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/maps/arm-maps#create-and-authenticate-a-azuremapsmanagementclient
[GetGeocoding]: /javascript/api/@azure-rest/maps-search/getgeocoding 
[GeocodingResponseOutput]: /javascript/api/@azure-rest/maps-search/geocodingresponseoutput
[dotenv]: https://github.com/motdotla/dotenv#readme
[Host a daemon on non-Azure resources]: ./how-to-secure-daemon-app.md#host-a-daemon-on-non-azure-resources
[js geolocation package]: https://www.npmjs.com/package/@azure-rest/maps-geolocation
[js geolocation readme]: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/maps/maps-geolocation-rest/README.md
[js geolocation sample]: https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/maps/maps-geolocation-rest/samples/
[js render package]: https://www.npmjs.com/package/@azure-rest/maps-render
[js render readme]: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/maps/maps-render-rest/README.md
[js render sample]: https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/maps/maps-render-rest/samples/
[js route package]: https://www.npmjs.com/package/@azure-rest/maps-route
[js route readme]: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/maps/maps-route-rest/README.md
[js route sample]: https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/maps/maps-route-rest/samples/
[JS-SDK]: /javascript/api/@azure-rest/maps-search
[listSas]: /javascript/api/%40azure/arm-maps/accounts#@azure-arm-maps-accounts-listsas
[managedIdentity]: https://techcommunity.microsoft.com/t5/azure-maps-blog/managed-identities-for-azure-maps/ba-p/3666312
[Node.js Release Working Group]: https://github.com/nodejs/release#release-schedule
[Node.js]: https://nodejs.org/en/download/
[search package]: https://www.npmjs.com/package/@azure-rest/maps-search
[search readme]: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/maps/maps-search-rest/README.md
[search sample]: https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/maps/maps-search-rest/samples/
[Search service]: /rest/api/maps/search
[Subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
