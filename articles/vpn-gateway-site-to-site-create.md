<properties
   pageTitle="Configure a Site-to-Site Virtual Network connection | Microsoft Azure"
   description="Create a virtual network with a site-to-site VPN connection for cross-premises and hybrid configurations."
   services="vpn-gateway"
   documentationCenter=""
   authors="cherylmc"
   manager="adinah"
   editor=""/>

<tags
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="hero-article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="05/12/2015"
   ms.author="cherylmc"/>

# Configure a Virtual Network with a Site-to-Site VPN Connection

You can connect your on-premises location with a virtual network by creating a site-to-site VPN connection. This procedure will walk you through creating a virtual network and creating a site-to-site VPN connection between your newly created VNet and your on-premises location. You can use this procedure for creating cross-premises and hybrid virtual network configurations.


## Before Beginning

- Verify that the VPN device that you want to use meets the requirements necessary to create a cross-premises virtual network connection. See [About VPN Devices for Virtual Network Connectivity](https://msdn.microsoft.com/library/azure/jj156075.aspx) for more information.

- Obtain an externally facing IPv4 IP for your VPN device. This IP address is required for a site-to-site configuration and is used for your VPN device, which cannot be located behind a NAT.

>[AZURE.IMPORTANT] If you aren't familiar with configuring your VPN device or are unfamiliar with the IP address ranges located on your on-premises network configuration, you will need to coordinate with someone who can provide those details for you.

## Create your Virtual Network

1. Log in to the **Management Portal**.

2. In the lower left-hand corner of the screen, click **New**. In the navigation pane, click **Network Services**, and then click **Virtual Network**. Click **Custom Create** to begin the configuration wizard.

3. Fill out the information on the following pages to create your VNet.

## Virtual Network Details page

Enter the information below. For more information about the settings on the details page, see the [Virtual Network Details page](https://msdn.microsoft.com/library/azure/09926218-92ab-4f43-aa99-83ab4d355555#BKMK_VNetDetails).

- **Name**: Name your virtual network. For example, *EastUSVNet*. You'll use this virtual network name when you deploy your VMs and PaaS instances, so you may not want to make the name too complicated.
- **Location**: The location is directly related to the physical location (region) where you want your resources (VMs) to reside. For example, if you want the VMs that you deploy to this virtual network to be physically located in *East US*, select that location. You can't change the region associated with your virtual network after you create it.

## DNS Servers and VPN Connectivity page
Enter the following information, and then click the next arrow on the lower right. For more information about the settings on this page, see the [DNS Servers and VPN Connectivity page](https://msdn.microsoft.com/library/azure/09926218-92ab-4f43-aa99-83ab4d355555#BKMK_VNETDNS).

- **DNS Servers**: Enter the DNS server name and IP address, or select a previously registered DNS server from the dropdown. This setting does not create a DNS server, it allows you to specify the DNS servers that you want to use for name resolution for this virtual network.
- **Configure Site-To-Site VPN**: Select the checkbox for **Configure a site-to-site VPN**.
- **Local Network**: A local network represents your physical on-premises location. You can select a local network that you've previously created, or you can create a new local network. However, if you do select to use a local network that you previously created, you'll want to go to the **Local Networks** configuration page and make sure that the VPN Device IP address (public facing IPv4 address) for the VPN device you are using for this connection is accurate.

## Site-to-Site Connectivity page
If you're creating a new local network, you'll see the **Site-To-Site Connectivity** page. If you want to use a local network that you previously created, this page will not appear in the wizard and you can move on to the next section.

Enter the following information and then click the next arrow. For more information about the settings on this page, see the [Site-To-Site Connectivity page](https://msdn.microsoft.com/library/azure/09926218-92ab-4f43-aa99-83ab4d355555#BKMK_VNETSITE).

- 	**Name**: The name you want to call your local (on-premises) network site.
- 	**VPN Device IP Address**: This is public facing IPv4 address of your on-premises VPN device that you'll use to connect to Azure. The VPN device cannot be located behind a NAT.
- 	**Address Space**: Include Starting IP and CIDR (Address Count). This is where you specify the address range(s) that you want sent through the virtual network gateway to your local on-premises location. If a destination IP address falls within the ranges that you specify here, it will be routed through the virtual network gateway.
- 	**Add address space**: If you have multiple address ranges that you want sent through the virtual network gateway, this is where you specify each additional address range. You can add or remove ranges later on the Local Network page.

## Virtual Network Address Spaces page
Specify the address range that you want to use for your virtual network. These are the dynamic IP addresses (DIPS) that will be assigned to the VMs and other role instances that you deploy to this virtual network. There are quite a few rules regarding virtual network address space, so please refer to the [Virtual Network Address Spaces page](https://msdn.microsoft.com/library/azure/09926218-92ab-4f43-aa99-83ab4d355555#BKMK_VNET_ADDRESS) for more information.

It's especially important to select a range that does not overlap with any of the ranges that are used for your on-premises network. You'll need to coordinate with your network administrator. Your network administrator may need to carve out a range of IP addresses from your on-premises network address space for you to use for your virtual network.

Enter the following information, and then click the checkmark on the lower right to configure your network.

- **Address Space**: Include Starting IP and Address Count. Verify that the address spaces you specify don't overlap any of the address spaces that you have on your on-premises network.
- **Add subnet**: Include Starting IP and Address Count. Additional subnets are not required, but you may want to create a separate subnet for VMs that will have static DIPS. Or you might want to have your VMs in a subnet that is separate from your other role instances.
- **Add gateway subnet**: Click to add the gateway subnet. The gateway subnet is used only for the virtual network gateway and is required for this configuration.

Click the checkmark on the bottom of the page and your virtual network will begin to create. When it completes, you will see **Created** listed under **Status** on the **Networks** page in the Management Portal. After the VNet has been created, you can then configure your virtual network gateway.

## Configure your Virtual Network Gateway

Next, you'll configure the **Virtual Network Gateway** in order to create a secure site-to-site connection. See [Configure a Virtual Network Gateway in the Management Portal](https://msdn.microsoft.com/library/azure/jj156210.aspx).

## Next Steps

You can learn more about Virtual Network cross-premises connectivity in this article: [About Virtual Network Secure Cross-Premises Connectivity](https://msdn.microsoft.com/library/azure/dn133798.aspx)

If you want to configure a point-to-site VPN connection, see [Configure a Point-to-Site VPN Connection](vpn-gateway-point-to-site-create.md)

You can add virtual machines to your virtual network. See [How to Create a Custom Virtual Machine](virtual-machines-create-custom.md)

If you want to configure a VNet connection using RRAS, see [Configure a Site-to-Site VPN using Windows Server 2012 Routing and Remote Access Service (RRAS)](https://msdn.microsoft.com/library/dn636917.aspx)
