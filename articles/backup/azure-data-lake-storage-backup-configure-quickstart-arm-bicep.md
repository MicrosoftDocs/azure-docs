---
title: Quickstart - Configure vaulted backup for Azure Data Lake Storage using ARM or Bicep template
description: Learn how to configure vaulted backup for Azure Data Lake Storage using ARM or Bicep template.
ms.custom:
  - ignite-2025
  - devx-track-azurepowershell-azurecli, devx-track-azurecli
zone_pivot_groups: backup-client-template-arm-bicep
ms.topic: tutorial
ms.date: 11/18/2025
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As an IT administrator, I want to configure backup for Azure Data Lake Storage using the ARM or Bicep template so that I can ensure data protection against accidental or malicious deletions without maintaining on-premises infrastructure.
---

# Quickstart: Configure vaulted backup for Azure Data Lake Storage

::: zone pivot="client-template-arm"

This quickstart describes how to configure [vaulted backup for Azure Data Lake Storage](azure-data-lake-storage-backup-overview.md) using an Azure Resource Manager (ARM) template.

## Prerequisites

Before you back up Azure Data Lake Storage data, review the [supported scenarios](azure-data-lake-storage-backup-support-matrix.md) for Azure Data Lake Storage backup.

## Review the ARM template for Azure Data Lake Storage vaulted backup

The following example ARM template allows you to configure vaulted backup for two containers in a storage account with a backup policy. This backup policy runs daily and retains backups for 30 days, as well as weekly, monthly, and yearly backups for longer retention.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "metadata": {
    "_generator": {
      "name": "bicep",
      "version": "0.26.170.59819",
      "templateHash": "16621072649356248018"
    }
  },
  "parameters": {
    "vaultName": {
      "type": "string",
      "defaultValue": "[format('vault{0}', uniqueString(resourceGroup().id))]",
      "metadata": {
        "description": "Name of the Vault"
      }
    },
    "vaultStorageRedundancy": {
      "type": "string",
      "defaultValue": "GeoRedundant",
      "allowedValues": [
        "LocallyRedundant",
        "GeoRedundant"
      ],
      "metadata": {
        "description": "Change Vault Storage Type (not allowed if the vault has registered backups)"
      }
    },
    "backupPolicyName": {
      "type": "string",
      "defaultValue": "[format('policy{0}', uniqueString(resourceGroup().id))]",
      "metadata": {
        "description": "Name of the Backup Policy"
      }
    },
    "vaultTierDefaultRetentionInDays": {
      "type": "int",
      "defaultValue": 30,
      "minValue": 7,
      "maxValue": 3650,
      "metadata": {
        "description": "Vault tier default backup retention duration in days"
      }
    },
    "vaultTierWeeklyRetentionInWeeks": {
      "type": "int",
      "defaultValue": 30,
      "minValue": 4,
      "maxValue": 521,
      "metadata": {
        "description": "Vault tier weekly backup retention duration in weeks"
      }
    },
    "vaultTierMonthlyRetentionInMonths": {
      "type": "int",
      "defaultValue": 30,
      "minValue": 5,
      "maxValue": 116,
      "metadata": {
        "description": "Vault tier monthly backup retention duration in months"
      }
    },
    "vaultTierYearlyRetentionInYears": {
      "type": "int",
      "defaultValue": 10,
      "minValue": 1,
      "maxValue": 10,
      "metadata": {
        "description": "Vault tier yearly backup retention duration in years"
      }
    },
    "vaultTierDailyBackupScheduleTime": {
      "type": "string",
      "defaultValue": "06:00",
      "metadata": {
        "description": "Vault tier daily backup schedule time"
      }
    },
    "storageAccountName": {
      "type": "string",
      "defaultValue": "[format('store{0}', uniqueString(resourceGroup().id))]",
      "metadata": {
        "description": "Name of the Storage Account"
      }
    },
    "containerList": {
      "type": "array",
      "defaultValue": [
        "container1",
        "container2"
      ],
      "metadata": {
        "description": "List of the containers to be protected"
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location for all resources"
      }
    }
  },
  "variables": {
    "roleDefinitionId": "[subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')]",
    "dataSourceType": "Microsoft.Storage/storageAccounts/adlsBlobServices",
    "resourceType": "Microsoft.Storage/storageAccounts",
    "vaultTierDefaultRetentionDuration": "[format('P{0}D', parameters('vaultTierDefaultRetentionInDays'))]",
    "vaultTierWeeklyRetentionDuration": "[format('P{0}W', parameters('vaultTierWeeklyRetentionInWeeks'))]",
    "vaultTierMonthlyRetentionDuration": "[format('P{0}M', parameters('vaultTierMonthlyRetentionInMonths'))]",
    "vaultTierYearlyRetentionDuration": "[format('P{0}Y', parameters('vaultTierYearlyRetentionInYears'))]",
    "repeatingTimeIntervals": "[format('R/2025-10-10T{0}:00+00:00/P1D', parameters('vaultTierDailyBackupScheduleTime'))]"
  },
  "resources": [
    {
      "type": "Microsoft.DataProtection/backupVaults",
      "apiVersion": "2025-07-01",
      "name": "[parameters('vaultName')]",
      "location": "[parameters('location')]",
      "identity": {
        "type": "systemAssigned"
      },
      "properties": {
        "storageSettings": [
          {
            "datastoreType": "VaultStore",
            "type": "[parameters('vaultStorageRedundancy')]"
          }
        ]
      }
    },
    {
      "type": "Microsoft.DataProtection/backupVaults/backupPolicies",
      "apiVersion": "2025-07-01",
      "name": "[format('{0}/{1}', parameters('vaultName'), parameters('backupPolicyName'))]",
      "properties": {
        "policyRules": [
          {
            "name": "Yearly",
            "objectType": "AzureRetentionRule",
            "isDefault": false,
            "lifecycles": [ 
              {
                "deleteAfter": {
                  "duration": "[variables('vaultTierYearlyRetentionDuration')]",
                  "objectType": "AbsoluteDeleteOption"
                },
                "sourceDataStore": {
                  "dataStoreType": "VaultStore",
                  "objectType": "DataStoreInfoBase"
                },
                "targetDataStoreCopySettings": []
              }
            ]
          },
          {
            "name": "Monthly",
            "objectType": "AzureRetentionRule",
            "isDefault": false,
            "lifecycles": [
              {
                "deleteAfter": {
                  "duration": "[variables('vaultTierMonthlyRetentionDuration')]",
                  "objectType": "AbsoluteDeleteOption"
                },
                "sourceDataStore": {
                  "dataStoreType": "VaultStore",
                  "objectType": "DataStoreInfoBase"
                },
                "targetDataStoreCopySettings": []
              }
            ]
          },
          {
            "name": "Weekly",
            "objectType": "AzureRetentionRule",
            "isDefault": false,
            "lifecycles": [
              {
                "deleteAfter": {
                  "duration": "[variables('vaultTierWeeklyRetentionDuration')]",
                  "objectType": "AbsoluteDeleteOption"
                },
                "sourceDataStore": {
                  "dataStoreType": "VaultStore",
                  "objectType": "DataStoreInfoBase"
                },
                "targetDataStoreCopySettings": []
              }
            ]
          },
          {
            "name": "Default",
            "objectType": "AzureRetentionRule",
            "isDefault": true,
            "lifecycles": [
              {
                "deleteAfter": {
                  "duration": "[variables('vaultTierDefaultRetentionDuration')]",
                  "objectType": "AbsoluteDeleteOption"
                },
                "sourceDataStore": {
                  "dataStoreType": "VaultStore",
                  "objectType": "DataStoreInfoBase"
                },
                "targetDataStoreCopySettings": []
              }
            ]
          },
          {
            "name": "BackupDaily",
            "objectType": "AzureBackupRule",
            "backupParameters": {
              "backupType": "Discrete",
              "objectType": "AzureBackupParams"
            },
            "dataStore": {
              "dataStoreType": "VaultStore",
              "objectType": "DataStoreInfoBase"
            },
            "trigger": {
              "schedule": {
                "timeZone": "UTC",
                "repeatingTimeIntervals": [
                  "[variables('repeatingTimeIntervals')]"
                ]
              },
              "taggingCriteria": [
                {
                  "isDefault": false,
                  "taggingPriority": 10,
                  "tagInfo": {
                    "id": "Yearly_",
                    "tagName": "Yearly"
                  },
                  "criteria": [
                    {
                      "absoluteCriteria": [
                        "FirstOfYear"
                      ],
                      "objectType": "ScheduleBasedBackupCriteria"
                    }
                  ]
                },
                {
                  "isDefault": false,
                  "taggingPriority": 15,
                  "tagInfo": {
                    "id": "Monthly_",
                    "tagName": "Monthly"
                  },
                  "criteria": [
                    {
                      "absoluteCriteria": [
                        "FirstOfMonth"
                      ],
                      "objectType": "ScheduleBasedBackupCriteria"
                    }
                  ]
                },
                {
                  "isDefault": false,
                  "taggingPriority": 20,
                  "tagInfo": {
                    "id": "Weekly_",
                    "tagName": "Weekly"
                  },
                  "criteria": [
                    {
                      "absoluteCriteria": [
                        "FirstOfWeek"
                      ],
                      "objectType": "ScheduleBasedBackupCriteria"
                    }
                  ]
                },
                {
                  "isDefault": true,
                  "taggingPriority": 99,
                  "tagInfo": {
                    "id": "Default_",
                    "tagName": "Default"
                  }
                }
              ],
              "objectType": "ScheduleBasedTriggerContext"
            }
          }
        ],
        "datasourceTypes": [
          "[variables('dataSourceType')]"
        ],
        "objectType": "BackupPolicy"
      },
      "dependsOn": [
        "[resourceId('Microsoft.DataProtection/backupVaults', parameters('vaultName'))]"
      ]
    },
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2024-01-01",
      "name": "[parameters('storageAccountName')]",
      "location": "[parameters('location')]",
      "kind": "StorageV2",  
      "sku": {
        "name": "Standard_RAGRS",
        "tier": "Standard"
      },
      "properties": {
        "isHnsEnabled": true
      }
    },
    {
      "copy": {
        "name": "storageContainerList",
        "count": "[length(parameters('containerList'))]"
      },
      "type": "Microsoft.Storage/storageAccounts/blobServices/containers",
      "apiVersion": "2024-01-01",
      "name": "[format('{0}/default/{1}', parameters('storageAccountName'), parameters('containerList')[copyIndex()])]",
      "dependsOn": [
        "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
      ]
    },
    {
      "type": "Microsoft.Authorization/roleAssignments",
      "apiVersion": "2022-04-01",
      "scope": "[format('Microsoft.Storage/storageAccounts/{0}', parameters('storageAccountName'))]",
      "name": "[guid(resourceId('Microsoft.DataProtection/backupVaults', parameters('vaultName')), variables('roleDefinitionId'), resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')))]",
      "properties": {
        "roleDefinitionId": "[variables('roleDefinitionId')]",
        "principalId": "[reference(resourceId('Microsoft.DataProtection/backupVaults', parameters('vaultName')), '2021-01-01', 'Full').identity.principalId]",
        "principalType": "ServicePrincipal"
      },
      "dependsOn": [
        "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]",
        "[resourceId('Microsoft.DataProtection/backupVaults', parameters('vaultName'))]"
      ]
    },
    {
      "type": "Microsoft.DataProtection/backupVaults/backupInstances",
      "apiVersion": "2025-07-01",
      "name": "[format('{0}/{1}', parameters('vaultName'), parameters('storageAccountName'))]",
      "properties": {
        "objectType": "BackupInstance",
        "friendlyName": "[parameters('storageAccountName')]",
        "dataSourceInfo": {
          "objectType": "Datasource",
          "resourceID": "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]",
          "resourceName": "[parameters('storageAccountName')]",
          "resourceType": "[variables('resourceType')]",
          "resourceUri": "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]",
          "resourceLocation": "[parameters('location')]",
          "datasourceType": "[variables('dataSourceType')]"
        },
        "dataSourceSetInfo": {
          "objectType": "DatasourceSet",
          "resourceID": "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]",
          "resourceName": "[parameters('storageAccountName')]",
          "resourceType": "[variables('resourceType')]",
          "resourceUri": "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]",
          "resourceLocation": "[parameters('location')]",
          "datasourceType": "[variables('dataSourceType')]"
        },
        "policyInfo": {
          "policyId": "[resourceId('Microsoft.DataProtection/backupVaults/backupPolicies', parameters('vaultName'), parameters('backupPolicyName'))]",
          "name": "[parameters('backupPolicyName')]",
          "policyParameters": {
            "backupDatasourceParametersList": [
              {
                "objectType": "BlobBackupDatasourceParameters",
                "containersList": "[parameters('containerList')]"
              }
            ]
          }
        }
      },
      "dependsOn": [
        "[resourceId('Microsoft.DataProtection/backupVaults/backupPolicies', parameters('vaultName'), parameters('backupPolicyName'))]",
        "[extensionResourceId(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), 'Microsoft.Authorization/roleAssignments', guid(resourceId('Microsoft.DataProtection/backupVaults', parameters('vaultName')), variables('roleDefinitionId'), resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))))]",
        "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]",
        "storageContainerList",
        "[resourceId('Microsoft.DataProtection/backupVaults', parameters('vaultName'))]"
      ]
    }
  ]
}
```

## Deploy the ARM template for Azure Data Lake Storage vaulted backup

After you review the preceding template, deploy the template for Azure Data Lake Storage vaulted backup.

To deploy the template, store the template in a GitHub repository, and then run the following PowerShell script on Azure Cloud Shell.

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter a project name (limited to eight characters) that is used to generate Azure resource names"
$location = Read-Host -Prompt "Enter the location (for example, centralus)"

$resourceGroupName = "${projectName}rg"
$templateUri = "https//templateuri"

New-AzResourceGroup -Name $resourceGroupName -Location $location
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri -projectName
```

::: zone-end


::: zone pivot="client-template-bicep"

This quickstart describes how to configure [vaulted backup for Azure Data Lake Storage](azure-data-lake-storage-backup-overview.md) using a Bicep template.

## Prerequisites

Before you back up Azure Data Lake Storage data, ensure that the following prerequisites are met:

- Configure your environment for Bicep development. [Learn how to install Bicep tools](/azure/azure-resource-manager/bicep/install).
- Review the [supported scenarios](azure-data-lake-storage-backup-support-matrix.md) for Azure Data Lake Storage backup.

## Review the Bicep template for Azure Data Lake Storage vaulted backup

The following example Bicep template allows you to configure vaulted backup for two containers in a storage account with a backup policy. This backup policy runs daily and retains backups for 30 days, as well as weekly, monthly, and yearly backups for longer retention.


```BICEP
@description('Name of the Vault')
param vaultName string = 'vault${uniqueString(resourceGroup().id)}'

@description('Change Vault Storage Type (not allowed if the vault has registered backups)')
@allowed([
  'LocallyRedundant'
  'GeoRedundant'
])
param vaultStorageRedundancy string = 'GeoRedundant'

@description('Name of the Backup Policy')
param backupPolicyName string = 'policy${uniqueString(resourceGroup().id)}'

@description('Vault tier default backup retention duration in days')
@minValue(7)
@maxValue(3650)
param vaultTierDefaultRetentionInDays int = 30

@description('Vault tier weekly backup retention duration in weeks')
@minValue(4)
@maxValue(521)
param vaultTierWeeklyRetentionInWeeks int = 30

@description('Vault tier monthly backup retention duration in months')
@minValue(5)
@maxValue(116)
param vaultTierMonthlyRetentionInMonths int = 30

@description('Vault tier yearly backup retention duration in years')
@minValue(1)
@maxValue(10)
param vaultTierYearlyRetentionInYears int = 10

@description('Vault tier daily backup schedule time')
param vaultTierDailyBackupScheduleTime string = '06:00'

@description('Name of the Storage Account')
param storageAccountName string = 'store${uniqueString(resourceGroup().id)}'

@description('List of the containers to be protected')
param containerList array = [
  'container1'
  'container2'
]

@description('Location for all resources')
param location string = resourceGroup().location

var roleDefinitionId = subscriptionResourceId(
  'Microsoft.Authorization/roleDefinitions',
  'e5e2a7ff-d759-4cd2-bb51-3152d37e2eb1'
)
var dataSourceType = 'Microsoft.Storage/storageAccounts/adlsBlobServices'
var resourceType = 'Microsoft.Storage/storageAccounts'
var vaultTierDefaultRetentionDuration = 'P${vaultTierDefaultRetentionInDays}D'
var vaultTierWeeklyRetentionDuration = 'P${vaultTierWeeklyRetentionInWeeks}W'
var vaultTierMonthlyRetentionDuration = 'P${vaultTierMonthlyRetentionInMonths}M'
var vaultTierYearlyRetentionDuration = 'P${vaultTierYearlyRetentionInYears}Y'
var repeatingTimeIntervals = 'R/2025-10-10T${vaultTierDailyBackupScheduleTime}:00+00:00/P1D'

resource vault 'Microsoft.DataProtection/backupVaults@2025-07-01' = {
  name: vaultName
  location: location
  identity: {
    type: 'systemAssigned'
  }
  properties: {
    storageSettings: [
      {
        datastoreType: 'VaultStore'
        type: vaultStorageRedundancy
      }
    ]
  }
}

resource backupPolicy 'Microsoft.DataProtection/backupVaults/backupPolicies@2025-07-01' = {
  parent: vault
  name: backupPolicyName
  properties: {
    policyRules: [
      {
        name: 'Yearly'
        objectType: 'AzureRetentionRule'
        isDefault: false
        lifecycles: [
          {
            deleteAfter: {
              duration: vaultTierYearlyRetentionDuration
              objectType: 'AbsoluteDeleteOption'
            }
            sourceDataStore: {
              dataStoreType: 'VaultStore'
              objectType: 'DataStoreInfoBase'
            }
            targetDataStoreCopySettings: []
          }
        ]
      }
      {
        name: 'Monthly'
        objectType: 'AzureRetentionRule'
        isDefault: false
        lifecycles: [
          {
            deleteAfter: {
              duration: vaultTierMonthlyRetentionDuration
              objectType: 'AbsoluteDeleteOption'
            }
            sourceDataStore: {
              dataStoreType: 'VaultStore'
              objectType: 'DataStoreInfoBase'
            }
            targetDataStoreCopySettings: []
          }
        ]
      }
      {
        name: 'Weekly'
        objectType: 'AzureRetentionRule'
        isDefault: false
        lifecycles: [
          {
            deleteAfter: {
              duration: vaultTierWeeklyRetentionDuration
              objectType: 'AbsoluteDeleteOption'
            }
            sourceDataStore: {
              dataStoreType: 'VaultStore'
              objectType: 'DataStoreInfoBase'
            }
            targetDataStoreCopySettings: []
          }
        ]
      }
      {
        name: 'Default'
        objectType: 'AzureRetentionRule'
        isDefault: true
        lifecycles: [
          {
            deleteAfter: {
              duration: vaultTierDefaultRetentionDuration
              objectType: 'AbsoluteDeleteOption'
            }
            sourceDataStore: {
              dataStoreType: 'VaultStore'
              objectType: 'DataStoreInfoBase'
            }
            targetDataStoreCopySettings: []
          }
        ]
      }
      {
        name: 'BackupDaily'
        objectType: 'AzureBackupRule'
        backupParameters: {
          backupType: 'Discrete'
          objectType: 'AzureBackupParams'
        }
        dataStore: {
          dataStoreType: 'VaultStore'
          objectType: 'DataStoreInfoBase'
        }
        trigger: {
          schedule: {
            timeZone: 'UTC'
            repeatingTimeIntervals: [
              repeatingTimeIntervals
            ]
          }
          taggingCriteria: [
            {
              isDefault: false
              taggingPriority: 10
              tagInfo: {
                id: 'Yearly_'
                tagName: 'Yearly'
              }
              criteria: [
                {
                  absoluteCriteria: [
                    'FirstOfYear'
                  ]
                  objectType: 'ScheduleBasedBackupCriteria'
                }
              ]
            }
            {
              isDefault: false
              taggingPriority: 15
              tagInfo: {
                id: 'Monthly_'
                tagName: 'Monthly'
              }
              criteria: [
                {
                  absoluteCriteria: [
                    'FirstOfMonth'
                  ]
                  objectType: 'ScheduleBasedBackupCriteria'
                }
              ]
            }
            {
              isDefault: false
              taggingPriority: 20
              tagInfo: {
                id: 'Weekly_'
                tagName: 'Weekly'
              }
              criteria: [
                {
                  absoluteCriteria: [
                    'FirstOfWeek'
                  ]
                  objectType: 'ScheduleBasedBackupCriteria'
                }
              ]
            }
            {
              isDefault: true
              taggingPriority: 99
              tagInfo: {
                id: 'Default_'
                tagName: 'Default'
              }
            }
          ]
          objectType: 'ScheduleBasedTriggerContext'
        }
      }
    ]
    datasourceTypes: [
      dataSourceType
    ]
    objectType: 'BackupPolicy'
  }
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2024-01-01' = {
  name: storageAccountName
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_RAGRS'
    tier: 'Standard'
  }
  properties: {
    isHnsEnabled: true
  }
}

resource storageContainerList 'Microsoft.Storage/storageAccounts/blobServices/containers@2024-01-01' = [
  for item in containerList: {
    name: '${storageAccountName}/default/${item}'
    dependsOn: [
      storageAccount
    ]
  }
]

resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: storageAccount
  name: guid(vault.id, roleDefinitionId, storageAccount.id)
  properties: {
    roleDefinitionId: roleDefinitionId
    principalId: reference(vault.id, '2021-01-01', 'Full').identity.principalId
    principalType: 'ServicePrincipal'
  }
}

resource backupInstance 'Microsoft.DataProtection/backupVaults/backupInstances@2025-07-01' = {
  parent: vault
  name: storageAccountName
  properties: {
    objectType: 'BackupInstance'
    friendlyName: storageAccountName
    dataSourceInfo: {
      objectType: 'Datasource'
      resourceID: storageAccount.id
      resourceName: storageAccountName
      resourceType: resourceType
      resourceUri: storageAccount.id
      resourceLocation: location
      datasourceType: dataSourceType
    }
    dataSourceSetInfo: {
      objectType: 'DatasourceSet'
      resourceID: storageAccount.id
      resourceName: storageAccountName
      resourceType: resourceType
      resourceUri: storageAccount.id
      resourceLocation: location
      datasourceType: dataSourceType
    }
    policyInfo: {
      policyId: backupPolicy.id
      name: backupPolicyName
      policyParameters: {
        backupDatasourceParametersList: [
          {
            objectType: 'BlobBackupDatasourceParameters'
            containersList: containerList
          }
        ]
      }
    }
  }
  dependsOn: [
    roleAssignment
    storageContainerList
  ]
}
```

## Deploy the Bicep template for Azure Data Lake Storage vaulted backup

After you review the preceding template, deploy the template for Azure Data Lake Storage vaulted backup.

To deploy the template, store the preceding template in a GitHub repository, and then run the following PowerShell script on Azure Cloud Shell.

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter a project name (limited to eight characters) that is used to generate Azure resource names"
$location = Read-Host -Prompt "Enter the location (for example, centralus)"

$resourceGroupName = "${projectName}rg"
$templateUri = "templateURI"

New-AzResourceGroup -Name $resourceGroupName -Location $location
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri -projectName $projectName
```

::: zone-end


## Next steps

- [Restore Azure Data Lake Storage using Azure portal](azure-data-lake-storage-restore.md).
- [Manage vaulted backup for Azure Data Lake Storage using Azure portal](azure-data-lake-storage-backup-manage.md).
- [Troubleshoot Azure Data Lake Storage backup](azure-data-lake-storage-backup-troubleshoot.md). 
 



