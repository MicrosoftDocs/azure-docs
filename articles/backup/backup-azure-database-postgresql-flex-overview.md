---
title: About Azure Database for PostgreSQL Flexible server backup (preview)
description: An overview on Azure Database for PostgreSQL Flexible server backup
ms.topic: conceptual
ms.date: 11/06/2023
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# About Azure Database for PostgreSQL - Flexible server backup (preview) 

Azure Backup and Azure Database Services have come together to build an enterprise-class backup solution for Azure Database for PostgreSQL servers that retains backups for up to 10 years. The feature offers the following capabilities:

- You can extend your backup retention beyond 35 days which is the maximum supported limit by the operational tier backup capability of PostgreSQL flexible database. [Learn more](../postgresql/flexible-server/concepts-backup-restore.md#backup-retention).
- The backups are copied to an isolated storage environment outside of customer tenant and subscription, thus providing protection against ransomware attacks.
- Azure Backup provides enhanced backup resiliency by protecting the source data from different levels of data loss ranging from accidental deletion to ransomware attacks.
- The zero-infrastructure solution with Azure Backup service managing the backups with automated retention and backup scheduling.
- Central monitoring of all operations and jobs via backup center. 

## Backup flow

To perform the backup operation:

1. Grant permissions to the backup vault MSI on the target ARM resource (PostgreSQL-Flexible server), establishing access and control. 
1. Configure backup policies, specify scheduling, retention, and other parameters. 

Once the configuration is complete:

1. The Backup recovery point invokes the backup based on the policy schedules on the ARM API of PostgresFlex server, writing data to a secure blob-container with a SAS for enhanced security. 
1. Backup runs independently preventing disruptions during long-running tasks. 
1. The retention and recovery point lifecycles align with the backup policies for effective management. 
1. During the restore, the Backup recovery point invokes restore on the ARM API of PostgresFlex server using the SAS for asynchronous, nondisruptive recovery. 

 :::image type="content" source="./media/backup-azure-database-postgresql-flex-overview/backup-process.png" alt-text="Diagram showing the backup process.":::

## Azure Backup authentication with the PostgreSQL server

The Azure Backup service needs to connect to the Azure PostgreSQL Flexible server while taking each backup.  

### Permissions for backup

For successful backup operations, the vault MSI needs the following permissions: 

1. *Restore*: Storage Blob Data Contributor role on the target storage account.
1. *Backup*:
    1. *PostgreSQL Flexible Server Long Term Retention Backup* role on the server.
    1. *Reader* role on the resource group of the server.

## Next steps

[Azure Database for PostgreSQL -Flex backup (preview)](backup-azure-database-postgresql-flex.md).
