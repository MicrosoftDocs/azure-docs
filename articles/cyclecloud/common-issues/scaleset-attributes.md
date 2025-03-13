---
title: Common Issues - Scaleset Attribute| Microsoft Docs
description: Azure CycleCloud common issue - Scaleset Attribute
author: adriankjohnson
ms.date: 11/15/2019
ms.author: adjohnso
---
# Common Issues: ScaleSet Attributes

## Possible Error Messages

- `This node does not match existing scaleset attributes`

## Resolution

This error can occur when changing material aspects (global settings such as ImageId, MachineType, etc.) of your nodearray while it has running nodes. For example, if you change the definition of an MPI nodearray to use a different image, new nodes from the autoscaler will not match the last known configuration of the underlying scale set. 

Potential resolutions to this error:
- Terminate the running VMs in the nodearray to allow new nodes to use the new configuration, or, 
- Terminate the new nodes with the error, undo the edits and save, start new nodes to keep the old configuration.