---
title: "Database ledger"
description: This article provides information on ledger database tables and associated views in Azure SQL Database.
ms.custom: references_regions
ms.date: "07/23/2021"
ms.service: sql-database
ms.subservice: security
ms.reviewer: vanto
ms.topic: conceptual
author: JasonMAnderson
ms.author: janders
---

# What is the database ledger?

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

> [!NOTE]
> Azure SQL Database ledger is currently in public preview and available in West Europe, Brazil South, and West Central US.

The database ledger is part of the ledger feature of Azure SQL Database. The database ledger incrementally captures the state of a database as the database evolves over time, while updates occur on ledger tables. It logically uses a blockchain and [Merkle tree data structures](/archive/msdn-magazine/2018/march/blockchain-blockchain-fundamentals). 

To capture the state of the database, the database ledger stores an entry for every transaction. It captures metadata about the transaction, such as its commit timestamp and the identity of the user who executed it. It also captures the Merkle tree root of the rows updated in each ledger table. These entries are then appended to a tamper-evident data structure to allow verification of integrity in the future.

:::image type="content" source="media/ledger/merkle-tree.png" alt-text="Diagram that shows a Merkle tree for the ledger feature.":::

For more information on how Azure SQL Database ledger provides data integrity, see [Digest management and database verification](ledger-digest-management-and-database-verification.md).

## Where are database transaction and block data stored?

The data for transactions and blocks is physically stored as rows in two system catalog views:

- [sys.database_ledger_transactions](/sql/relational-databases/system-catalog-views/sys-database-ledger-transactions-transact-sql): Maintains a row with the information of each transaction in the database ledger. The information includes the ID of the block where this transaction belongs and the ordinal of the transaction within the block. 
- [sys.database_ledger_blocks](/sql/relational-databases/system-catalog-views/sys-database-ledger-blocks-transact-sql): Maintains a row for every block in the ledger, including the root of the Merkle tree over the transactions within the block and the hash of the previous block to form a blockchain.

To view the database ledger, run the following T-SQL statements in [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms) or [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio).

> [!IMPORTANT]
> Viewing the database ledger requires the **VIEW LEDGER CONTENT** permission. For details on permissions related to ledger tables, see [Permissions](/sql/relational-databases/security/permissions-database-engine#asdbpermissions). 

```sql
SELECT * FROM sys.database_ledger_transactions
GO

SELECT * FROM sys.database_ledger_blocks
GO
```

The following example of a ledger table consists of four transactions that made up one block in the blockchain of the database ledger:

:::image type="content" source="media/ledger/database-ledger-1.png" alt-text="Screenshot of an example ledger table.":::

A block is closed every 30 seconds, or when the user manually generates a database digest by running the [sys.sp_generate_database_ledger_digest](/sql/relational-databases/system-stored-procedures/sys-sp-generate-database-ledger-digest-transact-sql) stored procedure. 

When a block is closed, new transactions will be inserted in a new block. The block generation process then:

1. Retrieves all transactions that belong to the *closed* block from both the in-memory queue and the [sys.database_ledger_transactions](/sql/relational-databases/system-catalog-views/sys-database-ledger-transactions-transact-sql) system catalog view.
1. Computes the Merkle tree root over these transactions and the hash of the previous block.
1. Persists the closed block in the [sys.database_ledger_blocks](/sql/relational-databases/system-catalog-views/sys-database-ledger-blocks-transact-sql) system catalog view. 

Because this is a regular table update, the system automatically guarantees its durability. To maintain the single chain of blocks, this operation is single-threaded. But it's also efficient, because it only computes the hashes over the transaction information and happens asynchronously. It doesn't affect the transaction performance.   

## Next steps

- [Azure SQL Database ledger overview](ledger-overview.md) 
- [Security catalog views (Transact-SQL)](/sql/relational-databases/system-catalog-views/security-catalog-views-transact-sql)
