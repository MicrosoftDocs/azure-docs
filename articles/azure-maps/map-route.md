---
title: Show route directions on a map
titleSuffix: Microsoft Azure Maps
description: This article demonstrates how to display directions between two locations on a map using the Microsoft Azure Maps Web SDK.
author: sinnypan
ms.author: sipa
ms.date: 07/01/2023
ms.topic: how-to
ms.service: azure-maps
---

# Show directions from A to B

This article shows you how to make a route request and show the route on the map.

There are two ways to do so. The first way is to query the [Get Route Directions] API using the TypeScript REST SDK [@azure-rest/maps-route]. The second way is to use the [Fetch API] to make a search request to the [Get Route Directions] API. Both approaches are described in this article.

## Query the route via REST SDK

```javascript
import * as atlas from "azure-maps-control";
import MapsRoute, { toColonDelimitedLatLonString } from "@azure-rest/maps-route";
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

    // Create a Route client.
    const client = MapsRoute(credential, "<Your Azure Maps Client Id>");

    // Create a data source and add it to the map.
    const dataSource = new atlas.source.DataSource();
    map.sources.add(dataSource);

    // Create the GeoJSON objects which represent the start and end points of the route.
    const startPoint = new atlas.data.Feature(new atlas.data.Point([-122.130137, 47.644702]), {
      title: "Redmond",
      icon: "pin-blue"
    });

    const endPoint = new atlas.data.Feature(new atlas.data.Point([-122.3352, 47.61397]), {
      title: "Seattle",
      icon: "pin-round-blue"
    });

    // Add the data to the data source.
    dataSource.add([startPoint, endPoint]);

    // Create a layer for rendering the route line under the road labels.
    map.layers.add(
      new atlas.layer.LineLayer(dataSource, null, {
        strokeColor: "#2272B9",
        strokeWidth: 5,
        lineJoin: "round",
        lineCap: "round"
      }),
      "labels"
    );

    // Create a layer for rendering the start and end points of the route as symbols.
    map.layers.add(
      new atlas.layer.SymbolLayer(dataSource, null, {
        iconOptions: {
          image: ["get", "icon"],
          allowOverlap: true,
          ignorePlacement: true
        },
        textOptions: {
          textField: ["get", "title"],
          offset: [0, 1.2]
        },
        filter: ["any", ["==", ["geometry-type"], "Point"], ["==", ["geometry-type"], "MultiPoint"]] //Only render Point or MultiPoints in this layer.
      })
    );

    // Get the coordinates of the start and end points.
    const coordinates = [
      [startPoint.geometry.coordinates[1], startPoint.geometry.coordinates[0]],
      [endPoint.geometry.coordinates[1], endPoint.geometry.coordinates[0]]
    ];

    // Get the route directions between the start and end points.
    const response = await client.path("/route/directions/{format}", "json").get({
      queryParameters: {
        query: toColonDelimitedLatLonString(coordinates)
      }
    });

    // Get the GeoJSON feature collection of the route.
    const data = getFeatures(response.body.routes);

    // Add the route data to the data source.
    dataSource.add(data);

    // Update the map view to center over the route.
    map.setCamera({
      bounds: data.bbox,
      padding: 40
    });
  });
};

/**
 * Helper function to convert a route response into a GeoJSON FeatureCollection.
 */
const getFeatures = (routes) => {
  const bounds = [];
  const features = routes.map((route, index) => {
    const multiLineCoords = route.legs.map((leg) => {
      return leg.points.map((coord) => {
        const position = [coord.longitude, coord.latitude];
        bounds.push(position);
        return position;
      });
    });

    // Include all properties on the route object except legs.
    // Legs is used to create the MultiLineString, so we only need the summaries.
    // The legSummaries property replaces the legs property with just summary data.
    const props = {
      ...route,
      legSummaries: route.legs.map((leg) => leg.summary),
      resultIndex: index
    };
    delete props.legs;

    return {
      type: "Feature",
      geometry: {
        type: "MultiLineString",
        coordinates: multiLineCoords
      },
      properties: props
    };
  });

  return {
    type: "FeatureCollection",
    features: features,
    bbox: new atlas.data.BoundingBox.fromLatLngs(bounds)
  };
};

document.body.onload = onload;
```

<!-----------------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/RBZbep/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
--------------------------------------------------------->

In the previous code example, the first block constructs a map object and sets the authentication mechanism to use Microsoft Entra ID. You can see [Create a map] for instructions.

The second block of code creates an object that implements the [TokenCredential] interface to authenticate HTTP requests to Azure Maps with the access token. It then passes the credential object to [MapsRoute] and creates an instance of the client.

The third block of code creates and adds a [DataSource] object to the map.

The fourth block of code creates start and end [points] objects and adds them to the dataSource object.

A line is a [Feature] for LineString. A [LineLayer] renders line objects wrapped in the  [DataSource] as lines on the map. The fourth block of code creates and adds a line layer to the map. See properties of a line layer at [LinestringLayerOptions].

A [symbol layer] uses texts or icons to render point-based data wrapped in the [DataSource]. The texts or the icons render as symbols on the map. The fifth block of code creates and adds a symbol layer to the map.

The sixth block of code queries the Azure Maps routing service, which is part of the [MapsRoute] client. A GET request is used to get a route between the start and end points. A GeoJSON feature collection from the response is then extracted using a `getFeatures()` helper function and is added to the datasource. It then renders the response as a route on the map. For more information about adding a line to the map, see [Add a line on the map].

The last block of code sets the bounds of the map using the Map's [setCamera] property.

The route query, data source, symbol, line layers, and camera bounds are created inside the [event listener]. This code structure ensures the results are displayed only after the map fully loads.

## Query the route via Fetch API

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
    // Create a data source and add it to the map.
    const dataSource = new atlas.source.DataSource();
    map.sources.add(dataSource);

    // Create the GeoJSON objects which represent the start and end points of the route.
    const startPoint = new atlas.data.Feature(new atlas.data.Point([-122.130137, 47.644702]), {
      title: "Redmond",
      icon: "pin-blue"
    });

    const endPoint = new atlas.data.Feature(new atlas.data.Point([-122.3352, 47.61397]), {
      title: "Seattle",
      icon: "pin-round-blue"
    });

    // Add the data to the data source.
    dataSource.add([startPoint, endPoint]);

    // Create a layer for rendering the route line under the road labels.
    map.layers.add(
      new atlas.layer.LineLayer(dataSource, null, {
        strokeColor: "#2272B9",
        strokeWidth: 5,
        lineJoin: "round",
        lineCap: "round"
      }),
      "labels"
    );

    // Create a layer for rendering the start and end points of the route as symbols.
    map.layers.add(
      new atlas.layer.SymbolLayer(dataSource, null, {
        iconOptions: {
          image: ["get", "icon"],
          allowOverlap: true,
          ignorePlacement: true
        },
        textOptions: {
          textField: ["get", "title"],
          offset: [0, 1.2]
        },
        filter: ["any", ["==", ["geometry-type"], "Point"], ["==", ["geometry-type"], "MultiPoint"]] //Only render Point or MultiPoints in this layer.
      })
    );

    // Send a request to the route API
    let url = "https://atlas.microsoft.com/route/directions/json?";
    url += "&api-version=1.0";
    url +=
      "&query=" +
      startPoint.geometry.coordinates[1] +
      "," +
      startPoint.geometry.coordinates[0] +
      ":" +
      endPoint.geometry.coordinates[1] +
      "," +
      endPoint.geometry.coordinates[0];

    // Process request
    fetch(url, {
      headers: {
        Authorization: "Bearer " + map.authentication.getToken(),
        "x-ms-client-id": "<Your Azure Maps Client Id>"
      }
    })
      .then((response) => response.json())
      .then((response) => {
        const bounds = [];
        const route = response.routes[0];
        
        // Create an array to store the coordinates of each turn
        let routeCoordinates = [];
        route.legs.forEach((leg) => {
          const legCoordinates = leg.points.map((point) => {
            const position = [point.longitude, point.latitude];
            bounds.push(position);
            return position;
          });
          // Add each turn coordinate to the array
          routeCoordinates = routeCoordinates.concat(legCoordinates);
        });

        // Add route line to the dataSource
        dataSource.add(new atlas.data.Feature(new atlas.data.LineString(routeCoordinates)));

        // Update the map view to center over the route.
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
> [!VIDEO //codepen.io/azuremaps/embed/zRyNmP/?height=469&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
--------------------------------------------------------->

In the previous code example, the first block of code constructs a map object and sets the authentication mechanism to use Microsoft Entra ID. You can see [Create a map] for instructions.

The second block of code creates and adds a [DataSource] object to the map.

The third code block creates the start and destination points for the route. Then, it adds them to the data source. For more information, see [Add a pin on the map].

A [LineLayer] renders line objects wrapped in the  [DataSource] as lines on the map. The fourth block of code creates and adds a line layer to the map. See properties of a line layer at [LineLayerOptions].

A [symbol layer] uses text or icons to render point-based data wrapped in the [DataSource] as symbols on the map. The fifth block of code creates and adds a symbol layer to the map. See properties of a symbol layer at [SymbolLayerOptions].

The next block of code uses the [Fetch API] to make a search request to [Get Route Directions]. The response is then parsed. If the response was successful, the latitude and longitude information is used to create an array a line by connecting those points. The line data is then added to data source to render the route on the map. For more information, see [Add a line on the map].

The last block of code sets the bounds of the map using the Map's [setCamera] property.

The route query, data source, symbol, line layers, and camera bounds are created inside the [event listener]. Again, we want to ensure that results are displayed after the map loads fully.

The following image is a screenshot showing the results of the two code samples.

:::image type="content" source="./media/map-route/maps-route.png" alt-text="A screenshot of a map showing route directions between two points.":::

## Next steps

> [!div class="nextstepaction"]
> [Best practices for using the routing service](how-to-use-best-practices-for-search.md)

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map](/javascript/api/azure-maps-control/atlas.map)

See the following articles for full code examples:

> [!div class="nextstepaction"]
> [Show traffic on the map](./map-show-traffic.md)

> [!div class="nextstepaction"]
> [Interacting with the map - mouse events](./map-events.md)

[Get Route Directions]: /rest/api/maps/route/getroutedirections
[Fetch API]: https://fetch.spec.whatwg.org/
[Create a map]: map-create.md
[DataSource]: /javascript/api/azure-maps-control/atlas.source.datasource
[Add a line on the map]: map-add-line-layer.md
[setCamera]: /javascript/api/azure-maps-control/atlas.map#setcamera-cameraoptions---cameraboundsoptions---animationoptions-
[SymbolLayerOptions]: /javascript/api/azure-maps-control/atlas.symbollayeroptions
[LineLayerOptions]: /javascript/api/azure-maps-control/atlas.linelayeroptions
[Add a pin on the map]: map-add-pin.md
[LineLayer]: /javascript/api/azure-maps-control/atlas.layer.linelayer
[symbol layer]: /javascript/api/azure-maps-control/atlas.layer.symbollayer
[event listener]: /javascript/api/azure-maps-control/atlas.map#events
[LinestringLayerOptions]: /javascript/api/azure-maps-control/atlas.linelayeroptions
[Feature]: /javascript/api/azure-maps-control/atlas.data.feature
[points]: /javascript/api/azure-maps-control/atlas.data.point
[@azure-rest/maps-route]: https://www.npmjs.com/package/@azure-rest/maps-route
[MapsRoute]: /javascript/api/@azure-rest/maps-route
[TokenCredential]: /javascript/api/@azure/identity/tokencredential
