<properties pageTitle="Upgrade to the Latest SQL Database Update V12 (preview)" description="Upgrade to the Latest SQL Database Update V12 (preview)" services="sql-database" documentationCenter="" authors="sonalmm" manager="jeffreyg" editor=""/>

<tags ms.service="sql-database" ms.devlang="na" ms.topic="article" ms.tgt_pltfrm="na" ms.workload="data-management" ms.date="12/11/2014" ms.author="sonalm"/>



# Upgrade to the Latest SQL Database Update V12 (preview)

- How to update a server in place with the  SQL Database Update (preview) features

- How to copy a database to a new server with SQL Database Update (preview) features enabled **(feature coming soon)**

[Sign up](https://portal.azure.com) for the Latest SQL Database Update V12 (Preview) to take advantage of the next generation of  SQL Database on Microsoft Azure. To take advantage of the preview, you first need a subscription to Microsoft Azure. You can sign up for a [free Azure trial](http://azure.microsoft.com/en-us/pricing/free-trial) and review [pricing](http://azure.microsoft.com/en-us/pricing/details/sql-database) information. 

> [AZURE.WARNING] Test databases, database copies, or new databases, are good candidates for upgrading to the preview. Production databases that your business depends on should wait until after the preview period.

## How to Upgrade a Server In Place with the Latest SQL Database Update (preview) Features ##

| Upgrade  | Screen shot |
| :--- | :--- |
| 1. Sign in to [http://portal.azure.com/](http://portal.azure.com/). | ![New Azure Portal][1] |
| 2. Click **BROWSE**. | ![Browse Services][2] |
| 3.	Click **SQL servers**. A list of SQL Server names is displayed. | ![Select SQL Server service][3] |
| 4. Select the server you want to copy to a new server with  SQL Database Update preview enabled. | ![Shows a list of SQL Servers][4] |
| 5. Click **Latest SQL Database Update V12 (preview)**. | ![Latest preview feature][5] |
| 6. Click **UPGRADE THIS SERVER**. | ![Upgrades the SQL Server to the preview][6] |

> [AZURE.NOTE] **IMPORTANT**: Once you select the upgrade option, your server and the databases within that server will be enabled with SQL Database Update V12 preview features, and you will not be able to reverse that. To upgrade servers to SQL Database Update V12 (preview), you require a Basic, Standard or Premium service tier. For more information on the  service tiers,see [Upgrade SQL Database Web/Business Databases to New Service Tiers"](http://azure.microsoft.com/en-us/documentation/articles/sql-database-upgrade-new-service-tiers/).

> **IMPORTANT**: Geo-replication is not supported with SQL Database Update V12 (preview). For more information, see [Plan and Prepare to Upgrade to Azure SQL Database V12 Preview](http://azure.microsoft.com/en-us/documentation/articles/sql-database-preview-plan-prepare-upgrade).


Once you click the **UPGRADE THIS SERVER** option, the blade that opens shows a message about a validation process. 

- The validation process checks the service tier of your database and checks whether Geo-replication is enabled. The blade will show the results after the validation is complete. 
- After the validation process is complete, you will see a list of database names that require you to take action to meet the requirements of upgrading to SQL Database Update V12 (preview). **You need to complete the actions for each of those databases to be able to upgrade to SQL Database update V12 (preview)**.
- As you click on each database name, a new blade provides service pricing tier recommendation based on your current usage. You can also browse various pricing tiers and select the one that suits your environment best. All the databases that are setup for Geo Replication need to be reconfigured to stop replication. 
- Note that a recommendation on pricing tier will not be displayed if enough data is not found. 

| Action | Screen shot |
| :--- | :--- |
| 7. Once you have completed the actions that prepares your server for the upgrade, type the name of the server to upgrade and Click **OK**. | ![Confirm the server name to upgrade][7] |
| 8. The upgrade process is initiated. Upgrade can take up to 24 hours. During this time all databases on this server will remain online but server and database management actions will be restricted. Once the process is complete, the status **Enabled** is displayed on the server blade. | ![Confirms preview features are enabled][8] |
 

##How to Copy a Database to a New Server with SQL Database Update  V12 (preview) Features Enabled **(coming soon)**

The scenario of copying your database to a new server is not available at this time. However, the copy feature will be available during the preview time frame. Please check again. 

# Related Links  #

-  [What's new in the Latest SQL Database Update V12 (preview)](http://azure.microsoft.com/documentation/articles/sql-database-preview-whats-new/)
- [Plan and prepare to upgrade to the Latest SQL Database Update V12 (preview)](http://azure.microsoft.com/documentation/articles/sql-database-preview-plan-prepare-upgrade/)


<!--Image references-->
[1]: ./media/sql-database-preview-upgrade/firstscreenportal.png
[2]: ./media/sql-database-preview-upgrade/browse.png
[3]: ./media/sql-database-preview-upgrade/sqlserver.png
[4]: ./media/sql-database-preview-upgrade/sqlserverlist.png
[5]: ./media/sql-database-preview-upgrade/latestprview.png
[6]: ./media/sql-database-preview-upgrade/upgrade.png
[7]: ./media/sql-database-preview-upgrade/typeservername.png
[8]: ./media/sql-database-preview-upgrade/enabled.png