When you no longer need a data disk that's attached to a virtual machine (VM), you can easily detach it. When you detach a disk from the VM, the disk is not removed it from storage. If you want to use the existing data on the disk again, you can reattach it to the same VM, or another one.  

> [!NOTE]
> A VM in Azure uses different types of disks - an operating system disk, a local temporary disk, and optional data disks. For details, see [About Disks and VHDs for Virtual Machines](../articles/storage/storage-about-disks-and-vhds-linux.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). You cannot detach an operating system disk unless you also delete the VM.

## Find the disk
Before you can detach a disk from a VM you need to find out the LUN number, which is an identifier for the disk to be detached. To do that, follow these steps:

1. Open Azure CLI and [connect to your Azure subscription](../articles/xplat-cli-connect.md). Make sure you are in Azure Service Management mode (`azure config mode asm`).
2. Find out which disks are attached to your VM. The following example lists disks for the VM named `myVM`:

    ```azurecli
    azure vm disk list myVM
    ```

    The output is similar to the following example:

    ```azurecli
    * Fetching disk images
    * Getting virtual machines
    * Getting VM disks
      data:    Lun  Size(GB)  Blob-Name                         OS
      data:    ---  --------  --------------------------------  -----
      data:         30        ubuntuVM-2645b8030676c8f8.vhd  Linux
      data:    0    30        myDataDisk.vhd
      info:    vm disk list command OK
    ```

3. Note the LUN or the **logical unit number** for the disk that you want to detach.

## Remove operating system references to the disk
Before detaching the disk from the Linux guest, you should make sure that all partitions on the disk are not in use. Ensure that the operating system does not attempt to remount them after a reboot. These steps undo the configuration you likely created when [attaching](../articles/virtual-machines/linux/classic/attach-disk.md?toc=%2fazure%2fvirtual-machines%2flinux%2fclassic%2ftoc.json) the disk.

1. Use the `lsscsi` command to discover the disk identifier. `lsscsi` can be installed by either `yum install lsscsi` (on Red Hat based distributions) or `apt-get install lsscsi` (on Debian based distributions). You can find the disk identifier you are looking for by using the LUN number. The last number in the tuple in each row is the LUN. In the following example from `lsscsi`, LUN 0 maps to */dev/sdc*

    ```bash
    [1:0:0:0]    cd/dvd  Msft     Virtual CD/ROM   1.0   /dev/sr0
    [2:0:0:0]    disk    Msft     Virtual Disk     1.0   /dev/sda
    [3:0:1:0]    disk    Msft     Virtual Disk     1.0   /dev/sdb
    [5:0:0:0]    disk    Msft     Virtual Disk     1.0   /dev/sdc
    ```

2. Use `fdisk -l <disk>` to discover the partitions associated with the disk to be detached. The following example shows the output for `/dev/sdc`:

    ```bash
    Disk /dev/sdc: 1098.4 GB, 1098437885952 bytes, 2145386496 sectors
    Units = sectors of 1 * 512 = 512 bytes
    Sector size (logical/physical): 512 bytes / 512 bytes
    I/O size (minimum/optimal): 512 bytes / 512 bytes
    Disk label type: dos
    Disk identifier: 0x5a1d2a1a
    
        Device Boot      Start         End      Blocks   Id  System
    /dev/sdc1            2048  2145386495  1072692224   83  Linux
    ```

3. Unmount each partition listed for the disk. The following example unmounts `/dev/sdc1`:

    ```bash
    sudo umount /dev/sdc1
    ```

4. Use the `blkid` command to discovery the UUIDs for all partitions. The output is similar to the following example:

    ```bash
    /dev/sda1: UUID="11111111-1b1b-1c1c-1d1d-1e1e1e1e1e1e" TYPE="ext4"
    /dev/sdb1: UUID="22222222-2b2b-2c2c-2d2d-2e2e2e2e2e2e" TYPE="ext4"
    /dev/sdc1: UUID="33333333-3b3b-3c3c-3d3d-3e3e3e3e3e3e" TYPE="ext4"
    ```

5. Remove entries in the **/etc/fstab** file associated with either the device paths or UUIDs for all partitions for the disk to be detached.  Entries for this example might be:

    ```sh  
   UUID=33333333-3b3b-3c3c-3d3d-3e3e3e3e3e3e   /datadrive   ext4   defaults   1   2
   ```

    or
   
   ```sh   
   /dev/sdc1   /datadrive   ext4   defaults   1   2
   ```

## Detach the disk
After you find the LUN number of the disk and removed the operating system references, you're ready to detach it:

1. Detach the selected disk from the virtual machine by running the command `azure vm disk detach
   <virtual-machine-name> <LUN>`. The following example detaches LUN `0` from the VM named `myVM`:
   
    ```azurecli
    azure vm disk detach myVM 0
    ```

2. You can check if the disk got detached by running `azure vm disk list` again. The following example checks the VM named `myVM`:
   
    ```azurecli
    azure vm disk list myVM
    ```

    The output is similar to the following example, which shows the data disk is no longer attached:

    ```azurecli
    info:    Executing command vm disk list
   
   * Fetching disk images
   * Getting virtual machines
   * Getting VM disks
     data:    Lun  Size(GB)  Blob-Name                         OS
     data:    ---  --------  --------------------------------  -----
     data:         30        ubuntuVM-2645b8030676c8f8.vhd  Linux
     info:    vm disk list command OK
    ```

The detached disk remains in storage but is no longer attached to a virtual machine.

