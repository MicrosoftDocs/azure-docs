---
title: Support matrix for Backup Center
description: This article summarizes the scenarios that Backup Center supports for each workload type
ms.topic: conceptual
ms.date: 09/07/2020
---
# Support matrix for Backup Center

Backup Center provides a single pane of glass for enterprises to [govern, monitor, operate, and analyze backups at scale](backup-center-overview.md). This article summarizes the scenarios that Backup Center supports for each workload type.

## Supported Scenarios

| **Category** | **Scenario**  | **Supported Workloads** | **Limits** |
| -------------| ------------- | ----------------------- |------------|
| Monitoring   | View all jobs | Azure Virtual Machine <br> Azure Database for PostgreSQL server | <li> 7 days worth of jobs available out of the box. <br> <li> Each filter/drop-down supports a maximum of 1000 items. So Backup Center can be used to monitor a maximum of 1000 subscriptions and 1000 vaults across tenants. |
| Monitoring | View all backup instances | Azure Virtual Machine <br> Azure Database for PostgreSQL server | Same as above |
| Monitoring | View all backup policies | Azure Virtual Machine <br> Azure Database for PostgreSQL server | Same as above |
| Monitoring | View all vaults | Azure Virtual Machine <br> Azure Database for PostgreSQL server | Same as above |
| Actions | Configure backup | Azure Virtual Machine <br> Azure Database for PostgreSQL server | Refer to support matrices for [Azure VM backup](https://docs.microsoft.com/azure/backup/backup-support-matrix-iaas) and [Azure Database for PostgreSQL Server backup]() |
| Actions | Restore Backup Instance | Azure Virtual Machine <br> Azure Database for PostgreSQL server | Refer to support matrices for [Azure VM backup](https://docs.microsoft.com/azure/backup/backup-support-matrix-iaas) and [Azure Database for PostgreSQL Server backup]() |
| Actions | Create vault | Azure Virtual Machine <br> Azure Database for PostgreSQL server | Refer to support matrices for [Recovery Services vault](https://docs.microsoft.com/azure/backup/backup-support-matrix#vault-support) |
| Actions | Create backup policy | Azure Virtual Machine <br> Azure Database for PostgreSQL server | Refer to support matrices for [Recovery Services vault](https://docs.microsoft.com/azure/backup/backup-support-matrix#vault-support) |
| Actions | Execute on-demand backup for a backup instance | Azure Virtual Machine <br> Azure Database for PostgreSQL server | Refer to support matrices for [Azure VM backup](https://docs.microsoft.com/azure/backup/backup-support-matrix-iaas) and [Azure Database for PostgreSQL Server backup]() |
| Actions | Stop backup for a backup instance | Azure Virtual Machine <br> Azure Database for PostgreSQL server | Refer to support matrices for [Azure VM backup](https://docs.microsoft.com/azure/backup/backup-support-matrix-iaas) and [Azure Database for PostgreSQL Server backup]() |
| Insights | View Backup Reports | Azure Virtual Machine <br> SQL in Azure Virtual Machine <br> SAP HANA in Azure Virtual Machine <br> Azure Files <br> System Center Data Protection Manager <br> Azure Backup Agent (MARS) <br> Azure Backup Server (MABS) | Refer to[supported scenarios for Backup Reports](https://docs.microsoft.com/azure/backup/configure-reports#supported-scenarios) |
| Governance | View and assign built-in and custom Azure Policies under category 'Backup' | N/A | N/A |
| Governance | View datasources not configured for backup | Azure Virtual Machine <br> Azure Database for PostgreSQL server | N/A |

## Unsupported scenarios

| **Category** | **Scenario**  |
|--------------|---------------|
| Monitoring | View alerts at scale |
| Actions | Configure vault settings at scale |
| Actions | Execute cross-region restore job from Backup Center |

## Next steps

* [Review the support matrix for Azure Backup](https://docs.microsoft.com/azure/backup/backup-support-matrix)
* [Review the support matrix for Azure VM backup](https://docs.microsoft.com/azure/backup/backup-support-matrix-iaas)
* [Review the support matrix for Azure Database for PostgreSQL Server backup]()
