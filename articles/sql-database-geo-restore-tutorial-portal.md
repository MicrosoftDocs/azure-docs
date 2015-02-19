<properties 
   pageTitle="Recover an Azure SQL database using Geo-Restore in Azure portal" 
   description="Geo-Restore, Microsoft Azure SQL Database, restore database, recover database, Azure Management Portal, Azure portal" 
   services="sql-database" 
   documentationCenter="" 
   authors="elfisher" 
   manager="jeffreyg" 
   editor="v-romcal"/>

<tags
   ms.service="sql-database"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="ibiza"
   ms.workload="storage-backup-recovery" 
   ms.date="02/19/2015"
   ms.author="elfish; v-romcal"/>

# Recover an Azure SQL database using Geo-Restore in Azure portal  

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/documentation/articles/sql-database-geo-restore-tutorial-powershell/" title="Geo-Restore - PowerShell">Geo-Restore - PowerShell</a><a href="/en-us/documentation/articles/sql-database-geo-restore-tutorial-rest/" title="Geo-Restore - REST API">Geo-Restore - REST API</a></div>

This tutorial shows you how to recover an Azure SQL database using Geo-Restore in the [Azure portal](https://login.microsoftonline.com/microsoft.onmicrosoft.com/oauth2/authorize?response_type=code+id_token&redirect_uri=https%3a%2f%2fmanage.windowsazure.com%2fmicrosoft.onmicrosoft.com&client_id=00000013-0000-0000-c000-000000000000&resource=https%3a%2f%2fmanagement.core.windows.net%2f&scope=user_impersonation+openid&nonce=22afb166-50d7-4dc6-baff-409a84b46d0f&domain_hint=microsoft.onmicrosoft.com&site_id=500879&response_mode=query). Geo-Restore is the core disaster recovery protection included for all Basic, Standard, and Premium Azure SQL Databases service tiers.

## Restrictions and Security

* Geo-Restore is enabled for all Basic, Standard, and Premium service tiers.

* Back-up retention periods are Basic, 7 days; Standard, 14 days; and Premium, 35 days.

* Only the administrator or co-administrator for the subscription can submit a restore request.

* The server level principal login will be the owner of the restored database.

* Web and Business Edition service tiers don't support Geo-Restore.
 
	* If you have a Web or Business Edition database you can use database copy to get a transactional-consistent copy of your database, and then export the copied database to a Microsoft Azure storage account. For more information, see [How to: Use Database Copy (Azure SQL Database)](http://msdn.microsoft.com/en-us/library/azure/ff951631.aspx) and [How to: Use the Import and Export Service in Azure SQL Database](http://msdn.microsoft.com/en-us/library/azure/hh335292.aspx).

	* Web and Business Editions will be retired September 2015. For more information, see [Web and Business Edition Sunset FAQ](http://msdn.microsoft.com/en-us/library/azure/dn741330.aspx).

## How to: Recover an Azure SQL database using Geo-Restore in Azure portal

<iframe src="http://channel9.msdn.com/Blogs/Windows-Azure/Restore-a-SQL-Database-Using-Geo-Restore/player" width="960" height="540" allowFullScreen frameBorder="0"></iframe>

1. Sign in to the Azure portal using your Microsoft account and select **SQL Databases**.

2. In the left navigation, click **SQL DATABASES**.

3. At the top of the page, click **SERVERS**.

4. In the **SERVERS** list, click the **Degraded** server.

4. At the top of the page, click **BACKUPS**.

5. Click the database you want to restore.

6. At the bottom of the page in the command bar, click **Restore**. This launches the **Specify restore settings** dialog box. 

7. Choose the **DATABASE NAME** and **TARGET SERVER** you want to restore your database to. By default, a database name is chosen for you, but you can change it if you want.   

9. Click the check mark to submit the restore request.

A restore may take some time to complete. To monitor the status of the restore, click the Status icon at the bottom right of the page in the command bar, and then click **DETAILS**.

## Next steps

For more information, see the following: 

[Restore an Azure SQL database using Point in Time Restore in Azure portal](http://www.azure.microsoft.com/en-us/documentation/articles/sql-database-point-in-time-restore-tutorial-portal)

[Restore a deleted Azure SQL database in Azure portal](http://www.azure.microsoft.com/en-us/documentation/articles/sql-database-restore-deleted-database-tutorial-portal)

[Azure SQL Database Business Continuity](http://msdn.microsoft.com/en-us/library/azure/hh852669.aspx)

[Azure SQL Database Backup and Restore](http://msdn.microsoft.com/en-us/library/azure/jj650016.aspx)

[Azure SQL Database Geo-Restore (blog)](http://azure.microsoft.com/blog/2014/09/13/azure-sql-database-geo-restore/)