---
title: Back up Azure Database for PostgreSQL Flexible server with long-term retention
description: Learn about Azure Database for PostgreSQL Flexible server backup with long-term retention.
ms.topic: how-to
ms.date: 02/17/2025
ms.service: azure-backup
ms.custom:
  - ignite-2024
author: jyothisuri
ms.author: jsuri
---

# Back up Azure Database for PostgreSQL Flexible server with long-term retention

This article describes how to back up Azure Database for PostgreSQL Flexible Server. 

## Prerequisites

Before you configure backup for Azure Database for PostgreSQL Flexible Server, ensure that the following prerequisites are met:

- [Review the supported scenarios and known limitations](./backup-azure-database-postgresql-flex-support-matrix.md) of Azure Database for PostgreSQL Flexible server backup.
- Identify or [create a Backup vault](create-manage-backup-vault.md#create-a-backup-vault) in the same region where you want to back up the Azure Database for PostgreSQL Server instance.
- Check that Azure Database for PostgreSQL Server is named in accordance with naming guidelines for Azure Backup. Learn about the [naming conventions](/previous-versions/azure/postgresql/single-server/tutorial-design-database-using-azure-portal#create-an-azure-database-for-postgresql)
- Provide [database user's backup privileges on the database](backup-azure-database-postgresql-overview.md#database-users-backup-privileges-on-the-database).
- Allow access permissions for PostgreSQL - Flexible Server. Learn about the [access permissions](backup-azure-database-postgresql-overview.md#access-permissions-on-the-azure-postgresql-server).
- [Create a back up policy](backup-azure-database-postgresql-flex.md#create-a-backup-policy).

[!INCLUDE [Configure protection for Azure Database for PostgreSQL - Flexible Server.](../../includes/configure-postgresql-flexible-server-backup.md)]

### Create a backup policy

You can create a Backup policy on the go during the backup configuration flow.

To create a backup policy, follow these steps: 

1. On the **Configure Backup** pane, select the **Backup policy** tab.
2. On the **Backup policy** tab, select **Create new** under **Backup policy**.
3. On the **Create Backup Policy** pane, select the **Basics** tab, and then  provide a name for the new policy on **Policy name**.

   :::image type="content" source="./media/backup-azure-database-postgresql-flex/enter-policy-name.png" alt-text="Screenshot sows how to provide the Backup policy name.":::

4. On the **Schedule + retention** tab, under **Backup schedule**, define the Backup frequency.

   >[!Note]
   >The **Weekly backup** option is currently available. However, you can schedule the backups on multiple days of the week.

   :::image type="content" source="./media/backup-azure-database-postgresql-flex/define-backup-schedule.png" alt-text="Screenshot shows how to define the backup schedule in the Backup policy." lightbox="./media/backup-azure-database-postgresql-flex/define-backup-schedule.png":::

5. Under **Retention rules**, select **Add retention rule**.
6. On the **Add retention** pane, define the retention period, and then select **Add**.


   >[!Note]
   >The default retention period for **Weekly** backup is **10 years**. You can add retention rules for specific backups, including data store and retention duration.

   :::image type="content" source="./media/backup-azure-database-postgresql-flex/add-retention-rules.png" alt-text="Screenshot shows how to define the retention for the database backups." lightbox="./media/backup-azure-database-postgresql-flex/add-retention-rules.png":::

7. Once you are on the **Create Backup Policy** pane, select **Review + create**.

   :::image type="content" source="./media/backup-azure-database-postgresql-flex/complete-policy-creation.png" alt-text="Screenshot shows how to trigger the Backup policy creation." lightbox="./media/backup-azure-database-postgresql-flex/complete-policy-creation.png":::    

    >[!Note]
    >The retention rules are evaluated in a pre-determined order of priority. The priority is the highest for the yearly rule, followed by the monthly, and then the weekly rule. Default retention settings are applied when no other rules qualify. For example, the same recovery point may be the first successful backup taken every week as well as the first successful backup taken every month. However, as the monthly rule priority is higher than that of the weekly rule, the retention corresponding to the first successful backup taken every month applies.
    

[!INCLUDE [Run an on-demand backup for Azure Database for PostgreSQL - Flexible Server.](../../includes/postgresql-flexible-server-on-demand-backup.md)]

## Track a backup job

Azure Backup service creates a job for scheduled backups or if you trigger on-demand backup operation for tracking. 

To view the backup job status, follow these steps:

1. Go to **Business Continuity Center** > **Monitoring + Reporting** > **Jobs**.

   The **Jobs** pane appears that shows the operation and status for the past **24 hours**.

   :::image type="content" source="./media/backup-azure-database-postgresql-flex/view-jobs.png" alt-text="screenshot shows how to view the jobs." lightbox="./media/backup-azure-database-postgresql-flex/view-jobs.png":::

2. Review the list of backup and restore jobs and their status. To view the job details, select a job from the list.

   :::image type="content" source="./media/backup-azure-database-postgresql-flex/view-job-details.png" alt-text="screenshot shows how to view the job details." lightbox="./media/backup-azure-database-postgresql-flex/view-job-details.png":::

## Next steps

[Restore Azure Database for PostgreSQL Flexible backups](./restore-azure-database-postgresql-flex.md)
