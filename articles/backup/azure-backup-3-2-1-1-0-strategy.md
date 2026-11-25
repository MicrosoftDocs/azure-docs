---
title: Plan a 3-2-1-1-0 backup strategy with Azure Backup
description: Learn how Azure Backup can support a 3-2-1-1-0 strategy with vault storage, isolation, recovery options, and restore automation.
author: akarshprabhu
ms.author: akak
ms.date: 11/04/2026
ms.topic: best-practice
ms.service: azure-backup
#customer intent: As a data protection administrator, I want to plan a 3-2-1-1-0 backup strategy with Azure Backup, so that I can protect data and validate recovery across cloud and hybrid workloads.
---

# Plan a 3-2-1-1-0 backup strategy with Azure Backup

The 3-2-1-1-0 strategy helps you plan backup copies, storage, isolation, and recovery testing. Azure Backup provides cloud backup and restore capabilities that can support each part of this approach. This article explains how to use Azure Backup as part of a broader business continuity and disaster recovery (BCDR) plan.

## What 3-2-1-1-0 means

- **3 copies**: Keep three copies of data in total: one production copy and at least two backups.
- **2 storage types**: Store the backups across two storage media types or hardware configurations, such as local disk, cloud storage, or tape.
- **1 offsite copy**: Keep at least one backup at an external location or in the cloud, separate from the production site.
- **1 isolated copy**: Keep at least one backup offline, air-gapped, or immutable so that an attacker can't alter or delete it.
- **0 restore errors**: Aim for zero restore errors by monitoring backup jobs and testing recovery regularly.

## Map the strategy to Azure Backup

### Keep three copies

Plan a three-copy layout with your production data, an operational backup copy for faster recovery, and a vaulted backup copy for separate retention and protection. Azure Backup's operational and vaulted backup options provide building blocks for this layout. Align backup policies and retention so that both backup copies remain available for the period your recovery plan requires.

This layout gives you multiple recovery options across operational and durable backup storage.

See the [Azure Backup support matrix](backup-support-matrix.md) for backup options.

### Use two storage types or configurations

Consider the storage behind each copy: workload-native production storage, operational snapshot mechanisms, and Azure Backup-managed vault storage. This separation helps reduce dependence on a single storage configuration or recovery path.

Azure Backup also offers Standard and Archive tiers for vaulted recovery points. Use Standard for recovery points you expect to restore more frequently and Archive for long-term retention. These tiers provide further tier separation within your design. See the [Archive tier support matrix](archive-tier-support.md) and the [Azure Backup support matrix](backup-support-matrix.md) for storage options.

### Keep one copy offsite

Use vaulted backups to keep recovery data in the cloud, separate from the production resource. For on-premises environments, this setup provides an offsite cloud copy. For cloud environments, include regional separation in your recovery plan. Geo-redundant storage (GRS) replicates vault data to a paired secondary region, and Cross-Region Restore (CRR) provides a way to restore from that region.

Learn more about [backup storage redundancy](backup-azure-recovery-services-vault-overview.md#storage-settings-in-the-recovery-services-vault) and review the [Cross Region Restore support matrix](backup-support-matrix.md#cross-region-restore).

### Keep one copy isolated or immutable

Azure Backup supports this goal with a **Logically air-gapped vault**, which combines logical isolation with protection controls. Learn how it works in the [security and cyber recovery overview](security-overview.md#logically-air-gapped-vault), and see the [immutable vault support matrix](backup-azure-immutable-vault-concept.md#support-matrix).

Use locked immutability to protect retained recovery points from destructive changes, with WORM (write once, read many) storage as described in the support matrix. Multi-user authorization (MUA) with Resource Guard separates authorization for critical operations, and always-on soft delete keeps deleted data recoverable for its configured retention period. Apply least-privilege RBAC, private endpoints, and encryption to strengthen access control, network security, and confidentiality. Together, these controls help preserve a recovery path if production credentials are compromised. See [Azure Backup security best practices](azure-backup-data-protection-best-practices.md) for configuration guidance.

Archive storage can contribute to the offline component of your design. Azure Blob Storage describes Archive as an offline tier: data can't be read or modified until it's rehydrated to an online tier. See [Archive a blob](../storage/blobs/archive-blob.md). Offline access doesn't by itself prevent deletion or provide an air gap, so combine archival storage with vault protection controls and account for rehydration time in your recovery plan. For Azure Backup recovery points, use [Azure Backup Archive tier management](use-archive-tier-support.md).

### Aim for zero restore errors

Monitor backup and restore jobs, configure alerts, and investigate failures promptly. Run regular cyber recovery drills in an isolated test environment, restore the data, and validate application behavior, dependencies, and recovery times. Record the results against your recovery objectives: a successful backup job alone doesn't demonstrate that a workload is recoverable.

Use [threat detection (preview)](threat-detection-overview.md) to help assess recovery-point selection through security signals. Validate restored data and workloads before returning them to production; threat signals don't replace restore testing.

Azure Backup provides PowerShell, Azure CLI, and REST API automation interfaces, as well as Safe Restore at scale, to help you build and run recovery exercises in a test environment. Cross-subscription restore (CSR) and cross-tenant restore (CTR, preview) provide options for testing recovery in another subscription or tenant. Learn more about [Azure Backup automation](automation-backup.md) and [Cyber recovery essentials](security-overview.md#cyber-recovery-essentials).

Use these building blocks to coordinate restores across your recovery scope and validate the results, not just individual restore-job completion. Review the [automation support matrix](backup-support-automation.md) and [cross-tenant restore support matrix](cross-tenant-restore-overview.md#supported-workloads-and-limitations) when planning recovery exercises. For monitoring options, see [monitoring and reporting for Azure Backup](monitoring-and-alerts-overview.md).

## Fit Azure Backup into an existing BCDR plan

Use Azure Backup for cloud-to-cloud protection or to add a cloud recovery copy to an existing on-premises backup plan. Combine operational recovery, vaulted retention, isolation, and recovery testing to address your organization's recovery objectives. For hybrid backup options, see the [MARS support matrix](backup-support-matrix-mars-agent.md) and [MABS and DPM support matrix](backup-support-matrix-mabs-dpm.md).

## Related content

- [Logically air-gapped vault protection](security-overview.md#logically-air-gapped-vault)
- [Cyber recovery essentials for recovery readiness](security-overview.md#cyber-recovery-essentials)
- [Cross-tenant restore for Azure Backup (preview)](cross-tenant-restore-overview.md)
- [Immutable vault for Azure Backup](backup-azure-immutable-vault-concept.md)
- [Archive tier in Azure Backup](archive-tier-support.md)
