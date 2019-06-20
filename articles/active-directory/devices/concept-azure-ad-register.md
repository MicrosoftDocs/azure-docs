---
title: What are Azure AD registered devices in Azure Active Directory?
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
# Azure AD registered devices

The goal of Azure AD registered devices is to provide you with support for the **Bring Your Own Device (BYOD)** scenario. In this scenario, a user can access your organization’s Azure Active Directory controlled resources using a personal device.  

![Azure AD registered devices](./media/overview/03.png)

The access is based on a work or school account that has been entered on the device.  
For example, Windows 10 enables users to add a work or school account to a personal computer, tablet, or phone.  
When a user has added a work or school account, the device is registered with Azure AD and optionally enrolled in the mobile device management (MDM) system that your organization has configured.
Your organization’s users can add a work or school account to a personal device conveniently:

- When accessing a work application for the first time
- Manually via the **Settings** menu in the case of Windows 10

You can configure an Azure AD registered device state for **Windows 10 personal, iOS, Android and macOS** devices.
