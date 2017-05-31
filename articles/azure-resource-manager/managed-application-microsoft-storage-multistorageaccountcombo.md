---
title: Azure Managed Application MultiStorageAccountCombo UI element | Microsoft Docs
description: Describes the Microsoft.Storage.MultiStorageAccountCombo UI element for Azure Managed Applications
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
# Microsoft.Storage.MultiStorageAccountCombo UI element
A group of controls for creating multiple storage accounts, with names that start with a common prefix. You use this element when [creating an Azure Managed Application](managed-application-publishing.md).

## UI sample
![Microsoft.Storage.MultiStorageAccountCombo](./media/managed-application-elements/microsoft.storage.multistorageaccountcombo.png)

## Schema
```json
{
  "name": "element1",
  "type": "Microsoft.Storage.MultiStorageAccountCombo",
  "label": {
    "prefix": "Storage account prefix",
    "type": "Storage account type"
  },
  "toolTip": {
    "prefix": "",
    "type": ""
  },
  "defaultValue": {
    "prefix": "sa",
    "type": "Premium_LRS"
  },
  "constraints": {
    "allowedTypes": [],
    "excludedTypes": []
  },
  "count": 2,
  "visible": true
}
```

## Remarks
- The value for `defaultValue.prefix` is concatenated with one or more integers
to generate the sequence of storage account names. For example, if
`defaultValue.prefix` is **foobar** and `count` is **2**, then storage account names
**foobar1** and **foobar2** are generated. Generated storage account names are
validated for uniqueness automatically.
- The storage account names are generated lexicographically based on
`count`. For example, if `count` is 10, then the storage account names end
with 2-digit integers (01, 02, 03, etc.).
- The default value for `defaultValue.prefix` is **null**, and for
`defaultValue.type` is **Premium_LRS**.
- Any type not specified in `constraints.allowedTypes` is hidden, and any
type not specified in `constraints.excludedTypes` is shown.
`constraints.allowedTypes` and `constraints.excludedTypes` are both optional,
but cannot be used simultaneously.
- In addition to generating storage account names, `count` is used to set the
appropriate multiplier for the element. It supports a static value, like **2**, or
a dynamic value from another element, like
`[steps('step1').storageAccountCount]`. The default value is **1**.

## Sample output
```json
{
  "prefix": "sa",
  "count": 2,
  "resourceGroup": "rg01",
  "type": "Premium_LRS"
}
```

## Next steps
* For an introduction to managed applications, see [Azure Managed Application overview](managed-application-overview.md).
* For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](managed-application-createuidefinition-overview.md).
* For a description of common properties in UI elements, see [CreateUiDefinition elements](managed-application-createuidefinition-elements.md).
