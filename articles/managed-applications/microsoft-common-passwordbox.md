---
title: Azure PasswordBox UI element | Microsoft Docs
description: Describes the Microsoft.Common.PasswordBox UI element for Azure portal.
services: managed-applications
documentationcenter: na
author: tfitzmac
manager: timlt
editor: tysonn

ms.service: managed-applications
ms.devlang: na
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/27/2018
ms.author: tomfitz

---
# Microsoft.Common.PasswordBox UI element
A control that can be used to provide and confirm a password.

## UI sample
![Microsoft.Common.PasswordBox](./media/managed-application-elements/microsoft.common.passwordbox.png)

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
    "regex": "",
    "validationMessage": ""
  },
  "options": {
    "hideConfirmation": false
  },
  "visible": true
}
```

## Remarks
- This element doesn't support the `defaultValue` property.
- For implementation details of `constraints`, see [Microsoft.Common.TextBox](microsoft-common-textbox.md).
- If `options.hideConfirmation` is set to **true**, the second text box for confirming the user's password is hidden. The default value is **false**.

## Sample output
```json
"p4ssw0rd"
```

## Next steps
* For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md).
* For a description of common properties in UI elements, see [CreateUiDefinition elements](create-uidefinition-elements.md).
