---
title: How to install Linux Master Target server for failover from Azure to on-premises| Microsoft Docs
description: Before reprotecting a Linux VM, you need a linux Master target server. Learn how to install one.
services: site-recovery
documentationcenter: ''
author: ruturaj
manager: gauravd
editor: ''

ms.assetid: 44813a48-c680-4581-a92e-cecc57cc3b1e
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: 
ms.date: 02/13/2017
ms.author: ruturajd

---
# How to install Linux Master Target server
Once you have failed over your virtual machines, you can failback the VM's, back to on-premises. To failback, first you need to get the virtual machine into protected state, by reprotecting the virtual machine from Azure to on-premises. For this, you need a master target server to receive the traffic on-premises. If your protected virtual machine is a windows VM, then you need a Windows Master Target. For a Linux VM, you need a Linux Master Target to reprotect. Read the steps below on how to create and install a Linux Master Target.

## Overview
This article provides information and instructions to install a Linux Master Target.

Post any comments or questions at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Pre-requisites

* To correctly choose the host on which you need to deploy the MT, determine whether the failback is going to be to an existing VM on-premises or to a new VM (because the on-premises VM got deleted). 
	* For an existing VM, the MT's host should have access to the VM's datastores.
	* If the VM does not exist on-premises, the failback VM is created on the same host as the MT. You can choose any ESXi host to install the MT.
* MT should be on a network that can communicate with the process server and the configuration server.
* MT version should be lesser than or equal to the Process server and the configuration server. (example, if CS is on 9.4, the MT can be on 9.4 and 9.3 - not on 9.5)
* MT can only be a VMware VM, and not a physical VM.


## Steps to deploy the Master Target server

### Install CentOS 6.6 Minimal

Follow the steps as mentioned below to install CentOS 6.6 - 64bit Operating System.

1. From following links choose a nearest mirror to download a CentOS 6.6 minimal 64-bit ISO.

	<http://archive.kernel.org/centos-vault/6.6/isos/x86_64/CentOS-6.6-x86_64-minimal.iso>

	<http://mirror.symnds.com/distributions/CentOS-vault/6.6/isos/x86_64/CentOS-6.6-x86_64-minimal.iso>

	<http://bay.uchicago.edu/centos-vault/6.6/isos/x86_64/CentOS-6.6-x86_64-minimal.iso>

	<http://mirror.nsc.liu.se/centos-store/6.6/isos/x86_64/CentOS-6.6-x86_64-minimal.iso>

	Keep CentOS 6.6 minimal 64-bit ISO in DVD drive and boot the system.

	![](./media/site-recovery-how-to-install-linux-master-target/media/image1.png)

2. Select **Skip** to ignore the media testing process.

	![](./media/site-recovery-how-to-install-linux-master-target/media/image2.png)

3. Now you can see the installation welcome screen. Here click
**Next** button.

	![](./media/site-recovery-how-to-install-linux-master-target/media/image3.png)

4. Select **English** as your preferred Language and click
**Next** to continue.

	![](./media/site-recovery-how-to-install-linux-master-target/media/image4.png)

5. Select **US English** as a Keyboard layout. Click **Next**
to continue installation.

	![](./media/site-recovery-how-to-install-linux-master-target/media/image5.png)

6. Select the type of devices where you will install. Select
**Basic storage Devices**. Click **Next** to continue installation.

	![](./media/site-recovery-how-to-install-linux-master-target/media/image6.png)

7. A warning message appears, that denotes the existing data in
the hard drive will be deleted. Make sure the hard drive does not have
any important data and click **Yes, discard any data**.

	![](./media/site-recovery-how-to-install-linux-master-target/media/image7.png)

8. Enter the hostname for your server in **Hostname text box**. Click **Configure Network**, In **Network Connection** window select your network interface. Click **Edit** button to configure IPV4Settings.

	![](./media/site-recovery-how-to-install-linux-master-target/media/image8.png)

9. Following **Editing System eth0** window displays. Select **Connect automatically** checkbox. Under “IPv4 Settings” tab, choose
method as **Manual** and then click **Add** button. Provide the Static IP, Netmask, Gateway, and DNS Server details. Click **Apply** to save the details.

	![](./media/site-recovery-how-to-install-linux-master-target/media/image9.png)

10. Select your Time Zone from the Combo box and click **Next**
to continue.

	![](./media/site-recovery-how-to-install-linux-master-target/media/image10.png)

11. Enter the **Root password** and confirm the password, click
**Next** to continue.

	![](./media/site-recovery-how-to-install-linux-master-target/media/image11.png)

12. Select **Create Custom Layout** as Mode of Partition and
click **Next** to continue.

	![](./media/site-recovery-how-to-install-linux-master-target/media/image12.png)

13. Select **Free** partition and click on **Create** for creating **/**, **/var/crash** and **/home** partitions with **ext4** as
File System Type. Create **Swap partition** with **swap** as file system type. To allocate partition size, follow the size allocation formula as mentioned in below table.

	> [!NOTE]
	> Linux Master Target (MT) system should not use LVM for root or retention storage spaces. Linux MT configured to avoid LVM partitions/disks discovery by default.

	![](./media/site-recovery-how-to-install-linux-master-target/media/image13.png)

14. After creation of partition click **Next** to continue.

	![](./media/site-recovery-how-to-install-linux-master-target/media/image14.png)

15. If any pre-existing devices are found, warning message
appears for formatting. Click **Format** to format the hard drive with latest partition table.

	![](./media/site-recovery-how-to-install-linux-master-target/media/image15.png)

16. Click **Write changes to disk** to apply the partition changes on disk.

	![](./media/site-recovery-how-to-install-linux-master-target/media/image16.png)

17. Check the **Install boot loader** option and click **Next** to install boot loader on root partition.

	![](./media/site-recovery-how-to-install-linux-master-target/media/image17.png)


18. The Installation process starts. You can monitor the progress of installation.

	![](./media/site-recovery-how-to-install-linux-master-target/media/image18.png)

19. The following screen displays on successful completion of installation. Click **Reboot**

	![](./media/site-recovery-how-to-install-linux-master-target/media/image19.png)


### Post installation steps
Next, we will prepare the machine to be configured as a Master Target server.

To get SCSI ID’s for each of SCSI hard disk in a Linux virtual machine,
you should enable the parameter “disk.EnableUUID = TRUE”.

To enable this parameter, follow the steps as given below:

a. Shut down your virtual machine.

b. Right-click the VM’s entry in the left-hand panel and select **Edit Settings.**

c. Click the **Options** tab.

d. Select the **Advanced&gt;General item** on the left and click the
**Configuration Parameters** that you see on the right.

![](./media/site-recovery-how-to-install-linux-master-target/media/image20.png)

“Configuration Parameters” option will be in de-active state when the
machine is running”. To make this tab active, shutdown machine.

e. See whether already a row with **disk.EnableUUID** exists?

f. If the value exists and is set to False over write the value with True (True and False values are case in-sensitive).

g. If the value exists and is set to true, click on Cancel.
	
h. If the value does not exist click **Add Row.**

i. Add disk.EnableUUID in the Name column and Set its value as TRUE

   * If exists and if the value is set to False over write the value with
True (True and False values are case in-sensitive).

   * If exists and is set to true, click on cancel and test the SCSI
command inside guest operating system after it is boot-up.

f. If does not exist click **Add Row.**

  Add disk.EnableUUID in the Name column.

  Set its value as TRUE



![](./media/site-recovery-how-to-install-linux-master-target/media/image21.png)

#### Download and install the additional packages

> [!NOTE]
> Make sure system has Internet connectivity before download and installing additional packages or else you will need to manually find out these package RPM and install them.

```
yum install -y xfsprogs perl lsscsi rsync wget kexec-tools
```

Above command will download below mentioned 15 packages from CentOS 6.6 repository and install. If you do not have internet access, you will need to download the following RPM.


bc-1.06.95-1.el6.x86\_64.rpm

busybox-1.15.1-20.el6.x86\_64.rpm

elfutils-libs-0.158-3.2.el6.x86\_64.rpm

kexec-tools-2.0.0-280.el6.x86\_64.rpm

lsscsi-0.23-2.el6.x86\_64.rpm

lzo-2.03-3.1.el6\_5.1.x86\_64.rpm

perl-5.10.1-136.el6\_6.1.x86\_64.rpm

perl-Module-Pluggable-3.90-136.el6\_6.1.x86\_64.rpm

perl-Pod-Escapes-1.04-136.el6\_6.1.x86\_64.rpm

perl-Pod-Simple-3.13-136.el6\_6.1.x86\_64.rpm

perl-libs-5.10.1-136.el6\_6.1.x86\_64.rpm

perl-version-0.77-136.el6\_6.1.x86\_64.rpm

rsync-3.0.6-12.el6.x86\_64.rpm

snappy-1.1.0-1.el6.x86\_64.rpm

wget-1.12-5.el6\_6.1.x86\_64.rpm


#### Install additional packages for specific operating systems

> [!NOTE]
> If source protected machines use Reiser or XFS filesystem for the root or boot device, then following additional packages should be download and installed on Linux Master Target prior to the protection.
 

***ReiserFS (If used in Suse11SP3. However, ReiserFS is not the default filesystem in Suse11SP3)***

```
cd /usr/local

wget
<http://elrepo.org/linux/elrepo/el6/x86_64/RPMS/kmod-reiserfs-0.0-1.el6.elrepo.x86_64.rpm>

wget
<http://elrepo.org/linux/elrepo/el6/x86_64/RPMS/reiserfs-utils-3.6.21-1.el6.elrepo.x86_64.rpm>

rpm -ivh kmod-reiserfs-0.0-1.el6.elrepo.x86\_64.rpm
reiserfs-utils-3.6.21-1.el6.elrepo.x86\_64.rpm
```

***XFS (RHEL, CentOS 7 onwards)***

```
cd /usr/local

wget
<http://archive.kernel.org/centos-vault/6.6/os/x86_64/Packages/xfsprogs-3.1.1-16.el6.x86_64.rpm>

rpm -ivh xfsprogs-3.1.1-16.el6.x86\_64.rpm

yum install device-mapper-multipath 
```
This is required to enable
Multipath packages on the MT server.

### Get the Installer for setup

If you have internet access from your Master Target server, you can download the installer via below steps - else you can copy the installer from the Process server and install it.

#### Download the MT installation packages

Download the latest Linux Master Target installation bits from here - [https://aka.ms/latestlinuxmobsvc](https://aka.ms/latestlinuxmobsvc).

To download it via your linux, type 

```
wget https://aka.ms/latestlinuxmobsvc -O latestlinuxmobsvc.tar.gz
```

Make sure you download and unzip the installer in your home directory only. If you unzip in into /usr/Local then the installation will fail.


#### Access the installer from the Process server

Go to the Process server and navigate to directory - C:\Program Files (x86)\Microsoft Azure Site Recovery\home\svsystems\pushinstallsvc\repository

Copy the required installer file from the process server and save it as latestlinuxmobsvc.tar.gz in your home directory


### Apply Custom Configuration Changes

To apply custom configuration changes, follow the below mentioned steps:


1. Run the below command to untar the binary.
	```
	tar -zxvf latestlinuxmobsvc.tar.gz
	```

	![](./media/site-recovery-how-to-install-linux-master-target/image16.png)
	
2. Execute below command to give permission.
	```
	chmod 755 ./ApplyCustomChanges.sh
	```

3. Execute the below command to run the script.
	```
	./ApplyCustomChanges.sh
	```
> [!NOTE]
> Execute the script only once on the server. Shut down the server. Reboot the server after adding a disk as given in the next steps.

### Add retention disk to Linux MT VM 

Follow the steps as mentioned below to create a retention disk.

1. Attach a new **1-TB** disk to the Linux MT VM and **boot** the machine.

2. Invoke **multipath -ll** command to know the retention disk's
multipath id.

	```
	multipath -ll
	```

	![](./media/site-recovery-how-to-install-linux-master-target/media/image22.png)

3. Format the drive and create a filesystem on the new drive. 
	
	```
	mkfs.ext4 /dev/mapper/<Retention disk's multipath id>
	```
	![](./media/site-recovery-how-to-install-linux-master-target/media/image23.png)

4. Once done with filesystem creation, mount the retention disk.
	```
	mkdir /mnt/retention
	mount /dev/mapper/<Retention disk's multipath id> /mnt/retention
	```

	![](./media/site-recovery-how-to-install-linux-master-target/media/image24.png)

5. Finally create the fstab entry to mount the retention drive during every boot
	```
	vi /etc/fstab 
	```
	Press [Insert] to begin editing the file. Create a new line and insert the following text in it. Edit the Disk multipath ID based on the highlighted multipath ID from the previous command.

	**/dev/mapper/<Retention disks multipath id> /mnt/retention ext4 rw 0 0**

	Press [Esc] and type :wq (write and quit) to close the editor window.

### Install Master Target

> [!NOTE]
> Master target server version should be less than or equal to the process server and the configuration server. If the MT version is higher, the reprotect will succeed but replication will fail.
 

> [!NOTE]
> Before installing the master target server, check that the /etc/hosts file on the VM contains entries that map the local hostname to IP addresses associated with all network adapters.
 
1. Copy the passphrase from **C:\ProgramData\Microsoft Azure Site Recovery\private\connection.passphrase** on the Configuration server, and save it in passphrase.txt in the same local directory by running the following command.

	```
	echo <passphrase> >passphrase.txt
	```
	Example: echo itUx70I47uxDuUVY >passphrase.txt

2. Note down the Configuration server's IP address. We need it in the next step

3. Run the following command to Install the Master Target server and register the server with the Configuration server.
	
	```
	./install -t both -a host -R MasterTarget -d /usr/local/ASR -i <Configuration Server IP Address> -p 443 -s y -c https -P passphrase.txt
	```

	Example: ./install -t both -a host -R MasterTarget -d /usr/local/ASR -i 104.40.75.37 -p 443 -s y -c https -P passphrase.txt

	Wait til the script completes execution. If the Master Target is successfully registered, you can see the MT listed in the Site Recovery Infrastructure page on the portal.

#### Installing Master Target using interactive install

1. Execute following command to install Master Target. Choose agent role as "Master Target".

	```
	./install
	```

2. Choose default location for installation - Press [Enter] to continue
	
	![](./media/site-recovery-how-to-install-linux-master-target/image17.png)
	

3. Choose the Global settings to configure

	![](./media/site-recovery-how-to-install-linux-master-target/image18.png)
	
4. Specify th CS Server IP addresses

5. Specify the CS Server Port as 443.
	
	![](./media/site-recovery-how-to-install-linux-master-target/image19.png)
	
6. Copy the CS passphrase from C:\ProgramData\Microsoft Azure Site Recovery\private\connection.passphrase on the configuration server and specify it in the passphrase box. It will appear empty even after copy pasting.

7. Go to [Quit] in the menu

8. Let the installation and registration complete.

### Install VMware tools on the Master Target server

VMware tools need to be installed on the MT so that it can discover the datastores. If the tools are not installed, the reprotect screen will not list the datastores. You will need to reboot post installation of VMware tools.

## Next steps
Once the Master target has completed installation and registration, you can see the MT appear on the Master Target section in Site Recovery Infrastructure, under the configuration server overview.

You can now proceed with [Reprotection](site-recovery-how-to-reprotect.md), followed by Failback.

## Common issues

* Make sure you do not turn on Storage vMotion on any Management components such as MT. If the MT moves post a successfult reprotect, the VMDK's cannot be detached and the failback will fail.
* The MT machine should not have any snapshots on the virtual machine. If there are snapshots, the failback will fail.
* Due to some custom NIC configurations at some customers, the network interface is disabled during boot up, then the MT agent cannot initialize. make sure the following properties are correctly set.
	* Check the two properties in the ethernet card files /etc/sysconfig/network-scripts/ifcfg-eth*
		* BOOTPROTO=dhcp 
		* ONBOOT=yes

