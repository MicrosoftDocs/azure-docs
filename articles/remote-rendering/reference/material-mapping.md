---
title: Material mapping for model formats
description: Describes the default conversion from model source formats to PBR material
author: jakrams
ms.author: jakras
ms.date: 02/11/2020
ms.topic: reference
---

# Material mapping for model formats

When a source asset is [converted as a model](../how-tos/conversion/model-conversion.md), the converter creates [materials](../concepts/materials.md) for each [mesh](../concepts/meshes.md). The way materials are created can be [overridden](../how-tos/conversion/override-materials.md). However by default the conversion will create [PBR materials](../overview/features/pbr-materials.md). Since every source file format, like FBX, uses its own conventions to define materials, those conventions must be mapped to the PBR material parameters of Azure Remote Rendering. 

This article lists the exact mappings used to convert materials from source assets to runtime materials.

## glTF

Almost everything from the glTF 2.0 spec is supported in Azure Remote Rendering, except *EmissiveFactor* and *EmissiveTexture*.

The following table shows the mapping:

| glTF | Azure Remote Rendering |
|:-------------------|:--------------------------|
|   baseColorFactor   |   albedoColor              |
|   baseColorTexture  |   albedoMap                |
|   metallicFactor    |   metalness                |
|   metallicTexture   |   metalnessMap             |
|   roughnessFactor   |   roughness                |
|   roughnessTexture  |   roughnessMap             |
|   occlusionFactor   |   occlusion                |
|   occlusionTexture  |   occlusionMap             |
|   normalTexture     |   normalMap                |
|   normalTextureInfo.scale |   normalMapScale     |
|   alphaCutoff       |   alphaClipThreshold       |
|   alphaMode.OPAQUE  |   alphaClipEnabled = false, isTransparent = false |
|   alphaMode.MASK    |   alphaClipEnabled = true, isTransparent = false  |
|   alphaMode.BLEND   |   isTransparent = true     |
|   doubleSided       |   isDoubleSided            |
|   emissiveFactor    |   -                        |
|   emissiveTexture   |   -                        |

Each texture in glTF can have a `texCoord` value, which is also supported in the Azure Remote Rendering materials.

### Embedded textures

Textures embedded in *\*.bin* or *\*.glb* files are supported.

### Supported glTF extension

Additionally to the base feature set, Azure Remote Rendering supports the following glTF extensions:

* [MSFT_packing_occlusionRoughnessMetallic](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Vendor/MSFT_packing_occlusionRoughnessMetallic/README.md)
* [KHR_materials_unlit](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_materials_unlit/README.md): Corresponds to [color materials](../overview/features/color-materials.md). For *emissive* materials, it's recommended to use this extension.
* [KHR_materials_pbrSpecularGlossiness](https://kcoley.github.io/glTF/extensions/2.0/Khronos/KHR_materials_pbrSpecularGlossiness/): Instead of metallic-roughness textures, you can provide diffuse-specular-glossiness textures. The Azure Remote Rendering implementation directly follows the conversion formulas from the extension.

## FBX

The FBX format is closed-source and FBX materials aren't compatible with PBR materials in general. FBX uses a complex description of surfaces with many unique parameters and properties and **not all of them are used by the Azure Remote Rendering pipeline**.

> [!IMPORTANT]
> The Azure Remote Rendering model conversion pipeline only supports **FBX 2011 and higher**.

The FBX format defines a conservative approach for materials, there are only two types in the official FBX specification:

* *Lambert* - Not commonly used for quite some time already, but it's still supported by converting to Phong at conversion time.
* *Phong* - Almost all materials and most content tools use this type.

The Phong model is more accurate and it's used as the *only* model for FBX materials. Below it will be referred as the *FBX Material*.

> Maya uses two custom extensions for FBX by defining custom properties for PBR and Stingray types of a material. These details are not included in the FBX specification, so it's not supported by Azure Remote Rendering currently.

FBX Materials use the Diffuse-Specular-SpecularLevel concept, so to convert from a diffuse texture to an albedo map we need to calculate the other parameters to subtract them from diffuse.

> All colors and textures in FBX are in sRGB space (also known as Gamma space) but Azure Remote Rendering works with linear space during visualization and at the end of the frame converts everything back to sRGB space. The Azure Remote Rendering asset pipeline converts everything to linear space to send it as prepared data to the renderer.

This table shows how textures are mapped from FBX Materials to Azure Remote Rendering materials. Some of them aren't directly used but in combination with other textures participating in the formulas (for instance the diffuse texture):

| FBX | Azure Remote Rendering |
|:-----|:----|
| AmbientColor | Occlusion Map   |
| DiffuseColor | *used for Albedo, Metalness* |
| TransparentColor | *used for alpha channel of Albedo* |
| TransparencyFactor | *used for alpha channel of Albedo* |
| Opacity | *used for alpha channel of Albedo* |
| SpecularColor | *used for Albedo, Metalness, Roughness* |
| SpecularFactor| *used for Albedo, Metalness, Roughness* |
| ShininessExponent | *used for Albedo, Metalness, Roughness* |
| NormalMap | NormalMap |
| Bump | *converted to NormalMap* |
| EmissiveColor | - |
| EmissiveFactor | - |
| ReflectionColor | - |
| DisplacementColor | - |

The mapping above is the most complex part of the material conversion, due to many assumptions that have to be made. We discuss these assumptions below.

Some definitions used below:

* `Specular` =  `SpecularColor` * `SpecularFactor`
* `SpecularIntensity` = `Specular`.Red ∗ 0.2125 +  `Specular`.Green ∗ 0.7154 + `Specular`.Blue ∗ 0.0721
* `DiffuseBrightness` = 0.299 * `Diffuse`.Red<sup>2</sup> + 0.587 * `Diffuse`.Green<sup>2</sup> + 0.114 * `Diffuse`.Blue<sup>2</sup>
* `SpecularBrightness` = 0.299 * `Specular`.Red<sup>2</sup> + 0.587 * `Specular`.Green<sup>2</sup> + 0.114 * `Specular`.Blue<sup>2</sup>
* `SpecularStrength` = max(`Specular`.Red, `Specular`.Green, `Specular`.Blue)

The SpecularIntensity formula is obtained from [here](https://en.wikipedia.org/wiki/Luma_(video)).
The brightness formula is described in this [specification](http://www.itu.int/dms_pubrec/itu-r/rec/bt/R-REC-BT.601-7-201103-I!!PDF-E.pdf).

### Roughness

`Roughness` is calculated from `Specular` and `ShininessExponent` using [this formula](https://www.cs.cornell.edu/~srm/publications/EGSR07-btdf.pdf). The formula is an approximation of roughness from the Phong specular exponent:

```cpp
Roughness = sqrt(2 / (ShininessExponent * SpecularIntensity + 2))
```

### Metalness

`Metalness` is calculated from `Diffuse` and `Specular` using this [formula from the glTF specification](https://github.com/bghgary/glTF/blob/gh-pages/convert-between-workflows-bjs/js/babylon.pbrUtilities.js).

The idea here is, that we solve the equation: Ax<sup>2</sup> + Bx + C = 0.
Basically, dielectric surfaces reflect around 4% of light in a specular way, and the rest is diffuse. Metallic surfaces reflect no light in a diffuse way, but all in a specular way.
This formula has a few drawbacks, because there's no way to distinguish between glossy plastic and glossy metallic surfaces. We assume most of the time the surface has metallic properties, and so glossy plastic/rubber surfaces may not look as expected.

```cpp
dielectricSpecularReflectance = 0.04
oneMinusSpecularStrength = 1 - SpecularStrength

A = dielectricSpecularReflectance
B = (DiffuseBrightness * (oneMinusSpecularStrength / (1 - A)) + SpecularBrightness) - 2 * A
C = A - SpecularBrightness
squareRoot = sqrt(max(0.0, B * B - 4 * A * C))
value = (-B + squareRoot) / (2 * A)
Metalness = clamp(value, 0.0, 1.0);
```

### Albedo

`Albedo` is computed from `Diffuse`, `Specular`, and `Metalness`.

As described in the Metalness section, dielectric surfaces reflect around 4% of light.  
The idea here is to linearly interpolate between `Dielectric` and `Metal` colors using `Metalness` value as a factor. If metalness is `0.0`, then depending on specular it will be either a dark color (if specular is high) or diffuse won't change (if no specular is present). If metalness is a large value, then the diffuse color will disappear in favor of specular color.

```cpp
dielectricSpecularReflectance = 0.04
oneMinusSpecularStrength = 1 - SpecularStrength

dielectricColor = diffuseColor * (oneMinusSpecularStrength / (1.0f - dielectricSpecularReflectance) / max(1e-4, 1.0 - metalness))
metalColor = (Specular - dielectricSpecularReflectance * (1.0 - metalness)) * (1.0 / max(1e-4, metalness))
albedoRawColor = lerpColors(dielectricColor, metalColor, metalness * metalness)
AlbedoRGB = clamp(albedoRawColor, 0.0, 1.0);
```

`AlbedoRGB` has been computed by the formula above, but the alpha channel requires more computations. The FBX format is vague about transparency and has many ways to define it. Different content tools use different methods. The idea here is to unify them into one formula. It makes some assets incorrectly rendered as transparent, though, if they aren't created in a common way.

This is computed from `TransparentColor`, `TransparencyFactor`, `Opacity`:

if `Opacity` is defined, then use it directly: `AlbedoAlpha` = `Opacity` else  
if `TransparencyColor` is defined, then `AlbedoAlpha` = 1.0 - ((`TransparentColor.Red` + `TransparentColor.Green` + `TransparentColor.Blue`) / 3.0) else  
if `TransparencyFactor`, then `AlbedoAlpha` = 1.0 - `TransparencyFactor`

The final `Albedo` color has four channels, combining the `AlbedoRGB` with the `AlbedoAlpha`.

### Summary

To summarize here, `Albedo` will be very close to the original `Diffuse`, if `Specular` is close to zero. Otherwise the surface will look like a metallic surface and loses the diffuse color. The surface will look more polished and reflective if `ShininessExponent` is large enough and `Specular` is bright. Otherwise the surface will look rough and barely reflect the environment.

### Known issues

* The current formula doesn't work well for simple colored geometry. If `Specular` is bright enough, then all geometries become reflective metallic surfaces without any color. The workaround in this case is to lower `Specular` to 30% from the original or to use the conversion setting [fbxAssumeMetallic](../how-tos/conversion/configure-model-conversion.md#conversion-from-earlier-fbx-formats-and-phong-material-models).
* PBR materials were recently added to `Maya` and `3DS Max` content creation tools. They use custom user-defined black-box properties to pass it to FBX. Azure Remote Rendering doesn't read those properties because they aren't documented and the format is closed-source.

## Next steps

* [Model conversion](../how-tos/conversion/model-conversion.md)
* [Overriding materials during model conversion](../how-tos/conversion/override-materials.md)
