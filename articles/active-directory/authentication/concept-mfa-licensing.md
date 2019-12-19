---
title: Azure Multi-Factor Authentication versions and consumption plans
description: Learn about the Azure Multi-factor Authentication client and different methods and versions available. 

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 12/18/2019

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: michmcla
ms.collection: M365-identity-device-management
---
# Features and licenses for Azure Multi-Factor Authentication

To protect user accounts in your organization, two-step verification should be used. This feature is especially important for accounts that have privileged access to resources. Basic two-step verification features are available to Office 365 and Azure Active Directory (Azure AD) administrators for no extra cost. If you want to upgrade the features for your admins or extend two-step verification to the rest of your users, you can purchase Azure Multi-Factor Authentication in several ways.

> [!IMPORTANT]
> This article details the different ways that Azure Multi-Factor Authentication can be licensed and used. For specific details about pricing and billing, see the [Azure Multi-Factor Authentication pricing page](https://azure.microsoft.com/pricing/details/multi-factor-authentication/).

## Available versions of Azure Multi-Factor Authentication

Azure Multi-Factor Authentication can be used, and licensed, in a few different ways depending on your organization's needs. You may already be entitled to use Azure Multi-Factor Authentication depending on the Azure AD or Office license you currently have. The following table details the different ways to get Azure Multi-Factor Authentication and some of the features and use cases for each.

| If you're a user of | Capabilities and use cases |
| --- | --- |
| Azure AD Premium P1 | You can enable multi-factor authentication for select individual users, or use [Azure AD Conditional Access](../conditional-access/overview.md) to generate multi-factor authentication events for certain scenarios or events. |
| Azure AD Premium P2 | Provides the Azure AD Premium P1 Multi-Factor Authentication features, but also adds [risk-based Conditional Access](../conditional-access/howto-conditional-access-policy-risk.md) that adapts to user's patterns and minimizes multi-factor authentication prompts. |
| Office Premium, E3, or E5 | Enable multi-factor authentication on a per-user basis for every authentication request. There's no ability to control what events prompt for multi-factor authentication. Management is through the Office 365 or Microsoft 365 portal. For more information, see [secure Office 365 resources with two-step verification](https://support.office.com/article/Set-up-multi-factor-authentication-for-Office-365-users-8f0454b2-f51a-4d9c-bcde-2c48e41621c6). |
| Azure AD free | Users assigned the *Azure AD Global Administrator* role can use two-step verification. This feature of the free tier makes sure the critical administrator accounts are protected by multi-factor authentication.<br />You can also use [security defaults](../fundamentals/concept-fundamentals-security-defaults.md) to enable multi-factor authentication for all users, every time an authentication request is made. You don't have granular control of enabled users or scenarios, but it does provide that additional security step. |

## Feature comparison of versions

The following table provides a list of the features that are available in the various versions of Azure Multi-Factor Authentication. Plan out your needs for securing user authentication, then determine which approach meets those requirements. For example, although Azure AD Free provides security defaults that provide Azure Multi-Factor Authentication, only the mobile authenticator app can be used for the authentication prompt, not a phone call or SMS. This approach may be a limitation if you can't ensure the mobile authentication app is installed on a user's personal device.

| Feature | Azure AD Free - Security defaults | Azure AD Free - Azure AD Global Administrators | Office Premium, E3, or E5 | Azure AD Premium P1 or P2 |
| --- |:---:|:---:|:---:|:---:|
| Protect Azure AD admin accounts with MFA | ● | ● (*Azure AD Global Administrator* accounts only) | ● | ● |
| Mobile app as a second factor | ● | ● | ● | ● |
| Phone call as a second factor | | ● | ● | ● |
| SMS as a second factor | | ● | ● | ● |
| App passwords for clients that don't support MFA | | ● | ● | ● |
| Admin control over verification methods | | ● | ● | ● |
| Protect non-admin accounts with MFA | ● | | ● | ● |
| PIN mode | | | | ● |
| Fraud alert | | | | ● |
| MFA Reports | | | | ● |
| One-Time Bypass | | | | ● |
| Custom greetings for phone calls | | | | ● |
| Custom caller ID for phone calls | | | | ● |
| Trusted IPs | | | | ● |
| Remember MFA for trusted devices | | ● | ● | ● |
| MFA for on-premises applications | | | | ● |

> [!IMPORTANT]
> As of March of 2019, phone call options are no longer available to Azure Multi-Factor Authentication and Azure Self-Service Password Reset users in Azure AD Free / trial tenants. SMS messages aren't impacted by this change. Phone calls continue to be available to users in Azure AD Premium P1 or P2 tenants or uses or Office Premium, E3, or E5.

## Purchase and enable Azure Multi-Factor Authentication

To use Azure Multi-Factor Authentication, register for or purchase an eligible Azure AD tier. Azure AD comes in four editions — Free, Office 365 apps edition, Premium P1, and Premium P2.

The Free edition is included with an Azure subscription. See the [section below](#azure-ad-free-tier) for information on how to use security defaults or protect accounts with the *Azure AD Global Administrator* role.

The Premium editions are available through your Microsoft representative, the [Open Volume License Program](https://www.microsoft.com/licensing/licensing-programs/open-license.aspx), and the [Cloud Solution Providers program](https://go.microsoft.com/fwlink/?LinkId=614968&clcid=0x409). Azure and Office 365 subscribers can also buy Azure Active Directory Premium P1 and P2 online. [Sign in](https://portal.office.com/Commerce/Catalog.aspx) to purchase.

> [!IMPORTANT]
> Consumption-based licensing is no longer available to new customers effective September 1, 2018. Existing customers using the consumption-based model can continue to use either per enabled user or per authentication billing.

After you have purchased the required Azure AD tier, [plan and deploy Azure Multi-Factor Authentication](howto-mfa-getstarted.md).

### Azure AD Free tier

All users in an Azure AD Free tenant can use Azure Multi-Factor authentication through the use of security defaults. These security defaults enable Azure Multi-Factor authentication for all users, every time they sign in. The mobile authentication app is the only method that can be used for Azure Multi-Factor Authentication when using Azure AD Free security defaults.

* [Learn more about Azure AD security defaults](../fundamentals/concept-fundamentals-security-defaults.md)
* [Enable security defaults for users in Azure AD Free](../fundamentals/concept-fundamentals-security-defaults.md#enabling-security-defaults)

If you don't want to enable Azure Multi-Factor Authentication for all users and every sign-in event, you can instead choose to only protect user accounts with the *Azure AD Global Administrator* role. This approach provides additional authentication prompts for critical administrator accounts. You enable Azure Multi-Factor Authentication in one of the following ways, depending on the type of account you use:

* If you use a Microsoft Account, [register for multi-factor authentication](https://support.microsoft.com/help/12408/microsoft-account-about-two-step-verification).
* If you aren't using a Microsoft Account, [turn on multi-factor authentication for a user or group in Azure AD](howto-mfa-userstates.md).

## Next steps

For more information on costs, see [Azure Multi-Factor Authentication pricing](https://azure.microsoft.com/pricing/details/multi-factor-authentication/).
