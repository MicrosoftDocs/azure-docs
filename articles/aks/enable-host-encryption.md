---
title: Enable host-based encryption on Azure Kubernetes Service (AKS)
description: Learn how to configure a host-based encryption in an Azure Kubernetes Service (AKS) cluster
services: container-service
ms.topic: article
ms.date: 07/10/2020

---

# Host-based encryption on Azure Kubernetes Service (AKS) (preview)

With host-based encryption, the data stored on the VM host of your AKS agent nodes' VMs is encrypted at rest and flows encrypted to the Storage service. This means the temp disks are encrypted at rest with platform-managed keys. The cache of OS and data disks is encrypted at rest with either platform-managed keys or customer-managed keys depending on the encryption type set on those disks. By default, when using AKS, OS and data disks are encrypted at rest with platform-managed keys, meaning that the caches for these disks are also by default encrypted at rest with platform-managed keys.  You can specify your own managed keys following [Bring your own keys (BYOK) with Azure disks in Azure Kubernetes Service](azure-disk-customer-managed-keys.md). The cache for these disks will then also be encrypted using the key that you specify in this step.


## Before you begin

This feature can only be set at cluster creation or node pool creation time.

> [!NOTE]
> Host-based encryption is available in [Azure regions][supported-regions] that support server side encryption of Azure managed disks and only with specific [supported VM sizes][supported-sizes].

### Prerequisites

- Ensure you have the `aks-preview` CLI extension v0.4.55 or higher installed
- Ensure you have the `EncryptionAtHost` feature flag under `Microsoft.Compute` enabled.
- Ensure you have the `EnableEncryptionAtHostPreview` feature flag under `Microsoft.ContainerService` enabled.

### Register `EncryptionAtHost`  preview features

To create an AKS cluster that uses host-based encryption, you must enable the `EnableEncryptionAtHostPreview` and `EncryptionAtHost` feature flags on your subscription.

Register the `EncryptionAtHost` feature flag using the [az feature register][az-feature-register] command as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.Compute" --name "EncryptionAtHost"

az feature register --namespace "Microsoft.ContainerService"  --name "EnableEncryptionAtHostPreview"
```

It takes a few minutes for the status to show *Registered*. You can check on the registration status using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.Compute/EncryptionAtHost')].{Name:name,State:properties.state}"

az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/EnableEncryptionAtHostPreview')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the `Microsoft.ContainerService` and `Microsoft.Compute` resource providers using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.Compute

az provider register --namespace Microsoft.ContainerService
```

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

### Install aks-preview CLI extension

To create an AKS cluster that host-based encryption, you need the latest *aks-preview* CLI extension. Install the *aks-preview* Azure CLI extension using the [az extension add][az-extension-add] command, or check for any available updates using the [az extension update][az-extension-update] command:

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

### Limitations

- Can only be enabled on new node pools or new clusters.
- Can only be enabled in [Azure regions][supported-regions] that support server-side encryption of Azure managed disks and only with specific [supported VM sizes][supported-sizes].
- Requires an AKS cluster and node pool based on Virtual Machine Scale Sets(VMSS) as *VM set type*.

## Use host-based encryption on new clusters (preview)

Configure the cluster agent nodes to use host-based encryption when the cluster is created. Use the `--aks-custom-headers` flag to set the `EnableEncryptionAtHost` header.

```azurecli-interactive
az aks create --name myAKSCluster --resource-group myResourceGroup -s Standard_DS2_v2 -l westus2 --aks-custom-headers EnableEncryptionAtHost=true
```

If you want to create clusters without host-based encryption, you can do so by omitting the custom `--aks-custom-headers` parameter.

## Use host-based encryption on existing clusters (preview)

You can enable host-based encryption on existing clusters by adding a new node pool to your cluster. Configure a new node pool to use host-based encryption by using the `--aks-custom-headers` flag.

```azurecli
az aks nodepool add --name hostencrypt --cluster-name myAKSCluster --resource-group myResourceGroup -s Standard_DS2_v2 -l westus2 --aks-custom-headers EnableEncryptionAtHost=true
```

If you want to create new node pools without the host-based encryption feature, you can do so by omitting the custom `--aks-custom-headers` parameter.

## Next steps

Review [best practices for AKS cluster security][best-practices-security]
Read more about [host-based encryption](../virtual-machines/linux/disk-encryption.md#encryption-at-host---end-to-end-encryption-for-your-vm-data).


<!-- LINKS - external -->

<!-- LINKS - internal -->
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[best-practices-security]: ./operator-best-practices-cluster-security.md
[supported-regions]: ../virtual-machines/linux/disk-encryption.md#supported-regions
[supported-sizes]: ../virtual-machines/linux/disk-encryption.md#supported-vm-sizes
[azure-cli-install]: /cli/azure/install-azure-cli
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-list]: /cli/azure/feature#az-feature-list
[az-provider-register]: /cli/azure/provider#az-provider-register
