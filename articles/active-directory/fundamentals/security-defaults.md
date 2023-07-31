---
title: Providing a default level of security in Azure Active Directory
description: Azure AD security defaults that help protect organizations from common identity attacks

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 07/25/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: sama

ms.collection: M365-identity-device-management
---
# Security defaults in Azure AD

Security defaults make it easier to help protect your organization from identity-related attacks like password spray, replay, and phishing common in today's environments. 

Microsoft is making these preconfigured security settings available to everyone, because we know managing security can be difficult. Based on our learnings more than 99.9% of those common identity-related attacks are stopped by using multifactor authentication (MFA) and blocking legacy authentication. Our goal is to ensure that all organizations have at least a basic level of security enabled at no extra cost.

These basic controls include:

- [Requiring all users to register for Azure AD Multifactor Authentication](#require-all-users-to-register-for-azure-ad-multifactor-authentication).
- [Requiring administrators to do multifactor authentication](#require-administrators-to-do-multifactor-authentication).
- [Requiring users to do multifactor authentication when necessary](#require-users-to-do-multifactor-authentication-when-necessary).
- [Blocking legacy authentication protocols](#block-legacy-authentication-protocols).
- [Protecting privileged activities like access to the Azure portal](#protect-privileged-activities-like-access-to-the-azure-portal).

## Who's it for?

- Organizations who want to increase their security posture, but don't know how or where to start.
- Organizations using the free tier of Azure Active Directory licensing.

### Who should use Conditional Access?

- If you're an organization with Azure Active Directory Premium licenses, security defaults are probably not right for you.
- If your organization has complex security requirements, you should consider [Conditional Access](#conditional-access).

## Enabling security defaults

If your tenant was created on or after October 22, 2019, security defaults may be enabled in your tenant. To protect all of our users, security defaults are being rolled out to all new tenants at creation. 

To help protect organizations, we're always working to improve the security of Microsoft account services. As part of this protection, customers are periodically notified for the automatic enablement of the security defaults if they: 

- Haven't enabled Conditional Access policies.
- Don't have premium licenses.
- Aren’t actively using legacy authentication clients.

After this setting is enabled, all users in the organization will need to register for multifactor authentication. To avoid confusion, refer to the email you received and alternatively you can [disable security defaults](#disabling-security-defaults) after it's enabled.

To configure security defaults in your directory, you must be assigned at least the Security Administrator role. By default the first account in any directory is assigned a higher privileged role known as Global Administrator. 

To enable security defaults:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/).
1. Browse to **Microsoft Entra ID (Azure AD)** > **Properties**.
   1. Select **Manage security defaults**.
1. Set **Security defaults** to **Enabled**.
1. Select **Save**.

:::image type="content" source="media/security-defaults/security-defaults-entra-admin-center.png" alt-text="Screenshot of the Microsoft Entra admin center with the toggle to enable security defaults" lightbox="media/security-defaults/security-defaults-entra-admin-center.png":::

### Revoking active tokens

As part of enabling security defaults, administrators should revoke all existing tokens to require all users to register for multifactor authentication. This revocation event forces previously authenticated users to authenticate and register for multifactor authentication. This task can be accomplished using the [Revoke-AzureADUserAllRefreshToken](/powershell/module/azuread/revoke-azureaduserallrefreshtoken) PowerShell cmdlet.

## Enforced security policies

### Require all users to register for Azure AD Multifactor Authentication

All users in your tenant must register for multifactor authentication (MFA) in the form of the Azure AD Multifactor Authentication. Users have 14 days to register for Azure AD Multifactor Authentication by using the [Microsoft Authenticator app](../authentication/concept-authentication-authenticator-app.md) or any app supporting [OATH TOTP](../authentication/concept-authentication-oath-tokens.md). After the 14 days have passed, the user can't sign in until registration is completed. A user's 14-day period begins after their first successful interactive sign-in after enabling security defaults.

### Require administrators to do multifactor authentication

Administrators have increased access to your environment. Because of the power these highly privileged accounts have, you should treat them with special care. One common method to improve the protection of privileged accounts is to require a stronger form of account verification for sign-in. In Azure AD, you can get a stronger account verification by requiring multifactor authentication. 

> [!TIP]
> Recommendations for your admins:
> - Ensure all your admins sign in after enabling security defaults so that they can register for authentication methods.
> - Have separate accounts for administration and standard productivity tasks to significantly reduce the number of times your admins are prompted for MFA.

After registration with Azure AD Multifactor Authentication is finished, the following Azure AD administrator roles will be required to do extra authentication every time they sign in:

- Global Administrator
- Application Administrator
- Authentication Administrator
- Billing Administrator
- Cloud Application Administrator
- Conditional Access Administrator
- Exchange Administrator
- Helpdesk Administrator
- Password Administrator
- Privileged Authentication Administrator
- Privileged Role Administrator
- Security Administrator
- SharePoint Administrator
- User Administrator

### Require users to do multifactor authentication when necessary

We tend to think that administrator accounts are the only accounts that need extra layers of authentication. Administrators have broad access to sensitive information and can make changes to subscription-wide settings. But attackers frequently target end users. 

After these attackers gain access, they can request access to privileged information for the original account holder. They can even download the entire directory to do a phishing attack on your whole organization. 

One common method to improve protection for all users is to require a stronger form of account verification, such as multifactor authentication, for everyone. After users complete registration, they'll be prompted for another authentication whenever necessary. Azure AD decides when a user is prompted for multifactor authentication, based on factors such as location, device, role and task. This functionality protects all applications registered with Azure AD including SaaS applications.

> [!NOTE]
> In case of [B2B direct connect](../external-identities/b2b-direct-connect-overview.md) users, any multifactor authentication requirement from security defaults enabled in resource tenant will need to be satisfied, including multifactor authentication registration by the direct connect user in their home tenant.  

### Block legacy authentication protocols

To give your users easy access to your cloud apps, Azure AD supports various authentication protocols, including legacy authentication. *Legacy authentication* is a term that refers to an authentication request made by:

- Clients that don't use modern authentication (for example, an Office 2010 client).
- Any client that uses older mail protocols such as IMAP, SMTP, or POP3.

Today, most compromising sign-in attempts come from legacy authentication. Legacy authentication doesn't support multifactor authentication. Even if you have a multifactor authentication policy enabled on your directory, an attacker can authenticate by using an older protocol and bypass multifactor authentication. 

After security defaults are enabled in your tenant, all authentication requests made by an older protocol will be blocked. Security defaults blocks Exchange Active Sync basic authentication.

> [!WARNING]
> Before you enable security defaults, make sure your administrators aren't using older authentication protocols. For more information, see [How to move away from legacy authentication](../conditional-access/block-legacy-authentication.md).

- [How to set up a multifunction device or application to send email using Microsoft 365](/exchange/mail-flow-best-practices/how-to-set-up-a-multifunction-device-or-application-to-send-email-using-microsoft-365-or-office-365)

### Protect privileged activities like access to the Azure portal

Organizations use various Azure services managed through the Azure Resource Manager API, including:

- Azure portal 
- Microsoft Entra Admin Center
- Azure PowerShell 
- Azure CLI

Using Azure Resource Manager to manage your services is a highly privileged action. Azure Resource Manager can alter tenant-wide configurations, such as service settings and subscription billing. Single-factor authentication is vulnerable to various attacks like phishing and password spray. 

It's important to verify the identity of users who want to access Azure Resource Manager and update configurations. You verify their identity by requiring more authentication before you allow access.

After you enable security defaults in your tenant, any user accessing the following services must complete multifactor authentication: 

- Azure portal
- Azure PowerShell 
- Azure CLI 

This policy applies to all users who are accessing Azure Resource Manager services, whether they're an administrator or a user. 

> [!NOTE]
> Pre-2017 Exchange Online tenants have modern authentication disabled by default. In order to avoid the possibility of a login loop while authenticating through these tenants, you must [enable modern authentication](/exchange/clients-and-mobile-in-exchange-online/enable-or-disable-modern-authentication-in-exchange-online).

> [!NOTE]
> The Azure AD Connect synchronization account is excluded from security defaults and will not be prompted to register for or perform multifactor authentication. Organizations should not be using this account for other purposes.

## Deployment considerations

### Authentication methods

Security defaults users are required to register for and use Azure AD Multifactor Authentication using the [Microsoft Authenticator app using notifications](../authentication/concept-authentication-authenticator-app.md). Users may use verification codes from the Microsoft Authenticator app but can only register using the notification option. Users can also use any third party application using [OATH TOTP](../authentication/concept-authentication-oath-tokens.md) to generate codes.

> [!WARNING]
> Do not disable methods for your organization if you are using security defaults. Disabling methods may lead to locking yourself out of your tenant. Leave all **Methods available to users** enabled in the [MFA service settings portal](../authentication/howto-mfa-getstarted.md#choose-authentication-methods-for-mfa).

### Backup administrator accounts

Every organization should have at least two backup administrators configured. We call these emergency access accounts.

These accounts may be used in scenarios where your normal administrator accounts can't be used. For example: The person with the most recent global administrator access has left the organization. Azure AD prevents the last global administrator account from being deleted, but it doesn't prevent the account from being deleted or disabled on-premises. Either situation might make the organization unable to recover the account.

Emergency access accounts are:

- Assigned global administrator rights in Azure AD.
- Aren't used on a daily basis.
- Are protected with a long complex password.
 
The credentials for these emergency access accounts should be stored offline in a secure location such as a fireproof safe. Only authorized individuals should have access to these credentials. 

To create an emergency access account: 

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/) as an existing Global Administrator.
1. Browse to **Microsoft Entra ID (Azure AD)** > **Users** > **All users**.
1. Select **New user** > **Create user**.
1. Set the **User principal name** and **Display name** for this account.
1. Create a long and complex password for the account.
1. Under **Properties**, set **Usage location** to the appropriate location.
1. Under **Assignments** > **Add role**, assign the **Global Administrator** role.
1. Select **Create**.

You may choose to [disable password expiration](../authentication/concept-sspr-policy.md#set-a-password-to-never-expire) for these accounts using Azure AD PowerShell.

For more detailed information about emergency access accounts, see the article [Manage emergency access accounts in Azure AD](../roles/security-emergency-access.md).

### B2B users

Any [B2B guest](../external-identities/what-is-b2b.md) users or [B2B direct connect](../external-identities/b2b-direct-connect-overview.md) users that access your directory are treated the same as your organization's users.

### Disabled MFA status

If your organization is a previous user of per-user based Azure AD Multifactor Authentication, don't be alarmed to not see users in an **Enabled** or **Enforced** status if you look at the Multi-Factor Auth status page. **Disabled** is the appropriate status for users who are using security defaults or Conditional Access based Azure AD Multifactor Authentication.

### Conditional Access

You can use Conditional Access to configure policies similar to security defaults, but with more granularity. Conditional Access policies allow selecting other authentication methods and the ability to exclude users, which aren't available in security defaults. If you're using Conditional Access in your environment today, security defaults aren't available to you. 

:::image type="content" source="media/security-defaults/security-defaults-conditional-access.png" alt-text="Screenshot showing the warning message that you can have security defaults or Conditional Access not both" lightbox="media/security-defaults/security-defaults-conditional-access.png":::

If you want to enable Conditional Access to configure a set of policies, which form a good starting point for protecting your identities:

- [Require MFA for administrators](../conditional-access/howto-conditional-access-policy-admin-mfa.md)
- [Require MFA for Azure management](../conditional-access/howto-conditional-access-policy-azure-management.md)
- [Block legacy authentication](../conditional-access/howto-conditional-access-policy-block-legacy.md)
- [Require MFA for all users](../conditional-access/howto-conditional-access-policy-all-users-mfa.md)

### Disabling security defaults

Organizations that choose to implement Conditional Access policies that replace security defaults must disable security defaults. 

To disable security defaults in your directory:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/).
1. Browse to **Microsoft Entra ID (Azure AD)** > **Properties**.
   1. Select **Manage security defaults**.
1. Set **Security defaults** to **Disabled (not recommended)**.
1. Select **Save**.

## Next steps

- [Blog: Introducing security defaults](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/introducing-security-defaults/ba-p/1061414)
- [Common Conditional Access policies](../conditional-access/concept-conditional-access-policy-common.md)
- More information about Azure AD licensing can be found on the [Azure AD pricing page](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing).
