---
title: Restart Azure Operator Nexus Kubernetes cluster node 
description: Learn how to restart Azure Operator Nexus Kubernetes cluster node
author: syzehra
ms.author: syzehra
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 10/22/2023 
ms.custom: template-how-to-pattern
---

# Restart Azure Operator Nexus Kubernetes cluster node

Occasionally, a Nexus Kubernetes node might become unreachable. This article explains how to restart the node via the `az networkcloud kubernetescluster restart-node` CLI command.

Restarting a Nexus Kubernetes node can take up to 5 minutes to complete. However, if the Virtual Machine is in bad state, the restart action will eventually time out. Open an Azure support ticket for such instances.

## Before you begin
> [!NOTE]
> The approach outlined in this article represents an aggressive method for recovering an unreachable cluster VM. Workloads that are running on the VM will be terminated; therefore, this restart action should be considered a last resort.
> Before performing a restart on a VM, consider first cordoning and draining the node, then gracefully shutting the VM down and bringing it back up.

Make sure you have the latest version of [necessary Azure CLI extensions](./howto-install-cli-extensions.md).

## Restart cluster node

### Get node name
In order to restart the cluster VM, node-name is required, which can be obtained through
- The az CLI command  `az networkcloud kubernetescluster show --name "kubernetesClusterName" --resource-group "resourceGroupName" --subscription "subscriptionName` lists the details of the node. 
- Alternatively, `kubectl get node` lists the nodes. 

### Run the CLI command to restart the Nexus Kubernetes cluster node

To restart a cluster node, run the command as follows:

``` azurecli
az networkcloud kubernetescluster restart-node --node-name "nodeName" --kubernetes-cluster-name "kubernetesClusterName" --resource-group "resourceGroupName" --subscription "subscriptionName"
```
To use this command, you need to understand the various options for specifying the node, Nexus Kubernetes cluster, and resource group. Here are the available options:

- `--node-name` - is a required argument that specifies the name of the node that you want to restart within the Nexus Kubernetes cluster. You must provide the exact name of the node that you want to restart.
- `--kubernetes-cluster-name` - is a required argument that specifies the name of the Nexus Kubernetes cluster that the node is a part of. You must provide the exact name of the cluster.
- `--resource-group` - is a required argument that specifies the name of the resource group that the Nexus Kubernetes cluster is located in. You must provide the exact name of the resource group.
- `--subscription` - is an optional argument that specifies the subscription that the resource group is located in. If you have multiple subscriptions, you have to specify which one to use.

Here's a sample of what the `restart-node` command generates,

```json
{
    "endTime": "2023-10-20T19:28:31.972299Z",
    "id": "/subscriptions/000000000-0000-0000-0000-000000000000/providers/Microsoft.NetworkCloud/locations/<location>/operationStatuses/000000000-0000-0000-0000-000000000000",
    "name":"7f835f51-9b85-4607-9be1-41f09c11bc24*B684BCD26460AF4CD9525D5F4FFABA73B623C6A465E9C1E26D7B12EDB3D3EA78",
    "resourceId": "/subscriptions/000000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.NetworkCloud/kubernetesClusters/myNexusK8sCluster",
    "startTime": "2023-10-20T19:27:52.561479Z",
    "status": "succeeded"
}
```
 
