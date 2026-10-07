---
title: Rotate TDE Protector (PowerShell and Azure CLI)
titleSuffix: Azure Synapse Analytics
description: Rotate the customer-managed TDE protector for a standalone Azure Synapse Analytics dedicated SQL pool by using the Azure portal, PowerShell, or Azure CLI.
author: Pietervanhove
ms.author: pivanho
ms.reviewer: vanto
ms.date: 10/06/2026
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: how-to
ms.custom:
  - devx-track-azurecli
  - devx-track-azurepowershell
  - sfi-image-nochange
---

# Rotate the Transparent Data Encryption protector in Azure Synapse Analytics

[!INCLUDE [synapse-fabric-migration](../includes/synapse-fabric-migration.md)]

**Applies to:** Azure Synapse Analytics dedicated SQL pools (formerly SQL DW)


This article describes key rotation for a SQL server that uses a TDE protector from Azure Key Vault. Rotating the logical TDE protector for a server means switching to a new supported key that protects the databases on the server. Depending on the configuration, the TDE protector can be backed by a supported asymmetric (RSA) or symmetric (AES) key stored in Azure Key Vault or Azure Key Vault Managed HSM. Key rotation is an online operation and should only take a few seconds to complete, because this operation only decrypts and re-encrypts the database's data encryption key, not the entire database.

This article discusses both automated and manual methods to rotate the TDE protector on the server.

> [!NOTE]
> This article covers standalone dedicated SQL pools (formerly SQL DW). For dedicated SQL pools in a Synapse workspace, see [Encryption for Azure Synapse Analytics workspaces](../security/workspaces-encryption.md).

## Important considerations

- Retain old key versions for at least the database backup retention period. Restoring an older backup requires the protector that encrypted it.
- Retain old keys even if you switch back to a service-managed protector.
- A paused dedicated SQL pool must be [resumed](../sql-data-warehouse/pause-and-resume-compute-portal.md) before rotation.
- The combined key vault name and key name can't exceed 94 characters.

## Prerequisites

- This article assumes that you're already using a key from Azure Key Vault as the TDE protector for Azure SQL Database or Azure Synapse Analytics. For more information, see [Customer-managed TDE for Azure Synapse Analytics](transparent-data-encryption-byok-overview.md).
- You must have Azure PowerShell installed and running.

> [!TIP]
> Recommended but optional - create the key material for the TDE protector in a hardware security module (HSM) or local key store first, and import the key material to Azure Key Vault. To learn more, see the [instructions for using a hardware security module (HSM) and Azure Key Vault](/azure/key-vault/general/overview).

# [Portal](#tab/azure-portal)

Go to the [Azure portal](https://portal.azure.com).

# [PowerShell](#tab/azure-powershell)

For Az PowerShell module installation instructions, see [Install Azure PowerShell](/powershell/azure/install-az-ps). Use [the new Azure PowerShell Az module](/powershell/azure/new-azureps-module-az).

# [Azure CLI](#tab/azure-cli)

For installation instructions, see [Install the Azure CLI](/cli/azure/install-azure-cli).

---

## Automatic key rotation

Enable [automatic rotation](transparent-data-encryption-byok-overview.md#rotation-of-tde-protector) for the TDE protector when you configure the TDE protector for the server or the database. You can enable automatic rotation from the Azure portal or by using the following PowerShell or Azure CLI commands. When you enable automatic rotation, the server or database continuously checks the key vault for new versions of the key used as the TDE protector. If the server or database detects a new version of the key, it automatically rotates the TDE protector to the latest key version within **24 hours**.

Use automatic rotation in a server, database, or managed instance with automatic key rotation in Azure Key Vault to enable end-to-end zero-touch rotation for TDE keys.

### Azure portal

Using the [Azure portal](https://portal.azure.com):

1. Browse to the **Transparent data encryption** section for an existing server or managed instance.
1. Select the **Customer-managed key** option and select the key vault and key to use as the TDE protector.
1. Select the **Auto-rotate key** checkbox.
1. Select **Save**.

### PowerShell
For Az PowerShell module installation instructions, see [Install Azure PowerShell](/powershell/azure/install-az-ps).

To enable automatic rotation for the TDE protector by using PowerShell, see the following script. You can [retrieve the `<keyVaultKeyId>` from Azure Key Vault](/azure/key-vault/keys/quick-create-portal#retrieve-a-key-from-key-vault).

Use [Set-AzSqlServerTransparentDataEncryptionProtector](/powershell/module/az.sql/set-azsqlservertransparentdataencryptionprotector):
```powershell
Set-AzSqlServerTransparentDataEncryptionProtector -Type AzureKeyVault -KeyId <keyVaultKeyId> `
   -ServerName <logicalServerName> -ResourceGroup <SQLDatabaseResourceGroupName> `
    -AutoRotationEnabled <boolean>
```

### Azure CLI

For information on installing the current release of Azure CLI, see [Install the Azure CLI](/cli/azure/install-azure-cli).

To enable automatic rotation for the TDE protector by using the Azure CLI, see the following script.

Use [az sql server tde-key set](/cli/azure/sql/server/tde-key#az-sql-server-tde-key-set):


```azurecli
az sql server tde-key set --server-key-type AzureKeyVault
                          --auto-rotation-enabled true
                          [--kid] <keyVaultKeyId>
                          [--resource-group] <SQLDatabaseResourceGroupName> 
                          [--server] <logicalServerName>
```


## Manual key rotation

Manual key rotation uses the following commands to add a new key, which could be under a new key name or even another key vault. You can also use the Azure portal to manually rotate keys.

When you manually rotate keys and create a new key version in Key Vault (either manually or through an automatic key rotation policy), you must manually set that key version as the TDE protector on the server.

> [!NOTE]
> The combined length for the key vault name and key name can't exceed 94 characters.
### Azure portal

1. Open **Transparent data encryption** on the SQL server.
1. Select **Customer-managed key**.
1. Select the **Customer-managed key** option and select the key vault and key to use as the new TDE protector.
1. Select **Save**.

### PowerShell

Use the [Add-AzKeyVaultKey](/powershell/module/az.keyvault/Add-AzKeyVaultKey) command to add a new key to the key vault.

```powershell
# add a new key to Azure Key Vault
Add-AzKeyVaultKey -VaultName <keyVaultName> -Name <keyVaultKeyName> -Destination <hardwareOrSoftware>
```
Use the following commands: 

- [Add-AzSqlServerKeyVaultKey](/powershell/module/az.sql/add-azsqlserverkeyvaultkey)
- [Set-AzSqlServerTransparentDataEncryptionProtector](/powershell/module/az.sql/set-azsqlservertransparentdataencryptionprotector)

```powershell

# add the new key from Azure Key Vault to the server
Add-AzSqlServerKeyVaultKey -KeyId <keyVaultKeyId> -ServerName <logicalServerName> -ResourceGroup <SQLDatabaseResourceGroupName>
  
# set the key as the TDE protector for all resources under the server
Set-AzSqlServerTransparentDataEncryptionProtector -Type AzureKeyVault -KeyId <keyVaultKeyId> `
   -ServerName <logicalServerName> -ResourceGroup <SQLDatabaseResourceGroupName>
```

### Azure CLI

Use the [az keyvault key create](/cli/azure/keyvault/key#az-keyvault-key-create) command to add a new key to the key vault.

```azurecli
# add a new key to Azure Key Vault
az keyvault key create --name <keyVaultKeyName> --vault-name <keyVaultName> --protection <hsmOrSoftware>
```

Use the following commands:

- [az sql server key create](/cli/azure/sql/server/key#az-sql-server-key-create)
- [az sql server tde-key set](/cli/azure/sql/server/tde-key#az-sql-server-tde-key-set)

```azurecli
# add the new key from Azure Key Vault to the server
az sql server key create --kid <keyVaultKeyId> --resource-group <SQLDatabaseResourceGroupName> --server <logicalServerName>

# set the key as the TDE protector for all resources under the server
az sql server tde-key set --server-key-type AzureKeyVault --kid <keyVaultKeyId> --resource-group <SQLDatabaseResourceGroupName> --server <logicalServerName>
```

## Switch TDE protector mode

### Azure portal

Use the Azure portal to switch the TDE protector from Microsoft-managed to BYOK mode:

1. Browse to the **Transparent data encryption** menu for an existing server or managed instance.
1. Select the **Customer-managed key** option.
1. Select the key vault and key to use as the TDE protector.
1. Select **Save**.

### PowerShell

- To switch the TDE protector from Microsoft-managed to BYOK mode, use the [Set-AzSqlServerTransparentDataEncryptionProtector](/powershell/module/az.sql/set-azsqlservertransparentdataencryptionprotector) command.

   ```powershell
   Set-AzSqlServerTransparentDataEncryptionProtector -Type AzureKeyVault `
       -KeyId <keyVaultKeyId> -ServerName <logicalServerName> -ResourceGroup <SQLDatabaseResourceGroupName>
   ```

- To switch the TDE protector from BYOK mode to Microsoft-managed, use the [Set-AzSqlServerTransparentDataEncryptionProtector](/powershell/module/az.sql/set-azsqlservertransparentdataencryptionprotector) command.

   ```powershell
   Set-AzSqlServerTransparentDataEncryptionProtector -Type ServiceManaged `
       -ServerName <logicalServerName> -ResourceGroup <SQLDatabaseResourceGroupName>
   ```

### Azure CLI

The following examples use [az sql server tde-key set](/powershell/module/az.sql/set-azsqlservertransparentdataencryptionprotector).

- To switch the TDE protector from Microsoft-managed to BYOK mode:

   ```azurecli
   az sql server tde-key set --server-key-type AzureKeyVault --kid <keyVaultKeyId> --resource-group <SQLDatabaseResourceGroupName> --server <logicalServerName>
   ```

- To switch the TDE protector from BYOK mode to Microsoft-managed:

   ```azurecli
   az sql server tde-key set --server-key-type ServiceManaged --resource-group <SQLDatabaseResourceGroupName> --server <logicalServerName>
   ```

## Related content

- [Customer-managed TDE for Azure Synapse Analytics](transparent-data-encryption-byok-overview.md)
- [Remove a Transparent Data Encryption protector](transparent-data-encryption-byok-remove-tde-protector.md)
- [Azure Key Vault key rotation](/azure/key-vault/keys/how-to-configure-key-rotation)
