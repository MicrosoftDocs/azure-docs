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

 A Windows VM doesn't start. When you check the screenshots in the [Boot diagnostics](../windows/boot-diagnostics.md) window, you see the startup is stuck on the update process.

one of the following messages:

- Working on updates ##% complete. Don’t turn off your computer.
-  Installing Windows ##%. Don't turn off your PC. This will take a while. Your PC will restart several times
-  Error XXXXXXXX applying update operations ##### of ##### (\Regist...)
- Failure configuring Windows Updates. Reverting changes. Do not turn off your computer.
- You’re locked out! Enter the recovery key to get going again (Keyboard Layout: US) The wrong sign-in info has been entered too many times, so your PC was locked to protect your privacy. To retrieve the recovery key, go to http://windows.microsoft.com/recoverykeyfaq from another PC or mobile device. In case you need it, the key ID is XXXXXXX. Or, you can reset your PC.

- Enter the password to unlock this drive [ ] Press the Insert Key to see the password as you type.
- Enter your recovery key Load your recovery key from a USB device.

## Solution


Depending on the number of updates that are installing or rollbacking, the update process could take some time. Try not to break this process and leave the VM in this state while the OS attempts to recover itself. If after 8 hours, the VM is still in this state, restart the VM from the Azure portal. If this step does not work, try the following solution.
Note: 
•	The number of hours has direct relation with the amount of update that were pushed to the VM. The bigger the number of updates, the more time the machine will need to proceed with the installation.
•	At the same time, the bigger the amount of updates are installed at once, the bigger the chance to end up on OS corruption and the VM may need to roll back the update and that will double or more the time for the OS to become available again. 


