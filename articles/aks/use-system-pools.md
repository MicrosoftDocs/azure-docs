---
title: Use system node pools in Azure Kubernetes Service (AKS)
description: Learn how to create and manage system node pools in Azure Kubernetes Service (AKS)
ms.topic: article
ms.date: 11/22/2022
ms.custom: fasttrack-edit, devx-track-azurecli, devx-track-azurepowershell
---

# Manage system node pools in Azure Kubernetes Service (AKS)

In Azure Kubernetes Service (AKS), nodes of the same configuration are grouped together into *node pools*. Node pools contain the underlying VMs that run your applications. System node pools and user node pools are two different node pool modes for your AKS clusters. System node pools serve the primary purpose of hosting critical system pods such as `CoreDNS` and `metrics-server`. User node pools serve the primary purpose of hosting your application pods. However, application pods can be scheduled on system node pools if you wish to only have one pool in your AKS cluster. Every AKS cluster must contain at least one system node pool with at least one node.

> [!Important]
> If you run a single system node pool for your AKS cluster in a production environment, we recommend you use at least three nodes for the node pool.

This article explains how to manage system node pools in AKS. For information about how to use multiple node pools, see [use multiple node pools][use-multiple-node-pools].

## Before you begin

### [Azure CLI](#tab/azure-cli)

You need the Azure CLI version 2.3.1 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

### [Azure PowerShell](#tab/azure-powershell)

You need the Azure PowerShell version 7.5.0 or later installed and configured. Run `Get-InstalledModule -Name Az` to find the version. If you need to install or upgrade, see [Install Azure PowerShell][install-azure-powershell].

---

## Limitations

The following limitations apply when you create and manage AKS clusters that support system node pools.

* See [Quotas, VM size restrictions, and region availability in AKS][quotas-skus-regions].
* An API version of 2020-03-01 or greater must be used to set a node pool mode. Clusters created on API versions older than 2020-03-01 contain only user node pools, but can be migrated to contain system node pools by following [update pool mode steps](#update-existing-cluster-system-and-user-node-pools).
* The name of a node pool may only contain lowercase alphanumeric characters and must begin with a lowercase letter. For Linux node pools, the length must be between 1 and 12 characters. For Windows node pools, the length must be between one and six characters.
* The mode of a node pool is a required property and must be explicitly set when using ARM templates or direct API calls.

## System and user node pools

For a system node pool, AKS automatically assigns the label **kubernetes.azure.com/mode: system** to its nodes. This causes AKS to prefer scheduling system pods on node pools that contain this label. This label doesn't prevent you from scheduling application pods on system node pools. However, we recommend you isolate critical system pods from your application pods to prevent misconfigured or rogue application pods from accidentally killing system pods.

You can enforce this behavior by creating a dedicated system node pool. Use the `CriticalAddonsOnly=true:NoSchedule` taint to prevent application pods from being scheduled on system node pools.

System node pools have the following restrictions:

* System node pools must support at least 30 pods as described by the [minimum and maximum value formula for pods][maximum-pods].
* System pools osType must be Linux.
* User node pools osType may be Linux or Windows.
* System pools must contain at least one node, and user node pools may contain zero or more nodes.
* System node pools require a VM SKU of at least 2 vCPUs and 4 GB memory. But burstable-VM(B series) isn't recommended.
* A minimum of two nodes 4 vCPUs is recommended (for example, Standard_DS4_v2), especially for large clusters (Multiple CoreDNS Pod replicas, 3-4+ add-ons, etc.).
* Spot node pools require user node pools.
* Adding another system node pool or changing which node pool is a system node pool *does not* automatically move system pods. System pods can continue to run on the same node pool, even if you change it to a user node pool. If you delete or scale down a node pool running system pods that were previously a system node pool, those system pods are redeployed with preferred scheduling to the new system node pool.

You can do the following operations with node pools:

* Create a dedicated system node pool (prefer scheduling of system pods to node pools of `mode:system`)
* Change a system node pool to be a user node pool, provided you have another system node pool to take its place in the AKS cluster.
* Change a user node pool to be a system node pool.
* Delete user node pools.
* You can delete system node pools, provided you have another system node pool to take its place in the AKS cluster.
* An AKS cluster may have multiple system node pools and requires at least one system node pool.
* If you want to change various immutable settings on existing node pools, you can create new node pools to replace them. One example is to add a new node pool with a new maxPods setting and delete the old node pool.
* Use [node affinity][node-affinity] to *require* or *prefer* which nodes can be scheduled based on node labels. You can set `key` to `kubernetes.azure.com`, `operator` to `In`, and `values` of either `user` or `system` to your YAML, applying this definition using `kubectl apply -f yourYAML.yaml`.

## Create a new AKS cluster with a system node pool

### [Azure CLI](#tab/azure-cli)

When you create a new AKS cluster, you automatically create a system node pool with a single node. The initial node pool defaults to a mode of type system. When you create new node pools with `az aks nodepool add`, those node pools are user node pools unless you explicitly specify the mode parameter.

The following example creates a resource group named *myResourceGroup* in the *eastus* region.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Use the [az aks create][az-aks-create] command to create an AKS cluster. The following example creates a cluster named *myAKSCluster* with one dedicated system pool containing one node. For your production workloads, ensure you're using system node pools with at least three nodes. This operation may take several minutes to complete.

```azurecli-interactive
# Create a new AKS cluster with a single system pool
az aks create -g myResourceGroup --name myAKSCluster --node-count 1 --generate-ssh-keys
```

### [Azure PowerShell](#tab/azure-powershell)

When you create a new AKS cluster, you automatically create a system node pool with a single node. The initial node pool defaults to a mode of type system. When you create new node pools with `New-AzAksNodePool`, those node pools are user node pools. A node pool's mode can be [updated at any time][update-node-pool-mode].

The following example creates a resource group named *myResourceGroup* in the *eastus* region.

```azurepowershell-interactive
New-AzResourceGroup -ResourceGroupName myResourceGroup -Location eastus
```

Use the [New-AzAksCluster][new-azakscluster] cmdlet to create an AKS cluster. The following example creates a cluster named *myAKSCluster* with one dedicated system pool containing one node. For your production workloads, ensure you're using system node pools with at least three nodes. The create operation may take several minutes to complete.

```azurepowershell-interactive
# Create a new AKS cluster with a single system pool
New-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster -NodeCount 1 -GenerateSshKey
```

---

## Add a dedicated system node pool to an existing AKS cluster

### [Azure CLI](#tab/azure-cli)

You can add one or more system node pools to existing AKS clusters. It's recommended to schedule your application pods on user node pools, and dedicate system node pools to only critical system pods. This prevents rogue application pods from accidentally killing system pods. Enforce this behavior with the `CriticalAddonsOnly=true:NoSchedule` [taint][aks-taints] for your system node pools.

The following command adds a dedicated node pool of mode type system with a default count of three nodes.

```azurecli-interactive
az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name systempool \
    --node-count 3 \
    --node-taints CriticalAddonsOnly=true:NoSchedule \
    --mode System
```

### [Azure PowerShell](#tab/azure-powershell)

You can add one or more system node pools to existing AKS clusters. It's recommended to schedule your application pods on user node pools, and dedicate system node pools to only critical system pods. Adding more system node pools prevents rogue application pods from accidentally killing system pods. Enforce the behavior with the `CriticalAddonsOnly=true:NoSchedule` [taint][aks-taints] for your system node pools.

The following command adds a dedicated node pool of mode type system with a default count of three nodes.

```azurepowershell-interactive
# By default, New-AzAksNodePool creates a user node pool
# We need to update the node pool's mode to System later
New-AzAksNodePool -ResourceGroupName myResourceGroup -ClusterName myAKSCluster -Name systempool -Count 3

# Update the node pool's mode to System and add the 'CriticalAddonsOnly=true:NoSchedule' taint
$myAKSCluster = Get-AzAksCluster -ResourceGroupName myResourceGroup2 -Name myAKSCluster
$systemPool = $myAKSCluster.AgentPoolProfiles | Where-Object Name -eq 'systempool'
$systemPool.Mode = 'System'
$nodeTaints = [System.Collections.Generic.List[string]]::new()
$NodeTaints.Add('CriticalAddonsOnly=true:NoSchedule')
$systemPool.NodeTaints = $NodeTaints
$myAKSCluster | Set-AzAksCluster
```

---

## Show details for your node pool

You can check the details of your node pool with the following command.

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az aks nodepool show -g myResourceGroup --cluster-name myAKSCluster -n systempool
```

A mode of type **System** is defined for system node pools, and a mode of type **User** is defined for user node pools. For a system pool, verify the taint is set to `CriticalAddonsOnly=true:NoSchedule`, which will prevent application pods from beings scheduled on this node pool.

```output
{
  "agentPoolType": "VirtualMachineScaleSets",
  "availabilityZones": null,
  "count": 3,
  "enableAutoScaling": null,
  "enableNodePublicIp": false,
  "id": "/subscriptions/yourSubscriptionId/resourcegroups/myResourceGroup/providers/Microsoft.ContainerService/managedClusters/myAKSCluster/agentPools/systempool",
  "maxCount": null,
  "maxPods": 110,
  "minCount": null,
  "mode": "System",
  "name": "systempool",
  "nodeImageVersion": "AKSUbuntu-1604-2020.06.30",
  "nodeLabels": {},
  "nodeTaints": [
    "CriticalAddonsOnly=true:NoSchedule"
  ],
  "orchestratorVersion": "1.16.10",
  "osDiskSizeGb": 128,
  "osType": "Linux",
  "provisioningState": "Succeeded",
  "proximityPlacementGroupId": null,
  "resourceGroup": "myResourceGroup",
  "scaleSetEvictionPolicy": null,
  "scaleSetPriority": null,
  "spotMaxPrice": null,
  "tags": null,
  "type": "Microsoft.ContainerService/managedClusters/agentPools",
  "upgradeSettings": {
    "maxSurge": null
  },
  "vmSize": "Standard_DS2_v2",
  "vnetSubnetId": null
}
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Get-AzAksNodePool -ResourceGroupName myResourceGroup -ClusterName myAKSCluster -Name systempool
```

A mode of type **System** is defined for system node pools, and a mode of type **User** is defined for user node pools. For a system pool, verify the taint is set to `CriticalAddonsOnly=true:NoSchedule`, which will prevent application pods from beings scheduled on this node pool.

```Output
Count                  : 3
VmSize                 : Standard_D2_v2
OsDiskSizeGB           : 128
VnetSubnetID           :
MaxPods                : 30
OsType                 : Linux
MaxCount               :
MinCount               :
EnableAutoScaling      :
AgentPoolType          : VirtualMachineScaleSets
OrchestratorVersion    : 1.23.3
ProvisioningState      : Succeeded
AvailabilityZones      : {}
EnableNodePublicIP     :
ScaleSetPriority       :
ScaleSetEvictionPolicy :
NodeTaints             : {CriticalAddonsOnly=true:NoSchedule}
Id                     : /subscriptions/yourSubscriptionId/resourcegroups/myResourceGroup/providers
                         /Microsoft.ContainerService/managedClusters/myAKSCluster/agentPools/systempool
Name                   : systempool
Type                   : Microsoft.ContainerService/managedClusters/agentPools
```

---

## Update existing cluster system and user node pools

### [Azure CLI](#tab/azure-cli)

> [!NOTE]
> An API version of 2020-03-01 or greater must be used to set a system node pool mode. Clusters created on API versions older than 2020-03-01 contain only user node pools as a result. To receive system node pool functionality and benefits on older clusters, update the mode of existing node pools with the following commands on the latest Azure CLI version.

You can change modes for both system and user node pools. You can change a system node pool to a user pool only if another system node pool already exists on the AKS cluster.

This command changes a system node pool to a user node pool.

```azurecli-interactive
az aks nodepool update -g myResourceGroup --cluster-name myAKSCluster -n mynodepool --mode user
```

This command changes a user node pool to a system node pool.

```azurecli-interactive
az aks nodepool update -g myResourceGroup --cluster-name myAKSCluster -n mynodepool --mode system
```

### [Azure PowerShell](#tab/azure-powershell)

> [!NOTE]
> An API version of 2020-03-01 or greater must be used to set a system node pool mode. Clusters created on API versions older than 2020-03-01 contain only user node pools as a result. To receive system node pool functionality and benefits on older clusters, update the mode of existing node pools with the following commands on the latest Azure PowerShell version.

You can change modes for both system and user node pools. You can change a system node pool to a user pool only if another system node pool already exists on the AKS cluster.

This command changes a system node pool to a user node pool.

```azurepowershell-interactive
$myAKSCluster = Get-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster
($myAKSCluster.AgentPoolProfiles | Where-Object Name -eq 'mynodepool').Mode = 'User'
$myAKSCluster | Set-AzAksCluster
```

This command changes a user node pool to a system node pool.

```azurepowershell-interactive
$myAKSCluster = Get-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster
($myAKSCluster.AgentPoolProfiles | Where-Object Name -eq 'mynodepool').Mode = 'System'
$myAKSCluster | Set-AzAksCluster
```

---

## Delete a system node pool

> [!Note]
> To use system node pools on AKS clusters before API version 2020-03-02, add a new system node pool, then delete the original default node pool.

You must have at least two system node pools on your AKS cluster before you can delete one of them.

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az aks nodepool delete -g myResourceGroup --cluster-name myAKSCluster -n mynodepool
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Remove-AzAksNodePool -ResourceGroupName myResourceGroup -ClusterName myAKSCluster -Name mynodepool
```

---

## Clean up resources

### [Azure CLI](#tab/azure-cli)

To delete the cluster, use the [az group delete][az-group-delete] command to delete the AKS resource group:

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```

### [Azure PowerShell](#tab/azure-powershell)

To delete the cluster, use the [Remove-AzResourceGroup][remove-azresourcegroup] command to delete the AKS resource group:

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup
```

---

## Next steps

In this article, you learned how to create and manage system node pools in an AKS cluster. For information about how to start and stop AKS node pools, see [start and stop AKS node pools][start-stop-nodepools].

<!-- EXTERNAL LINKS -->
[kubernetes-drain]: https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-taint]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#taint
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[kubernetes-labels]: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/
[kubernetes-label-syntax]: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set

<!-- INTERNAL LINKS -->
[aks-taints]: manage-node-pools.md#set-node-pool-taints
[aks-windows]: windows-container-cli.md
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az-aks-create]: /cli/azure/aks#az-aks-create
[new-azakscluster]: /powershell/module/az.aks/new-azakscluster
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az-aks-nodepool-add
[az-aks-nodepool-list]: /cli/azure/aks/nodepool#az-aks-nodepool-list
[az-aks-nodepool-update]: /cli/azure/aks/nodepool#az-aks-nodepool-update
[az-aks-nodepool-upgrade]: /cli/azure/aks/nodepool#az-aks-nodepool-upgrade
[az-aks-nodepool-scale]: /cli/azure/aks/nodepool#az-aks-nodepool-scale
[az-aks-nodepool-delete]: /cli/azure/aks/nodepool#az-aks-nodepool-delete
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[az-group-create]: /cli/azure/group#az-group-create
[az-group-delete]: /cli/azure/group#az-group-delete
[remove-azresourcegroup]: /powershell/module/az.resources/remove-azresourcegroup
[az-deployment-group-create]: /cli/azure/deployment/group#az-deployment-group-create
[gpu-cluster]: gpu-cluster.md
[install-azure-cli]: /cli/azure/install-azure-cli
[install-azure-powershell]: /powershell/azure/install-az-ps
[operator-best-practices-advanced-scheduler]: operator-best-practices-advanced-scheduler.md
[quotas-skus-regions]: quotas-skus-regions.md
[supported-versions]: supported-kubernetes-versions.md
[tag-limitation]: ../azure-resource-manager/management/tag-resources.md
[taints-tolerations]: operator-best-practices-advanced-scheduler.md#provide-dedicated-nodes-using-taints-and-tolerations
[vm-sizes]: ../virtual-machines/sizes.md
[use-multiple-node-pools]: create-node-pools.md
[maximum-pods]: configure-azure-cni.md#maximum-pods-per-node
[update-node-pool-mode]: use-system-pools.md#update-existing-cluster-system-and-user-node-pools
[start-stop-nodepools]: ./start-stop-nodepools.md
[node-affinity]: operator-best-practices-advanced-scheduler.md#node-affinity
