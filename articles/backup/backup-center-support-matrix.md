---
title: Support matrix for Backup center
description: This article summarizes the scenarios that Backup center supports for each workload type
ms.topic: conceptual
ms.date: 09/07/2020
---
# Support matrix for Backup center

Backup Center provides a single pane of glass for enterprises to [govern, monitor, operate, and analyze backups at scale](backup-center-overview.md). This article summarizes the scenarios that Backup center supports for each workload type.

## Supported scenarios

| **Category** | **Scenario**  | **Supported workloads**  | **Limits** |
| -------------| ------------- | ----------------------- |------------|
| Monitoring   | View all jobs | <li> Azure Virtual Machine <br><br> <li> Azure Database for PostgreSQL server <br><br> <li> SQL in Azure VM <br><br> <li> SAP HANA in Azure VM <br><br> <li> Azure Files<br/><br/> <li>Azure Blobs<br/><br/> <li>Azure Managed Disks | <li> 7 days worth of jobs available out of the box. <br> <li> Each filter/drop-down supports a maximum of 1000 items. So Backup center can be used to monitor a maximum of 1000 subscriptions and 1000 vaults across tenants. |
| Monitoring | View all backup instances | <li> Azure Virtual Machine <br><br> <li> Azure Database for PostgreSQL server <br><br> <li> SQL in Azure VM <br><br> <li> SAP HANA in Azure VM <br><br> <li> Azure Files<br/><br/> <li>Azure Blobs<br/><br/> <li>Azure Managed Disks | Same as above |
| Monitoring | View all backup policies | <li> Azure Virtual Machine <br><br> <li> Azure Database for PostgreSQL server <br><br> <li> SQL in Azure VM <br><br> <li> SAP HANA in Azure VM <br><br> <li> Azure Files<br/><br/> <li>Azure Blobs<br/><br/> <li>Azure Managed Disks | Same as above |
| Monitoring | View all vaults | <li> Azure Virtual Machine <br><br> <li> Azure Database for PostgreSQL server <br><br> <li> SQL in Azure VM <br><br> <li> SAP HANA in Azure VM <br><br> <li> Azure Files<br/><br/> <li>Azure Blobs<br/><br/> <li>Azure Managed Disks | Same as above |
| Actions | Configure backup | <li> Azure Virtual Machine <br><br> <li> Azure Database for PostgreSQL server <br><br> <li> SQL in Azure VM <br><br> <li> SAP HANA in Azure VM <br><br> <li> Azure Files<br/><br/> <li>Azure Blobs<br/><br/> <li>Azure Managed Disks | Refer to support matrices for [Azure VM backup](./backup-support-matrix-iaas.md) and [Azure Database for PostgreSQL Server backup](backup-azure-database-postgresql.md#support-matrix) |
| Actions | Restore Backup Instance | <li> Azure Virtual Machine <br><br> <li> Azure Database for PostgreSQL server <br><br> <li> SQL in Azure VM <br><br> <li> SAP HANA in Azure VM <br><br> <li> Azure Files<br/><br/> <li>Azure Blobs<br/><br/> <li>Azure Managed Disks | Refer to support matrices for [Azure VM backup](./backup-support-matrix-iaas.md) and [Azure Database for PostgreSQL Server backup](backup-azure-database-postgresql.md#support-matrix) |
| Actions | Create vault | <li> Azure Virtual Machine <br><br> <li> Azure Database for PostgreSQL server <br><br> <li> SQL in Azure VM <br><br> <li> SAP HANA in Azure VM <br><br> <li> Azure Files<br/><br/> <li>Azure Blobs<br/><br/> <li>Azure Managed Disks | Refer to support matrices for [Recovery Services vault](./backup-support-matrix.md#vault-support) |
| Actions | Create backup policy | <li> Azure Virtual Machine <br><br> <li> Azure Database for PostgreSQL server <br><br> <li> SQL in Azure VM <br><br> <li> SAP HANA in Azure VM <br><br> <li> Azure Files<br/><br/> <li>Azure Blobs<br/><br/> <li>Azure Managed Disks | Refer to support matrices for [Recovery Services vault](./backup-support-matrix.md#vault-support) |
| Actions | Execute on-demand backup for a backup instance | <li> Azure Virtual Machine <br><br> <li> Azure Database for PostgreSQL server <br><br> <li> SQL in Azure VM <br><br> <li> SAP HANA in Azure VM <br><br> <li> Azure Files<br/><br/> <li>Azure Blobs<br/><br/> <li>Azure Managed Disks | Refer to support matrices for [Azure VM backup](./backup-support-matrix-iaas.md) and [Azure Database for PostgreSQL Server backup](backup-azure-database-postgresql.md#support-matrix) |
| Actions | Stop backup for a backup instance | <li> Azure Virtual Machine <br><br> <li> Azure Database for PostgreSQL server <br><br> <li> SQL in Azure VM <br><br> <li> SAP HANA in Azure VM <br><br> <li> Azure Files<br/><br/> <li>Azure Blobs<br/><br/> <li>Azure Managed Disks | Refer to support matrices for [Azure VM backup](./backup-support-matrix-iaas.md) and [Azure Database for PostgreSQL Server backup](backup-azure-database-postgresql.md#support-matrix) |
| Insights | View Backup Reports | <li> Azure Virtual Machine <br><br> <li> SQL in Azure Virtual Machine <br><br> <li> SAP HANA in Azure Virtual Machine <br><br> <li> Azure Files <br><br> <li> System Center Data Protection Manager <br><br> <li> Azure Backup Agent (MARS) <br><br> <li> Azure Backup Server (MABS) | Refer to [supported scenarios for Backup Reports](./configure-reports.md#supported-scenarios) |
| Governance | View and assign built-in and custom Azure Policies under category 'Backup' | N/A | N/A |
| Governance | View datasources not configured for backup | <li> Azure Virtual Machine <br><br> <li> Azure Database for PostgreSQL server | N/A |
| Monitoring | View Azure Monitor alerts at scale | <li> Azure Virtual Machine <br><br> <li> Azure Database for PostgreSQL server <br><br> <li> SQL in Azure VM <br><br> <li> SAP HANA in Azure VM <br><br> <li> Azure Files<br/><br/> <li>Azure Blobs<br/><br/> <li>Azure Managed Disks | Refer [Alerts](./backup-azure-monitoring-built-in-monitor.md#azure-monitor-alerts-for-azure-backup-preview) documentation |
| Actions | Execute cross-region restore job from Backup center | <li> Azure Virtual Machine <br><br> <li> SQL in Azure VM <br><br> <li> SAP HANA in Azure VM | Refer [cross-region restore](./backup-create-rs-vault.md#set-cross-region-restore) documentation |

## Unsupported scenarios

| **Category** | **Scenario**  |
|--------------|---------------|
| Actions | Configuring vault settings at scale is currently not supported from Backup center |
| Availability | Backup center is currently not available in national clouds | 

## Next steps

* [Review the support matrix for Azure Backup](./backup-support-matrix.md)
* [Review the support matrix for Azure VM backup](./backup-support-matrix-iaas.md)
* [Review the support matrix for Azure Database for PostgreSQL Server backup](backup-azure-database-postgresql.md#support-matrix)