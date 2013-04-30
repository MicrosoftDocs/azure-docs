# How to create and configure a virtual machine in Windows Azure #

To use this feature, please sign up for the [Windows Azure Preview Beta Program](http://www.windowsazure.com). 

This guide shows you how to create and configure a virtual machine in Windows Azure by using the Windows Azure Management Portal.

## Table of Contents ##

- [What is a virtual machine in Windows Azure] []
- [How to quickly create a virtual machine] []
- [How to create a custom virtual machine] []
- [How to connect virtual machines in a cloud service] []
- [How to log on to a virtual machine] []
- [How to attach a data disk to a virtual machine] []
- [How to set up communication with a virtual machine] []
- [How to capture an image of a virtual machine] []
- [Next steps] []

## <a id="virtualmachine"> </a>What is a virtual machine in Windows Azure ##

A virtual machine in Windows Azure is a server in the cloud that you can control and manage. After you create a virtual machine in Windows Azure, you can delete and recreate it whenever you need to, and you can log on to the virtual machine just as you do with any other server. Virtual hard disk (VHD) files are used to create a virtual machine. The following types of VHDs are used for a virtual machine in Windows Azure:

- **Image -** A VHD that is used as a template to create a new virtual machine. An image is a template because it doesn’t have specific settings like a running virtual machine, such as the computer name and user account settings. If you create a virtual machine using an image, an operating system disk is automatically created for the new virtual machine.
- **Disk -** A VHD that can be booted and mounted as a running version of an operating system. A disk is a runnable version of an image. Any VHD that is attached to virtualized hardware and running as part of a service is a disk. After an image is provisioned, it becomes a disk and a disk is always created when you use an image to create a virtual machine.

The following options are available for using images to create a virtual machine:

- Create a virtual machine by using an image that is provided in the Image Gallery of the Windows Azure Management Portal.
- Create and upload a VHD file that contains an image to Windows Azure, and then create a virtual machine using the image. For more information about creating and uploading a custom image, see the following topics:
<UL>
<LI>[Creating and Uploading a Virtual Hard Disk that Contains the Linux Operating System](http://)</LI>
<LI>[Creating and Uploading a Virtual Hard Disk that Contains the Windows Server Operating System](http://)</LI>
</UL>

## <a id="quickcreate"> </a>How to quickly create a virtual machine ##

You use the **Quick Create** method to quickly create a virtual machine in the Management Portal. When you create this machine, all you need to provide is the name of the machine, the image that is used to create the machine, and the password for the user account that is used to manage the machine.

1. Sign in to the Windows Azure Management Portal.

2. On the command bar, click **New**.

	![Create a new virtual machine] (../media/create.png)

3. Click **Virtual Machines**, and then click **Quick Create**.

	![Quick Create a new virtual machine] (../media/createquick.png)

	The **Create a New Virtual Machine** dialog box appears.

	![Enter the details of the new virtual machine] (../media/newvm.png)

4. Enter the following information for the new virtual machine:

	- **DNS Name** – the name that is used for both the virtual machine that is created and the cloud service that contains the virtual machine.
	- **Image** – the platform image that is used to create the virtual machine. If you want to create a virtual machine running the Linux operating system, you must use the **From Gallery** method to create the machine.
	- **Account Password** - enter and confirm a password for the Administrator account. You use this account to manage the virtual machine.
	- **Location** – the region that contains the virtual machine. 

5. Click the check mark to create the virtual machine.

	**Note:** A storage account is created to contain this virtual machine.  Only one storage account exists for holding these virtual machines, if it exists, it is used to for additional machines. 

	You will see the new virtual machine listed in on the **Virtual Machines** page.


## <a id="customcreate"> </a>How to create a custom virtual machine ##

You can create a custom virtual machine by providing advanced options, such as size, connected resources, DNS name, and network connection. You must use this option if you want to connect virtual machines or if you want to use a custom image to create the machine. 

Before you create a virtual machine, you should decide how it will be used. If you have a need for only one virtual machine in your application, you choose to create a stand-alone virtual machine. If you need multiple virtual machines in the same cloud service that can communicate with each other and act as a load-balanced application, you choose to connect the new virtual machine to an existing virtual machine.

1. Sign  in to the Windows Azure Management Portal.

2. On the command bar, click **New**.

	![Create a new virtual machine] (../media/create.png)

3. Click **Virtual Machine**, and then click **From Gallery**.

	![Create a new custom virtual machine] (../media/createnew.png)

	The **VM OS Selection** dialog box appears. You can now select an image from the Image Gallery.

	![Select the image] (../media/imageselectionwindows.png)

4. Click **Platform Images**, select the platform image that you want to use, and then click the arrow to continue.

	The **VM Configuration** dialog box appears.

	![Select the image] (../media/imagedefinewindows.png)

5. In **Virtual Machine Name**, type the name that you want to use for the virtual machine.

6. In **New Password**, type the password that is used for the Administrator account on the virtual machine. In **Confirm Password**, retype the password that you previously entered.

7. In **Size**, select the size that you want to use for the virtual machine. The size that you select depends on the number of cores that are needed for your application.

8. Click the arrow to continue.

	The **VM Mode** dialog box appears.

	![Define the stand-alone virtual machine] (../media/imagestandalonewindows.png)

9. Choose whether the virtual machine is a single stand-alone machine or whether it is part of a cloud service that contains multiple connected machines. For more information about connecting virtual machines, see **How to connect virtual machines in a cloud service**.

10. If you are creating a stand-alone virtual machine, in **DNS Name**, type a name for the cloud service that is created for the machine. The entry can contain from 3-24 lowercase letters and numbers.

11. In **Storage Account**, select a storage account where the VHD file is stored, or you can select to have a storage account automatically created. Only one storage account per region is automatically created. All other virtual machines that you create with this setting are located in this storage account. You are limited to 20 storage accounts.

12. In **Region/Affinity Group/Virtual Network**, select region, affinity group, or virtual network that you want to contain the virtual machine. For more information about affinity groups, see [About Affinity Groups for Virtual Network](http://).

13. Click the arrow to continue.

	The **VM Options** dialog box appears.

	![Define the virtual machine options] (../media/imageoptionswindows.png)

14. (Optional) In **Availability Set**, select **Create availability set**. When a virtual machine is a member of an availability set, it is deployed to different fault domains as other virtual machines in the set. Multiple virtual machines in an availability set make sure that your application is available during network failures, local disk hardware failures, and any planned downtime.

15. If you are creating an availability set, enter the name for the availability set.

16. (Optional) Choose the subnet that the virtual machine should be a member of. For more information about adding a virtual machine to a network, see [Create a Virtual Machine into a Virtual Network](http://).

17. Click the arrow to create the virtual machine.

	![Custom virtual machine creation successful] (../media/vmsuccesswindows.png)

## <a id="connectmachines"> </a>How to connect virtual machines in a cloud service ##

When you create a virtual machine, a cloud service is automatically created to contain the machine. You can create multiple virtual machines under the same cloud service to enable the machines to communicate with each other, to load-balance between virtual machines, and to maintain high availability of the machines. 

You must first create a virtual machine with a new cloud service, and then you can connect additional machines with the first machine under the same cloud service. 

1. Create a virtual machine using the steps in [How to create a custom virtual machine] [].

2. After you create the first custom virtual machine, on the command bar, click **New**.

	![Create a new virtual machine] (../media/create.png)

3. Click **Virtual Machine**, and then click **From Gallery**.

	![Create a custom virtual machine] (../media/createnew.png)

	The **VM OS Selection** dialog box appears. You can now select an image from the Image Gallery.

	![Select the image] (../media/imageselectionwindows.png)

4. Click **Platform Images**, select the platform image that you want to use, and then click the arrow to continue.

	The **VM Configuration** dialog box appears.

	![Select the image] (../media/imagedefinewindows.png)

5. In **Virtual Machine Name**, type the name that you want to use for the virtual machine.

6. In **New Password**, type the password that is used for the Administrator account on the virtual machine. In **Confirm Password**, retype the password that you previously entered.

7. In **Size**, select the size that you want to use for the virtual machine. The size that you select depends on the number of cores that are needed for your application.

8. For a virtual machine running the Linux operating system , you can select to secure the machine with an SSH Key.

9. Click the arrow to continue.

	The **VM Mode** dialog box appears.

	![Define the connected virtual machine] (../media/connectedvms.png)

10. Select **Connect to existing Virtual Machine** to create a new virtual machine under an existing cloud service. Select the cloud service that will contain the new virtual machine.

11. In **Storage Account**, select a storage account where the VHD file is stored or you can have a storage account automatically created. Only one storage account is automatically created. All other virtual machines that you create with this setting are located in this storage account. You are limited to 20 storage accounts.

12. In **Region/Affinity Group/Virtual Network**, select region that you want to contain the virtual machine.

13. Click the arrow to continue.

	The **VM Options** dialog box appears.

	![Define the connected virtual machine] (../media/availabilitysetselect.png)

14. Select the availability set that was created when you created the first virtual machine.

15. Click the check mark to create the connected virtual machine.

## <a id="logon"> </a>How to log on to a virtual machine ##

You can log on to the virtual machine that you created to manage the settings of the machine and the applications that run on the machine. For a virtual machine that is running the Windows Server 2008 R2 operating system, you use the Connect button in the Management Portal to start a Remote Desktop Connection. For a virtual machine that is running the Linux operating system, you use a Secure Shell (SSH) client.

### Log on to a virtual machine that is running Windows Server 2008 R2 ###

1. If you have not already done so, sign in to the Windows Azure Management Portal.

2. Click **Virtual Machines**, and then select the virtual machine that you want to log onto.

3. On the command bar, click **Connect**.

	![Log on to the virtual machine] (../media/connectwindows.png)

4. Click **Open** to use the remote desktop protocol file that was automatically created for the virtual machine.

	![Log on to the virtual machine] (../media/connectwindows.png)

5. Click **Connect** to proceed with the connection process.

	![Continue with connecting] (../media/connectpublisher.png)

6. Enter the password of the Administrator account on the virtual machine, and then click **OK**.
	
	![Enter the password] (../media/connectcreds.png)

7. Click **Yes** to verify the identity of the virtual machine.

	![Verify the identity of the machine] (../media/connectverify.png)

	You can now work with the virtual machine just as you would with any other server.

### Log on to a virtual machine that is running Linux ###

You must install an SSH client on your computer that you want to use to log on to the virtual machine. There are many SSH client programs that you can choose from. The following are possible choices:

- If you are using a computer that is running a Windows operating system, you might want to use an SSH client such as PuTTY. For more information, see the [PuTTY Download Page](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html).
- If you are using a computer that is running a Linux operating system, you might want to use an SSH client such as OpenSSH. For more information, see [OpenSSH](http://www.openssh.org/).

This procedure shows you how to use the PuTTY program to access the virtual machine.

1. Find the **Host Name** and **Port information** from the Management Portal. You can find the information that you need from the dashboard of the virtual machine. Click the virtual machine name and look for the **SSH Details** in the **Quick Glance** section of the dashboard.

	![Obtain SSH details] (../media/sshdetails.png)

2. Open the PuTTY program.

3. Enter the Host Name and the Port information that you collected from the dashboard, and then click **Open**.

	![Open PuTTY] (../media/putty.png)

4. Log on to the virtual machine using the account that you specified when the machine was created.

	![Log on to the virtual machine] (../media/sshlogin.png)

	You can now work with the virtual machine just as you would with any other server.

## <a id="attachdisk"> </a>How to attach a data disk to a virtual machine ##

You can attach a data disk to a virtual machine to store application data. A data disk is a Virtual Hard Disk (VHD) that you can create either locally with your own computer or in the cloud with Windows Azure. You manage data disks in the virtual machine the same way you do on a server in your office.

You can upload and attach a data disk that already contains data to the virtual machine, or you can attach an empty disk to the machine. The virtual machine is not stopped to add the disk. You are limited in the number of disks that you can attach to a virtual machine based on the size of the machine. The following table lists the number of attached disks that are allowed for each size of virtual machine.

<P>
  <TABLE BORDER="1" WIDTH="300">
  <TR BGCOLOR="#E9E7E7">
    <TH>Size</TH>
    <TH>Data Disk Limit</TH>
  </TR>
  <TR>
    <TD>Extra Small</TD>
    <TD>1</TD>
  </TR>
  <TR>
    <TD>Small</TD>
    <TD>2</TD>
  </TR>
  <TR>
    <TD>Medium</TD>
    <TD>4</TD>
  </TR>
  <TR>
    <TD>Large</TD>
    <TD>8</TD>
  </TR>
  <TR>
    <TD>Extra Large</TD>
    <TD>16</TD>
  </TR>
  </TABLE>
</P>

### Attach an existing disk ###

1. If you have not already done so, sign in to the Windows Azure Management Portal.

2. Click **Virtual Machines**, and then select the virtual machine to which you want to attach the disk.

3. On the command bar, click **Attach**, and then select **Attach Disk**.

	![Attach data disk] (../media/attachexistingdiskwindows.png)

	The **Attach Disk** dialog box appears.

	![Enter data disk details] (../media/attachexistingdisk.png)

4.	Select the data disk that you want to attach to the virtual machine. 

5.	Click the check mark to attach the data disk to the virtual machine.  
 
	You will now see the data disk listed on the dashboard of the virtual machine.

	![Data disk successfully attached] (../media/attachsuccess.png)

### Attach an empty disk ###

When you create a new data disk, you decide the size of the disk. After you attach an empty disk to a virtual machine, the disk will be offline. You must connect to the virtual machine, and then use Server Manager to initialize the disk before you can use it.

**Note:** Windows Azure storage supports blobs up to 1TB in size, which accommodates a VHD with a maximum virtual size 999GB. When you enter “1TB” in Hyper-V for a new hard disk, the value represents the virtual size.  This yields a file that is oversized by 512 bytes.

1. Click **Virtual Machines**, and then select the virtual machine to which you want to attach the data disk.

2. On the command bar, click **Attach**, and then select **Attach Empty Disk**.

	![Attach an empty disk] (../media/attachdiskwindows.png)

	The **Attach Empty Disk** dialog box appears.

	![Attach a new empty disk] (../media/attachnewdiskwindows.png)

3. In **Storage Location**, select the storage account where you want to store the VHD file that is created for the data disk.
 
4. In **File Name**, either accept the automatically generated name or enter a name that you want to use for the VHD file that is stored. The data disk that is created from the VHD file will always use the automatically generated name.

5. In **Size**, enter the size of the data disk. 

6. Click the check mark to attach the empty data disk.

	You will now see the data disk listed on the dashboard of the virtual machine.

	![Empty data disk successfully attached] (../media/attachemptysuccess.png)

### Initialize a new data disk in Windows Server 2008 R2 ###

The data disk that you just attached to the virtual machine is offline and not initialized after you add it. You must access the machine and initialize the disk to use it for storing data. 

1. Connect to the virtual machine by using the steps listed in [How to log on to a virtual machine] [].

2. After you log on to the machine, open **Server Manager**, in the left pane, expand **Storage**, and then click **Disk Management**.

	![Open Server Manager] (../media/servermanager.png)

3. Right-click **Disk 2**, and then click **Initialize Disk**.

	![Initialize the disk] (../media/initializedisk.png)

4. Click **OK** to start the initialization process.

5. Right-click the space allocation area for Disk 2, click **New Simple Volume**, and then finish the wizard with the default values. 

	![Initialize the volume] (../media/initializediskvolume.png)

	The disk is now online and ready to use with a new drive letter.

	![Volume successfully initialized] (../media/initializesuccess.png)

### Initialize a new data disk in Linux ###

1. Connect to the virtual machine by using the steps listed in [How to log on to a virtual machine] [].

2. In the SSH window, type the following command, and then enter the password for the account that you created to manage the virtual machine:

	`sudo grep SCSI /var/log/messages`

	You can find the identifier of the last data disk that was added in the messages that are displayed.

	![Get the disk messages] (../media/diskmessages.png)

3. In the SSH window, type the following command to create a new device, and then enter the account password:

	`sudo fdisk /dev/sdc`

3. In the SSH window, type the following command to create a new device, and then enter the account password:

	`sudo fdisk /dev/sdc`

4. Type **n** to create a new partition.

	![Create new device] (../media/diskpartition.png)

5. Type **p** to make the partition the primary partition, type **1** to make it the first partition, and then type enter to accept the default value for the cylinder.

	![Create partition] (../media/diskcylinder.png)

6. Type **p** to see the details about the disk that is being partitioned.

	![List disk information] (../media/diskinfo.png)

7. Type **w** to write the settings for the disk.

	![Write the disk changes] (../media/diskwrite.png)

8. You must create the file system on the new partition. Type the following command to create the file system, and then enter the account password:

	`sudo mkfs -t ext4 /dev/sdc1`

	![Create file system] (../media/diskfilesystem.png)

9. Type the following command to make a directory for mounting the drive, and then enter the account password:

	`sudo mkdir /mnt/datadrive`

10. Type the following command to mount the drive:

	`sudo mount /dev/sdc1 /mnt/datadrive`

	The data disk is now ready to use as **/mnt/datadrive**.

## <a id="communication"> </a>How to set up communication with a virtual machine ##

All virtual machines that you create in Windows Azure can automatically communicate using a private network channel with other virtual machines in the same cloud service or virtual network. However, you need to add an endpoint to a machine for other resources on the Internet or other virtual networks to communicate with it. You can associate specific ports and a protocol to endpoints. Resources can connect to an endpoint by using a protocol of TCP or UDP. The TCP protocol includes HTTP and HTTPS communication. 

Each endpoint defined for a virtual machine is assigned a public and private port for communication. The private port is defined for setting up communication rules on the virtual machine and the public port is used by the Windows Azure load balancer to communicate with the virtual machine from external resources.

1. If you have not already done so, sign in to the Windows Azure Management Portal.

2. Click **Virtual Machines**, and then select the virtual machine that you want to configure.

3. Click **Endpoints**.

	![Endpoints] (../media/endpointswindows.png)

4.	Click **Add Endpoint**.

	The **Add Endpoint** dialog box appears.

	![Add endpoints] (../media/addendpointwindows.png)

5. Accept the default selection of **Add Endpoint**, and then click the arrow to continue.

	![Enter endpoint details] (../media/endpointtcpwindows.png)

6. In **Name**, enter a name for the endpoint.

7. In **Public Port** and **Private Port**, type 80. These port numbers can be different. The public port is the entry point for communication from outside of Windows Azure and is used by the Windows Azure load balancer. You can use the private port and firewall rules on the virtual machine to redirect traffic in a way that is appropriate for your application.

8.	Click the check mark to create the endpoint.

	You will now see the endpoint listed on the **Endpoints** page.

	![Endpoint creation successful] (../media/endpointwindowsnew.png)

## <a id="capture"> </a>How to capture an image of a virtual machine ##

You can use images from the Image Gallery to easily create virtual machines, or you can capture and use your own images to create customized virtual machines. An image is a virtual hard disk (VHD) file that is used as a template for creating a virtual machine. An image is a template because it doesn’t have specific settings like a configured virtual machine, such as the computer name and user account settings. If you want to create multiple virtual machines that are set up the same way, you can capture an image of a configured virtual machine and use that image as a template.

### Capture an image of a virtual machine running Windows Server 2008 R2 ###

1. Connect to the virtual machine by using the steps listed in [How to log on to a virtual machine] [].

2.	Open a Command Prompt window as an administrator.

	![Run Sysprep.exe] (../media/sysprepcommand.png)

3.	Change the directory to `%windir%\system32\sysprep`, and then run sysprep.exe.

	The **System Preparation Tool** dialog box appears.

	![Enter Sysprep.exe options] (../media/sysprepgeneral.png)

4.	In **System Cleanup Action**, select **Enter System Out-of-Box Experience (OOBE)** and make sure that **Generalize** is checked. For more information about using Sysprep, see [How to Use Sysprep: An Introduction](http://technet.microsoft.com/en-us/library/bb457073.aspx).

5.	In **Shutdown Options**, select **Shutdown**.

6.	Click **OK**.

7.	The sysprep command shuts down the virtual machine, which changes the status of the machine in the Management Portal to **Stopped**.

	![The virtual machine is stopped](../media/sysprepstopped.png)

8.	Click **Virtual Machines**, and then select the virtual machine from which you want to capture an image.

9.	On the command bar, click **Capture**.

	![Capture an image of the virtual machine] (../media/capturevm.png)

	The **Capture Virtual Machine** dialog box appears.

	![Enter the image name] (../media/capture.png)

10.	In **Image Name**, enter the name for the new image.

11.	All Windows Server images must be generalized by running the sysprep command. Click **I have sysprepped the Virtual Machine** to indicate that the operating system is prepared to be an image.

12.	Click the check mark to capture the image. When you capture an image of a virtual machine, the machine is deleted.

	The new image is now available under **Images**. The virtual machine is deleted after the image is captured.

	![Image capture successful] (../media/capturesuccess.png)

	When you create a virtual machine by using the From Gallery method, you can use the image that you captured by clicking **My Images** on the **VM OS Selection** page.

	![Use the captured image] (../media/myimageswindows.png)

### Capture an image of a virtual machine running Linux ###

1. Connect to the virtual machine by using the steps listed in [How to log on to a virtual machine] [].

2. In the SSH window, type the following command, and then enter the password for the account that you created on the virtual machine:

	`sudo waagent –deprovision`

	![Deprovision the virtual machine] (../media/linuxdeprovision.png)

3. Type **y** to continue.

	![Deprovision of virtual machine successful] (../media/linuxdeprovision2.png)

4. Type **Exit** to close the SSH client.

5. In the Management Portal, select the virtual machine, and then click **Shutdown**.

	![Shutdown the virtual machine] (../media/shutdownvm.png)

6. Click **Yes** to acknowledge that you will continue to be billed for the virtual machine when it is not running.

7. When the virtual machine is stopped, on the command bar, click **Capture**.

	![Capture an image of the virtual machine] (../media/capturevm.png)

	The **Capture Virtual Machine** dialog box appears.
	
	![Enter the details of the capture] (../media/capturelinux.png)

8.	In **Image Name**, enter the name for the new image.

9.	All Linux images must be deprovisioned by running the waagent command with the –deprovision option. Click **I have run the de-provision command on the Virtual Machine** to indicate that the operating system is prepared to be an image.

10.	Click the check mark to capture the image.

	The new image is now available under **Images**. The virtual machine is deleted after the image is captured.

	![Image capture successful] (../media/capturesuccess.png)

	When you create a virtual machine by using the **From Gallery** method, you can use the image that you captured by clicking **My Images** on the **VM OS Selection** page.

	![Use the captured image] (../media/myimageslinux.png)

## <a id="nextsteps"> </a>Next Steps ##

Now that you have learned the basics of creating a virtual machine, follow these links to learn how to do more complex tasks.

- Deploy a Virtual Machine to a Virtual Network or Subnets
- Add a Virtual Machine to the Local Domain by Using on Premises DNS/AD


[What is a virtual machine in Windows Azure]: #virtualmachine
[How to quickly create a virtual machine]: #quickcreate
[How to create a custom virtual machine]: #customcreate
[How to connect virtual machines in a cloud service]: #connectmachines
[How to log on to a virtual machine]: #logon
[How to attach a data disk to a virtual machine]: #attachdisk
[How to set up communication with a virtual machine]: #communication
[How to capture an image of a virtual machine]: #capture
[Next Steps]: #nextsteps