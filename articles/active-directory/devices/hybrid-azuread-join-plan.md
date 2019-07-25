---
title: How to plan hybrid Azure Active Directory join implementation in Azure Active Directory (Azure AD) | Microsoft Docs
description: Learn how to configure hybrid Azure Active Directory joined devices.

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: conceptual
ms.date: 06/28/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: sandeo

ms.collection: M365-identity-device-management
---
# How To: Plan your hybrid Azure Active Directory join implementation

In a similar way to a user, a device is another core identity you want to protect and use it to protect your resources at any time and from any location. You can accomplish this goal by bringing and managing device identities in Azure AD using one of the following methods:

- Azure AD join
- Hybrid Azure AD join
- Azure AD registration

By bringing your devices to Azure AD, you maximize your users' productivity through single sign-on (SSO) across your cloud and on-premises resources. At the same time, you can secure access to your cloud and on-premises resources with [Conditional Access](../active-directory-conditional-access-azure-portal.md).

If you have an on-premises Active Directory (AD) environment and you want to join your AD domain-joined computers to Azure AD, you can accomplish this by doing hybrid Azure AD join. This article provides you with the related steps to implement a hybrid Azure AD join in your environment. 

## Prerequisites

This article assumes that you are familiar with the [Introduction to device identity management in Azure Active Directory](../device-management-introduction.md).

> [!NOTE]
> The minimum required domain functional and forest functional levels for Windows 10 hybrid Azure AD join is Windows Server 2008 R2.

## Plan your implementation

To plan your hybrid Azure AD implementation, you should familiarize yourself with:

|   |   |
| --- | --- |
| ![Check][1] | Review supported devices |
| ![Check][1] | Review things you should know |
| ![Check][1] | Review controlled validation of hybrid Azure AD join |
| ![Check][1] | Select your scenario based on your identity infrastructure |
| ![Check][1] | Review on-premises AD UPN support for hybrid Azure AD join |

## Review supported devices

Hybrid Azure AD join supports a broad range of Windows devices. Because the configuration for devices running older versions of Windows requires additional or different steps, the supported devices are grouped into two categories:

### Windows current devices

- Windows 10
- Windows Server 2016
- Windows Server 2019

For devices running the Windows desktop operating system, supported version are listed in this article [Windows 10 release information](https://docs.microsoft.com/windows/release-information/). As a best practice, Microsoft recommends you upgrade to the latest version of Windows 10.

### Windows down-level devices

- Windows 8.1
- Windows 7. For support information on Windows 7, please review this article [Support for Windows 7 is ending](https://www.microsoft.com/en-us/windowsforbusiness/end-of-windows-7-support)
- Windows Server 2012 R2
- Windows Server 2012
- Windows Server 2008 R2

As a first planning step, you should review your environment and determine whether you need to support Windows down-level devices.

## Review things you should know

Hybrid Azure AD join is currently not supported if your environment consists of a single AD forest synchronizing identity data to more than one Azure AD tenant.

Hybrid Azure AD join is currently not supported when using virtual desktop infrastructure (VDI).

Hybrid Azure AD join is not supported for FIPS-compliant TPMs. If your devices have FIPS-compliant TPMs, you must disable them before proceeding with Hybrid Azure AD join. Microsoft does not provide any tools for disabling FIPS mode for TPMs as it is dependent on the TPM manufacturer. Please contact your hardware OEM for support.

Hybrid Azure AD join is not supported for Windows Server running the Domain Controller (DC) role.

Hybrid Azure AD join is not supported on Windows down-level devices when using credential roaming or user profile roaming.

If you are relying on the System Preparation Tool (Sysprep) and if you are using a **pre-Windows 10 1809** image for installation, make sure that image is not from a device that is already registered with Azure AD as Hybrid Azure AD join.

If you are relying on a Virtual Machine (VM) snapshot to create additional VMs, make sure that snapshot is not from a VM that is already registered with Azure AD as Hybrid Azure AD join.

If your Windows 10 domain joined devices are already [Azure AD registered](https://docs.microsoft.com/azure/active-directory/devices/overview#getting-devices-in-azure-ad) to your tenant, we highly recommend removing that state before enabling Hybrid Azure AD join. From Windows 10 1809 release, the following changes have been made to avoid this dual state:

- Any existing Azure AD registered state would be automatically removed after the device is Hybrid Azure AD joined.
- You can prevent your domain joined device from being Azure AD registered by adding this registry key - HKLM\SOFTWARE\Policies\Microsoft\Windows\WorkplaceJoin, "BlockAADWorkplaceJoin"=dword:00000001.
- This change is now available for Windows 10 1803 release with KB4489894 applied. However, if you have Windows Hello for Business configured, the user is required to re-setup Windows Hello for Business after the dual state clean up.

## Review controlled validation of hybrid Azure AD join

When all of the pre-requisites are in place, Windows devices will automatically register as devices in your Azure AD tenant. The state of these device identities in Azure AD is referred as hybrid Azure AD join. More information about the concepts covered in this article can be found in the articles [Introduction to device identity management in Azure Active Directory](overview.md) and [Plan your hybrid Azure Active Directory join implementation](hybrid-azuread-join-plan.md).

Organizations may want to do a controlled validation of hybrid Azure AD join before enabling it across their entire organization all at once. Review the article [controlled validation of hybrid Azure AD join](hybrid-azuread-join-control.md) to understand how to accomplish it.

## Select your scenario based on your identity infrastructure

Hybrid Azure AD join works with both, managed and federated environments.  

### Managed environment

A managed environment can be deployed either through [Password Hash Sync (PHS)](https://docs.microsoft.com/azure/active-directory/hybrid/whatis-phs) or [Pass Through Authentication (PTA)](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-pta) with [Seamless Single Sign On](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-sso).

These scenarios don't require you to configure a federation server for authentication.

### Federated environment

A federated environment should have an identity provider that supports the following requirements:

- **WS-Trust protocol:** This protocol is required to authenticate Windows current hybrid Azure AD joined devices with Azure AD.
- **WIAORMULTIAUTHN claim:** This claim is required to do hybrid Azure AD join for Windows down-level devices.

If you have a federated environment using Active Directory Federation Services (AD FS), then the above requirements are already supported.

> [!NOTE]
> Azure AD does not support smartcards or certificates in managed domains.

Beginning with version 1.1.819.0, Azure AD Connect provides you with a wizard to configure hybrid Azure AD join. The wizard enables you to significantly simplify the configuration process. If installing the required version of Azure AD Connect is not an option for you, see [how to manually configure device registration](https://docs.microsoft.com/azure/active-directory/devices/hybrid-azuread-join-manual). 

Based on the scenario that matches your identity infrastructure, see:

- [Configure hybrid Azure Active Directory join for federated environment](hybrid-azuread-join-federated-domains.md)
- [Configure hybrid Azure Active Directory join for managed environment](hybrid-azuread-join-managed-domains.md)

## Review on-premises AD UPN support for Hybrid Azure AD join

Sometimes, your on-premises AD UPNs could be different from your Azure AD UPNs. In such cases, Windows 10 Hybrid Azure AD join provides limited support for on-premises AD UPNs based on the [authentication method](https://docs.microsoft.com/azure/security/azure-ad-choose-authn), domain type and Windows 10 version. There are two types of on-premises AD UPNs that can exist in your environment:

- Routable UPN: A routable UPN has a valid verified domain, that is registered with a domain registrar. For example, if contoso.com is the primary domain in Azure AD, contoso.org is the primary domain in on-premises AD owned by Contoso and [verified in Azure AD](https://docs.microsoft.com/azure/active-directory/fundamentals/add-custom-domain)
- Non-routable UPN: A non-routable UPN does not have a verified domain. It is applicable only within your organization's private network. For example, if contoso.com is the primary domain in Azure AD, contoso.local is the primary domain in on-premises AD but is not a verifiable domain in the internet and only used within Contoso's network.

The table below provides details on support for these on-premises AD UPNs in Windows 10 Hybrid Azure AD join

| Type of on-premises AD UPN | Domain type | Windows 10 version | Description |
| ----- | ----- | ----- | ----- |
| Routable | Federated | From 1703 release | Generally available |
| Non-routable | Federated | From 1803 release | Generally available |
| Routable | Managed | Not supported | |
| Non-routable | Managed | Not supported | |

## Next steps

> [!div class="nextstepaction"]
> [Configure hybrid Azure Active Directory join for federated enviornment](hybrid-azuread-join-federated-domains.md)
> [Configure hybrid Azure Active Directory join for managed environment](hybrid-azuread-join-managed-domains.md)

<!--Image references-->
[1]: ./media/hybrid-azuread-join-plan/12.png
