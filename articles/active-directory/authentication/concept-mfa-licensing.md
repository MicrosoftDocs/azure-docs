---
title: Azure AD Multi-Factor Authentication versions and consumption plans
description: Learn about the Azure AD Multi-Factor Authentication client and different methods and versions available. 

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
# Features and licenses for Azure AD Multi-Factor Authentication

To protect user accounts in your organization, multi-factor authentication should be used. This feature is especially important for accounts that have privileged access to resources. Basic multi-factor authentication features are available to Microsoft 365 and Azure Active Directory (Azure AD) users and global administrators for no extra cost. If you want to upgrade the features for your admins or extend multi-factor authentication to the rest of your users with more authentication methods and greater control, you can purchase Azure AD Multi-Factor Authentication in several ways.

> [!IMPORTANT]
> This article details the different ways that Azure AD Multi-Factor Authentication can be licensed and used. For specific details about pricing and billing, see the [Azure AD pricing page](https://www.microsoft.com/en-us/security/business/identity-access-management/azure-ad-pricing).

## Available versions of Azure AD Multi-Factor Authentication

Azure AD Multi-Factor Authentication can be used, and licensed, in a few different ways depending on your organization's needs. All tenants are entitled to basic multifactor authentication features via Security Defaults. You may already be entitled to use advanced Azure AD Multi-Factor Authentication depending on the Azure AD, EMS, or Microsoft 365 license you currently have. For example, the first 50,000 monthly active users in Azure AD External Identities can use MFA and other Premium P1 or P2 features for free. For more information, see [Azure Active Directory External Identities pricing](https://azure.microsoft.com/pricing/details/active-directory/external-identities/).

The following table details the different ways to get Azure AD Multi-Factor Authentication and some of the features and use cases for each.

| If you're a user of | Capabilities and use cases |
| --- | --- |
| [Microsoft 365 Business Premium](https://www.microsoft.com/microsoft-365/business) and [EMS](https://www.microsoft.com/security/business/enterprise-mobility-security) or [Microsoft 365 E3 and E5](https://www.microsoft.com/microsoft-365/enterprise/compare-office-365-plans) | EMS E3, Microsoft 365 E3, and Microsoft 365 Business Premium includes Azure AD Premium P1. EMS E5 or Microsoft 365 E5 includes Azure AD Premium P2. You can use the same Conditional Access features noted in the following sections to provide multi-factor authentication to users. |
| [Azure AD Premium P1](../fundamentals/active-directory-get-started-premium.md) | You can use [Azure AD Conditional Access](../conditional-access/howto-conditional-access-policy-all-users-mfa.md) to prompt users for multi-factor authentication during certain scenarios or events to fit your business requirements. |
| [Azure AD Premium P2](../fundamentals/active-directory-get-started-premium.md) | Provides the strongest security position and improved user experience. Adds [risk-based Conditional Access](../conditional-access/howto-conditional-access-policy-risk.md) to the Azure AD Premium P1 features that adapts to user's patterns and minimizes multi-factor authentication prompts. |
| [All Microsoft 365 plans](https://www.microsoft.com/microsoft-365/compare-microsoft-365-enterprise-plans) | Azure AD Multi-Factor Authentication can be enabled for all users using [security defaults](../fundamentals/security-defaults.md). Management of Azure AD Multi-Factor Authentication is through the Microsoft 365 portal. For an improved user experience, upgrade to Azure AD Premium P1 or P2 and use Conditional Access. For more information, see [secure Microsoft 365 resources with multi-factor authentication](/microsoft-365/admin/security-and-compliance/set-up-multi-factor-authentication).  |
| [Office 365 free](https://www.microsoft.com/microsoft-365/enterprise/compare-office-365-plans)<br>[Azure AD free](../verifiable-credentials/how-to-create-a-free-developer-account.md) | You can use [security defaults](../fundamentals/security-defaults.md) to prompt users for multi-factor authentication as needed but you don't have granular control of enabled users or scenarios, but it does provide that additional security step.<br /> Even when security defaults aren't used to enable multi-factor authentication for everyone, users assigned the *Azure AD Global Administrator* role can be configured to use multi-factor authentication. This feature of the free tier makes sure the critical administrator accounts are protected by multi-factor authentication. |

## Feature comparison based on licenses

The following table provides a list of the features that are available in the various versions of Azure AD for Multi-Factor Authentication. Plan out your needs for securing user authentication, then determine which approach meets those requirements. For example, although Azure AD Free provides security defaults that provide Azure AD Multi-Factor Authentication where only the mobile authenticator app can be used for the authentication prompt. This approach may be a limitation if you can't ensure the mobile authentication app is installed on a user's personal device. See [Azure AD Free tier](#azure-ad-free-tier) later in this topic for more details. 

| Feature | Azure AD Free - Security defaults (enabled for all users) | Azure AD Free - Global Administrators only | Office 365 | Azure AD Premium P1 | Azure AD Premium P2 | 
| --- |:---:|:---:|:---:|:---:|:---:|
| Protect Azure AD tenant admin accounts with MFA | ● | ● (*Azure AD Global Administrator* accounts only) | ● | ● | ● |
| Mobile app as a second factor | ● | ● | ● | ● | ● |
| Phone call as a second factor | | | ● | ● | ● |
| SMS as a second factor | | ● | ● | ● | ● |
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

## Compare multi-factor authentication policies

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
| Authenticate by phone call or SMS | ● | ● | ● |
| Authenticate by Microsoft Authenticator and Software tokens | ● | ● | ● |
| Authenticate by FIDO2, Windows Hello for Business, and Hardware tokens | | ● | ● |
| Blocks legacy authentication protocols | ● | ● | ● |
| New employees are automatically protected | ● | ● | |
| Dynamic MFA triggers based on risk events | | ● |  |
| Authentication and authorization policies | | ● | |
| Configurable based on location and device state | | ● | |
| Support for "report only" mode | | ● | |
| Ability to completely block users/services | | ● | |

## Purchase and enable Azure AD Multi-Factor Authentication

To use Azure AD Multi-Factor Authentication, register for or purchase an eligible Azure AD tier. Azure AD comes in four editions—Free, Office 365, Premium P1, and Premium P2.

The Free edition is included with an Azure subscription. See the [section below](#azure-ad-free-tier) for information on how to use security defaults or protect accounts with the *Azure AD Global Administrator* role.

The Azure AD Premium editions are available through your Microsoft representative, the [Open Volume License Program](https://www.microsoft.com/licensing/licensing-programs/open-license.aspx), and the [Cloud Solution Providers program](https://go.microsoft.com/fwlink/?LinkId=614968&clcid=0x409). Azure and Microsoft 365 subscribers can also buy Azure Active Directory Premium P1 and P2 online. [Sign in](https://portal.office.com/Commerce/Catalog.aspx) to purchase.

After you have purchased the required Azure AD tier, [plan and deploy Azure AD Multi-Factor Authentication](howto-mfa-getstarted.md).

### Azure AD Free tier

All users in an Azure AD Free tenant can use Azure AD Multi-Factor Authentication by using security defaults. The mobile authentication app can be used for Azure AD Multi-Factor Authentication when using Azure AD Free security defaults.

* [Learn more about Azure AD security defaults](../fundamentals/security-defaults.md)
* [Enable security defaults for users in Azure AD Free](../fundamentals/security-defaults.md#enabling-security-defaults)

If you don't want to enable Azure AD Multi-Factor Authentication for all users, you can instead choose to only protect user accounts with the *Azure AD Global Administrator* role. This approach provides more authentication prompts for critical administrator accounts. You enable Azure AD Multi-Factor Authentication in one of the following ways, depending on the type of account you use:

* If you use a Microsoft Account, [register for multi-factor authentication](https://support.microsoft.com/help/12408/microsoft-account-about-two-step-verification).
* If you aren't using a Microsoft Account, [turn on multi-factor authentication for a user or group in Azure AD](howto-mfa-userstates.md).

## Next steps

* For more information on costs, see [Azure AD pricing](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing).
* [What is Conditional Access](../conditional-access/overview.md)
* [What is Identity Protection?](../identity-protection/overview-identity-protection.md)
* MFA can also be [enabled on a per-user basis](howto-mfa-userstates.md)

