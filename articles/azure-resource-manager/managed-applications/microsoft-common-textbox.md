---
title: TextBox UI element
description: Describes the Microsoft.Common.TextBox UI element for Azure portal. Use for adding unformatted text.
author: tfitzmac

ms.topic: conceptual
ms.date: 06/27/2018
ms.author: tomfitz

---

# Microsoft.Common.TextBox UI element

A control that can be used to edit unformatted text.

## UI sample

![Microsoft.Common.TextBox](./media/managed-application-elements/microsoft.common.textbox.png)

## Schema

```json
{
  "name": "element1",
  "type": "Microsoft.Common.TextBox",
  "label": "Example text box 1",
  "defaultValue": "my text value",
  "toolTip": "Use only allowed characters",
  "constraints": {
    "required": true,
    "regex": "^[a-z0-9A-Z]{1,30}$",
    "validationMessage": "Only alphanumeric characters are allowed, and the value must be 1-30 characters long."
  },
  "visible": true
}
```

## Sample output

```json
"my text value"
```

## Remarks

- If `constraints.required` is set to **true**, then the text box must have a value to validate successfully. The default value is **false**.
- `constraints.regex` is a JavaScript regular expression pattern. If specified, then the text box's value must match the pattern to validate successfully. The default value is **null**.
- `constraints.validationMessage` is a string to display when the text box's value fails validation. If not specified, then the text box's built-in validation messages are used. The default value is **null**.
- It's possible to specify a value for `constraints.regex` when `constraints.required` is set to **false**. In this scenario, a value isn't required for the text box to validate successfully. If one is specified, it must match the regular expression pattern.

## Next steps

* For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md).
* For a description of common properties in UI elements, see [CreateUiDefinition elements](create-uidefinition-elements.md).
