---
title: Troubleshoot Linux VM starting issues due to fstab errors | Microsoft Docs
description: Explains why Linux VM cannot start and how to solve the problem.
services: virtual-machines-linux
documentationcenter: ''
author: v-miegge
manager: dcscontentpm
editor: ''
tags: ''

ms.service: virtual-machines-linux
ms.topic: troubleshooting
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: azurecli
ms.date: 10/09/2019
ms.author: v-six

---

# Troubleshoot Linux VM starting issues due to fstab errors

You can't connect to an Azure Linux Virtual Machine (VM) by using a Secure Shell (SSH) connection. When you run the [Boot Diagnostics](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/boot-diagnostics) feature on the [Azure portal](https://portal.azure.com/), you see log entries that resemble the following examples:

## Examples

The following are examples of possible errors.

### Example 1: A disk is mounted by the SCSI ID instead of the universally unique identifier (UUID)

```
[K[[1;31m TIME [0m] Timed out waiting for device dev-incorrect.device.
[[1;33mDEPEND[0m] Dependency failed for /data.
[[1;33mDEPEND[0m] Dependency failed for Local File Systems.
…
Welcome to emergency mode! After logging in, type "journalctl -xb" to viewsystem logs, "systemctl reboot" to reboot, "systemctl default" to try again to boot into default mode.
Give root password for maintenance
(or type Control-D to continue)
```

### Example 2: An unattached device is missing on CentOS

```
Checking file systems…
fsck from util-linux 2.19.1
Checking all file systems.
/dev/sdc1: nonexistent device ("nofail" fstab option may be used to skip this device)
/dev/sdd1: nonexistent device ("nofail" fstab option may be used to skip this device)
/dev/sde1: nonexistent device ("nofail" fstab option may be used to skip this device)

[/sbin/fsck.ext3 (1) — /CODE] sck.ext3 -a /dev/sdc1
fsck.ext3: No such file or directory while trying to open /dev/sdc1

/dev/sdc1:
The superblock could not be read or does not describe a correct ext2
filesystem. If the device is valid and it really contains an ext2
filesystem (and not swap or ufs or something else), then the superblock
is corrupt, and you might try running e2fsck with an alternate superblock:

e2fsck -b 8193 <device>

[/sbin/fsck.xfs (1) — /GLUSTERDISK] fsck.xfs -a /dev/sdd1
/sbin/fsck.xfs: /dev/sdd1 does not exist
[/sbin/fsck.ext3 (1) — /DATATEMP] fsck.ext3 -a /dev/sde1 fsck.ext3: No such file or directory while trying to open /dev/sde1
```

### Example 3: A VM cannot start because of an fstab misconfiguration or because the disk is no longer attached

```
The disk drive for /var/lib/mysql is not ready yet or not present.
Continue to wait, or Press S to skip mounting or M for manual recovery
```

### Example 4: A serial log entry shows an incorrect UUID

```
Checking filesystems
Checking all file systems.
[/sbin/fsck.ext4 (1) — /] fsck.ext4 -a /dev/sda1
/dev/sda1: clean, 70442/1905008 files, 800094/7608064 blocks
[/sbin/fsck.ext4 (1) — /datadrive] fsck.ext4 -a UUID="<UUID>"
fsck.ext4: Unable to resolve UUID="<UUID>"
[FAILED

*** An error occurred during the file system check.
*** Dropping you to a shell; the system will reboot
*** when you leave the shell.
*** Warning — SELinux is active
*** Disabling security enforcement for system recovery.
*** Run 'setenforce 1' to reenable.
type=1404 audit(1428047455.949:4): enforcing=0 old_enforcing=1 auid=<AUID> ses=4294967295
Give root password for maintenance
(or type Control-D to continue)
```

This problem may occur if the file systems table (fstab) syntax is incorrect or if a required data disk that is mapped to an entry in the "/etc/fstab" file is not attached to the VM.

## Resolution

To resolve this problem, start the VM in emergency mode by using the serial console for Azure Virtual Machines. Then use the tool to repair the file system. If the serial console isn't enabled on your VM, go to the [Repair the VM offline](#repair-the-vm-offline) section.

## Use the serial console

### Using Single User Mode

1. Connect to [the serial console](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/serial-console-linux).
2. Use serial console to take single user mode [single user mode](https://docs.microsoft.com/azure/virtual-machines/linux/serial-console-grub-single-user-mode)
3. Once the vm has booted into single user mode. Use your favorite text editor to open the fstab file. 

   ```
   # nano /etc/fstab
   ```

4. Review the listed file systems. Each line in the fstab file indicates a file system that is mounted when the VM starts. For more information about the syntax of the fstab file, run the man fstab command. To troubleshoot a start failure, review each line to make sure that it's correct in both structure and content.

   > [!Note]
   > * Fields on each line are separated by tabs or spaces. Blank lines are ignored. Lines that have a number sign (#) as the first character are comments. Commented lines can remain in the fstab file, but they won't be processed. We recommend that you comment fstab lines that you're unsure about instead of removing the lines.
   > * For the VM to recover and start, the file system partitions should be the only required partitions. The VM may experience application errors about additional commented partitions. However, the VM should start without the additional partitions. You can later uncomment any commented lines.
   > * We recommend that you mount data disks on Azure VMs by using the UUID of the file system partition. For example, run the following command: ``/dev/sdc1: LABEL="cloudimg-rootfs" UUID="<UUID>" TYPE="ext4" PARTUUID="<PartUUID>"``
   > * To determine the UUID of the file system, run the blkid command. For more information about the syntax, run the man blkid command.
   > * The nofail option helps make sure that the VM starts even if the file system is corrupted or the file system doesn't exist at startup. We recommend that you use the nofail option in the fstab file to enable startup to continue after errors occur in partitions that are not required for the VM to start.

5. Change or comment out any incorrect or unnecessary lines in the fstab file to enable the VM to start correctly.

6. Save the changes to the fstab file.

7. Reboot the vm using the below command.
   
   ```
   # reboot -f
   ```
> [!Note]
   > You can also use "ctrl+x" command which would also reboot the vm.


8. If the entries comment or fix was successful, the system should reach a bash prompt in the portal. Check whether you can connect to the VM.

### Using Root Password

1. Connect to [the serial console](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/serial-console-linux).
2. Sign-in to the system by using a local user and password.

   > [!Note]
   > You can't use an SSH key to sign in to the system in the serial console.

3. Look for the error that indicates that the disk wasn't mounted. In the following example, the system was trying to attach a disk that was no longer present:

   ```
   [DEPEND] Dependency failed for /datadisk1.
   [DEPEND] Dependency failed for Local File Systems.
   [DEPEND] Dependency failed for Relabel all filesystems, if necessary.
   [DEPEND] Dependency failed for Migrate local... structure to the new structure.
   Welcome to emergency mode! After logging in, type "journalctl -xb" to view
   system logs, "systemctl reboot" to reboot, "systemctl default" or ^D to try again to boot into default mode.
   Give root password for maintenance
   (or type Control-D to continue):
   ```

4. Connect to the VM by using the root password (Red Hat-based VMs).

5. Use your favorite text editor to open the fstab file. After the disk is mounted, run the following command for Nano:

   ```
   $ nano /mnt/troubleshootingdisk/etc/fstab
   ```

6. Review the listed file systems. Each line in the fstab file indicates a file system that is mounted when the VM starts. For more information about the syntax of the fstab file, run the man fstab command. To troubleshoot a start failure, review each line to make sure that it's correct in both structure and content.

   > [!Note]
   > * Fields on each line are separated by tabs or spaces. Blank lines are ignored. Lines that have a number sign (#) as the first character are comments. Commented lines can remain in the fstab file, but they won't be processed. We recommend that you comment fstab lines that you're unsure about instead of removing the lines.
   > * For the VM to recover and start, the file system partitions should be the only required partitions. The VM may experience application errors about additional commented partitions. However, the VM should start without the additional partitions. You can later uncomment any commented lines.
   > * We recommend that you mount data disks on Azure VMs by using the UUID of the file system partition. For example, run the following command: ``/dev/sdc1: LABEL="cloudimg-rootfs" UUID="<UUID>" TYPE="ext4" PARTUUID="<PartUUID>"``
   > * To determine the UUID of the file system, run the blkid command. For more information about the syntax, run the man blkid command.
   > * The nofail option helps make sure that the VM starts even if the file system is corrupted or the file system doesn't exist at startup. We recommend that you use the nofail option in the fstab file to enable startup to continue after errors occur in partitions that are not required for the VM to start.

7. Change or comment out any incorrect or unnecessary lines in the fstab file to enable the VM to start correctly.

8. Save the changes to the fstab file.

9. Restart the virtual machine.

10. If the entries comment or fix was successful, the system should reach a bash prompt in the portal. Check whether you can connect to the VM.

11. Check your mount points when you test any fstab change by running the mount –a command. If there are no errors, your mount points should be good.

## Repair the VM offline

1. Attach the system disk of the VM as a data disk to a recovery VM (any working Linux VM). To do this, you can use [CLI commands](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/troubleshoot-recovery-disks-linux) or you can automate setting up the recovery VM using the [VM repair commands](repair-linux-vm-using-azure-virtual-machine-repair-commands.md).

2. After you mount the system disk as a data disk on the recovery VM, back up the fstab file before you make changes, and then follow the next steps to correct the fstab file.

3.    Look for the error that indicates the disk wasn't mounted. In the following example, the system was trying to attach a disk that was no longer present:

    ```
    [DEPEND] Dependency failed for /datadisk1.
    [DEPEND] Dependency failed for Local File Systems.
    [DEPEND] Dependency failed for Relabel all filesystems, if necessary.
    [DEPEND] Dependency failed for Migrate local... structure to the new structure.
    Welcome to emergency mode! After logging in, type "journalctl -xb" to view system logs, "systemctl reboot" to reboot, "systemctl default" or ^D to try again to boot into default mode.
    Give root password for maintenance (or type Control-D to continue):
    ```

4. Connect to the VM by using the root password (Red Hat-based VMs).

5. Use your favorite text editor to open the fstab file. After the disk is mounted, run the following command for Nano. Make sure that you're working on the fstab file that is located on the mounted disk and not the fstab file that's on the rescue VM.

   ```
   $ nano /mnt/troubleshootingdisk/etc/fstab
   ```

6. Review the listed file systems. Each line in the fstab file indicates a file system that is mounted when the VM starts. For more information about the syntax of the fstab file, run the man fstab command. To troubleshoot a start failure, review each line to make sure that it's correct in both structure and content.

   > [!Note]
   > * Fields on each line are separated by tabs or spaces. Blank lines are ignored. Lines that have a number sign (#) as the first character are comments. Commented lines can remain in the fstab file, but they won't be processed. We recommend that you comment fstab lines that you're unsure about instead of removing the lines.
   > * For the VM to recover and start, the file system partitions should be the only required partitions. The VM may experience application errors about additional commented partitions. However, the VM should start without the additional partitions. You can later uncomment any commented lines.
   > * We recommend that you mount data disks on Azure VMs by using the UUID of the file system partition. For example, run the following command: ``/dev/sdc1: LABEL="cloudimg-rootfs" UUID="<UUID>" TYPE="ext4" PARTUUID="<PartUUID>"``
   > * To determine the UUID of the file system, run the blkid command. For more information about the syntax, run the man blkid command. Notice that the disk that you want to recover is now mounted on a new VM. Although the UUIDs should be consistent, the device partition IDs (for example, "/dev/sda1") are different on this VM. The file system partitions of the original failing VM that are located on a non-system VHD are not available to the recovery VM [using CLI commands](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/troubleshoot-recovery-disks-linux).
   > * The nofail option helps make sure that the VM starts even if the file system is corrupted or the file system doesn't exist at startup. We recommend that you use the nofail option in the fstab file to enable startup to continue after errors occur in partitions that are not required for the VM to start.

7. Change or comment out any incorrect or unnecessary lines in the fstab file to enable the VM to start correctly.

8. Save the changes to the fstab file.

9. Restart the virtual machine or rebuild the original VM.

10. If the entries comment or fix was successful, the system should reach a bash prompt in the portal. Check whether you can connect to the VM.

11. Check your mount points when you test any fstab change by running the mount –a command. If there are no errors, your mount points should be good.

12. Unmount and detach the original virtual hard disk, and then create a VM from the original system disk. To do this, you can use [CLI commands](troubleshoot-recovery-disks-linux.md) or the [VM repair commands](repair-linux-vm-using-azure-virtual-machine-repair-commands.md) if you used them to create the recovery VM.

13. After you create the VM again and you can connect to it through SSH, take the following actions:
    * Review any of the fstab lines that were changed or commented out during the recovery.
    * Make sure that you're using UUID and the nofail option appropriately.
    * Test any fstab changes before you restart the VM. To do this, use the following command: ``$ sudo mount -a``
    * Create an additional copy of the corrected fstab file for use in future recovery scenarios.

## Next steps

* [Troubleshoot a Linux VM by attaching the OS disk to a recovery VM with the Azure CLI 2.0](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-linux-troubleshoot-recovery-disks)
* [Troubleshoot a Linux VM by attaching the OS disk to a recovery VM using the Azure portal](https://docs.microsoft.com/azure/virtual-machines/linux/troubleshoot-recovery-disks-portal)
