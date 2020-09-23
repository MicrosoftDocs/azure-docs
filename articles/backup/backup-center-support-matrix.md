---
title: Support matrix for Backup Center
description: This article summarizes the scenarios that Backup Center supports for each workload type
ms.topic: conceptual
ms.date: 09/07/2020
---
# Support matrix for Backup Center

Backup Center provides a single pane of glass for enterprises to [govern, monitor, operate, and analyze backups at scale](backup-center-overview.md). This article summarizes the scenarios that Backup Center supports for each workload type.

## Supported scenarios

| **Category** | **Scenario**  | **Supported workloads**  | **Limits** |
| -------------| ------------- | ----------------------- |------------|
| Monitoring   | View all jobs | <li> Azure Virtual Machine <br><br> <li> Azure Database for PostgreSQL server | <li> 7 days worth of jobs available out of the box. <br> <li> Each filter/drop-down supports a maximum of 1000 items. So Backup Center can be used to monitor a maximum of 1000 subscriptions and 1000 vaults across tenants. |
| Monitoring | View all backup instances | <li> Azure Virtual Machine <br><br> <li> Azure Database for PostgreSQL server | Same as above |
| Monitoring | View all backup policies | <li> Azure Virtual Machine <br><br> <li> Azure Database for PostgreSQL server | Same as above |
| Monitoring | View all vaults | <li> Azure Virtual Machine <br><br> <li> Azure Database for PostgreSQL server | Same as above |
| Actions | Configure backup | <li> Azure Virtual Machine <br><br> <li> Azure Database for PostgreSQL server | Refer to support matrices for [Azure VM backup](https://docs.microsoft.com/azure/backup/backup-support-matrix-iaas) and [Azure Database for PostgreSQL Server backup](backup-azure-database-postgresql.md#support-matrix) |
| Actions | Restore Backup Instance | <li> Azure Virtual Machine <br><br> <li> Azure Database for PostgreSQL server | Refer to support matrices for [Azure VM backup](https://docs.microsoft.com/azure/backup/backup-support-matrix-iaas) and [Azure Database for PostgreSQL Server backup](backup-azure-database-postgresql.md#support-matrix) |
| Actions | Create vault | <li> Azure Virtual Machine <br><br> <li> Azure Database for PostgreSQL server | Refer to support matrices for [Recovery Services vault](https://docs.microsoft.com/azure/backup/backup-support-matrix#vault-support) |
| Actions | Create backup policy | <li> Azure Virtual Machine <br><br> <li> Azure Database for PostgreSQL server | Refer to support matrices for [Recovery Services vault](https://docs.microsoft.com/azure/backup/backup-support-matrix#vault-support) |
| Actions | Execute on-demand backup for a backup instance | <li> Azure Virtual Machine <br><br> <li> Azure Database for PostgreSQL server | Refer to support matrices for [Azure VM backup](https://docs.microsoft.com/azure/backup/backup-support-matrix-iaas) and [Azure Database for PostgreSQL Server backup](backup-azure-database-postgresql.md#support-matrix) |
| Actions | Stop backup for a backup instance | <li> Azure Virtual Machine <br><br> <li> Azure Database for PostgreSQL server | Refer to support matrices for [Azure VM backup](https://docs.microsoft.com/azure/backup/backup-support-matrix-iaas) and [Azure Database for PostgreSQL Server backup](backup-azure-database-postgresql.md#support-matrix) |
| Insights | View Backup Reports | <li> Azure Virtual Machine <br><br> <li> SQL in Azure Virtual Machine <br><br> <li> SAP HANA in Azure Virtual Machine <br><br> <li> Azure Files <br><br> <li> System Center Data Protection Manager <br><br> <li> Azure Backup Agent (MARS) <br><br> <li> Azure Backup Server (MABS) | Refer to [supported scenarios for Backup Reports](https://docs.microsoft.com/azure/backup/configure-reports#supported-scenarios) |
| Governance | View and assign built-in and custom Azure Policies under category 'Backup' | N/A | N/A |
| Governance | View datasources not configured for backup | <li> Azure Virtual Machine <br><br> <li> Azure Database for PostgreSQL server | N/A |

## Unsupported scenarios

| **Category** | **Scenario**  |
|--------------|---------------|
| Monitoring | View alerts at scale |
| Actions | Configure vault settings at scale |
| Actions | Execute cross-region restore job from Backup Center |

## Next steps

* [Review the support matrix for Azure Backup](https://docs.microsoft.com/azure/backup/backup-support-matrix)
* [Review the support matrix for Azure VM backup](https://docs.microsoft.com/azure/backup/backup-support-matrix-iaas)
* [Review the support matrix for Azure Database for PostgreSQL Server backup](backup-azure-database-postgresql.md#support-matrix)
