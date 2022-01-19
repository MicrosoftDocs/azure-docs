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

If you selected one of the VMs pre-configured with an operating system (and optional additional services), you have already picked a standard Azure VM size. Starting your solution with a pre-configured OS is the recommended approach. However, if you are installing an OS manually, you must size your primary VHD in your VM image. Ensure the OS disk size is within the limits for Linux or Windows.

| OS | VHD size |
| --- | --- |
| Linux | 30 to 1023 GB |
| Windows | 30 to 250 GB |
|

The base Windows or SQL Server images provided as an approved base already meet these requirements, so don't change the format or the size of the VHD.

Data disks can be as large as 1 TB. When deciding on size, remember that customers cannot resize VHDs within an image at the time of deployment. Create data disk VHDs as fixed-format VHDs. They should also be expandable (sparse/dynamic). Data disks can initially be empty or contain data.