---
title: "Digest management and database verification"
description: This article provides information on digest management and database verification for a ledger database in Azure SQL Database.
ms.custom: references_regions
ms.date: "07/23/2021" 
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
> Azure SQL Database ledger is currently in public preview and available in West Europe, Brazil South, and West Central US.

Azure SQL Database ledger provides a form of data integrity called *forward integrity*, which provides evidence of data tampering on data in your ledger tables. For example, if a banking transaction occurs on a ledger table where a balance has been updated to value `x`, and an attacker later modifies the data by changing the balance from `x` to `y`, database verification will detect this tampering activity.  

The database verification process takes as input one or more previously generated database digests. It then recomputes the hashes stored in the database ledger based on the current state of the ledger tables. If the computed hashes don't match the input digests, the verification fails. The failure indicates that the data has been tampered with. The verification process reports all inconsistencies that it detects.

## Database digests

The hash of the latest block in the database ledger is called the *database digest*. It represents the state of all ledger tables in the database at the time when the block was generated. Generating a database digest is efficient, because it involves computing only the hashes of the blocks that were recently appended. 

Database digests can be generated either automatically by the system or manually by the user. You can use them later to verify the integrity of the database. 

Database digests are generated in the form of a JSON document that contains the hash of the latest block, together with metadata for the block ID. The metadata includes the time that the digest was generated and the commit time stamp of the last transaction in this block.

The verification process and the integrity of the database depend on the integrity of the input digests. For this purpose, database digests that are extracted from the database need to be stored in trusted storage that the high-privileged users or attackers of the Azure SQL Database server can't tamper with.

### Automatic generation and storage of database digests

Azure SQL Database ledger integrates with the [immutable storage feature of Azure Blob Storage](../../storage/blobs/immutable-storage-overview.md) and [Azure Confidential Ledger](../../confidential-ledger/index.yml). This integration provides secure storage services in Azure to help protect the database digests from potential tampering. This integration provides a simple and cost-effective way for users to automate digest management without having to worry about their availability and geographic replication. 

You can configure automatic generation and storage of database digests through the Azure portal, PowerShell, or the Azure CLI. When you configure automatic generation and storage, database digests are generated on a predefined interval of 30 seconds and uploaded to the selected storage service. If no transactions occur in the system in the 30-second interval, a database digest won't be generated and uploaded. This mechanism ensures that database digests are generated only when data has been updated in your database.

:::image type="content" source="media/ledger/automatic-digest-management.png" alt-text="Screenshot that shows the selections for enabling digest storage."::: 

> [!IMPORTANT]
> Configure an [immutability policy](../../storage/blobs/immutable-policy-configure-version-scope.md) on your container after provisioning to ensure that database digests are protected from tampering.

### Manual generation and storage of database digests

You can also use Azure SQL Database ledger to generate a database digest on demand so that you can manually store the digest in any service or device that you consider a trusted storage destination. For example, you might choose an on-premises write once, read many (WORM) device as a destination. You manually generate a database digest by running the [sys.sp_generate_database_ledger_digest](/sql/relational-databases/system-stored-procedures/sys-sp-generate-database-ledger-digest-transact-sql) stored procedure in either [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms) or [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio).

> [!IMPORTANT]
> Generating database digests requires the **GENERATE LEDGER DIGEST** permission. For details on permissions related to ledger tables, see [Permissions](/sql/relational-databases/security/permissions-database-engine#asdbpermissions). 

```sql
EXECUTE sp_generate_database_ledger_digest
```

The returned result set is a single row of data. It should be saved to the trusted storage location as a JSON document as follows:

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

The verification process scans all ledger and history tables. It recomputes the SHA-256 hashes of their rows and compares them against the database digest files passed to the verification stored procedure. 

For large ledger tables, database verification can be a resource-intensive process. You should use it only when you need to verify the integrity of a database. 

The verification process can be executed hourly or daily for cases where the integrity of the database needs to be frequently monitored. Or it can be executed only when the organization that's hosting the data goes through an audit and needs to provide cryptographic evidence about the integrity of the data. To reduce the cost of verification, ledger exposes options to verify individual ledger tables or only a subset of the ledger tables. 

You accomplish database verification through two stored procedures, depending on whether you [use automatic digest storage](#database-verification-that-uses-automatic-digest-storage) or you [manually manage digests](#database-verification-that-uses-manual-digest-storage).

> [!IMPORTANT]
> Database verification requires the *View Ledger Content* permission. For details on permissions related to ledger tables, see [Permissions](/sql/relational-databases/security/permissions-database-engine#asdbpermissions). 

### Database verification that uses automatic digest storage

When you're using automatic digest storage for generating and storing database digests, the location of the digest storage is in the system catalog view [sys.database_ledger_digest_locations](/sql/relational-databases/system-catalog-views/sys-database-ledger-digest-locations-transact-sql) as JSON objects. Running database verification consists of executing the [sp_verify_database_ledger_from_digest_storage](/sql/relational-databases/system-stored-procedures/sys-sp-verify-database-ledger-from-digest-storage-transact-sql) system stored procedure. Specify the JSON objects from the [sys.database_ledger_digest_locations](/sql/relational-databases/system-catalog-views/sys-database-ledger-digest-locations-transact-sql)  system catalog view where database digests are configured to be stored. 

When you use automatic digest storage, you can change storage locations throughout the lifecycle of the ledger tables.  For example, if you start by using Azure immutable storage to store your digest files, but later you want to use Azure Confidential Ledger instead, you can do so. This change in location is stored in [sys.database_ledger_digest_locations](/sql/relational-databases/system-catalog-views/sys-database-ledger-digest-locations-transact-sql). 

To simplify running verification when you use multiple digest storage locations, the following script will fetch the locations of the digests and execute verification by using those locations.

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

### Database verification that uses manual digest storage

When you're using manual digest storage for generating and storing database digests, the following stored procedure is used to verify the ledger database. The JSON content of the digest is appended in the stored procedure. When you're running database verification, you can choose to verify all tables in the database or verify specific tables. 

Here's the syntax for the [sp_verify_database_ledger](/sql/relational-databases/system-stored-procedures/sys-sp-verify-database-ledger-transact-sql) stored procedure:

```sql
sp_verify_database_ledger <JSON_document_containing_digests>, <table_name> 
```

The following code is an example of running the [sp_verify_database_ledger](/sql/relational-databases/system-stored-procedures/sys-sp-verify-database-ledger-transact-sql) stored procedure by passing two digests for verification: 

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
'
```

Return codes for `sp_verify_database_ledger` and `sp_verify_database_ledger_from_digest_storage` are `0` (success) or `1` (failure).

## Next steps

- [Azure SQL Database ledger overview](ledger-overview.md)
- [Updatable ledger tables](ledger-updatable-ledger-tables.md)   
- [Append-only ledger tables](ledger-append-only-ledger-tables.md)   
- [Database ledger](ledger-database-ledger.md)