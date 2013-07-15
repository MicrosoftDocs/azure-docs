
#Create a Virtual Machine Running Linux 

Creating a virtual machine that is running the Linux operating system is easy when you use the Image Gallery in the Windows Azure Management Portal. This guide assumes that you have no prior experience using Windows Azure. You can create a virtual machine running the Linux operating system in the cloud that you can access and customize.

You will learn:

- [About virtual machines in Windows Azure] []
- [How to create the virtual machine] []
- [How to log on to the virtual machine after you create it] []
- [How to attach a data disk to the new virtual machine] []

**Note**: This tutorial creates a virtual machine that is not connected to a virtual network. If you want a virtual machine to use a virtual network, you must specify the virtual network when you create the virtual machine. For more information about virtual networks, see [Windows Azure Virtual Network Overview](http://go.microsoft.com/fwlink/p/?LinkID=294063).

## <a id="virtualmachine"> </a>About virtual machines in Windows Azure ##

A virtual machine in Windows Azure is a server in the cloud that you can control and manage. After you create a virtual machine in Windows Azure, you can delete and recreate it whenever you need to, and you can access the virtual machine just as you do with a server in your office. Virtual hard disk (VHD) files are used to create a virtual machine. The following types of VHDs are used for a virtual machine:

- **Image** - A VHD that is used as a template to create a new virtual machine. An image is a template because it doesn’t have specific settings like a running virtual machine, such as the computer name and user account settings. If you create a virtual machine using an image, an operating system disk is automatically created for the new virtual machine.
- **Disk** - A disk is a VHD that you can boot and mount as a running version of an operating system. After an image is provisioned, it becomes a disk. A disk is always created when you use an image to create a virtual machine. Any VHD that is attached to virtualized hardware and that is running as part of a service is a disk

The following options are available for using images to create a virtual machine:

- Create a virtual machine by using an image that is provided in the Image Gallery of the Windows Azure Management Portal.
- Create and upload a .vhd file that contains an image to Windows Azure, and then create a virtual machine using the image. For more information about creating and uploading a custom image, see [Creating and Uploading a Virtual Hard Disk that Contains the Linux Operating System](/en-us/manage/linux/common-tasks/upload-a-vhd/).

Each virtual machine resides in a cloud service, either by itself, or grouped with other virtual machines. You can place virtual machines in the same cloud service to enable the virtual machines to communicate with each other, to load-balance network traffic among virtual machines, and to maintain high availability of the machines. For more information about cloud services and virtual machines, see the "Execution Models" section in [Introducing Windows Azure](http://go.microsoft.com/fwlink/p/?LinkId=311926).

## <a id="custommachine"> </a>How to create the virtual machine ##

You use the **From Gallery** method to create a custom virtual machine in the Management Portal. This method provides more options for configuring the virtual machine when you create it, such as the connected resources, the DNS name, and the network connectivity if needed.

1. Sign in to the Windows Azure [Management Portal](http://manage.windowsazure.com).
On the command bar, click **New**.

2. Click **Virtual Machine**, and then click **From Gallery**.

3. From **Platform Images**, select the one of the images, and then click the arrow to continue.

4. If multiple versions of the image are available, in **Version Release Date**, pick the version you want to use.

5. In **Virtual Machine Name**, type the name that you want to use. For this virtual machine, type **MyTestVM1**.

6. In **Size**, select the size that you want to use for the virtual machine. The size that you choose depends on the number of cores that are needed for your application.  For this virtual machine, choose the smallest available size.

7. In **New User Name**, type the name of the account that you will use to administer the virtual machine. You cannot use root for the user name. For this virtual machine, type **NewUser1**.

8. Under Authentication, check **Provide a Password**. Then, provide the required information.

9. Click the arrow to continue.

10. You can place virtual machines together in the cloud service, but for this tutorial, you're only creating a single virtual machine. To do this, select **Create a new cloud service**.

11. In **Cloud Service DNS Name**, type a name that uses between 3 and 24 lowercase letters and numbers. This name becomes part of the URI that is used to contact the virtual machine through the cloud service. For this virtual machine, type **MyService1**.

12. In **Region/Affinity Group/Virtual Network**, select where you want to locate the virtual machine.

13. You can select a storage account where the VHD file is stored. For this tutorial, accept the default setting of **Use an Automatically Generated Storage Account**.

14. Under **Availability Set**, for the purposes of this tutorial use the default setting of **None**. Click the check mark to create the virtual machine.

15. Click the arrow to continue.

16. Under Endpoints, a new endpoint is automatically created to allow Secure Shell (SSH) connections to the virtual machine. (Endpoints allow resources on the Internet or other virtual networks to communicate with a virtual machine.) You can add more endpoints now, or create them later. For instructions on creating them later, see [How to Set Up Communication with a Virtual Machine](http://www.windowsazure.com/en-us/manage/linux/how-to-guides/setup-endpoints/). 
  
After the virtual machine and cloud service are created, the Management Portal lists the new virtual machine under **Virtual Machines** and lists the cloud service under **Cloud Services**. Both the virtual machine and the cloud service are started automatically.

![Successful virtual machine creation] (../../itpro/linux/media/vmsuccesslinux.png)

## <a id="logon"> </a>How to log on to the virtual machine after you create it ##

To manage the settings of the virtual machine and the applications that run on the machine, you can use an SSH client. To do this, you must install an SSH client on your computer that you want to use to access the virtual machine. There are many SSH client programs that you can choose from. The following are possible choices:

- If you are using a computer that is running a Windows operating system, you might want to use an SSH client such as PuTTY. For more information, see [PuTTY Download](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html).
- If you are using a computer that is running a Linux operating system, you might want to use an SSH client such as OpenSSH. For more information, see [OpenSSH](http://www.openssh.org/).

This tutorial shows you how to use the PuTTY program to access the virtual machine.

1. Find the **Host Name** and **Port information** from the Management Portal. You can find the information that you need from the dashboard of the virtual machine. Click the virtual machine name and look for the **SSH Details** in the **Quick Glance** section of the dashboard.

	![Find SSH details] (../../itpro/linux/media/SSHdetails.png)

2. Open the PuTTY program.

3. Enter the **Host Name** and the **Port information** that you collected from the dashboard, and then click **Open**.

	![Enter the host name and port information] (../../itpro/linux/media/putty.png)

4. Log on to the virtual machine using the NewUser1 account that you specified when the machine was created.

	![Log on to the new virtual machine] (../../itpro/linux/media/sshlogin.png)

	You can now work with the virtual machine just as you would with any other server.

## <a id="attachdisk"> </a>How to attach a data disk to the new virtual machine ##

Your application may need to store data. To set this up, you attach a data disk to the virtual machine that you previously created. The easiest way to do this is to attach an empty data disk to the machine.

1. If you have not already done so, sign in to the Windows Azure Management Portal.

2. Click **Virtual Machines**, and then select the **MyTestVM1** virtual machine that you previously created.

3. On the command bar, click **Attach**, and then click **Attach Empty Disk**.

	![Attach empty disk] (../../itpro/linux/media/attachdiskwindows.png)

	The **Attach Empty Disk** dialog box appears.

	![Define disk details] (../../itpro/linux/media/attachnewdisklinux.png)

4. The **Virtual Machine Name**, **Storage Location**, and **File Name** are already defined for you. All you have to do is enter the size that you want for the disk. Type **5** in the **Size** field.

	**Note:** All disks are created from a VHD file in Windows Azure storage. You can provide a name for the VHD file that is added to storage, but the name of the disk is automatically generated.

5. Click the check mark to attach the data disk to the virtual machine.

6. You can verify that the data disk is successfully attached to the virtual machine by looking at the dashboard. Click the name of the virtual machine to display the dashboard.

	The number of disks is now 2 for the virtual machine and the disk that you attached is listed in the **Disks** table.

	![Attach disk success] (../../itpro/linux/media/attachemptysuccess.png)

The data disk that you just attached to the virtual machine is offline and not initialized after you add it. You must log on to the machine and initialize the disk to use it for storing data.

1. Connect to the virtual machine by using the steps listed above in **How to log on to the virtual machine after you create it**.

2. In the SSH window, type the following command, and then enter **MyPassword1** for the account password:

	`sudo grep SCSI /var/log/messages`

	You can find the identifier of the last data disk that was added in the messages that are displayed.

	![Identify disk] (../../itpro/linux/media/diskmessages.png)

3. In the SSH window, type the following command to create a new device, and then enter **MyPassword1** for the account password:

	`sudo fdisk /dev/sdc`

4. Type **n** to create a new partition.

	![Create new device] (../../itpro/linux/media/diskpartition.png)

5. Type **p** to make the partition the primary partition, type **1** to make it the first partition, and then type enter to accept the default value for the cylinder.

	![Create partition] (../../itpro/linux/media/diskcylinder.png)

6. Type **p** to see the details about the disk that is being partitioned.

	![List disk information] (../../itpro/linux/media/diskinfo.png)

7. Type **w** to write the settings for the disk.

	![Write the disk changes] (../../itpro/linux/media/diskwrite.png)

8. You must create the file system on the new partition. Type the following command to create the file system, and then enter MyPassword1 for the account password:

	`sudo mkfs -t ext4 /dev/sdc1`

	![Create file system] (../../itpro/linux/media/diskfilesystem.png)

9. Type the following command to make a directory for mounting the drive, and then enter **MyPassword1** for the account password:

	`sudo mkdir /mnt/datadrive`

10. Type the following command to mount the drive:

	`sudo mount /dev/sdc1 /mnt/datadrive`

	The data disk is now ready to use as **/mnt/datadrive**.


##Next Steps 

To learn more about Linux on Windows Azure, see the following articles:

- [Introduction to Linux on Windows Azure](/en-us/manage/linux/tutorials/intro-to-linux/)

- [How to use the Windows Azure Command-Line Tools for Mac and Linux](http://www.windowsazure.com/en-us/manage/linux/how-to-guides/command-line-tools/)


[Next Steps]: #next
[About virtual machines in Windows Azure]: #virtualmachine
[How to create the virtual machine]: #custommachine
[How to log on to the virtual machine after you create it]: #logon
[How to attach a data disk to the new virtual machine]: #attachdisk
