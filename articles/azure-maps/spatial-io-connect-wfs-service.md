---
title: Connect to a Web Feature Service (WFS) service | Microsoft Azure Maps
description: Learn how to connect to a WFS service, then query the WFS service using the Azure Maps web SDK and the Spatial IO module.
author: sinnypan
ms.author: sipa
ms.date: 06/20/2023
ms.topic: how-to
ms.service: azure-maps
---

# Connect to a WFS service

A Web Feature Service (WFS) is a web service for querying spatial data that has a standardized API defined by the Open Geospatial Consortium (OGC). The `WfsClient` class in the spatial IO module lets developers connect to a WFS service and query data from the service.

The `WfsClient` class supports the following features:

- Supported versions: `1.0.0`, `1.1.0`, and `2.0.0`
- Supported filter operators: binary comparisons, logic, math, value, and `bbox`.
- Requests are made using `HTTP GET` only.
- Supported operations:

    | Operation | Description |
    | :-- | :-- |
    | GetCapabilities | Generates a metadata document with valid WFS operations and parameters |
    | GetFeature | Returns a selection of features from a data source |
    | DescribeFeatureType | Returns the supported feature types |

## Using the WFS client

The `atlas.io.ogc.WfsClient` class in the spatial IO module makes it easy to query a WFS service and convert the responses into GeoJSON objects. This GeoJSON object can then be used for other mapping purposes.

The [Simple WFS example] sample shows how to easily query a Web Feature Service (WFS) and renders the returned features on the map. For the source code for this sample, see [Simple WFS example source code].

:::image type="content" source="./media/spatial-io-connect-wfs-service/simple-wfs-example.png"alt-text="A screenshot that shows the results of a WFS overlay on a map.":::

<!--------------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/MWwvVYY/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
---------------------------------------------------->

## Supported filters

The specification for the WFS standard makes use of OGC filters. The WFS client supports the following filters, assuming that the service being called also supports these filters. Custom filter strings can be passed into the `CustomFilter` class.

**Logical operators**

- `And`
- `Or`
- `Not`

**Value operators**

- `GmlObjectId`
- `ResourceId`

**Math operators**

- `Add`
- `Sub`
- `Mul`
- `Div`

**Comparison operators**

- `PropertyIsEqualTo`
- `PropertyIsNotEqualTo`
- `PropertyIsLessThan`
- `PropertyIsGreaterThan`
- `PropertyIsLessThanOrEqualTo`
- `PropertyIsGreaterThanOrEqualTo`
- `PropertyIsLike`
- `PropertyIsNull`
- `PropertyIsNil`
- `PropertyIsBetween`

The [WFS filter example] sample demonstrates the use of different filters with the WFS client. For the source code for this sample, see [WFS filter example source code].

:::image type="content" source="./media/spatial-io-connect-wfs-service/wfs-filter-example.png"alt-text="A screenshot that shows The WFS filter sample that demonstrates the use of different filters with the WFS client.":::

<!--------------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/NWqvYrV/?height=500&theme-id=0&default-tab=result&embed-version=2&editable=true]
-------------------------------------------------->

## WFS service explorer

The [WFS service explorer] sample is a simple tool for exploring WFS services on Azure Maps. For the source code for this sample, see [WFS service explorer source code].

:::image type="content" source="./media/spatial-io-connect-wfs-service/wfs-service-explorer.png"alt-text="A screenshot that shows a simple tool for exploring WFS services on Azure Maps.":::

<!--------------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/bGdrvmG/?height=700&theme-id=0&default-tab=result&embed-version=2&editable=true]
-------------------------------------------------->

To access WFS services hosted on non-CORS enabled endpoints, a CORS enabled proxy service can be passed into the `proxyService` option of the WFS client as shown in the following example.

```JavaScript
//Create the WFS client to access the service and use the proxy service settings
client = new atlas.io.ogc.WfsClient({
    url: url,
    proxyService: window.location.origin + '/YourCorsEnabledProxyService.ashx?url='
});
```

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [WfsClient]

> [!div class="nextstepaction"]
> [WfsServiceOptions]

See the following articles for more code samples to add to your maps:

> [!div class="nextstepaction"]
> [Leverage core operations]

> [!div class="nextstepaction"]
> [Supported data format details]

[Leverage core operations]: spatial-io-core-operations.md
[Simple WFS example source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Spatial%20IO%20Module/Simple%20WFS%20example/Simple%20WFS%20example.html
[Simple WFS example]: https://samples.azuremaps.com/spatial-io-module/simple-wfs-example
[Supported data format details]: spatial-io-supported-data-format-details.md
[WFS filter example source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Spatial%20IO%20Module/WFS%20filter%20examples/WFS%20filter%20examples.html
[WFS filter example]: https://samples.azuremaps.com/spatial-io-module/wfs-filter-examples
[WFS service explorer source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Spatial%20IO%20Module/WFS%20service%20explorer/WFS%20service%20explorer.html
[WFS service explorer]: https://samples.azuremaps.com/spatial-io-module/wfs-service-explorer
[WfsClient]: /JavaScript/api/azure-maps-spatial-io/atlas.io.ogc.wfsclient
[WfsServiceOptions]: /JavaScript/api/azure-maps-spatial-io/atlas.wfsserviceoptions
