---
title: About Azure Elastic SAN volume operational backup
description: Learn how Azure Elastic SAN volume operational backup works.
ms.topic: overview
ms.date: 09/17/2026
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.custom: engagement-fy24
--- 

# About Azure Elastic SAN volume operational backup

[Azure Backup](backup-overview.md) allows you to back up Azure Elastic SAN volumes through the [Backup vault](backup-vault-overview.md) to ensure seamless backup and restoration.

[Elastic SAN](../storage/elastic-san/elastic-san-introduction.md) optimizes workload performance and integrates large-scale databases with mission-critical applications. It simplifies SAN deployment, scaling, management, and configuration while ensuring high availability. It also interoperates with Azure Virtual Machines, Azure VMware Solutions, and Azure Kubernetes Service for versatile compute compatibility.

Azure Backup enables Elastic SAN volume operational backups via Backup vault. It offers a fully managed solution to schedule backups, set expiration timelines for recovery points, and recover data to a new volume. It helps protect against data loss from accidental deletions, ransomware, and application updates.

## Key features of Azure Elastic SAN volume operational backup

Azure Elastic SAN volume operational backup includes the following key features:

- **Region availability**: This feature is available in [supported regions](azure-elastic-san-backup-support-matrix.md#supported-regions). For more information, see the [support matrix](azure-elastic-san-backup-support-matrix.md).
- **Snapshot export**: Exports the selected Elastic SAN to an independent managed disk incremental snapshot (operational tier) at a given point in time.
- **Storage and resiliency**: Managed Disk incremental snapshot can be stored in zone-redundant storage (ZRS) or Locally redundant storage (LRS) resiliency (in supported regions), independent of the Elastic SAN lifecycle.

   > [!NOTE]
   > ZRS snapshot storage applies only to new Backup instances created in regions that support ZRS, and only when no managed disk incremental snapshot is already exported from the volume snapshot. In these scenarios, snapshots are stored in ZRS by default. Existing Backup instances and regions that don't support ZRS continue to store snapshots as LRS.
   
- **Recovery points**: Supports up to **450** recovery points, which allows you to customize **daily** or **weekly** schedules to align your backup strategy with business continuity and compliance needs.
- **Backup tier**: Supports operational tier.

  >[!Note]
  >Long-term vaulted backups are currently not supported.
- **Volume size limit**: Supports Elastic SAN volumes size of **<= 16 TB**.
- **Snapshot deletion**: Deletion of snapshots isn't possible if **Delete Lock** is enabled on the resource group. Ensure that you disable  **Delete Lock** to use this feature.

## How the backup process for Azure Elastic SAN volume operational backup works

Azure Backup manages the backup operations for Azure Elastic SAN volume operational backup by performing the following actions:

- After you configure the Azure Elastic SAN volume operational backup, Azure Backup captures a snapshot, extracts changed data to a managed disk incremental snapshot (recovery point), and then removes the snapshot.

   >[!Note]
   >- The Elastic SAN volume snapshot is temporary and isn't a recovery point.
   >- Azure Backup manages the lifecycle of these incremental snapshots as per the backup policy.
 
- During restore, Azure Backup reads the managed disk incremental snapshot, and then recovers it as a new volume in an existing Elastic SAN instance using the Elastic SAN import APIs.

   You can also create a Managed Disk from the Managed Disk incremental snapshot directly from the [Azure portal](https://portal.azure.com/).

## Pricing for Azure Elastic SAN volume operational backup

Azure Elastic SAN volume operational backup doesn't incur an Azure Backup protected instance fee. Charges apply only for **managed disk incremental snapshots** stored in the operational tier as per the [existing Azure rates](https://azure.microsoft.com/pricing/details/managed-disks/) for data stored in the operational tier of managed disk incremental snapshots.

## Next steps

- [Configure operational backup for Azure Elastic SAN volume by using the Azure portal or Azure CLI](azure-elastic-san-backup-configure.md).
- [Restore Azure Elastic SAN volume backup by using the Azure portal or Azure CLI](azure-elastic-san-backup-restore.md).
- [Manage Azure Elastic SAN volume backup by using the Azure portal or Azure CLI](azure-elastic-san-backup-manage.md).
 
