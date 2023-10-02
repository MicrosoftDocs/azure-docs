---
title: What are Microsoft Entra registered devices?
description: Learn how Microsoft Entra registered devices provide your users with support for bring your own device (BYOD) or mobile device scenarios.

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: conceptual
ms.date: 09/30/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: sandeo

ms.collection: M365-identity-device-management
---

# Microsoft Entra registered devices

The goal of Microsoft Entra registered - also known as Workplace joined - devices is to provide your users with support for bring your own device (BYOD) or mobile device scenarios. In these scenarios, a user can access your organization’s resources using a personal device.

| Microsoft Entra registered | Description |
| --- | --- |
| **Definition** | Registered to Microsoft Entra ID without requiring organizational account to sign in to the device |
| **Primary audience** | Applicable to all users with the following criteria: |
|   | Bring your own device |
|   | Mobile devices |
| **Device ownership** | User or Organization |
| **Operating Systems** | Windows 10 or newer, iOS, Android, macOS, Ubuntu 20.04/22.04 LTS|
| **Provisioning** | Windows 10 or newer – Settings |
|   | iOS/Android – Company Portal or Microsoft Authenticator app |
|   | macOS – Company Portal |
|   | Linux - Intune Agent |
| **Device sign in options** | End-user local credentials |
|   | Password |
|   | Windows Hello |
|   | PIN |
|   | Biometrics or pattern for other devices |
| **Device management** | Mobile Device Management (example: Microsoft Intune) |
|   | Mobile Application Management |
| **Key capabilities** | SSO to cloud resources |
|   | Conditional Access when enrolled into Intune |
|   | Conditional Access via App protection policy |
|   | Enables Phone sign in with Microsoft Authenticator app |

![Microsoft Entra registered devices](./media/concept-device-registration/azure-ad-registered-device.png)

Microsoft Entra registered devices are signed in to using a local account like a Microsoft account on a Windows 10 or newer device. These devices have a Microsoft Entra account for access to organizational resources. Access to resources in the organization can be limited based on that Microsoft Entra account and Conditional Access policies applied to the device identity.

Microsoft Entra Registration is not the same as device enrollment. If Administrators permit users to enroll their devices, organizations can further control these Microsoft Entra registered devices by enrolling the device(s) into Mobile Device Management (MDM) tools like Microsoft Intune. MDM provides a means to enforce organization-required configurations like requiring storage to be encrypted, password complexity, and security software kept updated. 

Microsoft Entra registration can be accomplished when accessing a work application for the first time or manually using the Windows 10 or Windows 11 Settings menu. 

## Scenarios

A user in your organization wants to access your benefits enrollment tool from their home PC. Your organization requires that anyone accesses this tool from an Intune compliant device. The user registers their home PC with Microsoft Entra ID and Enrolls the device in Intune, then the required Intune policies are enforced giving the user access to their resources.

Another user wants to access their organizational email on their personal Android phone that has been rooted. Your company requires a compliant device and has created an Intune compliance policy to block any rooted devices. The employee is stopped from accessing organizational resources on this device.

## Next steps

- [Manage device identities](manage-device-identities.md)
- [Manage stale devices in Microsoft Entra ID](manage-stale-devices.md)
- [Register your personal device on your work or school network](https://support.microsoft.com/account-billing/register-your-personal-device-on-your-work-or-school-network-8803dd61-a613-45e3-ae6c-bd1ab25bf8a8)
