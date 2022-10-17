---
title: Protecting authentication methods in Azure Active Directory
description: Learn about authentication features that may be enabled by default in Azure Active Directory

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 10/17/2022

ms.author: justinha
author: mjsantani
manager: amycolannino

ms.collection: M365-identity-device-management

# Customer intent: As an identity administrator, I want to encourage users to understand how default protection can improve our security posture.
---
# Protecting authentication methods in Azure Active Directory

Azure Active Directory (Azure AD) adds and improves security features to better protect customers against increasing attacks. As new attack vectors become known, Azure AD may respond by enabling protection by default to help customers stay ahead of emerging security threats. 

For example, in response to increasing MFA fatigue attacks, Microsoft recommended ways for customers to [defend users](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/defend-your-users-from-mfa-fatigue-attacks/ba-p/2365677). One recommendation to prevent users from accidental multifactor authentication (MFA) approvals is to enable [number matching](how-to-mfa-number-match.md). As a result, default behavior for number matching will be explicitly **Enabled** for all Microsoft Authenticator users.  

This topic explains how default protection is applied to the Authentication methods policy for Azure AD. 

## Default protection

There are two ways for protection to be enabled by default: 

- Azure AD will enable protection by default for all tenants on a certain date. Microsoft schedules default protection far in advance to give customers time to prepare for the change. During that time, customers are encouraged to use the Azure portal or Graph API to test and roll out the changes on their own schedule. Customers can't opt out if Microsoft schedules protection by default. 
- Protection can be **Microsoft managed**, which means Azure AD can enable or disable protection based upon the current landscape of security threats. Customers can choose whether to allow Microsoft to manage the protection. They can change from **Microsoft managed** to explicitly make the protection **Enabled** or **Disabled** at any time. 

## Default protection enabled by Azure AD

Number matching is a good example of protection for an authentication method that was optional and disabled for all tenants. Customers could choose to enable number matching in Microsoft Authenticator for users and groups, or they could leave it disabled. 

As MFA fatigue attacks rise, Microsoft responds to the threat by changing the default behavior for push notifications in Microsoft Authenticator. As a result, Azure AD will make number matching in push notifications the default behavior for all users in every tenant. Number matching is already the default behavior for passwordless notifications in Microsoft Authenticator, and users can't opt out.

## Microsoft managed settings

In addition to configuring Authentication methods policy settings to be either **Enabled** or **Disabled**, IT admins can configure some settings in the Authentication methods policy to be **Microsoft managed**. A setting that is configured as **Microsoft managed** allows Azure AD to enable or disable the setting. 

The option to let Azure AD manage the setting is a convenient way for an organization to allow Microsoft to enable or disable a feature by default. Organizations can more easily improve their security posture by trusting Microsoft to manage when a feature should be enabled by default. By configuring a setting as **Microsoft managed** (named *default* in Graph APIs), IT admins can trust Microsoft to enable a security feature they haven't explicitly disabled. 

For example, an admin can enable [number matching](how-to-mfa-number-match.md) in push notifications to require users to type a two-digit code from the sign-in screen into Microsoft Authenticator. Number matching can also be explicitly disabled, or set as **Microsoft managed**. Today, the **Microsoft managed** configuration for number matching is **Disabled**, which effectively disables it for any environment where an admin chooses to let Azure AD manage the setting. 

Soon, the **Microsoft managed** configuration for number matching will change to **Enabled**. Microsoft plans to change the **Microsoft managed** configuration for number matching to **Enabled** to counter [increased MFA fatigue attacks](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/defend-your-users-from-mfa-fatigue-attacks/ba-p/2365677). The requirement to type a two-digit code helps stop accidental MFA approvals that lead to an attack.

For customers who want to rely upon Microsoft to improve their security posture, setting security features to **Microsoft managed** is an easy way stay ahead of security threats. They can trust Microsoft to determine the best way to configure security settings based on the current threat landscape.  

The following table lists each setting that can be set to Microsoft managed and whether that setting is enabled or disabled by default. 

| Setting                                                                                         | Configuration |
|-------------------------------------------------------------------------------------------------|---------------|
| [Registration campaign](how-to-mfa-registration-campaign.md)                                    | Disabled      |
| [Number matching](how-to-mfa-number-match.md)                                                   | Disabled      |
| [Additional context in Microsoft Authenticator notifications](how-to-mfa-additional-context.md) | Disabled      |

As threat vectors change, Azure AD may change settings from **Microsoft managed** to scheduled default enablement. 

## Next steps

[Authentication methods in Azure Active Directory - Microsoft Authenticator](concept-authentication-authenticator-app.md)

