---
title: Cluster Template Reference - Network
description: Noderef reference for cluster templates for use with Azure CycleCloud
author: adriankjohnson
ms.date: 06/29/2025
ms.author: adjohnso
ms.custom: compute-evergreen
---
# NodeRef

NodeRef is rank 1. NodeRef is an internal reference to another CycleCloud node.

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
dependent on the referred node. This dependency blocks some state transitions on both the referring and referred nodes.

You can't **Terminate** the referred node until you **Terminate** the referring node.

You can't **Start** the referring node until you **Start** the referred node.

Attribute | Type | Definition
------ | ----- | ----------
Name | String | Referenced node name
SourceClusterName | String | Cluster of referenced node
