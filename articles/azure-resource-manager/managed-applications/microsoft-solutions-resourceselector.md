---
title: ResourceSelector UI element
description: Describes the Microsoft.Common.ResourceSelector UI element for Azure portal. Used for getting a list of existing resources.
author: tfitzmac

ms.topic: conceptual
ms.date: 07/10/2020
ms.author: tomfitz

---

# Microsoft.Common.ResourceSelector UI element

A control that can be used to edit unformatted text.

## UI sample

![Microsoft.Common.ResourceSelector](./media/managed-application-elements/microsoft.solutions.resourceselector.png)

## Schema

```json
{
    "name": "storageSelector",
    "type": "Microsoft.Solutions.ResourceSelector",
    "label": "Select storage accounts",
    "resourceType": "Microsoft.Storage/storageAccounts",
    "options": {
        "filter": {
            "subscription": "onBasics",
            "location": "onBasics"
        }
    }
}
```

## Sample output

```json
"value": {
    "name": "{resource-name}",
    "id": "/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.Storage/storageAccounts/{resource-name}",
    "location": "centralus"
}
```

## Remarks


## Next steps

* For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md).
* For a description of common properties in UI elements, see [CreateUiDefinition elements](create-uidefinition-elements.md).
