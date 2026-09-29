---
title: Migrate Azure Database for PostgreSQL flexible server v1 backups to v2 experience by using Azure portal (preview)
description: Learn how to migrate an Azure Database for PostgreSQL flexible server that uses the v1 logical backup solution to the v2 physical backup experience by using the Azure portal.
ms.topic: how-to
ms.service: azure-backup
ms.date: 09/28/2026
---

# Migrate Azure Database for PostgreSQL flexible server v1 backups to v2 experience by using Azure portal (preview)

This article describes how to migrate an Azure Database for PostgreSQL flexible server that uses the v1 logical backup solution to the v2 physical backup experience by using the Azure portal. During migration, you move the existing protected item to v2 while retaining the same backup policy and Backup vault.

> [!IMPORTANT]
> Migration from v1 to v2 is one way.  Recovery points created earlier on the v1 stack remain available on the same protected item. You can restore these recovery points by using the **Restore as Files** option. To return to v1, you must stop protection and delete backup instance to reconfigure backup on the v1 stack.

## Prerequisites

Before you migrate the protected item to v2 experience, ensure that you meet the following prerequisites:

- [Upgrade the PostgreSQL major version to 15 or later](/azure/postgresql/configure-maintain/concepts-major-version-upgrade)
- [Scale a Burstable server to General Purpose or Memory Optimized tiers](/azure/postgresql/scale/how-to-scale-compute)

## Configure migration of Azure PostgreSQL flexible server backups to v2 experience

You can start the configuration flow from the Backup vault, Resiliency, or the LTR (Vaulted Backups) pane of the flexible server. This section describes how to migrate the protected item to v2 from Resiliency.

To configure backup migration to v2 experience by using Resiliency, follow these steps:


1. Go to **Resiliency** > **Backup and recovery** > **Protected items**.

2. On the **Protected items** pane, use the filters to find the protected item. Set **Datasource type** to **Azure PostgreSQL flexible server/elastic cluster** and select the backup instance to open that you want to migrate.

3. On the **selected backup instance** pane, select **Edit backup instance**.

   :::image type="content" source="./media/backup-azure-postgresql-flex-server-elastic-cluster-v2-migrate/edit-backup-instance.png" alt-text="Screenshot to edit backup instance." lightbox="./media/backup-azure-postgresql-flex-server-elastic-cluster-v2-migrate/edit-backup-instance.png":::

4. On the **Edit Backup instance** pane, under **Backup type**, select **v2 (physical backup) (preview)**.

   :::image type="content" source="./media/backup-azure-postgresql-flex-server-elastic-cluster-v2-migrate/edit-backup-instance-migrate-to-v2.png" alt-text="Screenshot to edit backup instance to migrate to v2." lightbox="./media/backup-azure-postgresql-flex-server-elastic-cluster-v2-migrate/edit-backup-instance-migrate-to-v2.png":::

5. To validate and save the edit backup instance parameters, select **Validate**.

## Related content

- [Support matrix for Azure PostgreSQL flexible server and elastic cluster vaulted backup (v2) (preview)](backup-azure-postgresql-flex-server-elastic-cluster-v2-support-matrix.md)
- [About Azure PostgreSQL flexible server and elastic cluster vaulted backup (v2) (preview)](backup-azure-postgresql-flex-server-elastic-cluster-v2-overview.md)
