---
title: Include file
description: Include file
services: backup
ms.service: backup
ms.topic: include
ms.date: 03/13/2024
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

The following table lists the supported scenarios for agentless multi-disk crash-consistent Azure Virtual Machine (VM) backup:

Scenario | Supportability
--- | ---
**Region availability** | Supported in all Azure public regions.
**Backup policy type** | Agentless crash-consistent backup is supported only with Enhanced Policy.
**VM type and size** | - Supported for [VM sizes](../articles/virtual-machines/vm-naming-conventions.md) that are premium storage capable (VM size that include "*s*" in their name) such as `DSv2`.   <br> - Trusted Launch VMs are supported. <br> - VMs with Ultra-disks, Premium v2 SSD, Ephemeral OS disks, Shared disks, and Write Accelerated disks aren't supported. 
**Pre/post script** | Not supported for Linux VM backup.
