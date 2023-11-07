---
title: Configure Azure Key Vault firewalls and virtual networks - Azure Key Vault 
description: Learn about key vault networking settings
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: general
ms.topic: tutorial
ms.date: 01/20/2023
ms.author: mbaldwin 
---

# Configure Azure Key Vault firewalls and virtual networks

This document will cover the different configurations for an Azure Key Vault firewall in detail. To follow the step-by-step instructions on how to configure these settings, see [Configure Azure Key Vault networking settings](how-to-azure-key-vault-network-security.md).

For more information, see [Virtual network service endpoints for Azure Key Vault](overview-vnet-service-endpoints.md).

## Firewall Settings

This section will cover the different ways that an Azure Key Vault firewall can be configured.

### Key Vault Firewall Disabled (Default)

By default, when you create a new key vault, the Azure Key Vault firewall is disabled. All applications and Azure services can access the key vault and send requests to the key vault. This configuration doesn't mean that any user will be able to perform operations on your key vault. The key vault still restricts access to secrets, keys, and certificates stored in key vault by requiring Microsoft Entra authentication and access policy permissions. To understand key vault authentication in more detail, see [Authentication in Azure Key Vault](authentication.md). For more information, see [Access Azure Key Vault behind a firewall](access-behind-firewall.md).

### Key Vault Firewall Enabled (Trusted Services Only)

When you enable the Key Vault Firewall, you'll be given an option to 'Allow Trusted Microsoft Services to bypass this firewall.' The trusted services list does not cover every single Azure service. For example, Azure DevOps isn't on the trusted services list. **This does not imply that services that do not appear on the trusted services list are not trusted or are insecure.** The trusted services list encompasses services where Microsoft controls all of the code that runs on the service. Since users can write custom code in Azure services such as Azure DevOps, Microsoft does not provide the option to create a blanket approval for the service. Furthermore, just because a service appears on the trusted service list, doesn't mean it is allowed for all scenarios.

To determine if a service you are trying to use is on the trusted service list, see [Virtual network service endpoints for Azure Key Vault](overview-vnet-service-endpoints.md#trusted-services).
For a how-to guide, follow the instructions here for [Portal, Azure CLI and PowerShell](how-to-azure-key-vault-network-security.md)

### Key Vault Firewall Enabled (IPv4 Addresses and Ranges - Static IPs)

If you would like to authorize a particular service to access key vault through the Key Vault Firewall, you can add its IP Address to the key vault firewall allowlist. This configuration is best for services that use static IP addresses or well-known ranges. There is a limit of 1000 CIDR ranges for this case.

To allow an IP Address or range of an Azure resource, such as a Web App or Logic App, perform the following steps.

1. Sign in to the Azure portal.
1. Select the resource (specific instance of the service).
1. Select the **Properties** blade under **Settings**.
1. Look for the **IP Address** field.
1. Copy this value or range and enter it into the key vault firewall allowlist.

To allow an entire Azure service, through the Key Vault firewall, use the list of publicly documented data center IP addresses for Azure [here](https://www.microsoft.com/download/details.aspx?id=56519). Find the IP addresses associated with the service you would like in the region you want and add those IP addresses to the key vault firewall.

### Key Vault Firewall Enabled (Virtual Networks - Dynamic IPs)

If you are trying to allow an Azure resource such as a virtual machine through key vault, you may not be able to use Static IP addresses, and you may not want to allow all IP addresses for Azure Virtual Machines to access your key vault.

In this case, you should create the resource within a virtual network, and then allow traffic from the specific virtual network and subnet to access your key vault. 

1. Sign in to the Azure portal.
1. Select the key vault you wish to configure.
1. Select the 'Networking' blade.
1. Select '+ Add existing virtual network'.
1. Select the virtual network and subnet you would like to allow through the key vault firewall.

### Key Vault Firewall Enabled (Private Link)

To understand how to configure a private link connection on your key vault, please see the document [here](./private-link-service.md).

> [!IMPORTANT]
> After firewall rules are in effect, users can only perform Key Vault [data plane](security-features.md#privileged-access) operations when their requests originate from allowed virtual networks or IPv4 address ranges. This also applies to accessing Key Vault from the Azure portal. Although users can browse to a key vault from the Azure portal, they might not be able to list keys, secrets, or certificates if their client machine is not in the allowed list. This also affects the Key Vault Picker used by other Azure services. Users might be able to see a list of key vaults, but not list keys, if firewall rules prevent their client machine.

> [!NOTE]
> Be aware of the following configuration limitations:
> * A maximum of 200 virtual network rules and 1000 IPv4 rules are allowed. 
> * IP network rules are only allowed for public IP addresses. IP address ranges reserved for private networks (as defined in RFC 1918) are not allowed in IP rules. Private networks include addresses that start with **10.**, **172.16-31**, and **192.168.**. 
> * Only IPv4 addresses are supported at this time.

### Public Access Disabled (Private Endpoint Only)

To enhance network security, you can configure your vault to disable public access.  This will deny all public configurations and allow only connections through private endpoints.

## References
* ARM Template Reference: [Azure Key Vault ARM Template Reference](/azure/templates/Microsoft.KeyVault/vaults)
* Azure CLI commands: [az keyvault network-rule](/cli/azure/keyvault/network-rule)
* Azure PowerShell cmdlets: [Get-AzKeyVault](/powershell/module/az.keyvault/get-azkeyvault), [Add-AzKeyVaultNetworkRule](/powershell/module/az.KeyVault/Add-azKeyVaultNetworkRule), [Remove-AzKeyVaultNetworkRule](/powershell/module/az.KeyVault/Remove-azKeyVaultNetworkRule), [Update-AzKeyVaultNetworkRuleSet](/powershell/module/az.KeyVault/Update-azKeyVaultNetworkRuleSet)

## Next steps

* [Virtual network service endpoints for Key Vault](overview-vnet-service-endpoints.md)
* [Azure Key Vault security overview](security-features.md)
