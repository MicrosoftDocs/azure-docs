---
title: 'Connect your on-premises network to an Azure virtual network: Site-to-Site VPN: Classic portal | Microsoft Docs'
description: Steps to create an IPsec connection from your on-premises network to an Azure virtual network over the public Internet. These steps will help you create a cross-premises Site-to-Site VPN Gateway connection using the Classic portal and the classic deployment model.
services: vpn-gateway
documentationcenter: ''
author: cherylmc
manager: timlt
editor: ''
tags: azure-service-management

ms.assetid: 024ecb29-64de-4ff1-84f1-1a45a8595f0b
ms.service: vpn-gateway
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/24/2017
ms.author: cherylmc

---
# Create a VNet with a Site-to-Site connection using the classic portal (classic)

[!INCLUDE [deployment models](../../includes/vpn-gateway-classic-deployment-model-include.md)]

This article shows you how to use the classic portal to create a Site-to-Site VPN gateway connection from your on-premises network to the VNet. The steps in this article apply to the classic deployment model. You can also create this configuration using a different deployment tool or deployment model by selecting a different option from the following list:

> [!div class="op_single_selector"]
> * [Azure portal](vpn-gateway-howto-site-to-site-resource-manager-portal.md)
> * [PowerShell](vpn-gateway-create-site-to-site-rm-powershell.md)
> * [CLI](vpn-gateway-howto-site-to-site-resource-manager-cli.md)
> * [Azure portal (classic)](vpn-gateway-howto-site-to-site-classic-portal.md)
> * [Classic portal (classic)](vpn-gateway-site-to-site-create.md)
> 
>

![Site-to-Site VPN Gateway cross-premises connection diagram](./media/vpn-gateway-site-to-site-create/site-to-site-connection-diagram.png)


A Site-to-Site VPN gateway connection is used to connect your on-premises network to an Azure virtual network over an IPsec/IKE (IKEv1 or IKEv2) VPN tunnel. This type of connection requires a VPN device located on-premises that has an externally facing public IP address assigned to it. For more information about VPN gateways, see [About VPN gateway](vpn-gateway-about-vpngateways.md).

#### Additional configurations

If you want to connect VNets together, see [Configure a VNet-to-VNet connection for the classic deployment model](virtual-networks-configure-vnet-to-vnet-connection.md). If you want to add a Site-to-Site connection to a VNet that already has a connection, see [Add a S2S connection to a VNet with an existing VPN gateway connection](vpn-gateway-multi-site.md).
## Before you begin

[!INCLUDE [deployment models](../../includes/vpn-gateway-deployment-models-include.md)]

Verify that you have the following items before beginning configuration:

* A compatible VPN device and someone who is able to configure it. See [About VPN Devices](vpn-gateway-about-vpn-devices.md). If you aren't familiar with configuring your VPN device, or are unfamiliar with the IP address ranges located in your on-premises network configuration, you need to coordinate with someone who can provide those details for you.
* An externally facing public IP address for your VPN device. This IP address cannot be located behind a NAT.
* An Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).

## <a name="CreateVNet"></a>Create your virtual network
1. Log in to the [Azure classic portal](https://manage.windowsazure.com/).
2. In the lower left corner of the screen, click **New**. In the navigation pane, click **Network Services**, and then click **Virtual Network**. Click **Custom Create** to begin the configuration wizard.
3. To create your VNet, enter your configuration settings on the following pages:

## <a name="Details"></a>Virtual network details page
Enter the following information:

* **Name**: Name your virtual network. For example, *EastUSVNet*. You use this virtual network name when you deploy your VMs and PaaS instances, so you may not want to make the name too complicated.
* **Location**: The location is directly related to the physical location (region) where you want your resources (VMs) to reside. For example, if you want the VMs that you deploy to this virtual network to be physically located in *East US*, select that location. You can't change the region associated with your virtual network after you create it.

## <a name="DNS"></a>DNS servers and VPN connectivity page
Enter the following information, and then click the next arrow on the lower right.

* **DNS Servers**: Enter the DNS server name and IP address, or select a previously registered DNS server from the shortcut menu. This setting does not create a DNS server. It allows you to specify the DNS servers that you want to use for name resolution for this virtual network.
* **Configure Site-To-Site VPN**: Select the checkbox for **Configure a site-to-site VPN**.
* **Local Network**: A local network represents your physical on-premises location. You can select a local network that you've previously created, or you can create a new local network. However, if you select to use a local network that you previously created, go to the **Local Networks** configuration page and verify that the VPN Device IP address (public facing IPv4 address) for the VPN device is accurate.

## <a name="Connectivity"></a>Site-to-site connectivity page
If you're creating a new local network, you see the **Site-To-Site Connectivity** page. If you want to use a local network that you previously created, this page will not appear in the wizard and you can move on to the next section.

Enter the following information, and then click the next arrow.

* **Name**: The name you want to call your local (on-premises) network site.
* **VPN Device IP Address**: The public facing IPv4 address of your on-premises VPN device that you use to connect to Azure. The VPN device cannot be located behind a NAT.
* **Address Space**: Include Starting IP and CIDR (Address Count). You specify the address range(s) that you want to be sent through the virtual network gateway to your local on-premises location. If a destination IP address falls within the ranges that you specify here, it is routed through the virtual network gateway.
* **Add address space**: If you have multiple address ranges that you want to be sent through the virtual network gateway, specify each additional address range. You can add or remove ranges later on the **Local Network** page.

## <a name="Address"></a>Virtual network address spaces page
Specify the address range that you want to use for your virtual network. These are the dynamic IP addresses (DIPS) that will be assigned to the VMs and other role instances that you deploy to this virtual network.

It's especially important to select a range that does not overlap with any of the ranges that are used for your on-premises network. You need to coordinate with your network administrator. Your network administrator may need to carve out a range of IP addresses from your on-premises network address space for you to use for your virtual network.

Enter the following information, and then click the checkmark on the lower right to configure your network.

* **Address Space**: Include Starting IP and Address Count. Verify that the address spaces you specify don't overlap any of the address spaces that you have on your on-premises network.
* **Add subnet**: Include Starting IP and Address Count. Additional subnets are not required, but you may want to create a separate subnet for VMs that will have static DIPS. Or you might want to have your VMs in a subnet that is separate from your other role instances.
* **Add gateway subnet**: Click to add the gateway subnet. The gateway subnet is used only for the virtual network gateway and is required for this configuration.

Click the checkmark on the bottom of the page to create your virtual network. When it completes, you see **Created** listed under **Status** on the **Networks** page in the Azure Classic Portal. After the VNet has been created, you can then configure your virtual network gateway.

[!INCLUDE [vpn-gateway-no-nsg](../../includes/vpn-gateway-no-nsg-include.md)]

## <a name="VNetGateway"></a>Configure your virtual network gateway
Configure the virtual network gateway to create a secure site-to-site connection. See [Configure a virtual network gateway in the Azure classic portal](vpn-gateway-configure-vpn-gateway-mp.md).

## Next steps
 Once your connection is complete, you can add virtual machines to your virtual networks. For more information, see [Virtual Machines](https://docs.microsoft.com/azure/#pivot=services&panel=Compute).

