---
title: Using the Services module - Azure Maps | Microsoft Docs
description: Learn how to use the Azure Maps services module.
author: rbrundritt
ms.author: richbrun
ms.date: 03/25/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: cpendleton
---

# Using the Azure Maps Services module

The Azure Maps Web SDK provides a services module that is a helper library that makes it easy to use the Azure Maps REST services in web or Node.js applications using JavaScript or TypeScript.

## Using the services module in a web page

1. Create a new HTML file.
2. Load in the Azure Maps Services module. This can be done using one of two options;

    a. Use the globally hosted CDN version of the Azure Maps services module by adding a script reference to the `<head>` element of the file:
    
	```html
	<script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas-service.min.js"></script>
	```
    
    b. Alternatively, load the Azure Maps Web SDK source code locally using the [azure-maps-rest](https://www.npmjs.com/package/azure-maps-rest) NPM package and host it with your app. This package also includes TypeScript definitions.
    
	> npm install azure-maps-rest
    
    Then add a script reference to the `<head>` element of the file:
    
	```html
	<script src="node_modules/azure-maps-rest/dist/js/atlas-service.min.js"></script>
	```

3. To initialize a service URL client endpoint, you must first create an authentication pipeline. Use your own Azure Maps account key or Azure Active Directory (AAD) credentials to authenticate the search service client. In this example, the search service URL client will be created. If using a subscription key for authentication:

    ```javascript
    //Get an Azure Maps key at https://azure.com/maps
    var subscriptionKey = '<Your Azure Maps Key>';
    
    //Use SubscriptionKeyCredential with a subscription key.
    var subscriptionKeyCredential = new atlas.service.SubscriptionKeyCredential(subscriptionKey);
    
    //Use subscriptionKeyCredential to create a pipeline.
    var pipeline = atlas.service.MapsURL.newPipeline(subscriptionKeyCredential, {
      retryOptions: { maxTries: 4 } // Retry options
    });
    
    //Create an instance of the SearchURL client.
    var searchURL = new atlas.service.SearchURL(pipeline);
    ```
    
    If using Azure Active Directory (AAD) for authentication:

    ```javascript
    // Enter your Azure Actiuve Directory client ID.
    var clientId = "<Your Azure Active Directory Client Id>";
    
    // Use TokenCredential with OAuth token (AAD or Anonymous).
    var aadToken = await getAadToken();
    var tokenCredential = new atlas.service.TokenCredential(clientId, aadToken);
    
    // Create a repeating timeout that will renew the AAD token.
    // This timeout must be cleared once the TokenCredential object is no longer needed.
    // If the timeout is not cleared the memory used by the TokenCredential will never be reclaimed.
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
    
    // Use tokenCredential to create a pipeline
    var pipeline = atlas.service.MapsURL.newPipeline(tokenCredential, {
		retryOptions: { maxTries: 4 } // Retry options
    });
    
    //Create an instance of the SearchURL client.
    var searchURL = new atlas.service.SearchURL(pipeline);

    function getAadToken() {
        //Use the logged in auth context to get a token.
        return new Promise((resolve, reject) => {
            //The resource should always be https://atlas.microsoft.com/.
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
        //Decode the JWT token to get the expiration timestamp.
        const json = atob(jwtToken.split(".")[1]);
        const decode = JSON.parse(json);

        //Return the milliseconds until the token needs renewed.
        //Reduce the time until renew by 5 minutes to avoid using an expired token.
        //The exp property is the timestamp of the expiration in seconds.
        const renewSkew = 300000;
        return (1000 * decode.exp) - Date.now() - renewSkew;
    }
    ```

    For more information, see [Authentication with Azure Maps](azure-maps-authentication.md).

4. The following code uses the newly created search service URL client to geocode an address, "1 Microsoft Way, Redmond, WA" using the `searchAddress` function and display the results as a table in the body of the page. 

    ```javascript
    //Search for "1 microsoft way, redmond, wa".
    searchURL.searchAddress(atlas.service.Aborter.timeout(10000), '1 microsoft way, redmond, wa').then(response => {
      var html = [];
      
      //Display the total results.
      html.push('Total results: ', response.summary.numResults, '<br/><br/>');
     
      //Create a table of the results.
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
      
      //Add the result HTML to the body of the page.
      document.body.innerHTML = html.join('');
    });
    ```

    Here is the fully running code sample:

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Using the Services Module" src="//codepen.io/azuremaps/embed/zbXGMR/?height=500&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/zbXGMR/'>Using the Services Module</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [MapsURL](https://docs.microsoft.com/javascript/api/azure-maps-rest/atlas.service.mapsurl?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [SearchURL](https://docs.microsoft.com/javascript/api/azure-maps-rest/atlas.service.searchurl?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [RouteURL](https://docs.microsoft.com/javascript/api/azure-maps-rest/atlas.service.routeurl?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [SubscriptionKeyCredential](https://docs.microsoft.com/javascript/api/azure-maps-rest/atlas.service.subscriptionkeycredential?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [TokenCredential](https://docs.microsoft.com/javascript/api/azure-maps-rest/atlas.service.tokencredential?view=azure-iot-typescript-latest)

See the following articles for more code samples that use the services module:

> [!div class="nextstepaction"]
> [Show search results on the map](./map-search-location.md)

> [!div class="nextstepaction"]
> [Get information from a coordinate](./map-get-information-from-coordinate.md)

> [!div class="nextstepaction"]
> [Show directions from A to B](./map-route.md)