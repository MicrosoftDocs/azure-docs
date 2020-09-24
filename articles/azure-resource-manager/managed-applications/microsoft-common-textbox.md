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

![Microsoft.Common.TextBox](./media/managed-application-elements/microsoft-common-textbox.png)

## Schema

```json
{
    "name": "nameInstance",
    "type": "Microsoft.Common.TextBox",
    "label": "Name",
    "defaultValue": "contoso123",
    "toolTip": "Use only allowed characters",
    "placeholder": "",
    "constraints": {
        "required": true,
        "validations": [
            {
                "regex": "^[a-z0-9A-Z]{1,30}$",
                "message": "Only alphanumeric characters are allowed, and the value must be 1-30 characters long."
            },
            {
                "isValid": "[startsWith(steps('resourceConfig').nameInstance, 'contoso')]",
                "message": "Must start with 'contoso'."
            }
        ]
    },
    "visible": true
}
```

## Sample output

```json
"contoso123"
```

## Remarks

- If `constraints.required` is set to **true**, then the text box must have a value to validate successfully. The default value is **false**.
- The `validations` property is an array where you add conditions for checking the value provided in the text box.
- The `regex` property is a JavaScript regular expression pattern. If specified, then the text box's value must match the pattern to validate successfully. The default value is **null**.
- The `isValid` property contains an expression that evaluates to true or false. Within the expression, you define the condition that determines whether the text box is valid.
- The `message` property is a string to display when the text box's value fails validation.
- It's possible to specify a value for `regex` when `required` is set to **false**. In this scenario, a value isn't required for the text box to validate successfully. If one is specified, it must match the regular expression pattern.
- The `placeholder` property is help text that disappears when the user begins editing. If the `placeholder` and `defaultValue` are both defined, the `defaultValue` takes precedence and is shown.

## Example

The following example uses a text box with the [Microsoft.Solutions.ArmApiControl](microsoft-solutions-armapicontrol.md) control to check the availability of a resource name.

```json
"basics": [
    {
        "name": "nameApi",
        "type": "Microsoft.Solutions.ArmApiControl",
        "request": {
            "method": "POST",
            "path": "[concat(subscription().id, '/providers/Microsoft.Storage/checkNameAvailability?api-version=2019-06-01')]",
            "body": "[parse(concat('{\"name\": \"', basics('txtStorageName'), '\", \"type\": \"Microsoft.Storage/storageAccounts\"}'))]"
        }
    },
    {
        "name": "txtStorageName",
        "type": "Microsoft.Common.TextBox",
        "label": "Storage account name",
        "constraints": {
            "validations": [
                {
                    "isValid": "[not(equals(basics('nameApi').nameAvailable, false))]",
                    "message": "[concat('Name unavailable: ', basics('txtStorageName'))]"
                }
            ]
        }
    }
]
```

## Next steps

* For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md).
* For a description of common properties in UI elements, see [CreateUiDefinition elements](create-uidefinition-elements.md).
