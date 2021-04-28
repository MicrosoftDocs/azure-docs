---
title: Azure Active Directory security defaults
description: Security default policies that help protect organizations from common attacks in Azure AD

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 04/20/2021

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: rogoya

ms.collection: M365-identity-device-management

ms.custom: contperf-fy20q4
---
# What are security defaults?

Managing security can be difficult with common identity-related attacks like password spray, replay, and phishing becoming more popular. Security defaults make it easier to help protect your organization from these attacks with preconfigured security settings:

- Requiring all users to register for Azure AD Multi-Factor Authentication.
- Requiring administrators to perform multi-factor authentication.
- Blocking legacy authentication protocols.
- Requiring users to perform multi-factor authentication when necessary.
- Protecting privileged activities like access to the Azure portal.

![Screenshot of the Azure portal with the toggle to enable security defaults](./media/concept-fundamentals-security-defaults/security-defaults-azure-ad-portal.png)
 
More details on why security defaults are being made available can be found in Alex Weinert's blog post, [Introducing security defaults](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/introducing-security-defaults/ba-p/1061414).

## Availability

Microsoft is making security defaults available to everyone. The goal is to ensure that all organizations have a basic level of security enabled at no extra cost. You turn on security defaults in the Azure portal. If your tenant was created on or after October 22, 2019, it is possible security defaults are already enabled in your tenant. To protect all of our users, security defaults is being rolled out to all new tenants created.

### Who's it for?

- If you are an organization that wants to increase your security posture but you don't know how or where to start, security defaults are for you.
- If you are an organization utilizing the free tier of Azure Active Directory licensing, security defaults are for you.

### Who should use Conditional Access?

- If you are an organization currently using Conditional Access policies to bring signals together, to make decisions, and enforce organizational policies, security defaults are probably not right for you. 
- If you are an organization with Azure Active Directory Premium licenses, security defaults are probably not right for you.
- If your organization has complex security requirements, you should consider Conditional Access.

## Policies enforced

### Unified Multi-Factor Authentication registration

All users in your tenant must register for multi-factor authentication (MFA) in the form of the Azure AD Multi-Factor Authentication. Users have 14 days to register for Azure AD Multi-Factor Authentication by using the Microsoft Authenticator app. After the 14 days have passed, the user won't be able to sign in until registration is completed. A user's 14-day period begins after their first successful interactive sign-in after enabling security defaults.

### Protecting administrators

Users with privileged access have increased access to your environment. Due to the power these accounts have, you should treat them with special care. One common method to improve the protection of privileged accounts is to require a stronger form of account verification for sign-in. In Azure AD, you can get a stronger account verification by requiring multi-factor authentication.

After registration with Azure AD Multi-Factor Authentication is finished, the following nine Azure AD administrator roles will be required to perform additional authentication every time they sign in:

- Global administrator
- SharePoint administrator
- Exchange administrator
- Conditional Access administrator
- Security administrator
- Helpdesk administrator
- Billing administrator
- User administrator
- Authentication administrator

> [!WARNING]
> Ensure your directory has at least two accounts with global administrator privileges assigned to them. This will help in the case that one global administrator is locked out. For more detail see the article, [Manage emergency access accounts in Azure AD](../roles/security-emergency-access.md).

### Protecting all users

We tend to think that administrator accounts are the only accounts that need extra layers of authentication. Administrators have broad access to sensitive information and can make changes to subscription-wide settings. But attackers frequently target end users. 

After these attackers gain access, they can request access to privileged information on behalf of the original account holder. They can even download the entire directory to perform a phishing attack on your whole organization. 

One common method to improve protection for all users is to require a stronger form of account verification, such as Multi-Factor Authentication, for everyone. After users complete Multi-Factor Authentication registration, they'll be prompted for additional authentication whenever necessary. Users will be prompted primarily when they authenticate using a new device or application, or when performing critical roles and tasks. This functionality protects all applications registered with Azure AD including SaaS applications.

### Blocking legacy authentication

To give your users easy access to your cloud apps, Azure AD supports various authentication protocols, including legacy authentication. *Legacy authentication* is a term that refers to an authentication request made by:

- Clients that don't use modern authentication (for example, an Office 2010 client).
- Any client that uses older mail protocols such as IMAP, SMTP, or POP3.

Today, most compromising sign-in attempts come from legacy authentication. Legacy authentication does not support Multi-Factor Authentication. Even if you have a Multi-Factor Authentication policy enabled on your directory, an attacker can authenticate by using an older protocol and bypass Multi-Factor Authentication. 

After security defaults are enabled in your tenant, all authentication requests made by an older protocol will be blocked. Security defaults blocks Exchange Active Sync basic authentication.

> [!WARNING]
> Before you enable security defaults, make sure your administrators aren't using older authentication protocols. For more information, see [How to move away from legacy authentication](concept-fundamentals-block-legacy-authentication.md).

- [How to set up a multifunction device or application to send email using Microsoft 365](/exchange/mail-flow-best-practices/how-to-set-up-a-multifunction-device-or-application-to-send-email-using-microsoft-365-or-office-365)

### Protecting privileged actions

Organizations use various Azure services managed through the Azure Resource Manager API, including:

- Azure portal 
- Azure PowerShell 
- Azure CLI

Using Azure Resource Manager to manage your services is a highly privileged action. Azure Resource Manager can alter tenant-wide configurations, such as service settings and subscription billing. Single-factor authentication is vulnerable to various attacks like phishing and password spray. 

It's important to verify the identity of users who want to access Azure Resource Manager and update configurations. You verify their identity by requiring additional authentication before you allow access.

After you enable security defaults in your tenant, any user who's accessing the Azure portal, Azure PowerShell, or the Azure CLI will need to complete additional authentication. This policy applies to all users who are accessing Azure Resource Manager, whether they're an administrator or a user. 

> [!NOTE]
> Pre-2017 Exchange Online tenants have modern authentication disabled by default. In order to avoid the possibility of a login loop while authenticating through these tenants, you must [enable modern authentication](/exchange/clients-and-mobile-in-exchange-online/enable-or-disable-modern-authentication-in-exchange-online).

> [!NOTE]
> The Azure AD Connect synchronization account is excluded from security defaults and will not be prompted to register for or perform multi-factor authentication. Organizations should not be using this account for other purposes.

## Deployment considerations

The following additional considerations are related to deployment of security defaults.

### Authentication methods

These free security defaults allow registration and use of Azure AD Multi-Factor Authentication **using only the Microsoft Authenticator app using notifications**. Conditional Access allows the use of any authentication method the administrator chooses to enable.

| Method | Security defaults | Conditional Access |
| --- | --- | --- |
| Notification through mobile app | X | X |
| Verification code from mobile app or hardware token | X** | X |
| Text message to phone |   | X |
| Call to phone |   | X |
| App passwords |   | X*** |

- ** Users may use verification codes from the Microsoft Authenticator app but can only register using the notification option.
- *** App passwords are only available in per-user MFA with legacy authentication scenarios only if enabled by administrators.

### Disabled MFA status

If your organization is a previous user of per-user based Azure AD Multi-Factor Authentication, do not be alarmed to not see users in an **Enabled** or **Enforced** status if you look at the Multi-Factor Auth status page. **Disabled** is the appropriate status for users who are using security defaults or Conditional Access based Azure AD Multi-Factor Authentication.

### Conditional Access

You can use Conditional Access to configure policies similar to security defaults, but with more granularity including user exclusions, which are not available in security defaults. If you're using Conditional Access and have Conditional Access policies enabled in your environment, security defaults won't be available to you. If you have a license that provides Conditional Access but don't have any Conditional Access policies enabled in your environment, you are welcome to use security defaults until you enable Conditional Access policies. More information about Azure AD licensing can be found on the [Azure AD pricing page](https://azure.microsoft.com/pricing/details/active-directory/).

![Warning message that you can have security defaults or Conditional Access not both](./media/concept-fundamentals-security-defaults/security-defaults-conditional-access.png)

Here are step-by-step guides on how you can use Conditional Access to configure equivalent policies to those policies enabled by security defaults:

- [Require MFA for administrators](../conditional-access/howto-conditional-access-policy-admin-mfa.md)
- [Require MFA for Azure management](../conditional-access/howto-conditional-access-policy-azure-management.md)
- [Block legacy authentication](../conditional-access/howto-conditional-access-policy-block-legacy.md)
- [Require MFA for all users](../conditional-access/howto-conditional-access-policy-all-users-mfa.md)
- [Require Azure AD MFA registration](../identity-protection/howto-identity-protection-configure-mfa-policy.md) - Requires Azure AD Identity Protection part of Azure AD Premium P2.

## Enabling security defaults

To enable security defaults in your directory:

1. Sign in to the [Azure portal](https://portal.azure.com) as a security administrator, Conditional Access administrator, or global administrator.
1. Browse to **Azure Active Directory** > **Properties**.
1. Select **Manage security defaults**.
1. Set the **Enable security defaults** toggle to **Yes**.
1. Select **Save**.

## Disabling security defaults

Organizations that choose to implement Conditional Access policies that replace security defaults must disable security defaults. 

![Warning message disable security defaults to enable Conditional Access](./media/concept-fundamentals-security-defaults/security-defaults-disable-before-conditional-access.png)

To disable security defaults in your directory:

1. Sign in to the [Azure portal](https://portal.azure.com) as a security administrator, Conditional Access administrator, or global administrator.
1. Browse to **Azure Active Directory** > **Properties**.
1. Select **Manage security defaults**.
1. Set the **Enable security defaults** toggle to **No**.
1. Select **Save**.

## Next steps

[Common Conditional Access policies](../conditional-access/concept-conditional-access-policy-common.md)
