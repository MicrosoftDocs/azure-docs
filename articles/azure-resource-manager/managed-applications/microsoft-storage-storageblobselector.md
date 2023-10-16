---
title: StorageBlobSelector UI element
description: Describes the Microsoft.Storage.StorageBlobSelector UI element for Azure portal.
ms.topic: conceptual
ms.date: 10/27/2020
---

# Microsoft.Storage.StorageBlobSelector UI element

A control for selecting a blob from an Azure storage account.

## UI sample

The user is presented with the option to browse for available storage blobs.

:::image type="content" source="./media/managed-application-elements/microsoft-storage-storageblobselector-browse.png" alt-text="Microsoft.Storage.StorageBlobSelector - browse":::

After selecting **Browse**, the user can select a storage account.

:::image type="content" source="./media/managed-application-elements/microsoft-storage-storageblobselector-select.png" alt-text="Microsoft.Storage.StorageBlobSelector - select storage":::

The user sees the containers in the storage account and can select one.

:::image type="content" source="./media/managed-application-elements/microsoft-storage-storageblobselector-containers.png" alt-text="Microsoft.Storage.StorageBlobSelector - select container":::

From the container, the user can select a file.

:::image type="content" source="./media/managed-application-elements/microsoft-storage-storageblobselector-file.png" alt-text="Microsoft.Storage.StorageBlobSelector - file":::

The control is updated to display the selected file name.

:::image type="content" source="./media/managed-application-elements/microsoft-storage-storageblobselector-result.png" alt-text="Microsoft.Storage.StorageBlobSelector - show select file":::

## Schema

```json
{
  "name": "storageBlobSelection",
  "type": "Microsoft.Storage.StorageBlobSelector",
  "visible": true,
  "toolTip": "Select storage blob",
  "label": "Package (.zip, .cspkg)",
  "options": {
    "text": "Select Package"
  },
  "constraints": {
    "allowedFileExtensions": [ "zip", "cspkg" ]
  }
}
```

## Sample output

```json
{
  "blobName": "test.zip",
  "sasUri": "https://azstorageaccnt1.blob.core.windows.net/container1/test.zip?sp=r&se=2020-10-10T07:46:22Z&sv=2019-12-12&sr=b&sig=X4EL8ZsRmiP1TVxkVfTcGyMj2sHg1zCbFBXsDmnNOyg%3D"
}

```

## Remarks

The **constraints.allowedFileExtensions** property specifies the allowed file types.

## Next steps

* For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md).
* For a description of common properties in UI elements, see [CreateUiDefinition elements](create-uidefinition-elements.md).
