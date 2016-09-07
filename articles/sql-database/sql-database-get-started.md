<properties
	pageTitle="SQL Database tutorial: Create a SQL database | Microsoft Azure"
	description="Learn how to set up a SQL Database logical server, server firewall rule, SQL database, and sample data. Also, learn how to connect with client tools, configure users, and set up a database firewall rule."
	keywords="sql database tutorial, create a sql database"
	services="sql-database"
	documentationCenter=""
	authors="CarlRabeler"
	manager="jhubbard"
	editor=""/>


<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="hero-article"
	ms.date="07/05/2016"
	ms.author="carlrab"/>


# SQL Database tutorial: Create a SQL database in minutes by using the Azure portal

**Single database**

> [AZURE.SELECTOR]
- [Azure portal](sql-database-get-started.md)
- [C#](sql-database-get-started-csharp.md)
- [PowerShell](sql-database-get-started-powershell.md)

In this tutorial, you learn how to use the Azure portal to:

- Create an Azure SQL Database logical server in order to host SQL databases.
- Create a SQL database with no data, with sample data, or with data from a SQL database backup.
- Create a server-level firewall rule for a single IP address or for a range of IP addresses.

You can perform these same tasks by using either [C#](sql-database-get-started-csharp.md) or [PowerShell](sql-database-get-started-powershell.md).

[AZURE.INCLUDE [Login](../../includes/azure-getting-started-portal-login.md)]

<a name="create-logical-server-bk"></a>

[AZURE.INCLUDE [Create SQL Database logical server](../../includes/sql-database-create-new-server-portal.md)]

[AZURE.INCLUDE [Create SQL Database database](../../includes/sql-database-create-new-database-portal.md)]

[AZURE.INCLUDE [Create SQL Database database](../../includes/sql-database-create-new-server-firewall-portal.md)]

## Next steps
Now that you've completed this SQL Database tutorial and created a database with some sample data, you're ready to explore by using your favorite tools.

- If you're familiar with Transact-SQL and SQL Server Management Studio (SSMS), learn how to [Connect and query a SQL database with SSMS](sql-database-connect-query-ssms.md).

- If you know Excel, learn how to [Connect to a SQL database in Azure with Excel](sql-database-connect-excel.md).

- If you're ready to start coding, choose your programming language at [Connection libraries for SQL Database and SQL Server](sql-database-libraries.md).

- If you want to move your on-premises SQL Server databases to Azure, see [Migrating a database to SQL Database](sql-database-cloud-migrate.md) to learn more.

- If you want to load some data into a new table from a CSV file by using the BCP command-line tool, see [Loading data into SQL Database from a CSV file using BCP](sql-database-load-from-csv-with-bcp.md).


## Additional resources

[What is SQL Database?](sql-database-technical-overview.md)
