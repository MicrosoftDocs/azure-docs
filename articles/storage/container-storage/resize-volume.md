---
title: Resize persistent volumes in Azure Container Storage Preview without downtime
description: Resize persistent volumes in Azure Container Storage without downtime. Scale up by expanding volumes backed by Azure Disk and local storage pools.
author: khdownie
ms.service: azure-container-storage
ms.topic: how-to
ms.date: 03/12/2024
ms.author: kendownie
---

# Resize persistent volumes in Azure Container Storage Preview

You can expand persistent volumes in [Azure Container Storage](container-storage-introduction.md) to scale up quickly and without downtime. Shrinking persistent volumes isn't currently supported.

You can't expand a volume beyond the size limits of your storage pool. However, you can expand the storage pool if you're using [Azure Disks](use-container-storage-with-managed-disks.md#expand-a-storage-pool) or [Ephemeral Disk](use-container-storage-with-local-disk.md#expand-a-storage-pool), and then expand a volume.

## Prerequisites

- This article requires version 2.0.64 or later of the Azure CLI. See [How to install the Azure CLI](/cli/azure/install-azure-cli). If you're using Azure Cloud Shell, the latest version is already installed. If you plan to run the commands locally instead of in Azure Cloud Shell, be sure to run them with administrative privileges.
- You'll need an Azure Kubernetes Service (AKS) cluster with a node pool of at least three virtual machines (VMs) for the cluster nodes, each with a minimum of four virtual CPUs (vCPUs).
- This article assumes you've already installed Azure Container Storage on your AKS cluster, and that you've created a storage pool and persistent volume claim (PVC) using either [Azure Disks](use-container-storage-with-managed-disks.md) or [ephemeral disk (local storage)](use-container-storage-with-local-disk.md). Azure Elastic SAN doesn't support resizing volumes or storage pools.

## Expand a volume

Follow these instructions to resize a persistent volume. A built-in storage class supports volume expansion, so be sure to reference a PVC previously created by an Azure Container Storage storage class. For example, if you created the PVC for Azure Disks, it might be called `azurediskpvc`.

1. Run the following command to expand the PVC by increasing the `spec.resources.requests.storage` field. Replace `<pvc-name>` with the name of your PVC. Replace `<size-in-Gi>` with the new size, for example 100Gi.
   
   ```azurecli-interactive
   kubectl patch pvc <pvc-name> --type merge --patch '{"spec": {"resources": {"requests": {"storage": "<size-in-Gi>"}}}}'
   ```
   
1. Check the PVC to make sure the volume is expanded:
   
   ```azurecli-interactive
   kubectl describe pvc <pvc-name>
   ```
   
The output should reflect the new size.

## See also

- [What is Azure Container Storage?](container-storage-introduction.md)
