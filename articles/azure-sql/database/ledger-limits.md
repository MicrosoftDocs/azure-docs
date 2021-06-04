---
title: "Limitations for Azure SQL Database ledger"
description: Limitations of the ledger feature in Azure SQL Database
ms.custom: ""
ms.date: "05/25/2021"
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
> Azure SQL Database ledger is currently in **public preview**.

This article provides an overview of the limitations when using ledger tables with Azure SQL Database.  

## Limitations

| Function | Limitation |
| :--- | :--- |
| Disabling [ledger database](ledger-database-ledger.md)   | Once enabled, ledger database cannot be disabled. |
| Maximum # of columns | When created, [updatable ledger tables](ledger-updatable-ledger-tables.md) adds four [GENERATED ALWAYS](/sql/t-sql/statements/create-table-transact-sql#generate-always-columns) columns to the ledger table and [append-only ledger tables](ledger-append-only-ledger-tables.md) add two columns to the ledger table. These new columns count against the maximum supported number of columns in Azure SQL Database (1024). |
| Restricted data types | XML, SqlVariant, User-defined type, and FILESTREAM data types aren't supported. |
| In-memory tables | In-memory tables aren't supported. |
| Sparse column sets | Sparse column sets aren't supported. |
| Ledger truncation | Deleting older data in [append-only ledger tables](ledger-append-only-ledger-tables.md), or the history table of [updatable ledger tables](ledger-updatable-ledger-tables.md) aren't supported. |
| Converting existing tables to ledger tables | Existing tables in a database that aren't ledger-enabled cannot be converted over to ledger tables. |
|LRS support for [automated digest management](ledger-digest-management-and-database-verification.md) | Automated digest management with ledger tables using [Azure Storage immutable blobs](../../storage/blobs/storage-blob-immutable-storage.md) doesn't offer the ability for users to use [locally redundant storage (LRS)](../../storage/common/storage-redundancy.md#locally-redundant-storage) accounts.|

## Remarks

- When a ledger database is created, all new tables created by default (without specifying the `APPEND_ONLY = ON` clause) in the database will be [updatable ledger tables](ledger-updatable-ledger-tables.md). [Append-only ledger tables](ledger-append-only-ledger-tables.md) can be created using [CREATE TABLE (Transact-SQL)](/sql/t-sql/statements/create-table-transact-sql) statements.
- Ledger tables can't be a FILETABLE.
- Ledger tables can't have full-text indexes.
- Ledger tables can't be renamed.
- Ledger tables can't be moved to a different schema.
- Only nullable columns can be added to ledger tables, and when they aren't specified WITH VALUES.
- Columns in ledger tables cannot be dropped.
- Only deterministic-computed columns are allowed for ledger tables.
- Existing columns cannot be altered in a way that modifies the format for this column.
  - We allow changing:
    - Nullability
    - Collation for nvarchar/ntext columns and when the code page isn't changing for char/text columns
    - Change the length of variable length columns
    - Sparseness
- SWITCH IN/OUT isn't allowed for ledger tables
- Long-term backups (LTR) aren't supported for databases that have `LEDGER = ON`
- `LEDGER` or `SYSTEM_VERSIONING` cannot be disabled for ledger tables.
- The `UPDATETEXT` and `WRITETEXT` APIs cannot be used on ledger tables.
- A transaction can update up to 200 ledger tables.
- For updatable ledger tables, we inherit all of the limitations of temporal tables.
- Change tracking isn't allowed on ledger tables.
- Ledger tables can't have a rowstore non-clustered index when they have a clustered Columnstore index.

## Next steps

- [Updatable ledger tables](ledger-updatable-ledger-tables.md)   
- [Append-only ledger tables](ledger-append-only-ledger-tables.md)   
- [Database ledger](ledger-database-ledger.md)   
- [Digest management and database verification](ledger-digest-management-and-database-verification.md)   
