---
title: Overview - retention of Azure Database for MySQL - Flexible Server for long term by using Azure Backup
description: This article provides an overview of Azure Database for MySQL - Flexible Server retention for long term.
ms.topic: overview
ms.date: 03/08/2024
ms.service: backup
ms.custom: engagement-fy23
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Long-term retention for Azure Database for MySQL - Flexible Server by using Azure Backup (preview)

Azure Backup and Azure Database Services together allow you to build an enterprise-class backup solution for Azure Database for MySQL - Flexible servers that retain backups for **up to 10 years**. If you have an Azure Database for MySQL - Flexible server, then you can extend  the retention of backups beyond 35 days with built-in operational tier backup capability of MySQL - Flexible database.

This feature allows you to extend the current limitation of *35 days* backup retention to *10 years*, meeting your compliance and regulatory requirements.

Also, the backups are copied to an isolated storage environment outside of your tenant and subscription provide protection against ransomware attacks. In addition to long-term retention (LTR), this feature enhances the backup resiliency by protecting the source data from different levels of data loss, such as accidental deletions and ransomware protection. It's a zero-infrastructure solution with Azure Backup managing the backups with automated retention and backup scheduling. You can create a backup policy to define the backup schedule and retention. Based on the policy definition, Azure Backup transfers backups to the vault as blobs and manages their lifecycle. You can manage the backups centrally beside other protected workloads via the Azure Backup Center. 

You can recover this backup in your specified storage containers, which can be used to rebuild the MySQL - Flexible server. You can also use native tools to restore this data as a new MySQL - Flexible server with database native tools. 

## Azure Database for MySQL - Flexible Server backup flow

To back up an Azure Database for MySQL - Flexible Server:

1. Grant permissions to the Backup vault MSI on the target ARM resource (MySQL-Flexible  server), establishing access and control.
2. Configure backup policies, and specify the scheduling, retention, and other parameters.

Once the configuration is complete:

- Azure Backup invokes the backup based on the policy schedules on the ARM API of MySQL Flex server, writing data to a secure blob container with a SAS for enhanced security.
- Backup job runs independently, preventing disruptions during long-running tasks.
- The retention and recovery point lifecycles align with the backup policies for effective management.
- During the restore, Azure Backup invokes restore on the ARM API of the MySQL - Flexible Server using the Statistical Analysis System (SAS) for asynchronous, nondisruptive recovery.

:::image type="content" source="./media/backup-azure-mysql-flexible-server-about/mysql-flexible-server-backup-architecture.png" alt-text="Diagram shows the backup flow for Azure Database for MySQL Flexible Server." lightbox="./media/backup-azure-mysql-flexible-server-about/mysql-flexible-server-backup-architecture.png":::

## Azure Backup authentication with MySQL - Flexible server

Azure Backup needs to connect to Azure MySQL - Flexible server while taking each backup. 

## Permissions for an Azure Database for MySQL - Flexible Server backup

The following table lists permissions that the vault MSI requires for successful backup operations:

| Operation | Permission |
| --- | --- |
| **Backup** | - MySQL Flexible Server Long-term Retention Backup Role <br><br> - Reader Role on the server's resource group. |
| **Restore** | Storage Blob Data Contributor Role on the target storage account. |

## Next steps

- [Support matrix for Azure Database for MySQL - Flexible Server retention for long term (preview)](backup-azure-mysql-flexible-server-support-matrix.md).
- [Back up an Azure Database for MySQL - Flexible Server (preview)](backup-azure-mysql-flexible-server.md).
- [Restore an Azure Database for MySQL - Flexible Server (preview)](backup-azure-mysql-flexible-server-restore.md).