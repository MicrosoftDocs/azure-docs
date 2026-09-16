---
title: Scale SNAT ports with Azure NAT Gateway
description: You can integrate Azure Firewall with a NAT gateway to increase SNAT ports.
services: firewall
author: alittleton
ms.service: azure-firewall
ms.topic: how-to
ms.date: 09/19/2025
ms.author: alittleton
ms.custom: devx-track-azurepowershell, devx-track-azurecli
# Customer intent: As a network architect, I want to integrate Azure NAT Gateway with Azure Firewall, so that I can efficiently scale SNAT ports to accommodate high outbound traffic demands without compromising on IP address management.
---

# Scale SNAT ports with Azure NAT Gateway

Azure Firewall provides 2,496 SNAT ports per public IP address configured per backend virtual machine scale set instance (Minimum of two instances), and you can associate up to [250 public IP addresses](./deploy-multi-public-ip-powershell.md). Depending on your architecture and traffic patterns, you might need more than the 1,248,000 available SNAT ports with this configuration. For example, when you use it to protect large [Azure Virtual Desktop deployments](./protect-azure-virtual-desktop.md) that integrate with Microsoft 365 Apps.

One of the challenges with using a large number of public IP addresses is when there are downstream IP address filtering requirements. When Azure Firewall is associated with multiple public IP addresses, you need to apply the filtering requirements across all public IP addresses associated with it. Even if you use [Public IP address prefixes](../virtual-network/ip-services/public-ip-address-prefix.md) and you need to associate 250 public IP addresses to meet your outbound SNAT port requirements, you still need to create and allow 16 public IP address prefixes.

A better option to scale and dynamically allocate outbound SNAT ports is to use an [Azure NAT Gateway](../virtual-network/nat-gateway/nat-overview.md). It provides 64,512 SNAT ports per public IP address and supports up to 16 IPv4 public IP addresses. This effectively provides up to 1,032,192 outbound SNAT ports. Azure NAT Gateway also [dynamically allocates SNAT ports](/azure/nat-gateway/nat-gateway-resource#nat-gateway-dynamically-allocates-snat-ports) on a subnet level, so all the SNAT ports provided by its associated IP addresses is available on demand to provide outbound connectivity.

When you associate a NAT gateway with **AzureFirewallSubnet**, outbound internet traffic from the firewall uses the NAT gateway's public IP addresses. You don't need an additional user-defined route (UDR) to send that traffic from the firewall through the NAT gateway. Keep the [workload subnet routes](../nat-gateway/tutorial-hub-spoke-nat-firewall.md#create-spoke-network-route-table) that direct traffic to the firewall's private IP address for inspection. Response traffic to an outbound flow also passes through the NAT gateway. If multiple public IP addresses are associated with the NAT gateway, it selects an address randomly. You can't specify which address to use.

There’s no double NAT with this architecture. Azure Firewall instances send the traffic to NAT gateway using their private IP address rather than Azure Firewall public IP address.

## Choose between multiple public IP addresses and NAT Gateway

When your firewall runs low on SNAT ports, you can either add multiple public IP addresses or use a NAT gateway:

- **Add multiple public IP addresses** when you're cost sensitive and your scale needs are moderate. Each public IP address adds 2,496 SNAT ports per backend instance, and you can associate up to 250 public IP addresses. For steps, see [Deploy an Azure Firewall with multiple public IP addresses](deploy-multi-public-ip-powershell.md).
- **Use a NAT gateway** when you need dynamic SNAT port allocation across the subnet. It provides up to 64,512 SNAT ports per public IP address.

For a full comparison of advantages and disadvantages, see [Best practices for Azure Firewall performance](firewall-best-practices.md#recommendations).

To create a StandardV2 NAT gateway as part of an Azure Firewall deployment in the portal, select **Enable NAT gateway** on the **Advanced** tab. For the complete procedure, see [Create Azure Firewall with a StandardV2 NAT gateway](../nat-gateway/tutorial-hub-spoke-nat-firewall.md#create-azure-firewall). The following PowerShell and CLI examples associate a Standard NAT gateway with an existing firewall subnet.

> [!NOTE]
> Use a StandardV2 NAT gateway with a zone-redundant firewall. A Standard NAT gateway doesn't support zone-redundant deployments. For steps, see [Integrate Azure Firewall with NAT Gateway V2](integrate-with-nat-gateway-v2.md). For more information about SKU differences, see [NAT Gateway SKUs](/azure/nat-gateway/nat-sku).
> Azure NAT Gateway isn't supported inside a secured virtual hub (vWAN). In a vWAN architecture, configure NAT Gateway directly on the spoke virtual networks instead. For steps to integrate NAT Gateway with a firewall in a hub virtual network, see the [NAT gateway and Azure Firewall integration tutorial](../nat-gateway/tutorial-hub-spoke-nat-firewall.md). For more information about Azure Firewall architecture options, see [What are the Azure Firewall Manager architecture options?](../firewall-manager/vhubs-and-vnets.md)

## Associate a NAT gateway with an Azure Firewall subnet - Azure PowerShell

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
## Associate a NAT gateway with an Azure Firewall subnet - Azure CLI
The following example creates and attaches a NAT gateway with an Azure Firewall subnet using Azure CLI.
```azurecli-interactive
# Create public IP addresses
az network public-ip create --name public-ip-1 --resource-group nat-rg --sku standard
az network public-ip create --name public-ip-2 --resource-group nat-rg --sku standard
# Create NAT gateway
az network nat gateway create --name firewall-nat --resource-group nat-rg --public-ip-addresses public-ip-1 public-ip-2 --sku standard
# Associate NAT gateway to subnet
az network vnet subnet update --name AzureFirewallSubnet --vnet-name nat-vnet --resource-group nat-rg --nat-gateway firewall-nat
```

## Next steps

- [Scale Azure Firewall SNAT ports with NAT Gateway for large workloads](https://azure.microsoft.com/blog/scale-azure-firewall-snat-ports-with-nat-gateway-for-large-workloads/).
- [Design virtual networks with NAT gateway](../virtual-network/nat-gateway/nat-gateway-resource.md)
- [Integrate NAT gateway with Azure Firewall in a hub and spoke network](../nat-gateway/tutorial-hub-spoke-nat-firewall.md)
