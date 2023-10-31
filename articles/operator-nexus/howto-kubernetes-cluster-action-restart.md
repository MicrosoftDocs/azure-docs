---
title: Restart Azure Operator Nexus Kubernetes Cluster Node 
description: Learn how to restart Azure Operator Nexus Kubernetes cluster node
author: syzehra
ms.author: syzehra
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 10/22/2023 
ms.custom: template-how-to-pattern, devx-track-azurecli
---

This article provides instruction to restart Azure Operator Nexus Kubernetes cluster node via the `networkcloud` API. This action provides a way to handle the Nexus Kubernetes cluster VMs that have become unreachable. It improves the customer experience and reduce the amount of time and effort required to bring back the VM.

It takes nearly 1-5 mins for the action to complete. But, it also depends on what state the virtual machine is. If the Virtual Machine is in bad state and the restart doesn't work, it will eventually time out. 

## Before you begin
> [!NOTE]
> The approach outlined in this article represents an aggressive method for recovering an unreachable cluster VM. It does not prioritize the protection of workloads; therefore, it should be considered a last resort.
>Best practice from Kubernetes standpoint is to drain the nodes first and coordinate so nothing else can get schedule  on it and then gracefully shut it down and bring it back up.

* Make sure you have the latest version of [necessary Azure CLI extensions](./howto-install-cli-extensions.md).
* The action requires 1.1.0 or later version of `networkcloud` az CLI extension. 


## Run the CLI command to restart the Kubernetes cluster node

To run the restart action via the API, run the command as followed:

``` azurecli
az networkcloud kubernetescluster restart-node --node-name "nodeName" --kubernetes-cluster-name "kubernetesClusterName" --resource-group "resourceGroupName" --subscription "subscriptionName"
```
Here,
1. `node-name` is the name of the node from within Nexus AKS cluster.
2. `kubernetes-cluster-name` is the name of the Kubernetes cluster.
3. `resource-group` is the name of the resource group cluster is present.
4. `subscription` name or ID of the subscription


Sample output is as followed:

```json
{
    "endTime": "2023-10-20T19:28:31.972299Z",
    "id": "/subscriptions/$SUBSCRIPTION/providers/Microsoft.NetworkCloud/locations/EASTUS/operationStatuses/000000000-0000-0000-0000-000000000000",
    "name":"7f835f51-9b85-4607-9be1-41f09c11bc24*B684BCD26460AF4CD9525D5F4FFABA73B623C6A465E9C1E26D7B12EDB3D3EA78",
    "resourceId": "/subscriptions/$SUBSCRIPTION/resourceGroups/myResourceGroup/providers/Microsoft.NetworkCloud/kubernetesClusters/myNexusK8sCluster",
    "startTime": "2023-10-20T19:27:52.561479Z",
    "status": "succeeded"
}
```

