<properties
   pageTitle="Transactions in SQL Data Warehouse | Microsoft Azure"
   description="Tips for implementing transactions in Azure SQL Data Warehouse for developing solutions."
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

# Transactions in SQL Data Warehouse

As you would expect SQL Data Warehouse does offer support for all transactional properties. However, to ensure the performance of SQL Data Warehouse is maintained at scale some features are limited when compared to SQL Server. This article hightlights the differences and lists the others. 

## Transaction isolation levels
SQL Data Warehouse implements ACID transactions. However, the Isolation of the transactional support is limited to `READ UNCOMMITTED` and this cannot be changed. You can implement a number of coding methods to prevent dirty reads of data if this is a concern for you. The most popular methods leverage both CTAS and table partition switching (often known as the sliding window pattern) to prevent users from querying data that is still being prepared. Views that pre-filter the data is also a popular approach.  

## Transaction state
SQL Data Warehouse uses the XACT_STATE() function to report a failed transaction using the value -2. This means that the transaction has failed and is marked for rollback only

> [AZURE.NOTE] The use of -2 by the XACT_STATE function to denote a failed transaction represents different behavior to SQL Server. SQL Server uses the value -1 to represent an un-committable transaction. SQL Server can tolerate some errors inside a transaction without it having to be marked as un-committable. For example SELECT 1/0 would cause an error but not force a transaction into an un-committable state. SQL Server also permits reads in the un-committable transaction. However, in SQLDW this is not the case. If an error occurs inside a SQLDW transaction it will automatically enter the -2 state: including SELECT 1/0 errors. It is therefore important to check that your application code to see if it uses  XACT_STATE().

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

In SQL Data Warehouse the code would need to look like this:

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

## Error_Line() function
It is also worth noting that SQL Data Warehouse does not implement or support the ERROR_LINE() function. If you have this in your code you will need to remove it to be compliant with SQL Data Warehouse. Use query labels in your code instead to implement equivalent functionality. Please refer to the [query labels] article for more details on this feature.

## Using THROW and RAISERROR
THROW is the more modern implementation for raising exceptions in SQL Data Warehouse but RAISERROR is also supported. There are a few differences that are worth paying attention to however.

- User defined error messages numbers cannot be in the 100,000 - 150,000 range for THROW
- RAISERROR error messages are fixed at 50,000
- Use of sys.messages is not supported

## Limitiations
SQL Data Warehouse does have a few other restrictions that relate to transactions.

They are as follows:

- No distributed transactions
- No nested transactions permitted
- No save points allowed

## Next steps
For more development tips, see [development overview][].

<!--Image references-->

<!--Article references-->
[development overview]: sql-data-warehouse-overview-develop.md

<!--MSDN references-->

<!--Other Web references-->
