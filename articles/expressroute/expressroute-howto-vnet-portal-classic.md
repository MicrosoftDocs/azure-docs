<properties
   pageTitle="Configure a Virtual Network and Gateway for ExpressRoute | Microsoft Azure"
   description="This article walks you through setting up a virtual network (VNet) for ExpressRoute using the classic deployment model."
   documentationCenter="na"
   services="expressroute"
   authors="cherylmc"
   manager="carmonm"
   editor=""
   tags="azure-service-management"/>

<tags 
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="article" 
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="05/25/2016"
   ms.author="cherylmc"/>

# Create a Virtual Network for ExpressRoute in the classic portal

The steps in this article will walk you through configuring a virtual network and a gateway for use with ExpressRoute using the classic deployment model and the classic portal.

If you are looking instructions for the Resource Manager deployment model, you can use the following articles which will walk you through how to [Create a virtual network by using PowerShell](../virtual-network/virtual-networks-create-vnet-arm-ps.md) and to [Add a VPN Gateway to a Resource Manager VNet for ExpressRoute](expressroute-howto-add-gateway-resource-manager.md).

**About Azure deployment models**

[AZURE.INCLUDE [vpn-gateway-clasic-rm](../../includes/vpn-gateway-classic-rm-include.md)] 

## Create a classic VNet and gateway

The steps below will create a classic VNet and a virtual network gateway. If you already have a classic VNet, see the [Configure an existing classic VNet](#config) section in this article.

1. Log in to the [Azure classic portal](http://manage.windowsazure.com).

2. In the lower left-hand corner of the screen, click **New**. In the navigation pane, click **Network Services**, and then click **Virtual Network**. Click **Custom Create** to begin the configuration wizard.

3. On the **Virtual Network Details** page, enter the information below.

	- **Name** – Name your virtual network. You’ll use this virtual network name when you deploy your VMs and PaaS instances, so you may not want to make the name too complicated.
	- **Location** – The location is directly related to the physical location (region) where you want your resources (VMs) to reside. For example, if you want the VMs that you deploy to this virtual network to be physically located in East US, select that location. You can’t change the region associated with your virtual network after you create it.

4. On the **DNS Servers and VPN Connectivity** page, enter the following information, and then click the next arrow on the lower right. 

	- **DNS Servers** - Enter the DNS server name and IP address, or select a previously registered DNS server from the dropdown. This setting does not create a DNS server, it allows you to specify the DNS servers that you want to use for name resolution for this virtual network.
	- **Site-to-Site Connectivity** - Select the checkbox for **Configure a site-to-site VPN**.
	- **ExpressRoute** – Select the checkbox **Use ExpressRoute**. This option only appears if you selected **Configure a Site-to-Site VPN**.
	- **Local Network** - You are required to have a local network site for ExpressRoute. However, in the case of an ExpressRoute connection, the address prefixes specified for the local network site will be ignored. Instead, the address prefixes advertised to Microsoft through the ExpressRoute circuit will be used for routing purposes.<BR>If you already have a local network created for your ExpressRoute connection, you can select it from the dropdown. If not, select **Specify a New Local Network**.

5. The **Site-to-Site Connectivity** page will appear if you selected to specify a new local network in the previous step. To configure your local network, enter the following information and then click the next arrow. 

	- **Name** - The name you want to call your local (on-premises) network site.
	- **Address space** - including Starting IP and CIDR (Address Count). You can specify any address range as long as it doesn't overlap with the address range for your virtual network. Typically, this would specify the address ranges for your on-premises networks, but in the case of ExpressRoute, these settings are not used. However, this setting is required in order to create the local network when you are using the classic portal.
	- **Add address space** - This setting is not relevant for ExpressRoute.


6. On the **Virtual Network Address Spaces** page, enter the following information and then click the checkmark on the lower right to configure your network. 

	- **Address space** - including starting IP and address count. Verify that the address spaces you specify don’t overlap any of the address spaces that you have on your local network.
	- **Add subnet** - including Starting IP and Address Count. Additional subnets are not required.
	- **Add gateway subnet** - Click to add the gateway subnet. The gateway subnet is used only for the virtual network gateway and is required for this configuration.<BR>The gateway subnet CIDR (address count) for ExpressRoute must be /28 or larger (/27, /26 etc.). This will allow for enough IP addresses in that subnet to allow the configuration to work. In the classic portal, if you have selected the checkbox to use ExpressRoute, the portal will specify a gateway subnet with /28.  Note that you can't adjust the CIDR address count in the classic portal. The gateway subnet will appear as **Gateway** in the classic portal, although the real name of the gateway subnet that is created is actually **GatewaySubnet**. You can view this name by using PowerShell or in the Azure portal.

7. Click the checkmark on the bottom of the page and your virtual network will begin to create. When it completes, you will see **Created** listed under **Status** on the **Networks** page in the classic portal.

## <a name="gw"></a>Create the gateway

1. On the **Networks** page, click the virtual network that you just created, then click **Dashboard** at the top of the page.

2. On the bottom of the **Dashboard** page, click **Create Gateway** and select **Dynamic Routing**. Click **Yes** to confirm that you want to create a gateway.

3. When the gateway starts creating, you’ll see a message letting you know that the gateway has been started. It may take up to 45 minutes for the gateway to create.

4. Link your network to a circuit. Follow the instructions in the article [How to link VNets to ExpressRoute circuits](expressroute-howto-linkvnet-classic.md).

## <a name="config"></a>Configure an existing classic VNet for ExpressRoute

If you already have a classic VNet, you can configure it to connect to ExpressRoute in the classic portal. The settings will be the same as the sections above, so read through those sections to become familiar with the required settings. If you want to create an ExpressRoute/Site-to-Site coexisting connection, see [this article](expressroute-howto-coexist-classic.md) for the steps. They are different than the steps in this article.
 
1. You'll need to create the local network before you update the rest of your VNet settings. To create a new local network, which is required when configuring ExpressRoute through the classic portal, click **New** **>** **Network Services** **>** **Virtual Network** **>** **Add local network**. Follow the wizard steps to create the local network.

2. Use **Configure** page to update the rest of the settings for your VNet and to associate the VNet to the local network.

3. After configuring the settings, go to the [Create the gateway](#gw) section of this article to create the gateway.


## Next steps

- If you want to add virtual machines to your virtual network, see [Virtual Machines learning paths](https://azure.microsoft.com/documentation/learning-paths/virtual-machines/).
- If you want to learn more about ExpressRoute, see the [ExpressRoute Overview](expressroute-introduction.md).


 
