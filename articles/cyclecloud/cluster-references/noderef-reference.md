---
title: Cluster Template Reference - Network
description: Noderef reference for cluster templates for use with Azure CycleCloud
author: adriankjohnson
ms.date: 06/03/2024
ms.author: adjohnso
ms.custom: compute-evergreen
---
# NodeRef

Noderef is rank 1.  Noderef is an internal reference to another CycleCloud node.

## Examples

```ini
[noderef fsvrlsf]
[[[configuration cyclecloud.mounts.home]]]
        type = nfs
        mountpoint = /shared/home
        export_path = /mnt/raid/home
        address = ${fsvrlsf.instance.privateip}
```

## Blocking Behavior

Defining a `noderef` in a cluster template file, then using it in a node definition creates a resource dependency. The referring node is now
dependent on the referred node.  This means that some state transitions are blocked on both the referring and referred node.

The referred node cannot be **Terminated** until the referring node is **Terminated**.

The referring node cannot be **Started** until the referred node is **Started**.

Attribute | Type | Definition
------ | ----- | ----------
Name | String | Referenced node name
SourceClusterName | String | Cluster of referenced node
