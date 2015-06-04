## User Defined Functions
SQL Data Warehouse supports scalar user-defined functions. It does not support inline functions and multi-statement functions.


## Views
Views are quite useful in SQL Data Warehouse. You can use them to:

- Enforce performance optimized joins. For example, a view can incorporate a redundant distribution key as part of the joining criteria to minimize data movement.
- Maintain a consistent presentation layer to consumers of data while you use the CREATE TABLE AS SELECT (CTAS) to rename the underlying objects.

### Limitations and Restrictions
In SQL Data Warehouse, views are stored as metadata only. Therefore, some SQL Server options are not available.

Not supported:

- Schema binding option
- Updating base tables through the view
- Views over temporary tables
- EXPAND and NOEXPAND query hints
- Indexed views

## Transactions
SQL Data Warehouse supports transactions, with some exceptions.

### Limitations and restrictions
SQL Data Warehouse has these limitations and restrictions.

| Transaction feature      | Comment |
| :-------------------     | :------ |
| Distributed Transactions | No distributed transactions |
| Nested Transactions      | No nested transactions permitted |
| Save Points              | No save points allowed |
| Isolation Levels         | Only `READ UNCOMMITTED` transactions are allowed |
| Transaction State        | SQLDW uses XACT_STATE() to report a failed transaction using the value -2. This means that the transaction has failed and marked for rollback only |

### SQL Server differences

- SQL Server's XACT_STATE function does not use -2 to denote a failed transaction.
- SQL Server uses the value -1 to represent an un-committable transaction.
- SQL Server can tolerate some errors inside a transaction without it having to be marked as uncommittable, whereas SQL Data Warehouse does not. For example SELECT 1/0 causes an error in SQL Server, but does not force a transaction into an un-committable state. In SQL Data Warehouse, if an error occurs inside a transaction, it will enter teh -2 state.
- SQL Server also permits reads in the un-committable transaction, whereas SQL Data Warehouse does not.
- If an error occurs inside a SQL Data Warehouse transaction, it will enter the -2 state: including SELECT 1/0 errors.

### Example: Adjust your SQL Server code if it uses XACT-STATE()

Check your application to see if it uses the XACT_STATE() function, and use the following example to udpate.

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

> [AZURE.NOTE] In data warehouse environments it is more important to have a higher quality query execution plan  based on accurate data, than it is to save a few milliseconds by re-using an already-compiled plan.

### Limitations and Restrictions

SQL Data Warehouse does not support these:

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

## Object and Database renaming

To rename an object or a database, SQL Data Warehouse uses the RENAME OBJECT and RENAME DATABASE commands, whereas SQL Server uses the stored procedures sp_rename and sp_renamedb.

Changing the name only affects the object you are renaming. There is no propagation of the name change. Any views that use the old name of an object will be invalid until an object with the old name has been created.


### Example: Rename a database and an object
To maintain compatibility with existing, code often has two `RENAME OBJECT` statements together to maintain compatibility with existing views.

```
RENAME DATABASE AdventureWorks TO Contoso;

RENAME OBJECT product.item to item_old;
RENAME OBJECT product.item_new to item;
```

### Example: Rename a schema

To change the schema that an object belongs to use `ALTER SCHEMA`. This example changes the item object from dbo.item to product.item.

```
ALTER SCHEMA dbo TRANSFER OBJECT::product.item;
```

## Except and Intersect
Both of these keywords can be easily replaced using EXISTS as you can see below:

### Intersect
Intersect returns a distinct list of matching values from the two sets of data
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
### Except
Except returns a distinct list of rows that had no match in the second set of data
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
Variables in SQLDW are set using the `DECLARE` statement or the `SET` statement. All of the following are perfectly valid ways to set a variable value:

```
DECLARE @v  int = 0
,       @v1 int = 1
;

SET     @v = (Select max(database_id) from sys.databases);
SET     @v = 1;
SET     @v = @v+1;
SET     @v +=1;
```

> [AZURE.NOTE] It is worth noting that only the `DECLARE` statement permits a user to set more than one variable at a time. You cannot use `SELECT` or `UPDATE` to do this.

```
DECLARE @v  INT = (SELECT TOP 1 c_customer_sk FROM Customer where c_last_name = 'Smith')
,       @v1 INT = (SELECT TOP 1 c_customer_sk FROM Customer where c_last_name = 'Jones')