---
title: Troubleshoot the change data capture resource
titleSuffix: Azure Data Factory
description: Learn how to troubleshoot issues with the change data capture resource in Azure Data Factory. 
author: n0elleli
ms.service: data-factory
ms.subservice:
ms.topic: troubleshooting
ms.date: 01/19/2023
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

## Issue: The debug cluster is not available from a warm pool.

The debug cluster is not available from a warm pool. There will be a wait time in the order of 1+ minutes. 

## Issue: My CDC resource has both source and target linked services that use custom integration runtimes and it won't work. 

In factories with virtual networks, CDC resources will work fine if either the source or target linked service is tied to an auto-resolve integration runtime. If both the source and target linked services use custom integration runtimes, the CDC resource will not work. 

In non-virtual network factories, CDC resources requiring a virtual network will not work. This fix is in progress. 

## Issue: Creating a new linked service pointing to an Azure Key Vault linked service causes an error. 

If you create a new linked service using the CDC fly-out process that points to an Azure Key Vault linked service, the CDC resource will break. This fix is in progress. 

## Next steps
- [Learn more about the change data capture resource](concepts-change-data-capture-resource.md)
- [Set up a change data capture resource](how-to-change-data-capture-resource.md)
