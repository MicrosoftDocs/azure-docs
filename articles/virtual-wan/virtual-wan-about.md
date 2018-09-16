---
title: 'Azure Virtual WAN Overview | Microsoft Docs'
description: Learn about Virtual WAN automated scalable branch-to-branch connectivity.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: overview
ms.date: 07/18/2018
ms.author: cherylmc
Customer intent: As someone with a networking background, I want to understand what Virtual WAN is and if it is the right choice for my Azure network.
---

# What is Azure Virtual WAN? (Preview)

Azure Virtual WAN is a networking service that provides optimized and automated branch-to-branch connectivity through Azure. Virtual WAN lets you connect and configure branch devices to communicate with Azure. This can be done either manually, or by using preferred provider devices through a Virtual WAN partner. Using preferred provider devices allows you ease of use, simplification of connectivity, and configuration management. The Azure WAN built-in dashboard provides instant troubleshooting insights that can help save you time, and gives you an easy way to view large-scale Site-to-Site connectivity.

> [!IMPORTANT]
> Azure Virtual WAN is currently a managed Public Preview. To use Virtual WAN, you must [Enroll in the Preview](#enroll).
>
> This Public Preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.

This article provides a quick view into the network connectivity of your Azure and non-Azure workloads. Virtual WAN offers the following advantages:

* **Integrated connectivity solutions in hub and spoke:** Automate Site-to-Site configuration and connectivity between on-premises sites and an Azure hub from a variety of sources, including Virtual WAN partner solutions.
* **Automated spoke setup and configuration:** Connect your virtual networks and workloads to the Azure hub seamlessly.
* **Intuitive troubleshooting:** You can see the end-to-end flow within Azure and use this information to take required actions.

![Virtual WAN diagram](./media/virtual-wan-about/virtualwan.png)

## <a name="vendor"></a>Working with a Virtual WAN partner

1. The branch device (VPN/SDWAN) controller is authenticated to export Site-centric information into Azure by using an Azure Service Principal.
2. The branch device (VPN/SDWAN) controller obtains the Azure connectivity configuration and updates the local device. This automates the configuration download, editing, and updating of the on-premises VPN device.
3. Once the device has the right Azure configuration, a Site-to-Site connection (two active tunnels) is established to the Azure WAN. Azure requires the branch (VPN/SDWAN) controller to support IKEv2. BGP is optional.

## <a name="resources"></a>Virtual WAN resources

To configure an end-to-end virtual WAN, you create the following resources:

* **virtualWAN:** The virtualWAN resource represents a virtual overlay of your Azure network and is a collection of multiple resources. It contains links to all your virtual hubs that you would like to have within the virtual WAN. Virtual WAN resources are isolated from each other and cannot contain a common hub. Virtual Hubs across Virtual WAN do not communicate with each other.

* **Site:** The site resource known as vpnsite represents your on-premises VPN device and its settings. By working with a Virtual WAN partner, you have a built-in solution to automatically export this information to Azure.

* **Hub:** A virtual hub is a Microsoft-managed virtual network. The hub contains various service endpoints to enable connectivity from your on-premises network (vpnsite). The hub is the core of your network in a region. There can only be one hub per Azure region. When you create a hub using Azure portal, it automatically creates a virtual hub VNet and a virtual hub vpngateway.

  A hub gateway is not the same as a virtual network gateway that you use for ExpressRoute and VPN Gateway. For example, when using Virtual WAN, you don't create a Site-to-Site connection from your on-premises site directly to your VNet. Instead, you create a Site-to-Site connection to the hub. The traffic always goes through the hub gateway. This means that your VNets do not need their own virtual network gateway. Virtual WAN lets your VNets take advantage of scaling easily through the virtual hub and the virtual hub gateway. 

* **Hub virtual network connection:** The Hub virtual network connection resource is used to connect the hub seamlessly to your virtual network. At this time, you can only connect to virtual networks that are within the same hub region.

##<a name="enroll"></a>Enroll in the Preview

Before you can configure Virtual WAN, you must first enroll your subscription in the Preview. Otherwise, you will not be able to work with Virtual WAN in the portal. To enroll, send an email to <azurevirtualwan@microsoft.com> with your subscription ID. You will receive an email back once your subscription has been enrolled.

## <a name="faq"></a>FAQ

[!INCLUDE [Virtual WAN FAQ](../../includes/virtual-wan-faq-include.md)]

## <a name="feedback"></a>Preview feedback

We would appreciate your feedback. Please send an email to <azurevirtualwan@microsoft.com> to report any issues, or to provide feedback (positive or negative) for Virtual WAN. Include your company name in “[ ]” in the subject line. Also include your subscription ID if you are reporting an issue.

## Next steps

To create a Site-to-Site connection using Virtual WAN, you can either go through a [Virtual WAN partner](https://aka.ms/virtualwan), or create the connection manually. To create the connection manually, see [Create a Site-to-Site connection using Virtual WAN](virtual-wan-site-to-site-portal.md).
