<properties
	pageTitle="Connect to an Azure SQL Database with Excel"
	description="Excel spreadsheet to Azure SQL Database for reporting and data exploration."
	services="sql-database"
	documentationCenter=""
	authors="joseidz"
	manager="joseidz"
	editor="joseidz"/>


<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="07/09/2015"
	ms.author="joseidz"/>


# Connect to an Azure SQL Database with Excel
Connect Excel to an Azure SQL Database and create a report over the data in the database.

## Prerequisites
- An Azure SQL Database provisioned and running. To create a new SQL Database, see [Getting Started with Microsoft Azure SQL Database](sql-database-get-started.md).
- [Microsoft Excel 2013](https://products.office.com/en-US/) (or Microsoft Excel 2010)

## Connect to SQL Database and Create Report
1.	Open Excel.
2.	In the menu bar at the top of the page click **Data**.
3.	Click **From Other Sources**, then **From SQL Server**. The **Data Connection Wizard** opens.

	![Data connection wizard][1]
4.	In the **Server name** box, type the Azure SQL Database server name. Example:

	 	adventureserver.database.windows.net
5.	In the **Log on Credentials** section, select **Use the following User Name and Password** and then type in appropriate credentials for the SQL Database server. Then click **Next**.

	Note: Both [PowerPivot](https://www.microsoft.com/download/details.aspx?id=102) and [Power Query](https://www.microsoft.com/download/details.aspx?id=39379) add-ins for Excel have very similar experiences.

6. In the **Select Database and Table** dialog, select the **AdventureWorks** database from the pull-down menu and select **vGetAllCategories** from the list of tables and views, then click **Next**.

	![Select a database and table][5]
7. In the **Save Data Connection File and Finish** dialog, click **Finish**.
8. In the **Import Data** dialog, select **PivotChart** and click **OK**.

	![Select Import Data][2]
9. In the **PivotChart Fields** dialog, select the following configuration to create a report for the count of products per category.

	![Configuration][3]
10.	Success looks like this:

	![success][4]

## Next steps

If you are a Software as a Service (SaaS) developer, learn about [Elastic Database pools](sql-database-elastic-pool.md). You can easily manage large collections of databases using [Elastic Database jobs](sql-database-elastic-jobs-overview.md).

<!--Image references-->
[1]: ./media/sql-database-connect-excel/connect-to-database-server.png
[2]: ./media/sql-database-connect-excel/import-data.png
[3]: ./media/sql-database-connect-excel/power-pivot.png
[4]: ./media/sql-database-connect-excel/power-pivot-results.png
[5]: ./media/sql-database-connect-excel/select-database-and-table.png
