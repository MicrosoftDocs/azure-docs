---
title: "Storage: Azure Modeling and Simulation Workbench"
description: Types of storage.
author: yousefi-msft
ms.author: yousefi
ms.service: modeling-simulation-workbench
ms.topic: concept-article
ms.date: 08/22/2024

#CustomerIntent: As a Workbench user, I want to understand the types of storage available in the Azure Modeling and Simulation Workbench.
---
# Storage and access in Azure Modeling and Simulation Workbench

The Azure Modeling and Simulation Workbench has various types of storage available to users. There are notable differences between what users may have in their on-premise environments and may cause issues if not noted.

## Local storage on VMs

Depending on the [VM selected](./concept-vm-offerings.md), there may or may not be local storage on the VM. Modeling and Simulation Workbench does not have controls for specifying data and OS disks as in conventional Azure VMs. Since VMs are frequently created and deleted, Microsoft recommends that users install applications to a Chamber Storage volume as well as perform work there to minimize the possibility of loss.

## Chamber-tier storage

Chamber-accessible storage is accessible across the entire Chamber, its VMs, and users.  Chamber-tier storage has three classes: user directories, data pipeline mount points, and Chamber Storage.

### User home directories

The conventional Linux `/home` directory is mounted at `/mount/sharedhome`. This is a singular volume accessible across  all Chamber VMs, is not accessible outside the Chamber. This volume is not a high-performance volume and users are discouraged from attempting to install large files or perform daily work there. This directory is intended for user resource (rc) files and small private directories.

### Data pipeline

The data pipeline file structure has two directories: `/mount/datapipeline/datain` where imported data is staged and `/mount/datapipeline/dataout` where file exports are staged for file requests. This volume is large to accommodate large file imports and exports but files should not be stored here longterm. This mount is only for data import and export operations and is not high-performance.

### Chamber Storage

Chamber Storage is the premier Chamber Storage offering.  It is hosted on Azure NetApp Files, is available in two high-performance tiers and is scalable up or down. Chamber Storage can be accessed at `/mount/chamberstorages` where a different directory exists for each created volume.  Volumes are sizable in 4TiB increments up to the user's subscription quota.  

> [!TIP]
> Users are encouraged to place all working directories and point all application runs at a Chamber Storage volume for increased performance and data reliablity.

## Workbench tier storage

Shared storage is accessible across Chambers in a Workbench. With each Shared Storage, you must specifiy which Chambers will have access to the Shared Storage Volume.  Shared Storage volumes appear under the `/mount/sharedstorage` mount point in every VM in the Chamber to which access was granted.

> [!IMPORTANT]
> All Chamber member have access to Shared Storage when that Chamber is granted access. Do not place any data in Shared Storage you do not wish to share with all members of that Chamber. Create a separate Chamber for select users if access needs to be restricted to Shared Storage.

## Next steps

> [!div class="nextstepaction"]
> [Create Chamber Storage](article-concept.md)
