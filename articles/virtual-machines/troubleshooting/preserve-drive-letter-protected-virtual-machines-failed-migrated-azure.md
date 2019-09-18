---
title: Preserve the drive letter for protected virtual machines that are failed over or migrated to Azure| Microsoft Docs
description: A technique that you can use to maintain the drive letters of attached storage devices when you import or migrate a VM that is protected by Azure Site Recovery (ASR) to Azure.
services: virtual-machines-windows, azure-resource-manager
documentationcenter: ''
author: v-miegge
manager: dcscontentpm
editor: ''
tags: top-support-issue, azure-resource-manager

ms.service: virtual-machines-windows
ms.workload: na
ms.tgt_pltfrm: vm-windows

ms.topic: troubleshooting
ms.date: 09/18/2019
ms.author: v-miegge
---

# Preserve the drive letter for protected virtual machines that are failed over or migrated to Azure

When you fail over or migrate a virtual machine (VM) from an on-premises location to Microsoft Azure, the drive letters of additional data disks may change from their previous values. This article describes a technique that you can use to maintain the drive letters of attached storage devices when you import or migrate a VM that is protected by Azure Site Recovery (ASR) to Azure.

By default, Azure virtual machines are assigned to drive D for use as temporary storage. This drive assignment causes all other attached storage drive assignments to increment by one letter.

For example, if your on-premises installation uses a data disk that is assigned to drive D for application installations, the assignment for this drive increments to drive E after you import the VM to Azure. To prevent this automatic assignment, you can set the storage area network (SAN) policy to **OnlineAll**. This setting causes Azure to assign the next free drive letter to its temporary volume. In this situation, the data drive maintains the drive D designation, and the Azure temporary drive is assigned drive E.

## More Information

By setting the SAN policy to **OnlineAll**, you can assure that the drive letter is maintained when the virtual machine starts to run in Azure. 

To view the current SAN policy from the guest system, follow these steps:

1. On the VM (not on the host server), open an elevated Command Prompt window.
2. Type `diskpart`.
3. Type `SAN`.

If the drive letter of the guest operating system is not maintained, this command returns either **Offline All** or **Offline Shared**.

To make sure that all disks are brought online and are both readable and writeable, set the SAN policy to **OnlineAll**. To do this, run the following command at the **DISKPART** prompt:

``SAN POLICY=ONLINEALL``

After you make this change, wait for the **Copy Frequency** (Recovery Point Objective) value to be configured to make sure that the changes are replicated to Azure. Then run a test failover to verify whether the drive letters are preserved.

## References

For more information about temporary drive assignments on Azure VMs, go to the [Understanding the temporary drive on Windows Azure Virtual Machines](http://blogs.msdn.com/b/mast/archive/2013/12/07/understanding-the-temporary-drive-on-windows-azure-virtual-machines.aspx) Azure Support Team Blog article.

For more information about SAN policy, see the Azure Support Team Blog article on the [SAN Policy](http://technet.microsoft.com/library/gg252636.aspx).
