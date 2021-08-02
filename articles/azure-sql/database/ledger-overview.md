---
title: "Azure SQL Database ledger overview"
description: Learn the basics of the Azure SQL Database ledger feature.
ms.custom: references_regions
ms.date: "07/23/2021"
ms.service: sql-database
ms.subservice: security
ms.reviewer: vanto
ms.topic: conceptual
author: JasonMAnderson
ms.author: janders
---

# Azure SQL Database ledger

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

> [!NOTE]
> Azure SQL Database ledger is currently in public preview and available in West Europe, Brazil South, and West Central US.

Establishing trust around the integrity of data stored in database systems has been a longstanding problem for all organizations that manage financial, medical, or other sensitive data. The ledger feature of [Azure SQL Database](sql-database-paas-overview.md) provides tamper-evidence capabilities in your database. You can cryptographically attest to other parties, such as auditors or other business parties, that your data hasn't been tampered with.

Ledger helps protect data from any attacker or high-privileged user, including database administrators (DBAs), system administrators, and cloud administrators. As with a traditional ledger, the feature preserves historical data. If a row is updated in the database, its previous value is maintained and protected in a history table. Ledger provides a chronicle of all changes made to the database over time. 

Ledger and the historical data are managed transparently, offering protection without any application changes. The feature maintains historical data in a relational form to support SQL queries for auditing, forensics, and other purposes. It provides guarantees of cryptographic data integrity while maintaining the power, flexibility, and performance of Azure SQL Database.

:::image type="content" source="media/ledger/ledger-table-architecture.png" alt-text="Diagram of the ledger table architecture.":::

## Use cases for Azure SQL Database ledger 

### Streamlining audits

Any production system's value is based on the ability to trust the data that the system is consuming and producing. If a malicious user has tampered with the data in your database, that can have disastrous results in the business processes relying on that data. 

Maintaining trust in your data requires a combination of enabling the proper security controls to reduce potential attacks, backup and restore practices, and thorough disaster recovery procedures. Audits by external parties ensure that these practices are put in place. 

Audit processes are highly time-intensive activities. Auditing requires on-site inspection of implemented practices such as reviewing audit logs, inspecting authentication, and inspecting access controls. Although these manual processes can expose potential gaps in security, they can't provide attestable proof that the data hasn't been maliciously altered. 

Ledger provides the cryptographic proof of data integrity to auditors. This proof can help streamline the auditing process. It also provides nonrepudiation regarding the integrity of the system's data.

### Multiple-party business processes

In some systems, such as supply-chain management systems, multiple organizations must share state from a business process with one another. These systems struggle with the challenge of how to share and trust data. Many organizations are turning to traditional blockchains, such as Ethereum or Hyperledger Fabric, to digitally transform their multiple-party business processes. 

Blockchain is a great solution for multiple-party networks where trust is low between parties that participate on the network. Many of these networks are fundamentally centralized solutions where trust is important, but a fully decentralized infrastructure is a heavyweight solution. 

Ledger provides a solution for these networks. Participants can verify the integrity of the centrally housed data, without the complexity and performance implications that network consensus introduces in a blockchain network.

### Trusted off-chain storage for blockchain

When a blockchain network is necessary for a multiple-party business process, the ability query the data on the blockchain without sacrificing performance is a challenge. 

Typical patterns for solving this problem involve replicating data from the blockchain to an off-chain store, such as a database. But after the data is replicated to the database from the blockchain, the data integrity guarantees that a blockchain offer is lost. Ledger provides data integrity for off-chain storage of blockchain networks, which helps ensure complete data trust through the entire system.

## How it works

Each transaction that the database receives is cryptographically hashed (SHA-256). The hash function uses the value of the transaction, along with the hash of the previous transaction, as input to the hash function. (The value includes hashes of the rows contained in the transaction.) The function cryptographically links all transactions together, like a blockchain. 

Cryptographically hashed ([database digests](#database-digests)) represent the state of the database. They're periodically generated and stored outside Azure SQL Database in a tamper-proof storage location. An example of a storage location is the [immutable storage feature of Azure Blob Storage](../../storage/blobs/storage-blob-immutable-storage.md) or [Azure Confidential Ledger](../../confidential-ledger/index.yml). Database digests are later used to verify the integrity of the database by comparing the value of the hash in the digest against the calculated hashes in database. 

Ledger functionality is introduced to tables in Azure SQL Database in two forms:

- [Updatable ledger tables](#updatable-ledger-tables), which allow you to update and delete rows in your tables.
- [Append-only ledger tables](#append-only-ledger-tables), which only allow insertions to your tables.

Both updatable ledger tables and append-only ledger tables provide tamper-evidence and digital forensics capabilities. Understanding which transactions submitted by which users resulted in changes to the database is important if you're remediating potential tampering events or proving to third parties that authorized users submitted transactions to the system. 

The ledger feature enables users, their partners, or auditors to analyze all historical operations and detect potential tampering. Each row operation is accompanied by the ID of the transaction that performed it. The ID enables users to get more information about the time that the transaction happened and the identity of the user who executed it. Users can then correlate the ID to other operations that the transaction has performed.

For details about limitations of ledger tables, see [Limitations for Azure SQL Database ledger](ledger-limits.md).

### Ledger database

In a ledger database, all user data is tamper evident and stored in ledger tables. A ledger database can contain only ledger tables. Each table is, by default, created as an updatable ledger table. Ledger databases provide an easy-to-use solution for applications that require the integrity of all data to be protected. 

### Updatable ledger tables

[Updatable ledger tables](ledger-updatable-ledger-tables.md) are ideal for application patterns that expect to issue updates and deletions to tables in your database, such as system of record (SOR) applications. Existing data patterns for your application don't need to change to enable ledger functionality.  

Updatable ledger tables track the history of changes to any rows in your database when transactions that perform updates or deletions occur. An updatable ledger table is a system-versioned table that contains a reference to another table with a mirrored schema. 

The other table is called the *history table*. The system uses this table to automatically store the previous version of the row each time a row in the ledger table is updated or deleted. The history table is automatically created when you create an updatable ledger table. 

The values in the updatable ledger table and its corresponding history table provide a chronicle of the values of your database over time. A system-generated ledger view joins the updatable ledger table and the history table so that you can easily query this chronicle of your database.

For more information on updatable ledger tables, see [Create and use updatable ledger tables](ledger-how-to-updatable-ledger-tables.md).

### Append-only ledger tables

[Append-only ledger tables](ledger-append-only-ledger-tables.md) are ideal for application patterns that are insert-only, such as security information and event management (SIEM) applications. Append-only ledger tables block updates and deletions at the API level. This blocking provides more tampering protection from privileged users such as system administrators and DBAs. 

Because only insertions are allowed into the system, append-only ledger tables don't have a corresponding history table because there's no history to capture. As with updatable ledger tables, a ledger view provides insights into the transaction that inserted rows into the append-only table, and the user that performed the insertion.

For more information on append-only ledger tables, see [Create and use append-only ledger tables](ledger-how-to-append-only-ledger-tables.md).

### Database ledger

The [database ledger](ledger-database-ledger.md) consists of system tables that store the cryptographic hashes of transactions processed in the system. Because transactions are the unit of [atomicity](/windows/win32/cossdk/acid-properties) for the database engine, this is the unit of work that the database ledger captures. 

Specifically, when a transaction commits, the SHA-256 hash of any rows modified by the transaction in the ledger table is appended as a *transaction entry* in the database ledger. The transaction entry also includes some metadata for the transaction, such as the identity of the user who executed it and its commit time stamp. 

Every 30 seconds, the transactions that the database processes are SHA-256 hashed together through a Merkle tree data structure. The result is a root hash that forms a block. The block is then SHA-256 hashed through the root hash of the block, along with the root hash of the previous block as input to the hash function. That hashing forms a blockchain.

### Database digests

The hash of the latest block in the database ledger is called the [database digest](ledger-digest-management-and-database-verification.md). It represents the state of all ledger tables in the database at the time that the block was generated. 

When a block is formed, its associated database digest is published and stored outside Azure SQL Database in tamper-proof storage. Because database digests represent the state of the database at the time that they were generated, protecting the digests from tampering is paramount. An attacker who has access to modify the digests would be able to:

1. Tamper with the data in the database.
2. Generate the hashes that represent the database with those changes.
3. Modify the digests to represent the updated hash of the transactions in the block. 

Ledger provides the ability to automatically generate and store the database digests in [immutable storage](../../storage/blobs/storage-blob-immutable-storage.md) or [Azure Confidential Ledger](../../confidential-ledger/index.yml), to prevent tampering. Alternatively, users can manually generate database digests and store them in the location of their choice. Database digests are used for later verifying that the data stored in ledger tables has not been tampered with.

### Ledger verification

The ledger feature doesn't allow users to modify its content. However, an attacker or system administrator who has control of the machine can bypass all system checks and directly tamper with the data. For example, an attacker or system administrator can edit the database files in storage. Ledger can't prevent such attacks but guarantees that any tampering will be detected when the ledger data is verified. 

The [ledger verification](ledger-digest-management-and-database-verification.md) process takes as input one or more previously generated database digests and recomputes the hashes stored in the database ledger based on the current state of the ledger tables. If the computed hashes don't match the input digests, the verification fails, indicating that the data has been tampered with. Ledger then reports all inconsistencies that it has detected.

Because the ledger verification recomputes all of the hashes for transactions in the database, it can be a resource-intensive process for databases with large amounts of data. Users should run the ledger verification only when they need to verify the integrity of their database, rather than running it continuously. 

Ideally, users should run ledger verification only when the organization that's hosting the data goes through an audit and needs to provide cryptographic evidence about the integrity of the data to another party. To reduce the cost of verification, the feature exposes options to verify individual ledger tables or only a subset of the ledger tables.

## Next steps
 
- [Quickstart: Create a SQL database with ledger enabled](ledger-create-a-single-database-with-ledger-enabled.md)
- [Access the digests stored in Azure Confidential Ledger](ledger-how-to-access-acl-digest.md)
- [Verify a ledger table to detect tampering](ledger-verify-database.md)
