---
title: Spatial queries
description: How to do spatial queries in a scene
author: jakrams
ms.author: jakras
ms.date: 02/07/2020
ms.topic: article
---

# Spatial queries

Spatial queries are operations with which you can ask the remote rendering service which objects are located in an area. Spatial queries are frequently used to implement interactions, such as figuring out which object a user is pointing at.

All spatial queries are evaluated on the server. Consequently they are asynchronous operations and results will arrive with a delay that depends on your network latency. Since every spatial query generates network traffic, be careful not to do too many at once.

## Collision meshes

Spatial queries are powered by the [Havok Physics](https://www.havok.com/products/havok-physics) engine and require a dedicated collision mesh to be present. By default, [model conversion](../../how-tos/conversion/model-conversion.md) generates collision meshes. If you don't require spatial queries on a complex model, consider disabling collision mesh generation in the [conversion options](../../how-tos/conversion/configure-model-conversion.md), as it has an impact in multiple ways:

* [Model conversion](../../how-tos/conversion/model-conversion.md) will take considerably longer.
* Converted model file sizes are noticeably larger, impacting download speed.
* Runtime loading times are longer.
* Runtime CPU memory consumption is higher.
* There's a slight runtime performance overhead for every model instance.

## Ray casts

A *ray cast* is a spatial query where the runtime checks which objects are intersected by a ray, starting at a given position and pointing into a certain direction. As an optimization, a maximum ray distance is also given, to not search for objects that are too far away.

```cs
async void CastRay(AzureSession session)
{
    // trace a line from the origin into the +z direction, over 10 units of distance.
    RayCast rayCast = new RayCast(new Double3(0, 0, 0), new Double3(0, 0, 1), 10);

    // only return the closest hit
    rayCast.HitCollection = HitCollectionPolicy.ClosestHit;

    RayCastHit[] hits = await session.Actions.RayCastQueryAsync(rayCast).AsTask();

    if (hits.Length > 0)
    {
        var hitObject = hits[0].HitObject;
        var hitPosition = hits[0].HitPosition;
        var hitNormal = hits[0].HitNormal;

        // do something with the hit information
    }
}
```

```cpp
void CastRay(ApiHandle<AzureSession> session)
{
    // trace a line from the origin into the +z direction, over 10 units of distance.
    RayCast rayCast;
    rayCast.StartPos = { 0, 0, 0 };
    rayCast.EndPos = { 0, 0, 1 };
    rayCast.MaxHits = 10;

    // only return the closest hit
    rayCast.HitCollection = HitCollectionPolicy::ClosestHit;

    ApiHandle<RaycastQueryAsync> castQuery = *session->Actions()->RayCastQueryAsync(rayCast);

    castQuery->Completed([](const ApiHandle<RaycastQueryAsync>& async)
    {
        std::vector<RayCastHit> hits = *async->Result();

        if (hits.size() > 0)
        {
            auto hitObject = hits[0].HitObject;
            auto hitPosition = hits[0].HitPosition;
            auto hitNormal = hits[0].HitNormal;

            // do something with the hit information
        }
    });

}
```


There are three hit collection modes:

* **`Closest`:** In this mode, only the closest hit will be reported.
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
* **`SubPartId`:** Which *submesh* was hit in a [MeshComponent](../../concepts/meshes.md). Can be used to index into `MeshComponent.UsedMaterials` and look up the [material](../../concepts/materials.md) at that point.
* **`HitPosition`:** The world space position where the ray intersected the object.
* **`HitNormal`:** The world space surface normal of the mesh at the position of the intersection.
* **`DistanceToHit`:** The distance from the ray starting position to the hit.

## Next steps

* [Object bounds](../../concepts/object-bounds.md)
* [Overriding hierarchical states](override-hierarchical-state.md)
