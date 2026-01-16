---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 12/18/2025
ms.author: danlep
---


#### Requirements for Key Vault firewall

If [Key Vault firewall](/azure/key-vault/general/network-security) is enabled on your key vault, you must meet these requirements:

* You must use the API Management instance's system-assigned managed identity to access the key vault.

* In Key Vault firewall, enable the **Allow Trusted Microsoft Services to bypass this firewall** option. API Management supports trusted service connectivity to access the key vault for control-plane options.

* Ensure that your local client IP address is allowed to access the key vault temporarily while you select a certificate or secret to add to Azure API Management. For more information, see [Configure Azure Key Vault networking settings](/azure/key-vault/general/how-to-azure-key-vault-network-security).

    After completing the configuration, you can block your client address in the key vault firewall.

> [!IMPORTANT]
> Starting March 2026, trusted service connectivity to Azure services from the API Management gateway by enabling the **Allow Trusted Microsoft Services to bypass this firewall** firewall setting will no longer be supported. To continue accessing these services from the API Management gateway after this change, ensure that you choose a different supported network access option. For control-plane operations, you can continue to use trusted service connectivity. [Learn more](../articles/api-management/breaking-changes/trusted-service-connectivity-retirement-march-2026.md).

#### Virtual network requirements

If the API Management instance is deployed in a virtual network, also configure the following network settings:

* Enable a [service endpoint](/azure/key-vault/general/overview-vnet-service-endpoints) to Key Vault on the API Management subnet.
* Configure a network security group (NSG) rule to allow outbound traffic to the AzureKeyVault and AzureActiveDirectory [service tags](../articles/virtual-network/service-tags-overview.md).

For details, see [Network configuration when setting up API Management in a virtual network](../articles/api-management/virtual-network-reference.md).
