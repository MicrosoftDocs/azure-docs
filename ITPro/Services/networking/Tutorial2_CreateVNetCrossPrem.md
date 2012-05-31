# Tutorial 2: Creating a Virtual Network for Cross-Premises Connectivity

<div chunk="../../../Shared/Chunks/disclaimer.md" />

This tutorial walks you through the steps to create a Windows Azure virtual network that connects to your company's network using the Management Portal. After completing this tutorial, you will have a virtual network that communicates with your company's network to which you can deploy your Windows Azure services.

This tutorial assumes you have no prior experience using Windows Azure.

<!-- ADD INFO ABOUT POSSIBLY NEEDING A NETWORK ENGR TO DO THE VPN CONFIG -->

For information about adding a virtual machine to your tutorial or connecting to Active Directory, see the following:

<!-- UPDATE THE FOLLOWING LIST ONCE WE HAVE THE LINKS FOR TUTORIALS 4 & 5 -->

-  [Tutorial 3: Adding a Virtual Machine to a Virtual Network] [Tut3_VN]

-  Active Directory Replica Domain Controller with cross-premises connectivity
-  New Active Directory Forest in the Cloud


##  Objectives

In this tutorial you will learn:

-  How to setup a basic Windows Azure virtual network to which you can add Windows Azure services.

-  How to configure the virtual network to communicate with your company's network.

-  How to configure your VPN device to communicate with your Windows Azure virtual network.

##  Prerequisites

-  Windows Live account with at least one valid, active subscription.

-  Address space and IPs to be used for the virtual network and subnets.

-  The name and IP address of your DNS server.

-  The address space for your local network.

-  The IP address of the public XXX that your virtual network will connect through.

-  The IP address for your VPN device. You can get this from your network engineer.

## High-Level Steps

1.	[Create a Virtual Network] [CreateVN]

2.	[Start the gateway and gather information for your network engineer] [StartGateway]

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

-  **REGION:** From the drop-down list, select **West US**. Your virtual network will be created at a datacenter located in the specified region.

-  **AFFINITY GROUP NAME:** Type *YourAffinityGroup*.

	![VNDetails] []

5.	On the **Address Space and Subnets** screen, enter the following information, and then click the next arrow. Address space must conform to RFC 1918 and cannot overlap other virtual network or local network sites.
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
	<!-- THINK I NEED TO DELETE THE ACTUAL VPN IP HERE!!! -->

	**NOTE:** You get the VPN Device IP Address from your network engineer.

-  **NAME:** Type *YourCorpHQ*.

-  **VPN DEVICE IP ADDRESS:** Type *131.107.64.111*.

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

4.   After the gateway has been created, you need to gather some information to send to your network engineer so they can configure the VPN device. The next steps walk you through this process.

5.    Copy the Gateway IP Address:

	![GWIP] []

6.	Get the Shared Key. Click **VIEW KEY** at the bottom of the dashboard, and then copy the **SHARED KEY** in the dialog box.
	<!-- THIS IS CONFUSING -->

	![SharedKey] []
 
7.	Download the VPN configuration file. On the dashboard, click **DOWNLOAD**.

	![DwnldVPN] []
 
8.	On the **Download VPN Device Config Script** dialog, select the vendor, platform, and os for your company's VPN device. Click the check button and save the file.

	![DwnldVPNConfig] []

9.	Send your network engineer the following information:
-  Gateway IP address
-  Shared key
-  VPN configuration script

##  <a name="ConfigVPN">Configure the VPN Device (Network Engineer)</a>

This procedure should be done by your network engineer. Because each VPN device is different, this is only a high-level procedure. Please refer to the your VPN documentation for specific information.

This procedure assumes the following:

-  The VPN device has been configured at your company.

	<!-- CONFIRM THE FOLLOWING IS CORRECT
	  The network engineer doing this procedure knows IPSec.
	-->

**To configure the VPN device:**

1.	Configure the VPN configuration script that was downloaded from the Management Portal. You will configure the following:
	<!-- ALSO ADD LINK TO MSDN VPN SCRIPTS -->

	a.	Security policies

	b.	Incoming tunnel

	c.	Outgoing tunnel

2.	Run the modified VPN configuration script to configure your VPN device.

3.	Test your connection by running one of the following commands:

	<table border="1">
	<tr>
	<th></th>
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
If you'd like, you can continue with the following tutorials:

<!-- UPDATE THE FOLLOWING LIST ONCE WE HAVE THE LINKS FOR TUTORIALS 4 & 5 -->

- [Tutorial 3: Adding a Virtual Machine to a Virtual Network] [Tut3_VN]

- New Active Directory Forest in the Cloud

- Active Directory Replica Domain Controller with cross-premises connectivity



[wa_com]: http://windows.azure.com/
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
