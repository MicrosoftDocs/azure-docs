---
title: StorageAccountSelector UI element
description: Describes the Microsoft.Storage.StorageAccountSelector UI element for Azure portal.
ms.topic: conceptual
ms.date: 03/17/2023
---

# Microsoft.Storage.StorageAccountSelector UI element

A control that's used to select a new or existing storage account.

Storage account names must be globally unique across Azure with a length of 3-24 characters, and include only lowercase letters or numbers.

## UI sample

The `StorageAccountSelector` control shows the default name for a storage account. The default is set in your code.

:::image type="content" source="./media/managed-application-elements/microsoft-storage-storageaccountselector.png" alt-text="Screenshot of the storage account selector element that shows the default value for a new storage account.":::

The `StorageAccountSelector` control allows you to create a new storage account or select an existing storage account.

:::image type="content" source="./media/managed-application-elements/microsoft-storage-storageaccountselector-new.png" alt-text="Screenshot that shows the storage account selector options to create a new storage account.":::

## Schema

```json
{
  "name": "element1",
  "type": "Microsoft.Storage.StorageAccountSelector",
  "label": "Storage account selector",
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

## Sample output

```json
{
  "name": "storageaccount01",
  "resourceGroup": "demoRG",
  "type": "Standard_LRS",
  "newOrExisting": "new",
  "kind": "StorageV2"
}
```

## Remarks

- The `defaultValue.name` is required and the value is automatically validated for uniqueness. If the storage account name isn't unique, the user must specify a different name or choose an existing storage account.
- The default value for `defaultValue.type` is **Premium_LRS**. You can set any storage account type as the default value. For example, _Standard_LRS_ or _Standard_GRS_.
- Any type not specified in `constraints.allowedTypes` is hidden, and any type not specified in `constraints.excludedTypes` is shown. `constraints.allowedTypes` and `constraints.excludedTypes` are both optional, but can't be used simultaneously.
- If `options.hideExisting` is **true**, the user can't choose an existing storage account. The default value is **false**. The control only shows storage accounts as _existing_ if they are in same resource group and region as the selections made on the **Basics** tab.
- The `kind` property displays the value if a new storage account was created, or an existing storage account's value.

## Example

The default values for the storage account name and type are examples. You can set your own default values for your environment.

In the `outputs` section, the `storageSelector` output includes all the values for a storage account. The `storageKind` and `storageName` are examples of how to output specific values.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.CreateUIDef",
  "version": "0.1.2-preview",
  "parameters": {
    "basics": [
      {}
    ],
    "steps": [
      {
        "name": "StorageAccountSelector",
        "label": "Storage account selector",
        "elements": [
          {
            "name": "storageSelectorElement",
            "type": "Microsoft.Storage.StorageAccountSelector",
            "label": "Storage account name",
            "toolTip": "",
            "defaultValue": {
              "name": "storageaccount01",
              "type": "Premium_LRS"
            },
            "options": {
              "hideExisting": false
            },
            "visible": true
          }
        ]
      }
    ],
    "outputs": {
      "location": "[location()]",
      "storageSelector": "[steps('StorageAccountSelector').storageSelectorElement]",
      "storageKind": "[steps('StorageAccountSelector').storageSelectorElement.kind]",
      "storageName": "[steps('StorageAccountSelector').storageSelectorElement.name]"
    }
  }
}
```

## Example output

The output for a _new_ storage account.

```json
{
  "location": {
    "value": "westus3"
  },
  "storageSelector": {
    "value": {
      "name": "demostorageaccount01",
      "resourceGroup": "demoRG",
      "type": "Standard_GRS",
      "newOrExisting": "new",
      "kind": "StorageV2"
    }
  },
  "storageKind": {
    "value": "StorageV2"
  },
  "storageName": {
    "value": "demostorageaccount01"
  }
}
```

The output for an _existing_ storage account.

```json
{
  "location": {
    "value": "westus3"
  },
  "storageSelector": {
    "value": {
      "name": "demostorage99",
      "resourceGroup": "demoRG",
      "type": "Standard_LRS",
      "newOrExisting": "existing",
      "kind": "StorageV2"
    }
  },
  "storageKind": {
    "value": "StorageV2"
  },
  "storageName": {
    "value": "demostorage99"
  }
}
```

## Next steps
- For an introduction to creating UI definitions, go to [CreateUiDefinition.json for Azure managed application's create experience](create-uidefinition-overview.md).
- For a description of common properties in UI elements, go to [CreateUiDefinition elements](create-uidefinition-elements.md).
