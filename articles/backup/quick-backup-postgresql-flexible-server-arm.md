---
title: Quickstart - Configure backup for Azure Database for PostgreSQL - Flexible Server with an Azure Resource Manager template
description: Learn how to configure backup for Azure Database for Azure PostgreSQL - Flexible Server with an Azure Resource Manager template.
ms.devlang: azurecli
ms.custom:
  - ignite-2024
  - build-2025
ms.topic: quickstart
ms.date: 05/15/2025
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

# Quickstart: Configure backup for Azure Database for PostgreSQL - Flexible Server with an Azure Resource Manager template

This quickstart describes how to configure backup for Azure Database for PostgreSQL - Flexible Server with an Azure Resource Manager template. 

[Azure Backup](backup-azure-database-postgresql-flex-overview.md) allows you to back up your Azure PostgreSQL - Flexible Server using multiple clients, such as Azure portal, PowerShell, CLI, Azure Resource Manager, Bicep, and so on. This article focuses on the process of deploying an Azure Resource Manager (ARM) template to create a Backup vault and then configure backup for the Azure PostgreSQL - Flexible Server. Learn more about [developing ARM templates](../azure-resource-manager/index.yml) .

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

To set up your environment for Bicep development, see [Install Bicep tools](../azure-resource-manager/bicep/install.md).

>[!Note]
>Install the latest [Azure PowerShell module](/powershell/azure/new-azureps-module-az) and the Bicep CLI as detailed in article.

## Review the template

This template enables you to configure backup for an Azure PostgreSQL - Flexible server. In this template, we create a backup vault with a backup policy for the PostgreSQL server with a *weekly* schedule and a *three month* retention duration.

```JSON
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "backupVaultName": {
      "type": "string"
    },
    "backupVaultResourceGroup": {
      "type": "string"
    },
    "postgreSQLServerName": {
      "type": "string"
    },
    "postgreSQLResourceGroup": {
      "type": "string"
    },
    "region": {
      "type": "string"
    },
    "policyName": {
      "type": "string"
    },
    "backupScheduleFrequency": {
      "type": "string"
    },
    "retentionDurationInMonths": {
      "type": "int"
    },
    "targetResourceGroupName": {
      "type": "string"
    }
  },
  "resources": [
    {
      "type": "Microsoft.DataProtection/backupVaults",
      "apiVersion": "2023-01-01",
      "name": "[parameters('backupVaultName')]",
      "location": "[parameters('region')]",
      "identity": {
        "type": "SystemAssigned"
      },
      "properties": {
        "storageSettings": [
          {
            "datastoreType": "VaultStore",
            "type": "LocallyRedundant"
          }
        ]
      }
    },
    {
      "type": "Microsoft.DataProtection/backupVaults/backupPolicies",
      "apiVersion": "2023-01-01",
      "name": "[concat(parameters('backupVaultName'), '/', parameters('policyName'))]",
      "location": "[parameters('region')]",
      "properties": {
        "datasourceTypes": [
          "Microsoft.DBforPostgreSQL/flexibleServers"
        ],
        "policyRules": [
          {
            "name": "BackupSchedule",
            "objectType": "AzureBackupRule",
            "backupParameters": {
              "objectType": "AzureBackupParams"
            },
            "trigger": {
              "schedule": {
                "recurrenceRule": {
                  "frequency": "Hourly",
                  "interval": "[parameters('backupScheduleFrequency')]"
                }
              }
            },
            "dataStore": {
              "datastoreType": "VaultStore"
            }
          },
          {
            "name": "RetentionRule",
            "objectType": "AzureRetentionRule",
            "isDefault": true,
            "lifecycle": {
              "deleteAfter": {
                "objectType": "AbsoluteDeleteOption",
                "duration": "[concat('P', parameters('retentionDurationInMonths'), 'M')]"
              }
            }
          }
        ]
      }
    },
    {
      "type": "Microsoft.Authorization/roleAssignments",
      "apiVersion": "2022-04-01",
      "name": "[guid(subscription().id, 'PostgreSQLFlexibleServerLongTermRetentionBackupRole
')]",
      "properties": {
        "principalId": "[reference(concat(resourceId(parameters('backupVaultResourceGroup'), 'Microsoft.DataProtection/backupVaults', parameters('backupVaultName')), '/providers/Microsoft.ManagedIdentity/Identities/default'), '2020-12-01').principalId]",
        "roleDefinitionId": "[subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e')]",
        "scope": "[resourceId(parameters('postgreSQLResourceGroup'), 'Microsoft.DBforPostgreSQL/flexibleServers', parameters('postgreSQLServerName'))]"
      }
    },
    {
      "type": "Microsoft.Authorization/roleAssignments",
      "apiVersion": "2022-04-01",
      "name": "[guid(subscription().id, 'Reader')]",
      "properties": {
        "principalId": "[reference(concat(resourceId(parameters('backupVaultResourceGroup'), 'Microsoft.DataProtection/backupVaults', parameters('backupVaultName')), '/providers/Microsoft.ManagedIdentity/Identities/default'), '2020-12-01').principalId]",
        "roleDefinitionId": "[subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e')]",
        "scope": "[resourceId(parameters('targetResourceGroupName'))]"
      }
    },
    {
      "type": "Microsoft.DataProtection/backupVaults/backupInstances",
      "apiVersion": "2023-01-01",
      "name": "PostgreSQLBackupInstance",
      "location": "[parameters('region')]",
      "properties": {
        "datasourceInfo": {
          "datasourceType": "Microsoft.DBforPostgreSQL/flexibleServers",
          "objectType": "Datasource",
          "resourceId": "[resourceId(parameters('postgreSQLResourceGroup'), 'Microsoft.DBforPostgreSQL/flexibleServers', parameters('postgreSQLServerName'))]"
        },
        "policyInfo": {
          "policyId": "[resourceId(parameters('backupVaultResourceGroup'), 'Microsoft.DataProtection/backupVaults/backupPolicies', parameters('backupVaultName'), parameters('policyName'))]"
        }
      }
    }
  ]
}

```
## Deploy the template

To deploy the template, store the template in a GitHub repository and then paste the following PowerShell script into the shell window. 

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter a project name (limited to eight characters) that is used to generate Azure resource names"
$location = Read-Host -Prompt "Enter the location (for example, centralus)"

$resourceGroupName = "${projectName}rg"
$templateUri = "https//templateuri"

New-AzResourceGroup -Name $resourceGroupName -Location $location
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri -projectName 
```

## Next steps

[Restore Azure Database for PostgreSQL - Flexible server using Azure PowerShell](backup-azure-database-postgresql-flex-restore-powershell.md).
