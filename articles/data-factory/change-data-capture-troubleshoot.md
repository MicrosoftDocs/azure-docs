---
title: Troubleshoot the change data capture resource
titleSuffix: Azure Data Factory
description: Learn how to troubleshoot issues with the change data capture resource in Azure Data Factory. 
author: n0elleli
ms.service: data-factory
ms.subservice:
ms.topic: troubleshooting
ms.date: 04/06/2023
ms.author: noelleli
ms.custom:
---

# Troubleshoot the Change data capture resource in Azure Data Factory
[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This article provides suggestions on how to troubleshoot common problems with the change data capture resource in Azure Data Factory.

## Issue: Trouble enabling native CDC in my SQL source. 

For sources in SQL, two sets of tables are available: tables with native SQL CDC enabled and tables with time-based incremental columns. 

Follow these steps to configure native CDC for a specific source table in your SQL database.

Consider you have following table, with ID as the Primary Key. If a Primary Key is present in the schema, supports_net_changes is set to true by default. If not, configure it using the script in Query 3.  

**Query 1**
```sql

CREATE TABLE Persons (
	ID int,
	LastName varchar(255) NOT NULL,
	FirstName varchar(255),
	Age int,
	Last_login DATETIME,
    	PRIMARY KEY (ID));

```

 > [!NOTE]
 > Currently the ADF CDC resource only loads net changes for insert, update and delete operations.

To enable CDC at the database level, execute the following query: 

**Query 2**

```sql
EXEC sys.sp_cdc_enable_db
```
To enable CDC at the table level, execute the following query: 

**Query 3**

```sql
EXEC sys.sp_cdc_enable_table  
	@source_schema = N'dbo'  
	, @source_name = N'Persons'  
	, @role_name = N'cdc_admin'  
	, @supports_net_changes = 1
        , @captured_column_list = N'ID';
```
    
## Issue: Tables are unavailable to select in the CDC resource configuration process. 
  
If your SQL source doesn't have SQL Server CDC with net_changed enabled or doesn't have any time-based incremental columns, then the tables in your source will be unavailable for selection. 

## Issue: The debug cluster isn't available from a warm pool.

The debug cluster isn't available from a warm pool. There will be a wait time in the order of 1+ minutes. 
 
## Issue: Trouble in tracking delete operations.

Currently CDC resource supports delete operations for following sink types - Azure SQL Database & Delta. To achieve this in the column mapping page, select **keys** column that can be used to determine if a row from the source matches a row from the sink. 

## Issue: My CDC resource fails when target SQL table has identity columns.

Getting following error on running a CDC when your target sink table has identity columns,

*_Can't insert explicit value for identity column in table 'TableName' when IDENTITY_INSERT is set to OFF._*
 
Run the following query to determine if you have an identity column in your SQL based target. 

**Query 4**

```sql
SELECT * 
FROM sys.identity_columns 
WHERE OBJECT_NAME(object_id) = 'TableName'
```

To resolve this user can follow either of these steps:


1.  Set IDENTITY_INSERT to ON by running following query at database level and rerun the CDC Mapper
    
**Query 5**

```sql
SET IDENTITY_INSERT dbo.TableName ON; 
```

(Or)

2.  User can remove the specific identity column from mapping while performing inserts.

## Issue: Trouble using Self-hosted integration runtime.

Currently, Self-hosted integration runtime isn't supported in the CDC resource. If trying to connect to an on-premise source, use Azure integration runtime with managed virtual network. 


## Next steps
- [Learn more about the change data capture resource](concepts-change-data-capture-resource.md)
- [Set up a change data capture resource](how-to-change-data-capture-resource.md)
