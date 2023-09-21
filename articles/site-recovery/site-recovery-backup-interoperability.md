---
title: Support for using Azure Site Recovery with Azure Backup 
description: Provides an overview of how Azure Site Recovery and Azure Backup can be used together.
author: ankitaduttaMSFT
manager: rochakm
ms.service: site-recovery
ms.topic: conceptual
ms.date: 10/15/2019
ms.author: ankitadutta

---
# Support for using Site Recovery with Azure Backup

This article summarizes support for using the [Site Recovery service](site-recovery-overview.md) together with the [Azure Backup service](../backup/backup-overview.md).

**Action** | **Site Recovery support** | **Details**
--- | --- | ---
**Deploy services together** | Supported | Services are interoperable and can be configured together.
**File backup/restore** | Supported | When backup and replication are enabled for a VM and backups are taken, there's no issue in restoring files on the source-side VMs, or group of VMs. Replication continues as usual with no change in replication health.
**Disk restore** | No current support | If you restore a backed up disk, you need to disable and re-enable replication for the VM again.
**VM restore** | No current support | If you restore a VM or group of VMs, you need to disable and re-enable replication for the VM.  

Please note that the above table is applicable across all supported Azure Site Recovery scenarios.
