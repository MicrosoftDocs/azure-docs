---
title: Show search results on a map
titleSuffix: Microsoft Azure Maps
description: This article demonstrates how to perform a search request using Microsoft Azure Maps Web SDK and display the results on the map.
author: sinnypan
ms.author: sipa
ms.date: 07/01/2023
ms.topic: how-to
ms.service: azure-maps
---

# Show search results on the map

This article shows you how to search for location of interest and show the search results on the map.

There are two ways to search for a location of interest. One way is to use the TypeScript REST SDK, [@azure-rest/maps-search] to make a search request. The other way is to make a search request to Azure Maps [Fuzzy search API] through the [Fetch API]. Both approaches are described in this article.

## Make a search request via REST SDK

```javascript
import * as atlas from "azure-maps-control";
import MapsSearch from "@azure-rest/maps-search";
import "azure-maps-control/dist/atlas.min.css";

const onload = () => {
  // Initialize a map instance.
  const map = new atlas.Map("map", {
    view: "Auto",
    // Add authentication details for connecting to Azure Maps.
    authOptions: {
      // Use Azure Active Directory authentication.
      authType: "aad",
      clientId: "<Your Azure Maps Client Id>",
      aadAppId: "<Your Azure Active Directory Client Id>",
      aadTenant: "<Your Azure Active Directory Tenant Id>"
    }
  });

  map.events.add("load", async () => {
    // Use the access token from the map and create an object that implements the TokenCredential interface.
    const credential = {
      getToken: () => {
        return {
          token: map.authentication.getToken()
        };
      }
    };

    // Create a Search client.
    const client = MapsSearch(credential, "<Your Azure Maps Client Id>");

    // Create a data source and add it to the map.
    const datasource = new atlas.source.DataSource();
    map.sources.add(datasource);

    // Add a layer for rendering point data.
    const resultLayer = new atlas.layer.SymbolLayer(datasource);
    map.layers.add(resultLayer);

    // Search for gas stations near Seattle.
    const response = await client.path("/search/fuzzy/{format}", "json").get({
      queryParameters: {
        query: "gasoline station",
        lat: 47.6101,
        lon: -122.34255
      }
    });

    // Arrays to store bounds for results.
    const bounds = [];

    // Convert the response into Feature and add it to the data source.
    const searchPins = response.body.results.map((result) => {
      const position = [result.position.lon, result.position.lat];
      bounds.push(position);
      return new atlas.data.Feature(new atlas.data.Point(position), {
        position: result.position.lat + ", " + result.position.lon
      });
    });

     // Add the pins to the data source.
    datasource.add(searchPins);

    // Set the camera to the bounds of the pins
    map.setCamera({
      bounds: new atlas.data.BoundingBox.fromLatLngs(bounds),
      padding: 40
    });
  });
};

document.body.onload = onload;
```

<!-----------------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/zLdYEB/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
--------------------------------------------------------->

In the previous code example, the first block constructs a map object and sets the authentication mechanism to use Microsoft Entra ID. For more information, see [Create a map].

The second block of code creates an object that implements the [TokenCredential] interface to authenticate HTTP requests to Azure Maps with the access token. It then passes the credential object to [MapsSearch] and creates an instance of the client.

The third block of code creates a data source object using the [DataSource] class and add search results to it. A [symbol layer] uses text or icons to render point-based data wrapped in the [DataSource] as symbols on the map.  A symbol layer is then created. The data source is added to the symbol layer, which is then added to the map.

The fourth code block makes a GET request in the [MapsSearch] client. It allows you to perform a free form text search via the [Get Search Fuzzy rest API] to search for point of interest. Get requests to the Search Fuzzy API can handle any combination of fuzzy inputs. The response is then converted to [Feature] objects and added to the data source, which automatically results in the data being rendered on the map via the symbol layer.

The last block of code adjusts the camera bounds for the map using the Map's [setCamera] property.

The search request, data source, symbol layer, and camera bounds are inside the [event listener] of the map. We want to ensure that the results are displayed after the map fully loads.


## Make a search request via Fetch API

```javascript
import * as atlas from "azure-maps-control";
import "azure-maps-control/dist/atlas.min.css";

const onload = () => {
  // Initialize a map instance.
  const map = new atlas.Map("map", {
    view: "Auto",
    // Add authentication details for connecting to Azure Maps.
    authOptions: {
      // Use Azure Active Directory authentication.
      authType: "aad",
      clientId: "<Your Azure Maps Client Id>",
      aadAppId: "<Your Azure Active Directory Client Id>",
      aadTenant: "<Your Azure Active Directory Tenant Id>"
    }
  });

  map.events.add("load", () => {
    // Create a data source and add it to the map.
    const datasource = new atlas.source.DataSource();
    map.sources.add(datasource);

    // Add a layer for rendering point data.
    const resultLayer = new atlas.layer.SymbolLayer(datasource);
    map.layers.add(resultLayer);

    // Send a request to Azure Maps search API
    let url = "https://atlas.microsoft.com/search/fuzzy/json?";
    url += "&api-version=1";
    url += "&query=gasoline%20station";
    url += "&lat=47.6101";
    url += "&lon=-122.34255";
    url += "&radius=100000";

    // Parse the API response and create a pin on the map for each result
    fetch(url, {
      headers: {
        Authorization: "Bearer " + map.authentication.getToken(),
        "x-ms-client-id": "<Your Azure Maps Client Id>"
      }
    })
      .then((response) => response.json())
      .then((response) => {
        // Arrays to store bounds for results.
        const bounds = [];

        // Convert the response into Feature and add it to the data source.
        const searchPins = response.results.map((result) => {
          const position = [result.position.lon, result.position.lat];
          bounds.push(position);
          return new atlas.data.Feature(new atlas.data.Point(position), {
            position: result.position.lat + ", " + result.position.lon
          });
        });

        // Add the pins to the data source.
        datasource.add(searchPins);

        // Set the camera to the bounds of the pins
        map.setCamera({
          bounds: new atlas.data.BoundingBox.fromLatLngs(bounds),
          padding: 40
        });
      });
  });
};

document.body.onload = onload;
```

<!-----------------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/KQbaeM/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
--------------------------------------------------------->

In the previous code example, the first block of code constructs a map object. It sets the authentication mechanism to use Microsoft Entra ID. For more information, see [Create a map].

The second block of code creates a data source object using the [DataSource] class and add search results to it. A [symbol layer] uses text or icons to render point-based data wrapped in the [DataSource] as symbols on the map.  A symbol layer is then created. The data source is added to the symbol layer, which is then added to the map.

The third block of code creates a URL to make a search request to.

The fourth block of code uses the [Fetch API]. The [Fetch API] is used to make a request to Azure Maps [Fuzzy search API] to search for the points of interest. The Fuzzy search API can handle any combination of fuzzy inputs. It then handles and parses the search response and adds the result pins to the searchPins array.

The last block of code creates a [BoundingBox] object. It uses the array of results, and then it adjusts the camera bounds for the map using the Map's [setCamera]. It then renders the result pins.

The search request, the data source, symbol layer, and the camera bounds are set within the map's [event listener] to ensure that the results are displayed after the map loads fully.

The following image is a screenshot showing the results of the two code samples.

:::image type="content" source="./media/map-search-location/maps-search.png" alt-text="A screenshot of search results showing gas stations near Seattle.":::

## Next steps

> [!div class="nextstepaction"]
> [Best practices for using the search service](how-to-use-best-practices-for-search.md)

Learn more about **Fuzzy Search**:

> [!div class="nextstepaction"]
> [Azure Maps Fuzzy Search API](/rest/api/maps/search/getsearchfuzzy)

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map](/javascript/api/azure-maps-control/atlas.map)

See the following articles for full code examples:

> [!div class="nextstepaction"]
> [Get information from a coordinate](map-get-information-from-coordinate.md)
<!-- Comment added to suppress false positive warning -->
> [!div class="nextstepaction"]
> [Show directions from A to B](map-route.md)

[Fuzzy search API]: /rest/api/maps/search/getsearchfuzzy
[Fetch API]: https://fetch.spec.whatwg.org/
[DataSource]: /javascript/api/azure-maps-control/atlas.source.datasource
[symbol layer]: /javascript/api/azure-maps-control/atlas.layer.symbollayer
[Create a map]: map-create.md
[Get Search Fuzzy rest API]: /rest/api/maps/search/getsearchfuzzy
[setCamera]: /javascript/api/azure-maps-control/atlas.map#setcamera-cameraoptions---cameraboundsoptions---animationoptions-
[event listener]: /javascript/api/azure-maps-control/atlas.map#events
[BoundingBox]: /javascript/api/azure-maps-control/atlas.data.boundingbox
[@azure-rest/maps-search]: https://www.npmjs.com/package/@azure-rest/maps-search
[MapsSearch]: /javascript/api/@azure-rest/maps-search
[TokenCredential]: /javascript/api/@azure/identity/tokencredential
[Feature]: /javascript/api/azure-maps-control/atlas.data.feature
