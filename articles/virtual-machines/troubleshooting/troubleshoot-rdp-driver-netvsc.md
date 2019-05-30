---
title: Troubleshoot a netvsc.sys issue when you connect remotely to a Windows 10 or Windows Server 2016 VM in Azure | Microsoft Docs
description: Learn how to troubleshoot a netsvc.sys-related RDP issue when you connecting to a Windows 10 or Windows Server 2016 VM in Azure.
services: virtual-machines-windows
documentationCenter: ''
author: genlin
manager: cshepard
editor: v-jesits

ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: troubleshooting
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 11/19/2018
ms.author: genli
---

# Cannot connect remotely to a Windows 10 or Windows Server 2016 VM in Azure because of netvsc.sys

This article explains how to troubleshoot an issue in which there is no network connection when you connect to a Windows 10 or Windows Server 2016 Datacenter virtual machine (VM) on a Hyper-V Server 2016 host.

## Symptoms

You cannot connect to an Azure Windows 10 or Windows Server 2016 VM by using Remote Desktop Protocol (RDP). In [Boot diagnostics](boot-diagnostics.md), the screen shows a red cross over the network interface card (NIC). This indicates that the VM has no connectivity after the operating system is fully loaded.

Typically, this issue occurs in Windows [build 14393](https://support.microsoft.com/help/4093120/) and [build 15063](https://support.microsoft.com/help/4015583/). If the version of your operating system is later than these versions, this article does not apply to your scenario. To check the version of the system, open a CMD session in [the Serial Access Console feature](serial-console-windows.md), and then run **Ver**.

## Cause

This issue might occur if the version of the installed netvsc.sys system file is **10.0.14393.594** or **10.0.15063.0**. These versions of netvsc.sys might prevent the system from interacting with the Azure platform.


## Solution

Before you follow these steps, [take a snapshot of the system disk](../windows/snapshot-copy-managed-disk.md) of the affected VM as a backup. To troubleshoot this issue, use the Serial Console or [repair the VM offline](#repair-the-vm-offline) by attaching the system disk of the VM to a recovery VM.


### Use the Serial Console

Connect to [the Serial Console, open a PowerShell instance](serial-console-windows.md), and then follow these steps.

> [!NOTE]
> If the Serial Console is not enabled on your VM, go to the [repair the VM offline](#repair-the-vm-offline) section.

1. Run the following command in a PowerShell instance to get the version of the file (**c:\windows\system32\drivers\netvsc.sys**):

   ```
   (get-childitem "$env:systemroot\system32\drivers\netvsc.sys").VersionInfo.FileVersion
   ```

2. Download the appropriate update to a new or existing data disk that is attached to a working VM from the same region:

   - **10.0.14393.594**: [KB4073562](https://support.microsoft.com/help/4073562) or a later update
   - **10.0.15063.0**: [KB4016240](https://support.microsoft.com/help/4016240) or a later update

3. Detach the utility disk from the working VM, and then attach it to the broken VM.

4. Run the following command to install the update on the VM:

   ```
   dism /ONLINE /add-package /packagepath:<Utility Disk Letter>:\<KB .msu or .cab>
   ```

5. Restart the VM.

### Repair the VM Offline

1. [Attach the system disk to a recovery VM](../windows/troubleshoot-recovery-disks-portal.md).

2. Start a Remote Desktop connection to the recovery VM.

3. Make sure that the disk is flagged as **Online** in the Disk Management console. Note the drive letter that is assigned to the attached system disk.

4. Create a copy of the **\Windows\System32\config** folder in case a rollback on the changes is necessary.

5. On the rescue VM, start Registry Editor (regedit.exe).

6. Select the **HKEY_LOCAL_MACHINE** key, and then select **File** > **Load Hive** from the menu.

7. Locate the SYSTEM file in the **\Windows\System32\config** folder.

8. Select **Open**, type **BROKENSYSTEM** for the name, expand the **HKEY_LOCAL_MACHINE** key, and then locate the additional key that is named **BROKENSYSTEM**.

9. Go to the following location:

   ```
   HKLM\BROKENSYSTEM\ControlSet001\Control\Class\{4d36e972-e325-11ce-bfc1-08002be10318}
   ```

10. In each subkey (such as 0000), examine the **DriverDesc** value that is displayed as **Microsoft HYPER-V Network Adapter**.

11. In the subkey, examine the **DriverVersion** value that is the driver version of the network adapter of the VM.

12. Download the appropriate update:

    - **10.0.14393.594**: [KB4073562](https://support.microsoft.com/help/4073562) or a later update
    - **10.0.15063.0**: [KB4016240](https://support.microsoft.com/help/4016240) or a later update

13. Attach the system disk as a data disk on a rescue VM on which you can download the update.

14. Run the following command to install the update on the VM:

    ```
    dism /image:<OS Disk letter>:\ /add-package /packagepath:c:\temp\<KB .msu or .cab>
    ```

15. Run the following command to unmount the hives:

    ```
    reg unload HKLM\BROKENSYSTEM
    ```

16. [Detach the system disk, and create the VM again](../windows/troubleshoot-recovery-disks-portal.md).

## Need help? Contact support

If you still need help, [contact Azure Support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
