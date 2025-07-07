---
title: Prevent Node Termination
description: How to prevent CycleCloud from terminating nodes
author: adriankjohnson
ms.date: 03/20/2020
ms.author: adjohnso
---

# Preventing Node Termination

CycleCloud nodes are generally disposable. They can automatically be terminated by autoscale and are attached to the cluster's life cycle, so when a cluster is terminated all nodes associated with the cluster are terminated as well.

There are a number of cases where it is useful to prevent a node from being terminated:

* When a node is started for something besides running jobs.
* When a problem arises on a node while running jobs and it needs to be "frozen" for debugging.
* To protect important nodes from accidental termination.

## Using the KeepAlive Attribute

The `KeepAlive` attribute will prevent CycleCloud from terminating or deallocating the node. The `KeepAlive` attribute must be disabled before the node can be terminated.

> [!WARNING]
> KeepAlive does not use Azure locks so does not prevent VMs from being deleted or deallocated from the Azure portal.

### via CycleCloud GUI

When a node is manually added to a cluster using  **Add Node**, the `KeepAlive` option is selected by default. Generally, manually created nodes should be terminated manually so `KeepAlive` will prevent autoscaling from terminating them.

![KeepAlive add node dialog](~/articles/cyclecloud/images/keep-alive-add-dialog.png)

In some situations it is useful to prevent an autoscaling node from being terminated. For instance, a user can enable `KeepAlive` through the **Edit** interface to prevent an unresponsive node that warrants further debugging from being terminated by the autoscaler.

![KeepAlive edit node dialog](~/articles/cyclecloud/images/keep-alive-edit-dialog.png)

### via Template

Some important nodes should be protected as soon as they are started. When the `KeepAlive` attribute is set on a node in the cluster template, the node can not be terminated until `KeepAlive` is removed.

```ini
[node my_important_node]
    KeepAlive = true
    tags.message = Do Not Delete
```
