---
title: Include file
description: Include file
ms.service: azure-backup
ms.topic: include
ms.date: 02/18/2025
author: jyothisuri
ms.author: jsuri
---

## Run an on-demand backup

To trigger an on-demand backup (that's not in the schedule specified in the policy) for the database, follow these steps:

1. Go to **Business Continuity Center** > **Protection inventory** > **Protected items**, and then select the **Datasource type** as **Azure Database for PostgreSQL flexible servers** to view the protected items.

   :::image type="content" source="./media/postgresql-flexible-server-on-demand-backup/filter-datasource-type.png" alt-text="screenshot shows the selection of datasource type." lightbox="./media/postgresql-flexible-server-on-demand-backup/filter-datasource-type.png":::

2. Select the protected item to run an on-demand backup.
3. On the **Protected items** pane, select **more** icon under the **Associated items** section, and then select **Backup now**.

   :::image type="content" source="./media/postgresql-flexible-server-on-demand-backup/run-on-demand-datasource-backup.png" alt-text="screenshot shows how to run an on-demand backup." lightbox="./media/postgresql-flexible-server-on-demand-backup/run-on-demand-datasource-backup.png":::

4. On the **Backup Now** pane, validate Retention rules as per the associated Backup policy, and then select **Backup now**.

   :::image type="content" source="./media/postgresql-flexible-server-on-demand-backup/start-backup-now.png" alt-text="screenshot shows how to start the Backup now operation." lightbox="./media/postgresql-flexible-server-on-demand-backup/start-backup-now.png":::
