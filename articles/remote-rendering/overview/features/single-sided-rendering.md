---
title: Single sided rendering
description: Single sided rendering settings and use cases
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
titleSuffix: Azure Remote Rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: conceptual
ms.service: azure-remote-rendering
---

# Single sided rendering

> [!WARNING]
> Single sided rendering settings are experimental.

The single sided rendering settings allow for a tradeoff between single-sided rendering, which generally gives better performance than double sided, and quality of scenes sliced by [cut planes](cut-planes.md).

## Prerequisites

To be able to make use of the single sided rendering settings, models need to be converted with the `opaqueMaterialDefaultSidedness` setting set to `SingleSided`. See [Configuring the model conversion](../../how-tos/conversion/configure-model-conversion.md) for further information.

## Features

The API provides three rendering modes for single-sided geometry:

* `Normal`: render model as is, that is, single sided
* `DynamicDoubleSiding` (default): Use heuristic to determine if double-sided rendering is needed
* `AlwaysDoubleSided`: Force single-sided geometry to be rendered double sided

The general heuristic employed for `DynamicDoubleSiding` is assuming a mesh part only needs to be rendered double sided if it is sliced by a cut plane, opening an otherwise assumed closed surface topology. While this does not require the geometry to be watertight (which allows vertex splits for hard normal discontinuities, etc.) it requires the model to contain topologically connected surfaces in the same mesh part, which might not be the case. For respective models, double siding may be forced to give the desired quality by either importing them with `opaqueMaterialDefaultSidedness` set to `DoubleSided` during ingestion or use the `AlwaysDoubleSided` rendering mode provided by the new API.

## API usage

The `SingleSidedSettings` state provides the necessary object to change the settings. These settings affect rendering globally, that is, every loaded and rendered model and cannot be toggled for individual models or subparts in a model.

### Example calls

Changing the single sided rendering settings can be done as follows:

``` cs
public void exampleSingleSidedRendering(AzureSession session)
{
    SingleSidedSettings settings = session.Actions.GetSingleSidedSettings();

    // Single sided geometry is rendered as is
    settings.Mode = SingleSidedMode.Normal;

    // Single sided geometry is always rendered double sided
    settings.Mode = SingleSidedMode.AlwaysDoubleSided;
}
```
