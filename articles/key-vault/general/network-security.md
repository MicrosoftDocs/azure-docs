---
title: Configure Azure Key Vault firewalls and virtual networks - Azure Key Vault 
description: Step-by-step instructions to configure Key Vault firewalls and virtual networks
services: key-vault
author: ShaneBala-keyvault
manager: ravijan
ms.service: key-vault
ms.subservice: general
ms.topic: tutorial
ms.date: 04/22/2020
ms.author: sudbalas
---
# Configure Azure Key Vault firewalls and virtual networks

This article provides step-by-step instructions to configure Azure Key Vault firewalls and virtual networks to restrict access to your key vault. The [virtual network service endpoints for Key Vault](overview-vnet-service-endpoints.md)) allow you to restrict access to a specified virtual network and set of IPv4 (internet protocol version 4) address ranges.

> [!IMPORTANT]
> After firewall rules are in effect, users can only perform Key Vault [data plane](secure-your-key-vault.md#data-plane-access-control) operations when their requests originate from allowed virtual networks or IPv4 address ranges. This also applies to accessing Key Vault from the Azure portal. Although users can browse to a key vault from the Azure portal, they might not be able to list keys, secrets, or certificates if their client machine is not in the allowed list. This also affects the Key Vault Picker by other Azure services. Users might be able to see list of key vaults, but not list keys, if firewall rules prevent their client machine.

> [!NOTE]
> Be aware of the following configuration limitations:
> * A maximum of 127 virtual network rules and 127 IPv4 rules are allowed. 
> * Small address ranges that use the "/31" or "/32" prefix sizes are not supported. Instead, configure these ranges by using individual IP address rules.
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
7. If you want to allow Microsoft Trusted Services to bypass the Key Vault Firewall, select 'Yes'. For a full list of the current Key Vault Trusted Services please see the following link. [Azure Key Vault Trusted Services](https://docs.microsoft.com/azure/key-vault/general/overview-vnet-service-endpoints#trusted-services)
7. Select **Save**.

You can also add new virtual networks and subnets, and then enable service endpoints for the newly created virtual networks and subnets, by selecting **+ Add new virtual network**. Then follow the prompts.

## Use the Azure CLI 

Here's how to configure Key Vault firewalls and virtual networks by using the Azure CLI

1. [Install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) and [sign in](https://docs.microsoft.com/cli/azure/authenticate-azure-cli).

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

1. Install the latest [Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-az-ps), and [sign in](https://docs.microsoft.com/powershell/azure/authenticate-azureps).

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
* ARM Template Reference: [Azure Key Vault ARM Template Reference](https://docs.microsoft.com/azure/templates/Microsoft.KeyVault/vaults)
* Azure CLI commands: [az keyvault network-rule](https://docs.microsoft.com/cli/azure/keyvault/network-rule?view=azure-cli-latest)
* Azure PowerShell cmdlets: [Get-AzKeyVault](https://docs.microsoft.com/powershell/module/az.keyvault/get-azkeyvault), [Add-AzKeyVaultNetworkRule](https://docs.microsoft.com/powershell/module/az.KeyVault/Add-azKeyVaultNetworkRule), [Remove-AzKeyVaultNetworkRule](https://docs.microsoft.com/powershell/module/az.KeyVault/Remove-azKeyVaultNetworkRule), [Update-AzKeyVaultNetworkRuleSet](https://docs.microsoft.com/powershell/module/az.KeyVault/Update-azKeyVaultNetworkRuleSet)

## Next steps

* [Virtual network service endpoints for Key Vault](overview-vnet-service-endpoints.md))
* [Secure your key vault](secure-your-key-vault.md))
