---
title: Abort an Azure Kubernetes Service (AKS) long running operation
description: Learn how to terminate a long running operation on an Azure Kubernetes Service cluster at the node pool or cluster level. 
services: container-service
ms.topic: article
ms.date: 08/30/2022

---

# Terminate a long running operation on an Azure Kubernetes Service (AKS) cluster

Sometimes deployment or other processes running within pods on nodes in a cluster can run for periods of time longer than expected due to various reasons. While it's important to allow those processes to gracefully terminate when they're no longer needed, there are circumstances where you need to release control of node pools and clusters with long running operations using an *abort* command.

AKS now supports aborting a long running operation, allowing you to take back control and run another operation seamlessly. This design is supported using the [Azure REST API](/rest/api/azure/) or the [Azure CLI](/cli/azure/).

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, start with reviewing our guidance on how to design, secure, and operate an AKS cluster to support your production-ready workloads. For more information, see [AKS architecture guidance](/azure/architecture/reference-architectures/containers/aks-start-here).

## Abort a long running operation

### [Azure REST API](#tab/azure-rest)

You can use the Azure REST API [Abort](/rest/api/aks/managed-clusters) operation to stop an operation against the Managed Cluster.

The following example terminates a process for a specified agent pool.

```rest
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ContainerService/managedclusters/{resourceName}/agentPools/{agentPoolName}/abort
```

The following example terminates a process for a specified managed cluster.

```rest
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ContainerService/managedclusters/{resourceName}/abort
```

The Provisioning states to be used for this feature are *Canceling* and *Canceled*. Its important to understand that the abort call ultimately results in a **Canceled** provisioning state.

### [Azure CLI](#tab/azure-cli)

You can use the [az aks nodepool](/cli/azure/aks/nodepool) command with the `operation-abort` argument to abort an operation on a node pool or a managed cluster.

The following example terminates an operation on a node pool on a specified cluster by its name and resource group that holds the cluster.

```azurecli-interactive
az aks nodepool operation-abort\

--resource-group myResourceGroup \

--cluster-name myAKSCluster \
```

The following example terminates an operation against a specified managed cluster its name and resource group that holds the cluster.

```azurecli-interactive
az aks operation-abort --name myAKSCluster --resource-group myResourceGroup
```

---