---
title: Textures
description: Texture resource workflow
author: FlorianBorn71
ms.author: flborn
ms.date: 02/05/2020
ms.topic: conceptual
---

# Textures

Textures are an immutable [shared resource](../concepts/lifetime.md). Textures can be loaded from [blob storage](../how-tos/conversion/blob-storage.md) and applied to models directly, as demonstrated in [Tutorial: Changing the environment and materials](../tutorials/unity/changing-environment-and-materials.md). Most commonly, though, textures will be part of a [converted model](../how-tos/conversion/model-conversion.md), where they are referenced by its [materials](materials.md).

## Texture types

Different texture types have different use cases:

* **2D Textures** are mainly used in [materials](materials.md).
* **Cubemaps** can be used for the [sky](../overview/features/sky.md).

## Supported texture formats

All textures given to ARR have to be in [DDS format](https://en.wikipedia.org/wiki/DirectDraw_Surface). Preferably with mipmaps and texture compression. See [the TexConv command-line tool](../resources/tools/tex-conv.md) if you want to automate the conversion process.

## Loading textures

When loading a texture, you have to specify its expected type. If the type mismatches, the texture load fails.
Loading a texture with the same URI twice will return the same texture object, as it is a [shared resource](../concepts/lifetime.md).

``` cs
LoadTextureAsync _async = null;
void LoadMyTexture(AzureSession session, string textureUri)
{
    _async = session.Actions.LoadTextureAsync(new LoadTextureParams(textureUri, TextureType.Texture2D));
    _async.Completed +=
        (LoadTextureAsync res) =>
        {
            if (res.IsRanToCompletion)
            {
                //use res.Result
            }
            else
            {
                System.Console.WriteLine("Texture loading failed!");
            }
            _async = null;
        };
}
```

The URI may point to a [builtin or external file](../concepts/sdk-concepts.md#built-in-and-external-resources). Depending on what the texture is supposed to be used for, there may be restrictions for the texture type and content. For example, the roughness map of a [PBR material](../overview/features/pbr-materials.md) must be grayscale.

## Next steps

* [Materials](materials.md)
* [Sky](../overview/features/sky.md)
