---
title: Common Issues - Scaleset Attribute| Microsoft Docs
description: Troubleshoot 'node does not match existing scale set attributes' errors in Azure CycleCloud.
author: adriankjohnson
ms.date: 06/19/2026
ms.topic: troubleshooting-problem-resolution
ms.author: adjohnso
---
# Common issues: Scale set attributes

## Possible error messages

- `This node does not match existing scaleset attributes`

## Resolution

This error can occur when you change material aspects (global settings such as ImageId, MachineType, and so on) of your node array while it has running nodes. For example, if you change the definition of an MPI node array to use a different image, new nodes from the autoscaler don't match the last known configuration of the underlying scale set. 

To resolve this error, you can:
- Terminate the running VMs in the node array to allow new nodes to use the new configuration, or
- Terminate the new nodes with the error, undo the edits, and save. Start new nodes to keep the old configuration.