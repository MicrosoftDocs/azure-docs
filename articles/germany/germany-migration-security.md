---
title: Migrate Azure security resources, Azure Germany to global Azure
description: This article provides information about migrating your Azure security resources from Azure Germany to global Azure.
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 12/12/2019
ms.topic: article
ms.custom: bfmigrate
---

# Migrate security resources to global Azure

> [!IMPORTANT]
> Since [August 2018](https://news.microsoft.com/europe/2018/08/31/microsoft-to-deliver-cloud-services-from-new-datacentres-in-germany-in-2019-to-meet-evolving-customer-needs/), we have not been accepting new customers or deploying any new features and services into the original Microsoft Cloud Germany locations.
>
> Based on the evolution in customers’ needs, we recently [launched](https://azure.microsoft.com/blog/microsoft-azure-available-from-new-cloud-regions-in-germany/) two new datacenter regions in Germany, offering customer data residency, full connectivity to Microsoft’s global cloud network, as well as market competitive pricing. 
>
> Take advantage of the breadth of functionality, enterprise-grade security, and comprehensive features available in our new German datacenter regions by [migrating](germany-migration-main.md) today.

This article has information that can help you migrate Azure security resources from Azure Germany to global Azure.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Azure Active Directory

For information about migrating Azure Active Directory, see [Migrate identities](./germany-migration-identity.md#azure-active-directory).

## Key Vault

Some features of Azure Key Vault can't be migrated from Azure Germany to global Azure.

### Encryption keys

You can't migrate encryption keys. Create new keys in the target region, and then use the keys to protect the target resource (for example, Azure Storage or Azure SQL Database). Securely migrate the data from the old region to the new region.

### Application secrets

Application secrets are certificates, storage account keys, and other application-related secrets. During a migration, first create a new key vault in global Azure. Then, complete one of the following actions:

- Create new application secrets.
- Read the current secrets in Azure Germany, and then enter the value in the new vault.

```powershell
Get-AzKeyVaultSecret -vaultname mysecrets -name Deploydefaultpw
```

For more information:

- Refresh your knowledge by completing the [Key Vault tutorials](https://docs.microsoft.com/azure/key-vault/).
- Review the [Key Vault overview](../key-vault/general/overview.md).
- Review the [Key Vault PowerShell cmdlets](/powershell/module/az.keyvault/).

## VPN Gateway

Migrating an Azure VPN Gateway instance from Azure Germany to global Azure isn't supported at this time. We recommend that you create and configure a new instance of VPN Gateway in global Azure.

You can collect information about your current VPN Gateway configuration by using the portal or PowerShell. In PowerShell, use a set of cmdlets that begin with `Get-AzVirtualNetworkGateway*`.

Make sure that you update your on-premises configuration. Also, delete any existing rules for the old IP address ranges after you update your Azure network environment.

For more information:

- Refresh your knowledge by completing the [VPN Gateway tutorials](https://docs.microsoft.com/azure/vpn-gateway).
- Learn how to [create a site-to-site connection](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md).
- Review the [Get-AzVirtualNetworkGateway](/powershell/module/az.network/get-azvirtualnetworkgateway) PowerShell cmdlets.
- Read the blog post [Create a site-to-site connection](https://blogs.technet.microsoft.com/ralfwi/2017/02/02/connecting-clouds/).
  
## Application Gateway

Migrating an Azure Application Gateway instance from Azure Germany to global Azure isn't supported at this time. We recommend that you create and configure a new gateway in global Azure.

You can collect information about your current gateway configuration by using the portal or PowerShell. In PowerShell, use a set of cmdlets that begin with `Get-AzApplicationGateway*`.

For more information:

- Refresh your knowledge by completing the [Application Gateway tutorials](https://docs.microsoft.com/azure/application-gateway/application-gateway-web-application-firewall-portal).
- Learn how to [create an application gateway](../application-gateway/quick-create-portal.md).
- Review the [Get-AzApplicationGateway](/powershell/module/az.network/get-azapplicationgateway) PowerShell cmdlets.

## Next steps

Learn about tools, techniques, and recommendations for migrating resources in the following service categories:

- [Compute](./germany-migration-compute.md)
- [Networking](./germany-migration-networking.md)
- [Storage](./germany-migration-storage.md)
- [Web](./germany-migration-web.md)
- [Databases](./germany-migration-databases.md)
- [Analytics](./germany-migration-analytics.md)
- [IoT](./germany-migration-iot.md)
- [Integration](./germany-migration-integration.md)
- [Identity](./germany-migration-identity.md)
- [Management tools](./germany-migration-management-tools.md)
- [Media](./germany-migration-media.md)

