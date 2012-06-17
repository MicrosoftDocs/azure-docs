<properties umbracoNaviHide="0" pageTitle="Tutorial 1: Creating a Virtual Network in Windows Azure" metaKeywords="Windows Azure cloud services, cloud service, configure cloud service" metaDescription="Learn how to configure Windows Azure cloud services." linkid="manage-windows-how-to-guide-storage-accounts" urlDisplayName="How to: storage accounts" headerExpose="" footerExpose="" disqusComments="1" />


<h1 id="vnettut1">Create a Virtual Network in Windows Azure</h1>

<div chunk="../../Shared/Chunks/disclaimer.md" />

This tutorial walks you through the steps to create a Windows Azure virtual network using the Windows Azure (Preview) Management Portal.

This tutorial assumes you have no prior experience using Windows Azure.

After completing this tutorial, you will have a virtual network to which you can deploy your Windows Azure services.

For information about creating a virtual network with cross-premises connectivity (i.e., connecting to Active Directory or SharePoint located at your company), see the following tutorials:


*  [Create a Virtual Network for Cross-Premises Connectivity](../cross-premises-connectivity/)

*  [Install a Replica Active Directory Domain Controller in Windows Azure Virtual Network](../replica-domain-controller/)

*  [Install a new Active Directory forest in Windows Azure](../active-directory-forest/)

##  Objectives

In this tutorial you will learn:

*  How to setup a basic Windows Azure virtual network to which you can add Windows Azure Cloud Services.

##  Prerequisites

*  Windows Live account with at least one valid, active subscription.

*  Address space to be used for the virtual network and subnets within the virtual network (in CIDR notation).

##  Create a Virtual Network

**To create a cloud-only virtual network:**

1.	Log in to the [Windows Azure (Preview) Management Portal](http://manage.windowsazure.com/).
2.	In the lower left-hand corner of the screen, click **New**. 

	![Image1][]

3.	In the navigation pane, click **Network**, and then click **Custom Create**.

	![Image2][]

4.	On the **Virtual Network Details** screen, enter the following information, and then click the next arrow.

	*  **NAME:** Type *YourVirtualNetwork*.

*  **AFFINITY GROUP:** From the drop-down list, select **Create a new affinity group**. Affinity groups are a way to physically group Windows Azure services together at the same data center to increase performance. Only one virtual network can be assigned an affinity group.

*  **REGION:** From the drop-down list, select the desired region. Your virtual network will be created at a datacenter located in the specified region.

*  **AFFINITY GROUP NAME:** Type *YourAffinityGroup*.

	![Image3] []

5.	On the **Address Space and Subnets** screen, enter the following information, and then click the next arrow. Address space must be a private address range, specified in CIDR notation 10.0.0.0/8, 172.16.0.0/12, or 192.168.0.0/16 (as specified by RFC 1918).

	**NOTE:** After adding each address space, click the plus button.

*  **ADDRESS SPACE:** Type *10.4.0.0/16*.
*  **SUBNETS:** Enter the following:

		-  *FrontEndSubnet, 10.4.2.0/24*
		-  *BackEndSubnet, 10.4.3.0/24*
 
	![Image4] []

6.	On the **DNS Servers and Local Network** screen, on the lower right-hand of the screen, click the check button.

	Your virtual network will now be created.


 	**Note:** If you want to use a public DNS service, you can enter that information on this screen. Otherwise, name resolution will default to the Windows Azure service. For more information, see [Windows Azure Name Resolution Overview](http://go.microsoft.com/fwlink/?LinkId=248097).
 
	![Image5] []

7.	You now have a virtual network in Windows Azure, which you can see on the portal's **Virtual Network** tab.


	![Image6] []


##  Next Steps
If you'd like, you can continue with the following tutorials:


- [Add a Virtual Machine to a Virtual Network](../add-a-vm-to-a-virtual-network/)

*  [Install a Replica Active Directory Domain Controller in Windows Azure Virtual Network](../replica-domain-controller/)

*  [Install a new Active Directory forest in Windows Azure](../active-directory-forest/)


[Image1]: ../media/VNTut1_00_New.png
[Image2]: ../media/VNTut1_01_Network_CustomCreate.png
[Image3]: ..//media/VNTut1_02_VNDetails.png
[Image4]: ..//media/VNTut1_03_AddressSpaceAndSubnets.png
[Image5]: ../media/VNTut1_04_DNSServersAndLocalNetworks_CloudOnly.png
[Image6]: ../media/VNTut1_06_VNStatus_Created.png
