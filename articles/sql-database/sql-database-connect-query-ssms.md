<properties
	pageTitle="Connect to SQL Database - SQL Server Management Studio | Microsoft Azure"
	description="Learn how to connect to SQL Database on Azure by using SQL Server Management Studio (SSMS). Then, run a sample query using Transact-SQL (T-SQL)."
	metaCanonical=""
	keywords="connect to sql database,sql server management studio"
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jeffreyg"
	editor="" />

<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="03/25/2016"
	ms.author="sstein" />

# Connect to SQL Database with SQL Server Management Studio and perform a sample T-SQL query

> [AZURE.SELECTOR]
- [C#](sql-database-connect-query.md)
- [SSMS](sql-database-connect-query-ssms.md)
- [Excel](sql-database-connect-excel.md)

This article shows you how to connect to an Azure SQL database using SQL Server Management Studio (SSMS) and perform a simple query with Transact-SQL (T-SQL) statements.

You'll need a SQL database in Azure first. You can create one quickly with the instructions in [Getting Started with Microsoft Azure SQL Database](sql-database-get-started.md). The examples here are based on the AdventureWorks sample database you create in that article, but the same steps, up until you perform the query, apply to any SQL database.

## Install and start SQL Server Management Studio (SSMS)

When working with SQL Database, you should use the most recent version of SSMS. See [Download SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx) to get it. With the most recent version, SSMS automatically notifies you when the most recent update is available.

## Start SSMS and connect to your SQL database server

1. Type "Microsoft SQL Server Management Studio" in the Windows search box, and then click the desktop app to start SSMS.
2. In the **Connect to Server** dialog box, in the **Server name** box, type the name of the server that hosts your SQL database in the format *&lt;servername>*.**database.windows.net**.
3. Choose **SQL Server Authentication** from the **Authentication** list.
4. Type the **Login** and **Password** you set up when you created the server, and then click **Connect** to connect to SQL Database.

	![SQL Server Management Studio: Connect to SQL Database server](./media/sql-database-connect-query-ssms/1-connect.png)

5. If you haven't already established a connection to Azure, SSMS will ask you for your Azure login information.

### If the connection fails

The most common reason for connection failures are mistakes in the server name (remember, <*servername*> is the name of the logical server, not the database), the user name, or the password, as well as the server not allowing connections for security reasons. If you are connecting for the first time, or the connection fails because of a changed IP configuration, the [latest version of SSMS](https://msdn.microsoft.com/library/mt238290.aspx) asks you for your Azure login and then creates the firewall rule in Azure for you. If you're using an earlier version, the IP address is reported in an error message and you need to add this IP address to the server firewall rule in Azure. Make sure that the firewall settings of the server allow connections from your local computer's IP address and the IP address that the SSMS client uses. Sometimes they're different. For more information, see [How to: Configure Firewall Settings (Azure SQL Database)](sql-database-configure-firewall-settings.md).

## Run sample queries

After you connect to your logical server, you can connect to a database and run a sample query. If you didn't create the database using the AdventureWorks sample in [Get started with Microsoft Azure SQL Database](sql-database-get-started.md), this query won't work. Skip straight to Next Steps to learn more.

1. In **Object Explorer**, navigate to the **AdventureWorks** database.
2. Right-click the database and then select **New Query**.

	![New query. Connect to SQL Database server: SQL Server Management Studio](./media/sql-database-connect-query-ssms/4-run-query.png)

3. In the query window, copy and paste the following code.

		SELECT
		CustomerId
		,Title
		,FirstName
		,LastName
		,CompanyName
		FROM SalesLT.Customer;

4. Click the **Execute** button.  The following screen shot shows a successful query.

	![Sucess. Connect to SQL Database server: SQL Server Management Studio](./media/sql-database-connect-query-ssms/5-success.png)

## Next steps

You can use T-SQL statements to create and manage databases in Azure in much the same way you can with SQL Server. If you're familiar with using T-SQL with SQL Server, see [Azure SQL Database Transact-SQL information)](sql-database-transact-sql-information.md) for a summary of differences.

If you're new to T-SQL, see [Tutorial: Writing Transact-SQL Statements](https://msdn.microsoft.com/library/ms365303.aspx) and the [Transact-SQL Reference (Database Engine)](https://msdn.microsoft.com/library/bb510741.aspx).
