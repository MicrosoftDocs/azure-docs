---
title: Microsoft Entra multifactor authentication versions and consumption plans
description: Learn about the Microsoft Entra multifactor authentication client and different methods and versions available. 

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 01/29/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: michmcla
ms.collection: M365-identity-device-management
---
# Features and licenses for Microsoft Entra multifactor authentication

To protect user accounts in your organization, multifactor authentication should be used. This feature is especially important for accounts that have privileged access to resources. Basic multifactor authentication features are available to Microsoft 365 and Microsoft Entra users and global administrators for no extra cost. If you want to upgrade the features for your admins or extend multifactor authentication to the rest of your users with more authentication methods and greater control, you can purchase Microsoft Entra multifactor authentication in several ways.

> [!IMPORTANT]
> This article details the different ways that Microsoft Entra multifactor authentication can be licensed and used. For specific details about pricing and billing, see the [Microsoft Entra pricing page](https://www.microsoft.com/en-us/security/business/identity-access-management/azure-ad-pricing).

<a name='available-versions-of-azure-ad-multi-factor-authentication'></a>

## Available versions of Microsoft Entra multifactor authentication

Microsoft Entra multifactor authentication can be used, and licensed, in a few different ways depending on your organization's needs. All tenants are entitled to basic multifactor authentication features via Security Defaults. You may already be entitled to use advanced Microsoft Entra multifactor authentication depending on the Microsoft Entra ID, EMS, or Microsoft 365 license you currently have. For example, the first 50,000 monthly active users in Microsoft Entra External ID can use MFA and other Premium P1 or P2 features for free. For more information, see [Microsoft Entra External ID pricing](https://azure.microsoft.com/pricing/details/active-directory/external-identities/).

The following table details the different ways to get Microsoft Entra multifactor authentication and some of the features and use cases for each.

| If you're a user of | Capabilities and use cases |
| --- | --- |
| [Microsoft 365 Business Premium](https://www.microsoft.com/microsoft-365/business) and [EMS](https://www.microsoft.com/security/business/enterprise-mobility-security) or [Microsoft 365 E3 and E5](https://www.microsoft.com/microsoft-365/enterprise/compare-office-365-plans) | EMS E3, Microsoft 365 E3, and Microsoft 365 Business Premium includes Microsoft Entra ID P1. EMS E5 or Microsoft 365 E5 includes Microsoft Entra ID P2. You can use the same Conditional Access features noted in the following sections to provide multifactor authentication to users. |
| [Microsoft Entra ID P1](../fundamentals/get-started-premium.md) | You can use [Microsoft Entra Conditional Access](../conditional-access/howto-conditional-access-policy-all-users-mfa.md) to prompt users for multifactor authentication during certain scenarios or events to fit your business requirements. |
| [Microsoft Entra ID P2](../fundamentals/get-started-premium.md) | Provides the strongest security position and improved user experience. Adds [risk-based Conditional Access](../conditional-access/howto-conditional-access-policy-risk.md) to the Microsoft Entra ID P1 features that adapts to user's patterns and minimizes multifactor authentication prompts. |
| [All Microsoft 365 plans](https://www.microsoft.com/microsoft-365/compare-microsoft-365-enterprise-plans) | Microsoft Entra multifactor authentication can be enabled for all users using [security defaults](../fundamentals/security-defaults.md). Management of Microsoft Entra multifactor authentication is through the Microsoft 365 portal. For an improved user experience, upgrade to Microsoft Entra ID P1 or P2 and use Conditional Access. For more information, see [secure Microsoft 365 resources with multifactor authentication](/microsoft-365/admin/security-and-compliance/set-up-multi-factor-authentication).  |
| [Office 365 free](https://www.microsoft.com/microsoft-365/enterprise/compare-office-365-plans)<br>[Microsoft Entra ID Free](../verifiable-credentials/how-to-create-a-free-developer-account.md) | You can use [security defaults](../fundamentals/security-defaults.md) to prompt users for multifactor authentication as needed but you don't have granular control of enabled users or scenarios, but it does provide that additional security step.<br /> Even when security defaults aren't used to enable multifactor authentication for everyone, users assigned the *Microsoft Entra Global Administrator* role can be configured to use multifactor authentication. This feature of the free tier makes sure the critical administrator accounts are protected by multifactor authentication. |

## Feature comparison based on licenses

The following table provides a list of the features that are available in the various versions of Microsoft Entra ID for multifactor authentication. Plan out your needs for securing user authentication, then determine which approach meets those requirements. For example, although Microsoft Entra ID Free provides security defaults that provide Microsoft Entra multifactor authentication where only the mobile authenticator app can be used for the authentication prompt. This approach may be a limitation if you can't ensure the mobile authentication app is installed on a user's personal device. See [Microsoft Entra ID Free tier](#azure-ad-free-tier) later in this topic for more details. 

| Feature | Microsoft Entra ID Free - Security defaults (enabled for all users) | Microsoft Entra ID Free - Global Administrators only | Office 365 | Microsoft Entra ID P1 | Microsoft Entra ID P2 | 
| --- |:---:|:---:|:---:|:---:|:---:|
| Protect Microsoft Entra tenant admin accounts with MFA | ● | ● (*Microsoft Entra Global Administrator* accounts only) | ● | ● | ● |
| Mobile app as a second factor | ● | ● | ● | ● | ● |
| Phone call as a second factor | | | ● | ● | ● |
| Text message as a second factor | | ● | ● | ● | ● |
| Admin control over verification methods | | ● | ● | ● | ● |
| Fraud alert | | | | ● | ● |
| MFA Reports | | | | ● | ● |
| Custom greetings for phone calls | | | | ● | ● |
| Custom caller ID for phone calls | | | | ● | ● |
| Trusted IPs | | | | ● | ● |
| Remember MFA for trusted devices | | ● | ● | ● | ● |
| MFA for on-premises applications | | | | ● | ● |
| Conditional Access | | | | ● | ● |
| Risk-based Conditional Access | | | | | ● |

<a name='compare-multi-factor-authentication-policies'></a>

## Compare multifactor authentication policies

Our recommended approach to enforce MFA is using [Conditional Access](../conditional-access/overview.md). Review the following table to determine the what capabilities are included in your licenses.

| Policy | Security defaults | Conditional Access | Per-user MFA |
| --- |:---:|:---:|:---:|
| **Management** | 
| Standard set of security rules to keep your company safe | ● |  |  |
| One-click on/off | ● |  |  |
| Included in Office 365 licensing (See [license considerations](#available-versions-of-azure-ad-multi-factor-authentication)) | ● |  | ● |
| Pre-configured templates in Microsoft 365 Admin Center wizard | ● | ● |  |
| Configuration flexibility | | ● |  |
| **Functionality** | 
| Exempt users from the policy | | ● | ● |
| Authenticate by phone call or text message | ● | ● | ● |
| Authenticate by Microsoft Authenticator and Software tokens | ● | ● | ● |
| Authenticate by FIDO2, Windows Hello for Business, and Hardware tokens | | ● | ● |
| Blocks legacy authentication protocols | ● | ● | ● |
| New employees are automatically protected | ● | ● | |
| Dynamic MFA triggers based on risk events | | ● |  |
| Authentication and authorization policies | | ● | |
| Configurable based on location and device state | | ● | |
| Support for "report only" mode | | ● | |
| Ability to completely block users/services | | ● | |

<a name='purchase-and-enable-azure-ad-multi-factor-authentication'></a>

## Purchase and enable Microsoft Entra multifactor authentication

To use Microsoft Entra multifactor authentication, register for or purchase an eligible Microsoft Entra tier. Microsoft Entra ID comes in four editions—Free, Office 365, Premium P1, and Premium P2.

The Free edition is included with an Azure subscription. See the [section below](#azure-ad-free-tier) for information on how to use security defaults or protect accounts with the *Microsoft Entra Global Administrator* role.

The Microsoft Entra ID P1 or P2 editions are available through your Microsoft representative, the [Open Volume License Program](https://www.microsoft.com/licensing/licensing-programs/open-license.aspx), and the [Cloud Solution Providers program](https://go.microsoft.com/fwlink/?LinkId=614968&clcid=0x409). Azure and Microsoft 365 subscribers can also buy Microsoft Entra ID P1 and P2 online. [Sign in](https://portal.office.com/Commerce/Catalog.aspx) to purchase.

After you have purchased the required Microsoft Entra tier, [plan and deploy Microsoft Entra multifactor authentication](howto-mfa-getstarted.md).

<a name='azure-ad-free-tier'></a>

### Microsoft Entra ID Free tier

All users in a Microsoft Entra ID Free tenant can use Microsoft Entra multifactor authentication by using security defaults. The mobile authentication app can be used for Microsoft Entra multifactor authentication when using Microsoft Entra ID Free security defaults.

* [Learn more about Microsoft Entra security defaults](../fundamentals/security-defaults.md)
* [Enable security defaults for users in Microsoft Entra ID Free](../fundamentals/security-defaults.md#enabling-security-defaults)

If you don't want to enable Microsoft Entra multifactor authentication for all users, you can instead choose to only protect user accounts with the *Microsoft Entra Global Administrator* role. This approach provides more authentication prompts for critical administrator accounts. You enable Microsoft Entra multifactor authentication in one of the following ways, depending on the type of account you use:

* If you use a Microsoft Account, [register for multifactor authentication](https://support.microsoft.com/help/12408/microsoft-account-about-two-step-verification).
* If you aren't using a Microsoft Account, [turn on multifactor authentication for a user or group in Microsoft Entra ID](howto-mfa-userstates.md).

## Next steps

* For more information on costs, see [Microsoft Entra pricing](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing).
* [What is Conditional Access](../conditional-access/overview.md)
* [What is Identity Protection?](../identity-protection/overview-identity-protection.md)
* MFA can also be [enabled on a per-user basis](howto-mfa-userstates.md)
