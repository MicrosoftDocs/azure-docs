---
title: About Azure Elastic storage area network (preview)
description: Learn how the Azure Elastic storage area network (Azure Elastic SAN) backup works.
ms.topic: overview
ms.date: 04/16/2025
author: jyothisuri
ms.author: jsuri
ms.custom: engagement-fy24
--- 

# About Azure Elastic SAN (preview)

[Azure Backup](backup-overview.md) allows Azure Elastic storage area network (Azure Elastic SAN) volume protection (preview) through the [Backup vault](backup-vault-overview.md), ensuring seamless backup and restoration.

[Azure Elastic SAN](../storage/elastic-san/elastic-san-introduction.md) optimizes workload performance and integrates large-scale databases with mission-critical applications. It simplifies SAN deployment, scaling, management, and configuration while ensuring high availability. It also interoperates with Azure Virtual Machines, Azure VMware Solutions, and Azure Kubernetes Service for versatile compute compatibility.

Azure Backup enables Elastic SAN volume backups via Backup vault. It offers a fully managed solution for scheduling, expiring restore points, and restoring to a new volume. It helps protect against data loss from accidental deletions, ransomware, and application updates.

>[!Important]
>- This preview solution is governed by [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms).
>- This preview solution is not recommended for production environment.
>- For any queries, write to [AzureEsanBackup@microsoft.com](mailto:AzureEsanBackup@microsoft.com).

## Key benefits of Azure Elastic SAN protection (preview)

Azure Elastic SAN volume protection (preview) includes the following key features:

- **Snapshot Export**: Exports the selected Elastic SAN volume to an independent Managed Disk incremental snapshot (operational tier) at a given point in time.
- **Storage and resiliency**: Managed Disk incremental snapshot is stored in Locally redundant storage (LRS) resiliency (in LRS-supported regions), independent of the Elastic SAN volume lifecycle.
- **Restore points**: Supports up to **450 restore points**, with backup frequency ranging from **24 hours** to **4 hours**.
- **Backup tier**: Supports operational tier; long-term vaulted backups are currently not supported.
- **Volume size limit**: Supports Elastic SAN volumes size **<= 4 TB**.

>[!Note]
>- Deletion of snapshots isn't possible if **Delete Lock** is enabled on the resource group. Ensure that you disable **Delete Lock** before you use this feature.
>- The feature is currently [available in specific regions](azure-elastic-storage-area-network-backup-support-matrix.md#supported-regions) only. 

## Backup flow for Azure Elastic SAN (preview)

To perform the backup operation:

1. After an Azure Elastic SAN volume backup is configured, Azure Backup captures a snapshot, extracts changed data to a Managed Disk incremental snapshot (recovery point), and then removes the volume snapshot.

   >[!Note]
   >The Elastic SAN volume snapshot is temporary and isn't a recovery point.

2. Azure Backup manages the lifecycle of these incremental snapshots as per the backup policy.
 
## Restore flow for Azure Elastic SAN (preview)

To perform the restore operation, Azure Backup reads the Manged Disk incremental snapshot, and then recovers it as a new volume in an existing Elastic SAN instance using the Elastic SAN import APIs.

You can also create a Managed Disk from the Managed Disk incremental snapshot directly from the Azure portal.

## Pricing

The solution consists of the following cost components:

- **Azure Backup protected instance fee for the Elastic SAN Volume**: No charges during preview.
- **Managed Disk incremental snapshot fee**: Charges apply as per existing Azure rates for data stored in the operational tier of managed disk incremental snapshots during preview.

## Next steps

- [Configure backup for  Azure Elastic SAN using Azure portal (preview)](azure-elastic-storage-area-network-backup-configure.md).
- [Restore Azure Elastic SAN using Azure portal (preview)](azure-elastic-storage-area-network-backup-restore.md).
- [Manage Azure Elastic SAN using Azure portal (preview)](azure-elastic-storage-area-network-backup-manage.md).
 


