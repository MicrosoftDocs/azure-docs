---
title: About Azure Database for PostgreSQL Flexible server backup
description: An overview on Azure Database for PostgreSQL Flexible server backup
ms.topic: overview
ms.date: 09/25/2026
ms.service: azure-backup
ms.custom:
  - ignite-2024
  - build-2025
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a database administrator, I want to implement a backup solution for Azure Database for PostgreSQL Flexible servers, so that I can ensure long-term data retention and protection against data loss events like accidental deletions or ransomware attacks.
---

# About Azure Database for PostgreSQL - Flexible Server backup

> [!NOTE] 
> **Azure Backup for PostgreSQL flexible server and elastic cluster (v2) is now in preview.** The v2 solution takes physical backups from managed disk snapshots instead of logical (`pg_dump` based) backups, and addresses the limitations of the generally available solution described in this article: 
> 
> - Protects Azure Database for PostgreSQL flexible servers and elastic clusters, with support for up to 32 TB on Premium SSD v1 and up to 64 TB on Premium SSD v2, compared to the 1-TB limit
> - Supports daily backup schedules with a recovery point objective (RPO) of one day and Restore as Server directly to a target flexible server or elastic cluster, compared to weekly backups and Restore as Files. 
> 
> The solution described in this article remains generally available. To learn more about the preview, see [About Azure Backup for PostgreSQL flexible server and elastic cluster (v2)](backup-azure-postgresql-flex-server-elastic-cluster-v2-overview.md). 

Azure Backup and Azure Database Services have come together to build an enterprise-class backup solution for Azure Database for PostgreSQL servers that retains backups for up to 10 years. The feature offers the following capabilities:

- You can extend your backup retention beyond 35 days which is the maximum supported limit by the operational tier backup capability of PostgreSQL flexible database. [Learn more](/azure/postgresql/flexible-server/concepts-backup-restore#backup-retention).
- The backups are copied to an isolated storage environment outside of customer tenant and subscription, thus providing protection against ransomware attacks.
- Azure Backup provides enhanced backup resiliency by protecting the source data from different levels of data loss ranging from accidental deletion to ransomware attacks.
- The zero-infrastructure solution with Azure Backup service managing the backups with automated retention and backup scheduling.
- Central monitoring of all operations and jobs via backup center. 

## Backup flow

To perform the backup operation:

1. Grant permissions to the backup vault MSI on the target ARM resource (PostgreSQL-Flexible server), establishing access, and control. 
1. Configure backup policies, specify scheduling, retention, and other parameters. 

Once the configuration is successful:

1. The Backup service invokes the backup based on the policy schedules on the ARM API of PostgreSQL Flexible server, writing data to a secure blob container with a SAS for enhanced security. 
1. A service-managed clone server is automatically provisioned behind the scenes for backup operations, isolating backup processing from the primary PostgreSQL server and helping avoid disruptions to production workloads during long-running backup operations.
1. The retention and recovery point lifecycles align with the backup policies for effective management. 
1. During the restore, the Backup service invokes restore on the ARM API of PostgreSQL Flexible server using the SAS for asynchronous, nondisruptive recovery. 

## Azure Backup authentication with the PostgreSQL server

The Azure Backup service needs to connect to the Azure PostgreSQL Flexible server while taking each backup.  

### Permissions for backup

For successful backup operations, the vault MSI needs the following permissions: 

1. *Restore*: Storage Blob Data Contributor role on the target storage account.
1. *Backup*:
    1. *PostgreSQL Flexible Server Long Term Retention Backup Role* on the server.
    1. *Reader* role on the resource group of the server.

## Understand pricing

You incur charges for:

- **Protected instance fee**: Azure Backup for PostgreSQL - Flexible servers charges a *protected instance fee* as per the size of the database. When you configure backup for a PostgreSQL Flexible server, a protected instance is created. Each instance is charged on the basis of its size (in GBs) on a per unit (250 GB) basis. 

- **Backup Storage fee**: Azure Backup for PostgreSQL - Flexible servers store backups in Vault Tier. Restore points stored in the vault-standard tier are charged a separate fee called Backup Storage fee as per the total data stored (in GBs) and redundancy type enable on the Backup Vault. 

## Next steps

[Back up Azure Database for PostgreSQL - Flexible Server using Azure portal](tutorial-create-first-backup-azure-database-postgresql-flex.md).
