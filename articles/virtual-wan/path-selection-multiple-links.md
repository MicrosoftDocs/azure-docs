---
title: 'Azure path selection across multiple ISP links'
titleSuffix: Azure Virtual WAN
description: Learn how Azure Virtual WAN can include link information to steer traffic across various links using Azure path selection.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 04/27/2021
ms.author: cherylmc

---

# Azure path selection across multiple ISP links

Azure Virtual WAN provides a user the capability to include link information in a VPN Site, enabling scenarios where the VPN/SD-WAN device solution can program branch-specific policies to steer traffic across various links into Azure. This is called **Azure path selection**.

## Architecture

To understand how Azure path selection works, let's use the example of a Virtual WAN VPN site and a site-to-site connection.

A VPN site represents the on-premises SD-WAN/VPN device with information such as public IP, device model and name, etc. The actual on-premises VPN site may have multiple ISP links that can also be included in Virtual WAN VPN site information. This allows you to view the link information in Azure.

A site-to-site IPsec connection coming into a Virtual WAN’s VPN terminates on the VPN gateway instances inside a virtual hub. A site-to-site connection represents the connectivity between the VPN site and the Azure VPN gateway. It consists of one or more link connections. Each link connection consists of two tunnels with each tunnel terminating on a unique instance of the Azure Virtual WAN VPN gateway. Up to four link connections can be set up in the site-to-site connection, which makes it possible to have up to eight tunnels within a site-to-site connection. Azure supports up to 2000 tunnels terminating inside a single Virtual WAN VPN gateway.

:::image type="content" source="./media/path-selection-multiple-links/multi-link-site.png" alt-text="Multi-link diagram":::

This figure shows multi-link at a site connecting to Azure Virtual WAN. In this diagram:

* There are two ISP links at the on-premises branch (VPN/SD-WAN device). Each ISP link corresponds to a link connection.

* It assumed that the on-premises customer-manager VPN/SD-WAN device supports IKEv1 or IKEv2 IPsec.

* Each Azure site-to-site Virtual WAN connection is composed of link connections within itself. A connection supports up to four link connections. Azure charges a connection unit fee for the Virtual WAN connection. There is no charge for the link connections.

* Each link connection, in turn, consists of two IPsec tunnels that can terminate on two different instances of the Virtual WAN VPN gateway. The gateways are set up as active-active gateways for resiliency. Each link connection is required to have a unique IP address and BGP Peering IP. In the diagram, Tunnel 0 can terminate on instance 0, and Tunnel 1 can terminate on instance 1.

* Branch devices that provide path selection can enable appropriate policy in the branch management solution to steer traffic across multiple links to Azure. For example, the ISP 1 link can be used for higher priority traffic and the ISP 2 link can be used as backup.

* It is important to note that Virtual HUB VPN uses ECMP (equal cost multi-path routing) across all terminating tunnels.

## Next steps

See the [Azure FAQ](virtual-wan-faq.md).