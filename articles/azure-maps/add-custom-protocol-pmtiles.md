---
title: Add custom protocol PMTiles in the Web SDK | Microsoft Azure Maps
description: Learn how to add custom protocol PMTiles using the Web SDK.
author: sinnypan
ms.author: sipa
ms.date: 10/13/2024
ms.topic: how-to
ms.service: azure-maps
ms.subservice: web-sdk
---

# Add custom protocol PMTiles

The Azure Maps Web SDK supports custom protocols such as [PMTiles]. The `pmtiles://` protocol is used to reference PMTiles archives, which are single-file formats for storing tiled data such as vector and raster maps. This protocol allows Azure Maps to access specific tiles within a PMTiles archive using an HTTP request, fetching only the necessary data on demand.

## Add custom protocol

By using the `addProtocol` function, which registers a callback triggered before any AJAX request made by the library, you can intercept, modify, and return the request for further processing and rendering. This enables the implementation of a custom callback function to load resources when a URL starts with the designated custom schema.

The first step is to add a reference to the protocol. The following example references the `pmtiles` library:

```html
  <script src="https://unpkg.com/pmtiles@3.2.0/dist/pmtiles.js"></script>
```

Next, initialize the MapLibre PMTiles protocol.

```js
  //Initialize the plugin.
  const protocol = new pmtiles.Protocol();
  atlas.addProtocol("pmtiles", protocol.tile);
```

## Add PMTiles as a map source

The following sample uses the [Overture] building dataset to add building data over the basemap.

PMTiles are added as a map source during the map event. Once added, the specified URI scheme is available to the Azure Maps Web SDK. In the following sample, the PMTiles URL is added as a `VectorTileSource`.

```js
const PMTILES_URL = "https://overturemaps-tiles-us-west-2-beta.s3.amazonaws.com/2024-07-22/buildings.pmtiles";
//Add the source to the map.
map.sources.add(
  new atlas.source.VectorTileSource("my_source", {
    type: "vector",
    url: `pmtiles://${PMTILES_URL}`,
  })
);
```

> [!NOTE]
> Using the `pmtiles://` protocol automatically creates the `minzoom` and `maxzoom` properties for the source.

## Enhance map with Overture data

Overture provides a unified and comprehensive [data schema] designed to organize and structure geospatial data effectively. This schema is divided into different themes, each representing a specific type of geospatial information.

The following sample uses the building theme's properties (for example, building type and height) to demonstrate building extrusion and differentiate between building categories on the basemap, rather than just showing building footprints.

```js
//Create a polygon extrusion layer.
layer = new atlas.layer.PolygonExtrusionLayer(
  "my_source",
  "building",
  {
    sourceLayer: "building",
    height: ["get", "height"],
    fillOpacity: 0.5,
    fillColor: [
      "case",
      ['==', ['get', 'subtype'], 'agricultural'],
      "wheat",
      ['==', ['get', 'subtype'], 'civic'],
      "teal",
      ['==', ['get', 'subtype'], 'commercial'],
      "blue",
      ['==', ['get', 'subtype'], 'education'],
      "aqua",
      ['==', ['get', 'subtype'], 'entertainment'],
      "pink",
      ['==', ['get', 'subtype'], 'industrial'],
      "yellow",
      ['==', ['get', 'subtype'], 'medical'],
      "red",
      ['==', ['get', 'subtype'], 'military'],
      "darkgreen",
      ['==', ['get', 'subtype'], 'outbuilding'],
      "white",
      ['==', ['get', 'subtype'], 'religious'],
      "khaki",
      ['==', ['get', 'subtype'], 'residential'],
      "green",
      ['==', ['get', 'subtype'], 'service'],
      "gold",
      ['==', ['get', 'subtype'], 'transportation'],
      "orange",
      "grey",
    ],
    filter: ['any', ['==', ['geometry-type'], 'Polygon'], ['==', ['geometry-type'], 'MultiPolygon']]
  }
);
```

The following image shows a screenshot displaying the extrusion of buildings of different types near Central Park in New York City.

:::image type="content" source="media/add-custom-protocol-pmtiles/pmtiles-building.png"  lightbox="media/add-custom-protocol-pmtiles/pmtiles-building.png" alt-text="A screenshot demonstrating the custom protocol pmtiles.":::

For a fully functional sample with source code, see [Azure Maps Samples GitHub Repo].

<!--
For more PMTiles samples, see [Azure Maps Samples].
[Azure Maps Samples]: https://samples.azuremaps.com/?search=pmtiles
-->

## Next Steps

The following articles are related to custom protocol PMTiles:

> [!div class="nextstepaction"]
> [Create Data Source](create-data-source-web-sdk.md)

> [!div class="nextstepaction"]
> [Data Driven Style Expressions](data-driven-style-expressions-web-sdk.md)

[Azure Maps Samples GitHub Repo]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/PMTiles/Overture%20Building%20Theme/Buildings.html
[data schema]: https://docs.overturemaps.org/schema
[Overture]: https://overturemaps.org
[PMTiles]: https://docs.protomaps.com/pmtiles
