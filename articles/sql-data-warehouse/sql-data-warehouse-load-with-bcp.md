<properties
   pageTitle="Use bcp to load data into SQL Data Warehouse | Microsoft Azure"
   description="Learn what bcp is and how to use it for data warehousing scenarios."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="TwoUnder"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="03/23/2016"
   ms.author="mausher;barbkess;sonyama"/>


# Load data with bcp

> [AZURE.SELECTOR]
- [Data Factory](sql-data-warehouse-get-started-load-with-azure-data-factory.md)
- [PolyBase](sql-data-warehouse-get-started-load-with-polybase.md)
- [BCP](sql-data-warehouse-load-with-bcp.md)


**[bcp][]** is a command-line bulk load utility that allows you to copy data between SQL Server, data files, and SQL Data Warehouse. Use bcp to import large numbers of rows into SQL Data Warehouse tables or to export data from SQL Server tables into data files. Except when used with the queryout option, bcp requires no knowledge of Transact-SQL.

bcp is a quick and easy way to move smaller data sets into and out of a SQL Data Warehouse database. The exact amount of data that is recommended to load/extract via bcp will depend on you network connection to the Azure data center.  Generally, dimension tables can be loaded and extracted but fairly large fact tables may take a significant amount of time to load or extract from.

With bcp you can:

- Use a simple command-line utility to load data into SQL Data Warehouse.
- Use a simple command-line utility to extract data from SQL Data Warehouse.

This tutorial will show you how to:

- Import data into a table using the bcp in command
- Export data from a table uisng the bcp out command

>[AZURE.VIDEO loading-data-into-azure-sql-data-warehouse-with-bcp]

## Prerequisites

To step through this tutorial, you need:

- A SQL Data Warehouse database
- The bcp command line utility installed
- The SQLCMD command ine utility installed

>[AZURE.NOTE] You can download the bcp and sqlcmd utilities from the [Microsoft Download Center][].

## Import data into SQL Data Warehouse

In this tutorial, you will create a table in Azure SQL Data Warehouse and import data into the table.

### Step 1: Create a table in Azure SQL Data Warehouse

From a command prompt, connect to your instance using the following command replacing the values as appropriate:

```sql
sqlcmd.exe -S <server name> -d <database name> -U <username> -P <password> -I
```
Once connected, copy the following table script at the sqlcmd prompt and then press the Enter key:

```sql
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
GO
```
>[AZURE.NOTE] See [Table Design][] topic in the Develop group of topics for more information on the options available in the WITH clause.

### Step 2: Create a source data file

Open Notepad and copy the following lines of data into a new file.

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

Save this to your local temp directory, C:\Temp\DimDate2.txt.

> [AZURE.NOTE] It is important to remember that bcp.exe does not support the UTF-8 file encoding. Please use ASCII encoded files or UTF-16 encoding for your files when using bcp.exe.

### Step 3: Connect and import the data
Using bcp, you can connect and import the data using the following command replacing the values as appropriate:

```sql
bcp DimDate2 in C:\Temp\DimDate2.txt -S <Server Name> -d <Database Name> -U <Username> -P <password> -q -c -t  ','
```

You can verify the data was loaded by connecting with sqlcmd as before and executing the following TSQL command:

```sql
SELECT * FROM DimDate2 ORDER BY 1;
GO
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
create statistics [DateId] on [DimDate2] ([DateId]);
create statistics [CalendarQuarter] on [DimDate2] ([CalendarQuarter]);
create statistics [FiscalQuarter] on [DimDate2] ([FiscalQuarter]);
GO
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

>[AZURE.NOTE] Due to the nature of distributed systems, the data order may not be the same across SQL Data Warehouse databases. You could optionally use the queryout parameter to specify which Transact-SQL query to run.

## Next steps
For an overview of loading, see [Load data into SQL Data Warehouse][].
For more development tips, see [SQL Data Warehouse development overview][].

<!--Image references-->

<!--Article references-->

[Load data into SQL Data Warehouse]: ./sql-data-warehouse-overview-load.md
[SQL Data Warehouse development overview]: ./sql-data-warehouse-overview-develop.md
[Table Design]: ./sql-data-warehouse-develop-table-design.md
[Statistics]: ./sql-data-warehouse-develop-statistics.md


<!--MSDN references-->
[bcp]: https://msdn.microsoft.com/library/ms162802.aspx


<!--Other Web references-->
[Microsoft Download Center]: http://www.microsoft.com/download/details.aspx?id=36433
