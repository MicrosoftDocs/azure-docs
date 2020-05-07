---
title: Connect to a Web Feature Service (WFS) service | Microsoft Azure Maps
description: Learn how to connect to a WFS service, then query the WFS service using the Azure Maps web SDK and the Spatial IO module.
author: philmea
ms.author: philmea
ms.date: 03/03/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Connect to a WFS service

A Web Feature Service (WFS) is a web service for querying spatial data that has a standardized API that is defined by the Open Geospatial Consortium (OGC). The `WfsClient` class in the spatial IO module lets developers connect to a WFS service and query data from the service.

The following features are supported by the `WfsClient` class:

- Supported versions: `1.0.0`, `1.1.0`, and `2.0.0`
- Supported filter operators: binary comparisons, logic, math, value, and `bbox`.
- Requests are made using `HTTP GET` only.
- Supported operations:

    | | |
    | :-- | :-- |
    | GetCapabilities | Generates a metadata document with valid WFS operations and parameters |
    | GetFeature | Returns a selection of features from a data source |
    | DescribeFeatureType | Returns the supported feature types |

## Using the WFS client

The `atlas.io.ogc.WfsClient` class in the spatial IO module makes it easy to query a WFS service and convert the responses into GeoJSON objects. This GeoJSON object can then be used for other mapping purposes.

The following code queries a WFS service and renders the returned features on the map.

<br/>

<iframe height='700' scrolling='no' title='Simple WFS example' src='//codepen.io/azuremaps/embed/MWwvVYY/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/MWwvVYY/'>Simple WFS example</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Supported filters

The specification for the WFS standard makes use of OGC filters. The filters below are supported by the WFS client, assuming that the service being called also supports these filters. Custom filter strings can be passed into the `CustomFilter` class.

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

The following code demonstrates the use of different filters with the WFS client.

<br/>

<iframe height='500' scrolling='no' title= 'WFS filter examples' src='//codepen.io/azuremaps/embed/NWqvYrV/?height=500&theme-id=0&default-tab=result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/NWqvYrV/'>WFS filter examples</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## WFS service explorer

The following code uses the WFS client to explore WFS services. Select a property type layer within the service and see the associated legend.

<br/>

<iframe height='700' style='width: 100%;' scrolling='no' title= 'WFS service explorer' src='//codepen.io/azuremaps/embed/bGdrvmG/?height=700&theme-id=0&default-tab=result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/bGdrvmG/'>WFS service explorer</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

To access WFS services hosted on non-CORS enabled endpoints, a CORS enabled proxy service can be passed into the `proxyService` option of the WFS client as shown below. 

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
> [WfsClient](https://docs.microsoft.com/JavaScript/api/azure-maps-spatial-io/atlas.io.ogc.wfsclient)

> [!div class="nextstepaction"]
> [WfsServiceOptions](https://docs.microsoft.com/JavaScript/api/azure-maps-spatial-io/atlas.wfsserviceoptions)

See the following articles for more code samples to add to your maps:

> [!div class="nextstepaction"]
> [Leverage core operations](spatial-io-core-operations.md)

> [!div class="nextstepaction"]
> [Supported data format details](spatial-io-supported-data-format-details.md)
