---
title: Configure object replication (preview)
titleSuffix: Azure Storage
description: 
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 05/18/2020
ms.author: tamram
ms.subservice: blobs
---

# Configure object replication (preview)

Object replication (preview) asynchronously copies block blobs between a source storage account and a destination account. For more information about object replication, see [Object replication (preview)](object-replication-overview.md).

When you configure object replication, you create a replication policy that specifies the source storage account and the destination account. A replication policy includes one or more rules that specify a source container and a destination container and indicate which block blobs in the source container will be replicated.

This article describes how to configure object replication for your storage account by using the Azure portal, PowerShell, or Azure CLI. You can also use one of the Azure Storage resource provider client libraries to configure object replication.

## Create a replication policy and rules

Before you configure object replication, create the source and destination storage accounts if they do not already exist. Both accounts must be general-purpose v2 storage accounts. For more information, see [Create an Azure Storage account](../common/storage-account-create.md).

# [Azure portal](#tab/portal)

Before you configure object replication in the Azure portal, create the source and destination containers in their respective storage accounts, if they do not already exist.

Next, make sure you have enabled the following prerequisites:

- [Change feed (preview)](storage-blob-change-feed.md) on the source account
- [Blob versioning (preview)](versioning-overview.md) on the source and destination accounts

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

To create a replication policy with PowerShell, first install version [1.14.1-preview](https://www.powershellgallery.com/packages/Az.Storage/1.14.1-preview) of the Az.Storage PowerShell module. Follow these steps to install the preview module:

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
    Install-Module Az.Storage -Repository PSGallery -RequiredVersion 1.14.1-preview -AllowPrerelease -AllowClobber -Force
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

# Create new containers in the source and destination accounts.
$srcAccount | New-AzStorageContainer $srcContainerName1
$destAccount | New-AzStorageContainer $destContainerName1
$srcAccount | New-AzStorageContainer $srcContainerName2
$destAccount | New-AzStorageContainer $destContainerName2

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

To create a replication policy with Azure CLI, first install version [1.14.1-preview](https://www.powershellgallery.com/packages/Az.Storage/1.14.1-preview) of the Az.Storage PowerShell module. Follow these steps to install the preview module:

Refer to [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) article to install and import the preview module supporting object replication capability.

az extension add -n storage-ors-preview

To start working with Azure CLI, sign in with your Azure credentials.

az login

Enable both Change feed and Versioning on the source storage account. Make sure you’re already registered for [Change feed](https://azure.microsoft.com/blog/change-feed-support-now-available-in-preview-for-azure-blob-storage/) and Versioning capabilities.

az storage blob service-properties update --enable-versioning --resource-group \<resource group\> --account-name \<source storage account\>

az storage blob service-properties update --enable-change-feed --resource-group \<resource group\> --account-name \<source storage account\>

Enable Versioning on the destination storage account.

az storage blob service-properties update --enable-versioning --resource-group \<resource group\> --account-name \<destination storage account\>

Create a new replication policy and an associated rule(s) and specify the desired prefix and replication behavior for the objects, that existed prior to configuring object replication.

az storage account ors-policy create \\

\--account-name \<destination storage account\> \\

\--resource-group \<resource group\> \\

\--source-account \<source storage account\> \\

\--destination-account \<destination storage account\> \\

\--source-container \<source container\> \\

\--min-creation-time '2020-02-19T16:05:00Z' \\

\--prefix-match prod\_

For list of available parameters and their values refer to Azure CLI object replication extension documentation.

Enable object replication on the source account by adding the replication policy to it.

az storage account ors-policy show -g \<resource group\> -n \<destination storage account\> --policy-id \<policy id from the previous step\> \| az storage account ors-policy create -g \<resource group\> -n \<source storage account\> -p "\@-"

Save the replication policy ID and the rule ID into variables for further orchestration.

\$policyid = (az storage account ors-policy create --account-name \<source/destination storage account\> --resource-group \<resource group\> --properties \@{path}) --query policyId)

\$ruleid = (az storage account ors-policy create --account-name \<source/destination storage account\> --resource-group \<resource group\> --properties \@{path}) --query rules.ruleId)

List replication policies in effect on a given storage account.

az storage account ors-policy list \\

\--account-name \<source/destination storage account\> \\

\--resource-group \<resource group\>

Retrieve details of a specific replication policy.

az storage account ors-policy show \\

\--policy-id \$policyid \\

\--account-name \<source/destination storage account\> \\

\--resource-group \<resource group\>

Change the source account name by updating the existing replication policy.

az storage account ors-policy update \\

\--policy-id \$policyid \\

\--account-name \<destination storage account\> \\

\--resource-group \<resource group\> \\

\-s \<new source storage account\>

Add rule to an existing replication policy.

az storage account ors-policy rule add \\

\--policy-id \$policyid \\

\--account-name \<destination storage account\> \\

\--resource-group \<resource group\> \\

\--destination-container \<destination container\> \\

\--source-container \<source container\> \\

\--prefix-match test\_ \\

\--min-creation-time '2020-02-19T16:05:00Z'

List all rules in effect for a given replication policy.

az storage account ors-policy rule list \\

\--policy-id \$policyid \\

\--account-name \<source/destination storage account\> \\

\--resource-group \<resource group\>

When no longer needed, remove the replication policy from the source and
destination accounts.

az storage account ors-policy remove \\

\--policy-id \$policyid \\

\--account-name \<source/destination storage account\> \\

\--resource-group \<resource group\>

---

## Next steps

- [Object replication overview (preview)](object-replication-overview.md)