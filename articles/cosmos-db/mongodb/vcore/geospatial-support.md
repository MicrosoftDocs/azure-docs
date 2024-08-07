---
title: Support for Geospatial Queries
titleSuffix: Introducing support for geospatial queries on vCore based Azure Cosmos DB for MongoDB.
description: Introducing support for geospatial queries on vCore based Azure Cosmos DB for MongoDB.
author: suvishodcitus
ms.author: suvishod
ms.reviewer: abramees
ms.service: azure-cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 07/31/2024
---

# Support for Geospatial Queries

[!INCLUDE[MongoDB (vCore)](~/reusable-content/ce-skilling/azure/includes/cosmos-db/includes/appliesto-mongodb-vcore.md)]

Geospatial data can now be stored and queried using vCore-based Azure Cosmos DB for MongoDB. This enhancement provides powerful tools to manage and analyze spatial data, enabling a wide range of applications such as real-time location tracking, route optimization, and spatial analytics.

Here’s a quick overview of the geospatial commands and operators now supported:

## Geospatial Query Operators

### **$geoIntersects**
Selects documents where a specified geometry intersects with the documents' geometry. Useful for finding documents that share any portion of space with a given geometry.

  ```json
     db.collection.find({
         location: {
             $geoIntersects: {
                 $geometry: {
                     type: "<GeoJSON object type>",
                     coordinates: [[[...], [...], [...], [...]]]
                 }
             }
         }
     })
  ```

### **$geoWithin**
Selects documents with geospatial data that exists entirely within a specified shape. This operator is used to find documents within a defined area.

  ```json
     db.collection.find({
         location: {
             $geoWithin: {
                 $geometry: {
                     type: "Polygon",
                     coordinates: [[[...], [...], [...], [...]]]
                 }
             }
         }
     })
  ```

### **$box**
Defines a rectangular area using two coordinate pairs (bottom-left and top-right corners). Used with the `$geoWithin` operator to find documents within this rectangle. For example, finding all locations within a rectangular region on a map.

   ```json
     db.collection.find({
         location: {
             $geoWithin: {
                 $box: [[lowerLeftLong, lowerLeftLat], [upperRightLong, upperRightLat]]
             }
         }
     })
   ```

### **$center**
Defines a circular area using a center point and a radius in radians. Used with the `$geoWithin` operator to find documents within this circle.

   ```json
     db.collection.find({
         location: {
             $geoWithin: {
                 $center: [[longitude, latitude], radius]
             }
         }
     })
   ```

### **$centerSphere**
Similar to `$center`, but defines a spherical area using a center point and a radius in radians. Useful for spherical geometry calculations.

   ```json
     db.collection.find({
         location: {
             $geoWithin: {
                 $centerSphere: [[longitude, latitude], radius]
             }
         }
     })
   ```

### **$geometry**
Specifies a GeoJSON object to define a geometry. Used with geospatial operators to perform queries based on complex shapes.

   ```json
     db.collection.find({
         location: {
             $geoIntersects: {
                 $geometry: {
                     type: "<GeoJSON object type>",
                     coordinates: [longitude, latitude]
                 }
             }
         }
     })
   ```

### **$maxDistance**
Specifies the maximum distance from a point for a geospatial query. Used with `$near` and `$nearSphere` operators. For example, finding all locations within 2 km of a given point.

   ```json
     db.collection.find({
         location: {
             $near: {
                 $geometry: {
                     type: "Point",
                     coordinates: [longitude, latitude]
                 },
                 $maxDistance: distance
             }
         }
     })
   ```

### **$minDistance**
Specifies the minimum distance from a point for a geospatial query. Used with `$near` and `$nearSphere` operators.

   ```json
     db.collection.find({
         location: {
             $near: {
                 $geometry: {
                     type: "Point",
                     coordinates: [longitude, latitude]
                 },
                 $minDistance: distance
             }
         }
     })
   ```

### **$polygon**
Defines a polygon using an array of coordinate pairs. Used with the `$geoWithin` operator to find documents within this polygon.

   ```json
     db.collection.find({
         location: {
             $geoWithin: {
                 $geometry: {
                     type: "Polygon",
                     coordinates: [[[...], [...], [...], [...]]]
                 }
             }
         }
     })
   ```

### **$near**
Finds documents that are near a specified point. Returns documents sorted by distance from the point. For example, finding the nearest restaurants to a user's location.

  ```json
      db.collection.find({
          location: {
              $near: {
                  $geometry: {
                      type: "Point",
                      coordinates: [longitude, latitude]
                  },
                  $maxDistance: distance
              }
          }
      })
  ```


### **$nearSphere**
Similar to `$near`, but performs calculations on a spherical surface. Useful for more accurate distance calculations on the Earth's surface.

  ```json
      db.collection.find({
          location: {
              $nearSphere: {
                  $geometry: {
                      type: "Point",
                      coordinates: [longitude, latitude]
                  },
                  $maxDistance: distance
              }
          }
      })
  ```   

## Geospatial Aggregation Stage

### **$geoNear**
Performs a geospatial query to return documents sorted by distance from a specified point. Can include additional query criteria and return distance information.

   ```json
     db.collection.aggregate([
         {
             $geoNear: {
                 near: {
                     type: "Point",
                     coordinates: [longitude, latitude]
                 },
                 distanceField: "distance",
                 spherical: true
             }
         }
     ])
   ```


## Considerations and Unsupported Capabilities


* Currently, querying with a single-ringed GeoJSON polygon whose area exceeds a single hemisphere isn't supported. In such cases, Mongo vCore returns the following error message:
   ```json
   Error: Custom CRS for big polygon is not supported yet.
   ```
* A composite index using a regular index and geospatial index isn't allowed. For example:
   ```json
   db.collection.createIndex({a: "2d", b: 1});
   Error: Compound 2d indexes are not supported yet
   ```
* Polygons with holes are currently not supported for use with $geoWithin queries. Although inserting a polygon with holes is not restricted, it eventually fails with the following error message:

   ```json
   Error: $geoWithin currently doesn't support polygons with holes
   ```
* The key field is always required in the $geoNear aggregation stage. If the key field is missing, the following error occurs:

   ```json
   Error: $geoNear requires a 'key' option as a String
   ```
* The `$geoNear`, `$near`, and `$nearSphere` stages don't have strict index requirements, so these queries wouldn't fail if an index is missing.

## Related content

- Read more about [feature compatibility with MongoDB.](compatibility.md)
- Review options for [migrating from MongoDB to Azure Cosmos DB for MongoDB vCore.](how-to-migrate-native-tools.md)
