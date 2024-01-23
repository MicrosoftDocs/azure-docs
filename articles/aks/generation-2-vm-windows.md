---
title: Use generation 2 virtual machines on Windows in Azure Kubernetes Service (AKS)
description: Learn how to use generation 2 virtual machines on Windows in Azure Kubernetes Service (AKS).
ms.topic: article
ms.custom: azure-kubernetes-service
ms.date: 01/23/2024
ms.author: schaffererin
author: schaffererin
---

# Use generation 2 virtual machines on Windows in Azure Kubernetes Service (AKS) (preview)

Azure supports [Generation 2 (Gen2) virtual machines (VMs)](../virtual-machines/generation-2.md). Gen 2 VMs support key features not supported in generation 1 (Gen1) VMs, including increased memory, Intel Software Guard Extensions (Intel SGX), and virtualized persistent memory (vPMEM).

Gen 2 VMs use the new UEFI-based boot architecture rather than the BIOS-based architecture used by gen 1 VMs. Only specific SKUs and sizes support Gen2 VMs. Check the [list of supported sizes](../virtual-machines/generation-2.md#generation-2-vm-sizes) to see if your SKU supports or requires Gen2.

Additionally, not all VM images support Gen2 VMs. On AKS, Gen2 VMs use the AKS Ubuntu 22.04 or 18.04 image or the AKS Windows Server 2022 image. These images support all Gen2 SKUs and sizes.

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

## Considerations

* Generation 2 VMs are supported on Windows for WS2022 only.
* Generation 2 VMs are default for Windows clusters greater than or equal to Kubernetes 1.25.
  * If your Kubernetes version is greater than 1.25, you only need to set the `vm_size` to get the generation 2 node pool. You can still use WS2019 generation 1 if you define that in the `os_sku`.
  * If your Kubernetes version is less than 1.25, you can set the `os_sku` to WS2022 and set the `vm_size` to generation 2 to get the generation 2 node pool.

## Before you begin

Before you begin, you need the following resources installed and configured:

* The Azure CLI version 2.44.0 or later. Run `az --version` to find the current version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].
* The `aks-preview` extension version 0.5.126 or later.
* The `AKSWindows2022Gen2Preview` feature flag registered on your subscription.

### Install the `aks-preview` Azure CLI extension

* Install or update the aks-preview Azure CLI extension using the [`az extension add`][az-extension-add] or the [`az extension update`][az-extension-update] command.

    ```azurecli-interactive
    # Install the aks-preview extension
    az extension add --name aks-preview

    # Update to the latest version of the aks-preview extension
    az extension update --name aks-preview
    ```

### Register the `AKSWindows2022Gen2Preview` feature flag

1. Register the `AKSWindows2022Gen2Preview` feature flag using the [`az feature register`][az-feature-register] command.

    ```azurecli-interactive
    az feature register --namespace "Microsoft.ContainerService" --name "AKSWindows2022Gen2Preview"
    ```

    It takes a few minutes for the status to show *Registered*.

2. Verify the registration using the [`az feature show`][az-feature-show] command.

    ```azurecli-interactive
    az feature show --namespace "Microsoft.ContainerService" --name "AKSWindows2022Gen2Preview"
    ```

3. When the status reflects *Registered*, refresh the registration of the `Microsoft.ContainerService` resource provider using the [`az provider register`][az-provider-register] command.

    ```azurecli-interactive
    az provider register --namespace "Microsoft.ContainerService"
    ```

## Create a Windows node pool with a generation 2 VM

1. Create a Windows node pool with a generation 2 VM using the [`az aks nodepool add`][az-aks-nodepool-add] command.

    ```azurecli-interactive
    az aks nodepool add --resource-group <resource-group-name> --cluster-name <cluster-name> --name <node-pool-name> --os-type Windows --os-sku Windows2022
    ```

2. Verify successful node pool creation using the [`az aks nodepool show`][az-aks-nodepool-show] command and check that the `nodeImageVersion` contains `gen2` in the output.

    ```azurecli-interactive
    az aks nodepool show --resource-group <resource-group-name> --cluster-name <cluster-name> --name <node-pool-name>
    ```

3. Check available generation 2 VM sizes using the [`az vm list`][az-vm-list] command.

    ```azurecli-interactive
    az vm list -skus --location <location> --size <vm-size> --output table
    ```

## Update a Windows node pool to a generation 2 VM

1. Update a Windows node pool to a generation 2 VM using the [`az aks nodepool update`][az-aks-nodepool-update] command.

    ```azurecli-interactive
    az aks nodepool update --resource-group <resource-group-name> --cluster-name <cluster-name> --name <node-pool-name> --os-type Windows --os-sku Windows2022
    ```

2. Verify successful node pool update using the [`az aks nodepool show`][az-aks-nodepool-show] command and check that the `nodeImageVersion` contains `gen2` in the output.

    ```azurecli-interactive
    az aks nodepool show --resource-group <resource-group-name> --cluster-name <cluster-name> --name <node-pool-name>
    ```

3. Check available generation 2 VM sizes using the [`az vm list`][az-vm-list] command.

    ```azurecli-interactive
    az vm list -skus --location <location> --size <vm-size> --output table
    ```

## Next steps

To learn more about generation 2 VMs, see [Support for generation 2 VMs on Azure](../virtual-machines/generation-2.md).

<!-- LINKS -->
[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az_aks_nodepool_add
[az-aks-nodepool-show]: /cli/azure/aks/nodepool#az_aks_nodepool_show
[az-aks-nodepool-update]: /cli/azure/aks/nodepool#az_aks_nodepool_update
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-show]: /cli/azure/feature#az_feature_show
[az-provider-register]: /cli/azure/provider#az_provider_register
[az-vm-list]: /cli/azure/vm#az_vm_list
