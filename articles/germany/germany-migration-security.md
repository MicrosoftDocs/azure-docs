---
title: Migration from Azure Germany compute resources to public Azure
description: Provides help for migrating security resources
author: gitralf
ms.author: ralfwi 
ms.date: 7/20/2018
ms.topic: article
ms.custom: bfmigrate
---

# Security

## Azure Active Directory

This service is also covered under [Identity](./germany-migration-identity.md#azure-active-directory)





## Key Vault

### Encryption Keys

Encryption keys can't be migrated. Create new keys in the target region and use them to protect the target resource (Storage, SQL DB, etc.). Then securely migrate the data from the old region to the new region.

### Application secrets

Application secrets are certificates, storage account keys and other application-related secrets.

- Create a new KeyVault in global Azure
- create new application secrets, **or**
- read the current secrets in Azure Germany and enter the value into the new vault.

```powershell
Get-AzureKeyVaultSecret -vaultname mysecrets  -name Deploydefaultpw
```

### Next steps

Refresh your knowledge about Key Vault by following these [Step-by-step tutorials](../key-vault/#step-by-step-tutorials).

### References

- [KeyVault overview](../key-vault/key-vault-overview.md)
- [KeyVault PowerShell cmdlets](https://docs.microsoft.com/en-us/powershell/module/azurerm.keyvault/?view=azurermps-6.5.0)















## VPN Gateway

This service is also covered under [Networking](./germany-migration-networking.md#vpn-gateway).

Migration of Virtual Private Network (VPN) Gateways between Azure Germany and global Azure isn't supported at this time. The recommended approach is to create and configure a new VPN Gateway.

Collect information about your current VPN gateway configuration by using the portal or by using PowerShell. There's a set of cmdlets starting with `Get-AzureRmVirtualNetworkGateway\*`.

Don't forget to update your on-premise configuration and delete any existing rules for the old IP ranges once you updated your Azure network environment.

### Next steps

Refresh your knowledge about VPN Gateways by following these [Step-by-step tutorials](../vpn-gateway/#step-by-step-tutorials).

### References

- [Create Site-to-Site connection](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md) with VPN gateway
- [Get-AzureRmVirtualNetworkGateway](https://docs.microsoft.com/en-us/powershell/module/azurerm.network/get-azurermvirtualnetworkgateway?view=azurermps-6.5.0)  PowerShell cmdlets
- Blog: [Create Site-to-site connection](https://blogs.technet.microsoft.com/ralfwi/2017/02/02/connecting-clouds/) between Azure Germany and global Azure
 














## Application Gateway

This service is also covered under [Networking](./germany-migration-networking.md#application-gateway)

Migration of Application Gateways between Azure Germany and global Azure isn't supported at this time. The recommended approach is to create and configure a new Gateway.

Collect information about your current gateway configuration by using the portal or by using PowerShell. There's a set of cmdlets starting with `Get-AzureRmApplicationGateway\*`.

### Next steps

Refresh your knowledge about Application Gateway by following these [Step-by-step tutorials](../application-gateway/#step-by-step-tutorials).

### References

- [Create Application Gateway](../application-gateway/quick-create-portal.md)
- [Get-AzureRmApplicationGateway](https://docs.microsoft.com/en-us/powershell/module/azurerm.network/get-azurermapplicationgateway?view=azurermps-6.5.0)  PowerShell cmdlets
