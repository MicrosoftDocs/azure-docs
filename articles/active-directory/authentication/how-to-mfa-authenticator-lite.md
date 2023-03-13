---
title: How to enable Authenticator Lite for Microsoft Outlook
description: Learn about how to you can set up Authenticator Lite for Microsoft Outlook to help users validate their identity when they use email

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 03/12/2023

ms.author: justinha
author: mjsantani
manager: amycolannino

ms.collection: M365-identity-device-management

# Customer intent: As an identity administrator, I want to encourage users to understand how default protection can improve our security posture.
---
# How to enable Authenticator Lite for Microsoft Outlook

Authenticator Lite is another surface for Azure Active Directory (Azure AD) users to complete multifactor authentication by using push notifications or time-based one-time passcodes (TOTP) on their Android or iOS device. With Authenticator Lite, users can satisfy a multifactor authentication requirement from the convenience of a familiar app. Authenticator Lite is currently enabled in Microsoft Outlook. 

Users receive a notification in Outlook to approve or deny sign-in, or they can enter the TOTP of Authenticator in Outlook during sign-in. 

## Prerequisites

- Your organization needs to enable Microsoft Authenticator (second factor) push notifications for some users or groups by using the Authentication methods policy. You can edit the Authentication methods policy by using the Azure portal or Microsoft Graph API.
- If your organization is using the Active Directory Federation Services (AD FS) adapter or Network Policy Server (NPS) extensions, upgrade to the latest versions for a consistent experience.
- Users enabled for shared device mode on Outlook aren'tt eligible for Authenticator Lite.
- Users must run a minimum Outlook version.

  | Operating system | Outlook version |
  |:----------------:|:---------------:|
  |Android           | 4.2308.0        |
  |iOS               | 4.2309.0        |

## Enable Authenticator Lite


