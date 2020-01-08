---
title: Azure Firewall forced tunneling
description: You can configure forced tunneling to route Internet-bound traffic to an additional firewall or network virtual appliance for further processing.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: article
ms.date: 01/08/2020
ms.author: victorh
---

# Azure Firewall forced tunneling

You can configure Azure Firewall to route all Internet-bound traffic to a designated next hop instead of going directly to the Internet. For example, you may have an on-premises edge firewall or other network virtual appliance (NVA) to process network traffic before it's passed to the Internet.

By default, forced tunneling isn't allowed on Azure Firewall to ensure all its outbound Azure dependencies are met. User Defined Route (UDR) configurations on the AzureFirewallSubnet that 
have a default route not going directly to the Internet are disabled.

## Forced tunneling configuration

To support forced tunneling, service management traffic is separated from customer traffic. An additional dedicated subnet named *AzureFirewallManagementSubnet* is required with its own associated public IP address. The only route allowed on this subnet is a default route to the Internet, and BGP route propagation must be disabled. 

Within this configuration, the *AzureFirewallSubnet* can now include routes to any on-premise firewall or NVA to process traffic before it's passed to the Internet. You can also publish these routes via BGP to *AzureFirewallSubnet* if BGP route propagation is enabled on this subnet.

Once you configure Azure Firewall to support forced tunneling, you can't undo the configuration. If you remove all other IP configurations on your firewall, the management IP configuration is removed as well and the firewall is deallocated. The public IP address assigned to the management IP configuration can't be removed, but you can assign a different public IP address.

## Next steps

- Deploy Azure Firewall with forced tunneling