---
title: Textures
description: Texture resource workflow
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: conceptual
ms.service: azure-remote-rendering
---
# Textures

Textures are immutable shared resources that can be used in various places in the API. Textures can be encountered in a loaded model when inspecting its meshes and materials or loaded on demand by the user. There are three distinguished types of textures:
* 2D Textures - Mainly used in [Materials](../sdk/concepts-materials.md)
* Cube Maps - Example of use is setting the [Sky](../sdk/features-sky.md#example-calls)
* 3D Textures - Not used at the moment

## Loading textures

When loading a texture, the user has to know the type of the texture. If the texture type mismatches, the texture load fails and an error code is returned.
Loading texture with the same URI twice will return the same texture as it is a [shared resource](../concepts/sdk-concepts.md#resources).

``` cpp
void LoadMyTexture(RemoteRenderingClient& client, const char* textureUri)
{
    client.LoadTextureAsync( LoadTextureCInfo{ textureUri, Texture::Texture2D },
    [&](ARRResult error, ObjectId textureId)
    {
        if (error == ARRResult::Success)
        {
            //use textureId to get TextureHandle
        }
        else
        {
            std::cout << "Texture loading failed!" << std::endl;
        }
    });
}
```
The C# API can be used in a similar fashion:
``` cs
void LoadMyTexture(string textureUri)
{
    RemoteManager.LoadTextureAsync(
    	new LoadTextureParams(textureUri, Texture.TextureType.Texture2D )).Completed +=
        (IAsync<Texture> res) =>
        {
            if (res.IsRanToCompletion)
            {
                //use res.Result
            }
            else
            {
                Console.WriteLine("Texture loading failed!");
            }
        };
}
```

Texture [URI](../concepts/sdk-concepts.md#uris) has to point to a texture in dds format to be loadable by the Remote Rendering Server. Specific content of the dds file is affected by the texture type (2D/CubeMap/3D) and feature that will be using it. That is, the pixel content has to be grayscale for Pbr material [roughness map](../sdk/concepts-materials.md#roughness).

## Using textures
API calls that expect Textures as input will always specify what type of texture is expected.

## See also
* [Materials](../sdk/concepts-materials.md)
* [Sky](../sdk/features-sky.md)