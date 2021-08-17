---
title: Enable host-based encryption on Azure Kubernetes Service (AKS)
description: Learn how to configure a host-based encryption in an Azure Kubernetes Service (AKS) cluster
services: container-service
ms.topic: article
ms.date: 04/26/2021 
ms.custom: devx-track-azurepowershell


---

# Host-based encryption on Azure Kubernetes Service (AKS)

With host-based encryption, the data stored on the VM host of your AKS agent nodes' VMs is encrypted at rest and flows encrypted to the Storage service. This means the temp disks are encrypted at rest with platform-managed keys. The cache of OS and data disks is encrypted at rest with either platform-managed keys or customer-managed keys depending on the encryption type set on those disks. By default, when using AKS, OS and data disks are encrypted at rest with platform-managed keys, meaning that the caches for these disks are also by default encrypted at rest with platform-managed keys.  You can specify your own managed keys following [Bring your own keys (BYOK) with Azure disks in Azure Kubernetes Service](azure-disk-customer-managed-keys.md). The cache for these disks will then also be encrypted using the key that you specify in this step.


## Before you begin

This feature can only be set at cluster creation or node pool creation time.

> [!NOTE]
> Host-based encryption is available in [Azure regions][supported-regions] that support server side encryption of Azure managed disks and only with specific [supported VM sizes][supported-sizes].

### Prerequisites


- Ensure you have the CLI extension v2.23 or higher version installed.


### Limitations

- Can only be enabled on new node pools.
- Can only be enabled in [Azure regions][supported-regions] that support server-side encryption of Azure managed disks and only with specific [supported VM sizes][supported-sizes].
- Requires an AKS cluster and node pool based on Virtual Machine Scale Sets(VMSS) as *VM set type*.

## Use host-based encryption on new clusters

Configure the cluster agent nodes to use host-based encryption when the cluster is created. 

```azurecli-interactive
az aks create --name myAKSCluster --resource-group myResourceGroup -s Standard_DS2_v2 -l westus2 --enable-encryption-at-host
```

If you want to create clusters without host-based encryption, you can do so by omitting the `--enable-encryption-at-host` parameter.

## Use host-based encryption on existing clusters

You can enable host-based encryption on existing clusters by adding a new node pool to your cluster. Configure a new node pool to use host-based encryption by using the `--enable-encryption-at-host` parameter.

```azurecli
az aks nodepool add --name hostencrypt --cluster-name myAKSCluster --resource-group myResourceGroup -s Standard_DS2_v2 -l westus2 --enable-encryption-at-host
```

If you want to create new node pools without the host-based encryption feature, you can do so by omitting the `--enable-encryption-at-host` parameter.

## Next steps

Review [best practices for AKS cluster security][best-practices-security]
Read more about [host-based encryption](../virtual-machines/disk-encryption.md#encryption-at-host---end-to-end-encryption-for-your-vm-data).


<!-- LINKS - external -->

<!-- LINKS - internal -->
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[best-practices-security]: ./operator-best-practices-cluster-security.md
[supported-regions]: ../virtual-machines/disk-encryption.md#supported-regions
[supported-sizes]: ../virtual-machines/disk-encryption.md#supported-vm-sizes
[azure-cli-install]: /cli/azure/install-azure-cli
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
