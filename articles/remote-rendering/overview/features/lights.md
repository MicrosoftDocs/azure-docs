---
title: Lights
description: Light source description and properties
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
titleSuffix: Azure Remote Rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: conceptual
ms.service: azure-remote-rendering
---

# Lights

Lights can be added to the scene to change the lighting conditions of all remotely rendered geometry. By default the scene is only lit by a [global sky light](sky.md). Any new user allocated light is added on top of the base lighting. User lights are always considered as 'dynamic lights'. That is, they can dynamically change any property such as position, intensity, or color over time.

Lights are added to the scene as components of respective type attached to a game object. The game object serves as the spatial transform of the light source.

> [!NOTE]
> Lights only affect [PBR material types](../../concepts/materials.md#pbr-material), not [color materials](../../concepts/materials.md#color-material)

The way how PBR materials respond to lights is defined by the per material properties such as albedo color, roughness, or metalness.

## Light types

There are three distinct types of dynamic lights, represented by dedicated component classes that inherit from a common light component base class `LightComponent`. This base class cannot be instantiated directly but it provides properties that are common to all light types:

| Property      | Type    | Default | Description                                             |
|---------------|---------|---------|---------------------------------------------------------|
| `Color`       | Color4Ub | white   | The color of the light in linear color space. The alpha portion is ignored    |
| `Intensity`   | float   | 10.0    | The intensity of the light. This value has no physical measure however it can be considered to be proportional to the physical power of the light source. If the light has a fall-off (point and spotlight), this value also defines the maximum range of light influence. An intensity of 1000 roughly has a range of 100 world units, but note this does not scale linearly. |

### Point light

Point lights are represented by component `PointLightComponent`. A point light simulates light emitted equally in all directions form a point (or small sphere/tube) in space. Point light components can be used to create local light effects such as light from bulbs. In addition to the base class, the following properties are supported by point lights:

| Property      | Type    | Default | Description                                             |
|---------------|---------|---------|---------------------------------------------------------|
| `Radius`       | float  | 0.0     | If >0 the light emitting shape of the light source is a sphere of given radius as opposed to a point. This shape for instance affects the appearance of specular highlights |
| `Length`       | float  | 0.0     | If >0 (and also radius > 0) this value defines the length of a light emitting tube. Use case is a neon tube.  |
| `AttenuationCutoff` | float2 | (0,0) | Defines a custom interval of min/max distances over which the light's attenuated intensity is scaled linearly down to 0. This feature can be used to enforce a smaller range of influence of a specific light. If not defined (default), these values are implicitly derived from the light's intensity.   |
| `ProjectedCubemap`  | TextureId | Invalid  | In case a valid cubemap texture is passed here, the cubemap is projected using the orientation of the light. The cubemap's color is modulated with the light's color. |

### Spot light

Spot lights are represented by component `SpotLightComponent`. In contrast to a point light, the light is not emitted in all directions but instead constrained to the shape of a cone. The orientation of the cone is defined by the *owner object's negative z-axis*. Typical use cases for spotlights are flashlights.
In addition to the base class, the following properties are supported by spot lights:

| Property      | Type    | Default | Description                                             |
|---------------|---------|---------|---------------------------------------------------------|
| `Radius`       | float  | 0.0     | See point light |
| `SpotAngleDeg` | float2  | (25,35) | This interval defines the inner and outer angle of the spot light cone both measured in degree. Everything within the inner angle is illuminated by the full brightness of the spot light source and a falloff is applied towards the outer angle that generates a penumbra-like effect.|
| `FalloffExponent`       | float  | 1.0     | Defines the characteristic of the falloff between the inner and the outer cone angle. A higher value results in a sharper transition between inner and outer cone angle. The default of 1.0 defines a linear falloff.|
| `AttenuationCutoff` | float2 | (0,0) | See point light   |
| `Projected2dTexture`  | TextureId | Invalid  | In case a valid 2d texture is passed here, the texture is projected. The texture's color is modulated with the light's color. |

### Directional light

Directional lights are represented by component `DirectionalLightComponent`. A directional light simulates a light source that is infinitely far away. Accordingly, unlike point lights and spot lights, the position of a directional light is ignored. The direction of the parallel light rays is defined by the *negative z-axis of the owner object*. There are no additional directional light-specific properties.

## Unsupported features

* Casting shadows is not supported. Accordingly, lights cannot be blocked by solid walls etc. A use case where a directional light only falls through the windows of a building is not possible.
* Due to the nature of rendering dynamic lights in real-time, lights have no effect other than the direct lighting. Indirect lighting (radiosity) is not supported.
* Volumetric lighting effects are not supported.

## Performance considerations

Light sources have a significant implication on rendering performance so they should be used carefully and only if required by the application. Note that any static global lighting condition, including a static directional component, can be achieved with a [custom sky texture](sky.md) with no additional rendering cost associated.

## Next steps

* [Materials](../../concepts/materials.md)
* [Sky](sky.md)
