---
title: "SQL ledger updatable ledger tables"
description: This article discusses updatable SQL ledger tables in Azure SQL Database
ms.custom: ""
ms.date: "05/25/2021"
ms.service: sql-database
ms.subservice: security
ms.reviewer: vanto
ms.technology: security
ms.topic: conceptual
author: janders
ms.author: janders
---

# SQL ledger updatable ledger tables

Updatable ledger tables are system-versioned tables provide the ability to perform updates and deletes to your SQL tables while providing tamper-evidence capabilities.  When updates or deletes occur, all earlier versions of a row are preserved in a secondary table, known as the history table, that mirrors the schema of the updatable ledger table. When a row is updated, the latest version of the row remains in the ledger table, while its earlier version is inserted into the history table by the system, transparently to the application. 

**NEEDS IMAGE HERE**

Creating an updatable ledger table can be accomplished two ways:

1. Enabling ledger at the database-level, which automatically makes all new tables created in the database updatable ledger tables.
2. When creating a new table on a database where ledger is not enabled at the database-level, by specifying the LEDGER = ON argument in your create table T-SQL statement.

For details on options available when specifying the `LEDGER` argument in your T-SQL statement, see [CREATE TABLE (Transact-SQL)](/sql/t-sql/statements/create-table-transact-sql).

> [!IMPORTANT]
> Enabling ledger, either at the database-level or for specific tables, cannot be disabled later .  This is to ensure an attacker cannot temporarily remove ledger capabilities on a ledger table, make changes, and then re-enable ledger functionality. 

### Updatable ledger table schema

When created, updatable ledger tables will add 4 system-generated, hidden columns to your table.  These columns contain metadata noting which transactions made changes to your updatable ledger tables and the order of operations by which rows were updated by the transaction.  This data is useful for forensics purposes in understanding how data was changed over time.

| Column name | Data type | Description |
| --- | --- | --- |
| ledger_start_transaction_id | bigint | The id of the transaction that created a row version. |
| ledger_end_transaction_id | bigint | The id of the transaction that deleted a row version. |
| ledger_start_sequence_number | bigint | The sequence number of an operation within a transaction that created a row version. |
| ledger_end_sequence_number | bigint | The sequence number of an operation within a transaction that deleted a row version. |

## History table

The history table is is automatically created when an updatable ledger table is created. The history table captures the historical values of rows changed as a result of updates and deletes in the updatable ledger table. As such, the schema of the history table matches that of the updatable ledger table it is associated with. The naming convention for the history table is `<schema>`.`<updatableledgertablename>`.MSSQL_LedgerHistoryFor_`<GUID>`.

## Ledger view

For every updatable ledger table, the system automatically generates a view, called the ledger view, that is a join of the updatable ledger table and its associated history table. The ledger view reports all row modifications that have occurred on the updatable ledger table by joining the historical data in the History table. This enables users, their partners or auditors to analyze all historical operations and detect potential tampering. Each row operation is accompanied by the ID of the transaction that performed it, along with whether the operation was a DELETE or an INSERT, allowing users to retrieve more information about the time the transaction was executed, the identity of the user who executed it and correlate it to other operations performed by this transaction.

As a simple example, if you wanted to track transaction history for a simple banking scenario, the ledger view is incredibly helpful to provide a chronicle of the transactions over time, rather than having to independently view the updatable ledger table and history tables, or constructing your own view to do so.

**NEEDS IMAGE HERE**

The ledger view's schema matches the columns defined in the updatable ledger and history table, but the system-generated columns are different than those of the updatable ledger and history tables.

### Ledger view schema
| Column name | Data type | Description |
| --- | --- | --- |
| ledger_transaction_id | bigint | The id of the transaction that created or deleted a row version. |
| ledger_sequence_number | bigint | The sequence number of a row-level operation within the transaction on the table. |
| ledger_operation_type_id | tinyint | Contains 0 – INSERT or 1 – DELETE.  Inserting a row into the ledger table produces a new row in the ledger view containing 0 (INSERT) in this column.   Deleting a row from the ledger table produces a new row in the ledger view containing 1 (DELETE) in this column.  Updating a row in the ledger table produces two new rows in the ledger view. One row contains 1 (DELETE) and the other row contains 1 (INSERT) in this column. |
| ledger_operation_type_desc | nvarchar(128) | Contains 'INSERT' or 'DELETE'. See above for details. |



## Next steps
 
- [Create and use updatable ledger tables](sql-ledger-how-to-updatable-ledger-tables.md)
- [Create and use append-only updatable ledger tables](sql-ledger-how-to-append-only-ledger-tables.md) 
