<properties
   pageTitle="Create a virtual network with a site-to-site VPN connection using the Azure portal | Microsoft Azure"
   description="Create a virtual network with a site-to-site VPN connection for cross-premises and hybrid configurations."
   services="vpn-gateway"
   documentationCenter=""
   authors="cherylmc"
   manager="carolz"
   editor=""/>

<tags
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="hero-article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="08/11/2015"
   ms.author="cherylmc"/>

# Create a virtual network with a site-to-site VPN connection using the Azure portal

> [AZURE.SELECTOR]
- [Azure portal](vpn-gateway-site-to-site-create.md)
- [PowerShell - Azure Resource Manager](vpn-gateway-create-site-to-site-rm-powershell.md)

This article will walk you through creating a classic virtual network and a site-to-site VPN connection to your on-premises network.

Azure currently has two deployment models: the classic deployment model, and the Azure Resource Manager deployment model. The configuration steps differ, depending on the model that was used to deploy your virtual network.

These instructions apply to the classic deployment model. If you want to create a site-to-site VPN gateway connection using the Azure Resource Manager model, see [Create a site-to-site VPN connection using Azure Resource Manager and PowerShell](vpn-gateway-create-site-to-site-rm-powershell.md).


## Before you begin

- Verify that the VPN device that you want to use meets the requirements necessary to create a cross-premises virtual network connection. See [About VPN devices for virtual network connections](vpn-gateway-about-vpn-devices.md) for more information.

- Obtain an externally facing IPv4 IP for your VPN device. This IP address is required for a site-to-site configuration and is used for your VPN device, which cannot be located behind a NAT.

>[AZURE.IMPORTANT] If you aren't familiar with configuring your VPN device or are unfamiliar with the IP address ranges located on your on-premises network configuration, you will need to coordinate with someone who can provide those details for you.

## Create your virtual network

1. Log in to the **Azure portal**.

2. In the lower left corner of the screen, click **New**. In the navigation pane, click **Network Services**, and then click **Virtual Network**. Click **Custom Create** to begin the configuration wizard.

3. Fill out the information on the following pages to create your VNet.

## Virtual network details page

Enter the following information.

- **Name**: Name your virtual network. For example, *EastUSVNet*. You'll use this virtual network name when you deploy your VMs and PaaS instances, so you may not want to make the name too complicated.
- **Location**: The location is directly related to the physical location (region) where you want your resources (VMs) to reside. For example, if you want the VMs that you deploy to this virtual network to be physically located in *East US*, select that location. You can't change the region associated with your virtual network after you create it.

## DNS servers and VPN connectivity page
Enter the following information, and then click the next arrow on the lower right.

- **DNS Servers**: Enter the DNS server name and IP address, or select a previously registered DNS server from the shortcut menu. This setting does not create a DNS server, it allows you to specify the DNS servers that you want to use for name resolution for this virtual network.
- **Configure Site-To-Site VPN**: Select the checkbox for **Configure a site-to-site VPN**.
- **Local Network**: A local network represents your physical on-premises location. You can select a local network that you've previously created, or you can create a new local network. However, if you do select to use a local network that you previously created, you'll want to go to the **Local Networks** configuration page and make sure that the VPN Device IP address (public facing IPv4 address) for the VPN device you are using for this connection is accurate.

## Site-to-site connectivity page
If you're creating a new local network, you'll see the **Site-To-Site Connectivity** page. If you want to use a local network that you previously created, this page will not appear in the wizard and you can move on to the next section.

Enter the following information and then click the next arrow.

- 	**Name**: The name you want to call your local (on-premises) network site.
- 	**VPN Device IP Address**: This is public facing IPv4 address of your on-premises VPN device that you'll use to connect to Azure. The VPN device cannot be located behind a NAT.
- 	**Address Space**: Include Starting IP and CIDR (Address Count). This is where you specify the address range(s) that you want sent through the virtual network gateway to your local on-premises location. If a destination IP address falls within the ranges that you specify here, it will be routed through the virtual network gateway.
- 	**Add address space**: If you have multiple address ranges that you want sent through the virtual network gateway, this is where you specify each additional address range. You can add or remove ranges later on the **Local Network** page.

## Virtual network address spaces page
Specify the address range that you want to use for your virtual network. These are the dynamic IP addresses (DIPS) that will be assigned to the VMs and other role instances that you deploy to this virtual network.

It's especially important to select a range that does not overlap with any of the ranges that are used for your on-premises network. You'll need to coordinate with your network administrator. Your network administrator may need to carve out a range of IP addresses from your on-premises network address space for you to use for your virtual network.

Enter the following information, and then click the checkmark on the lower right to configure your network.

- **Address Space**: Include Starting IP and Address Count. Verify that the address spaces you specify don't overlap any of the address spaces that you have on your on-premises network.
- **Add subnet**: Include Starting IP and Address Count. Additional subnets are not required, but you may want to create a separate subnet for VMs that will have static DIPS. Or you might want to have your VMs in a subnet that is separate from your other role instances.
- **Add gateway subnet**: Click to add the gateway subnet. The gateway subnet is used only for the virtual network gateway and is required for this configuration.

Click the checkmark on the bottom of the page and your virtual network will begin to create. When it completes, you will see **Created** listed under **Status** on the **Networks** page in the Azure portal. After the VNet has been created, you can then configure your virtual network gateway.

## Configure your virtual network gateway

Next, you'll configure the virtual network gateway in order to create a secure site-to-site connection. See [Configure a virtual network gateway in the Azure portal](vpn-gateway-configure-vpn-gateway-mp.md).

## Next steps

You can learn more about virtual network cross-premises connectivity in this article: [About secure cross-premises connectivity for virtual networks](vpn-gateway-cross-premises-options.md).

If you want to configure a point-to-site VPN connection, see [Configure a Point-to-Site VPN connection](vpn-gateway-point-to-site-create.md).

You can add virtual machines to your virtual network. See [How to create a custom virtual machine](../virtual-machines/virtual-machines-create-custom.md).

If you want to configure a VNet connection using RRAS, see [Configure a Site-to-Site VPN using Windows Server 2012 Routing and Remote Access Service (RRAS)](https://msdn.microsoft.com/library/dn636917.aspx).

If you want to configure a connection between your classic virtual network and a virtual network created using the Azure Resource Manager mode, see [Connecting classic VNets to Azure Resource Manager VNets](../virtual-network/virtual-networks-arm-asm-s2s-howto.md).
