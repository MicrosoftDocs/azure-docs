---
title: "PowerShell - Remove a TDE protector - Azure SQL Database| Microsoft Docs"
description: "How-to guide for responding to a potentially compromised TDE protector for an Azure SQL Database or Data Warehouse using TDE with Bring YOur Own Key (BYOK) support."
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: aliceku
ms.author: aliceku
ms.reviewer: vanto
manager: craigg
ms.date: 08/07/2017
---
# Remove a Transparent Data Encryption (TDE) protector using PowerShell
## Prerequisites
- You must have an Azure subscription and be an administrator on that subscription
- You must have Azure PowerShell version 4.2.0 or newer installed and running. 
- This how-to guide assumes that you are already using a key from Azure Key Vault as the TDE protector for an Azure SQL Database or Data Warehouse. See [Transparent Data Encryption with BYOK Support](transparent-data-encryption-byok-azure-sql.md) to learn more.

## Overview
This how-to guide describes how to respond to a potentially compromised TDE protector for an Azure SQL Database or Data Warehouse that is using TDE with Bring Your Own Key (BYOK) support. To learn more about BYOK support for TDE, see the [overview page](transparent-data-encryption-byok-azure-sql.md). 

The following procedures should only be done in extreme cases or in test environments. Review the how-to guide carefully, as deleting actively used TDE protectors from Azure Key Vault can result in **data loss**. 

If a key is ever suspected to be compromised, such that a service or user had unauthorized access to the key, it’s best to delete the key.

Keep in mind that once the TDE protector is deleted in Key Vault, **all connections to the encrypted databases under the server are blocked, and these databases go offline and get dropped within 24 hours**. Old backups encrypted with the compromised key are no longer accessible.

This how-to guide goes over two approaches depending on the desired result after the incident response:
- To keep the Azure SQL databases / Data Warehouses **accessible**
- To make the Azure SQL databases / Data Warehouses **inaccessible**

## To keep the encrypted resources accessible
1. Create a [new key in Key Vault](https://docs.microsoft.com/powershell/module/azurerm.keyvault/add-azurekeyvaultkey?view=azurermps-4.1.0). Make sure this new key is created in a separate key vault from the potentially compromised TDE protector, since access control is provisioned on a vault level. 
2. Add the new key to the server using the [Add-AzureRmSqlServerKeyVaultKey](/powershell/module/azurerm.sql/add-azurermsqlserverkeyvaultkey) and [Set-AzureRmSqlServerTransparentDataEncryptionProtector](/powershell/module/azurerm.sql/set-azurermsqlservertransparentdataencryptionprotector) cmdlets and update it as the server’s new TDE protector.

   ```powershell
   # Add the key from Key Vault to the server  
   Add-AzureRmSqlServerKeyVaultKey `
   -ResourceGroupName <SQLDatabaseResourceGroupName> `
   -ServerName <LogicalServerName> `
   -KeyId <KeyVaultKeyId>
   
   # Set the key as the TDE protector for all resources under the server
   Set-AzureRmSqlServerTransparentDataEncryptionProtector `
   -ResourceGroupName <SQLDatabaseResourceGroupName> `
   -ServerName <LogicalServerName> `
   -Type AzureKeyVault -KeyId <KeyVaultKeyId> 
   ```

3. Make sure the server and any replicas have updated to the new TDE protector using the [Get-AzureRmSqlServerTransparentDataEncryptionProtector](/powershell/module/azurerm.sql/get-azurermsqlservertransparentdataencryptionprotector) cmdlet. 

   >[!NOTE]
   > It may take a few minutes for the new TDE protector to propagate to all databases and secondary databases under the server.
   >

   ```powershell
   Get-AzureRmSqlServerTransparentDataEncryptionProtector `
   -ServerName <LogicalServerName> `
   -ResourceGroupName <SQLDatabaseResourceGroupName>
   ```

4. Take a [backup of the new key](/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey) in Key Vault.

   ```powershell
   <# -OutputFile parameter is optional; 
   if removed, a file name is automatically generated. #>
   Backup-AzureKeyVaultKey `
   -VaultName <KeyVaultName> `
   -Name <KeyVaultKeyName> `
   -OutputFile <DesiredBackupFilePath>
   ```
 
5. Delete the compromised key from Key Vault using the [Remove-AzureKeyVaultKey](/powershell/module/azurerm.keyvault/remove-azurekeyvaultkey) cmdlet. 

   ```powershell
   Remove-AzureKeyVaultKey `
   -VaultName <KeyVaultName> `
   -Name <KeyVaultKeyName>
   ```
 
6. To restore a key to Key Vault in the future using the [Restore-AzureKeyVaultKey](/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey) cmdlet:
   ```powershell
   Restore-AzureKeyVaultKey `
   -VaultName <KeyVaultName> `
   -InputFile <BackupFilePath>
   ```
 
## To make the encrypted resources inaccessible
1. Drop the databases that are being encrypted by the potentially compromised key.
The database and log files are automatically backed up, so a point-in-time restore of the database can be done at any point (as long as you provide the key). The databases must be dropped before deletion of an active TDE protector to prevent potential data loss of up to 10 minutes of the most recent transactions. 
2. Back up the key material of the TDE protector in Key Vault.
3. Remove the potentially compromised key from Key Vault

## Next steps

- Learn how to rotate the TDE protector of a server to comply with security requirements: [Rotate the Transparent Data Encryption protector Using PowerShell](transparent-data-encryption-byok-azure-sql-key-rotation.md)

- Get started with Bring Your Own Key support for TDE: [Turn on TDE using your own key from Key Vault using PowerShell](transparent-data-encryption-byok-azure-sql-configure.md)
