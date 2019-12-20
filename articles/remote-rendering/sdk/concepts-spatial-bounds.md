---
title: Query object bounds
description: Explains how spatial object bounds can be queried through the API
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: conceptual
ms.service: azure-remote-rendering
---
# Query object bounds

Object bounds can be queried by two mechanisms.  

The axis aligned and local bounding box of a mesh can be queried directly from the Mesh resource on a MeshComponent. This bound can subsequently be transformed into object space or world space through the associated Entity's transform.  All of the Entity's children must be visited to gather the bounds encompassing children.

Traversing large SceneGraphs can be computationally expensive so utility functions are provided to offload the computation to the server for the axis aligned local or world bounds of an entity inclusive of its children. These queries will be performed against the state of the SceneGraph on the frame that the query is issued.

The asynchronous server query can be performed in C++ from the RemoteRenderingClient interface.

``` cpp
void exampleBoundQuery(RemoteRenderingClient& client, ObjectId id)
{
    client.QueryObjectAABBAsync(id, AabbQueryType::LocalBounds, [](ARRResult error, const AABB3D& bounds)
    {
        if( error == ARRResult::Success && bounds.IsValid())
        {
            // Do things with bounds.
        }
    });
}

```

And in C# on the Entity class directly.

``` cs
    Entity.QueryLocalBoundsAsync() += (IAsync<AABB3D> bounds)
    {
        if( bounds.IsRanToCompletion )
        {
            // Perform action with bounds
        }
    };
```

