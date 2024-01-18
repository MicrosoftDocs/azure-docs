---
title: Restore the Azure Database for MySQL - Flexible Server by using Azure Backup
description: Learn how to restore the Azure Database for MySQL - Flexible Server.
ms.topic: how-to
ms.date: 07/20/2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Restore the Azure Database for MySQL - Flexible Server (preview)

This article describes how to restore the Azure Database for MySQL - Flexible Server by using Azure Backup.



## Restore the MySQL database

To restore the database, follow these steps:

1. Go to the *Backup vault* > **Backup Instances**.

2. Select the **Azure database for MySQL - Flexible Server** > **Restore**.

3. Click **Select restore point** > **Point-in-time** you want to restore.

   Ton change the date range, select **Time period**.

4. On the **Restore parameters** tab, choose the **Target storage account**, and then select **Validate** to check if the restore parameters and permissions are assigned for the restore operation.


5. Once the validation is successful, select **Restore** to restore the selected database backups in the target storage account.


## Next steps

- 