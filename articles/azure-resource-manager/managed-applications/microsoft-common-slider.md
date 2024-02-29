---
title: Slider UI element
description: Describes the Microsoft.Common.Slider UI element for Azure portal. Enables users to set a value from a range of options.
ms.topic: conceptual
ms.date: 07/10/2020
---

# Microsoft.Common.Slider UI element

The Slider control lets users select from a range of allowed values.

## UI sample

:::image type="content" source="./media/managed-application-elements/microsoft-common-slider.png" alt-text="Screenshot of Microsoft.Common.Slider UI element with a range of allowed values.":::

## Schema

```json
{
    "name": "memorySize",
    "type": "Microsoft.Common.Slider",
    "min": 1,
    "max": 64,
    "label": "Memory",
    "subLabel": "MB",
    "defaultValue": 24,
    "showStepMarkers": false,
    "toolTip": "Pick the size in MB",
    "constraints": {
        "required": false
    },
    "visible": true
}
```

## Sample output

```json
26
```

## Remarks

- The `min` and `max` values are required. They set the start and end points for the slider.
- The `showStepMarkers` property defaults to true. The step markers are only shown when the range from min to max is 100 or less.


## Next steps

* For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md).
* For a description of common properties in UI elements, see [CreateUiDefinition elements](create-uidefinition-elements.md).
