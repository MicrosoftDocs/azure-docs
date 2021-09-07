---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 01/26/2021
ms.author: danlep
---


#### Requirements for Key Vault firewall

If [Key Vault firewall](../articles/key-vault/general/network-security.md) is enabled on your key vault, the following are additional requirements:

* You must use the API Management instance's **system-assigned** managed identity to access the key vault.
* In Key Vault firewall, enable the **Allow Trusted Microsoft Services to bypass this firewall** option.

#### Virtual network requirements

If the API Management instance is deployed in a virtual network, also configure the following network settings:

* Enable a [service endpoint](../articles/key-vault/general/overview-vnet-service-endpoints.md) to Azure Key Vault on the API Management subnet.
* Configure a network security group (NSG) rule to allow outbound traffic to the AzureKeyVault and AzureActiveDirectory [service tags](../articles/virtual-network/service-tags-overview.md). 

For details, see network configuration details in [Connect to a virtual network](../articles/api-management/api-management-using-with-vnet.md#network-configuration).