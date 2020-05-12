---
title: Object bounds
description: Explains how spatial object bounds can be queried
author: florianborn71
ms.author: flborn
ms.date: 02/03/2020
ms.topic: conceptual
---

# Object bounds

Object bounds represent the volume that an [entity](entities.md) and its children occupy. In Azure Remote Rendering, object bounds are always given as *axis aligned bounding boxes* (AABB). Object bounds can be either in *local space* or in *world space*. Either way, they are always axis-aligned, which means the extents and volume may differ between the local and world space representation.

## Querying object bounds

The local AABB of a [mesh](meshes.md) can be queried directly from the mesh resource. These bounds can be transformed into the local space or world space of an entity using the entity's transform.

It's possible to compute the bounds of an entire object hierarchy this way, but that requires to traverse the hierarchy, query the bounds for each mesh, and combine them manually. This operation is both tedious and inefficient.

A better way is to call `QueryLocalBoundsAsync` or `QueryWorldBoundsAsync` on an entity. The computation is then offloaded to the server and returned with minimal delay.

```cs
private BoundsQueryAsync _boundsQuery = null;

public void GetBounds(Entity entity)
{
    _boundsQuery = entity.QueryWorldBoundsAsync();
    _boundsQuery.Completed += (BoundsQueryAsync bounds) =>
    {
        if (bounds.IsRanToCompletion)
        {
            Double3 aabbMin = bounds.Result.min;
            Double3 aabbMax = bounds.Result.max;
            // ...
        }
    };
}
```

```cpp
void GetBounds(ApiHandle<Entity> entity)
{
    ApiHandle<BoundsQueryAsync> boundsQuery = *entity->QueryWorldBoundsAsync();
    boundsQuery->Completed([](ApiHandle<BoundsQueryAsync> bounds)
    {
        if (bounds->IsRanToCompletion())
        {
            Double3 aabbMin = bounds->Result()->min;
            Double3 aabbMax = bounds->Result()->max;
            // ...
        }
    });
}
```

## Next steps

* [Spatial queries](../overview/features/spatial-queries.md)
