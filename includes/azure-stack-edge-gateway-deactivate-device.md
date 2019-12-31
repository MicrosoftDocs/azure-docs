---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 12/31/2019
ms.author: alkohli
---

To reset your device, you need to securely wipe out all the data on the data disk and the boot disk of your device. The boot disk contains the device configuration.

Use the `Reset-HcsAppliance` cmdlet to wipe out both the data disks and the boot disk. 

If you use the device reset in the local web UI, the data disks and the boot disk are also securely wiped. 

1. [Connect to the PowerShell interface](#connect-to-the-powershell-interface).
2. If you want to reset the device just as you would from local web UI and securely erase your data disks as well as OS disk (boot disk), then type: 

    `Reset-HcsAppliance -UseDefaults`

    If you want the data to be securely erased from your OS disk and data disks and the device to not boot up after reset, type: 

    `Reset-HcsAppliance -SecureWipeBootDisk -SecureWipeDataDisks -MakeNonBootable`

3. The secure data erasure event is captured in the Azure Stack Edge device logs. To get these logs, type: 

    `Get-HcsNodeSecureEraseLogs -OutPutFolderPath \\<Output path for the log file> -Credential $c`

