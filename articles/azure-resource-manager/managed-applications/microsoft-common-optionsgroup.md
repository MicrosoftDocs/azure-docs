---
title: OptionsGroup UI element
description: Describes the Microsoft.Common.OptionsGroup UI element for Azure portal. Enables users to select from available options when deploying a managed application.
ms.topic: conceptual
ms.date: 07/09/2020
---

# Microsoft.Common.OptionsGroup UI element

The OptionsGroup control lets users select one option from two or more choices. A user can select only one option.

> [!NOTE]
> In the past, this control rendered the options horizontally. Now, the control presents the options vertically as radio buttons.

## UI sample

:::image type="content" source="./media/managed-application-elements/microsoft-common-optionsgroup-2.png" alt-text="Screenshot of Microsoft.Common.OptionsGroup UI element with vertically aligned radio buttons.":::

## Schema

```json
{
  "name": "element1",
  "type": "Microsoft.Common.OptionsGroup",
  "label": "Some options group",
  "defaultValue": "Value two",
  "toolTip": "",
  "constraints": {
    "allowedValues": [
      {
        "label": "Value one",
        "value": "one"
      },
      {
        "label": "Value two",
        "value": "two"
      }
    ],
    "required": true
  },
  "visible": true
}
```

## Sample output

```json
"two"
```

## Remarks

- The label for `constraints.allowedValues` is the display text for an item, and its value is the output value of the element when selected.
- If specified, the default value must be a label present in `constraints.allowedValues`. If not specified, the first item in `constraints.allowedValues` is selected by default. The default value is **null**.
- `constraints.allowedValues` must have at least one item.

## Next steps

* For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md).
* For a description of common properties in UI elements, see [CreateUiDefinition elements](create-uidefinition-elements.md).
