---
title: Extended GeoJSON geometries in Azure Maps | Microsoft Docs
description: Learn how to extend GeoJSON geometries in Azure Maps 
author: sataneja
ms.author: sataneja
ms.date: 05/17/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
---


# Extended GeoJSON geometries

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

## Circle

The `Circle` geometry is not supported by the [GeoJSON spec][1]. We use a `GeoJSON Point Feature` object to represent a circle.

A `Circle` geometry represented using the `GeoJSON Feature` object __must__ contain the following:

- Center

    The circle's center is represented using a `GeoJSON Point` object.

- Radius

    The circle's `radius` is represented using `GeoJSON Feature`'s properties. The radius value is in _meters_ and must be of the type `double`.

- SubType

    The circle geometry must also contain the `subType` property. This property must be a part of the `GeoJSON Feature`'s properties and its value should be _Circle_

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

## Rectangle

The `Rectangle` geometry is not supported by the [GeoJSON spec][1]. We use a `GeoJSON Polygon Feature` object to represent a rectangle. The rectangle extension is primarily used by the Web SDK's drawing tools module.

A `Rectangle` geometry represented using the `GeoJSON Polygon Feature` object __must__ contain the following:

- Corners

    The rectangle's corners are represented using the coordinates of a `GeoJSON Polygon` object. There should be five coordinates, one for each corner and a fifth coordinate that is the same as the 1st to close the polygon ring. These coordinates will be assumed to be aligned and rotated as desired by the developer.

- SubType

    The rectangle geometry must also contain the `subType` property. This property must be a part of the `GeoJSON Feature`'s properties and its value should be _Rectangle_

### Example

```json
{
    "type": "Feature",
    "geometry": {
        "type": "Polygon",
        "coordinates": [[[5,25],[14,25],[14,29],[5,29],[5,25]]]
    },
    "properties": {
        "subType": "Rectangle"
    }
}

```
## Next steps

Learn more about GeoJSON data in Azure Maps:

> [!div class="nextstepaction"]
> [Geofence GeoJSON format](geofence-geojson.md)

Review the glossary of common technical terms associated with Azure Maps and location intelligence applications:

> [!div class="nextstepaction"]
> [Azure Maps glossary](glossary.md)

[1]: https://tools.ietf.org/html/rfc7946
