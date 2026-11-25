---
title: Transparent Data Encryption
titleSuffix: Azure Synapse Analytics
description: Learn how Transparent Data Encryption protects standalone dedicated SQL pools in Azure Synapse Analytics.
author: Pietervanhove
ms.author: pivanho
ms.reviewer: vanto
ms.date: 10/05/2026
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: concept-article
ms.custom:
  - sfi-image-nochange
---

# Transparent Data Encryption for Azure Synapse Analytics

[!INCLUDE [synapse-fabric-migration](../includes/synapse-fabric-migration.md)]

**Applies to:** Azure Synapse Analytics dedicated SQL pools (formerly SQL DW)

[Transparent Data Encryption (TDE)](/sql/relational-databases/security/encryption/transparent-data-encryption) protects a dedicated SQL pool against malicious offline activity by encrypting database files, transaction log files, and backups at rest. Encryption and decryption occur in real time and don't require application changes. 

You must manually enable TDE for an Azure Synapse Analytics standalone dedicated SQL pool.


TDE performs real-time I/O encryption and decryption of the data at the page level. Each page is decrypted when it's read into memory and then encrypted before being written to disk. TDE encrypts the storage of an entire database by using a symmetric key called the Database Encryption Key (DEK). On database startup, the encrypted DEK is decrypted and then used for decryption and re-encryption of the database files in the SQL Server database engine process. The TDE protector protects the DEK. The TDE protector is either a service-managed certificate (service-managed transparent data encryption).

For Azure Synapse, you set the TDE protector at the server level and all databases associated with that server inherit it.

> [!NOTE]
> This article covers standalone dedicated SQL pools (formerly SQL DW) hosted on a [logical server](logical-servers.md). For dedicated SQL pools in a Synapse workspace, see [Encryption for Azure Synapse Analytics workspaces](../security/workspaces-encryption.md).

## How TDE works

TDE encrypts database pages by using a symmetric Database Encryption Key (DEK). The DEK is stored in the database boot record and the TDE protector protects it. The protector is a service-managed certificate.

You configure the TDE protector on the logical server and the dedicated SQL pools on that server inherit it. Each page is decrypted when read into memory and encrypted before being written to storage.

## Service-managed TDE

In Azure, the default setting for TDE is that the DEK is protected by a built-in server certificate. The built-in server certificate is unique for each server and the encryption algorithm used is AES 256 in Cipher Block Chaining (CBC) mode. If a database is in a geo-replication relationship, both the primary and geo-secondary databases are protected by the primary database's parent server key. If two databases are connected to the same server, they also share the same built-in certificate. Microsoft automatically rotates these certificates once a year, in compliance with the internal security policy, and the root key is protected by a Microsoft internal secret store. Customers can verify SQL Database and SQL Managed Instance compliance with internal security policies in independent third-party audit reports available on the [Microsoft Trust Center](https://servicetrust.microsoft.com/).
Microsoft also seamlessly moves and manages the keys as needed for geo-replication and restores.

## Customer-managed TDE

With customer-managed TDE, the protector is an asymmetric key that you control in Azure Key Vault or Azure Key Vault Managed HSM. You control key creation, access permissions, rotation, backup, and deletion. The key doesn't leave the key store.

Revoking the logical server's access to the key makes encrypted dedicated SQL pools inaccessible. Protect the key store with soft delete, purge protection, monitoring, and least-privilege access.

Azure Synapse needs to be granted permissions to the customer-owned key vault to decrypt and encrypt the DEK. If permissions of the server to the key vault are revoked, a database will be inaccessible, and all data is encrypted.

For requirements and recommendations, see [Customer-managed TDE for Azure Synapse Analytics](transparent-data-encryption-byok-overview.md).

## Move a Transparent Data Encryption-protected database

You don't need to decrypt databases for operations within Azure. The TDE settings on the source database or primary database are transparently inherited on the target. Operations that are included involve:

- Geo-restore
- Self-service point-in-time restore
- Restoration of a deleted database
- Active geo-replication
- Creation of a database copy

When you export a TDE-protected database to a BACPAC file, the exported content of the database isn't encrypted. If you import into an existing empty database, the encryption depends on whether TDE is enabled on that database or not. 

## Manage Transparent Data Encryption

### Azure portal

To enable or disable TDE, open the dedicated SQL pool in the [Azure portal](https://portal.azure.com), select **Transparent data encryption**, and save the required state. To configure a customer-managed protector, open **Transparent data encryption** on the logical server and select the key from Azure Key Vault. Find the TDE settings under your user database. By default, server level encryption key is used. A TDE certificate is automatically generated for the server that contains the database.

### PowerShell
Manage TDE by using PowerShell.

> [!IMPORTANT]  
> The `Az` module replaces `AzureRM`. All future development is for the `Az.Sql` module.

To configure TDE through PowerShell, you must be connected as the Azure Owner, Contributor, or SQL Security Manager.

Use the following Az.Sql cmdlets:

| Cmdlet | Purpose |
| --- | --- |
| [Set-AzSqlDatabaseTransparentDataEncryption](/powershell/module/az.sql/set-azsqldatabasetransparentdataencryption) | Enable or disable TDE for a dedicated SQL pool. |
| [Get-AzSqlDatabaseTransparentDataEncryption](/powershell/module/az.sql/get-azsqldatabasetransparentdataencryption) | Get the current TDE state. |
| [Add-AzSqlServerKeyVaultKey](/powershell/module/az.sql/add-azsqlserverkeyvaultkey) | Add a key to the logical server. |
| [Get-AzSqlServerKeyVaultKey](/powershell/module/az.sql/get-azsqlserverkeyvaultkey) | List keys available to the logical server. |
| [Set-AzSqlServerTransparentDataEncryptionProtector](/powershell/module/az.sql/set-azsqlservertransparentdataencryptionprotector) | Set the server's TDE protector. |
| [Get-AzSqlServerTransparentDataEncryptionProtector](/powershell/module/az.sql/get-azsqlservertransparentdataencryptionprotector) | Get the current TDE protector. |
| [Remove-AzSqlServerKeyVaultKey](/powershell/module/az.sql/remove-azsqlserverkeyvaultkey) | Remove a key from the logical server. |

### Transact-SQL

Manage TDE by using Transact-SQL.

Connect to the database by using a login that is an administrator or member of the **dbmanager** role in the `master` database.


| Command | Description |
| --- | --- |
| [ALTER DATABASE (Azure SQL Database)](/sql/t-sql/statements/alter-database-azure-sql-database?view=azure-sqldw-latest&preserve-view=true) | `SET ENCRYPTION ON/OFF` encrypts or decrypts a database |
| [sys.dm_database_encryption_keys](/sql/relational-databases/system-dynamic-management-views/sys-dm-database-encryption-keys-transact-sql?view=azure-sqldw-latest&preserve-view=true) | Returns information about the encryption state of a database and its associated database encryption keys |
| [sys.dm_pdw_nodes_database_encryption_keys](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-nodes-database-encryption-keys-transact-sql?view=azure-sqldw-latest&preserve-view=true) | Returns information about the encryption state of each Azure Synapse node and its associated database encryption keys |

You can't switch the TDE protector to a key from Azure Key Vault by using Transact-SQL. Use PowerShell or the Azure portal.

### REST API

The following SQL management resources apply to the logical server and dedicated SQL pool.

To configure TDE through the REST API, you must be connected as the Azure Owner, Contributor, or SQL Security Manager.

Use the following set of commands for Azure Synapse Analytics standalone dedicated SQL pools:

| Command | Description |
| --- | --- |
| [Create Or Update Server](/rest/api/sql/servers/create-or-update) | Adds an identity from Microsoft Entra ID ([formerly Azure Active Directory](/entra/fundamentals/new-name)) to a server. (used to grant access to Azure Key Vault) |
| [Create Or Update Server Key](/rest/api/sql/server-keys/create-or-update) | Adds an Azure Key Vault key to a server. |
| [Delete Server Key](/rest/api/sql/server-keys/delete) | Removes an Azure Key Vault key from a server. |
| [Get Server Keys](/rest/api/sql/server-keys/get) | Gets a specific Azure Key Vault key from a server. |
| [List Server Keys By Server](/rest/api/sql/server-keys/list-by-server) | Gets the Azure Key Vault keys for a server. |
| [Create Or Update Encryption Protector](/rest/api/sql/encryption-protectors/create-or-update) | Sets the TDE protector for a server. |
| [Get Encryption Protector](/rest/api/sql/encryption-protectors/get) | Gets the TDE protector for a server. |
| [List Encryption Protectors By Server](/rest/api/sql/encryption-protectors/list-by-server) | Gets the TDE protectors for a server. |
| [Create Or Update Transparent Data Encryption Configuration](/rest/api/sql/transparent-data-encryptions/create-or-update) | Enables or disables TDE for a database. |
| [Get Transparent Data Encryption Configuration](/rest/api/sql/transparent-data-encryptions/get) | Gets the TDE configuration for a database. |
| [List Transparent Data Encryption Configuration Results](/rest/api/sql/transparent-data-encryptions/list-by-database) | Gets the encryption result for a database. |

## Related content

- [Customer-managed TDE for Azure Synapse Analytics](transparent-data-encryption-byok-overview.md)
- [Rotate the TDE protector](transparent-data-encryption-byok-key-rotation.md)
- [Remove a TDE protector](transparent-data-encryption-byok-remove-tde-protector.md)
- [Get started with Transparent Data Encryption (TDE) for dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics](../sql-data-warehouse/sql-data-warehouse-encryption-tde.md)
