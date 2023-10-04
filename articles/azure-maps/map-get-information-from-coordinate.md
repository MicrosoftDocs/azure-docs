---
title: Show information about a coordinate on a map
titleSuffix: Microsoft Azure Maps
description: Learn how to display information about an address on the map when a user selects a coordinate.
author: sinnypan
ms.author: sipa
ms.date: 07/01/2023
ms.topic: how-to
ms.service: azure-maps
---

# Get information from a coordinate

This article shows how to make a reverse address search that shows the address of a selected popup location.

There are two ways to make a reverse address search. One way is to query the [Reverse Address Search API] through the TypeScript REST SDK [@azure-rest/maps-search]. The other way is to use the [Fetch API] to make a request to the [Reverse Address Search API] to find an address. Both approaches are described in this article.

## Make a reverse search request via REST SDK

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

    // Update the style of mouse cursor to a pointer
    map.getCanvasContainer().style.cursor = "pointer";

    // Create a popup
    const popup = new atlas.Popup();

    // Upon a mouse click, open a popup at the selected location and render in the popup the address of the selected location
    map.events.add("click", async (e) => {
      const position = [e.position[1], e.position[0]];

      // Execute the reverse address search query and open a popup once a response is received
      const response = await client.path("/search/address/reverse/{format}", "json").get({
        queryParameters: { query: position }
      });

      // Get address data from response
      const data = response.body.addresses;

      // Construct the popup
      var popupContent = document.createElement("div");
      popupContent.classList.add("popup-content");
      popupContent.innerHTML = data.length !== 0 ? data[0].address.freeformAddress : "No address for that location!";
      popup.setOptions({
        position: e.position,
        content: popupContent
      });

      // Render the popup on the map
      popup.open(map);
    });
  });
};

document.body.onload = onload;
```

<!-----------------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/ejEYMZ/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
--------------------------------------------------------->

In the previous code example, the first block constructs a map object and sets the authentication mechanism to use Azure Active Directory. For more information, see [Create a map].

The second block of code creates an object that implements the [TokenCredential] interface to authenticate HTTP requests to Azure Maps with the access token. It then passes the credential object to [MapsSearch] and creates an instance of the client.

The third code block updates the style of mouse cursor to a pointer and creates a [popup] object. For more information, see [Add a popup on the map].

The fourth block of code adds a mouse click [event listener]. When triggered, it creates a search query with the coordinates of the selected point. It then makes a GET request to query the [Get Search Address Reverse API] for the address of the coordinates.

The fifth block of code sets up the HTML popup content to display the response address for the selected coordinate position.

The change of cursor, the popup object, and the `click` event are all created in the map's [load event listener]. This code structure ensures map fully loads before retrieving the coordinates information.

## Make a reverse search request via Fetch API

Select a location on the map to make a reverse geocode request for that location using fetch.

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

  map.events.add("load", async () => {
    // Update the style of mouse cursor to a pointer
    map.getCanvasContainer().style.cursor = "pointer";

    // Create a popup
    const popup = new atlas.Popup();

    // Upon a mouse click, open a popup at the selected location and render in the popup the address of the selected location
    map.events.add("click", async (e) => {
      //Send a request to Azure Maps reverse address search API
      let url = "https://atlas.microsoft.com/search/address/reverse/json?";
      url += "&api-version=1.0";
      url += "&query=" + e.position[1] + "," + e.position[0];

      // Process request
      fetch(url, {
        headers: {
          Authorization: "Bearer " + map.authentication.getToken(),
          "x-ms-client-id": "<Your Azure Maps Client Id>"
        }
      })
        .then((response) => response.json())
        .then((response) => {
          const popupContent = document.createElement("div");
          popupContent.classList.add("popup-content");
          const address = response["addresses"];
          popupContent.innerHTML =
            address.length !== 0 ? address[0]["address"]["freeformAddress"] : "No address for that location!";
          popup.setOptions({
            position: e.position,
            content: popupContent
          });
          // render the popup on the map
          popup.open(map);
        });
    });
  });
};

document.body.onload = onload;
```

<!-----------------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/ddXzoB/?height=516&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
--------------------------------------------------------->

In the previous code example, the first block of code constructs a map object and sets the authentication mechanism to use Azure Active Directory. You can see [Create a map] for instructions.

The second block of code updates the style of the mouse cursor to a pointer. It instantiates a [popup](/javascript/api/azure-maps-control/atlas.popup#open) object. For more information, see [Add a popup on the map].

The third block of code adds an event listener for mouse clicks. Upon a mouse click, it uses the [Fetch API] to query the Azure Maps [Reverse Address Search API] for the selected coordinates address. For a successful response, it collects the address for the selected location. It defines the popup content and position using the [setOptions] function of the popup class.

The change of cursor, the popup object, and the `click` event are all created in the map's [load event listener]. This code structure ensures the map fully loads before retrieving the coordinates information.

The following image is a screenshot showing the results of the two code samples.

:::image type="content" source="./media/map-get-information-from-coordinate/maps-reverse-search.png" alt-text="A screenshot of a map showing reverse address search results in a popup.":::

## Next steps

> [!div class="nextstepaction"]
> [Best practices for using the search service](how-to-use-best-practices-for-search.md)

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map](/javascript/api/azure-maps-control/atlas.map)

> [!div class="nextstepaction"]
> [Popup](/javascript/api/azure-maps-control/atlas.popup)

See the following articles for full code examples:

> [!div class="nextstepaction"]
> [Show directions from A to B](./map-route.md)

> [!div class="nextstepaction"]
> [Show traffic](./map-show-traffic.md)

[Reverse Address Search API]: /rest/api/maps/search/getsearchaddressreverse
[Fetch API]: https://fetch.spec.whatwg.org/
[Create a map]: map-create.md
[popup]: /javascript/api/azure-maps-control/atlas.popup#open
[Add a popup on the map]: map-add-popup.md
[event listener]: /javascript/api/azure-maps-control/atlas.map#events
[Get Search Address Reverse API]: /rest/api/maps/search/getsearchaddressreverse
[load event listener]: /javascript/api/azure-maps-control/atlas.map#events
[setOptions]: /javascript/api/azure-maps-control/atlas.popup#setoptions-popupoptions-
[@azure-rest/maps-search]: https://www.npmjs.com/package/@azure-rest/maps-search
[MapsSearch]: /javascript/api/@azure-rest/maps-search
[TokenCredential]: /javascript/api/@azure/identity/tokencredential
