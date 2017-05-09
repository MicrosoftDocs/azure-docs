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
ms.date: 05/09/2017
ms.author: tabrezm;tomfitz

---
# Microsoft.Storage.StorageAccountSelector UI element
A control for selecting a new or existing storage account.

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
- If specified, `defaultValue.name` will be validated for uniqueness
automatically. If the storage account name is not unique, then the user will be
required to specify a different name or choose an existing storage account.
- The default value for `defaultValue.type` is `Premium_LRS`.
- Any type not specified in `constraints.allowedTypes` will be hidden, and any
type not specified in `constraints.excludedTypes` will be shown.
`constraints.allowedTypes` and `constraints.excludedTypes` are both optional,
but cannot be used simultaneously.
- If `options.hideExisting` is `true`, then the user won't be able to choose an
existing storage account. The default value is `false`.


## Output
```json
{
  "name": "storageaccount01",
  "resourceGroup": "rg01",
  "type": "Premium_LRS",
  "newOrExisting": "new"
}
```

## Next Steps
* For an introduction to Azure Resource Manager, see [Azure Resource Manager overview](resource-group-overview.md).
