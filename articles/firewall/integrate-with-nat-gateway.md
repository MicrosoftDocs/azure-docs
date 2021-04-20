---
title: Scale SNAT ports with NAT Gateway
description: You can integrate Azure Firewall with NAT Gateway to increase SNAT ports.
services: firewall
author: jocortems
ms.service: firewall
ms.topic: how-to
ms.date: 04/21/2021
ms.author: jocorte
---

# Scale SNAT ports with NAT Gateway

Azure Firewall provides 2048 SNAT ports per public IP address configured,  and you can associate up to [250 public IP addresses](./deploy-multi-public-ip-powershell.md). Depending on your architecture and traffic patterns, you might need more than the 512,000 available SNAT ports with this configuration. For example, when you use it to protect large [Windows Virtual Desktop deployments](./protect-windows-virtual-desktop.md) that integrate with Microsoft 365 Apps.

Another challenge with using a large number of public IP addresses is when there are downstream IP address filtering requirements. Azure Firewall randomly selects the source public IP address to use for a connection, so you need to allow all public IP addresses associated with it. Even if you use [Public IP address prefixes](../virtual-network/public-ip-address-prefix.md) and you need to associate 250 public IP addresses to meet your outbound SNAT port requirements, you still need to create and allow 16 public IP address prefixes.

A better option to scale outbound SNAT ports is to use [NAT gateway resource](../virtual-network/nat-overview.md). It provides 64,000 SNAT ports per public IP address and supports up to 16 public IP addresses, effectively providing up to 1,024,000 outbound SNAT ports.

When a NAT gateway resource is associated with an Azure Firewall subnet, all outbound Internet traffic automatically uses the public IP address of the NAT gateway. There is no need to configure [User Defined Routes](../virtual-network/tutorial-create-route-table-portal.md). Response traffic uses the Azure Firewall public IP address to maintain flow symmetry. If there are multiple IP addresses associated with the NAT gateway, the IP address is randomly selected. It isn't possible to specify what address to use.

There is no double NAT with this architecture. Azure Firewall instances sends the traffic to NAT gateway using their private IP address rather than Azure Firewall public IP address.

## Associate NAT gateway with Azure Firewall subnet

The following example creates and attaches a NAT gateway with an Azure Firewall subnet.

```azurecli-interactive
# Create public IP addresses
az network public-ip create --name public-ip-1 --resource-group nat-rg --sku standard
az network public-ip create --name public-ip-2 --resource-group nat-rg --sku standard

# Create NAT gateway
az network nat gateway create --name firewall-nat --resource-group nat-rg --public-ip-addresses public-ip-1 public-ip-2

# Associate NAT gateway to subnet
az network vnet subnet update --name AzureFirewallSubnet --vnet-name nat-vnet --resource-group nat-rg --nat-gateway firewall-nat
```
