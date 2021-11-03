---
title: Use Microsoft managed settings for the Authentication Methods Policy - Azure Active Directory
description: Learn how to use Microsoft managed settings for Microsoft Authenticator

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 11/03/2021

ms.author: justinha
author: mjsantani
manager: daveba

ms.collection: M365-identity-device-management

# Customer intent: As an identity administrator, I want to encourage users to use the Microsoft Authenticator app in Azure AD to improve and secure user sign-in events.
---
# How to use Microsoft managed settings - Authentication Methods Policy

In addition to configuring Authentication Methods Policy settings to be either **Enabled** or **Disabled**, IT admins can configure some settings to be **Microsoft managed**. A setting that is configured as **Microsoft managed** allows Azure AD to enable or disable the setting. 

## Settings that can be Microsoft managed

The following table lists settings that can be set to Microsoft managed and whether it is enabled or disabled. 

| Setting         | Configuration |
|-----------------|---------------|
| [Registration campaign](how-to-nudge-authenticator-app.md)  | Disabled      |
| Number match        | Disabled      |
| Additional context  | Disabled      |

## Next steps

[Authentication methods in Azure Active Directory - Microsoft Authenticator app](concept-authentication-authenticator-app.md)
