---
title: Troubleshoot Azure Container Storage Preview
description: Troubleshoot common problems with Azure Container Storage, including installation and storage pool issues.
author: khdownie
ms.service: azure-container-storage
ms.date: 03/20/2024
ms.author: kendownie
ms.topic: how-to
---

# Troubleshoot Azure Container Storage Preview

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. Use this article to troubleshoot common issues with Azure Container Storage and find resolutions to problems.

## Troubleshoot installation issues

### Azure Container Storage fails to install

After running `az aks create`, you might see the message *Azure Container Storage failed to install. AKS cluster is created. Please run `az aks update` along with `--enable-azure-container-storage` to enable Azure Container Storage*.

This message means that Azure Container Storage wasn't installed, but your AKS cluster was created properly.

To install Azure Container Storage on the cluster and create a storage pool, run the following command. Replace `<cluster-name>` and `<resource-group>` with your own values. Replace `<storage-pool-type>` with `azureDisk`, `ephemeraldisk`, or `elasticSan`.

```azurecli-interactive
az aks update -n <cluster-name> -g <resource-group> --enable-azure-container-storage <storage-pool-type>
```

### Can't set storage pool type to NVMe

If you try to install Azure Container Storage with ephemeral disk, specifically with local NVMe on a cluster where the virtual machine (VM) SKU doesn't have NVMe drives, you get the following error message: *Cannot set --storage-pool-option as NVMe as none of the node pools can support ephemeral NVMe disk*.

To remediate, create a node pool with a VM SKU that has NVMe drives and try again. See [storage optimized VMs](../../virtual-machines/sizes-storage.md).

## Troubleshoot storage pool issues

To check the status of your storage pools, run `kubectl describe sp <storage-pool-name> -n acstor`. Here are some issues you might encounter.

### Elastic SAN creation fails

If you're trying to create an Elastic SAN storage pool, you might see the message *Azure Elastic SAN creation failed: Maximum possible number of Elastic SAN for the Subscription created already*. This means that you've reached the limit on the number of Elastic SAN resources that can be deployed in a region per subscription. You can check the limit here: [Elastic SAN scalability and performance targets](../elastic-san/elastic-san-scale-targets.md#elastic-san-scale-targets). Consider deleting any existing Elastic SAN resources on the subscription that are no longer being used, or try creating the storage pool in a different region.

### No block devices found

If you see this message, you're likely trying to create an ephemeral disk storage pool on a cluster where the VM SKU doesn't have NVMe drives.

To remediate, create a node pool with a VM SKU that has NVMe drives and try again. See [storage optimized VMs](../../virtual-machines/sizes-storage.md).

### Storage pool type already enabled

If you try to enable a storage pool type that's already enabled, you get the following message: *Invalid `--enable-azure-container-storage` value. Azure Container Storage is already enabled for storage pool type `<storage-pool-type>` in the cluster*. You can check if you have any existing storage pools created by running `kubectl get sp -n acstor`.

### Disabling a storage pool type

When disabling a storage pool type via `az aks update --disable-azure-container-storage <storage-pool-type>` or uninstalling Azure Container Storage via `az aks update --disable-azure-container-storage all`, if there's an existing storage pool of that type, you get the following message:

*Disabling Azure Container Storage for storage pool type `<storage-pool-type>` will forcefully delete all the storage pools of the same type and affect the applications using these storage pools. Forceful deletion of storage pools can also lead to leaking of storage resources which are being consumed. Do you want to validate whether any of the storage pools of type `<storage-pool-type>` are being used before disabling Azure Container Storage? (Y/n)*

If you select Y, an automatic validation runs to ensure that there are no persistent volumes created from the storage pool. Selecting n bypasses this validation and disables the storage pool type, deleting any existing storage pools and potentially affecting your application.

### Can't delete resource group containing AKS cluster

If you created an Elastic SAN storage pool, you might not be able to delete the resource group in which your AKS cluster is located.

To resolve this, sign in to the [Azure portal](https://portal.azure.com?azure-portal=true) and select **Resource groups**. Locate the resource group that AKS created (the resource group name starts with **MC_**). Select the SAN resource object within that resource group. Manually remove all volumes and volume groups. Then retry deleting the resource group that includes your AKS cluster.

## See also

- [Azure Container Storage FAQ](container-storage-faq.md)
