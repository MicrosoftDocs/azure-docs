---
title: Materials overview
description: Describes the material properties and workflow
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
titleSuffix: Azure Remote Rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: conceptual
ms.service: azure-remote-rendering
---

# Materials overview

A material is a set of properties of a surface, which defines how the surface will be visualized by the Renderer.
This article describes the properties of materials, and describes how they impact rendering.

Azure Remote Rendering works with two types of materials:
- `Physically Based Rendering` material (also known as `PBR`)
- `Basic Color` material (also known as `Unlit` material)
Both materials share a common set of properties called `Shared`.
Below you will find them explained in separate sections. Subsequent sections will provide the formulas and projections used in the conversion pipeline when converting FBX and glTF materials. 
Properties either have values of build-in types such as `bool`, `int`, `float`, or have values of compound types, which are described in the following section.

---

## Compound types of properties

- `Color` consist of a four float channels Red, Green, Blue, Alpha (`RGBA`) in range of from 0.0 to 1.0 inclusive. It also may define `RGB` values only, in which case the Alpha value will default to 1.0.
- `Vec` is a short for `Vector` and consist of multiple float values grouped together. For example, `Vec` could be `Vec2` for two values, `Vec3` and `Vec4` etc.
- `Texture` is a filename of a texture file. If it is `Texture2D` that means the file should be 2D texture file, or `TextureCube`, which means the file should be an environment type of texture. Each texture has a subproperty of type `int`, which defines the UV Channel used for it.
    > [!NOTE]
    > The renderer requires all texture files to be encoded in `DDS v10` format or higher. The conversion pipeline will convert most common image formats to the required format.
- `enum` is a one of a set of predefined named values, for instance `two` from the set of values `{one, two, three}`.

## Shared part of properties

These properties are common to both PBR and Basic Color materials.

`albedoColor` is the main `Color` of the surface. It has default value `Color{1.0, 1.0, 1.0, 1.0}`:
- The first three components are the color of the surface as `RGB` values.
- The last component, the `Alpha` channel, means how much a surface is transparent: 1.0 means fully opaque and 0.0 means fully transparent. The alpha property only works *if transparency is enabled in the material* (see below).
  - It is worth noticing here that even if a surface is fully transparent, it reflects bright environment like a sun etc., like clean glass.
  - The `albedoColor` property defines a constant color for all surfaces that use this material. However, a surface can additionally be given a texture, which defines the albedo color at any point. Albedo textures can be set via the `albedoMap` property, as described next. Other colors/maps (below) are defined analog.

`albedoMap` is a `Texture2D`, this is a texture filename, which defines `albedoColor` on per-pixel basis using texture coordinates to map this file into surface. Same as above if it has an `Alpha` channel then all rules apply to it as well.
> [!NOTE]
> If both `albedoMap` and `albedoColor` are defined, then the final color is a product of both values (per-pixel).

`alphaClipEnabled` is a `bool` and enables a special rendering mode where parts of a surface where the Alpha channel is lower than the `alphaClipThreshold` value will not be drawn. The default is `false`. 
Alpha clipping can be used even without enabling transparency and in this case it will perform much faster, almost the same as opaque mode.

`alphaClipThreshold` is a `float` and defines the threshold of visibility used by `alphaClipEnabled`. 
All pixels with alpha value less than the threshold are not visible and they do not contribute to the final image. The default is `0.5f`.

`textureCoordinateScale` is a `Vec2`. The two values are applied as multipliers to the UV texture coordinates **of the whole material**. The default is `Vec2{1.f, 1.f}`.

`textureCoordinateOffset` is a `Vec2`. The two values are applied as offsets to the UV texture coordinates **of the whole material**. The default is `Vec2{0.f, 0.f}`.

`useVertexColor` is a `bool` that enables/disables the use of vertex colors, if present in the mesh, with the current material. If true, the vertex color is combined with `albedoColor` and `albedoMap` to give the final color. The default is `false`.

`isDoubleSided` is a `bool`. It enables/disables double-sidedness of this material. The default is `false`.

## <span id="color-material">Basic color material (also known as unlit material)

In some situations, there is no need to have complex lighting and sometimes assets already have baked lighting (for instance photogrammetry models).
In situations such as these, you can define the material as a Basic color material.
Basic color materials have the additional benefit of having a better rendering performance characteristic.
Surfaces that use this material type don't receive any lighting, and they look exactly as defined in the `albedoColor` or `albedoMap` (and if `useVertexColor` is true, then also the vertex color).

This type of material is also for emulating fully emissive materials, such as a device's display, car's on-board computer, a light bulb, etc. Those materials will be lit up even in the dark.

Basic Color Materials inherit all options from the shared properties and also have some additional properties:

`vertexMix` is a `float` between `0.0` and `1.0`, inclusive. It defines how much the vertex color contributes to final color, where `0.0` means vertex color has no effect and `1.0` means fully applied. The default value is `1.0`.

`transparencyMode` is an `enum` whose possible values are `{Opaque, AlphaBlended, Additive}`.
The options are as follows:
1. `Opaque` mode is the default, and means that surfaces using this material will be opaque. Alpha values in albedo value, albedo maps and vertex colors are not used for transparency, but they can still contribute to the result if `alphaClipEnabled` is true (see above) or if they have been pre-multiplied.
2. `AlphaBlended` mode is the slowest mode. It combines the already rendered pixels on the screen with the current surface.
The formula used is: `NewPixel = Pixel * (1 - Alpha) + Surface * Alpha`, where `Pixel` is pixel on the screen, which was filled up by previous surfaces, `Surface` is a color of current surface and `Alpha` is value of Alpha channel of current surface. 
(The renderer can optimize this calculation, by pre-multiplying the alpha values by the surface colors.)

   AlphaBlended mode requires transparent surfaces to be drawn on the screen in a particular order. Fortunately, Azure Remote Rendering has additional feature as `Order Independent Transparency`, which makes possible to render complex semi-transparent object without sorting them.

3. `Additive` mode is similar to AlphaBlended, but uses a simpler formula to combine the values: `NewPixel = Pixel + Surface * Alpha`. As above, alpha value could be pre-multiplied. This mode doesn't require additional sorting because of commutative law (`A + B = B + A`).

## <span id="pbr-material">Physically based rendering material (also known as PBR)

As the name suggests, this material type uses a close-to-real-world model of light and on-surface light distribution.  
Physically based rendering materials work equally well in all lighting environments, so values of properties can be set up independently from any environment/conditions and lighting. Additionally, a PBR material's properties are mostly independent, providing an intuitive way to define a surface's properties.
Many modern game engines and content creation tools support PBR materials because they are considered the best approximation of real world scenarios for real-time use-cases.

The core idea is to use `BaseColor`, `Metalness`, and `Roughness` properties to emulate a wide range of real-world materials.

> [!NOTE]
> PBR materials are not universal solution. For instance, there are materials that reflect different color depends on the viewing angle. For example, some fabrics or car paints. These kinds of materials are not handled by the standard PBR model, and are not supported by Azure Remote Rendering. (This includes PBR extensions, for example, Thin-Film (multi-layered surface) and Clear-Coat (for car paint).)

> [!NOTE]
> An alternative to the `Metalness-Roughness` PBR model used in Azure Remote Rendering is the `Specular-Glossiness` PBR model. This can represent a broader range of materials. However, it is more expensive, and usually it does not work well for real-time cases.
> Be aware that it is not always possible to convert from Specular-Glossiness to Metalness-Roughness as there are pairs of values of (Diffuse, Specular) that cannot be converted to (BaseColor, Metalness). The conversion in the other direction simpler and more precise, since all (BaseColor, Metalness) pairs correspond to a well defined (Diffuse, Specular).

We use Cook-Torrance microfacet BRDF with GGX NDF, Schlick Fresnel and GGX Smith correlated visibility term with Lambert diffuse term. Basically, this model is the de facto industry standard at the moment. For more in-depth details, refer for instance to this external article  [Physically based Rendering - Cook Torrance](http://www.codinglabs.net/article_physically_based_rendering_cook_torrance.aspx).

Here is a helmet from the [glTF Sample Models](https://github.com/KhronosGroup/glTF-Sample-Models/tree/master/2.0/DamagedHelmet), rendered by Azure Remote Rendering in real time.

![Helmet](media/helmet.png)

### BaseColor (the same as AlbedoColor)

The `Base (or Albedo)` color is the pure color of an object, without lighting applied.
Albedo color can be distinguished from another commonly used term, the `Diffuse` color, which is both color as well as shaded with some diffuse lighting.
For instance, if you light up white wall by green light the diffuse color of the wall will be green while albedo color will still be white.

> [!NOTE]
> Since Albedo is a shared property between different types of materials, we use the term Albedo and not Base color.

Albedo color, texture, and other related properties are set up in the shared part (see above section)

### Roughness

This property defines how rough or smooth the surface is. Rough surfaces scatter the light in more directions than smooth surfaces, which make reflections blurry rather than sharp. The value range is from `0.0` to `1.0`. When `roughness` equals `0.0`, reflections will be sharp. When `roughness` equals `0.5`, reflections will become more blurry. With `1.0`, there will be almost no reflection.

Properties affecting roughness are:
- `roughness` is a `float`, with default value `0.75`.
- `roughnessMap` is a `Texture2D`, with default is `None`.
> If both values are defined then the final `roughness` will be a product of those values.

### Metalness

In physics, this property corresponds to whether a surface is Conductive or Dielectric. Conductive materials have different reflective properties, and they tend to be reflective with no albedo color. In PBR materials, this property affects how much a surface reflects the surrounding environment. Value range from `0.0` to `1.0`. When metalness is `0.0`, the albedo color is fully visible and the material looks like plastic or ceramics. When metalness is `0.5`, it looks like painted metal. When metalness is `1.0`, the surface almost completely looses its albedo color and only reflects surroundings. For instance, if `metalness` is `1.0` and `roughness` is `0.0` then a surface looks like real-world mirror.

- `metalness` is a `float` with default value `0.0`.
- `metalnessMap` is a `Texture2D`. The default is `None`.
- If both values are defined, then final `metalness` will be a product of those values.

![metalness and roughness](./media/metalness-roughness.png)
As you can see on the picture, bottom-right corner looks like a material that is fully metal, bottom-left is ceramic/plastic material. An albedo color here is changing as well to follow physical properties. With increasing roughness the material loses reflection sharpness.

### Normal Map

Real world surfaces have "infinite detail" at each level of zoom, but that's not possible in real-time rendering. To emulate high frequency surface detail, a commonly used technique is Normal maps.
The normal of the surface within a triangle can be varied, by referencing a texture, giving a relief to the surface.

> [!NOTE]
> A related concept is known as Bump mapping, but a bump map defines a height displacement for each pixel, rather than a normal.

- `normalMap` is a `Texture2D`. The default is `None`.
- If a map is not defined then the effect is disabled.

### Occlusion Map

Imagine a car staying in the garage, the floor under the car will always be occluded from lights and will be darker than walls and the car itself. This part of the floor is mostly `occluded` from light and human eyes catch this effect immediately, informing our understanding of relative objects positions. This also possible on the micro-level, where surfaces can have cracks from which light is occluded. Occlusion can make surface looks more realistic. The Value range is from `0.0` to `1.0`, where `0.0` means darkness (occluded) and `1.0` means no occlusions (the default value).

- `occlusionMap` is a `Texture2D`. The default is `None`.
- `aoScale` is a `float` with default value `1.0`, which is multiplier for occlusion map.
- If map is not defined, then occlusion is not enabled.

![Occlusion Map](./media/boom-box-ao2.gif)

### Transparency

- `transparent` is a `bool` with default value `false`. When enabled, a more complex pipeline for the material is invoked to draw semi-transparent (see-through) surfaces. Transparency is typically used for windows/glasses or similar materials. The final (combined) value of the Alpha channel of the albedo color will indicate how transparent the surface is. `0.0` means fully transparent but reflect bright environments, and `1.0` means fully opaque. Setting `transparent` to `true` means with Alpha values of 1.0 just means that performance is lost.

Transparent geometry is expensive for the renderer and it is important to minimize the usage to the minimum possible. For instance, if you only need holes in the surface it would be better to use `alphaClipEnable` with `alphaClipThreshold` properties, which are not that expensive and provide "cutting-holes" functionality. Alpha clipping works well for leaves of trees, for instance.

 ![Transparency](./media/transparency.png)
 Notice here the right-most sphere is fully transparent but the reflection is still visible.

> [!NOTE]
> If any material is supposed to be switched from opaque to transparent during runtime, the renderer must be initialized in **TileBasedComposition** mode as described in the [rendering modes](../../concepts/rendering-modes.md) chapter. This limitation does not apply to materials that are converted as transparent materials from source data.

## Projections from other well-known formats

The Azure Remote Rendering asset pipeline supports glTF 1.0 and 2.0 and FBX 2011 and higher formats as input sources. During conversion, material names are reused. However, if a material's name is empty then a name will be autogenerated with a number suffix to make all material names unique.
If one wants to refer a material in the scene, it needs to have proper unique name.

### GlTF material projection into Azure remote rendering material

Almost everything from glTF 2.0 spec is supported in Azure remote rendering Material except EmissiveFactor/Texture.

The following table shows the mapping:

| glTF | Azure remote rendering |
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
|   alphaCutoff       |   alphaClipThreshold       |
|   alphaMode.OPAQUE  |   alphaClipEnabled = false, isTransparent = false |
|   alphaMode.MASK    |   alphaClipEnabled = true, isTransparent = false  |
|   alphaMode.BLEND   |   isTransparent = true     |
|   doubleSided       |   isDoubleSided            |
|   emissiveFactor    |   -                        |
|   emissiveTexture   |   -                        |

Each texture in glTF can have a `texCoord` value, which is also supported in the Azure remote rendering material.
Textures embedded in `.bin` or `.glb` files are also supported.

#### Supported extension
- [MSFT_packing_occlusionRoughnessMetallic](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Vendor/MSFT_packing_occlusionRoughnessMetallic/README.md) packed into R, G, and B channels
- [MSFT_texture_dds](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Vendor/MSFT_texture_dds/README.md) textures could be in DDS format
- [KHR_materials_unlit](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_materials_unlit/README.md) corresponds to Azure remote rendering BasicColor material, for `Emissive` materials it's recommended to use this extension.
- [KHR_materials_pbrSpecularGlossiness](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_materials_pbrSpecularGlossiness/README.md) instead of metallic-roughness textures material could provide diffuse-specular-glossiness textures, follow the link to find out about formulas of conversion. The Azure remote rendering implementation directly follows those formulas.

### FBX material projection into Azure remote rendering material

An FBX format is closed-source format and the FBX material are not compatible with PBR materials in general. It uses complex description of a surface with many unique parameters and properties and **not all of them are used by Azure Remote Rendering assets pipeline**.

> [!NOTE]
> Azure Remote Rendering assets pipeline supports only FBX 2011 and higher.

An FBX format defines a conservative approach for materials, there are only two types of them mentioned in official FBX specification:
- `Lambert` - not commonly used for quite some time already, but it is still supported by converting to Phong at conversion time.
- `Phong` - almost all materials and most content tools use this type.

For `Lambert` materials, the illumination calculation is performed at each vertex, and the resulting color is interpolated across the face of the polygon. (Gouraud shading; (generalized) Lambert illumination model.)

For `Phong` materials, vertex normals are interpolated across the surface of the polygon, and the illumination calculation is performed at each pixel. (Phong shading; (generalized) Phong illumination model.)

Clearly, a Phong model is more accurate and it is used as *only* model for FBX materials. Below it will be referred as FBX Material.

> Maya uses two custom extensions for FBX by defining custom properties for PBR and Stingray types of a material, it's not included in FBX specification so it's not supported by Azure remote rendering currently.

FBX Material uses Diffuse-Specular-SpecularLevel concept, so to convert from a Diffuse texture to an Albedo Map we need to calculate the other parameters to subtract them from diffuse.

> All colors and textures in FBX are in sRGB space (also known as Gamma space) but Azure remote rendering works with Linear space during visualization and at the end of the frame converts everything back to sRGB space. The Azure remote rendering asset pipeline converts everything to Linear space to send it as prepared data for visualization module.

This table shows how textures are mapped from FBX Materials to Azure remote rendering materials. Some of them are not directly used but in combination with other textures participating in the formulas (for instance Diffuse texture)

| FBX | Azure remote rendering |
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

**The mapping above is the most complex part of the material processor in Azure remote rendering due to many assumptions were used for projection. Let's talk about each of them in order.**

First of all definitions used below:
* `Specular` =  `SpecularColor` * `SpecularFactor`
* `SpecularIntensity` = `Specular`.Red ∗ 0.2125 +  `Specular`.Green ∗ 0.7154 + `Specular`.Blue ∗ 0.0721
* `DiffuseBrightness` = 0.299 * `Diffuse`.Red<sup>2</sup> + 0.587 * `Diffuse`.Green<sup>2</sup> + 0.114 * `Diffuse`.Blue<sup>2</sup>
* `SpecularBrightness` = 0.299 * `Specular`.Red<sup>2</sup> + 0.587 * `Specular`.Green<sup>2</sup> + 0.114 * `Specular`.Blue<sup>2</sup>
* `SpecularStrength` = max(`Specular`.Red, `Specular`.Green, `Specular`.Blue)

> The SpecularIntensity formula is obtained from this [Wikipedia](https://en.wikipedia.org/wiki/Luma_(video)).
> The brightness formula is described in this [link](http://www.itu.int/dms_pubrec/itu-r/rec/bt/R-REC-BT.601-7-201103-I!!PDF-E.pdf).

### Roughness

`Roughness` is calculated from `Specular` and `ShininessExponent` using this [Formula](https://www.cs.cornell.edu/~srm/publications/EGSR07-btdf.pdf). The formula is an approximation of roughness from Phong specular exponent:
```Cpp
Roughness = sqrt(2 / (ShininessExponent * SpecularIntensity + 2))
```

### Metalness

`Metalness` is calculated from `Diffuse` and `Specular` using this [formula from the glTF specification](https://github.com/bghgary/glTF/blob/gh-pages/convert-between-workflows-bjs/js/babylon.pbrUtilities.js):

The idea here that we solve the equation: Ax<sup>2</sup> + Bx + C = 0.
Basically, dielectric surfaces reflect around 4% of light in a specular way, and the rest is diffuse way. Metallic surfaces reflect no light diffused, but all specular.  
This formula has a few drawbacks, because there is no way to distinguish between glossy plastic and glossy metallic surfaces. We assume most of the time the surface has metallic properties, and consequently glossy plastic/rubber surfaces may not look as expected.
```Cpp
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

`Albedo` is computed from `Diffuse`, `Specular` and `Metalness`.

As described in the Metalness section, dielectric surfaces reflect around 4% of light.  
The idea here is to linearly interpolate between `Dielectric` and `Metal` colors using `Metalness` value as a factor. If metalness is `0.0`, then depending on specular it will be either dark color (if specular is high) or diffuse will not change (if no specular present). If metalness is a large value, then the diffuse color will disappear in favor of specular color.
```Cpp
dielectricSpecularReflectance = 0.04
oneMinusSpecularStrength = 1 - SpecularStrength

dielectricColor = diffuseColor * (oneMinusSpecularStrength / (1.0f - dielectricSpecularReflectance) / max(1e-4, 1.0 - metalness))
metalColor = (Specular - dielectricSpecularReflectance * (1.0 - metalness)) * (1.0 / max(1e-4, metalness))
albedoRawColor = lerpColors(dielectricColor, metalColor, metalness * metalness)
AlbedoRGB = clamp(albedoRawColor, 0.0, 1.0);
```

`AlbedoRGB` has been computed by the formula above, but the alpha channel is another story, it requires additional computations. The hard part here is that the FBX format is vague about transparency and it has many ways to define it. Different content tools use different ways. The idea here is to unify them into one "formula". It makes some assets incorrectly shown as transparent if they are not created in a common way.

This is computed from `TransparentColor`, `TransparencyFactor`, `Opacity`:

---
if `Opacity` is defined then use it directly `AlbedoAlpha` = `Opacity` else  
if `TransparencyColor` is defined then `AlbedoAlpha` = 1.0 - ((`TransparentColor`.Red + `TransparentColor`.Green + `TransparentColor`.Blue) / 3.0) else  
if `TransparencyFactor` then `AlbedoAlpha` = 1.0 - `TransparencyFactor`

---

The final `Albedo` color is four channels, combining the `AlbedoRGB` with the `AlbedoAlpha`.

### Summary

To summarize here, `Albedo` will be very close to original `Diffuse` if `Specular` is close to zero. Otherwise the surface will look like metallic surface and loses the diffuse color. The surface will look more polished and reflective if `ShinninessExponent` is large enough and `Specular` is bright. Otherwise the surface will look rough and barely reflect environment.

### Known issues

* The current formula does not work well for simple colored geometry. If `Specular` is bright enough, then all geometries become reflective metallic surfaces without any color. The workaround here is to lower `Specular` to 30% from original.
* PBR materials were recently added to `Maya` and `3DS Max` content creation tools, it uses a custom user-defined black-box properties to pass it to FBX. Azure remote rendering does not read those additional properties because they are not documented and the format is closed-source.
