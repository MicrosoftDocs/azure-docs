<properties
   pageTitle="Configuring a virtual network for Expressroute"
   description="This tutorial walks you through setting up a virtual network (VNet) for ExpressRoute"
   documentationCenter="na"
   services="expressroute"
   authors="cherylmc"
   manager="adinah"
   editor="tysonn" />

<tags 
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="article" 
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="04/29/2015"
   ms.author="cherylmc"/>

#  Configure a Virtual Network and VNet Gateway for ExpressRoute

1. Log in to the **Management Portal**.
2. In the lower left-hand corner of the screen, click **New**. In the navigation pane, click **Network Services**, and then click **Virtual Network**. Click **Custom Create** to begin the configuration wizard.
3. On the **Virtual Network Details** page, enter the information below. For more information about the settings on the details page, see [Virtual Network Details page](https://msdn.microsoft.com/library/azure/09926218-92ab-4f43-aa99-83ab4d355555#BKMK_VNetDetails)

	- **Name** – Name your virtual network. You’ll use this virtual network name when you deploy your VMs and PaaS instances, so you may not want to make the name too complicated.
	- **Location** – The location is directly related to the physical location (region) where you want your resources (VMs) to reside. For example, if you want the VMs that you deploy to this virtual network to be physically located in East US, select that location. You can’t change the region associated with your virtual network after you create it.

4. On the **DNS Servers and VPN Connectivity** page, enter the following information, and then click the next arrow on the lower right. For more information about the settings on this page, see [DNS Servers and VPN Connectivity page](https://msdn.microsoft.com/library/azure/09926218-92ab-4f43-aa99-83ab4d355555#BKMK_VNETDNS)

	- **DNS Servers** - Enter the DNS server name and IP address, or select a previously registered DNS server from the dropdown. This setting does not create a DNS server, it allows you to specify the DNS servers that you want to use for name resolution for this virtual network.
	- **Configure Site-To-Site VPN** - Select the checkbox for **Configure a site-to-site VPN**.
	- **Select ExpressRoute** – Select the checkbox **Use ExpressRoute**. This option only appears if you selected Configure a site-to-site VPN in the previous step.
	- **Local Network** – A local network represents your physical on-premises location. You can select a local network that you’ve previously created, or you can create a new local network.

	If you select an existing local network, skip step 5 (below).

5. If you’re creating a new local network, you’ll see the **Site-To-Site Connectivity** page. If you selected a local network that you previously created, this page will not appear in the wizard and you can move on to the next section. To configure your local network, enter the following information and then click the next arrow. For more information about the settings on this page, see [Site-To-Site Connectivity page](https://msdn.microsoft.com/library/azure/09926218-92ab-4f43-aa99-83ab4d355555#BKMK_VNETSITE).

	- **Name** - The name you want to call your local (on-premises) network site.
	- **VPN Device IP Address** – This setting is not relevant to ExpressRoute. You can enter any dummy IP address in this space.
	- **Address Space** - including Starting IP and CIDR (Address Count). This is where you specify the address range that you want sent through the virtual network gateway to your local on-premises location.
	- **Add address space** - If you have multiple address ranges that you want sent through the virtual network gateway, this is where you specify each additional address range. You can add or remove ranges later on the Local Network page.

6. On the **Virtual Network Address Spaces** page, enter the following information and then click the checkmark on the lower right to configure your network. There are quite a few rules regarding virtual network address space, so you may want to see the 
[Virtual Network Address Spaces page](https://msdn.microsoft.com/library/azure/09926218-92ab-4f43-aa99-83ab4d355555#BKMK_VNET_ADDRESS) for more information.

	- **Address space** - including starting IP and address count. Verify that the address spaces you specify don’t overlap any of the address spaces that you have on your local network.
	- **Add subnet** - including Starting IP and Address Count. Additional subnets are not required, but you may want to create a separate subnet for VMs that will have dynamic IP addresses (DIPS). Or you might want to have your VMs in a subnet that is separate from your PaaS instances.
	- **Add gateway subnet** - Click to add the gateway subnet. The gateway subnet is used only for the virtual network gateway and is required for this configuration.

	***Important***
	The gateway subnet for ExpressRoute must be /28.


7. Click the checkmark on the bottom of the page and your virtual network will begin to create. When it completes, you will see **Created** listed under **Status** on the **Networks** page in the Management Portal.

8. On the **Networks** page, click the virtual network that you just created, then click **Dashboard**.
9. On the bottom of the Dashboard page, click **CREATE GATEWAY**, then click **Yes**.
10. When the gateway starts creating, you’ll see a message letting you know that the gateway has been started. It may take up to 15 minutes for the gateway to create.
11. **Link your network to a circuit.** Proceed with the following instructions only after you have confirmed that your circuit has moved to the following state and status: 

	- ServiceProviderState: Provisioned
	- Status: Enabled

	Verify that you have at least one Azure Virtual Network with a gateway created. The gateway subnet must be /28 in order to work with an ExpressRoute connection and must be up and running.

			PS C:\> $Vnet = "MyTestVNet"
			New-AzureDedicatedCircuitLink -ServiceKey $ServiceKey -VNetName $Vnet
			Provisioned