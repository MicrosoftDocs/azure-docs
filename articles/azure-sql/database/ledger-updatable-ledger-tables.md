---
title: "Azure SQL Database updatable ledger tables"
description: This article provides information on updatable ledger tables, ledger schema, and ledger views in Azure SQL Database
ms.custom: ""
ms.date: "05/25/2021"
ms.service: sql-database
ms.subservice: security
ms.reviewer: vanto
ms.topic: conceptual
author: JasonMAnderson
ms.author: janders
---

# Azure SQL Database updatable ledger tables

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

> [!NOTE]
> Azure SQL Database ledger is currently in **public preview**.

Updatable ledger tables are system-versioned tables that users can perform updates and deletes on while also providing tamper-evidence capabilities. When updates or deletes occur, all earlier versions of a row are preserved in a secondary table, known as the history table. The history table mirrors the schema of the updatable ledger table. When a row is updated, the latest version of the row remains in the ledger table, while its earlier version is inserted into the history table by the system, transparently to the application. 

:::image type="content" source="media/ledger/ledger-table-architecture.png" alt-text="ledger table architecture":::

## Updatable ledger tables vs. temporal tables

Both updatable ledger tables and [temporal tables](/sql/relational-databases/tables/temporal-tables) are system-versioned tables, for which the Database Engine captures historical row versions in secondary history tables. Either technology provides unique benefits. Updatable ledger tables make both the current and historical data tamper-evident. Temporal tables support querying the data stored at any point in time rather than only the data that is correct at the current moment in time.

You can use both technologies together by creating tables that are both updatable ledger tables and temporal tables. 
Creating an updatable ledger table can be accomplished two ways:

- When creating a new database in the Azure portal by selecting **Enable ledger on all future tables in this database** during ledger configuration, or through specifying the `LEDGER = ON` argument in your [CREATE DATABASE (Transact-SQL)](/sql/t-sql/statements/create-database-transact-sql) statement. This creates a ledger database, ensuring all future tables created in your database are updatable ledger tables by default.
- When creating a new table on a database where ledger isn't enabled at the database-level, by specifying the `LEDGER = ON` argument in your [CREATE TABLE (Transact-SQL)](/sql/t-sql/statements/create-table-transact-sql) statement.

For details on options available when specifying the `LEDGER` argument in your T-SQL statement, see [CREATE TABLE (Transact-SQL)](/sql/t-sql/statements/create-table-transact-sql).

> [!IMPORTANT]
> Once created, a ledger table cannot be converted to a table that is not a ledger table. This is to ensure an attacker cannot temporarily remove ledger capabilities on a ledger table, make changes, and then re-enable ledger functionality. 

### Updatable ledger table schema

An updatable ledger table needs to have the following [GENERATED ALWAYS](/sql/t-sql/statements/create-table-transact-sql#generate-always-columns) columns that contain metadata noting which transactions made changes to the table and the order of operations by which rows were updated by the transaction.  This data is useful for forensics purposes in understanding how data was inserted over time.

> [!NOTE]
> If you do not specify the required `GENERATED ALWAYS` columns of the ledger table and ledger history table in the [CREATE TABLE (Transact-SQL)](/sql/t-sql/statements/create-table-transact-sql?view=azuresqldb-current&preserve-view=true) statement, the system will automatically add the columns, and it will use the below default names. For more information, see our examples of [Creating a updatable ledger table](/sql/t-sql/statements/create-table-transact-sql?view=azuresqldb-current&preserve-view=true#x-creating-a-updatable-ledger-table).

| Default column name | Data type | Description |
| --- | --- | --- |
| ledger_start_transaction_id | bigint | The ID of the transaction that created a row version. |
| ledger_end_transaction_id | bigint | The ID of the transaction that deleted a row version. |
| ledger_start_sequence_number | bigint | The sequence number of an operation within a transaction that created a row version. |
| ledger_end_sequence_number | bigint | The sequence number of an operation within a transaction that deleted a row version. |

## History table

The history table is automatically created when an updatable ledger table is created. The history table captures the historical values of rows changed because of updates and deletes in the updatable ledger table. The schema of the history table mirrors that of the updatable ledger table it's associated with.

When creating an updatable ledger table, you can either specify the name of the schema to contain your history table and the name of the history table, or you have the system generate the name of the history table and add it to the same schema as the ledger table. History tables with system-generated names are called anonymous history tables. The naming convention for an anonymous history table is `<schema>`.`<updatableledgertablename>`.MSSQL_LedgerHistoryFor_`<GUID>`.

## Ledger view

For every updatable ledger table, the system automatically generates a view, called the ledger view. The ledger view is a join of the updatable ledger table and its associated history table. The ledger view reports all row modifications that have occurred on the updatable ledger table by joining the historical data in the history table. This enables users, their partners, or auditors to analyze all historical operations and detect potential tampering. Each row operation is accompanied by the ID of the acting transaction, along with whether the operation was a `DELETE` or an `INSERT`. Users can retrieve more information about the time the transaction was executed, the identity of the user who executed it, and correlate it to other operations performed by this transaction.

For example, if you wanted to track transaction history for a simple banking scenario, the ledger view is incredibly helpful to provide a chronicle of the transactions over time, rather than having to independently view the updatable ledger table and history tables, or constructing your own view to do so.

For an example on using the ledger view, see [Create and use updatable ledger tables](ledger-how-to-updatable-ledger-tables.md).

The ledger view's schema mirrors the columns defined in the updatable ledger and history table, but the [GENERATED ALWAYS](/sql/t-sql/statements/create-table-transact-sql#generate-always-columns) columns are different than those of the updatable ledger and history tables.

### Ledger view schema

> [!NOTE]
> The ledger view column names can be customized when creating the table using the `<ledger_view_option>` parameter with the [CREATE TABLE (Transact-SQL)](/sql/t-sql/statements/create-table-transact-sql?view=azuresqldb-current&preserve-view=true) statement. For more information, see [ledger view options](/sql/t-sql/statements/create-table-transact-sql?view=azuresqldb-current&preserve-view=true#ledger-view-options) and the corresponding examples in [CREATE TABLE (Transact-SQL)](/sql/t-sql/statements/create-table-transact-sql?view=azuresqldb-current&preserve-view=true).

| Default column name | Data type | Description |
| --- | --- | --- |
| ledger_transaction_id | bigint | The ID of the transaction that created or deleted a row version. |
| ledger_sequence_number | bigint | The sequence number of a row-level operation within the transaction on the table. |
| ledger_operation_type_id | tinyint | Contains `0` (**INSERT**) or `1` (**DELETE**). Inserting a row into the ledger table produces a new row in the ledger view containing `0` in this column. Deleting a row from the ledger table produces a new row in the ledger view containing `1` in this column. Updating a row in the ledger table produces two new rows in the ledger view. One row contains `1` (**DELETE**) and the other row contains `1` (**INSERT**) in this column. |
| ledger_operation_type_desc | nvarchar(128) | Contains `INSERT` or `DELETE`. See above for details. |

## Next steps
 
- [Create and use updatable ledger tables](ledger-how-to-updatable-ledger-tables.md)
- [Create and use append-only ledger tables](ledger-how-to-append-only-ledger-tables.md) 
