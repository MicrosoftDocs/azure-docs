---
title: Configure object replication (preview)
titleSuffix: Azure Storage
description: 
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 05/12/2020
ms.author: tamram
ms.subservice: blobs
---

# Configure object replication (preview)

Object replication (preview) asynchronously copies block blobs between a source storage account and a destination account. The source and destination accounts may be in different regions. For more information about object replication, see [Object replication (preview)](object-replication-overview.md).

To use object replication, create a replication policy on the source account that specifies the destination account. Then add one or more replication rules to the policy. Replication rules specify the source and destination containers and determine which block blobs in those containers will be copied.

This article describes how to configure object replication for your storage account by using the Azure portal, PowerShell, or Azure CLI. You can also use one of the Azure Storage resource provider client libraries to configure object replication.

## Create a replication policy and rules

Before you configure object replication, create the source and destination storage accounts if they do not already exist. Both accounts must be general-purpose v2 storage accounts. For more information, see [Create an Azure Storage account](../common/storage-account-create.md).

Also create the source and destination containers in their respective storage accounts, if they do not already exist.

Finally, enable the following prerequisites:

- [Change feed (preview)](storage-blob-change-feed.md) on the source account
- [Blob versioning (preview)](versioning-overview.md) on the source and destination accounts

# [Azure portal](#tab/portal)

To create a replication policy and add replication rules in the Azure portal, follow these steps:

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

### Install the preview module

To create a replication policy and add replication rules using PowerShell, first install version [1.14.1-preview](https://www.powershellgallery.com/packages/Az.Storage/1.14.1-preview) of the Az.Storage PowerShell module. Follow these steps to install the preview module:

1. Uninstall any previous installations of Azure PowerShell from Windows using the **Apps & features** setting under **Settings**.

1. Make sure that you have the latest version of PowerShellGet installed. Open a Windows PowerShell window, and run the following command to install the latest version:

    ```powershell
    Install-Module PowerShellGet –Repository PSGallery –Force
    ```

1. Close and reopen the PowerShell window after installing PowerShellGet.

1. Install the latest version of Azure PowerShell:

    ```powershell
    Install-Module Az –Repository PSGallery –AllowClobber
    ```

1. Install the Az.Storage preview module:

    ```powershell
    Install-Module Az.Storage -Repository PSGallery -RequiredVersion 1.14.1-preview -AllowPrerelease -AllowClobber -Force
    ```

For more information about installing Azure PowerShell, see [Install Azure PowerShell with PowerShellGet](/powershell/azure/install-az-ps).

### Configure replication policy and rules

Before running the example, use the Azure portal or an Azure Resource Manager template to enable blob versioning on the source and destination accounts.

```powershell
# Sign in to your Azure account.
Connect-AzAccount

# Set resource group and account variables.
$rgName = "<resource-group>"
$srcAccountName = "<source-storage-account>"
$destAccountName = "<destination-storage-account>"
$srcContainerName1 = "source-container1"
$destContainerName1 = "dest-container1"
$srcContainerName2 = "source-container2"
$destContainerName2 = "dest-container2"

# Enable change feed on the source account.
Update-AzStorageBlobServiceProperty -ResourceGroupName $rgName `
    -StorageAccountName $srcAccountName `
    -EnableChangeFeed $true

# View the service settings.
Get-AzStorageBlobServiceProperty -ResourceGroupName $rgName `
    -StorageAccountName $accountName

# Create new containers in the source and destination accounts.
$srcAccount | New-AzStorageContainer $srcContainerName1
$destAccount | New-AzStorageContainer $destContainerName1
$srcAccount | New-AzStorageContainer $srcContainerName2
$destAccount | New-AzStorageContainer $destContainerName2

```



Create a new replication rule and specify the desired prefix and replication behavior for the objects, that existed prior to configuring object replication.

\$rule = New-AzStorageObjectReplicationPolicyRule -SourceContainer \<source container\> -DestinationContainer \<destination container\> -PrefixMatch \<desired prefix match\> -MinCreationTime (Get-Date).AddDays(-3)

For list of available parameters and their values, run Get-Help New-AzStorageObjectReplicationPolicyRule -Full and/or Get-Help New-AzStorageObjectReplicationPolicyRule -Examples.

Create a replication policy on the destination account and pass on the rule you created earlier.

Set-AzStorageObjectReplicationPolicy -ResourceGroupName \<resource group\> -StorageAccountName \<destination storage account\> -PolicyId default -SourceAccount \<source storage account\> -Rule \$rule

Retrieve the replication policy you created and enable object replication on the source account by adding the replication policy to it.

\$dstpolicy = Get-AzStorageObjectReplicationPolicy -ResourceGroupName \<resource group\> -StorageAccountName \<destination storage account\>

Set-AzStorageObjectReplicationPolicy -ResourceGroupName \<resource group\> -StorageAccountName \<source storage account\> -InputObject \$dstpolicy

Get details on the replication policy in effect on the destination account and its associated properties.

\$dstpolicy

\$dstpolicy.Rules

Get details on the replication policy in effect on the source account and its associated properties.

\$srcpolicy = Get-AzStorageObjectReplicationPolicy -ResourceGroupName \<resource group\> -StorageAccountName \<source storage account\>

\$srcpolicy

\$srcpolicy.Rules

When no longer needed, remove the replication policy from the source and destination accounts.

Get-AzStorageObjectReplicationPolicy -ResourceGroupName \<resource group\> -StorageAccountName \<destination storage account\> \| Remove-AzStorageObjectReplicationPolicy

Get-AzStorageObjectReplicationPolicy -ResourceGroupName \<resource group\> -StorageAccountName \<source storage account\> \| Remove-AzStorageObjectReplicationPolicy

# [Azure CLI](#tab/cli)

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