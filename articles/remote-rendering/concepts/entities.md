---
title: Entities
description: Definition of entities in the scope of the Azure Remote Rendering API
author: florianborn71
ms.author: flborn
ms.date: 02/03/2020
ms.topic: conceptual
ms.custom: devx-track-csharp
---

# Entities

An *Entity* represents a movable object in space and is the fundamental building block of remotely rendered content.

## Entity properties

Entities have a transform defined by a position, rotation, and scale. By themselves entities don't have any observable functionality. Instead, behavior is added through components, which are attached to entities. For instance, attaching a [CutPlaneComponent](../overview/features/cut-planes.md) creates a cut plane at the position of the entity.

The most important aspect of the entity itself is the hierarchy and the resulting hierarchical transform. For example, when multiple entities are attached as children to a shared parent entity, all of these entities can be moved, rotated, and scaled in unison by changing the transform of the parent entity. Also, the entity's `enabled` state can be used to turn off visibility and responses to ray casts for a full sub graph in the hierarchy.

An entity is uniquely owned by its parent, meaning that when the parent is destroyed with `Entity.Destroy()`, so are its children and all connected [components](components.md). Thus, removing a model from the scene is accomplished by calling `Destroy` on the root node of a model, returned by `RenderingSession.Connection.LoadModelAsync()` or its SAS variant `RenderingSession.Connection.LoadModelFromSasAsync()`.

Entities are created when the server loads content or when the user wants to add an object to the scene. For example, if a user wants to add a cut plane to visualize the interior of a mesh, the user can create an entity where the plane should exist and then add the cut plane component to it.

## Create an entity

To add a new entity to the scene, for example to pass it as a root object for loading models or  attaching components to it, use the following code:

```cs
Entity CreateNewEntity(RenderingSession session)
{
    Entity entity = session.Connection.CreateEntity();
    entity.Position = new LocalPosition(1, 2, 3);
    return entity;
}
```

```cpp
ApiHandle<Entity> CreateNewEntity(ApiHandle<RenderingSession> session)
{
    ApiHandle<Entity> entity(nullptr);
    if (auto entityRes = session->Connection()->CreateEntity())
    {
        entity = entityRes.value();
        entity->SetPosition(Double3{ 1, 2, 3 });
        return entity;
    }
    return entity;
}
```

## Query functions

There are two types of query functions on entities: synchronous and asynchronous calls. Synchronous queries can only be used for data that is present on the client and doesn't involve much computation. Examples are querying for components, relative object transforms, or parent/child relationships. Asynchronous queries are used for data that only resides on the server or involves extra computation that would be too expensive to run on the client. Examples are spatial bounds queries or meta data queries.

### Querying components

To find a component of a specific type, use `FindComponentOfType`:

```cs
CutPlaneComponent cutplane = (CutPlaneComponent)entity.FindComponentOfType(ObjectType.CutPlaneComponent);

// or alternatively:
CutPlaneComponent cutplane = entity.FindComponentOfType<CutPlaneComponent>();
```

```cpp
ApiHandle<CutPlaneComponent> cutplane = entity->FindComponentOfType(ObjectType::CutPlaneComponent)->as<CutPlaneComponent>();

// or alternatively:
ApiHandle<CutPlaneComponent> cutplane = entity->FindComponentOfType<CutPlaneComponent>();
```

### Querying transforms

Transform queries are synchronous calls on the object. It's important to note that transforms queried through the API are local space transforms, relative to the object's parent. Exceptions are root objects, for which local space and world space are identical.

> [!NOTE]
> There is no dedicated API to query the world space transform of arbitrary objects.

```cs
// local space transform of the entity
Double3 translation = entity.Position;
Quaternion rotation = entity.Rotation;
```

```cpp
// local space transform of the entity
Double3 translation = entity->GetPosition();
Quaternion rotation = entity->GetRotation();
```

### Querying spatial bounds

Bounds queries are asynchronous calls that operate on a full object hierarchy, using one entity as a root. See the dedicated chapter about [object bounds](object-bounds.md).

### Querying metadata

Metadata is extra data stored on objects that is ignored by the server. Object metadata is essentially a set of (name, value) pairs, where _value_ can be of numeric, boolean or string type. Metadata can be [exported with the model](../how-tos/conversion/configure-model-conversion#node-metadata).

Metadata queries are asynchronous calls on a specific entity. The query only returns the metadata of a single entity, not the merged information of a sub graph.

```cs
Task<ObjectMetadata> metaDataQuery = entity.QueryMetadataAsync();
ObjectMetadata metaData = await metaDataQuery;
ObjectMetadataEntry entry = metaData.GetMetadataByName("MyInt64Value");
System.Int64 intValue = entry.AsInt64;
// ...
```

```cpp
entity->QueryMetadataAsync([](Status status, ApiHandle<ObjectMetadata> metaData) 
{
    if (status == Status::OK)
    {
        ApiHandle<ObjectMetadataEntry> entry = *metaData->GetMetadataByName("MyInt64Value");
        int64_t intValue = *entry->GetAsInt64();

        // ...
    }
});
```

The query succeeds even if the object doesn't hold any metadata.

## API documentation

* [C# Entity class](/dotnet/api/microsoft.azure.remoterendering.entity)
* [C# RenderingConnection.CreateEntity()](/dotnet/api/microsoft.azure.remoterendering.renderingconnection.createentity)
* [C++ Entity class](/cpp/api/remote-rendering/entity)
* [C++ RenderingConnection::CreateEntity()](/cpp/api/remote-rendering/renderingconnection#createentity)

## Next steps

* [Components](components.md)
* [Object bounds](object-bounds.md)