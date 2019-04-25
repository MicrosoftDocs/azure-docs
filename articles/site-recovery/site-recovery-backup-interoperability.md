---
title: Support for using Azure Site Recovery with Azure Backup  | Microsoft Docs
description: Provides an overview of how Azure Site Recovery and Azure Backup can be used together.
services: site-recovery
author: sideeksh
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 03/18/2019
ms.author: sideeksh

---
# Support for using Site Recovery with Azure Backup

This article summarizes support for using the [Site Recovery service](site-recovery-overview.md) together with the [Azure Backup service](https://docs.microsoft.com/azure/backup/backup-overview).

**Action** | **Site Recovery support** | **Details**
--- | --- | ---
**Deploy services together** | Supported | Services are interoperable and can be configured together.
**File backup/restore** | Supported | When backup and replication are enabled for a VM and backups are taken, there's no issue in restoring files on the source-side VMs, or group of VMs. Replication continues as usual with no change in replication health.
**Disk backup/restore** | No current support | If you restore a backed up disk, you need to disable and reenable replication for the VM again.
**VM backup/restore** | No current support | If you back up or restore a VM or group of VMs, you need to disable and reenable replication for the VM.  


