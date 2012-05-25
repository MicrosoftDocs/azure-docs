#Create a Virtual Machine Running Linux#

Creating a virtual machine that is running the Linux operating system is easy when you use the Image Gallery in the Windows Azure Management Portal. This guide assumes that you have no prior experience using Windows Azure. In less than 20 minutes, you can create a virtual machine running the Linux operating system in the cloud that you can access and customize.

You will learn:

- [What is a virtual machine in Windows Azure] []
- [How to create a custom virtual machine running the Linux operating system by using the Management Portal] []
- [How to log on to the virtual machine after you create it] []
- [How to attach a data disk to the new virtual machine] []
- [How to set up communication with the virtual machine] []

## <a id="virtualmachine"> </a>What is a virtual machine in Windows Azure ##

A virtual machine in Windows Azure is a server in the cloud that you can control and manage. After you create a virtual machine in Windows Azure, you can delete and recreate it whenever you need to, and you can access the virtual machine just as you do with a server in your office. Virtual hard disk (VHD) files are used to create a virtual machine. The following types of VHDs are used for a virtual machine:

- **Image** - A VHD that is used as a template to create a new virtual machine. An image is a template because it doesn’t have specific settings like a running virtual machine, such as the computer name and user account settings. If you create a virtual machine using an image, an operating system disk is automatically created for the new virtual machine.
- **Disk** - A VHD that can be booted and mounted as a running version of an operating system. A disk is a runnable version of an image. Any VHD that is attached to virtualized hardware and running as part of a service is a disk. After an image is provisioned, it becomes a disk and a disk is always created when you use an image to create a virtual machine.

The following options are available for using images to create a virtual machine:

- Create a virtual machine by using an image that is provided in the Image Gallery of the Windows Azure Management Portal.
- Create and upload a VHD file that contains an image to Windows Azure, and then create a virtual machine using the image. For more information about creating and uploading a custom image, see [Creating and Uploading a Virtual Hard Disk that Contains the Linux Operating System](http://www.windowsazure.com)

## <a id="custommachine"> </a>How to create a custom virtual machine running the Linux operating system by using the Management Portal ##

You use the **From Gallery** method to create a custom virtual machine in the Management Portal. When you create this machine, you can define the size of the machine, the connected resources, the DNS name, and the network connectivity if needed.

1. Sign in to the Windows Azure Management Portal.
On the command bar, click **New**.

	![Create new virtual machine] (../media/create.png)

2. Click **Virtual Machine**, and then click **From Gallery**.

	![Choose to create a virtual machine From Gallery] (../media/createnew.png)

3. The **VM OS Selection** dialog box opens. You can now select an image from the Image Gallery.

	![Select the OS image] (../media/imageselectionlinux.png)

4. Click **Platform Images**, select the **OpenLogic CentOS 6.2** image, and then click the arrow to continue.

	The **VM Configuration** dialog box appears.

	![Specify the details of the machine] (../media/imagedefinelinux.png)

5. In **Virtual Machine Name**, type the name that you want to use for the virtual machine. The name must be 15 characters or less. For this virtual machine, type **MyTestVM1**.

6. In **New User Name**, type the name of the account that you will use to administer the virtual machine. You cannot use root for the user name. For this virtual machine, type **NewUser1**.

7. In **New Password**, type the password that is used for the user account on the virtual machine. For this virtual machine, type **MyPassword1**. In **Confirm Password**, retype the password that you previously entered.

8. In **Size**, select the size that you want to use for the virtual machine. The size that you choose depends on the number of cores that are needed for your application.  For this virtual machine, accept the default of **Extra Small**.

9. Click the arrow to continue.

	The **VM Mode dialog** box appears.

	![Define a standalone virtual machine] (../media/imagestandalonelinux.png)

10. You can connect virtual machines together under a cloud service to provide robust applications, but for this tutorial, you only create a single virtual machine. To do this, select **Standalone Virtual Machine**.

11. A virtual machine that you create is contained in a cloud service. In **DNS Name**, type a name for the cloud service that is created for the virtual machine. The entry can contain from 3-24 lowercase letters and numbers. This value becomes part of the URI that is used to contact the cloud service that the machine belongs to. For this virtual machine, type **MyService1**.

12. You can select a storage account where the VHD file is stored. For this tutorial, accept the default setting of **Use Automatically Generated Storage Account**.

13. In **Region/Affinity Group/Virtual Network**, select **West US** for where the location of the virtual machine.

14. Click the arrow to continue.

	The **VM Options** dialog box appears.

	![Specify the connection options of the machine] (../media/imageoptionslinux.png)

15. The options on this page are only used if you are connecting this virtual machine to other machines or if you are adding the machine to a virtual network. For this virtual machine, you are not creating an availability set or connecting to a virtual network. Click the check mark to create the virtual machine.
    
	The virtual machine is created and operating system settings are configured. When the virtual machine is created, you will see the new virtual machine listed as Running in the Windows Azure Management Portal.

	![Successful virtual machine creation] (../media/vmsuccesslinux.png)

## <a id="logon"> </a>How to log on to the virtual machine after you create it ##

To manage the settings of the virtual machine and the applications that run on the machine, you can use a Secure Shell (SSH) client. To do this, you must install an SSH client on your computer that you want to use to access the virtual machine. There are many SSH client programs that you can choose from. The following are possible choices:

- If you are using a computer that is running a Windows operating system, you might want to use an SSH client such as PuTTY. For more information, see [PuTTY Download](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html).
- If you are using a computer that is running a Linux operating system, you might want to use an SSH client such as OpenSSH. For more information, see [OpenSSH](http://www.openssh.org/).

This tutorial shows you how to use the PuTTY program to access the virtual machine.

1. Find the **Host Name** and **Port information** from the Management Portal. You can find the information that you need from the dashboard of the virtual machine. Click the virtual machine name and look for the **SSH Details** in the **Quick Glance** section of the dashboard.

	![Find SSH details] (../media/SSHdetails.png)

2. Open the PuTTY program.

3. Enter the **Host Name** and the **Port information** that you collected from the dashboard, and then click **Open**.

	![Enter the host name and port information] (../media/putty.png)

4. Log on to the virtual machine using the NewUser1 account that you specified when the machine was created.

	![Log on to the new virtual machine] (../media/sshlogin.png)

	You can now work with the virtual machine just as you would with any other server.

## <a id="attachdisk"> </a>How to attach a data disk to the new virtual machine ##

Your application may need to store data. To set this up, you attach a data disk to the virtual machine that you previously created. The easiest way to do this is to attach an empty data disk to the machine.

1. If you have not already done so, sign in to the Windows Azure Management Portal.

2. Click **Virtual Machines**, and then select the **MyTestVM1** virtual machine that you previously created.

3. On the command bar, click **Attach**, and then click **Attach Empty Disk**.

	![Attach empty disk] (../media/attachdiskwindows.png)

	The **Attach Empty Disk** dialog box appears.

	![Define disk details] (../media/attachnewdisklinux.png)

4. The **Virtual Machine Name**, **Storage Location**, and **File Name** are already defined for you. All you have to do is enter the size that you want for the disk. Type **5** in the **Size** field.

	**Note:** All disks are created from a VHD file in Windows Azure storage. You can provide a name for the VHD file that is added to storage, but the name of the disk is automatically generated.

5. Click the check mark to attach the data disk to the virtual machine.

6. You can verify that the data disk is successfully attached to the virtual machine by looking at the dashboard. Click the name of the virtual machine to display the dashboard.

	The number of disks is now 2 for the virtual machine and the disk that you attached is listed in the **Disks** table.

	![Attach disk success] (../media/attachemptysuccess.png)

The data disk that you just attached to the virtual machine is offline and not initialized after you add it. You must log on to the machine and initialize the disk to use it for storing data.

1. Connect to the virtual machine by using the steps listed in **Log on to the Virtual Machine**.

2. In the SSH window, type the following command, and then enter **MyPassword1** for the account password:

	`sudo grep SCSI /var/log/messages`

	You can find the identifier of the last data disk that was added in the messages that are displayed.

	![Identify disk] (../media/diskmessages.png)

3. In the SSH window, type the following command to create a new device, and then enter **MyPassword1** for the account password:

	`sudo fdisk /dev/sdc`

4. Type **n** to create a new partition.

	![Create new device] (../media/diskpartition.png)

5. Type **p** to make the partition the primary partition, type **1** to make it the first partition, and then type enter to accept the default value for the cylinder.

	![Create partition] (../media/diskcylinder.png)

6. Type **p** to see the details about the disk that is being partitioned.

	![List disk information] (../media/diskinfo.png)

7. Type **w** to write the settings for the disk.

	![Write the disk changes] (../media/diskwrite.png)

8. You must create the file system on the new partition. Type the following command to create the file system, and then enter MyPassword1 for the account password:

	`sudo mkfs -t ext4 /dev/sdc1`

	![Create file system] (../media/diskfilesystem.png)

9. Type the following command to make a directory for mounting the drive, and then enter **MyPassword1** for the account password:

	`sudo mkdir /mnt/datadrive`

10. Type the following command to mount the drive:

	`sudo mount /dev/sdc1 /mnt/datadrive`

	The data disk is now ready to use as **/mnt/datadrive**.

## <a id="endpoints"> </a>How to set up communication with the virtual machine ##

All virtual machines that you create in Windows Azure can automatically communicate with other virtual machines in the same cloud service or virtual network. However, you need to add an endpoint to a machine for other resources on the Internet or other virtual networks to communicate with it. You can associate specific ports and a protocol to endpoints.

1. If you have not already done so, sign in to the Windows Azure Management Portal.

2. Click **Virtual Machines**, and then select the **MyTestVM1** virtual machine that you previously created.

3. Click **Endpoints**.

	![Endpoints] (../media/endpointswindows.png)

4. For this tutorial, you add an endpoint for communicating with the virtual machine using the TCP protocol. Click **Add Endpoint**.

	![Add endpoints] (../media/addendpointstart.png)

	The **Add Endpoint** dialog box appears.

	![Add single endpoint] (../media/addendpointwindows.png)

5. Accept the default selection of **Add Endpoint**, and then click the arrow to continue.

	The **New Endpoint Details** page appears.

	![Define the endpont] (../media/endpointtcpwindows.png)

6. In **Name**, type **MyTCPEndpoint1**.

7. In **Public Port** and **Private Port**, type **80**. These port numbers can be different. The public port is the entry point for communication from outside of Windows Azure and is used by the Windows Azure load balancer. You can use the private port and firewall rules on the virtual machine to redirect traffic in a way that is appropriate for your application. Linux images that are available in the Image Gallery may have their local firewall disabled. If the firewall is disabled, you must open the external endpoint to enable communication with the virtual machine.

8. Click the check mark to create the endpoint.

	You will now see the endpoint listed on the **Endpoints** page.

	![Endpont successfully created] (../media/endpointwindowsnew.png)


[What is a virtual machine in Windows Azure]: #virtualmachine
[How to create a custom virtual machine running the Linux operating system by using the Management Portal]: #custommachine
[How to log on to the virtual machine after you create it]: #logon
[How to attach a data disk to the new virtual machine]: #attachdisk
[How to set up communication with the virtual machine]: #endpoints