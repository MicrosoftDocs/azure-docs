---
title: TextBlock UI element
description: Describes the Microsoft.Common.TextBlock UI element for Azure portal. Use to add text to the interface.
author: tfitzmac

ms.topic: conceptual
ms.date: 06/27/2018
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
    "text": "Please provide the configuration values for your application.",
    "link": {
      "label": "Learn more",
      "uri": "https://www.microsoft.com"
    }
  }
}
```

## Sample output

```json
"Please provide the configuration values for your application. Learn more"
```

## Next steps

* For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md).
* For a description of common properties in UI elements, see [CreateUiDefinition elements](create-uidefinition-elements.md).
