<properties
	pageTitle="Connect to SQL Database - SQL Server Management Studio | Microsoft Azure"
	description="Learn how to connect to SQL Database on Azure by using SQL Server Management Studio (SSMS). Then, run a sample query using Transact-SQL (T-SQL)."
	metaCanonical=""
	keywords="connect to sql database,sql server management studio"
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jhubbard"
	editor="" />

<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="05/09/2016"
	ms.author="sstein;carlrab" />

# Connect to SQL Database with SQL Server Management Studio and execute a sample T-SQL query

> [AZURE.SELECTOR]
- [Visual Studio](sql-database-connect-query.md)
- [SSMS](sql-database-connect-query-ssms.md)
- [Excel](sql-database-connect-excel.md)

This article shows you how to connect to an Azure SQL database using the most recent version of SQL Server Management Studio (SSMS) and perform a simple query with Transact-SQL (T-SQL) statements.

[AZURE.INCLUDE [Sign in](../../includes/azure-getting-started-portal-login.md)]

[AZURE.INCLUDE [SSMS Install](../../includes/sql-server-management-studio-install.md)]

[AZURE.INCLUDE [SSMS Connect](../../includes/sql-database-sql-server-management-studio-connect-server-principal.md)]

For information about firewall rules, see [How to: Configure Firewall Settings (Azure SQL Database)](sql-database-configure-firewall-settings.md).

## Run sample queries

After you connect to your logical server, you can connect to a database and run a sample query. 

1. In **Object Explorer**, navigate to a databbase on the server to which you have permission, such as the **AdventureWorks** sample database.
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

	![Success. Connect to SQL Database server: SQL Server Management Studio](./media/sql-database-connect-query-ssms/5-success.png)

## Next steps

You can use T-SQL statements to create and manage databases in Azure in much the same way you can with SQL Server. If you're familiar with using T-SQL with SQL Server, see [Azure SQL Database Transact-SQL information)](sql-database-transact-sql-information.md) for a summary of differences.

If you're new to T-SQL, see [Tutorial: Writing Transact-SQL Statements](https://msdn.microsoft.com/library/ms365303.aspx) and the [Transact-SQL Reference (Database Engine)](https://msdn.microsoft.com/library/bb510741.aspx).

To get started with creating database users and database user administrators, see [Get Started with Azure SQL Database security](sql-database-get-started-security.md)
