---
title: Support for using Azure Site Recovery with Azure Backup
ms.reviewer: v-gajeronika
description: This article summarizes support for using the Site Recovery service together with the Azure Backup service.
author: Jeronika-MS
ms.service: azure-site-recovery
ms.topic: overview
ms.date: 12/08/2025
ms.author: v-gajeronika

# Customer intent: As an IT administrator, I want to understand how Azure Site Recovery and Azure Backup work together, so that I can effectively implement a disaster recovery and backup strategy for my virtual machines.
---
# Support for using Site Recovery with Azure Backup

> [!NOTE]
> Running MARS agent of both ASR and Backup on the same Hyper-V host isn't supported.

This article summarizes support for using the [Site Recovery service](site-recovery-overview.md) together with the [Azure Backup service](../backup/backup-overview.md).

The following table is applicable across all supported Azure Site Recovery scenarios.

**Action** | **Site Recovery support** | **Details**
--- | --- | ---
**Deploy services together** | Supported | Services are interoperable and can be configured together.
**File backup/restore** | Supported | When backup and replication are enabled for a VM and backups are taken, there's no issue in restoring files on the source-side VMs, or group of VMs. Replication continues as usual with no change in replication health.
**Disk restore** | No current support | If you restore a backed-up disk, you need to disable and re-enable replication for the VM again.
**VM restore** | No current support | If you restore a VM or group of VMs, you need to disable and re-enable replication for the VM.

## Next steps

Learn about [Azure Backup service](../backup/backup-overview.md).
