---
title: "Digest management and database verification"
description: This article provides information on ledger database digest and database verification in Azure SQL Database
ms.custom: ""
ms.date: "05/25/2021" 
ms.service: sql-database
ms.subservice: security
ms.reviewer: vanto
ms.topic: conceptual
author: JasonMAnderson
ms.author: janders
---

# Digest management and database verification

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

> [!NOTE]
> Azure SQL Database ledger is currently in **public preview**.

Azure SQL Database ledger provides a form of data integrity called forward-integrity, which provides evidence of data tampering on data in your ledger tables. For example, if a banking transaction occurs on a ledger table where a balance has been updated to value `x`, if an attacker later modifies the data, changing the balance from `x` to `y`, this tampering activity will be detected through database verification.  

The database verification process takes as input one or more previously generated database digests and recomputes the hashes stored in the database ledger based on the current state of the ledger tables. If the computed hashes don't match the input digests, the verification fails, indicating that the data has been tampered with, and reports all inconsistencies detected.

## Database digests

The hash of the latest block in the database ledger is known as the database digest, and represents the state of all ledger tables in the database at the time when the block was generated. Generating a database digest is efficient, since it only involves computing the hashes of the blocks that were recently appended. Database digests can be generated either automatically by the system, or manually by the user, and used later for verifying the data integrity of the database. Database digests are generated in the form of a JSON document that contains the hash of the latest block together with metadata regarding the block ID. The metadata includes the time the digest was generated and the commit timestamp of the last transaction in this block.

The verification process and the integrity of the database depends on the integrity of the input digests. For this purpose, database digests that are extracted from the database need to be stored in trusted storages that cannot be tampered with by the high privileged users or attackers of the Azure SQL Database server.

### Automatic generation and storage of database digests

Azure SQL Database ledger integrates with [immutable storage for Azure Blob storage](../../storage/blobs/storage-blob-immutable-storage.md) and [Azure Confidential Ledger](/azure/confidential-ledger/), providing secure storage services in Azure to protect the database digests from potential tampering. This integration provides a simple and cost-effective way for users to automate digest management without having to worry about their availability and geographic replication. 

Configuring automatic generation and storage of database digests can be done through either the Azure portal, PowerShell, or Azure CLI. When configured, database digests are generated on a pre-defined interval of 30 seconds and uploaded to the storage service selected. If no transactions occur in the system in the 30-second interval, then a database digest won't be generated and uploaded, ensuring that database digests are only generated when data has been updated in your database.

:::image type="content" source="media/ledger/automatic-digest-management.png" alt-text="enable digest storage"::: 

> [!IMPORTANT]
> An [immutability policy](../../storage/blobs/storage-blob-immutability-policies-manage.md) should be configured on your container after provisioning to ensure database digests are protected from tampering.

### Manual generation and storage of database digests

Azure SQL Database ledger also allows users to generate a database digest on demand so that they can manually store the digest in any service or device that they consider a trusted storage destination, such as an on-premises write once read many (WORM) device. Manually generating a database digest is done through executing the [sys.sp_generate_database_ledger_digest](/sql/relational-databases/system-stored-procedures/sys-sp-generate-database-ledger-digest-transact-sql) stored procedure in either [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms) or [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio).

> [!IMPORTANT]
> Generating database digests requires the **GENERATE LEDGER DIGEST** permission. For details on permissions related to ledger tables, see [Permissions](/sql/relational-databases/security/permissions-database-engine#asdbpermissions). 

```sql
EXECUTE sp_generate_database_ledger_digest
```

The result set returned will be a single row of data, which should be saved to the trusted storage location as a JSON document as follows:

```json
    {
        "database_name":  "ledgerdb",
        "block_id":  0,
        "hash":  "0xDC160697D823C51377F97020796486A59047EBDBF77C3E8F94EEE0FFF7B38A6A",
        "last_transaction_commit_time":  "2020-11-12T18:01:56.6200000",
        "digest_time":  "2020-11-12T18:39:27.7385724"
    }
```

## Database verification

The verification process scans all ledger and history tables and recomputes the SHA-256 hashes of their rows and compares them against the database digest files passed to the verification stored procedure. For large ledger tables, database verification can be a resource-intensive process, and should be executed only when users need to verify the integrity of their database. It can be executed hourly or daily for cases where the integrity of the database needs to be frequently monitored, or only when the organization hosting the data goes through an audit and needs to provide cryptographic evidence regarding the integrity of their data. To reduce the cost of verification, ledger exposes options to verify individual ledger tables, or only a subset of the ledger. 

Database verification is accomplished through two stored procedures, depending on whether [automatic digest storage](#database-verification-using-automatic-digest-storage) is used, or whether [digests are manually managed](#database-verification-using-manual-digest-storage) by the user.

> [!IMPORTANT]
> Database verification requires the **VIEW LEDGER CONTENT** permission. For details on permissions related to ledger tables, see [Permissions](/sql/relational-databases/security/permissions-database-engine#asdbpermissions). 

### Database verification using automatic digest storage

When using automatic digest storage for generating and storing database digests, the location of the digest storage is in the system catalog view [sys.database_ledger_digest_locations](/sql/relational-databases/system-catalog-views/sys-database-ledger-digest-locations-transact-sql) as JSON objects. Running database verification consists of executing the [sp_verify_database_ledger_from_digest_storage](/sql/relational-databases/system-stored-procedures/sys-sp-verify-database-ledger-from-digest-storage-transact-sql) system stored procedure, specifying the JSON objects from the [sys.database_ledger_digest_locations](/sql/relational-databases/system-catalog-views/sys-database-ledger-digest-locations-transact-sql)  system catalog view where database digests are configured to be stored. 

Using automatic digest storage allows you to change storage locations throughout the lifecycle of the ledger tables.  For example, if you start by using Azure Immutable Blob storage to store your digest files, but later you want to use Azure Confidential Ledger instead, you are able to do so. This change in location is stored in [sys.database_ledger_digest_locations](/sql/relational-databases/system-catalog-views/sys-database-ledger-digest-locations-transact-sql). To simplify running verification when multiple digest storage locations have been used, the following script will fetch the locations of the digests and execute verification using those locations.

```sql
DECLARE @digest_locations NVARCHAR(MAX) = (SELECT * FROM sys.database_ledger_digest_locations FOR JSON AUTO, INCLUDE_NULL_VALUES);
SELECT @digest_locations as digest_locations;
BEGIN TRY
    EXEC sys.sp_verify_database_ledger_from_digest_storage @digest_locations;
    SELECT 'Ledger verification succeeded.' AS Result;
END TRY
BEGIN CATCH
    THROW;
END CATCH
```

### Database verification using manual digest storage

When using manual digest storage for generating and storing database digests, the following stored procedure is used to verify the ledger, appending the JSON content of the digest in the stored procedure. When running database verification, you can choose to verify all tables in the database, or specific tables. Below is the syntax for the [sp_verify_database_ledger](/sql/relational-databases/system-stored-procedures/sys-sp-verify-database-ledger-transact-sql) stored procedure:

```sql
sp_verify_database_ledger <JSON_document_containing_digests>, <table_name> 
```

Below is an example of running the [sp_verify_database_ledger](/sql/relational-databases/system-stored-procedures/sys-sp-verify-database-ledger-transact-sql) stored procedure by passing two digests for verification: 

```sql
EXECUTE sp_verify_database_ledger N'
[
    {
        "database_name":  "ledgerdb",
        "block_id":  0,
        "hash":  "0xDC160697D823C51377F97020796486A59047EBDBF77C3E8F94EEE0FFF7B38A6A",
        "last_transaction_commit_time":  "2020-11-12T18:01:56.6200000",
        "digest_time":  "2020-11-12T18:39:27.7385724"
    },
    {
        "database_name":  "ledgerdb",
        "block_id":  1,
        "hash":  "0xE5BE97FDFFA4A16ADF7301C8B2BEBC4BAE5895CD76785D699B815ED2653D9EF8",
        "last_transaction_commit_time":  "2020-11-12T18:39:35.6633333",
        "digest_time":  "2020-11-12T18:43:30.4701575"
    }
]
```

Return codes for `sp_verify_database_ledger` and `sp_verify_database_ledger_from_digest_storage` are `0` (**success**) or `1` (**failure**).

## Next steps

- [Azure SQL Database ledger overview](ledger-overview.md)
- [Updatable ledger tables](ledger-updatable-ledger-tables.md)   
- [Append-only ledger tables](ledger-append-only-ledger-tables.md)   
- [Database ledger](ledger-database-ledger.md)   
