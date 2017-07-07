---
title: Add a disk to Linux VM using the Azure CLI | Microsoft Docs
description: Learn to add a persistent disk to your Linux VM with the Azure CLI 1.0 and 2.0.
keywords: linux virtual machine,add resource disk
services: virtual-machines-linux
documentationcenter: ''
author: rickstercdn
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 3005a066-7a84-4dc5-bdaa-574c75e6e411
ms.service: virtual-machines-linux
ms.topic: article
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: azurecli
ms.date: 02/02/2017
ms.author: rasquill
ms.custom: H1Hack27Feb2017
---
# Add a disk to a Linux VM
This article shows how to attach a persistent disk to your VM so that you can preserve your data - even if your VM is reprovisioned due to maintenance or resizing. 

## Quick Commands
The following example attaches a `50`GB disk to the VM named `myVM` in the resource group named `myResourceGroup`:

To use managed disks:

```azurecli
az vm disk attach -g myResourceGroup --vm-name myVM --disk myDataDisk \
  --new --size-gb 50
```

To use unmanaged disks:

```azurecli
az vm unmanaged-disk attach -g myResourceGroup -n myUnmanagedDisk --vm-name myVM \
  --new --size-gb 50
```

## Attach a managed disk

Using managed disks enables you to focus on your VMs and their disks without worrying about Azure Storage accounts. You can quickly create and attach a managed disk to a VM using the same Azure resource group, or you can create any number of disks and then attach them.


### Attach a new disk to a VM

If you just need a new disk on your VM, you can use the `az vm disk attach` command.

```azurecli
az vm disk attach -g myResourceGroup --vm-name myVM --disk myDataDisk \
  --new --size-gb 50
```

### Attach an existing disk 

In many cases you attach disks that have already been created. You first find the disk id and then pass that to the `az vm disk attach` command. The following example uses a disk created with `az disk create -g myResourceGroup -n myDataDisk --size-gb 50`.

```azurecli
# find the disk id
diskId=$(az disk show -g myResourceGroup -n myDataDisk --query 'id' -o tsv)
az vm disk attach -g myResourceGroup --vm-name myVM --disk $diskId
```

The output looks something like the following (you can use the `-o table` option to any command to format the output in ):

```json
{
  "accountType": "Standard_LRS",
  "creationData": {
    "createOption": "Empty",
    "imageReference": null,
    "sourceResourceId": null,
    "sourceUri": null,
    "storageAccountId": null
  },
  "diskSizeGb": 50,
  "encryptionSettings": null,
  "id": "/subscriptions/<guid>/resourceGroups/rasquill-script/providers/Microsoft.Compute/disks/myDataDisk",
  "location": "westus",
  "name": "myDataDisk",
  "osType": null,
  "ownerId": null,
  "provisioningState": "Succeeded",
  "resourceGroup": "myResourceGroup",
  "tags": null,
  "timeCreated": "2017-02-02T23:35:47.708082+00:00",
  "type": "Microsoft.Compute/disks"
}
```


## Attach an unmanaged disk

Attaching a new disk is quick if you do not mind creating a disk in the same storage account as your VM. Type `azure vm disk attach-new` to create and attach a new GB disk for your VM. If you do not explicitly identify a storage account, any disk you create is placed in the same storage account where your OS disk resides. The following example attaches a `50`GB disk to the VM named `myVM` in the resource group named `myResourceGroup`:

```azurecli
az vm unmanaged-disk attach -g myResourceGroup -n myUnmanagedDisk --vm-name myVM \
  --new --size-gb 50
```

## Connect to the Linux VM to mount the new disk
> [!NOTE]
> This topic connects to a VM using usernames and passwords. To use public and private key pairs to communicate with your VM, see [How to Use SSH with Linux on Azure](mac-create-ssh-keys.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). 
> 
> 

You need to SSH into your Azure VM to partition, format, and mount your new disk so your Linux VM can use it. If you're not familiar with connecting with **ssh**, the command takes the form `ssh <username>@<FQDNofAzureVM> -p <the ssh port>`, and looks like the following:

```bash
ssh ops@mypublicdns.westus.cloudapp.azure.com -p 22
```

Output

```bash
The authenticity of host 'mypublicdns.westus.cloudapp.azure.com (191.239.51.1)' can't be established.
ECDSA key fingerprint is bx:xx:xx:xx:xx:xx:xx:xx:xx:x:x:x:x:x:x:xx.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'mypublicdns.westus.cloudapp.azure.com,191.239.51.1' (ECDSA) to the list of known hosts.
ops@mypublicdns.westus.cloudapp.azure.com's password:
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

ops@myVM:~$
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

To ensure the drive is remounted automatically after a reboot it must be added to the /etc/fstab file. In addition, it is highly recommended that the UUID (Universally Unique IDentifier) is used in /etc/fstab to refer to the drive rather than just the device name (such as, `/dev/sdc1`). If the OS detects a disk error during boot, using the UUID avoids the incorrect disk being mounted to a given location. Remaining data disks would then be assigned those same device IDs. To find the UUID of the new drive, use the **blkid** utility:

```bash
sudo -i blkid
```

The output looks similar to the following:

```bash
/dev/sda1: UUID="11111111-1b1b-1c1c-1d1d-1e1e1e1e1e1e" TYPE="ext4"
/dev/sdb1: UUID="22222222-2b2b-2c2c-2d2d-2e2e2e2e2e2e" TYPE="ext4"
/dev/sdc1: UUID="33333333-3b3b-3c3c-3d3d-3e3e3e3e3e3e" TYPE="ext4"
```

> [!NOTE]
> Improperly editing the **/etc/fstab** file could result in an unbootable system. If unsure, refer to the distribution's documentation for information on how to properly edit this file. It is also recommended that a backup of the /etc/fstab file is created before editing.
> 
> 

Next, open the **/etc/fstab** file in a text editor:

```bash
sudo vi /etc/fstab
```

In this example, we use the UUID value for the new **/dev/sdc1** device that was created in the previous steps, and the mountpoint **/datadrive**. Add the following line to the end of the **/etc/fstab** file:

```bash
UUID=33333333-3b3b-3c3c-3d3d-3e3e3e3e3e3e   /datadrive   ext4   defaults,nofail   1   2
```

> [!NOTE]
> Later removing a data disk without editing fstab could cause the VM to fail to boot. Most distributions provide either the `nofail` and/or `nobootwait` fstab options. These options allow a system to boot even if the disk fails to mount at boot time. Consult your distribution's documentation for more information on these parameters.
> 
> The **nofail** option ensures that the VM starts even if the filesystem is corrupt or the disk does not exist at boot time. Without this option, you may encounter behavior as described in [Cannot SSH to Linux VM due to FSTAB errors](https://blogs.msdn.microsoft.com/linuxonazure/2016/07/21/cannot-ssh-to-linux-vm-after-adding-data-disk-to-etcfstab-and-rebooting/)

### TRIM/UNMAP support for Linux in Azure
Some Linux kernels support TRIM/UNMAP operations to discard unused blocks on the disk. This is primarily useful in standard storage to inform Azure that deleted pages are no longer valid and can be discarded. This can save cost if you create large files and then delete them.

There are two ways to enable TRIM support in your Linux VM. As usual, consult your distribution for the recommended approach:

* Use the `discard` mount option in `/etc/fstab`, for example:

    ```bash
    UUID=33333333-3b3b-3c3c-3d3d-3e3e3e3e3e3e   /datadrive   ext4   defaults,discard   1   2
    ```
* In some cases the `discard` option may have performance implications. Alternatively, you can run the `fstrim` command manually from the command line, or add it to your crontab to run regularly:
  
    **Ubuntu**
  
    ```bash
    sudo apt-get install util-linux
    sudo fstrim /datadrive
    ```
  
    **RHEL/CentOS**

    ```bash
    sudo yum install util-linux
    sudo fstrim /datadrive
    ```

## Troubleshooting
[!INCLUDE [virtual-machines-linux-lunzero](../../../includes/virtual-machines-linux-lunzero.md)]

## Next Steps
* Remember, that your new disk is not available to the VM if it reboots unless you write that information to your [fstab](http://en.wikipedia.org/wiki/Fstab) file.
* To ensure your Linux VM is configured correctly, review the [Optimize your Linux machine performance](optimization.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) recommendations.
* Expand your storage capacity by adding additional disks and [configure RAID](configure-raid.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for additional performance.

