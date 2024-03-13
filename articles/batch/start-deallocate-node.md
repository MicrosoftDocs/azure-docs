---
title: Start/Deallocate Batch nodes
description: Extensions are small applications that facilitate post-provisioning configuration and setup on Batch compute nodes.
ms.devlang: csharp
ms.topic: tutorial
ms.custom: linux-related-content
ms.date: 03/08/2024
---

# Use Start/Deallocate operation with Batch nodes

As of the {API_VERSION} API version, users can now deallocate their Batch nodes. Deallocated nodes retain their memory contents and users are not billed for the VM usage. This is an effective cost management feature, and is the same as the one listed [here](https://learn.microsoft.com/en-us/azure/virtual-machines/hibernate-resume?tabs=osLimitsLinux%2CenablehiberPortal%2CcheckhiberPortal%2CenableWithPortal%2CcliLHE%2CUbuntu18HST%2CPortalDoHiber%2CPortalStatCheck%2CPortalStartHiber%2CPortalImageGallery).

After a node has been deallocated, it can be started to resume activity.

## Prerequisites

- Start/Deallocate operations must be specified with a minimum request version of {API_VERSION}
- Only nodes created with a Virtual Machine Configuration can be deallocated and started. 

> [!TIP]
> Only a node that is in a stable state can be deallocated, and only a node that is in the deallocated state can be started.

## Node states and workflow

When a node receives a deallocation request, it's state will change to `Deallocating` while the node undergoes deallocation. Once it has been deallocated, the state will be `Deallocated`. In this state, the node will be unreachable until it receives a Start request. After this, the node
state will change to `Starting`, and then finally `Idle` once it has finished. Note that this is only the case when the node state is retrieved using the minimal API version of {API_VERSION}. For previous versions, `Deallocating` will appear as the node's previous state, and `Deallocated`
will appear as `Offline`.

## Crafting Start/Deallocate requests

Refer to this document for crafting Start/Deallocate requests [INSERT_LINK]()

## Next steps

- Learn more about working with [nodes and pools](nodes-and-pools.md).
- Learn about [deallocating virtual machines](https://learn.microsoft.com/en-us/azure/virtual-machines/hibernate-resume?tabs=osLimitsLinux%2CenablehiberPortal%2CcheckhiberPortal%2CenableWithPortal%2CcliLHE%2CUbuntu18HST%2CPortalDoHiber%2CPortalStatCheck%2CPortalStartHiber%2CPortalImageGallery) and the benefits of doing so.
