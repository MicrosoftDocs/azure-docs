<properties 
   pageTitle="How to manage Virtual Network (VNet) Properties"
   description="Learn how to view and edit virtual network settings"
   services="virtual-network"
   documentationCenter="na"
   authors="telmosampaio"
   manager="carolz"
   editor="tysonn" />
<tags 
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="06/08/2015"
   ms.author="telmos" />

# How to manage Virtual Network (VNet) Properties
You can view and modify VNet settings by using the management portal.

## View VNet settings

1. Log on to the Management Portal.

1. In the navigation pane, click **Networks**, and then click the VNet name in the **Name** column.

1. Click **Dashboard** to view the following information:

	- **virtual network:** This is the virtual network and subnets along with the local network and DNS server.

	- **data in, data out:** Visible when you have cross-premises connectivity. This is the data coming into and going out of your virtual network.

	- **gateway IP address:** Visible when you have configured a gateway. This is the gateway IP address. This is the IP address that you will use to configure your VPN device for cross-premise connectivity.

	- **resources:** These are the Azure resources connected to this virtual network.

	- **quick glance:** A place to quickly find the following information:

		- **Download Client VPN package:** This package is used when creating point-to-site cross premises VPN connections. Download the package that pertains to the client.

		- **Download VPN device script:** These templates are used to help configure VPN devices for site-to-site cross-premises connections.

		- **status**

		- **subscription ID**
		
		- **virtual network ID**
		
		- **location**

1. Click **Configure** to view the following information:

	- **dns servers:** These are the DNS servers and their corresponding IP address that the clients in your virtual network will use for name resolution.

	- **point-to-site connectivity:** Visible when you have configured your virtual network for point-to-site connections.

	- **site-to-site connectivity:** Visible when you have configured your virtual network for site-to-site connections.

	- **local network:** This is shown if you have site-to-site connectivity. This is selected local network that represents your on-premises site. The settings for this local network can be configured in **networks** on the **Local Networks** page.
	
	- **virtual network address spaces:** The address space and subnets in your virtual network.

1. Click **Certificates** to view the following information:

	- **Uploaded root certificate:** For point-to-site VPN configurations
	
	- **Certificate thumbprint**
	
	- **Certificate expiration**
	
	- **Upload:** Upload a root certificate
	
	- **Delete:** Delete a selected root certificate

## Edit VNet settings

After you deploy your virtual network, only certain settings can be modified. The following steps will help you edit your virtual network configuration settings using the Management Portal.

1. Log on to the Management Portal.

1. In the navigation pane, click **Networks**, and then click the Virtual Network name in the **Name** column.

1. Click **Configure**.

	- In **dns servers**, you can add additional DNS servers for name resolution. If you add additional DNS servers after you have deployed virtual machines to your virtual network, you must restart each virtual machine in order for it to pick up the new additional DNS server.
	
	- In the **point-to-site connectivity** section, you can configure the address space that you want to designate for point-to-site connections.
	
	- In the **site to site connectivity** section, you can configure site-to-site settings.
	
	- In the **virtual network address space** section, you can add additional address space and subnets. To add subnets, click **add subnets** and configure the address space that you want to use. To add a gateway subnet for cross-premises connectivity, click **add gateway subnet**. You can only add one gateway subnet per virtual network.

1. Click **SAVE** at the bottom of the screen to save your configuration changes.

## Next Steps

[How to manage DNS servers used by a virtual network (VNet)](../virtual-networks-manage-dns-in-vnet)

[How to use public IP addresses in a virtual network](../virtual-networks-public-ip-within-vnet)

[How to delete a Virtual Network (VNet)](../virtual-networks-delete-vnet) 