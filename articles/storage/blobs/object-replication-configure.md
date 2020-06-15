---
title: Configure object replication (preview)
titleSuffix: Azure Storage
description: Learn how to configure object replication to asynchronously copy block blobs from a container in one storage account to another.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 05/28/2020
ms.author: tamram
ms.subservice: blobs
---

# Configure object replication for block blobs (preview)

Object replication (preview) asynchronously copies block blobs between a source storage account and a destination account. For more information about object replication, see [Object replication (preview)](object-replication-overview.md).

When you configure object replication, you create a replication policy that specifies the source storage account and the destination account. A replication policy includes one or more rules that specify a source container and a destination container and indicate which block blobs in the source container will be replicated.

This article describes how to configure object replication for your storage account by using the Azure portal, PowerShell, or Azure CLI. You can also use one of the Azure Storage resource provider client libraries to configure object replication.

## Create a replication policy and rules

Before you configure object replication, create the source and destination storage accounts if they do not already exist. Both accounts must be general-purpose v2 storage accounts. For more information, see [Create an Azure Storage account](../common/storage-account-create.md).

Also, make sure that you have registered for the following feature previews:

- [Object replication (preview)](object-replication-overview.md)
- [Blob versioning (preview)](versioning-overview.md)
- [Change feed support in Azure Blob Storage (Preview)](storage-blob-change-feed.md)

# [Azure portal](#tab/portal)

Before you configure object replication in the Azure portal, create the source and destination containers in their respective storage accounts, if they do not already exist. Also, enabled blob versioning and change feed on the source account, and enable blob versioning on the destination account.

To create a replication policy in the Azure portal, follow these steps:

1. Navigate to the source storage account in the Azure portal.
1. Under **Settings**, select **Object replication**.
1. Select **Set up replication**.
1. Select the destination subscription and storage account.
1. In the **Container pairs** section, select a source container from the source account, and a destination container from the destination account. You can create up to 10 container pairs per replication policy.

    The following image shows a set of replication rules.

    :::image type="content" source="media/object-replication-configure/configure-replication-policy.png" alt-text="Screenshot showing replication rules in Azure portal":::

1. If desired, specify one or more filters to copy only blobs that match a prefix pattern. For example, if you specify a prefix `b`, only blobs whose name begin with that letter are replicated. You can specify a virtual directory as part of the prefix.

    The following image shows filters that restrict which blobs are copied as part of a replication rule.

    :::image type="content" source="media/object-replication-configure/configure-replication-copy-prefix.png" alt-text="Screenshot showing filters for a replication rule":::

1. By default, the copy scope is set to copy only new objects. To copy all objects in the container or to copy objects starting from a custom date and time, select the **change** link and configure the copy scope for the container pair.

    The following image shows a custom copy scope.

    :::image type="content" source="media/object-replication-configure/configure-replication-copy-scope.png" alt-text="Screenshot showing custom copy scope for object replication":::

1. Select **Save and apply** to create the replication policy and start replicating data.

# [PowerShell](#tab/powershell)

To create a replication policy with PowerShell, first install version [2.0.1-preview](https://www.powershellgallery.com/packages/Az.Storage/2.0.1-preview) of the Az.Storage PowerShell module. Follow these steps to install the preview module:

1. Uninstall any previous installations of Azure PowerShell from Windows using the **Apps & features** setting under **Settings**.

1. Make sure that you have the latest version of PowerShellGet installed. Open a Windows PowerShell window, and run the following command to install the latest version:

    ```powershell
    Install-Module PowerShellGet –Repository PSGallery –Force
    ```

    Close and reopen the PowerShell window after installing PowerShellGet.

1. Install the latest version of Azure PowerShell:

    ```powershell
    Install-Module Az –Repository PSGallery –AllowClobber
    ```

1. Install the Az.Storage preview module:

    ```powershell
    Install-Module Az.Storage -Repository PSGallery -RequiredVersion 2.0.1-preview -AllowPrerelease -AllowClobber -Force
    ```

For more information about installing Azure PowerShell, see [Install Azure PowerShell with PowerShellGet](/powershell/azure/install-az-ps).

The following example shows how to create a replication policy on the source and destination accounts. Remember to replace values in angle brackets with your own values:

```powershell
# Sign in to your Azure account.
Connect-AzAccount

# Set variables.
$rgName = "<resource-group>"
$srcAccountName = "<source-storage-account>"
$destAccountName = "<destination-storage-account>"
$srcContainerName1 = "source-container1"
$destContainerName1 = "dest-container1"
$srcContainerName2 = "source-container2"
$destContainerName2 = "dest-container2"

# Enable blob versioning and change feed on the source account.
Update-AzStorageBlobServiceProperty -ResourceGroupName $rgname `
    -StorageAccountName $srcAccountName `
    -EnableChangeFeed $true `
    -IsVersioningEnabled $true

# Enable blob versioning on the destination account.
Update-AzStorageBlobServiceProperty -ResourceGroupName $rgname `
    -StorageAccountName $destAccountName `
    -IsVersioningEnabled $true

# List the service properties for both accounts.
Get-AzStorageBlobServiceProperty -ResourceGroupName $rgname `
    -StorageAccountName $srcAccountName
Get-AzStorageBlobServiceProperty -ResourceGroupName $rgname `
    -StorageAccountName $destAccountName

# Create containers in the source and destination accounts.
Get-AzStorageAccount -ResourceGroupName $rgname -StorageAccountName $srcAccountName |
    New-AzStorageContainer $srcContainerName1
Get-AzStorageAccount -ResourceGroupName $rgname -StorageAccountName $destAccountName |
    New-AzStorageContainer $destContainerName1
Get-AzStorageAccount -ResourceGroupName $rgname -StorageAccountName $srcAccountName |
    New-AzStorageContainer $srcContainerName2
Get-AzStorageAccount -ResourceGroupName $rgname -StorageAccountName $destAccountName |
    New-AzStorageContainer $destContainerName2

# Define replication rules for each container.
$rule1 = New-AzStorageObjectReplicationPolicyRule -SourceContainer $srcContainerName1 `
    -DestinationContainer $destContainerName1 `
    -PrefixMatch b
$rule2 = New-AzStorageObjectReplicationPolicyRule -SourceContainer $srcContainerName2 `
    -DestinationContainer $destContainerName2  `
    -MinCreationTime 2020-05-10T00:00:00Z

# Create the replication policy on the destination account.
$destPolicy = Set-AzStorageObjectReplicationPolicy -ResourceGroupName $rgname `
    -StorageAccountName $destAccountName `
    -PolicyId default `
    -SourceAccount $srcAccountName `
    -Rule $rule1,$rule2

# Create the same policy on the source account.
Set-AzStorageObjectReplicationPolicy -ResourceGroupName $rgname `
    -StorageAccountName $srcAccountName `
    -InputObject $destPolicy
```

# [Azure CLI](#tab/azure-cli)

To create a replication policy with Azure CLI, first install the preview extension for Azure Storage.:

```azurecli
az extension add -n storage-or-preview
```

Next, sign in with your Azure credentials:

```azurecli
az login
```

Enable blob versioning on the source and destination storage accounts, and enable change feed on the source account. Remember to replace values in angle brackets with your own values:

```azurecli
az storage blob service-properties update --resource-group <resource-group> \
    --account-name <source-storage-account> \
    --enable-versioning

az storage blob service-properties update --resource-group <resource-group> \
    --account-name <source-storage-account> \
    --enable-change-feed

az storage blob service-properties update --resource-group <resource-group> \
    --account-name <dest-storage-account> \
    --enable-versioning
```

Create the source and destination containers in their respective storage accounts.

```azurecli
az storage container create --account-name <source-storage-account> --name source-container3 --auth-mode login
az storage container create --account-name <source-storage-account> --name source-container4 --auth-mode login

az storage container create --account-name <dest-storage-account> --name source-container3 --auth-mode login
az storage container create --account-name <dest-storage-account> --name source-container4 --auth-mode login
```

Create a new replication policy and associated rules on the destination account.

```azurecli
az storage account or-policy create --account-name <dest-storage-account> \
    --resource-group <resource-group> \
    --source-account <source-storage-account> \
    --destination-account <dest-storage-account> \
    --source-container source-container3 \
    --destination-container dest-container3 \
    --min-creation-time '2020-05-10T00:00:00Z' \
    --prefix-match a

az storage account or-policy rule add --account-name <dest-storage-account> \
    --destination-container dest-container4 \
    --policy-id <policy-id> \
    --resource-group <resource-group> \
    --source-container source-container4 \
    --prefix-match b
```

Create the policy on the source account using the policy ID.

```azurecli
az storage account or-policy show --resource-group <resource-group> \
    --name <dest-storage-account> \
    --policy-id <policy-id> |
    --az storage account or-policy create --resource-group <resource-group> \
    --name <source-storage-account> \
    --policy "@-"
```

---

## Remove a replication policy

To remove a replication policy and its associated rules, use Azure portal, PowerShell, or CLI.

# [Azure portal](#tab/portal)

To remove a replication policy in the Azure portal, follow these steps:

1. Navigate to the source storage account in the Azure portal.
1. Under **Settings**, select **Object replication**.
1. Click the **More** button next to the policy name.
1. Select **Delete Rules**.

# [PowerShell](#tab/powershell)

To remove a replication policy, delete the policy from both the source account and the destination account. Deleting the policy also deletes any rules associated with it.

```powershell
# Remove the policy from the destination account.
Remove-AzStorageObjectReplicationPolicy -ResourceGroupName $rgname `
    -StorageAccountName $destAccountName `
    -PolicyId $destPolicy.PolicyId

# Remove the policy from the source account.
Remove-AzStorageObjectReplicationPolicy -ResourceGroupName $rgname `
    -StorageAccountName $srcAccountName `
    -PolicyId $destPolicy.PolicyId
```

# [Azure CLI](#tab/azure-cli)

To remove a replication policy, delete the policy from both the source account and the destination account. Deleting the policy also deletes any rules associated with it.

```azurecli
az storage account or-policy delete \
    --policy-id $policyid \
    --account-name <source-storage-account> \
    --resource-group <resource-group>

az storage account or-policy delete \
    --policy-id $policyid \
    --account-name <dest-storage-account> \
    --resource-group <resource-group>
```

---

## Next steps

- [Object replication overview (preview)](object-replication-overview.md)