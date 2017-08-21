---
title: Boot diagnostics for Windows virtual machines in Azure | Microsoft Doc
description: Overview of the two debugging features for Windows virtual machines in Azure
services: virtual-machines-windows
documentationcenter: virtual-machines-windows
author: Deland-Han
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machines-windows
ms.workload: infrastructure
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 08/10/2017
ms.author: delhan
---
# How to use boot diagnostics to troubleshoot Windows virtual machines in Azure

Support for two debugging features is now available in Azure: Console Output and Screenshot support for Azure Virtual Machines Resource Manager deployment model. 

When bringing your own image to Azure or even booting one of the platform images, there can be many reasons why a Virtual Machine gets into a non-bootable state. These features enable you to easily diagnose and recover your Virtual Machines from boot failures.

For Linux Virtual Machines, you can easily view the output of your console log from the Portal:

![Azure portal](./media/virtual-machines-common-boot-diagnostics/screenshot1.png)

However, for both Windows and Linux Virtual Machines, Azure also enables you to see a screenshot of the VM from the hypervisor:

![Error](./media/virtual-machines-common-boot-diagnostics/screenshot2.png)

Both of these features are supported for Azure Virtual Machines in all regions. Note, screenshots, and output can take up to 10 minutes to appear in your storage account.

## Common boot errors

- [0xC000000E](https://support.microsoft.com/help/4010129)
- [0xC000000F](https://support.microsoft.com/help/4010130)
- [0xC0000011](https://support.microsoft.com/help/4010134)
- [0xC0000034](https://support.microsoft.com/help/4010140)
- [0xC0000098](https://support.microsoft.com/help/4010137)
- [0xC00000BA](https://support.microsoft.com/help/4010136)
- [0xC000014C](https://support.microsoft.com/help/4010141)
- [0xC0000221](https://support.microsoft.com/help/4010132)
- [0xC0000225](https://support.microsoft.com/help/4010138)
- [0xC0000359](https://support.microsoft.com/help/4010135)
- [0xC0000605](https://support.microsoft.com/help/4010131)
- [An operating system wasn't found](https://support.microsoft.com/help/4010142)
- [Boot failure or INACCESSIBLE_BOOT_DEVICE](https://support.microsoft.com/help/4010143)

[!INCLUDE [virtual-machines-common-boot-diagnostics](../../../includes/virtual-machines-common-boot-diagnostics.md)]