---
title: Back up the Azure Database for MySQL - Flexible Server by using Azure Backup
description: Learn how to back up the Azure Database for MySQL - Flexible Server.
ms.topic: how-to
ms.date: 07/20/2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Back up the Azure Database for MySQL - Flexible Server (preview)

This article describes how to back up the Azure Database for MySQL - Flexible Server by using Azure Backup.



## Create a backup policy for the Azure MySQL - Flexible database backup

To create the backup policy, follow these steps:

1. [Create a Backup vault](create-manage-backup-vault.md#create-a-backup-vault).

2. Go to the *Backup vault* > **+Backup** to open the **Configure backup** page.
3. To create a new backup policy, under **Backup policy**, select **Create new**.
4. On the **Create a Backup Policy** page, enter a name for the new policy, and then select **Azure Database for MySQL (Preview) as the **Datasource type**.
5. Define the **Backup schedule**.

   >[!Note]
   >Currently, this feature supports only the *Weekly backup* option. However, you can schedule the backups on multiple days of the week. 

6. Define the **Retention** settings.

   You can add one or more retention rules. Each retention rule requires inputs for specific backups, data store, and retention duration for the backups.

7. To move the backups from *backup data store* to *archive data store* once they expire as per the backup policy, select **On-expiry**.

   >[!Note]
   >- Retention duration ranges from *7 days* to *10 years* in the *Backup data store*.
   >- The retention rules are evaluated in a pre-determined order of priority. The priority is the highest for the yearly rule, followed by the monthly, and then the weekly rule. Default retention settings are applied when no other rules qualify. For example, the same recovery point may be the first successful backup taken every week as well as the first successful backup taken every month. However, as the monthly rule priority is higher than that of the weekly rule, the retention corresponding to the first successful backup taken every month applies.
   >- The default retention rule is applied if no retention rule is set, and the value is set to *3 months*.
    
8. Select **Create**.   



## Configure backup on Azure Database for MySQL - Flexible Server

You can configure backup for the entire Azure databases for MySQL - Flexible Server.

To configure backup, follow these steps:

1. On the **Azure portal**, go to *Backup vault* > **+Backup**.

   Alternatively, go to **Backup center** >  **+Backup**.
 
 

2. Select the backup policy you created, which defines the backup schedule and the retention duration.


3. Select the **Azure database for MySQL - Flexible Server** to back up:
 
  You can choose an Azure database for MySQL - Flexible Servers across subscriptions if they're in the same region as that of the vault.   

4. Select **Add** and choose the Azure database for MySQL - Flexible Server that you want to back up.

5. After the selection. Backup readiness check will ensure the configuration. 

   To resolve any access issues, select **Assign missing roles**.  
 
 
6. Review  the configuration details, and then select **Configure Backup**.
 
7. Track the progress under **Backup Instances**.


## Run an on-demand backup.

To trigger an on-demand backup (that's not in the schedule specified in the policy), follow these steps:

1. Go to **Backup Instances**, select the *backup instance* for which you want to take backup.

2. Select **Backup Now*.
3. Choose a retention rule from the list.
4. Select **Backup now**.
 

## Monitor a backup job.

Azure Backup creates a job for scheduled backups or if you trigger on-demand backup operation for tracking. To view the backup job status, go to the **Backup Jobs**.

It shows the jobs dashboard with operation and status for the *past seven days*. You can select time range and other filters to narrow down your selection.
 
•	To view the status of the all-backup jobs, select View all in status to see ongoing and past jobs of this backup instance.
 







## Next steps

- [Restore the Azure Database for MySQL - Flexible Server (preview)](backup-azure-mysql-flexible-server-restore.md)
- 