---
title: Azure Serial Console Power Options | Microsoft Docs
description: VM power options available within the Azure Serial Console
services: virtual-machines
documentationcenter: ''
author: asinn826
manager: borisb
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm
ms.workload: infrastructure-services
ms.date: 8/6/2019
ms.author: alsin
---

# Power Options available from the Azure Serial Console

The Azure Serial Console provides several powerful tools for power management on your VM or virtual machine scale set. These power management options may be confusing to some, so this is an overview of each tool and its intended use case.

Serial Console Feature | Description | Use Case
:----------------------|:------------|:---------
Restart VM | A graceful restart of your VM or virtual machine scale set instance. This operation is the same as calling the restart feature available in the Overview page. | In most cases, this option should be your first tool in attempting to restart your VM. Your Serial Console connection will experience a brief interruption and will automatically resume as soon as the VM has restarted.
Reset VM | A forceful power cycle of your VM or virtual machine scale set by the Azure platform. | This option is used to immediately restart your operating system regardless of its current state. Since this operation isn't graceful, there's a risk of data loss or corruption. There is no interruption in the Serial Console connection, which may be useful for sending commands early in boot time (for example, getting to GRUB on a Linux VM or Safe Mode in a Windows VM).
SysRq - Reboot (b) | A system request to force a guest restart. | This feature is only applicable to Linux operating systems, and requires [SysRq to be enabled](./serial-console-nmi-sysrq.md#system-request-sysrq) in the operating system. If the operating system is properly configured for SysRq, this command will cause the OS to restart.
NMI (Non-maskable Interrupt) | An interrupt command, which will be delivered to the operating system | This operation is available for both [Windows](./serial-console-windows.md#use-the-serial-console-for-nmi-calls) and [Linux](./serial-console-nmi-sysrq.md#non-maskable-interrupt-nmi) VMs, and requires NMI to be enabled. Sending an NMI will typically cause your operating system to crash. You can configure your operating system to create a dump file and then restart upon receiving the NMI, which may be useful in low-level debugging.

## Next steps
* Learn more about the [Azure Serial Console for Linux VMs](./serial-console-linux.md)
* Learn more about the [Azure Serial Console for Windows VMs](./serial-console-windows.md)