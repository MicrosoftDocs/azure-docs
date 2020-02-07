---
title: Outlines
description: Explains how to do selection outline rendering
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
titleSuffix: Azure Remote Rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: conceptual
ms.service: azure-remote-rendering
---

# Outlines

Selected objects can be highlighted visually by adding outline rendering via the [Hierarchical state override component](../../overview/features/override-hierarchical-state.md). This chapter explains how global parameters for outline rendering are changed through the client API.

Outline properties are a global setting. All objects that use outline rendering will use the same setting - it is not possible to use a per-object outline color.

## Parameters for `OutlineSettings`

Class `OutlineSettings` holds the settings related to global outline properties. It exposes the following members:

| Parameter      | Type    | Description                                             |
|----------------|---------|---------------------------------------------------------|
| `Color`          | Color4Ub | The color that is used for drawing the outline. The alpha portion is ignored.         |
| `PulseRateHz`    | float   | The rate at which the outline oscillates per second|
| `PulseIntensity` | float   | The intensity of the outline pulse effect. Must be between 0.0 for no pulsing and 1.0 for full pulsing. Intensity implicitly sets the minimum opacity of the outline as `MinOpacity = 1.0 - PulseIntensity`. |

![Outlines](./media/outlines.png) The effect of changing the `color` parameter from yellow (left) to magenta (center) and `pulseIntensity` from 0 to 0.8 (right).

## Example

The following code shows an example for setting outline parameters via the API:

``` cs
void SetOutlineParameters(AzureSession session)
{
    OutlineSettings outlineSettings = session.Actions.OutlineSettings;
    outlineSettings.Color = new Color4Ub(255, 255, 0, 255);
    outlineSettings.PulseRateHz = 2.0f;
    outlineSettings.PulseIntensity = 0.5f;
}
```

## Performance

Outline rendering has a significant impact on rendering performance. This impact scales with the number of outline objects and also depends on the scene's depth complexity: Since the object's outline should be visible for occluded objects, the renderer needs to render those objects regardless of whether they are occluded or not. Bypassing the occlusion test makes rendering less efficient.

## Next steps

* [Hierarchical state override component](../../overview/features/override-hierarchical-state.md)
