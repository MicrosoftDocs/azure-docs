---
title: TextBox UI element
description: Describes the Microsoft.Common.TextBox UI element for Azure portal that's used for adding unformatted text.
ms.topic: conceptual
ms.date: 08/23/2022
---

# Microsoft.Common.TextBox UI element

The `TextBox` user-interface (UI) element can be used to add unformatted text. The element is a single-line input field, but supports multi-line input with the `multiLine` property.

## UI sample

The `TextBox` element uses a single-line or multi-line text box.

Example of single-line text box.

:::image type="content" source="media/managed-application-elements/microsoft-common-textbox.png" alt-text="Screenshot of a single-line text box using the Microsoft.Common.TextBox UI element.":::

Example of multi-line text box.

:::image type="content" source="media/managed-application-elements/microsoft-common-textbox-multi-line.png" alt-text="Screenshot of a multi-line text box using the Microsoft.Common.TextBox UI element.":::

## Schema

```json
{
  "name": "nameInstance",
  "type": "Microsoft.Common.TextBox",
  "label": "Name",
  "defaultValue": "contoso123",
  "toolTip": "Use only allowed characters",
  "placeholder": "",
  "multiLine": false,
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

- Use the `toolTip` property to display text about the element when the mouse cursor is hovered over the information symbol.
- The `placeholder` property is help text that disappears when the user begins editing. If the `placeholder` and `defaultValue` are both defined, the `defaultValue` takes precedence and is shown.
- The `multiLine` property is boolean, `true` or `false`. To use a multi-line text box, set the property to `true`. If a multi-line text-box isn't needed, set the property to `false` or exclude the property. For new lines, JSON output shows `\n` for the line feed. The multi-line text box accepts `\r` for a carriage return (CR) and `\n` for a line feed (LF). For example, a default value can include `\r\n` to specify CRLF.
- If `constraints.required` is set to `true`, then the text box must have a value to validate successfully. The default value is `false`.
- The `validations` property is an array where you add conditions for checking the value provided in the text box.
- The `regex` property is a JavaScript regular expression pattern. If specified, the text box's value must match the pattern to validate successfully. The default value is `null`. For more information about regex syntax, see [Regular expression quick reference](/dotnet/standard/base-types/regular-expression-language-quick-reference).
- The `isValid` property contains an expression that evaluates to `true` or `false`. Within the expression, you define the condition that determines whether the text box is valid.
- The `message` property is a string to display when the text box's value fails validation.
- It's possible to specify a value for `regex` when `required` is set to `false`. In this scenario, a value isn't required for the text box to validate successfully. If one is specified, it must match the regular expression pattern.

## Examples

The examples show how to use a single-line text box and a multi-line text box.

### Single-line

The following example uses a text box with the [Microsoft.Solutions.ArmApiControl](microsoft-solutions-armapicontrol.md) control to check the availability of a resource name.

In this example, when you enter a storage account name and exit the text box, the control checks if the name is valid and if it's available. If the name is invalid or already exists, an error message is displayed. A storage account name that's valid and available is shown in the output.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.CreateUIDef",
  "version": "0.1.2-preview",
  "parameters": {
    "basics": [
      {
        "name": "nameApi",
        "type": "Microsoft.Solutions.ArmApiControl",
        "request": {
          "method": "POST",
          "path": "[concat(subscription().id, '/providers/Microsoft.Storage/checkNameAvailability?api-version=2021-09-01')]",
          "body": {
            "name": "[basics('txtStorageName')]",
            "type": "Microsoft.Storage/storageAccounts"
          }
        }
      },
      {
        "name": "txtStorageName",
        "type": "Microsoft.Common.TextBox",
        "label": "Storage account name",
        "constraints": {
          "validations": [
            {
              "isValid": "[basics('nameApi').nameAvailable]",
              "message": "[basics('nameApi').message]"
            }
          ]
        }
      }
    ],
    "steps": [],
    "outputs": {
      "textBox": "[basics('txtStorageName')]"
    }
  }
}
```

### Multi-line

This example uses the `multiLine` property to create a multi-line text box with placeholder text.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.CreateUIDef",
  "version": "0.1.2-preview",
  "parameters": {
    "basics": [
      {
        "name": "demoTextBox",
        "type": "Microsoft.Common.TextBox",
        "label": "Multi-line text box",
        "defaultValue": "",
        "toolTip": "Use 1-60 alphanumeric characters, hyphens, spaces, periods, and colons.",
        "placeholder": "This is a multi-line text box:\nLine 1.\nLine 2.\nLine 3.",
        "multiLine": true,
        "constraints": {
          "required": true,
          "validations": [
            {
              "regex": "^[a-z0-9A-Z -.:\n]{1,60}$",
              "message": "Only 1-60 alphanumeric characters, hyphens, spaces, periods, and colons are allowed."
            }
          ]
        },
        "visible": true
      }
    ],
    "steps": [],
    "outputs": {
      "textBox": "[basics('demoTextBox')]"
    }
  }
}
```

## Next steps

- For an introduction to creating UI definitions, see [CreateUiDefinition.json for Azure managed application's create experience](create-uidefinition-overview.md).
- For a description of common properties in UI elements, see [CreateUiDefinition elements](create-uidefinition-elements.md).
- To learn more about functions, see [CreateUiDefinition functions](create-uidefinition-functions.md).
