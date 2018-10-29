---
title: Extending GeoJSON geometries in Azure Maps | Microsoft Docs
description: Learn how to extend GeoJSON geometries in Azure Maps 
author: sataneja
ms.author: sataneja
ms.date: 05/17/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
---


# Extending GeoJSON geometries

Azure Maps provides a list of powerful APIs to search inside/along geographical features.
These APIs standardize on [GeoJSON spec][1] for representing the geographical features (for example: state boundaries, routes).  

The [GeoJSON spec][1] only supports the following geometries:

* GeometryCollection
* LineString
* MultiLineString
* MultiPoint
* MultiPolygon
* Point
* Polygon

Some Azure Maps APIs (for example: [Search Inside Geometry](https://docs.microsoft.com/rest/api/maps/search/postsearchinsidegeometry)) accept geometries like "Circle", which are not part of the [GeoJSON spec][1].

This article provides a detailed explanation on how Azure Maps extends the [GeoJSON spec][1] to represent certain geometries.

### Circle

The `Circle` geometry is not supported by the [GeoJSON spec][1]. We use the `GeoJSON Feature` object to represent a circle.

A `Circle` geometry represented using the `GeoJSON Feature` object __must__ contain the following:

1. Center
   >The circle's center is represented using a `GeoJSON Point` type.

2. Radius
   >The circle's `radius` is represented using `GeoJSON Feature`'s properties. The radius value is in _meters_ and must be of the type `double`.

3. SubType
   >The circle geometry must also contain the `subType` property. This property must be a part of the `GeoJSON Feature`'s properties and it's value should be _Circle_


#### Example

Here's how you'll represent a circle centered at (latitude: 47.639754, longitude: -122.126986) with a radius equal to 100 meters, using a `GeoJSON Feature` object:

```json            
{
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-122.126986, 47.639754]
    },
    "properties": {
        "subType": "Circle",
        "radius": 100
    }
}          
```

[1]: https://tools.ietf.org/html/rfc7946
