---
title: "Azure SQL Database append-only ledger tables"
description: This article provides information on append-only ledger table schema and views in Azure SQL Database.
ms.custom: references_regions
ms.date: "07/23/2021"
ms.service: sql-database
ms.subservice: security
ms.reviewer: vanto
ms.topic: conceptual
author: JasonMAnderson
ms.author: janders
---

# Azure SQL Database append-only ledger tables

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

> [!NOTE]
> Azure SQL Database ledger is currently in public preview and available in West Europe, Brazil South, and West Central US.

Append-only ledger tables allow only `INSERT` operations on your tables, which ensures that privileged users such as database administrators can't alter data through traditional [Data Manipulation Language](/sql/t-sql/queries/queries) operations. Append-only ledger tables are ideal for systems that don't update or delete records, such as security information event and management systems or blockchain systems where data needs to be replicated from the blockchain to a database. Because there are no `UPDATE` or `DELETE` operations on an append-only table, there's no need for a corresponding history table as there is with [updatable ledger tables](ledger-updatable-ledger-tables.md).

:::image type="content" source="media/ledger/ledger-table-architecture-append-only.png" alt-text="Diagram that shows architecture of ledger tables.":::

You can create an append-only ledger table by specifying the `LEDGER = ON` argument in your [CREATE TABLE (Transact-SQL)](/sql/t-sql/statements/create-table-transact-sql) statement and specifying the `APPEND_ONLY = ON` option.

> [!IMPORTANT]
> After a table is created as a ledger table, it can't be reverted to a table that doesn't have ledger functionality. As a result, an attacker can't temporarily remove ledger capabilities, make changes to the table, and then reenable ledger functionality.

### Append-only ledger table schema

An append-only table needs to have the following [GENERATED ALWAYS](/sql/t-sql/statements/create-table-transact-sql#generate-always-columns) columns that contain metadata noting which transactions made changes to the table and the order of operations by which rows were updated by the transaction. When you create an append-only ledger table, `GENERATED ALWAYS` columns will be created in your ledger table. This data is useful for forensics purposes in understanding how data was inserted over time.

If you don't specify the definitions of the `GENERATED ALWAYS` columns in the [CREATE TABLE](/sql/t-sql/statements/create-table-transact-sql) statement, the system automatically adds them by using the following default names.

| Default column name | Data type | Description |
|--|--|--|
| ledger_start_transaction_id | bigint | The ID of the transaction that created a row version |
| ledger_start_sequence_number | bigint | The sequence number of an operation within a transaction that created a row version |

## Ledger view

For every append-only ledger table, the system automatically generates a view, called the ledger view. The ledger view reports all row inserts that have occurred on the table. The ledger view is primarily helpful for [updatable ledger tables](ledger-updatable-ledger-tables.md), rather than append-only ledger tables, because append-only ledger tables don't have any `UPDATE` or `DELETE` capabilities. The ledger view for append-only ledger tables is available for consistency between both updatable and append-only ledger tables.

### Ledger view schema

> [!NOTE]
> The ledger view column names can be customized when you create the table by using the `<ledger_view_option>` parameter with the [CREATE TABLE (Transact-SQL)](/sql/t-sql/statements/create-table-transact-sql?view=azuresqldb-current&preserve-view=true) statement. For more information, see [ledger view options](/sql/t-sql/statements/create-table-transact-sql?view=azuresqldb-current&preserve-view=true#ledger-view-options) and the corresponding examples in [CREATE TABLE (Transact-SQL)](/sql/t-sql/statements/create-table-transact-sql?view=azuresqldb-current&preserve-view=true).

| Default column name | Data type | Description |
| --- | --- | --- |
| ledger_transaction_id | bigint | The ID of the transaction that created or deleted a row version. |
| ledger_sequence_number | bigint | The sequence number of a row-level operation within the transaction on the table. |
| ledger_operation_type_id | tinyint | Contains `0` (**INSERT**) or `1` (**DELETE**). Inserting a row into the ledger table produces a new row in the ledger view that contains `0` in this column. Deleting a row from the ledger table produces a new row in the ledger view that contains `1` in this column. Updating a row in the ledger table produces two new rows in the ledger view. One row contains `1` (**DELETE**), and the other row contains `1` (**INSERT**) in this column. A DELETE shouldn't occur on an append-only ledger table. |
| ledger_operation_type_desc | nvarchar(128) | Contains `INSERT` or `DELETE`. For more information, see the preceding row. |

## Next steps

- [Create and use append-only ledger tables](ledger-how-to-append-only-ledger-tables.md)
- [Create and use updatable ledger tables](ledger-how-to-updatable-ledger-tables.md)
