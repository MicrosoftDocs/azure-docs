---
title: Azure CycleCloud Clusters and Nodes | Microsoft Docs
description: Learn about Azure CycleCloud clusters, nodes, and node arrays.
author: KimliW
ms.date: 08/01/2018
ms.author: adjohnso
---

# Clusters

A *cluster* is a group of connected computers (*nodes*) working together as one unit. Within a cluster, multiple nodes are set to perform the same task. The how, what, when, and where of the task is controlled by software like Azure CycleCloud.

Azure CycleCloud comes with a set of pre-installed templates that can be used to create new clusters from the GUI. You can also create clusters by importing a *cluster template* into CycleCloud using the CLI.

## Further Reading

* Create a [Cluster Template](cluster-templates.md)
* [Start a Cluster](start-cluster.md)
* [Auto Scaling](autoscale.md)
* [Terminate a Cluster](end-cluster.md)

## Nodes and Node Arrays

A *node* is a single virtual machine. A *node array* is a collection of nodes with the same configuration, and can be automatically or manually scaled to pre-defined limits using `MaxCount` (limits the number of instances to start) and `MaxCoreCount` (limits the number of cores started).

These maximums are hard limits, meaning no nodes will be started at any time outside the constraints defined.

To get the capacity needed for your job, node arrays can span multiple machine types. When an array is scaled up, instances are chosen from the listed machine types in order of preference. CycleCloud will attempt to spin up all instances using your preferred machine type. If the preferred type is not available, CycleCloud will automatically try to acquire the machine type next in your list, continuing until it can either reach your desired capacity or there are no more machine types in the list. At that point, it will periodically request instances in order.

## Further Reading

* [Node Configuration Reference](node-configuration-reference.md)
