---
title: 'PowerShell - Rotate TDE protector - Azure SQL Database| Microsoft Docs'
description: Learn how to rotate the Transparent Data Encryption (TDE) protector for an Azure SQL server.
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: aliceku
ms.author: aliceku
ms.reviewer: vanto
manager: jhubbard
ms.date: 08/07/2017
--- 
# Rotate the Transparent Data Encryption (TDE) protector using PowerShell 

This article describes key rotation for an Azure SQL server using a TDE protector from Azure Key Vault. Rotating an Azure SQL server’s TDE protector means switching to a new asymmetric key that protects the databases on the server. Key rotation is an online operation and should only take a few seconds to complete, because this only decrypts and re-encrypts the database’s data encryption key, not the entire database.

This guide discusses two options to rotate the TDE protector on the server.

> [!NOTE]
> A paused SQL Data Warehouse must be resumed before key rotations.
>

> [!IMPORTANT]
> **Do Not Delete** previous versions of the key after a rollover.  When keys are rolled over, some data is still encrypted with the previous keys, such as older database backups. 
>

## Prerequisites

- This how-to guide assumes that you are already using a key from Azure Key Vault as the TDE protector for an Azure SQL Database or Data Warehouse. See [Transparent Data Encryption with BYOK Support](transparent-data-encryption-byok-azure-sql.md).
- You must have Azure PowerShell version 3.7.0 or newer installed and running. 
- [Recommended but optional] Create the key material for the TDE protector in a hardware security module (HSM) or local key store first, and import the key material to Azure Key Vault. Follow the [instructions for using a hardware security module (HSM) and Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-get-started) to learn more.

## Option 1: Auto rotation

Generate a new version of the existing TDE protector key in Key Vault, under the same key name and key vault. The Azure SQL service starts using this new version within 24 hours. 

To create a new version of the TDE protector using the [Add-AzureKeyVaultKey](/powershell/module/azurerm.keyvault/add-azurekeyvaultkey) cmdlet:

   ```powershell
   Add-AzureKeyVaultKey `
   -VaultName <KeyVaultName> `
   -Name <KeyVaultKeyName> `
   -Destination <HardwareOrSoftware>
   ```

## Option 2: Manual rotation

The option uses the [Add-AzureKeyVaultKey](/powershell/module/azurerm.keyvault/add-azurekeyvaultkey), [Add-AzureRmSqlServerKeyVaultKey](/powershell/module/azurerm.sql/add-azurermsqlserverkeyvaultkey), and [Set-AzureRmSqlServerTransparentDataEncryptionProtector](/powershell/module/azurerm.sql/set-azurermsqlservertransparentdataencryptionprotector) cmdlets to add a completely new key, which could be under a new key name or even another key vault. 

>[!NOTE]
>The combined length for the key vault name and key name cannot exceed 94 characters.
>

   ```powershell
   # Add a new key to Key Vault
   Add-AzureKeyVaultKey `
   -VaultName <KeyVaultName> `
   -Name <KeyVaultKeyName> `
   -Destination <HardwareOrSoftware>

   # Add the new key from Key Vault to the server
   Add-AzureRmSqlServerKeyVaultKey `
   -KeyId <KeyVaultKeyId> `
   -ServerName <LogicalServerName> `
   -ResourceGroup <SQLDatabaseResourceGroupName>   
  
   <# Set the key as the TDE protector for all resources 
   under the server #>
   Set-AzureRmSqlServerTransparentDataEncryptionProtector `
   -Type AzureKeyVault `
   -KeyId <KeyVaultKeyId> `
   -ServerName <LogicalServerName> `
   -ResourceGroup <SQLDatabaseResourceGroupName>
   ```
  
## Other useful PowerShell cmdlets

- To switch the TDE protector from Microsoft-managed to BYOK mode, use the [Set-AzureRmSqlServerTransparentDataEncryptionProtector](/powershell/module/azurerm.sql/set-azurermsqlservertransparentdataencryptionprotector) cmdlet.

   ```powershell
   Set-AzureRmSqlServerTransparentDataEncryptionProtector `
   -Type AzureKeyVault `
   -KeyId <KeyVaultKeyId> `
   -ServerName <LogicalServerName> `
   -ResourceGroup <SQLDatabaseResourceGroupName>
   ```

- To switch the TDE protector from BYOK mode to Microsoft-managed, use the [Set-AzureRmSqlServerTransparentDataEncryptionProtector](/powershell/module/azurerm.sql/set-azurermsqlservertransparentdataencryptionprotector) cmdlet.

   ```powershell
   Set-AzureRmSqlServerTransparentDataEncryptionProtector `
   -Type ServiceManaged `
   -ServerName <LogicalServerName> `
   -ResourceGroup <SQLDatabaseResourceGroupName> 
   ``` 

## Next steps

- In case of a security risk, learn how to remove a potentially compromised TDE protector: [Remove a potentially compromised key](transparent-data-encryption-byok-azure-sql-remove-tde-protector.md) 

- Get started with Bring Your Own Key support for TDE: [Turn on TDE using your own key from Key Vault using PowerShell](transparent-data-encryption-byok-azure-sql-configure.md)
