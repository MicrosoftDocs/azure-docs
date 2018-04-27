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

| Operating system | Description | Available in Marketplace |
| --- | --- | --- | --- | --- | --- |
| Windows Server, version 1709 | 64-bit | Core with Containers |
| Windows Server 2016 | 64-bit |  Datacenter, Datacenter Core, Datacenter with Containers |
| Windows Server 2012 R2 | 64-bit |  Datacenter |
| Windows Server 2012 | 64-bit |  Datacenter |
| Windows Server 2008 R2 SP1 | 64-bit |  Datacenter |
| Windows Server 2008 SP2 | 64-bit |  Bring your own image |
| Windows 10 *(see note 1)* | 64-bit, Pro, and Enterprise | Bring your own image |

***Note 1:***  *To deploy Windows 10 client operating systems on Azure Stack, you must have [Windows per User Licensing](https://www.microsoft.com/Licensing/product-licensing/windows10.aspx) or purchase through a Qualified Multitenant Hoster ([QMTH](https://www.microsoft.com/CloudandHosting/licensing_sca.aspx)).*

Marketplace images are available for Pay-as-you-use or BYOL (EA/SPLA) licensing. Use of both on a single Azure Stack instance is not supported. 

Only Datacenter editions are available in the marketplace; customers can bring their own server images including other editions.

## Linux

Linux distributions listed here include the necessary Windows Azure Linux Agent (WALA).

> [!NOTE]   
> Custom images should be built with the latest public WALA version. Versions older than 2.2.18 may not function properly on Azure Stack.  
>
> [cloud-init](https://cloud-init.io/) is not supported on Azure Stack at this time.

| Distribution | Description | Publisher | Marketplace |
| --- | --- | --- | --- | --- | --- |
| Container Linux |  64-bit | CoreOS | Stable |
| CentOS-based 6.9 | 64-bit | Rogue Wave | Yes |
| CentOS-based 7.4 | 64-bit | Rogue Wave | Yes |
| ClearLinux | 64-bit | ClearLinux.org | Yes |
| Debian 8 "Jessie" | 64-bit | credativ |  Yes |
| Debian 9 "Stretch" | 64-bit | credativ | Yes |
| Red Hat Enterprise Linux 7.x (pending) | 64-bit | Red Hat |Bring your own image |
| SLES 11SP4 | 64-bit | SUSE | Yes |
| SLES 12SP3 | 64-bit | SUSE | Yes |
| Ubuntu 14.04-LTS | 64-bit | Canonical | Yes |
| Ubuntu 16.04-LTS | 64-bit | Canonical | Yes |

Other Linux distributions may be supported in the future.
