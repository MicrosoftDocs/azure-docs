---
title: Textures
description: Texture resource workflow
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
titleSuffix: Azure Remote Rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: conceptual
ms.service: azure-remote-rendering
---

# Textures

Textures are immutable shared resources that can be used in various places in the API. Textures can be encountered in a loaded model when inspecting its meshes and materials or loaded on demand by the user. There are three distinguished types of textures:

* 2D Textures - Mainly used in [materials](../reference/features/materials.md)
* Cube Maps - Example of use is setting the [sky](../reference/features/sky.md)
* 3D Textures - Not used at the moment

## Loading textures

When loading a texture, the user has to know the type of the texture. If the texture type mismatches, the texture load fails and an error code is returned.
Loading texture with the same URI twice will return the same texture as it is a [shared resource](../concepts/sdk-concepts.md#resources-and-lifetime-management).

``` cs
LoadTextureAsync _async = null;
void LoadMyTexture(AzureSession session, string textureUri)
{
     _async  = session.Actions.LoadTextureAsync(
        new LoadTextureParams(textureUri, TextureType.Texture2D )).Completed +=
        (LoadTextureAsync res) =>
        {
            if (res.IsRanToCompletion)
            {
                //use res.Result
            }
            else
            {
                Console.WriteLine("Texture loading failed!");
            }
            _async = null;
        };
}
```

Texture [URI](../concepts/sdk-concepts.md#built-in-and-external-resources) has to point to a texture in dds format to be loadable by the Remote Rendering Server. Specific content of the dds file is affected by the texture type (2D/CubeMap/3D) and feature that will be using it. For example, the pixel content has to be grayscale for PBR material [roughness maps](../reference/features/materials.md#roughness).

## Using textures

API calls that expect Textures as input will always specify what type of texture is expected.

## Next steps

* [Materials](materials.md)
* [Sky](../reference/features/sky.md)
