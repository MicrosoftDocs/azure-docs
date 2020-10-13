---
title: Create virtual machine technical assets for Azure Marketplace
description: Learn how to create virtual machine technical assets for Azure Marketplace.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: emuench
ms.author: krsh
ms.date: 10/15/2020
---

# Create virtual machine technical assets

This article describes how to create and configure a virtual machine (VM) for Azure Marketplace. A VM contains two components:

1. **Operating system virtual hard disk (VHD)** – Contains the operating system and solution that deploys with your offer. The process of preparing the VHD differs depending on whether it is a Linux-, Windows-, or custom-based VM.
2. **Data disk VHDs** (optional) – Dedicated, persistent storage for a VM. Don't use the operating system VHD (for example, the C: drive) to store persistent information.

A VM image contains one operating system disk and up to 16 data disks. Use one VHD per data disk, even if the disk is blank.

> [!NOTE]
> Regardless of which operating system you use, add only the minimum number of data disks needed by the solution. Customers cannot remove disks that are part of an image at the time of deployment, but they can always add disks during or after deployment.

> [!IMPORTANT]
> Every VM Image in a plan must have the same number of data disks.

## Fundamental technical knowledge

Designing, building, and testing these assets takes time and requires technical knowledge of both the Azure platform and the technologies used to build the offer. In addition to your solution domain, your engineering team should have knowledge of the following Microsoft technologies:

- Basic understanding of [Azure Services](https://azure.microsoft.com/services/)
- How to [design and architect Azure applications](https://azure.microsoft.com/solutions/architecture/)
- Working knowledge of [Azure virtual machines](https://azure.microsoft.com/services/virtual-machines/), [Azure Storage](https://azure.microsoft.com/services/?filter=storage), and [Azure Networking](https://azure.microsoft.com/services/?filter=networking)
- Working knowledge of [Azure Resource Manager](https://azure.microsoft.com/features/resource-manager/)
- Working Knowledge of [JSON](https://www.json.org/)

Optional suggested tools:

- [Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview)
- [Azure CLI](https://code.visualstudio.com/)
- [Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md)
- [Visual Studio Code](https://code.visualstudio.com/)

## Next steps

Create a VM image using either an approved base or an image you built on your own premises:

- [Create a VM image using an approved base](azure-vm-create-using-approved-base.md)
- [Create a VM using your own image](azure-vm-create-using-own-image.md)
