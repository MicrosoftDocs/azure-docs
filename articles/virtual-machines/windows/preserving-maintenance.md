---
title:  VM preserving maintenance for Windows VMs in Azure | Microsoft Docs
description: In-place VM migration for memory preserving updates.
services: virtual-machines-windows
documentationcenter: ''
author: zivr
manager: timlt
editor: ''
tags: azure-service-management,azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 03/27/2017
ms.author: zivr

---



# VM preserving maintenance with In-place VM migration

While the majority of updates have no impact to hosted VMs, there are
cases where updates to components or services result in minimal
interference to running VMs (without a full reboot of the virtual
machine).

These updates are accomplished with technology that enables in-place
live migration, also called "memory-preserving update". When updating
the host, the virtual machine is placed into a “paused” state,
preserving the memory in RAM, while the hosting environment (e.g. the
underlying operating system) applies the necessary updates and patches.
The virtual machine is then resumed within 30 seconds of being paused.
After resuming, the clock of the virtual machine is automatically
synchronized.

Not all updates can be deployed by using this mechanism, but given the
short pause period, deploying updates in this way greatly reduces impact
to virtual machines.

Multi-instance updates (VMs in an availability set) are applied one
update domain at a time.

Some applications may be impacted by these updates more than others. 
Applications that perform real-time event processing, media streaming 
or transcoding, or high throughput networking scenarios, for example,
may not be designed to tolerate a 30 second pause. 
Applications running in a virtual machine can learn about upcoming
updates by calling the [Scheduled Events](../virtual-machines-scheduled-events.md)
API of the [Azure Metadata Service](../virtual-machines-instancemetadataservice-overview.md).
