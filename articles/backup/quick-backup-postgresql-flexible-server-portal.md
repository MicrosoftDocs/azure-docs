---
title: "Quickstart: Create a backup policy for an Azure PostgreSQL - Flexible Server using Azure portal"
description: Learn how to create a backup policy for your Azure PostgreSQL - Flexible Server with Azure portal.
ms.devlang: terraform
ms.custom:
  - ignite-2024
ms.topic: quickstart
ms.date: 04/07/2025
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
# Customer intent: As a database administrator, I want to create a backup policy for Azure Database for PostgreSQL - Flexible Server, so that I can ensure data protection and establish recovery points according to my organization's requirements.
---

#  Quickstart: Create a backup policy for Azure Database for PostgreSQL - Flexible Server using Azure portal

This quickstart describes how to create a backup policy to protect Azure Database for PostgreSQL - Flexible Server to an Azure Backup Vault using Azure portal.

Azure Backup policy for Azure Database for PostgreSQL - Flexible Server defines how and when backups are created, the retention period for recovery points, and the rules for data protection and recovery.

## Prerequisites

Before you create a backup policy for Azure Database for PostgreSQL - Flexible Server, ensure the following prerequisites are met:

- [Review the supported scenarios and known limitations](backup-azure-database-postgresql-flex-support-matrix.md) of Azure Database for PostgreSQL Flexible server backup.
- Identify or [create a Backup vault](create-manage-backup-vault.md#create-a-backup-vault) in the same region where you want to back up the Azure Database for PostgreSQL Server instance.
- Check that Azure Database for PostgreSQL Server is named in accordance with naming guidelines for Azure Backup. Learn about the [naming conventions](/previous-versions/azure/postgresql/single-server/tutorial-design-database-using-azure-portal#create-an-azure-database-for-postgresql).
- Allow access permissions for PostgreSQL - Flexible Server. Learn about the [access permissions](backup-azure-database-postgresql-flex-overview.md#azure-backup-authentication-with-the-postgresql-server).

## Create a Backup policy

To create a Backup policy for Azure Database for PostgreSQL - Flexible Server, follow these steps: 

1. Go to **Business Continuity Center** > **Protection policies**, and then select **+ Create Policy** > **Create Backup Policy**.


2. On the **Start: Create Policy** pane, select the **Solution** as **Azure Backup**, **datasource type** as **Azure Database for PostgreSQL flexible servers**, select the vault under which the policy should be created, and then select **Continue**.


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

## Next steps

[Configure backup for Azure Database for PostgreSQL - Flexible Server using Azure portal](tutorial-create-first-backup-azure-database-postgresql-flex.md#configure-backup--for-the-database).
