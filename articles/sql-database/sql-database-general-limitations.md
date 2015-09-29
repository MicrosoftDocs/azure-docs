<properties 
   pageTitle="Azure SQL Database General Limitations and Guidelines"
   description="This page describes some general limtations for Azure SQL Database as well as areas of interoperability and support."
   services="sql-database"
   documentationCenter="na"
   authors="rothja"
   manager="jeffreyg"
   editor="monicar" />
<tags 
   ms.service="sql-database"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="data-management"
   ms.date="09/29/2015"
   ms.author="jroth" />

# Azure SQL Database General Limitations and Guidelines

This topic provides general limitations and guidelines for Azure SQL Database. For a complete understanding of quotas, resource management, and support, please see the [additional resources](#additional-guidelines) at the end of this topic.

## Connectivity

 - Windows Authentication is not supported. See [Managing Databases and Logins in Azure SQL Database](https://msdn.microsoft.com/library/azure/ee336235.aspx). 

 - Microsoft Azure SQL Database supports tabular data stream (TDS) protocol client version 7.3 or later. 

 - Only TCP/IP connections are allowed.

 - The SQL Server 2008 SQL Server browser is not supported because Microsoft Azure SQL Database does not have dynamic ports, only port 1433.

## SQL Server Agent/Jobs

Microsoft Azure SQL Database does not support SQL Server Agent or jobs. You can, however, run SQL Server Agent on your on-premises SQL Server and connect to Microsoft Azure SQL Database.

## Transactions

Azure SQL Database does not support distributed transactions, which are transactions that affect several resources. For more information, see [Distributed Transactions (ADO.NET)](https://msdn.microsoft.com/library/ms254973.aspx). SQL Database may not preserve the uncommitted timestamp values of the current database (DBTS) across failovers.

> [AZURE.NOTE] In certain situations, a transaction can be automatically promoted to a distributed transaction. For more information, see [System.Transactions Integration with SQL Server](https://msdn.microsoft.com/library/ms172070.aspx).

## SQL Server Collation Support

The default database collation used by Microsoft Azure SQL Database is **SQL_LATIN1_GENERAL_CP1_CI_AS**, where **LATIN1_GENERAL** is English (United States), **CP1** is code page 1252, **CI** is case-insensitive, and **AS** is accent-sensitive.

When using an on-premise SQL Server, you can set collations at server, database, column, and expression levels. Microsoft Azure SQL Database does not allow setting the collation at the server level. To use the non-default collation with Microsoft Azure SQL Database, set the collation with the Create Database Collate option, or at the column level or the expression level. SQL Database does not support the Collate option with the Alter Database command. By default, in SQL Database, temporary data will have the same collation as the database. For more information about how to set the collation, see [COLLATE (Transact-SQL)](https://msdn.microsoft.com/library/ms184391.aspx).

## Naming Requirements

Certain user names are not allowed for security reasons. You cannot use the following names:

 - **admin** 
 - **administrator** 
 - **guest** 
 - **root** 
 - **sa** 

Names for all new objects must comply with the SQL Server rules for identifiers. For more information, see [Identifiers]().

Additionally, login and user names cannot contain the \ character (Windows Authentication is not supported).

## Additional Guidelines

 - In addition to the general limitations outlined in this article, SQL Database has specific resource quotas and limitations based on your service tier. To better understand this important concept, please see [Azure SQL Database Resource Limits](sql-database-limits.md).

 - For security related guidelines, see [Azure SQL Database Security Guidelines and Limitations](sql-database-security-guidelines.md).

 - Another related area surrounds the compatibility that Azure SQL Database has with on-premises versions of SQL Server, such as SQL Server 2014. The latest V12 version of Azure SQL Database has made many improvements in this area. For more details, see [What's new in SQL Database V12](sql-database-v12-whats-new.md).

 - For information on driver availability and support for SQL Database, see [Connection Libraries for SQL Database and SQL Server](sql-database-libraries.md).
