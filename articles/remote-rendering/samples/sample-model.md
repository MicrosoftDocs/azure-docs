---
title: Sample models
description: Lists sources for sample models.
author: florianborn71
ms.author: flborn
ms.date: 01/29/2020
ms.topic: sample
---

# Sample models

This article lists some resources for sample data that can be used for testing the Azure Remote Rendering service.

## Built-in sample model

We provide a built-in sample model that can always be loaded using the URL **builtin://Engine**

![Sample model](./media/sample-model.png "Sample model")

Model statistics:

| Name | Value |
|-----------|:-----------|
| [Required VM size](../how-tos/session-rest-api.md#create-a-session) | standard |
| Number of triangles | 18.7 Million |
| Number of movable parts | 2073 |
| Number of materials | 94 |

## Third-party data

The Khronos Group maintains a set of glTF sample models for testing. ARR supports the glTF format both in text (*.gltf*) and in binary (*.glb*) form. We suggest using the PBR models for best visual results:

* [glTF Sample Models](https://github.com/KhronosGroup/glTF-Sample-Models)

## Next steps

* [Quickstart: Render a model with Unity](../quickstarts/render-model.md)
* [Quickstart: Convert a model for rendering](../quickstarts/convert-model.md)
