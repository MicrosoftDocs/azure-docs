---
title: Quickstart - Configure vaulted backup for Azure Files using Azure Resource Manager
description: Learn how to configure vaulted backup for Azure Files using Azure Resource Manager.
ms.devlang: azurecli
ms.custom:
  - ignite-2024
ms.topic: quickstart
ms.date: 05/22/2025
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

#  Quickstart: Configure vaulted backup for Azure Files using Azure Resource Manager

This quickstart describes how to configure vaulted backup for Azure Files using Azure Resource Manager (ARM) template.

Azure Backup supports configuring [snapshot](azure-file-share-backup-overview.md?tabs=snapshot) and [vaulted](azure-file-share-backup-overview.md?tabs=vault-standard) backups for Azure Files in your storage accounts. Vaulted backup offers an offsite solution, storing data in a general v2 storage account to protect against ransomware and malicious admin actions.

An Azure Resource Manager template is a JavaScript Object Notation (JSON) that defines your project's infrastructure and configuration using declarative syntax. It allows you to specify your intended deployment without writing programming commands.

## Prerequisites

Before you configure vaulted backup for Azure Files, ensure that you have a storage account with an existing File Share. To create a new storage account and File Share, see [create an Azure storage account with File Share template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.storage/storage-file-share).

## Review the template

The [Azure Quickstart Template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.recoveryservices/recovery-services-backup-file-share) configures protection for an existing File Share in a Storage Account. It creates or uses a Recovery Services Vault and Backup Policy based on parameter values.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "metadata": {
    "_generator": {
      "name": "bicep",
      "version": "0.9.1.41621",
      "templateHash": "10658692291511804779"
    }
  },
  "parameters": {
    "existingResourceGroupName": {
      "type": "string",
      "defaultValue": "[resourceGroup().name]",
      "metadata": {
        "description": "Name of the existing Resource Group in which the existing Storage Account is present."
      }
    },
    "existingStorageAccountName": {
      "type": "string",
      "metadata": {
        "description": "Name of the existing Storage Account in which the existing File Share to be protected is present."
      }
    },
    "existingFileShareName": {
      "type": "string",
      "metadata": {
        "description": "Name of the existing File Share to be protected."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location of the existing Storage Account containing the existing File Share to be protected. New Recovery Services Vault will be created in this location. (Ignore if using existing Recovery Services Vault)."
      }
    },
    "isNewVault": {
      "type": "bool",
      "defaultValue": true,
      "metadata": {
        "description": "Set to true if a new Recovery Services Vault is to be created; set to false otherwise."
      }
    },
    "isNewPolicy": {
      "type": "bool",
      "defaultValue": true,
      "metadata": {
        "description": "Set to true if a new Backup Policy is to be created for the Recovery Services Vault; set to false otherwise."
      }
    },
    "registerStorageAccount": {
      "type": "bool",
      "defaultValue": true,
      "metadata": {
        "description": "Set to true if the existing Storage Account has to be registered to the Recovery Services Vault; set to false otherwise."
      }
    },
    "vaultName": {
      "type": "string",
      "defaultValue": "RSVault1",
      "metadata": {
        "description": "Name of the Recovery Services Vault. (Should have the same location as the Storage Account containing the File Share to be protected in case of an existing Recovery Services Vault)."
      }
    },
    "policyName": {
      "type": "string",
      "defaultValue": "DailyBackupPolicy1",
      "metadata": {
        "description": "Name of the Backup Policy."
      }
    },
    "scheduleRunTime": {
      "type": "string",
      "defaultValue": "05:30",
      "metadata": {
        "description": "Time of day when backup should be triggered in 24 hour HH:MM format, where MM must be 00 or 30. (Ignore if using existing Backup Policy)."
      }
    },
    "timeZone": {
      "type": "string",
      "defaultValue": "UTC",
      "metadata": {
        "description": "Any valid timezone, for example: UTC, Pacific Standard Time. Refer: https://msdn.microsoft.com/library/gg154758.aspx (Ignore if using existing Backup Policy)."
      }
    },
    "dailyRetentionDurationCount": {
      "type": "int",
      "defaultValue": 30,
      "metadata": {
        "description": "Number of days for which the daily backup is to be retained. (Ignore if using existing Backup Policy)."
      }
    },
    "daysOfTheWeek": {
      "type": "array",
      "defaultValue": [
        "Sunday",
        "Tuesday",
        "Thursday"
      ],
      "metadata": {
        "description": "Array of days on which backup is to be performed for Weekly Retention. (Ignore if using existing Backup Policy)."
      }
    },
    "weeklyRetentionDurationCount": {
      "type": "int",
      "defaultValue": 12,
      "metadata": {
        "description": "Number of weeks for which the weekly backup is to be retained. (Ignore if using existing Backup Policy)."
      }
    },
    "monthlyRetentionDurationCount": {
      "type": "int",
      "defaultValue": 60,
      "metadata": {
        "description": "Number of months for which the monthly backup is to be retained. Backup will be performed on the 1st day of every month. (Ignore if using existing Backup Policy)."
      }
    },
    "monthsOfYear": {
      "type": "array",
      "defaultValue": [
        "January",
        "May",
        "September"
      ],
      "metadata": {
        "description": "Array of months on which backup is to be performed for Yearly Retention. Backup will be performed on the 1st day of each month of year provided. (Ignore if using existing Backup Policy)."
      }
    },
    "yearlyRetentionDurationCount": {
      "type": "int",
      "defaultValue": 10,
      "metadata": {
        "description": "Number of years for which the yearly backup is to be retained. (Ignore if using existing Backup Policy)."
      }
    }
  },
  "variables": {
    "backupFabric": "Azure",
    "backupManagementType": "AzureStorage",
    "scheduleRunTimes": [
      "[format('2020-01-01T{0}:00Z', parameters('scheduleRunTime'))]"
    ]
  },
  "resources": [
    {
      "condition": "[parameters('isNewVault')]",
      "type": "Microsoft.RecoveryServices/vaults",
      "apiVersion": "2021-12-01",
      "name": "[parameters('vaultName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "RS0",
        "tier": "Standard"
      },
      "properties": {}
    },
    {
      "condition": "[parameters('isNewPolicy')]",
      "type": "Microsoft.RecoveryServices/vaults/backupPolicies",
      "apiVersion": "2021-12-01",
      "name": "[format('{0}/{1}', parameters('vaultName'), parameters('policyName'))]",
      "properties": {
        "backupManagementType": "[variables('backupManagementType')]",
        "schedulePolicy": {
          "scheduleRunFrequency": "Daily",
          "scheduleRunTimes": "[variables('scheduleRunTimes')]",
          "schedulePolicyType": "SimpleSchedulePolicy"
        },
        "retentionPolicy": {
          "dailySchedule": {
            "retentionTimes": "[variables('scheduleRunTimes')]",
            "retentionDuration": {
              "count": "[parameters('dailyRetentionDurationCount')]",
              "durationType": "Days"
            }
          },
          "weeklySchedule": {
            "daysOfTheWeek": "[parameters('daysOfTheWeek')]",
            "retentionTimes": "[variables('scheduleRunTimes')]",
            "retentionDuration": {
              "count": "[parameters('weeklyRetentionDurationCount')]",
              "durationType": "Weeks"
            }
          },
          "monthlySchedule": {
            "retentionScheduleFormatType": "Daily",
            "retentionScheduleDaily": {
              "daysOfTheMonth": [
                {
                  "date": 1,
                  "isLast": false
                }
              ]
            },
            "retentionTimes": "[variables('scheduleRunTimes')]",
            "retentionDuration": {
              "count": "[parameters('monthlyRetentionDurationCount')]",
              "durationType": "Months"
            }
          },
          "yearlySchedule": {
            "retentionScheduleFormatType": "Daily",
            "monthsOfYear": "[parameters('monthsOfYear')]",
            "retentionScheduleDaily": {
              "daysOfTheMonth": [
                {
                  "date": 1,
                  "isLast": false
                }
              ]
            },
            "retentionTimes": "[variables('scheduleRunTimes')]",
            "retentionDuration": {
              "count": "[parameters('yearlyRetentionDurationCount')]",
              "durationType": "Years"
            }
          },
          "retentionPolicyType": "LongTermRetentionPolicy"
        },
        "timeZone": "[parameters('timeZone')]",
        "workLoadType": "AzureFileShare"
      },
      "dependsOn": [
        "[resourceId('Microsoft.RecoveryServices/vaults', parameters('vaultName'))]"
      ]
    },
    {
      "condition": "[parameters('registerStorageAccount')]",
      "type": "Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers",
      "apiVersion": "2021-12-01",
      "name": "[format('{0}/{1}/storagecontainer;Storage;{2};{3}', parameters('vaultName'), variables('backupFabric'), parameters('existingResourceGroupName'), parameters('existingStorageAccountName'))]",
      "properties": {
        "backupManagementType": "[variables('backupManagementType')]",
        "containerType": "StorageContainer",
        "sourceResourceId": "[resourceId(parameters('existingResourceGroupName'), 'Microsoft.Storage/storageAccounts', parameters('existingStorageAccountName'))]"
      },
      "dependsOn": [
        "[resourceId('Microsoft.RecoveryServices/vaults', parameters('vaultName'))]"
      ]
    },
    {
      "type": "Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers/protectedItems",
      "apiVersion": "2021-12-01",
      "name": "[format('{0}/{1}/{2}/{3}', split(format('{0}/{1}/storagecontainer;Storage;{2};{3}', parameters('vaultName'), variables('backupFabric'), parameters('existingResourceGroupName'), parameters('existingStorageAccountName')), '/')[0], split(format('{0}/{1}/storagecontainer;Storage;{2};{3}', parameters('vaultName'), variables('backupFabric'), parameters('existingResourceGroupName'), parameters('existingStorageAccountName')), '/')[1], split(format('{0}/{1}/storagecontainer;Storage;{2};{3}', parameters('vaultName'), variables('backupFabric'), parameters('existingResourceGroupName'), parameters('existingStorageAccountName')), '/')[2], format('AzureFileShare;{0}', parameters('existingFileShareName')))]",
      "properties": {
        "protectedItemType": "AzureFileShareProtectedItem",
        "sourceResourceId": "[resourceId(parameters('existingResourceGroupName'), 'Microsoft.Storage/storageAccounts', parameters('existingStorageAccountName'))]",
        "policyId": "[resourceId('Microsoft.RecoveryServices/vaults/backupPolicies', parameters('vaultName'), parameters('policyName'))]",
        "isInlineInquiry": true
      },
      "dependsOn": [
        "[resourceId('Microsoft.RecoveryServices/vaults/backupPolicies', parameters('vaultName'), parameters('policyName'))]",
        "[resourceId('Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers', split(format('{0}/{1}/storagecontainer;Storage;{2};{3}', parameters('vaultName'), variables('backupFabric'), parameters('existingResourceGroupName'), parameters('existingStorageAccountName')), '/')[0], split(format('{0}/{1}/storagecontainer;Storage;{2};{3}', parameters('vaultName'), variables('backupFabric'), parameters('existingResourceGroupName'), parameters('existingStorageAccountName')), '/')[1], split(format('{0}/{1}/storagecontainer;Storage;{2};{3}', parameters('vaultName'), variables('backupFabric'), parameters('existingResourceGroupName'), parameters('existingStorageAccountName')), '/')[2])]",
        "[resourceId('Microsoft.RecoveryServices/vaults', parameters('vaultName'))]"
      ]
    }
  ]
}
```

## Deploy the template

To deploy the ARM templates, select **Deploy to Azure**. The template opens in the Azure portal. 

Alternatively, download the template and [deploy it using Azure PowerShell](/azure/azure-resource-manager/templates/deploy-powershell#deploy-local-template) or use your preferred method of ARM template deployment.

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

