<properties linkid="manage-services-cross-premises-connectivity" urlDisplayName="Cross-premises Connectivity" pageTitle="Create a cross-premises virtual network - Windows Azure" metaKeywords="" metaDescription="Learn how to create a Windows Azure Virtual Network with cross-premises connectivity." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />

<div chunk="../chunks/networking-left-nav.md" />

<h1 id="vnettut1">Create a Virtual Network for Cross-Premises Connectivity</h1>

<div chunk="../../Shared/Chunks/disclaimer.md" />

This tutorial walks you through the steps to create a [Windows Azure virtual network](http://msdn.microsoft.com/en-us/library/windowsazure/jj156007.aspx) that connects to your company's network using the Management Portal. After completing this tutorial, you will have a virtual network where you can deploy your Windows Azure services and communicate with your company's network.

This tutorial assumes you have no prior experience using Windows Azure.

<!-- ADD INFO ABOUT POSSIBLY NEEDING A NETWORK ENGR TO DO THE VPN CONFIG -->

For information about adding a virtual machine and extending your on-premises Active Directory to Windows Azure Virtual Network, see the following:

-  [Add a Virtual Machine to a Virtual Network](/en-us/manage/services/networking/add-a-vm-to-a-virtual-network/)

-  [Install a Replica Active Directory Domain Controller in Windows Azure Virtual Network](/en-us/manage/services/networking/replica-domain-controller/)

For guidelines about deploying AD DS on Windows Azure Virtual Machines, see [Guidelines for Deploying Windows Server Active Directory on Windows Azure Virtual Machines](http://msdn.microsoft.com/en-us/library/windowsazure/jj156090.aspx).

##  Objectives

In this tutorial you will learn:

-  How to setup a basic Windows Azure virtual network to which you can add Windows Azure services.

-  How to configure the virtual network to communicate with your company's network.

-  How to configure your VPN device to communicate with your Windows Azure virtual network.

##  Prerequisites

-  Windows Live account with at least one valid, active subscription.

-  Address space (in CIDR notation) to be used for the virtual network and subnets.

-  The name and IP address of your DNS server (if you want to use your on-premises DNS server for name resolution).

-  The public IP address for your VPN device. This VPN device cannot be behind a NAT. You can get this from your network engineer.

-  The address space for your local network (on-premise network).

## High-Level Steps

1.	[Create a Virtual Network] [CreateVN]

2.	[Start the gateway and gather information for your network administrator] [StartGateway]

3.  [Configure your VPN device] [ConfigVPN]

##  <a name="CreateVN">Create a Virtual Network</a>

**To create a virtual network that connects to your company's network:**

1.	Log in to the [Windows Azure (Preview) Management Portal](http://manage.windowsazure.com/).
2.	In the lower left-hand corner of the screen, click **New**. 

	![CreateNew][]

3.	In the navigation pane, click **Network**, and then click **Custom Create**.

	![CustomCreate] []

4.	On the **Virtual Network Details** screen, enter the following information, and then click the next arrow.

-  **NAME:** Type *YourVirtualNetwork*.

-  **AFFINITY GROUP:** From the drop-down list, select **Create a new affinity group**. Affinity groups are a way to physically group Windows Azure services together at the same data center to increase performance. Only one virtual network can be assigned an affinity group.

-  **REGION:** From the drop-down list, select the desired region. Your virtual network will be created at a datacenter located in the specified region.

-  **AFFINITY GROUP NAME:** Type *YourAffinityGroup*.

	![VNDetails] []

5.	On the **Address Space and Subnets** screen, enter the following information, and then click the next arrow. Address space must be a private address range, specified in CIDR notation 10.0.0.0/8, 172.16.0.0/12, or 192.168.0.0/16 (as specified by RFC 1918).

	**NOTE:** After adding each address space, click the plus button.

*  **ADDRESS SPACE:** Type 10.4.0.0/16.
*  **SUBNETS:** Enter the following:

		-  *FrontEndSubnet, 10.4.2.0/24*
		-  *BackEndSubnet, 10.4.3.0/24*
		-  *ADDNSSubnet, 10.4.4.0/24*
 
	![AddressSpace] []

6.	On the **DNS Servers and Local Network** screen, enter the following information, and then click the forward arrow.

-  **DNS SERVERS:** Type *YourDNS*, *10.1.0.4*.
-  **Configure connection to local network:** Check this box.
-  **GATEWAY SUBNET:**  Type *10.4.1.0/24*.
-  **LOCAL NETWORK:** Select the default Create a new local network.
 
	![DNSServer] []

7.	On the **Create New Local Network** screen, enter the following information, and then click the check mark in the lower right-hand corner. Your virtual network will be created in a few minutes.

	**NOTE:** You get the VPN Device IP Address from your network administrator.

-  **NAME:** Type *YourCorpHQ*.
-  **VPN DEVICE IP ADDRESS:** Enter the public IP address of your VPN device. The device should not be behind a NAT. For more information about VPN devices, see [About VPN Devices for Virtual Network](http://msdn.microsoft.com/en-us/library/windowsazure/jj156075.aspx).

-  **ADDRESS SPACE:** Type *10.1.0.0/16*.

	![CreateLocal] []

8.  You now have a virtual network in Windows Azure, which you can see on the portal's **Virtual Network** tab.

	![VNCreated] []


##  <a name="StartGateway">Start the Gateway</a>

**To start the gateway:**

1.	When your virtual network has been created, the networks screen will show the **Status** is **Created**. 

	In the **Name** column, click **YourVirtualNetwork** to open the dashboard.
 
	![ViewDash] []

2.	On the **Dashboard** page, on the bottom of the page, click **Create Gateway**. When prompted to confirm you want the gateway created, click **YES**.

	![CreateGW] []

3.	When the gateway creation starts, you will see the message as shown in the screenshot below.

	It may take up to 15 minutes for the gateway to be created.

	![GWCreating] []

4.   After the gateway has been created, you need to gather some information to send to your network administrator so they can configure the VPN device. The next steps walk you through this process.

5.    On the dashboard, copy the Gateway IP Address:

	![GWIP] []

6.	Get the Shared Key. Click **VIEW KEY** at the bottom of the dashboard, and then copy the **SHARED KEY** in the dialog box.
	<!-- THIS IS CONFUSING -->

	![SharedKey] []
 
7.	Download the VPN configuration file. On the dashboard, click **DOWNLOAD**.

	![DwnldVPN] []
 
8.	On the **Download VPN Device Config Script** dialog, select the vendor, platform, and operating system for your company's VPN device. Click the check button and save the file.

	For additional supported  VPN devices and script templates, see [About VPN Devices for Virtual Network](http://go.microsoft.com/fwlink/?LinkId=248098).

	![DwnldVPNConfig] []

9.	Send your network administrator the following information:
-  Gateway IP address
-  Shared key
-  VPN configuration script

##  <a name="ConfigVPN">Configure the VPN Device (Network Administrator)</a>

This procedure should be done by your network administrator. Because each VPN device is different, this is only a high-level procedure. 

You can get the VPN configuration script from the Management Portal or from the [About VPN Devices for Virtual Network](http://go.microsoft.com/fwlink/?LinkId=248098) section of the MSDN library.

For more information, see [Establish a Site-to-Site VPN Connection](http://go.microsoft.com/fwlink/?LinkId=254218) and your VPN device documentation.

This procedure assumes the following:

-  The VPN device has been configured at your company.

	<!-- CONFIRM THE FOLLOWING IS CORRECT
	  The network administrator doing this procedure knows IPSec.
	-->

**To configure the VPN device:**

1.	Modify the VPN configuration script. You will configure the following:

	a.	Security policies

	b.	Incoming tunnel

	c.	Outgoing tunnel

2.	Run the modified VPN configuration script to configure your VPN device.

3.	Test your connection by running one of the following commands:

	<table border="1">
	<tr>
	<th> </th>
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

-  [Add a Virtual Machine to a Virtual Network](/en-us/manage/services/networking/add-a-vm-to-a-virtual-network/)

-  [Install a Replica Active Directory Domain Controller in Windows Azure Virtual Network](/en-us/manage/services/networking/replica-domain-controller/)

## See Also

-  [Windows Azure virtual network](http://msdn.microsoft.com/en-us/library/windowsazure/jj156007.aspx)

-  [Configuring a Virtual Network Using Network Configuration Files](http://msdn.microsoft.com/en-us/library/windowsazure/jj156097.aspx)

-  [About VPN Devices for Virtual Network](http://msdn.microsoft.com/en-us/library/windowsazure/jj156075.aspx)

-  [Windows Azure Name Resolution Overview](http://go.microsoft.com/fwlink/?LinkId=248097)


[wa_com]: http://manage.windowsazure.com/
[Tut2_VN]: ..Tutorial2_CreateVNetCrossPrem 
[Tut3_VN]: ..Tutorial3_AddVMachineToVNet
[CreateVN]: #CreateVN
[StartGateway]: #StartGateway
[ConfigVPN]: #ConfigVPN


[CreateNew]: ../media/VNTut1_00_New.png

[CustomCreate]: ../media/VNTut1_01_Network_CustomCreate.png

[VNDetails]: ../media/VNTut1_02_VNDetails.png

[AddressSpace]:	../media/VNTut2_03b_AddressSpaceAndSubnet_CrossPrem.png

[DNSServer]:	../media/VNTut2_04_DNSServersAndLocalNetworks_CrossPrem.png

[CreateLocal]:	../media/VNTut2_05_CreateLocalNetwork.png

[VNCreated]:	../media/VNTut2_06_VNStatus_Created.png

[ViewDash]:	../media/VNTut2_06b_VNStatus_ViewDashboard.png

[CreateGW]:	../media/VNTut2_07_CreateGateway.png

[GWCreating]:	../media/VNTut2_09_GatewayBeingCreated.png

[GWIP]:	../media/VNTut2_10_GatewayIPAddress.png

[SharedKey]:	../media/VNTut2_11_SharedKey.png

[DwnldVPN]:	../media/VNTut2_12_DownloadVPNFile.png

[DwnldVPNConfig]: ../media/VNTut2_13_DownloadVPNDeviceScript.png
