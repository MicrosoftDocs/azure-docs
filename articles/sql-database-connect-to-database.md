<properties 
	urlDisplayName="How to connect to an Azure SQL database using SSMS" 
	pageTitle="How to connect to an Azure SQL database using SSMS" metaKeywords="" 
	description="Learn how to connect to an Azure SQL database using SSMS." 
	metaCanonical="" 
	services="sql-database" 
	documentationCenter="" 
	title="How to connect to an Azure SQL database using SSMS" 
	authors="sidneyh" solutions="" 
	manager="jhubbard" editor="" />

<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/02/2015" 
	ms.author="sidneyh" />

# How to connect to an Azure SQL database with SSMS

These are the steps to connect to a Microsoft Azure SQL Database using SQL Server Management Studio.

## Prerequisites
* An Azure SQL Database provisioned and running. To create a new SQL Database, see [Getting Started with Microsoft Azure SQL Database](sql-database-get-started.md).
* The administrator name and password for the SQL Database.
* SQL Server Management Studio 2014. To get the tool, see [Download SQL Express](http://www.hanselman.com/blog/DownloadSQLServerExpress.aspx).

## To connect to an instance of SQL Database
1. Log into the [Azure Management portal](https://portal.azure.com).
2. Click the **Browse** button, then click **SQL databases** (b). 

	![Click Browse and SQL Database][1]
3. With **SQL databases** selected (a), click the name of a database on the server you want to connect to (b).

	![Click the name of a database][2]
4. With the name selected (a), click Properties (b). Copy the name of the server (c), and the name of the administrator (d). The administrator name and password are created with the creation of the SQL Database. You must have the password to proceed to the next step. 

	![Click SQL Server, Settings, and Property][3]
5. Open SQL Server Management Studio 2014. 
6. In the Connect to Server dialog, paste the name of the server into the **Server name** box (a). Set the Authentication to **SQL Server Authentication** (b). Paste the name of the server administrator into the **Login** box (c), then type in its password (d). Then click **Options** (e).

	![SSMS login dialog box][4]
7. In the Connection Properties tab, set the **Connect to database** box to **master** (or to any other database you want to connect to).Then click **Connect**.

	![Set to master and click Connect][5]

## Troubleshooting connection problems

In case of problems, see [Troubleshoot connection problems to Azure SQL Database](https://support.microsoft.com/kb/2980233/). For a list of possible problems and answers, see [Troubleshoot Microsoft Azure SQL Database connectivity](https://support2.microsoft.com/common/survey.aspx?scid=sw;en;3844&showpage=1).


## Next Steps
You can use Transact-SQL statements to create or manage databases. See [CREATE DATABASE (Azure SQL Database)](https://msdn.microsoft.com/library/dn268335.aspx) and [Managing Azure SQL Database using SQL Server Management Studio](sql-database-manage-azure-ssms.md). You can also log events to Azure storage. See [Get started with SQL database auditing](sql-database-auditing-get-started.md).

<!--Image references-->

[1]:./media/sql-database-connect-to-database/browse-vms.png
[2]:./media/sql-database-connect-to-database/sql-databases.png
[3]:./media/sql-database-connect-to-database/blades.png
[4]:./media/sql-database-connect-to-database/ssms-connect-to-server.png
[5]:./media/sql-database-connect-to-database/ssms-master.png