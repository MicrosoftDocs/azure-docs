<properties
   pageTitle="Writing Transact-SQL code for SQL Data Warehouse | Microsoft Azure"
   description="Descriptions and examples for modifying Transact-SQL code to work with SQL Data Warehouse."
   services="SQL Data Warehouse"
   documentationCenter="NA"
   authors="barbkess"
   manager="jhubbard"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/03/2015"
   ms.author="JRJ@BigBangData.co.uk;barbkess"/>

# Transact-SQL changes
SQL Server and SQL Data Warehouse both use Transact-SQL. However, since SQL Data Warehouse uses a massively parallel processing (MPP) architecture, there are some differences. This article explains the differences to help you successfully migrate your SQL Server code to SQL Data Warehouse.

- Some SQL Server commands are not needed in SQL Data Warehouse. Our MPP technology is designed to handle the low level details for you. For example, you won't need to create filegroups or configure tempdb disks in SQL Data Warehouse.
- Some commands are new to SQL Data Warehouse. To improve performance on the MPP architecture, SQL Data Warehouse has statements such as Create Table as Select (CTAS) improve performance for moving tables.
- Some commands support fewer options. 

This article explains the differences to help you successfully migrate your SQL Server code to SQL Data Warehouse.

## User Defined Functions
SQL Data Warehouse supports scalar user-defined functions. It does not support inline functions and multi-statement functions.


## Views
Views are quite useful in SQL Data Warehouse.

Ways to use views:

- Enforce performance optimized joins. For example, a view can incorporate a redundant distribution key as part of the joining criteria to minimize data movement.
- Maintain a consistent presentation layer to consumers of data while you use the CREATE TABLE AS SELECT (CTAS) to rename the underlying objects.

In SQL Data Warehouse, views are stored as metadata only. Therefore, some SQL Server options are not available.

Not supported:

- Schema binding option
- Updating base tables through the view
- Views over temporary tables
- EXPAND and NOEXPAND query hints
- Indexed views

## Transactions
SQL Data Warehouse supports transactions, with these exceptions.

| Transaction feature      | Comment |
| :-------------------     | :------ |
| Distributed Transactions | No distributed transactions |
| Nested Transactions      | No nested transactions permitted |
| Save Points              | No save points allowed |
| Isolation Levels         | Only `READ UNCOMMITTED` transactions are allowed |
| Transaction State        | SQLDW uses XACT_STATE() to report a failed transaction using the value -2. This means that the transaction has failed and marked for rollback only |

SQL Data Warehouse differences:

- SQL Server's XACT_STATE function does not use -2 to denote a failed transaction.
- SQL Server uses the value -1 to represent an un-committable transaction.
- SQL Server can tolerate some errors inside a transaction without it having to be marked as uncommittable, whereas SQL Data Warehouse does not. For example SELECT 1/0 causes an error in SQL Server, but does not force a transaction into an un-committable state. In SQL Data Warehouse, if an error occurs inside a transaction, it will enter teh -2 state.
- SQL Server also permits reads in the un-committable transaction, whereas SQL Data Warehouse does not.
- If an error occurs inside a SQL Data Warehouse transaction, it will enter the -2 state: including SELECT 1/0 errors.

### Example A. Adjust your SQL Server code if it uses XACT-STATE()

Check your application to see if it uses the XACT_STATE() function, and update it according to the following example.

In SQL Server you might see a code fragment that looks like this:

```
BEGIN TRAN
    BEGIN TRY
        DECLARE @i INT;
        SET     @i = CONVERT(int,'ABC');
    END TRY
    BEGIN CATCH

        DECLARE @xact smallint = XACT_STATE();

        SELECT  ERROR_NUMBER()    AS ErrNumber
        ,       ERROR_SEVERITY()  AS ErrSeverity
        ,       ERROR_STATE()     AS ErrState
        ,       ERROR_PROCEDURE() AS ErrProcedure
        ,       ERROR_MESSAGE()   AS ErrMessage
        ;

        ROLLBACK TRAN;

    END CATCH;
```

Notice that the `SELECT` statement occurs before the `ROLLBACK` statement. Also note that the setting of the `@xact` variable uses DECLARE and not `SELECT`.

In SQL Data Warehouse, the code should look like this:

```
BEGIN TRAN
    BEGIN TRY
        DECLARE @i INT;
        SET     @i = CONVERT(int,'ABC');
    END TRY
    BEGIN CATCH

        ROLLBACK TRAN;

        DECLARE @xact smallint = XACT_STATE();

        SELECT  ERROR_NUMBER()    AS ErrNumber
        ,       ERROR_SEVERITY()  AS ErrSeverity
        ,       ERROR_STATE()     AS ErrState
        ,       ERROR_PROCEDURE() AS ErrProcedure
        ,       ERROR_MESSAGE()   AS ErrMessage
        ;
    END CATCH;

SELECT @xact;
```

Notice that the rollback of the transaction has to happen before the read of the error information in the `CATCH` Block.

## Stored Procedures
SQL Data Warehouse stored procedures are not compiled code like they are in SQL Server. It is simpler to think of them as containers for your Transact-SQL logic.

SQL Data Warehouse stored procedures are parsed, translated and optimized into distributed queries at run time. As a result, the SQL code that is actually executed against the data is optimized according to the runtime parameters of each query.

> [AZURE.NOTE] In data warehouse environments it is more important to have a high quality query plan based on accurate data, than it is to save a few milliseconds by re-using an already-compiled plan.

SQL Data Warehouse does not support:

- Temporary stored procedures
- Numbered stored procedures
- Extended stored procedures
- CLR stored procedures
- Encryption option
- Replication option
- Table valued parameters
- Read only parameters
- Default parameters
- Execution contexts
- Return statements

## Object and database renaming

To rename an object or a database, SQL Data Warehouse uses the RENAME OBJECT and RENAME DATABASE commands, whereas SQL Server uses the stored procedures sp_rename and sp_renamedb.

In SQL Data Warehouse, changing the name only affects the object you are renaming. There is no propagation of the name change. Any views that use the old name of an object will be invalid until an object with the old name has been created.


### Example A. Rename a database and an object
There are often two `RENAME OBJECT` statements together to maintain compatibility with existing views.

```
RENAME DATABASE AdventureWorks TO Contoso;

RENAME OBJECT product.item to item_old;
RENAME OBJECT product.item_new to item;
```

### Example B. Rename a schema

To change an object's schema use `ALTER SCHEMA`. This example changes the item object's schema from the product schema to the dbo schema.

```
ALTER SCHEMA dbo TRANSFER OBJECT::product.item;
```

## Operators
These examples show how to modify some of the operators.

### Example A. Replace INTERSECT with EXISTS
INTERSECT returns a distinct list of matching values from two sets of data.

```
SELECT  [ProductID]
FROM    [SalesLT].[Product]
INTERSECT
SELECT  [ProductID]
FROM    [SalesLT].[SalesOrderDetail]
;
```

Using `EXISTS` this simply becomes:

```
SELECT  [ProductID]
FROM    [SalesLT].[Product] p
WHERE EXISTS
(   SELECT  [ProductID]
    FROM    [SalesLT].[SalesOrderDetail] s
    WHERE   p.[ProductID] = s.[ProductID]
)
GROUP BY [ProductID]
;
```
### Example B. Replace EXCEPT with EXISTS
EXCEPT returns a distinct list of rows that had no match in the second set of data.
```
SELECT  [ProductID]
FROM    [SalesLT].[Product]
EXCEPT
SELECT  [ProductID]
FROM    [SalesLT].[SalesOrderDetail]
;
```
This time we need to use `NOT EXISTS` to achieve the same result:
```
SELECT  [ProductID]
FROM    [SalesLT].[Product] p
WHERE NOT EXISTS
(   SELECT  [ProductID]
    FROM    [SalesLT].[SalesOrderDetail] s
    WHERE   p.[ProductID] = s.[ProductID]
)
GROUP BY [ProductID]
;
```


## Setting Variables
SQL Data Warehouse supports both the `DECLARE` statement and the `SET` statement for declaring variables. The following are valid ways to set a variable value:

```
DECLARE @v  int = 0
,       @v1 int = 1
;

SET     @v = (Select max(database_id) from sys.databases);
SET     @v = 1;
SET     @v = @v+1;
SET     @v +=1;

DECLARE @v  INT = (SELECT TOP 1 c_customer_sk FROM Customer where c_last_name = 'Smith')
,       @v1 INT = (SELECT TOP 1 c_customer_sk FROM Customer where c_last_name = 'Jones')
;
```


> [AZURE.NOTE] The `DECLARE` statement allows you to set more than one variable at a time. You cannot use `SELECT` or `UPDATE` to do this.