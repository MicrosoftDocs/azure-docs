---
title: About Azure Elastic storage area network backup (preview)
description: Learn how the Azure Elastic storage area network (Azure Elastic SAN) backup works.
ms.topic: overview
ms.date: 05/21/2025
author: jyothisuri
ms.author: jsuri
ms.custom: engagement-fy24
# Customer intent: "As a cloud administrator, I want to understand the backup aspects before configuring and manage backup for Azure Elastic SAN volumes, so that I can ensure data protection and seamless restoration against data loss in my cloud environment."
--- 

# About Azure Elastic SAN backup (preview)

[Azure Backup](backup-overview.md) allows Azure Elastic storage area network (Azure Elastic SAN) volume protection (preview) through the [Backup vault](backup-vault-overview.md) to ensure seamless backup and restoration.

[Azure Elastic SAN](../storage/elastic-san/elastic-san-introduction.md) optimizes workload performance and integrates large-scale databases with mission-critical applications. It simplifies SAN deployment, scaling, management, and configuration while ensuring high availability. It also interoperates with Azure Virtual Machines, Azure VMware Solutions, and Azure Kubernetes Service (AKS) for versatile compute compatibility.

Azure Backup enables Elastic SAN volume backups via Backup vault. It offers a fully managed solution to schedule backups, set expiration timelines for restore points, and restore data to a new volume. It helps protect against data loss from accidental deletions, ransomware, and application updates.

>[!Important]
>- This preview solution is governed by [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms).
>- This preview solution is not recommended for production environment.
>- For any queries, write to [AzureEsanBackup@microsoft.com](mailto:AzureEsanBackup@microsoft.com).

## Key features of Azure Elastic SAN protection (preview)

Azure Elastic SAN volume protection (preview) includes the following key features:

- **Snapshot export**: Exports the selected Elastic SAN volume to an independent Managed Disk incremental snapshot (operational tier) at a given point in time.
- **Storage and resiliency**: Managed Disk incremental snapshot is stored in Locally redundant storage (LRS) resiliency (in LRS-[supported regions](azure-elastic-storage-area-network-backup-support-matrix.md#supported-regions)), independent of the Elastic SAN volume lifecycle.
- **Restore points**: Supports up to **450 restore points**, with backup frequency of **24 hours**.
- **Backup tier**: Supports operational tier.

  >[!Note]
  >Long-term vaulted backups are currently not supported.
- **Volume size limit**: Supports Elastic SAN volumes size of **<= 4 TB**.

>[!Note]
>- Deletion of snapshots isn't possible if **Delete Lock** is enabled on the resource group. Ensure that you disable  **Delete Lock** to use this feature.
>- The feature is currently [available in specific regions](azure-elastic-storage-area-network-backup-support-matrix.md#supported-regions) only. 

## Workflow for Azure Elastic SAN protection (preview)

Azure Backup manages the protection workflow for Azure Elastic SAN by performing the following operations:

1. After you configure an Azure Elastic SAN volume backup, Azure Backup captures a snapshot, extracts changed data to a Managed Disk incremental snapshot (recovery point), and then removes the volume snapshot.

   >[!Note]
   >- The Elastic SAN volume snapshot is temporary and isn't a recovery point.
   >- Azure Backup manages the lifecycle of these incremental snapshots as per the backup policy.
 
1. During restore, Azure Backup reads the Managed Disk incremental snapshot, and then recovers it as a new volume in an existing Elastic SAN instance using the Elastic SAN import APIs.

   You can also create a Managed Disk from the Managed Disk incremental snapshot directly from the [Azure portal](https://portal.azure.com/).

## Pricing

The solution consists of the following cost components:

- **Azure Backup protected instance fee for the Elastic SAN Volume**: No charges are applicable during preview.
- **Managed Disk incremental snapshot fee**: Charges apply as per [existing Azure rates](https://azure.microsoft.com/pricing/details/managed-disks/) for data stored in the operational tier of managed disk incremental snapshots during preview.

## Next steps

- [Configure backup for  Azure Elastic SAN using Azure portal (preview)](azure-elastic-storage-area-network-backup-configure.md).
- [Restore Azure Elastic SAN using Azure portal (preview)](azure-elastic-storage-area-network-backup-restore.md).
- [Manage Azure Elastic SAN using Azure portal (preview)](azure-elastic-storage-area-network-backup-manage.md).
 


