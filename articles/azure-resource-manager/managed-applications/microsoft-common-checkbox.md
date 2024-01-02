---
title: CheckBox UI element
description: Describes the Microsoft.Common.CheckBox UI element for Azure portal. Enables users to select to check or uncheck an option.
ms.topic: conceptual
ms.date: 07/09/2020
---

# Microsoft.Common.CheckBox UI element

The CheckBox control lets users check or uncheck an option. The control returns **true** when the control is checked or **false** when not checked.

## UI sample

:::image type="content" source="./media/managed-application-elements/microsoft-common-checkbox.png" alt-text="Screenshot of Microsoft.Common.CheckBox UI element with an unchecked state.":::

## Schema

```json
{
    "name": "legalAccept",
    "type": "Microsoft.Common.CheckBox",
    "label": "I agree to the terms and conditions.",
    "constraints": {
        "required": true,
        "validationMessage": "Please acknowledge the legal conditions."
    }
}
```

## Sample output

```json
true
```

## Remarks

When you set **required** to **true**, the user must select the checkbox. If the user doesn't select the checkbox, the validation message is displayed.

## Next steps

* For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md).
* For a description of common properties in UI elements, see [CreateUiDefinition elements](create-uidefinition-elements.md).
