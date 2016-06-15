<properties
	pageTitle="Limitations for Stretch Database | Microsoft Azure"
	description="Learn about limitations for Stretch Database."
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
	ms.date="06/14/2016"
	ms.author="douglasl"/>

# Limitations for Stretch Database

Learn about limitations for Stretch\-enabled tables, and about limitations that currently prevent you from enabling Stretch for a table.

##  <a name="Caveats"></a> Limitations for Stretch\-enabled tables

Stretch\-enabled tables have the following limitations.

### Constraints

-   Uniqueness is not enforced for UNIQUE constraints and PRIMARY KEY constraints in the Azure table that contains the migrated data.

### DML operations

-   You can't UPDATE or DELETE rows that have been migrated, or rows that are eligible for migration, in a Stretch\-enabled table or in a view that includes Stretch\-enabled tables.

-   You can't INSERT rows into a Stretch\-enabled table on a linked server.

### Indexes

-   You can't create an index for a view that includes Stretch\-enabled tables.

-   Filters on SQL Server indexes are not propagated to the remote table.

##  <a name="Limitations"></a> Limitations that currently prevent you from enabling Stretch for a table

The following items currently prevent you from enabling Stretch for a table.

### Table properties

-   Tables that have more than 1,023 columns or more than 998 indexes

-   FileTables or tables that contain FILESTREAM data

-   Tables that are replicated, or that are actively using Change Tracking or Change Data Capture

-   Memory\-optimized tables

### Data types

-   text, ntext and image

-   timestamp

-   sql\_variant

-   XML

-   CLR data types including geometry, geography, hierarchyid, and CLR user\-defined types

### Column types

-   COLUMN\_SET

-   Computed columns

### Constraints

-   Default constraints and check constraints

-   Foreign key constraints that reference the table. In a parent\-child relationship \(for example, Order and Order\_Detail\), you can enable Stretch for the child table \(Order\_Detail\) but not for the parent table \(Order\).

### Indexes

-   Full text indexes

-   XML indexes

-   Spatial indexes

-   Indexed views that reference the table

## See also

[Identify databases and tables for Stretch Database by running Stretch Database Advisor](sql-server-stretch-database-identify-databases.md)

[Enable Stretch Database for a database](sql-server-stretch-database-enable-database.md)

[Enable Stretch Database for a table](sql-server-stretch-database-enable-table.md)
