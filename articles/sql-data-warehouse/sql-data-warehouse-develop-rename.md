<properties
   pageTitle="Rename in SQL Data Warehouse | Microsoft Azure"
   description="Tips for renaming objects and databases in Azure SQL Data Warehouse for developing solutions."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="twounder"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="10/21/2015"
   ms.author="twounder;JRJ@BigBangData.co.uk;barbkess"/>

# Rename in SQL Data Warehouse
SQL Server supports database renaming via the stored procedure ```sp_renamedb```. SQL Data Warehouse uses DDL syntax to achieve the same goal. The DDL command is ```RENAME DATABASE```.

## Rename database

To rename a database, execute the following command. 

```
RENAME DATABASE AdventureWorks TO Contoso;
```

It is important to remember that you cannot rename an object or a database if other users are connected to it or are using it. You may need to terminate open sessions first. To terminate a session you need to use the [KILL](https://msdn.microsoft.com/library/ms173730.aspx) command. Please be careful when using ```KILL```. Once executed the targeted session will be terminated and any uncommitted work will be rolled back.

> [AZURE.NOTE] Sessions in SQL Data Warehouse are prefixed by 'SID' you will need to include this and the the session number when invoking the KILL command. For example ```KILL 'SID1234'``` would kill session 1234 - assuming you have the right permissions to execute it.

## Killing sessions
In order to rename a database you may need to kill sessions connected to your SQL Data Warehouse. The following query will generate a distinct list of KILL commands to clear the connections (save for the current session).

```
SELECT
    'KILL ''' + session_id + ''''
FROM
    sys.dm_pdw_exec_requests r
WHERE
    r.session_id <> SESSION_ID()
    AND EXISTS
    (
        SELECT
            *
        FROM
            sys.dm_pdw_lock_waits w
        WHERE
            r.session_id = w.session_id
    )
GROUP BY
    session_id;
```

## Switching schemas
If the intent is to change the schema that an object belongs to then that is achieved via `ALTER SCHEMA`:

```
ALTER SCHEMA dbo TRANSFER OBJECT::product.item;
```

## Next steps
For more development tips, see [development overview][].

<!--Image references-->

<!--Article references-->
[development overview]: sql-data-warehouse-overview-develop.md