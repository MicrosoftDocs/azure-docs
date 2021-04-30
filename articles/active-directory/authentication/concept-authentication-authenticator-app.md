---
title: Microsoft Authenticator app authentication method - Azure Active Directory
description: Learn about using the Microsoft Authenticator app in Azure Active Directory to help improve and secure sign-in events

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 02/22/2021

ms.author: justinha
author: justinha
manager: daveba

ms.collection: M365-identity-device-management

# Customer intent: As an identity administrator, I want to understand how to use the Microsoft Authenticator app in Azure AD to improve and secure user sign-in events.
---
# Authentication methods in Azure Active Directory - Microsoft Authenticator app

The Microsoft Authenticator app provides an additional level of security to your Azure AD work or school account or your Microsoft account and is available for [Android](https://go.microsoft.com/fwlink/?linkid=866594) and [iOS](https://go.microsoft.com/fwlink/?linkid=866594). With the Microsoft Authenticator app, users can authenticate in a passwordless way during sign-in, or as an additional verification option during self-service password reset (SSPR) or Azure AD Multi-Factor Authentication events.

Users may receive a notification through the mobile app for them to approve or deny, or use the Authenticator app to generate an OAUTH verification code that can be entered in a sign-in interface. If you enable both a notification and verification code, users who register the Authenticator app can use either method to verify their identity.

To use the Authenticator app at a sign-in prompt rather than a username and password combination, see [Enable passwordless sign-in with the Microsoft Authenticator app](howto-authentication-passwordless-phone.md).

> [!NOTE]
> Users don't have the option to register their mobile app when they enable SSPR. Instead, users can register their mobile app at [https://aka.ms/mfasetup](https://aka.ms/mfasetup) or as part of the combined security info registration at [https://aka.ms/setupsecurityinfo](https://aka.ms/setupsecurityinfo).

## Passwordless sign-in

Instead of seeing a prompt for a password after entering a username, a user that has enabled phone sign-in from the Microsoft Authenticator app sees a message to tap a number in their app. When the correct number is selected, the sign-in process is complete.

![Example of a browser sign-in asking for user to approve the sign-in](./media/howto-authentication-passwordless-phone/phone-sign-in-microsoft-authenticator-app.png)

This authentication method provides a high level of security, and removes the need for the user to provide a password at sign-in. 

To get started with passwordless sign-in, see [Enable passwordless sign-in with the Microsoft Authenticator app](howto-authentication-passwordless-phone.md).

## Notification through mobile app

The Authenticator app can help prevent unauthorized access to accounts and stop fraudulent transactions by pushing a notification to your smartphone or tablet. Users view the notification, and if it's legitimate, select **Verify**. Otherwise, they can select **Deny**.

![Screenshot of example web browser prompt for Authenticator app notification to complete sign-in process](media/tutorial-enable-azure-mfa/azure-multi-factor-authentication-browser-prompt.png)

> [!NOTE]
> If your organization has staff working in or traveling to China, the *Notification through mobile app* method on Android devices doesn't work in that country/region as Google play services(including push notifications) are blocked in the region. However iOS notification do work. For Android devices ,alternate authentication methods should be made available for those users.

## Verification code from mobile app

The Authenticator app can be used as a software token to generate an OATH verification code. After entering your username and password, you enter the code provided by the Authenticator app into the sign-in interface. The verification code provides a second form of authentication.

Users may have a combination of up to five OATH hardware tokens or authenticator applications, such as the Microsoft Authenticator app, configured for use at any time.

> [!WARNING]
> To ensure the highest level of security for self-service password reset when only one method is required for reset, a verification code is the only option available to users.
>
> When two methods are required, users can reset using either a notification or verification code in addition to any other enabled methods.

## Next steps

To get started with passwordless sign-in, see [Enable passwordless sign-in with the Microsoft Authenticator app](howto-authentication-passwordless-phone.md).

Learn more about configuring authentication methods using the [Microsoft Graph REST API](/graph/api/resources/authenticationmethods-overview).
