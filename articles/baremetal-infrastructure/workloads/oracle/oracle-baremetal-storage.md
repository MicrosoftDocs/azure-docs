---
title: Storage on BareMetal for Oracle workloads
description: Learn about the storage offered by the BareMetal Infrastructure for Oracle workloads.
ms.topic: reference
ms.subservice: workloads
ms.date: 04/14/2021
---

# Storage on BareMetal for Oracle workloads

In this article, we'll give an overview of the storage offered by the BareMetal Infrastructure for Oracle workloads.

BareMetal Infrastructure for Oracle offers NetApp Network File System (NFS) storage. NFS storage does not require Oracle Real Application Clusters (RAC) certification. For more information, see [Oracle RAC Technologies Matrix for Linux Clusters](https://www.oracle.com/database/technologies/tech-generic-linux-new.html).

This storage offering includes Tier 3 support from an OEM partner, using either A700s or A800s storage controllers.

BareMetal Infrastructure storage offers these premium storage capabilities:

- Storage volumes for Data/log/quorum/FSA offered via the dNFS protocol.
- Disk redundancy (*Protection against up to two disk failures*).
- Scale out your data to multiple volumes limited to 100 TB per volume.
- Scale out to multiple storage controllers up to 12 controllers.
- No disk level management (*add/remove disks*), automatically taken care by Infra.
- No downtime for redistributing the file contents to different volumes.
- Ability to grow/shrink volumes.
- SnapCenter integration for backup using cloning and SnapVault.
- Data encryption at rest, supporting FIPS (140-2).

## Next steps

Learn about BareMetal Infrastructure patching considerations.

> [!div class="nextstepaction"]
> [Patching considerations for BareMetal for Oracle](oracle-baremetal-patching.md)

