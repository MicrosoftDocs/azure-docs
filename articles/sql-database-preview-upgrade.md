<properties 
	pageTitle="Upgrade to SQL Database V12" 
	description="Explains how to upgrade to Azure SQL Database V12." 
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
	ms.date="05/04/2015" 
	ms.author="sonalm"/>


# Upgrade to SQL Database V12 in place


[Sign up](https://portal.azure.com) for SQL Database V12 to take advantage of the next generation of  SQL Database on Microsoft Azure. First, you need a subscription to Microsoft Azure. Sign up for a [free Azure trial](http://azure.microsoft.com/pricing/free-trial) and review [pricing](http://azure.microsoft.com/pricing/details/sql-database) information. 


## Steps to upgrade to SQL Database V12


| Upgrade step  | Screen shot |
| :--- | :--- |
| 1. Sign in to [http://portal.azure.com/](http://portal.azure.com/). | ![New Azure Portal][1] |
| 2. Click **BROWSE**. | ![Browse Services][2] |
| 3.	Click **SQL servers**. A list of SQL Server names is displayed. | ![Select SQL Server service][3] |
| 4. Select the server you want to copy to a new server with  SQL Database Update enabled. | ![Shows a list of SQL Servers][4] |
| 5. Click **Latest SQL Database Update V12**. | ![Latest preview feature][5] |
| 6. Click **UPGRADE THIS SERVER**. | ![Upgrades the SQL Server to the preview][6] |


> [AZURE.NOTE] Once you select the upgrade option, your server and the databases within that server will be enabled with SQL Database V12 features, and you will not be able to reverse that. To upgrade servers to SQL Database V12, you require a Basic, Standard or Premium service tier. For more information on the  service tiers,see [Upgrade SQL Database Web/Business Databases to New Service Tiers"](sql-database-upgrade-new-service-tiers.md).


> [AZURE.IMPORTANT] Geo-replication is not supported with SQL Database V12 (preview). For more information, see [Plan and Prepare to Upgrade to Azure SQL Database V12 Preview](sql-database-v12-plan-prepare-upgrade.md).


Once you click the **UPGRADE THIS SERVER** option, the blade that opens shows a message about a validation process. 


- The validation process checks the service tier of your database and checks whether Geo-replication is enabled. The blade will show the results after the validation is complete. 
- After the validation process is complete, you will see a list of database names that require you to take action to meet the requirements of upgrading to SQL Database V12.
 - **You need to complete the actions for each of those databases to be able to upgrade to SQL Database V12**.
- As you click on each database name, a new blade provides service pricing tier recommendation based on your current usage. You can also browse various pricing tiers and select the one that suits your environment best. All the databases that are setup for Geo Replication need to be reconfigured to stop replication. 
- Note that a recommendation on pricing tier will not be displayed if enough data is not found. 


| Action | Screen shot |
| :--- | :--- |
| 7. Once you have completed the actions that prepares your server for the upgrade, type the name of the server to upgrade and Click **OK**. | ![Confirm the server name to upgrade][7] |
| 8. The upgrade process is initiated. Upgrade can take up to 24 hours. During this time all databases on this server will remain online but server and database management actions will be restricted. Once the process is complete, the status **Enabled** is displayed on the server blade. | ![Confirms preview features are enabled][8] |
 

## Related Links

-  [What's new in SQL Database V12](sql-database-v12-whats-new.md)
- [Plan and prepare to upgrade to SQL Database V12](sql-database-v12-plan-prepare-upgrade.md)


<!--Image references-->
[1]: ./media/sql-database-preview-upgrade/firstscreenportal.png
[2]: ./media/sql-database-preview-upgrade/browse.png
[3]: ./media/sql-database-preview-upgrade/sqlserver.png
[4]: ./media/sql-database-preview-upgrade/sqlserverlist.png
[5]: ./media/sql-database-preview-upgrade/latestprview.png
[6]: ./media/sql-database-preview-upgrade/upgrade.png
[7]: ./media/sql-database-preview-upgrade/typeservername.png
[8]: ./media/sql-database-preview-upgrade/enabled.png
