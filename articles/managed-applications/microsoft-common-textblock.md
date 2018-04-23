---
title: Azure TextBlock UI element | Microsoft Docs
description: Describes the Microsoft.Common.TextBlock UI element for Azure portal.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: tysonn

ms.service: azure-resource-manager
ms.devlang: na
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/23/2018
ms.author: tomfitz

---

# Microsoft.Common.TextBlock UI element
A control that can be used to add text to the portal interface.

## UI sample
![Microsoft.Common.TextBox](./media/managed-application-elements/microsoft.common.textblock.png)

## Schema
```json
{
  "name": "text1",
  "type": "Microsoft.Common.TextBlock",
  "visible": true,
  "options": {
    "text": "Look! Arbitrary text in templates!",
    "link": {
      "label": "Learn more",
      "uri": "https://www.microsoft.com"
    }
  }
}
```

## Sample output

```json
"Look! Arbitrary text in templates! Learn more"
```

## Next steps
* For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md).
* For a description of common properties in UI elements, see [CreateUiDefinition elements](create-uidefinition-elements.md).
