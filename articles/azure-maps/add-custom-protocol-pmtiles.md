---
title: Add custom protocol PMTiles in the Web SDK | Microsoft Azure Maps
description: Learn how to Add custom protocol PMTiles using the Web SDK.
author: sinnypan
ms.author: sipa
ms.date: 10/15/2024
ms.topic: how-to
ms.service: azure-maps
ms.subservice: web-sdk
---

# Add custom protocols

The Azure Maps Web SDK supports custom protocols such as [PMTiles], a unique archive format designed to efficiently store and deliver tiled data. Eabling this protocol in the Azure Maps Web SDK alows the compression of an entire tile dataset into a single file, improving portability. This protocol is particularly suitable for cloud-based storage solutions.

## Add custom protocol

By using the `addProtocol` function, which registers a callback triggered before any AJAX request made by the library, you can intercept, modify, and return the request for further processing and rendering. This enables the implementation of a custom callback function to load resources when a URL starts with the designated custom schema.

To start, add a reference to the protocol. The following example references the `pmtiles` library:

```html
  <script src="https://unpkg.com/pmtiles@3.0.5/dist/pmtiles.js"></script>
```

Then, initialize the MapLibre PMTiles protocol.

```js
//Initialize the plugin.
      const protocol = new pmtiles.Protocol();
      atlas.addProtocol("pmtiles", (request) => {
        return new Promise((resolve, reject) => {
          const callback = (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve({ data });
            }
          };
          protocol.tile(request, callback);
        });
      });
```

## Add PMTiles Protocol

To add the PMTiles protocal, hook the data source with specified protocol url schema. This sample leverages the [Overture] building dataset to enrich building data on top of the basemap.

```js
const PMTILES_URL = "https://overturemaps-tiles-us-west-2-beta.s3.amazonaws.com/2024-07-22/buildings.pmtiles";
protocol.add(new pmtiles.PMTiles(PMTILES_URL));
```

## Add PMTiles as Map Source

PMTiles are added as a map source during the map event. Once added, the specified URL schema is supported and recognized by the Azure Maps Web SDK. In the following sample, the PMTiles URL is added as a `VectorTileSource`.

> [!NOTE]
> Using the `pmtiles://` protocol automatically creates a `minzoom` and `maxzoom` property for the source.

```js
//Add the source to the map.
        map.sources.add(
          new atlas.source.VectorTileSource("pmtiles", {
            type: "vector",
            url: `pmtiles://${PMTILES_URL}`,
          })
        );
```

## Enrich Map with Overture data

Overture had been provided unified, comprehensive [data schema] with different themes. The following sample leverages the building theme's properties (e.g., building type, building height) to demonstrate building extrusion and differentiate building categories on the basemap, rather than just showing building footprints.

```js
//Create a polygon extrusion layer.
        layer = new atlas.layer.PolygonExtrusionLayer(
          "pmtiles",
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

The following image shows a screenshot displaying the extrusion of buildings by different types near Central Park, New York City.

:::image type="content" source="media/add-custom-protocol-pmtiles/pmtiles-building.png"  lightbox="media/add-custom-protocol-pmtiles/pmtiles-building.png" alt-text="A screenshot demonstrating the custom protocol pmtiles.":::

For a fully functional sample with source code, see [Azure Maps Samples GitHub Repo].

For more PMTiles samples, see [Azure Maps Samples].

## Next Steps

The following articles are related to custom protocol PMTiles:

> [!div class="nextstepaction"]
> [Create Data Source](create-data-source-web-sdk.md)

> [!div class="nextstepaction"]
> [Data Driven Style Expressions](data-driven-style-expressions-web-sdk.md)

[PMTiles]: https://docs.protomaps.com/pmtiles
[Azure Maps Samples]: https://samples.azuremaps.com/?search=pmtiles
[Azure Maps Samples GitHub Repo]: https://github.com/Azure-Samples/AzureMapsCodeSamples/tree/main/Samples
[data schema]: https://docs.overturemaps.org/schema
[Overture]: https://overturemaps.org
