<properties
	pageTitle="Add a disk to Linux VM | Microsoft Azure"
	description="Learn to add a persistent disk to your Linux VM"
	keywords="linux virtual machine,add resource disk"
	services="virtual-machines-linux"
	documentationCenter=""
	authors="rickstercdn"
	manager="timlt"
	editor="tysonn"
	tags="azure-resource-manager" />

<tags
	ms.service="virtual-machines-linux"
	ms.topic="article"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.date="04/29/2016"
	ms.author="rclaus"/>

# Add a disk to a Linux VM

This article shows how to attach a persistent disk to your VM so that you can preserve your data - even if your VM is re-provisioned due to maintenance or resizing. To add a disk you will need [the Azure CLI](../xplat-cli-install.md) configured in resource manager mode (`azure config mode arm`).  

## Quick Commands

In the following command examples, replace the values between &lt; and &gt; with the values from your own environment.

```bash
azure vm disk attach-new <myuniquegroupname> <myuniquevmname> <size-in-GB>
```

## Attach a disk

Attaching a new disk is quick. Just type `azure vm disk attach-new <myuniquegroupname> <myuniquevmname> <size-in-GB>` to create and attach a new GB disk for your VM. If you do not explicitly identify a storage account, any disk you create is placed in the same storage account where your OS disk resides.  It should look something like this:

```bash
azure vm disk attach-new myuniquegroupname myuniquevmname 5
```

Output

```bash
info:    Executing command vm disk attach-new
+ Looking up the VM "myuniquevmname"
info:    New data disk location: https://cliexxx.blob.core.windows.net/vhds/myuniquevmname-20150526-0xxxxxxx43.vhd
+ Updating VM "myuniquevmname"
info:    vm disk attach-new command OK
```

## Connect to the Linux VM to mount the new disk

> [AZURE.NOTE] This topic connects to a VM using usernames and passwords; to use public and private key pairs to communicate with your VM, see [How to Use SSH with Linux on Azure](virtual-machines-linux-ssh-from-linux.md). You can modify the **SSH** connectivity of VMs created with the `azure vm quick-create` command by using the `azure vm reset-access` command to reset **SSH** access completely, add or remove users, or add public key files to secure access.

You will need to SSH into your Azure VM in order to partition, format, and mount your new disk so your Linux VM can use it. If you're not familiar with connecting with **ssh**, the command takes the form `ssh <username>@<FQDNofAzureVM> -p <the ssh port>`, and looks like the following:

```bash
ssh ops@myuni-westu-1432328437727-pip.westus.cloudapp.azure.com -p 22
```

Output

```bash
The authenticity of host 'myuni-westu-1432328437727-pip.westus.cloudapp.azure.com (191.239.51.1)' can't be established.
ECDSA key fingerprint is bx:xx:xx:xx:xx:xx:xx:xx:xx:x:x:x:x:x:x:xx.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'myuni-westu-1432328437727-pip.westus.cloudapp.azure.com,191.239.51.1' (ECDSA) to the list of known hosts.
ops@myuni-westu-1432328437727-pip.westus.cloudapp.azure.com's password:
Welcome to Ubuntu 14.04.2 LTS (GNU/Linux 3.16.0-37-generic x86_64)

* Documentation:  https://help.ubuntu.com/

System information as of Fri May 22 21:02:32 UTC 2015

System load: 0.37              Memory usage: 2%   Processes:       207
Usage of /:  41.4% of 1.94GB   Swap usage:   0%   Users logged in: 0

Graph this data and manage this system at:
  https://landscape.canonical.com/

Get cloud support with Ubuntu Advantage Cloud Guest:
  http://www.ubuntu.com/business/services/cloud

0 packages can be updated.
0 updates are security updates.

The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

ops@myuniquevmname:~$
```

Now that you're connected to your VM, you're ready to attach a disk.  First find the disk, using `dmesg | grep SCSI` (the method you use to discover your new disk may vary). In this case, it looks something like:

```bash
dmesg | grep SCSI
```

Output

```bash
[    0.294784] SCSI subsystem initialized
[    0.573458] Block layer SCSI generic (bsg) driver version 0.4 loaded (major 252)
[    7.110271] sd 2:0:0:0: [sda] Attached SCSI disk
[    8.079653] sd 3:0:1:0: [sdb] Attached SCSI disk
[ 1828.162306] sd 5:0:0:0: [sdc] Attached SCSI disk
```

and in the case of this topic, the `sdc` disk is the one that we want. Now partition the disk with `sudo fdisk /dev/sdc` -- assuming that in your case the disk was `sdc`, and make it a primary disk on partition 1, and accept the other defaults.

```bash
sudo fdisk /dev/sdc
```

Output

```bash
Device contains neither a valid DOS partition table, nor Sun, SGI or OSF disklabel
Building a new DOS disklabel with disk identifier 0x2a59b123.
Changes will remain in memory only, until you decide to write them.
After that, of course, the previous content won't be recoverable.

Warning: invalid flag 0x0000 of partition table 4 will be corrected by w(rite)

Command (m for help): n
Partition type:
   p   primary (0 primary, 0 extended, 4 free)
   e   extended
Select (default p): p
Partition number (1-4, default 1): 1
First sector (2048-10485759, default 2048):
Using default value 2048
Last sector, +sectors or +size{K,M,G} (2048-10485759, default 10485759):
Using default value 10485759
```

Create the partition by typing `p` at the prompt:

```bash
Command (m for help): p

Disk /dev/sdc: 5368 MB, 5368709120 bytes
255 heads, 63 sectors/track, 652 cylinders, total 10485760 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x2a59b123

   Device Boot      Start         End      Blocks   Id  System
/dev/sdc1            2048    10485759     5241856   83  Linux

Command (m for help): w
The partition table has been altered!

Calling ioctl() to re-read partition table.
Syncing disks.
```

And write a file system to the partition by using the **mkfs** command, specifying your filesystem type and the device name. In this topic, we're using `ext4` and `/dev/sdc1` from above:

```bash
sudo mkfs -t ext4 /dev/sdc1
```

Output

```bash
mke2fs 1.42.9 (4-Feb-2014)
Discarding device blocks: done
Filesystem label=
OS type: Linux
Block size=4096 (log=2)
Fragment size=4096 (log=2)
Stride=0 blocks, Stripe width=0 blocks
327680 inodes, 1310464 blocks
65523 blocks (5.00%) reserved for the super user
First data block=0
Maximum filesystem blocks=1342177280
40 block groups
32768 blocks per group, 32768 fragments per group
8192 inodes per group
Superblock backups stored on blocks:
	32768, 98304, 163840, 229376, 294912, 819200, 884736
Allocating group tables: done
Writing inode tables: done
Creating journal (32768 blocks): done
Writing superblocks and filesystem accounting information: done
```

Now we create a directory to mount the file system using `mkdir`:

```bash
sudo mkdir /datadrive
```

And you mount the directory using `mount`:

```bash
sudo mount /dev/sdc1 /datadrive
```

The data disk is now ready to use as `/datadrive`.

```bash
ls
```

Output

```bash
bin   datadrive  etc   initrd.img  lib64       media  opt   root  sbin  sys  usr  vmlinuz
boot  dev        home  lib         lost+found  mnt    proc  run   srv   tmp  var
```

> [AZURE.NOTE] You can also connect to your Linux virtual machine using an SSH key for identification. For details, see [How to Use SSH with Linux on Azure](virtual-machines-linux-ssh-from-linux.md).


### TRIM/UNMAP support for Linux in Azure
Some Linux kernels will support TRIM/UNMAP operations to discard unused blocks on the disk. This is primarily useful in standard storage to inform Azure that deleted pages are no longer valid and can be discarded. This can save cost if you create large files and then delete them.

There are two ways to enable TRIM support in your Linux VM. As usual, please consult your distribution for the recommended approach:

- Use the `discard` mount option in `/etc/fstab`, for example:

		UUID=33333333-3b3b-3c3c-3d3d-3e3e3e3e3e3e   /datadrive   ext4   defaults,discard   1   2

- Alternatively, you can run the `fstrim` command manually from the command-line, or add it to your crontab to run regularly:

	**Ubuntu**

		# sudo apt-get install util-linux
		# sudo fstrim /datadrive

	**RHEL/CentOS**

		# sudo yum install util-linux
		# sudo fstrim /datadrive


## Next Steps

- Remember, that your new disk will not typically be available to the VM if it reboots unless you write that information to your [fstab](http://en.wikipedia.org/wiki/Fstab) file.
- Review the [Optimize your Linux machine performance](virtual-machines-linux-optimization.md) recomendations to ensure your Linux VM is configured correctly.
- Expand your storage capacity by adding additional disks and [configure RAID](virtual-machines-linux-configure-raid.md) for additional performance.
