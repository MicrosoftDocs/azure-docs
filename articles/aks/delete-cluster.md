---
title: Delete an Azure Kubernetes Service (AKS) cluster
description: Learn about deleting a cluster in Azure Kubernetes Service (AKS).
ms.topic: overview
ms.author: schaffererin
author: schaffererin
ms.date: 04/16/2024
---

# Delete an Azure Kubernetes Service (AKS) cluster

This article outlines cluster deletion in Azure Kubernetes Service (AKS), including what happens when you delete a cluster, alternatives to deleting a cluster, and how to delete a cluster.

## What happens when you delete a cluster?

When you delete a cluster, the following resources are deleted:

* The [node resource group][node-resource-group] and its resources, including:
  * The virtual machine scale sets and virtual machines (VMs) for each node in the cluster
  * The virtual network and its subnets for the cluster
  * The storage for the cluster
* The control plane and its resources
* Any node instances in the cluster along with any pods running on those nodes

## Alternatives to deleting a cluster

Before you delete a cluster, consider **stopping the cluster**. Stopping an AKS cluster stops the control plane and agent nodes, allowing you to save on compute costs while maintaining all objects except standalone pods. When you stop a cluster, its state is saved and you can restart the cluster at any time. For more information, see [Stop an AKS cluster][stop-cluster].

If you want to delete a cluster to change its configuration, you can instead use the [AKS cluster upgrade][upgrade-cluster] feature to upgrade the cluster to a different Kubernetes version or change the node pool configuration. For more information, see [Upgrade an AKS cluster][upgrade-cluster].

## Delete a cluster

> [!IMPORTANT]
> **You can't recover a cluster after it's deleted**. If you need to recover a cluster, you need to create a new cluster and redeploy your applications.
### [Azure CLI](#tab/azure-cli)

Delete a cluster using the [`az aks delete`][az-aks-delete] command. The following example deletes the `myAKSCluster` cluster in the `myResourceGroup` resource group:

```azurecli-interactive
az aks delete --name myAKSCluster --resource-group myResourceGroup
```

### [Azure PowerShell](#tab/azure-powershell)

Delete a cluster using the [`Remove-AzAks`][remove-azaks] command. The following example deletes the `myAKSCluster` cluster in the `myResourceGroup` resource group:

```azurepowershell-interactive
Remove-AzAksCluster -Name myAKSCluster -ResourceGroupName myResourceGroup
```

### [Azure portal](#tab/azure-portal)

You can delete a cluster using the Azure portal. To delete a cluster, navigate to the **Overview** page for the cluster and select **Delete**. You can also delete a cluster from the **Resource group** page by selecting the cluster and then selecting **Delete**.

---

## Next steps

For more information about AKS, see [Core Kubernetes concepts for AKS][core-concepts].

<!-- LINKS -->
[node-resource-group]: ./concepts-clusters-workloads.md#node-resource-group
[stop-cluster]: ./start-stop-cluster.md
[upgrade-cluster]: ./upgrade-cluster.md
[az-aks-delete]: /cli/azure/aks#az_aks_delete
[remove-azaks]: /powershell/module/az.aks/remove-azakscluster
[core-concepts]: ./concepts-clusters-workloads.md
