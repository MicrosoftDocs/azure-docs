<properties
   pageTitle="Azure SQL Database General Limitations and Guidelines"
   description="This page describes some general limitations for Azure SQL Database as well as areas of interoperability and support."
   services="sql-database"
   documentationCenter="na"
   authors="CarlRabeler"
   manager="jhubbard"
   editor="monicar" />
<tags
   ms.service="sql-database"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="data-management"
   ms.date="06/21/2016"
   ms.author="carlrab" />

# Azure SQL Database General Limitations and Guidelines

This topic provides general limitations and guidelines for Azure SQL Database. For a complete understanding of quotas, resource management, and support, please see the [additional resources](#additional-guidelines) at the end of this topic.

## Connectivity and authentication

  - Windows Authentication is not supported. See [Managing Databases and Logins in Azure SQL Database](sql-database-manage-logins.md). However, Azure Active Directory Authentication is supported with certain limitations. See [Connect to SQL Database with Azure Active Directory Authentication](sql-database-aad-authentication.md).

  - Microsoft Azure SQL Database supports tabular data stream (TDS) protocol client version 7.3 or later.

  - Only TCP/IP connections are allowed.

  - The SQL Server 2008 SQL Server browser is not supported because Microsoft Azure SQL Database does not have dynamic ports, only port 1433.

## SQL Server Agent/Jobs

Microsoft Azure SQL Database does not support SQL Server Agent or jobs. You can, however, run SQL Server Agent on your on-premises SQL Server and connect to Microsoft Azure SQL Database.

## SQL Server Collation Support

The default database collation used by Microsoft Azure SQL Database is **SQL_LATIN1_GENERAL_CP1_CI_AS**, where **LATIN1_GENERAL** is English (United States), **CP1** is code page 1252, **CI** is case-insensitive, and **AS** is accent-sensitive. It is not possible to alter the collation for V12 databases. For more information about how to set the collation, see [COLLATE (Transact-SQL)](https://msdn.microsoft.com/library/ms184391.aspx).

## Naming Requirements

Certain user names are not allowed for security reasons. You cannot use the following names:

 - **admin**
 - **administrator**
 - **guest**
 - **root**
 - **sa**

Names for all new objects must comply with the SQL Server rules for identifiers. For more information, see [Identifiers](https://msdn.microsoft.com/library/ms175874.aspx).

Additionally, login and user names cannot contain the \ character (Windows Authentication is not supported).

## Additional Guidelines

- In addition to the general limitations outlined in this article, SQL Database has specific resource quotas and limitations based on your **service tier**. For an overview of service tiers, see [SQL Database service tiers](sql-database-service-tiers.md).

- For other SQL Database limits, see [Azure SQL Database Resource Limits](sql-database-resource-limits.md).

- For security related guidelines, see [Azure SQL Database Security Guidelines and Limitations](sql-database-security-guidelines.md).

- Another related area surrounds the compatibility that Azure SQL Database has with on-premises versions of SQL Server, such as SQL Server 2014 and SQL Server 2016. The latest V12 version of Azure SQL Database has made many improvements in this area. For more details, see [What's new in SQL Database V12](sql-database-v12-whats-new.md).

- For information on driver availability and support for SQL Database, see [Connection Libraries for SQL Database and SQL Server](sql-database-libraries.md).
