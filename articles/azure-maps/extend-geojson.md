---
title: Extended GeoJSON geometries | Microsoft Azure Maps
description: Learn how Azure Maps extends the GeoJSON spec to include more geometric shapes. View examples that set up circles and rectangles for use in maps.
author: sataneja
ms.author: sataneja
ms.date: 05/17/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
---


# Extended GeoJSON geometries

Azure Maps provides a list of powerful APIs to search inside and along geographical features. These APIs adhere to the standard [GeoJSON spec] of representing geographical features.  

The [GeoJSON spec] supports only the following geometries:

* GeometryCollection
* LineString
* MultiLineString
* MultiPoint
* MultiPolygon
* Point
* Polygon

Some Azure Maps APIs accept geometries that aren't part of the [GeoJSON spec]. For instance, the [Search Inside Geometry] API accepts Circle and Polygons.

This article provides a detailed explanation on how Azure Maps extends the [GeoJSON spec] to represent certain geometries.

## Circle

The [GeoJSON spec] doesn't support the `Circle` geometry. The `GeoJSON Point Feature` object is used to represent a circle.

A `Circle` geometry represented using the `GeoJSON Feature` object __must__ contain the following coordinates and properties:

| Coordinate | Property                                          |
|------------|---------------------------------------------------|
| Center     | The circle's center is represented using a `GeoJSON Point` object. |
| Radius     | The circle's `radius` is represented using `GeoJSON Feature`'s properties. The radius value is in _meters_ and must be of the type `double`. |
| SubType    | The circle geometry must also contain the `subType` property. This property must be a part of the `GeoJSON Feature`'s properties and its value should be _Circle_ |

### Circle example

Here's how you represent a circle using a `GeoJSON Feature` object. Let's center the circle at latitude: 47.639754 and longitude: -122.126986, and assign it a radius equal to 100 meters:

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

The [GeoJSON spec] doesn't support the `Rectangle` geometry. The `GeoJSON Polygon Feature` object is used to represent a rectangle. The rectangle extension is primarily used by the Web SDK's drawing tools module.

A `Rectangle` geometry represented using the `GeoJSON Polygon Feature` object __must__ contain the following coordinates and properties:

| Coordinate | Property                                          |
|------------|---------------------------------------------------|
| Corners    | The rectangle's corners are represented using the coordinates of a `GeoJSON Polygon` object. There should be five coordinates, one for each corner. And, a fifth coordinate that is the same as the first coordinate, to close the polygon ring. It's assumed that these coordinates align, and that the developer may rotate them as wanted. |
| SubType    | The rectangle geometry must also contain the `subType` property. This property must be a part of the `GeoJSON Feature`'s properties, and its value should be _Rectangle_. |

### Rectangle example

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
> [Geofence GeoJSON format]

Review the glossary of common technical terms associated with Azure Maps and location intelligence applications:

> [!div class="nextstepaction"]
> [Azure Maps glossary]

[GeoJSON spec]: https://tools.ietf.org/html/rfc7946
[Search Inside Geometry]: /rest/api/maps/search/postsearchinsidegeometry
[Geofence GeoJSON format]: geofence-geojson.md
[Azure Maps glossary]: glossary.md
