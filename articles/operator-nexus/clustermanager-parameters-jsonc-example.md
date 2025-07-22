---
title: "Azure Operator Nexus - Example of clusterManager.parameters.jsonc template file"
description: Example of clusterManager.parameters.jsonc template file to use with ARM template in creating a Cluster Manager.
author: bartpinto
ms.author: bpinto
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 07/21/2025
ms.custom: template-how-to, devx-track-arm-template
---

# Example of clusterManager.parameters.jsonc template file.

```clusterManager.parameters.jsonc
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "name": {
      "value": "CM_NAME"
    },
    "resourceGroupName": {
      "value": "CM_GROUP"
    },
    "managedResourceGroupName": {
      "value": "CM_MRG"
    },
    "fabricControllerId": {
      "value": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/NFC_RG/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/NFC_NAME"
    },
    "vmSize": {
      "value": ""
    },
    "clusterManagerTags": {
      "value": {}
    },
    "environment": {
      "value": "CM_NAME"
    },
    "location": {
      "value": "REGION"
    }
  }
}
```
