---
title: Passwordless sign-in with the Microsoft Authenticator app (preview) - Azure Active Directory
description: Sign-in to Azure AD using the Microsoft Authenticator app without using your password (public preview)

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 07/09/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: librown

ms.custom: seo-update-azuread-jan

ms.collection: M365-identity-device-management
---
# Passwordless phone sign-in with the Microsoft Authenticator app (public preview)

The Microsoft Authenticator app can be used to sign in to any Azure AD account without using a password. Similar to the technology of [Windows Hello for Business](/windows/security/identity-protection/hello-for-business/hello-identity-verification), the Microsoft Authenticator uses key-based authentication to enable a user credential that is tied to a device and uses a biometric or PIN.

![Example of a browser sign-in asking for user to approve the sign-in](./media/howto-authentication-phone-sign-in/phone-sign-in-microsoft-authenticator-app.png)

Instead of seeing a prompt for a password after entering a username, a person who has enabled phone sign-in in the Microsoft Authenticator app will see a message telling them to tap a number in their app. In the app, the user must match the number, choose Approve, then provide their PIN or biometric, then the authentication will complete.

## Enable my users

For public preview, an admin must first add a policy via powershell to allow use of the credential in the tenant. Review the "Known Issues” section before taking this step.

### Tenant prerequisites

* Azure Active Directory
* End users enabled for Azure Multi-Factor Authentication
* Users can register their devices

### Steps to enable

Follow the steps in the article [Enable passwordless sign in for Azure AD](howto-authentication-passwordless-enable.md#enable-new-passwordless-authentication-methods), to enable passwordless authentication methods in your directory.

## How do my end users enable phone sign-in?

For public preview, there is no way to enforce users to create or use this new credential. An end user will only encounter passwordless sign-in once an admin has enabled their tenant and the user has updated their Microsoft Authenticator app to enable phone sign-in.

> [!NOTE]
> This capability has been in the app since March of 2017, so there is a possibility that when the policy is enabled for a tenant, users may encounter this flow immediately. Be aware and prepare your users for this change.
>

1. Enroll in Azure Multi-Factor Authentication
1. Latest version of Microsoft Authenticator installed on devices running iOS 8.0 or greater, or Android 6.0 or greater.
1. Work or school account with push notifications added to the app. End-user documentation can be found at [https://aka.ms/authappstart](https://aka.ms/authappstart).

Once the user has the MFA account with push notifications set up in the Microsoft Authenticator app, they can follow the steps in the article [Sign in with your phone, not your password](../user-help/microsoft-authenticator-app-phone-signin-faq.md) to complete the phone sign-in registration.

## Known Issues

### AD FS Integration

When a user has enabled the Microsoft Authenticator passwordless credential, authentication for that user will always default to sending a notification for approval. This logic prevents users in a hybrid tenant from being directed to ADFS for sign-in verification without the user taking an additional step to click “Use your password instead.” This process will also bypass any on-premises Conditional Access policies, and Pass-through authentication flows. The exception to this process is if a login_hint is specified, a user will be autoforwarded to AD FS, and bypass the option to use the passwordless credential.

### Azure MFA server

End users who are enabled for MFA through an organization’s on-premises Azure MFA server can still create and use a single passwordless phone sign-in credential. If the user attempts to upgrade multiple installations (5+) of the Microsoft Authenticator with the credential, this change may result in an error.  

### Device Registration

One of the prerequisites to create this new, strong credential, is that the device where it resides is registered within the Azure AD tenant, to an individual user. Due to device registration restrictions, a device can only be registered in a single tenant. This limit means that only one work or school account in the Microsoft Authenticator app can be enabled for phone sign-in.

## Next steps

[What is passwordless?](concept-authentication-passwordless.md)

[Learn about device registration](../devices/overview.md#getting-devices-in-azure-ad)

[Learn about Azure Multi-Factor Authentication](../authentication/howto-mfa-getstarted.md)
