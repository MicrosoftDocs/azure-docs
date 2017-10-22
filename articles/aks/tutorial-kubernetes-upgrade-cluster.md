---
title: Kubernertes on Azure tutorial - update cluster | Microsoft Docs
description: Kubernertes on Azure tutorial - update cluster
services: container-service
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: aks, azure-container-service
keywords: Docker, Containers, Micro-services, Kubernetes, DC/OS, Azure

ms.assetid: 
ms.service: container-service
ms.devlang: aurecli
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/24/2017
ms.author: nepeters
ms.custom: mvc
---

# Upgrade Kubernetes in Azure Container Service (AKS)

Kubernetes nodes in an Azure Container Service (AKS) cluster can be upgraded to a new version using the Azure CLI. During the upgrade process, nodes are carefully [cordoned and drained](https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/) to minimize disruption to running applications.

In this tutorial, part eight of eight, a Kubernetes cluster is upgraded. Tasks that you complete include:

> [!div class="checklist"]
> * Identify current and available Kubernetes version
> * Upgrade Kubernetes
> * Validate successful upgrade

## Before you begin

In previous tutorials, an application was packaged into a container image, this image uploaded to Azure Container Registry, and a Kubernetes cluster created. The application was then run on the Kubernetes cluster. 

If you have not done these steps, and would like to follow along, return to the [Tutorial 1 – Create container images](./tutorial-kubernetes-prepare-app.md).


## Get cluster versions

Before upgrading a cluster, use the `az aks get-versions` command to check which Kubernetes releases are available for upgrade.

```azurecli-interactive
az aks get-versions --name myK8sCluster --resource-group myResourceGroup --output table
```

Here you can see that the current `AgentPoolVersion` is `1.7.7` and that version `1.8.0` and `1.8.0` are avaliable.

```
Name          ResourceGroup    MasterVersion   MasterUpgrades  AgentPoolVersion   AgentPoolUpgrades
------------  ---------------  -------------   --------------  ----------------   -----------------
myK8sCluster  myResourceGroup  1.7.7           1.8.0, 1.8.1    1.7.7              1.8.0, 1.8.1
```

## Upgrade cluster

Use the `az aks upgrade` command to upgrade the cluster nodes. The following examples updates the cluster to version `1.8.1`.

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

## Validate upgrade

You can now confirm the upgrade was successful with the `az aks show` command.

```azurecli-interactive
az aks show --name myK8sCluster --resource-group myResourceGroup --output table
```

Output:

```json
<update>
```

## Next steps

In this tutorial, you upgraded Kubernetes in an AKS cluster. The following tasks were completed:

> [!div class="checklist"]
> * Identify current and available Kubernetes version
> * Upgrade Kubernetes
> * Validate successful upgrade

Follow this link to learn more about AKS.

> [!div class="nextstepaction"]
> [AKS overview](./intro-kubernetes.md)