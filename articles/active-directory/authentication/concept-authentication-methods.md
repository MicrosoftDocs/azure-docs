---
title: Authentication methods and features - Azure Active Directory
description: Learn about the different authentication methods and features available in Azure Active Directory to help improve and secure sign-in events

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 07/14/2020

ms.author: iainfou
author: iainfoulds
manager: daveba

ms.collection: M365-identity-device-management
ms.custom: contperfq4

# Customer intent: As an identity administrator, I want to understand what authentication options are available in Azure AD and how or why I can use them to improve and secure user sign-in events.
---
# What authentication and verification methods are available in Azure Active Directory?

As part of the sign-in experience for accounts in Azure Active Directory (Azure AD), there are different ways that a user can authenticate themselves. A username and password is the most common way a user would historically provide credentials. With modern authentication and security features in Azure AD, that basic password can be supplemented or replaced with additional authentication methods.

A user in Azure AD can choose to authenticate using one of the following authentication methods:

* Traditional username and password
* Microsoft Authenticator App passwordless sign-in
* OATH hardware token or FIDO2 security key
* SMS-based passwordless sign-in

Many accounts in Azure AD are enabled for self-service password reset (SSPR) or Azure Multi-Factor Authentication. These features include additional verification methods, such as a phone call or security questions. It's recommended that you require users to register multiple verification methods. When one method isn't available for a user, they can choose to authenticate with another method.

The following table outlines what methods are available for primary or secondary authentication:

| Method                         | Primary authentication | Secondary authentication  |
|--------------------------------|------------------------|---------------------------|
| FIDO2 security keys (preview)  | Yes                    | MFA-only                  |
| Microsoft Authenticator app    | Yes (preview)          | MFA and SSPR              |
| OATH hardware tokens (preview) | No                     | MFA                       |
| OATH software tokens           | No                     | MFA                       |
| SMS                            | Yes (preview)          | MFA and SSPR              |
| Voice call                     | No                     | MFA and SSPR              |
| Password                       | Yes                    |                           |

These authentication methods can be configured in the Azure portal, and increasingly using the [Microsoft Graph REST API beta](/graph/api/resources/authenticationmethods-overview?view=graph-rest-beta).

This article outlines these different authentication and verification methods available in Azure AD and any specific limitations or restrictions.

![Authentication methods in use at the sign-in screen](media/concept-authentication-methods/overview-login.png)

## Authentication method security considerations

| Recommended | Authentication method | Security | Convenience | Satisfy Strong authentication requirements? | Phisable? |  Channel jackable? | Availability | NIST authenticator type |
|---------|---------|---------|---------|---------|---------|---------|---------|---------|
| Best | Windows Hello for Business | High | High | Strong primary and secondary | No | No | High | Multi-factor crypto hardware when used with hardware TPM.<br /><br />Multi-factor crypto software when used with software TPM. |
| Best | FIDO2 security key | High | High | Strong authentication | No | No | High | Multi-factor crypto hardware |
| Best | Microsoft Authenticator app | High | High  Strong authentication<br /><br />Can satisfy secondary authentication when used with a password. | Yes | No  | High | Multi-factor crypto software when used in Passwordless mode on iOS or Android devices.<br /><br />Single-factor crypto software when used with a password. |
| Better | Hardware OATH tokens | Medium | Medium | Secondary authentication when used with a password. | Yes | No | High | Single-factor one time password. |
| Better | Software OATH tokens | Medium | Medium | Secondary authentication when used with a password. | Yes | No | High | Single-factor one time password. |
| Good | SMS | Medium | High | Primary or secondary authentication when used with a password. | Yes | Yes | Medium | Out-of-band (not recommended) |
| Good | Voice | Medium | Medium | Secondary authentication when used with a password | Yes | Yes | Medium | |
| Bad | Password | Low | High | Primary authentication | Yes | Yes | High | Memorized secret |

## How each authentication method works

* [Microsoft Authenticator app](concept-authentication-authenticator-app.md)
* [FIDO2 security keys (preview)](concept-authentication-passwordless.md#fido2-security-keys)
* [OATH software tokens](concept-authentication-oath-tokens.md#oath-software-tokens)
* [OATH hardware tokens (preview)](concept-authentication-oath-tokens.md#oath-hardware-tokens-preview)
* [SMS](concept-authentication-phone-options.md#phone-options)
* [Voice call](concept-authentication-phone-options.md#phone-options)
* Password

An Azure AD password is often one of the primary authentication methods. You can't disable the password authentication method.

Even if you use an authentication method such as [SMS-based sign-in](howto-authentication-sms-signin.md) when the user doesn't use their password to sign, a password remains as an available authentication method.

The following methods can also be used to confirm your identity as part of SSPR or MFA:

* [Security questions](#security-questions)
* [Email address](#email-address)
* [App passwords](#app-passwords)

## Secondary verification methods

### Email address

An email address can't be used as a direct authentication method. Email address is only available as a verification option for self-service password reset (SSPR). When email address is selected during SSPR, an email is sent to the user to complete the authentication / verification process.

During registration for SSPR, a user provides the email address to use. It's recommended that they use a different email account than their corporate account to make sure they can access it during SSPR.

### App passwords

Certain older, non-browser apps don't understand pauses or breaks in the authentication process. If a user is enabled for multi-factor authentication and attempts to use one of these older, non-browser apps, they usually can't successfully authenticate. An app password allows users to continue to successfully authenticate with older, non-browser apps without interruption.

By default, users can't create app passwords. If you need to allow users to create app passwords, select the **Allow users to create app passwords to sign into non-browser apps** under *Service settings* for user's Azure Multi-Factor Authentication properties.

![Screenshot of the Azure portal that shows the service settings for multi-factor authentication to allow the user of app passwords](media/concept-authentication-methods/app-password-authentication-method.png)

If you enforce Azure Multi-Factor Authentication using Conditional Access policies and not through per-user MFA, you can't create app passwords. Modern applications that use Conditional Access policies to control access don't need app passwords.

If your organization is federated for single sign-on (SSO) with Azure AD and you use Azure Multi-Factor Authentication, the following considerations apply:

* The app password is verified by Azure AD, so bypasses federation. Federation is only used when setting up app passwords. For federated (SSO) users, passwords are stored in the organizational ID. If the user leaves the company, that info has to flow to organizational ID using DirSync. Account disable or deletion  events may take up to three hours to sync, which delays the disabling / deletion of app passwords in Azure AD.
* On-premises Client Access Control settings aren't honored by app passwords.
* No on-premises authentication logging or auditing capability is available for app passwords.
* Certain advanced architectural designs may require using a combination of organizational username and passwords and app passwords when using multi-factor authentication, depending on where they authenticate.
    * For clients that authenticate against an on-premises infrastructure, you would use an organizational username and password.
    * For clients that authenticate against Azure AD, you would use the app password.

## Next steps

To get started, see the [tutorial for self-service password reset (SSPR)][tutorial-sspr] and [Azure Multi-Factor Authentication][tutorial-azure-mfa].

To learn more about SSPR concepts, see [How Azure AD self-service password reset works][concept-sspr].

To learn more about MFA concepts, see [How Azure Multi-Factor Authentication works][concept-mfa].

Learn more about configuring authentication methods using the [Microsoft Graph REST API beta](/graph/api/resources/authenticationmethods-overview?view=graph-rest-beta).

<!-- INTERNAL LINKS -->
[tutorial-sspr]: tutorial-enable-sspr.md
[tutorial-azure-mfa]: tutorial-enable-azure-mfa.md
[concept-sspr]: concept-sspr-howitworks.md
[concept-mfa]: concept-mfa-howitworks.md
