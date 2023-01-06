---
title: Use transactions with dedicated SQL pool in Azure Synapse Analytics
description: Tips for implementing transactions with dedicated SQL pool in Azure Synapse Analytics for developing solutions.
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: sql
ms.date: 04/15/2020
author: KevinConanMSFT
ms.author: kecona
ms.reviewer: wiassaf 
---

# Use transactions with dedicated SQL pool in Azure Synapse Analytics

Tips for implementing transactions with dedicated SQL pool in Azure Synapse Analytics for developing solutions.

## What to expect

As you would expect, dedicated SQL pool supports transactions as part of the data warehouse workload. However, to ensure the performance of dedicated SQL pool is maintained at scale some features are limited when compared to SQL Server. This article highlights the differences and lists the others.

## Transaction isolation levels

Dedicated SQL pool implements ACID transactions. The isolation level of the transactional support is default to READ UNCOMMITTED.  You can change it to READ COMMITTED SNAPSHOT ISOLATION by turning ON the READ_COMMITTED_SNAPSHOT database option for a user database when connected to the master database.  

Once enabled, all transactions in this database are executed under READ COMMITTED SNAPSHOT ISOLATION and setting READ UNCOMMITTED on session level will not be honored. Check [ALTER DATABASE SET options (Transact-SQL)](/sql/t-sql/statements/alter-database-transact-sql-set-options?preserve-view=true&view=azure-sqldw-latest) for details.

## Transaction size
A single data modification transaction is limited in size. The limit is applied per distribution. As such, the total allocation can be calculated by multiplying the limit by the distribution count. 

To approximate the maximum number of rows in the transaction divide the distribution cap by the total size of each row. For variable length columns, consider taking an average column length rather than using the maximum size.

In the table below the following assumptions have been made:

* An even distribution of data has occurred
* The average row length is 250 bytes

## Gen2

| [DWU](resource-consumption-models.md#data-warehouse-units) | Cap per distribution (GB) | Number of Distributions | MAX transaction size (GB) | # Rows per distribution | Max Rows per transaction |
| --- | --- | --- | --- | --- | --- |
| DW100c |1 |60 |60 |4,000,000 |240,000,000 |
| DW200c |1.5 |60 |90 |6,000,000 |360,000,000 |
| DW300c |2.25 |60 |135 |9,000,000 |540,000,000 |
| DW400c |3 |60 |180 |12,000,000 |720,000,000 |
| DW500c |3.75 |60 |225 |15,000,000 |900,000,000 |
| DW1000c |7.5 |60 |450 |30,000,000 |1,800,000,000 |
| DW1500c |11.25 |60 |675 |45,000,000 |2,700,000,000 |
| DW2000c |15 |60 |900 |60,000,000 |3,600,000,000 |
| DW2500c |18.75 |60 |1125 |75,000,000 |4,500,000,000 |
| DW3000c |22.5 |60 |1,350 |90,000,000 |5,400,000,000 |
| DW5000c |37.5 |60 |2,250 |150,000,000 |9,000,000,000 |
| DW6000c |45 |60 |2,700 |180,000,000 |10,800,000,000 |
| DW7500c |56.25 |60 |3,375 |225,000,000 |13,500,000,000 |
| DW10000c |75 |60 |4,500 |300,000,000 |18,000,000,000 |
| DW15000c |112.5 |60 |6,750 |450,000,000 |27,000,000,000 |
| DW30000c |225 |60 |13,500 |900,000,000 |54,000,000,000 |

## Gen1

| [DWU](resource-consumption-models.md#data-warehouse-units) | Cap per distribution (GB) | Number of Distributions | MAX transaction size (GB) | # Rows per distribution | Max Rows per transaction |
| --- | --- | --- | --- | --- | --- |
| DW100 |1 |60 |60 |4,000,000 |240,000,000 |
| DW200 |1.5 |60 |90 |6,000,000 |360,000,000 |
| DW300 |2.25 |60 |135 |9,000,000 |540,000,000 |
| DW400 |3 |60 |180 |12,000,000 |720,000,000 |
| DW500 |3.75 |60 |225 |15,000,000 |900,000,000 |
| DW600 |4.5 |60 |270 |18,000,000 |1,080,000,000 |
| DW1000 |7.5 |60 |450 |30,000,000 |1,800,000,000 |
| DW1200 |9 |60 |540 |36,000,000 |2,160,000,000 |
| DW1500 |11.25 |60 |675 |45,000,000 |2,700,000,000 |
| DW2000 |15 |60 |900 |60,000,000 |3,600,000,000 |
| DW3000 |22.5 |60 |1,350 |90,000,000 |5,400,000,000 |
| DW6000 |45 |60 |2,700 |180,000,000 |10,800,000,000 |

The transaction size limit is applied per transaction or operation. It is not applied across all concurrent transactions. Therefore each transaction is permitted to write this amount of data to the log.

To optimize and minimize the amount of data written to the log, refer to the [Transactions best practices](../sql-data-warehouse/sql-data-warehouse-develop-best-practices-transactions.md?context=/azure/synapse-analytics/context/context) article.

> [!WARNING]
> The maximum transaction size can only be achieved for HASH or ROUND_ROBIN distributed tables where the spread of the data is even. If the transaction is writing data in a skewed fashion to the distributions then the limit is likely to be reached prior to the maximum transaction size.
> <!--REPLICATED_TABLE-->

## Transaction state

Dedicated SQL pool uses the XACT_STATE() function to report a failed transaction using the value -2. This value means the transaction has failed and is marked for rollback only.

> [!NOTE]
> The use of -2 by the XACT_STATE function to denote a failed transaction represents different behavior to SQL Server. SQL Server uses the value -1 to represent an uncommittable transaction. SQL Server can tolerate some errors inside a transaction without it having to be marked as uncommittable. For example `SELECT 1/0` would cause an error but not force a transaction into an uncommittable state. SQL Server also permits reads in the uncommittable transaction. However, dedicated SQL pool does not let you do this. If an error occurs inside a dedicated SQL pool transaction it will automatically enter the -2 state and you will not be able to make any further select statements until the statement has been rolled back. It is therefore important to check that your application code to see if it uses  XACT_STATE() as you may need to make code modifications.

For example, in SQL Server you might see a transaction that looks like the following:

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
            ROLLBACK TRAN;
            PRINT 'ROLLBACK';
        END

    END CATCH;

IF @@TRANCOUNT >0
BEGIN
    PRINT 'COMMIT';
    COMMIT TRAN;
END

SELECT @xact_state AS TransactionState;
```

The preceding code gives the following error message:

Msg 111233, Level 16, State 1, Line 1
111233; The current transaction has aborted, and any pending changes have been rolled back. Cause: A transaction in a rollback-only state wasn't explicitly rolled back before a DDL, DML, or SELECT statement.

You won't get the output of the ERROR_* functions.

In dedicated SQL pool, the code needs to be slightly altered:

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
            ROLLBACK TRAN;
            PRINT 'ROLLBACK';
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

All that has changed is that the ROLLBACK of the transaction had to happen before the read of the error information in the CATCH block.

## Error_Line() function

It is also worth noting that dedicated SQL pool does not implement or support the ERROR_LINE() function. If you have this function in your code, you need to remove it to be compliant with dedicated SQL pool. Use query labels in your code instead to implement equivalent functionality. For more information, see the [LABEL](develop-label.md) article.

## Use of THROW and RAISERROR

THROW is the more modern implementation for raising exceptions in dedicated SQL pool but RAISERROR is also supported. There are a few differences that are worth paying attention to however.

* User-defined error messages numbers can't be in the 100,000 - 150,000 range for THROW
* RAISERROR error messages are fixed at 50,000
* Use of sys.messages is not supported

## Limitations

Dedicated SQL pool does have a few other restrictions that relate to transactions. They are as follows:

* No distributed transactions
* No nested transactions permitted
* No save points allowed
* No named transactions
* No marked transactions
* No support for DDL such as CREATE TABLE inside a user-defined transaction

## Next steps

To learn more about optimizing transactions, see [Transactions best practices](../sql-data-warehouse/sql-data-warehouse-develop-best-practices-transactions.md?context=/azure/synapse-analytics/context/context). Additional best practices guides are also provided for [Dedicated SQL pool](best-practices-dedicated-sql-pool.md) and [serverless SQL pool](best-practices-serverless-sql-pool.md).