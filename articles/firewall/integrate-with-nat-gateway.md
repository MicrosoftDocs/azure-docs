---
title: Scale SNAT ports with Azure NAT Gateway
description: You can integrate Azure Firewall with NAT Gateway to increase SNAT ports.
services: firewall
author: jocortems
ms.service: firewall
ms.topic: how-to
ms.date: 04/23/2021
ms.author: jocorte 
ms.custom: devx-track-azurepowershell
---

# Scale SNAT ports with Azure NAT Gateway

Azure Firewall provides 2048 SNAT ports per public IP address configured, and you can associate up to [250 public IP addresses](./deploy-multi-public-ip-powershell.md). Depending on your architecture and traffic patterns, you might need more than the 512,000 available SNAT ports with this configuration. For example, when you use it to protect large [Windows Virtual Desktop deployments](./protect-windows-virtual-desktop.md) that integrate with Microsoft 365 Apps.

Another challenge with using a large number of public IP addresses is when there are downstream IP address filtering requirements. Azure Firewall randomly selects the source public IP address to use for a connection, so you need to allow all public IP addresses associated with it. Even if you use [Public IP address prefixes](../virtual-network/public-ip-address-prefix.md) and you need to associate 250 public IP addresses to meet your outbound SNAT port requirements, you still need to create and allow 16 public IP address prefixes.

A better option to scale outbound SNAT ports is to use [NAT gateway resource](../virtual-network/nat-gateway/nat-overview.md). It provides 64,000 SNAT ports per public IP address and supports up to 16 public IP addresses, effectively providing up to 1,024,000 outbound SNAT ports.

When a NAT gateway resource is associated with an Azure Firewall subnet, all outbound Internet traffic automatically uses the public IP address of the NAT gateway. There is no need to configure [User Defined Routes](../virtual-network/tutorial-create-route-table-portal.md). Response traffic uses the Azure Firewall public IP address to maintain flow symmetry. If there are multiple IP addresses associated with the NAT gateway the IP address is randomly selected. It isn't possible to specify what address to use.

There is no double NAT with this architecture. Azure Firewall instances send the traffic to NAT gateway using their private IP address rather than Azure Firewall public IP address.

>[!NOTE]
> Using Azure NAT Gateway is currently imcompatible with Azure Firewall if you have deployed your [Azure Firewall across multiple availability zones](https://docs.microsoft.com/en-us/azure/firewall/deploy-availability-zone-powershell). Learn more about Azure NAT Gateway and availability zones [here](https://docs.microsoft.com/en-us/azure/virtual-network/nat-gateway/nat-gateway-resource#cross-zone-outbound-scenarios-not-supported).

## Associate NAT gateway with Azure Firewall subnet - Azure PowerShell

The following example creates and attaches a NAT gateway with an Azure Firewall subnet using Azure PowerShell.

```azurepowershell-interactive
# Create public IP addresses
New-AzPublicIpAddress -Name public-ip-1 -ResourceGroupName nat-rg -Sku Standard -AllocationMethod Static -Location 'South Central US'
New-AzPublicIpAddress -Name public-ip-2 -ResourceGroupName nat-rg -Sku Standard -AllocationMethod Static -Location 'South Central US'

# Create NAT gateway
$PublicIPAddress1 = Get-AzPublicIpAddress -Name public-ip-1 -ResourceGroupName nat-rg
$PublicIPAddress2 = Get-AzPublicIpAddress -Name public-ip-2 -ResourceGroupName nat-rg
New-AzNatGateway -Name firewall-nat -ResourceGroupName nat-rg -PublicIpAddress $PublicIPAddress1,$PublicIPAddress2 -Location 'South Central US' -Sku Standard

# Associate NAT gateway to subnet
$virtualNetwork = Get-AzVirtualNetwork -Name nat-vnet -ResourceGroupName nat-rg
$natGateway = Get-AzNatGateway -Name firewall-nat -ResourceGroupName nat-rg
$firewallSubnet = $virtualNetwork.subnets | Where-Object -Property Name -eq AzureFirewallSubnet
$firewallSubnet.NatGateway = $natGateway
$virtualNetwork | Set-AzVirtualNetwork
```

## Associate NAT gateway with Azure Firewall subnet - Azure CLI

The following example creates and attaches a NAT gateway with an Azure Firewall subnet using Azure CLI.

```azurecli-interactive
# Create public IP addresses
az network public-ip create --name public-ip-1 --resource-group nat-rg --sku standard
az network public-ip create --name public-ip-2 --resource-group nat-rg --sku standard

# Create NAT gateway
az network nat gateway create --name firewall-nat --resource-group nat-rg --public-ip-addresses public-ip-1 public-ip-2

# Associate NAT gateway to subnet
az network vnet subnet update --name AzureFirewallSubnet --vnet-name nat-vnet --resource-group nat-rg --nat-gateway firewall-nat
```

## Next steps

- [Designing virtual networks with NAT gateway resources](../virtual-network/nat-gateway/nat-gateway-resource.md)
