<properties title="Create a database in the Latest SQL Database Update V12 (preview)" pageTitle="Create a database in the Latest SQL Database Update V12 (preview)" description="Create a database in the Latest SQL Database Update V12 (preview)" metaKeywords="Azure SQL Database, Azure SQL Database update, Create Azure SQL Database, Azure SQL Database preview" services="sql-database" solutions="" documentationCenter="" authors="sonalm" videoId="" scriptId="" manager="jefferyg" />

<tags ms.service="sql-database" ms.devlang="na" ms.topic="article" ms.tgt_pltfrm="na" ms.workload="data-management" ms.date="12/11/2014" ms.author="sonalm" />


# Create a database in the Latest SQL Database Update V12 (preview)

> [AZURE.NOTE] **CAUTION**: Test databases, database copies, or new databases, are good candidates for upgrading to the preview. Production databases that your business depends on should wait until after the preview period.

| Action | Screen shot |
| :--- | :--- |
| 1. Sign in to [http://portal.azure.com/](http://portal.azure.com/). | ![New Azure Portal][1] |
| 2. At the bottom of the page, on the left, click **New**. | ![Initiate New service][2]|
| 3.	Click **SQL database**. <p>**Important**: You need to sign up for the Latest SQL Update before you create a new database with SQL Database Update V12 (preview). </p>| ![Different services to select from][3] |
| 4. A **SQL database** blade opens. In the **Name** field, specify a database name. | ![Name the database][4] |
| 5. In **SQL database** blade, click **SELECT SOURCE**. | ![Select source for your database][5] |
| 6. A **Select Source** blade opens. Select **Blank Database (Latest Update V12)** to create a new database with SQL Database Update V12 (preview) features enabled. |![Select Blank database as a source][6]
| 7. In **SQL database** blade, click **PRICING TIER**. You can select the recommended pricing tier or browse all available pricing tiers. After you make a choice, click **Select**. <p> For more information about pricing tiers, see [Upgrade SQL Database Web/Business Databases to New Service Tiers](http://azure.microsoft.com/en-us/documentation/articles/sql-database-upgrade-new-service-tiers/) and [Azure SQL Database Service Tiers and Performance Levels](http://msdn.microsoft.com/en-us/library/azure/dn741336.aspx). |![Select a pricing tier][7]
| 8. In **SQL database blade**, click **SERVER**. | ![Select a server to create the database on][8]
| 9. A **Server** blade opens that provides two choices: either you can create a new server or use an existing server. If a list of existing server is displayed, it lists the servers that are enabled for latest SQL Database Update V12 (preview). Click **Create a new server**. |![Creates a new server][9]
| 10. A **New Server** blade opens. The notification bar confirms that the server will support the Latest SQL Database Update V12 (preview). Specify a server name, server admin login, and password and then click **OK**.|![Specify new server details][10]
| 11. Specify a new **Resource Group** or select a default **Resource Group**.|![Specify Resource group][11]
| 12. Click **Create**. A new database with SQL Database Update V12 (preview) features is created. |![Creates a new database][12]



<!--Image references-->
[1]: ./media/sql-database-preview-create/firstscreenportal.png
[2]: ./media/sql-database-preview-create/new.png
[3]: ./media/sql-database-preview-create/sqldatabase.png
[4]: ./media/sql-database-preview-create/databasename.png
[5]: ./media/sql-database-preview-create/selectsource.png
[6]: ./media/sql-database-preview-create/blankdatabaseV12.png
[7]: ./media/sql-database-preview-create/pricingtierdetails.png
[8]: ./media/sql-database-preview-create/serveronblade.png
[9]: ./media/sql-database-preview-create/createnewserver.png
[10]: ./media/sql-database-preview-create/newserverdetails.png
[11]: ./media/sql-database-preview-create/resourcegroup.png
[12]: ./media/sql-database-preview-create/create.png
