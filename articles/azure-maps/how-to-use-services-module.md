---
title: Use the Azure Maps Services module | Microsoft Azure Maps
description: In this article, you'll learn how to utilize the Microsoft Azure Maps REST services using the Azure Maps services module.
author: rbrundritt
ms.author: richbrun
ms.date: 03/25/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: cpendleton
---

# Use the Azure Maps services module

The Azure Maps Web SDK provides a *services module*. This module is a helper library that makes it easy to use the Azure Maps REST services in web or Node.js applications by using JavaScript or TypeScript.

## Use the services module in a webpage

1. Create a new HTML file.
1. Load the Azure Maps services module. You can load it in one of two ways:
    - Use the globally hosted, Azure Content Delivery Network version of the Azure Maps services module. Add a script reference to the `<head>` element of the file:

        ```html
        <script src="https://atlas.microsoft.com/sdk/javascript/service/2/atlas-service.min.js"></script>
        ```

    - Alternatively, load the services module for the Azure Maps Web SDK source code locally by using the [azure-maps-rest](https://www.npmjs.com/package/azure-maps-rest) npm package, and then host it with your app. This package also includes TypeScript definitions. Use this command:
    
        > **npm install azure-maps-rest**
    
        Then, add a script reference to the `<head>` element of the file:

         ```html
        <script src="node_modules/azure-maps-rest/dist/atlas-service.min.js"></script>
         ```

1. Create an authentication pipeline. The pipeline must be created before you can initialize a service URL client endpoint. Use your own Azure Maps account key or Azure Active Directory (Azure AD) credentials to authenticate an Azure Maps Search service client. In this example, the Search service URL client will be created. 

    If you use a subscription key for authentication:

    ```javascript
    // Get an Azure Maps key at https://azure.com/maps.
    var subscriptionKey = '<Your Azure Maps Key>';

    // Use SubscriptionKeyCredential with a subscription key.
    var subscriptionKeyCredential = new atlas.service.SubscriptionKeyCredential(subscriptionKey);

    // Use subscriptionKeyCredential to create a pipeline.
    var pipeline = atlas.service.MapsURL.newPipeline(subscriptionKeyCredential, {
      retryOptions: { maxTries: 4 } // Retry options
    });

    // Create an instance of the SearchURL client.
    var searchURL = new atlas.service.SearchURL(pipeline);
    ```

    If you use Azure AD for authentication:

    ```javascript
    // Enter your Azure AD client ID.
    var clientId = "<Your Azure Active Directory Client Id>";

    // Use TokenCredential with OAuth token (Azure AD or Anonymous).
    var aadToken = await getAadToken();
    var tokenCredential = new atlas.service.TokenCredential(clientId, aadToken);

    // Create a repeating time-out that will renew the Azure AD token.
    // This time-out must be cleared when the TokenCredential object is no longer needed.
    // If the time-out is not cleared, the memory used by the TokenCredential will never be reclaimed.
    var renewToken = async () => {
      try {
        console.log("Renewing token");
        var token = await getAadToken();
        tokenCredential.token = token;
        tokenRenewalTimer = setTimeout(renewToken, getExpiration(token));
      } catch (error) {
        console.log("Caught error when renewing token");
        clearTimeout(tokenRenewalTimer);
        throw error;
      }
    }
    tokenRenewalTimer = setTimeout(renewToken, getExpiration(aadToken));

    // Use tokenCredential to create a pipeline.
    var pipeline = atlas.service.MapsURL.newPipeline(tokenCredential, {
      retryOptions: { maxTries: 4 } // Retry options
    });

    // Create an instance of the SearchURL client.
    var searchURL = new atlas.service.SearchURL(pipeline);

    function getAadToken() {
      // Use the signed-in auth context to get a token.
      return new Promise((resolve, reject) => {
        // The resource should always be https://atlas.microsoft.com/.
        const resource = "https://atlas.microsoft.com/";
        authContext.acquireToken(resource, (error, token) => {
          if (error) {
            reject(error);
          } else {
            resolve(token);
          }
        });
      })
    }

    function getExpiration(jwtToken) {
      // Decode the JSON Web Token (JWT) to get the expiration time stamp.
      const json = atob(jwtToken.split(".")[1]);
      const decode = JSON.parse(json);

      // Return the milliseconds remaining until the token must be renewed.
      // Reduce the time until renewal by 5 minutes to avoid using an expired token.
      // The exp property is the time stamp of the expiration, in seconds.
      const renewSkew = 300000;
      return (1000 * decode.exp) - Date.now() - renewSkew;
    }
    ```

    For more information, see [Authentication with Azure Maps](azure-maps-authentication.md).

1. The following code uses the newly created Azure Maps Search service URL client to geocode an address: "1 Microsoft Way, Redmond, WA". The code uses the `searchAddress` function and displays the results as a table in the body of the page.

    ```javascript
    // Search for "1 microsoft way, redmond, wa".
    searchURL.searchAddress(atlas.service.Aborter.timeout(10000), '1 microsoft way, redmond, wa')
      .then(response => {
        var html = [];

        // Display the total results.
        html.push('Total results: ', response.summary.numResults, '<br/><br/>');

        // Create a table of the results.
        html.push('<table><tr><td></td><td>Result</td><td>Latitude</td><td>Longitude</td></tr>');

        for(var i=0;i<response.results.length;i++){
          html.push('<tr><td>', (i+1), '.</td><td>', 
            response.results[i].address.freeformAddress, 
            '</td><td>', 
            response.results[i].position.lat,
            '</td><td>', 
            response.results[i].position.lon,
            '</td></tr>');
        }

        html.push('</table>');

        // Add the resulting HTML to the body of the page.
        document.body.innerHTML = html.join('');
    });
    ```

    Here's the full, running code sample:

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Using the Services Module" src="//codepen.io/azuremaps/embed/zbXGMR/?height=500&theme-id=0&default-tab=js,result&editable=true" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/zbXGMR/'>Using the Services Module</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

<br/>

## Azure Government cloud support

The Azure Maps Web SDK supports the Azure Government cloud. All JavaScript and CSS URLs used to access the Azure Maps Web SDK remain the same, however the following tasks will need to be done to connect to the Azure Government cloud version of the Azure Maps platform.

When using the interactive map control, add the following line of code before creating an instance of the `Map` class. 

```javascript
atlas.setDomain('atlas.azure.us');
```

Be sure to use an Azure Maps authentication details from the Azure Government cloud platform when authenticating the map and services.

When using the services module, the domain for the services needs to be set when creating an instance of an API URL endpoint. For example, the following code creates an instance of the `SearchURL` class and points the domain to the Azure Government cloud.

```javascript
var searchURL = new atlas.service.SearchURL(pipeline, 'atlas.azure.us');
```

If directly accessing the Azure Maps REST services, change the URL domain to `atlas.azure.us`. For example, if using the search API service, change the URL domain from `https://atlas.microsoft.com/search/` to `https://atlas.azure.us/search/`.

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [MapsURL](https://docs.microsoft.com/javascript/api/azure-maps-rest/atlas.service.mapsurl?view=azure-maps-typescript-latest)

> [!div class="nextstepaction"]
> [SearchURL](https://docs.microsoft.com/javascript/api/azure-maps-rest/atlas.service.searchurl?view=azure-maps-typescript-latest)

> [!div class="nextstepaction"]
> [RouteURL](https://docs.microsoft.com/javascript/api/azure-maps-rest/atlas.service.routeurl?view=azure-maps-typescript-latest)

> [!div class="nextstepaction"]
> [SubscriptionKeyCredential](https://docs.microsoft.com/javascript/api/azure-maps-rest/atlas.service.subscriptionkeycredential?view=azure-maps-typescript-latest)

> [!div class="nextstepaction"]
> [TokenCredential](https://docs.microsoft.com/javascript/api/azure-maps-rest/atlas.service.tokencredential?view=azure-maps-typescript-latest)

For more code samples that use the services module, see these articles:

> [!div class="nextstepaction"]
> [Show search results on the map](./map-search-location.md)

> [!div class="nextstepaction"]
> [Get information from a coordinate](./map-get-information-from-coordinate.md)

> [!div class="nextstepaction"]
> [Show directions from A to B](./map-route.md)
