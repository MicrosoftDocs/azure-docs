---
title: Troubleshoot Windows could not finish configuring the system
titlesuffix: Azure Virtual Machines
description: This article provides steps to resolve issues where the Sysprep process prevents the booting of an Azure VM.
services: virtual-machines-windows, azure-resource-manager
documentationcenter: ''
author: v-miegge
manager: dcscontentpm
editor: ''
tags: azure-resource-manager

ms.assetid: 5fc57a8f-5a0c-4b5f-beef-75eecb4d310d
ms.service: virtual-machines-windows
ms.workload: na
ms.tgt_pltfrm: vm-windows
ms.topic: troubleshooting
ms.date: 09/09/2020
ms.author: v-miegge
---

# Troubleshoot Windows could not finish configuring the system

This article provides steps to resolve issues where the Sysprep process prevents the booting of an Azure virtual machine (VM).

## Symptom

When you use [Boot diagnostics](./boot-diagnostics.md) to view the screenshot of the VM, you will see that the screenshot displays an Install Windows error while Windows setup is starting services. The error will display the message:

`Windows could not finish configuring the system. To attempt to resume configuration, restart the computer. Setup is starting services`

  ![Figure 1 displays an Install Windows error with the message: “Windows could not finish configuring the system. To attempt to resume configuration, restart the computer. Setup is starting services”](./media/windows-could-not-configure-system/1-windows-error-configure.png)

## Cause

This error is caused when the operating system (OS) is unable to complete the [Sysprep process](/windows-hardware/manufacture/desktop/sysprep-process-overview). This error will occur when you attempt an initial boot of a generalized VM. If you encounter this issue, recreate the generalized image, as the image is in an un-deployable state and cannot be recovered.

## Solution

To fix this issue, follow the [Azure guidance on preparing/capturing an image](../windows/upload-generalized-managed.md) and prepare a new generalized image.