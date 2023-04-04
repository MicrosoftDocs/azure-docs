---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 05/31/2022
ms.author: danlep
---


#### Requirements for Key Vault firewall

If [Key Vault firewall](../articles/key-vault/general/network-security.md) is enabled on your key vault, the following are additional requirements:

* You must use the API Management instance's **system-assigned** managed identity to access the key vault.
* In Key Vault firewall, enable the **Allow Trusted Microsoft Services to bypass this firewall** option.
* Ensure that your local client IP address is allowed to access the key vault temporarily while you select a certificate or secret to add to Azure API Management. For more information, see [Configure Azure Key Vault networking settings](../articles/key-vault/general/how-to-azure-key-vault-network-security.md).

    After completing the configuration, you may block your client address in the key vault firewall.

#### Virtual network requirements

If the API Management instance is deployed in a virtual network, also configure the following network settings:

* Enable a [service endpoint](../articles/key-vault/general/overview-vnet-service-endpoints.md) to Azure Key Vault on the API Management subnet.
* Configure a network security group (NSG) rule to allow outbound traffic to the AzureKeyVault and AzureActiveDirectory [service tags](../articles/virtual-network/service-tags-overview.md). 

For details, see [Network configuration when setting up Azure API Management in a VNet](../articles/api-management/virtual-network-reference.md).