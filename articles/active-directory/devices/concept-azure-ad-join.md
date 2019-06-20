---
title: What are Azure AD joined devices in Azure Active Directory?
description: Learn how device identity management can help you to manage devices that are accessing resources in your environment.
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
ms.topic: overview
ms.date: 06/04/2019
ms.author: joflore
ms.reviewer: sandeo
#Customer intent: As an IT admin, I want to learn how to bring and manage device identities in Azure AD, so that I can ensure that my users are accessing my resources from devices that meet my standards for security and compliance.

ms.collection: M365-identity-device-management
---
# Azure AD joined devices

**Azure AD Join** is intended for organizations that want to be cloud-first (that is, primarily use cloud services, with a goal to reduce use of an on-premises infrastructure) or cloud-only (no on-premises infrastructure). There are no restrictions on the size or type of organizations that can deploy Azure AD Join. Azure AD Join works well even in a hybrid environment, enabling access to both cloud and on-premises apps and resources.

Implementing Azure AD joined devices provides you with the following benefits:

- **Single-Sign-On (SSO)** to your Azure managed SaaS apps and services. Your users don’t see additional authentication prompts when accessing work resources. The SSO functionality is available, even when your users are not connected to the domain network.
- **Enterprise compliant roaming** of user settings across joined devices. Users don’t need to connect a Microsoft account (for example, Hotmail) to see settings across devices.
- **Access to Windows Store for Business** using an Azure AD account. Your users can choose from an inventory of applications pre-selected by the organization.
- **Windows Hello** support for secure and convenient access to work resources.
- **Restriction of access** to apps from only devices that meet compliance policy.
- **Seamless access to on-premises resources** when the device has line of sight to the on-premises domain controller.

While Azure AD join is primarily intended for organizations that do not have an on-premises Windows Server Active Directory infrastructure, you can certainly use it in scenarios where:

- You want to transition to cloud-based infrastructure using Azure AD and MDM like Intune.
- You can’t use an on-premises domain join, for example, if you need to get mobile devices such as tablets and phones under control.
- Your users primarily need to access Office 365 or other SaaS apps integrated with Azure AD.
- You want to manage a group of users in Azure AD instead of in Active Directory. This can apply, for example, to seasonal workers, contractors, or students.
- You want to provide joining capabilities to workers in remote branch offices with limited on-premises infrastructure.

You can configure Azure AD joined devices for Windows 10 devices.


The goal of Azure AD joined devices is to simplify:

- Windows deployments of work-owned devices
- Access to organizational apps and resources from any Windows device
- Cloud-based management of work-owned devices
- Users to sign in to their devices with their Azure AD or synced Active Directory work or school accounts.

![Azure AD registered devices](./media/overview/02.png)

Azure AD Join can be deployed by using any of the following methods:

- [Windows Autopilot](https://docs.microsoft.com/windows/deployment/windows-autopilot/windows-10-autopilot)
- [Bulk deployment](https://docs.microsoft.com/intune/windows-bulk-enroll)
- [Self-service experience](azuread-joined-devices-frx.md)
