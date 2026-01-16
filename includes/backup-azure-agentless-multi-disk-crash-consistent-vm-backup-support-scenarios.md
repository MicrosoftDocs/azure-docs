---
title: Include file
description: Include file
services: backup
ms.service: azure-backup
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
**VM type and size** | - Supported for [VM sizes](/azure/virtual-machines/vm-naming-conventions) that are premium storage capable (VM size that include "*s*" in their name) such as `DSv2`.   <br> - Trusted Launch VMs are supported. <br> - VMs with Ultra-disks, Premium v2 SSD, Ephemeral OS disks, Shared disks, and Write Accelerated disks aren't supported. <br> - VM sizes using [Azure Boost](/azure/azure-boost/overview) aren't supported - Intel V6 and above (Dsv6-series, Edsv6-series, Esv6-series, and more) and AMD V7 and above (Dasv7-series, Dadsv7-series, Easv7-series, Faldsv7-series, and more) 
**Pre/post script** | Not applicable <br> Pre/Post scripts are used for app-consistent Linux VM backup. 
