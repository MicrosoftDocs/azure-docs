---
title: Protecting authentication methods in Microsoft Entra ID
description: Learn about authentication features that may be enabled by default in Microsoft Entra ID

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 09/29/2023

ms.author: justinha
author: ChristianCB83
manager: amycolannino

ms.collection: M365-identity-device-management

# Customer intent: As an identity administrator, I want to encourage users to understand how default protection can improve our security posture.
---
# Protecting authentication methods in Microsoft Entra ID

>[!NOTE]
>The Microsoft managed value for Authenticator Lite will move from disabled to enabled on June 26th, 2023. All tenants left in the default state **Microsoft managed** will be enabled for the feature on June 26th.

Microsoft Entra ID adds and improves security features to better protect customers against increasing attacks. As new attack vectors become known, Microsoft Entra ID may respond by enabling protection by default to help customers stay ahead of emerging security threats. 

For example, in response to increasing MFA fatigue attacks, Microsoft recommended ways for customers to [defend users](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/defend-your-users-from-mfa-fatigue-attacks/ba-p/2365677). One recommendation to prevent users from accidental multifactor authentication (MFA) approvals is to enable [number matching](how-to-mfa-number-match.md). As a result, default behavior for number matching will be explicitly **Enabled** for all Microsoft Authenticator users. You can learn more about new security features like number matching in our blog post [Advanced Microsoft Authenticator security features are now generally available!](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/advanced-microsoft-authenticator-security-features-are-now/ba-p/2365673). 

There are two ways for protection of a security feature to be enabled by default: 

- After a security feature is released, customers can use the Microsoft Entra admin center or Graph API to test and roll out the change on their own schedule. To help defend against new attack vectors, Microsoft Entra ID may enable protection of a security feature by default for all tenants on a certain date, and there won't be an option to disable protection. Microsoft schedules default protection far in advance to give customers time to prepare for the change. Customers can't opt out if Microsoft schedules protection by default. 
- Protection can be **Microsoft managed**, which means Microsoft Entra ID can enable or disable protection based upon the current landscape of security threats. Customers can choose whether to allow Microsoft to manage the protection. They can change from **Microsoft managed** to explicitly make the protection **Enabled** or **Disabled** at any time. 

>[!NOTE]
>Only a critical security feature will have protection enabled by default.  

<a name='default-protection-enabled-by-azure-ad'></a>

## Default protection enabled by Microsoft Entra ID

Number matching is a good example of protection for an authentication method that is currently optional for push notifications in Microsoft Authenticator in all tenants. Customers could choose to enable number matching for push notifications in Microsoft Authenticator for users and groups, or they could leave it disabled. Number matching is already the default behavior for passwordless notifications in Microsoft Authenticator, and users can't opt out.

As MFA fatigue attacks rise, number matching becomes more critical to sign-in security. As a result, Microsoft will change the default behavior for push notifications in Microsoft Authenticator. 

## Microsoft managed settings

In addition to configuring Authentication methods policy settings to be either **Enabled** or **Disabled**, IT admins can configure some settings in the Authentication methods policy to be **Microsoft managed**. A setting that is configured as **Microsoft managed** allows Microsoft Entra ID to enable or disable the setting. 

The option to let Microsoft Entra ID manage the setting is a convenient way for an organization to allow Microsoft to enable or disable a feature by default. Organizations can more easily improve their security posture by trusting Microsoft to manage when a feature should be enabled by default. By configuring a setting as **Microsoft managed** (named *default* in Graph APIs), IT admins can trust Microsoft to enable a security feature they haven't explicitly disabled. 

For example, an admin can enable [location and application name](how-to-mfa-number-match.md) in push notifications to give users more context when they approve MFA requests with Microsoft Authenticator. The additional context can also be explicitly disabled, or set as **Microsoft managed**. Today, the **Microsoft managed** configuration for location and application name is **Disabled**, which effectively disables the option for any environment where an admin chooses to let Microsoft Entra ID manage the setting. 

As the security threat landscape changes over time, Microsoft may change the **Microsoft managed** configuration for location and application name to **Enabled**. For customers who want to rely upon Microsoft to improve their security posture, setting security features to **Microsoft managed** is an easy way stay ahead of security threats. They can trust Microsoft to determine the best way to configure security settings based on the current threat landscape.  

The following table lists each setting that can be set to Microsoft managed and whether that setting is enabled or disabled by default. 

| Setting                                                                                         | Configuration |
|-------------------------------------------------------------------------------------------------|---------------|
| [Registration campaign](how-to-mfa-registration-campaign.md)                                    | From Sept. 25 to Oct. 20, 2023, the Microsoft managed value for the registration campaign will change to Enabled for text message and voice call users across all tenants. |
| [Location in Microsoft Authenticator notifications](how-to-mfa-additional-context.md)           | Disabled      |
| [Application name in Microsoft Authenticator notifications](how-to-mfa-additional-context.md)   | Disabled      |
| [System-preferred MFA](concept-system-preferred-multifactor-authentication.md)                  | Enabled       |
| [Authenticator Lite](how-to-mfa-authenticator-lite.md)                                          | Enabled       |  
| [Report suspicious activity](howto-mfa-mfasettings.md#report-suspicious-activity)                  | Disabled      |

As threat vectors change, Microsoft Entra ID may announce default protection for a **Microsoft managed** setting in [release notes](../fundamentals/whats-new.md) and on commonly read forums like [Tech Community](https://techcommunity.microsoft.com/). For example, see our blog post [It's Time to Hang Up on Phone Transports for Authentication](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/it-s-time-to-hang-up-on-phone-transports-for-authentication/ba-p/1751752) for more information about the need to move away from using text message and voice calls, which led to default enablement for the registration campaign to help users to set up Authenticator for modern authentication.

## Next steps

[Authentication methods in Microsoft Entra ID - Microsoft Authenticator](concept-authentication-authenticator-app.md)
