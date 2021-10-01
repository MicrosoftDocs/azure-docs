---
title: Snapshot Azure Kubernetes Service (AKS) node pools (preview)
description: Learn how to snapshot AKS cluster node pools and create clusters and node pools from a snapshot.
ms.service: container-service
ms.topic: article
ms.date: 09/11/2020
ms.author: jpalma
author: palma21

---

# Azure Kubernetes Service (AKS) node pool snapshot (preview)

AKS releases a new node image weekly and every new cluster, new node pool, or upgrade cluster will always receive the latest image that can make it hard to maintain your environments consistent and to have repeatable environments.

Node pool snapshots allow you to take a configuration snapshot of your node pool and then create new node pools or new clusters based of that snapshot for as long as that configuration and kubernetes version is supported. For more information on the supportability windows, see [Supported Kubernetes versions in AKS](https://docs.microsoft.com/azure/aks/supported-kubernetes-versions).

The snapshot is an Azure resource that will contain the configuration information from the source node pool such as the node image version, kubernetes version, OS type, and OS SKU. You can then reference this snapshot resource and the respective values of its configuration to create any new node pool or cluster based off of it.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli] or [using the Azure portal][aks-quickstart-portal].

### Limitations

 - Any node pool or cluster created from a snapshot must use a VM from the same virtual machine family as the snapshot, for example, you can't create a new N-Series node pool based of a snapshot captured from a D-Series node pool because the node images in those cases are structurally different. 
 - During preview, snapshots must be created and used in the same region and subscription as the source node pool.

### Install aks-preview CLI extension

You also need the *aks-preview* Azure CLI extension version 0.5.30 or later. Install the *aks-preview* Azure CLI extension by using the [az extension add][az-extension-add] command. Or install any available updates by using the [az extension update][az-extension-update] command.

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

### Register the `SnapshotPreview` preview feature

To use the feature, you must also enable the `SnapshotPreview` feature flag on your subscription.

Register the `SnapshotPreview` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "SnapshotPreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'microsoft.ContainerService/SnapshotPreview')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Take a node pool snapshot

In order to take a snapshot from a node pool first you'll need the node pool resource ID, which you can get from the command below:

```azurecli-interactive
NODEPOOL_ID=$(az aks nodepool show --name nodepool1 --cluster-name myAKSCluster --resource-group myResourceGroup --query id -o tsv)
```

Now, to take a snapshot from the previous node pool you'll use the `az aks snapshot` CLI command.

```azurecli-interactive
az aks snapshot create --name MySnapshot --resource-group MyResourceGroup --source-nodepool-id $NODEPOOL_ID --location eastus
```

## Create a node pool from a snapshot

First you'll need the resource ID from the snapshot that was previously created, which you can get from the command below:

```azurecli-interactive
SNAPSHOT_ID=$(az aks snapshot show --name MySnapshot --resource-group myResourceGroup --query id -o tsv)
```

Now, we can use the command below to add a new node pool based off of this snapshot.

```azurecli-interactive
az aks nodepool add --name np2 --cluster-name myAKSCluster --resource-group myResourceGroup --snapshot-id $SNAPSHOT_ID
```

## Upgrading a node pool to a snapshot

You can upgrade a node pool to a snapshot configuration so long as the snapshot kubernetes version and node image version are more recent than the versions in the current node pool.

First you'll need the resource ID from the snapshot that was previously created, which you can get from the command below:

```azurecli-interactive
SNAPSHOT_ID=$(az aks snapshot show --name MySnapshot --resource-group myResourceGroup --query id -o tsv)
```

Now, we can use this command to upgrade this node pool to this snapshot configuration.

```azurecli-interactive
az aks nodepool upgrade --name nodepool1 --cluster-name myAKSCluster --resource-group myResourceGroup --snapshot-id $SNAPSHOT_ID
```

## Create a cluster from a snapshot

When you create a cluster from a snapshot, the cluster original system pool will be created from the snapshot configuration.

First you'll need the resource ID from the snapshot that was previously created, which you can get from the command below:

```azurecli-interactive
SNAPSHOT_ID=$(az aks snapshot show --name MySnapshot --resource-group myResourceGroup --query id -o tsv)
```

Now, we can use this command to create this cluster off of the snapshot configuration.

```azurecli-interactive
az aks cluster create --name myAKSCluster2 --resource-group myResourceGroup --snapshot-id $SNAPSHOT_ID
```

## Upgrading a node pool to a snapshot

You can upgrade a cluster to a snapshot configuration so long as the snapshot kubernetes version and node image version are more recent than the versions in all of the clusters current node pools.

First you'll need the resource ID from the snapshot that was previously created, which you can get from the command below:

```azurecli-interactive
SNAPSHOT_ID=$(az aks snapshot show --name MySnapshot --resource-group myResourceGroup --query id -o tsv)
```

Now, we can use this command to upgrade the all the cluster's node pools to this snapshot configuration.

```azurecli-interactive
az aks upgrade --name myAKSCluster --resource-group myResourceGroup --snapshot-id $SNAPSHOT_ID
```

## Next steps

- See the [AKS release notes](https://github.com/Azure/AKS/releases) for information about the latest node images.
- Learn how to upgrade the Kubernetes version with [Upgrade an AKS cluster][upgrade-cluster].
- Learn how to upgrade you node image version with [Node Image Upgrade][node-image-upgrade]
- Learn more about multiple node pools and how to upgrade node pools with [Create and manage multiple node pools][use-multiple-node-pools].
- 

<!-- LINKS - internal -->
[upgrade-cluster]: upgrade-cluster.md
[node-image-upgrade]: node-image-upgrade.md
[github-schedule]: node-upgrade-github-actions.md
[use-multiple-node-pools]: use-multiple-node-pools.md
[max-surge]: upgrade-cluster.md#customize-node-surge-upgrade
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update