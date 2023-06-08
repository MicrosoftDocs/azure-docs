---
title: Spatial queries
description: How to do spatial queries in a scene
author: jakrams
ms.author: jakras
ms.date: 02/07/2020
ms.topic: article
ms.custom: devx-track-csharp
---

# Spatial queries

Spatial queries are operations with which you can ask the remote rendering service which objects are located in an area. Spatial queries are frequently used to implement interactions, such as figuring out which object a user is pointing at.

All spatial queries are evaluated on the server. Accordingly, the queries are asynchronous operations and results arrive with a delay that depends on your network latency.

## Ray casts

A *ray cast* is a spatial query where the runtime checks which objects intersect a ray, starting at a given position and pointing into a certain direction. As an optimization, a maximum ray distance is also given, to not search for objects that are too far away.
Although doing hundreds of ray casts each frame is computationally feasible on the server side, each query also generates network traffic, so the number of queries per frame should be kept as low as possible.


```cs
async void CastRay(RenderingSession session)
{
    // trace a line from the origin into the +z direction, over 10 units of distance.
    RayCast rayCast = new RayCast(new Double3(0, 0, 0), new Double3(0, 0, 1), 10);

    // only return the closest hit
    rayCast.HitCollection = HitCollectionPolicy.ClosestHit;

    RayCastQueryResult result = await session.Connection.RayCastQueryAsync(rayCast);
    RayCastHit[] hits = result.Hits;
    if (hits.Length > 0)
    {
        var hitObject = hits[0].HitObject;
        var hitPosition = hits[0].HitPosition;
        var hitNormal = hits[0].HitNormal;
        var hitType = hits[0].HitType;
        // do something with the hit information
    }
}
```

```cpp
void CastRay(ApiHandle<RenderingSession> session)
{
    // trace a line from the origin into the +z direction, over 10 units of distance.
    RayCast rayCast;
    rayCast.StartPos = {0, 0, 0};
    rayCast.EndPos = {0, 0, 10};

    // only return the closest hit
    rayCast.HitCollection = HitCollectionPolicy::ClosestHit;

    session->Connection()->RayCastQueryAsync(rayCast, [](Status status, ApiHandle<RayCastQueryResult> result)
    {
        if (status == Status::OK)
        {
            std::vector<RayCastHit> hits;
            result->GetHits(hits);

            if (hits.size() > 0)
            {
                auto hitObject = hits[0].HitObject;
                auto hitPosition = hits[0].HitPosition;
                auto hitNormal = hits[0].HitNormal;
                auto hitType = hits[0].HitType;

                // do something with the hit information
            }
        }
    });
}
```

There are three hit collection modes:

* **`Closest`:** In this mode, only the closest hit is reported.
* **`Any`:** Prefer this mode when all you want to know is *whether* a ray would hit anything, but don't care what was hit exactly. This query can be considerably cheaper to evaluate, but also has only few applications.
* **`All`:** In this mode, all hits along the ray are reported, sorted by distance. Don't use this mode unless you really need more than the first hit. Limit the number of reported hits with the `MaxHits` option.

To exclude objects selectively from being considered for ray casts, the [HierarchicalStateOverrideComponent](override-hierarchical-state.md) component can be used.

<!--
The CollisionMask allows the query to consider or ignore some objects based on their collision layer. If an object has layer L, it will be hit only if the mask has bit L set.
It is useful in case you want to ignore objects, for instance when setting an object transparent, and trying to select another object behind it.
TODO : Add an API to make that possible.
-->

### Hit result

The result of a ray cast query is an array of hits. The array is empty, if no object was hit.

A Hit has the following properties:

* **`HitEntity`:** Which [entity](../../concepts/entities.md) was hit.
* **`SubPartId`:** Which *submesh* was hit in a [MeshComponent](../../concepts/meshes.md#meshcomponent). Can be used to index into `MeshComponent.UsedMaterials` and look up the [material](../../concepts/materials.md) at that point.
* **`HitPosition`:** The world space position where the ray intersected the object.
* **`HitNormal`:** The world space surface normal of the mesh at the position of the intersection.
* **`DistanceToHit`:** The distance from the ray starting position to the hit.
* **`HitType`:** What is hit by the ray: `TriangleFrontFace`, `TriangleBackFace` or `Point`. By default, [ARR renders double sided](single-sided-rendering.md#prerequisites) so the triangles the user sees aren't necessarily front facing. If you want to differentiate between `TriangleFrontFace` and `TriangleBackFace` in your code, make sure your models are authored with correct face directions first.

## Spatial queries

A *spatial query* allows for the runtime to check which [MeshComponents](../../concepts/meshes.md#meshcomponent) intersect with a user defined volume. This check is performant as the individual check is performed based on each mesh part's bounds in the scene, not on an individual triangle basis. As an optimization, a maximum number of hit mesh components can be provided.\
While such a query can be run manually on the client side, for large scenes it can be orders of magnitude faster for the server to compute this.

The following example code shows how to do queries against an axis aligned bounding box (AABB). Variants of the query also allow for oriented bounding box volumes (`SpatialQueryObbAsync`) and sphere volumes (`SpatialQuerySphereAsync`).

```cs
async void QueryAABB(RenderingSession session)
{
    // Query all mesh components in a 2x2x2m cube.
    SpatialQueryAabb query = new SpatialQueryAabb();
    query.Bounds = new Microsoft.Azure.RemoteRendering.Bounds(new Double3(-1, -1, -1), new Double3(1, 1, 1));
    query.MaxResults = 100;

    SpatialQueryResult result = await session.Connection.SpatialQueryAabbAsync(query);
    foreach (MeshComponent meshComponent in result.Overlaps)
    {
        Entity owner = meshComponent.Owner;
        // do something with the hit MeshComponent / Entity
    }
}
```

```cpp
void QueryAABB(ApiHandle<RenderingSession> session)
{
    // Query all mesh components in a 2x2x2m cube.
    SpatialQueryAabb query;
    query.Bounds.Min = {-1, -1, -1};
    query.Bounds.Max = {1, 1, 1};
    query.MaxResults = 100;

    session->Connection()->SpatialQueryAabbAsync(query, [](Status status, ApiHandle<SpatialQueryResult> result)
        {
            if (status == Status::OK)
            {
                std::vector<ApiHandle<MeshComponent>> overlaps;
                result->GetOverlaps(overlaps);

                for (ApiHandle<MeshComponent> meshComponent : overlaps)
                {
                    ApiHandle<Entity> owner = meshComponent->GetOwner();
                    // do something with the hit MeshComponent / Entity
                }
            }
        });
}
```

## API documentation

* [C# RenderingConnection.RayCastQueryAsync()](/dotnet/api/microsoft.azure.remoterendering.renderingconnection.raycastqueryasync)
* [C# RenderingConnection.SpatialQueryAabbAsync()](/dotnet/api/microsoft.azure.remoterendering.renderingconnection.spatialqueryaabbasync)
* [C# RenderingConnection.SpatialQuerySphereAsync()](/dotnet/api/microsoft.azure.remoterendering.renderingconnection.spatialquerysphereasync)
* [C# RenderingConnection.SpatialQueryObbAsync()](/dotnet/api/microsoft.azure.remoterendering.renderingconnection.spatialqueryobbasync)
* [C++ RenderingConnection::RayCastQueryAsync()](/cpp/api/remote-rendering/renderingconnection#raycastqueryasync)
* [C++ RenderingConnection::SpatialQueryAabbAsync()](/cpp/api/remote-rendering/renderingconnection#spatialqueryaabbasync)
* [C++ RenderingConnection::SpatialQuerySphereAsync()](/cpp/api/remote-rendering/renderingconnection#spatialquerysphereasync)
* [C++ RenderingConnection::SpatialQueryObbAsync()](/cpp/api/remote-rendering/renderingconnection#spatialqueryobbasync)

## Next steps

* [Object bounds](../../concepts/object-bounds.md)
* [Overriding hierarchical states](override-hierarchical-state.md)
* [Single sided rendering](single-sided-rendering.md)