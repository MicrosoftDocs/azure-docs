---
title: Terminate a Cluster
description: Learn how to terminate a cluster in Azure CycleCloud. Cluster termination stops and removes the VMs and deletes non-persistent volumes.
author: adriankjohnson
ms.date: 11/12/2021
ms.author: adjohnso
---

# Terminate a Cluster

You can terminate a cluster when it completes all jobs submitted and the cluster isn't needed. Terminating the cluster stops and removes virtual machines and delete any non­persistent volumes in the cluster. Nodes that originate from a nodearray are removed, while other nodes remain in the cluster in the `Off` state.

Terminating is an orchestration process where cluster nodes move into the `Terminating` state and then to `Off` if the termination succeeds. If there's an error during the process, that node is marked as `Failed` and can be retried.

## Terminate via CycleCloud GUI

Select **Terminate** in the CycleCloud GUI to shut down the cluster's infrastructure. All underlying Azure resources are cleaned up as part of the cluster termination, which can take several minutes.

::: moniker range="=cyclecloud-7"
![terminate cluster dialog](../images/version-7/terminate-cluster.png)
::: moniker-end

::: moniker range=">=cyclecloud-8"
![terminate cluster dialog](../images/version-8/terminate-cluster.png)
::: moniker-end

## Terminate via CycleCloud CLI

The CycleCloud CLI can also [terminate clusters](~/articles/cyclecloud/cli.md#cyclecloud-terminate_cluster):

```bash
cyclecloud terminate_cluster my_cluster_name
```

## Delete a Resource Group

To remove the resources that aren't needed, you can delete the resource group and everything within it:

```azurecli-interactive
az group delete --name "{RESOURCE GROUP}"
```

::: moniker range=">=cyclecloud-8"

## Force-Delete Virtual Machines

CycleCloud 8.2.1 supports the **Force Delete** option for VMs, which can provide faster delete times at the risk of possible data loss on the disks. This feature can be enabled separately for standalone VMs (such as scheduler head nodes) or scaleset VMs (execute nodes). To enable it, go to the **Settings** page in the upper right corner, and **Configure CycleCloud**.

![Force Delete settings](~/articles/cyclecloud/images/force-delete-settings.png)

This setting affects all VMs managed by CycleCloud but can be changed at any time.

> [!WARNING]
> This feature isn't recommended for VMs whose data disks contain critical data!
::: moniker-end