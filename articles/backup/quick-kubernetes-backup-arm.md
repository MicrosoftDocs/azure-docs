---
title: Quickstart - Configure vaulted backup for an Azure Kubernetes Service (AKS) cluster using Azure Backup via Azure Resource Manager
description: Learn how to quickly configure backup for a Kubernetes cluster using Azure Resource Manager.
ms.service: azure-backup
ms.topic: quickstart
ms.date: 05/31/2024
ms.custom: devx-track-terraform, devx-track-extended-azdevcli, ignite-2024
ms.reviewer: rajats
ms.author: v-abhmallick
author: AbhishekMallick-MS
---

# Quickstart: Configure backup for an Azure Kubernetes Service (AKS) cluster using Azure Resource Manager

This quickstart describes how to configure backup for an Azure Kubernetes Service (AKS) cluster using Azure Resource Manager.

Azure Backup for AKS is a cloud-native, enterprise-ready, application-centric backup service that lets you quickly configure backup for AKS clusters.[Azure Backup](backup-azure-mysql-flexible-server-about.md) allows you to back up your AKS clusters using multiple options - such as Azure portal, PowerShell, CLI, Azure Resource Manager, Bicep, and so on. This quickstart describes how to back up an AKS clusters with an Azure Resource Manager template and Azure PowerShell. For more information on developing ARM templates, see the [Azure Resource Manager documentation](../azure-resource-manager/index.yml) 

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

To set up your environment for Bicep development, see [Install Bicep tools](../azure-resource-manager/bicep/install.md).

>[!Note]
>Install the latest [Azure PowerShell module](/powershell/azure/new-azureps-module-az) and the Bicep CLI as detailed in article.

## Review the template

This template enables you to configure backup for an AKS cluster. In this template, we create a backup vault with a backup policy for the AKS cluster with a *four hourly* schedule and a *seven day* retention duration.

```JSON
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "resourceGroupName": { "type": "string" },
    "resourceGroupLocation": { "type": "string" },
    "backupResourceGroupName": { "type": "string" },
    "backupResourceGroupLocation": { "type": "string" },
    "aksClusterName": { "type": "string" },
    "dnsPrefix": { "type": "string" },
    "nodeCount": { "type": "int" },
    "backupVaultName": { "type": "string" },
    "datastoreType": { "type": "string" },
    "redundancy": { "type": "string" },
    "backupPolicyName": { "type": "string" },
    "backupExtensionName": { "type": "string" },
    "backupExtensionType": { "type": "string" },
    "storageAccountName": { "type": "string" }
  },
  "variables": {
    "backupContainerName": "tfbackup"
  },
  "resources": [
    {
      "type": "Microsoft.Resources/resourceGroups",
      "apiVersion": "2021-04-01",
      "location": "[parameters('resourceGroupLocation')]",
      "name": "[parameters('resourceGroupName')]"
    },
    {
      "type": "Microsoft.Resources/resourceGroups",
      "apiVersion": "2021-04-01",
      "location": "[parameters('backupResourceGroupLocation')]",
      "name": "[parameters('backupResourceGroupName')]"
    },
    {
      "type": "Microsoft.ContainerService/managedClusters",
      "apiVersion": "2023-05-01",
      "location": "[parameters('resourceGroupLocation')]",
      "name": "[parameters('aksClusterName')]",
      "properties": {
        "dnsPrefix": "[parameters('dnsPrefix')]",
        "agentPoolProfiles": [
          {
            "name": "agentpool",
            "count": "[parameters('nodeCount')]",
            "vmSize": "Standard_D2_v2",
            "type": "VirtualMachineScaleSets",
            "mode": "System"
          }
        ],
        "identity": {
          "type": "SystemAssigned"
        },
        "networkProfile": {
          "networkPlugin": "kubenet",
          "loadBalancerSku": "standard"
        }
      },
      "dependsOn": [
        "[resourceId('Microsoft.Resources/resourceGroups', parameters('resourceGroupName'))]",
        "[resourceId('Microsoft.Resources/resourceGroups', parameters('backupResourceGroupName'))]"
      ]
    },
    {
      "type": "Microsoft.DataProtection/backupVaults",
      "apiVersion": "2023-01-01",
      "location": "[parameters('resourceGroupLocation')]",
      "name": "[parameters('backupVaultName')]",
      "identity": {
        "type": "SystemAssigned"
      },
      "properties": {
        "dataStoreType": "[parameters('datastoreType')]",
        "redundancy": "[parameters('redundancy')]"
      },
      "dependsOn": [
        "[resourceId('Microsoft.ContainerService/managedClusters', parameters('aksClusterName'))]"
      ]
    },
    {
      "type": "Microsoft.DataProtection/backupVaults/backupPolicies",
      "apiVersion": "2023-01-01",
      "name": "[concat(parameters('backupVaultName'), '/', parameters('backupPolicyName'))]",
      "properties": {
        "backupRepeatingTimeIntervals": ["R/2024-04-14T06:33:16+00:00/PT4H"],

        "defaultRetentionRule": {
          "lifeCycle": {
            "duration": "P7D",
            "dataStoreType": "OperationalStore"
          }
        }
      },
      "dependsOn": [
        "[resourceId('Microsoft.DataProtection/backupVaults', parameters('backupVaultName'))]"
      ]
    },
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2022-05-01",
      "location": "[parameters('backupResourceGroupLocation')]",
      "name": "[parameters('storageAccountName')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "StorageV2",
      "dependsOn": [
        "[resourceId('Microsoft.ContainerService/managedClusters', parameters('aksClusterName'))]"
      ]
    },
    {
      "type": "Microsoft.Storage/storageAccounts/blobServices/containers",
      "apiVersion": "2021-04-01",
      "name": "[concat(parameters('storageAccountName'), '/default/', variables('backupContainerName'))]",
      "properties": {
        "publicAccess": "None"
      },
      "dependsOn": [
        "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
      ]
    },
    {
      "type": "Microsoft.KubernetesConfiguration/extensions",
      "apiVersion": "2023-05-01",
      "name": "[concat(parameters('aksClusterName'), '/', parameters('backupExtensionName'))]",
      "properties": {
        "extensionType": "[parameters('backupExtensionType')]",
        "configurationSettings": {
          "configuration.backupStorageLocation.bucket": "[variables('backupContainerName')]",
          "configuration.backupStorageLocation.config.storageAccount": "[parameters('storageAccountName')]",
          "configuration.backupStorageLocation.config.resourceGroup": "[parameters('backupResourceGroupName')]",
          "configuration.backupStorageLocation.config.subscriptionId": "[subscription().subscriptionId]",
          "credentials.tenantId": "[subscription().tenantId]"
        }
      },
      "dependsOn": [
        "[resourceId('Microsoft.Storage/storageAccounts/blobServices/containers', parameters('storageAccountName'), 'default', variables('backupContainerName'))]"
      ]
    }
  ],
  "outputs": {
    "aksClusterId": {
      "type": "string",
      "value": "[resourceId('Microsoft.ContainerService/managedClusters', parameters('aksClusterName'))]"
    },
    "backupVaultId": {
      "type": "string",
      "value": "[resourceId('Microsoft.DataProtection/backupVaults', parameters('backupVaultName'))]"
    }
  }
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

- [Restore Azure Kubernetes Service cluster using PowerShell](azure-kubernetes-service-cluster-restore-using-powershell.md)
- [Manage Azure Kubernetes Service cluster backups](azure-kubernetes-service-cluster-manage-backups.md)
- [About Azure Kubernetes Service cluster backup](azure-kubernetes-service-cluster-backup-concept.md)
