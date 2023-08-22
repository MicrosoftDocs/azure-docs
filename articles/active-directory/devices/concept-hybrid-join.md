---
title: What is a hybrid Azure AD joined device?
description: Learn how device identity management can help you to manage devices that are accessing resources in your environment.

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: conceptual
ms.date: 01/24/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: sandeo

ms.collection: M365-identity-device-management
---
# Hybrid Azure AD joined devices

Organizations with existing Active Directory implementations can benefit from some of the functionality provided by Azure Active Directory (Azure AD) by implementing hybrid Azure AD joined devices. These devices are joined to your on-premises Active Directory and registered with Azure Active Directory.

Hybrid Azure AD joined devices require network line of sight to your on-premises domain controllers periodically. Without this connection, devices become unusable. If this requirement is a concern, consider [Azure AD joining](concept-directory-join.md) your devices.

| Hybrid Azure AD Join | Description |
| --- | --- |
| **Definition** | Joined to on-premises AD and Azure AD requiring organizational account to sign in to the device |
| **Primary audience** | Suitable for hybrid organizations with existing on-premises AD infrastructure |
|   | Applicable to all users in an organization |
| **Device ownership** | Organization |
| **Operating Systems** | Windows 11, Windows 10 or 8.1 except Home editions |
|   | Windows Server 2008/R2, 2012/R2, 2016, 2019 and 2022 |
| **Provisioning** | Windows 11, Windows 10, Windows Server 2016/2019/2022 |
|   | Domain join by IT and autojoin via Azure AD Connect or ADFS config |
|   | Domain join by Windows Autopilot and autojoin via Azure AD Connect or ADFS config |
|   | Windows 8.1, Windows Server 2012 R2, Windows Server 2012, and Windows Server 2008 R2 - Require MSI |
| **Device sign in options** | Organizational accounts using: |
|   | Password |
|   | [Passwordless](/azure/active-directory/authentication/concept-authentication-passwordless) options like [Windows Hello for Business](/windows/security/identity-protection/hello-for-business/hello-planning-guide) and FIDO2.0 security keys. |
| **Device management** | [Group Policy](/mem/configmgr/comanage/faq#my-environment-has-too-many-group-policy-objects-and-legacy-authenticated-apps--do-i-have-to-use-hybrid-azure-ad-) |
|   | [Configuration Manager standalone or co-management with Microsoft Intune](/mem/configmgr/comanage/overview) |
| **Key capabilities** | SSO to both cloud and on-premises resources |
|   | Conditional Access through Domain join or through Intune if co-managed |
|   | [Self-service Password Reset and Windows Hello PIN reset on lock screen](../authentication/howto-sspr-windows.md) |

:::image type="content" source="media/concept-hybrid-join/azure-ad-hybrid-joined-device.png" alt-text="Diagram showing how a hybrid joined device works.":::
## Scenarios

Use Azure AD hybrid joined devices if:

- You support down-level devices running Windows 8.1, Windows Server 2008/R2, 2012/R2, 2016.
- You want to continue to use [Group Policy](/mem/configmgr/comanage/faq#my-environment-has-too-many-group-policy-objects-and-legacy-authenticated-apps--do-i-have-to-use-hybrid-azure-ad-) to manage device configuration.
- You want to continue to use existing imaging solutions to deploy and configure devices.
- You have Win32 apps deployed to these devices that rely on Active Directory machine authentication.

## Next steps

- [Plan your hybrid Azure AD join implementation](hybrid-join-plan.md)
- [Co-management using Configuration Manager and Microsoft Intune](/mem/configmgr/comanage/overview)
- [Manage device identities using the Azure portal](manage-device-identities.md)
- [Manage stale devices in Azure AD](manage-stale-devices.md)
