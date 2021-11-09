---
title: Microsoft Endpoint Configuration Manager for Azure Virtual Desktop
description: Recommended ways for you to manage your Azure Virtual Desktop environment.
author: heidilohr

ms.topic: conceptual
ms.date: 10/14/2021
ms.author: helohr
manager: femila
---
# Microsoft Endpoint Manager and Intune for Azure Virtual Desktop

We recommend using [Microsoft Endpoint Manager](https://www.microsoft.com/endpointmanager) to manage your Azure Virtual Desktop environment after deployment. Microsoft Endpoint Manager is a unified management platform that includes Microsoft Endpoint Configuration Manager and Microsoft Intune.

> [!NOTE]
> Managing Azure Virtual Desktop session hosts using Microsoft Endpoint Manager is currently only supported in the Azure Public cloud.

## Microsoft Endpoint Configuration Manager

Microsoft Endpoint Configuration Manager versions 1906 and later can manage your Azure Virtual Desktop devices. For more information, see [Supported OS versions for clients and devices for Configuration Manager](/mem/configmgr/core/plan-design/configs/supported-operating-systems-for-clients-and-devices#windows-virtual-desktop).

## Microsoft Intune

Intune supports Windows 10 Enterprise virtual machines (VMs) for Azure Virtual Desktop. For more information about support, see [Using Windows 10 Enterprise with Intune](/mem/intune/fundamentals/windows-virtual-desktop).

Intune support for Windows 10 Enterprise multi-session VMs on Azure Virtual Desktop is currently in public preview. To see what the public preview version currently supports, check out [Using Windows 10 Enterprise multi-session with Intune](/mem/intune/fundamentals/windows-virtual-desktop-multi-session).

## Licensing

[Microsoft Endpoint Configuration Manager and Microsoft Intune licenses](https://microsoft.com/microsoft-365/enterprise-mobility-security/compare-plans-and-pricing) are included with most Microsoft 365 subscriptions. 

Learn more about licensing requirements at the following resources:

- [Frequently asked questions for Configuration Manager branches and licensing](/mem/configmgr/core/understand/product-and-licensing-faq#bkmk_equiv-sub) 
- [Microsoft Intune licensing](/mem/intune/fundamentals/licenses)
