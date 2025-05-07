---
title: TextBlock UI element
description: Describes the Microsoft.Common.TextBlock UI element for Azure portal. Use to add text to the interface.
ms.topic: reference
ms.date: 06/24/2024
---

# Microsoft.Common.TextBlock UI element

A control that can be used to add text to the portal interface.

## UI sample

:::image type="content" source="./media/managed-application-elements/microsoft-common-textblock.png" alt-text="Screenshot of Microsoft.Common.TextBlock UI element in a portal interface.":::

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

- For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md).
- For a description of common properties in UI elements, see [CreateUiDefinition elements](create-uidefinition-elements.md).
