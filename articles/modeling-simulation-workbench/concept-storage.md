---
title: "Storage: Azure Modeling and Simulation Workbench"
description: Types of storage offered in Modeling and Simulation Workbench.
author: yousefi-msft
ms.author: yousefi
ms.service: modeling-simulation-workbench
ms.topic: concept-article
ms.date: 08/22/2024

#CustomerIntent: As a Workbench user, I want to understand the types of storage available in the Azure Modeling and Simulation Workbench.
---
# Storage and access in Azure Modeling and Simulation Workbench

The Modeling and Simulation Workbench offers several tiers of storage classes. There are important differences in capacity and performance that make some volumes more suitable for certain situations.

## Local storage on VMs

Depending on the [Virtual Machine (VM) selected](./concept-vm-offerings.md), local temporary storage might not be available. Modeling and Simulation Workbench doesn't have controls for specifying data and OS disks as in conventional Azure VMs. Since VMs are frequently created and deleted, Microsoft recommends that users install applications and workspaces to the chamber or Shared Storage volume to improve reliability. Chamber and Shared Storages are high-performance and high-reliability volumes based on Azure NetApp Files.

## Chamber-tier storage

Chamber-accessible storage is accessible across the entire chamber, its VMs, and users. Chamber-tier storage has three classes: user home directories, data pipeline mount points, and chamber Storage.

### User home directories

The conventional Linux `/home` directory is mounted at `/mount/sharedhome`. The `/mount/sharedhome` is a single volume accessible across all chamber VMs and isn't accessible outside the chamber. This volume isn't high-performance and users are discouraged from attempting to install large files or operate intense workloads there. This directory is intended for user resource (rc), configuration, and small private directories.

### Data pipeline mount points

The data pipeline file structure has two directories: `/mount/datapipeline/datain` where imported data is staged and `/mount/datapipeline/dataout` where file exports are staged for file requests. This volume is large to accommodate large file imports and exports but files shouldn't be stored here long term. This mount is only for data import and export operations and isn't high-performance.

### Chamber Storage

Chamber Storage is the high-performance, high-capacity storage solution for use within chambers. Based on Azure NetApp Files, it's available in two high-performance tiers, and dynamically scalable after creation. Chamber Storage can be accessed at `/mount/chamberstorages` where a different directory exists for each created volume. Volumes are sizable in 4 TB increments up to the user's subscription quota.

> [!TIP]
> Users are encouraged to place all working directories and point all application runs at a chamber Storage volume for increased performance and data reliablity.

## Workbench tier Shared Storage

Shared Storage is accessible across select chambers in a Workbench. With each Shared Storage volume, you specify which chambers  have access to the volume. Shared Storage volumes appear under the `/mount/sharedstorage` mount point in every VM in the chamber to which access was granted.

To enable secure cross team and/or cross-enterprise collaboration, a Shared Storage resource allows for selective data sharing between chambers. Shared Storage is built on Azure NetApp Files storage volumes and is available to deploy in multiples of 4 TB. Workbench owners can create multiple shared storage instances on demand and dynamically link them to existing chambers to facilitate collaboration.

Users who are provisioned to a specific chamber can access all shared storage volumes linked to that chamber. Once users get deprovisioned from a chamber or that chamber gets deleted, they lose access to any linked shared storage volumes.

## Key features of shared storage

**Performance**: Shared Storage is based on Azure NetApp Files and is ideal for complex engineering or scientific workloads such as simulations.

**Scalability**: Users can adjust the storage capacity and performance tier according to their needs, just like chamber private storage.

**Management**: Workbench Owners can manage storage capacity, resize storage, and change performance tiers through the Azure portal.

> [!IMPORTANT]
> All members of a chamber have access to a Shared Storage resource once that chamber has been granted access to the storage volume. Do not place any data in Shared Storage that you do not wish to share with all members of that chamber. Create a separate chamber for select users if access needs to be restricted.

## Resources

* [Create chamber Storage](./how-to-guide-manage-chamber-storage.md)
* [Create Shared Storage](./how-to-guide-manage-shared-storage.md)
* [Chamber VM offerings and local storage](./concept-vm-offerings.md)
