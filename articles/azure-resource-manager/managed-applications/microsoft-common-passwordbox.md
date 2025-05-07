---
title: PasswordBox UI element
description: Describes the Microsoft.Common.PasswordBox UI element for Azure portal. Enables users to provide a secret value when deploying managed applications.
ms.topic: reference
ms.date: 06/21/2024
---

# Microsoft.Common.PasswordBox UI element

A control that can be used to provide and confirm a password.

## UI sample

:::image type="content" source="./media/managed-application-elements/microsoft-common-passwordbox.png" alt-text="Screenshot of Microsoft.Common.PasswordBox UI element.":::

## Schema

```json
{
  "name": "element1",
  "type": "Microsoft.Common.PasswordBox",
  "label": {
    "password": "Password",
    "confirmPassword": "Confirm password"
  },
  "toolTip": "",
  "constraints": {
    "required": true,
    "regex": "^[a-zA-Z0-9]{8,}$",
    "validationMessage": "Password must be at least 8 characters long, contain only numbers and letters"
  },
  "options": {
    "hideConfirmation": false
  },
  "visible": true
}
```

## Sample output

```json
"p4ssw0rd"
```

## Remarks

- This element doesn't support the `defaultValue` property.
- For implementation details of `constraints`, see [Microsoft.Common.TextBox](microsoft-common-textbox.md).
- If `options.hideConfirmation` is set to `true`, the second text box for confirming the user's password is hidden. The default value is `false`.

## Next steps

* For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md).
* For a description of common properties in UI elements, see [CreateUiDefinition elements](create-uidefinition-elements.md).
