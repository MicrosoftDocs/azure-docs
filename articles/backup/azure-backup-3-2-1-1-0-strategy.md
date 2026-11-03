---
title: Plan a 3-2-1-1-0 backup strategy with Azure Backup
description: Learn how Azure Backup can support a 3-2-1-1-0 strategy with vault storage, isolation, recovery options, and restore automation.
author: akarshprabhu
ms.author: akak
ms.date: 11/02/2026
ms.topic: best-practice
ms.service: azure-backup
#customer intent: As a data protection administrator, I want to plan a 3-2-1-1-0 backup strategy with Azure Backup, so that I can protect data and validate recovery across cloud and hybrid workloads.
---

# Plan a 3-2-1-1-0 backup strategy with Azure Backup

The 3-2-1-1-0 strategy helps you plan backup copies, storage, isolation, and recovery testing. Azure Backup provides cloud backup and restore capabilities that can support each part of this approach. The following examples show how to use Azure Backup as part of a broader business continuity and disaster recovery (BCDR) plan.

## What 3-2-1-1-0 means

- **3 copies**: Keep three copies of data in total: one production copy and at least two backups.
- **2 storage types**: Store the backups across two storage media types or hardware configurations, such as local disk, cloud storage, or tape.
- **1 offsite copy**: Keep at least one backup at an external location or in the cloud, separate from the production site.
- **1 isolated copy**: Keep at least one backup offline, air-gapped, or immutable so that an attacker can't alter or delete it.
- **0 restore errors**: Aim for zero restore errors by monitoring backup jobs and testing recovery regularly.

## Map the strategy to Azure Backup

### Keep three copies

For Azure VM backup, Azure Backup can provide this three-copy layout: the production VM, an operational recovery point in the snapshot tier, and a vaulted recovery point in the vault tier. The operational snapshot tier supports faster restores, while the vault tier stores a recovery point in the Recovery Services vault. Together, the production data and these two recovery points illustrate the three copies in the strategy. Learn more about the [Azure VM restore process and recovery point tiers](about-azure-vm-restore.md).

Azure Backup supports other workloads through Recovery Services vaults and Backup vaults. See the [Azure Backup support matrix](backup-support-matrix.md) for the applicable backup model for your workload.

### Use two storage types or configurations

Azure Backup offers Standard and Archive tiers for vaulted recovery points. Use Standard for recovery points you expect to restore more frequently and Archive for eligible long-term retention points. These tiers give you storage choices to include in your design. See the [Archive tier support matrix](archive-tier-support.md) and the [Azure Backup support matrix](backup-support-matrix.md) for supported workloads and storage options.

### Keep one copy offsite

For Azure workloads, Azure Backup stores vaulted recovery points in the cloud, separate from the production resource. For Recovery Services vaults, choose a storage redundancy option that fits your recovery plan. Geo-redundant storage (GRS) replicates vault data to a paired secondary region, and Cross-Region Restore (CRR) lets you restore supported Azure VM backups from that region. Learn more about [Recovery Services vault storage redundancy](backup-create-recovery-services-vault.md#set-storage-redundancy) and [Azure VM restore options](backup-azure-arm-restore-vms.md#restore-options).

For on-premises workloads, Azure Backup can provide an offsite cloud copy through the MARS agent, MABS, or DPM. These options can complement an existing on-premises-to-on-premises or on-premises-to-cloud BCDR plan. See the [MARS support matrix](backup-support-matrix-mars-agent.md) and [MABS and DPM support matrix](backup-support-matrix-mabs-dpm.md) for supported workloads.

### Keep one copy isolated or immutable

Azure Backup supports this goal with a **Logically air-gapped vault**, which combines logical isolation with protection controls. Learn how it works in the [security and cyber recovery overview](security-overview.md#logically-air-gapped-vault), and see the [immutable vault support matrix](backup-azure-immutable-vault-concept.md#support-matrix) for supported workloads.

### Aim for zero restore errors

Monitor backup and restore jobs, and run recovery exercises to validate that restored data and workloads meet your recovery objectives.

Azure Backup provides PowerShell, Azure CLI, and REST API automation interfaces, as well as Safe Restore at scale, to help you build and run recovery exercises in a test environment. These building blocks support restore testing, including cross-subscription restore (CSR) and cross-tenant restore (CTR) scenarios. Learn more about [Azure Backup automation](automation-backup.md), the [automation support matrix](backup-support-automation.md), and [Cyber recovery essentials](security-overview.md#cyber-recovery-essentials).

For Azure VMs, CSR can help you restore to another subscription in the same tenant. CTR can help you restore vaulted recovery points to another tenant and is currently in preview. Review the [Azure VM support matrix](backup-support-matrix-iaas.md), [cross-tenant restore overview](cross-tenant-restore-overview.md), and [automation support matrix](backup-support-automation.md) for applicable support and limitations. For monitoring options, see [monitoring and reporting for Azure Backup](monitoring-and-alerts-overview.md).

## Fit Azure Backup into an existing BCDR plan

For Azure-native workloads, Azure Backup provides cloud-to-cloud protection by backing up an Azure resource to a Recovery Services vault or Backup vault. For on-premises workloads, MARS, MABS, or DPM can provide a cloud recovery copy. Combine these options with your existing on-premises-to-on-premises or on-premises-to-cloud BCDR plan to meet your organization's recovery requirements.

## Related content

- [Azure Backup security best practices](azure-backup-data-protection-best-practices.md)
