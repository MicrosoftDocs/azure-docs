---
title: "Azure Operator Nexus - Example of clusterManager.parameters.jsonc template file"
description: Example of clusterManager.parameters.jsonc template file to use with ARM template in creating a cluster manager.
author: jeffreymason
ms.author: jeffreymason
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 05/08/2024
ms.custom: template-how-to
---

# Example of clusterManager.parameters.jsonc template file.

```clusterManager.parameters.jsonc

{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "name": {
      "value": "$CLUSTER_MANAGER_NAME"
    },
    "resourceGroupName": {
      "value": "$CLUSTER_MANAGER_RG"
    },
    "managedResourceGroupName": {
      "value": "$MRG_NAME"
    },
    "fabricControllerId": {
      "value": "$NFC_ID"
    },
    "vmSize": {
      "value": "$VM_SIZE"
    },
    "clusterManagerTags": {
      "value": {
        "EnableClusterManagerInfraServices": "true",
        "EnableFabricAssignRoleIntegration": "true"
      }
    },
    "environment": {
      "value": "$CLUSTER_MANAGER_NAME"
    },
    "location": {
      "value": "$LOCATION"
    }
  }
}
```
