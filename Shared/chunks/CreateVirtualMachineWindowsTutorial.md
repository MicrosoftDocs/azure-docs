
# Create a Virtual Machine Running Windows Server #

It's easy to create a virtual machine that is running the Windows Server operating system when you use the Image Gallery in the Windows Azure Management Portal. This tutorial will teach you how to create a virtual machine running Windows Server in the cloud that you can then access and customize. You don't need prior experience with Windows Azure to use this tutorial. 

You will learn:

- [About virtual machines in Windows Azure] []
- [How to create the virtual machine] []
- [How to log on to the virtual machine after you create it] []
- [How to attach a data disk to the new virtual machine] []

**Note:** This tutorial creates a virtual machine that is not connected to a virtual network. If you want a virtual machine to use a virtual network, you must specify the virtual network when you create the virtual machine. For more information about virtual networks, see [Windows Azure Virtual Network Overview](http://go.microsoft.com/fwlink/p/?LinkID=294063).

## <a id="virtualmachine"> </a>About virtual machines in Windows Azure ##

A virtual machine in Windows Azure is a server in the cloud that you can control and manage. After you create a virtual machine in Windows Azure, you can delete and re-create it whenever you need to, and you can access the virtual machine just like any other server. Virtual hard disks (.vhd files) are used to create a virtual machine. You can use the following types of virtual hard disks to create a virtual machine:

- **Image** - An image is a template that you use to create a new virtual machine. An image doesn’t have specific settings like a running virtual machine, such as the computer name and user account settings. If you use an image to create a virtual machine, an operating system disk is automatically created for the new virtual machine.
- **Disk** - A disk is a VHD that you can boot and mount as a running version of an operating system. After an image is provisioned, it becomes a disk. A disk is always created when you use an image to create a virtual machine. Any VHD that is attached to virtualized hardware and that is running as part of a service is a disk. 

You can use the following options to create a virtual machine from an image:

- Create a virtual machine by using a platform image available from the Windows Azure Management Portal.
- Create and upload a .vhd file that contains an image to Windows Azure, and then  use the uploaded image to create a virtual machine. For instructions, see [Creating and Uploading a Virtual Hard Disk that Contains the Windows Server Operating System](/en-us/manage/windows/common-tasks/upload-a-vhd/).

Each virtual machine resides in a cloud service, either by itself, or grouped with other virtual machines. You can place virtual machines in the same cloud service to enable the virtual machines to communicate with each other, to load-balance network traffic among virtual machines, and to maintain high availability of the machines. For more information about cloud services and virtual machines, see the "Execution Models" section in [Introducing Windows Azure](http://go.microsoft.com/fwlink/p/?LinkId=311926).

## <a id="custommachine"> </a>How to create the virtual machine##

This tutorial shows you how to use the **From Gallery** method in the Management Portal to create a custom virtual machine. This method provides more options than the **Quick Create** method does for configuring the virtual machine when you create it, such as the connected resources, the DNS name, and the network connectivity if needed.


1. Sign in to the Windows Azure [Management Portal](http://manage.windowsazure.com).

2. On the command bar, click **New**.

3. Click **Virtual Machine**, and then click **From Gallery**.
	
4. Click **Platform Images**, select one of the images, and then click the arrow to continue.
	
5. If multiple versions of the image are available, in **Version Release Date**, pick the version you want to use.

6. In **Virtual Machine Name**, type the name that you want to use for the virtual machine. For this virtual machine, type **MyTestVM1**.

7. In **Size**, select the size of the virtual machine. The size you should select depends on the number of cores required to run your application. For this virtual machine, choose the smallest available size.

8. In **New User Name**, type a name for the administrative account that you want to use to manage the server. For this virtual machine, type **MyTestVM1Admin**.

9. In **New Password**, type a strong password for the administrative account on the virtual machine. In **Confirm Password**, retype the password.

10. Click the arrow to continue.

11. You can place virtual machines together under a cloud service to provide robust applications, but for this tutorial, you only create a single virtual machine. To do this, select **Create a new cloud service**.

12. In **Cloud Service DNS Name**, type a name that uses between 3 and 24 lowercase letters and numbers. This name becomes part of the URI that is used to contact the virtual machine through the cloud service. For this virtual machine, type **MyService1**.

13. In **Region/Affinity Group/Virtual Network**, select where you want to locate the virtual machine.

14. You can select a storage account where the VHD file is stored. For this tutorial, accept the default setting of **Use an Automatically Generated Storage Account**.

15. Under **Availability Set**, for the purposes of this tutorial use the default setting of **None**. 

16. Click the arrow to continue.

17. Under Endpoints, new endpoints are created to allow connections for Remote Desktop and Windows PowerShell remoting. (Endpoints allow resources on the Internet or other virtual networks to communicate with a virtual machine.) You can add more endpoints now, or create them later. For instructions on creating them later, see [How to Set Up Communication with a Virtual Machine](http://www.windowsazure.com/en-us/manage/windows/how-to-guides/setup-endpoints/).

18. Click the check mark to create the virtual machine.
    
	After the virtual machine and cloud service are created, the Management Portal lists the new virtual machine under **Virtual Machines** and lists the cloud service under **Cloud Services**. Both the virtual machine and the cloud service are started automatically.


	![Successful virtual machine creation] (../../itpro/windows/media/vmsuccesswindows.png)

## <a id="logon"> </a>How to log on to the virtual machine after you create it ##

You can log on to the virtual machine that you created to manage both its settings and the applications that are running on it.

1. Sign in to the Windows Azure [Management Portal](http://manage.windowsazure.com).

2. Click **Virtual Machines**, and then select the **MyTestVM1** virtual machine.

3. On the command bar, click **Connect**.

	![Connect to the virtual machine] (../../itpro/windows/media/connectwindows.png)

4. Click **Open** to use the remote desktop protocol file that was automatically created for the virtual machine.

5. Click **Connect**.

	![Continue with connecting] (../../itpro/windows/media/connectpublisher.png)

6. In the password box, type the user name and password that you specified when you created the virtual machine, and then click **OK**.

7. Click **Yes** to verify the identity of the virtual machine.

	![Verify the identity of the machine] (../../itpro/windows/media/connectverify.png)

	You can now work with the virtual machine just like you would a server in your office.

## <a id="attachdisk"> </a>How to attach a data disk to the new virtual machine ##

Your application might need to store data. To set this up, attach a data disk to the virtual machine. The easiest way to do this is to attach an empty data disk to the virtual machine.

1. Sign in to the Windows Azure [Management Portal](http://manage.windowsazure.com).

1. Click **Virtual Machines**, and then select the **MyTestVM1** virtual machine.

2. On the command bar, click **Attach**, and then click **Attach Empty Disk**.

	![Attach empty disk] (../../itpro/windows/media/attachdiskwindows.png)

	The **Attach Empty Disk** dialog box appears.

3. The **Virtual Machine Name**, **Storage Location**, **File Name**, and **Host Cache Preference** are already defined for you. All you have to do is enter the size that you want for the disk. Type **5** in the **Size** field.

	**Note:** All disks are created from a VHD file in Windows Azure storage. You can provide a name for the VHD file that is added to storage, but Windows Azure generates the name of the disk automatically.

4. Click the check mark to attach the data disk to the virtual machine.

5. Click the name of the virtual machine. This displays the dashboard so you can verify that the data disk was successfully attached to the virtual machine.

	The virtual machine now has 2 disks. The disk that you attached is listed in the **Disks** table.

	![Attach empty disk] (../../itpro/windows/media/attachemptysuccess.png)

After you attach the data disk to the virtual machine, the disk is offline and not initialized. Before you can use it to store data, you'll need to log on to the virtual machine and initialize the disk.

1. Connect to the virtual machine by using the steps in the previous section, **How to log on to the virtual machine after you create it**.

2. After you log on to the virtual machine, open **Server Manager**. In the left pane, expand **Storage**, and then click **Disk Management**.

	![Initialize the disk in Server Manager] (../../itpro/windows/media/servermanager.png)

3. Right-click **Disk 2**, and then click **Initialize Disk**.

	![Start initialization] (../../itpro/windows/media/initializedisk.png)

4. Click **OK** to start the initialization process.

5. Right-click the space allocation area for Disk 2, click **New Simple Volume**, and then finish the wizard with the default values.

	![Create the volume] (../../itpro/windows/media/initializediskvolume.png)

	The disk is now online and ready to use with a new drive letter.

	![Initialization success] (../../itpro/windows/media/initializesuccess.png)



##Next Steps 

To learn more about configuring Windows virtual machines on Windows Azure, see the following articles:

-[How to Connect Virtual Machines in a Cloud Service](http://www.windowsazure.com/en-us/manage/windows/how-to-guides/connect-to-a-cloud-service/)

-[Manage the Availability of Virtual Machines](http://www.windowsazure.com/en-us/manage/windows/common-tasks/manage-vm-availability/)

[About virtual machines in Windows Azure]: #virtualmachine
[How to create the virtual machine]: #custommachine
[How to log on to the virtual machine after you create it]: #logon
[How to attach a data disk to the new virtual machine]: #attachdisk
[How to set up communication with the virtual machine]: #endpoints