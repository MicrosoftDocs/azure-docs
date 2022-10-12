---
title: Default enablement for authentication methods in Azure Active Directory
description: Learn about authentication features that may be enabled by default in Azure Active Directory

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 10/12/2022

ms.author: justinha
author: mjsantani
manager: amycolannino

ms.collection: M365-identity-device-management

# Customer intent: As an identity administrator, I want to encourage users to understand how letting Microsoft manage settings can improve our security posture.
---
# Default enablement for authentication methods in Azure Active Directory

As security threats evolve, Azure Active Directory (Azure AD) adds and improves security features to better protect customers. If an attack vector emerges as threat to customers, Azure AD may respond by enabling protection by default to help customers maintain security. 

For example, in response to increasing MFA fatigue attacks, Microsoft recommended ways for customers to [defend users](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/defend-your-users-from-mfa-fatigue-attacks/ba-p/2365677). One recommendation to prevent users from accidental multifactor authentication (MFA) approvals is to enable [number matching](how-to-mfa-number-match.md). As a result, default behavior for number matching will change from **Microsoft managed** (implicitly disabled) to explicitly **Enabled**.  

This topic explains how default enablement works for security settings in Azure AD. 

## Types of default enablement

There are two ways for a setting to be enabled by default: 

- **Scheduled default enablement** is a specific date after which all Azure AD tenants have the setting enabled by default. Microsoft announces the schedule to enable a setting by default far in advance to give customers time to prepare for the change. Customers can't opt out when a setting is scheduled to be enabled by default. 
- **Microsoft managed settings** can be enabled or disabled by Azure AD based upon current landscape of security threats. Customers control whether to allow Microsoft to manage the setting. They can change a setting from **Microsoft managed** at any time to explicitly make it **Enabled** or **Disabled**. 

## Scheduled default enablement

To address emerging security threats, Microsoft may occasionally change default behavior of a feature, or even deprecate a feature. These changes are announced... how?

The scheduled default enablement for number matching is a good example, where Microsoft responds to increasing MFA fatigue attacks by changing the default behavior for push notifications in Microsoft Authenticator. Number matching was made available initially as a Microsoft managed settings that was disabled. 

After thousands of customers worldwide chose to enable it and as MFA fatigue attacks rise, Azure AD will make number matching in push notifications the default behavior for all users in every tenant. Number matching is already the default behavior for passwordless notifications in Microsoft Authenticator, and users can't opt out.

Customers should leverage the rollout controls that exist via API and UX to enable the feature.

## Microsoft managed settings

In addition to configuring Authentication methods policy settings to be either **Enabled** or **Disabled**, IT admins can configure some settings to be **Microsoft managed**. A setting that is configured as **Microsoft managed** allows Azure AD to enable or disable the setting. 

The option to let Azure AD manage the setting is a convenient way for an organization to allow Microsoft to enable or disable a feature by default. Organizations can more easily improve their security posture by trusting Microsoft to manage when a feature should be enabled by default. By configuring a setting as **Microsoft managed** (named *default* in Graph APIs), IT admins can trust Microsoft to enable a security feature they haven't explicitly disabled. 

For example, an admin can enable [number matching](how-to-mfa-number-match.md) in push notifications to require users to type a two-digit code from the sign-in screen into Microsoft Authenticator. Number matching can also be explicitly disabled, or set as **Microsoft managed**. Today, the **Microsoft managed** configuration for number matching is **Disabled**, which effectively disables it for any environment where an admin chooses to let Azure AD manage the setting. 

Soon, the **Microsoft managed** configuration for number matching will change to **Enabled**. Microsoft plans to change the **Microsoft managed** configuration for number matching to **Enabled** to counter [increased MFA fatigue attacks](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/defend-your-users-from-mfa-fatigue-attacks/ba-p/2365677). The requirement to type a two-digit code helps stop accidental MFA approvals that lead to an attack.

For customers who want to rely upon Microsoft to improve their security posture, setting security features to **Microsoft managed** is an easy way stay ahead of security threats. They can trust Microsoft to determine the best way to configure security settings based on the current threat landscape.  

### Settings that can be Microsoft managed

The following table lists each setting that can be set to Microsoft managed and whether that setting is enabled or disabled by default. 

| Setting                                                                                         | Configuration |
|-------------------------------------------------------------------------------------------------|---------------|
| [Registration campaign](how-to-mfa-registration-campaign.md)                                    | Disabled      |
| [Number matching](how-to-mfa-number-match.md)                                                   | Disabled      |
| [Additional context in Microsoft Authenticator notifications](how-to-mfa-additional-context.md) | Disabled      |


## Transition to scheduled default enablement

As threat vectors change, Azure AD may change settings from **Microsoft managed** to scheduled default enablement. 

## Next steps

[Authentication methods in Azure Active Directory - Microsoft Authenticator](concept-authentication-authenticator-app.md)

