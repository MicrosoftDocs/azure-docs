---
title: Textures
description: Texture resource workflow
author: florianborn71
ms.author: flborn
ms.date: 02/05/2020
ms.topic: conceptual
---

# Textures

Textures are an immutable [shared resource](../concepts/lifetime.md). Textures can be loaded from [blob storage](../how-tos/conversion/blob-storage.md) and applied to models directly, as demonstrated in [Tutorial: Changing the environment and materials](../tutorials/unity/materials-lighting-effects/materials-lighting-effects.md). Most commonly, though, textures will be part of a [converted model](../how-tos/conversion/model-conversion.md), where they are referenced by its [materials](materials.md).

## Texture types

Different texture types have different use cases:

* **2D Textures** are mainly used in [materials](materials.md).
* **Cubemaps** can be used for the [sky](../overview/features/sky.md).

## Supported texture formats

All textures given to ARR have to be in [DDS format](https://en.wikipedia.org/wiki/DirectDraw_Surface). Preferably with mipmaps and texture compression. See [the TexConv command-line tool](../resources/tools/tex-conv.md) if you want to automate the conversion process.

## Loading textures

When loading a texture, you have to specify its expected type. If the type mismatches, the texture load fails.
Loading a texture with the same URI twice will return the same texture object, as it is a [shared resource](../concepts/lifetime.md).

Similar to loading models, there are two variants of addressing a texture asset in source blob storage:

* The texture asset can be addressed by its SAS URI. Relevant loading function is `LoadTextureFromSASAsync` with parameter `LoadTextureFromSASParams`. Use this variant also when loading [built-in textures](../overview/features/sky.md#built-in-environment-maps).
* The texture can be addressed by blob storage parameters directly, in case the [blob storage is linked to the account](../how-tos/create-an-account.md#link-storage-accounts). Relevant loading function in this case is `LoadTextureAsync` with parameter `LoadTextureParams`.

The following sample code shows how to load a texture via its SAS URI (or built-in texture) - note that only the loading function/parameter differs for the other case:

```cs
LoadTextureAsync _textureLoad = null;
void LoadMyTexture(AzureSession session, string textureUri)
{
    _textureLoad = session.Actions.LoadTextureFromSASAsync(new LoadTextureFromSASParams(textureUri, TextureType.Texture2D));
    _textureLoad.Completed +=
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
            _textureLoad = null;
        };
}
```

```cpp
void LoadMyTexture(ApiHandle<AzureSession> session, std::string textureUri)
{
    LoadTextureFromSASParams params;
    params.TextureType = TextureType::Texture2D;
    params.TextureUrl = std::move(textureUri);
    ApiHandle<LoadTextureAsync> textureLoad = *session->Actions()->LoadTextureFromSASAsync(params);
    textureLoad->Completed([](ApiHandle<LoadTextureAsync> res)
    {
        if (res->IsRanToCompletion())
        {
            //use res->Result()
        }
        else
        {
            printf("Texture loading failed!");
        }
    });
}
```


Depending on what the texture is supposed to be used for, there may be restrictions for the texture type and content. For example, the roughness map of a [PBR material](../overview/features/pbr-materials.md) must be grayscale.

> [!CAUTION]
> All *Async* functions in ARR return asynchronous operation objects. You must store a reference to those objects until the operation is completed. Otherwise the C# garbage collector may delete the operation early and it can never finish. In the sample code above the member variable '_textureLoad' is used to hold a reference until the *Completed* event arrives.

## Next steps

* [Materials](materials.md)
* [Sky](../overview/features/sky.md)
