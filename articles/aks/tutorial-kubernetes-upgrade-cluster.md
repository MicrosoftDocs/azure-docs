---
title: Kubernetes on Azure tutorial - update cluster
description: Kubernetes on Azure tutorial - update cluster
services: container-service
author: iainfoulds
manager: jeconnoc

ms.service: container-service
ms.topic: tutorial
ms.date: 06/29/2018
ms.author: iainfou
ms.custom: mvc
---

# Tutorial: Upgrade Kubernetes in Azure Kubernetes Service (AKS)

An Azure Kubernetes Service (AKS) cluster can be upgraded using the Azure CLI. To minimize disruption to running applications, Kubernetes nodes are carefully [cordoned and drained][kubernetes-drain] during the upgrade process.

In this tutorial, part seven of seven, a Kubernetes cluster is upgraded. Tasks that you complete include:

> [!div class="checklist"]
> * Identify current and available Kubernetes versions
> * Upgrade the Kubernetes nodes
> * Validate a successful upgrade

## Before you begin

In previous tutorials, an application was packaged into a container image, this image uploaded to Azure Container Registry, and a Kubernetes cluster created. The application was then run on the Kubernetes cluster.

If you have not done these steps, and would like to follow along, return to the [Tutorial 1 – Create container images][aks-tutorial-prepare-app].

## Get cluster versions

Before upgrading a cluster, use the [az aks get-upgrades][] command to check which Kubernetes releases are available for upgrade.

```azurecli
az aks get-upgrades --name myAKSCluster --resource-group myResourceGroup --output table
```

In the following example, the current node version is *1.9.6*, and the available versions are shown under the *Upgrades* column.

```
Name     ResourceGroup    MasterVersion    NodePoolVersion    Upgrades
-------  ---------------  ---------------  -----------------  ----------
default  myResourceGroup  1.9.6            1.9.6              1.10.3
```

## Upgrade cluster

Use the [az aks upgrade][] command to upgrade the cluster nodes. The following example updates the cluster to version *1.10.3*.

```azurecli
az aks upgrade --name myAKSCluster --resource-group myResourceGroup --kubernetes-version 1.10.3
```

The following condensed example output shows the *kubernetesVersion* now reports *1.10.3*:

```json
{
  "agentPoolProfiles": [
    {
      "count": 3,
      "maxPods": 110,
      "name": "nodepool1",
      "osType": "Linux",
      "storageProfile": "ManagedDisks",
      "vmSize": "Standard_DS1_v2",
    }
  ],
  "dnsPrefix": "myAKSClust-myResourceGroup-19da35",
  "enableRbac": false,
  "fqdn": "myaksclust-myresourcegroup-19da35-bd54a4be.hcp.eastus.azmk8s.io",
  "id": "/subscriptions/<Subscription ID>/resourcegroups/myResourceGroup/providers/Microsoft.ContainerService/managedClusters/myAKSCluster",
  "kubernetesVersion": "1.10.3",
  "location": "eastus",
  "name": "myAKSCluster",
  "type": "Microsoft.ContainerService/ManagedClusters"
}
```

## Validate upgrade

Confirm that the upgrade was successful with the [az aks show][] command.

```azurecli
az aks show --name myAKSCluster --resource-group myResourceGroup --output table
```

Output:

```json
Name          Location    ResourceGroup    KubernetesVersion    ProvisioningState    Fqdn
------------  ----------  ---------------  -------------------  -------------------  ----------------------------------------------------------------
myAKSCluster  eastus      myResourceGroup  1.10.3               Succeeded            myaksclust-myresourcegroup-19da35-bd54a4be.hcp.eastus.azmk8s.io
```

## Next steps

In this tutorial, you upgraded Kubernetes in an AKS cluster. The following tasks were completed:

> [!div class="checklist"]
> * Identify current and available Kubernetes versions
> * Upgrade the Kubernetes nodes
> * Validate a successful upgrade

Follow this link to learn more about AKS.

> [!div class="nextstepaction"]
> [AKS overview][aks-intro]

<!-- LINKS - external -->
[kubernetes-drain]: https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/

<!-- LINKS - internal -->
[aks-intro]: ./intro-kubernetes.md
[aks-tutorial-prepare-app]: ./tutorial-kubernetes-prepare-app.md
[az aks show]: /cli/azure/aks#az-aks-show
[az aks get-upgrades]: /cli/azure/aks#az-aks-get-upgrades
[az aks upgrade]: /cli/azure/aks#az-aks-upgrade