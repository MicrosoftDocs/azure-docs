---
title: Supported guest operating systems for Azure Stack | Microsoft Docs
description: These Guest operating systems can be used on Azure Stack.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/26/2018
ms.author: sethm
ms.reviewer: ''
---
# Guest operating systems supported on Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

## Windows

Azure Stack supports the Windows guest operating systems listed in the following table:

| Operating system | Description | Available in Marketplace |
| --- | --- | --- | --- | --- | --- |
| Windows Server, version 1709 | 64-bit | Core with Containers |
| Windows Server 2016 | 64-bit |  Datacenter, Datacenter Core, Datacenter with Containers |
| Windows Server 2012 R2 | 64-bit |  Datacenter |
| Windows Server 2012 | 64-bit |  Datacenter |
| Windows Server 2008 R2 SP1 | 64-bit |  Datacenter |
| Windows Server 2008 SP2 | 64-bit |  Bring your own image |
| Windows 10 *(see note 1)* | 64-bit, Pro, and Enterprise | Bring your own image |

> [!NOTE]
> To deploy Windows 10 client operating systems on Azure Stack, you must have [Windows per User Licensing](https://www.microsoft.com/en-us/Licensing/product-licensing/windows10.aspx) or purchase through a Qualified Multitenant Hoster ([QMTH](https://www.microsoft.com/en-us/CloudandHosting/licensing_sca.aspx)).

Marketplace images are available for Pay-as-you-use or BYOL (EA/SPLA) licensing. Use of both on a single Azure Stack instance isn't supported. During deployment, Azure Stack injects a suitable version of the guest agent into the image.

Datacenter editions are available in the marketplace for downloading; customers can bring their own server images including other editions. Windows client images aren't available in the Marketplace.

## Linux

Linux distributions listed as available in the Marketplace include the necessary Windows Azure Linux Agent (WALA). If you bring your own image to Azure Stack, follow the guidelines in [Add Linux images to Azure Stack](azure-stack-linux.md).

> [!NOTE]
> Custom images should be built with the latest public WALA version. Versions older than 2.2.18 may not function properly on Azure Stack.
>
> [cloud-init](https://cloud-init.io/) is not supported on Azure Stack at this time.

| Distribution | Description | Publisher | Marketplace |
| --- | --- | --- | --- | --- | --- |
| CentOS-based 6.9 | 64-bit | Rogue Wave | Yes |
| CentOS-based 7.4 | 64-bit | Rogue Wave | Yes |
| ClearLinux | 64-bit | ClearLinux.org | Yes |
| Container Linux |  64-bit | CoreOS | Stable |
| Debian 8 "Jessie" | 64-bit | credativ |  Yes |
| Debian 9 "Stretch" | 64-bit | credativ | Yes |
| Red Hat Enterprise Linux 7.x | 64-bit | Red Hat |Bring your own image |
| SLES 11SP4 | 64-bit | SUSE | Yes |
| SLES 12SP3 | 64-bit | SUSE | Yes |
| Ubuntu 14.04-LTS | 64-bit | Canonical | Yes |
| Ubuntu 16.04-LTS | 64-bit | Canonical | Yes |
| Ubuntu 18.04-LTS | 64-bit | Canonical | Yes |

For Red Hat Enterprise Linux support information, refer to [Red Hat and Azure Stack: Frequently Asked Questions](https://access.redhat.com/articles/3413531).

## Next steps

For more information about the Azure Stack Marketplace, see the following articles:

[Download Marketplace items](azure-stack-download-azure-marketplace-item.md)  
[Create and publish a Marketplace item](azure-stack-create-and-publish-marketplace-item.md)