<properties 
	pageTitle="Tutorial: Create a cloud-only virtual network" 
	description="Learn how to create an example cloud-only Azure Virtual Network in this tutorial." 
	services="virtual-machines, virtual-network" 
	documentationCenter="" 
	authors="cherylmc" 
	manager="adinah" 
	editor=""/>

<tags 
	ms.service="virtual-network" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/29/2015" 
	ms.author="cherylmc"/>

# Tutorial: Create a Cloud-Only Virtual Network in Azure

This tutorial walks you through the steps in the Azure Management Portal to create an example cloud-only Azure Virtual Network that contains two subnets. The resulting virtual network will look like the following:

![createvnet](./media/create-virtual-network/createVNet_06_VNetExample.png)

For example, the FrontEndSubnet could be used for web servers and the BackEndSubnet could be used for SQL servers or domain controllers.

This tutorial assumes you have no prior experience using Azure. It is meant to help you become familiar with the steps required to create your own virtual network by stepping you through an example configuration. If you want to create a cloud-only virtual network that works for your specific configuration, see [Configure a Cloud-Only Virtual Network in the Management Portal](http://msdn.microsoft.com/library/azure/dn631643.aspx). If you are looking for design scenarios and advanced information about Virtual Network, see the [Azure Virtual Network Overview](http://msdn.microsoft.com/library/windowsazure/jj156007.aspx).


> [AZURE.NOTE] This tutorial does not walk you through creating a cross-premises configuration, in which the virtual network is connected to your organization network. For a tutorial that walks you through creating a virtual network with cross-premises connectivity and a site-to-site VPN connection (i.e., connecting to Active Directory or SharePoint located at your company), see [Tutorial: Create a Cross-Premises Virtual Network for Site-to-Site Connectivity](virtual-networks-create-site-to-site-cross-premises-connectivity.md).


##  Objectives

In this tutorial you will learn how to set up a basic Azure cloud-only virtual network with two subnets.

##  Prerequisites

*  A Microsoft account with at least one valid, active Azure subscription. If you do not already have an Azure subscription, you can sign up for a free trial at [Try Azure](http://azure.microsoft.com/pricing/free-trial/). If you have an MSDN Subscription, see [Microsoft Azure Special Pricing: MSDN, MPN, and Bizspark Benefits](http://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/).
p
##  Create the Virtual Network for this tutorial

To create this example cloud-only virtual network, do the following

1. Log in to the Management Portal.

2. In the lower left-hand corner of the screen, click **New** > **Network Services** > **Virtual Network**, and then click **Custom Create** to begin the configuration wizard.

	![][Image1]

3. On the **Virtual Network Details** page, enter the following information:

- **Name -** Type **YourVirtualNetwork**.

- **Region -** The virtual network will be created at a datacenter located in the specified region. For the best performance, select the region to which you belong from the drop-down list.
 

	![][Image2]

4. Click the next arrow on the lower right. For more information about the settings on this page, see the Virtual Network Details page section in [About Configuring a Virtual Network using the Management Portal](http://go.microsoft.com/fwlink/p/?linkid=248092&clcid=0x409).

5. On the **DNS Servers and VPN Connectivity** page, click the next arrow on the lower right. Azure will assign an Internet-based Azure DNS server to new virtual machines that are added to this virtual network, which will allow them to access Internet resources. For more information about the settings on this page, see the DNS Servers and VPN Connectivity page in [About Configuring a Virtual Network using the Management Portal](http://go.microsoft.com/fwlink/p/?linkid=248092&clcid=0x409).
	
6.	Just like a real network, the virtual network needs a range of IP addresses (known as an address space) to assign to virtual machines that you place within it. The virtual network also supports subnets, which need their own address spaces, derived from the virtual network address space. For this tutorial, we will create the BackEndSubnet and FrontEndSubnet. On the **Virtual Network Address Spaces** page, configure the following:

	- For Address Space, select **/16 (65535)** in **CIDR (ADDRESS COUNT)**.

	- For subnets, in the first row, type **BackEndSubnet** over the existing name and **10.0.1.0** for the starting IP, then select **/24 (256)** in **CIDR (ADDRESS COUNT)**. Click **add subnet**, and then type **FrontEndSubnet** for the name and **10.0.2.0** for the starting IP.
		
	![][Image4]

 Returning to our diagram of the virtual network, you have configured the following address spaces:
 
	
- FrontEndSubnet: 10.0.2.0/24
- BackEndSubnet: 10.0.1.0/24

 Note that the address space for a virtual network must be from the private address spaces of 10.0.0.0/8, 172.16.0.0/12, or 192.168.0.0/16 and specified in Classless Inter-Domain Routing (CIDR) notation (also known as network prefix notation). For more information about the settings on this page, see the Virtual Network Address Spaces page in [About Configuring a Virtual Network using the Management Portal](http://go.microsoft.com/fwlink/p/?linkid=248092&clcid=0x409).


7. Click the checkmark in the lower right of the page and your virtual network will begin to create. When your virtual network has been created, you will see **Created** listed under Status on the **Networks** page in the Azure Management Portal.  

	![][Image5]

You can continue learning about Azure infrastructure services with the following:

- [How to Create a Custom Virtual Machine](virtual-machines-create-custom.md) Use this topic to install a virtual machine in your virtual network. For more information about virtual machines and installation options, see [Azure Virtual Machines](http://azure.microsoft.com/documentation/services/virtual-machines/).

- [Install a new Active Directory forest on an Azure Virtual Network](active-directory-new-forest-virtual-machine.md) - Use this topic to install a new Windows Server Active Directory (AD) forest without connectivity to any other network. The tutorial will explain the specific steps required to create a virtual machine (VM) for a new forest installation. If you plan to use this tutorial, do not create any VMs by using the Management Portal. For more information, see [Guidelines for Deploying Windows Server Active Directory on Azure Virtual Machines](http://msdn.microsoft.com/library/windowsazure/jj156090.aspx).

To remove this virtual network, select it, click **Delete**, and then click **Yes**.

When you are ready to create a cloud-only virtual network that works for your specific configuration, see [Configure a Cloud-Only Virtual Network in the Management Portal](http://msdn.microsoft.com/library/azure/dn631643.aspx). 

If you are looking for design scenarios and advanced information about Virtual Network, see the [Azure Virtual Network Overview](http://msdn.microsoft.com/library/windowsazure/jj156007.aspx). 

For additional Virtual Network configuration procedures and settings, see [Azure Virtual Network Configuration Tasks](http://go.microsoft.com/fwlink/p/?linkid=296652&clcid=0x409).


## See Also

-  [Azure Virtual Network FAQ](http://go.microsoft.com/fwlink/p/?LinkId=296650)

-  [Azure Virtual Network Configuration Tasks](http://go.microsoft.com/fwlink/p/?LinkId=296652)

-  [Configuring a Virtual Network Using Network Configuration Files](virtual-networks-using-network-configuration-file.md)

-  [Name Resoultion for VMs and Role Instances](http://go.microsoft.com/fwlink/?LinkId=248097)


[Image1]: ./media/create-virtual-network/createVNet_01_OpenVirtualNetworkWizard.png
[Image2]: ./media/create-virtual-network/createVNet_02_VirtualNetworkDetails.png
[Image3]: ./media/create-virtual-network/createVNet_03_DNSServersandVPNConnectivity.png
[Image4]: ./media/create-virtual-network/createVNet_04_VirtualNetworkAddressSpaces.png
[Image5]: ./media/create-virtual-network/createVNet_05_VirtualNetworkCreatedStatus.png
[Image7]: ./media/create-virtual-network/createVNet_07_VNetExampleSpaces.png
[Image8]: ./media/create-virtual-network/createVNet_07_VNetExampleSpaces.png

