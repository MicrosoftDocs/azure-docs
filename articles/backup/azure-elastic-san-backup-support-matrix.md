---
title: Support matrix for Azure Elastic SAN volume operational backup
description: Learn about the regional availability, supported scenarios, and limitations for Azure Elastic SAN volume operational backup.
ms.topic: reference
ms.date: 09/17/2026
ms.custom: references_regions, engagement-fy24
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As a cloud administrator, I want to understand the support matrix for Azure Elastic SAN backup, so that I can effectively plan and execute backup and restore operations while adhering to the supported scenarios and limitations."
---

# Support matrix for Azure Elastic SAN volume operational backup

This article summarizes the regional availability, supported scenarios, and limitations for Elastic SAN volume operational backup.

## Supported regions

Backups are available in all Azure Public regions that Elastic SAN supports. [Learn more](../storage/elastic-san/elastic-san-create.md#limitations).

## Supported and unsupported scenarios for Azure Elastic SAN volume operational backup

Elastic SAN backup has the following supported and unsupported scenarios:

- Operational-tier backup is supported for Elastic SAN; vault-tier isn't currently supported. So, the security-related settings ([immutability](backup-azure-immutable-vault-concept.md?tabs=backup-vault), [soft-delete](backup-azure-security-feature-cloud.md?tabs=azure-portal), [Multi-user authorization](multi-user-authorization-concept.md?tabs=backup-vault), and [customer-managed keys](encryption-at-rest-with-cmk.md?tabs=portal)) that are applicable for vault-tier aren't supported.
- Same volume can't be protected multiple times as part of multiple backup instances.
- Hourly backups aren't supported; only daily and weekly backups are available.
- The Original Location Recovery (OLR) is currently not supported; only Alternate Location Recovery (ALR) is supported.
- Azure [subscription and service](/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-virtual-machine-disk-limits) limits apply to the total number of disk snapshots per region per subscription.
- The Backup vault and the volumes to be backed up must be in the same subscription and region.
- Restoring a volume from backups to the same or a different subscription is supported.
- For [configuration of backup](azure-elastic-san-backup-configure.md), the Elastic SAN volume and the snapshot resource group (where snapshots are stored) must be in the same subscription. The creation of incremental snapshots for a volume outside its subscription isn't supported. Learn more [about incremental snapshots](/azure/virtual-machines/disks-incremental-snapshots#restrictions) for managed disks.
- For the backup and restore operations, the Backup vault’s managed identity must have the following roles assigned:

   | Operation | Role |
   | --- | --- |
   | Backup | - Elastic SAN Snapshot Exporter <br><br> - Disk snapshot Contributor (on the snapshot resource group) |
   | Restore | - Reader (on the snapshot resource group) <br><br> - Elastic SAN Volume Importer |

  >[!Note]
  >- Other roles (such as Owner) aren't supported and might cause permission issues.
  >- Role assignments require a few minutes to take effect.
- You can stop backup and retain backup data indefinitely or as per the backup policy. Deleting a backup instance stops the backup and deletes all backup data.
- Azure Backup currently supports the following backup and restore limits for Elastic SAN:

   | Operation type | Limit |
   | --- | --- |
   | On-demand backup | 10 per backup instance per day. |
   | Restore | 10 per backup instance per day. |
>[!Note]
  >- The Backup solution supports Elastic SAN volumes size of <= 16 TB.

## Next steps

- [Configure operational backup for Azure Elastic SAN volume by using the Azure portal or Azure CLI](azure-elastic-san-backup-configure.md).
- [Restore Azure Elastic SAN volume backup by using the Azure portal or Azure CLI](azure-elastic-san-backup-restore.md).
- [Manage Azure Elastic SAN volume backup by using the Azure portal or Azure CLI](azure-elastic-san-backup-manage.md).
 
