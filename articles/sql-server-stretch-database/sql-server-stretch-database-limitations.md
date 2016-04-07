<properties
	pageTitle="Surface area limitations and blocking issues for Stretch Database | Microsoft Azure"
	description="Learn about blocking issues that you have to resolve before you can enable Stretch Database."
	services="sql-server-stretch-database"
	documentationCenter=""
	authors="douglaslMS"
	manager=""
	editor=""/>

<tags
	ms.service="sql-server-stretch-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/26/2016"
	ms.author="douglasl"/>

# Surface area limitations and blocking issues for Stretch Database

Learn about blocking issues that you have to resolve before you can enable Stretch Database.

## <a name="Limitations"></a>Blocking issues
In the current preview release of SQL Server 2016, the following items make a table ineligible for Stretch.

**Table properties**
-   More than 1,023 columns

-   More than 998 indexes

-   Tables that contain FILESTREAM data

-   FileTables

-   Replicated tables

-   Tables that are actively using Change Tracking or Change Data Capture

-   Memory\-optimized tables

**Data types and column properties**
-   timestamp

-   sql\_variant

-   XML

-   geometry

-   geography

-   hierarchyid

-   CLR user\-defined types (UDTs)

**Column types**
-   COLUMN\_SET

-   Computed columns

**Constraints**
-   Check constraints

-   Default constraints

-   Foreign key constraints that reference the table

    The table on which you can't enable Stretch Database is the table referenced by a foreign key constraint. In a parent-child relationship (for example, Orders and Order Details), this is the parent table (Orders).

**Indexes**
-   Full text indexes

-   XML indexes

-   Spatial indexes

-   Indexed views that reference the table

## <a name="Caveats"></a>Limitations and caveats for Stretch\-enabled tables
IIn the current preview release of SQL Server 2016, Stretch\-enabled tables have the following limitations or caveats.

-   Uniqueness is not enforced for UNIQUE constraints and PRIMARY KEY constraints on a Stretch\-enabled table.

-   You can't run UPDATE or DELETE operations on a Stretch\-enabled table.

-   You can't INSERT remotely into a Stretch-enabled table on a linked server.

-   You can't use replication with a Stretch-enabled table.

-   You can't create an index for a view that includes Stretch\-enabled tables.

-   You can't update or delete from a view that includes Stretch\-enabled tables. You can, however, insert into a view that includes Stretch\-enabled tables.

-   Filters on indexes are not propagated to the remote table.

## See also

[Identify databases and tables for Stretch Database by running Stretch Database Advisor](sql-server-stretch-database-identify-databases.md)

[Enable Stretch Database for a database](sql-server-stretch-database-enable-database.md)

[Enable Stretch Database for a table](sql-server-stretch-database-enable-table.md)
