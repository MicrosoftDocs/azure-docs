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

This article provides an overview of the limitations when using ledger tables with Azure SQL Database.  

## Limitations

| Function | Limitation |
| :--- | :--- |
| Enabling database-level ledger for [append-only ledger tables](ledger-append-only-ledger-tables.md) | When database-level ledger is enabled, all future tables created in the database will be [updatable ledger tables](ledger-updatable-ledger-tables.md). [Append-only ledger tables](ledger-append-only-ledger-tables.md) can be created using [CREATE TABLE (Transact-SQL)](/sql/t-sql/statements/create-table-transact-sql) statements |
| Disabling [database-level ledger](ledger-database-ledger.md)   | Once enabled, database-level ledger cannot be disabled. |
| Maximum # of columns | When created, [updatable ledger tables](ledger-updatable-ledger-tables.md) add four system-generated columns to the ledger table and [append-only ledger tables](ledger-append-only-ledger-tables.md) add two columns to the ledger table. These new columns count against the maximum supported number of columns in Azure SQL Database (1024). |
| Restricted data types | XML and SqlVariant data types aren't supported. |
| In-memory tables | In-memory tables aren't supported. |
| Sparse column sets | Sparse column sets aren't supported. |
| Ledger truncation | Deleting older data in [append-only ledger tables](ledger-append-only-ledger-tables.md), or the history table of [updatable ledger tables](ledger-updatable-ledger-tables.md) aren't supported. |
| Converting existing tables to ledger tables | Existing tables in a database that aren't ledger-enabled cannot be converted over to ledger tables. |
|LRS support for [automated digest management](ledger-digest-management-and-database-verification.md) | Automated digest management with ledger tables using [Azure Storage immutable blobs](../../storage/blobs/storage-blob-immutable-storage.md) doesn't offer the ability for users to use [locally redundant storage (LRS)](../../storage/common/storage-redundancy.md#locally-redundant-storage) accounts.|

## Next steps

- [Updatable ledger tables](ledger-updatable-ledger-tables.md)   
- [Append-only ledger tables](ledger-append-only-ledger-tables.md)   
- [Database ledger](ledger-database-ledger.md)   
- [Digest management and database verification](ledger-digest-management-and-database-verification.md)   
