---
title: Planned maintenance for Windows VMs in Azure | Microsoft Docs
description: Understand what Azure planned maintenance is and how it affects your Windows virtual machines running in Azure.
services: virtual-machines-windows
documentationcenter: ''
author: zivr
manager: timlt
editor: ''
tags: azure-service-management,azure-resource-manager

ms.assetid: eb4b92d8-be0f-44f6-a6c3-f8f7efab09fe
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 03/27/2017
ms.author: zivr

---
# Planned maintenance for Windows virtual machines 

Microsoft Azure periodically performs updates across the globe to
improve the reliability, performance, and security of the host
infrastructure that underlies virtual machines. Such updates range from
patching software components in the hosting environment (OS, hypervisor
and various agents deployed on the host), upgrading networking
components, all the way to hardware decommissioning.

The majority of these updates are performed without any impact to hosted
virtual machines or cloud services.

However, there are cases where updates do have an impact to hosted
virtual machines:

-   VM preserving maintenance using In-place VM migration describes a class of updates where virtual machines are not rebooted
    during the maintenance.

-   VM restarting maintenance which require a reboot or redeploy to hosted
    virtual machines.

Please note that this page describes how Microsoft Azure performs
planned maintenance. For more information about unplanned events
(outages), see [Manage the availability of virtual
machines](manage-availability.md).