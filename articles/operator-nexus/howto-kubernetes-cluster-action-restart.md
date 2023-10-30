---
title: Restart kubernetes cluster node 
description: Learn how to restart kubernetes cluster node via the API
author: syzehra
ms.author: syzehra
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 10/22/2023 
ms.custom: template-how-to-pattern, devx-track-azurecli
---

# Action to restart kubernetes cluster node

This article provides instruction to restart kubernetes cluster node via the `networkcloud` API. This action provides a way to handle the Nexus AKS VMs that have become unreachable. It improves the customer experience and reduce the amount of time and effort required to bring back the VM.

> [!NOTE]
> This is an aggressive approach to get back the VM that has become unreachable. 
> It doesn't make any attempt to protect the workloads. Hrnce, should be the last resort.

Best practice from kubernetes standpoint is to drain the nodes first and coordinate so nothing else can get schedule  on it and then gracefully shut it down and bring it back up. 

It takes nearly 1-5 mins for the action to complete. But, it also depends on what state the virtual machine is. If the Virtual Machine is in bad state and the restart doesn't work, it may eventually time out. 

## Before you begin

* Make sure you have the latest version of [necessary Azure CLI extensions](./howto-install-cli-extensions.md).
* This article requires 2.49.0 or later version of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.
* The action requires 1.1.0 or later version of `networkcloud` extension. 


## Run the CLI command to restart the kubernetes cluster node

To run the restart action via the API, we run the following command

``` azurecli
az networkcloud kubernetescluster restart-node --node-name "nodeName" --kubernetes-cluster-name "kubernetesClusterName" --resource-group "resourceGroupName"
```
Here,
1. `node-name` is the name of the node from within Nexus AKS cluster.
2. `kubernetes-cluster-name` is the name of the Kubernetes cluster.
3. `resource-group` is the name of the resource group cluster is present.


Sample output is as followed:

```json
{
    "endTime": "2023-10-20T19:28:31.972299Z",
    "id": "/subscriptions/fca2e8ee-1179-48b8-9532-428ed0873a2e/providers/Microsoft.NetworkCloud/locations/EASTUS/operationStatuses/7f835f51-9b85-4607-9be1-41f09c11bc24*B684BCD26460AF4CD9525D5F4FFABA73B623C6A465E9C1E26D7B12EDB3D3EA78",
    "name":"7f835f51-9b85-4607-9be1-41f09c11bc24*B684BCD26460AF4CD9525D5F4FFABA73B623C6A465E9C1E26D7B12EDB3D3EA78",
    "resourceId": "/subscriptions/fca2e8ee-1179-48b8-9532-428ed0873a2e/resourceGroups/test-naks-rg/providers/Microsoft.NetworkCloud/kubernetesClusters/testnaks",
    "startTime": "2023-10-20T19:27:52.561479Z",
    "status": "succeeded"
}
```

