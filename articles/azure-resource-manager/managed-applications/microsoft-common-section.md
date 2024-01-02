---
title: Section UI element
description: Describes the Microsoft.Common.Section UI element for Azure portal. Use to group elements in the portal for deploying managed applications.
ms.topic: conceptual
ms.date: 06/27/2018
---

# Microsoft.Common.Section UI element

A control that groups one or more elements under a heading.

## UI sample

:::image type="content" source="./media/managed-application-elements/microsoft-common-section.png" alt-text="Screenshot of Microsoft.Common.Section UI element with a heading and grouped elements.":::

## Schema

```json
{
  "name": "section1",
  "type": "Microsoft.Common.Section",
  "label": "Example section",
  "elements": [
    {
      "name": "text1",
      "type": "Microsoft.Common.TextBox",
      "label": "Example text box 1"
    },
    {
      "name": "text2",
      "type": "Microsoft.Common.TextBox",
      "label": "Example text box 2"
    }
  ],
  "visible": true
}
```

## Remarks

- `elements` must have at least one element, and can have all element types except `Microsoft.Common.Section`.
- This element doesn't support the `toolTip` property.

## Sample output
To access the output values of elements in `elements`, use the [basics()](create-ui-definition-referencing-functions.md#basics) or [steps()](create-ui-definition-referencing-functions.md#steps) functions and dot notation:

```json
steps('configuration').section1.text1
```

Elements of type `Microsoft.Common.Section` have no output values themselves.

## Next steps

* For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md).
* For a description of common properties in UI elements, see [CreateUiDefinition elements](create-uidefinition-elements.md).
