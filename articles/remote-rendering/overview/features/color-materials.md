---
title: Color materials
description: Describes the color material type.
author: jakrams
ms.author: jakras
ms.date: 02/11/2020
ms.topic: article
---

# Color materials

*Color materials* are one of the supported [material types](../../concepts/materials.md) in Azure Remote Rendering. They are used for [meshes](../../concepts/meshes.md) that should not receive any kind of lighting, but rather be full brightness at all times. This might be the case for 'glowing' materials, such as car dashboards, light bulbs, or for data that already incorporates static lighting, such as models obtained through [photogrammetry](https://en.wikipedia.org/wiki/Photogrammetry).

Color materials are more efficient to render than [PBR materials](pbr-materials.md) because of their simpler shading model. They also support different transparency modes.

## Common material properties

These properties are common to all materials:

* **albedoColor:** This color is multiplied with other colors, such as the *albedoMap* or *:::no-loc text="vertex"::: colors*. If *transparency* is enabled on a material, the alpha channel is used to adjust the opacity, with `1` meaning fully opaque and `0` meaning fully transparent. Default is white.

  > [!NOTE]
  > Since color materials don't reflect the environment, a fully transparent color material becomes invisible. This is different for [PBR materials](pbr-materials.md).

* **albedoMap:** A [2D texture](../../concepts/textures.md) for per-pixel albedo values.

* **alphaClipEnabled** and **alphaClipThreshold:** If *alphaClipEnabled* is true, all pixels where the albedo alpha value is lower than *alphaClipThreshold* won't be drawn. Alpha clipping can be used even without enabling transparency and is much faster to render. Alpha clipped materials are still slower to render than fully opaque materials, though. By default alpha clipping is disabled.

* **textureCoordinateScale** and **textureCoordinateOffset:** The scale is multiplied into the UV texture coordinates, the offset is added to it. Can be used to stretch and shift the textures. The default scale is (1, 1) and offset is (0, 0).

* **useVertexColor:** If the mesh contains :::no-loc text="vertex"::: colors and this option is enabled, the meshes' :::no-loc text="vertex"::: color is multiplied into the *albedoColor* and *albedoMap*. By default *useVertexColor* is disabled.

* **isDoubleSided:** If double-sidedness is set to true, triangles with this material are rendered even if the camera is looking at their back faces. By default this option is disabled. See also [:::no-loc text="Single-sided"::: rendering](single-sided-rendering.md).

* **TransparencyWritesDepth:** If the TransparencyWritesDepth flag is set on the material and the material is transparent, objects using this material will also contribute to the final depth buffer. See the color material property *transparencyMode* in the next section. Enabling this feature is recommended if your use case needs a more plausible [late stage reprojection](late-stage-reprojection.md) of fully transparent scenes. For mixed opaque/transparent scenes, this setting may introduce implausible reprojection behavior or reprojection artifacts. For this reason, the default and recommended setting for the general use case is to disable this flag. The written depth values are taken from the per-pixel depth layer of the object that is closest to the camera.

## Color material properties

The following properties are specific to color materials:

* **vertexMix:** This value between `0` and `1` specifies how strongly the :::no-loc text="vertex"::: color in a [mesh](../../concepts/meshes.md) contributes to the final color. At the default value of 1, the :::no-loc text="vertex"::: color is multiplied into the albedo color fully. With a value of 0, the :::no-loc text="vertex"::: colors are ignored entirely.

* **transparencyMode:** Contrary to [PBR materials](pbr-materials.md), color materials distinguish between different transparency modes:

  1. **Opaque:** The default mode disables transparency. Alpha clipping is still possible, though, and should be preferred, if sufficient.
  
  1. **AlphaBlended:** This mode is similar to the transparency mode for PBR materials. It should be used for see-through materials like glass.

  1. **Additive:** This mode is the simplest and most efficient transparency mode. The contribution of the material is added to the rendered image. This mode can be used to simulate glowing (but still transparent) objects, such as markers used for highlighting important objects.

## API documentation

* [C# ColorMaterial class](https://docs.microsoft.com/dotnet/api/microsoft.azure.remoterendering.colormaterial)
* [C# RemoteManager.CreateMaterial()](https://docs.microsoft.com/dotnet/api/microsoft.azure.remoterendering.remotemanager.creatematerial)
* [C++ ColorMaterial class](https://docs.microsoft.com/cpp/api/remote-rendering/colormaterial)
* [C++ RemoteManager::CreateMaterial()](https://docs.microsoft.com/cpp/api/remote-rendering/remotemanager#creatematerial)

## Next steps

* [PBR materials](pbr-materials.md)
* [Textures](../../concepts/textures.md)
* [Meshes](../../concepts/meshes.md)
