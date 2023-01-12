---
title: Snapshot Azure Kubernetes Service (AKS) node pools
description: Learn how to snapshot AKS cluster node pools and create clusters and node pools from a snapshot.
ms.service: container-service
ms.topic: article
ms.date: 09/11/2020
ms.author: jpalma
author: palma21

---

# Azure Kubernetes Service (AKS) node pool snapshot

AKS releases a new node image weekly and every new cluster, new node pool, or upgrade cluster will always receive the latest image that can make it hard to maintain your environments consistent and to have repeatable environments.

Node pool snapshots allow you to take a configuration snapshot of your node pool and then create new node pools or new clusters based of that snapshot for as long as that configuration and kubernetes version is supported. For more information on the supportability windows, see [Supported Kubernetes versions in AKS][supported-versions].

The snapshot is an Azure resource that will contain the configuration information from the source node pool such as the node image version, kubernetes version, OS type, and OS SKU. You can then reference this snapshot resource and the respective values of its configuration to create any new node pool or cluster based off of it.

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli], [using Azure PowerShell][aks-quickstart-powershell], or [using the Azure portal][aks-quickstart-portal].

### Limitations

- Any node pool or cluster created from a snapshot must use a VM from the same virtual machine family as the snapshot, for example, you can't create a new N-Series node pool based of a snapshot captured from a D-Series node pool because the node images in those cases are structurally different.
- Snapshots must be created and used in the same region as the source node pool.

## Take a node pool snapshot

In order to take a snapshot from a node pool first you'll need the node pool resource ID, which you can get from the command below:

```azurecli-interactive
NODEPOOL_ID=$(az aks nodepool show --name nodepool1 --cluster-name myAKSCluster --resource-group myResourceGroup --query id -o tsv)
```

> [!IMPORTANT]
> Your AKS node pool must be created or upgraded after Nov 10th, 2021 in order for a snapshot to be taken from it.
> If you are using the `aks-preview` Azure CLI extension version `0.5.59` or newer, the commands for node pool snapshot have changed. For updated commands, see the [Node Pool Snapshot CLI reference][az-aks-nodepool-snapshot].

Now, to take a snapshot from the previous node pool you'll use the `az aks snapshot` CLI command.

```azurecli-interactive
az aks nodepool snapshot create --name MySnapshot --resource-group MyResourceGroup --nodepool-id $NODEPOOL_ID --location eastus
```

## Create a node pool from a snapshot

First you'll need the resource ID from the snapshot that was previously created, which you can get from the command below:

```azurecli-interactive
SNAPSHOT_ID=$(az aks nodepool snapshot show --name MySnapshot --resource-group myResourceGroup --query id -o tsv)
```

Now, we can use the command below to add a new node pool based off of this snapshot.

```azurecli-interactive
az aks nodepool add --name np2 --cluster-name myAKSCluster --resource-group myResourceGroup --snapshot-id $SNAPSHOT_ID
```

## Upgrading a node pool to a snapshot

You can upgrade a node pool to a snapshot configuration so long as the snapshot kubernetes version and node image version are more recent than the versions in the current node pool.

First you'll need the resource ID from the snapshot that was previously created, which you can get from the command below:

```azurecli-interactive
SNAPSHOT_ID=$(az aks nodepool snapshot show --name MySnapshot --resource-group myResourceGroup --query id -o tsv)
```

Now, we can use this command to upgrade this node pool to this snapshot configuration.

```azurecli-interactive
az aks nodepool upgrade --name nodepool1 --cluster-name myAKSCluster --resource-group myResourceGroup --snapshot-id $SNAPSHOT_ID
```

> [!NOTE]
> Your node pool image version will be the same contained in the snapshot and will remain the same throughout every scale operation. However, if this node pool is upgraded or a node image upgrade is performed without providing a snapshot-id the node image will be upgraded to latest.

## Create a cluster from a snapshot

When you create a cluster from a snapshot, the cluster original system pool will be created from the snapshot configuration.

First you'll need the resource ID from the snapshot that was previously created, which you can get from the command below:

```azurecli-interactive
SNAPSHOT_ID=$(az aks nodepool snapshot show --name MySnapshot --resource-group myResourceGroup --query id -o tsv)
```

Now, we can use this command to create this cluster off of the snapshot configuration.

```azurecli-interactive
az aks create --name myAKSCluster2 --resource-group myResourceGroup --snapshot-id $SNAPSHOT_ID
```

## Next steps

- See the [AKS release notes](https://github.com/Azure/AKS/releases) for information about the latest node images.
- Learn how to upgrade the Kubernetes version with [Upgrade an AKS cluster][upgrade-cluster].
- Learn how to upgrade you node image version with [Node Image Upgrade][node-image-upgrade]
- Learn more about multiple node pools and how to upgrade node pools with [Create and manage multiple node pools][use-multiple-node-pools].

<!-- LINKS - internal -->
[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[aks-quickstart-powershell]: ./learn/quick-kubernetes-deploy-powershell.md
[supported-versions]: supported-kubernetes-versions.md
[upgrade-cluster]: upgrade-cluster.md
[node-image-upgrade]: node-image-upgrade.md
[github-schedule]: node-upgrade-github-actions.md
[use-multiple-node-pools]: use-multiple-node-pools.md
[max-surge]: upgrade-cluster.md#customize-node-surge-upgrade
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-aks-nodepool-snapshot]:/cli/azure/aks/nodepool#az-aks-nodepool-add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-aks-install-cli]: /cli/azure/aks#az_aks_install_cli
[az-provider-register]: /cli/azure/provider#az_provider_register
