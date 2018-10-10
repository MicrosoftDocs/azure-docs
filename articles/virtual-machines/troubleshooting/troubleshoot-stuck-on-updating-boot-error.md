---
title: Azure VM startup is stuck on Windows update| Microsoft Docs
description: Learn how to troubleshoot the issue in which Azure VM startup is stuck on on Windows update.
services: virtual-machines-windows
documentationCenter: ''
authors: genli
manager: cshepard
editor: v-jesits

ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: troubleshooting
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 10/09/2018
ms.author: genli
---

# Azure VM startup is stuck on Windows update

This article helps you resolve the issue when your Virtual Machine (VM) is stuck on the Windows update stage during startup. 

> [!NOTE] 
> Azure has two different deployment models for creating and working with resources: [Resource Manager and classic](../../azure-resource-manager/resource-manager-deployment-model.md). This article covers using the Resource Manager deployment model. We recommend that you use this model for new deployments instead of using the classic deployment model.

 ## Symptom

 A Windows VM doesn't start. When you check the screenshots in the [Boot diagnostics](../windows/boot-diagnostics.md) window, you see the startup is stuck on the update process. The following are the sample messages you may see in the screenshots:

- Working on updates 85% complete. Don’t turn off your computer.
- Installing Windows 67%. Don't turn off your PC. This will take a while. Your PC will restart several times
- Error C01A001D applying update operations 25875 of 53017 (\Regist...)
- Failure configuring Windows Updates. Reverting changes. Do not turn off your computer.


- Enter the password to unlock this drive [ ] Press the Insert Key to see the password as you type.
- Enter your recovery key Load your recovery key from a USB device.

## Solution

Depending on the number of updates that are installing or rollbacking, the update process could take some time. Leave the VM in this state for 8 hours. If the VM is still in this state, restart the VM from the Azure portal and see if it can start normally. If this step does not work, try the following solution.

**Note**

- The number of hours has direct relation with the amount of update that were pushed to the VM. The bigger the number of updates, the more time the machine will need to proceed with the installation.

- At the same time, the bigger the amount of updates are installed at once, the bigger the chance to end up on OS corruption and the VM may need to roll back the update and that will double or more the time for the OS to become available again. 

### Remove the update that causes the problem

1. Take a snapshot of the OS disk of the affected VM as a backup. For more information, see [Snapshot a disk](../windows/snapshot-copy-managed-disk.md). 
2. [Attach the OS disk to a recovery VM](troubleshoot-recovery-disks-portal-windows.md). 
3. Get the list of the update packages on the attach OS disk

        dism /image:<Attached OS disk>:\ /get-packages > c:\temp\Patch_level.txt

    For exmaple, If the driver leter that is assgined to the attachde od sik is F, run the following command:

        dism /image:F:\ /get-packages > c:\temp\Patch_level.txt
4. Open the C:\temp\Patch_level.txt file, and then read it from the bottom up. Locate the update that the state is **Install Pending** or **Uninstall Pending**.  The following is a sample of the update status:

     ```
    Package Identity : Package_for_RollupFix~31bf3856ad364e35~amd64~~17134.345.1.5
    State : Install Pending
    Release Type : Security Update
    Install Time :
    ```
5. Remove the updates that caused the problem:
    
    ```
    dism /Image:<<BROKEN DISK LETTER>>:\ /Remove-Package /PackageName:<<PACKAGE NAME TO DELETE>>
    ```
    Example: 

    ```
    dism /Image:F:\ /Remove-Package /Package_for_RollupFix~31bf3856ad364e35~amd64~~17134.345.1.5
    ```
Note: Depend on the size of the paackage, DISk tool will take some time to process unintalling. Ususally the process will be completed within 16 minutes.
6. Once this has been completed, detach the OS disk, and then [rebuild the VM using the OS Disk](troubleshoot-recovery-disks-portal-windows.md). 
