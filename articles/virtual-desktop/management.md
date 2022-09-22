---
title: Manage session hosts with Microsoft Endpoint Manager - Azure Virtual Desktop
description: Recommended ways for you to manage your Azure Virtual Desktop session hosts.
author: heidilohr
ms.topic: conceptual
ms.date: 08/30/2022
ms.author: helohr
manager: femila
---
# Manage session hosts with Microsoft Endpoint Manager

We recommend using [Microsoft Endpoint Manager](https://www.microsoft.com/endpointmanager) to manage your Azure Virtual Desktop environment. Microsoft Endpoint Manager is a unified management platform that includes Microsoft Endpoint Configuration Manager and Microsoft Intune.

## Microsoft Endpoint Configuration Manager

Microsoft Endpoint Configuration Manager versions 1906 and later can manage your domain-joined and Hybrid Azure Active Directory (Azure AD)-joined session hosts. For more information, see [Supported OS versions for clients and devices for Configuration Manager](/mem/configmgr/core/plan-design/configs/supported-operating-systems-for-clients-and-devices#azure-virtual-desktop).

## Microsoft Intune

Microsoft Intune can manage your Azure AD-joined and Hybrid Azure AD-joined session hosts. To learn more about using Intune to manage Windows 11 and Windows 10 single session hosts, see [Using Azure Virtual Desktop with Intune](/mem/intune/fundamentals/windows-virtual-desktop).

For Windows 11 and Windows 10 multi-session hosts, Intune currently supports device-based configurations. User scope configurations are also currently in preview on Windows 11. To learn more about using Intune to manage multi-session hosts, see [Using Azure Virtual Desktop multi-session with Intune](/mem/intune/fundamentals/windows-virtual-desktop-multi-session).

> [!NOTE]
> Managing Azure Virtual Desktop session hosts using Intune is currently supported in the Azure Public and Azure Government clouds.

## Licensing

[Microsoft Endpoint Configuration Manager and Microsoft Intune licenses](https://microsoft.com/microsoft-365/enterprise-mobility-security/compare-plans-and-pricing) are included with most Microsoft 365 subscriptions. 

Learn more about licensing requirements at the following resources:

- [Frequently asked questions for Configuration Manager branches and licensing](/mem/configmgr/core/understand/product-and-licensing-faq#bkmk_equiv-sub) 
- [Microsoft Intune licensing](/mem/intune/fundamentals/licenses)
