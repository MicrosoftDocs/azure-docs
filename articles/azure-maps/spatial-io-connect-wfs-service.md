---
title:  Connect to a WFS service | Microsoft Azure Maps
description: Learn how to connect to a WFS service, and query the WFS service using the Azure Maps web SDK and the Spatial IO module.
author: farah-alyasari
ms.author: v-faalya
ms.date: 03/03/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Connect to a WFS service

A Web Feature Service (WFS) is a web service for querying spatial data that has a standardized API interface that has been defined by the Open Geospatial Consortium (OGC). 

The following outlines the features supported by the `WfsClient` class in the spatial IO module.

- Supported versions: 1.0.0, 1.1.0, 2.0.0
- Supported filter operators: binary comparisons, logic, math, value, `bbox`.
- Requests are made only using `HTTP GET`.
- Supported operations:

| | |
| :-- | :-- |
| GetCapabilities | Generates a metadata document with valid WFS operations and parameters |
| GetFeature | Returns a selection of features from a data source |
| DescribeFeatureType | Returns the supported feature types |

## Using the WFS client

The `atlas.io.ogc.WfsClient` class in the spatial IO module makes it easy to query a WFS service and convert the responses into GeoJSON objects. This GeoJSON object can then be used for other purposes.

The following code shows how to query a WFS service and render the features it returns on the map.

<br/>

<iframe height='500' scrolling='no' title='Simple WFS example' src='/codepen.io/azuremaps/embed/MWwvVYY/?height=500&theme-id=0&default-tab=result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/MWwvVYY/'>Simple WFS example</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Supported filters

The specification for the WFS standard makes use of OGC filters. The filters below are supported by the WFS client, assuming that the service being called also supports these filters. Moreover. Custom filter strings can be passed into the `CustomFilter` class.

**Logical operaters**

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

<iframe height='500' scrolling='no' title= 'WFS filter examples' src='/codepen.io/azuremaps/embed/NWqvYrV/?height=500&theme-id=0&default-tab=result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/NWqvYrV/'>WFS filter examples</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## WFS service explorer

The following code demonstrates how to use the WFS client with the map to explorer WFS services. Select layers within the service and see the legend associated with those layers.

<br/>

<iframe height='500' scrolling='no' title= 'WFS service explorer' src='/codepen.io/azuremaps/embed/bGdrvmG/?height=500&theme-id=0&default-tab=result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/bGdrvmG/'>WFS service explorer</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

You may also use a proxy service to load resource that are hosted on domains that are not CORs enabled. You would first define a variable to hold the proxy service url and set the `proxyService` option for the WFS client. To render a proxy service option for the user, add a user input and load the service url when the input is clicked. The following snippets show you how to use the proxy service.

```javascript

//A variable to hold the URL of the proxy service
var proxyServiceUrl = window.location.origin + 'CorsEnabledProxyService.ashx?url=';

//Create the WFS client to access the service and use the proxy service settings
client = new atlas.io.ogc.WfsClient({
    url: url,
    proxyService: (document.getElementById('useProxyService').checked) ? proxyServiceUrl : null
});

function proxyOptionChanged() {
    if (currentServiceUrl) {
        loadClient(currentServiceUrl);
    }
}

```

The HTML code block below corresponds to the above javascript code snippet:

```html
<!-- use the proxy service -->
<input id="useProxyService" type="checkbox" onclick="proxyOptionChanged()"/>
```

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [WfsClient](https://docs.microsoft.com/en-us/javascript/api/azure-maps-spatial-io/atlas.io.ogc.wfsclient)

> [!div class="nextstepaction"]
> [WfsServiceOptions](https://docs.microsoft.com/javascript/api/azure-maps-spatial-io/atlas.wfsserviceoptions)

See the following articles for more code samples to add to your maps:

> [!div class="nextstepaction"]
> [Leverage core operations](spatial-io-core-operations.md)

> [!div class="nextstepaction"]
> [Supported data format details](spatial-io-supported-data-format-details.md)
