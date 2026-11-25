---
title: Geospatial Functions in Azure Stream Analytics
description: Learn how geospatial functions in Azure Stream Analytics enable real-time analytics on streaming location data for scenarios like fleet tracking and geo-fencing.
ms.service: azure-stream-analytics
ms.topic: concept-article
ms.date: 08/25/2026
ai-usage: ai-assisted

#customer intent: As a Stream Analytics developer, I want to understand the built-in geospatial functions so that I can build real-time analytics on streaming geospatial data.
---

# Introduction to Stream Analytics geospatial functions

Geospatial functions in Azure Stream Analytics enable real-time analytics on streaming geospatial data for scenarios like ride-sharing, fleet management, asset tracking, geo-fencing, and phone tracking across cell sites. With only a few lines of query code, you can build solutions that use the seven built-in functions in Stream Analytics Query Language (`CreateLineString`, `CreatePoint`, `CreatePolygon`, `ST_DISTANCE`, `ST_OVERLAPS`, `ST_INTERSECTS`, and `ST_WITHIN`), which support all WKT types and GeoJSON point, polygon, and LineString. This article describes each function and shows example queries so that you can apply them to your own streaming data.

## Geometry types and coordinate order

The geospatial functions work with three GeoJSON geometry types. A *point* is a single location defined by a longitude and latitude. A *LineString* is an ordered set of two or more points that forms a connected line, such as a route or a road. A *polygon* is a closed shape whose boundary returns to its starting point, such as a building footprint or a geo-fence.

The functions fall into two groups. Constructor functions (`CreatePoint`, `CreateLineString`, and `CreatePolygon`) build geometries from coordinate values in your event data. Relationship functions (`ST_DISTANCE`, `ST_OVERLAPS`, `ST_INTERSECTS`, and `ST_WITHIN`) compare two geometries and describe how they relate in space.

In GeoJSON, coordinates are ordered longitude first and latitude second, so an input latitude and longitude appear in the reverse order in the resulting geometry. Understanding this ordering, along with the counter-clockwise ring orientation that polygons require, helps you predict the output of each function.

## CreateLineString

`CreateLineString` is a constructor function that returns a GeoJSON LineString, a geometry that represents a connected series of points as a line on a map. It accepts two or more points and connects them in the order you list them, which makes it a natural way to model routes, paths, and road segments from streaming data.

The following example illustrates this behavior by combining three points into a LineString. The first point comes from streaming input data, and you define the other two manually.

```sql
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

To learn more, see the [CreateLineString](/stream-analytics-query/createlinestring) reference.

## CreatePoint

`CreatePoint` is a constructor function that returns a GeoJSON point from a latitude and longitude. A point is the most basic geometry and represents a single location on a map, such as the current position of a vehicle or an asset. The latitude and longitude values must be a `float` datatype.

The following example illustrates this behavior by creating a point from the latitude and longitude values in streaming input data.

```sql
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

To learn more, see the [CreatePoint](/stream-analytics-query/createpoint) reference.

## CreatePolygon

`CreatePolygon` is a constructor function that returns a GeoJSON polygon from a set of points. A polygon represents an enclosed area on a map, such as a building footprint, a warehouse boundary, or a geo-fence. The order of points follows right-hand ring orientation, or counter-clockwise: if you imagine walking from one point to the next in the order you declare them, the center of the polygon stays to your left the entire time.

The following example illustrates this behavior by creating a polygon from three points. You define the first two points manually, and the last point comes from input data.

```sql
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

`ST_DISTANCE` is a relationship function that returns the distance between two geometries in meters. It helps you understand how near or far two locations are, which is useful for proximity scenarios such as nearby-vehicle alerts and service-area calculations.

The following example shows how to use this function to identify when a gas station is less than 10 km from a car.

```sql
SELECT Cars.Location, Station.Location 
FROM Cars c  
JOIN Station s ON ST_DISTANCE(c.Location, s.Location) < 10 * 1000
```

To learn more, see the [ST_DISTANCE](/stream-analytics-query/st-distance) reference.

## ST_OVERLAPS

`ST_OVERLAPS` is a relationship function that compares two geometries and reports whether they share a common region. It returns 1 when the geometries overlap and 0 when they don't. This function is useful for detecting spatial conflicts such as a hazard zone touching an area of interest.

The following example shows how to use this function to identify when a building lies within a possible flooding zone.

```sql
SELECT Building.Polygon, Flooding.Polygon
FROM Building b 
JOIN Flooding f ON ST_OVERLAPS(b.Polygon, f.Polygon)
```

The next example also uses `ST_OVERLAPS` to detect when a storm heads toward a car.

```sql
SELECT Cars.Location, Storm.Course
FROM Cars c
JOIN Storm s ON ST_OVERLAPS(c.Location, s.Course)
```

To learn more, see the [ST_OVERLAPS](/stream-analytics-query/st-overlaps) reference.

## ST_INTERSECTS

`ST_INTERSECTS` is a relationship function that compares two geometries and reports whether they cross or touch. It returns 1 when the geometries intersect and 0 when they don't. This function helps you detect where paths or regions meet.

The following example shows how to use this function to determine whether a paved road intersects a dirt road.

```sql
SELECT  
     ST_INTERSECTS(input.pavedRoad, input.dirtRoad)  
FROM input  
```  

### Input example  
  
|pavedRoad|dirtRoad|
|--------------------|---------------|  
|{"type":"LineString", "coordinates": [ [-10.0, 0.0], [0.0, 0.0], [10.0, 0.0] ]}|{"type":"LineString", "coordinates": [ [0.0, 10.0], [0.0, 0.0], [0.0, -10.0] ]}|  
|{"type":"LineString", "coordinates": [ [-10.0, 0.0], [0.0, 0.0], [10.0, 0.0] ]}|{"type":"LineString", "coordinates": [ [-10.0, 10.0], [0.0, 10.0], [10.0, 10.0] ]}|  
  
### Output example  

 1  
  
 0  

To learn more, visit the [ST_INTERSECTS](/stream-analytics-query/st-intersects) reference.

## ST_WITHIN

`ST_WITHIN` is a relationship function that reports whether one geometry is fully contained within another. It returns 1 when the first geometry lies inside the second and 0 when it doesn't, which is the basis for containment scenarios such as geo-fencing and delivery-zone checks.

The following example illustrates this behavior by determining whether a delivery destination point lies within a given warehouse polygon.

```sql
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

## Related content

* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Azure Stream Analytics Query Language Reference](/stream-analytics-query/stream-analytics-query-language-reference)
* [Azure Stream Analytics Management REST API Reference](/rest/api/streamanalytics/)
