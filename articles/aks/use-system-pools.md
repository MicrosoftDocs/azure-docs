---
title: Use system node pools in Azure Kubernetes Service (AKS)
description: Learn how to create and manage system node pools in Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 04/28/2020

---

# Manage system node pools in Azure Kubernetes Service (AKS)

In Azure Kubernetes Service (AKS), nodes of the same configuration are grouped together into *node pools*. Node pools contain the underlying VMs that run your applications. System node pools and user node pools are two different node pool modes for your AKS clusters. System node pools serve the primary purpose of hosting critical system pods such as CoreDNS and tunnelfront. User node pools serve the primary purpose of hosting your application pods. However, application pods can be scheduled on system node pools if you wish to only have one pool in your AKS cluster. Every AKS cluster must contain at least one system node pool with at least one node. 

> [!Important]
> If you run a single system node pool for your AKS cluster in a production environment, we recommend you use at least three nodes for the node pool.

## Before you begin

* You need the Azure CLI version 2.3.1 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Limitations

The following limitations apply when you create and manage AKS clusters that support system node pools.

* See [Quotas, virtual machine size restrictions, and region availability in Azure Kubernetes Service (AKS)][quotas-skus-regions].
* The AKS cluster must be built with virtual machine scale sets as the VM type.
* The name of a node pool may only contain lowercase alphanumeric characters and must begin with a lowercase letter. For Linux node pools, the length must be between 1 and 12 characters. For Windows node pools, the length must be between 1 and 6 characters.
* An API version of 2020-03-01 or greater must be used to set a node pool mode.
* The mode of a node pool is a required property and must be explicitly set when using ARM templates or direct API calls.

## System and user node pools

System node pool nodes each have the label **kubernetes.azure.com/mode: system**. Every AKS cluster contains at least one system node pool. System node pools have the following restrictions:

* System pools osType must be Linux.
* User node pools osType may be Linux or Windows.
* System pools must contain at least one node, and user node pools may contain zero or more nodes.
* System node pools require a VM SKU of at least 2 vCPUs and 4GB memory.
* System node pools must support at least 30 pods as described by the [minimum and maximum value formula for pods][maximum-pods].
* Spot node pools require user node pools.

You can do the following operations with node pools:

* Change a system node pool to be a user node pool, provided you have another system node pool to take its place in the AKS cluster.
* Change a user node pool to be a system node pool.
* Delete user node pools.
* You can delete system node pools, provided you have another system node pool to take its place in the AKS cluster.
* An AKS cluster may have multiple system node pools and requires at least one system node pool.
* If you want to change various immutable settings on existing node pools, you can create new node pools to replace them. One example is to add a new node pool with a new maxPods setting and delete the old node pool.

## Create a new AKS cluster with a system node pool

When you create a new AKS cluster, you automatically create a system node pool with a single node. The initial node pool defaults to a mode of type system. When you create new node pools with az aks nodepool add, those node pools are user node pools unless you explicitly specify the mode parameter.

The following example creates a resource group named *myResourceGroup* in the *eastus* region.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Use the [az aks create][az-aks-create] command to create an AKS cluster. The following example creates a cluster named *myAKSCluster* with one system pool containing one node. For your production workloads, ensure you are using system node pools with at least three nodes. This operation may take several minutes to complete.

```azurecli-interactive
az aks create -g myResourceGroup --name myAKSCluster --node-count 1 --generate-ssh-keys
```

## Add a system node pool to an existing AKS cluster

You can add one or more system node pools to existing AKS clusters. The following command adds a node pool of mode type system with a default count of three nodes.

```azurecli-interactive
az aks nodepool add -g myResourceGroup --cluster-name myAKSCluster -n mynodepool --mode system
```
## Show details for your node pool

You can check the details of your node pool with the following command.  

```azurecli-interactive
az aks nodepool show -g myResourceGroup --cluster-name myAKSCluster -n mynodepool
```

A mode of type **System** is defined for system node pools, and a mode of type **User** is defined for user node pools.

```output
{
  "agentPoolType": "VirtualMachineScaleSets",
  "availabilityZones": null,
  "count": 3,
  "enableAutoScaling": null,
  "enableNodePublicIp": false,
  "id": "/subscriptions/666d66d8-1e43-4136-be25-f25bb5de5883/resourcegroups/myResourceGroup/providers/Microsoft.ContainerService/managedClusters/myAKSCluster/agentPools/mynodepool",
  "maxCount": null,
  "maxPods": 110,
  "minCount": null,
  "mode": "System",
  "name": "mynodepool",
  "nodeLabels": {},
  "nodeTaints": null,
  "orchestratorVersion": "1.15.10",
  "osDiskSizeGb": 100,
  "osType": "Linux",
  "provisioningState": "Succeeded",
  "resourceGroup": "myResourceGroup",
  "scaleSetEvictionPolicy": null,
  "scaleSetPriority": null,
  "spotMaxPrice": null,
  "tags": null,
  "type": "Microsoft.ContainerService/managedClusters/agentPools",
  "vmSize": "Standard_DS2_v2",
  "vnetSubnetId": null
}
```

## Update system and user node pools

You can change modes for both system and user node pools. You can change a system node pool to a user pool only if another system node pool already exists on the AKS cluster.

This command changes a system node pool to a user node pool.

```azurecli-interactive
az aks nodepool update -g myResourceGroup --cluster-name myAKSCluster -n mynodepool --mode user
```

This command changes a user node pool to a system node pool.

```azurecli-interactive
az aks nodepool update -g myResourceGroup --cluster-name myAKSCluster -n mynodepool --mode system
```

## Delete a system node pool

> [!Note]
> To use system node pools on AKS clusters before API version 2020-03-02, add a new system node pool, then delete the original default node pool.

Previously you could not delete the system node pool, which was the initial default node pool in an AKS cluster. You now have the flexibility to delete any node pool from your clusters. Since AKS clusters require at least one system node pool, you must have at least two system node pools on your AKS cluster before you can delete one of them.

```azurecli-interactive
az aks nodepool delete -g myResourceGroup --cluster-name myAKSCluster -n mynodepool
```

## Next steps

In this article, you learned how to create and manage system node pools in an AKS cluster. For more information about how to use multiple node pools, see [use multiple node pools][use-multiple-node-pools].

<!-- EXTERNAL LINKS -->
[kubernetes-drain]: https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-taint]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#taint
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[kubernetes-labels]: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/
[kubernetes-label-syntax]: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set

<!-- INTERNAL LINKS -->
[aks-windows]: windows-container-cli.md
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-nodepool-add]: /cli/azure/aks/nodepool?view=azure-cli-latest#az-aks-nodepool-add
[az-aks-nodepool-list]: /cli/azure/aks/nodepool?view=azure-cli-latest#az-aks-nodepool-list
[az-aks-nodepool-update]: /cli/azure/aks/nodepool?view=azure-cli-latest#az-aks-nodepool-update
[az-aks-nodepool-upgrade]: /cli/azure/aks/nodepool?view=azure-cli-latest#az-aks-nodepool-upgrade
[az-aks-nodepool-scale]: /cli/azure/aks/nodepool?view=azure-cli-latest#az-aks-nodepool-scale
[az-aks-nodepool-delete]: /cli/azure/aks/nodepool?view=azure-cli-latest#az-aks-nodepool-delete
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[az-group-create]: /cli/azure/group#az-group-create
[az-group-delete]: /cli/azure/group#az-group-delete
[az-group-deployment-create]: /cli/azure/group/deployment#az-group-deployment-create
[gpu-cluster]: gpu-cluster.md
[install-azure-cli]: /cli/azure/install-azure-cli
[operator-best-practices-advanced-scheduler]: operator-best-practices-advanced-scheduler.md
[quotas-skus-regions]: quotas-skus-regions.md
[supported-versions]: supported-kubernetes-versions.md
[tag-limitation]: ../azure-resource-manager/resource-group-using-tags.md
[taints-tolerations]: operator-best-practices-advanced-scheduler.md#provide-dedicated-nodes-using-taints-and-tolerations
[vm-sizes]: ../virtual-machines/linux/sizes.md
[use-multiple-node-pools]: use-multiple-node-pools.md
[maximum-pods]: configure-azure-cni.md#maximum-pods-per-node