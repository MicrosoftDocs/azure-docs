---
title: Use Azure Maps TypeScript REST SDK
titleSuffix: Microsoft Azure Maps
description: Learn about the Azure Maps TypeScript REST SDK. See how to load and use this client library to access Azure Maps REST services in web or Node.js applications.
author: sinnypan
ms.author: sipa
ms.date: 07/01/2023
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
ms.custom: devx-track-js
---

# Use Azure Maps TypeScript REST SDK

Azure Maps provides a collection of npm modules for the [Azure TypeScript REST SDK]. These modules consist of client libraries that make it easy to use the Azure Maps REST services in web or Node.js applications by using JavaScript or TypeScript. For a complete list of the available modules, see [JavaScript/TypeScript REST SDK Developers Guide].

## Use the REST SDK in a web application

1. Using `@azure-rest/maps-search` as an example, install the package with `npm install @azure-rest/maps-search`.

1. Create and authenticate a [MapsSearch] client. To create a client to access the Azure Maps Search APIs, you need a credential object. The client supports an [Microsoft Entra credential] or an [Azure Key credential] for authentication. You may need to install either [@azure/identity] or [@azure/core-auth] for different authentication methods.

    If you use a subscription key for authentication, install the package with `npm install @azure/core-auth`:

    ```javascript
    import MapsSearch from "@azure-rest/maps-search";
    import { AzureKeyCredential } from "@azure/core-auth";

    // Get an Azure Maps key at https://azure.com/maps.
    const subscriptionKey = "<Your Azure Maps Key>";

    // Use AzureKeyCredential with a subscription key.
    const credential = new AzureKeyCredential(subscriptionKey);

    // Use the credential to create a client
    const client = MapsSearch(credential);
    ```

    If you use Microsoft Entra ID for authentication, install the package with `npm install @azure/identity`:

    ```javascript
    import MapsSearch from "@azure-rest/maps-search";
    import { InteractiveBrowserCredential } from "@azure/identity";

    // Enter your Azure AD client and tenant ID.
    const clientId = "<Your Azure Active Directory Client Id>";
    const tenantId = "<Your Azure Active Directory Tenant Id>";

    // Enter your Azure Maps client ID.
    const mapsClientId = "<Your Azure Maps Client Id>";

    // Use InteractiveBrowserCredential with Azure AD client and tenant ID.
    const credential = new InteractiveBrowserCredential({
      clientId,
      tenantId
    });

    // Use the credential to create a client
    const client = MapsSearch(credential, mapsClientId);
    ```

    For more information, see [Authentication with Azure Maps](azure-maps-authentication.md).

1. The following code uses the newly created Azure Maps Search client to geocode an address: "1 Microsoft Way, Redmond, WA". The code makes a GET request and displays the results as a table in the body of the page.

    ```javascript
    // Search for "1 microsoft way, redmond, wa".
    const html = [];
    const response = await client
      .path("/search/address/{format}", "json")
      .get({ queryParameters: { query: "1 microsoft way, redmond, wa" } });

    // Display the total results.
    html.push("Total results: ", response.body.summary.numResults, "<br/><br/>");

    // Create a table of the results.
    html.push("<table><tr><td>Result</td><td>Latitude</td><td>Longitude</td></tr>");
    response.body.results.forEach((result) => {
      html.push(
        "<tr><td>",
        result.address.freeformAddress,
        "</td><td>",
        result.position.lat,
        "</td><td>",
        result.position.lon,
        "</td></tr>"
      );
    });

    html.push("</table>");

    // Add the resulting HTML to the body of the page.
    document.body.innerHTML = html.join("");
    ```

The following image is a screenshot showing the results of this sample code, a table with the address searched for, along with the resulting coordinates.

:::image type="content" source="./media/how-to-use-ts-rest-sdk/rest-sdk-in-webpage.png" alt-text="A screenshot of an HTML table showing the address searched and the resulting coordinates.":::

## Azure Government cloud support

The Azure Maps Web SDK supports the Azure Government cloud. All JavaScript and CSS URLs used to access the Azure Maps Web SDK remain the same, however the following tasks need to be done to connect to the Azure Government cloud version of the Azure Maps platform.

When using the interactive map control, add the following line of code before creating an instance of the `Map` class. 

```javascript
atlas.setDomain('atlas.azure.us');
```

Be sure to use an Azure Maps authentication details from the Azure Government cloud platform when authenticating the map and services.

When using the TypeScript REST SDK, the domain for the services needs to be set when creating an instance of the client. For example, the following code creates an instance of the [MapsSearch] class and points the domain to the Azure Government cloud.

```javascript
const client = MapsSearch(credential, { baseUrl: 'https://atlas.azure.us'});
```

If directly accessing the Azure Maps REST services, change the URL domain to `atlas.azure.us`. For example, if using the search API service, change the URL domain from `https://atlas.microsoft.com/search/` to `https://atlas.azure.us/search/`.

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [MapsSearch](/javascript/api/@azure-rest/maps-search)

> [!div class="nextstepaction"]
> [AzureKeyCredential](/javascript/api/@azure/core-auth/azurekeycredential)

> [!div class="nextstepaction"]
> [InteractiveBrowserCredential](/javascript/api/@azure/identity/interactivebrowsercredential)

For more code samples that use the TypeScript REST SDK with Web SDK integration, see these articles:

> [!div class="nextstepaction"]
> [Show search results on the map](./map-search-location.md)

> [!div class="nextstepaction"]
> [Get information from a coordinate](./map-get-information-from-coordinate.md)

> [!div class="nextstepaction"]
> [Show directions from A to B](./map-route.md)

[Azure TypeScript REST SDK]: ./rest-sdk-developer-guide.md#javascripttypescript
[JavaScript/TypeScript REST SDK Developers Guide]: ./how-to-dev-guide-js-sdk.md
[MapsSearch]: /javascript/api/@azure-rest/maps-search
[Microsoft Entra credential]: ./how-to-dev-guide-js-sdk.md#using-an-azure-ad-credential
[Azure Key credential]: ./how-to-dev-guide-js-sdk.md#using-a-subscription-key-credential
[@azure/identity]: https://www.npmjs.com/package/@azure/identity
[@azure/core-auth]: https://www.npmjs.com/package/@azure/core-auth
