---
title: Used mixed SKU node pools in Azure Kubernetes Services (AKS)
description: Learn about creating node pools with multiple VM types in an AKS cluster.
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 07/26/2024
ms.author: wilsondarko
author: wdarko1
#Customer intent: As a cluster operator or developer, I want to learn how to enable my cluster to create node pools with multiple VM types.
---

# Use mixed SKU node pools (preview) in Azure Kubernetes Services (AKS)

When you deploy a workload onto Azure Kubernetes Services (AKS), each node pool typically can only contain one virtual machine (VM) type or SKU. Mixed SKU node pools allow you to add multiple [VM SKUs][vm-SKU] to a single node pool without losing performance, quality, or certain feature support. Mixed SKU node pools allow you to specify a family of SKUs without the need to maintain one node pool per SKU type, reducing the node pool footprint.

## Prerequisites

- You need an Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
- Currently, the feature is in preview and you need to use API version >= 2023-10-02-preview, or install the az cli extension >= 2.61.0 version.
- If using the [Azure CLI][install azure cli], register the `aks-preview` extension or update the version of existing `aks-preview` to minimum version 4.0.0b4.
- The minimum minor Kubernetes version that supports this new node pool type is version 1.26.

### Install the aks-preview Azure CLI extension

[!INCLUDE [preview features callout](~/reusable-content/ce-skilling/azure/includes/aks/includes/preview/preview-callout.md)]

1. Install the aks-preview extension using the [`az extension add`][az extension add] command:

    ```azurecli-interactive
    az extension add --name aks-preview
    ```

2. Update to the latest version of the aks-preview extension using the [`az extension update`][az extension update] command.

    ```azurecli-interactive
    az extension update --name aks-preview
    ```

## Register the `VMsAgentPoolPreview` feature flag

1. Select the subscription where you want to enable the feature flag using the [`az account set`][az account set] command.

    ```azurecli-interactive
    az account set --subscription <subscription-name>
    ```

2. Register the `VMsAgentPoolPreview` feature flag using the [`az feature registration create`][az feature registration create] command.

    ```azurecli-interactive
    az feature registration create --namespace Microsoft.ContainerService --name VMsAgentPoolPreview
    ```

    It takes a few minutes for the status to show *Registered*.

3. Verify the registration status using the [`az feature show`][az feature show] command.

    ```azurecli-interactive
    az feature show --namespace "Microsoft.ContainerService" --name "VMsAgentPoolPreview"
    ```

4. When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider using the [`az provider register`][az provider register] command.

    ```azurecli-interactive
    az provider register --namespace "Microsoft.ContainerService"
    ```

## Limitations

- [Cluster autoscaler][cluster autoscaler] isn't available.
- [InifiniBand] isn't available.
- Windows node pool isn't supported.
- This feature isn't available in Azure portal. You can only manipulate or manage the pool using [Azure CLI][azure cli] or REST APIs.
- [Node pool snapshot][node pool snapshot] isn't supported.
- Certain preview features that work in the [Azure Virtual Machine Scale Sets][VMSS] node might not be supported with this mixed SKU node pool.
- All VM sizes selected in a node pool need to be from a similar VM family. For example, you can't mix an N-Series VM size with a D-Series VM size in the same node pool.

## Create an AKS cluster with mixed SKU node pools

> [!NOTE]
> Only *one* VM size is allowed in a scale profile, and the maximum limit is *five* VM scale profiles overall for a mixed SKU node pool.

- Create an AKS cluster with mixed SKU node pools using the [`az aks create`][az aks create] command with the `--vm-set-type` flag set to `"VirtualMachines"`.

    The following example creates a cluster named *myAKSCluster* with a mixed SKU node pool containing two nodes in the *myResourceGroup*, generates SSH keys, sets the load balancer SKU to *standard*, and sets the Kubernetes version to *1.28.5*:

    ```azurecli-interactive
    az aks create \
        --resource-group myResourceGroup \
        --name myAKSCluster \
        --vm-set-type "VirtualMachines" \
        --node-count 2 \
        --generate-ssh-keys \
        --load-balancer-sku standard \
        --kubernetes-version 1.28.5
    ```

## Add a mixed SKU node pool to an existing cluster

- Add a mixed SKU node pool to an existing cluster using the [`az aks nodepool add`][az aks nodepool add] command with the `--vm-set-type` flag set to `"Virtual Machines"`.

    The following example creates a mixed SKU node pool named *myvmpool* to the *myAKSCluster* cluster with three nodes and a maximum VM SKU of *Standard_D4s_v3*:

    ```azurecli-interactive
    az aks nodepool add \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --name myvmpool \
        --vm-set-type "VirtualMachines" \
        --vm-sizes "Standard_D4s_v3" \
        --node-count 3
    ```

## Add manual scale profile to a node pool

- Add a manual scale profile to a node pool using the [`az aks nodepool manual-scale add`][az aks nodepool manual-scale add] with the `--vm-sizes` flag set to `"Standard_D2s_v3"`.

    The following example adds a manual scale profile to node pool *myvmpool* in cluster *myAKSCluster* in resource group *myResourceGroup* with two nodes with a VM SKU of *Standard_D2s_v3*:

    ```azurecli-interactive
    az aks nodepool manual-scale add \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --name myvmpool1 \
        --vm-sizes "Standard_D2s_v3" \
        --node-count 2
     ```

## Update an existing manual scale profile

- Update an existing manual scale profile in a node pool using the [`az aks nodepool manual-scale update`][az aks nodepool manual-scale update] command with the `--vm-sizes` flag set to `"Standard_D2s_v3"`.

    > [!NOTE]
    > Use the `--current-vm-sizes` Azure CLI flag to specify the size of the existing node pool that you want to update. You can update `--vm-sizes` and/or `--node-count`. When using other tools or REST APIs, you need to pass in a full `agentPoolProfiles.virtualMachinesProfile.scale` field when updating the node pool scale profile.

    The following example updates a manual scale profile to the *myvmpool1* node pool in the *myAKSCluster* cluster in the *myResourceGroup* resource group with five nodes and changes the VM SKU from *Standard_D4s_v3* to *Standard_D8s_v3*:

    ```azurecli-interactive
    az aks nodepool manual-scale update \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --name myvmpool1 \
        --current-vm-sizes "Standard_D4s_v3" \
        --vm-sizes "Standard_D8s_v3" \
        --node-count 5
    ```

## Delete a manual scale profile

- Delete an existing manual scale profile using the [`az aks nodepool manual-scale delete`][az aks nodepool manual-scale delete] command.

    > [!NOTE]
    > Use the `--current-vm-sizes` Azure CLI flag to specify the size of the existing node pool that you want to delete. When using other tools or REST APIs, you need to pass in a full `agentPoolProfiles.virtualMachinesProfile.scale` field when updating the node pool scale profile.

    The following example deletes the manual scale profile using the *Standard_D8s_v3* VM SKU in the *myvmpool1* node pool in the *myAKSCluster* cluster in the *myResourceGroup* resource group.

    ```azurecli-interactive
    az aks nodepool manual-scale delete \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --name myvmpool1 \
        --current-vm-sizes "Standard_D8s_v3"
     ```

## Next steps

In this article, you learned how to use mixed SKU node pools in Azure Kubernetes Services (AKS). To learn more about node pools in AKS, see [Create node pools][create node pools].

<!-- EXTERNAL LINKS -->

<!-- INTERNAL LINKS -->
[install azure cli]: /cli/azure/install-azure-cli#install-azure-cli
[az provider register]: /cli/azure/provider#az-provider-register
[az feature show]: /cli/azure/feature#az-feature-show
[az extension add]: /cli/azure/extension#az-extention-add
[az feature registration create]: /cli/azure/feature/registration#az-feature-registration-create
[az aks get credentials]: /cli/azure/aks#az-aks-get-credentials
[az aks create]: /cli/azure/aks#az-aks-create
[az aks nodepool add]: /cli/azure/aks/nodepool#az-aks-nodepool-add
[az aks nodepool manual-scale add]: /cli/azure/aks/nodepool/manual-scale#az-aks-nodepool-manual-scale-add
[az aks nodepool manual-scale update]: /cli/azure/aks/nodepool/manual-scale#az-aks-nodepool-manual-scale-update
[az aks nodepool manual-scale delete]: /cli/azure/aks/nodepool/manual-scale#az-aks-nodepool-manual-scale-delete
[node pool snapshot]: node-pool-snapshot.md
[cluster autoscaler]: cluster-autoscaler-overview.md
[InifiniBand]: ../virtual-machines/extensions/enable-infiniband.md
[vm-SKU]: ../virtual-machines/sizes/overview.md
[VMSS]: ../virtual-machine-scale-sets/overview.md
[azure cli]: /cli/azure/get-started-with-azure-cli
[az extension update]: /cli/azure/extension#az-extension-update
[az account set]: /cli/azure/account#az-account-set
[create node pools]: create-node-pools.md
