<properties 
   pageTitle="Create a Virtual Network" 
   description="Walk through the steps to easily create a basic virtual network." 
   services="virtual-network" 
   documentationCenter="" 
   authors="cherylmc" 
   manager="adinah" 
   editor="tysonn"/>

<tags
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="04/14/2015"
   ms.author="cherylmc"/>

# Create a Virtual Network 



When you create a virtual network, your services and VMs within the VNet can communicate securely with each other without having to go out through the Internet. Creating a dedicated cloud-only virtual network is a relatively fast and easy process. Because a cloud-only virtual network isn’t intended for cross-premises connectivity, you won’t need to acquire and configure a VPN device or authentication certificates. 

Once you create your virtual network, you can add new VMs and PaaS instances to it. Note that if you use the Management Portal to create your VMs, be sure to select **From Gallery** so that you can specify the virtual network. This is important because you can’t go back and put a VM in a virtual network after you’ve created the VM.

[Azure Note] **Use this procedure to create a dedicated cloud-only virtual network.** Because of the greater complexity involved with creating a cross-premises configuration, don’t use this procedure to create a virtual network that will later be connected to your on-premises network. If you want to create a secure cross-premises connection between Azure and your on-premises network, see [About Secure Cross-Premises Connectivity](https://msdn.microsoft.com/library/azure/dn133798.aspx).

## <a name="CreateyourVNet">Creating your virtual network</a>

1. Log in to the **Management Portal**.
2. In the lower left-hand corner of the screen, click **New**. In the navigation pane, click **Network Services**, and then click **Virtual Network**. Click **Custom Create** to begin the configuration wizard.
3. On the **Virtual Network Details** page, enter the following information, and then click the next arrow on the lower right. For more information about the settings on the details page, see the **Virtual Network Details** section in [About Configuring a Virtual Network using the Management Portal](https://msdn.microsoft.com/library/azure/jj156074.aspx).
	-  **Name:** Name your virtual network. You’ll use this virtual network name when you deploy your VMs and services, so it’s best not to make the name too complicated.

	-  **Location:** From the drop-down list, select the desired region. Your virtual network will be created at the Azure datacenter located in the specified region.



4. On the **DNS Servers and VPN Connectivity** page, don’t make any changes. Just move forward to the next page by clicking the arrow. By default, Azure provides basic name resolution for your virtual network. It’s possible that your name resolution requirements are more complex than can be handled by the basic Azure name resolution. In that case, you may later want to add a virtual machine running DNS to your virtual network. For more information about Azure name resolution and DNS, see [Name Resolution](https://msdn.microsoft.com/library/azure/jj156088.aspx). 
5. The **Virtual Network Address Spaces** page is where you enter the address space that you want to use for this VNet. Unless you require a certain internal IP address range for your VMs or you want to create a specific subnet for VMs that will receive a static DIP, you don’t need to make any changes on this page. If you do want to create multiple subnets, you can do so on this page by clicking **add subnet**. For more information about the settings on the details page, see the **Virtual Network Details** section in [About Configuring a Virtual Network using the Management Portal](https://msdn.microsoft.com/library/azure/jj156074.aspx).

	-  For more information about the settings on the details page, see the **Virtual Network Details** section in [About Configuring a Virtual Network using the Management Portal](https://msdn.microsoft.com/library/azure/jj156074.aspx).
	-  Because you aren’t going to connect this private virtual network to your on-premises network by using a cross-premises VPN configuration, you won’t need to coordinate these settings with your existing on-premises network IP address ranges. If you think you may want to create a cross-premises configuration later, you’ll need to coordinate the address spaces now with the ranges that already exist on your local site to avoid routing issues. Changing the ranges later can be somewhat complicated and will often result in having to re-deploy your


6. Click the checkmark on the lower right of the Virtual Network Address Spaces page and your virtual network will begin to create. When your virtual network has been created, you will see Created listed under Status on the networks page in the Management Portal.
7. Once your virtual network has been created, you can deploy to your VNet. For example, if you want to deploy a  VM to your VNet, see [How to Create a Custom VM](virtual-machines-create-custom.md). Be sure to select **From Gallery** when creating a new VM in order to have the option of selecting your virtual network. Note that if you have already existing VMs and PaaS instances deployed, they cannot simply be moved to your new VNet. This is because the network configuration settings are configured for them during deployment. You'll have to re-deploy them to the new VNet.



## Next steps
-  [Virtual Network Technical Overview](http://msdn.microsoft.com/library/windowsazure/jj156007.aspx)

 
-  [Add a Virtual Machine to a Virtual Network](virtual-machines-create-custom.md)

-  [Virtual Network FAQ](http://msdn.microsoft.com/library/windowsazure/dn133803.aspx)

-  [Configuring a Virtual Network Using Network Configuration Files](virtual-networks-using-network-configuration-file.md)

-  [Azure Name Resolution Overview](http://go.microsoft.com/fwlink/?LinkId=248097)
 


