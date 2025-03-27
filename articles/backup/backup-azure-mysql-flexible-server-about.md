---
title: Overview - Retention of Azure Database for MySQL - Flexible Server for the Long Term by Using Azure Backup
description: This article provides an overview of Azure Database for MySQL - Flexible Server retention for the long term.
ms.topic: overview
ms.date: 11/21/2024
ms.service: azure-backup
ms.custom: engagement-fy23
author: jyothisuri
ms.author: jsuri
---

# Long-term retention for Azure Database for MySQL - Flexible Server by using Azure Backup (preview)

[!INCLUDE [Azure Database for MySQL - Flexible Server backup advisory](../../includes/backup-mysql-flexible-server-advisory.md)]

When you use an Azure Database for MySQL flexible server, you can extend the retention of backups beyond the current limit of 35 days with the built-in operational-tier backup capability of Azure Database for MySQL - Flexible Server. Azure Backup and Azure database services together allow you to build an enterprise-class backup solution for Azure Database for MySQL flexible servers that retains backups for *up to 10 years*.

Extending backup retention from 35 days to 10 years can help your organization meet compliance and regulatory requirements. The backups are copied to an isolated storage environment outside your tenant and subscription to help protect against ransomware attacks. In addition to long-term retention, this feature enhances backup resiliency by protecting the source data from different levels of data loss, such as accidental deletions and ransomware.

It's a zero-infrastructure solution in which Azure Backup manages the backups with automated retention and backup scheduling. You can create a backup policy to define the backup schedule and retention. Based on the policy definition, Azure Backup transfers backups to the vault as blobs and manages their life cycle. You can manage the backups centrally beside other protected workloads via Azure Business Continuity Center.

You can recover this backup in your specified storage containers, which you can use to rebuild the Azure Database for MySQL flexible server. You can also use native tools to restore this data as a new flexible server.

## Azure Database for MySQL - Flexible Server backup flow

To back up an Azure Database for MySQL flexible server:

1. Grant permissions to the Backup vault MSI on the target Azure Resource Manager resource (Azure Database for MySQL Flexible Server), to establish access and control.
2. Configure backup policies to specify the scheduling, retention, and other parameters.

After the configuration is complete:

- Azure Backup invokes the backup based on the policy schedules on the Resource Manager API of Azure Database for MySQL - Flexible Server. It writes data to a secure blob container with a statistical analysis system (SAS) for enhanced security.
- The backup job runs independently to prevent disruptions during long-running tasks.
- The life cycles of the retention and recovery point align with the backup policies for effective management.
- Azure Backup invokes the restore on the Resource Manager API of Azure Database for MySQL - Flexible Server by using the SAS for asynchronous, nondisruptive recovery.

:::image type="content" source="./media/backup-azure-mysql-flexible-server-about/mysql-flexible-server-backup-architecture.png" alt-text="Diagram that shows the backup flow for Azure Database for MySQL - Flexible Server." lightbox="./media/backup-azure-mysql-flexible-server-about/mysql-flexible-server-backup-architecture.png":::

## Azure Backup authentication with Azure Database for MySQL - Flexible Server

Azure Backup needs to connect to Azure Database for MySQL - Flexible Server while taking each backup.

## Permissions for an Azure Database for MySQL - Flexible Server backup

The following table lists permissions that the vault MSI requires for successful backup operations:

| Operation | Permission |
| --- | --- |
| **Backup** | Azure Database for MySQL - Flexible Server Long-Term Retention Backup role <br><br> Reader role on the server's resource group |
| **Restore** | Storage Blob Data Contributor role on the target storage account |

## Pricing

You incur charges for:

- **Protected instance fee**: When you configure a backup for an Azure Database for MySQL flexible server, a protected instance is created. Azure Backup charges a protected instance fee according to the size of the database (in gigabytes) on a per-unit (250-GB) basis.

- **Backup storage fee**: Azure Backup stores backups of Azure Database for MySQL flexible servers in the Standard vault tier. Restore points stored in the Standard vault tier are charged a separate backup storage fee according to the total data stored (in gigabytes) and the redundancy type enabled on the Backup vault.

## Related content

- [Support matrix for Azure Database for MySQL - Flexible Server protection by using Azure Backup (preview)](backup-azure-mysql-flexible-server-support-matrix.md)
- [Back up an Azure Database for MySQL flexible server (preview)](backup-azure-mysql-flexible-server.md)
- [Restore an Azure Database for MySQL flexible server (preview)](backup-azure-mysql-flexible-server-restore.md)
