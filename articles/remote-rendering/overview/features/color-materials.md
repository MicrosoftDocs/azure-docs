---
title: Color materials
description: Describes the color material type.
author: jakrams
ms.author: jakras
ms.date: 02/11/2020
ms.topic: article
---

# Color materials

*Color materials* are one of the supported [material types](../../concepts/materials.md) in Azure Remote Rendering. They're used for [meshes](../../concepts/meshes.md) that shouldn't receive any kind of lighting, but rather always appear at full brightness. This might be the case for 'glowing' materials, such as car dashboards, light bulbs, or for data that already incorporates static lighting, such as models obtained through [photogrammetry](https://en.wikipedia.org/wiki/Photogrammetry).

Color materials are more efficient to render than [PBR materials](pbr-materials.md) because of their simpler shading model. They also support different transparency modes.

## Color material properties

The following material properties are exposed in the runtime API, for instance on the [C# ColorMaterial class](/dotnet/api/microsoft.azure.remoterendering.colormaterial) or the [C++ ColorMaterial class](/cpp/api/remote-rendering/colormaterial), respectively.

* `ColorFlags`: Miscellaneous feature flags can be combined in this bit mask to enable the following features:
  * `UseVertexColor`: If the mesh contains :::no-loc text="vertex"::: colors and this option is enabled, the mesh's :::no-loc text="vertex"::: color is multiplied into the `AlbedoColor` and `AlbedoMap`. By default `UseVertexColor` is disabled.
  * `DoubleSided`: If double-sidedness is set to true, triangles with this material are rendered even if the camera is looking at their back faces. By default this option is disabled. See also [:::no-loc text="Single-sided"::: rendering](single-sided-rendering.md).
  * `AlphaClipped`: Enables hard cut-outs on a per-pixel basis, based on the alpha value being below the value of `AlphaClipThreshold` (see below). This works for opaque materials as well.
  * `TransparencyWritesDepth`: If the `TransparencyWritesDepth` flag is set on the material and the material is transparent, objects using this material will also contribute to the final depth buffer. See the color material property `ColorTransparencyMode` in the next section. Enabling this feature is recommended if your use case needs a more plausible [late stage reprojection](late-stage-reprojection.md) of fully transparent scenes. For mixed opaque/transparent scenes, this setting may introduce implausible reprojection behavior or reprojection artifacts. For this reason, the default and recommended setting for the general use case is to disable this flag. The written depth values are taken from the per-pixel depth layer of the object that is closest to the camera.
  * `FresnelEffect`: This material flag enables the additive [fresnel effect](../../overview/features/fresnel-effect.md) on the respective material. The appearance of the effect is governed by the other fresnel parameters `FresnelEffectColor` and `FresnelEffectExponent` explained below.
* `AlbedoColor`: This color is multiplied with other colors, such as the `AlbedoMap` or *:::no-loc text="vertex"::: colors*. If *transparency* is enabled on a material, the alpha channel is used to adjust the opacity, with `1` meaning fully opaque and `0` meaning fully transparent. The default albedo color is opaque white.

  > [!NOTE]
  > Since color materials don't reflect the environment, a fully transparent color material becomes invisible. This is different for [PBR materials](pbr-materials.md).

* `AlbedoMap`: A [2D texture](../../concepts/textures.md) for per-pixel albedo values.

* `AlphaClipThreshold`: If the `AlphaClipped` flag is set on the `ColorFlags` property, all pixels where the albedo alpha value is lower than the value of `AlphaClipThreshold` won't be drawn. Alpha clipping can be used even without enabling transparency and is much faster to render. Alpha clipped materials are still slower to render than fully opaque materials, though. By default alpha clipping is disabled.

* `TexCoordScale` and `TexCoordOffset`: The scale is multiplied into the UV texture coordinates, the offset is added to it. Can be used to stretch and shift the textures. The default scale is (1, 1) and offset is (0, 0).

* `FresnelEffectColor`: The fresnel color used for this material. Only important when the fresnel effect flag has been set on this material (see above). This property controls the base color of the fresnel shine (see [fresnel effect](../../overview/features/fresnel-effect.md) for a full explanation). Currently only the RGB-channel values are important and the alpha value will be ignored.

* `FresnelEffectExponent`: The fresnel exponent used for this material. Only important when the fresnel effect flag has been set on this material (see above). This property controls the spread of the fresnel shine. The minimum value 0.01 causes a spread across the whole object. The maximum value 10.0 constricts the shine to only the most grazing edges visible.

* `VertexMix`: This value between `0` and `1` specifies how strongly the :::no-loc text="vertex"::: color in a [mesh](../../concepts/meshes.md) contributes to the final color. At the default value of 1, the :::no-loc text="vertex"::: color is multiplied into the albedo color fully. With a value of 0, the :::no-loc text="vertex"::: colors are ignored entirely.

* `ColorTransparencyMode`: Contrary to [PBR materials](pbr-materials.md), color materials distinguish between different transparency modes:

  * `Opaque`: The default mode disables transparency. Alpha clipping is still possible, though, and should be preferred, if sufficient.
  * `AlphaBlended`: This mode is similar to the transparency mode for PBR materials. It should be used for see-through materials like glass.
  * `Additive`: This mode is the simplest and most efficient transparency mode. The contribution of the material is added to the rendered image. This mode can be used to simulate glowing (but still transparent) objects, such as markers used for highlighting important objects.

## Color material overrides during conversion

A subset of color material properties can be overridden during model conversion through the [material override file](../../how-tos/conversion/override-materials.md).
The following table shows the mapping between runtime properties documented above and the corresponding property name in the override file:

| Material property name      | Property name in override file|
|:----------------------------|:---------------------|
| `ColorFlags.AlphaClipped`   | `alphaClipEnabled` |
| `ColorFlags.UseVertexColor` | `useVertexColor` |
| `ColorFlags.DoubleSided`    | `isDoubleSided` |
| `ColorFlags.TransparencyWritesDepth` | `transparencyWritesDepth` |
| `AlbedoColor`               | `albedoColor` |
| `TexCoordScale`             | `textureCoordinateScale` |
| `TexCoordOffset`            | `textureCoordinateOffset` |
| `ColorTransparencyMode`     | `transparent` |
| `AlphaClipThreshold`        | `alphaClipThreshold` |

## API documentation

* [C# ColorMaterial class](/dotnet/api/microsoft.azure.remoterendering.colormaterial)
* [C# RenderingConnection.CreateMaterial()](/dotnet/api/microsoft.azure.remoterendering.renderingconnection.creatematerial)
* [C++ ColorMaterial class](/cpp/api/remote-rendering/colormaterial)
* [C++ RenderingConnection::CreateMaterial()](/cpp/api/remote-rendering/renderingconnection#creatematerial)

## Next steps

* [PBR materials](pbr-materials.md)
* [Textures](../../concepts/textures.md)
* [Meshes](../../concepts/meshes.md)
* [Material override files](../../how-tos/conversion/override-materials.md).