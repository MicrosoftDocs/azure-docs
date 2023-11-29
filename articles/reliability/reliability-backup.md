---
title: Reliability in Azure Backup
description: Learn about reliability in Azure Backup
author: anaharris-ms
ms.author: anaharris
ms.topic: overview
ms.custom: subject-reliability
ms.service: backup
ms.date: 10/18/2023
---

<!--#Customer intent:  I want to understand reliability support in Azure Backup so that I can respond to and/or avoid failures in order to minimize downtime and data loss. -->


# Reliability in Azure Backup

This article describes reliability support in [Azure Backup](../backup/backup-overview.md), and covers [availability zones](#availability-zone-support) and [cross-region recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity). For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

Azure Backup is a secure and reliable built-in data protection mechanism in Azure, providing data protection for various on-premises and cloud workloads. Azure Backup can seamlessly scale its protection across multiple workloads and provides native integration with Azure workloads (VMs, SAP HANA, SQL in Azure VMs, Azure Files, AKS etc.) without requiring you to manage automation or infrastructure to deploy agents, write new scripts, or provision storage.

Azure Backup supports the following data redundant storage options:

- **Locally redundant storage (LRS):**  To protect your data against server rack and drive failures, you can use LRS. LRS replicates your backup data three times within a single data center in the primary region. For more information on locally redundant storage, see [Azure Blog Storage - locally redundant storage](/azure/storage/common/storage-redundancy#locally-redundant-storage).

- **Geo-redundant storage (GRS):** To protect against region-wide outages, you can use GRS. GRS replicates your backup data to a secondary region. For more information, see [Azure Blog Storage - geo-redundant storage](/azure/storage/common/storage-redundancy#geo-redundant-storage).

- **Zone-redundant storage (ZRS):**  To replicate your backup data in availability zones, you can use ZRS. ZRS guarantees data residency and resiliency in the same region. [Azure Blog Storage - zone-redundant storage](/azure/storage/common/storage-redundancy#zone-redundant-storage).

>[!NOTE]
>The redundancy options are applicable to how backup data is stored and not on the Azure Backup Service itself. 

## Vault storage

Azure Backup stores backed-up data in [Recovery Services vaults](/azure/backup/backup-azure-recovery-services-vault-overview) and [Backup vaults](/azure/backup/backup-vault-overview). A vault is an online-storage entity in Azure that's used to hold data, such as backup copies, recovery points, and backup policies. 

The following table lists the various datasources that each vault supports: 

| Recovery Services vault | Backup vault |
|-------|-------|
|Azure Virtual Machine| Azure Disks|
|SQL in Azure VM| Azure Blobs|
|Azure Files| Azure Database for PostgreSQL server|
|SAP HANA in Azure V| Kubernetes services (preview)|
|Azure Backup server| |
|Azure Backup agent| |
|Data Protection Manager (DPM)| |

## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

### Azure Backup service

Azure Backup is a zone-redundant service for both Recovery Service and Backup vaults. When you create your vault resources, you don't need to configure for zone-redundancy. In the case of a zonal outage, the vaults remain operational.


### Azure Backup data

To ensure that your backup data is available during a zonal outage, choose *Zone-redundant* for **Backup storage redundancy** option during vault creation. 


### Migrate to availability zone support

To learn how to migrate a Recovery Services vault to availability zone support, see [Migrate Azure Recovery Services vault to availability zone support](./migrate-recovery-services-vault.md).

## Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]


When an entire Azure region or datacenter experiences downtime, your vaults continue to be accessible and you'll still be able to see your backup items. However, unless you deploy for regional redundancy, the underlying backup data isn't accessible to you for performing a restore operation.  

To achieve regional redundancy for your backup data, Azure Backup allows you to replicate your backups to an additional [Azure paired region](./availability-zones-overview.md#paired-and-unpaired-regions) by using [geo-redundant storage (GRS)](/azure/storage/common/storage-redundancy#geo-redundant-storage) to protect your backups from regional outages. When you enable the backups with GRS, the backups in the secondary region become accessible only when Microsoft declares an outage in the primary region. However, by using Cross Region Restore you can access and perform restores from the secondary region recovery points even when no outage occurs in the primary region. With Cross Region Store you can perform drills to assess regional resiliency. 

## Next steps

- [Reliability in Azure](./overview.md)
