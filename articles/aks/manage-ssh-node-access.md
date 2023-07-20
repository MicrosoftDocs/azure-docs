---
title: Manage SSH access on Azure Kubernetes Service cluster nodes 
titleSuffix: Azure Kubernetes Service
description: Learn how to configure SSH on Azure Kubernetes Service (AKS) cluster nodes.
ms.topic: article
ms.date: 07/19/2023
---

# Manage SSH for secure access to Azure Kubernetes Service (AKS) nodes

This article describes how to manage disabling, enabling, and updating the SSH key on your AKS cluster.

## Before you begin

* You also need the Azure CLI version 2.0.64 or later installed and configured. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* The `aks-preview` Azure CLI extension version 0.5.111 or later for the Update SSH public key (preview feature). To learn how to install an Azure extension, see [How to install extensions][how-to-install-azure-extensions].
* This feature supports Linux, Windows, Mariner, CBLMariner, and Mariner node pools on new and existing clusters.

## Install the `aks-preview` Azure CLI extension

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

1. Install the aks-preview extension using the [`az extension add`][az-extension-add] command.

    ```azurecli
    az extension add --name aks-preview
    ```

2. Update to the latest version of the extension using the [`az extension update`][az-extension-update] command.

    ```azurecli
    az extension update --name aks-preview
    ```

## Register the `DisableSSHPreviewPreview` feature flag

1. Register the `DisableSSHPreviewPreview` feature flag using the [`az feature register`][az-feature-register] command.

    ```azurecli-interactive
    az feature register --namespace "Microsoft.ContainerService" --name "DisableSSHPreviewPreview"
    ```

    It takes a few minutes for the status to show *Registered*.

2. Verify the registration status using the [`az feature show`][az-feature-show] command.

    ```azurecli-interactive
    az feature show --namespace "Microsoft.ContainerService" --name "DisableSSHPreviewPreview"
    ```

3. When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider using the [`az provider register`][az-provider-register] command.

    ```azurecli-interactive
    az provider register --namespace Microsoft.ContainerService
    ```

## Disable SSH overview

To improve security and support your corporate security requirements or strategy, AKS supports disabling SSH both on the cluster and the node pool level. Disabling SSH introduces a better approach compared to the only solution, which is to configure [network security group rules][network-security-group-rules-overview] on the AKS subnet/node network interface card (NIC) to restrict specific user outbound IP addresses from connecting to AKS nodes using SSH.

When you disable SSH during cluster deployment, it doesn't need to be re-imaged. However, when you disable SSH on an existing node pool, it is reimaged. After you disable or enable SSH, optionally you can reimage all the nodes. Only after re-image is complete, does the disable/enable operation take effect.

A new `securityProfile` variable is added to the `agentPoolProfile` section. It includes a `nodeAccess` property, and `nodeAccess` has the `sshAccess` property, which is an enum type. Current allowed values are `disabled` and `localuser`. `Disabled` means the SSH service is turned off, and `localuser` means the SSH service is on and you can log in as a local user(that is, *azureuser*, *root*, etc.) using a private key (this is the current default behavior).

## Disable SSH on a new cluster deployment (preview)

By default, the SSH service on AKS cluster nodes is open to all users and pods running on the cluster. You can prevent direct SSH access from the pod network to the nodes to help limit the attack vector if a container in a pod becomes compromised.

Use the [az aks create][az-aks-create] command to create a new cluster, and include the `--ssh-access disabled` argument to disable SSH during cluster creation.

```azurecli-interactive
az aks create -g myResourceGroup -n myManagedCluster --ssh-access disabled
```

## Disable SSH for a new node pool (preview)

Use the [az aks nodepool add][az-aks-nodepool-add] command to add a node pool, and include the `--ssh-access disabled` argument to disable SSH during creation.

```azurecli-interactive
az aks nodepool add --cluster-name myManagedCluster --name mynodepool --resource-group myResourceGroup --ssh-access disabled  
```

The following example output shows that *mynodepool* has been successfully created and SSH is disabled.

## Disable SSH for an existing node pool

Use the [az aks nodepool update][az-aks-nodepool-update] command to update a node pool, and include the `--ssh-access disabled` argument to disable SSH.

```azurecli-interactive
az aks nodepool update --cluster-name myManagedCluster --name mynodepool --resource-group myResourceGroup --ssh-access disabled
```

The following example output shows that *mynodepool* has been successfully updated to disable SSH.

## Update SSH public key on an existing AKS cluster (preview)

> [!NOTE]
> Updating of the SSH key is supported on Azure virtual machine scale sets with AKS clusters.

Use the [az aks update][az-aks-update] command to update the SSH public key on the cluster. This operation updates the key on all node pools. You can either specify the key or a key file using the `--ssh-key-value` argument.

```azurecli
az aks update --name myAKSCluster --resource-group MyResourceGroup --ssh-key-value <new SSH key value or SSH key file>
```

The following examples demonstrate possible usage of this command:

* You can specify the new SSH public key value for the `--ssh-key-value` argument:

    ```azurecli
    az aks update --name myAKSCluster --resource-group MyResourceGroup --ssh-key-value 'ssh-rsa AAAAB3Nza-xxx'
    ```

* You specify an SSH public key file:

    ```azurecli
    az aks update --name myAKSCluster --resource-group MyResourceGroup --ssh-key-value ~/.ssh/id_rsa.pub
    ```

> [!IMPORTANT]
> During this operation, all virtual machine scale set instances are upgraded and re-imaged to use the new SSH public key.

<!-- LINKS - external -->

<!-- LINKS - internal -->
[install-azure-cli]: /cli/azure/install-azure-cli
[how-to-install-azure-extensions]: /cli/azure/azure-cli-extensions-overview#how-to-install-extensions
[network-security-group-rules-overview]: concepts-security.md#azure-network-security-groups
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-update]: /cli/azure/aks#az-aks-update
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az-aks-nodepool-add
[az-aks-nodepool-update]: /cli/azure/aks/nodepool#az-aks-nodepool-update