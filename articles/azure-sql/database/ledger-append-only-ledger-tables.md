---
title: "Azure SQL Database append-only ledger tables"
description: This article provides information on append-only ledger table schema and views in Azure SQL Database
ms.custom: ""
ms.date: "05/25/2021"
ms.service: sql-database
ms.subservice: security
ms.reviewer: vanto
ms.topic: conceptual
author: JasonMAnderson
ms.author: janders
---

# Azure SQL Database append-only ledger tables

Append-only ledger tables allow only `INSERT` operations on your tables, ensuring that privileged users such as Database Administrators (DBAs) can't alter data through traditional [Data Manipulation Language (DML)](/sql/t-sql/queries/queries) operations. Append-only ledger tables are ideal for systems that don't update or delete records, such as Security Information Event and Management (SIEM) systems, or blockchain systems where data needs to be replicated from the blockchain to a database.  Since there are no `UPDATE` or `DELETE` operations on an append-only table, there's no need for a corresponding history table as there is with [Updatable ledger tables](ledger-updatable-ledger-tables.md).

:::image type="content" source="media/ledger/ledger-table-architecture.png" alt-text="architecture of ledger tables":::

Creating an append-only ledger table can be done three ways through specifying the `LEDGER = ON` argument in your T-SQL statement specifying the `APPEND_ONLY = ON` option:

- [CREATE TABLE (Transact-SQL)](/sql/t-sql/statements/create-table-transact-sql)
- [ALTER DATABASE (Transact-SQL)](/sql/t-sql/statements/alter-table-transact-sql)
- [CREATE DATABASE](/sql/t-sql/statements/create-database-transact-sql?view=azuresqldb-current&preserve-view=true)

> [!IMPORTANT]
> When creating  an append-only ledger table, system-generated columns will be created in your ledger table for tracking data lineage for forensics purposes. 
>
> Enabling ledger, either at the database-level or for specific tables, cannot be disabled later. This is to ensure an attacker cannot temporarily remove ledger capabilities on a ledger table, make changes, and then re-enable ledger functionality.

### Append-only ledger table schema

When created, append-only ledger tables will add two system-generated hidden columns to your table. These columns contain metadata noting which transactions made changes to your append-only ledger tables and the order of operations by which rows were updated by the transaction.  This data is useful for forensics purposes in understanding how data was inserted over time.

| Column name | Data type | Description |
|--|--|--|
| ledger_start_transaction_id | bigint | The ID of the transaction that created a row version. |
| ledger_start_sequence_number | bigint | The sequence number of an operation within a transaction that created a row version. |

## Ledger view

For every append-only ledger table, the system automatically generates a view, called the ledger view. The ledger view reports all row inserts that have occurred on the table. The ledger view is primarily helpful for [updatable ledger tables](ledger-updatable-ledger-tables.md), rather than append-only ledger tables, as append-only ledger tables don't have any `UPDATE` or `DELETE` capabilities. The ledger view for append-only ledger tables is available for consistency between both updatable and append-only ledger tables.

### Ledger view schema

| Column name | Data type | Description |
| --- | --- | --- |
| ledger_transaction_id | bigint | The ID of the transaction that created or deleted a row version. |
| ledger_sequence_number | bigint | The sequence number of a row-level operation within the transaction on the table. |
| ledger_operation_type_id | tinyint | Contains `0` (**INSERT**) or `1` (**DELETE**). Inserting a row into the ledger table produces a new row in the ledger view containing `0` in this column. Deleting a row from the ledger table produces a new row in the ledger view containing `1` in this column. Updating a row in the ledger table produces two new rows in the ledger view. One row contains `1` (**DELETE**) and the other row contains `1` (**INSERT**) in this column. |
| ledger_operation_type_desc | nvarchar(128) | Contains `INSERT` or `DELETE`. See above for details. |

## Next steps
  
- [Create and use append-only ledger tables](ledger-how-to-append-only-ledger-tables.md)
- [Create and use updatable ledger tables](ledger-how-to-updatable-ledger-tables.md)
