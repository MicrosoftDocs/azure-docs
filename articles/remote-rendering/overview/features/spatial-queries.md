---
title: Spatial queries
description: How to do spatial queries in a scene
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
titleSuffix: Azure Remote Rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: conceptual
ms.service: azure-remote-rendering
---

# Spatial queries

This section will cover spatial queries, that is queries returning objects lying in a given spatial region, or intersecting a given geometry.

## Model preparation

The model's geometry needs to be processed to generate the optimized data that will support fast queries on potentially complex scenes and meshes.

## Ray cast query

A ray cast query traces a line in space, and returns objects that intersect the line. It also returns the object's surface normal at the point of impact. To perform ray casts on objects, the server needs the model data to be prepared as so called collision meshes. This is a [conversion setting](../../how-tos/conversion/configure-model-conversion.md) that is enabled by default. Without collision meshes, ray cast queries will always gracefully return with no result.
If no ray casts are required on a model it is recommended to export without collision meshes, because collision mesh generation has large impact on:

- ingestion time
- file size
- runtime loading time
- runtime memory consumption
- runtime performance (baseline overhead even if no ray casts are issued)

````c#
// C#
void sampleRaycastQuery(AzureSession session)
{
    // Trace a line from the origin toward the world +z direction, over 10 units of distance.
    RayCast rayCast = new RayCast(new Double3(0.0, 0.0, 0.0), new Double3(0.0, 0.0, 1.0), 10.0);
    // Get the closest hit
    rayCast.HitCollection = HitCollectionPolicy.ClosestHit;

    // The query is asynchronous
    RaycastQueryAsync queryOp = session.Actions.RayCastQueryAsync(rayCast);
    Wait(queryOp);

    RayCastHit[] hits = queryOp.Result;

    if(hits.Length > 0)
    {
        var hitObject = hits[0].Entity;
        // Do something with the intersected object.
    }
}
````

The query struct has the following parameters:

- Origin (3D point)
- EndPoint (3D point) (alternatively the C# constructor offers direction vector and length)
- HitCollectionPolicy (enum: All, Closest, Any)
- MaxHits (integer)
<!-- - CollisionMask (bitfield) -->

The Origin and EndPoint describe the line that will be used to find intersections.

The Hit Collection Policy will tell which intersection will be returned.

- *All* will return all the objects that intersected the line. The returned list of hits is sorted from closer to farther from the origin.
- *Closest* will return the hit closest to the line's origin amongst all potential hits.
- *Any* will return the first hit encountered when trying to find intersecting geometry. It may be different from the closest one.

It could be argued that *Closest* and *Any* are a subset of *All*, and that further processing could be done client-side, but if you are only interested in a single hit, the server's algorithms can take advantage of the *Closest* or *Any* hint to complete the query faster than if it had to collect every hit, so it's an optimization to consider.

Max hits limits the number of returned hits for the *All* hit policy. It will return the closest hits.

To exclude objects selectively from being considered for ray casts, the [HierarchicalStateUpdate](override-hierarchical-state.md) component can be used.

<!--
The CollisionMask allows the quey to consider or ignore some objects based on their collision layer. If an object has layer L, it will be hit only if the mask has  bit L set.
It is useful in case you want to ignore objects, for instance when setting an object transparent, and trying to select another object behind it.
TODO : Add an API to make that possible.
-->

The result of a Ray Cast Query is an array of Hits.
A Hit has the following properties:

- HitEntity (intersected Entity)
- SubPartId (integer)
- HitPosition (3D point)
- HitNormal (3D vector)
- DistanceToHit (float)

The ObjectId tells which entity has been hit. The SubPartId tells which submesh from the entity has been hit (submeshes are parts of a mesh that can be assigned a material, so it is also the index of the hit material in the mesh's material array).

The HitPosition and HitNormal are the surface's properties at the point of impact.

The DistanceToHit is taken from the ray's origin. It is also the sort criterion for the returned array.
