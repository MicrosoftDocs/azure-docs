---
title: Manage SSH access on Azure Kubernetes Service cluster nodes 
titleSuffix: Azure Kubernetes Service
description: Learn how to configure SSH on Azure Kubernetes Service (AKS) cluster nodes.
ms.topic: article
ms.date: 12/15/2023
---

# Manage SSH for secure access to Azure Kubernetes Service (AKS) nodes

This article describes how to configure the SSH key (preview) on your AKS clusters or node pools, during initial deployment or at a later time.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Before you begin

* You need the Azure CLI version 2.46.0 or later installed and configured. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* This feature supports Linux, Mariner, and CBLMariner node pools on existing clusters.

## Install the `aks-preview` Azure CLI extension

1. Install the aks-preview extension using the [`az extension add`][az-extension-add] command.

    ```azurecli
    az extension add --name aks-preview
    ```

2. Update to the latest version of the extension using the [`az extension update`][az-extension-update] command.

    ```azurecli
    az extension update --name aks-preview
    ```

## Create an AKS cluster with SSH key (preview)

Use the [az aks create][az-aks-create] command to deploy an AKS cluster with an SSH public key. You can either specify the key or a key file using the `--ssh-key-value` argument.

|SSH parameter |Description |Default value |
|-----|-----|-----|
|--generate-ssh-key |If you don't have your own SSH key, specify `--generate-ssh-key`. The Azure CLI first looks for the key in the `~/.ssh/` directory. If the key exists, it's used. If the key doesn't exist, the Azure CLI automatically generates a set of SSH keys and saves them in the specified or default directory.||
|--ssh-key-vaule |Public key path or key contents to install on node VMs for SSH access. For example, `ssh-rsa AAAAB...snip...UcyupgH azureuser@linuxvm`.|`~.ssh\id_rsa.pub` |
|--no-ssh-key | If you don't require an SSH key, specify this argument. However, AKS automatically generates a set of SSH keys because the Azure Virtual Machine resource dependency doesn’t support an empty SSH key file. As a result, the keys aren't returned and can't be used to SSH into the node VMs. ||

>[!NOTE]
>If no parameters are specified, the Azure CLI defaults to referencing the SSH keys stored in the `~/.ssh/` directory. If the keys aren't found in the directory, the command returns a `key not found` error message.

The following are examples of this command:

* To create a cluster and use the default generated SSH keys:

    ```azurecli
    az aks create --name myAKSCluster --resource-group MyResourceGroup --generate-ssh-key
    ```

* To specify an SSH public key file, specify it with the `--ssh-key-value` argument:

    ```azurecli
    az aks create --name myAKSCluster --resource-group MyResourceGroup --ssh-key-value ~/.ssh/id_rsa.pub
    ```

## Update SSH public key (preview) on an existing AKS cluster

Use the [az aks update][az-aks-update] command to update the SSH public key on your cluster. This operation updates the key on all node pools. You can either specify the key or a key file using the `--ssh-key-value` argument.

> [!NOTE]
> Updating of the SSH key is supported on Azure virtual machine scale sets with AKS clusters.

The following are examples of this command:

* To specify a new SSH public key value, include the `--ssh-key-value` argument:

    ```azurecli
    az aks update --name myAKSCluster --resource-group MyResourceGroup --ssh-key-value 'ssh-rsa AAAAB3Nza-xxx'
    ```

* To specify an SSH public key file, specify it with the `--ssh-key-value` argument:

    ```azurecli
    az aks update --name myAKSCluster --resource-group MyResourceGroup --ssh-key-value ~/.ssh/id_rsa.pub
    ```

> [!IMPORTANT]
> After you update the SSH key, AKS doesn't automatically update your node pool. At anytime you can choose to perform a [nodepool update operation][node-image-upgrade]. Only after a node image update is complete does the update SSH key operation take effect.

## Next steps

To help troubleshoot any issues with SSH connectivity to your clusters nodes, you can [view the kubelet logs][view-kubelet-logs] or [view the Kubernetes master node logs][view-master-logs].

<!-- LINKS - external -->

<!-- LINKS - internal -->
[install-azure-cli]: /cli/azure/install-azure-cli
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-show]: /cli/azure/feature#az-feature-show
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-provider-register]: /cli/azure/provider#az_provider_register
[az-aks-update]: /cli/azure/aks#az-aks-update
[az-aks-create]: /cli/azure/aks#az-aks-create
[view-kubelet-logs]: kubelet-logs.md
[view-master-logs]: monitor-aks-reference.md#resource-logs
[node-image-upgrade]: node-image-upgrade.md
[az-aks-nodepool-upgrade]: /cli/azure/aks/nodepool#az-aks-nodepool-upgrade
[network-security-group-rules-overview]: concepts-security.md#azure-network-security-groups