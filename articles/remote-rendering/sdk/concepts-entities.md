---
title: Cut planes
description: Definition of Entities in the scope of Azure Remote Rendering API
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: conceptual
ms.service: azure-remote-rendering
---
# Entities

An Entity represents a movable object in space and is the fundamental building block of remotely rendered content.

## Entity properties

Entities have a transform, that is, a position, rotation and scale. By themselves entities do not have any observable functionality. Instead behavior is added through components, which are attached to entities. For instance, attaching a CutPlaneComponent will create a cut plane at the position of the entity.

The most important aspect of the entity itself is the hierarchy and the resulting hierarchical transform. For example, when multiple entities are attached as children to a shared parent entity, all of these entities can be moved, rotated and scaled in unison by changing the transform of the parent entity.

An entity is uniquely owned by its parent, meaning that when the parent is destroyed with `Entity.Destroy()`, so are its children and all connected components. Removing a model from the scene is accomplished by calling `Destroy` on the model root returned by `RemoteRenderingClient.LoadModel()`.

Entities are created when the server loads content or when the user wants to add an object to the scene. For example, if a user wants to add a cut plane to visualize the interior of a mesh, the user can create an entity where the plane should exist and then add the cut plane component to it.

## Query functions

There are two types of query functions on entities: synchronous and asynchronous calls. Synchronous queries can only be used for data that is present on the client and does not involve much computation. Examples are querying for components, relative object transforms, or parent/child relationships. Asynchronous queries are used for data that only resides on the server or involves extra computation that would be too computationally expensive to run on the client. Examples are spatial bounds queries or meta data queries.

### Components attached to entities

To find a component of a specific type, there are synchronous query functions:

C++:
```cpp
    ComponentId cutplaneComponentId = entity->GetComponentOfType(ObjectType::CutPlaneComponent);
```

Using the C# API:
```cs
    CutPlaneComponent cutplane = (CutPlaneComponent)entity.FindComponentOfType(ObjectType.CutPlaneComponent);
    // or (simpler):
    CutPlaneComponent cutplane = root.FindComponentOfType<CutPlaneComponent>();
```

### Transform queries

Transform queries are synchronous calls on the object. It is important to note that transforms queried through the API are local space transforms relative to the object's parent. Exceptions are root objects, which hold the transform in world space.
There is no dedicated API to query the absolute world space positions for arbitrary objects.

C++:
```cpp
    // local space transform (combined translation and rotation) of the entity
    Transform transform = entity->GetTransform();
```

Using the C# API:
```cs
    // local space transform of the entity
    WorldPosition translation = entity.Position;
    Quaternion rotation = entity.Rotation;
```

### Spatial bounds

Bounds queries are asynchronous calls that operate on a full hierarchy using one entity as a root. See dedicated [Bounds](../sdk/concepts-spatial-bounds.md) chapter for detailed information and sample code.

### Metadata

Metadata is additional data that is ignored by the server and can be used for custom user attributes on objects in the scene graph. A set of object metadata is essentially a set of (name, value) pairs, where _value_ can be of numeric, boolean or string type. Metadata can be exported with the model.

Metadata queries are asynchronous calls on a specific entity; it only returns the metadata of a single entity, not the merged information of a sub graph.

C++:
```cpp
  // completion callback
  const auto onCompleteQuery = [&](ARRResult error, const MetadataCollection& metaData)
  {
    if (ARR_SUCCEEDED(error))
    {
        auto index = metaData.m_entries.find("MyInt64Value");
        if (index != metaData.m_entries.end() && std::holds_alternative<int64_t>(index->second))
        {
            const MetadataCollection::var& value = index->second;
            int64_t intValue = std::get<int64_t>(value);
        }
    }
  };

  // do the query
  client.QueryObjectMetadata(entityId, onCompleteQuery, ARRThreadCompletionHint::UpdateThread);
```

Using the C# API:
```cs
    IAsync<ObjectMetaData> metaDataQuery = entity.QueryMetaDataAsync();
    metaDataQuery.Completed += (IAsync<ObjectMetaData> query) =>
    {
        if (query.IsRanToCompletion))
        {
            ObjectMetaData metaData = query.Result;
            object value;
            if (metaData.entries.TryGetValue("MyInt64Value", out value) && value is Int64)
            {
                Int64 intValue = (Int64)value;
                ...
            }
        }
    };
```

The query will succeed even if the object does not hold any metadata.
