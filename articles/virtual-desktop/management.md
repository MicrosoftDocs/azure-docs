---
title: Manage session hosts with Microsoft Intune - Azure Virtual Desktop
description: Recommended ways for you to manage your Azure Virtual Desktop session hosts.
author: heidilohr
ms.topic: conceptual
ms.date: 04/11/2023
ms.author: helohr
manager: femila
---
# Manage session hosts with Microsoft Intune

We recommend using [Microsoft Intune](https://www.microsoft.com/endpointmanager) to manage your Azure Virtual Desktop environment. Microsoft Intune is a unified management platform that includes Microsoft Configuration Manager and Microsoft Intune.

## Microsoft Configuration Manager

Microsoft Configuration Manager versions 1906 and later can manage your domain-joined and Microsoft Entra hybrid joined session hosts. For more information, see [Supported OS versions for clients and devices for Configuration Manager](/mem/configmgr/core/plan-design/configs/supported-operating-systems-for-clients-and-devices#azure-virtual-desktop).

## Microsoft Intune

Microsoft Intune can manage your Microsoft Entra joined and Microsoft Entra hybrid joined session hosts. To learn more about using Intune to manage Windows 11 and Windows 10 single session hosts, see [Using Azure Virtual Desktop with Intune](/mem/intune/fundamentals/windows-virtual-desktop).

For Windows 11 and Windows 10 multi-session hosts, Intune supports both device-based configurations and user-based configurations on Windows 11 and Windows 10. User-scope configuration on Windows 10 requires the update March 2023 Cumulative Update Preview (KB5023773) and OS version 19042.2788, 19044.2788, 19045.2788 or later. To learn more about using Intune to manage multi-session hosts, see [Using Azure Virtual Desktop multi-session with Intune](/mem/intune/fundamentals/windows-virtual-desktop-multi-session).

> [!NOTE]
> Managing Azure Virtual Desktop session hosts using Intune is currently supported in the Azure Public and [Azure Government clouds](/enterprise-mobility-security/solutions/ems-intune-govt-service-description).

## Licensing

[Microsoft Intune licenses](https://microsoft.com/microsoft-365/enterprise-mobility-security/compare-plans-and-pricing) are included with most Microsoft 365 subscriptions. 

Learn more about licensing requirements at the following resources:

- [Frequently asked questions for Configuration Manager branches and licensing](/mem/configmgr/core/understand/product-and-licensing-faq#bkmk_equiv-sub) 
- [Microsoft Intune licensing](/mem/intune/fundamentals/licenses)
