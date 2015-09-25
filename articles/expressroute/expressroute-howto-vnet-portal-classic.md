<properties
   pageTitle="Configure a Virtual Network and Gateway for ExpressRoute | Microsoft Azure"
   description="This article walks you through setting up a virtual network (VNet) for ExpressRoute"
   documentationCenter="na"
   services="expressroute"
   authors="cherylmc"
   manager="carolz"
   editor=""
   tags="azure-service-management"/>

<tags 
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="article" 
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="09/22/2015"
   ms.author="cherylmc"/>

# Configure a Virtual Network for ExpressRoute

These steps will walk you through configuring a virtual network and a gateway for use with ExpressRoute using the classic deployment model. This configuration is not currently supported for VNets and gateways created using the Resource Manager model. When it becomes available, we'll provide a link from this page to the documentation.
 
>[AZURE.IMPORTANT] It's important to know that Azure currently works with two deployment models: Resource Manager, and classic. Before you begin your configuration, make sure that you understand the deployment models and tools. For information about the deployment models, see [Azure deployment models](../azure-classic-rm.md)

1. Log in to the **Azure Portal**.

2. In the lower left-hand corner of the screen, click **New**. In the navigation pane, click **Network Services**, and then click **Virtual Network**. Click **Custom Create** to begin the configuration wizard.

3. On the **Virtual Network Details** page, enter the information below.

	- **Name** – Name your virtual network. You’ll use this virtual network name when you deploy your VMs and PaaS instances, so you may not want to make the name too complicated.
	- **Location** – The location is directly related to the physical location (region) where you want your resources (VMs) to reside. For example, if you want the VMs that you deploy to this virtual network to be physically located in East US, select that location. You can’t change the region associated with your virtual network after you create it.

4. On the **DNS Servers and VPN Connectivity** page, enter the following information, and then click the next arrow on the lower right. 

	- **DNS Servers** - Enter the DNS server name and IP address, or select a previously registered DNS server from the dropdown. This setting does not create a DNS server, it allows you to specify the DNS servers that you want to use for name resolution for this virtual network.
	- **Configure Site-To-Site VPN** - Select the checkbox for **Configure a site-to-site VPN**.
	- **Select ExpressRoute** – Select the checkbox **Use ExpressRoute**. This option only appears if you selected ***Configure a Site-to-Site VPN*** in the previous step.
	- **Local Network** - A local network represents your physical on-premises location. You can select a local network that you’ve previously created, or you can create a new local network.

	If you select an existing local network, skip step 5.

5. If you’re creating a new local network, you’ll see the **Site-To-Site Connectivity** page. If you selected a local network that you previously created, this page will not appear in the wizard and you can move on to the next section. To configure your local network, enter the following information and then click the next arrow. 

	- **Name** - The name you want to call your local (on-premises) network site.
	- **Address space** - including Starting IP and CIDR (Address Count). You can specify any address range as long as it doesn't overlap with the address range for your virtual network.
	- **Add address space** - This setting is not relevant for ExpressRoute.
**Note:** You are required to create a local network site for ExpressRoute. The address prefixes specified for the local network site will be ignored. Address prefixes advertised to Microsoft through the ExpressRoute circuit will be used for routing purposes.

6. On the **Virtual Network Address Spaces** page, enter the following information and then click the checkmark on the lower right to configure your network. 

	- **Address space** - including starting IP and address count. Verify that the address spaces you specify don’t overlap any of the address spaces that you have on your local network.
	- **Add subnet** - including Starting IP and Address Count. Additional subnets are not required, but you may want to create a separate subnet for VMs that will have dynamic IP addresses (DIPS). Or you might want to have your VMs in a subnet that is separate from your PaaS instances.
	- **Add gateway subnet** - Click to add the gateway subnet. The gateway subnet is used only for the virtual network gateway and is required for this configuration. 
	***Important:***  The gateway subnet prefix for ExpressRoute must be /28 or smaller. (/27, /26 etc.)

7. Click the checkmark on the bottom of the page and your virtual network will begin to create. When it completes, you will see **Created** listed under **Status** on the **Networks** page in the Management Portal.

8. On the **Networks** page, click the virtual network that you just created, then click **Dashboard**.
9. On the bottom of the Dashboard page, click **CREATE GATEWAY**, then click **Yes**.

10. When the gateway starts creating, you’ll see a message letting you know that the gateway has been started. It may take up to 15 minutes for the gateway to create.

11. Link your network to a circuit. Follow the instructions in the article [How to link VNets to ExpressRoute circuits](expressroute-howto-linkvnets-classic.md).

## Next steps

- If you want to add virtual machines to your virtual network, see [How to Create a Custom Virtual Machine](../virtual-machines-create-custom.md).
- If you want to learn more about ExpressRoute, see [ExpressRoute Technical Overview](expressroute-introduction.md).


 
