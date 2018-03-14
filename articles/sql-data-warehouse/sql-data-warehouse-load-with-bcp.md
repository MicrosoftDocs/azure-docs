---
title: Use bcp to load data into SQL Data Warehouse | Microsoft Docs
description: Learn what bcp is and how to use it for data warehousing scenarios.
services: sql-data-warehouse
documentationcenter: NA
author: ckarst
manager: barbkess
editor: ''

ms.assetid: f9467d11-fcd6-4131-a65a-2022d2c32d24
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: get-started-article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: loading
ms.date: 01/22/2018
ms.author: cakarst;barbkess


---
# Load data with bcp

**[bcp](/sql/tools/bcp-utility.md)** is a command-line bulk load utility that allows you to copy data between SQL Server, data files, and SQL Data Warehouse. Use bcp to import large numbers of rows into SQL Data Warehouse tables or to export data from SQL Server tables into data files. Except when used with the queryout option, bcp requires no knowledge of Transact-SQL.

bcp is a quick and easy way to move smaller data sets into and out of a SQL Data Warehouse database. The exact amount of data that is recommended to load/extract via bcp depends on the network connection to Azure.  Small dimension tables can be loaded and extracted readily with bcp. However, Polybase, not bcp, is the recommended tool for loading and extracting large volumes of data. PolyBase is designed for the massively parallel processing architecture of SQL Data Warehouse.

With bcp you can:

* Use a command-line utility to load data into SQL Data Warehouse.
* Use a command-line utility to extract data from SQL Data Warehouse.

This tutorial:

* Imports data into a table using the bcp in command
* Exports data from a table using the bcp out command

> [!VIDEO https://channel9.msdn.com/Blogs/Azure/Loading-data-into-Azure-SQL-Data-Warehouse-with-BCP/player]
> 
> 

## Prerequisites
To step through this tutorial, you need:

* A SQL Data Warehouse database
* bcp and sqlcmd command-line utilities. You can download these from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=36433). 

### Data in ASCII or UTF-16 format
If you are trying this tutorial with your own data, your data needs to use the ASCII or UTF-16 encoding since bcp does not support UTF-8. 

PolyBase supports UTF-8 but doesn't yet support UTF-16. To use bcp for data export and then PolyBase for data loading, you need to transform the data to UTF-8 after it is exported from SQL Server. 

## Import data into SQL Data Warehouse
In this tutorial, you will create a table in Azure SQL Data Warehouse and import data into the table.

### Step 1: Create a table in Azure SQL Data Warehouse
From a command prompt, use sqlcmd to run the following query to create a table on your instance:

```sql
sqlcmd.exe -S <server name> -d <database name> -U <username> -P <password> -I -Q "
    CREATE TABLE DimDate2
    (
        DateId INT NOT NULL,
        CalendarQuarter TINYINT NOT NULL,
        FiscalQuarter TINYINT NOT NULL
    )
    WITH
    (
        CLUSTERED COLUMNSTORE INDEX,
        DISTRIBUTION = ROUND_ROBIN
    );
"
```

For more information about creating a table, see [Table Overview](sql-data-warehouse-tables-overview.md) or the [CREATE TABLE](/sql/t-sql/statements/create-table-azure-sql-data-warehouse.md) syntax.
 

### Step 2: Create a source data file
Open Notepad and copy the following lines of data into a new text file and then save this file to your local temp directory, C:\Temp\DimDate2.txt.

```
20150301,1,3
20150501,2,4
20151001,4,2
20150201,1,3
20151201,4,2
20150801,3,1
20150601,2,4
20151101,4,2
20150401,2,4
20150701,3,1
20150901,3,1
20150101,1,3
```

> [!NOTE]
> It is important to remember that bcp.exe does not support the UTF-8 file encoding. Use ASCII files or UTF-16 encoded files when using bcp.exe.
> 
> 

### Step 3: Connect and import the data
Using bcp, you can connect and import the data using the following command replacing the values as appropriate:

```sql
bcp DimDate2 in C:\Temp\DimDate2.txt -S <Server Name> -d <Database Name> -U <Username> -P <password> -q -c -t  ','
```

You can verify the data was loaded by running the following query using sqlcmd:

```sql
sqlcmd.exe -S <server name> -d <database name> -U <username> -P <password> -I -Q "SELECT * FROM DimDate2 ORDER BY 1;"
```

The query should return the following results:

| DateId | CalendarQuarter | FiscalQuarter |
| --- | --- | --- |
| 20150101 |1 |3 |
| 20150201 |1 |3 |
| 20150301 |1 |3 |
| 20150401 |2 |4 |
| 20150501 |2 |4 |
| 20150601 |2 |4 |
| 20150701 |3 |1 |
| 20150801 |3 |1 |
| 20150801 |3 |1 |
| 20151001 |4 |2 |
| 20151101 |4 |2 |
| 20151201 |4 |2 |

### Step 4: Create Statistics on your newly loaded data
After loading data, a final step is to create or update statistics. This helps to improve query performance. For more information, see [Statistics](sql-data-warehouse-tables-statistics.md). The following sqlcmd example creates statistics on the table that contains the newly loaded data.


```sql
sqlcmd.exe -S <server name> -d <database name> -U <username> -P <password> -I -Q "
    create statistics [DateId] on [DimDate2] ([DateId]);
    create statistics [CalendarQuarter] on [DimDate2] ([CalendarQuarter]);
    create statistics [FiscalQuarter] on [DimDate2] ([FiscalQuarter]);
"
```

## Export data from SQL Data Warehouse
This tutorial creates a data file from a table in SQL Data Warehouse. It exports the data you imported in the previous section. The results go to a file called DimDate2_export.txt.

### Step 1: Export the data
Using the bcp utility, you can connect and export data using the following command replacing the values as appropriate:

```sql
bcp DimDate2 out C:\Temp\DimDate2_export.txt -S <Server Name> -d <Database Name> -U <Username> -P <password> -q -c -t ','
```
You can verify the data was exported correctly by opening the new file. The data in the file should match the following text:

```
20150301,1,3
20150501,2,4
20151001,4,2
20150201,1,3
20151201,4,2
20150801,3,1
20150601,2,4
20151101,4,2
20150401,2,4
20150701,3,1
20150901,3,1
20150101,1,3
```

> [!NOTE]
> Due to the nature of distributed systems, the data order may not be the same across SQL Data Warehouse databases. Another option is to use the **queryout** function of bcp to write a query extract rather than export the entire table.
> 
> 

## Next steps
To design your loading process, see the [Loading overview](sql-data-warehouse-design-elt-data-loading).  



<!--MSDN references-->



<!--Other Web references-->
[Microsoft Download Center]: https://www.microsoft.com/download/details.aspx?id=36433
