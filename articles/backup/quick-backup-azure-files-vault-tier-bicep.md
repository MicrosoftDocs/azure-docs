---
title: Quickstart - Configure vaulted backup for Azure Files using Azure Bicep
description: Learn how to configure vaulted backup for Azure Files using Azure Bicep.
ms.devlang: azurecli
ms.custom:
  - ignite-2024
  - build-2025
ms.topic: quickstart
ms.date: 05/22/2025
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

#  Quickstart: Configure vaulted backup for Azure Files using Azure Bicep

This quickstart describes how to configure vaulted backup for Azure Files using Azure Bicep file.

[Azure Backup](backup-overview.md) supports configuring [snapshot](azure-file-share-backup-overview.md?tabs=snapshot) and [vaulted](azure-file-share-backup-overview.md?tabs=vault-standard) backups for Azure Files in your storage accounts. Vaulted backup offers an offsite solution, storing data in a general v2 storage account to protect against ransomware and malicious admin actions.

Bicep is a language for declaratively deploying Azure resources, offering a simpler syntax and better development experience compared to JSON. It abstracts ARM template JSON, providing all its capabilities. During deployment, the Bicep CLI converts a Bicep file into Azure Resource Manager (ARM) template JSON. A Bicep file specifies Azure resources and properties without needing programming commands. Resource types, API versions, and properties valid in ARM templates are also valid in Bicep files.

## Prerequisites

Before you configure vaulted backup for Azure Files, ensure that you set up your environment for Bicep development. Learn how to [install Bicep tools](/azure/azure-resource-manager/bicep/install).
 
>[!Note]
>Install the latest [Azure PowerShell module](/powershell/azure/new-azureps-module-az) and the Bicep CLI.


## Review the template

The [Azure Quickstart Template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.recoveryservices/recovery-services-backup-file-share) configures protection for an existing File Share in a Storage Account. It creates or uses a Recovery Services Vault and Backup Policy based on parameter values.

```json
@description('Name of the existing Resource Group in which the existing Storage Account is present.')
param existingResourceGroupName string = resourceGroup().name

@description('Name of the existing Storage Account in which the existing File Share to be protected is present.')
param existingStorageAccountName string

@description('Name of the existing File Share to be protected.')
param existingFileShareName string

@description('Location of the existing Storage Account containing the existing File Share to be protected. New Recovery Services Vault will be created in this location. (Ignore if using existing Recovery Services Vault).')
param location string = resourceGroup().location

@description('Set to true if a new Recovery Services Vault is to be created; set to false otherwise.')
param isNewVault bool = true

@description('Set to true if a new Backup Policy is to be created for the Recovery Services Vault; set to false otherwise.')
param isNewPolicy bool = true

@description('Set to true if the existing Storage Account has to be registered to the Recovery Services Vault; set to false otherwise.')
param registerStorageAccount bool = true

@description('Name of the Recovery Services Vault. (Should have the same location as the Storage Account containing the File Share to be protected in case of an existing Recovery Services Vault).')
param vaultName string = 'RSVault-${substring(uniqueString(resourceGroup().id), 6)}'

@description('Name of the Backup Policy.')
param policyName string = 'HourlyBackupPolicy'

@description('Time of day when backup should be triggered in 24 hour HH:MM format, where MM must be 00 or 30. (Ignore if using existing Backup Policy).')
param scheduleRunTime string = '05:30'

@description('Any valid timezone, for example: UTC, Pacific Standard Time. Refer: https://msdn.microsoft.com/en-us/library/gg154758.aspx (Ignore if using existing Backup Policy).')
param timeZone string = 'UTC'

@description('Number of days for which the daily backup is to be retained. (Ignore if using existing Backup Policy).')
param dailyRetentionDurationCount int = 5

@description('Array of days on which backup is to be performed for Weekly Retention. (Ignore if using existing Backup Policy).')
param daysOfTheWeek array = [
  'Sunday'
  'Tuesday'
  'Thursday'
]

@description('Number of weeks for which the weekly backup is to be retained. (Ignore if using existing Backup Policy).')
param weeklyRetentionDurationCount int = 12

@description('Number of months for which the monthly backup is to be retained. Backup will be performed on the 1st day of every month. (Ignore if using existing Backup Policy).')
param monthlyRetentionDurationCount int = 60

@description('Array of months on which backup is to be performed for Yearly Retention. Backup will be performed on the 1st day of each month of year provided. (Ignore if using existing Backup Policy).')
param monthsOfYear array = [
  'January'
  'May'
  'September'
]

@description('Number of years for which the yearly backup is to be retained. (Ignore if using existing Backup Policy).')
param yearlyRetentionDurationCount int = 10

@description('Hourly Schedule window start time')
param scheduleWindowStartTime string = '${substring(utcNow('2020-01-01T{0}:00Z'), 0, 11)}08:00:00.000Z'

@description('Hourly backup frequency (Ignore if using existing Backup Policy).')
param backupFrequency int = 4

var backupFabric = 'Azure'
var backupManagementType = 'AzureStorage'
var scheduleRunTimes = [
  '2020-01-01T${scheduleRunTime}:00Z'
]

resource vault 'Microsoft.RecoveryServices/vaults@2021-12-01' = if (isNewVault) {
  name: vaultName
  location: location
  sku: {
    name: 'RS0'
    tier: 'Standard'
  }
  properties: {
  }
}

resource backupPolicy 'Microsoft.RecoveryServices/vaults/backupPolicies@2022-02-01' = if (isNewPolicy) {
  parent: vault
  name: policyName
  properties: {
    backupManagementType: backupManagementType
    schedulePolicy: {
      schedulePolicyType: 'SimpleSchedulePolicy'
      scheduleRunFrequency: 'Hourly'
      scheduleRunTimes: scheduleRunTimes
      hourlySchedule: {
        interval: backupFrequency
        scheduleWindowStartTime: scheduleWindowStartTime
        scheduleWindowDuration: 12
      }
    }
    retentionPolicy: {
      dailySchedule: {
        retentionTimes: scheduleRunTimes
        retentionDuration: {
          count: dailyRetentionDurationCount
          durationType: 'Days'
        }
      }
      weeklySchedule: {
        daysOfTheWeek: daysOfTheWeek
        retentionTimes: scheduleRunTimes
        retentionDuration: {
          count: weeklyRetentionDurationCount
          durationType: 'Weeks'
        }
      }
      monthlySchedule: {
        retentionScheduleFormatType: 'Daily'
        retentionScheduleDaily: {
          daysOfTheMonth: [
            {
              date: 1
              isLast: false
            }
          ]
        }
        retentionTimes: scheduleRunTimes
        retentionDuration: {
          count: monthlyRetentionDurationCount
          durationType: 'Months'
        }
      }
      yearlySchedule: {
        retentionScheduleFormatType: 'Daily'
        monthsOfYear: monthsOfYear
        retentionScheduleDaily: {
          daysOfTheMonth: [
            {
              date: 1
              isLast: false
            }
          ]
        }
        retentionTimes: scheduleRunTimes
        retentionDuration: {
          count: yearlyRetentionDurationCount
          durationType: 'Years'
        }
      }
      retentionPolicyType: 'LongTermRetentionPolicy'
    }
    timeZone: timeZone
    workLoadType: 'AzureFileShare'
  }
}

resource protectionContainer 'Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers@2021-12-01' = if (registerStorageAccount) {
  name: '${vaultName}/${backupFabric}/storagecontainer;Storage;${existingResourceGroupName};${existingStorageAccountName}'
  dependsOn: [
    vault
    backupPolicy
  ]
  properties: {
    backupManagementType: backupManagementType
    containerType: 'StorageContainer'
    sourceResourceId: resourceId(existingResourceGroupName, 'Microsoft.Storage/storageAccounts', existingStorageAccountName)
  }
}

resource protectedItem 'Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers/protectedItems@2021-12-01'={
  name:'${split('${vaultName}/${backupFabric}/storagecontainer;Storage;${existingResourceGroupName};${existingStorageAccountName}', '/')[0]}/${split('${vaultName}/${backupFabric}/storagecontainer;Storage;${existingResourceGroupName};${existingStorageAccountName}', '/')[1]}/${split('${vaultName}/${backupFabric}/storagecontainer;Storage;${existingResourceGroupName};${existingStorageAccountName}', '/')[2]}/AzureFileShare;${existingFileShareName}'
  dependsOn:[
    vault
  ]
  properties:{
    protectedItemType:'AzureFileShareProtectedItem'
    sourceResourceId:resourceId(existingResourceGroupName, 'Microsoft.Storage/storageAccounts', existingStorageAccountName)
    policyId:backupPolicy.id
  }
}

```

## Deploy the template

To deploy the template, follow these steps:

1. Select **Try it** to open the **Azure Cloud Shell**.
1. Paste the following PowerShell script in the shell window by right-clicking the **shell** window, and then select **Paste**.

    ```azurepowershell-interactive

    $existingResourceGroupName = Read-Host -Prompt "Enter the Azure resource group name:"
    $existingStorageAccountName= Read-Host -Prompt "Enter the Azure resource group name:"
    $existingFileShareName= Read-Host -Prompt "Enter the Azure resource group name:"
    $location = Read-Host -Prompt "Enter the location (for example, centralus)"
    $templateUri = "https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.recoveryservices/recovery-services-backup-file-share/azuredeploy.json"
    New-AzResourceGroupDeployment -existingResourceGroupName $existingResourceGroupName -TemplateUri $templateUri – existingStorageAccountName $existingStorageAccountName – existingFileShareName $existingFileShareName 
    ```

## Next steps

-  [Track the backup job using Azure PowerShell](manage-afs-powershell.md#track-backup-and-restore-jobs).
- [Restore Azure Files using Azure PowerShell](restore-afs-powershell.md).
- Restore Azure Files using [Azure portal](restore-afs.md), [Azure CLI](restore-afs-cli.md), [REST API](restore-azure-file-share-rest-api.md).
- Manage Azure Files backups using [Azure portal](manage-afs-backup.md), [Azure PowerShell](manage-afs-powershell.md), [Azure CLI](manage-afs-backup-cli.md), [REST API](manage-azure-file-share-rest-api.md).

