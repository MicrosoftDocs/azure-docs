---
title: Introduction to Azure Stream Analytics geospatial functions
description: This article describes geospatial functions that are used in Azure Stream Analytics jobs.
ms.service: stream-analytics
author: enkrumah
ms.author: ebnkruma
ms.topic: conceptual
ms.date: 12/06/2018
---

# Introduction to Stream Analytics geospatial functions

Geospatial functions in Azure Stream Analytics enable real-time analytics on streaming geospatial data. With just a few lines of code, you can develop a production grade solution for complex scenarios. These functions support all WKT types and GeoJSON Point, Polygon, and LineString.

Examples of scenarios that can benefit from geospatial functions include:

* Ride-sharing
* Fleet management
* Asset tracking
* Geo-fencing
* Phone tracking across cell sites

Stream Analytics Query Language has seven built-in geospatial functions: **CreateLineString**, **CreatePoint**, **CreatePolygon**, **ST_DISTANCE**, **ST_OVERLAPS**, **ST_INTERSECTS**, and **ST_WITHIN**.

## CreateLineString

The `CreateLineString` function accepts points and returns a GeoJSON LineString, which can be plotted as a line on a map. You must have at least two points to create a LineString. The LineString points will be connected in order.

The following query uses `CreateLineString` to create a LineString using three points. The first point is created from streaming input data, while the other two are created manually.

```SQL 
SELECT  
     CreateLineString(CreatePoint(input.latitude, input.longitude), CreatePoint(10.0, 10.0), CreatePoint(10.5, 10.5))  
FROM input  
```  

### Input example  
  
|latitude|longitude|  
|--------------|---------------|  
|3.0|-10.2|  
|-87.33|20.2321|  
  
### Output example  

 {"type" : "LineString", "coordinates" : [ [-10.2, 3.0], [10.0, 10.0], [10.5, 10.5] ]}

 {"type" : "LineString", "coordinates" : [ [20.2321, -87.33], [10.0, 10.0], [10.5, 10.5] ]}

To learn more, visit the [CreateLineString](/stream-analytics-query/createlinestring) reference.

## CreatePoint

The `CreatePoint` function accepts a latitude and longitude and returns a GeoJSON point, which can be plotted on a map. Your latitudes and longitudes must be a **float** datatype.

The following example query uses `CreatePoint` to create a point using latitudes and longitudes from streaming input data.

```SQL 
SELECT  
     CreatePoint(input.latitude, input.longitude)  
FROM input 
```  

### Input example  
  
|latitude|longitude|  
|--------------|---------------|  
|3.0|-10.2|  
|-87.33|20.2321|  
  
### Output example
  
 {"type" : "Point", "coordinates" : [-10.2, 3.0]}  
  
 {"type" : "Point", "coordinates" : [20.2321, -87.33]}  

To learn more, visit the [CreatePoint](/stream-analytics-query/createpoint) reference.

## CreatePolygon

The `CreatePolygon` function accepts points and returns a GeoJSON polygon record. The order of points must follow right-hand ring orientation, or counter-clockwise. Imagine walking from one point to another in the order they were declared. The center of the polygon would be to your left the entire time.

The following example query uses `CreatePolygon` to create a polygon from three points. The first two points are created manually, and the last point is created from input data.

```SQL 
SELECT  
     CreatePolygon(CreatePoint(input.latitude, input.longitude), CreatePoint(10.0, 10.0), CreatePoint(10.5, 10.5), CreatePoint(input.latitude, input.longitude))  
FROM input  
```  

### Input example  
  
|latitude|longitude|  
|--------------|---------------|  
|3.0|-10.2|  
|-87.33|20.2321|  
  
### Output example  

 {"type" : "Polygon", "coordinates" : [[ [-10.2, 3.0], [10.0, 10.0], [10.5, 10.5], [-10.2, 3.0] ]]}
 
 {"type" : "Polygon", "coordinates" : [[ [20.2321, -87.33], [10.0, 10.0], [10.5, 10.5], [20.2321, -87.33] ]]}

To learn more, visit the [CreatePolygon](/stream-analytics-query/createpolygon) reference.


## ST_DISTANCE
The `ST_DISTANCE` function returns the distance between two geometries in meters. 

The following query uses `ST_DISTANCE` to generate an event when a gas station is less than 10 km from the car.

```SQL
SELECT Cars.Location, Station.Location 
FROM Cars c  
JOIN Station s ON ST_DISTANCE(c.Location, s.Location) < 10 * 1000
```

To learn more, visit the [ST_DISTANCE](/stream-analytics-query/st-distance) reference.

## ST_OVERLAPS
The `ST_OVERLAPS` function compares two geometries. If the geometries overlap, the function returns a 1. The function returns 0 if the geometries don't overlap. 

The following query uses `ST_OVERLAPS` to generate an event when a building is within a possible flooding zone.

```SQL
SELECT Building.Polygon, Building.Polygon 
FROM Building b 
JOIN Flooding f ON ST_OVERLAPS(b.Polygon, b.Polygon) 
```

The following example query generates an event when a storm is heading towards a car.

```SQL
SELECT Cars.Location, Storm.Course
FROM Cars c, Storm s
JOIN Storm s ON ST_OVERLAPS(c.Location, s.Course)
```

To learn more, visit the [ST_OVERLAPS](/stream-analytics-query/st-overlaps) reference.

## ST_INTERSECTS
The `ST_INTERSECTS` function compares two geometries. If the geometries intersect, then the function returns 1. The function returns 0 if the geometries don't intersect each other.

The following example query uses `ST_INTERSECTS` to determine if a paved road intersects a dirt road.

```SQL 
SELECT  
     ST_INTERSECTS(input.pavedRoad, input.dirtRoad)  
FROM input  
```  

### Input example  
  
|datacenterArea|stormArea|  
|--------------------|---------------|  
|{"type":"LineString", "coordinates": [ [-10.0, 0.0], [0.0, 0.0], [10.0, 0.0] ]}|{"type":"LineString", "coordinates": [ [0.0, 10.0], [0.0, 0.0], [0.0, -10.0] ]}|  
|{"type":"LineString", "coordinates": [ [-10.0, 0.0], [0.0, 0.0], [10.0, 0.0] ]}|{"type":"LineString", "coordinates": [ [-10.0, 10.0], [0.0, 10.0], [10.0, 10.0] ]}|  
  
### Output example  

 1  
  
 0  

To learn more, visit the [ST_INTERSECTS](/stream-analytics-query/st-intersects) reference.

## ST_WITHIN
The `ST_WITHIN` function determines whether a geometry is within another geometry. If the first is contained in the last, the function will return 1. The function will return 0 if the first geometry isn't located within the last one.

The following example query uses `ST_WITHIN` to determine whether the delivery destination point is within the given warehouse polygon.

```SQL 
SELECT  
     ST_WITHIN(input.deliveryDestination, input.warehouse)  
FROM input 
```  

### Input example  
  
|deliveryDestination|warehouse|  
|-------------------------|---------------|  
|{"type":"Point", "coordinates": [76.6, 10.1]}|{"type":"Polygon", "coordinates": [ [0.0, 0.0], [10.0, 0.0], [10.0, 10.0], [0.0, 10.0], [0.0, 0.0] ]}|  
|{"type":"Point", "coordinates": [15.0, 15.0]}|{"type":"Polygon", "coordinates": [ [10.0, 10.0], [20.0, 10.0], [20.0, 20.0], [10.0, 20.0], [10.0, 10.0] ]}|  
  
### Output example  

 0  
  
 1  

To learn more, visit the [ST_WITHIN](/stream-analytics-query/st-within) reference.

## Next steps

* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](/stream-analytics-query/stream-analytics-query-language-reference)
* [Azure Stream Analytics Management REST API Reference](/rest/api/streamanalytics/)
