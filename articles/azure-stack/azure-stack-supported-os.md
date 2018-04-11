---
title: Supported guest operating systems for Azure Stack | Microsoft Docs
description: These Guest operating systems can be used on Azure Stack.
services: azure-stack
documentationcenter: ''
author: Brenduns
manager: femila
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/22/2018
ms.author: Brenduns
ms.reviewer: JeffGoldner
---
# Guest operating systems supported on Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

## Windows
Azure Stack supports the Windows guest operating systems that are listed in the following table: Images in the Marketplace are available for download to Azure Stack. Windows client images are not available in the Marketplace.

During deployment, Azure Stack injects a suitable version of the guest agent into the image.

| Operating system | Description | Publisher | OS Type | Marketplace |
| --- | --- | --- | --- | --- | --- |
| Windows Server 2008 R2 SP1 | 64-bit | Microsoft | Windows | Datacenter |
| Windows Server 2012 | 64-bit | Microsoft | Windows | Datacenter |
| Windows Server 2012 R2 | 64-bit | Microsoft | Windows | Datacenter |
| Windows Server 2016 | 64-bit | Microsoft | Windows | Datacenter, Datacenter Core, Datacenter with Containers |
| Windows 10 *(see note 1)* | 64-bit, Pro, and Enterprise | Microsoft | Windows | No |

***Note 1:***  *To deploy Windows 10 client operating systems on Azure Stack, you must have [Windows per User Licensing](https://www.microsoft.com/Licensing/product-licensing/windows10.aspx) or purchase through a Qualified Multitenant Hoster ([QMTH](https://www.microsoft.com/CloudandHosting/licensing_sca.aspx)).*


## Linux

Linux distributions listed here include the necessary Windows Azure Linux Agent (WALA).

> [!NOTE]   
> Images built with WALA versions older than 2.2.3 are *not* supported and are unlikely to deploy. Some WALA agent versions are known to not function on Azure Stack VMs, including versions 2.2.12 and 2.2.13.
>
> [cloud-init](https://cloud-init.io/) is only supported on Ubuntu distributions on Azure Stack.

| Distribution | Description | Publisher | Marketplace |
| --- | --- | --- | --- | --- | --- |
| Container Linux |  64-bit | CoreOS | Stable |
| CentOS-based 6.9 | 64-bit | Rogue Wave | Yes |
| CentOS-based 7.4 | 64-bit | Rogue Wave | Yes |
| Debian 8 "Jessie" | 64-bit | credativ |  Yes |
| Debian 9 "Stretch" | 64-bit | credativ | Yes |
| Red Hat Enterprise Linux 7.x (pending) | 64-bit | Red Hat | No |
| SLES 11SP4 | 64-bit | SUSE | Yes |
| SLES 12SP3 | 64-bit | SUSE | Yes |
| Ubuntu 14.04-LTS | 64-bit | Canonical | Yes |
| Ubuntu 16.04-LTS | 64-bit | Canonical | Yes |

Other Linux distributions may be supported in the future.
