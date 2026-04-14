---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 01/29/2026
ms.author: danlep
---


#### Requirements for Key Vault firewall

If [Key Vault firewall](/azure/key-vault/general/network-security) is enabled on your key vault, you must meet these requirements:

- You must use the API Management instance's system-assigned managed identity to access the key vault.

- In Key Vault firewall, enable the **Allow Trusted Microsoft Services to bypass this firewall** option: 

  1. In your key vault, select **Settings** > **Networking**.
  1. Under **Firewalls and virtual networks**, select **Allow public access from specific virtual networks and IP addresses**.
  1. Under **Exception**, select **Allow trusted Microsoft services to bypass this firewall**.

  API Management supports trusted service connectivity to access the key vault for control-plane options.

- Ensure that your local client IP address is allowed to access the key vault temporarily. You must select a certificate or secret to add to Azure API Management. For more information, see [Configure Azure Key Vault networking settings](/azure/key-vault/general/how-to-azure-key-vault-network-security).

  After you complete the configuration, you can block your client address in the key vault firewall.

#### Virtual network requirements

If the API Management instance is deployed in a virtual network, also configure the following network settings:

- Enable a [service endpoint](/azure/key-vault/general/overview-vnet-service-endpoints) to Key Vault on the API Management subnet.
- Configure a network security group (NSG) rule to allow outbound traffic to the `AzureKeyVault` and `AzureActiveDirectory` [service tags](../articles/virtual-network/service-tags-overview.md).

For more information, see [Network configuration when setting up API Management in a virtual network](../articles/api-management/virtual-network-reference.md).
