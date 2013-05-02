<properties linkid="manage-services-create-a-virtual-network" urlDisplayName="Create a virtual network" pageTitle="Create a virtual network - Windows Azure service management" metaKeywords="" metaDescription="Learn how to create a Windows Azure Virtual Network." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />


<div chunk="../chunks/networking-left-nav.md" />

<h1 id="vnettut1">Create a Virtual Network in Windows Azure</h1>

This tutorial walks you through the steps to create a basic Windows Azure Virtual Network using the Windows Azure Management Portal. For more information about Windows Azure Virtual Network, see [Windows Azure Virtual Network Overview](http://msdn.microsoft.com/en-us/library/windowsazure/jj156007.aspx). 

This tutorial assumes you have no prior experience using Windows Azure. It is meant to help you become familiar with the steps required to create a virtual network. If you are looking for design scenarios and advanced information about Virtual Network, see the [Windows Azure Virtual Network Overview](http://msdn.microsoft.com/en-us/library/windowsazure/jj156007.aspx).

After completing this tutorial, you will have a virtual network to which you can deploy your Windows Azure services and virtual machines. 

<div class="dev-callout"> 
<b>Note</b> 
<p>This tutorial does not walk you through creating a cross-premises configuration. For a tutorial that walks you through creating a virtual network with site-to-site cross-premises connectivity (i.e., connecting to Active Directory or SharePoint located at your company), see <a href="/en-us/manage/services/networking/cross-premises-connectivity/">Create a Virtual Network for Cross-Premises Connectivity.</a></p> 
</div>

For additional Virtual Network configuration procedures and settings, see [Windows Azure Virtual Network Configuration Tasks](http://go.microsoft.com/fwlink/?LinkId=296652).

For guidelines about deploying AD DS on Windows Azure Virtual Machines, see [Guidelines for Deploying Windows Server Active Directory on Windows Azure Virtual Machines](http://msdn.microsoft.com/en-us/library/windowsazure/jj156090.aspx).

##  Objectives

In this tutorial you will learn:

*  How to setup a basic Windows Azure virtual network to which you can add Windows Azure Cloud Services and virtual machines.

##  Prerequisites

*  Windows Live account with at least one valid, active subscription.

##  Create a Virtual Network

**To create a cloud-only virtual network:**

1.	Log in to the [Windows Azure Management Portal](http://manage.windowsazure.com/).

2. In the lower left-hand corner of the screen, click **New**. In the navigation pane, click **Networks**, and then click **Virtual Network**. Click **Custom Create** to begin the configuration wizard.

	![][Image1]

3. On the **Virtual Network Details** page, enter the following information, and then click the next arrow on the lower right. For more information about the settings on the details page, see **Virtual Network Details** page section in <a href="http://go.microsoft.com/fwlink/?LinkID=248092">About Configuring a Virtual Network using the Management Portal</a>.

- **Name -** Name your virtual network. Type *YourVirtualNetwork*.

- **Affinity Group -** From the drop-down list, select **Create a new affinity group**. Affinity groups are a way to physically group Windows Azure services together at the same data center to increase performance. Only one virtual network can be assigned an affinity group.

- **Region -** From the drop-down list, select the desired region. Your virtual network will be created at a datacenter located in the specified region.

- **Affinity Group Name -** Name the new affinity group. Type *YourAffinityGroup*.

	![][Image2]

4. On the **DNS Servers and VPN Connectivity** page, enter the following information, and then click the next arrow on the lower right. For more information about the settings on this page, see **DNS Servers and VPN Connectivity** page in <a href="http://go.microsoft.com/fwlink/?LinkID=248092">About Configuring a Virtual Network using the Management Portal</a>.

	- **DNS Servers-Optional -** Enter the DNS server name and IP address that you want to use. This setting does not create a DNS server, it refers to an already existing DNS server.

		<div class="dev-callout"> 
		<b>Note</b> 
		<p>If you want to use a public DNS service, you can enter that information on this screen. Otherwise, name resolution will default to the Windows Azure service. For more information, see Windows Azure Name Resolution Overview/</p> 
		</div>

	- **Do not select the checkbox for point-to-site or site to site connectivity**. The virtual network we are creating in this tutorial is not designed for cross-premises connectivity.

	![][Image3]

5.	On the **Virtual Network Address Spaces** page, enter the following information and then click the checkmark on the lower right to configure your network. Address space must be a private address range, specified in CIDR notation 10.0.0.0/8, 172.16.0.0/12, or 192.168.0.0/16 (as specified by RFC 1918). For more information about the settings on this page, see **Virtual Network Address Spaces** page in <a href="http://go.microsoft.com/fwlink/?LinkID=248092">About Configuring a Virtual Network using the Management Portal</a>.

	- **Address Space:** Click CIDR in the upper right corner, then enter the following:

		- **Starting IP:** 10.4.0.0

		- **CIDR:** /16

	- **Add subnet:** Enter the following:

		- **Rename Subnet-1** to *FrontEndSubnet* with the Starting IP *10.4.2.0/24*, and then click **add subnet**.

		- **Create a subnet** called *BackEndSubnet* with the Starting IP *10.4.3.0/24*.

		- Verify that you now have two subnets created and then click the checkmark on the lower right to create your virtual network.

	![][Image4]

6. After clicking the checkmark, your virtual network will begin to create. When your virtual network has been created, you will see **Created** listed under **Status** on the networks page in the Management Portal. 

	![][Image5]

7.	Once your virtual network has been created, you can continue with the following tutorials:

	- <a href="/en-us/manage/services/networking/add-a-vm-to-a-virtual-network/">Add a Virtual Machine to a Virtual Network</a> – Use this basic tutorial to install a virtual machine to your virtual network.

	- For more information about virtual machines and installation options, see <a href="/en-us/manage/windows/how-to-guides/custom-create-a-vm/">How to Create a Custom Virtual Machine</a> and <a href="/en-us/manage/windows/">Windows Azure Virtual Machines</a>.

	- <a href="/en-us/manage/services/networking/active-directory-forest/">Install a new Active Directory forest in Windows Azure</a> - Use this tutorial to install a new Active Directory forest without connectivity to any other network. The tutorial will explain the specific steps required to create a virtual machine (VM) for a new forest installation. If you plan to use this tutorial, do not create any VMs by using the Management Portal.

## See Also

-  [Windows Azure Virtual Network Overview](http://msdn.microsoft.com/en-us/library/windowsazure/jj156007.aspx)

-  [Windows Azure Virtual Network FAQ](http://go.microsoft.com/fwlink/?LinkId=296650)

-  [Windows Azure Virtual Network Configuration Tasks](http://go.microsoft.com/fwlink/?LinkId=296652)

-  [Configuring a Virtual Network Using Network Configuration Files](http://msdn.microsoft.com/en-us/library/windowsazure/jj156097.aspx)

-  [Windows Azure Name Resolution Overview](http://go.microsoft.com/fwlink/?LinkId=248097)


[Image1]: ../media/createVNet_01_OpenVirtualNetworkWizard.png
[Image2]: ../media/createVNet_02_VirtualNetworkDetails.png
[Image3]: ..//media/createVNet_03_DNSServersandVPNConnectivity.png
[Image4]: ..//media/createVNet_04_VirtualNetworkAddressSpaces.png
[Image5]: ../media/createVNet_05_VirtualNetworkCreatedStatus.png
[Image6]: ../media/VNTut1_06_VNStatus_Created.png
