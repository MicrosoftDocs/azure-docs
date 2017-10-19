---
title: Upgrade an Azure Container Service (AKS) cluster | Microsoft Docs
description: Upgrade an Azure Container Service (AKS) cluster
services: container-service
documentationcenter: ''
author: gabrtv
manager: timlt
editor: ''
tags: aks, azure-container-service
keywords: Kubernetes, Docker, Containers, Microservices, Azure

ms.assetid:
ms.service: container-service
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/16/2017
ms.author: gamonroy
ms.custom: mvc

---

# Upgrade an Azure Container Service (AKS) cluster

Azure Container Service (AKS) makes it easy to perform common management tasks including scaling Kubernetes clusters.

## Upgrade an AKS cluster

Before upgrading a cluster, use the `az aks get-versions` command to check which Kubernetes releases are available for upgrade.

```azurecli-interactive
az aks get-versions --name myK8sCluster --resource-group myResourceGroup --output table
```

Output:

```
Name          ResourceGroup    MasterVersion   MasterUpgrades  AgentPoolVersion   AgentPoolUpgrades
------------  ---------------  -------------   --------------  ----------------   -----------------
myK8sCluster  myResourceGroup  1.7.7           1.8.0, 1.8.1    1.7.7              1.8.0, 1.8.1
```

We have two versions available for upgrade: 1.8.0 and 1.8.1.  We can use the `az aks upgrade` command to upgrade to the latest available version.  During the upgrade process, nodes are carefully [cordoned and drained](https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/) to minimize disruption to running applications.

```azurecli-interactive
az aks upgrade --name myK8sCluster --resource-group myResourceGroup --kubernetes-version 1.8.1
```

Output:

```json
{
  "id": "/subscriptions/4f48eeae-9347-40c5-897b-46af1b8811ec/resourcegroups/myResourceGroup/providers/Microsoft.ContainerService/managedClusters/myK8sCluster",
  "location": "westus2",
  "name": "myK8sCluster",
  "properties": {
    "accessProfiles": {
      "clusterAdmin": {
        "kubeConfig": "..."
      },
      "clusterUser": {
        "kubeConfig": "..."
      }
    },
    "agentPoolProfiles": [
      {
        "count": 1,
        "dnsPrefix": null,
        "fqdn": null,
        "name": "myK8sCluster",
        "osDiskSizeGb": null,
        "osType": "Linux",
        "ports": null,
        "storageProfile": "ManagedDisks",
        "vmSize": "Standard_D2_v2",
        "vnetSubnetId": null
      }
    ],
    "dnsPrefix": "myK8sClust-myResourceGroup-4f48ee",
    "fqdn": "myk8sclust-myresourcegroup-4f48ee-406cc140.hcp.westus2.azmk8s.io",
    "kubernetesVersion": "1.8.1",
    "linuxProfile": {
      "adminUsername": "azureuser",
      "ssh": {
        "publicKeys": [
          {
            "keyData": "..."
          }
        ]
      }
    },
    "provisioningState": "Succeeded",
    "servicePrincipalProfile": {
      "clientId": "e70c1c1c-0ca4-4e0a-be5e-aea5225af017",
      "keyVaultSecretRef": null,
      "secret": null
    }
  },
  "resourceGroup": "myResourceGroup",
  "tags": null,
  "type": "Microsoft.ContainerService/ManagedClusters"
}
```

You can now confirm the upgrade was successful with the `az aks show` command.

```azurecli-interactive
az aks show --name myK8sCluster --resource-group myResourceGroup --output table
```

## Next steps

Learn more about deploying and managing AKS with the AKS tutorials.

> [!div class="nextstepaction"]
> [AKS Tutorial](./tutorial-kubernetes-prepare-app.md)