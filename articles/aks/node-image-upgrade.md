---
title: Upgrade Azure Kubernetes Service (AKS) node images
description: Learn how to upgrade the images on AKS cluster nodes and node pools.
ms.service: container-service
ms.topic: conceptual
ms.date: 11/25/2020
ms.author: jpalma
---

# Azure Kubernetes Service (AKS) node image upgrade

AKS supports upgrading the images on a node so you're up to date with the newest OS and runtime updates. AKS provides one new image per week with the latest updates, so it's beneficial to upgrade your node's images regularly for the latest features, including Linux or Windows patches. This article shows you how to upgrade AKS cluster node images and how to update node pool images without upgrading the version of Kubernetes.

For more information about the latest images provided by AKS, see the [AKS release notes](https://github.com/Azure/AKS/releases).

For information on upgrading the Kubernetes version for your cluster, see [Upgrade an AKS cluster][upgrade-cluster].

> [!NOTE]
> The AKS cluster must use virtual machine scale sets for the nodes.

## Check if your node pool is on the latest node image

You can see what is the latest node image version available for your node pool with the following command: 

```azurecli
az aks nodepool get-upgrades \
    --nodepool-name mynodepool \
    --cluster-name myAKSCluster \
    --resource-group myResourceGroup
```

In the output you can see the `latestNodeImageVersion` like on the example below:

```output
{
  "id": "/subscriptions/XXXX-XXX-XXX-XXX-XXXXX/resourcegroups/myResourceGroup/providers/Microsoft.ContainerService/managedClusters/myAKSCluster/agentPools/nodepool1/upgradeProfiles/default",
  "kubernetesVersion": "1.17.11",
  "latestNodeImageVersion": "AKSUbuntu-1604-2020.10.28",
  "name": "default",
  "osType": "Linux",
  "resourceGroup": "myResourceGroup",
  "type": "Microsoft.ContainerService/managedClusters/agentPools/upgradeProfiles",
  "upgrades": null
}
```

So for `nodepool1` the latest node image available is `AKSUbuntu-1604-2020.10.28`. You can now compare it with the current node image version in use by your node pool by running:

```azurecli
az aks nodepool show \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mynodepool \
    --query nodeImageVersion
```

An example output would be:

```output
"AKSUbuntu-1604-2020.10.08"
```

So in this example you could upgrade from the current `AKSUbuntu-1604-2020.10.08` image version to the latest version `AKSUbuntu-1604-2020.10.28`. 

## Upgrade all nodes in all node pools

Upgrading the node image is done with `az aks upgrade`. To upgrade the node image, use the following command:

```azurecli
az aks upgrade \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --node-image-only
```

During the upgrade, check the status of the node images with the following `kubectl` command to get the labels and filter out the current node image information:

```azurecli
kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.metadata.labels.kubernetes\.azure\.com\/node-image-version}{"\n"}{end}'
```

When the upgrade is complete, use `az aks show` to get the updated node pool details. The current node image is shown in the `nodeImageVersion` property.

```azurecli
az aks show \
    --resource-group myResourceGroup \
    --name myAKSCluster
```

## Upgrade a specific node pool

Upgrading the image on a node pool is similar to upgrading the image on a cluster.

To update the OS image of the node pool without doing a Kubernetes cluster upgrade, use the `--node-image-only` option in the following example:

```azurecli
az aks nodepool upgrade \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mynodepool \
    --node-image-only
```

During the upgrade, check the status of the node images with the following `kubectl` command to get the labels and filter out the current node image information:

```azurecli
kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.metadata.labels.kubernetes\.azure\.com\/node-image-version}{"\n"}{end}'
```

When the upgrade is complete, use `az aks nodepool show` to get the updated node pool details. The current node image is shown in the `nodeImageVersion` property.

```azurecli
az aks nodepool show \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mynodepool
```

## Upgrade node images with node surge

To speed up the node image upgrade process, you can upgrade your node images using a customizable node surge value. By default, AKS uses one additional node to configure upgrades.

If you'd like to increase the speed of upgrades, use the `--max-surge` value to configure the number of nodes to be used for upgrades so they complete faster. To learn more about the trade-offs of various `--max-surge` settings, see [Customize node surge upgrade][max-surge].

The following command sets the max surge value for performing a node image upgrade:

```azurecli
az aks nodepool upgrade \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mynodepool \
    --max-surge 33% \
    --node-image-only \
    --no-wait
```

During the upgrade, check the status of the node images with the following `kubectl` command to get the labels and filter out the current node image information:

```azurecli
kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.metadata.labels.kubernetes\.azure\.com\/node-image-version}{"\n"}{end}'
```

Use `az aks nodepool show` to get the updated node pool details. The current node image is shown in the `nodeImageVersion` property.

```azurecli
az aks nodepool show \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mynodepool
```

## Next steps

- See the [AKS release notes](https://github.com/Azure/AKS/releases) for information about the latest node images.
- Learn how to upgrade the Kubernetes version with [Upgrade an AKS cluster][upgrade-cluster].
- [Automatically apply cluster and node pool upgrades with GitHub Actions][github-schedule]
- Learn more about multiple node pools and how to upgrade node pools with [Create and manage multiple node pools][use-multiple-node-pools].

<!-- LINKS - internal -->
[upgrade-cluster]: upgrade-cluster.md
[github-schedule]: node-upgrade-github-actions.md
[use-multiple-node-pools]: use-multiple-node-pools.md
[max-surge]: upgrade-cluster.md#customize-node-surge-upgrade
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
