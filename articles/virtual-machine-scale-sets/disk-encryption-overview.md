---
title: Enable Azure Disk Encryption for Virtual Machine Scale Sets
description: This article provides instructions on enabling Microsoft Azure Disk Encryption for Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.topic: conceptual
ms.service: virtual-machine-scale-sets
ms.subservice: disks
ms.date: 10/10/2019
ms.reviewer: jushiman
ms.custom: mimckitt

---

# Azure Disk Encryption for Virtual Machine Scale Sets

Azure Disk Encryption provides volume encryption for the OS and data disks of your virtual machines, helping protect and safeguard your data to meet organizational security and compliance commitments. To learn more, see [Azure Disk Encryption: Linux VMs](../virtual-machines/linux/disk-encryption-overview.md) and [Azure Disk Encryption: Windows VMs](../virtual-machines/windows/disk-encryption-overview.md)  

Azure Disk Encryption can also be applied to Windows and Linux virtual machine scale sets, in these instances:
- Scale sets created with managed disks. Azure Disk encryption is not supported for native (or unmanaged) disk scale sets.
- OS and data volumes in Windows scale sets.
- Data volumes in Linux scale sets. OS disk encryption is NOT supported at present for Linux scale sets.

You can learn the fundamentals of Azure Disk Encryption for virtual machine scale sets in just a few minutes with the [Encrypt a virtual machine scale sets using the Azure CLI](disk-encryption-cli.md) or the [Encrypt a virtual machine scale sets using the Azure PowerShell](disk-encryption-powershell.md) tutorials.

## Next steps

- [Encrypt a virtual machine scale sets using the Azure Resource Manager](disk-encryption-azure-resource-manager.md)
- [Create and configure a key vault for Azure Disk Encryption](disk-encryption-key-vault.md)
- [Use Azure Disk Encryption with virtual machine scale set extension sequencing](disk-encryption-extension-sequencing.md)
