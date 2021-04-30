---
title: Remove TDE protector (PowerShell & the Azure CLI)
titleSuffix: Azure SQL Database & Azure Synapse Analytics 
description: "Learn how to respond to a potentially compromised TDE protector for Azure SQL Database or Azure Synapse Analytics using TDE with Bring Your Own Key (BYOK) support."
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: seo-lt-2019 sqldbrb=1, devx-track-azurecli
ms.devlang:
ms.topic: how-to
author: shohamMSFT
ms.author: shohamd
ms.reviewer: vanto
ms.date: 02/24/2020
---
# Remove a Transparent Data Encryption (TDE) protector using PowerShell
[!INCLUDE[appliesto-sqldb-asa](../includes/appliesto-sqldb-asa.md)]


This topic describes how to respond to a potentially compromised TDE protect for Azure SQL Database or Azure Synapse Analytics that is using TDE with customer-managed keys in Azure Key Vault - Bring Your Own Key (BYOK) support. To learn more about BYOK support for TDE, see the [overview page](transparent-data-encryption-byok-overview.md).

> [!CAUTION]
> The procedures outlined in this article should only be done in extreme cases or in test environments. Review the steps carefully, as deleting actively used TDE protectors from Azure Key Vault will result in **database becoming unavailable**.

If a key is ever suspected to be compromised, such that a service or user had unauthorized access to the key, it's best to delete the key.

Keep in mind that once the TDE protector is deleted in Key Vault, in up to 10 minutes, all encrypted databases will start denying all connections with the corresponding error message and change its state to [Inaccessible](./transparent-data-encryption-byok-overview.md#inaccessible-tde-protector).

This how-to guide goes over two approaches depending on the desired result after a compromised incident response:

- To make the databases in Azure SQL Database / Azure Synapse Analytics **inaccessible**.
- To make the databases in Azure SQL Database / Azure Azure Synapse Analytics **inaccessible**.

## Prerequisites

- You must have an Azure subscription and be an administrator on that subscription
- You must have Azure PowerShell installed and running.
- This how-to guide assumes that you are already using a key from Azure Key Vault as the TDE protector for an Azure SQL Database or Azure Synapse. See [Transparent Data Encryption with BYOK Support](transparent-data-encryption-byok-overview.md) to learn more.

# [PowerShell](#tab/azure-powershell)

 For Az module installation instructions, see [Install Azure PowerShell](/powershell/azure/install-az-ps). For specific cmdlets, see [AzureRM.Sql](/powershell/module/AzureRM.Sql/).

> [!IMPORTANT]
> The PowerShell Azure Resource Manager (RM) module is still supported but all future development is for the Az.Sql module. The AzureRM module will continue to receive bug fixes until at least December 2020.  The arguments for the commands in the Az module and in the AzureRm modules are substantially identical. For more about their compatibility, see [Introducing the new Azure PowerShell Az module](/powershell/azure/new-azureps-module-az).

# [The Azure CLI](#tab/azure-cli)

For installation, see [Install the Azure CLI](/cli/azure/install-azure-cli).

* * *

## Check TDE Protector thumbprints

The following steps outline how to check the TDE Protector thumbprints still in use by Virtual Log Files (VLF) of a given database.
The thumbprint of the current TDE protector of the database, and the database ID can be found by running:

```sql
SELECT [database_id],
       [encryption_state],
       [encryptor_type], /*asymmetric key means AKV, certificate means service-managed keys*/
       [encryptor_thumbprint]
 FROM [sys].[dm_database_encryption_keys]
```

The following query returns the VLFs and the TDE Protector respective thumbprints in use. Each different thumbprint refers to different key in Azure Key Vault (AKV):

```sql
SELECT * FROM sys.dm_db_log_info (database_id)
```

Alternatively, you can use PowerShell or the Azure CLI:

# [PowerShell](#tab/azure-powershell)

The PowerShell command **Get-AzureRmSqlServerKeyVaultKey** provides the thumbprint of the TDE Protector used in the query, so you can see which keys to keep and which keys to delete in AKV. Only keys no longer used by the database can be safely deleted from Azure Key Vault.

# [The Azure CLI](#tab/azure-cli)

The PowerShell command **az sql server key show** provides the thumbprint of the TDE Protector used in the query, so you can see which keys to keep and which keys to delete in AKV. Only keys no longer used by the database can be safely deleted from Azure Key Vault.

* * *

## Keep encrypted resources accessible

# [PowerShell](#tab/azure-powershell)

1. Create a [new key in Key Vault](/powershell/module/az.keyvault/add-azkeyvaultkey). Make sure this new key is created in a separate key vault from the potentially compromised TDE protector, since access control is provisioned on a vault level.

2. Add the new key to the server using the [Add-AzSqlServerKeyVaultKey](/powershell/module/az.sql/add-azsqlserverkeyvaultkey) and [Set-AzSqlServerTransparentDataEncryptionProtector](/powershell/module/az.sql/set-azsqlservertransparentdataencryptionprotector) cmdlets and update it as the server's new TDE protector.

   ```powershell
   # add the key from Key Vault to the server  
   Add-AzSqlServerKeyVaultKey -ResourceGroupName <SQLDatabaseResourceGroupName> -ServerName <LogicalServerName> -KeyId <KeyVaultKeyId>

   # set the key as the TDE protector for all resources under the server
   Set-AzSqlServerTransparentDataEncryptionProtector -ResourceGroupName <SQLDatabaseResourceGroupName> `
       -ServerName <LogicalServerName> -Type AzureKeyVault -KeyId <KeyVaultKeyId>
   ```

3. Make sure the server and any replicas have updated to the new TDE protector using the [Get-AzSqlServerTransparentDataEncryptionProtector](/powershell/module/az.sql/get-azsqlservertransparentdataencryptionprotector) cmdlet.

   > [!NOTE]
   > It may take a few minutes for the new TDE protector to propagate to all databases and secondary databases under the server.

   ```powershell
   Get-AzSqlServerTransparentDataEncryptionProtector -ServerName <LogicalServerName> -ResourceGroupName <SQLDatabaseResourceGroupName>
   ```

4. Take a [backup of the new key](/powershell/module/az.keyvault/backup-azkeyvaultkey) in Key Vault.

   ```powershell
   # -OutputFile parameter is optional; if removed, a file name is automatically generated.
   Backup-AzKeyVaultKey -VaultName <KeyVaultName> -Name <KeyVaultKeyName> -OutputFile <DesiredBackupFilePath>
   ```

5. Delete the compromised key from Key Vault using the [Remove-AzKeyVaultKey](/powershell/module/az.keyvault/remove-azkeyvaultkey) cmdlet.

   ```powershell
   Remove-AzKeyVaultKey -VaultName <KeyVaultName> -Name <KeyVaultKeyName>
   ```

6. To restore a key to Key Vault in the future using the [Restore-AzKeyVaultKey](/powershell/module/az.keyvault/restore-azkeyvaultkey) cmdlet:

   ```powershell
   Restore-AzKeyVaultKey -VaultName <KeyVaultName> -InputFile <BackupFilePath>
   ```

# [The Azure CLI](#tab/azure-cli)

For command reference, see the [Azure CLI keyvault](/cli/azure/keyvault/key).

1. Create a [new key in Key Vault](/cli/azure/keyvault/key#az_keyvault_key_create). Make sure this new key is created in a separate key vault from the potentially compromised TDE protector, since access control is provisioned on a vault level.

2. Add the new key to the server and update it as the new TDE protector of the server.

   ```azurecli
   # add the key from Key Vault to the server  
   az sql server key create --kid <KeyVaultKeyId> --resource-group <SQLDatabaseResourceGroupName> --server <LogicalServerName>

   # set the key as the TDE protector for all resources under the server
   az sql server tde-key set --server-key-type AzureKeyVault --kid <KeyVaultKeyId> --resource-group <SQLDatabaseResourceGroupName> --server <LogicalServerName>
   ```

3. Make sure the server and any replicas have updated to the new TDE protector.

   > [!NOTE]
   > It may take a few minutes for the new TDE protector to propagate to all databases and secondary databases under the server.

   ```azurecli
   az sql server tde-key show --resource-group <SQLDatabaseResourceGroupName> --server <LogicalServerName>
   ```

4. Take a backup of the new key in Key Vault.

   ```azurecli
   # --file parameter is optional; if removed, a file name is automatically generated.
   az keyvault key backup --file <DesiredBackupFilePath> --name <KeyVaultKeyName> --vault-name <KeyVaultName>
   ```

5. Delete the compromised key from Key Vault.

   ```azurecli
   az keyvault key delete --name <KeyVaultKeyName> --vault-name <KeyVaultName>
   ```

6. To restore a key to Key Vault in the future.

   ```azurecli
   az keyvault key restore --file <BackupFilePath> --vault-name <KeyVaultName>
   ```

* * *

## Make encrypted resources inaccessible

1. Drop the databases that are being encrypted by the potentially compromised key.

   The database and log files are automatically backed up, so a point-in-time restore of the database can be done at any point (as long as you provide the key). The databases must be dropped before deletion of an active TDE protector to prevent potential data loss of up to 10 minutes of the most recent transactions.

2. Back up the key material of the TDE protector in Key Vault.
3. Remove the potentially compromised key from Key Vault

[!INCLUDE [sql-database-akv-permission-delay](../includes/sql-database-akv-permission-delay.md)]

## Next steps

- Learn how to rotate the TDE protector of a server to comply with security requirements: [Rotate the Transparent Data Encryption protector Using PowerShell](transparent-data-encryption-byok-key-rotation.md)
- Get started with Bring Your Own Key support for TDE: [Turn on TDE using your own key from Key Vault using PowerShell](transparent-data-encryption-byok-configure.md)