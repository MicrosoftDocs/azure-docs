---
title: Azure Managed Application Section UI element | Microsoft Docs
description: Describes the Microsoft.Common.Section UI element for Azure Managed Applications
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
ms.date: 05/09/2017
ms.author: tabrezm;tomfitz

---
# Microsoft.Common.Section UI element
A control that groups one or more elements under a heading.

## UI sample
![Microsoft.Common.Section](./media/managed-application-elements/microsoft.common.section.png)

## Schema
```json
{
  "name": "section1",
  "type": "Microsoft.Common.Section",
  "label": "Some section",
  "elements": [
    {
      "name": "element1",
      "type": "Microsoft.Common.TextBox",
      "label": "Some text box 1"
    },
    {
      "name": "element2",
      "type": "Microsoft.Common.TextBox",
      "label": "Some text box 2"
    }
  ],
  "visible": true
}
```

## Remarks
- `elements` must contain at least one element, and can contain all element
types except `Microsoft.Common.Section`.
- This element doesn't support the `toolTip` property.

## Output
To access the output values of elements in `elements`, use the `basics()` or
`steps()` functions and dot notation:
```
basics('section1').element1
```
Elements of type `Microsoft.Common.Section` have no output values themselves.

## Next Steps
* For an introduction to Azure Resource Manager, see [Azure Resource Manager overview](resource-group-overview.md).
