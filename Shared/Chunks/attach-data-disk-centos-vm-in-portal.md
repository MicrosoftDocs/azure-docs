1. In the [Windows Azure (Preview) Management Portal][AzurePreviewPortal], click **Virtual Machines** and then select the virtual machine you just created (**testlinuxvm**).

2. On the command bar click **Attach** and then click **Attach Empty Disk**.

	The **Attach Empty Disk** dialog box appears.


3. The **Virtual Machine Name**, **Storage Location**, and **File Name** are already defined for you. All you have to do is enter the size that you want for the disk. Type **5** in the **Size** field.

	![Attach Empty Disk][Image2]

	**Note:** All disks are created from a VHD file in Windows Azure storage. You can provide a name for the VHD file that is added to storage, but Windows Azure generates the name of the disk automatically.

4. Click the check mark to attach the data disk to the virtual machine.

5. Click the name of the virtual machine to display the dashboard; this lets you verify that the data disk was successfully attached to the virtual machine.

	The number of disks is now 2 for the virtual machine. The disk that you attached is listed in the **Disks** table.

	![Attach Empty Disk][Image3]

	After you attach the data disk to the virtual machine, the disk is offline and not initialized. You have to log on to the virtual machine and initialize the disk before you can use it to store data.

##Connect to the Virtual Machine Using SSH or PuTTY and Complete Setup
The data disk that you just attached to the virtual machine is offline and not initialized after you add it. You must log on to the machine and initialize the disk to use it for storing data.

1. After the virtual machine is provisioned connect using SSH or PuTTY and login as **newuser** (as described in the steps above).	

2. In the SSH or PuTTY window type the following command and then enter the account password:

	`$ sudo grep SCSI /var/log/messages`

	You can find the identifier of the last data disk that was added in the messages that are displayed (**sdc**, in this example).

	![GREP][Image4]

3. In the SSH or PuTTY window, enter the following command to partition the disk **/dev/sdc**:

	`$ sudo fdisk /dev/sdc`

4. Enter **n** to create a new partition.

	![FDISK][Image5]

5. Type **p** to make the partition the primary partition, type **1** to make it the first partition, and then type enter to accept the default value (1) for the cylinder.

	![FDISK][Image6]

6. Type **p** to see the details about the disk that is being partitioned.

	![FDISK][Image7]

7. Type **w** to write the settings for the disk.

	![FDISK][Image8]

8. Format the new disk using the **mkfs.ext3** command:

	`$ sudo mkfs.ext3 /dev/sdc1`

	![Format Disk][Image9]

9. Create a directory to make a mount point for the drive:

	`$ sudo mkdir /mnt/datadrive`

10. Mount the drive:

	`$ sudo mount /dev/sdc1 /mnt/datadrive`

11. Open the **/etc/fstab** file and append the following line:

	`/dev/sdc1        /mnt/datadrive      ext3    defaults   1 2`

12. Save and close the **/etc/fstab** file.

13. Label the partition using e2label:

	`$ sudo e2label /dev/sdc1 /mnt/datadrive`


[AzurePreviewPortal]: http://manage.windowsazure.com

[Image2]: ../../Shared/Media/AttachDataDiskLinuxVM2.png
[Image3]: ../../Shared/Media/AttachDataDiskLinuxVM3.png
[Image4]: ../../Shared/Media/GrepScsiMessages.png
[Image5]: ../../Shared/Media/fdisk1.png
[Image6]: ../../Shared/Media/fdisk2.png
[Image7]: ../../Shared/Media/fdisk3.png
[Image8]: ../../Shared/Media/fdisk4.png
[Image9]: ../../Shared/Media/mkfs.png

