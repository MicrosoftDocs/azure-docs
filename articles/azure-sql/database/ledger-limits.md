---
title: "Limitations for Azure SQL Database ledger"
description: Limitations of the ledger feature in Azure SQL Database
ms.custom: references_regions
ms.date: "07/23/2021"
ms.service: sql-database
ms.subservice: security
ms.reviewer: vanto
ms.topic: conceptual
author: JasonMAnderson
ms.author: janders
---

# Limitations for Azure SQL Database ledger

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

> [!NOTE]
> Azure SQL Database ledger is currently in public preview and available in West Europe, Brazil South, and West Central US.

This article provides an overview of the limitations of ledger tables used with Azure SQL Database.

## Limitations

| Function | Limitation |
| :--- | :--- |
| Disabling [ledger database](ledger-database-ledger.md)   | After a ledger database is enabled, it can't be disabled. |
| Maximum number of columns | When an [updatable ledger table](ledger-updatable-ledger-tables.md) is created, it adds four [GENERATED ALWAYS](/sql/t-sql/statements/create-table-transact-sql#generate-always-columns) columns to the ledger table. An [append-only ledger table](ledger-append-only-ledger-tables.md) adds two columns to the ledger table. These new columns count against the maximum supported number of columns in SQL Database (1,024). |
| Restricted data types | XML, SqlVariant, User-defined type, and FILESTREAM data types aren't supported. |
| In-memory tables | In-memory tables aren't supported. |
| Sparse column sets | Sparse column sets aren't supported. |
| Ledger truncation | Deleting older data in [append-only ledger tables](ledger-append-only-ledger-tables.md) or the history table of [updatable ledger tables](ledger-updatable-ledger-tables.md) isn't supported. |
| Converting existing tables to ledger tables | Existing tables in a database that aren't ledger-enabled can't be converted to ledger tables. |
|Locally redundant storage (LRS) support for [automated digest management](ledger-digest-management-and-database-verification.md) | Automated digest management with ledger tables by using [Azure Storage immutable blobs](../../storage/blobs/immutable-storage-overview.md) doesn't offer the ability for users to use [LRS](../../storage/common/storage-redundancy.md#locally-redundant-storage) accounts.|

## Remarks

- When a ledger database is created, all new tables created by default (without specifying the `APPEND_ONLY = ON` clause) in the database will be [updatable ledger tables](ledger-updatable-ledger-tables.md). To create [append-only ledger tables](ledger-append-only-ledger-tables.md), use [CREATE TABLE (Transact-SQL)](/sql/t-sql/statements/create-table-transact-sql) statements.
- Ledger tables can't be a FILETABLE.
- Ledger tables can't have full-text indexes.
- Ledger tables can't be renamed.
- Ledger tables can't be moved to a different schema.
- Only nullable columns can be added to ledger tables, and when they aren't specified WITH VALUES.
- Columns in ledger tables can't be dropped.
- Only deterministic-computed columns are allowed for ledger tables.
- Existing columns can't be altered in a way that modifies the format for this column.
  - We allow changing:
    - Nullability.
    - Collation for nvarchar/ntext columns and when the code page isn't changing for char/text columns.
    - The length of variable length columns.
    - Sparseness.
- SWITCH IN/OUT isn't allowed for ledger tables.
- Long-term backups (LTR) aren't supported for databases that have `LEDGER = ON`.
- Versioning that's `LEDGER` or `SYSTEM_VERSIONING` can't be disabled for ledger tables.
- The `UPDATETEXT` and `WRITETEXT` APIs can't be used on ledger tables.
- A transaction can update up to 200 ledger tables.
- For updatable ledger tables, we inherit all of the limitations of temporal tables.
- Change tracking isn't allowed on ledger tables.
- Ledger tables can't have a rowstore non-clustered index when they have a clustered columnstore index.

## Next steps

- [Updatable ledger tables](ledger-updatable-ledger-tables.md)
- [Append-only ledger tables](ledger-append-only-ledger-tables.md)
- [Database ledger](ledger-database-ledger.md)
- [Digest management and database verification](ledger-digest-management-and-database-verification.md)