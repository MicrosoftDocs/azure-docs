
Follow these steps to attach a data disk:

1. In the [Azure Management Portal][AzurePreviewPortal], click **Virtual Machines** and then select the virtual machine you just created (**testwinvm**).

2. On the command bar click **Attach** and then click **Attach Empty Disk**.
	
	The **Attach empty disk to virtual machine** dialog box appears.


3. The **Virtual Machine Name**, **Storage Location**, and **File Name** are already defined for you. All you have to do is enter the size that you want for the disk. Type **5** in the **Size** field.

	![Attach Empty Disk][Image2]

	**Note:** All disks are created from a VHD file in Azure storage. You can provide a name for the VHD file that you add to storage, but Azure generates the name of the disk automatically.

4. Click the check mark to attach the data disk to the virtual machine.

5. Click the name of the virtual machine to display the dashboard; this lets you verify that the data disk was successfully attached to the virtual machine.

	The number of disks is now 2 for the virtual machine. The disk that you attached is listed in the Disks table.

	![Attach Empty Disk][Image3]

	After you attach the data disk to the virtual machine, the disk is offline and not initialized. You have to log on to the virtual machine and initialize the disk before you can use it to store data.

##Connect to the Virtual Machine Using Remote Desktop and Complete Setup
1. After the virtual machine is provisioned, on the Management Portal, click **Virtual Machines**, and then click your new virtual machine. Information about your virtual machine is presented.	

2. At the bottom of the page, click **Connect**. Open the .rpd file using the Windows Remote Desktop program (*%windir%\system32\mstsc.exe*).	

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

[Image2]: ./media/attach-data-disk-windows-server-2008-vm-in-portal/AttachDataDiskWinVM2.png
[Image3]: ./media/attach-data-disk-windows-server-2008-vm-in-portal/AttachDataDiskWinVM3.png
[Image4]: ./media/attach-data-disk-windows-server-2008-vm-in-portal/servermanager.png
[Image5.0]: ./media/attach-data-disk-windows-server-2008-vm-in-portal/initializedisk0.png

[Image6]: ./media/attach-data-disk-windows-server-2008-vm-in-portal/initializediskvolume.png
[Image7]: ./media/attach-data-disk-windows-server-2008-vm-in-portal/initializesuccess.png
