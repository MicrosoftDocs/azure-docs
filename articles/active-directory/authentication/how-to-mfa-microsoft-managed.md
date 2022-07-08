---
title: Use Microsoft managed settings for the Authentication Methods Policy - Azure Active Directory
description: Learn how to use Microsoft managed settings for Microsoft Authenticator

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 02/22/2022

ms.author: justinha
author: mjsantani
manager: karenhoran

ms.collection: M365-identity-device-management

# Customer intent: As an identity administrator, I want to encourage users to use the Microsoft Authenticator app in Azure AD to improve and secure user sign-in events.
---
# How to use Microsoft managed settings - Authentication Methods Policy

<!---what API--->

In addition to configuring Authentication Methods Policy settings to be either **Enabled** or **Disabled**, IT admins can configure some settings to be **Microsoft managed**. A setting that is configured as **Microsoft managed** allows Azure AD to enable or disable the setting. 

The option to let Azure AD manage the setting is a convenient way for an organization to allow Microsoft to enable or disable a feature by default. Organizations can more easily improve their security posture by trusting Microsoft to manage when a feature should be enabled by default. By configuring a setting as **Microsoft managed** (named *default* in Graph APIs), IT admins can trust Microsoft to enable a security feature they have not explicitly disabled. 

## Settings that can be Microsoft managed

The following table list each setting that can be set to Microsoft managed and whether that setting is enabled or disabled by default. 

| Setting                                                                                                                         | Configuration |
|---------------------------------------------------------------------------------------------------------------------------------|---------------|
| [Registration campaign](how-to-mfa-registration-campaign.md)                                                      | Disabled      |
| [Number match](how-to-mfa-number-match.md)                                             | Disabled      |
| [Additional context in Microsoft Authenticator notifications](how-to-mfa-additional-context.md) | Disabled      |

## Next steps

[Authentication methods in Azure Active Directory - Microsoft Authenticator app](concept-authentication-authenticator-app.md)
