<properties linkid="manage-services-cross-premises-connectivity" urlDisplayName="Cross-premises Connectivity" pageTitle="Create a cross-premises virtual network - Azure" metaKeywords="" description="Learn how to create an Azure Virtual Network with cross-premises connectivity." metaCanonical="" services="virtual-network" documentationCenter="" title="Create a Virtual Network for Site-to-Site Cross-Premises Connectivity" authors="" solutions="" manager="" editor="" />





<h1 id="vnettut1">Create a Virtual Network for Site-to-Site Cross-Premises Connectivity</h1>

This tutorial walks you through the steps to create a cross-premises virtual network. The type of connection we will create is a site-to-site connection. If you want to create a point-to-site VPN by using certificates and a VPN client, see [Configure a Point-to-Site VPN in the Management Portal](http://go.microsoft.com/fwlink/?LinkId=296653).

This tutorial assumes you have no prior experience using Azure. It's meant to help you become familiar with the steps required to create a site-to-site virtual network. If you're looking for design scenarios and advanced information about Virtual Network, see the [Azure Virtual Network Overview](http://msdn.microsoft.com/en-us/library/windowsazure/jj156007.aspx).

After completing this tutorial, you will have a virtual network where you can deploy your Azure services and virtual machines, which can then communicate directly with your company's network.

For information about adding a virtual machine and extending your on-premises Active Directory to Azure Virtual Network, see the following:

-  [How to Custom Create a Virtual Machine](http://go.microsoft.com/fwlink/?LinkID=294356)

-  [Install a Replica Active Directory Domain Controller in Azure Virtual Network](http://go.microsoft.com/fwlink/?LinkId=299877)

For guidelines about deploying AD DS on Azure Virtual Machines, see [Guidelines for Deploying Windows Server Active Directory on Azure Virtual Machines](http://msdn.microsoft.com/en-us/library/windowsazure/jj156090.aspx).

For additional Virtual Network configuration procedures and settings, see [Azure Virtual Network Configuration Tasks](http://go.microsoft.com/fwlink/?LinkId=296652).

##  Objectives

In this tutorial you will learn:

-  How to setup a basic Azure virtual network to which you can add Azure services.

-  How to configure the virtual network to communicate with your company's network.

##  Prerequisites

-  Windows Live account with at least one valid, active subscription.

-  Address space (in CIDR notation) to be used for the virtual network and subnets.

-  The name and IP address of your DNS server (if you want to use your on-premises DNS server for name resolution).

-  A VPN device with a public IPv4 address. You'll need the IP address in order to complete the wizard. The VPN device cannot be located behind a NAT and must meet the minimum device standards. See [About VPN Devices for Virtual Network](http://go.microsoft.com/fwlink/?LinkID=248098) for more information. 

	Note: You can use RRAS as part of your VPN solution. However, this tutorial doesn't walk you through the RRAS configuration steps. 

	For RRAS configuration information, see [Routing and Remote Access Service templates](http://msdn.microsoft.com/library/windowsazure/dn133801.aspx). 

-  Experience with configuring a router or someone that can help you with this step.

-  The address space for your local network (on-premise network).


## High-Level Steps

1.	[Create a Virtual Network](#CreateVN)

2.	[Start the gateway and gather information for your network administrator](#StartGateway)

3.  [Configure your VPN device](#ConfigVPN)

##  <a name="CreateVN">Create a Virtual Network</a>

**To create a virtual network that connects to your company's network:**

1.	Log in to the [Azure Management Portal](http://manage.windowsazure.com/).

2.	In the lower left-hand corner of the screen, click **New**. In the navigation pane, click **Networks**, and then click **Virtual Network**. Click **Custom Create** to begin the configuration wizard. 

	![](./media/virtual-networks-create-site-to-site-cross-premises-connectivity/CreateCrossVnet_01_OpenVirtualNetworkWizard.png)

3.	On the **Virtual Network Details** page, enter the following information, and then click the next arrow on the lower right. For more information about the settings on the details page, see the **Virtual Network Details** section in [About Configuring a Virtual Network using the Management Portal](http://go.microsoft.com/fwlink/?LinkID=248092).

-  **NAME:** Name your virtual network. Type *YourVirtualNetwork*.

-  **AFFINITY GROUP:** From the drop-down list, select **Create a new affinity group**. Affinity groups are a way to physically group Azure services together at the same data center to increase performance. Only one virtual network can be assigned an affinity group.

-  **REGION:** From the drop-down list, select the desired region. Your virtual network will be created at a datacenter located in the specified region.

-  **AFFINITY GROUP NAME:** Name the new affinity group. Type *YourAffinityGroup*.

	![](./media/virtual-networks-create-site-to-site-cross-premises-connectivity/CreateCrossVnet_02_VirtualNetworkDetails.png)

4.	On the **DNS Servers and VPN Connectivity** page, enter the following information, and then click the forward arrow on the lower right. 

	<div class="dev-callout"> 
	<b>Note</b> 
	<p>It's possible to select both **Point-To-Site** and **Site-To-Site** configurations on this page concurrently. For the purposes of this tutorial, we will select to configure only **Site-To-Site**. For more information about the settings on this page, see the **DNS Servers and VPN Connectivity** page in <a href="http://go.microsoft.com/fwlink/?LinkID=248092">About Configuring a Virtual Network using the Management Portal</a>.</p> 
	</div>

-  **DNS SERVERS:** Enter the DNS server name and IP address that you want to use for name resolution. Typically this would be a DNS server that you use for on-premises name resolution. This setting does not create a DNS server. Type *YourDNS* for the name and *10.1.0.4* for the IP address.
-  **Configure Point-To-Site VPN:** Leave this field blank. 
-  **Configure Site-To-Site VPN:** Select checkbox.
-  **LOCAL NETWORK:** Select **Specify a New Local Network** from the drop-down list.
 
	![](./media/virtual-networks-create-site-to-site-cross-premises-connectivity/CreateCrossVNet_03_DNSServersandVPNConnectivity.png)

5.	On the **Site-To-Site Connectivity** page, enter the  information below, and then click the checkmark in the lower right of the page. For more information about the settings on this page, see the **Site-to-Site Connectivity** page section in [About Configuring a Virtual Network using the Management Portal](http://go.microsoft.com/fwlink/?LinkID=248092). 

-  **NAME:** Type *YourCorpHQ*.

-  **VPN DEVICE IP ADDRESS:** Enter the public IP address of your VPN device. If you don't have this information, you'll need to obtain it before moving forward with the next steps in the wizard. Note that your VPN device cannot be behind a NAT. For more information about VPN devices, see [About VPN Devices for Virtual Network](http://msdn.microsoft.com/en-us/library/windowsazure/jj156075.aspx).

-  **ADDRESS SPACE:** Type *10.1.0.0/16*.
-  **Add address space:** This tutorial does not require additional address space.

	![](./media/virtual-networks-create-site-to-site-cross-premises-connectivity/CreateCrossVnet_04_SitetoSite.png)

6.  On the **Virtual Network Address Spaces** page, enter the  information below, and then click the checkmark on the lower right to configure your network. 

	Address space must be a private address range, specified in CIDR notation 10.0.0.0/8, 172.16.0.0/12, or 192.168.0.0/16 (as specified by RFC 1918). For more information about the settings on this page, see **Virtual Network Address Spaces page** in [About Configuring a Virtual Network using the Management Portal](http://go.microsoft.com/fwlink/?LinkID=248092).

-  **Address Space:** Click **CIDR** in the upper right corner, then enter the following:
	-  **Starting IP:** 10.4.0.0
	-  **CIDR:** /16
-  **Add subnet:** Enter the following:
	-  **Rename Subnet-1** to *FrontEndSubnet* with the Starting IP *10.4.2.0/24*, and then click **add subnet**.
	-  **add a subnet** called *BackEndSubnet* with the starting IP *10.4.3.0/24*.
	-  **add a subnet** called *ADDNSSubnet* with the starting IP *10.4.4.0/24*.
	-  **Add gateway subnet**  with the starting IP *10.4.1.0/24*.
	-  **Verify** that you now have three subnets and a gateway subnet created, and then click the checkmark on the lower right to create your virtual network.

	![](./media/virtual-networks-create-site-to-site-cross-premises-connectivity/CreateCrossVnet_05_VirtualNetworkAddressSpaces.png)

7.	After clicking the checkmark, your virtual network will begin to create. When your virtual network has been created, you will see Created listed under Status on the networks page in the Management Portal. 

	![](./media/virtual-networks-create-site-to-site-cross-premises-connectivity/CreateCrossVNet_06_VirtualNetworkCreatedStatus.png)

##  <a name="StartGateway">Start the Gateway</a>

After creating your Azure Virtual Network, use the following procedure to configure the virtual network gateway in order to create your site-to-site VPN. This procedure requires that you have a VPN device that meets the minimum requirements. For more information about VPN devices and device configuration, see [About VPN Devices for Virtual Network](http://go.microsoft.com/fwlink/?LinkID=248098).

**To start the gateway:**

1.	When your virtual network has been created, the **networks** page will show **Created** as the status for your virtual network.

	In the **NAME** column, click **YourVirtualNetwork** to open the dashboard.
 
	![](./media/virtual-networks-create-site-to-site-cross-premises-connectivity/CreateCrossVNet_07_ClickYourVirtualNetwork.png)

2.	Click **DASHBOARD** at the top of the page. On the Dashboard page, on the bottom of the page, click **CREATE GATEWAY**. Select either **Dynamic Routing** or **Static Routing** for the type of Gateway that you want to create. 

	Note that if you want to use this virtual network for point-to-site connections in addition to site-to-site, you must select Dynamic Routing as the gateway type. Before creating the gateway, verify that your VPN device will support the gateway type that you want to create. See [About VPN Devices for Virtual Network](http://go.microsoft.com/fwlink/?LinkID=248098). When the system prompts you to confirm that you want the gateway created, click **YES**.

	![](./media/virtual-networks-create-site-to-site-cross-premises-connectivity/CreateCrossVnet_08_CreateGateway.png)

3.	When the gateway creation starts, you will see a message letting you know that the gateway has been started.

	It may take up to 15 minutes for the gateway to be created.

4.	After the gateway has been created, you'll need to gather the following information that will be used to configure the VPN device. 

-  Gateway IP address
-  Shared key
-  VPN device configuration script template

	The next steps walk you through this process.

5.	To locate the Gateway IP Address - The Gateway IP address is located on the virtual network **DASHBOARD** page. 

	![](./media/virtual-networks-create-site-to-site-cross-premises-connectivity/CreateCrossVnet_09_GatewayIP.png)

6.	To acquire the Shared Key - The shared key is located on the virtual network **DASHBOARD** page. Click Manage Key at the bottom of the screen, and then copy the key displayed in the dialog box. 

	![](./media/virtual-networks-create-site-to-site-cross-premises-connectivity/CreateCrossVNet_10_ManageSharedKey.png)

7.	Download the VPN device configuration script template. On the dashboard, click **Download VPN Device Script**.

8.	On the **Download a VPN Device Configuration Script** dialog box, select the vendor, platform, and operating system for your company's VPN device. Click the checkmark button and save the file. 

	![](./media/virtual-networks-create-site-to-site-cross-premises-connectivity/CreateCrossVnet_11_DownloadVPNDeviceScript.png)

If you don't see your VPN device in the drop-down list, see [About VPN Devices for Virtual Network](http://go.microsoft.com/fwlink/?LinkID=248098) in the MSDN library for additional script templates.


##  <a name="ConfigVPN">Configure the VPN Device (Network Administrator)</a>

Because each VPN device is different, this is only a high-level procedure. This procedure should be done by your network administrator.

You can get the VPN configuration script from the Management Portal or from the [About VPN Devices for Virtual Network](http://go.microsoft.com/fwlink/?LinkId=248098), which also explains routing types and the devices that are compatible with the routing configuration that you select to use.

For additional information about configuring a virtual network gateway, see [Configure the Virtual Network Gateway in the Management Portal](http://go.microsoft.com/fwlink/?LinkId=299878) and consult your VPN device documentation.

This procedure assumes the following:

-  The person configuring the VPN device is proficient at configuring the device that has been selected. Due to the number of devices that are compatible with virtual network and the configurations that are specific to each device family, these steps do not walk through device configuration at a granular level. Therefore, it's important that the person configuring the device is familiar with the device and its configuration settings. 

-  The device that you have selected to use is compatible with virtual network. Check [here](http://go.microsoft.com/fwlink/?LinkID=248098) for device compatibility.


**To configure the VPN device:**

1.	Modify the VPN configuration script. You will configure the following:

	a.	Security policies

	b.	Incoming tunnel

	c.	Outgoing tunnel

2.	Run the modified VPN configuration script to configure your VPN device.

3.	Test your connection by running one of the following commands:

	<table border="1">
	<tr>
	<th>-</th>
	<th>Cisco ASA</th>
	<th>Cisco ISR/ASR</th>
	<th>Juniper SSG/ISG</th>
	<th>Juniper SRX/J</th>
	</tr>
	
	<tr>
	<td><b>Check main mode SAs</b></td>
	<td><FONT FACE="courier" SIZE="-1">show crypto isakmp sa</FONT></td>
	<td><FONT FACE="courier" SIZE="-1">show crypto isakmp sa</FONT></td>
	<td><FONT FACE="courier" SIZE="-1">get ike cookie</FONT></td>
	<td><FONT FACE="courier" SIZE="-1">show security ike security-association</FONT></td>
	</tr>
	
	<tr>
	<td><b>Check quick mode SAs</b></td>
	<td><FONT FACE="courier" SIZE="-1">show crypto ipsec sa</FONT></td>
	<td><FONT FACE="courier" SIZE="-1">show crypto ipsec sa</FONT></td>
	<td><FONT FACE="courier" SIZE="-1">get sa</FONT></td>
	<td><FONT FACE="courier" SIZE="-1">show security ipsec security-association</FONT></td>
	</tr>
	</table>


##  Next Steps
In order to extend your on-premises Active Directory to the virtual network you just created, continue with the following tutorials:

-  [How to Custom Create a Virtual Machine](http://go.microsoft.com/fwlink/?LinkID=294356)

-  [Install a Replica Active Directory Domain Controller in Azure Virtual Network](http://go.microsoft.com/fwlink/?LinkId=299877)

If you want to export your virtual network settings to a network configuration file in order to back up your configuration or to use it as a template, see [Export Virtual Network Settings to a Network Configuration File](http://go.microsoft.com/fwlink/?LinkID=299880).

## See Also

-  [Azure virtual network](http://msdn.microsoft.com/en-us/library/windowsazure/jj156007.aspx)

-  [Virtual Network FAQ](http://msdn.microsoft.com/library/windowsazure/dn133803.aspx)

-  [Configuring a Virtual Network Using Network Configuration Files](http://msdn.microsoft.com/en-us/library/windowsazure/jj156097.aspx)

-  [Add a Virtual Machine to a Virtual Network](http://www.windowsazure.com/en-us/manage/services/networking/add-a-vm-to-a-virtual-network/)

-  [About VPN Devices for Virtual Network](http://msdn.microsoft.com/en-us/library/windowsazure/jj156075.aspx)

-  [Azure Name Resolution Overview](http://go.microsoft.com/fwlink/?LinkId=248097)





