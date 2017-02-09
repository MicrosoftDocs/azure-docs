---
title: Hot to install Linux Master Target server | Microsoft Docs
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
ms.date: 12/20/2016
ms.author: ruturajd

---
# How to install Linux master target server
The Azure Site Recovery service contributes to your business continuity and disaster recovery (BCDR) strategy by orchestrating replication, failover and recovery of virtual machines and physical servers. Machines can be replicated to Azure, or to a secondary on-premises data center. For a quick overview read [What is Azure Site Recovery?](site-recovery-overview.md)

## Overview
This article provides information and instructions for recovering (failing over and failing back) virtual machines and physical servers that are protected with Site Recovery.

Post any comments or questions at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Pre-requisites

1. To corectly choose the host on which you need to deploy the MT, determine whether the failback is going to be to an exisiting VM on-premises or to a new VM (because the on-premises VM got deleted). 
	* For an exisiting VM, the MT's host should have access to the VM's datastores.
	* If the VM does not exist on-premises, the failback VM will be created on the same host as the MT.
2. MT should be on a network that can communicate with the process server and the configuration server.
3. MT version should be lesser than or equal to the Process server and the configuration server. (example, if CS is on 9.4, the MT can be on 9.4 and 9.3 - not on 9.5)
4. MT can only be a VMware VM, and not a physical VM.


## Steps to deploy the master target server

### Install CentOS 6.6 Minimal

Follow the steps as mentioned below to install CentOS 6.6 - 64bit
Operating System.

**Step 1:** From following links choose a nearest mirror to download a
CentOS 6.6 minimal 64-bit ISO.

<http://archive.kernel.org/centos-vault/6.6/isos/x86_64/CentOS-6.6-x86_64-minimal.iso>

<http://mirror.symnds.com/distributions/CentOS-vault/6.6/isos/x86_64/CentOS-6.6-x86_64-minimal.iso>

<http://bay.uchicago.edu/centos-vault/6.6/isos/x86_64/CentOS-6.6-x86_64-minimal.iso>

<http://mirror.nsc.liu.se/centos-store/6.6/isos/x86_64/CentOS-6.6-x86_64-minimal.iso>

Keep CentOS 6.6 minimal 64-bit ISO in DVD drive and boot the system.

![](./media/site-recovery-how-to-install-linux-master-target/media/image1.png)

**Step 2:** Select **Skip** to ignore the media testing process.

![](./media/site-recovery-how-to-install-linux-master-target/media/image2.png)

**Step 3:** Now you can see the installation welcome screen. Here click
**Next** button.

![](./media/site-recovery-how-to-install-linux-master-target/media/image3.png)

**Step 4:** Select **English** as your preferred Language and click
**Next** to continue.

![](./media/site-recovery-how-to-install-linux-master-target/media/image4.png)

**Step 5:** Select **US English** as a Keyboard layout. Click **Next**
to continue installation.

![](./media/site-recovery-how-to-install-linux-master-target/media/image5.png)

**Step 6:** Select the type of devices where you will install. Select
**Basic storage Devices**.

Click **Next** to continue installation.

![](./media/site-recovery-how-to-install-linux-master-target/media/image6.png)

**Step 7:** A warning message appears, that denotes the existing data in
the hard drive will be deleted. Make sure the hard drive does not have
any important data and click **Yes, discard any data**.

![](./media/site-recovery-how-to-install-linux-master-target/media/image7.png)

**Step 8:** Enter the hostname for your server in **Hostname text box**.
Click **Configure Network**,

In **Network Connection** window select your network interface. Click
**Edit** button to configure IPV4Settings.

![](./media/site-recovery-how-to-install-linux-master-target/media/image8.png)

**Step 9:** Following **Editing System etho** window displays. Select
**Connect automatically** checkbox. Under “IPv4 Settings” tab, choose
method as **Manual** and then click **Add** button. Provide the Static
IP, Netmask, Gateway and DNS Server details. Click **Apply** to save the
details.

![](./media/site-recovery-how-to-install-linux-master-target/media/image9.png)

**Step 10:** Select your Time Zone from the Combo box and click **Next**
to continue.

![](./media/site-recovery-how-to-install-linux-master-target/media/image10.png)

**Step 11:** Enter the **Root password** and confirm the password, click
**Next** to continue.

![](./media/site-recovery-how-to-install-linux-master-target/media/image11.png)

**Step 12:** Select **Create Custom Layout** as Mode of Partition and
click **Next** to continue.

![](./media/site-recovery-how-to-install-linux-master-target/media/image12.png)

**Step 13:** Select **Free** partition and click on **Create** for
creating **/**, **/var/crash** and **/home** partitions with **ext4** as
File System Type. Create **Swap partition** with **swap** as file system
type. To allocate partition size, follow the size allocation formula as
mentioned in below table.

NOTE: Linux Master Target (MT) system should not use LVM for root or
retention storage spaces. Linux MT configured to avoid LVM
partitions/disks discovery by default.

![](./media/site-recovery-how-to-install-linux-master-target/media/image13.png)

**Step 14:** After creation of partition click **Next** to continue.

![](./media/site-recovery-how-to-install-linux-master-target/media/image14.png)

**Step 15:** If any pre-existing devices is found, warning message
appears for formatting.

Click **Format** to format the hard drive with latest partition table.

![](./media/site-recovery-how-to-install-linux-master-target/media/image15.png)



**Step 16:** Click **Write changes to disk** to apply the partition
changes on disk.

![](./media/site-recovery-how-to-install-linux-master-target/media/image16.png)

**Step 17:** Check the **Install boot loader** option and click **Next**
to install boot loader on root partition.

![](./media/site-recovery-how-to-install-linux-master-target/media/image17.png)



**Step 18:** The Installation process starts. You can monitor the
progress of installation.

![](./media/site-recovery-how-to-install-linux-master-target/media/image18.png)

**Step 19:** The following screen displays on successful completion of
installation. Click **Reboot**

![](./media/site-recovery-how-to-install-linux-master-target/media/image19.png)


### Post Installation Steps

To get SCSI ID’s for each of SCSI hard disk in a Linux virtual machine,
you should enable the parameter “disk.EnableUUID = TRUE”.

To enable this parameter, follow the steps as given below:

a. Shut down your virtual machine.

b. Right-click the VM’s entry in the left-hand panel and select **Edit
Settings.**

c. Click the **Options** tab.

d. Select the **Advanced&gt;General item** on the left and click the
**Configuration Parameters** that you see on the right.

![](./media/site-recovery-how-to-install-linux-master-target/media/image20.png)

“Configuration Parameters” option will be in de-active state when the
machine is running”. In order to make this tab active, shutdown machine.

e. See whether already a row with **disk.EnableUUID** exists?

If exists and if the value is set to False over write the value with
True (True and False values are case in-sensitive).

If exists and is set to true, click on cancel and test the SCSI
command inside guest operating system after it is boot-up.

f. If does not exist click **Add Row.**

Add disk.EnableUUID in the Name column.

Set its value as TRUE

NOTE: Do not add the above values along with double-quotes.

![](./media/site-recovery-how-to-install-linux-master-target/media/image21.png)

#### Download and Install the Additional Packages

NOTE: Make sure system has Internet connectivity before download and
installing additional packages.

```
# yum install -y xfsprogs perl lsscsi rsync wget kexec-tools
```

Above command will download below mentioned 15 packages from CentOS 6.6
repository and install.


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

NOTE: If source protected machines use Reiser or XFS filesystem for the
root or boot device, then following additional packages should be
download and installed on Linux Master Target prior to the protection.

***ReiserFS (Suse11SP3. ReiserFS is not the default filesystem in
Suse11SP3 though)***

```
# cd /usr/local

# wget
<http://elrepo.org/linux/elrepo/el6/x86_64/RPMS/kmod-reiserfs-0.0-1.el6.elrepo.x86_64.rpm>

# wget
<http://elrepo.org/linux/elrepo/el6/x86_64/RPMS/reiserfs-utils-3.6.21-1.el6.elrepo.x86_64.rpm>

# rpm -ivh kmod-reiserfs-0.0-1.el6.elrepo.x86\_64.rpm
reiserfs-utils-3.6.21-1.el6.elrepo.x86\_64.rpm
```

***XFS (RHEL, CentOS 7 onwards)***

```
# cd /usr/local

# wget
<http://archive.kernel.org/centos-vault/6.6/os/x86_64/Packages/xfsprogs-3.1.1-16.el6.x86_64.rpm>

# rpm -ivh xfsprogs-3.1.1-16.el6.x86\_64.rpm

# yum install device-mapper-multipath 
```
This is required to enable
Multipath packages on the MT server.

### Download the MT installation packages

Download the latest Linux Master Target installation bits from here - [https://aka.ms/latestlinuxmobsvc](https://aka.ms/latestlinuxmobsvc).

To download it via your linux, type 

```
	# wget https://aka.ms/latestlinuxmobsvc
```

Make sure you download and unzip the installer in your home directory only. If you unzip in into /usr/Local then the installation will fail.

### Apply Custom Configuration Changes

Before applying custom configuration changes make sure you have
completed Post Installation Steps

To apply custom configuration changes, follow the below mentioned steps:

1. Copy the RHEL6-64 Unified Agent binary to the newly created OS.

2. Run the below command to untar the binary.
	```
	tar -zxvf <File name>
	```

	![](./media/site-recovery-how-to-install-linux-master-target/image16.png)
	
3. Execute below command to give permission.
	```
	# chmod 755 ./ApplyCustomChanges.sh
	```

4. Execute the below command to run the script.
	```
	# ./ApplyCustomChanges.sh
	```
NOTE: Execute the script only once on the server. **REBOOT** the server
after successful execution of the above script.

### Add Retention Disk to Linux MT VM 

Follow the steps as mentioned below to create a retention disk.

**Step 1:** Attach a new **1 TB** disk to the Linux MT VM and find out
its multipath id

Invoke **multipath -ll** command to know the retention disk's
multipath id.

![](./media/site-recovery-how-to-install-linux-master-target/media/image22.png)

**Step 2:** Invoke **mkfs.ext4 /dev/mapper/<Retention disk's multipath id>** command to create a filesystem on retention disk.

![](./media/site-recovery-how-to-install-linux-master-target/media/image23.png)

**Step 3:** Once done with filesystem creation, invoke below command(s)
to mount the retention disk.

![](./media/site-recovery-how-to-install-linux-master-target/media/image24.png)

**Step 4:** Finally create the fstab entry:
```
vi /etc/fstab 
```
and append the line

** /dev/mapper/36000c2989daa2fe6dddcde67f2079afe /mnt/retention ext4 rw 0 0 **

### Install Master Target


> [!NOTE]
> Master target server version should be less than or equal to the process server and the configuration server. If the MT version is higher, the reprotect will succeed but replication will fail.
> 

> [!NOTE]
> Before installing the master target server, check that the /etc/hosts file on the VM contains entries that map the local hostname to IP addresses associated with all network adapters.
> 


1. Execute below command to install Master Target. Choose agent role as
"Master Target".
```
# ./install
```

2. Choose default location for installation
	
	![](./media/site-recovery-how-to-install-linux-master-target/image17.png)
	

3. Choose the Global settings to configure

	![](./media/site-recovery-how-to-install-linux-master-target/image18.png)
	
4. Specify th CS Server IP addresses

5. Specify the CX Server Port - Usually 9443.
	
	![](./media/site-recovery-how-to-install-linux-master-target/image19.png)
	
6. Copy the CS passphrase from C:\ProgramData\Microsoft Azure Site Recovery\private\connection.passphrase on the configuration server.

7. Let the installation and registration complete.
### Install VMware tools on the master target server

VMware tools need to be installed on the MT so that it can discover the datastores. If the tools are not installed, the reprotect screen will not list the datastores.

## Next steps
 

## Common issues