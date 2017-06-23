---
title: Azure Managed Application UserNameTextBox UI element | Microsoft Docs
description: Describes the Microsoft.Compute.UserNameTextBox UI element for Azure Managed Applications
services: azure-resource-manager
documentationcenter: na
author: tabrezm
manager: timlt
editor: tysonn

ms.service: azure-resource-manager
ms.devlang: na
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/12/2017
ms.author: tabrezm;tomfitz

---
# Microsoft.Compute.UserNameTextBox UI element
A text box control with built-in validation for Windows and Linux user names. You use this element when [creating an Azure Managed Application](managed-application-publishing.md).

## UI sample
![Microsoft.Compute.UserNameTextBox](./media/managed-application-elements/microsoft.compute.usernametextbox.png)

## Schema
```json
{
  "name": "element1",
  "type": "Microsoft.Compute.UserNameTextBox",
  "label": "User name",
  "defaultValue": "",
  "toolTip": "",
  "constraints": {
    "required": true,
    "regex": "^[a-z0-9A-Z]{1,30}$",
    "validationMessage": "Only alphanumeric characters are allowed, and the value must be 1-30 characters long."
  },
  "osPlatform": "Windows",
  "visible": true
}
```

## Remarks
- If `constraints.required` is set to **true**, then the text box must contain a
value to validate successfully. The default value is **true**.
- `osPlatform` must be specified, and can be either **Windows** or **Linux**.
- `constraints.regex` is a JavaScript regular expression pattern. If specified,
then the text box's value must match the pattern to validate successfully. The
default value is **null**.
- `constraints.validationMessage` is a string to display when the text box's
value fails the validation specified by `constraints.regex`. If not specified,
then the text box's built-in validation messages are used. The default value is
**null**.
- This element has built-in validation that is based on the value specified for `osPlatform`. The built-in validation can be used along with a custom regular expression.
If a value for `constraints.regex` is specified, then both the built-in and
custom validations are triggered.

## Sample output
```json
"tabrezm"
```

## Next steps
* For an introduction to managed applications, see [Azure Managed Application overview](managed-application-overview.md).
* For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](managed-application-createuidefinition-overview.md).
* For a description of common properties in UI elements, see [CreateUiDefinition elements](managed-application-createuidefinition-elements.md).
