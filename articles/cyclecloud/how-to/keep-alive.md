---
title: Prevent Node Termination
description: How to prevent CycleCloud from terminating nodes
author: adriankjohnson
ms.date: 07/01/2025
ms.author: adjohnso
---

# Preventing node termination

CycleCloud nodes are generally disposable. Autoscale can automatically terminate them. They're attached to the cluster's life cycle, so when you terminate a cluster, all nodes associated with the cluster are terminated.

There are several cases where it helps to prevent a node from being terminated:

* When you start a node for something other than running jobs.
* When a problem arises on a node while running jobs and it needs to be "frozen" for debugging.
* To protect important nodes from accidental termination.

## Using the KeepAlive attribute

The `KeepAlive` attribute prevents CycleCloud from terminating or deallocating the node. You must disable the `KeepAlive` attribute before the node can be terminated.

> [!WARNING]
> KeepAlive doesn't use Azure locks, so it doesn't prevent VMs from being deleted or deallocated from the Azure portal.

### via CycleCloud GUI

When you add a node to a cluster using **Add Node**, the `KeepAlive` option is selected by default. Generally, you should terminate manually created nodes, so the `KeepAlive` option prevents autoscaling from terminating these nodes.

![KeepAlive add node dialog](~/articles/cyclecloud/images/keep-alive-add-dialog.png)

In some situations, it helps to prevent autoscaling from terminating a node. For example, you can enable `KeepAlive` through the **Edit** interface to prevent autoscaling from terminating an unresponsive node that needs further debugging.

![KeepAlive edit node dialog](~/articles/cyclecloud/images/keep-alive-edit-dialog.png)

### Via template

Protect important nodes as soon as they start. When you set the `KeepAlive` attribute on a node in the cluster template, you can't terminate the node until you remove `KeepAlive`.

```ini
[node my_important_node]
    KeepAlive = true
    tags.message = Do Not Delete
```
