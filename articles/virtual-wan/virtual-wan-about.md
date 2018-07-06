---
title: 'Azure Virtual WAN Overview | Microsoft Docs'
description: Learn about Azure Virtual WAN.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: overview
ms.date: 07/05/2018
ms.author: cherylmc
Customer intent: As someone with a networking background, I want to understand what Virtual WAN is and if it is the right choice for my Azure network.
---

# What is Azure Virtual WAN? - Preview

**This article is currently in progress. This is not the final version**

Azure Virtual WAN is a networking service providing optimized and automated branch to branch connectivity through Azure. Azure Virtual WAN lets you connect and configure branch devices to communicate with Azure either manually, or with preferred partner devices. Using preferred partner devices allows you ease of use, simplification of connectivity and configuration management. The built-in dashboard provides instant troubleshooting insights that can help save you time and gives you an easy way to view large-scale site-to-site connectivity.

Azure Virtual WAN lets you automatically connect and configure on-premises devices from preferred vendors. The built-in dashboard provides instant troubleshooting insights that can help save you time and gives you an easy way to view large-scale site-to-site connectivity.

This article provides a quick view into the network connectivity of your Azure and non-Azure workloads. Azure Virtual WAN offers the following advantages:

* Integrated connectivity solutions in hub and spoke - Automate site-to-site connectivity and configuration between on-premises and the Azure hub from a variety of sources, including preferred partner solutions.
* Automated spoke configuration and configuration – Connect your virtual networks and workload to the Azure hub seamlessly.
* Intuitive troubleshooting – You can see the end-to-end flow within Azure and use this information to take required actions.

![Virtual WAN diagram](./media/virtual-wan-about/virtualwan.png)

## <a name="pref"></a>How does Microsoft preferred vendor integration work?

1. The branch device controller/connector is authenticated to export Site-centric information into Azure by using an Azure Service Principal .
2. The branch device controller/connector obtains the Azure connectivity configuration and updates the local device. This automates the configuration download, editing, and updating of the on-premises device.
3. Once the device has the right Azure configuration, a site-to-site connection (two active tunnels) is established to the Azure WAN. Azure requires the branch device controller/connector to support IKEv2 (Details below). BGP is optional.

|IPSec Properties| |
|---|---|
|Ike Encryption Algorithm | AES 256|
|Ike Integrity Algorithm | SHA256 |
|Dh Group |	DH2 |
|IPsec Encryption Algorithm	| GCM AES 256 |
|IPsec Integrity Algorithm | GCM AES 256 |
|PFS Group | PFS2 |

## Virtual WAN resources

To configure an end-to-end virtual WAN, you create the following resources:

* **virtualWAN:** This resource represents a virtual overlay of your Azure network and is a collection of multiple resources. It contains links to all your virtual hubs that you would like to have within the virtual WAN. Virtual WAN resources are isolated from each other and cannot contain a common hub. Virtual Hubs across Virtual WAN do not communicate with each other.

* **Site:** The site resource known as vpnsite represents your on-premises VPN device and its settings. By using a preferred device vendor, you have a built-in solution to automatically export this information to Azure.

* **Hub:** A virtual hub is a Microsoft managed virtual network. The hub contains various service endpoints to enable connectivity from your on-premises network (vpnsite). The hub is the core of your network in a region. There can only be one hub per Azure region. When you create a hub using Azure portal, it automatically creates a virtualHub VNet and a vpngateway. 

  A hub gateway is not the same as a virtual network gateway that you use for ExpressRoute and VPN Gateway. For example, when using Virtual WAN, you don't create a Site-to-Site connection from your on-premises site directly to your VNet. Instead, you create a Site-to-Site connection to the hub. The traffic always goes through the hub gateway. This means your VNets do not need their own virtual network gateway. Virtual WAN lets your VNets take advantage of scaling easily through the virtual hub and the virtual hub gateway. 

* **Hub virtual network connection:** This resource is used to connect the hub seamlessly to your virtual network. At this time, you can only connect to virtual networks that are within the same hub region.

## Next steps

To create a Site-to-Site connection using Virtual WAN, you can either go through a Microsoft preferred integrator, or create the connection manually. To create the connection manually, see [Create a Site-to-Site connection using Virtual WAN](virtual-wan-site-to-site-portal.md).