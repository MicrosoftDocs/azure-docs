---
title: Azure Multi-Factor Authentication versions and consumption plans
description: Learn about the Azure Multi-factor Authentication client and different methods and versions available. 

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 06/15/2020

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: michmcla
ms.collection: M365-identity-device-management
---
# Features and licenses for Azure Multi-Factor Authentication

To protect user accounts in your organization, multi-factor authentication should be used. This feature is especially important for accounts that have privileged access to resources. Basic multi-factor authentication features are available to Microsoft 365 and Azure Active Directory (Azure AD) administrators for no extra cost. If you want to upgrade the features for your admins or extend multi-factor authentication to the rest of your users, you can purchase Azure Multi-Factor Authentication in several ways.

> [!IMPORTANT]
> This article details the different ways that Azure Multi-Factor Authentication can be licensed and used. For specific details about pricing and billing, see the [Azure Multi-Factor Authentication pricing page](https://azure.microsoft.com/pricing/details/multi-factor-authentication/).

## Available versions of Azure Multi-Factor Authentication

Azure Multi-Factor Authentication can be used, and licensed, in a few different ways depending on your organization's needs. You may already be entitled to use Azure Multi-Factor Authentication depending on the Azure AD, EMS, or Microsoft 365 license you currently have. The following table details the different ways to get Azure Multi-Factor Authentication and some of the features and use cases for each.

| If you're a user of | Capabilities and use cases |
| --- | --- |
| Microsoft 365 Business Premium and EMS or Microsoft 365 E3 and E5 | EMS E3, Microsoft 365 E3, and Microsoft 365 Business Premium includes Azure AD Premium P1. EMS E5 or Microsoft 365 E5 includes Azure AD Premium P2. You can use the same Conditional Access features noted in the following sections to provide multi-factor authentication to users. |
| Azure AD Premium P1 | You can use [Azure AD Conditional Access](../conditional-access/howto-conditional-access-policy-all-users-mfa.md) to prompt users for multi-factor authentication during certain scenarios or events to fit your business requirements. |
| Azure AD Premium P2 | Provides the strongest security position and improved user experience. Adds [risk-based Conditional Access](../conditional-access/howto-conditional-access-policy-risk.md) to the Azure AD Premium P1 features that adapts to user's patterns and minimizes multi-factor authentication prompts. |
| All Microsoft 365 plans | Azure Multi-Factor Authentication can be [enabled on a per-user basis](howto-mfa-userstates.md), or enabled or disabled for all users, for all sign-in events, using security defaults. Management of Azure Multi-Factor Authentication is through the Office 365 portal. For an improved user experience, upgrade to Azure AD Premium P1 or P2 and use Conditional Access. For more information, see [secure Office 365 resources with multi-factor authentication](https://support.office.com/article/Set-up-multi-factor-authentication-for-Office-365-users-8f0454b2-f51a-4d9c-bcde-2c48e41621c6). |
| Azure AD free | You can use [security defaults](../fundamentals/concept-fundamentals-security-defaults.md) to enable multi-factor authentication for all users, every time an authentication request is made. You don't have granular control of enabled users or scenarios, but it does provide that additional security step.<br /> Even when security defaults aren't used to enable multi-factor authentication for everyone, users assigned the *Azure AD Global Administrator* role can be configured to use multi-factor authentication. This feature of the free tier makes sure the critical administrator accounts are protected by multi-factor authentication. |

## Feature comparison of versions

The following table provides a list of the features that are available in the various versions of Azure Multi-Factor Authentication. Plan out your needs for securing user authentication, then determine which approach meets those requirements. For example, although Azure AD Free provides security defaults that provide Azure Multi-Factor Authentication, only the mobile authenticator app can be used for the authentication prompt, not a phone call or SMS. This approach may be a limitation if you can't ensure the mobile authentication app is installed on a user's personal device.

| Feature | Azure AD Free - Security defaults | Azure AD Free - Azure AD Global Administrators | Office 365 apps | Azure AD Premium P1 or P2 |
| --- |:---:|:---:|:---:|:---:|
| Protect Azure AD tenant admin accounts with MFA | ● | ● (*Azure AD Global Administrator* accounts only) | ● | ● |
| Mobile app as a second factor | ● | ● | ● | ● |
| Phone call as a second factor | | ● | ● | ● |
| SMS as a second factor | | ● | ● | ● |
| Admin control over verification methods | | ● | ● | ● |
| Fraud alert | | | | ● |
| MFA Reports | | | | ● |
| Custom greetings for phone calls | | | | ● |
| Custom caller ID for phone calls | | | | ● |
| Trusted IPs | | | | ● |
| Remember MFA for trusted devices | | ● | ● | ● |
| MFA for on-premises applications | | | | ● |

## Purchase and enable Azure Multi-Factor Authentication

To use Azure Multi-Factor Authentication, register for or purchase an eligible Azure AD tier. Azure AD comes in four editions — Free, Office 365 apps, Premium P1, and Premium P2.

The Free edition is included with an Azure subscription. See the [section below](#azure-ad-free-tier) for information on how to use security defaults or protect accounts with the *Azure AD Global Administrator* role.

The Azure AD Premium editions are available through your Microsoft representative, the [Open Volume License Program](https://www.microsoft.com/licensing/licensing-programs/open-license.aspx), and the [Cloud Solution Providers program](https://go.microsoft.com/fwlink/?LinkId=614968&clcid=0x409). Azure and Microsoft 365 subscribers can also buy Azure Active Directory Premium P1 and P2 online. [Sign in](https://portal.office.com/Commerce/Catalog.aspx) to purchase.

After you have purchased the required Azure AD tier, [plan and deploy Azure Multi-Factor Authentication](howto-mfa-getstarted.md).

### Azure AD Free tier

All users in an Azure AD Free tenant can use Azure Multi-Factor authentication through the use of security defaults. These security defaults enable Azure Multi-Factor authentication for all users, every time they sign in. The mobile authentication app is the only method that can be used for Azure Multi-Factor Authentication when using Azure AD Free security defaults.

* [Learn more about Azure AD security defaults](../fundamentals/concept-fundamentals-security-defaults.md)
* [Enable security defaults for users in Azure AD Free](../fundamentals/concept-fundamentals-security-defaults.md#enabling-security-defaults)

If you don't want to enable Azure Multi-Factor Authentication for all users and every sign-in event, you can instead choose to only protect user accounts with the *Azure AD Global Administrator* role. This approach provides additional authentication prompts for critical administrator accounts. You enable Azure Multi-Factor Authentication in one of the following ways, depending on the type of account you use:

* If you use a Microsoft Account, [register for multi-factor authentication](https://support.microsoft.com/help/12408/microsoft-account-about-two-step-verification).
* If you aren't using a Microsoft Account, [turn on multi-factor authentication for a user or group in Azure AD](howto-mfa-userstates.md).

## Next steps

* For more information on costs, see [Azure Multi-Factor Authentication pricing](https://azure.microsoft.com/pricing/details/multi-factor-authentication/).
* [What is Conditional Access](../conditional-access/overview.md)

