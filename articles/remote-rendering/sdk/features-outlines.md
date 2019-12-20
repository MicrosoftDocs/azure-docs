---
title: Outlines
description: Selection outline rendering - API and properties 
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: conceptual
ms.service: azure-remote-rendering
---
# Outlines

Selected objects can be highlighted visually by adding outline rendering. The global parameters for outline rendering can be changed through the client API. To make outlines more noticably, they can have an optional pulse effect. When the pulse effect is active the opacity of the outlines is modified at regular intervals.

Outline rendering of single objects is invoked through [`HierarchicalStateOverrideComponent`](../sdk/features-override-hierarchical-state.md).

## API usage

The global outline parameters may be changed via the client API by calling 

``` cs
RemoteRenderingClient.SetOutlineParams(UbColor color, float pulseRateHz, float pulseIntensity)
```

### Parameters for `SetOutlineParams`

| Parameter      | Type    | Description                                             | 
|----------------|---------|---------------------------------------------------------| 
| `color`          | ColorUb | The color that is used for drawing the outline. The alpha portion is ignored.         |
| `pulseRateHz`    | float   | The rate at which the outline pulses.|
| `pulseIntensity` | float   | The intensity of the outline pulse effect. Must be between 0.0 for no pulsing and 1.0 for full pulsing. Intensity directly sets the minimum opacity of the outline as `minOpacity = 1.0 - pulseIntensity`. |

![Outlines](./media/outlines.png) The effect of changing the `color` parameter from yellow (left) to magenta (center) and `pulseIntensity` from 0 to 0.8 (right).

### Example

The following code shows an example for setting outline parameters via the C++ API

``` cpp
void exampleOutlineParameters(RemoteRenderingClient& client)
{
    OutlineSettings* outlineSettings = client.AccessObjectDatabase().GetState<OutlineSettings>();

    if (outlineSettings != nullptr)
    {
        outlineSettings->SetColor(ColorUb(255, 255, 0, 255));
        outlineSettings->SetPulseRateHz(2.0f);
        outlineSettings->SetPulseIntensity(0.5f);
    }
}
```
The C# API can be used in a similar fashion:
``` cs
public void ExampleOutlineParameters()
{
    OutlineSettings outlineSettings = RemoteManager.GetOutlineSettings();
    
    try
    {
        outlineSettings.Color = new ColorUb(255, 255, 0, 255);
        outlineSettings.PulseRateHz = 2.0f;
        outlineSettings.PulseIntensity = 0.5f;
    }
    catch(RRException)
    {
        System.Console.WriteLine("Setting outline parameters failed!");
    }
}
```

## See also
* [`HierarchicalStateOverrideComponent`](../sdk/features-override-hierarchical-state.md)