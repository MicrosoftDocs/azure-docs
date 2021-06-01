---
title: "Azure SQL Database ledger overview"
description: Overview of Azure SQL Database ledger
ms.custom: ""
ms.date: "05/25/2021"
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
> Azure SQL Database ledger is currently in **public preview**.

Establishing trust around the integrity of data stored in database systems has been a long-standing problem for all organizations that manage financial, medical, or other sensitive data. The ledger feature of [Azure SQL Database](sql-database-paas-overview.md) provides tamper-evidence capabilities in your database, enabling the ability to cryptographically attest to other parties, such as auditors or other business parties, that your data hasn't been tampered with.

Ledger helps protect data from any attacker or high-privileged user, including Database Administrators (DBAs), and system and cloud administrators. Just like a traditional ledger, historical data is preserved such that if a row is updated in the database, its previous value is maintained and protected in a history table. The ledger provides a chronicle of all changes made to the database over time. The ledger and the historical data are managed transparently, offering protection without any application changes. Historical data is maintained in a relational form to support SQL queries for auditing, forensics, and other purposes. Ledger provides cryptographic data integrity guarantees while maintaining the power, flexibility, and performance of Azure SQL Database.

:::image type="content" source="media/ledger/ledger-table-architecture.png" alt-text="ledger table architecture":::

## Use case for Azure SQL Database ledger 

### Streamlining audits

Any production system's value is based on the ability to trust the data the system is consuming and producing. If the data in your database has been tampered with by a malicious user, it can have disastrous results in the business processes relying on that data. Maintaining trust in your data requires a combination of enabling the proper security controls to reduce potential attacks, backup and restore practices, and thorough disaster recovery procedures. Ensuring these practices are put in place are often audited by external parties. Audit processes are highly time-intensive activities. Auditing requires on-site inspection of implemented practices such as reviewing audit logs, inspecting authentication and access controls, just to name a few. While these manual processes can expose potential gaps in security, what they can't provide is attestable proof that the data hasn't been maliciously altered. Ledger provides the cryptographic proof of data integrity to auditors, which can help not only streamline the auditing process, but also provides non-repudiation regarding the integrity of the system's data.

### Multi-party business processes

Systems where multiple organizations have a business process that must share state with one another, such as supply-chain management systems, struggle with the challenge of how to share and trust data with one another. Many organizations are turning to traditional blockchains, such as Ethereum or Hyperledger Fabric to digitally transform their multi-party business processes. Blockchain is a great solution for multi-party networks where trust is low between parties that participate on the network. However, many of these networks are fundamentally centralized solutions where trust is important, but a fully decentralized infrastructure is a heavy-weight solution. Ledger provides a solution for these networks where participants can verify the data integrity of the centrally housed data, rather than having the complexity and performance implications that network consensus introduces in a blockchain network.

### Trusted off-chain storage for blockchain

Where a blockchain network is necessary for a multi-party business process, having the ability query the data on the blockchain without sacrificing performance is a challenge. Typical patterns for solving this problem involve replicating data from the blockchain to an off-chain store, such as a database. However, once the data is replicated to the database from the blockchain, the data integrity guarantees that a blockchain offer is lost. Ledger provides the data integrity needed for off-chain storage of blockchain networks, ensuring complete data trust through the entire system.

## How it works

Each transaction that is received by the database is cryptographically hashed (SHA-256). The hash function uses the value of the transaction (including hashes of the rows contained in the transaction), along with the hash of the previous transaction as input to the hash function. The function cryptographically links all transactions together, similar to a blockchain. Cryptographic hashes ([database digests](#database-digests)), which represent the state of the database, are periodically generated and stored outside of Azure SQL Database in a tamper-proof storage location. An example of a storage location would be [Azure Storage immutable blobs](../../storage/blobs/storage-blob-immutable-storage.md) or [Azure Confidential Ledger](/azure/confidential-ledger/). Database digests are then later used to verify the integrity of the database by comparing the value of the hash in the digest against the calculated hashes in database. 

Ledger functionality is introduced to tables in Azure SQL Database in two forms:

- [**Updatable ledger tables**](ledger-updatable-ledger-tables.md), which allow you to update and delete rows in your tables.
- [**Append-only ledger tables**](ledger-append-only-ledger-tables.md), which only allow inserts to your tables.

Both **updatable ledger tables** and **append-only ledger tables** provide tamper-evidence and digital forensics capabilities. Understanding which transactions submitted by which users that resulted in changes to the database are important if both remediating potential tampering events, or proving to third parties that transactions submitted to the system were by authorized users. The ledger feature enables users, their partners, or auditors to analyze all historical operations and detect potential tampering. Each row operation is accompanied by the ID of the transaction that performed it, allowing users to retrieve more information about the time the transaction was executed, the identity of the user who executed it, and correlate it to other operations performed by this transaction.

There are some limitations of ledger tables that you should be aware of. For details on limitations with ledger tables, see [Limitations for Azure SQL Database ledger](ledger-limits.md).

### Ledger database

A ledger database is a database, in which all user data is tamper evident and stored in ledger tables. A ledger database can only contain ledger tables, and each table is by default created as an updatable ledger table. Ledger databases provide an easy-to-use solution for applications that require the integrity of all data to be protected. 

### Updatable ledger tables

[Updatable ledger tables](ledger-updatable-ledger-tables.md) are ideal for application patterns that expect to issue updates and deletes to tables in your database, such as System of Record (SOR) applications. This means that existing data patterns for your application don't need to change to enable ledger functionality.  

[Updatable ledger tables](ledger-updatable-ledger-tables.md) track the history of changes to any rows in your database when transactions that perform updates or deletes occur. An updatable ledger table is a system-versioned table that contains a reference to another table with a mirrored schema. The system uses this table to automatically store the previous version of the row each time a row in the ledger table gets updated or deleted. This other table is referred to as the history table. The history table is automatically created when you create an updatable ledger table. The values contained in the updatable ledger table and its corresponding history table provide a chronicle of the values of your database over time. In order to easily query this chronicle of your database, a system-generated ledger view is created, which joins the updatable ledger table and the history table.

For more information on how to create and use updatable ledger tables, see [Create and use updatable ledger tables](ledger-how-to-updatable-ledger-tables.md).

### Append-only ledger tables

[Append-only ledger tables](ledger-append-only-ledger-tables.md) are ideal for application patterns that are insert-only, such as Security Information and Event Management (SEIM) applications. Append-only ledger tables block updates and deletes at the Application Programming Interface (API) level, providing further tampering protection from privileged users such as systems administrators and DBAs. Since only inserts are allowed into the system, append-only ledger tables don't have a corresponding history table as there's no history to capture. Like updatable ledger tables, a ledger view is created providing insights into the transaction that inserted rows into the append-only table, and the user that performed the insert.

For more information on how to create and use append-only ledger tables, see [Create and use append-only ledger tables](ledger-how-to-append-only-ledger-tables.md).

### Database ledger

The database ledger consists of system tables that store the cryptographic hashes of transactions processed in the system. Since transactions are the unit of [atomicity](/windows/win32/cossdk/acid-properties) for the database engine, this is the unit of work being captured in the database ledger. Specifically, when a transaction commits, the SHA-256 hash of any rows modified by the transaction in the ledger table, together with some metadata for the transaction, such as the identity of the user that executed it and its commit timestamp, is appended as a *transaction entry* in the database ledger. Every 30 seconds, the transactions processed by the database are SHA-256 hashed together using a Merkle tree data structure, producing a root hash. This forms a block, which is then SHA-256 hashed using the root hash of the block along with the root hash of the previous block as input to the hash function, forming a blockchain.

For more information on the database ledger, see [Database ledger](ledger-database-ledger.md).

### Database digests

The hash of the latest block in the database ledger is known as the database digest and represents the state of all ledger tables in the database at the time the block was generated. When a block is formed, its associated database digest is then published and stored outside of Azure SQL Database in a tamper-proof storage. Since database digests represent the state of the database at the point in time they were generated, protecting the digests from tampering is paramount. An attacker that has access to modify the digests would be able to tamper with the data in the database, generate the hashes representing the database with the tampered changes, and then modify the digests to represent the updated hash of the transactions in the block. Ledger provides the ability to automatically generate, and store the database digests in [Azure Storage immutable blobs](../../storage/blobs/storage-blob-immutable-storage.md), or [Azure Confidential Ledger](/azure/confidential-ledger/) to prevent tampering. Alternatively, users can manually generate database digests, storing them in the location of their choice. Database digests are used for later verifying that the data stored in ledger tables has not been tampered.

For more information on the database digests, see [Digest management and database verification](ledger-digest-management-and-database-verification.md).

### Ledger verification

The ledger feature doesn't allow users to modify the content of the ledger. However, an attacker or system administrator who has control of the machine can bypass all system checks and directly tamper with the data. For example, an attacker or system administrator can edit the database files in storage. Ledger can't prevent such attacks but guarantees that any tampering will be detected when the ledger data is verified. The ledger verification process takes as input one or more previously generated database digests and recomputes the hashes stored in the database ledger based on the current state of the ledger tables. If the computed hashes don't match the input digests, the verification fails, indicating that the data has been tampered with, and reports all inconsistencies detected.

Since the ledger verification recomputes all of the hashes for transactions in the database, it can be a resource-intensive process for databases with large amounts of data. Running the ledger verification should be done only when users need to verify the integrity of their database rather than in a continuous manner. Ideally, ledger verification should be run only when the organization hosting the data goes through an audit and needs to provide cryptographic evidence regarding the integrity of their data to another party. To reduce the cost of verification, ledger exposes options to verify individual ledger tables, or only a subset of the ledger.

For more information on ledger verification, see [Digest management and database verification](ledger-digest-management-and-database-verification.md).

## Next steps
 
- [Quickstart: Create an Azure SQL Database with ledger enabled](ledger-create-a-single-database-with-ledger-enabled.md)
- [Updatable ledger tables](ledger-updatable-ledger-tables.md)   
- [Append-only ledger tables](ledger-append-only-ledger-tables.md)   
- [Database ledger](ledger-database-ledger.md)   
- [Digest management and database verification](ledger-digest-management-and-database-verification.md)   
- [Limitations for Azure SQL Database ledger](ledger-limits.md)
- [Create and use updatable ledger tables](ledger-how-to-updatable-ledger-tables.md)
- [Create and use append-only ledger tables](ledger-how-to-append-only-ledger-tables.md)
- [How to access the digests stored in Azure Confidential Ledger (ACL)](ledger-how-to-access-acl-digest.md)
- [How to verify a ledger table to detect tampering](ledger-verify-database.md)
