---
title: Get Started with backup and restore of Azure SQL databases for data protection and recovery | Microsoft Docs 
description: "This tutorial shows how to restore from automated backups to a point in time, store automated backups in the Azure Recovery Services vault, and to restore from the Azure Recovery Services vault"
keywords: sql database tutorial
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: aeb8c4c3-6ae2-45f7-b2c3-fa13e3752eed
ms.service: sql-database
ms.custom: business continuity
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 12/08/2016
ms.author: carlrab

---
<!------------------
This topic is annotated with TEMPLATE guidelines for TUTORIAL TOPICS.


Metadata guidelines

title
	60 characters or less. Tells users clearly what they will do (deploy an ASP.NET web app to App Service). Not the same as H1. It's 60 characters or fewer including all characters between the quotes and the Microsoft Docs site identifier.

description
	115-145 characters. Duplicate of the first sentence in the introduction. This is the abstract of the article that displays under the title when searching in Bing or Google. 

	Example: "This tutorial shows how to deploy an ASP.NET web application to a web app in Azure App Service by using Visual Studio 2015."
------------------>

<!----------------

TEMPLATE GUIDELINES for tutorial topics

The tutorial topic shows users how to solve a problem using a product or service. It includes the prerequisites and steps users need to be successful.  

It is a "solve a problem" topic, not a "learn concepts" topic.

DO include this:
	• What users will do
	• What they will create or accomplish by the end of the tutorial
	• Time estimate
	• Optional but useful: Include a diagram or video. Diagrams help users see the big picture of what they are doing. A video of the steps can be used by customers as an alternative to following the steps in the topic.
	• Prerequisites: Technical expertise and software requirements
	• End-to-end steps. At the end, include next steps to deeper or related tutorials so users can learn more about the service

DON'T include this:
	• Conceptual info about the service. This info is in overview topics that you can link to in the prerequisites section if necessary

------------------->

<!------------------
GUIDELINES for the H1 
	
	The H1 should answer the question "What will I do in this topic?" Write the H1 heading in conversational language and use search keywords as much as possible. Since this is a "solve a problem" topic, make sure the title indicates that. Use a strong, specific verb like "Deploy."  
		
	Heading must use an industry standard term. If your feature is a proprietary name like "elastic pools", use a synonym. For example: "Learn about elastic pools for multi-tenant databases." In this case multi-tenant database is the industry-standard term that will be an anchor for finding the topic.

-------------------->

# Get Started with Backup and Restore for Data Protection and Recovery

<!------------------
	GUIDELINES for introduction
	
	The introduction is 1-2 sentences.  It is optimized for search and sets proper expectations about what to expect in the article. It should contain the top keywords that you are using throughout the article.The introduction should be brief and to the point of what users will do and what they will accomplish. 

	In this example:
	 

Sentence #1 Explains what the user will do. This is also the metadata description. 
	This tutorial shows how to deploy an ASP.NET web application to a web app in Azure App Service by using Visual Studio 2015. 

Sentence #2 Explains what users will learn and the benefit.  
	When you’re finished, you’ll have a simple web application up and running in the cloud.

-------------------->


In this getting-started tutorial, you learn how to use the Azure portal to:

- View existing backups of a database
- Restore a database to a previous point in time
- Configure long-term retention of a database backup file in the Azure Recovery Services vault
- Restore a database from the Azure Recovery Services vault

**Time estimate**: This tutorial takes approximately 30 minutes to complete (assuming you have already met the prerequisites).


## Prerequisites

* You need an Azure account. You can [open a free Azure account](/pricing/free-trial/?WT.mc_id=A261C142F) or [Activate Visual Studio subscriber benefits](/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F). 

* You must be able to connect to the Azure portal using an account that is a member of either the subscription owner or contributor role. For more information on role-based access control (RBAC), see [Getting started with access management in the Azure portal](../active-directory/role-based-access-control-what-is.md).

* You have completed the [Get started with Azure SQL Database servers, databases, and firewall rules by using the Azure portal and SQL Server Management Studio](sql-database-get-started.md) or the equivalent [PowerShell version](sql-database-get-started-powershell.md) of this tutorial. If you have not, either complete this prerequisite tutorial or execute the PowerShell script at the end of the [PowerShell version](sql-database-get-started-powershell.md) of this tutorial before continuing.


> [!TIP]
> You can perform these same tasks in a getting started tutorial by using [PowerShell](sql-database-get-started-backup-recovery-powershell.md).


## Sign in by using your existing account
Using your [existing subscription](https://account.windowsazure.com/Home/Index), follow these steps to connect to the Azure portal.

1. Open your browser of choice and connect to the [Azure portal](https://portal.azure.com/).
2. Sign in to the [Azure portal](https://portal.azure.com/).
3. On the **Sign in** page, provide the credentials for your subscription.
   
   ![Sign in](./media/sql-database-get-started/login.png)


<a name="create-logical-server-bk"></a>

## View the oldest restore point from the service-generated backups of a database

In this section of the tutorial, you view information about the oldest restore point from the [service-generated automated backups](sql-database-automated-backups.md) of your database. 

1. Open the **SQL database** blade for your database, **sqldbtutorialdb**.

    ![new sample db blade](./media/sql-database-get-started/new-sample-db-blade.png)

2. On the toolbar, click **Restore**.

    ![restore toolbar](./media/sql-database-get-started-backup-recovery/restore-toolbar.png)

3. On the Restore blade, review the oldest restore point.

    ![oldest restore point](./media/sql-database-get-started-backup-recovery/oldest-restore-point.png)

## Restore a database to a previous point in time

In this section of the tutorial, you restore the database to a new database as of a specific point in time.

1. On the **Restore** blade for the database, review the default name for the new database to which to restore you database to an earlier point in time (the name is the existing database name appended with a timestamp). This name changes to reflect the time you specify in the next few steps.

    ![restored database name](./media/sql-database-get-started-backup-recovery/restored-database-name.png)

2. Click the **calendar** icon in the **Restore point (UTC)** input box.

    ![restore point](./media/sql-database-get-started-backup-recovery/restore-point.png)

2. On the calendar, select a date within the retention period

    ![restore point date](./media/sql-database-get-started-backup-recovery/restore-point-date.png)

3. In the **Restore point (UTC)** input box, specify the time on the selected date to which you wish to restore the data in the database from the automated database backups.

    ![restore point time](./media/sql-database-get-started-backup-recovery/restore-point-time.png)

	>[!NOTE]
	>Notice that the database name has changed to reflect the date and time that you selected. Notice also that you cannot change the server to which you are restoring to a specific point in time. To restore to a different server, use [Geo-Restore](sql-database-disaster-recovery.md#recover-using-geo-restore). Finally, notice that you can restore into an [elastic pool](sql-database-elastic-jobs-overview.md) or to a different pricing tier. 
    >

4. Click **OK** to restore your database to an earlier point in time to the new database.

5. On the toolbar, click the notification icon to view the status of the restore job.

    ![restore job progress](./media/sql-database-get-started-backup-recovery/restore-job-progress.png)

6. When the restore job is completed, open the **SQL databases** blade to view the newly restored database.

    ![restored database](./media/sql-database-get-started-backup-recovery/restored-database.png)

   > [!NOTE]
   > From here, you can connect to the restored database using SQL Server Management Studio to perform needed tasks, such as to [extract a bit of data from the restored database to copy into the existing database or to delete the existing database and rename the restored database to the existing database name](sql-database-recovery-using-backups.md#point-in-time-restore).
   >

## Configure long-term retention of automated backups in an Azure Recovery Services vault 

In this section of the tutorial, you [configure an Azure Recovery Services vault to retain automated backups](sql-database-long-term-retention.md) for a period longer than the retention period for your service tier. 


> [!TIP]
> To delete backups, see [Delete long-term retention backups](sql-database-long-term-retention-delete.md).


1. Open the **SQL Server** blade for your server, **sqldbtutorialserver**.

    ![sql server blade](./media/sql-database-get-started/sql-server-blade.png)

2. Click **Long-term backup retention**.

   ![long-term backup retention link](./media/sql-database-get-started-backup-recovery/long-term-backup-retention-link.png)

3. On the **sqldbtutorial - Long-term backup retention** blade, review and accept the preview terms (unless you have already done so - or this feature is no longer in preview).

   ![accept the preview terms](./media/sql-database-get-started-backup-recovery/accept-the-preview-terms.png)

4. To configure long-term backup retention for the sqldbtutorialdb database, select that database in the grid and then click **Configure** on the toolbar.

   ![select database for long-term backup retention](./media/sql-database-get-started-backup-recovery/select-database-for-long-term-backup-retention.png)

5. On the **Configure** blade, click **Configure required settings** under **Recovery service vault**.

   ![configure vault link](./media/sql-database-get-started-backup-recovery/configure-vault-link.png)

6. On the **Recovery services vault** blade, select an existing vault, if any. Otherwise, if no recovery services vault found for your subscription, click to exit the flow and create a recovery services vault.

   ![create new vault link](./media/sql-database-get-started-backup-recovery/create-new-vault-link.png)

7. On the **Recovery Services vaults** blade, click **Add**.

   ![add new vault link](./media/sql-database-get-started-backup-recovery/add-new-vault-link.png)
   
8. On the **Recovery Services vault** blade, provide a valid name for the new Recovery Services vault.

   ![new vault name](./media/sql-database-get-started-backup-recovery/new-vault-name.png)

9. Select your subscription and resource group, and then select the location for the vault. When done, click **Create**.

   ![create new vault](./media/sql-database-get-started-backup-recovery/create-new-vault.png)

   > [!IMPORTANT]
   > The vault must be located in the same region as the Azure SQL logical server, and must use the same resource group as the logical server.
   >

10. After the new vault is created, execute the necessary steps to return to the **Recovery services vault** blade.

11. On the **Recovery services vault** blade, click the vault and then click **Select**.

   ![select existing vault](./media/sql-database-get-started-backup-recovery/select-existing-vault.png)

12. On the **Configure** blade, provide a valid name for the new retention policy, modify the default retention policy as appropriate, and then click **OK**.

   ![define retention policy](./media/sql-database-get-started-backup-recovery/define-retention-policy.png)

13. On the **sqldbtutorial - Long-term backup retention** blade, click **Save** and then click **OK** to apply the long-term backup retention policy to all selected databases.

   ![define retention policy](./media/sql-database-get-started-backup-recovery/save-retention-policy.png)

14. Click **Save** to enable long-term backup retention using this new policy to the Azure Recovery Services vault that you configured.

   ![define retention policy](./media/sql-database-get-started-backup-recovery/enable-long-term-retention.png)

15. After long-term backup retention has been enabled, open the **sqldbtutorialvault** blade (go to **All resources** and select it from the list of resources for your subscription).

   ![view recovery services vault](./media/sql-database-get-started-backup-recovery/view-recovery-services-vault.png)

   > [!IMPORTANT]
   > Once configured, backups show up in the vault within next seven days. Do not continue this tutorial until backups show up in the vault.
   >

## View backups in long-term retention

In this section of the tutorial, you view information about your database backups in [long-term backup retention](sql-database-long-term-retention.md). 

1. Open the **sqldbtutorialvault** blade (go to **All resources** and select it from the list of resources for your subscription) to view the amount of storage used by your database backups in the vault.

   ![view recovery services vault with backups](./media/sql-database-get-started-backup-recovery/view-recovery-services-vault-with-data.png)

2. Open the **SQL database** blade for your database, **sqldbtutorialdb**.

    ![new sample db blade](./media/sql-database-get-started/new-sample-db-blade.png)

3. On the toolbar, click **Restore**.

    ![restore toolbar](./media/sql-database-get-started-backup-recovery/restore-toolbar.png)

4. On the Restore blade, click **Long-term**.

5. Under Azure vault backups, click **Select a backup** to view the available database backups in long-term backup retention.

    ![backups in vault](./media/sql-database-get-started-backup-recovery/view-backups-in-vault.png)

## Restore a database from a backup in long-term backup retention

In this section of the tutorial, you restore the database to a new database from a backup in the Azure Recovery Services vault.

1. On the **Azure vault backups** blade, click the backup to restore and then click **Select**.

    ![select backup in vault](./media/sql-database-get-started-backup-recovery/select-backup-in-vault.png)

2. In the **Database name** text box, provide the name for the restored database.

    ![new database name](./media/sql-database-get-started-backup-recovery/new-database-name.png)

3. Click **OK** to restore your database from the backup in the vault to the new database.

4. On the toolbar, click the notification icon to view the status of the restore job.

    ![restore job progress from vault](./media/sql-database-get-started-backup-recovery/restore-job-progress-long-term.png)

5. When the restore job is completed, open the **SQL databases** blade to view the newly restored database.

    ![restored database from vault](./media/sql-database-get-started-backup-recovery/restored-database-from-vault.png)

   > [!NOTE]
   > From here, you can connect to the restored database using SQL Server Management Studio to perform needed tasks, such as to [extract a bit of data from the restored database to copy into the existing database or to delete the existing database and rename the restored database to the existing database name](sql-database-recovery-using-backups.md#point-in-time-restore).
   >


<!--**Next steps**: *Reiterate what users have done, and give them interesting and useful next steps so they want to go on.*-->

## Next steps

- To learn about service-generated automatic backups, see [automatic backups](sql-database-automated-backups.md)
- To learn about long-term backup retention, see [long-term backup retention](sql-database-long-term-retention.md)
- To learn about restoring from backups, see [restore from backup](sql-database-recovery-using-backups.md)
