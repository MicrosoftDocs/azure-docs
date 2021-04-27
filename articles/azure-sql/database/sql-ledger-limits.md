---
title: "Limitations for Azure SQL Database ledger"
description: Limitations of SQL ledger in Azure SQL Database
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
| Enabling database-level ledger for append-only tables | When database-level ledger is enabled, all future tables created in the database will be updatable ledger tables.  Append-only ledger tables can be created in T-SQL create table statements |
| Disabling database-level ledger | Once enabled, database-level ledger cannot be disabled. |
| Maximum # of columns | When created, updatable ledger tables add 4 system-generated columns to the ledger table and append-only ledger tables add 2 columns to the ledger table.  These new columns count against the maximum supported number of columns in Azure SQL Database (1024). |
| Restricted data types | XML and SqlVariant data types are not supported. |
| In-memory tables | In-memory tables are not supported. |
| Sparse column sets | Sparse column sets are not supported. |
| Ledger truncation | Deleting older data in append-only ledger tables, or the history table of an updatable ledger table is not currently supported. |
| Converting existing tables to ledger tables | Existing tables in a database that are not ledger-enabled cannot be converted over to ledger tables. |
|LRS support for automated digest management|Automated digest management with ledger tables using Azure Storage immutable blobs does not offer the ability for users to use LRS (locally-redundant storage) accounts.|

## Next steps

- [Updatable ledger tables](sql-ledger-updatable-ledger-tables.md)   
- [Append-only ledger tables](sql-ledger-append-only-ledger-tables.md)   
- [Database ledger](sql-ledger-database-ledger.md)   
- [Digest management and database verification](sql-ledger-digest-management-and-database-verification.md)   
