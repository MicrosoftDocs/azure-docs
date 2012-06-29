Follow these steps to attach a data disk:

1. In the [Windows Azure (Preview) Management Portal][AzurePreviewPortal], click **Virtual Machines** and then select the virtual machine you just created (**testwinvm**).

2. On the command bar click **Attach** and then click **Attach Empty Disk**.

	![Attach Empty Disk][Image1]

	The **Attach Empty Disk** dialog box appears.


3. The **Virtual Machine Name**, **Storage Location**, and **File Name** are already defined for you. All you have to do is enter the size that you want for the disk. Type **5** in the **Size** field.

	![Attach Empty Disk][Image2]

	**Note:** All disks are created from a VHD file in Windows Azure storage. You can provide a name for the VHD file that you add to storage, but Windows Azure generates the name of the disk automatically.

4. Click the check mark to attach the data disk to the virtual machine.

5. Click the name of the virtual machine to display the dashboard; this lets you verify that the data disk was successfully attached to the virtual machine.

	The number of disks is now 2 for the virtual machine. The disk that you attached is listed in the Disks table.

	![Attach Empty Disk][Image3]

	After you attach the data disk to the virtual machine, the disk is offline and not initialized. You have to log on to the virtual machine and initialize the disk before you can use it to store data.

##Connect to the Virtual Machine Using Remote Desktop and Complete Setup
1. After the virtual machine is provisioned, on the Management Portal, click on **Virtual Machines**, and the click on your new virtual machine. Information about your virtual machine is presented.	

2. At the bottom of the page, click **Connect**. Open the rpd file using the Windows Remote Desktop program (*%windir%\system32\mstsc.exe*).	

3. At the **Windows Security** dialog box, provide the password for the **Administrator** account. (You might be asked to verify the credentials of the virtual machine.) The first time you log on to this virtual machine, several processes may need to complete, including setup of your desktop, Windows updates, and completion of the Windows initial configuration tasks. Once you are connected to the virtual machine with Windows Remote Desktop, the virtual machine works like any other computer.

4. After you log on to the virtual machine, open **Server Manager**. In the left pane, expand **Storage**, and then click **Disk Management**.

	![Server Manager][Image4]

5. The **Initalize Disk** window appears.  Click **OK**.

	![Initialize Disk][Image5.0]

6. Right-click the space allocation area for Disk 2, click **New Simple Volume**, and then finish the wizard with the default values.

	![New Simple Volume][Image6]

	The disk is now online and ready to use with a new drive letter.

	![Initialize Success][Image7]


[AzurePreviewPortal]: http://manage.windowsazure.com

[Image1]: ../../Shared/Media/AttachDataDiskWinVM.png
[Image2]: ../../Shared/Media/AttachDataDiskWinVM2.png
[Image3]: ../../Shared/Media/AttachDataDiskWinVM3.png
[Image4]: ../../Shared/Media/servermanager.png
[Image5.0]: ../../Shared/Media/initializedisk0.png
[Image5]: ../../Shared/Media/initializedisk.png
[Image6]: ../../Shared/Media/initializediskvolume.png
[Image7]: ../../Shared/Media/initializesuccess.png