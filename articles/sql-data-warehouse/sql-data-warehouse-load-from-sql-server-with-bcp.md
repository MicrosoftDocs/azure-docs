<properties
   pageTitle="Load data from SQL Server into Azure SQL Data Warehouse (bcp) | Microsoft Azure"
   description="For a small data size, uses bcp to export data from SQL Server to flat files and import the data directly into Azure SQL Data Warehouse."
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


# Load data from SQL Server into Azure SQL Data Warehouse (flat files)

> [AZURE.SELECTOR]
- [SSIS](sql-data-warehouse-load-from-sql-server-with-integration-services.md)
- [PolyBase](sql-data-warehouse-load-from-sql-server-with-polybase.md)
- [bcp](sql-data-warehouse-load-from-sql-server-with-bcp.md)

For small data sets, you can use the bcp command-line utility to export data from SQL Server and then load it directly to Azure SQL Data Warehouse.

In this tutorial, you will use bcp to:

- Export a table from from SQL Server by using the bcp out command (or create a simple sample file)
- Import the table from a flat file to SQL Data Warehouse.
- Create statistics on the loaded data.

>[AZURE.VIDEO loading-data-into-azure-sql-data-warehouse-with-bcp]

## Before you begin

### Prerequisites

To step through this tutorial, you need:

- A SQL Data Warehouse database
- The bcp command-line utility installed
- The sqlcmd command-line utility installed

You can download the bcp and sqlcmd utilities from the [Microsoft Download Center][].

### Data in ASCII or UTF-16 format

If you are trying this tutorial with your own data, your data needs to use the ASCII or UTF-16 encoding since bcp does not support UTF-8. 

PolyBase supports UTF-8 but doesn't yet support UTF-16. Note that if you want to combine bcp with PolyBase you will need to transform the data to UTF-8 after it is exported from SQL Server. 


## 1. Create a destination table

Define a table in SQL Data Warehouse that will be the destination table for the load. The columns in the table must correspond to the data in each row of your data file.

To create a table, open a command prompt and use sqlcmd.exe to run the following command:


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


## 2. Create a source data file

Open Notepad and copy the following lines of data into a new text file and then save this file to your local temp directory, C:\Temp\DimDate2.txt. This data is in ASCII format.

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

(Optional) To export your own data from a SQL Server database, open a command prompt and run the following command. Replace TableName, ServerName, DatabaseName, Username, and Password with your own information.

```sql
bcp <TableName> out C:\Temp\DimDate2_export.txt -S <ServerName> -d <DatabaseName> -U <Username> -P <Password> -q -c -t ','
```



## 3. Load the data
To load the data, open a command prompt and run the following command, replacing the values for Server Name, Database name, Username, and Password with your own information.

```sql
bcp DimDate2 in C:\Temp\DimDate2.txt -S <ServerName> -d <DatabaseName> -U <Username> -P <password> -q -c -t  ','
```

Use this command to verify the data was loaded properly

```sql
sqlcmd.exe -S <server name> -d <database name> -U <username> -P <password> -I -Q "SELECT * FROM DimDate2 ORDER BY 1;"
```

The results should look like this:

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

## 4. Create statistics

SQL Data Warehouse does not yet support auto-create or auto-update statistics. To get the best query performance, it's important to create statistics on all columns of all tables after the first load or after any substantial changes occur in the data. For a detailed explanation of statistics, see [Statistics][]. 

Run the following command to create statistics on your newly loaded table.

```sql
sqlcmd.exe -S <server name> -d <database name> -U <username> -P <password> -I -Q "
    create statistics [DateId] on [DimDate2] ([DateId]);
    create statistics [CalendarQuarter] on [DimDate2] ([CalendarQuarter]);
    create statistics [FiscalQuarter] on [DimDate2] ([FiscalQuarter]);
"
```

## 5. Export data from SQL Data Warehouse
For fun, you can export the data that you just loaded back out of SQL Data Warehouse.  The command to export is exactly the same as exporting from SQL Server.

However, there is a difference in the results. Since the data is stored in distributed locations within SQL Data Warehouse, when you export data each Compute node writes it data to the output file. The order of the data in the output file is likely to be different than the order of the data in the input file.

### Export a table and compare exported results

To see the exported data, open a command prompt and run this command using your own parameters. ServerName is the name of your Azure logical SQL Server.

```sql
bcp DimDate2 out C:\Temp\DimDate2_export.txt -S <Server Name> -d <Database Name> -U <Username> -P <password> -q -c -t ','
```
You can verify the data was exported correctly by opening the new file. The data in the file should match the text below, but will likely be sorted in a different order:

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

### Export the results of a query

You can use the **queryout** function of bcp to export the results of a query instead of exporting the entire table. 

## Next steps
For an overview of loading, see [Load data into SQL Data Warehouse][].
For more development tips, see [SQL Data Warehouse development overview][].
See [Table Overview][] or [CREATE TABLE syntax][] for more information about creating a table on SQL Data Warehouse.

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
