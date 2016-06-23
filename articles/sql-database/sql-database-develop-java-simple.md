<properties
	pageTitle="Connect to SQL Database by using Java with JDBC on Windows | Microsoft Azure"
	description="Presents a Java code sample you can use to connect to Azure SQL Database. The sample uses JDBC, and it runs on a Windows client computer."
	services="sql-database"
	documentationCenter=""
	authors="LuisBosquez"
	manager="jhubbard"
	editor="genemi"/>


<tags
	ms.service="sql-database"
	ms.workload="drivers"
	ms.tgt_pltfrm="na"
	ms.devlang="java"
	ms.topic="article"
	ms.date="06/16/2016"
	ms.author="lbosq"/>


# Connect to SQL Database by using Java with JDBC on Windows


[AZURE.INCLUDE [sql-database-develop-includes-selector-language-platform-depth](../../includes/sql-database-develop-includes-selector-language-platform-depth.md)] 


This topic presents a Java code sample that you can use to connect to Azure SQL Database. The Java sample relies on the Java Development Kit (JDK) version 1.8. The sample connects to an Azure SQL Database by using the JDBC driver.

## Step 1:  Configure Development Environment

[Configure development environment for Java development](https://msdn.microsoft.com/library/mt720658.aspx)

## Step 2: Create a SQL database

See the [getting started page](sql-database-get-started.md) to learn how to create a database.  

## Step 3: Get Connection String

[AZURE.INCLUDE [sql-database-include-connection-string-jdbc-20-portalshots](../../includes/sql-database-include-connection-string-jdbc-20-portalshots.md)]

> [AZURE.NOTE] If you are using the JTDS JDBC driver, then you will need to add "ssl=require" to the URL of the connection string and you need to set the following option for the JVM "-Djsse.enableCBCProtection=false". This JVM option disables a fix for a security vulnerability, so make sure you understand what risk is involved before setting this option.

## Step 4: Run sample code

* [Proof of concept connecting to SQL using Java](https://msdn.microsoft.com/library/mt720656.aspx)

## Next steps

* Visit the [Java Developer Center](/develop/java/).
* Review the [SQL Database Development Overview](sql-database-develop-overview.md)
* More information on the [Microsoft JDBC Driver for SQL Server](https://msdn.microsoft.com/library/mt484311.aspx)

## Additional resources 

* [Design Patterns for Multi-tenant SaaS Applications with Azure SQL Database](sql-database-design-patterns-multi-tenancy-saas-applications.md)
* Explore all the [capabilities of SQL Database](https://azure.microsoft.com/services/sql-database/)