---
title: DropDown UI element
description: Describes the Microsoft.Common.DropDown UI element for Azure portal. Use to select from available options when deploying a managed application.
author: tfitzmac

ms.topic: conceptual
ms.date: 06/27/2018
ms.author: tomfitz

---

# Microsoft.Common.DropDown UI element

A selection control with a dropdown list.

## UI sample

![Microsoft.Common.DropDown](./media/managed-application-elements/microsoft.common.dropdown.png)

## Schema

```json
{
  "name": "element1",
  "type": "Microsoft.Common.DropDown",
  "label": "Example drop down",
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
- If specified, the default value must be a label present in `constraints.allowedValues`. If not specified, the first item in `constraints.allowedValues` is selected. The default value is **null**.
- `constraints.allowedValues` must have at least one item.
- To emulate a value not being required, add an item with a label and value of `""` (empty string) to `constraints.allowedValues`.

## Next steps

* For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md).
* For a description of common properties in UI elements, see [CreateUiDefinition elements](create-uidefinition-elements.md).
