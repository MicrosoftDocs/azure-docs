---
title: Load data from CSV file into Azure SQL Database (bcp) | Microsoft Docs
description: For a small data size, uses bcp to import data into Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: data-movement
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: CarlRabeler
ms.author: carlrab
ms.reviewer:
manager: craigg
ms.date: 04/01/2018
---
# Load data from CSV into Azure SQL Database (flat files)
You can use the bcp command-line utility to import data from a CSV file into Azure SQL Database.

## Before you begin
### Prerequisites
To complete the steps in this article, you need:

* An Azure SQL Database logical server and database
* The bcp command-line utility installed
* The sqlcmd command-line utility installed

You can download the bcp and sqlcmd utilities from the [Microsoft Download Center][Microsoft Download Center].

### Data in ASCII or UTF-16 format
If you are trying this tutorial with your own data, your data needs to use the ASCII or UTF-16 encoding since bcp does not support UTF-8. 

## 1. Create a destination table
Define a table in SQL Database as the destination table. The columns in the table must correspond to the data in each row of your data file.

To create a table, open a command prompt and use sqlcmd.exe to run the following command:

```sql
sqlcmd.exe -S <server name> -d <database name> -U <username> -P <password> -I -Q "
    CREATE TABLE DimDate2
    (
        DateId INT NOT NULL,
        CalendarQuarter TINYINT NOT NULL,
        FiscalQuarter TINYINT NOT NULL
    )
    ;
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

```bcp
bcp <TableName> out C:\Temp\DimDate2_export.txt -S <ServerName> -d <DatabaseName> -U <Username> -P <Password> -q -c -t , 
```

## 3. Load the data
To load the data, open a command prompt and run the following command, replacing the values for Server Name, Database name, Username, and Password with your own information.

```bcp
bcp DimDate2 in C:\Temp\DimDate2.txt -S <ServerName> -d <DatabaseName> -U <Username> -P <password> -q -c -t  ,
```

Use this command to verify the data was loaded properly

```bcp
sqlcmd.exe -S <server name> -d <database name> -U <username> -P <password> -I -Q "SELECT * FROM DimDate2 ORDER BY 1;"
```

The results should look like this:

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

## Next steps
To migrate a SQL Server database, see [SQL Server database migration](sql-database-cloud-migrate.md).

<!--MSDN references-->
[bcp]: https://msdn.microsoft.com/library/ms162802.aspx
[CREATE TABLE syntax]: https://msdn.microsoft.com/library/mt203953.aspx

<!--Other Web references-->
[Microsoft Download Center]: https://www.microsoft.com/download/details.aspx?id=36433
