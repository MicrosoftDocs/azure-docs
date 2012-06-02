#How to Attach a Data Disk to a Virtual Machine

To use this feature and other new Windows Azure capabilities, sign up for the [free preview](https://account.windowsazure.com/PreviewFeatures). 

* [Concepts](#concepts)
* [How to: Attach an existing disk](#attachexisting)
* [How to: Attach an empty disk](#attachempty)
* [How to: Initialize a new data disk in Windows Server 2008 R2](#initializeinWS)
* [How to: Initialize a new data disk in Linux](#initializeinlinux)

<h2 id="concepts">Concepts</h2>

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

<h2 id="attachexisting">How to: Attach an existing disk</h2>


1. If you have not already done so, sign in to the [Windows Azure Management Portal](http://manage.windowsazure.com).

2. Click **Virtual Machines**, and then select the virtual machine to which you want to attach the disk.

3. On the command bar, click **Attach**, and then select **Attach Disk**.

	![Attach data disk][Attach data disk]

	The **Attach Disk** dialog box appears.

	![Enter data disk details][Enter data disk details]

4.	Select the data disk that you want to attach to the virtual machine. 

5.	Click the check mark to attach the data disk to the virtual machine.  
 
	You will now see the data disk listed on the dashboard of the virtual machine.

	![Data disk successfully attached][Data disk successfully attached]


<h2 id="attachempty">How to: Attach an empty disk</h2>

When you create a new data disk, you decide the size of the disk. After you attach an empty disk to a virtual machine, the disk will be offline. You must connect to the virtual machine, and then use Server Manager to initialize the disk before you can use it.

**Note:** Windows Azure storage supports blobs up to 1TB in size, which accommodates a VHD with a maximum virtual size 999GB. When you enter “1TB” in Hyper-V for a new hard disk, the value represents the virtual size.  This yields a file that is oversized by 512 bytes.

1. Click **Virtual Machines**, and then select the virtual machine to which you want to attach the data disk.

2. On the command bar, click **Attach**, and then select **Attach Empty Disk**.

	![Attach an empty disk][Attach an empty disk]

	The **Attach Empty Disk** dialog box appears.

	![Attach a new empty disk][Attach a new empty disk]

3. In **Storage Location**, select the storage account where you want to store the VHD file that is created for the data disk.
 
4. In **File Name**, either accept the automatically generated name or enter a name that you want to use for the VHD file that is stored. The data disk that is created from the VHD file will always use the automatically generated name.

5. In **Size**, enter the size of the data disk. 

6. Click the check mark to attach the empty data disk.

	You will now see the data disk listed on the dashboard of the virtual machine.

	![[Empty data disk successfully attached][Empty data disk successfully attached]

<h2 id="initializeinWS">How to: Initialize a new data disk in Windows Server 2008 R2</h2>

The data disk that you just attached to the virtual machine is offline and not initialized after you add it. You must access the machine and initialize the disk to use it for storing data. 

1. Connect to the virtual machine by using the steps listed in [How to log on to a virtual machine running Windows Server 2008 R2][logon]

2. After you log on to the machine, open **Server Manager**, in the left pane, expand **Storage**, and then click **Disk Management**.

	![Open Server Manager][Open Server Manager]

3. Right-click **Disk 2**, and then click **Initialize Disk**.

	![Initialize the disk][Initialize the disk]

4. Click **OK** to start the initialization process.

5. Right-click the space allocation area for Disk 2, click **New Simple Volume**, and then finish the wizard with the default values. 

	![Initialize the volume][Initialize the volume]

	The disk is now online and ready to use with a new drive letter.

	![Volume successfully initialized][Volume successfully initialized]


<h2 id="initializeinlinux">How to: Initialize a new data disk in Linux </h2>

1. Connect to the virtual machine by using the steps listed in [How to log on to a virtual machine running Linux][logonlinux].

2. In the SSH window, type the following command, and then enter the password for the account that you created to manage the virtual machine:

	`sudo grep SCSI /var/log/messages`

	You can find the identifier of the last data disk that was added in the messages that are displayed.

	![Get the disk messages][Get the disk messages]

3. In the SSH window, type the following command to create a new device, and then enter the account password:

	`sudo fdisk /dev/sdc`

3. In the SSH window, type the following command to create a new device, and then enter the account password:

	`sudo fdisk /dev/sdc`

4. Type **n** to create a new partition.

	![Create new device][Create new device]

5. Type **p** to make the partition the primary partition, type **1** to make it the first partition, and then type enter to accept the default value for the cylinder.

	![Create partition][Create partition]

6. Type **p** to see the details about the disk that is being partitioned.

	![List disk information][List disk information]

7. Type **w** to write the settings for the disk.

	![Write the disk changes][Write the disk changes]

8. You must create the file system on the new partition. Type the following command to create the file system, and then enter the account password:

	`sudo mkfs -t ext4 /dev/sdc1`

	![Create file system][Create file system]

9. Type the following command to make a directory for mounting the drive, and then enter the account password:

	`sudo mkdir /mnt/datadrive`

10. Type the following command to mount the drive:

	`sudo mount /dev/sdc1 /mnt/datadrive`

	The data disk is now ready to use as **/mnt/datadrive**.


[logon]: ./howto-log-into-VM-WS/
[logonlinux]: ./howto-log-into-VM-Linux/
[Attach data disk]: ../media/attachexistingdiskwindows.png
[Enter data disk details]: ../media/attachexistingdisk.png
[Data disk successfully attached]: ../media/attachsuccess.png
[Attach an empty disk]: ../media/attachdiskwindows.png
[Attach a new empty disk]: ../media/attachnewdiskwindows.png
[Empty data disk successfully attached]: ../media/attachemptysuccess.png
[Open Server Manager]: ../media/servermanager.png
[Initialize the disk]: ../media/initializedisk.png
[Initialize the volume]: ../media/initializediskvolume.png
[Volume successfully initialized]: ../media/initializesuccess.png
[Get the disk messages]: ../media/diskmessages.png
[Create new device]: ../media/diskpartition.png
[Create partition]:../media/diskcylinder.png
[List disk information]: ../media/diskinfo.png
[Write the disk changes]: ../media/diskwrite.png
[Create file system]: ../media/diskfilesystem.png