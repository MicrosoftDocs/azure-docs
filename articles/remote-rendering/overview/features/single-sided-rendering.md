---
title: Single-sided rendering
description: Describes single-sided rendering settings and use cases
author: florianborn71
ms.author: flborn
ms.date: 02/06/2020
ms.topic: article
---

# :::no-loc text="Single-sided"::: rendering

Most renderers use [back-face culling](https://en.wikipedia.org/wiki/Back-face_culling) to improve performance. However when meshes are cut open with [cut planes](cut-planes.md), users will often look at the back side of triangles. If those triangles are culled away, the result does not look convincing.

The way to reliably prevent this problem, is to render triangles *double-sided*. As not using back-face culling has performance implications, by default Azure Remote Rendering only switches to double-sided rendering for meshes that are intersecting with a cut plane.

The *:::no-loc text="single-sided"::: rendering* setting allows you to customize this behavior.

> [!CAUTION]
> The :::no-loc text="single-sided"::: rendering setting is an experimental feature. It may get removed again in the future. Please don't change the default setting, unless it really solves a critical problem in your application.

## Prerequisites

The :::no-loc text="single-sided"::: rendering setting only has an effect for meshes that have been [converted](../../how-tos/conversion/configure-model-conversion.md) with the `opaqueMaterialDefaultSidedness` option set to `SingleSided`. By default this option is set to `DoubleSided`.

## :::no-loc text="Single-sided"::: rendering setting

There are three different modes:

**Normal:** In this mode, meshes are always rendered as they are converted. That means meshes converted with `opaqueMaterialDefaultSidedness` set to `SingleSided` will always get rendered with back-face culling enabled, even when they intersect a cut plane.

**DynamicDoubleSiding:** In this mode, when a cut plane intersects a mesh, it is automatically switched to double-sided rendering. This mode is the default mode.

**AlwaysDoubleSided:** Forces all single-sided geometry to be rendered double-sided at all times. This mode is mostly exposed so you can easily compare the performance impact between :::no-loc text="single-sided"::: and :::no-loc text="double-sided"::: rendering.

Changing the :::no-loc text="single-sided"::: rendering settings can be done as follows:

```cs
void ChangeSingleSidedRendering(AzureSession session)
{
    SingleSidedSettings settings = session.Actions.SingleSidedSettings;

    // Single-sided geometry is rendered as is
    settings.Mode = SingleSidedMode.Normal;

    // Single-sided geometry is always rendered double-sided
    settings.Mode = SingleSidedMode.AlwaysDoubleSided;
}
```

```cpp
void ChangeSingleSidedRendering(ApiHandle<AzureSession> session)
{
    ApiHandle<SingleSidedSettings> settings = *session->Actions()->SingleSidedSettings();

    // Single-sided geometry is rendered as is
    settings->Mode(SingleSidedMode::Normal);

    // Single-sided geometry is always rendered double-sided
    settings->Mode(SingleSidedMode::AlwaysDoubleSided);
}
```

## Next steps

* [Cut planes](cut-planes.md)
* [Configuring the model conversion](../../how-tos/conversion/configure-model-conversion.md)
