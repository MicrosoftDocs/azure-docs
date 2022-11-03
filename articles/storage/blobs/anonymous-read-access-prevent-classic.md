---
title: Remediate anonymous public read access to blob data (classic deployments)
titleSuffix: Azure Storage
description: Remediate anonymous public read access to blob data (classic deployments)
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 11/01/2022
ms.author: tamram
ms.reviewer: nachakra
ms.subservice: blobs
ms.custom: devx-track-azurepowershell, engagement-fy23
---

# Remediate anonymous public read access to blob data (classic deployments)

Azure Blob Storage supports optional anonymous public read access to containers and blobs. However, anonymous access may present a security risk. We recommend that you disable anonymous access for optimal security. Disallowing public access helps to prevent data breaches caused by undesired anonymous access.

By default, public access to your blob data is always prohibited. However, the default configuration for a classic storage account permits a user with appropriate permissions to configure public access to containers and blobs in a storage account. To prevent public access to a classic storage account, you must configure each container in the account to block public access.

If your storage account is using the classic deployment model, we recommend that you migrate to the Azure Resource Manager deployment model as soon as possible. Azure Storage accounts that use the classic deployment model will be retired on August 31, 2024. For more information, see [Azure classic storage accounts will be retired on 31 August 2024](https://azure.microsoft.com/updates/classic-azure-storage-accounts-will-be-retired-on-31-august-2024/).

If you cannot migrate your classic storage accounts at this time, then you should remediate public access to those accounts now by setting all containers to be private. This article describes how to remediate access to the containers in a classic storage account.

## Sample script for remediating public access



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
