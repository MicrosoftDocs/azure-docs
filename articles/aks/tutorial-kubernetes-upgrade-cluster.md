---
title: Kubernetes on Azure tutorial - Upgrade a cluster
description: In this Azure Kubernetes Service (AKS) tutorial, you learn how to upgrade an existing AKS cluster to the latest available Kubernetes version.
services: container-service
author: iainfoulds
manager: jeconnoc

ms.service: container-service
ms.topic: tutorial
ms.date: 08/14/2018
ms.author: iainfou
ms.custom: mvc

#Customer intent: As a developer or IT pro, I want to learn how to upgrade an Azure Kubernetes Service (AKS) cluster so that I can use the latest version of Kubernetes and features.
---

# Tutorial: Upgrade Kubernetes in Azure Kubernetes Service (AKS)

As part of the application and cluster lifecycle, you may wish to upgrade to the latest available version of Kubernetes and use new features. An Azure Kubernetes Service (AKS) cluster can be upgraded using the Azure CLI. To minimize disruption to running applications, Kubernetes nodes are carefully [cordoned and drained][kubernetes-drain] during the upgrade process.

In this tutorial, part seven of seven, a Kubernetes cluster is upgraded. You learn how to:

> [!div class="checklist"]
> * Identify current and available Kubernetes versions
> * Upgrade the Kubernetes nodes
> * Validate a successful upgrade

## Before you begin

In previous tutorials, an application was packaged into a container image, this image uploaded to Azure Container Registry, and a Kubernetes cluster created. The application was then run on the Kubernetes cluster. If you have not done these steps, and would like to follow along, return to the [Tutorial 1 – Create container images][aks-tutorial-prepare-app].

This tutorial requires that you are running the Azure CLI version 2.0.44 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

## Get available cluster versions

Before you upgrade a cluster, use the [az aks get-upgrades][] command to check which Kubernetes releases are available for upgrade:

```azurecli
az aks get-upgrades --resource-group myResourceGroup --name myAKSCluster --output table
```

In the following example, the current version is *1.9.6*, and the available versions are shown under the *Upgrades* column.

```
Name     ResourceGroup    MasterVersion    NodePoolVersion    Upgrades
-------  ---------------  ---------------  -----------------  ----------------------
default  myResourceGroup  1.9.9            1.9.9              1.10.3, 1.10.5, 1.10.6
```

## Upgrade a cluster

Use the [az aks upgrade][] command to upgrade the AKS cluster. The following example upgrades the cluster to Kubernetes version *1.10.6*.

> [!NOTE]
> You can only upgrade one minor version at a time. For example, you can upgrade from *1.9.6* to *1.10.3*, but cannot upgrade from *1.9.6* to *1.11.x* directly. To upgrade from *1.9.6* to *1.11.x*, first upgrade from *1.9.6* to *1.10.3*, then perform another upgrade from *1.10.3* to *1.11.x*.

```azurecli
az aks upgrade --resource-group myResourceGroup --name myAKSCluster --kubernetes-version 1.10.6
```

The following condensed example output shows the *kubernetesVersion* now reports *1.10.6*:

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
  "kubernetesVersion": "1.10.6",
  "location": "eastus",
  "name": "myAKSCluster",
  "type": "Microsoft.ContainerService/ManagedClusters"
}
```

## Validate an upgrade

Confirm that the upgrade was successful using the [az aks show][] command as follows:

```azurecli
az aks show --resource-group myResourceGroup --name myAKSCluster --output table
```

The following example output shows the AKS cluster runs *KubernetesVersion 1.10.6*:

```
Name          Location    ResourceGroup    KubernetesVersion    ProvisioningState    Fqdn
------------  ----------  ---------------  -------------------  -------------------  ----------------------------------------------------------------
myAKSCluster  eastus      myResourceGroup  1.10.6               Succeeded            myaksclust-myresourcegroup-19da35-bd54a4be.hcp.eastus.azmk8s.io
```

## Delete the cluster

As this is the last part of the tutorial series, you may want to delete the AKS cluster. As the Kubernetes nodes run on Azure virtual machines (VMs), they continue to incur charges even if you don't use the cluster. Use the [az group delete][az-group-delete] command to remove the resource group, container service, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```

> [!NOTE]
> When you delete the cluster, the Azure Active Directory service principal used by the AKS cluster is not removed. For steps on how to remove the service principal, see [AKS service principal considerations and deletion][sp-delete].

## Next steps

In this tutorial, you upgraded Kubernetes in an AKS cluster. You learned how to:

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
[azure-cli-install]: /cli/azure/install-azure-cli
[az-group-delete]: /cli/azure/group#az-group-delete
[sp-delete]: kubernetes-service-principal.md#additional-considerations
