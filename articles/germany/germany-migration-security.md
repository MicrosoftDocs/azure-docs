---
title: Migration of security resources from Azure Germany to global Azure
description: This article provides help for migrating security resources from Azure Germany to global Azure
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 8/15/2018
ms.topic: article
ms.custom: bfmigrate
---

# Migration of security resources from Azure Germany to global Azure

This article will provide you some help for the migration of Azure Security resources from Azure Germany to global Azure.

## Azure Active Directory

This service is covered under [Migration of Identities](./germany-migration-identity.md#azure-active-directory).





## Key Vault

### Encryption Keys

Encryption keys can't be migrated. Create new keys in the target region and use them to protect the target resource (Storage, SQL DB, etc.). Then securely migrate the data from the old region to the new region.

### Application secrets

Application secrets are certificates, storage account keys and other application-related secrets.

- Create a new KeyVault in global Azure
- create new application secrets, **or**
- read the current secrets in Azure Germany and enter the value into the new vault.

```powershell
Get-AzureKeyVaultSecret -vaultname mysecrets -name Deploydefaultpw
```

### Next steps

Refresh your knowledge about Key Vault by following these [Step-by-step tutorials](https://docs.microsoft.com/azure/key-vault/#step-by-step-tutorials).

### References

- [KeyVault overview](../key-vault/key-vault-overview.md)
- [KeyVault PowerShell cmdlets](/powershell/module/azurerm.keyvault/?view=azurermps-6.5.0)















## VPN Gateway

Migration of Virtual Private Network (VPN) Gateways between Azure Germany and global Azure isn't supported at this time. The recommended approach is to create and configure a new VPN Gateway.

Collect information about your current VPN gateway configuration by using the portal or by using PowerShell. There's a set of cmdlets starting with `Get-AzureRmVirtualNetworkGateway*`.

Don't forget to update your on-premise configuration and delete any existing rules for the old IP ranges once you updated your Azure network environment.

### Next steps

- Refresh your knowledge about VPN Gateways by following these [Step-by-Step tutorials](https://docs.microsoft.com/azure/vpn-gateway/#step-by-step-tutorials).

### References

- [Create Site-to-Site connection](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md) with VPN gateway
- [Get-AzureRmVirtualNetworkGateway](/powershell/module/azurerm.network/get-azurermvirtualnetworkgateway?view=azurermps-6.5.0) PowerShell cmdlets
- Blog: [Create Site-to-Site connection](https://blogs.technet.microsoft.com/ralfwi/2017/02/02/connecting-clouds/) between Azure Germany and global Azure
 






## Application Gateway

Migration of Application Gateways between Azure Germany and global Azure isn't supported at this time. The recommended approach is to create and configure a new Gateway.

Collect information about your current gateway configuration by using the portal or by using PowerShell. There's a set of cmdlets starting with `Get-AzureRmApplicationGateway*`.

### Next steps

- Refresh your knowledge about Application Gateway by following these [Step-by-Step tutorials](https://docs.microsoft.com/azure/application-gateway/#step-by-step-tutorials).

### References

- [Create Application Gateway](../application-gateway/quick-create-portal.md)
- [Get-AzureRmApplicationGateway](/powershell/module/azurerm.network/get-azurermapplicationgateway?view=azurermps-6.5.0) PowerShell cmdlets

