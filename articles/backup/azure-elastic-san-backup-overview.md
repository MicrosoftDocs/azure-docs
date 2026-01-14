---
title: About Azure Elastic SAN backup (preview)
description: Learn how the Elastic SAN backup (preview) works.
ms.topic: overview
ms.date: 07/15/2025
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.custom: engagement-fy24
--- 

# About Azure Elastic SAN backup (preview)

[Azure Backup](backup-overview.md) allows Elastic SAN backup (preview) through the [Backup vault](backup-vault-overview.md) to ensure seamless backup and restoration.

[Elastic SAN](../storage/elastic-san/elastic-san-introduction.md) optimizes workload performance and integrates large-scale databases with mission-critical applications. It simplifies SAN deployment, scaling, management, and configuration while ensuring high availability. It also interoperates with Azure Virtual Machines, Azure VMware Solutions, and Azure Kubernetes Service for versatile compute compatibility.

Azure Backup enables Elastic SAN backups via Backup vault. It offers a fully managed solution to schedule backups, set expiration timelines for recovery points, and recovery data to a new volume. It helps protect against data loss from accidental deletions, ransomware, and application updates.

>[!Important]
>As this solution is covered by Microsoft's Supplemental Terms for Azure Previews, use it for testing, and not for production use. For any queries, write to [AzureEsanBackup@microsoft.com](mailto:AzureEsanBackup@microsoft.com).

## Key features of Elastic SAN backup (preview)

Elastic SAN backup includes the following key features:

- **Region availability**: The feature is currently [available in specific regions](azure-elastic-storage-area-network-backup-support-matrix.md#supported-regions) only. 
- **Snapshot export**: Exports the selected Elastic SAN to an independent managed disk incremental snapshot (operational tier) at a given point in time.
- **Storage and resiliency**: Managed Disk incremental snapshot can be stored in Zonally redundant storage (ZRS) or Locally redundant storage (LRS) resiliency (in supported regions), independent of the Elastic SAN lifecycle.

   > [!NOTE]
   > ZRS snapshot storage applies only to new Backup instances created in regions that support ZRS, and only when no managed disk incremental snapshot is already exported from the volume snapshot. In these scenarios, snapshots are stored in ZRS by default. Existing Backup instances and regions that don't support ZRS continue to store snapshots as LRS.
   
- **Recovery points**: Supports up to **450** recovery points, which allows you customize **daily** or **weekly** schedules to align your backup strategy with business continuity and compliance needs.
- **Backup tier**: Supports operational tier.

  >[!Note]
  >Long-term vaulted backups are currently not supported.
- **Volume size limit**: Supports Elastic SAN volumes size of **<= 4 TB**.
- **Snapshot deletion**: Deletion of snapshots isn't possible if **Delete Lock** is enabled on the resource group. Ensure that you disable  **Delete Lock** to use this feature.

## How the backup process for Elastic SAN works (preview)

Azure Backup manages the backup operations for Elastic SAN by performing the following actions:

- After you configure the Elastic SAN backup, Azure Backup captures a snapshot, extracts changed data to a managed disk incremental snapshot (recovery point), and then removes the snapshot.

   >[!Note]
   >- The Elastic SAN volume snapshot is temporary and isn't a recovery point.
   >- Azure Backup manages the lifecycle of these incremental snapshots as per the backup policy.
 
- During restore, Azure Backup reads the managed disk incremental snapshot, and then recovers it as a new volume in an existing Elastic SAN instance using the Elastic SAN import APIs.

   You can also create a Managed Disk from the Managed Disk incremental snapshot directly from the [Azure portal](https://portal.azure.com/).

## Pricing

The solution consists of the following cost components:

- **Azure Backup protected instance fee for the Elastic SAN volume**: No charges are applicable during preview.
- **Managed Disk incremental snapshot fee**: Charges apply as per [existing Azure rates](https://azure.microsoft.com/pricing/details/managed-disks/) for data stored in the operational tier of managed disk incremental snapshots during preview.

## Next steps

- [Configure Azure Elastic SAN backup using the Azure portal (preview)](azure-elastic-storage-area-network-backup-configure.md).
- [Restore Azure Elastic SAN backup using the Azure portal (preview)](azure-elastic-storage-area-network-backup-restore.md).
- [Manage Azure Elastic SAN backup using the Azure portal (preview)](azure-elastic-storage-area-network-backup-manage.md).
 


