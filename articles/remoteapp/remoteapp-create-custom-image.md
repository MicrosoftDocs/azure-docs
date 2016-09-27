<properties
	pageTitle="How to create a custom template image for Azure RemoteApp | Microsoft Azure"
	description="Learn how to create a custom template image for Azure RemoteApp. You can use this template with either a hybrid or cloud collection."
	services="remoteapp"
	documentationCenter=""
	authors="lizap"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="remoteapp"
	ms.workload="compute"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/15/2016" 
	ms.author="elizapo"/>

# How to create a custom template image for Azure RemoteApp

> [AZURE.IMPORTANT]
> Azure RemoteApp is being discontinued. Read the [announcement](https://go.microsoft.com/fwlink/?linkid=821148) for details.

Azure RemoteApp uses a Windows Server 2012 R2 template image to host all the programs that you want to share with your users. To create a custom RemoteApp template image, you can start with an existing image or create a new one. 


> [AZURE.TIP] Did you know you can create an image from an Azure VM? True story, and it cuts down on the amount of time it takes to import the image. Check out the steps [here](remoteapp-image-on-azurevm.md).

The requirements for the image that can be uploaded for use with Azure RemoteApp are:


- The image size should be a multiple of MBs. If you try to upload an image that is not an exact multiple, the upload will fail.
- The image size must be 127 GB or smaller.
- It must be on a VHD file (VHDX files [Hyper-V virtual hard drives] are not currently supported).
- The VHD must not be a generation 2 virtual machine.
- The VHD can be either fixed-size or dynamically expanding. A dynamically expanding VHD is recommended because it takes less time to upload to Azure than a fixed-size VHD file.
- The disk must be initialized using the Master Boot Record (MBR) partitioning style. The GUID partition table (GPT) partition style is not supported.
- The VHD must contain a single installation of Windows Server 2012 R2. It can contain multiple volumes, but only one that contains an installation of Windows.
- The Remote Desktop Session Host (RDSH) role and the Desktop Experience feature must be installed.
- The Remote Desktop Connection Broker role must *not* be installed.
- The Encrypting File System (EFS) must be disabled.
- The image must be SYSPREPed using the parameters **/oobe /generalize /shutdown** (DO NOT use the **/mode:vm** parameter).
- Uploading your VHD from a snapshot chain is not supported.


**Before you begin**

You need to do the following before creating the service:

- [Sign up](https://azure.microsoft.com/services/remoteapp/) for RemoteApp.
- Create a user account in Active Directory to use as the RemoteApp service account. Restrict the permissions for this account so that it can only join machines to the domain. See [Configure Azure Active Directory for RemoteApp](remoteapp-ad.md) for more information.
- Gather information about your on-premises network: IP address information and VPN device details.
- Install the [Azure PowerShell](../powershell-install-configure.md) module.
- Gather information about the users that you want to grant access to. This can be either Microsoft account information or Active Directory work account information for users.



## Create a template image ##

These are the high level steps to create a new template image from scratch:

1.	Locate a Windows Server 2012 R2 Update DVD or ISO image.
2.	Create a VHD file.
4.	Install Windows Server 2012 R2.
5.	Install the Remote Desktop Session Host (RDSH) role and the Desktop Experience feature.
6.	Install additional features required by your applications.
7.	Install and configure your applications. To make sharing apps easier, add any apps or programs that you want to share to the **Start** menu of the image, specifically in **%systemdrive%\ProgramData\Microsoft\Windows\Start Menu\Programs.
8.	Perform any additional Windows configurations required by your applications.
9.	Disable the Encrypting File System (EFS).
10.	**REQUIRED:** Go to Windows Update and install all important updates.
9.	SYSPREP the image.

The detailed steps for creating a new image are:

1.	Locate a Windows Server 2012 R2 Update DVD or ISO image.
2.	Create a VHD file by using Disk Management.
	1.	Launch Disk Management (diskmgmt.msc).
	2.	Create a dynamically expanding VHD of 40 GB or more in size. (Estimate the amount of space needed for Windows, your applications, and customizations. Windows Server with the RDSH role and Desktop Experience feature installed will require about 10 GB of space).
		1.	Click **Action > Create VHD**.
		2.	Specify the location, size, and VHD format. Select **Dynamically expanding**, and then click **OK**.

			This will run for several seconds. When the VHD creation is complete, you should see a new disk without any drive letter and in “Not initialized" state in the Disk Management console.

		- Right-click the disk (not the unallocated space), and then click **Initialize Disk**. Select **MBR** (Master Boot Record) as the partition style, and then click **OK**.
		- Create a new volume: right-click the unallocated space, and then click **New Simple Volume**. You can accept the defaults in the wizard, but make sure you assign a drive letter to avoid potential problems when you upload the template image.
		- Right-click the disk, and then click **Detach VHD**.





1. Install Windows Server 2012 R2:
	1. Create a new virtual machine. Use the New Virtual Machine Wizard in Hyper-V Manager or Client Hyper-V.
		1. On the Specify Generation page, choose  **Generation 1**.
		2. On the Connect Virtual Hard Disk page, select **Use an existing virtual hard disk**, and browse to the VHD you created in the previous step.
		2. On the Installation Options page, select **Install an operating system from a boot CD/DVD_ROM**, and then select the location of your Windows Server 2012 R2 installation media.
		3. Choose other options in the wizard necessary to install Windows and your applications. Finish the wizard.
	2.  After the wizard finishes, edit the settings of the virtual machine and make any other changes necessary to install Windows and your programs, such as the number of virtual processors, and then click **OK**.
	4.  Connect to the virtual machine and install Windows Server 2012 R2.
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
	12. On the Confirm installation selections page, select **Restart the destination server automatically if required**, and then click **Yes** on the restart warning.
	13. Click **Install**. The computer will restart.
1.	Install additional features required by your applications, such as the .NET Framework 3.5. To install the features, run the Add Roles and Features Wizard.
7.	Install and configure the programs and applications you want to publish through RemoteApp.

>[AZURE.IMPORTANT]
>
>Install the RDSH role before installing applications to ensure that any issues with application compatibility are discovered before the image is uploaded to RemoteApp.
>
>Make sure a shortcut to your application (**.lnk** file) appears in the **Start** menu for all users (%systemdrive%\ProgramData\Microsoft\Windows\Start Menu\Programs). Also ensure that the icon you see in the **Start** menu is what you want users to see. If not, change it. (You do not *have* to add the application to the Start menu, but it makes it much easier to publish the application in RemoteApp. Otherwise, you have to provide the installation path for the application when you publish the app.)


8.	Perform any additional Windows configurations required by your applications.
9.	Disable the Encrypting File System (EFS). Run the following command at an elevated command window:

		Fsutil behavior set disableencryption 1

	Alternatively, you can set or add the following DWORD value in the registry:

		HKLM\System\CurrentControlSet\Control\FileSystem\NtfsDisableEncryption = 1
9.	If you are building your image inside an Azure virtual machine, rename the **\%windir%\Panther\Unattend.xml** file, as this will block the upload script used later from working. Change the name of this file to Unattend.old so that you will still have the file in case you need to revert your deployment.
10.	Go to Windows Update and install all important updates. You might need to run Windows Update multiple times to get all updates. (Sometimes you install an update, and that update itself requires an update.)
10.	SYSPREP the image. At an elevated command prompt, run the following command:

	**C:\Windows\System32\sysprep\sysprep.exe /generalize /oobe /shutdown**

	**Note:** Do not use the **/mode:vm** switch of the SYSPREP command even though this is a virtual machine.


## Next steps ##
Now that you have your custom template image, you need to upload that image to your RemoteApp collection. Use the information in the following articles to create your collection:


- [How to create a hybrid collection of RemoteApp](remoteapp-create-hybrid-deployment.md)
- [How to create a cloud collection of RemoteApp](remoteapp-create-cloud-deployment.md)
 