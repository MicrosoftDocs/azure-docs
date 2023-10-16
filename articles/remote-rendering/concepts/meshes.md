---
title: Meshes
description: Definition of meshes in the scope of Azure Remote Rendering
author: florianborn71
ms.author: flborn
ms.date: 02/05/2020
ms.topic: conceptual
---

# Meshes

Meshes are immutable [shared resources](../concepts/lifetime.md) that can only be created through [model conversion](../how-tos/conversion/model-conversion.md). Meshes are used for rendering but also to provide a physics representation for [ray cast queries](../overview/features/spatial-queries.md). To place a mesh in 3D space, add a [MeshComponent](#meshcomponent) to an [Entity](entities.md).

## Mesh types

There are two distinct types of mesh resources in ARR: **Triangular meshes** and **point clouds**. Both types are represented by the same API class `Mesh`. Except for minor differences in behavior for the distinct mesh types, the exposed API functionality is identical.

The conversion service automatically determines the appropriate mesh type by source file extension. For example, an FBX file is always converted as a triangular mesh, whereas PLY is treated as a point cloud. For the complete list of supported file formats, refer to the list of [source file formats](../how-tos/conversion/model-conversion.md#supported-source-formats).

There are two significant user-facing differences between point cloud- and triangular mesh conversions:
* Point cloud meshes don't expose any materials. The visual appearance of points is solely defined by their per-point color,
* point clouds don't expose a scene graph. Instead, all points are attached to the root node entity.

### Mesh resource properties

The `Mesh` class properties are:

* **Materials:** An array of materials. Each material is used by a different submesh. Multiple entries in the array may reference the same [material](materials.md). Entries in this array can't be changed at runtime, however the material properties can.
For point clouds, this array is empty.

* **Bounds:** A local-space axis-aligned bounding box (AABB) of the mesh vertices.

## MeshComponent

The `MeshComponent` class is used to place an instance of a mesh resource. Each MeshComponent references a single mesh. It may override which materials are used to render each submesh.

### MeshComponent properties

* **Mesh:** The mesh resource that is used by this component.

* **Materials:** The array of materials specified on the mesh component itself. The array will always have the same length as the *Materials* array on the mesh resource. Materials that shall not be overridden from the mesh default, are set to *null* in this array.

* **UsedMaterials:** The array of actually used materials for each submesh. Will be identical to the data in the *Materials* array, for non-null values. Otherwise it contains the value from the *Materials* array in the mesh instance. This array is read-only.

### Sharing of meshes

A `Mesh` resource can be shared across multiple instances of mesh components. Furthermore, the `Mesh` resource that is assigned to a mesh component can be changed programmatically at any time. The code below demonstrates how to clone a mesh:

```cs
Entity CloneEntityWithModel(RenderingConnection api, Entity sourceEntity)
{
    MeshComponent meshComp = sourceEntity.FindComponentOfType<MeshComponent>();
    if (meshComp != null)
    {
        Entity newEntity = api.CreateEntity();
        MeshComponent newMeshComp = api.CreateComponent(ObjectType.MeshComponent, newEntity) as MeshComponent;
        newMeshComp.Mesh = meshComp.Mesh; // share the mesh
        return newEntity;
    }
    return null;
}
```

```cpp
ApiHandle<Entity> CloneEntityWithModel(ApiHandle<RenderingConnection> api, ApiHandle<Entity> sourceEntity)
{
    if (ApiHandle<MeshComponent> meshComp = sourceEntity->FindComponentOfType<MeshComponent>())
    {
        ApiHandle<Entity> newEntity = *api->CreateEntity();
        ApiHandle<MeshComponent> newMeshComp = api->CreateComponent(ObjectType::MeshComponent, newEntity)->as<RemoteRendering::MeshComponent>();
        newMeshComp->SetMesh(meshComp->GetMesh()); // share the mesh
        return newEntity;
    }
    return nullptr;
}
```

## API documentation

* [C# Mesh class](/dotnet/api/microsoft.azure.remoterendering.mesh)
* [C# MeshComponent class](/dotnet/api/microsoft.azure.remoterendering.meshcomponent)
* [C++ Mesh class](/cpp/api/remote-rendering/mesh)
* [C++ MeshComponent class](/cpp/api/remote-rendering/meshcomponent)


## Next steps

* [Materials](materials.md)