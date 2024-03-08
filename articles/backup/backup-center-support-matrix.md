---
title: Support matrix for Backup center
description: This article summarizes the scenarios that Backup center supports for each workload type
ms.topic: conceptual
ms.date: 03/31/2023
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---
# Support matrix for Backup center

Backup center helps enterprises to [govern, monitor, operate, and analyze backups at scale](backup-center-overview.md). This article summarizes the scenarios that Backup center supports for each workload type.

## Supported scenarios

The following table lists all supported scenarios:

| **Category** | **Scenario**  | **Supported workloads**  | **Limits** |
| -------------| ------------- | ----------------------- |------------|
| Monitoring   | View all backup jobs | Azure Virtual Machine <br><br> Azure Database for PostgreSQL server <br><br> SQL in Azure VM <br><br>  SAP High-Performance Analytic Appliance (HANA) in Azure VM <br><br>  Azure Files<br/><br/> Azure Blobs<br/><br/> Azure Managed Disks |   Seven days worth of jobs available out of the box. <br> <br> Each filter/drop-down supports a maximum of 1000 items. So, Backup center can be used to monitor a maximum of 1000 subscriptions and 1000 vaults across tenants. |
| Monitoring | View all site recovery jobs | Azure to Azure disaster recovery <br><br> VMware and Physical to Azure disaster recovery | Same as previous |
| Monitoring | View all backup instances | Azure Virtual Machine <br><br>  Azure Database for PostgreSQL server <br><br>  SQL in Azure VM <br><br> SAP HANA in Azure VM <br><br>  Azure Files<br/><br/> Azure Blobs<br/><br/> Azure Managed Disks | Same as previous |
| Monitoring | View all replicated items | Azure to Azure disaster recovery <br><br> VMware and physical to Azure disaster recovery | Same as previous |
| Monitoring | View all backup policies |  Azure Virtual Machine <br><br>  Azure Database for PostgreSQL server <br><br>  SQL in Azure VM <br><br>  SAP HANA in Azure VM <br><br>  Azure Files<br/><br/> Azure Blobs<br/><br/> Azure Managed Disks | Same as previous |
| Monitoring | View all vaults |  Azure Virtual Machine <br><br>  Azure Database for PostgreSQL server <br><br>  SQL in Azure VM <br><br>  SAP HANA in Azure VM <br><br>  Azure Files<br/><br/> Azure Blobs<br/><br/> Azure Managed Disks | Same as previous |
| Monitoring | View Azure Monitor alerts at scale |  Azure Virtual Machine <br><br>  Azure Database for PostgreSQL server <br><br>  SQL in Azure VM <br><br>  SAP HANA in Azure VM <br><br>  Azure Files<br/><br/> Azure Blobs<br/><br/> Azure Managed Disks | Refer [Alerts](./backup-azure-monitoring-built-in-monitor.md#azure-monitor-alerts-for-azure-backup) documentation |
| Monitoring     |   View Azure Backup metrics and write metric alert rules | Azure VM   <br><br>SQL in Azure VM <br><br>	SAP HANA in Azure VM<br><br>Azure Files <br><br>Azure Blobs |   You can view metrics for all Recovery Services vaults for a region and subscription simultaneously. Viewing metrics for a larger scope in the Azure portal isn’t currently supported. The same limits are also applicable to configure metric alert rules. For more information, see [View metrics in the Azure portal](metrics-overview.md#view-metrics-in-the-azure-portal).|
| Actions | Configure backup | Azure Virtual Machine <br><br>  Azure Database for PostgreSQL server <br><br>  SQL in Azure VM <br><br>  SAP HANA in Azure VM <br><br>  Azure Files<br/><br/> Azure Blobs<br/><br/> Azure Managed Disks | See support matrices for [Azure VM backup](./backup-support-matrix-iaas.md) and [Azure Database for PostgreSQL Server backup](backup-azure-database-postgresql-support-matrix.md) |
| Actions | Configure Replication | Azure to Azure disaster recovery <br><br> VMware and Physical to Azure disaster recovery | See the support matrices for [Azure to Azure disaster recovery](../site-recovery/azure-to-azure-support-matrix.md) and [VMware and Physical to Azure disaster recovery](../site-recovery/vmware-physical-azure-support-matrix.md). |
| Actions | Restore Backup Instance |  Azure Virtual Machine <br><br>  Azure Database for PostgreSQL server <br><br>  SQL in Azure VM <br><br>  SAP HANA in Azure VM <br><br>  Azure Files<br/><br/> Azure Blobs<br/><br/> Azure Managed Disks | See support matrices for [Azure VM backup](./backup-support-matrix-iaas.md) and [Azure Database for PostgreSQL Server backup](backup-azure-database-postgresql-support-matrix.md) |
| Actions | Create vault |  Azure Virtual Machine <br><br>  Azure Database for PostgreSQL server <br><br>  SQL in Azure VM <br><br>  SAP HANA in Azure VM <br><br>  Azure Files<br/><br/> Azure Blobs<br/><br/> Azure Managed Disks | Refer to support matrices for [Recovery Services vault](./backup-support-matrix.md#vault-support) |
| Actions | Create backup policy |  Azure Virtual Machine <br><br>  Azure Database for PostgreSQL server <br><br>  SQL in Azure VM <br><br>  SAP HANA in Azure VM <br><br>  Azure Files<br/><br/> Azure Blobs<br/><br/> Azure Managed Disks | See support matrices for [Recovery Services vault](./backup-support-matrix.md#vault-support) |
| Actions | Execute on-demand backup for a backup instance |  Azure Virtual Machine <br><br>  Azure Database for PostgreSQL server <br><br>  SQL in Azure VM <br><br>  SAP HANA in Azure VM <br><br>  Azure Files<br/><br/> Azure Blobs<br/><br/> Azure Managed Disks | See support matrices for [Azure VM backup](./backup-support-matrix-iaas.md) and [Azure Database for PostgreSQL Server backup](backup-azure-database-postgresql-support-matrix.md) |
| Actions | Stop backup for a backup instance |  Azure Virtual Machine <br><br>  Azure Database for PostgreSQL server <br><br>  SQL in Azure VM <br><br>  SAP HANA in Azure VM <br><br>  Azure Files<br/><br/> Azure Blobs<br/><br/> Azure Managed Disks | See support matrices for [Azure VM backup](./backup-support-matrix-iaas.md) and [Azure Database for PostgreSQL Server backup](backup-azure-database-postgresql-support-matrix.md) |
| Actions | Execute cross-region restore job from Backup center |  Azure Virtual Machine <br><br> SQL in Azure VM <br><br>  SAP HANA in Azure VM | See the [cross-region restore](./backup-create-rs-vault.md#set-cross-region-restore) documentation. |
| Insights | View Backup Reports |  Azure Virtual Machine <br><br>  SQL in Azure Virtual Machine <br><br>  SAP HANA in Azure Virtual Machine <br><br>  Azure Files <br><br>  System Center Data Protection Manager <br><br>  Azure Backup Agent (MARS) <br><br> Azure Backup Server (MABS) <br><br> Azure Blobs <br><br> Azure Disks <br><br> Azure Database for PostgreSQL Server | See [supported scenarios for Backup Reports](./configure-reports.md#supported-scenarios). |
| Governance | View and assign built-in and custom Azure Policies under category _Backup_. | N/A | N/A |
| Governance | View datasources not configured for backup |  Azure Virtual Machine <br><br>  Azure Database for PostgreSQL server | N/A |

## Unsupported scenarios

| **Category** | **Scenario**  |
|--------------|---------------|
| Actions | Configuring vault settings at scale is currently not supported from Backup center |

## Next steps

* [Review the support matrix for Azure Backup](./backup-support-matrix.md)
* [Review the support matrix for Azure VM backup](./backup-support-matrix-iaas.md)
* [Review the support matrix for Azure Database for PostgreSQL Server backup](backup-azure-database-postgresql-support-matrix.md)