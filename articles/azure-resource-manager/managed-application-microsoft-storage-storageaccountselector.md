---
title: Azure Managed Application StorageAccountSelector UI element | Microsoft Docs
description: Describes the Microsoft.Storage.StorageAccountSelector UI element for Azure Managed Applications
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
# Microsoft.Storage.StorageAccountSelector UI element
A control for selecting a new or existing storage account. You use this element when [creating an Azure Managed Application](managed-application-publishing.md).

## UI sample
![Microsoft.Storage.StorageAccountSelector](./media/managed-application-elements/microsoft.storage.storageaccountselector.png)

## Schema
```json
{
  "name": "element1",
  "type": "Microsoft.Storage.StorageAccountSelector",
  "label": "Storage account",
  "toolTip": "",
  "defaultValue": {
    "name": "storageaccount01",
    "type": "Premium_LRS"
  },
  "constraints": {
    "allowedTypes": [],
    "excludedTypes": []
  },
  "options": {
    "hideExisting": false
  },
  "visible": true
}
```

## Remarks
- If specified, `defaultValue.name` is automatically validated for uniqueness. If the storage account name is not unique, the user must specify a different name or choose an existing storage account.
- The default value for `defaultValue.type` is **Premium_LRS**.
- Any type not specified in `constraints.allowedTypes` is hidden, and any
type not specified in `constraints.excludedTypes` is shown.
`constraints.allowedTypes` and `constraints.excludedTypes` are both optional,
but cannot be used simultaneously.
- If `options.hideExisting` is **true**, the user can't choose an
existing storage account. The default value is **false**.


## Sample output
```json
{
  "name": "storageaccount01",
  "resourceGroup": "rg01",
  "type": "Premium_LRS",
  "newOrExisting": "new"
}
```

## Next steps
* For an introduction to managed applications, see [Azure Managed Application overview](managed-application-overview.md).
* For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](managed-application-createuidefinition-overview.md).
* For a description of common properties in UI elements, see [CreateUiDefinition elements](managed-application-createuidefinition-elements.md).
