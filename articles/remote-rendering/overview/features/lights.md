---
title: Scene lighting
description: Light source description and properties
author: florianborn71
ms.author: flborn
ms.date: 02/10/2020
ms.topic: article
---

# Scene lighting

By default the remotely rendered objects are lit using a [sky light](sky.md). For most applications this is already sufficient, but you can add further light sources to the scene.

> [!IMPORTANT]
> Only [PBR materials](pbr-materials.md) are affected by light sources. [Color materials](color-materials.md) always appear fully bright.

> [!NOTE]
> Casting shadows is currently not supported. Azure Remote Rendering is optimized to render huge amounts of geometry, utilizing multiple GPUs if necessary. Traditional approaches for shadow casting do not work well in such scenarios.

## Common light component properties

All light types derive from the abstract base class `LightComponent` and share these properties:

* **Color:** The color of the light in [Gamma space](https://en.wikipedia.org/wiki/SRGB). Alpha is ignored.

* **Intensity:** The brightness of the light. For point and spot lights, intensity also defines how far the light shines.

## Point light

In Azure Remote Rendering the `PointLightComponent` can not only emit light from a single point, but also from a small sphere or a small tube, to simulate softer light sources.

### PointLightComponent properties

* **Radius:** The default radius is zero, in which case the light acts as a point light. If the radius is larger than zero, it acts as spherical light source, which changes the appearance of specular highlights.

* **Length:** If both `Length` and `Radius` are non-zero, the light acts as a tube light. This can be used to simulate neon tubes.

* **AttenuationCutoff:** If left to (0,0) the attenuation of the light only depends on its `Intensity`. However, you can provide custom min/max distances over which the light's intensity is scaled linearly down to 0. This feature can be used to enforce a smaller range of influence of a specific light.

* **ProjectedCubemap:** If set to a valid [cubemap](../../concepts/textures.md), the texture is projected onto the light's surrounding geometry. The cubemap's color is modulated with the light's color.

## Spot light

The `SpotLightComponent` is similar to the `PointLightComponent` but the light is constrained to the shape of a cone. The orientation of the cone is defined by the *owner entity's negative z-axis*.

### SpotLightComponent properties

* **Radius:** Same as for the `PointLightComponent`.

* **SpotAngleDeg:** This interval defines the inner and outer angle of the cone, measured in degree. Everything within the inner angle is illuminated with full brightness. A falloff is applied towards the outer angle that generates a penumbra-like effect.

* **FalloffExponent:** Defines how sharply the falloff transitions between the inner and the outer cone angle. A higher value results in a sharper transition. The default of 1.0 results in a linear transition.

* **AttenuationCutoff:** Same as for the `PointLightComponent`.

* **Projected2dTexture:** If set to a valid [2D texture](../../concepts/textures.md), the image is projected onto geometry that the light shines at. The texture's color is modulated with the light's color.

## Directional light

The `DirectionalLightComponent` simulates a light source that is infinitely far away. The light shines into the direction of the *negative z-axis of the owner entity*. The entity's position is ignored.

There are no additional properties.

## Performance considerations

Light sources have a significant impact on rendering performance. Use them carefully and only if required by the application. Any static global lighting condition, including a static directional component, can be achieved with a [custom sky texture](sky.md), with no additional rendering cost.

## Next steps

* [Materials](../../concepts/materials.md)
* [Sky](sky.md)
