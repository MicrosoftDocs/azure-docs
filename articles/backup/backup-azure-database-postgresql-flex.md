---
title: Configure backup for Azure Database for PostgreSQL - Flexible Server using Azure portal
description: Learn about how to configure backup for Azure Database for PostgreSQL - Flexible Server using Azure portal. 
ms.topic: how-to
ms.date: 04/07/2025
ms.service: azure-backup
ms.custom:
  - ignite-2024
author: jyothisuri
ms.author: jsuri
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
2. On the **Backup policy** tab, select **Create new** under **Backup policy**.
3. On the **Create Backup Policy** pane, on the **Basics** tab,  provide a name for the new policy on **Policy name**.

   :::image type="content" source="./media/backup-azure-database-postgresql-flex/enter-policy-name.png" alt-text="Screenshot sows how to provide the Backup policy name.":::

4. On the **Schedule + retention** tab, under **Backup schedule**, define the Backup frequency.

5. Under **Retention rules**, select **Add retention rule**.

   :::image type="content" source="./media/backup-azure-database-postgresql-flex/define-backup-schedule.png" alt-text="Screenshot shows how to define the backup schedule in the Backup policy." lightbox="./media/backup-azure-database-postgresql-flex/define-backup-schedule.png":::

6. On the **Add retention** pane, define the retention period, and then select **Add**.


   >[!Note]
   >The default retention period for **Weekly** backup is **10 years**. You can add retention rules for specific backups, including data store and retention duration.

   :::image type="content" source="./media/backup-azure-database-postgresql-flex/add-retention-rules.png" alt-text="Screenshot shows how to define the retention for the database backups." lightbox="./media/backup-azure-database-postgresql-flex/add-retention-rules.png":::

7. Once you are on the **Create Backup Policy** pane, select **Review + create**.

   :::image type="content" source="./media/backup-azure-database-postgresql-flex/complete-policy-creation.png" alt-text="Screenshot shows how to trigger the Backup policy creation." lightbox="./media/backup-azure-database-postgresql-flex/complete-policy-creation.png":::    

    >[!Note]
    >The retention rules are evaluated in a pre-determined order of priority. The priority is the highest for the yearly rule, followed by the monthly, and then the weekly rule. Default retention settings are applied when no other rules qualify. For example, the same recovery point may be the first successful backup taken every week as well as the first successful backup taken every month. However, as the monthly rule priority is higher than that of the weekly rule, the retention corresponding to the first successful backup taken every month applies.
    

When the backup configuration is complete, you can [run an on-demand backup](tutorial-create-first-backup-azure-database-postgresql-flex.md#run-an-on-demand-backup) and [track the progress of the backup operation](tutorial-create-first-backup-azure-database-postgresql-flex.md#track-a-backup-job).


## Next steps

[Restore Azure Database for PostgreSQL - Flexible Server using Azure portal](./restore-azure-database-postgresql-flex.md).
