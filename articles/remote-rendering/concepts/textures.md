---
title: Textures
description: Texture resource workflow
author: florianborn71
ms.author: flborn
ms.date: 02/05/2020
ms.topic: conceptual
ms.custom: devx-track-csharp
---

# Textures

Textures are an immutable [shared resource](../concepts/lifetime.md). Textures can be loaded from [blob storage](../how-tos/conversion/blob-storage.md) and applied to models directly, as demonstrated in [Tutorial: Changing the environment and materials](../tutorials/unity/materials-lighting-effects/materials-lighting-effects.md). Most commonly, though, textures will be part of a [converted model](../how-tos/conversion/model-conversion.md), where they are referenced by its [materials](materials.md).

## Texture types

Different texture types have different use cases:

* **2D Textures** are mainly used in [materials](materials.md).
* **Cubemaps** can be used for the [sky](../overview/features/sky.md).

## Supported texture formats

All textures given to ARR have to be in [DDS format](https://en.wikipedia.org/wiki/DirectDraw_Surface). Preferably with mipmaps and texture compression.

## Loading textures

When loading a texture, you have to specify its expected type. If the type mismatches, the texture load fails.
Loading a texture with the same URI twice will return the same texture object, as it is a [shared resource](../concepts/lifetime.md).

Similar to loading models, there are two variants of addressing a texture asset in source blob storage:

* The texture can be addressed by blob storage parameters directly, in case the [blob storage is linked to the account](../how-tos/create-an-account.md#link-storage-accounts). Relevant loading function in this case is `LoadTextureAsync` with parameter `LoadTextureOptions`.
* The texture asset can be addressed by its SAS URI. Relevant loading function is `LoadTextureFromSasAsync` with parameter `LoadTextureFromSasOptions`. Use this variant also when loading [built-in textures](../overview/features/sky.md#built-in-environment-maps).

The following sample code shows how to load a texture:

```cs
async void LoadMyTexture(RenderingSession session, string storageContainer, string blobName, string assetPath)
{
    try
    {
        LoadTextureOptions options = new LoadTextureOptions(storageContainer, blobName, assetPath, TextureType.Texture2D);
        Texture texture = await session.Connection.LoadTextureAsync(options);
    
        // use texture...
    }
    catch (RRException ex)
    {
    }
}
```

```cpp
void LoadMyTexture(ApiHandle<RenderingSession> session, std::string storageContainer, std::string blobName, std::string assetPath)
{
    LoadTextureOptions params;
    params.TextureType = TextureType::Texture2D;
    params.Blob.StorageAccountName = std::move(storageContainer);
    params.Blob.BlobContainerName = std::move(blobName);
    params.Blob.AssetPath = std::move(assetPath);
    session->Connection()->LoadTextureAsync(params, [](Status status, ApiHandle<Texture> texture)
    {
        // use texture...
    });
}
```

Note that in case of using its SAS variant only the loading function/parameter differs.

Depending on what the texture is supposed to be used for, there may be restrictions for the texture type and content. For example, the roughness map of a [PBR material](../overview/features/pbr-materials.md) must be grayscale.

## API documentation

* [C# Texture class](/dotnet/api/microsoft.azure.remoterendering.texture)
* [C# RenderingConnection.LoadTextureAsync()](/dotnet/api/microsoft.azure.remoterendering.renderingconnection.loadtextureasync)
* [C# RenderingConnection.LoadTextureFromSasAsync()](/dotnet/api/microsoft.azure.remoterendering.renderingconnection.loadtexturefromsasasync)
* [C++ Texture class](/cpp/api/remote-rendering/texture)
* [C++ RenderingConnection::LoadTextureAsync()](/cpp/api/remote-rendering/renderingconnection#loadtextureasync)
* [C++ RenderingConnection::LoadTextureFromSasAsync()](/cpp/api/remote-rendering/renderingconnection#loadtexturefromsasasync)

## Next steps

* [Materials](materials.md)
* [Sky](../overview/features/sky.md)