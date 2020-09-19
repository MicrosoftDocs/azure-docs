---
title: Expand virtual hard disks on a Linux VM 
description: Learn how to expand virtual hard disks on a Linux VM with the Azure CLI.
author: roygara
ms.service: virtual-machines-linux
ms.topic: how-to
ms.date: 09/18/2020 
ms.author: rogarana
ms.subservice: disks
---

# Expand virtual hard disks on a Linux VM with the Azure CLI

This article describes how to expand managed disks for a Linux virtual machine (VM) with the Azure CLI. The default virtual hard disk size for the operating system (OS) is typically 30 GB on a Linux VM in Azure. You can [add data disks](add-disk.md) to provide for additional storage space, and you can also expand an existing data disk.

> [!WARNING]
> Always make sure that your filesystem is in a healthy state, your disk partition table type will support the new size, and ensure your data is backed up before you perform disk resize operations. For more information, see [Back up Linux VMs in Azure](tutorial-backup-vms.md). 

## Expand an Azure OS Disk
Make sure that you have the latest [Azure CLI](/cli/azure/install-az-cli2) installed and are signed in to an Azure account by using [az login](/cli/azure/reference-index#az-login).

This article requires an existing VM in Azure with at least one data disk attached and prepared. If you do not already have a VM that you can use, see [Create and prepare a VM with data disks](tutorial-manage-disks.md#create-and-attach-disks).

In the following samples, replace example parameter names such as *myResourceGroup* and *myVM* with your own values.

1. Resize operations on virtual hard disks can't be performed with the VM running. Deallocate your VM with [az vm deallocate](/cli/azure/vm#az-vm-deallocate). The following example deallocates the VM named *myVM* in the resource group named *myResourceGroup*:

    ```azurecli
    az vm deallocate --resource-group myResourceGroup --name myVM
    ```

    > [!NOTE]
    > The VM must be deallocated to expand the virtual hard disk. Stopping the VM with `az vm stop` does not release the compute resources. To release compute resources, use `az vm deallocate`.

1. View a list of managed disks in a resource group with [az disk list](/cli/azure/disk#az-disk-list). The following example displays a list of managed disks in the resource group named *myResourceGroup*:

    ```azurecli
    az disk list \
        --resource-group myResourceGroup \
        --query '[*].{Name:name,Gb:diskSizeGb,Tier:accountType}' \
        --output table
    ```

    Expand the required disk with [az disk update](/cli/azure/disk#az-disk-update). The following example expands the managed disk named *myDataDisk* to *100* GB:

    ```azurecli
    az disk update \
        --resource-group myResourceGroup \
        --name myDataDisk \
        --size-gb 100
    ```

    > [!NOTE]
    > When you expand a managed disk, the updated size is rounded up to the nearest managed disk size. For a table of the available managed disk sizes and tiers, see [Azure Managed Disks Overview - Pricing and Billing](../managed-disks-overview.md).

1. Start your VM with [az vm start](/cli/azure/vm#az-vm-start). The following example starts the VM named *myVM* in the resource group named *myResourceGroup*:

    ```azurecli
    az vm start --resource-group myResourceGroup --name myVM
    ```
    
   SSH to your VM with the appropriate credentials. You can see the public IP address of your VM with [az vm show](/cli/azure/vm#az-vm-show):

    ```azurecli
    az vm show --resource-group myResourceGroup --name myVM -d --query [publicIps] --output tsv
    ```
    
   If your VM has been created using Ubuntu 18.04 or SLES 15 SP2 or CentOS 8.2 or Debian 10 or Oracle Linux 8.2 image from Azure marketplace, root partition will be automatically extended with OS disk resize operation.

    ```bash
    Example: OS disk resized from 30G to 100G
    df -h
    Filesystem      Size  Used Avail Use% Mounted on
    udev            3.9G     0  3.9G   0% /dev
    tmpfs           797M  648K  796M   1% /run
    /dev/sdb1        97G  1.4G   96G   2% /
    tmpfs           3.9G     0  3.9G   0% /dev/shm
    tmpfs           5.0M     0  5.0M   0% /run/lock
    tmpfs           3.9G     0  3.9G   0% /sys/fs/cgroup
    /dev/sdb15      105M  3.6M  101M   4% /boot/efi
    /dev/sda1        16G   45M   15G   1% /mnt
    tmpfs           797M     0  797M   0% /run/user/1000
    ```
## Expand OS disk partition and filesystem (XFS/LVM)

This section of the article describes a scenario where you need to expand the underlying partition and filesystem of type XFS based on LVM. While it's possible to customize how big the expanded disk size can be, in this example we expand the disk to fill the entire free space that is available on disk. The detailed procedure to accomplish this follows:

1. Elevate your user privileges to perform the next set of operations, enter your password if required.

    ```bash
    sudo -s
    ```

2. Find the partition number of the partition you want to resize using the `lsblk` command, which should show something similar to the following output:

    ```bash
    NAME              MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
    NAME              MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
    sda                 8:0    0   16G  0 disk
    `-sda1              8:1    0   16G  0 part /mnt
    sdb                 8:16   0  100G  0 disk
    |-sdb1              8:17   0  500M  0 part /boot
    |-sdb2              8:18   0   63G  0 part
    | |-rootvg-tmplv  253:0    0    2G  0 lvm  /tmp
    | |-rootvg-usrlv  253:1    0   46G  0 lvm  /usr
    | |-rootvg-homelv 253:2    0    1G  0 lvm  /home
    | |-rootvg-varlv  253:3    0    8G  0 lvm  /var
    | `-rootvg-rootlv 253:4    0    2G  0 lvm  /
    |-sdb14             8:30   0    4M  0 part
    `-sdb15             8:31   0  495M  0 part /boot/efi
    ```

3. Find the maximum free space available to us on the device we want to resize - in this example,  `/dev/sdb` -  using the following command:

    ```bash
    parted /dev/sdb unit GB print free | grep  'Free Space' | tail  -n1 | awk '{print $3}'
    ```

    This should produce output similar to this, which reveals the total free space available to us on `/dev/sdb`:
    ```bash
    36.00GB
    ```

4. Next, we note down the start sector of the partition you want to expand. We can do this using `fdisk`, an interactive command that performs a number of different functions depending on the menu option you choose. Running `fdisk /dev/sdb` should produce something similar to the following output:

    ```bash
    Welcome to fdisk (util-linux 2.32.1).
    Changes will remain in memory only, until you decide to write them.
    Be careful before using the write command.

    Command (m for help):
    ```

    Enter `p` at the command prompt to list all all partitions measured by sectors they span on the disk:
    ```bash
    Disk /dev/sdb: 100 GiB, 107374182400 bytes, 209715200 sectors
    Units: sectors of 1 * 512 = 512 bytes
    Sector size (logical/physical): 512 bytes / 4096 bytes
    I/O size (minimum/optimal): 4096 bytes / 4096 bytes
    Disklabel type: gpt
    Disk identifier: B8265C8F-141E-4E0B-B7DE-9DE6F75CCF40
    
    Device       Start       End   Sectors  Size Type
    /dev/sdb1  1026048   2050047   1024000  500M Linux filesystem
    /dev/sdb2  2050048 134215679 132165632   63G Linux filesystem
    /dev/sdb14    2048     10239      8192    4M BIOS boot
    /dev/sdb15   10240   1024000   1013761  495M EFI System
    ```

5. From the output of the `fdisk` command we can see the starting sector for the partition that we want to expand (partition number 2) is `2050048`. Following this partition is a bunch of unallocated empty space that we can use to expand the partition into. The last sector of this empty space we can use to expand is `209715166`. Using these two bits of information we can now proceed to the next step of actually expanding the partition.

6. To begin the process of expanding the partition, launch `fdisk /dev/sdb` and delete the `sdb2` partition first by issuing the `d` command and entering `2` as the partition number:

    ```bash
    Command (m for help): d
    Partition number (1,2,14,15, default 15): 2
    ```

    This should now reflect in the output:

    ```bash
    Partition 2 has been deleted.
    ```

7. Next, use the `n` command to create a new partition and enter `2` as the partition number:

    ```bash
    Command (m for help): n
    Partition number (2-13,16-128, default 2): 2
    First sector (2050048-209715166, default 2050048): 2050048
    Last sector, +sectors or +size{K,M,G,T,P} (2050048-209715166, default 209715166): 209715166
    ```

    To leave the filesystem signature as it is, enter `N` when the command asks if you want to remove the signature, then commit the changes made to the partition table so far using the `w` command to make the previous edits permanent:

    ```bash
    Do you want to remove the signature? [Y]es/[N]o: N

    Command (m for help): w

    The partition table has been altered.
    Syncing disks.
    ```

    If the operation was successful, the output should now show a preview of the resized partition:

    ```bash
    Command (m for help): p
    Device       Start       End   Sectors  Size Type
    /dev/sdb1  1026048   2050047   1024000  500M Linux filesystem
    /dev/sdb2  2050048 209715166 207665119   99G Linux filesystem
    /dev/sdb14    2048     10239      8192    4M BIOS boot
    /dev/sdb15   10240   1024000   1013761  495M EFI System
    ```
8. Next, propagate the partition table changes down to the physical volume using the `pvresize` command:

    ```bash
    pvresize /dev/sdb2
    Physical volume "/dev/sdb2" changed
    1 physical volume(s) resized or updated / 0 physical volume(s) not resized
    ```

9. Double-check the volume group size, here we see there is 40.02GB of free space available for expansion:

    ```bash
    vgs
    VG     #PV #LV #SN Attr   VSize   VFree
    rootvg   1   5   0 wz--n- <63.02g <40.02g
    ```

  10. Find the path to the desired volume you want to resize using the `df` command:

         ```bash
        df -hT | grep mapper
        /dev/mapper/rootvg-rootlv xfs       2.0G   71M   2.0G   4% /
        /dev/mapper/rootvg-usrlv  xfs        46G  1.5G  44.6G   3% /usr
        /dev/mapper/rootvg-tmplv  xfs       2.0G   47M   2.0G   3% /tmp
        /dev/mapper/rootvg-varlv  xfs       8.0G  340M   7.7G   5% /var
        /dev/mapper/rootvg-homelv xfs      1014M   40M   975M   4% /home
        ```

11. For this example, let's assign the 40GB of available free space to the `rootvg-rootlv` volume expanding it from 2GB to 42GB. We can use the `lvextend` command to do this which produce output similar to this:

    ```bash
    lvextend -l +100%FREE /dev/mapper/rootvg-rootlv
    Size of logical volume rootvg/rootlv changed from 2.00 GiB (512 extents) to <42.02 GiB (10757 extents).
    Logical volume rootvg/rootlv successfully resized.
    ```
12. Finally, grow the XFS filesystem to match the new volume size using the `xfs_growfs /` command, where `/` is the mount point of the newly resized volume `rootvg-rootlv`. This should produce an output like so:

    ```bash
    xfs_growfs /
    meta-data=/dev/mapper/rootvg-rootlv isize=512    agcount=4, agsize=131072 blks
             =                       sectsz=4096  attr=2, projid32bit=1
             =                       crc=1        finobt=1, sparse=1, rmapbt=0
             =                       reflink=1
    data     =                       bsize=4096   blocks=524288, imaxpct=25
             =                       sunit=0      swidth=0 blks
    naming   =version 2              bsize=4096   ascii-ci=0, ftype=1
    log      =internal log           bsize=4096   blocks=2560, version=2
             =                       sectsz=4096  sunit=1 blks, lazy-count=1
    realtime =none                   extsz=4096   blocks=0, rtextents=0
    data blocks changed from 524288 to 11015168
    ```

That's it!

The resize operation is now complete and the disk should now have successfully expanded to the maximum free space available. You can verify the disk space of the newly resized partition and volume using `lsblk`:

```bash
    NAME              MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
    sda                 8:0    0   16G  0 disk
    `-sda1              8:1    0   16G  0 part /mnt
    sdb                 8:16   0  100G  0 disk
    |-sdb1              8:17   0  500M  0 part /boot
    |-sdb2              8:18   0   99G  0 part
    | |-rootvg-tmplv  253:0    0    2G  0 lvm  /tmp
    | |-rootvg-usrlv  253:1    0   46G  0 lvm  /usr
    | |-rootvg-homelv 253:2    0    1G  0 lvm  /home
    | |-rootvg-varlv  253:3    0    8G  0 lvm  /var
    | `-rootvg-rootlv 253:4    0   42G  0 lvm  /
    |-sdb14             8:30   0    4M  0 part
    `-sdb15             8:31   0  495M  0 part /boot/efi
```
From the output, we can see `/dev/sdb2` has increased in size from 63GB at the start of this article to 99GB and the `rootvg-rootlv` volume has increased in size from 2GB to 42GB.

## Expand data disk partition and filesystem (non-XFS)
This section of the document deals with expanding disk partition and filesystem on non-XFS filesystems, for example EXT4.

1. Expand the underlying partition and filesystem.

    a. If the disk is already mounted, unmount it:

    ```bash
    sudo umount /dev/sdc1
    ```

    b. Use `parted` to view disk information and resize the partition:

    ```bash
    sudo parted /dev/sdc
    ```

    View information about the existing partition layout with `print`. The output is similar to the following example, which shows the underlying disk is 215 GB:

    ```bash
    GNU Parted 3.2
    Using /dev/sdc1
    Welcome to GNU Parted! Type 'help' to view a list of commands.
    (parted) print
    Model: Unknown Msft Virtual Disk (scsi)
    Disk /dev/sdc1: 215GB
    Sector size (logical/physical): 512B/4096B
    Partition Table: loop
    Disk Flags:

    Number  Start  End    Size   File system  Flags
        1      0.00B  107GB  107GB  ext4
    ```

    c. Expand the partition with `resizepart`. Enter the partition number, *1*, and a size for the new partition:

    ```bash
    (parted) resizepart
    Partition number? 1
    End?  [107GB]? 215GB
    ```

    d. To exit, enter `quit`.

1. With the partition resized, verify the partition consistency with `e2fsck`:

    ```bash
    sudo e2fsck -f /dev/sdc1
    ```

1. Resize the filesystem with `resize2fs`:

    ```bash
    sudo resize2fs /dev/sdc1
    ```
1. Mount the partition to the desired location, such as `/datadrive`:

    ```bash
    sudo mount /dev/sdc1 /datadrive
    ```

1. To verify the data disk has been resized, use `df -h`. The following example output shows the data drive */dev/sdc1* is now 200 GB:

    ```bash
    Filesystem      Size   Used  Avail Use% Mounted on
    /dev/sdc1        197G   60M   187G   1% /datadrive

## Next steps
* If you need additional storage, you can also [add data disks to a Linux VM](add-disk.md).
* For more information about disk encryption, see [Azure Disk Encryption for Linux VMs](disk-encryption-overview.md).
