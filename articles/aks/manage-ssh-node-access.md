---
title: Manage SSH access on Azure Kubernetes Service cluster nodes 
titleSuffix: Azure Kubernetes Service
description: Learn how to configure SSH and manage SSH keys on Azure Kubernetes Service (AKS) cluster nodes.
ms.topic: article
ms.date: 12/15/2023
---

# Manage SSH for secure access to Azure Kubernetes Service (AKS) nodes

This article describes how to configure the SSH key (preview) on your AKS clusters or node pools, during initial deployment or at a later time. 

AKS supports the following configuraton options to manage SSH keys on cluster nodes:

* Create a cluster with an SSH key
* Update the SSH key on an existing AKS cluster
* Disable and renable the SSH key

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Before you begin

* You need the Azure CLI version 2.46.0 or later installed and configured. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* This feature supports Linux, Mariner, and CBLMariner node pools on existing clusters.

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

## Register the `DisableSSHPreview` feature flag

1. Register the `DisableSSHPreview` feature flag using the [`az feature register`][az-feature-register] command.

    ```azurecli-interactive
    az feature register --namespace "Microsoft.ContainerService" --name "DisableSSHPreview"
    ```

    It takes a few minutes for the status to show *Registered*.

2. Verify the registration status using the [`az feature show`][az-feature-show] command.

    ```azurecli-interactive
    az feature show --namespace "Microsoft.ContainerService" --name "DisableSSHPreview"
    ```

3. When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider using the [`az provider register`][az-provider-register] command.

    ```azurecli-interactive
    az provider register --namespace Microsoft.ContainerService
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

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

1. Install the aks-preview extension using the [`az extension add`][az-extension-add] command.

    ```azurecli
    az extension add --name aks-preview
    ```

2. Update to the latest version of the extension using the [`az extension update`][az-extension-update] command.

    ```azurecli
    az extension update --name aks-preview
    ```

## Update SSH public key on an existing AKS cluster

Use the [az aks update][az-aks-update] command to update the SSH public key (preview) on your cluster. This operation updates the key on all node pools. You can either specify the key or a key file using the `--ssh-key-value` argument.

> [!NOTE]
> Updating of the SSH key is supported on Azure virtual machine scale sets with AKS clusters.

|SSH parameter |Description |Default value |
|-----|-----|-----|
|--ssh-key-vaule |Public key path or key contents to install on node VMs for SSH access. For example, `ssh-rsa AAAAB...snip...UcyupgH azureuser@linuxvm`.|`~.ssh\id_rsa.pub` |

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

## Disable SSH overview

To improve security and support your corporate security requirements or strategy, AKS supports disabling SSH (preview) both on the cluster and at the node pool level. Disable SSH introduces a better approach compared to the only supported solution, which requires configuring [network security group rules][network-security-group-rules-overview] on the AKS subnet/node network interface card (NIC). Network security group rules restrict specific user outbound IP addresses from connecting to AKS nodes using SSH.

When you disable SSH at cluster creation time, it takes effect after the cluster is created. However, when you disable SSH on an existing node pool, AKS doesn't automatically update your node pool. At anytime you can choose to perform a nodepool update operation. Only after a node image update is complete does the disable/enable SSH key operation take effect.

|SSH parameter |Description |
|-----|-----|
|`disabled` |The SSH service is disabled. |
|`localuser` |The SSH service is enabled and users with SSH key can securely access the node. |

### Disable SSH on a new cluster deployment

By default, the SSH service on AKS cluster nodes is open to all users and pods running on the cluster. You can prevent direct SSH access from the pod network to the nodes to help limit the attack vector if a container in a pod becomes compromised.
Use the [az aks create][az-aks-create] command to create a new cluster, and include the `--ssh-access disabled` argument to disable SSH (preview) on all the node pools during cluster creation.

```azurecli-interactive
az aks create -g myResourceGroup -n myManagedCluster --ssh-access disabled
```

### Disable SSH on an existing cluster

Use the [az aks update][az-aks-update] command to update an existing cluster, and include the `--ssh-access disabled` argument to disable SSH (preview) on all the node pools in the cluster.

```azurecli-interactive
az aks update -g myResourceGroup -n myManagedCluster --ssh-access disabled
```

For the change to take effect, you need to reimage all node pools by using the [az aks nodepool upgrade][az-aks-nodepool-upgrade] command.

```azurecli-interactive
az aks nodepool upgrade --cluster-name myManagedCluster --name mynodepool --resource-group myResourceGroup --node-image only
```

> [!IMPORTANT]
> During this operation, all Virtual Machine Scale Set instances are upgraded and reimaged to use the new SSH configuration.

### Disable SSH for a new node pool

Use the [az aks nodepool add][az-aks-nodepool-add] command to add a node pool, and include the `--ssh-access disabled` argument to disable SSH during creation.

```azurecli-interactive
az aks nodepool add --cluster-name myManagedCluster --name mynodepool --resource-group myResourceGroup --ssh-access disabled  
```

The following example output shows that *mynodepool* has been successfully created and SSH is disabled.

```output
```

### Disable SSH for an existing node pool

Use the [az aks nodepool update][az-aks-nodepool-update] command to update a node pool, and include the `--ssh-access disabled` argument to disable SSH (preview).

```azurecli-interactive
az aks nodepool update --cluster-name myManagedCluster --name mynodepool --resource-group myResourceGroup --ssh-access disabled
```

The following example output shows that *mynodepool* has been successfully updated to disable SSH.

```output
```

For the change to take effect, you need to reimage the node pool by using the [az aks nodepool upgrade][az-aks-nodepool-upgrade] command.

```azurecli-interactive
az aks nodepool upgrade --cluster-name myManagedCluster --name mynodepool --resource-group myResourceGroup --node-image only
```

### Re-enable SSH on an existing cluster

Use the [az aks update][az-aks-update] command to update an existing cluster, and include the `--ssh-access localuser` argument to re-enable SSH (preview) on all the node pools in the cluster.

```azurecli-interactive
z aks update -g myResourceGroup -n myManagedCluster –-ssh-access localuser
```

After re-enabling SSH, the nodes aren't be reimaged automatically. The Azure CLI returns the following message:  

```output
Do you want to reimage the nodes now? The nodes will be unavailable during reimage Y/N?
```

If you select **Y**, all the nodes are reimaged. Otherwise, at any time you can choose to perform a [reimage operation][node-image-upgrade]. Only after reimage is complete does the update SSH key operation take effect.

>[!IMPORTANT]
>During this operation, all Virtual Machine Scale Set instances are upgraded and reimaged to use the new SSH public key.

### Re-enable SSH for a specific node pool

Use the [az aks update][az-aks-update] command to update a specific node pool, and include the `--ssh-access localuser` argument to re-enable SSH (preview) on that node pool in the cluster. In the following example, *nodepool1* is the target node pool.

```azurecli-interactive
az aks nodepool update --cluster-name myManagedCluster --name nodepool1 --resource-group myResourceGroup –-ssh-access localuser 
```

After re-enabling SSH, the nodes in the pool aren't be reimaged automatically. The Azure CLI returns the following message:  

```output
Do you want to reimage the nodes now? The nodes will be unavailable during reimage Y/N?
```

If you select **Y**, all the nodes are reimaged. Otherwise, at any time you can choose to perform a [reimage operation][node-image-upgrade]. Only after reimage is complete does the update SSH key operation take effect.

>[!IMPORTANT]
>During this operation, all Virtual Machine Scale Set instances are upgraded and reimaged to use the new SSH public key.

## Next steps

To help troubleshoot any issues with SSH connectivity to your clusters nodes, you can [view the kubelet logs][view-kubelet-logs] or [view the Kubernetes master node logs][view-master-logs].

<!-- LINKS - external -->

<!-- LINKS - internal -->
[install-azure-cli]: /cli/azure/install-azure-cli
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-show]: /cli/azure/feature#az-feature-show
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-provider-register]: /cli/azure/provider#az_provider_register
[az-aks-update]: /cli/azure/aks#az-aks-update
[az-aks-create]: /cli/azure/aks#az-aks-create
[view-kubelet-logs]: kubelet-logs.md
[view-master-logs]: monitor-aks-reference.md#resource-logs
[node-image-upgrade]: node-image-upgrade.md
[az-aks-nodepool-upgrade]: /cli/azure/aks/nodepool#az-aks-nodepool-upgrade
[network-security-group-rules-overview]: concepts-security.md#azure-network-security-groups