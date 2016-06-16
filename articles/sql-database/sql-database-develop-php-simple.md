<properties
	pageTitle="Connect to SQL Database by using PHP on Windows | Microsoft Azure"
	description="Presents a sample PHP program that connects to Azure SQL Database from a Windows client, and provides links to the necessary software components needed by the client."
	services="sql-database"
	documentationCenter=""
	authors="meet-bhagdev"
	manager="jhubbard"
	editor=""/>


<tags
	ms.service="sql-database"
	ms.workload="drivers"
	ms.tgt_pltfrm="na"
	ms.devlang="php"
	ms.topic="article"
	ms.date="06/16/2016"
	ms.author="meetb"/>


# Connect to SQL Database by using PHP on Windows


[AZURE.INCLUDE [sql-database-develop-includes-selector-language-platform-depth](../../includes/sql-database-develop-includes-selector-language-platform-depth.md)] 


This topic illustrates how you can connect to Azure SQL Database from a client application written in PHP that runs on Windows.

## Step 1:  Configure Development Environment

[Configure development environment for PHP development](https://msdn.microsoft.com/library/mt720663.aspx)

## Step 2: Create a SQL database

See the [getting started page](sql-database-get-started.md) to learn how to create a sample database.  It is important you follow the guide to create an **AdventureWorks database template**. The samples shown below only work with the **AdventureWorks schema**.


## Step 3: Get Connection Details

[AZURE.INCLUDE [sql-database-include-connection-string-details-20-portalshots](../../includes/sql-database-include-connection-string-details-20-portalshots.md)]


## Step 4: Run sample code

* [Proof of concept connecting to SQL using PHP](https://msdn.microsoft.com/library/mt720665.aspx)
* [Connect resiliently to SQL with PHP](https://msdn.microsoft.com/library/mt720667.aspx)


## Next steps

* Review the [SQL Database Development Overview](sql-database-develop-overview.md)
* More information on the [Microsoft PHP Driver for SQL Server](https://msdn.microsoft.com/library/dn865013.aspx)
* For more information regarding PHP installation and usage, see [Accessing SQL Server Databases with PHP](http://social.technet.microsoft.com/wiki/contents/articles/1258.accessing-sql-server-databases-from-php.aspx).

## Additional resources 

* [Design Patterns for Multi-tenant SaaS Applications with Azure SQL Database](sql-database-design-patterns-multi-tenancy-saas-applications.md)
* Explore all the [capabilities of SQL Database](https://azure.microsoft.com/services/sql-database/)