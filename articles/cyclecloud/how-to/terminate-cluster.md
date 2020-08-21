---
title: Terminate a Cluster
description: Learn how to terminate a cluster in Azure CycleCloud. Cluster termination stops and removes the VMs and deletes non-persistent volumes.
author: adriankjohnson
ms.date: 03/30/2020
ms.author: adjohnso
---

# Terminate a Cluster

You can terminate a cluster when it has completed all the submitted jobs and the cluster is no longer needed. Terminating the cluster will stop and remove the virtual machines and delete any non­-persistent volumes in the cluster. Nodes that originate from a nodearray are removed, while other nodes remain in the cluster in the `Off` state.

Terminating is an orchestration process. Cluster nodes will move into the `Terminating` state and then to `Off` if the termination was successful. If there is an error during the process, that node will be marked as `Failed`, and can be retried.

## Terminate via CycleCloud GUI

Click **Terminate** in the CycleCloud GUI to shut down all of the cluster's infrastructure. All underlying Azure resources will be cleaned up as part of the cluster termination, which may take several minutes.

:::image type="content" source="~/images/terminate-cluster.png" alt-text="terminate cluster dialog":::

## Terminate via CycleCloud CLI

The CycleCloud CLI can also [terminate clusters](~/cli.md#cyclecloud-terminate_cluster):

```bash
cyclecloud terminate_cluster my_cluster_name
```

## Delete a Resource Group

To remove the resources no longer needed, you can simply delete the resource group. Everything within that group will be cleaned up as part of the process:

```azurecli-interactive
az group delete --name "{RESOURCE GROUP}"
```
