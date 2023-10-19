---
title: Manage SSH access on Azure Kubernetes Service cluster nodes 
titleSuffix: Azure Kubernetes Service
description: Learn how to configure SSH on Azure Kubernetes Service (AKS) cluster nodes.
ms.topic: article
ms.date: 10/16/2023
---

# Manage SSH for secure access to Azure Kubernetes Service (AKS) nodes

This article describes how to update the SSH key on your AKS clusters or node pools.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Before you begin

* You need the Azure CLI version 2.46.0 or later installed and configured. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* This feature supports Linux, Mariner, and CBLMariner node pools on existing clusters.

## Update SSH public key on an existing AKS cluster

Use the [az aks update][az-aks-update] command to update the SSH public key on your cluster. This operation updates the key on all node pools. You can either specify the key or a key file using the `--ssh-key-value` argument.

> [!NOTE]
> Updating of the SSH key is supported on Azure virtual machine scale sets with AKS clusters.

|SSH parameter |Description |Default value |
|-----|-----|-----|
|--ssh-key-vaule |Public key path or key contents to install on node VMs for SSH access. For example, `ssh-rsa AAAAB...snip...UcyupgH azureuser@linuxvm`.|`~.ssh\id_rsa.pub` |
|--no-ssh-key |Do not use or create a local SSH key. |False |

The following are examples of this command:

* To specify the new SSH public key value, include the `--ssh-key-value` argument:

    ```azurecli
    az aks update --name myAKSCluster --resource-group MyResourceGroup --ssh-key-value 'ssh-rsa AAAAB3Nza-xxx'
    ```

* To specify an SSH public key file, specify it with the `--ssh-key-value` argument:

    ```azurecli
    az aks update --name myAKSCluster --resource-group MyResourceGroup --ssh-key-value ~/.ssh/id_rsa.pub
    ```

> [!IMPORTANT]
> After you update the SSH key, AKS doesn't automatically reimage your node pool. At anytime you can choose to perform a [reimage operation][node-image-upgrade]. Only after reimage is complete does the update SSH key operation take effect.

## Next steps

To help troubleshoot any issues with SSH connectivity to your clusters nodes, you can [view the kubelet logs][view-kubelet-logs] or [view the Kubernetes master node logs][view-master-logs].

<!-- LINKS - external -->

<!-- LINKS - internal -->
[install-azure-cli]: /cli/azure/install-azure-cli
[az-aks-update]: /cli/azure/aks#az-aks-update
[view-kubelet-logs]: kubelet-logs.md
[view-master-logs]: monitor-aks-reference.md#resource-logs
[node-image-upgrade]: node-image-upgrade.md
