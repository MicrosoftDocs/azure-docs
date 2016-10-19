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
   ms.date="07/31/2016"
   ms.author="jrj;barbkess;sonyama"/>

# Transactions in SQL Data Warehouse

As you would expect, SQL Data Warehouse supports transactions as part of the data warehouse workload. However, to ensure the performance of SQL Data Warehouse is maintained at scale some features are limited when compared to SQL Server. This article highlights the differences and lists the others. 

## Transaction isolation levels
SQL Data Warehouse implements ACID transactions. However, the Isolation of the transactional support is limited to `READ UNCOMMITTED` and this cannot be changed. You can implement a number of coding methods to prevent dirty reads of data if this is a concern for you. The most popular methods leverage both CTAS and table partition switching (often known as the sliding window pattern) to prevent users from querying data that is still being prepared. Views that pre-filter the data is also a popular approach.  

## Transaction size
A single data modification transaction is limited in size. The limit today is applied "per distribution". Therefore, the total allocation can be calculated by multiplying the limit by the distribution count. To approximate the maximum number of rows in the transaction divide the distribution cap by the total size of each row. For variable length columns consider taking an average column length rather than using the maximum size.

In the table below the following assumptions have been made:

* An even distribution of data has occurred 
* The average row length is 250 bytes

| [DWU][]	 | Cap per distribution (GiB) | Number of Distributions | MAX transaction size (GiB) | # Rows per distribution | Max Rows per transaction |
| ------ | -------------------------- | ----------------------- | -------------------------- | ----------------------- | ------------------------ |
| DW100	 |  1                         | 60                      |   60                       |   4,000,000             |    240,000,000           |
| DW200	 |  1.5                       | 60                      |   90                       |   6,000,000             |    360,000,000           |
| DW300	 |  2.25                      | 60                      |  135                       |   9,000,000             |    540,000,000           |
| DW400	 |  3                         | 60                      |  180                       |  12,000,000             |    720,000,000           |
| DW500	 |  3.75                      | 60                      |  225                       |  15,000,000             |    900,000,000           |
| DW600	 |  4.5                       | 60                      |  270                       |  18,000,000             |  1,080,000,000           |
| DW1000 |  7.5                       | 60                      |  450                       |  30,000,000             |  1,800,000,000           |
| DW1200 |  9                         | 60                      |  540                       |  36,000,000             |  2,160,000,000           |
| DW1500 | 11.25                      | 60                      |  675                       |  45,000,000             |  2,700,000,000           |
| DW2000 | 15                         | 60                      |  900                       |  60,000,000             |  3,600,000,000           |
| DW3000 | 22.5                       | 60                      |  1,350                     |  90,000,000             |  5,400,000,000           |
| DW6000 | 45                         | 60                      |  2,700                     | 180,000,000             | 10,800,000,000           |

The transaction size limit is applied per transaction or operation. It is not applied across all concurrent transactions. Therefore each transaction is permitted to write this amount of data to the log. 

To optimize and minimize the amount of data written to the log please refer to the [Transactions best practices][] article.

> [AZURE.WARNING] The maximum transaction size can only be achieved for HASH or ROUND_ROBIN distributed tables where the spread of the data is even. If the transaction is writing data in a skewed fashion to the distributions then the limit is likely to be reached prior to the maximum transaction size.
<!--REPLICATED_TABLE-->

## Transaction state
SQL Data Warehouse uses the XACT_STATE() function to report a failed transaction using the value -2. This means that the transaction has failed and is marked for rollback only

> [AZURE.NOTE] The use of -2 by the XACT_STATE function to denote a failed transaction represents different behavior to SQL Server. SQL Server uses the value -1 to represent an un-committable transaction. SQL Server can tolerate some errors inside a transaction without it having to be marked as un-committable. For example `SELECT 1/0` would cause an error but not force a transaction into an un-committable state. SQL Server also permits reads in the un-committable transaction. However, SQL Data Warehouse does not let you do this. If an error occurs inside a SQL Data Warehouse transaction it will automatically enter the -2 state and you will not be able to make any further select statements until the statement has been rolled back. It is therefore important to check that your application code to see if it uses  XACT_STATE() as you may need to make code modifications.

For example, in SQL Server you might see a transaction that looks like this:

```sql
SET NOCOUNT ON;
DECLARE @xact_state smallint = 0;

BEGIN TRAN
    BEGIN TRY
        DECLARE @i INT;
        SET     @i = CONVERT(INT,'ABC');
    END TRY
    BEGIN CATCH
        SET @xact_state = XACT_STATE();

        SELECT  ERROR_NUMBER()    AS ErrNumber
        ,       ERROR_SEVERITY()  AS ErrSeverity
        ,       ERROR_STATE()     AS ErrState
        ,       ERROR_PROCEDURE() AS ErrProcedure
        ,       ERROR_MESSAGE()   AS ErrMessage
        ;
        
        IF @@TRANCOUNT > 0
        BEGIN
            PRINT 'ROLLBACK';
            ROLLBACK TRAN;
        END

    END CATCH;

IF @@TRANCOUNT >0
BEGIN
    PRINT 'COMMIT';
    COMMIT TRAN;
END

SELECT @xact_state AS TransactionState;
```

If you leave your code as it is above then you will get the following error message:

Msg 111233, Level 16, State 1, Line 1
111233;The current transaction has aborted, and any pending changes have been rolled back. Cause: A transaction in a rollback-only state was not explicitly rolled back before a DDL, DML or SELECT statement.

You will also not get the output of the ERROR_* functions.

In SQL Data Warehouse the code needs to be slightly altered:

```sql
SET NOCOUNT ON;
DECLARE @xact_state smallint = 0;

BEGIN TRAN
    BEGIN TRY
        DECLARE @i INT;
        SET     @i = CONVERT(INT,'ABC');
    END TRY
    BEGIN CATCH
        SET @xact_state = XACT_STATE();
        
        IF @@TRANCOUNT > 0
        BEGIN
            PRINT 'ROLLBACK';
            ROLLBACK TRAN;
        END

        SELECT  ERROR_NUMBER()    AS ErrNumber
        ,       ERROR_SEVERITY()  AS ErrSeverity
        ,       ERROR_STATE()     AS ErrState
        ,       ERROR_PROCEDURE() AS ErrProcedure
        ,       ERROR_MESSAGE()   AS ErrMessage
        ;
    END CATCH;

IF @@TRANCOUNT >0
BEGIN
    PRINT 'COMMIT';
    COMMIT TRAN;
END

SELECT @xact_state AS TransactionState;
```

The expected behavior is now observed. The error in the transaction is managed and the ERROR_* functions provide values as expected.

All that has changed is that the `ROLLBACK` of the transaction had to happen before the read of the error information in the `CATCH` block.

## Error_Line() function
It is also worth noting that SQL Data Warehouse does not implement or support the ERROR_LINE() function. If you have this in your code you will need to remove it to be compliant with SQL Data Warehouse. Use query labels in your code instead to implement equivalent functionality. Please refer to the [LABEL][] article for more details on this feature.

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
- No named transactions
- No marked transactions
- No support for DDL such as `CREATE TABLE` inside a user defined transaction

## Next steps
To learn more about optimizing transactions, see [Transactions best practices][].  To learn about other SQL Data Warehouse best practices, see [SQL Data Warehouse best practices][].

<!--Image references-->

<!--Article references-->
[DWU]: ./sql-data-warehouse-overview-what-is.md#data-warehouse-units
[development overview]: ./sql-data-warehouse-overview-develop.md
[Transactions best practices]: ./sql-data-warehouse-develop-best-practices-transactions.md
[SQL Data Warehouse best practices]: ./sql-data-warehouse-best-practices.md
[LABEL]: ./sql-data-warehouse-develop-label.md

<!--MSDN references-->

<!--Other Web references-->
