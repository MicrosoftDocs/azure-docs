---
title: Supported platforms in Azure Security Center | Microsoft Docs
description: This document provides a list of Windows and Linux operatings systems supported in Azure Security Center.
services: security-center
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: ''

ms.assetid: 70c076ef-3ad4-4000-a0c1-0ac0c9796ff1
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/26/2018
ms.author: terrylan

---
# Supported platforms in Azure Security Center
Security state monitoring and recommendations are available for virtual machines (VMs), created using both the classic and Resource Manager deployment models, and computers.

> [!NOTE]
> Learn more about the [classic and Resource Manager deployment models](../azure-classic-rm.md) for Azure resources.
>
>

## Supported platforms for Windows computers and VMs
Supported Windows operating systems:

* Windows Server 2008
* Windows Server 2008 R2
* Windows Server 2012
* Windows Server 2012 R2
* Windows Server 2016


## Supported platforms for Linux computers and VMs
Supported Linux operating systems:

* Ubuntu versions 12.04 LTS, 14.04 LTS, 16.04 LTS
* Debian versions 6, 7, 8, 9
* CentOS versions 5, 6, 7
* Red Hat Enterprise Linux (RHEL) versions 5, 6, 7
* SUSE Linux Enterprise Server (SLES) versions 11, 12
* Oracle Linux versions 5, 6, 7
* Amazon Linux 2012.09 through 2017
* Openssl 1.1.0 is only supported on x86_64 platforms (64-bit)

> [!NOTE]
> Virtual machine behavioral analytics are not yet available for Linux operating systems.
>
>

## VMs and Cloud Services
VMs running in a cloud service are also supported. Only cloud services web and worker roles running in production slots are monitored. To learn more about cloud service, see [Cloud Services overview](../cloud-services/cloud-services-choose-me.md).

## Next steps

- [Azure Security Center Planning and Operations Guide](security-center-planning-and-operations-guide.md) — Learn how to plan and understand the design considerations to adopt Azure Security Center
- [Security alerts by type in Azure Security Center](security-center-alerts-type.md#virtual-machine-behavioral-analysis) - Learn more about virtual machine behavioral analysis and crash dump memory analysis in Security Center
- [Azure Security Center FAQ](security-center-faq.md) — Find frequently asked questions about using the service
- [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/) — Find blog posts about Azure security and compliance
