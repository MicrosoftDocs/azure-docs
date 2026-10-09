---
title: Remove TDE Protector (PowerShell and Azure CLI)
titleSuffix: Azure Synapse Analytics
description: Respond to a potentially compromised customer-managed TDE protector for a standalone dedicated SQL pool in Azure Synapse Analytics.
author: Pietervanhove
ms.author: pivanho
ms.reviewer: vanto
ms.date: 10/05/2026
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: how-to
ms.custom:
  - devx-track-azurecli
  - devx-track-azurepowershell
---

# Remove a Transparent Data Encryption protector in Azure Synapse Analytics

[!INCLUDE [synapse-fabric-migration](../includes/synapse-fabric-migration.md)]

**Applies to:** Azure Synapse Analytics dedicated SQL pools (formerly SQL DW)

Use this procedure when a customer-managed TDE protector might be compromised. Rotate to a new protector before deleting or disabling the old key so that the dedicated SQL pools remain accessible.

> [!CAUTION]
> Deleting or disabling an active TDE protector makes every dedicated SQL pool that depends on it inaccessible. Review the incident-response plan and backup-retention requirements before removing a key.

> [!NOTE]
> This article covers standalone dedicated SQL pools (formerly SQL DW). For dedicated SQL pools in a Synapse workspace, see [Encryption for Azure Synapse Analytics workspaces](../security/workspaces-encryption.md).

Deleting a key doesn't invalidate copies of that key that were previously backed up or restored to another key vault. Protect and inventory every copy as part of the incident response.

## Prerequisites

- You must have an Azure subscription and be an administrator on that subscription.
- You must have Azure PowerShell installed and running.
- You must be able to manage the logical server, key vault permissions, and keys.
- Install [Azure PowerShell](/powershell/azure/install-az-ps) or the [Azure CLI](/cli/azure/install-azure-cli).
    - For Az module installation instructions, see [Install Azure PowerShell](/powershell/azure/install-az-ps). Use [the new Azure PowerShell Az module](/powershell/azure/new-azureps-module-az).
    - For installation, see [Install Azure CLI](/cli/azure/install-azure-cli).
- Review [Customer-managed TDE for Azure Synapse Analytics](transparent-data-encryption-byok-overview.md) and [Rotate the TDE protector](transparent-data-encryption-byok-key-rotation.md).
- This article assumes that you're already using a key from Azure Key Vault as the TDE protector for Azure Synapse. See [Customer-managed TDE for Azure Synapse Analytics](transparent-data-encryption-byok-overview.md) to learn more.

## Check TDE protector thumbprints

The following steps outline how to check the TDE protector thumbprints that Virtual Log Files (VLF) of a given database still use.

Run the following query to find the thumbprint of the current TDE protector for the database and the database ID:

```sql
SELECT [database_id],
       [encryption_state],
       [encryptor_type], /*asymmetric key means Azure Key Vault, certificate means service-managed keys*/
       [encryptor_thumbprint]
 FROM [sys].[dm_database_encryption_keys]
```

Run the following query to return the VLFs and the TDE protector thumbprints in use. Each different thumbprint refers to a different key in Azure Key Vault:

```sql
SELECT * FROM sys.dm_db_log_info (database_id)
```

Alternatively, you can use PowerShell or Azure CLI:

- The PowerShell command `Get-AzSqlServerKeyVaultKey` provides the thumbprint of the TDE protector used in the query, so you can see which keys to keep and which keys to delete in Azure Key Vault. Only keys that the database no longer uses can be safely deleted from Azure Key Vault.

- The Azure CLI command `az sql server key show` provides the thumbprint of the TDE protector used in the query, so you can see which keys to keep and which keys to delete in Azure Key Vault. Only keys that the database no longer uses can be safely deleted from Azure Key Vault.

## Keep encrypted resources accessible

### PowerShell

1. Create a [new key in Azure Key Vault](/powershell/module/az.keyvault/add-azkeyvaultkey). Ensure you create this new key in a separate key vault from the potentially compromised TDE protector, since access control is provisioned on a vault level.

1. Add the new key to the server by using the [Add-AzSqlServerKeyVaultKey](/powershell/module/az.sql/add-azsqlserverkeyvaultkey) and [Set-AzSqlServerTransparentDataEncryptionProtector](/powershell/module/az.sql/set-azsqlservertransparentdataencryptionprotector) cmdlets, and update it as the server's new TDE protector.

   ```powershell
   # add the key from Azure Key Vault to the server  
   Add-AzSqlServerKeyVaultKey -ResourceGroupName <SQLDatabaseResourceGroupName> -ServerName <LogicalServerName> -KeyId <KeyVaultKeyId>

   # set the key as the TDE protector for all resources under the server
   Set-AzSqlServerTransparentDataEncryptionProtector -ResourceGroupName <SQLDatabaseResourceGroupName> `
       -ServerName <LogicalServerName> -Type AzureKeyVault -KeyId <KeyVaultKeyId>
   ```

1. Ensure the server and any replicas update to the new TDE protector by using the [Get-AzSqlServerTransparentDataEncryptionProtector](/powershell/module/az.sql/get-azsqlservertransparentdataencryptionprotector) cmdlet.

   > [!NOTE]
   > It might take a few minutes for the new TDE protector to propagate to all databases and secondary databases under the server.

   ```powershell
   Get-AzSqlServerTransparentDataEncryptionProtector -ServerName <LogicalServerName> -ResourceGroupName <SQLDatabaseResourceGroupName>
   ```

1. Take a [backup of the new key](/powershell/module/az.keyvault/backup-azkeyvaultkey) in Azure Key Vault.

   ```powershell
   # -OutputFile parameter is optional; if removed, a file name is automatically generated.
   Backup-AzKeyVaultKey -VaultName <KeyVaultName> -Name <KeyVaultKeyName> -OutputFile <DesiredBackupFilePath>
   ```

1. Delete the compromised key from Azure Key Vault by using the [Remove-AzKeyVaultKey](/powershell/module/az.keyvault/remove-azkeyvaultkey) cmdlet.

   ```powershell
   Remove-AzKeyVaultKey -VaultName <KeyVaultName> -Name <KeyVaultKeyName>
   ```

1. To restore a key to Azure Key Vault in the future, use the [Restore-AzKeyVaultKey](/powershell/module/az.keyvault/restore-azkeyvaultkey) cmdlet.

   ```powershell
   Restore-AzKeyVaultKey -VaultName <KeyVaultName> -InputFile <BackupFilePath>
   ```

### Azure CLI

For command reference, see [Azure CLI keyvault](/cli/azure/keyvault/key).

1. Create a [new key in Azure Key Vault](/cli/azure/keyvault/key#az-keyvault-key-create). Ensure you create this new key in a separate key vault from the potentially compromised TDE protector, since access control is provisioned on a vault level.

1. Add the new key to the server and update it as the new TDE protector of the server.

   ```azurecli
   # add the key from Azure Key Vault to the server  
   az sql server key create --kid <KeyVaultKeyId> --resource-group <SQLDatabaseResourceGroupName> --server <LogicalServerName>

   # set the key as the TDE protector for all resources under the server
   az sql server tde-key set --server-key-type AzureKeyVault --kid <KeyVaultKeyId> --resource-group <SQLDatabaseResourceGroupName> --server <LogicalServerName>
   ```

1. Ensure the server and any replicas update to the new TDE protector.

   > [!NOTE]
   > It might take a few minutes for the new TDE protector to propagate to all databases and secondary databases under the server.

   ```azurecli
   az sql server tde-key show --resource-group <SQLDatabaseResourceGroupName> --server <LogicalServerName>
   ```

1. Take a backup of the new key in Azure Key Vault.

   ```azurecli
   # --file parameter is optional; if removed, a file name is automatically generated.
   az keyvault key backup --file <DesiredBackupFilePath> --name <KeyVaultKeyName> --vault-name <KeyVaultName>
   ```

1. Delete the compromised key from Azure Key Vault.

   ```azurecli
   az keyvault key delete --name <KeyVaultKeyName> --vault-name <KeyVaultName>
   ```

1. Restore a key to Azure Key Vault in the future.

   ```azurecli
   az keyvault key restore --file <BackupFilePath> --vault-name <KeyVaultName>
   ```

## Make encrypted resources inaccessible

1. Drop the databases that use the potentially compromised key for encryption.

   The system automatically backs up the database and log files, so you can perform a point-in-time restore of the database at any point (as long as you provide the key). Drop the databases before you delete an active TDE protector to avoid potential data loss of up to 10 minutes of the most recent transactions.

1. Back up the key material of the TDE protector in Azure Key Vault.
1. Remove the potentially compromised key from Azure Key Vault.

> [!NOTE]
> It might take around 10 minutes for any permission changes to take effect for the key vault. This time includes revoking access permissions to the TDE protector in AKV, and users might still have access permissions.

## Related content

- [Customer-managed TDE for Azure Synapse Analytics](transparent-data-encryption-byok-overview.md)
- [Rotate the TDE protector](transparent-data-encryption-byok-key-rotation.md)
- [Azure Key Vault backup security considerations](/azure/key-vault/general/backup#security-considerations)
