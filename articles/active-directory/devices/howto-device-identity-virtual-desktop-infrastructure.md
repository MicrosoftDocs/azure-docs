---
title: Device identity and desktop virtualization - Azure Active Directory
description: Learn how VDI and Azure AD device identities can be used together

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: conceptual
ms.date: 10/15/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: sandeo

# Customer intent: As an administrator, I want to provide staff with secured workstations to reduce the risk of breach due to misconfiguration or compromise.

ms.collection: M365-identity-device-management
---
# Device identity and desktop virtualization

Administrators commonly deploy virtual desktop infrastructure (VDI) platforms hosting Windows operating systems in their organizations. Administrators deploy VDI to:

- Streamline management.
- Reduce costs through consolidation and centralization of resources.
- Deliver end-users mobility and the freedom to access virtual desktops anytime, from anywhere, on any device.

There are two primary types of virtual desktops:

- Persistent
- Non-persistent

Persistent versions use a unique desktop image for each user or a pool of users. These unique desktops can be customized and saved for future use. 

Non-persistent versions use a collection of desktops that users can access on an as needed basis. These non-persistent desktops are reverted to their original state after the user signs out.

This article will cover Microsoft's guidance to administrators on support for device identity and VDI. For more information about device identity, see the article [What is a device identity](overview.md).

## Supported scenarios

Before configuring device identities in Azure AD for your VDI environment, familiarize yourself with the supported scenarios. The table below illustrates which provisioning scenarios are supported. Provisioning in this context implies that an administrator can configure device identities at scale without requiring any end-user interaction.

| Device identity type | Identity infrastructure | Windows devices | VDI platform version | Supported |
| --- | --- | --- | --- | --- |
| Hybrid Azure AD joined | Federated* | Windows current*** and Windows down-level**** | Persistent | Yes |
|   |   | Windows current | Non-Persistent | No |
|   |   | Windows down-level | Non-Persistent | Yes |
|   | Managed** | Windows current and Windows down-level | Persistent | Yes |
|   |   | Windows current | Non-Persistent | No |
|   |   | Windows down-level | Non-Persistent | Yes |
| Azure AD joined | Federated | Windows current | Persistent | No |
|   |   |   | Non-Persistent | No |
|   | Managed | Windows current | Persistent | No |
|   |   |   | Non-Persistent | No |
| Azure AD registered | Federated | Windows current | Persistent | No |
|   |   |   | Non-Persistent | No |
|   | Managed | Windows current | Persistent | No |
|   |   |   | Non-Persistent | No |

\* A **Federated** identity infrastructure environment represents an environment with an identity provider such as AD FS or other third-party IDP.

\*\* A **Managed** identity infrastructure environment represents an environment with Azure AD as the identity provider deployed with either [password hash sync (PHS)](../hybrid/whatis-phs.md) or [pass-through authentication (PTA)](../hybrid/how-to-connect-pta.md) with [seamless single sign-on](../hybrid/how-to-connect-sso.md).

\*\*\* **Windows current** devices represent Windows 10, Windows Server 2016, and Windows Server 2019.

\*\*\*\* **Windows down-level** devices represent Windows 7, Windows 8.1, Windows Server 2008 R2, Windows Server 2012, and Windows Server 2012 R2. For support information on Windows 7, see [Support for Windows 7 is ending](https://www.microsoft.com/microsoft-365/windows/end-of-windows-7-support). For support information on Windows Server 2008 R2, see [Prepare for Windows Server 2008 end of support](https://www.microsoft.com/cloud-platform/windows-server-2008).

## Microsoft’s guidance

Administrators should reference the following articles, based on their identity infrastructure, to learn how to configure hybrid Azure AD join.

- [Configure hybrid Azure Active Directory join for federated environment](hybrid-azuread-join-federated-domains.md)
- [Configure hybrid Azure Active Directory join for managed environment](hybrid-azuread-join-managed-domains.md)

If you are relying on the System Preparation Tool (sysprep.exe) and if you are using a pre-Windows 10 1809 image for installation, make sure that image is not from a device that is already registered with Azure AD as hybrid Azure AD joined.

If you are relying on a Virtual Machine (VM) snapshot to create additional VMs, make sure that snapshot is not from a VM that is already registered with Azure AD as Hybrid Azure AD join.

When deploying non-persistent VDI, IT administrators should pay close attention to managing stale devices in Azure AD. Microsoft recommends that IT administrators implement the guidance below. Failure to do so will result in your directory having lots of stale Hybrid Azure AD joined devices that were registered from your non-persistent VDI platform.

- Create and use a prefix for the display name of the computer that indicates the desktop as VDI-based.
- Implement the following command as part of logoff script. This command will trigger a best effort call to Azure AD to delete the device.
   - For Windows down-level devices – autoworkplace.exe /leave
- Define and implement process for [managing stale devices](manage-stale-devices.md).
   - Once you have a strategy to identify your non-persistent Hybrid Azure AD joined devices, you can be more aggressive on the clean-up of these devices to ensure your directory does not get consumed with lots of stale devices.
 
## Next steps

[Configuring hybrid Azure Active Directory join for federated environment](hybrid-azuread-join-federated-domains.md)
