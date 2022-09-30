---
title: Object bounds
description: Learn how spatial object bounds can be queried. Object bounds represent the volume that an entity and its children occupy. 
author: florianborn71
ms.author: flborn
ms.date: 02/03/2020
ms.topic: conceptual
ms.custom: 
- devx-track-csharp
- kr2b-contr-experiment
---

# Object bounds

Object bounds represent the volume that an [entity](entities.md) and its children occupy. In Azure Remote Rendering, object bounds are always given as *axis aligned bounding boxes* (AABB). Object bounds can be either in *local space* or in *world space*. Either way, they're always axis-aligned, which means the extents and volume may differ between the local and world space representation.

## Querying object bounds

The local axis aligned bounding box of a mesh can be queried directly from the mesh resource. These bounds can be transformed into the local space or world space of an entity using the entity's transform. For more information, see [Meshes](meshes.md).

It's possible to compute the bounds of an entire object hierarchy this way. That approach requires traversing the hierarchy, querying the bounds for each mesh, and combining them manually. This operation is both tedious and inefficient.

A better way is to call `QueryLocalBoundsAsync` or `QueryWorldBoundsAsync` on an entity. This approach offloads computation to the server and returns with minimal delay.

```cs
public async void GetBounds(Entity entity)
{
    try
    {
        Task<Bounds> boundsQuery = entity.QueryWorldBoundsAsync();
        Bounds result = await boundsQuery;
    
        Double3 aabbMin = result.Min;
        Double3 aabbMax = result.Max;
        // ...
    }
    catch (RRException ex)
    {
    }
}
```

```cpp
void GetBounds(ApiHandle<Entity> entity)
{
    entity->QueryWorldBoundsAsync(
        // completion callback:
        [](Status status, Bounds bounds)
        {
           if (status == Status::OK)
            {
                Double3 aabbMin = bounds.Min;
                Double3 aabbMax = bounds.Max;
                // ...
            }
        }
    );
}
```

## API documentation

* [C# Entity.QueryLocalBoundsAsync](/dotnet/api/microsoft.azure.remoterendering.entity.querylocalboundsasync)
* [C++ Entity::QueryLocalBoundsAsync](/cpp/api/remote-rendering/entity#querylocalboundsasync)

## Next steps

* [Spatial queries](../overview/features/spatial-queries.md)