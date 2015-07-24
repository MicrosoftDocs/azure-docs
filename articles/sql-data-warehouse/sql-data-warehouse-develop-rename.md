<properties
   pageTitle="Rename in SQL Data Warehouse | Microsoft Azure"
   description="Tips for renaming objects and databases in Azure SQL Data Warehouse for developing solutions."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="jrowlandjones"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/26/2015"
   ms.author="JRJ@BigBangData.co.uk;barbkess"/>

# Rename in SQL Data Warehouse
SQL Server supports object and database renaming via the stored procedure sp_rename and sp_renamedb respectively.

SQL Data Warehouse uses DDL syntax to achieve the same goal. The DDL commands are RENAME OBJECT and RENAME DATABASE.

## Rename object

It is important to understand that the name only affects the object being renamed - there is no propagation of the name change. Consequently any views using the old name of an object will be invalid until an object with the old name has been created. Consequently you will often see `RENAME OBJECT` appearing in pairs.

```
RENAME OBJECT product.item to item_old;
RENAME OBJECT product.item_new to item;
```

## Rename database

Database renaming is very similar to that of object. 

```
RENAME DATABASE AdventureWorks TO Contoso;
```

It is important to remember that you cannot rename an object or a database if other users are connected to it or are using it. You may need to terminate open sessions first. To terminate a session you need to use the [KILL][] command. Please be careful when using KILL. Once executed the targeted session will be terminated and any uncommitted work will be rolled back.

> [AZURE.NOTE] Sessions in SQL Data Warehouse are prefixed by 'SID' you will need to include this and the the session number when invoking the KILL command. For example KILL 'SID1234' would kill session 1234 - assuming you have the right permissions to execute it.

## Killing sessions
In order to rename a database you may need to kill sessions connected to your SQL Data Warehouse. The following query will generate a distinct list of KILL commands to clear the connections (save for the current session).

```
SELECT 'KILL '''+session_id+''''
FROM	sys.dm_pdw_exec_requests r
WHERE r.session_id <> SESSION_ID()
AND EXISTS
(	SELECT 	*
	FROM 	sys.dm_pdw_lock_waits w
	WHERE 	r.session_id = w.session_id
)
GROUP BY session_id
;
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

<!--MSDN references-->
[KILL]: https://msdn.microsoft.com/en-us/library/ms173730.aspx

<!--Other Web references-->
[Azure management portal]: http://portal.azure.com/


