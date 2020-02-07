---
title: Models
description: Describes what a model is in Azure Remote Rendering
author: jakrams
ms.author: jakras
ms.date: 02/05/2020
ms.topic: conceptual
---

# Models

A *model* in Azure Remote Rendering refers to a full object representation, made up of [entities](entities.md) and [components](components.md). Models are the main way to get custom data into the remote rendering service.

## Model structure

A model has exactly one [entity](entities.md) as its root node. Below that it may have an arbitrary hierarchy of child entities. When loading a model, a reference to this root entity is returned.

Each entity may have [components](components.md) attached. In the most common case, the entities have *MeshComponents*, which reference [mesh resources](meshes.md).

## Creating models

Creating models for runtime is achieved by [converting input models](../how-tos/conversion/model-conversion.md) from file formats such as FBX and GLTF. The conversion process extracts all the resources, such as textures, materials and meshes, and converts them to optimized runtime formats. It will also extract the structural information and convert that into ARR's entity/component graph structure.

> [!IMPORTANT]
>
> [Model conversion](../how-tos/conversion/model-conversion.md) is the only way to create [meshes](meshes.md). Although meshes can be shared between entities at runtime, there is no other way to get a mesh into the runtime, other than loading a model.

## Loading models

Once a model is converted, you should have a SAS URI to the conversion output. This URI can then be used to instantiate the model:

```csharp
async void LoadModel(AzureSession session, Entity modelParent, string modelUri)
{
    // load a model that will be parented to modelParent
    var modelParams = new LoadModelParams(modelUri, modelParent);

    var async = session.Actions.LoadModelAsync(modelParams);

    async.ProgressUpdated += (float progress) =>
    {
        Debug.Log($"Loading: {progress * 100.0f}%");
    };

    await async.AsTask();
}
```

Afterwards you can traverse the entity hierarchy and modify the entities and components. Loading the same model multiple times creates multiple instances, each with their own copy of the entity/component structure. Since meshes, materials, and textures are [shared resources](../concepts/lifetime.md), their data will not be loaded again, though. Therefore instantiating a model more than once incurs relatively little memory overhead.

## Next steps

* [Entities](entities.md)
* [Meshes](meshes.md)
