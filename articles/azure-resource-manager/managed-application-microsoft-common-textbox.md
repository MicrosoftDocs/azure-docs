---
title: Azure Managed Application TextBox UI element | Microsoft Docs
description: Describes the Microsoft.Common.TextBox UI element for Azure Managed Applications
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

# Microsoft.Common.TextBox UI element
A control that can be used to edit unformatted text. You use this element when [creating an Azure Managed Application](managed-application-publishing.md).

## UI sample
![Microsoft.Common.TextBox](./media/managed-application-elements/microsoft.common.textbox.png)

## Schema
```json
{
  "name": "element1",
  "type": "Microsoft.Common.TextBox",
  "label": "Some text box",
  "defaultValue": "foobar",
  "toolTip": "Halp!",
  "constraints": {
    "required": true,
    "regex": "^[a-z0-9A-Z]{1,30}$",
    "validationMessage": "Only alphanumeric characters are allowed, and the value must be 1-30 characters long."
  },
  "visible": true
}
```

## Remarks
- If `constraints.required` is set to **true**, then the text box must contain a
value to validate successfully. The default value is **false**.
- `constraints.regex` is a JavaScript regular expression pattern. If specified,
then the text box's value must match the pattern to validate successfully. The
default value is **null**.
- `constraints.validationMessage` is a string to display when the text box's
value fails validation. If not specified, then the text box's built-in
validation messages are used. The default value is **null**.
- It's possible to specify a value for `constraints.regex` when
`constraints.required` is set to **false**. In this scenario, a value is not required for the text box to validate successfully. If one is specified, it must match the regular expression pattern.

## Sample output

```json
"foobar"
```

## Next steps
* For an introduction to managed applications, see [Azure Managed Application overview](managed-application-overview.md).
* For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](managed-application-createuidefinition-overview.md).
* For a description of common properties in UI elements, see [CreateUiDefinition elements](managed-application-createuidefinition-elements.md).
