---
title: Models
description: Describes what a model is in Azure Remote Rendering
author: FlorianBorn71
ms.author: flborn
ms.date: 02/05/2020
ms.topic: conceptual
ms.custom: devx-track-csharp
---

# Models

A *model* in Azure Remote Rendering refers to a full object representation, made up of [entities](entities.md) and [components](components.md). Models are the main way to get custom data into the remote rendering service.

## Model structure

A model has exactly one [entity](entities.md) as its root node. Below that it may have an arbitrary hierarchy of child entities. When loading a model, a reference to this root entity is returned.

Each entity may have [components](components.md) attached. In the most common case, the entities have *MeshComponents*, which reference [mesh resources](meshes.md).

## Creating models

Creating models for runtime is achieved by [converting input models](../how-tos/conversion/model-conversion.md) from file formats such as FBX, GLTF or E57. The conversion process extracts all the resources, such as textures, materials and meshes, and converts them to optimized runtime formats. It will also extract the structural information and convert that into ARR's entity/component graph structure.

> [!IMPORTANT]
> [Model conversion](../how-tos/conversion/model-conversion.md) is the only way to create [meshes](meshes.md). Although meshes can be shared between entities at runtime, there is no other way to get a mesh into the runtime, other than loading a model.

## Loading models

Once a model is converted, it can be loaded from Azure blob storage into the runtime.

There are two distinct loading functions that differ by the way the asset is addressed in blob storage:

* The model can be addressed by blob storage parameters directly, in case the [blob storage is linked to the account](../how-tos/create-an-account.md#link-storage-accounts). Relevant loading function in this case is `LoadModelAsync` with parameter `LoadModelOptions`.
* The model can be addressed by its SAS URI. Relevant loading function is `LoadModelFromSasAsync` with parameter `LoadModelFromSasOptions`. Use this variant also when loading [built-in models](../samples/sample-model.md).

The following code snippets show how to load models with either function. To load a model using its blob storage parameters, use code like the one below:


```cs
async void LoadModel(RenderingSession session, Entity modelParent, string storageAccount, string containerName, string assetFilePath)
{
    // load a model that will be parented to modelParent
    var modelOptions = LoadModelOptions.CreateForBlobStorage(
        storageAccount, // storage account name + '.blob.core.windows.net', e.g., 'mystorageaccount.blob.core.windows.net'
        containerName,  // name of the container in your storage account, e.g., 'mytestcontainer'
        assetFilePath,  // the file path to the asset within the container, e.g., 'path/to/file/myAsset.arrAsset'
        modelParent
    );

    var loadOp = session.Connection.LoadModelAsync(modelOptions, (float progress) =>
    {
        Debug.WriteLine($"Loading: {progress * 100.0f}%");
    });

    await loadOp;
}
```

```cpp
void LoadModel(ApiHandle<RenderingSession> session, ApiHandle<Entity> modelParent, std::string storageAccount, std::string containerName, std::string assetFilePath)
{
    LoadModelOptions modelOptions;
    modelOptions.Parent = modelParent;
    modelOptions.Blob.StorageAccountName = std::move(storageAccount);
    modelOptions.Blob.BlobContainerName = std::move(containerName);
    modelOptions.Blob.AssetPath = std::move(assetFilePath);

    ApiHandle<LoadModelResult> result;
    session->Connection()->LoadModelAsync(modelOptions,
        // completion callback
        [](Status status, ApiHandle<LoadModelResult> result)
        {
            printf("Loading: finished.");
        },
        // progress callback
        [](float progress)
        {
            printf("Loading: %.1f%%", progress * 100.f);
        }
    );
}
```

If you want to load a model by using a SAS token, use code similar to the following snippet:

```cs
async void LoadModel(RenderingSession session, Entity modelParent, string modelUri)
{
    // load a model that will be parented to modelParent
    var modelOptions = new LoadModelFromSasOptions(modelUri, modelParent);

    var loadOp = session.Connection.LoadModelFromSasAsync(modelOptions, (float progress) =>
    {
        Debug.WriteLine($"Loading: {progress * 100.0f}%");
    });

    await loadOp;
}
```

```cpp
void LoadModel(ApiHandle<RenderingSession> session, ApiHandle<Entity> modelParent, std::string modelUri)
{
    LoadModelFromSasOptions modelOptions;
    modelOptions.ModelUri = modelUri;
    modelOptions.Parent = modelParent;

    ApiHandle<LoadModelResult> result;
    session->Connection()->LoadModelFromSasAsync(modelOptions,
        // completion callback
        [](Status status, ApiHandle<LoadModelResult> result)
        {
            printf("Loading: finished.");
        },
        // progress callback
        [](float progress)
        {
            printf("Loading: %.1f%%", progress * 100.f);
        }
    );
}
```

Afterwards you can traverse the entity hierarchy and modify the entities and components. Loading the same model multiple times creates multiple instances, each with their own copy of the entity/component structure. Since meshes, materials, and textures are [shared resources](../concepts/lifetime.md), their data won't be loaded again, though. Therefore instantiating a model more than once incurs relatively little memory overhead.

## API documentation

* [C# RenderingConnection.LoadModelAsync()](/dotnet/api/microsoft.azure.remoterendering.renderingconnection.loadmodelasync)
* [C# RenderingConnection.LoadModelFromSasAsync()](/dotnet/api/microsoft.azure.remoterendering.renderingconnection.loadmodelfromsasasync)
* [C++ RenderingConnection::LoadModelAsync()](/cpp/api/remote-rendering/renderingconnection#loadmodelasync)
* [C++ RenderingConnection::LoadModelFromSasAsync()](/cpp/api/remote-rendering/renderingconnection#loadmodelfromsasasync)

## Next steps

* [Entities](entities.md)
* [Meshes](meshes.md)