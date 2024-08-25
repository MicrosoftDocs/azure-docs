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

The Azure Modeling and Simulation Workbench has various types of storage available to users. There are notable differences between what users may have in their on-premises environments and may cause issues if not noted.

## Local storage on VMs

Depending on the [VM selected](./concept-vm-offerings.md), there may or may not be local storage on the VM. Modeling and Simulation Workbench doesn't have controls for specifying data and OS disks as in conventional Azure VMs. Since VMs are frequently created and deleted, Microsoft recommends that users install applications to a Chamber Storage volume as well as perform work there to minimize the possibility of loss.

## Chamber-tier storage

Chamber-accessible storage is accessible across the entire Chamber, its VMs, and users. Chamber-tier storage has three classes: user directories, data pipeline mount points, and Chamber Storage.

### User home directories

The conventional Linux `/home` directory is mounted at `/mount/sharedhome`. This is a singular volume accessible across all Chamber VMs, isn't accessible outside the Chamber. This volume is not a high-performance volume and users are discouraged from attempting to install large files or perform daily work there. This directory is intended for user resource (rc) files and small private directories.

### Data pipeline

The data pipeline file structure has two directories: `/mount/datapipeline/datain` where imported data is staged and `/mount/datapipeline/dataout` where file exports are staged for file requests. This volume is large to accommodate large file imports and exports but files shouldn't be stored here long term. This mount is only for data import and export operations and is not high-performance.

### Chamber Storage

Chamber Storage is the premier Chamber Storage offering. It is hosted on Azure NetApp Files, available in two high-performance tiers, and is scalable up or down. Chamber Storage can be accessed at `/mount/chamberstorages` where a different directory exists for each created volume. Volumes are sizable in 4 TB increments up to the user's subscription quota.

> [!TIP]
> Users are encouraged to place all working directories and point all application runs at a Chamber Storage volume for increased performance and data reliablity.

## Workbench tier storage

Shared storage is accessible across Chambers in a Workbench. With each Shared Storage, you must specify which Chambers will have access to the Shared Storage Volume. Shared Storage volumes appear under the `/mount/sharedstorage` mount point in every VM in the Chamber to which access was granted.

To enable cross team and/or cross-organization collaboration in a secure manner within the workbench, a shared storage resource allows for selective data sharing between collaborating parties. It's an Azure NetApp Files based storage volume and is available to deploy in multiples of 4 TBs. Workbench owners can create multiple shared storage instances on demand and dynamically link them to existing chambers to facilitate secure collaboration.

Users who are provisioned to a specific chamber can access all shared storage volumes linked to that chamber. Once users get deprovisioned from a chamber or that chamber gets deleted, they lose access to any linked shared storage volumes.

## Key features of shared storage

**Performance**: A shared storage resource within the workbench is high-performance Azure NetApp Files based, targeting complex engineering workloads. It isn't limited to being used as a data transfer mechanism. The resource can also be used to run simulations.

**Scalability**: Users can adjust the storage capacity and performance tier according to their needs, just like chamber private storage.

**Management**: Workbench Owners can manage storage capacity, resize storage, and change performance tiers through the Azure portal.

> [!IMPORTANT]
> All members of a Chamber have access to a Shared Storage resource once that Chamber has been granted access to the storage volume. Do not place any data in Shared Storage that you do not wish to share with all members of that Chamber. Create a separate Chamber for select users if access needs to be restricted.

## Resources

* [Create Chamber Storage](./how-to-guide-manage-chamber-storage.md)
* [Create Shared Storage](./how-to-guide-manage-shared-storage.md)
* [Chamber VM offerings and local storage](./concept-vm-offerings.md)
