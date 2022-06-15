---
title: Deploy Azure Firewall with multiple public IP addresses using Azure PowerShell
description: Deploy a firewall with multiple public IP addresses to protect a virtual hub
services: firewall-manager
author: vhorne
ms.service: firewall-manager
ms.topic: how-to
ms.date: 07/09/2020
ms.author: victorh 
ms.custom: devx-track-azurepowershell
---

# Deploy an Azure Firewall with multiple public IP addresses

If you want to protect a virtual hub using Azure Firewall, you can deploy the firewall with multiple public IP addresses using Azure PowerShell.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Deploy the firewall

Use the following Azure PowerShell example to deploy an Azure Firewall with multiple public IP addresses to protect a virtual hub.

```azurepowershell
Select-AzSubscription -SubscriptionId <subscription ID> 

$rgName = <resource group name> 
$vHub = Get-AzVirtualHub -Name <hub name> 
$vHubId = $vHub.Id 
$fwpips = New-AzFirewallHubPublicIpAddress -Count 3
$hubIpAddresses = New-AzFirewallHubIpAddress -PublicIPs $fwpips 
$fw = New-AzFirewall -Name <firewall name> -ResourceGroupName $rgName `
     -Location <location> -Sku AZFW_Hub -HubIPAddresses $hubIpAddresses `
     -VirtualHubId $vHubId 
```

### Update a public IP address

You can use Azure PowerShell to update a public IP address for an Azure Firewall. The following example deletes one public IP address from a firewall. It starts with three public IP addresses.

```azurepowershell
Select-AzSubscription -SubscriptionId <subscription ID>

$azfw = get-azfirewall -Name <firewall name> -ResourceGroupName <resource group name>
$ip1 = New-AzFirewallPublicIpAddress -Address <first ip address to keep>
$ip2 = New-AzFirewallPublicIpAddress -Address <second ip address to keep>
$ipAddresses = $ip1,$ip2
$azfw.HubIPAddresses.publicIPs.Addresses = $ipAddresses
$azfw.HubIPAddresses.publicIPs.count = 2
Set-AzFirewall -AzureFirewall $azfw
```

## Next steps

[What is a secured virtual hub?](secured-virtual-hub.md)
