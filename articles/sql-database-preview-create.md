<properties 
	pageTitle="Create a database in the Latest SQL Database Update V12 (preview)" 
	description="Create a database in the Latest SQL Database Update V12 (preview)" 
	services="sql-database" 
	documentationCenter="" 
	authors="sonalmm" 
	manager="jeffreyg" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.workload="data-management" 
	ms.date="03/16/2015" 
	ms.author="sonalm"/>


# Create a database in the  SQL Database V12

[Sign up](https://portal.azure.com) for the SQL Database V12 [(Preview in some regions)](sql-database-preview-whats-new.md#V12AzureSqlDbPreviewGaTable) to take advantage of the next generation of  SQL Database on Microsoft Azure. To get started, you need a subscription for Microsoft Azure. Sign up for a [free Azure trial](http://azure.microsoft.com/pricing/free-trial) and review [pricing](http://azure.microsoft.com/pricing/details/sql-database) information. 


| Create database | Screen shot |
| :--- | :--- |
| 1. Sign in to [http://portal.azure.com/](http://portal.azure.com/). | ![New Azure Portal][1] |
| 2. At the bottom of the page, on the left, click **New**. | ![Initiate New service][2]|
| 3. Click **SQL database**.| ![Different services to select from][3] |
| 4. A **SQL database** blade opens. In the **Name** field, specify a database name. | ![Name the database][4] |
| 5. In **SQL Database blade**, click **SERVER**. A **Server** blade opens that provides two choices: either you can create a new server or use an existing server.| ![select type of server][4] |
|5a. If you select **Use an existing server** option, select a server of your choice and click **Select**. Then, complete all the actions from step 6 on wards.| ![select a server from the list][5]| 
|5b.   If you select **Create a new server**, the **New server** blade opens. Specify the server name, server admin login, and password. Click **Location** to select the server location. | ![Complete create new server options][9]| 
|5c.The **New server** blade gives you the choice to create the new server with V12 updates. To learn more about the features in V12 servers, review [What's new in Azure SQL Database](./sql-database-preview-whats-new/).| ![Select V12 server][6]|
|5d. Make your selections on the **New server** blade and click **OK**. That will take you back to the **SQL Database** blade to complete the rest of the actions to create a database. | ![Complete New Server blade actions][8]|
|6. Click **Select Source**. The different types of sources you can select from to create a database are: a blank database, a sample database or from a backup of a database.| ![Select the source for the database][10]|
|7. Next, in the **SQL database** blade, click **PRICING TIER**. You can select one of the recommended pricing tier or **View all** available pricing tiers. After you make a choice, click **Select**. <p> For more information about pricing tiers, see [Upgrade SQL Database Web/Business Databases to New Service Tiers](./sql-database-upgrade-new-service-tiers/) and [Azure SQL Database Service Tiers and Performance Levels](http://msdn.microsoft.com/library/azure/dn741336.aspx). |![Select a pricing tier][7]
| 8. Next, in **SQL database** blade, click **Optional Configuration**, make the selections and click **OK**. 
| 9. When you select existing server, **Resource Group** and **Subscription** are already chosen for you. In the **SQL database** blade, you will see a locked icon next to **Resource Group** and **Subscription**. If you create a new server, then you get to select or create a resource group. For more information, review [Using resource groups to manage your Azure resources.](resource-group-overview.md)|![Specify Resource group][11]
| 10. Click **Create**. A new database with SQL Database V12 features is created. |![Creates a new database][12]

## Related Links  #

-  [What's new in Azure SQL Database](./sql-database-preview-whats-new/)
- [Plan and Prepare to Upgrade to Azure SQL Database V12](sql-database-preview-plan-prepare-upgrade.md)

<!--Image references-->
[1]: ./media/sql-database-preview-create/firstscreenportal.png
[2]: ./media/sql-database-preview-create/new.png
[3]: ./media/sql-database-preview-create/sqldatabase.png
[4]: ./media/sql-database-preview-create/databasename.png
[5]: ./media/sql-database-preview-create/useexistingserver.PNG
[6]: ./media/sql-database-preview-create/v12server.PNG
[7]: ./media/sql-database-preview-create/pricingtierdetails.png
[8]: ./media/sql-database-preview-create/finishnewserverblade.png
[9]: ./media/sql-database-preview-create/createnewserver.png
[10]: ./media/sql-database-preview-create/selectsource.png
[11]: ./media/sql-database-preview-create/resourcegroup.png
[12]: ./media/sql-database-preview-create/create.png

