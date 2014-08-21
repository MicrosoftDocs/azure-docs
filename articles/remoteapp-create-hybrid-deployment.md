<properties title="How to create a hybrid deployment of RemoteApp" pageTitle="How to create a hybrid deployment of RemoteApp" description="Learn how to create a deployment of RemoteApp that connects to your internal network." metaKeywords="" services="" solutions="" documentationCenter="" authors="elizapo"  />

<tags ms.service="remoteapp" ms.workload="tbd" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="elizapo" />

#How to create a hybrid deployment of RemoteApp

There are two kinds of RemoteApp deployment: 

- Cloud: resides completely in Azure and is created using the **Quick create** option in the Azure management portal.  
- Hybrid: includes a virtual network for on-premises access and is created using the **Create with VPN** option in the management portal.

This tutorial walks you through the process of creating a hybrid deployment. There are seven steps: 

1.	Create a RemoteApp template image.
2.	Create a RemoteApp service.
2.	Link to a virtual network.
3.	Link a template image.
4.	Configure directory synchronization. RemoteApp requires this to synchronize users, groups, contacts, and passwords from your on-premises Active Directory to your Azure Active Directory tenant.
5.	Publish RemoteApp programs.
6.	Configure user access.

**Before you begin**

You need to do the following before creating the service:

- Install [required updates](http://support.microsoft.com/kb/2977219) to improve the performance of Azure RemoteApp. 
- Sign up for the [preview of RemoteApp](http://azure.microsoft.com/en-us/services/remoteapp/). 
- Create a user account in Active Directory to use as the RemoteApp service account. Restrict the permissions for this account so that it can only join machines to the domain.
- Gather information about your on-premises network: IP address information and VPN device details.
- Install the [Azure PowerShell](http://azure.microsoft.com/en-us/documentation/articles/install-configure-powershell/) module.
- Gather information about the users and groups that you want to grant access to. This can be either Microsoft account information or Active Directory organizational account information for users or groups.




## **Step 1: Create a template image**##
Azure RemoteApp uses a Windows Server 2012 R2 template image to host all the programs that you want to share with your users. To create a custom RemoteApp template image, you can start with an existing image or create a new one. The requirements for the image that can be uploaded for use with Azure RemoteApp are:

- It must be on a VHD file (VHDX files are not currently supported).
- The VHD can be either fixed-size or dynamically expanding. A dynamically expanding VHD is recommended because it takes less time to upload to Azure than a fixed-size VHD file.
- The disk must be initialized using the Master Boot Record (MBR) partitioning style. The GUID partition table (GPT) partition style is not supported. 
- The VHD must contain a single installation of Windows Server 2012 R2. It can contain multiple volumes, but only one that contains an installation of Windows. 
- The Remote Desktop Session Host (RDSH) role and the Desktop Experience feature must be installed.
- The Encrypting File System (EFS) must be disabled.
- The image must be SYSPREPed using the parameters **/oobe /generalize /shutdown** (DO NOT use the **/mode:vm** parameter).

To create a new template image from scratch:

1.	Locate a Windows Server 2012 R2 DVD or ISO image.
2.	Create a VHD file.
4.	Install Windows Server 2012 R2.
5.	Install the Remote Desktop Session Host (RDSH) role and the Desktop Experience feature.
6.	Install additional features required by your applications.
7.	Install and configure your applications.
8.	Perform any additional Windows configurations required by your applications.
9.	Disable the Encrypting File System (EFS).
9.	SYSPREP the image.

The detailed steps for creating a new image are:

1.	Locate a Windows Server 2012 R2 DVD or ISO image. 
2.	Create a VHD file by using Disk Management. 
	1.	Launch Disk Management (diskmgmt.msc). 
	2.	Create a dynamically expanding VHD of 40 GB or more in size. (Estimate the amount of space needed for Windows, your applications, and customizations. Windows Server with the RDSH role and Desktop Experience feature installed will require about 10 GB of space).
		1.	Click **Action > Create VHD**.
		2.	Specify the location, size, and VHD format. Select **Dynamically expanding**, then click **OK**.

			This will run for several seconds. When the VHD creation is complete, you should see a new disk without any drive letter and in “Not initialized" state in the Disk Management console.

		- Right-click the disk (not the unallocated space), and then click **Initialize Disk**. Select **MBR** (Master Boot Record) as the partition style, and then click **OK**.
		- Create a new volume: right-click the unallocated space, and then click **New Simple Volume**. You can accept the defaults in the wizard, but make sure you assign a drive letter to avoid potential problems when you upload the template image.
		- Right-click the disk, and then click **Detach VHD**.

			



1. Install Windows Server 2012 R2:
	1. Create a new virtual machine. Use the New Virtual Machine Wizard in Hyper-V Manager or Client Hyper-V. 
		1. On the Connect Virtual Hard Disk page, select **Use an existing virtual hard disk**, and browse to the VHD you created in the previous step.
		2. On the Installation Options page, select **Install an operating system from a boot CD/DVD_ROM**, and then select the location of your Windows Server 2012 R2 installation media.
		3. Choose other options in the wizard necessary to install Windows and your applications. Finish the wizard.
	2.  After the wizard finishes, edit the settings of the VM and make any other changes necessary to install Windows and your programs, such as the number of virtual processors, and then click **OK**.
	4.  Connect to the VM and install Windows Server 2012 R2.
1. Install the Remote Desktop Session Host (RDSH) role and the Desktop Experience feature:
	1. Launch Server Manager.
	2. Click **Add Roles and features** on the Welcome screen or from the **Manage** menu.
	3. Click **Next** on the Before You Begin page.
	4. Select **Role-based or feature-based installation**, and then click **Next**.
	5. Select the local machine from the list, and then click **Next**.
	6. Select **Remote Desktop Services**, and then click **Next**.
	7. Expand **User Interfaces and Infrastructure** and select **Desktop Experience**.
	8. Click **Add Features**, and then click **Next**.
	9. On the Remote Desktop Services page, click **Next**.
	10. Click **Remote Desktop Session Host**.
	11. Click **Add Features**, and then click **Next**.
	12. On the Confirm installation selections page, select **Restart the destination server automatically if required**, then click **Yes** on the restart warning.
	13. Click **Install**. The computer will restart.
1.	Install additional features required by your applications, such as the .NET Framework 3.5. To install the features, run the Add Roles and Features Wizard.
7.	Install and configure the programs and applications you want to publish through RemoteApp.

 	**Important:** Microsoft recommends that you install the RDSH role before installing applications to ensure that any issues with application compatibility are discovered before the image is uploaded to RemoteApp.

8.	Perform any additional Windows configurations required by your applications.
9.	Disable the Encrypting File System (EFS). Run the following command at an elevated command window:

		Fsutil behavior set disableencryption 1

	Alternatively, you can set or add the following DWORD value in the registry: 

		HKLM\System\CurrentControlSet\Control\FileSystem\NtfsDisableEncryption = 1
9.	If you are building your image inside an **Azure Virtual Machine** then you will need to delete or rename the **\Windows\Panther\Unattend.xml** file as this will block the upload script used later from working.
10.	SYSPREP the image. At an elevated command prompt, run the following command: 

	**C:\Windows\System32\sysprep\sysprep.exe /generalize /oobe /shutdown**
	
	**Note:** Do not use the **/mode:vm** switch of the SYSPREP command even though this is a virtual machine. 


## **Step 2: Create a RemoteApp service** ##



1. In the [Azure Management Portal](http://manage.windowsazure.com), go to the RemoteApp page.
2. Click **New > Create with VPN**.
3. Enter a name for your service, and click **Create RemoteApp service**.

After your RemoteApp service has been created, go to the RemoteApp **Quick Start** page to continue with the set up steps.

## **Step 3: Link to a virtual network** ##

A virtual network lets your users access data on your local network through RemoteApp remote resources. There are four steps to configure your virtual network link:

1. On the Quick Start page, click **link a remoteapp virtual network**. 
2. Choose whether to create a new virtual network or use an existing. For this tutorial, we'll create a new network.
3. Provide the following information for your new network:  
      - Name
      - Virtual network address space
      - Local address space
      - DNS server IP address
      - VPN IP address

	See [Configure a Site-to-Site VPN in the the Management Portal](http://msdn.microsoft.com/library/azure/dn133795.aspx) for more information.

4. Next, back on the Quick Start page, click **get script** to download a script to configure your VPN device to connect to the virtual network you just created. You'll need the following information about the VPN device: 
	- Vendor
	- Platform
	- Operating system

	Save the script and run it on the VPN device. 

	**Note:** After you run this script, the virtual network will move to the Ready state - this may take 5-7 minutes. Until the network is ready, you won't be able to use it.

5. Finally, again on the Quick Start page, click **join local domain**. Add the RemoteApp service account to your local Active Directory domain. You will need the domain name, organizational unit, service account user name and password.


## **Step 4: Link to a RemoteApp template image** ##

A RemoteApp template image contains the programs that you want to share with users. You can either upload the new template image you created in Step 1 or link to an existing image (one already uploaded to Azure).

If you are uploading the new image, you need to enter the name and choose the location for the image. On the next page of the wizard, you'll see a set of PowerShell cmdlets - copy and run these cmdlets from an elevated Azure PowerShell prompt to upload the specified image.

If you are linking to an existing template image, simply specify the image name, location, and associated Azure subscription.


## **Step 5: Configure Active Directory directory synchronization** ##

RemoteApp requires directory synchronization between Azure Active Directory and your on-premise Active Directory to synchronize users, groups, contacts, and passwords to your Azure Active Directory tenant. See [Directory synchronization roadmap](http://msdn.microsoft.com//library/azure/hh967642.aspx) for planning information and detailed steps.

## **Step 6: Publish RemoteApp programs** ##

A RemoteApp program is the app or program that you provide to your users. It is located in the template image you uploaded for the service. When a user accesses a RemoteApp program, the program appears to run in their local environment, but it is really running in Azure. 

Before your users can access RemoteApp programs, you need to publish them to the end-user feed – a list of available programs that your users access through the Azure portal.
 
You can publish multiple programs to your RemoteApp service. From the RemoteApp programs page, click **Publish** to add a program. You can either publish from the Start menu of the template image or by specifying the path on the template image for the program. If you choose to add from the Start menu, choose the program to publish. If you choose to provide the path to the program, provide a name for the program and the path to where the program is installed on the template image.

## **Step 7: Configure user access** ##

Now that you have created your RemoteApp service, you need to add the users and groups that you want to be able to use your remote resources. The users or groups that you provide access to need to exist in the Active Directory tenant associated with the subscription you used to create this RemoteApp service.

1.	From the Quick Start page, click **Configure user access**. 
2.	Enter the organizational account or group name (from Active Directory) or Microsoft account that you want to grant access for.

	For users, make sure that you use the “user@domain.com” format. For groups, enter the group name.

3.	Once the users or groups are validated, click **Save**.


## Next steps ##
That's it - you have successfully created and deployed your RemoteApp hybrid deployment. The next step is to have your users download and install the Remote Desktop client. You can find the URL for the client on the RemoteApp Quick Start page. Then, have users log into Azure and access the RemoteApp programs you published.


