<properties
	urlDisplayName="How to connect to an Azure SQL database using SSMS"
	pageTitle="How to connect to an Azure SQL database using SSMS | Microsoft Azure"
	metaKeywords=""
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
	ms.topic="get-started-article"
	ms.date="07/15/2015"
	ms.author="sidneyh" />

# Connect with SQL Server Management Studio

Use the following steps to install SQL Server Management Studio (SSMS) and then use SSMS to connect and query your SQL Database.

## Prerequisites
* An SQL Database AdventureWorks sample database as described in [Getting Started with Microsoft Azure SQL Database](sql-database-get-started.md).

## Install and start SQL Server Management Studio (SSMS)
1. Go to the download page for [SQL Server 2014 Express](http://www.microsoft.com/download/details.aspx?id=42299), click **Download**, and choose either the 32-bit version (x86) or the 64-bit version (x64) of the MgmtStudio download.

	![MgtmtStudio32BIT or MgmtStudio64BIT][1]
2.	Follow the prompts as you install SSMS using the default settings.
3.	Once downloaded, search for SQL Server 2014 Management Studio on your PC and then start SSMS.


## Connect to your SQL Database
1. Open SSMS.
2. In the **Connect to Server** dialog box, in the **Server name** box, type the server name in the format *&lt;servername>*.**database.windows.net**.
3. In the **Authentication** list, select **SQL Server Authentication**.
4. Enter the **Login** and **Password** you specified when you created your SQL Database server.

	![Connect to server dialog][2]
5. Click the **Options** button.
6. In the **Connect to database** box, enter **AdventureWorks** and then click **Connect**.

	![Connect to database][3]

### If the connection fails
Make sure that the firewall of the logical server you have created allows connections from your local computer. For more information, see [How to: Configure Firewall Settings (Azure SQL Database)](https://msdn.microsoft.com/library/azure/jj553530.aspx).

## Run sample queries

1. In **Object Explorer**, navigate to the **AdventureWorks** database.
2. Right-click the database and then select **New Query**.

	![New query][4]

3. In the query window, copy and paste the following code.

		SELECT
		CustomerId
		,Title
		,FirstName
		,LastName
		,CompanyName
		FROM SalesLT.Customer;

4. Click the **Execute** button.  The following screen shot shows a successful query.

	![Sucess][5]

## Next steps
You can use Transact-SQL statements to create or manage databases. For more information see [CREATE DATABASE (Azure SQL Database)](https://msdn.microsoft.com/library/dn268335.aspx) and [Managing Azure SQL Database using SQL Server Management Studio](sql-database-manage-azure-ssms.md). You can also log events to Azure storage. See [Get started with SQL database auditing](sql-database-auditing-get-started.md) for more information.

<!--Image references-->

[1]:./media/sql-database-connect-to-database/1-download.png
[2]:./media/sql-database-connect-to-database/2-connect.png
[3]:./media/sql-database-connect-to-database/3-connect-to-database.png
[4]:./media/sql-database-connect-to-database/4-run-query.png
[5]:./media/sql-database-connect-to-database/5-success.png
