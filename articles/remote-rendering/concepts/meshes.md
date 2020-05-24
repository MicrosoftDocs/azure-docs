---
title: Meshes
description: Definition of meshes in the scope of Azure Remote Rendering
author: florianborn71
ms.author: flborn
ms.date: 02/05/2020
ms.topic: conceptual
---

# Meshes

## Mesh resource

Meshes are an immutable [shared resource](../concepts/lifetime.md), that can only be created through [model conversion](../how-tos/conversion/model-conversion.md). Meshes contain one or multiple *submeshes*. Each submesh references a [material](materials.md) with which it should be rendered by default. To place a mesh in 3D space, add a [MeshComponent](#meshcomponent) to an [Entity](entities.md).

### Mesh resource properties

The `Mesh` class properties are:

* **Materials:** An array of materials. Each material is used by a different submesh. Multiple entries in the array may reference the same [material](materials.md). This data cannot be modified at runtime.

* **Bounds:** A local-space axis-aligned bounding box (AABB) of the mesh vertices.

## MeshComponent

The `MeshComponent` class is used to place an instance of a mesh resource. Each MeshComponent references a single mesh. It may override which materials are used to render each submesh.

### MeshComponent properties

* **Mesh:** The mesh resource that is used by this component.

* **Materials:** The array of materials specified on the mesh component itself. The array will always have the same length as the *Materials* array on the mesh resource. Materials that shall not be overridden from the mesh default, are set to *null* in this array.

* **UsedMaterials:** The array of actually used materials for each submesh. Will be identical to the data in the *Materials* array, for non-null values. Otherwise it contains the value from the *Materials* array in the mesh instance.

## Next steps

* [Materials](materials.md)
