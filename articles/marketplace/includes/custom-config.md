---
title: include file
description: file
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: include
author: emuench
ms.author: mingshen
ms.date: 10/09/2020
---

If you need additional configuration, use a scheduled task that runs at startup to make final changes to the VM after it has been deployed. Also consider the following:

- If it is a run-once task, the task should delete itself after it successfully completes.
- Configurations should not rely on drives other than C or D, because only these two drives are always guaranteed to exist (drive C is the operating system disk and drive D is the temporary local disk).

For more information about Linux customizations, see [Virtual machine extensions and features for Linux](../../virtual-machines/extensions/features-linux.md).