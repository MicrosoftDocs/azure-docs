---
title: Manage resources that are created during the virtual machine move process in Azure Resource Mover
description: Learn how to manage resources that are created during the virtual machine move process in Azure Resource Mover.
author: ankitaduttaMSFT 
ms.service: resource-mover
ms.topic: how-to
ms.date: 03/29/2024
ms.author: ankitadutta
ms.custom: engagement-fy23
---

# Manage resources created for the virtual machine move

This article describes how to manage resources that are created explicitly by [Azure Resource Mover](overview.md) to facilitate the virtual machine move process. 

After moving virtual machines across regions, there are a number of resources created by Resource Mover that should be cleaned up manually.

## Delete resources created for virtual machine move

Manually delete the move collection, and Site Recovery resources created for the virtual machine move.

1. Review the resources in resource group ```ResourceMoverRG-<sourceregion>-<target-region>-<metadataRegionShortName>```.
2. Check that the virtual machine and all other source resources in the move collection have been moved/deleted. This ensures that there are no pending resources using them.
2. Delete these resources.

    - The move collection name is ```movecollection-<sourceregion>-<target-region>-<metadata-region>```.
    - The cache storage account name is ```resmovecache<guid>```
    - The vault name is ```ResourceMove-<sourceregion>-<target-region>-GUID```.

## Next steps

Try [moving a virtual machine](tutorial-move-region-virtual-machines.md) to another region with Resource Mover.
