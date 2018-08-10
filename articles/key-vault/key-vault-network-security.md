---
ms.assetid: 
title: Configure Azure Key Vault Firewalls and Virtual Networks
description: Step-by-step instructions to configure Key Vault firewalls and virtual networks
services: key-vault
author: amitbapat
manager: mbaldwin
ms.service: key-vault
ms.topic: article
ms.workload: identity
ms.date: 08/09/2018
ms.author: ambapat
---
# Configure Azure Key Vault Firewalls and Virtual Networks

This guide describes step-by-step instructions to configure Key Vault firewalls and virtual networks to restrict access to your key vault. The [virtual network service endpoints for Key Vault](key-vault-vnet-service-endpoints.md) allow you to restrict access to key vault to specified Virtual Network and/or a list of IPv4 (Internet Protocol version 4) address ranges.

## Azure portal
1. Navigate to the key vault you want to secure.
2. Click on 'Firewalls and virtual networks'.
3. Click on 'Selected networks' under 'Allow access from:'.
4. To add existing virtual networks to firewalls and virtual network rules, click '+ Add existing virtual networks'.
5. In the new blade that pops up, select the subscription, virtual network(s), and subnet(s) that you want to allow access to this key vault. If the virtual network(s) and subnet(s) you select do not have service endpoints enabled you'll a message as shown below. Click 'Enable' after confirming that you want to enable service endpoints for the listed the virtual network(s) and subnet(s). It may take up to 15 minutes to take effect.
6. You can also add new virtual network(s) and subnet(s) and then enable service endpoints for the newly created virtual network(s) and subnet(s), by clicking '+ Add new virtual network' and following prompts.
7. Under 'IP Networks' you can add IPv4 address ranges by typing IPv4 address ranges in [CIDR (Classless Inter-domain Routing) notation](https://tools.ietf.org/html/rfc4632) or individual IP addresses.
8. Click 'Save'.

## Azure CLI 2.0

1. Install Azure CLI 2.0 and Login.
Install keyvault-preview extension. You must install the keyvault-preview extension to use the VNET Service Endpoints for Key Vault.
az extension add --name keyvault-preview
List available virtual network rules, if you have not set any rules for this key vault, the list will be empty.
az keyvault network-rule list --resource-group myresourcegroup --name mykeyvault
Enable Service Endpoint for Key Vault on an existing Virtual Network and subnet
az network vnet subnet update --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --service-endpoints "Microsoft.KeyVault"
Add a network rule for a virtual network and subnet
subnetid=$(az network vnet subnet show --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --query id --output tsv)
az keyvault network-rule add --resource-group "demo9311" --name "demo9311premium" --subnet $subnetid
Add IP address range to allow traffic from
az keyvault network-rule add --resource-group "myresourcegroup" --name "mykeyvault" --ip-address "191.10.18.0/24"
If this key vault needs to be accessible by any trusted services, set 'bypass' to AzureServices
az keyvault update --resource-group "myresourcegroup" --name "mykeyvault" --bypass AzureServices
Now the final and important step, turn the network rules ON by setting the default action to 'Deny'
az keyvault update --resource-group "myresourcegroup" --name "mekeyvault" --default-action Deny

## Azure PowerShell

1. Install the latest Azure PowerShell and Login.

2. Install preview version of AzureRM.KeyVault module

3. List available virtual network rules, if you have not set any rules for this key vault, the list will be empty.
```PowerShell
(Get-AzureRmKeyVault -VaultName "mykeyvault").NetworkAcls
```

4. Enable Service Endpoint for Key Vault on an existing Virtual Network and subnet
```PowerShell
Get-AzureRmVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Set-AzureRmVirtualNetworkSubnetConfig -Name "mysubnet" -AddressPrefix "10.1.1.0/24" -ServiceEndpoint "Microsoft.KeyVault" | Set-AzureRmVirtualNetwork
```

5. Add a network rule for a virtual network and subnet
```PowerShell
$subnet = Get-AzureRmVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Get-AzureRmVirtualNetworkSubnetConfig -Name "mysubnet"
Add-AzureRmKeyVaultNetworkRule -VaultName "mykeyvault" -VirtualNetworkResourceId $subnet.Id
```

6. Add IP address range to allow traffic from
```PowerShell
Add-AzureRmKeyVaultNetworkRule -VaultName "mykeyvault" -IpAddressRange "16.17.18.0/24"
```

7. If this key vault needs to be accessible by any trusted services, set 'bypass' to AzureServices
```PowerShell
Update-AzureRmKeyVaultNetworkRuleSet -VaultName "mykeyvault" -Bypass AzureServices
```

8. Now the final and important step, turn the network rules ON by setting the default action to 'Deny'
```PowerShell
Update-AzureRmKeyVaultNetworkRuleSet -VaultName "mykeyvault" -DefaultAction Deny
```

## References
* [Virtual network service endpoints for Key Vault](key-vault-vnet-service-endpoints.md)
* [Secure your key vault](key-vault-secure-your-key-vault.md)