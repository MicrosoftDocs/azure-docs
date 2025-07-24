---
title: Terminate a Cluster
description: Learn how to terminate a cluster in Azure CycleCloud. Cluster termination stops and removes the VMs and deletes non-persistent volumes.
author: adriankjohnson
ms.date: 07/01/2025
ms.author: adjohnso
---

# Terminate a cluster

You can terminate a cluster when it completes all submitted jobs and you no longer need the cluster. Terminating the cluster stops and removes virtual machines and deletes any non-persistent volumes in the cluster. The process removes nodes that come from a node array, but it leaves other nodes in the cluster in the `Off` state.

Termination is an orchestration process where cluster nodes move into the `Terminating` state and then to `Off` if the termination succeeds. If an error occurs during the process, the node is marked as `Failed` and can be retried.

## Terminate via CycleCloud GUI

Select **Terminate** in the CycleCloud GUI to shut down the cluster's infrastructure. The termination process cleans up all underlying Azure resources and can take several minutes.

::: moniker range="=cyclecloud-7"
![terminate cluster dialog](../images/version-7/terminate-cluster.png)
::: moniker-end

::: moniker range=">=cyclecloud-8"
![terminate cluster dialog](../images/version-8/terminate-cluster.png)
::: moniker-end

## Terminate via CycleCloud CLI

You can also use the CycleCloud CLI to [terminate clusters](~/articles/cyclecloud/cli.md#cyclecloud-terminate_cluster):

```bash
cyclecloud terminate_cluster my_cluster_name
```

## Delete a resource group

To remove resources you don't need, delete the resource group and everything in it:

```azurecli-interactive
az group delete --name "{RESOURCE GROUP}"
```

::: moniker range=">=cyclecloud-8"

## Force-delete virtual machines

CycleCloud 8.2.1 supports the **Force Delete** option for VMs. This option provides faster delete times but comes with the risk of possible data loss on the disks. You can enable this feature separately for standalone VMs (such as scheduler head nodes) or scaleset VMs (execute nodes). To enable it, go to the **Settings** page in the upper right corner, and select **Configure CycleCloud**.

![Force Delete settings](~/articles/cyclecloud/images/force-delete-settings.png)

This setting affects all VMs that CycleCloud manages. You can change it at any time.

> [!WARNING]
> Don't use this feature for VMs whose data disks contain critical data.
::: moniker-end