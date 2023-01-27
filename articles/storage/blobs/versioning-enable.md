---
title: Enable and manage blob versioning
titleSuffix: Azure Storage
description: Learn how to enable blob versioning in the Azure portal or by using an Azure Resource Manager template.
services: storage
author: normesta

ms.service: storage
ms.topic: how-to
ms.date: 01/25/2023
ms.author: normesta
ms.subservice: blobs
ms.custom: devx-track-azurepowershell, devx-track-azurecli, engagement-fy23
---

# Enable and manage blob versioning

You can enable Blob storage versioning to automatically maintain previous versions of a blob when it is modified or deleted. When blob versioning is enabled, then you can restore an earlier version of a blob to recover your data if it is erroneously modified or deleted.

This article shows how to enable or disable blob versioning for the storage account by using the Azure portal or an Azure Resource Manager template. To learn more about blob versioning, see [Blob versioning](versioning-overview.md).

## Enable blob versioning

You can enable blob versioning with the Azure portal, PowerShell, Azure CLI, or an Azure Resource Manager template.

# [Azure portal](#tab/portal)

To enable blob versioning for a storage account in the Azure portal:

1. Navigate to your storage account in the portal.
1. Under **Blob service**, choose **Data protection**.
1. In the **Versioning** section, select **Enabled**.

    :::image type="content" source="media/versioning-enable/portal-enable-versioning.png" alt-text="Screenshot showing how to enable blob versioning in Azure portal":::

# [PowerShell](#tab/powershell)

To enable blob versioning for a storage account with PowerShell, first install the [Az.Storage](https://www.powershellgallery.com/packages/Az.Storage) module version 2.3.0 or later. Then call the [Update-AzStorageBlobServiceProperty](/powershell/module/az.storage/update-azstorageblobserviceproperty) command to enable versioning, as shown in the following example. Remember to replace the values in angle brackets with your own values:

```powershell
# Set resource group and account variables.
$rgName = "<resource-group>"
$accountName = "<storage-account>"

# Enable versioning.
Update-AzStorageBlobServiceProperty -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -IsVersioningEnabled $true
```

# [Azure CLI](#tab/azure-cli)

To enable blob versioning for a storage account with Azure CLI, first install the Azure CLI version 2.2.0 or later. Then call the [az storage account blob-service-properties update](/cli/azure/storage/account/blob-service-properties#az-storage-account-blob-service-properties-update) command to enable versioning, as shown in the following example. Remember to replace the values in angle brackets with your own values:

```azurecli
az storage account blob-service-properties update \
    --resource-group <resource_group> \
    --account-name <storage-account> \
    --enable-versioning true
```

# [Template](#tab/template)

To enable blob versioning with a template, create a template with the **IsVersioningEnabled** property to **true**. The following steps describe how to create a template in the Azure portal.

1. In the Azure portal, choose **Create a resource**.
1. In **Search the Marketplace**, type **template deployment**, and then press **ENTER**.
1. Choose **Template deployment**, choose **Create**, and then choose **Build your own template in the editor**.
1. In the template editor, paste in the following JSON. Replace the `<accountName>` placeholder with the name of your storage account.
1. Save the template.
1. Specify the resource group of the account, and then choose the **Purchase** button to deploy the template and enable blob versioning.

    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {},
        "variables": {},
        "resources": [
            {
                "type": "Microsoft.Storage/storageAccounts/blobServices",
                "apiVersion": "2019-06-01",
                "name": "<accountName>/default",
                "properties": {
                    "IsVersioningEnabled": true
                }
            }
        ]
    }
    ```

For more information about deploying resources with templates in the Azure portal, see [Deploy resources with Azure portal](../../azure-resource-manager/templates/deploy-portal.md).

---

## List blob versions

To display a blob's versions, use the Azure portal, PowerShell, or Azure CLI. You can also list a blob's versions using one of the Blob Storage SDKs.

# [Azure portal](#tab/portal)

To list a blob's versions in the Azure portal:

1. Navigate to your storage account in the portal, then navigate to the container that contains your blob.
1. Select the blob for which you want to list versions.
1. Select the **Versions** tab to display the blob's versions.

    :::image type="content" source="media/versioning-enable/portal-list-blob-versions.png" alt-text="Screenshot showing how to list blob versions in the Azure portal":::

# [PowerShell](#tab/powershell)

To list a blob's versions with PowerShell, call the [Get-AzStorageBlob](/powershell/module/az.storage/get-azstorageblob) command with the `-IncludeVersion` parameter:

```azurepowershell
$account = Get-AzStorageAccount -ResourceGroupName <resource-group> -Name <storage-account>
$ctx = $account.Context
$container = "<container-name>"

$blobs = Get-AzStorageBlob -Container $container -Prefix "ab" -IncludeVersion -Context $ctx

foreach($blob in $blobs)
{
    Write-Host $blob.Name
    Write-Host $blob.VersionId
    Write-Host $blob.IsLatestVersion
}
```

# [Azure CLI](#tab/azure-cli)

To list a blob's versions with Azure CLI, call the [az storage blob directory list](/cli/azure/storage/blob/directory#az-storage-blob-directory-list) command with the `--include v` parameter:

```azurecli
storageAccount="<storage-account>"
containerName="<container-name>"

az storage blob list \
    --container-name $containerName \
    --prefix "ab" \
    --query "[[].name, [].versionId]" \
    --account-name $storageAccount \
    --include v \
    --auth-mode login \
    --output tsv 
```

# [Template](#tab/template)

N/A

---

## Modify a blob to trigger a new version

The following code example shows how to trigger the creation of a new version with the Azure Storage client library for .NET, version [12.5.1](https://www.nuget.org/packages/Azure.Storage.Blobs/12.5.1) or later. Before running this example, make sure you have enabled versioning for your storage account.

The example creates a block blob, and then updates the blob's metadata. Updating the blob's metadata triggers the creation of a new version. The example retrieves the initial version and the current version, and shows that only the current version includes the metadata.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CRUD.cs" id="Snippet_UpdateVersionedBlobMetadata":::

## List blob versions with .NET

To list blob versions or snapshots with the .NET v12 client library, specify the [BlobStates](/dotnet/api/azure.storage.blobs.models.blobstates) parameter with the **Version** field.

The following code example shows how to list blobs version with the Azure Storage client library for .NET, version [12.5.1](https://www.nuget.org/packages/Azure.Storage.Blobs/12.5.1) or later. Before running this example, make sure you have enabled versioning for your storage account.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CRUD.cs" id="Snippet_ListBlobVersions":::

## Next steps

- [Blob versioning](versioning-overview.md)
- [Soft delete for Azure Storage blobs](./soft-delete-blob-overview.md)
