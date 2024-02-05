---
title: Move Azure Disk Persistent Volumes in Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn how to move a persistent volume between Azure Kubernetes Service clusters in the same or different subscription and in the same region. 
ms.topic: article
ms.date: 01/02/2024
---

# Move Azure Disk persistent volumes to same or different subscription

This article describes how to safely move Azure Disk persistent volumes from an Azure Kubernetes Service (AKS) cluster to another cluster in the same subscription or in a different subscription that are in the same region.

The sequence of steps to complete this move are:

* Confirm the Azure Disk resource state on the source AKS cluster is not in an **Attached** state to avoid data loss.
* Move the Azure Disk resource to the target resource group in the same or different subscription.
* Validate the Azure Disk resource move succeeded.
* Create the persistent volume (PV), persistent volume claim (PVC) and mount the moved disk as a volume on a pod on the target cluster  

## Before you begin

* You need an Azure [storage account][azure-storage-account].
* Make sure you have Azure CLI version 2.0.59 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* Review details and requirements about moving resources between different regions in [Move resources to a new resource group or subsription][move-resources-new-subscription-resource-group].
* You have an AKS cluster in the target subscription and the source cluster has persistent volumes with Azure Disks attached.

## Validate disk volume state

Preserving data is important while working with persistent volumes to avoid risk of data corruption, inconsistencies, or data loss. To prevent loss during the migration or move process, you first verify the disk volume is unattached by performing the following steps.

1. Identify the node resource group hosting the Azure managed disks using the [`az aks show`][az-aks-show] command and add the `--query nodeResourceGroup` parameter.

    ```azurecli-interactive
    az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv
    ```

   The output of the command resembles the following example:

    ```output
    MC_myResourceGroup_myAKSCluster_eastus
    ```

1. List the managed disks using the [`az disk list`][az-disk-list] command referencing the resource group returned in the previous step.

    ```azurecli-interactive
    az disk list --resource-group MC_myResourceGroup_myAKSCluster_eastus
    ```

    Review the list and note which disk volumes you plan to move to the other cluster. Also validate the disk state by looking for the `diskState` property. The output of the command is a condensed example.

    ```output
    {
    "LastOwnershipUpdateTime": "2023-04-25T15:09:19.5439836+00:00",
    "creationData": {
      "createOption": "Empty",
      "logicalSectorSize": 4096
    },
    "diskIOPSReadOnly": 3000,
    "diskIOPSReadWrite": 4000,
    "diskMBpsReadOnly": 125,
    "diskMBpsReadWrite": 1000,
    "diskSizeBytes": 1073741824000,
    "diskSizeGB": 1000,
    "diskState": "Unattached",
    ```

1. If `diskState` shows `Attached`, first verify if any workloads are still accessing the volume and stop them first. After a period of time, disk state will report `Unattached` and can then be moved.


<!-- LINKS - external -->

<!-- LINKS - internal -->
[move-resources-new-subscription-resource-group]: ../azure-resource-manager/management/move-resource-group-and-subscription.md
[az-aks-show]: /cli/azure/disk#az-disk-show
[az-disk-list]: /cli/azure/disk#az-disk-list