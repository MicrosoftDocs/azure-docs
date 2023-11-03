---
title: Remediate anonymous read access to blob data (classic deployments)
titleSuffix: Azure Storage
description: Learn how to prevent anonymous requests against a classic storage account by disabling anonymous access to containers.
author: akashdubey-ms

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 09/12/2023
ms.author: akashdubey
ms.reviewer: nachakra
ms.devlang: powershell, azurecli
ms.custom: devx-track-azurepowershell, engagement-fy23
---

# Remediate anonymous read access to blob data (classic deployments)

Azure Blob Storage supports optional anonymous read access to containers and blobs. However, anonymous access may present a security risk. We recommend that you disable anonymous access for optimal security. Disallowing anonymous access helps to prevent data breaches caused by undesired anonymous access.

By default, anonymous access to your blob data is always prohibited. However, the default configuration for a classic storage account permits a user with appropriate permissions to configure anonymous access to containers and blobs in a storage account. To prevent anonymous access to a classic storage account, you must configure each container in the account to block anonymous access.

If your storage account is using the classic deployment model, we recommend that you [migrate](../../virtual-machines/migration-classic-resource-manager-overview.md#migration-of-storage-accounts) to the Azure Resource Manager deployment model as soon as possible. After you migrate your account, you can configure it to disallow anonymous access at the account level. For information about how to disallow anonymous access for an Azure Resource Manager account, see [Remediate anonymous read access to blob data (Azure Resource Manager deployments)](anonymous-read-access-prevent.md).

If you cannot migrate your classic storage accounts at this time, then you should remediate anonymous access to those accounts now by setting all containers to be private. This article describes how to remediate access to the containers in a classic storage account.

Azure Storage accounts that use the classic deployment model will be retired on August 31, 2024. For more information, see [Azure classic storage accounts will be retired on 31 August 2024](https://azure.microsoft.com/updates/classic-azure-storage-accounts-will-be-retired-on-31-august-2024/).

> [!WARNING]
> Anonymous access presents a security risk. We recommend that you take the actions described in the following section to remediate anonymous access for all of your classic storage accounts, unless your scenario specifically requires anonymous access.

## Block anonymous access to containers

To remediate anonymous access for a classic storage account, set the anonymous access level for each container in the account to **Private**.

# [Azure portal](#tab/portal)

To remediate anonymous access for one or more containers in the Azure portal, follow these steps:

1. Navigate to your storage account overview in the Azure portal.
1. Under **Data storage** on the menu blade, select **Blob containers**.
1. Select the containers for which you want to set the anonymous access level.
1. Use the **Change access level** button to display the access settings.
1. Select **Private (no anonymous access)** from the **Anonymous access level** dropdown and click the OK button to apply the change to the selected containers.

    :::image type="content" source="media/anonymous-read-access-prevent-classic/configure-public-access-container.png" alt-text="Screenshot showing how to set anonymous access level in the portal." lightbox="media/anonymous-read-access-prevent-classic/configure-public-access-container.png":::

# [PowerShell](#tab/powershell)

To remediate anonymous access for one or more containers with PowerShell, call the [Set-AzStorageContainerAcl](/powershell/module/az.storage/set-azstoragecontaineracl) command. Authorize this operation by passing in your account key, a connection string, or a shared access signature (SAS). The [Set Container ACL](/rest/api/storageservices/set-container-acl) operation that sets the container's anonymous access level does not support authorization with Microsoft Entra ID. For more information, see [Permissions for calling blob and queue data operations](/rest/api/storageservices/authorize-with-azure-active-directory#permissions-for-calling-data-operations).

The following example updates a container's anonymous access setting to make the container private. Remember to replace the placeholder values in brackets with your own values:

```powershell
# Set variables.
$rgName = "<resource-group>"
$accountName = "<storage-account>"

# Get context object.
$storageAccount = Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName
$ctx = $storageAccount.Context

# Read the container's anonymous access setting.
Get-AzStorageContainerAcl -Container $containerName -Context $ctx

# Update the container's anonymous access setting to Off.
Set-AzStorageContainerAcl -Container $containerName -Permission Off -Context $ctx
```

# [Azure CLI](#tab/azure-cli)

To remediate anonymous access for one or more containers with Azure CLI, call the [az storage container set permission](/cli/azure/storage/container#az-storage-container-set-permission) command. Authorize this operation by passing in your account key, a connection string, or a shared access signature (SAS). The [Set Container ACL](/rest/api/storageservices/set-container-acl) operation that sets the container's anonymous access level does not support authorization with Microsoft Entra ID. For more information, see [Permissions for calling blob and queue data operations](/rest/api/storageservices/authorize-with-azure-active-directory#permissions-for-calling-data-operations).

The following example updates a container's anonymous access setting to make the container private. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
# Read the container's anonymous access setting.
az storage container show-permission \
    --name <container-name> \
    --account-name <account-name> \
    --account-key <account-key> \
    --auth-mode key

# Update the container's anonymous access setting to Off.
az storage container set-permission \
    --name <container-name> \
    --account-name <account-name> \
    --public-access off \
    --account-key <account-key> \
    --auth-mode key
```

---

## Check the anonymous access setting for a set of containers

It is possible to check which containers in one or more storage accounts are configured for anonymous access by listing the containers and checking the anonymous access setting. This approach is a practical option when a storage account does not contain a large number of containers, or when you are checking the setting across a small number of storage accounts. However, performance may suffer if you attempt to enumerate a large number of containers.

The following example uses PowerShell to get the anonymous access setting for all containers in a storage account. Remember to replace the placeholder values in brackets with your own values:

```powershell
$rgName = "<resource-group>"
$accountName = "<storage-account>"

$storageAccount = Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName
$ctx = $storageAccount.Context

Get-AzStorageContainer -Context $ctx | Select Name, PublicAccess
```

## Sample script for bulk remediation

The following sample PowerShell script runs against all classic storage accounts in a subscription and sets the anonymous access setting for the containers in those accounts to **Private**.

> [!CAUTION]
> Running this script against storage accounts with very large numbers of containers may require significant resources and take a long time. If you have a storage account with a very large number of containers, you may wish to devise a different approach for remediating anonymous access.

```powershell
# This script runs against all classic storage accounts in a single subscription
# and sets containers to private.

## IMPORTANT ##
# Running this script requires a connected account through the previous version 
# of Azure PowerShell. Use the following command to install:
# Install-Module Azure -scope CurrentUser -force
#
# Once installed, you will need to connect with:
# Add-AzureAccount
#
# This command may fail if there are modules installed that conflict with it.
# One known conflicting module is AzureRm.Accounts
# You will need to remove conflicting modules using the following:
# Remove-Module -name <name>
#
# The Azure PowerShell module assumes a current subscription when enumerating
# storage accounts.  You can set the current subscription with:
# Select-AzureSubscription -subscriptionId <subscriptionId>
#
# Get-AzureSubscription lists all subscriptions available to the Azure
# module. Not all subscriptions listed under your name in the portal may 
# appear here. If a subscription does not appear, you may need to use 
# the portal to remediate public access for those accounts.
# After you have selected your subscription, verify that it is current
# by running:
# Get-AzureSubscription -current
# 
# After the current subscription runs, you can run this script, change
# to another subscription after it completes, and then run again as necessary.
## END IMPORTANT##

# Standard operation will enumerate all accounts and check for containers with public 
# access, then allow the user to decide whether or not to disable the setting.  

# Run with BypassConfirmation=$true if you wish to remove permissions from all containers
# without individual confirmation

# Run with BypassArmUpgrade=$true if you wish to upgrade your storage account to use the 
# Azure Resource Manager deployment model. All accounts must be upgraded by 31 August 2024.

param(
    [boolean]$BypassConfirmation=$false,
    [boolean]$BypassArmUpgrade=$false
)

#Do not change this
$convertAccounts = $false

foreach($classicAccount in Get-AzureStorageAccount)
{
    $enumerate = $false

    if(!$BypassArmUpgrade)
    {
        write-host "Classic Storage Account" $classicAccount.storageAccountname "found"
        $confirmation = read-host "Convert to ARM? [y/n]:"
    }
    if(($confirmation -eq 'y') -and (!$BypassArmUpgrade))
    {
        write-host "Conversion selected"
        $convertAccounts = $true
    }
    else
    {
        write-host $classicAccount.StorageAccountName "conversion not selected.  Searching for public containers..."
        $enumerate = $true
    }

    if($enumerate)
    {
        foreach($container in get-azurestoragecontainer -context (get-azurestorageaccount -storageaccountname $classicAccount.StorageAccountName).context)
        {
            if($container.PublicAccess -eq 'Off')
            {
            } 
            else 
            {
                if(!$BypassConfirmation)
                {
                    $selection = read-host $container.Name $container.PublicAccess "access found, Make private?[y/n]:"
                }
                if(($selection -eq 'y') -or ($BypassConfirmation))
                {
                    write-host "Removing permissions from" $container.name "container on storage account" $classicaccount.StorageAccountName
                    try
                    {
                        Set-AzureStorageContainerAcl -context $classicAccount.context -name $container.name -Permission Off
                        write-host "Success!"
                    }
                    catch
                    {
                        $_
                    }
                }
                else
                {
                    write-host "Skipping..."
                }
            }
        }
    }
}
if($convertAccounts)
{
    write-host "Converting accounts to ARM is the preferred method, however there are some caveats."
    write-host "The preferred method would be to use the portal to perform the conversions and then "
    write-host "run the ARM script against them.  For more information on converting a classic account"
    write-host "to an ARM account, please see:"
    write-host "https://learn.microsoft.com/en-us/azure/virtual-machines/migration-classic-resource-manager-overview"
}
write-host "Script complete"
```

## See also

- [Overview: Remediating anonymous read access for blob data](anonymous-read-access-overview.md)
- [Remediate anonymous read access to blob data (Azure Resource Manager deployments)](anonymous-read-access-prevent.md)
