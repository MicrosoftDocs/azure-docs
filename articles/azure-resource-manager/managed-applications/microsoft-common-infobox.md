---
title: InfoBox UI element
description: Describes the Microsoft.Common.InfoBox UI element for Azure portal. Use to add text or warnings when deploying managed application.
ms.topic: conceptual
ms.date: 06/15/2018
---

# Microsoft.Common.InfoBox UI element

A control that adds an information box. The box contains important text or warnings that help users understand the values they're providing. It can also link to a URI for more information.

## UI sample

:::image type="content" source="./media/managed-application-elements/microsoft-common-infobox.png" alt-text="Screenshot of Microsoft.Common.InfoBox UI element displaying important text or warnings.":::


## Schema

```json
{
  "name": "text1",
  "type": "Microsoft.Common.InfoBox",
  "visible": true,
  "options": {
    "icon": "None",
    "text": "Nullam eros mi, mollis in sollicitudin non, tincidunt sed enim. Sed et felis metus, rhoncus ornare nibh. Ut at magna leo.",
    "uri": "https://www.microsoft.com"
  }
}
```

## Sample output

```json
"Nullam eros mi, mollis in sollicitudin non, tincidunt sed enim. Sed et felis metus, rhoncus ornare nibh. Ut at magna leo."
```

## Remarks

* For `icon`, use **None**, **Info**, **Warning**, or **Error**.
* The `uri` property is optional.

## Next steps

* For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md).
* For a description of common properties in UI elements, see [CreateUiDefinition elements](create-uidefinition-elements.md).
