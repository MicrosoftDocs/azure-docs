<properties
   pageTitle="Load data from SQL Server into Azure SQL Data Warehouse (PolyBase) | Microsoft Azure"
   description="Uses bcp to export data from SQL Server to flat files, AZCopy to import data to Azure blob storage, and PolyBase to ingest the data into Azure SQL Data Warehouse."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="lodipalm"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/30/2016"
   ms.author="lodipalm;barbkess;sonyama"/>


# Load data from SQL Server into Azure SQL Data Warehouse (AZCopy)

Use bcp and AZCopy command-line utilities to load data from SQL Server to Azure blob storage. Then use PolyBase or Azure Data Factory to load the data into Azure SQL Data Warehouse. 


## Prerequisites

To step through this tutorial, you need:

- A SQL Data Warehouse database
- The bcp command line utility installed
- The SQLCMD command line utility installed

>[AZURE.NOTE] You can download the bcp and sqlcmd utilities from the [Microsoft Download Center][].

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

>[AZURE.NOTE] See [Table Overview][] or [CREATE TABLE syntax][] for more information about creating a table on SQL Data Warehouse and the  options available in the WITH clause.

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

> [AZURE.NOTE] It is important to remember that bcp.exe does not support the UTF-8 file encoding. Please use ASCII files or UTF-16 encoded files when using bcp.exe.

### Step 3: Connect and import the data
Using bcp, you can connect and import the data using the following command replacing the values as appropriate:

```sql
bcp DimDate2 in C:\Temp\DimDate2.txt -S <Server Name> -d <Database Name> -U <Username> -P <password> -q -c -t  ','
```

You can verify the data was loaded by running the following query using sqlcmd:

```sql
sqlcmd.exe -S <server name> -d <database name> -U <username> -P <password> -I -Q "SELECT * FROM DimDate2 ORDER BY 1;"
```

This should return the following results:

DateId |CalendarQuarter |FiscalQuarter
----------- |--------------- |-------------
20150101 |1 |3
20150201 |1 |3
20150301 |1 |3
20150401 |2 |4
20150501 |2 |4
20150601 |2 |4
20150701 |3 |1
20150801 |3 |1
20150801 |3 |1
20151001 |4 |2
20151101 |4 |2
20151201 |4 |2

### Step 4: Create Statistics on your newly loaded data

Azure SQL Data Warehouse does not yet support auto create or auto update statistics. In order to get the best performance from your queries, it's important that statistics be created on all columns of all tables after the first load or any substantial changes occur in the data. For a detailed explanation of statistics, see the [Statistics][] topic in the Develop group of topics. Below is a quick example of how to create statistics on the tabled loaded in this example

Execute the following CREATE STATISTICS statements from a sqlcmd prompt:

```sql
sqlcmd.exe -S <server name> -d <database name> -U <username> -P <password> -I -Q "
    create statistics [DateId] on [DimDate2] ([DateId]);
    create statistics [CalendarQuarter] on [DimDate2] ([CalendarQuarter]);
    create statistics [FiscalQuarter] on [DimDate2] ([FiscalQuarter]);
"
```

## Export data from SQL Data Warehouse
In this tutorial, you will create a data file from a table in SQL Data Warehouse. We will export the data we created above to a new data file called DimDate2_export.txt.

### Step 1: Export the data

Using the bcp utility, you can connect and export data using the following command replacing the values as appropriate:

```sql
bcp DimDate2 out C:\Temp\DimDate2_export.txt -S <Server Name> -d <Database Name> -U <Username> -P <password> -q -c -t ','
```
You can verify the data was exported correctly by opening the new file. The data in the file should match the text below:

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

>[AZURE.NOTE] Due to the nature of distributed systems, the data order may not be the same across SQL Data Warehouse databases. Another option is to use the **queryout** function of bcp to write a query extract rather than export the entire table.

## Next steps
For an overview of loading, see [Load data into SQL Data Warehouse][].
For more development tips, see [SQL Data Warehouse development overview][].

<!--Image references-->

<!--Article references-->

[Load data into SQL Data Warehouse]: ./sql-data-warehouse-overview-load.md
[SQL Data Warehouse development overview]: ./sql-data-warehouse-overview-develop.md
[Table Overview]: ./sql-data-warehouse-tables-overview.md
[Statistics]: ./sql-data-warehouse-tables-statistics.md

<!--MSDN references-->
[bcp]: https://msdn.microsoft.com/library/ms162802.aspx
[CREATE TABLE syntax]: https://msdn.microsoft.com/library/mt203953.aspx

<!--Other Web references-->
[Microsoft Download Center]: https://www.microsoft.com/download/details.aspx?id=36433
