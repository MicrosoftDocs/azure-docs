---
title: Configure Azure Key Vault firewalls and virtual networks - Azure Key Vault 
description: Step-by-step instructions to configure Key Vault firewalls and virtual networks
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: general
ms.topic: tutorial
ms.date: 10/01/2020
ms.author: mbaldwin 
ms.custom: devx-track-azurecli
---
# Configure Azure Key Vault firewalls and virtual networks

This article will provide you with guidance on how to configure the Azure Key Vault firewall. This document will cover the different configurations for the Key Vault firewall in detail, and provide step-by-step instructions on how to configure Azure Key Vault to work with other applications and Azure services.

For more information, see [Virtual network service endpoints for Azure Key Vault](overview-vnet-service-endpoints.md).

## Firewall Settings

This section will cover the different ways that the Azure Key Vault firewall can be configured.

### Key Vault Firewall Disabled (Default)

By default, when you create a new key vault, the Azure Key Vault firewall is disabled. All applications and Azure services can access the key vault and send requests to the key vault. Note, this configuration does not mean that any user will be able to perform operations on your key vault. The key vault still restricts to secrets, keys, and certificates stored in key vault by requiring Azure Active Directory authentication and access policy permissions. To understand key vault authentication in more detail see the key vault authentication fundamentals document [here](./authentication-fundamentals.md). For more information, see [Access Azure Key Vault behind a firewall](./access-behind-firewall.md).

### Key Vault Firewall Enabled (Trusted Services Only)

When you enable the Key Vault Firewall, you will be given an option to 'Allow Trusted Microsoft Services to bypass this firewall.' The trusted services list does not cover every single Azure service. For example, Azure DevOps is not on the trusted services list. **This does not imply that services that do not appear on the trusted services list not trusted or insecure.** The trusted services list encompasses services where Microsoft controls all of the code that runs on the service. Since users can write custom code in Azure services such as Azure DevOps, Microsoft does not provide the option to create a blanket approval for the service. Furthermore, just because a service appears on the trusted service list, doesn't mean it is allowed for all scenarios. 

To determine if a service you are trying to use is on the trusted service list, please see the following document [here](./overview-vnet-service-endpoints.md#trusted-services).
For how-to guide, follow the instructions here for [Portal, Azure CLI and Powershell](https://docs.microsoft.com/azure/key-vault/general/network-security#use-the-azure-portal)

### Key Vault Firewall Enabled (IPv4 Addresses and Ranges - Static IPs)

If you would like to authorize a particular service to access key vault through the Key Vault Firewall, you can add it's IP Address to the key vault firewall allow list. This configuration is best for services that use static IP addresses or well-known ranges. There is a limit of 1000 CIDR ranges for this case.

To allow an IP Address or range of an Azure resource, such as a Web App or Logic App, perform the following steps.

1. Log in to the Azure portal
1. Select the resource (specific instance of the service)
1. Click on the 'Properties' blade under 'Settings'
1. Look for the "IP Address" field.
1. Copy this value or range and enter it into the key vault firewall allow list.

To allow an entire Azure service, through the Key Vault firewall, use the list of publicly documented data center IP addresses for Azure [here](https://www.microsoft.com/download/details.aspx?id=41653). Find the IP addresses associated with the service you would like in the region you want and add those IP addresses to the key vault firewall using the steps above.

### Key Vault Firewall Enabled (Virtual Networks - Dynamic IPs)

If you are trying to allow an Azure resource such as a virtual machine through key vault, you may not be able to use Static IP addresses, and you may not want to allow all IP addresses for Azure Virtual Machines to access your key vault.

In this case, you should create the resource within a virtual network, and then allow traffic from the specific virtual network and subnet to access your key vault. To do this, perform the following steps.

1. Log in to the Azure portal
1. Select the key vault you wish to configure
1. Select the 'Networking' blade
1. Select '+ Add existing virtual network'
1. Select the virtual network and subnet you would like to allow through the key vault firewall.

### Key Vault Firewall Enabled (Private Link)

To understand how to configure a private link connection on your key vault, please see the document [here](./private-link-service.md).

> [!IMPORTANT]
> After firewall rules are in effect, users can only perform Key Vault [data plane](security-overview.md#privileged-access) operations when their requests originate from allowed virtual networks or IPv4 address ranges. This also applies to accessing Key Vault from the Azure portal. Although users can browse to a key vault from the Azure portal, they might not be able to list keys, secrets, or certificates if their client machine is not in the allowed list. This also affects the Key Vault Picker by other Azure services. Users might be able to see list of key vaults, but not list keys, if firewall rules prevent their client machine.

> [!NOTE]
> Be aware of the following configuration limitations:
> * A maximum of 127 virtual network rules and 127 IPv4 rules are allowed. 
> * IP network rules are only allowed for public IP addresses. IP address ranges reserved for private networks (as defined in RFC 1918) are not allowed in IP rules. Private networks include addresses that start with **10.**, **172.16-31**, and **192.168.**. 
> * Only IPv4 addresses are supported at this time.

## Use the Azure portal

Here's how to configure Key Vault firewalls and virtual networks by using the Azure portal:

1. Browse to the key vault you want to secure.
2. Select **Networking**, and then select the **Firewalls and virtual networks** tab.
3. Under **Allow access from**, select **Selected networks**.
4. To add existing virtual networks to firewalls and virtual network rules, select **+ Add existing virtual networks**.
5. In the new blade that opens, select the subscription, virtual networks, and subnets that you want to allow access to this key vault. If the virtual networks and subnets you select don't have service endpoints enabled, confirm that you want to enable service endpoints, and select **Enable**. It might take up to 15 minutes to take effect.
6. Under **IP Networks**, add IPv4 address ranges by typing IPv4 address ranges in [CIDR (Classless Inter-domain Routing) notation](https://tools.ietf.org/html/rfc4632) or individual IP addresses.
7. If you want to allow Microsoft Trusted Services to bypass the Key Vault Firewall, select 'Yes'. For a full list of the current Key Vault Trusted Services please see the following link. [Azure Key Vault Trusted Services](./overview-vnet-service-endpoints.md#trusted-services)
7. Select **Save**.

You can also add new virtual networks and subnets, and then enable service endpoints for the newly created virtual networks and subnets, by selecting **+ Add new virtual network**. Then follow the prompts.

## Use the Azure CLI 

Here's how to configure Key Vault firewalls and virtual networks by using the Azure CLI

1. [Install Azure CLI](/cli/azure/install-azure-cli) and [sign in](/cli/azure/authenticate-azure-cli).

2. List available virtual network rules. If you haven't set any rules for this key vault, the list will be empty.
   ```azurecli
   az keyvault network-rule list --resource-group myresourcegroup --name mykeyvault
   ```

3. Enable a service endpoint for Key Vault on an existing virtual network and subnet.
   ```azurecli
   az network vnet subnet update --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --service-endpoints "Microsoft.KeyVault"
   ```

4. Add a network rule for a virtual network and subnet.
   ```azurecli
   subnetid=$(az network vnet subnet show --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --query id --output tsv)
   az keyvault network-rule add --resource-group "demo9311" --name "demo9311premium" --subnet $subnetid
   ```

5. Add an IP address range from which to allow traffic.
   ```azurecli
   az keyvault network-rule add --resource-group "myresourcegroup" --name "mykeyvault" --ip-address "191.10.18.0/24"
   ```

6. If this key vault should be accessible by any trusted services, set `bypass` to `AzureServices`.
   ```azurecli
   az keyvault update --resource-group "myresourcegroup" --name "mykeyvault" --bypass AzureServices
   ```

7. Turn the network rules on by setting the default action to `Deny`.
   ```azurecli
   az keyvault update --resource-group "myresourcegroup" --name "mekeyvault" --default-action Deny
   ```

## Use Azure PowerShell

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

Here's how to configure Key Vault firewalls and virtual networks by using PowerShell:

1. Install the latest [Azure PowerShell](/powershell/azure/install-az-ps), and [sign in](/powershell/azure/authenticate-azureps).

2. List available virtual network rules. If you have not set any rules for this key vault, the list will be empty.
   ```powershell
   (Get-AzKeyVault -VaultName "mykeyvault").NetworkAcls
   ```

3. Enable service endpoint for Key Vault on an existing virtual network and subnet.
   ```powershell
   Get-AzVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Set-AzVirtualNetworkSubnetConfig -Name "mysubnet" -AddressPrefix "10.1.1.0/24" -ServiceEndpoint "Microsoft.KeyVault" | Set-AzVirtualNetwork
   ```

4. Add a network rule for a virtual network and subnet.
   ```powershell
   $subnet = Get-AzVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Get-AzVirtualNetworkSubnetConfig -Name "mysubnet"
   Add-AzKeyVaultNetworkRule -VaultName "mykeyvault" -VirtualNetworkResourceId $subnet.Id
   ```

5. Add an IP address range from which to allow traffic.
   ```powershell
   Add-AzKeyVaultNetworkRule -VaultName "mykeyvault" -IpAddressRange "16.17.18.0/24"
   ```

6. If this key vault should be accessible by any trusted services, set `bypass` to `AzureServices`.
   ```powershell
   Update-AzKeyVaultNetworkRuleSet -VaultName "mykeyvault" -Bypass AzureServices
   ```

7. Turn the network rules on by setting the default action to `Deny`.
   ```powershell
   Update-AzKeyVaultNetworkRuleSet -VaultName "mykeyvault" -DefaultAction Deny
   ```

## References
* ARM Template Reference: [Azure Key Vault ARM Template Reference](/azure/templates/Microsoft.KeyVault/vaults)
* Azure CLI commands: [az keyvault network-rule](/cli/azure/keyvault/network-rule)
* Azure PowerShell cmdlets: [Get-AzKeyVault](/powershell/module/az.keyvault/get-azkeyvault), [Add-AzKeyVaultNetworkRule](/powershell/module/az.KeyVault/Add-azKeyVaultNetworkRule), [Remove-AzKeyVaultNetworkRule](/powershell/module/az.KeyVault/Remove-azKeyVaultNetworkRule), [Update-AzKeyVaultNetworkRuleSet](/powershell/module/az.KeyVault/Update-azKeyVaultNetworkRuleSet)

## Next steps

* [Virtual network service endpoints for Key Vault](overview-vnet-service-endpoints.md)
* [Azure Key Vault security overview](security-overview.md)
