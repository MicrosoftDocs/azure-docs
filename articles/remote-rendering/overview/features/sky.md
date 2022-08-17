---
title: Sky reflections
description: Describes how to set up environment maps for sky reflections
author: florianborn71
ms.author: flborn
ms.date: 02/07/2020
ms.topic: article
ms.custom: devx-track-csharp
---

# Sky reflections

In Azure Remote Rendering, a sky texture is used to light objects realistically. For augmented reality applications, this texture should resemble your real-world surroundings, to make objects appear convincing. This article describes how to change the sky texture.
The sky only affects the rendering of [PBR materials](../../overview/features/pbr-materials.md). [Color materials](../../overview/features/color-materials.md) and [point clouds](../../overview/features/point-cloud-rendering.md) aren't affected.

> [!NOTE]
> The sky texture is also referred to as an *environment map*. These terms are used interchangeably.

## Object lighting

Azure Remote Rendering employs *physically based rendering* (PBR) for realistic lighting computations. Although you can add [light sources](lights.md) to your scene, using a good sky texture has the greatest impact.

The images below show results of lighting different surfaces only with a sky texture:

| Roughness  | 0                                        | 0.25                                          | 0.5                                          | 0.75                                          | 1                                          |
|:----------:|:----------------------------------------:|:---------------------------------------------:|:--------------------------------------------:|:---------------------------------------------:|:------------------------------------------:|
| Non-Metal  | ![Dielectric, Roughness=0](media/dielectric-0.png)   | ![Dielectric, Roughness=0.25](media/dielectric-0.25.png)  | ![Dielectric, Roughness=0.5](media/dielectric-0.5.png)  | ![Dielectric, Roughness=0.75](media/dielectric-0.75.png)  | ![Dielectric, Roughness=1](media/dielectric-1.png)  |
| Metal      | ![Metal, Roughness=0](media/metallic-0.png)  | ![Metal, Roughness=0.25](media/metallic-0.25.png)    | ![Metal, Roughness=0.5](media/metallic-0.5.png)    | ![Metal, Roughness=0.75](media/metallic-0.75.png)    | ![Metal, Roughness=1](media/metallic-1.png)    |

For more information on the lighting model, see the [materials](../../concepts/materials.md) chapter.

> [!IMPORTANT]
> Azure Remote Rendering uses the sky texture only for lighting models. It does not render the sky as a background, since Augmented Reality applications already have a proper background - the real world.

## Changing the sky texture

To change the environment map, all you need to do is [load a texture](../../concepts/textures.md) and change the session's `SkyReflectionSettings`:

```cs
async void ChangeEnvironmentMap(RenderingSession session)
{
    try
    {
        Texture skyTex = await session.Connection.LoadTextureFromSasAsync(new LoadTextureFromSasOptions("builtin://VeniceSunset", TextureType.CubeMap));
        session.Connection.SkyReflectionSettings.SkyReflectionTexture = skyTex;
    }
    catch (RRException exception)
    {
        System.Console.WriteLine($"Setting sky reflection failed: {exception.Message}");
    }
}
```

```cpp
void ChangeEnvironmentMap(ApiHandle<RenderingSession> session)
{
    LoadTextureFromSasOptions params;
    params.TextureType = TextureType::CubeMap;
    params.TextureUri = "builtin://VeniceSunset";
    session->Connection()->LoadTextureFromSasAsync(params, [&](Status status, ApiHandle<Texture> res) {
        if (status == Status::OK)
        {
            ApiHandle<SkyReflectionSettings> settings = session->Connection()->GetSkyReflectionSettings();
            settings->SetSkyReflectionTexture(res);
        }
        else
        {
            printf("Texture loading failed!\n");
        }
    });
}
```

The `LoadTextureFromSasAsync` variant is used above because a built-in texture is loaded. When loading from [linked blob storages](../../how-tos/create-an-account.md#link-storage-accounts) instead, use the `LoadTextureAsync` variant.

## Sky texture types

You can use both *[cubemaps](https://en.wikipedia.org/wiki/Cube_mapping)* and *2D textures* as environment maps.

All textures have to be in a [supported texture format](../../concepts/textures.md#supported-texture-formats). You don't need to provide mipmaps for sky textures.

### Cube environment maps

For reference, here's an unwrapped cubemap:

![An unwrapped cubemap](media/Cubemap-example.png)

Use `RenderingSession.Connection.LoadTextureAsync`/ `LoadTextureFromSasAsync` with `TextureType.CubeMap` to load cubemap textures.

### Sphere environment maps

When using a 2D texture as an environment map, the image has to be in [spherical coordinate space](https://en.wikipedia.org/wiki/Spherical_coordinate_system).

![A sky image in spherical coordinates](media/spheremap-example.png)

Use `RenderingSession.Connection.LoadTextureAsync` with `TextureType.Texture2D` to load spherical environment maps.

## Built-in environment maps

Azure Remote Rendering provides a few built-in environment maps that are always available. All built-in environment maps are cubemaps.

|Identifier                         | Description                                              | Illustration                                                      |
|-----------------------------------|:---------------------------------------------------------|:-----------------------------------------------------------------:|
|builtin://Autoshop                 | Variety of stripe lights, bright indoor base lighting    | ![Autoshop skybox used to light an object](media/autoshop.png)
|builtin://BoilerRoom               | Bright indoor light setting, multiple window lights      | ![BoilerRoom skybox used to light an object](media/boiler-room.png)
|builtin://ColorfulStudio           | Varyingly colored lights in medium light indoor setting  | ![ColorfulStudio skybox used to light an object](media/colorful-studio.png)
|builtin://Hangar                   | Moderately bright ambient hall light                     | ![SmallHangar skybox used to light an object](media/hangar.png)
|builtin://IndustrialPipeAndValve   | Dim indoor setting with light-dark contrast              | ![IndustrialPipeAndValve skybox used to light an object](media/industrial-pipe-and-valve.png)
|builtin://Lebombo                  | Daytime ambient room light, bright window area light     | ![Lebombo skybox used to light an object](media/lebombo.png)
|builtin://SataraNight              | Dark night sky and ground with many surrounding lights   | ![SataraNight skybox used to light an object](media/satara-night.png)
|builtin://SunnyVondelpark          | Bright sunlight and shadow contrast                      | ![SunnyVondelpark skybox used to light an object](media/sunny-vondelpark.png)
|builtin://Syferfontein             | Clear sky light with moderate ground lighting            | ![Syferfontein skybox used to light an object](media/syferfontein.png)
|builtin://TearsOfSteelBridge       | Moderately varying sun and shade                         | ![TearsOfSteelBridge skybox used to light an object](media/tears-of-steel-bridge.png)
|builtin://VeniceSunset             | Evening sunset light approaching dusk                    | ![VeniceSunset skybox used to light an object](media/venice-sunset.png)
|builtin://WhippleCreekRegionalPark | Bright, lush-green, and white light tones, dimmed ground | ![WhippleCreekRegionalPark skybox used to light an object](media/whipple-creek-regional-park.png)
|builtin://WinterRiver              | Daytime with bright ambient ground light                 | ![WinterRiver skybox used to light an object](media/winter-river.png)
|builtin://DefaultSky               | Same as TearsOfSteelBridge                               | ![DefaultSky skybox used to light an object](media/tears-of-steel-bridge.png)

## API documentation

* [C# RenderingConnection.SkyReflectionSettings property](/dotnet/api/microsoft.azure.remoterendering.renderingconnection.skyreflectionsettings)
* [C++ RenderingConnection::SkyReflectionSettings()](/cpp/api/remote-rendering/renderingconnection#skyreflectionsettings)

## Next steps

* [Lights](../../overview/features/lights.md)
* [Materials](../../concepts/materials.md)
* [Textures](../../concepts/textures.md)
