---
title: GeoJSON data format for geofence | Microsoft Azure Maps
description: In this article, you will learn about how to prepare the geofence data that can be used in the Microsoft Azure Maps GET and POST Geofence API.
author: philmea
ms.author: philmea
ms.date: 02/14/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
---

# Geofencing GeoJSON data

The Azure Maps [GET Geofence](/rest/api/maps/spatial/getgeofence) and [POST Geofence](/rest/api/maps/spatial/postgeofence) APIs allow you to retrieve proximity of a coordinate relative to a provided geofence or set of fences. This article details how to prepare the geofence data that can be used in the Azure Maps GET and POST API.

The data for geofence or set of geofences is represented by `Feature` Object and `FeatureCollection` Object in `GeoJSON` format, which is defined in [rfc7946](https://tools.ietf.org/html/rfc7946). In Addition to it:

* The GeoJSON Object type can be a `Feature` Object or a `FeatureCollection` Object.
* The Geometry Object type can be a `Point`, `MultiPoint`, `LineString`, `MultiLineString`, `Polygon`, `MultiPolygon`, and `GeometryCollection`.
* All feature properties should contain a `geometryId`, which is used for identifying the geofence.
* Feature with `Point`, `MultiPoint`, `LineString`, `MultiLineString` must contain `radius` in properties. `radius` value is measured in meters, the `radius` value ranges from 1 to 10000.
* Feature with `polygon` and `multipolygon` geometry type does not have a radius property.
* `validityTime` is an optional property that lets the user set expired time and validity time period for the geofence data. If not specified, the data never expires and is always valid.
* The `expiredTime` is the expiration date and time of geofencing data. If the value of `userTime` in the request is later than this value, the corresponding geofence data is considered as expired data and is not queried. Upon which, the geometryId of this geofence data will be included in `expiredGeofenceGeometryId` array within the geofence response.
* The `validityPeriod` is a list of validity time period of the geofence. If the value of `userTime` in the request falls outside of the validity period, the corresponding geofence data is considered as invalid and will not be queried. The geometryId of this geofence data is included in `invalidPeriodGeofenceGeometryId` array within geofence response. The following table shows the properties of validityPeriod element.

| Name | Type | Required  | Description |
| :------------ |:------------: |:---------------:| :-----|
| startTime | Datetime  | true | The start date time of the validity time period. |
| endTime   | Datetime  | true |  The end date time of the validity time period. |
| recurrenceType | string | false |   The recurrence type of the period. The value can be `Daily`, `Weekly`, `Monthly`, or `Yearly`. Default value is `Daily`.|
| businessDayOnly | Boolean | false |  Indicate whether the data is only valid during business days. Default value is `false`.|


* All coordinate values are represented as [longitude, latitude] defined in `WGS84`.
* For each Feature, which contains `MultiPoint`, `MultiLineString`, `MultiPolygon` , or `GeometryCollection`, the properties are applied to all the elements. for example: All the points in `MultiPoint` will use same radius to form a multiple circle geofence.
* In point-circle scenario, a circle geometry can be represented using a `Point` geometry object with properties elaborated in [Extending GeoJSON geometries](https://docs.microsoft.com/azure/azure-maps/extend-geojson).      

Following is a sample request body for a geofence represented as a circle geofence geometry in `GeoJSON` using a center point and a radius. The valid period of the geofence data starts from 2018-10-22, 9AM to 5PM, repeated every day except for the weekend. `expiredTime` indicates this geofence data will be considered expired, if `userTime` in the request is later than `2019-01-01`.  

```json
{
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-122.126986, 47.639754]
    },
    "properties": {
        "geometryId" : "1",
        "subType": "Circle",
        "radius": 500,
        "validityTime": 
        {
            "expiredTime": "2019-01-01T00:00:00",
            "validityPeriod": [
                {
                    "startTime": "2018-10-22T09:00:00",
                    "endTime": "2018-10-22T17:00:00",
                    "recurrenceType": "Daily",
                    "recurrenceFrequency": 1,
                    "businessDayOnly": true
                }
            ]
        }
    }
}
```
