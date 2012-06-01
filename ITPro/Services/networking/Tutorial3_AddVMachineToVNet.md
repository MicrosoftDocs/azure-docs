<properties umbracoNaviHide="0" pageTitle="Tutorial 3: Adding a Virtual Machine to a Virtual Network" metaKeywords="Windows Azure cloud services, cloud service, configure cloud service" metaDescription="Learn how to configure Windows Azure cloud services." linkid="manage-windows-how-to-guide-storage-accounts" urlDisplayName="How to: storage accounts" headerExpose="" footerExpose="" disqusComments="1" />


<h1 id="vnet3">Tutorial 3: Adding a Virtual Machine to a Virtual Network</h1>

<!--SOMEWHERE IN THIS TUTORIAL I NEED TO XREF TO THE OTHER VMACHINE TUTORIAL -->


<div chunk="../../Shared/Chunks/disclaimer.md" />

This tutorial walks you through the steps to create a Windows Azure storage account and virtual machine that you add to a virtual network.

This tutorial assumes you have no prior experience using Windows Azure.

For information about creating adding Active Directory connection to your virtual network, see the following:
	<!-- UPDATE THE FOLLOWING LIST ONCE WE HAVE THE LINKS FOR TUTORIALS 4 & 5 -->

-  New Active Directory Forest in the Cloud

-  Active Directory Replica Domain Controller with cross-premises connectivity

## Objectives ##

In this tutorial you will learn:

-  <a href="#CreateStorageAcct">How to create a storage account</a>

-  <a href="#CreateVM">How to create a virtual machine and deploy it to a virtual network</a>

## Prerequisites ##

-  Complete one of the following: 

-  [Tutorial 1: Creating a Virtual Network in Windows Azure] [Tut1_VN]

	-OR- 
-  [Tutorial 2: Creating a Virtual Network for cross-premises connectivity] [Tut2_VN]

-  Windows Live account with at least one valid, active subscription.	

-  Names of the following:
	-	Affinity group you assigned your virtual network to in Tutorial 1 or Tutorial 2.
	-	Name of your virtual network created in Tutorial 1 or Tutorial 2.

## <a name="CreateStorageAcct">Create Storage Account</a> ##

1.	After you have created your virtual network, on the lower left-hand corner of the screen, click **New**.

	![NewStorAcct] []

2.	In the navigation pane, click **STORAGE**, and then **QUICK CREATE**.

	![QuickCreate] []

3.	Enter the following information, and then click the check mark on the bottom right of the screen.

-  **URL:** Type *yourstorageaccount*.

-  **REGION/AFFINITY GROUP:** From the drop-down list, select **YourAffinityGroup**.

-  **ENABLE GEO-REPLICATION:** Leave this box checked.
 
	![CreateNewAcct] []

4.	On the **Storage** page, the **STATUS** column will display **Online** when the process is complete.
 
	![NewStorAcctCreated] []

## <a name="CreateVM">Create Virtual Machine and Deploy to Virtual Network</a> ##
**To create a virtual machine and deploy to a virtual network:**

1.	After you have created your storage account, on the lower left-hand corner of the screen, click **New**.

	![NewVM] []

2.	In the navigation pane, click **VIRTUAL MACHINES**, and then click **FROM GALLERY**.
 
	![FromGallery] []

3.	On the **VM OS Selection** screen, select **Windows Server 2008 R2 SP1, March 2012**, and then click the next arrow.
 
	![VMOS] []

4.	On the **VM Configuration** screen, enter the following information, and then click the next arrow. 
	<!-- SHOULD WE TELL USERS TO WRITE DOWN USER NAME AND PASS?? -->

	**Tip:** Write down the user name and password because these are the credentials you will use to log in to your new virtual machine.

-  **VIRTUAL MACHINE NAME:** Type *YourVMachine*.

-  **NEW USER NAME:** Read-only.

-  **NEW PASSWORD:** Enter a password.

-  **CONFIRM PASSWORD:** Re-enter password.

-  **SIZE:** Select **Extra Small**.
 
	![VMConfig] []

5.	On the **VM Mode** screen, enter the following information, and then click the next arrow.

-  **Standalone Virtual Machine:** Leave this option selected.

-  **DNS NAME:** Type *yourcloudapp*.

-  **STORAGE ACCOUNT:** Select **yourstorageaccount**.

-  **REGION/AFFINITY GROUP/VIRTUAL NETWORK:** From the drop-down list, select **YourVirtualNetwork**.
 
	![VMMode] []

6.	On the **VM Options** screen, enter the following information, and then click the check mark button. Your virtual machine will now be created. It can take up to 10 minutes for the new machine to be created.
	<!-- CONFIRM HOW LONG IT CAN TAKE ON AVG FOR VMACHINE TO BE CREATED -->

-  **AVAILABILITY SET:** Select **none**.

-  **VIRTUAL NETWORK SUBNETS:** Select **FrontEndSubnet**.
 
	![VMOptions] []

7.	When your virtual machine has been created, on the virtual machines screen, the **STATUS** will be **Running**.
 
	![VMInstances] []

8.	In the navigation pane, click **ALL ITEMS**. All your objects you've created will be displayed with their current status.
 
	![AllTab] []

## Next Steps ##
If you'd like to connect to Active Directory, you can continue with the following tutorials:
	<!-- UPDATE THE FOLLOWING LIST ONCE WE HAVE THE LINKS FOR TUTORIALS 4 & 5 -->
	
-	New Active Directory Forest in the Cloud
	
-   Active Directory Replica Domain Controller with cross-premises connectivity

<!-- LINKS -->

[wa_com]: http://windows.azure.com/
[Tut2_VN]: ..Tutorial2_CreateVNetCrossPrem 
[Tut1_VN]: ..Tutorial1_CreateVirtualNetwork

<!-- INTERNAL LINKS -->


<!-- IMAGES -->

[NewStorAcct]:	../media/VNTut3_01_NewStorageAccount.png

[QuickCreate]:	../media/VNTut3_02_StorageAcct_QuickCreate.png

[CreateNewAcct]:	../media/VNTut3_03_CreateNewStorageAccount.png

[NewStorAcctCreated]:	../media/VNTut3_04_NewStorageAcctCreated.png

[NewVM]:	../media/VNTut3_05_NewVM.png

[FromGallery]:	../media/VNTut3_06_VM_FromGallery.png

[VMOS]:	../media/VNTut3_07_VMOSSelect_Win2008R2.png

[VMConfig]:	../media/VNTut3_08_VMConfig.png

[VMMode]:	../media/VNTut3_09_VMMode.png

[VMOptions]:	../media/VNTut3_10_VMOptions.png

[VMInstances]:	../media/VNTut3_11_VMInstances.png

[AllTab]:	../media/VNTut3_12_AllTab.png