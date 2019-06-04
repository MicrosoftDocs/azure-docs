---
title: How to plan hybrid Azure Active Directory join implementation in Azure Active Directory (Azure AD) | Microsoft Docs
description: Learn how to configure hybrid Azure Active Directory joined devices.
services: active-directory
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: daveba
editor: ''

ms.assetid: 54e1b01b-03ee-4c46-bcf0-e01affc0419d
ms.service: active-directory
ms.subservice: devices
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/10/2019
ms.author: joflore
ms.reviewer: sandeo

ms.collection: M365-identity-device-management
---
# How To: Plan your hybrid Azure Active Directory join implementation

In a similar way to a user, a device is becoming another identity you want to protect and also use to protect your resources at any time and location. You can accomplish this goal by bringing your devices' identities to Azure AD using one of the following methods:

- Azure AD join
- Hybrid Azure AD join
- Azure AD registration

By bringing your devices to Azure AD, you maximize your users' productivity through single sign-on (SSO) across your cloud and on-premises resources. At the same time, you can secure access to your cloud and on-premises resources with [conditional access](../active-directory-conditional-access-azure-portal.md).

If you have an on-premises Active Directory environment and you want to join your domain-joined devices to Azure AD, you can accomplish this by configuring hybrid Azure AD joined devices. This article provides you with the related steps to implement a hybrid Azure AD join in your environment. 

## Prerequisites

This article assumes that you are familiar with the [Introduction to device management in Azure Active Directory](../device-management-introduction.md).

> [!NOTE]
> The minimum required domain functional and forest functional levels for Windows 10 hybrid Azure AD join is Windows Server 2008 R2.

## Plan your implementation

To plan your hybrid Azure AD implementation, you should familiarize yourself with:

|   |   |
| --- | --- |
| ![Check][1] | Review supported devices |
| ![Check][1] | Review things you should know |
| ![Check][1] | Review how to control the hybrid Azure AD join of your devices |
| ![Check][1] | Select your scenario |

## Review supported devices

Hybrid Azure AD join supports a broad range of Windows devices. Because the configuration for devices running older versions of Windows requires additional or different steps, the supported devices are grouped into two categories:

### Windows current devices

- Windows 10
- Windows Server 2016
- Windows Server 2019

For devices running the Windows desktop operating system, the supported version is the Windows 10 Anniversary Update (version 1607) or later. As a best practice, upgrade to the latest version of Windows 10.

### Windows down-level devices

- Windows 8.1
- Windows 7
- Windows Server 2012 R2
- Windows Server 2012
- Windows Server 2008 R2

As a first planning step, you should review your environment and determine whether you need to support Windows down-level devices.

## Review things you should know

You can't use a hybrid Azure AD join if your environment consists of a single forest that synchronized identity data to more than one Azure AD tenant.

If you are relying on the System Preparation Tool (Sysprep), make sure images created from an installation of Windows 10 1803 or earlier have not been configured for hybrid Azure AD join.

If you are relying on a Virtual Machine (VM) snapshot to create additional VMs, make sure you use a VM snapshot that has not been configured for hybrid Azure AD join.

Hybrid Azure AD join of Windows down-level devices:

- **Is** supported in non-federated environments through [Azure Active Directory Seamless Single Sign-On](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect-sso-quick-start). 
- **Is not** supported when using Azure AD Pass-through Authentication without Seamless Single Sign On.
- **Is not** supported when using credential roaming or user profile roaming or when using virtual desktop infrastructure (VDI).

The registration of Windows Server running the Domain Controller (DC) role is not supported.

If your organization requires access to the Internet via an authenticated outbound proxy, you must make sure that your Windows 10 computers can successfully authenticate to the outbound proxy. Because Windows 10 computers run device registration using machine context, it is necessary to configure outbound proxy authentication using machine context.

Hybrid Azure AD join is a process to automatically register your on-premises domain-joined devices with Azure AD. There are cases where you don't want all your devices to register automatically. If this is true for you, see [How to control the hybrid Azure AD join of your devices](hybrid-azuread-join-control.md).

If your Windows 10 domain joined devices are already [Azure AD registered](https://docs.microsoft.com/azure/active-directory/devices/overview#azure-ad-registered-devices) to your tenant, we highly recommend removing that state before enabling Hybrid Azure AD join. From Windows 10 1809 release, the following changes have been made to avoid this dual state:

- Any existing Azure AD registered state would be automatically removed after the device is Hybrid Azure AD joined.
- You can prevent your domain joined device from being Azure AD registered by adding this registry key - HKLM\SOFTWARE\Policies\Microsoft\Windows\WorkplaceJoin, "BlockAADWorkplaceJoin"=dword:00000001.
- This change is now available for Windows 10 1803 release with KB4489894 applied. However, if you have Windows Hello for Business configured, the user is required to re-setup Windows Hello for Business after the dual state clean up.

FIPS-compliant TPMs aren't supported for Hybrid Azure AD join. If your devices have FIPS-compliant TPMs, you must disable them before proceeding with Hybrid Azure AD join. Microsoft does not provide any tools for disabling FIPS mode for TPMs as it is dependent on the TPM manufacturer. Please contact your hardware OEM for support.

## Review how to control the hybrid Azure AD join of your devices

Hybrid Azure AD join is a process to automatically register your on-premises domain-joined devices with Azure AD. There are cases where you don't want all your devices to register automatically. This is for example true, during the initial rollout to verify that everything works as expected.

For more information, see [How to control the hybrid Azure AD join of your devices](hybrid-azuread-join-control.md)

## Select your scenario

You can configure hybrid Azure AD join for the following scenarios:

- Managed domains
- Federated domains  

If your environment has managed domains, hybrid Azure AD join supports:

- Pass Through Authentication (PTA)
- Password Hash Sync (PHS)

> [!NOTE]
> Azure AD does not support smartcards or certificates in managed domains.

Beginning with version 1.1.819.0, Azure AD Connect provides you with a wizard to configure hybrid Azure AD join. The wizard enables you to significantly simplify the configuration process. For more information, see:

- [Configure hybrid Azure Active Directory join for federated domains](hybrid-azuread-join-federated-domains.md)
- [Configure hybrid Azure Active Directory join for managed domains](hybrid-azuread-join-managed-domains.md)

 If installing the required version of Azure AD Connect is not an option for you, see [how to manually configure device registration](https://docs.microsoft.com/azure/active-directory/devices/hybrid-azuread-join-manual). 

## On-premises AD UPN support in Hybrid Azure AD join

Sometimes, your on-premises AD UPNs could be different from your Azure AD UPNs. In such cases, Windows 10 Hybrid Azure AD join provides limited support for on-premises AD UPNs based on the [authentication method](https://docs.microsoft.com/azure/security/azure-ad-choose-authn), domain type and Windows 10 version. There are two types of on-premises AD UPNs that can exist in your environment:

- Routable UPN: A routable UPN has a valid verified domain, that is registered with a domain registrar. For example, if contoso.com is the primary domain in Azure AD, contoso.org is the primary domain in on-premises AD owned by Contoso and [verified in Azure AD](https://docs.microsoft.com/azure/active-directory/fundamentals/add-custom-domain)
- Non-routable UPN: A non-routable UPN does not have a verified domain. It is applicable only within your organization's private network. For example, if contoso.com is the primary domain in Azure AD, contoso.local is the primary domain in on-premises AD but is not a verifiable domain in the internet and only used within Contoso's network.

The table below provides details on support for these on-premises AD UPNs in Windows 10 Hybrid Azure AD join

| Type of on-premises AD UPN | Domain type | Windows 10 version | Description |
| ----- | ----- | ----- | ----- |
| Routable | Federated | From 1703 release | Generally available |
| Routable | Managed | From 1709 release | Currently in private preview. Azure AD SSPR is not supported |
| Non-routable | Federated | From 1803 release | Generally available |
| Non-routable | Managed | Not supported | |

## Next steps

> [!div class="nextstepaction"]
> [Configure hybrid Azure Active Directory join for federated domains](hybrid-azuread-join-federated-domains.md)
> [Configure hybrid Azure Active Directory join for managed domains](hybrid-azuread-join-managed-domains.md)

<!--Image references-->
[1]: ./media/hybrid-azuread-join-plan/12.png
