---
title: 'Azure Virtual WAN Overview | Microsoft Docs'
description: Learn about Virtual WAN automated scalable branch-to-branch connectivity.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: overview
ms.date: 09/25/2018
ms.author: cherylmc
Customer intent: As someone with a networking background, I want to understand what Virtual WAN is and if it is the right choice for my Azure network.
---

# What is Azure Virtual WAN?

Azure Virtual WAN is a networking service that provides optimized and automated branch-to-branch connectivity through Azure. Virtual WAN lets you connect and configure branch devices to communicate with Azure. This can be done either manually, or by using preferred partner devices through a Virtual WAN partner. See the [Preferred partners](https://go.microsoft.com/fwlink/p/?linkid=2019615) article for details. Using preferred partner devices allows you ease of use, simplification of connectivity, and configuration management. The Azure WAN built-in dashboard provides instant troubleshooting insights that can help save you time, and gives you an easy way to view large-scale connectivity.

![Virtual WAN diagram](./media/virtual-wan-about/virtualwan.png)

This article provides a quick view into the network connectivity of your Azure and non-Azure workloads. Virtual WAN offers the following advantages:

* **Integrated connectivity solutions in hub and spoke:** Automate Site-to-Site configuration and connectivity between on-premises sites and an Azure hub.
* **Automated spoke setup and configuration:** Connect your virtual networks and workloads to the Azure hub seamlessly.
* **Intuitive troubleshooting:** You can see the end-to-end flow within Azure and use this information to take required actions.

## <a name="s2s"></a>Site-to-site connections

To create a Site-to-Site connection using Virtual WAN, you can either go through a [Virtual WAN partner](https://go.microsoft.com/fwlink/p/?linkid=2019615), or create the connection manually.

### <a name="s2spartner"></a>Working with a Virtual WAN partner

When you work with a Virtual WAN partner, the process is:

1. The branch device (VPN/SDWAN) controller is authenticated to export site-centric information into Azure by using an [Azure Service Principal](../azure-resource-manager/resource-group-create-service-principal-portal.md).
2. The branch device (VPN/SDWAN) controller obtains the Azure connectivity configuration and updates the local device. This automates the configuration download, editing, and updating of the on-premises VPN device.
3. Once the device has the right Azure configuration, a site-to-site connection (two active tunnels) is established to the Azure WAN. Azure supports both IKEv1 and IKEv2. BGP is optional.


If you don't want to use a preferred partner, you can configure the connection manually, see [Create a Site-to-Site connection using Virtual WAN](virtual-wan-site-to-site-portal.md).

## <a name="p2s"></a>Point-to-site connections (Preview)

A Point-to-Site (P2S) connection lets you create a secure connection to your virtual hub from an individual client computer. A P2S connection is established by starting it from the client computer. This solution is useful for telecommuters who want to connect from a remote location, such as from home or a conference. P2S VPN is also a useful solution to use instead of S2S VPN when you have only a few clients that need to connect.

To create the connection manually, see [Create a point-to-site connection using Virtual WAN](https://go.microsoft.com/fwlink/p/?linkid=2020051&clcid).

## <a name="er"></a>ExpressRoute connections (Preview)

To create the connection manually, see [Create an ExpressRoute connection using Virtual WAN](https://go.microsoft.com/fwlink/p/?linkid=2020148&clcid).


## <a name="resources"></a>Virtual WAN resources

To configure an end-to-end virtual WAN, you create the following resources:

* **virtualWAN:** The virtualWAN resource represents a virtual overlay of your Azure network and is a collection of multiple resources. It contains links to all your virtual hubs that you would like to have within the virtual WAN. Virtual WAN resources are isolated from each other and cannot contain a common hub. Virtual Hubs across Virtual WAN do not communicate with each other. The ‘Allow branch to branch traffic’ property enables traffic between VPN sites as well as VPN to ExpressRoute enabled Sites. Be aware that ExpressRoute in Azure Virtual WAN is currently in Preview.

* **Site:** The site resource known as vpnsite represents your on-premises VPN device and its settings. By working with a Virtual WAN partner, you have a built-in solution to automatically export this information to Azure.

* **Hub:** A virtual hub is a Microsoft-managed virtual network. The hub contains various service endpoints to enable connectivity from your on-premises network (vpnsite). The hub is the core of your network in a region. There can only be one hub per Azure region. When you create a hub using Azure portal, it creates a virtual hub VNet and a virtual hub vpngateway.

  A hub gateway is not the same as a virtual network gateway that you use for ExpressRoute and VPN Gateway. For example, when using Virtual WAN, you don't create a Site-to-Site connection from your on-premises site directly to your VNet. Instead, you create a Site-to-Site connection to the hub. The traffic always goes through the hub gateway. This means that your VNets do not need their own virtual network gateway. Virtual WAN lets your VNets take advantage of scaling easily through the virtual hub and the virtual hub gateway. 

* **Hub virtual network connection:** The Hub virtual network connection resource is used to connect the hub seamlessly to your virtual network. At this time, you can only connect to virtual networks that are within the same hub region.

* **Hub route table:**  You can create a virtual hub route and apply the route to the virtual hub route table. You can apply multiple routes to the virtual hub route table.

## <a name="faq"></a>FAQ

[!INCLUDE [Virtual WAN FAQ](../../includes/virtual-wan-faq-include.md)]


## Next steps

* View the [Virtual WAN partners and locations](https://aka.ms/virtualwan)