---
title: How to configure Azure Key Vault networking configuration 
description: Step-by-step instructions to configure Key Vault firewalls and virtual networks
services: key-vault
author: sebansal
ms.service: key-vault
ms.subservice: general
ms.topic: tutorial
ms.date: 5/11/2021
ms.author: mbaldwin 
ms.custom: devx-track-azurecli, devx-track-azurepowershell
---
# Configure Azure Key Vault networking settings

This article will provide you with guidance on how to configure the Azure Key Vault networking settings to work with other applications and Azure services. To learn about different network security configurations in detail, [read here](network-security.md).

Here's step-by-step instructions to configure Key Vault firewall and virtual networks by using the Azure portal, Azure CLI and Azure PowerShell

# [Portal](#tab/azure-portal)


1. Browse to the key vault you want to secure.
2. Select **Networking**, and then select the **Firewalls and virtual networks** tab.
3. Under **Allow access from**, select **Selected networks**.
4. To add existing virtual networks to firewalls and virtual network rules, select **+ Add existing virtual networks**.
5. In the new blade that opens, select the subscription, virtual networks, and subnets that you want to allow access to this key vault. If the virtual networks and subnets you select don't have service endpoints enabled, confirm that you want to enable service endpoints, and select **Enable**. It might take up to 15 minutes to take effect.
6. Under **IP Networks**, add IPv4 address ranges by typing IPv4 address ranges in [CIDR (Classless Inter-domain Routing) notation](https://tools.ietf.org/html/rfc4632) or individual IP addresses.
7. If you want to allow Microsoft Trusted Services to bypass the Key Vault Firewall, select 'Yes'. For a full list of the current Key Vault Trusted Services please see the following link. [Azure Key Vault Trusted Services](./overview-vnet-service-endpoints.md#trusted-services)
7. Select **Save**.

You can also add new virtual networks and subnets, and then enable service endpoints for the newly created virtual networks and subnets, by selecting **+ Add new virtual network**. Then follow the prompts.

# [Azure CLI](#tab/azure-cli)

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

# [PowerShell](#tab/azure-powershell)

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

Here's how to configure Key Vault firewalls and virtual networks by using PowerShell:

1. Install the latest [Azure PowerShell](/powershell/azure/install-azure-powershell), and [sign in](/powershell/azure/authenticate-azureps).

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
---
## References
* ARM Template Reference: [Azure Key Vault ARM Template Reference](/azure/templates/Microsoft.KeyVault/vaults)
* Azure CLI commands: [az keyvault network-rule](/cli/azure/keyvault/network-rule)
* Azure PowerShell cmdlets: [Get-AzKeyVault](/powershell/module/az.keyvault/get-azkeyvault), [Add-AzKeyVaultNetworkRule](/powershell/module/az.KeyVault/Add-azKeyVaultNetworkRule), [Remove-AzKeyVaultNetworkRule](/powershell/module/az.KeyVault/Remove-azKeyVaultNetworkRule), [Update-AzKeyVaultNetworkRuleSet](/powershell/module/az.KeyVault/Update-azKeyVaultNetworkRuleSet)

## Next steps

* [Virtual network service endpoints for Key Vault](overview-vnet-service-endpoints.md)
* [Azure Key Vault security overview](security-features.md)
