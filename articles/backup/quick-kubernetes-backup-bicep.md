---
title: Quickstart - Configure vaulted backup for an Azure Kubernetes Service (AKS) cluster using Azure Backup via Azure Bicep
description: Learn how to quickly configure backup for a Kubernetes cluster using Azure Bicep.
ms.service: azure-backup
ms.topic: quickstart
ms.date: 05/31/2024
ms.custom: devx-track-terraform, devx-track-extended-azdevcli, ignite-2024
ms.reviewer: rajats
ms.author: v-abhmallick
author: AbhishekMallick-MS
---

# Quickstart: Configure vaulted backup for an Azure Kubernetes Service (AKS) cluster using Azure Bicep

This quickstart describes how to configure vaulted backup for an Azure Kubernetes Service (AKS) cluster using Azure Bicep.


Azure Backup for AKS is a cloud-native, enterprise-ready, application-centric backup service that lets you quickly configure backup for AKS clusters.[Azure Backup](backup-azure-mysql-flexible-server-about.md) allows you to back up your AKS clusters using multiple options - such as Azure portal, PowerShell, CLI, Azure Resource Manager, Bicep, and so on. This quickstart describes how to back up an AKS clusters with a Bicep template and Azure PowerShell. For more information on developing Bicep templates, see the [Bicep documentation](../azure-resource-manager/bicep/deploy-cli.md).

Bicep is a language for declaratively deploying Azure resources. You can use Bicep instead of JSON to develop your Azure Resource Manager templates (ARM templates). Bicep syntax reduces the complexity and improves the development experience. Bicep is a transparent abstraction over ARM template JSON that provides all JSON template capabilities. During deployment, the Bicep CLI converts a Bicep file into an ARM template JSON. A Bicep file states the Azure resources and resource properties, without writing a sequence of programming commands to create resources.

Resource types, API versions, and properties that are valid in an ARM template, are also valid in a Bicep file.

## Prerequisites

To set up your environment for Bicep development, see [Install Bicep tools](../azure-resource-manager/bicep/install.md).

>[!Note]
>Install the latest [Azure PowerShell module](/powershell/azure/new-azureps-module-az) and the Bicep CLI as detailed in article.

## Review the template

This template enables you to configure backup for an AKS cluster. In this template, we create a backup vault with a backup policy for the AKS cluster with a *four hourly* schedule and a *seven day* retention duration.

```bicep
@description('Location for the resource group')
param resourceGroupLocation string
@description('Name of the resource group for AKS and Backup Vault')
param resourceGroupName string
@description('Name of the resource group for storage account and snapshots')
param backupResourceGroupName string
@description('Location for the backup resource group')
param backupResourceGroupLocation string
@description('AKS Cluster name')
param aksClusterName string
@description('DNS prefix for AKS')
param dnsPrefix string
@description('Node count for the AKS Cluster')
param nodeCount int
@description('Name of the Backup Vault')
param backupVaultName string
@description('Datastore type for the Backup Vault')
param datastoreType string
@description('Redundancy type for the Backup Vault')
param redundancy string
@description('Backup policy name')
param backupPolicyName string
@description('Name of the Backup Extension')
param backupExtensionName string
@description('Type of Backup Extension')
param backupExtensionType string
@description('Name of the Storage Account')
param storageAccountName string

var backupContainerName = 'tfbackup'

resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  location: resourceGroupLocation
  name: resourceGroupName
}

resource backupRg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  location: backupResourceGroupLocation
  name: backupResourceGroupName
}

resource aksCluster 'Microsoft.ContainerService/managedClusters@2023-05-01' = {
  location: resourceGroupLocation
  name: aksClusterName
  properties: {
    dnsPrefix: dnsPrefix
    agentPoolProfiles: [
      {
        name: 'agentpool'
        count: nodeCount
        vmSize: 'Standard_D2_v2'
        type: 'VirtualMachineScaleSets'
        mode: 'System'
      }
    ]
    identity: {
      type: 'SystemAssigned'
    }
    networkProfile: {
      networkPlugin: 'kubenet'
      loadBalancerSku: 'standard'
    }
  }
  dependsOn: [
    rg
    backupRg
  ]
}

resource backupVault 'Microsoft.DataProtection/backupVaults@2023-01-01' = {
  location: resourceGroupLocation
  name: backupVaultName
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    dataStoreType: datastoreType
    redundancy: redundancy
  }
  dependsOn: [
    aksCluster
  ]
}

resource backupPolicy 'Microsoft.DataProtection/backupVaults/backupPolicies@2023-01-01' = {
  name: '${backupVaultName}/${backupPolicyName}'
  properties: {
    backupRepeatingTimeIntervals: ['R/2024-04-14T06:33:16+00:00/PT4H']
    defaultRetentionRule: {
      lifeCycle: {
        duration: 'P7D'
        dataStoreType: 'OperationalStore'
      }
    }
  }
  dependsOn: [
    backupVault
  ]
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2022-05-01' = {
  location: backupResourceGroupLocation
  name: storageAccountName
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  dependsOn: [
    aksCluster
  ]
}

resource backupContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2021-04-01' = {
  name: '${storageAccount.name}/default/${backupContainerName}'
  properties: {
    publicAccess: 'None'
  }
  dependsOn: [
    storageAccount
  ]
}

resource backupExtension 'Microsoft.KubernetesConfiguration/extensions@2023-05-01' = {
  name: '${aksClusterName}/${backupExtensionName}'
  properties: {
    extensionType: backupExtensionType
    configurationSettings: {
      'configuration.backupStorageLocation.bucket': backupContainerName
      'configuration.backupStorageLocation.config.storageAccount': storageAccountName
      'configuration.backupStorageLocation.config.resourceGroup': backupResourceGroupName
      'configuration.backupStorageLocation.config.subscriptionId': subscription().subscriptionId
      'credentials.tenantId': subscription().tenantId
    }
  }
  dependsOn: [
    backupContainer
  ]
}

output aksClusterId string = aksCluster.id
output backupVaultId string = backupVault.id

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

- [Restore Azure Kubernetes Service cluster using PowerShell](azure-kubernetes-service-cluster-restore-using-powershell.md)
- [Manage Azure Kubernetes Service cluster backups](azure-kubernetes-service-cluster-manage-backups.md)
- [About Azure Kubernetes Service cluster backup](azure-kubernetes-service-cluster-backup-concept.md)
