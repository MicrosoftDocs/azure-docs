
# Create a Virtual Machine Running Windows Server #

It's easy to create a virtual machine that is running the Windows Server operating system when you use the Image Gallery in the Windows Azure Management Portal. This tutorial will teach you how to create a virtual machine running Windows Server in the cloud that you can then access and customize. You don't need prior experience with Windows Azure to use this tutorial. 

You will learn:

- [What a virtual machine is in Windows Azure] []
- [How to use the Management Portal to create a custom virtual machine running Windows Server] []
- [How to log on to the virtual machine after you create it] []
- [How to attach a data disk to the new virtual machine] []
- [How to set up communication with the virtual machine] []

**Note:** This tutorial creates a virtual machine that is not connected to a virtual network. If you want a virtual machine to use a virtual network, you must specify the virtual network when you create the virtual machine. For more information about virtual networks, see [Windows Azure Virtual Network Overview](http://go.microsoft.com/fwlink/p/?LinkID=294063).

## <a id="virtualmachine"> </a>What a virtual machine is in Windows Azure ##

A virtual machine in Windows Azure is a server in the cloud that you can control and manage. After you create a virtual machine in Windows Azure, you can delete and re-create it whenever you need to, and you can access the virtual machine just like any other server. Virtual hard disks (.vhd files) are used to create a virtual machine. You can use the following types of virtual hard disks to create a virtual machine:

- **Image** - An image is a template that you use to create a new virtual machine. An image doesn’t have specific settings like a running virtual machine, such as the computer name and user account settings. If you use an image to create a virtual machine, an operating system disk is automatically created for the new virtual machine.
- **Disk** - A disk is a VHD that you can boot and mount as a running version of an operating system. After an image is provisioned, it becomes a disk. A disk is always created when you use an image to create a virtual machine. Any VHD that is attached to virtualized hardware and that is running as part of a service is a disk. 

You can use the following options to create a virtual machine from an image:

- Create a virtual machine by using a platform image available from the Windows Azure Management Portal.
- Create and upload a .vhd file that contains an image to Windows Azure, and then  use the uploaded image to create a virtual machine. For instructions, see [Creating and Uploading a Virtual Hard Disk that Contains the Windows Server Operating System](/en-us/manage/windows/common-tasks/upload-a-vhd/).

## <a id="custommachine"> </a>How to use the Management Portal to create a custom virtual machine running Windows Server ##

This tutorial shows you how to use the **From Gallery** method in the Management Portal to create a custom virtual machine. This method provides more options than the **Quick Create** method does for configuring the virtual machine when you create it, such as the connected resources, the DNS name, and the network connectivity if needed.


1. Sign in to the Windows Azure [Management Portal](http://manage.windowsazure.com).
2. On the command bar, click **New**.

	![Create new virtual machine] (../../itpro/windows/media/create.png)

3. Click **Virtual Machine**, and then click **From Gallery**.
	
	![Create virtual machine from gallery] (../../itpro/windows/media/createnew.png)

	The **Select the virtual machine operating system** dialog box appears. 

	
4. Click **Platform Images**, select the **Windows2012 image** image, and then click the arrow to continue.

	The **Virtual machine configuration** dialog box appears.
	
5. In **Virtual Machine Name**, type the name that you want to use for the virtual machine. For this virtual machine, type **MyTestVM1**.

6. In **New User Name**, type a name for the administrative account that you want to use to manage the server. For this virtual machine, type **MyTestVM1Admin**.

7. In **New Password**, type a strong password for the administrative account on the virtual machine. In **Confirm Password**, retype the password.

8. In **Size**, select the size of the virtual machine. The size that you select depends on the number of cores that are needed for your application. 

9. Click the arrow to continue.

	The **Virtual machine mode** dialog box appears.

10. Although you can connect virtual machines within a cloud service to provide robust applications, in this tutorial you are creating a single virtual machine. So, select **Stand-alone Virtual Machine**.

11. A virtual machine that you create is contained in a cloud service. In **DNS Name**, type a name for the cloud service that is created for the virtual machine. The name can contain from 3 through 24 lowercase letters and numbers. This name becomes part of the URI that is used to contact the cloud service that the virtual machine belongs to. For this virtual machine, type **MyService1**.

12. Select the storage account for the VHD file. For this tutorial, select **Use an automatically generated storage account**.

13. In **Region/Affinity Group/Virtual Network**, select any available location for the virtual machine. Click the arrow to continue.

14. The **Virtual machine options** dialog box appears. The options on this page apply only if you are connecting this virtual machine to other virtual machines or if you are adding the virtual machine to a virtual network. For this virtual machine, you are not creating an availability set or connecting to a virtual network. Click the check mark to create the virtual machine.
    
	Windows Azure creates the virtual machine and configures the operating system settings. After Windows Azure creates the virtual machine, it is listed as **Running** in the Windows Azure Management Portal.

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

## <a id="endpoints"> </a>How to set up communication with the virtual machine ##

All virtual machines that you create in Windows Azure can automatically communicate with other virtual machines in the same cloud service or virtual network. However, you need to add an endpoint to a virtual machine for other resources on the Internet or other virtual networks to communicate with it. You can associate specific ports and a protocol to endpoints.

1. Sign in to the Windows Azure [Management Portal](http://manage.windowsazure.com).

2. Click **Virtual Machines**, and then select the **MyTestVM1** virtual machine.

3. Click **Endpoints**.

	![Add endponts] (../../itpro/windows/media/endpointswindows.png)

4. For this tutorial, you will add an endpoint for communicating with the virtual machine using the TCP protocol. Click **Add Endpoint**.

	![Endpoints] (../../itpro/windows/media/addendpointstart.png)

	The **Add Endpoint** dialog box appears.

5. Accept the default selection of **Add Endpoint**, and then click the arrow to continue.

	The **New Endpoint Details** dialog box appears.

	![Define the endpont] (../../itpro/windows/media/endpointtcpwindows.png)

6. In the Name field, type **MyTCPEndpoint1**.

7. In the **Public Port** and **Private Port** fields, type **80**. These port numbers can be different. The public port is the entry point for communication from outside Windows Azure. The Windows Azure load balancer uses the public port. You can use the private port and firewall rules on the virtual machine to redirect traffic in a way that is appropriate for your application.

8. Click the check mark to create the endpoint.

	You will now see the endpoint listed on the **Endpoints** page.

	![Endpont successfully created] (../../itpro/windows/media/endpointwindowsnew.png)

[What a virtual machine is in Windows Azure]: #virtualmachine
[How to use the Management Portal to create a custom virtual machine running Windows Server]: #custommachine
[How to log on to the virtual machine after you create it]: #logon
[How to attach a data disk to the new virtual machine]: #attachdisk
[How to set up communication with the virtual machine]: #endpoints