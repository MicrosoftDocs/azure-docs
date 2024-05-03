---
title: Use Generation 2 virtual machines in Azure Kubernetes Service (AKS)
description: Learn how to use Generation 2 virtual machines on Windows and Linux node pools in Azure Kubernetes Service (AKS).
ms.topic: article
ms.custom: azure-kubernetes-service
ms.date: 05/03/2024
ms.author: schaffererin
author: schaffererin
---

# Use generation 2 virtual machines in Azure Kubernetes Service (AKS)

Azure supports [Generation 2 (Gen 2) virtual machines (VMs)](../virtual-machines/generation-2.md). Generation 2 VMs support key features not supported in Generation 1 (Gen 1) VMs, including increased memory, Intel Software Guard Extensions (Intel SGX), and virtualized persistent memory (vPMEM).

Generation 2 VMs use the new UEFI-based boot architecture rather than the BIOS-based architecture used by Generation 1 VMs. Only specific SKUs and sizes support Generation 2 VMs. Check the [list of supported sizes](../virtual-machines/generation-2.md#generation-2-vm-sizes) to see if your SKU supports or requires Generation 2.

Additionally, not all VM images support Generation 2 VMs. On AKS, Generation 2 VMs use the AKS Ubuntu 22.04 or 18.04 image or the AKS Windows Server 2022 image. These images support all Generation 2 SKUs and sizes.

## Default behavior for supported vm sizes

There are three scenarios when creating a node pool with a supported VM size:

1. If the VM size supports only Generation 1, the default behavior for both Linux and Windows node pools is to use the Generation 1 node image.
2. If the VM size supports only Generation 2, the default behavior for both Linux and Windows node pools is to use the Generation 2 node image.
3. If the VM size supports both Generation 1 and Generation 2, the default behavior for Linux and Windows differs. Linux uses the Generation 2 node image, and Windows uses Generation 1 image. To use the Generation 2 node image, see [Create a Windows node pool with a Generation 2 VM](#create-a-node-pool-with-a-generation-2-vm).

## Check available Generation 2 VM sizes

Check available Generation 2 VM sizes using the [`az vm list-skus`][az-vm-list-skus] command.

```azurecli-interactive
az vm list-skus --location <location> --size <vm-size> --output table
```

## Create a node pool with a Generation 2 VM

### [Linux node pool](#tab/linux-node-pool)

By default, Linux uses the Generation 2 node image unless the VM size doesn't support Generation 2.

Create a Linux node pool with a Generation 2 VM using the default [node pool creation][create-node-pools] process.

### [Windows node pool](#tab/windows-node-pool)

By default, Windows uses the Generation 1 node image unless the VM size doesn't support Generation 1.

Create a Windows node pool with a Generation 2 VM using the [`az aks nodepool add`][az-aks-nodepool-add] command. To specify that you want to use Generation 2, add a custom header `--aks-custom-headers UseWindowsGen2VM=true`. Generation 2 VM also requires Windows Server 2022.

```azurecli-interactive
az aks nodepool add --resource-group <resource-group-name> --cluster-name <cluster-name> --name <node-pool-name> --vm-size <supported-generation-2-vm-size> --os-type Windows --os-sku Windows2022 --aks-custom-headers UseWindowsGen2VM=true
```

---

## Update an existing node pool to use a Generation 2 VM

### [Linux node pool](#tab/linux-node-pool)

If you're using a VM size that only supports Generation 1, you can update your node pool to a vm size that supports Generation 2 using the [`az aks nodepool update`][az-aks-nodepool-update] command. This update changes your node image from Generation 1 to Generation 2.

```azurecli-interactive
az aks nodepool update --resource-group <resource-group-name> --cluster-name <cluster-name> --name <node-pool-name> --vm-size <supported-generation-2-vm-size> --os-type Linux
```

### [Windows node pool](#tab/windows-node-pool)

If you're using a Generation 1 image, you can update your node pool to use Generation 2 by selecting a VM size that supports Generation 2 using the [`az aks nodepool update`][az-aks-nodepool-update] command. To specify that you want to use Generation 2, add a custom header `--aks-custom-headers UseWindowsGen2VM=true`. Generation 2 VM also requires Windows Server 2022. This update changes your node image from Generation 1 to Generation 2.

```azurecli-interactive
az aks nodepool update --resource-group <resource-group-name> --cluster-name <cluster-name> --name <node-pool-name> --vm-size <supported-generation-2-vm-size> --os-type Windows --os-sku Windows2022 --aks-custom-headers UseWindowsGen2VM=true
```
---

## Check if you're using a Generation 2 node image

Verify a successful node pool creation using the [`az aks nodepool show`][az-aks-nodepool-show] command and check that the `nodeImageVersion` contains `gen2` in the output.

```azurecli-interactive
az aks nodepool show --resource-group <resource-group-name> --cluster-name <cluster-name> --name <node-pool-name>
```

## Next steps

To learn more about Generation 2 VMs, see [Support for Generation 2 VMs on Azure](../virtual-machines/generation-2.md).

<!-- LINKS -->
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az_aks_nodepool_add
[az-aks-nodepool-show]: /cli/azure/aks/nodepool#az_aks_nodepool_show
[az-aks-nodepool-update]: /cli/azure/aks/nodepool#az_aks_nodepool_update
[create-node-pools]: ./create-node-pools.md
[az-vm-list-skus]: /cli/azure/vm#az_vm_list_skus
