---
title: Troubleshoot Azure VM replication in Azure Site Recovery - protection errors
description: Troubleshoot protection errors when replicating Azure virtual machines for disaster recovery.
ms.service: azure-site-recovery
ms.topic: troubleshooting
ms.date: 12/09/2025
author: Jeronika-MS
ms.author: v-gajeronika 
ms.custom:
  - engagement-fy23
  - sfi-image-nochange
# Customer intent: As a cloud administrator, I want to troubleshoot Azure VM replication errors in Site Recovery so that I can ensure reliable disaster recovery and maintain operational continuity for my organization's virtual machines.
---

# Troubleshoot Azure-to-Azure VM replication errors - protection errors

This article describes how to troubleshoot common errors in Azure Site Recovery during replication and recovery of [Azure virtual machines](azure-to-azure-tutorial-enable-replication.md) (VM) from one region to another. For more information about supported configurations, see the [support matrix for replicating Azure VMs](azure-to-azure-support-matrix.md).

## Multiple disks available for protection (error code 153039)

**Possible causes**

- One or more disks were recently added to the virtual machine after protection.
- One or more disks were initialized after protection of the virtual machine.

**Workaround**

To make the replication status of the VM healthy again, you can choose either to protect the disks or to dismiss the warning.

### Protect the disks

1. Go to **Replicated Items** > _VM name_ > **Disks**.
1. Select the unprotected disk, and then select **Enable replication**:

   :::image type="content" source="./media/azure-to-azure-troubleshoot-errors/add-disk.png" alt-text="Enable replication on VM disks.":::

### Dismiss the warning

1. Go to **Replicated items** > _VM name_.
1. Select the warning in the **Overview** section, and then select **OK**.

   :::image type="content" source="./media/azure-to-azure-troubleshoot-errors/dismiss-warning.png" alt-text="Dismiss new-disk warning.":::

## Unable to select a VM for protection

**Possible cause**

The virtual machine has an extension installed in a failed or unresponsive state

**Workaround**

Go to **Virtual machines** > **Settings** > **Extensions** and check for any extensions in a failed state. Uninstall any failed extension, and then try again to protect the virtual machine.

## Protection not enabled when GRUB uses device name (error code 151126)

**Possible causes**

The Linux Grand Unified Bootloader (GRUB) configuration files (_/boot/grub/menu.lst_, _/boot/grub/grub.cfg_, _/boot/grub2/grub.cfg_, or _/etc/default/grub_) might specify the actual device names instead of universally unique identifier (UUID) values for the `root` and `resume` parameters. Site Recovery requires UUIDs because device names can change. Upon restart, a VM might not come up with the same name on failover, resulting in problems.

The following examples are lines from GRUB files where device names appear instead of the required UUIDs:

- File _/boot/grub2/grub.cfg_:

  `linux /boot/vmlinuz-3.12.49-11-default root=/dev/sda2  ${extra_cmdline} resume=/dev/sda1 splash=silent quiet showopts`

- File: _/boot/grub/menu.lst_

  `kernel /boot/vmlinuz-3.0.101-63-default root=/dev/sda2 resume=/dev/sda1 splash=silent crashkernel=256M-:128M showopts vga=0x314`

**Workaround**

Replace each device name with the corresponding UUID:

1. Find the UUID of the device by executing the command `blkid <device name>`. For example:

   ```shell
   blkid /dev/sda1
   /dev/sda1: UUID="6f614b44-433b-431b-9ca1-4dd2f6f74f6b" TYPE="swap"
   blkid /dev/sda2
   /dev/sda2: UUID="62927e85-f7ba-40bc-9993-cc1feeb191e4" TYPE="ext3"
   ```

1. Replace the device name with its UUID, in the formats `root=UUID=<UUID>` and `resume=UUID=<UUID>`. For example, after replacement, the line from _/boot/grub/menu.lst_ would look like the following line:

   `kernel /boot/vmlinuz-3.0.101-63-default root=UUID=62927e85-f7ba-40bc-9993-cc1feeb191e4 resume=UUID=6f614b44-433b-431b-9ca1-4dd2f6f74f6b splash=silent crashkernel=256M-:128M showopts vga=0x314`

1. Retry the protection.

## Protection failed because GRUB device doesn't exist (error code 151124)

**Possible cause**

The GRUB configuration files (_/boot/grub/menu.lst_, _/boot/grub/grub.cfg_, _/boot/grub2/grub.cfg_, or _/etc/default/grub_) might contain the parameters `rd.lvm.lv` or `rd_LVM_LV`. These parameters identify the Logical Volume Manager (LVM) devices that are to be discovered at boot time. If these LVM devices don't exist, the protected system itself won't boot and will be stuck in the boot process. The same problem will also be seen with the failover VM. Here are few examples:

- File: _/boot/grub2/grub.cfg_ on RHEL7:

  `linux16 /vmlinuz-3.10.0-957.el7.x86_64 root=/dev/mapper/rhel_mup--rhel7u6-root ro crashkernel=128M\@64M rd.lvm.lv=rootvg/root rd.lvm.lv=rootvg/swap rhgb quiet LANG=en_US.UTF-8`

- File: _/etc/default/grub_ on RHEL7:

  `GRUB_CMDLINE_LINUX="crashkernel=auto rd.lvm.lv=rootvg/root rd.lvm.lv=rootvg/swap rhgb quiet`

- File: _/boot/grub/menu.lst_ on RHEL6:

  `kernel /vmlinuz-2.6.32-754.el6.x86_64 ro root=UUID=36dd8b45-e90d-40d6-81ac-ad0d0725d69e rd_NO_LUKS LANG=en_US.UTF-8 rd_NO_MD SYSFONT=latarcyrheb-sun16 crashkernel=auto rd_LVM_LV=rootvg/lv_root  KEYBOARDTYPE=pc KEYTABLE=us rd_LVM_LV=rootvg/lv_swap rd_NO_DM rhgb quiet`

In each example, GRUB has to detect two LVM devices with the names `root` and `swap` from the volume group `rootvg`.

**Workaround**

If the LVM device doesn't exist, either create it or remove the corresponding parameters from the GRUB configuration files. Then, try again to enable protection.

## Protection not enabled if replica managed disk exists

This error occurs when the replica managed disk already exists, without expected tags, in the target resource group.

**Possible cause**

This problem can occur if the virtual machine was previously protected, and when replication was disabled, the replica disk wasn't removed.

**Workaround**

Delete the replica disk identified in the error message and retry the failed protection job.

## Enable protection failed as the installer is unable to find the root disk (error code 151137)

This error occurs for Linux machines where the OS disk is encrypted using Azure Disk Encryption (ADE). This is a valid issue in Agent version 9.35 only.

**Possible Causes**

The installer is unable to find the root disk that hosts the root file-system.

**Workaround**

Perform the following steps to fix this issue.

1. Find the agent bits under the directory _/var/lib/waagent_ on RHEL machines using the below command: <br>

	`# find /var/lib/ -name Micro\*.gz`

   Expected output:

	`/var/lib/waagent/Microsoft.Azure.RecoveryServices.SiteRecovery.LinuxRHEL7-1.0.0.9139/UnifiedAgent/Microsoft-ASR_UA_9.35.0.0_RHEL7-64_GA_30Jun2020_release.tar.gz`

2. Create a new directory and change the directory to this new directory.
3. Extract the Agent file found in the first step here, using the below command:

    `tar -xf <Tar Ball File>`

4. Open the file _prereq_check_installer.json_ and delete the following lines. Save the file after that.

    ```
       {
          "CheckName": "SystemDiskAvailable",
          "CheckType": "MobilityService"
       },
    ```
5. Invoke the installer using the command: <br>

    `./install -d /usr/local/ASR -r MS -q -v Azure`
6. If the installer succeeds, retry the enable replication job.

## Next steps

[Replicate Azure VMs to another Azure region](azure-to-azure-how-to-enable-replication.md).
