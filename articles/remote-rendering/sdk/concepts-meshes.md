---
title: Meshes
description: Definition of meshes in the scope of Azure Remote Rendering
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
titleSuffix: Azure Remote Rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: conceptual
ms.service: azure-remote-rendering
---

# Meshes

Meshes are an immutable shared resource. Meshes own the vertex data associated with a shape in the rendered scene and which materials to be used by default for rendering. The vertex data is not exposed, but can be attached to and moved via a MeshComponent as an opaque grouping.

Meshes cannot be modified at runtime. To change rendering properties, the preferred method is to specify override Material references in a MeshComponent to change which Material to use for rendering each part of the mesh.

A Mesh can be referenced from multiple MeshComponents in 3d space.

Meshes store a queryable axis aligned bounding boxes for their vertex data.  The bounds are stored in local space.
