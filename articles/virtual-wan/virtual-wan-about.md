---
title: 'Azure Virtual WAN Overview | Microsoft Docs'
description: Learn about Azure Virtual WAN.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: overview
ms.date: 07/02/2018
ms.author: cherylmc
Customer intent: As someone with a networking background, I want to understand what Virtual WAN is and if it is the right choice for my Azure network.
---

# What is Azure Virtual WAN? - Preview

**This article is in progress**

Azure Cortex provides simplified network connectivity management across hybrid cloud workloads. You can automate the deployment of branch networks to the Azure WAN and apply Site (branch) traffic management policies across your workloads, while leveraging an ecosystem of Azure partners with on-premises solutions to automatically connect to Azure.

Cortex lets you automatically connect and configure on-premises devices from preferred vendors. The built-in dashboard provides instant troubleshooting insights that can help save you time and gives you an easy way to view large-scale site-to-site connectivity.

This overview provides a quick view into the network connectivity of your Azure and non-Azure workloads. Azure Cortex offers the following advantages:

* Integrated connectivity solutions in hub and spoke - Automate site-to-site connectivity and configuration between on-premises and the Azure hub from a variety of sources, including connected partner solutions.
* Automated spoke setup and configuration – Connect your virtual networks and workload to the Azure hub seamlessly.
* Intuitive troubleshooting – You can see the end-to-end flow within Azure and use this information to take required actions.

## <a name="solutions"></a>Integrated connectivity solutions in hub and spoke

Both integrated connectivity solutions that have on-premises devices, and hybrid solutions, require a controller that can ingest Microsoft APIs to establish site-to-site connectivity with the Azure WAN and VirtualHub.

Azure Cortex contains the following components:





## <a name="pref"></a>How does Microsoft preferred vendor integration work?

1. The branch device controller/connector is authenticated to export Site-centric information into Azure by using either the Azure Service Principal or Role-based access functionality, which is enabled in their UI.
2. The branch device controller/connector obtains the Azure connectivity configuration and updates the local device. This automates the configuration download, editing, and updating of the on-premise device.
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

* **WAN:** The WAN resource represents your entire network in Azure. It contains links to all hubs that you would like to have within this WAN. WANs are isolated from each other and cannot contain common hub, or connections between two hubs in different WANs.

* **Site:** The site resource represents your on-premises VPN device and its settings. A site can connect to multiple hubs. By using a preferred device vendor, you have a built-in solution to automatically export this information to Azure.

* **Hub:** A virtual hub (known also as a hub) is a VNet with specific type of gateway. The hub contains various service endpoints to enable connectivity to your on-premises network (your site). The hub is the core of your network in a region. There can only be one hub per Azure standard region. When you create a hub, it automatically creates a hub VNet and a hub gateway. 

  A hub gateway is not the same as a virtual network gateway that you use for ExpressRoute and VPN Gateway. You don't create a Site-to-Site connection from your on-premises site to your VNet, rather, you create a Site-to-Site connection to the hub. The traffic always goes through the hub gateway. This lets your VNets take advantage of scaling through the hub and the VNets do not need their own virtual network gateway.

* **Hub virtual network connection:** This resource is used to connect the hub seamlessly to your virtual network. At this time, you can only connect to virtual networks that are within the same hub region.

## Pricing

## <a name="faq"></a>FAQ

## Next steps