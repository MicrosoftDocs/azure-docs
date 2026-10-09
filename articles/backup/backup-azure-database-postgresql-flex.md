---
title: Configure backup for Azure Database for PostgreSQL - Flexible Server using Azure portal
description: Learn about how to configure backup for Azure Database for PostgreSQL - Flexible Server using Azure portal. 
ms.topic: how-to
ms.date: 01/22/2026
ms.service: azure-backup
ms.custom:
  - ignite-2024
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a database administrator, I want to configure backup policies for Azure Database for PostgreSQL - Flexible Server using a portal, so that I can ensure data protection and manage retention effectively.
---

# Configure backup for Azure Database for PostgreSQL - Flexible Server using Azure portal

This article describes how to configure backup for Azure Database for PostgreSQL - Flexible Server using Azure portal. 

## Prerequisites

Before you configure backup for Azure Database for PostgreSQL - Flexible Server, ensure the following prerequisites are met:

[!INCLUDE [Prerequisites for backup of Azure Database for PostgreSQL - Flexible Server.](../../includes/backup-postgresql-flexible-server-prerequisites.md)]

[!INCLUDE [Configure protection for Azure Database for PostgreSQL - Flexible Server.](../../includes/configure-postgresql-flexible-server-backup.md)]

### Create a backup policy

You can create a backup policy on the go during the backup configuration flow.

To create a backup policy, follow these steps: 

1. On the **Configure Backup** pane, select the **Backup policy** tab.

1. On the **Backup policy** tab, select **Create new** under **Backup policy**.

1. On the **Create Backup Policy** pane, on the **Basics** tab, enter a name for the new policy in **Policy name**.

4. On the **Schedule + retention** tab, under **Backup schedule**, define the backup frequency as **Weekly**.

   > [!NOTE]
   > The generally available v1 (`pg_dump` based) solution supports only weekly frequencies. If you choose daily frequency, only the first backup operation of the week runs, and the subsequent backup jobs in the same week fail.

   :::image type="content" source="./media/backup-azure-database-postgresql-flex/backup-policy-schedule-retention.png" alt-text="Screenshot shows how to define the backup schedule in the Backup policy." lightbox="./media/backup-azure-database-postgresql-flex/backup-policy-schedule-retention.png":::

   > [!TIP]
   > For daily backup schedules with a recovery point objective of one day, instead of one backup per week, try [Azure Backup for PostgreSQL flexible server and elastic cluster (v2)](backup-azure-postgresql-flex-server-elastic-cluster-v2-overview.md) which is in preview. The v2 solution takes physical backups from managed disk snapshots instead of logical (`pg_dump` based) backups.

5. Under **Retention settings**, select **Add retention rule**.

6. On the **Add retention** pane, define the retention period, and then select **Add**.

7. When you return to the **Create Backup Policy** pane, select **Review + create**.

    >[!NOTE]
    >The retention rules are evaluated in a predetermined order of priority. The priority is the highest for the yearly rule, followed by the monthly rule, and then the weekly rule. Default retention settings apply when no other rules qualify. For example, the same recovery point might be the first successful backup taken every week as well as the first successful backup taken every month. However, because the monthly rule has higher priority than the weekly rule, the retention corresponding to the first successful backup taken every month applies.

When the backup configuration is complete, you can [run an on-demand backup](tutorial-create-first-backup-azure-database-postgresql-flex.md#run-an-on-demand-backup) and [track the progress of the backup operation](tutorial-create-first-backup-azure-database-postgresql-flex.md#track-a-backup-job).


## Next steps

[Restore Azure Database for PostgreSQL - Flexible Server using Azure portal](./restore-azure-database-postgresql-flex.md).
