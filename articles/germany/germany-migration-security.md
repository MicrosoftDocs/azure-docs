---
title: Migrate security resources from Azure Germany to global Azure
description: This article provides information about migrating security resources from Azure Germany to global Azure.
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 08/15/2018
ms.topic: article
ms.custom: bfmigrate
---

# Migrate security resources from Azure Germany to global Azure

This article has information that can help you migrate Azure security resources from Azure Germany to global Azure.

## Azure Active Directory

For information about migrating this service, see [Migrating identities](./germany-migration-identity.md#azure-active-directory).

## Key Vault

Some features of Azure Key Vault can't be migrated from Azure Germany to global Azure.

### Encryption keys

Encryption keys can't be migrated. Create new keys in the target region and use them to protect the target resource (Azure Storage, Azure SQL Database). Then, securely migrate the data from the old region to the new region.

### Application secrets

Application secrets are certificates, storage account keys, and other application-related secrets. During a migration, first create a new key vault in global Azure. Then, complete one of the following actions:

- Create new application secrets.
- Read the current secrets in Azure Germany, and then enter the value in the new vault.

```powershell
Get-AzureKeyVaultSecret -vaultname mysecrets -name Deploydefaultpw
```

For more information, see these articles:

- [Key Vault overview](../key-vault/key-vault-overview.md)
- [Key Vault PowerShell cmdlets](/powershell/module/azurerm.keyvault/?view=azurermps-6.5.0)

## VPN Gateway

Migrating an instance of Azure VPN Gateway from Azure Germany to global Azure isn't supported at this time. We recommend that you create and configure a new instance of VPN Gateway in global Azure.

Collect information about your current VPN Gateway configuration by using the Azure portal or PowerShell. You can use a set of cmdlets that begin with `Get-AzureRmVirtualNetworkGateway*`.

Be sure to update your on-premises configuration and delete any existing rules for the old IP address ranges after you update your Azure network environment.

For more information, see these articles:

- [Create a site-to-site connection](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md) by using VPN Gateway.
- [Get-AzureRmVirtualNetworkGateway](/powershell/module/azurerm.network/get-azurermvirtualnetworkgateway?view=azurermps-6.5.0) PowerShell cmdlets
- A [blog post](https://blogs.technet.microsoft.com/ralfwi/2017/02/02/connecting-clouds/) that describes how to create a site-to-site connection between Azure Germany and global Azure.
 
## Application Gateway

Migrating an Azure Application Gateway instance from Azure Germany to global Azure isn't supported at this time. We recommend that you create and configure a new instance of Application Gateway in global Azure.

Collect information about your current gateway configuration by using the Azure portal or PowerShell. You can use a set of cmdlets that begin with `Get-AzureRmApplicationGateway*`.

For more information, see these articles:

- [Create an application gateway](../application-gateway/quick-create-portal.md)
- [Get-AzureRmApplicationGateway](/powershell/module/azurerm.network/get-azurermapplicationgateway?view=azurermps-6.5.0) PowerShell cmdlets

## Next steps

 Refresh your knowledge by completing these step-by-step tutorials:

 - [Key Vault tutorials](https://docs.microsoft.com/azure/key-vault/#step-by-step-tutorials)
 - [VPN Gateway tutorials](https://docs.microsoft.com/azure/vpn-gateway/#step-by-step-tutorials)
 - [Application Gateway tutorials](https://docs.microsoft.com/azure/application-gateway/#step-by-step-tutorials)


