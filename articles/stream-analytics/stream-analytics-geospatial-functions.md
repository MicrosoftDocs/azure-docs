---
title: Introduction to Azure Stream Analytics geospatial functions
description: This article describes geospatial functions that are used in Azure Stream Analytics jobs.
services: stream-analytics
author: mamccrea
ms.author: mamccrea
manager: kfile
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 08/20/2018
---

# Introduction to Stream Analytics geospatial functions

Geospatial functions in Azure Stream Analytics enable real-time analytics on streaming geospatial data. With just a few lines of code, you can develop a production grade solution for scenarios such as ride-sharing, fleet management, asset tracking, geo-fencing, and phone tracking across cell sites. The ability to join multiple streams of data with geospatial data can be used to answer complex questions on streaming data. Stream Analytics has adopted the GeoJSON standard for geospatial data. 

Stream Analytics Query Language has seven built-in geospatial functions:

- [CreateLineString](https://msdn.microsoft.com/en-us/azure/stream-analytics/reference/createlinestring)
- [CreatePoint](https://msdn.microsoft.com/en-us/azure/stream-analytics/reference/createpoint)
- [CreatePolygon](https://msdn.microsoft.com/en-us/azure/stream-analytics/reference/createpolygon)
- [ST_DISTANCE](https://msdn.microsoft.com/en-us/azure/stream-analytics/reference/st-distance)
- [ST_OVERLAPS](https://msdn.microsoft.com/en-us/azure/stream-analytics/reference/st-overlaps)
- [ST_INTERSECTS](https://msdn.microsoft.com/en-us/azure/stream-analytics/reference/st-intersects)
- [ST_WITHIN](https://msdn.microsoft.com/en-us/azure/stream-analytics/reference/st-within)

## CreateLineString

```SQL 
SELECT  
     CreateLineString(CreatePoint(input.latitude, input.longitude), CreatePoint(10.0, 10.0), CreatePoint(10.5, 10.5))  
FROM input  
```  

### Input Example  
  
|latitude|longitude|  
|--------------|---------------|  
|3.0|-10.2|  
|-87.33|20.2321|  
  
### Output Example  

 {"type" : "LineString", "coordinates" : [ [-10.2, 3.0], [10.0, 10.0], [10.5, 10.5] ]}

 {"type" : "LineString", "coordinates" : [ [20.2321, -87.33], [10.0, 10.0], [10.5, 10.5] ]}

## CreatePoint

```SQL 
SELECT  
     CreatePoint(input.latitude, input.longitude)  
FROM input 
```  

### Input Example  
  
|latitude|longitude|  
|--------------|---------------|  
|3.0|-10.2|  
|-87.33|20.2321|  
  
### Output Example
  
 {"type" : "Point", "coordinates" : [-10.2, 3.0]}  
  
 {"type" : "Point", "coordinates" : [20.2321, -87.33]}  

## CreatePolygon

```SQL 
SELECT  
     CreatePolygon(CreatePoint(input.latitude, input.longitude), CreatePoint(10.0, 10.0), CreatePoint(10.5, 10.5), CreatePoint(input.latitude, input.longitude))  
FROM input  
```  

### Input Example  
  
|latitude|longitude|  
|--------------|---------------|  
|3.0|-10.2|  
|-87.33|20.2321|  
  
### Output Example  

 {"type" : "Polygon", "coordinates" : [[ [-10.2, 3.0], [10.0, 10.0], [10.5, 10.5], [-10.2, 3.0] ]]}
 
 {"type" : "Polygon", "coordinates" : [[ [20.2321, -87.33], [10.0, 10.0], [10.5, 10.5], [20.2321, -87.33] ]]}

## ST_DISTANCE

Generate an event when a gas station is less than 10 km from the car:

```SQL
SELECT Cars.Location, Station.Location 
FROM Cars c  
JOIN Station s ON ST_DISTANCE(c.Location, s.Location) < 10 * 1000
```

## ST_OVERLAPS

Generate an event when building is within a possible flooding zone:

```SQL
SELECT Building.Polygon, Building.Polygon 
FROM Building b 
JOIN Flooding f ON ST_OVERLAPS(b.Polygon, b.Polygon) 
```

Generate an event when a storm is heading towards a car:

```SQL
SELECT Cars.Location, Storm.Course
FROM Cars c, Storm s
JOIN Storm s ON ST_OVERLAPS(c.Location, s.Course)
```

## ST_INTERSECTS

```SQL 
SELECT  
     ST_INTERSECTS(input.pavedRoad, input.dirtRoad)  
FROM input  
```  

### Input Example  
  
|datacenterArea|stormArea|  
|--------------------|---------------|  
|{“type”:”LineString”, “coordinates”: [ [-10.0, 0.0], [0.0, 0.0], [10.0, 0.0] ]}|{“type”:”LineString”, “coordinates”: [ [0.0, 10.0], [0.0, 0.0], [0.0, -10.0] ]}|  
|{“type”:”LineString”, “coordinates”: [ [-10.0, 0.0], [0.0, 0.0], [10.0, 0.0] ]}|{“type”:”LineString”, “coordinates”: [ [-10.0, 10.0], [0.0, 10.0], [10.0, 10.0] ]}|  
  
### Output Example  

 1  
  
 0  

## ST_WITHIN

```SQL 
SELECT  
     ST_WITHIN(input.deliveryDestination, input.warehouse)  
FROM input 
```  

### Input Example  
  
|deliveryDestination|warehouse|  
|-------------------------|---------------|  
|{“type”:”Point”, “coordinates”: [76.6, 10.1]}|{“type”:”Polygon”, “coordinates”: [ [0.0, 0.0], [10.0, 0.0], [10.0, 10.0], [0.0, 10.0], [0.0, 0.0] ]}|  
|{“type”:”Point”, “coordinates”: [15.0, 15.0]}|{“type”:”Polygon”, “coordinates”: [ [10.0, 10.0], [20.0, 10.0], [20.0, 20.0], [10.0, 20.0], [10.0, 10.0] ]}|  
  
### Output Example  

 0  
  
 1  
