---
title: Restore the Azure Database for MySQL - Flexible Server by using Azire Backup
description: Learn how to restore the Azure Database for MySQL - Flexible Server.
ms.topic: how-to
ms.date: 07/20/2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Restore the Azure Database for MySQL - Flexible Server (preview)

This article describes how to restore the Azure Database for MySQL - Flexible Server by using Azure Backup.



## Restore the database

Follow these steps:

1. Go to the *Backup vault* > **Backup Instances**.

2. Select the **Azure database for MySQL - Flexible Server** to > **Restore**.

3. Click **Select restore point** and select the *point-in-time* your want to restore.

   You can change the date range by selecting **Time period**.



4. On the **Restore parameters** tab, choose the *target storage account and container*, and then select **Validate** to check the restore parameters permissions.


5. Once the validation is successful, select **Restore** to restore the selected Azure databases for  MySQL - Flexible Server backup in target storage account.







## Next steps

- 