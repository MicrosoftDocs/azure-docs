---
title: Azure Resource Manager template samples for targets and capabilities in Azure Chaos Studio
description: Sample Azure Resource Manager templates to onboard resources to Azure Chaos Studio using targets and capabilities
services: chaos-studio
author: prasha-microsoft 
ms.topic: sample
ms.date: 11/10/2021
ms.author: prashabora
ms.service: chaos-studio
ms.custom: devx-track-arm-template
---

# Resource Manager template samples for targets and capabilities in Azure Chaos Studio
This article includes sample [Azure Resource Manager templates](../azure-resource-manager/templates/syntax.md) to create [targets and capabilities](chaos-studio-targets-capabilities.md) in order to onboard a resource to Azure Chaos Studio. Each sample includes a template file and a parameters file with sample values to provide to the template.

## Onboard service-direct target and capabilities (single capability)

In this sample, we onboard an Azure Cosmos DB instance using [targets and capabilities](chaos-studio-targets-capabilities.md). The template can be modified for any service-direct target and capabilities by referencing the [fault library](chaos-studio-fault-library.md).

### Template file

```json
{
  "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "resourceName": {
      "type": "string",
      "metadata": {
        "description": "The name of the resource being enabled."
      }
    },
    "resourceGroup": {
      "type": "string",
      "metadata": {
        "description": "The name of the resource group where the resource being enabled is located."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location"
      }
    }
  },
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.DocumentDB/databaseAccounts/providers/targets",
      "apiVersion": "2021-09-15-preview",
      "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-CosmosDB')]",
      "location": "[parameters('location')]",
      "properties": {}
    },
    {
      "type": "Microsoft.DocumentDB/databaseAccounts/providers/targets/capabilities",
      "apiVersion": "2021-09-15-preview",
      "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-CosmosDB/Failover-1.0')]",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[concat(resourceId('Microsoft.DocumentDB/databaseAccounts', parameters('resourceName')), '/', 'providers/Microsoft.Chaos/targets/Microsoft-CosmosDB')]"
      ],
      "properties": {}
    }
  ],
  "outputs": {}
}
```

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
      "resourceName": {
        "value": "my-cosmos-db"
      },
      "resourceGroup": {
        "value": "my-rg"
      }
  }
}
```

## Onboard service-direct target and capabilities (multiple capabilities)

In this sample, we onboard an Azure Kubernetes Service cluster using [targets and capabilities](chaos-studio-targets-capabilities.md).

### Template file

```json
{
  "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "resourceName": {
      "type": "string",
      "metadata": {
        "description": "The name of the resource being enabled."
      }
    },
    "resourceGroup": {
      "type": "string",
      "metadata": {
        "description": "The name of the resource group where the resource being enabled is located."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location"
      }
    }
  },
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.ContainerService/managedClusters/providers/targets",
      "apiVersion": "2021-09-15-preview",
      "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-AzureKubernetesServiceChaosMesh')]",
      "location": "[parameters('location')]",
      "properties": {}
    },
    {
      "type": "Microsoft.ContainerService/managedClusters/providers/targets/capabilities",
      "apiVersion": "2021-09-15-preview",
      "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-AzureKubernetesServiceChaosMesh/NetworkChaos-2.1')]",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[concat(resourceId('Microsoft.ContainerService/managedClusters', parameters('resourceName')), '/', 'providers/Microsoft.Chaos/targets/Microsoft-AzureKubernetesServiceChaosMesh')]"
      ],
      "properties": {}
    },
    {
      "type": "Microsoft.ContainerService/managedClusters/providers/targets/capabilities",
      "apiVersion": "2021-09-15-preview",
      "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-AzureKubernetesServiceChaosMesh/PodChaos-2.1')]",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[concat(resourceId('Microsoft.ContainerService/managedClusters', parameters('resourceName')), '/', 'providers/Microsoft.Chaos/targets/Microsoft-AzureKubernetesServiceChaosMesh')]"
      ],
      "properties": {}
    },
    {
      "type": "Microsoft.ContainerService/managedClusters/providers/targets/capabilities",
      "apiVersion": "2021-09-15-preview",
      "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-AzureKubernetesServiceChaosMesh/StressChaos-2.1')]",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[concat(resourceId('Microsoft.ContainerService/managedClusters', parameters('resourceName')), '/', 'providers/Microsoft.Chaos/targets/Microsoft-AzureKubernetesServiceChaosMesh')]"
      ],
      "properties": {}
    },
    {
      "type": "Microsoft.ContainerService/managedClusters/providers/targets/capabilities",
      "apiVersion": "2021-09-15-preview",
      "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-AzureKubernetesServiceChaosMesh/IOChaos-2.1')]",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[concat(resourceId('Microsoft.ContainerService/managedClusters', parameters('resourceName')), '/', 'providers/Microsoft.Chaos/targets/Microsoft-AzureKubernetesServiceChaosMesh')]"
      ],
      "properties": {}
    },
    {
      "type": "Microsoft.ContainerService/managedClusters/providers/targets/capabilities",
      "apiVersion": "2021-09-15-preview",
      "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-AzureKubernetesServiceChaosMesh/TimeChaos-2.1')]",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[concat(resourceId('Microsoft.ContainerService/managedClusters', parameters('resourceName')), '/', 'providers/Microsoft.Chaos/targets/Microsoft-AzureKubernetesServiceChaosMesh')]"
      ],
      "properties": {}
    },
    {
      "type": "Microsoft.ContainerService/managedClusters/providers/targets/capabilities",
      "apiVersion": "2021-09-15-preview",
      "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-AzureKubernetesServiceChaosMesh/KernelChaos-2.1')]",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[concat(resourceId('Microsoft.ContainerService/managedClusters', parameters('resourceName')), '/', 'providers/Microsoft.Chaos/targets/Microsoft-AzureKubernetesServiceChaosMesh')]"
      ],
      "properties": {}
    },
    {
      "type": "Microsoft.ContainerService/managedClusters/providers/targets/capabilities",
      "apiVersion": "2021-09-15-preview",
      "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-AzureKubernetesServiceChaosMesh/DNSChaos-2.1')]",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[concat(resourceId('Microsoft.ContainerService/managedClusters', parameters('resourceName')), '/', 'providers/Microsoft.Chaos/targets/Microsoft-AzureKubernetesServiceChaosMesh')]"
      ],
      "properties": {}
    },
    {
      "type": "Microsoft.ContainerService/managedClusters/providers/targets/capabilities",
      "apiVersion": "2021-09-15-preview",
      "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-AzureKubernetesServiceChaosMesh/HTTPChaos-2.1')]",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[concat(resourceId('Microsoft.ContainerService/managedClusters', parameters('resourceName')), '/', 'providers/Microsoft.Chaos/targets/Microsoft-AzureKubernetesServiceChaosMesh')]"
      ],
      "properties": {}
    }
  ],
  "outputs": {}
}
```

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
      "resourceName": {
        "value": "my-aks-cluster"
      },
      "resourceGroup": {
        "value": "my-rg"
      }
  }
}
```

## Next steps

* [Learn more about Chaos Studio](chaos-studio-overview.md).
* [Learn more about targets and capabilities](chaos-studio-targets-capabilities.md).
