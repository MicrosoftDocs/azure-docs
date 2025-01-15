---
title: Quickstart - Bicep template PostgreSQL Backup
description: Learn how to back up your Azure PostgreSQL - Flexible server with a Bicep template.
ms.devlang: azurecli
ms.custom:
  - ignite-2024
ms.topic: quickstart
ms.date: 10/07/2024
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

#  Back up an Azure PostgreSQL - Flexible servers with a Bicep template (preview)

[Azure Backup](backup-azure-database-postgresql-flex-overview.md) allows you to back up your Azure PostgreSQL - Flexible servers using multiple options - such as Azure portal, PowerShell, CLI, Azure Resource Manager, Bicep, and so on. This article describes how to back up an Azure PostgreSQL - Flexible servers with an Azure Bicep template and Azure PowerShell. This quickstart focuses on the process of deploying a Bicep template to create a Backup vault and then configure backup for the Azure PostgreSQL - Flexible server. For more information on developing Bicep templates, see the [Bicep documentation](../azure-resource-manager/bicep/deploy-cli.md).

Bicep is a language for declaratively deploying Azure resources. You can use Bicep instead of JSON to develop your Azure Resource Manager templates (ARM templates). Bicep syntax reduces the complexity and improves the development experience. Bicep is a transparent abstraction over ARM template JSON that provides all JSON template capabilities. During deployment, the Bicep CLI converts a Bicep file into an ARM template JSON. A Bicep file states the Azure resources and resource properties, without writing a sequence of programming commands to create resources.

Resource types, API versions, and properties that are valid in an ARM template, are also valid in a Bicep file.

## Prerequisites

To set up your environment for Bicep development, see [Install Bicep tools](../azure-resource-manager/bicep/install.md).

>[!Note]
>Install the latest [Azure PowerShell module](/powershell/azure/new-azureps-module-az) and the Bicep CLI as detailed in article.

## Review the template

This template enables you to configure backup for an Azure PostgreSQL - Flexible server. In this template, we create a backup vault with a backup policy for the PostgreSQL server with a *weekly* schedule and a *three month* retention duration.



```bicep
@description('Specifies the name of the Backup Vault')
param backupVaultName string

@description('Specifies the name of the Resource group to which Backup Vault belongs')
param backupVaultResourceGroup string

@description('Specifies the name of the PostgreSQL server')
param postgreSQLServerName string

@description('Specifies the name of the Resource group to which PostgreSQL server belongs')
param postgreSQLResourceGroup string

@description('Specifies the region in which the Backup Vault is located')
param region string

@description('Specifies the name of the Backup Policy')
param policyName string

@description('Specifies the frequency of the backup schedule')
param backupScheduleFrequency string

@description('Specifies the retention duration in months')
param retentionDuration string

@description('Step 1: Create the Backup Vault')
resource backupVault 'Microsoft.DataProtection/backupVaults@2023-01-01' = {
  name: backupVaultName
  location: region
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    storageSettings: [
      {
        datastoreType: 'VaultStore'
        type: 'LocallyRedundant'
      }
    ]
  }
}

@description('Step 2: Create Backup Policy for PostgreSQL')
resource backupPolicy 'Microsoft.DataProtection/backupVaults/backupPolicies@2023-01-01' = {
  name: '${backupVaultName}/${policyName}'
  location: region
  properties: {
    datasourceTypes: [
      'AzureDatabaseForPostgreSQLFlexibleServer'
    ]
    policyRules: [
      {
        name: 'BackupSchedule'
        objectType: 'AzureBackupRule'
        backupParameters: {
          objectType: 'AzureBackupParams'
        }
        trigger: {
          schedule: {
            recurrenceRule: {
              frequency: 'Weekly'
              interval: backupScheduleFrequency
            }
          }
        }
        dataStore: {
          datastoreType: 'VaultStore'
        }
      }
      {
        name: 'RetentionRule'
        objectType: 'AzureRetentionRule'
        isDefault: true
        lifecycle: {
          deleteAfter: {
            objectType: 'AbsoluteDeleteOption'
            duration: 'P${retentionDuration}M'
          }
        }
      }
    ]
  }
}

@description('Step 3: Role Assignment for PostgreSQL Backup And Export Operator Role')
resource postgreSQLServer 'Microsoft.DBforPostgreSQL/flexibleServers@2022-03-01' existing = {
  name: postgreSQLServerName
  scope: resourceGroup(postgreSQLResourceGroup)
}

resource roleAssignmentBackupExportOperator 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(backupVault.id, 'PostgreSQLFlexibleServerLongTermRetentionBackupRole')
  properties: {
    principalId: backupVault.identity.principalId
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e')  // Role definition ID for 'PostgreSQL Backup And Export Operator'
    scope: postgreSQLServer.id
  }
}

@description('Step 4: Role Assignment for Reader on Resource Group')
resource targetResourceGroup 'Microsoft.Resources/resourceGroups@2021-04-01' existing = {
  name: targetResourceGroupName
}

resource roleAssignmentReader 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(backupVault.id, 'Reader')
  properties: {
    principalId: backupVault.identity.principalId
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e')  // Role definition ID for 'Reader'
    scope: targetResourceGroup.id
  }
}

@description('Step 5: Create Backup Instance for PostgreSQL)
resource backupInstance 'Microsoft.DataProtection/backupVaults/backupInstances@2023-01-01' = {
  name: 'PostgreSQLBackupInstance'
  location: region
  properties: {
    datasourceInfo: {
      datasourceType: 'AzureDatabaseForPostgreSQLFlexibleServer'
      objectType: 'Datasource'
      resourceId: postgreSQLServer.id
    }
    policyInfo: {
      policyId: backupPolicy.id
    }
  }
}

```

## Deploy the template

To deploy this template, store it in GitHub or your preferred location and then paste the following PowerShell script in the shell window. To paste the code, right-click the shell window and then select **Paste**.


```azurepowershell
$projectName = Read-Host -Prompt "Enter a project name (limited to eight characters) that is used to generate Azure resource names"
$location = Read-Host -Prompt "Enter the location (for example, centralus)"

$resourceGroupName = "${projectName}rg"
$templateUri = "templateURI"

New-AzResourceGroup -Name $resourceGroupName -Location $location
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri -projectName $projectName 

```

## Next steps

- [Restore Azure PostgreSQL - Flexible server using Azure PowerShell](backup-azure-database-postgresql-flex-restore-powershell.md)
- [About Azure PostgreSQL - Flexible server backup](backup-azure-database-postgresql-flex-overview.md)
