---
title: Sky reflections
description: Describes how to set up environment maps for sky reflections
author: florianborn71
ms.author: flborn
ms.date: 02/07/2020
ms.topic: article
---

# Sky reflections

In Azure Remote Rendering, a sky texture is used to light objects realistically. For augmented reality applications, this texture should resemble your real-world surroundings, to make objects appear convincing. This article describes how to change the sky texture.

> [!NOTE]
> The sky texture is also referred to as an *environment map*. These terms are used interchangeably.

## Object lighting

Azure Remote Rendering employs *physically based rendering* (PBR) for realistic lighting computations. Although you can add [light sources](lights.md) to your scene, using a good sky texture has the greatest impact.

The images below show results of lighting different surfaces only with a sky texture:

| Roughness  | 0                                        | 0.25                                          | 0.5                                          | 0.75                                          | 1                                          |
|:----------:|:----------------------------------------:|:---------------------------------------------:|:--------------------------------------------:|:---------------------------------------------:|:------------------------------------------:|
| Non-Metal  | ![Dielectric0](media/dielectric-0.png)   | ![GreenPointPark](media/dielectric-0.25.png)  | ![GreenPointPark](media/dielectric-0.5.png)  | ![GreenPointPark](media/dielectric-0.75.png)  | ![GreenPointPark](media/dielectric-1.png)  |
| Metal      | ![GreenPointPark](media/metallic-0.png)  | ![GreenPointPark](media/metallic-0.25.png)    | ![GreenPointPark](media/metallic-0.5.png)    | ![GreenPointPark](media/metallic-0.75.png)    | ![GreenPointPark](media/metallic-1.png)    |

For more information on the lighting model, see the [materials](../../concepts/materials.md) chapter.

> [!IMPORTANT]
> Azure Remote Rendering uses the sky texture only for lighting models. It does not render the sky as a background, since Augmented Reality applications already have a proper background - the real world.

## Changing the sky texture

To change the environment map, all you need to do is [load a texture](../../concepts/textures.md) and change the session's `SkyReflectionSettings`:

```cs
LoadTextureAsync _skyTextureLoad = null;
void ChangeEnvironmentMap(AzureSession session)
{
    _skyTextureLoad = session.Actions.LoadTextureFromSASAsync(new LoadTextureFromSASParams("builtin://VeniceSunset", TextureType.CubeMap));

    _skyTextureLoad.Completed += (LoadTextureAsync res) =>
        {
            if (res.IsRanToCompletion)
            {
                try
                {
                    session.Actions.SkyReflectionSettings.SkyReflectionTexture = res.Result;
                }
                catch (RRException exception)
                {
                    System.Console.WriteLine($"Setting sky reflection failed: {exception.Message}");
                }
            }
            else
            {
                System.Console.WriteLine("Texture loading failed!");
            }
        };
}
```

```cpp
void ChangeEnvironmentMap(ApiHandle<AzureSession> session)
{
    LoadTextureFromSASParams params;
    params.TextureType = TextureType::CubeMap;
    params.TextureUrl = "builtin://VeniceSunset";
    ApiHandle<LoadTextureAsync> skyTextureLoad = *session->Actions()->LoadTextureFromSASAsync(params);

    skyTextureLoad->Completed([&](ApiHandle<LoadTextureAsync> res)
    {
        if (res->IsRanToCompletion())
        {
            ApiHandle<SkyReflectionSettings> settings = *session->Actions()->SkyReflectionSettings();
            settings->SkyReflectionTexture(*res->Result());
        }
        else
        {
            printf("Texture loading failed!");
        }
    });
}

```

Note that the `LoadTextureFromSASAsync` variant is used above because a built-in texture is loaded. In case of loading from [linked blob storages](../../how-tos/create-an-account.md#link-storage-accounts), use the `LoadTextureAsync` variant.

## Sky texture types

You can use both *[cubemaps](https://en.wikipedia.org/wiki/Cube_mapping)* and *2D textures* as environment maps.

All textures have to be in a [supported texture format](../../concepts/textures.md#supported-texture-formats). You don't need to provide mipmaps for sky textures.

### Cube environment maps

For reference, here is an unwrapped cubemap:

![An unwrapped cubemap](media/Cubemap-example.png)

Use `AzureSession.Actions.LoadTextureAsync`/ `LoadTextureFromSASAsync` with `TextureType.CubeMap` to load cubemap textures.

### Sphere environment maps

When using a 2D texture as an environment map, the image has to be in [spherical coordinate space](https://en.wikipedia.org/wiki/Spherical_coordinate_system).

![A sky image in spherical coordinates](media/spheremap-example.png)

Use `AzureSession.Actions.LoadTextureAsync` with `TextureType.Texture2D` to load spherical environment maps.

## Built-in environment maps

Azure Remote Rendering provides a few built-in environment maps that are always available. All built-in environment maps are cubemaps.

|Identifier                         | Description                                              | Illustration                                                      |
|-----------------------------------|:---------------------------------------------------------|:-----------------------------------------------------------------:|
|builtin://Autoshop                 | Variety of stripe lights, bright indoor base lighting    | ![Autoshop](media/autoshop.png)
|builtin://BoilerRoom               | Bright indoor light setting, multiple window lights      | ![BoilerRoom](media/boiler-room.png)
|builtin://ColorfulStudio           | Varyingly colored lights in medium light indoor setting  | ![ColorfulStudio](media/colorful-studio.png)
|builtin://Hangar                   | Moderately bright ambient hall light                     | ![SmallHangar](media/hangar.png)
|builtin://IndustrialPipeAndValve   | Dim indoor setting with light-dark contrast              | ![IndustrialPipeAndValve](media/industrial-pipe-and-valve.png)
|builtin://Lebombo                  | Daytime ambient room light, bright window area light     | ![Lebombo](media/lebombo.png)
|builtin://SataraNight              | Dark night sky and ground with many surrounding lights   | ![SataraNight](media/satara-night.png)
|builtin://SunnyVondelpark          | Bright sunlight and shadow contrast                      | ![SunnyVondelpark](media/sunny-vondelpark.png)
|builtin://Syferfontein             | Clear sky light with moderate ground lighting            | ![Syferfontein](media/syferfontein.png)
|builtin://TearsOfSteelBridge       | Moderately varying sun and shade                         | ![TearsOfSteelBridge](media/tears-of-steel-bridge.png)
|builtin://VeniceSunset             | Evening sunset light approaching dusk                    | ![VeniceSunset](media/venice-sunset.png)
|builtin://WhippleCreekRegionalPark | Bright, lush-green, and white light tones, dimmed ground | ![WhippleCreekRegionalPark](media/whipple-creek-regional-park.png)
|builtin://WinterRiver              | Daytime with bright ambient ground light                 | ![WinterRiver](media/winter-river.png)
|builtin://DefaultSky               | Same as TearsOfSteelBridge                               | ![DefaultSky](media/tears-of-steel-bridge.png)

## Next steps

* [Lights](../../overview/features/lights.md)
* [Materials](../../concepts/materials.md)
* [Textures](../../concepts/textures.md)
* [The TexConv command-line tool](../../resources/tools/tex-conv.md)
