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
# Feature and licenses for Azure Multi-Factor Authentication

When it comes to protecting your accounts, two-step verification should be standard across your organization. This feature is especially important for accounts that have privileged access to resources. For this reason, Microsoft offers basic two-step verification features to Office 365 and Azure Active Directory (Azure AD) Administrators for no extra cost. If you want to upgrade the features for your admins or extend two-step verification to the rest of your users, you can purchase Azure Multi-Factor Authentication in several ways.

> [!IMPORTANT]
> This article details the different ways that Azure Multi-Factor Authentication can be licensed and used. For specific details about pricing and billing, see the [Azure Multi-Factor Authentication pricing page](https://azure.microsoft.com/pricing/details/multi-factor-authentication/).

## Available versions of Azure Multi-Factor Authentication

Azure Multi-Factor Authentication can be used, and licensed, in a few different ways depending on your organization's needs. You may already be entitled to use Azure Multi-Factor Authentication depending on the Azure AD or Office license you currently have.

| If you're a user of | Capabilities and use cases |
| --- | --- |
| Azure AD Premium P1 | You can enable multi-factor authentication for specific users, or use [Azure AD Conditional Access](../conditional-access/overview.md) to generate multi-factor authentication events for certain scenarios or events. |
| Azure AD Premium P2 | Provides the Azure AD Premium P1 Multi-Factor Authentication features, but also adds [risk-based Conditional Access](../conditional-access/howto-conditional-access-policy-risk.md) that adapts to user's patterns and minimizes multi-factor authentication prompts. |
| Office Premium, E3, or E5 | Enable multi-factor authentication on a per-user basis for every authentication request. There's no ability to control what events prompt for multi-factor authentication. Management is through the Office 365 or Microsoft 365 portal. For more information, see [secure Office 365 resources with two-step verification](https://support.office.com/article/Set-up-multi-factor-authentication-for-Office-365-users-8f0454b2-f51a-4d9c-bcde-2c48e41621c6). |
| Azure AD free | Users assigned the *Azure AD Global Administrator* role can use two-step verification. This feature of the free tier makes sure the critical administrator accounts are protected by multi-factor authentication.<br />You can also use [security defaults](../conditional-access/concept-conditional-access-security-defaults.md) to enable multi-factor authentication for all users, every time an authentication request is made. You don't have granular control of enabled users or scenarios, but it does provide that additional security step. |

## Feature comparison of versions

The following table provides a list of the features that are available in the various versions of Azure Multi-Factor Authentication. For example, although Azure AD Free provides security defaults that provide Azure Multi-Factor Authentication, only the mobile authenticator app can be used, not a phone call or SMS.

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
> As of March of 2019, phone call options are no longer available to Azure Multi-Factor Authentication and Azure Self-Service Password Reset users in Azure AD Free / trial tenants. SMS messages aren't impacted by this change. Phone calls continue to be available to users in Azure AD Premium P1 or P2 tenants.

## How to turn on Azure Multi-Factor Authentication for Azure AD Administrators

Users assigned the Global Administrator role in Azure AD tenants can enable two-step verification for their Azure AD Global Admin accounts at no additional cost. If you are using a Microsoft Account, you can register for multi-factor authentication using the guidance found in the Microsoft account support article, [About two-step verification](https://support.microsoft.com/help/12408/microsoft-account-about-two-step-verification). If you are not using a Microsoft Account, turn on multi-factor authentication for Global Admins using the guidance found in the article [How to require two-step verification for a user or group](howto-mfa-userstates.md).

## How to purchase Azure Multi-Factor Authentication

Purchase licenses that include Azure Multi-Factor Authentication, like Azure Active Directory Premium, or a license bundle that includes Azure AD Premium, or Conditional Access and assign them to your users in Azure Active Directory.

> [!IMPORTANT]
> Consumption-based licensing is no longer available to new customers effective September 1, 2018. Existing customers using the consumption-based model can continue to use either per enabled user or per authentication billing.

## Next steps

For more information on costs, see [Azure Multi-Factor Authentication pricing](https://azure.microsoft.com/pricing/details/multi-factor-authentication/).
