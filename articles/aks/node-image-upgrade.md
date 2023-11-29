---
title: Upgrade Azure Kubernetes Service (AKS) node images
description: Learn how to upgrade the images on AKS cluster nodes and node pools.
ms.topic: article
ms.custom: devx-track-azurecli, devx-track-linux
ms.date: 03/28/2023
---

# Upgrade Azure Kubernetes Service (AKS) node images

Azure Kubernetes Service (AKS) regularly provides new node images, so it's beneficial to upgrade your node images frequently to use the latest AKS features. Linux node images are updated weekly, and Windows node images are updated monthly. Image upgrade announcements are included in the [AKS release notes](https://github.com/Azure/AKS/releases), and it can take up to a week for these updates to be rolled out across all regions. Node image upgrades can also be performed automatically and scheduled using planned maintenance. For more details, see [Automatically upgrade node images][auto-upgrade-node-image].

This article shows you how to upgrade AKS cluster node images and how to update node pool images without upgrading the Kubernetes version. For information on upgrading the Kubernetes version for your cluster, see [Upgrade an AKS cluster][upgrade-cluster].

> [!NOTE]
> The AKS cluster must use virtual machine scale sets for the nodes.
> 
> It's not possible to downgrade a node image version (for example *AKSUbuntu-2204 to AKSUbuntu-1804*, or *AKSUbuntu-2204-202308.01.0 to AKSUbuntu-2204-202307.27.0*).

## Check for available node image upgrades

Check for available node image upgrades using the [`az aks nodepool get-upgrades`][az-aks-nodepool-get-upgrades] command.

```azurecli-interactive
az aks nodepool get-upgrades \
    --nodepool-name mynodepool \
    --cluster-name myAKSCluster \
    --resource-group myResourceGroup
```

The output will show the `latestNodeImageVersion`, like in the following example:

```output
{
  "id": "/subscriptions/XXXX-XXX-XXX-XXX-XXXXX/resourcegroups/myResourceGroup/providers/Microsoft.ContainerService/managedClusters/myAKSCluster/agentPools/mynodepool/upgradeProfiles/default",
  "kubernetesVersion": "1.17.11",
  "latestNodeImageVersion": "AKSUbuntu-1604-2020.10.28",
  "name": "default",
  "osType": "Linux",
  "resourceGroup": "myResourceGroup",
  "type": "Microsoft.ContainerService/managedClusters/agentPools/upgradeProfiles",
  "upgrades": null
}
```

The example output shows `AKSUbuntu-1604-2020.10.28` as the `latestNodeImageVersion`.

Compare the latest version with your current node image version using the [`az aks nodepool show`][az-aks-nodepool-show] command.

```azurecli-interactive
az aks nodepool show \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mynodepool \
    --query nodeImageVersion
```

Your output should look similar to the following example:

```output
"AKSUbuntu-1604-2020.10.08"
```

In this example, there's an available node image version upgrade, which is from version `AKSUbuntu-1604-2020.10.08` to version `AKSUbuntu-1604-2020.10.28`.

## Upgrade all node images in all node pools

Upgrade the node image using the [`az aks upgrade`][az-aks-upgrade] command with the `--node-image-only` flag.

```azurecli-interactive
az aks upgrade \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --node-image-only
```

You can check the status of the node images using the `kubectl get nodes` command.

>[!NOTE]
> This command may differ slightly depending on the shell you use. See the [Kubernetes JSONPath documentation][kubernetes-json-path] for more information on Windows/PowerShell environments.

```bash
kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.metadata.labels.kubernetes\.azure\.com\/node-image-version}{"\n"}{end}'
```

When the upgrade is complete, use the [`az aks show`][az-aks-show] command to get the updated node pool details. The current node image is shown in the `nodeImageVersion` property.

```azurecli-interactive
az aks show \
    --resource-group myResourceGroup \
    --name myAKSCluster
```

## Upgrade a specific node pool

To update the OS image of a node pool without doing a Kubernetes cluster upgrade, use the [`az aks nodepool upgrade`][az-aks-nodepool-upgrade] command with the `--node-image-only` flag.

```azurecli-interactive
az aks nodepool upgrade \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mynodepool \
    --node-image-only
```

You can check the status of the node images with the `kubectl get nodes` command.

>[!NOTE]
> This command may differ slightly depending on the shell you use. See the [Kubernetes JSONPath documentation][kubernetes-json-path] for more information on Windows/PowerShell environments.

```bash
kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.metadata.labels.kubernetes\.azure\.com\/node-image-version}{"\n"}{end}'
```

When the upgrade is complete, use the [`az aks nodepool show`][az-aks-nodepool-show] command to get the updated node pool details. The current node image is shown in the `nodeImageVersion` property.

```azurecli-interactive
az aks nodepool show \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mynodepool
```

## Upgrade node images with node surge

To speed up the node image upgrade process, you can upgrade your node images using a customizable node surge value. By default, AKS uses one additional node to configure upgrades.

If you'd like to increase the speed of upgrades, use the [`az aks nodepool update`][az-aks-nodepool-update] command with the `--max-surge` flag to configure the number of nodes used for upgrades. To learn more about the trade-offs of various `--max-surge` settings, see [Customize node surge upgrade][max-surge].

```azurecli-interactive
az aks nodepool update \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mynodepool \
    --max-surge 33% \
    --no-wait
```

You can check the status of the node images with the `kubectl get nodes` command.

```bash
kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.metadata.labels.kubernetes\.azure\.com\/node-image-version}{"\n"}{end}'
```

Use `az aks nodepool show` to get the updated node pool details. The current node image is shown in the `nodeImageVersion` property.

```azurecli-interactive
az aks nodepool show \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mynodepool
```

## Next steps

- See the [AKS release notes](https://github.com/Azure/AKS/releases) for information about the latest node images.
- Learn how to upgrade the Kubernetes version with [Upgrade an AKS cluster][upgrade-cluster].
- [Automatically apply cluster and node pool upgrades with GitHub Actions][github-schedule].
- Learn more about multiple node pools with [Create multiple node pools][use-multiple-node-pools].

<!-- LINKS - external -->
[kubernetes-json-path]: https://kubernetes.io/docs/reference/kubectl/jsonpath/

<!-- LINKS - internal -->
[upgrade-cluster]: upgrade-aks-cluster.md
[github-schedule]: node-upgrade-github-actions.md
[use-multiple-node-pools]: create-node-pools.md
[max-surge]: upgrade-aks-cluster.md#customize-node-surge-upgrade
[auto-upgrade-node-image]: auto-upgrade-node-image.md
[az-aks-nodepool-get-upgrades]: /cli/azure/aks/nodepool#az_aks_nodepool_get_upgrades
[az-aks-nodepool-show]: /cli/azure/aks/nodepool#az_aks_nodepool_show
[az-aks-nodepool-upgrade]: /cli/azure/aks/nodepool#az_aks_nodepool_upgrade
[az-aks-nodepool-update]: /cli/azure/aks/nodepool#az_aks_nodepool_update
[az-aks-upgrade]: /cli/azure/aks#az_aks_upgrade
[az-aks-show]: /cli/azure/aks#az_aks_show
