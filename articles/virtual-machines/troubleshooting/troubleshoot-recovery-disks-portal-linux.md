---

title: Use a Linux troubleshooting VM in the Azure portal | Microsoft Docs
description: Learn how to troubleshoot Linux virtual machine issues by connecting the OS disk to a recovery VM using the Azure portal
services: virtual-machines-linux
documentationCenter: ''
author: genlin
manager: dcscontentpm
editor: ''

ms.service: virtual-machines-linux

ms.topic: troubleshooting
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 08/19/2019
ms.author: genli

---

# Troubleshoot a Linux VM by attaching the OS disk to a recovery VM using the Azure portal
If your Linux virtual machine (VM) encounters a boot or disk error, you may need to perform troubleshooting steps on the virtual hard disk itself. A common example would be an invalid entry in `/etc/fstab` that prevents the VM from being able to boot successfully. This article details how to use the Azure portal to connect your virtual hard disk to another Linux VM to fix any errors, then re-create your original VM.

## Recovery process overview
The troubleshooting process is as follows:

1. Stop the affected VM.
1. Take a snapshot for the OS disk of the VM.
1. Create a virtual hard disk from the snapshot.
1. Attach and mount the virtual hard disk to another Windows VM for troubleshooting purposes.
1. Connect to the troubleshooting VM. Edit files or run any tools to fix issues on the original virtual hard disk.
1. Unmount and detach the virtual hard disk from the troubleshooting VM.
1. Swap the OS disk for the VM.

> [!NOTE]
> This article does not apply to the VM with unmanaged disk.

## Determine boot issues
Examine the boot diagnostics and VM screenshot to determine why your VM is not able to boot correctly. A common example would be an invalid entry in `/etc/fstab`, or an underlying virtual hard disk being deleted or moved.

Select your VM in the portal and then scroll down to the **Support + Troubleshooting** section. Click **Boot diagnostics** to view the console messages streamed from your VM. Review the console logs to see if you can determine why the VM is encountering an issue. The following example shows a VM stuck in maintenance mode that requires manual interaction:

![Viewing VM boot diagnostics console logs](./media/troubleshoot-recovery-disks-portal-linux/boot-diagnostics-error.png)

You can also click **Screenshot** across the top of the boot diagnostics log to download a capture of the VM screenshot.

## Take a snapshot of the OS Disk
A snapshot is a full, read-only copy of a virtual hard drive (VHD). We recommend that you cleanly shut down the VM before taking a snapshot, to clear out any processes that are in progress. To take a snapshot of an OS disk, follow these steps:

1. Go to [Azure portal](https://portal.azure.com). Select **Virtual machines** from the sidebar, and then select the VM that has problem.
1. On the left pane, select **Disks**, and then select the name of the OS disk.
    ![Image about the name of the OS disk](./media/troubleshoot-recovery-disks-portal-windows/select-osdisk.png)
1. On the **Overview** page of the OS disk, and then select **Create snapshot**.
1. Create a snapshot in the same location as the OS disk.

## Create a disk from the snapshot
To create a disk from the snapshot, follow these steps:

1. Select **Cloud Shell** from the Azure portal.

    ![Image about Open Cloud Shell](./media/troubleshoot-recovery-disks-portal-windows/cloud-shell.png)
1. Run the following PowerShell commands to create a managed disk from the snapshot. You should replace these sample names with the appropriate names.

    ```powershell
    #Provide the name of your resource group
    $resourceGroupName ='myResourceGroup'
    
    #Provide the name of the snapshot that will be used to create Managed Disks
    $snapshotName = 'mySnapshot' 
    
    #Provide the name of theManaged Disk
    $diskName = 'newOSDisk'
    
    #Provide the size of the disks in GB. It should be greater than the VHD file size. In this sample, the size of the snapshot is 127 GB. So we set the disk size to 128 GB.
    $diskSize = '128'
    
    #Provide the storage type for Managed Disk. Premium_LRS or Standard_LRS.
    $storageType = 'Standard_LRS'
    
    #Provide the Azure region (e.g. westus) where Managed Disks will be located.
    #This location should be same as the snapshot location
    #Get all the Azure location using command below:
    #Get-AzLocation
    $location = 'westus'
    
    $snapshot = Get-AzSnapshot -ResourceGroupName $resourceGroupName -SnapshotName $snapshotName 
     
    $diskConfig = New-AzDiskConfig -AccountType $storageType -Location $location -CreateOption Copy -SourceResourceId $snapshot.Id
     
    New-AzDisk -Disk $diskConfig -ResourceGroupName $resourceGroupName -DiskName $diskName
    ```
3. If the commands run successfully, you will see the new disk in the resource group that you provided.

## Attach disk to another VM
For the next few steps, you use another VM for troubleshooting purposes. After you attach the disk to the troubleshooting VM,  you can browse and edit the disk's content. This process allows you to correct any configuration errors or review additional application or system log files. To attach the disk to another VM, follow these steps:

1. Select your resource group from the portal, then select your troubleshooting VM. Select **Disks**, select **Edit**, and then click **Add data disk**:

    ![Attach existing disk in the portal](./media/troubleshoot-recovery-disks-portal-windows/attach-existing-disk.png)

2. In the **Data disks** list, select the OS disk of the VM that you identified. If you do not see the OS disk, make sure that troubleshooting VM and the OS disk is in the same region (location). 
3. Select **Save** to apply the changes.

## Mount the attached data disk

> [!NOTE]
> The following examples detail the steps required on an Ubuntu VM. If you are using a different Linux distro, such as Red Hat Enterprise Linux or SUSE, the log file locations and `mount` commands may be a little different. Refer to the documentation for your specific distro for the appropriate changes in commands.

1. SSH to your troubleshooting VM using the appropriate credentials. If this disk is the first data disk attached to your troubleshooting VM, it is likely connected to `/dev/sdc`. Use `dmseg` to list attached disks:

    ```bash
    dmesg | grep SCSI
    ```
    The output is similar to the following example:

    ```bash
    [    0.294784] SCSI subsystem initialized
    [    0.573458] Block layer SCSI generic (bsg) driver version 0.4 loaded (major 252)
    [    7.110271] sd 2:0:0:0: [sda] Attached SCSI disk
    [    8.079653] sd 3:0:1:0: [sdb] Attached SCSI disk
    [ 1828.162306] sd 5:0:0:0: [sdc] Attached SCSI disk
    ```

    In the preceding example, the OS disk is at `/dev/sda` and the temporary disk provided for each VM is at `/dev/sdb`. If you had multiple data disks, they should be at `/dev/sdd`, `/dev/sde`, and so on.

2. Create a directory to mount your existing virtual hard disk. The following example creates a directory named `troubleshootingdisk`:

    ```bash
    sudo mkdir /mnt/troubleshootingdisk
    ```

3. If you have multiple partitions on your existing virtual hard disk, mount the required partition. The following example mounts the first primary partition at `/dev/sdc1`:

    ```bash
    sudo mount /dev/sdc1 /mnt/troubleshootingdisk
    ```

    > [!NOTE]
    > Best practice is to mount data disks on VMs in Azure using the universally unique identifier (UUID) of the virtual hard disk. For this short troubleshooting scenario, mounting the virtual hard disk using the UUID is not necessary. However, under normal use, editing `/etc/fstab` to mount virtual hard disks using device name rather than UUID may cause the VM to fail to boot.


## Fix issues on original virtual hard disk
With the existing virtual hard disk mounted, you can now perform any maintenance and troubleshooting steps as needed. Once you have addressed the issues, continue with the following steps.

## Unmount and detach original virtual hard disk
Once your errors are resolved, detach the existing virtual hard disk from your troubleshooting VM. You cannot use your virtual hard disk with any other VM until the lease attaching the virtual hard disk to the troubleshooting VM is released.

1. From the SSH session to your troubleshooting VM, unmount the existing virtual hard disk. Change out of the parent directory for your mount point first:

    ```bash
    cd /
    ```

    Now unmount the existing virtual hard disk. The following example unmounts the device at `/dev/sdc1`:

    ```bash
    sudo umount /dev/sdc1
    ```

2. Now detach the virtual hard disk from the VM. Select your VM in the portal and click **Disks**. Select your existing virtual hard disk and then click **Detach**:

    ![Detach existing virtual hard disk](./media/troubleshoot-recovery-disks-portal-windows/detach-disk.png)

    Wait until the VM has successfully detached the data disk before continuing.

## Swap the OS disk for the VM

Azure portal now supports change the OS disk of the VM. To do this, follow these steps:

1. Go to [Azure portal](https://portal.azure.com). Select **Virtual machines** from the sidebar, and then select the VM that has problem.
1. On the left pane, select **Disks**, and then select **Swap OS disk**.
        ![The image about Swap OS disk in Azure portal](./media/troubleshoot-recovery-disks-portal-windows/swap-os-ui.png)

1. Choose the new disk that you repaired, and then type the name of the VM to confirm the change. If you do not see the disk in the list, wait 10 ~ 15 minutes after you detach the disk from the troubleshooting VM. Also make sure that the disk is in the same location as the VM.
1. Select OK.

## Next steps
If you are having issues connecting to your VM, see [Troubleshoot SSH connections to an Azure VM](troubleshoot-ssh-connection.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). For issues with accessing applications running on your VM, see [Troubleshoot application connectivity issues on a Linux VM](../windows/troubleshoot-app-connection.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

For more information about using Resource Manager, see [Azure Resource Manager overview](../../azure-resource-manager/management/overview.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
