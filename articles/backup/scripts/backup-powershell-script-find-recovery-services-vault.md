---
title: PowerShell Script - find Vault for Storage Account
description: Learn how to use an Azure PowerShell script to find the Recovery Services vault where your storage account is registered.
ms.topic: sample
ms.date: 1/28/2020 
ms.custom: devx-track-azurepowershell
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# PowerShell Script to find the Recovery Services vault where a Storage Account is registered

This script helps you to find the Recovery Services vault where your storage account is registered.

## Sample script

```powershell
Param(
        [Parameter(Mandatory=$True)][System.String] $ResourceGroupName,
        [Parameter(Mandatory=$True)][System.String] $StorageAccountName,
        [Parameter(Mandatory=$True)][System.String] $SubscriptionId
    )

Connect-AzAccount
Select-AzSubscription -Subscription $SubscriptionId
$vaults = Get-AzRecoveryServicesVault
$found = $false
foreach($vault in $vaults)
{
  Write-Verbose "Checking vault: $($vault.Id)" -Verbose
  
  $containers = Get-AzRecoveryServicesBackupContainer -ContainerType AzureStorage -FriendlyName $StorageAccountName -ResourceGroupName $ResourceGroupName -VaultId $vault.Id -Status Registered
  
  if($containers -ne $null)
  {
    $found = $True
    Write-Information "Found Storage account $StorageAccountName registered in vault: $($vault.Id)" -InformationAction Continue
    break;
  }
}

if(!$found)
{
     Write-Information "Storage account: $StorageAccountName is not registered in any vault of this subscription" -InformationAction Continue
}
```

## How to execute the script

1. Save the script above on your machine with a name of your choice. In this example, we saved it as *FindRegisteredStorageAccount.ps1*.
2. Execute the script by providing the following parameters:

    * **-ResourceGroupName** - Resource Group of the storage account
    * **-StorageAccountName** - Storage Account Name
    * **-SubscriptionID** - The ID of subscription where the storage account is present.

The following example tries to find the Recovery Services vault where the *afsaccount* storage account is registered:

```powershell
.\FindRegisteredStorageAccount.ps1 -ResourceGroupName AzureFiles -StorageAccountName afsaccount -SubscriptionId ef4ad5a7-c2c0-4304-af80-af49f49af3d1
```

## Output

The output will display the complete path of the Recovery Services vault where the storage account is registered. Here is a sample output:

```output
Found Storage account afsaccount registered in vault: /subscriptions/ ef4ad5a7-c2c0-4304-af80-af49f49af3d1/resourceGroups/azurefiles/providers/Microsoft.RecoveryServices/vaults/azurefilesvault123
```

## Next steps

Learn how to [Backup Azure File Shares from the Azure portal](../backup-afs.md)
