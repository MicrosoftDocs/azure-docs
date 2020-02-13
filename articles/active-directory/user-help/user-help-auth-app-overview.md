---
title: What is the Microsoft Authenticator app? - Azure Active Directory | Microsoft Docs
description: Learn about the Microsoft Authenticator app, including what it is, how it works, and what information is included in this section of the content.
services: active-directory
author: eross-msft
manager: daveba
ms.reviewer: sahenry

ms.service: active-directory
ms.subservice: user-help
ms.workload: identity
ms.topic: overview
ms.date: 01/15/2020
ms.author: lizross
---

# What is the Microsoft Authenticator app?

The Microsoft Authenticator app helps you sign-in to your accounts if you use two-factor verification. Two-factor verification helps you to access your accounts more securely, especially while viewing sensitive information. Because passwords can be forgotten, stolen, or compromised, two-factor verification is an additional security step that helps protect your account by making it harder for other people to break in.

You can use the Microsoft Authenticator app in multiple ways, including:

- Respond to a prompt for authentication after you sign in with your username and password.

- Sign-in without entering a password, using your username, the authenticator app, and your mobile device with your fingerprint, face, or PIN.

- As a code generator for any other accounts that support authenticator apps.

> [!Important]
> The Microsoft Authenticator app works with any account that uses two-factor verification and supports the time-based one-time password (TOTP) standards.
>
>This article is intended for users trying to download and use the Microsoft Authenticator app as a security verification method. If you're an administrator looking for information about how to turn on passwordless sign-in using the Authenticator app for your employees and other uses, see the [Enable passwordless sign-in with the Microsoft Authenticator app (preview)](https://docs.microsoft.com/azure/active-directory/authentication/howto-authentication-passwordless-phone).

## Terminology

| Term|Description|
| ----|-----------|
| Two-factor verification | A verification process that requires you to specifically use only two pieces of verification info, like a password and a PIN. The Microsoft Authenticator app supports both the standard two-factor verification and passwordless sign-in. |
| Multi-factor authentication (MFA) | All two-factor verification is multi-factor authentication, requiring you to use *at least* two pieces of verification info, based on your organization's requirements. |
| Microsoft account (also called, MSA) | You create your own personal accounts, to get access to your consumer-oriented Microsoft products and cloud services, such as Outlook, OneDrive, Xbox LIVE, or Office 365. Your Microsoft account is created and stored in the Microsoft consumer identity account system that's run by Microsoft. |
| Work or school account | Your organization creates your work or school account (such as alain@contoso.com) to let you access internal and potentially restricted resources, such as Microsoft Azure, Windows Intune, and Office 365. |
| Verification code | The six-digit code that appears in the authenticator app, under each added account. The verification code changes every 30 seconds preventing someone from using a code multiple times. This is also known as a one-time passcode (OTP). |

## How two-factor verification works with the app

Two factor verification works with the Microsoft Authenticator app in the following ways:

- **Notification.** Type your username and password into the device you're logging into for either your work or school account or your personal Microsoft account, and then the Microsoft Authenticator app sends a notification asking you to **Approve sign-in**. Choose **Approve** if you recognize the sign-in attempt. Otherwise, choose **Deny**. If you choose **Deny**, you can also mark the request as fraudulent.

- **Verification code.** Type your username and password into the device you're logging into for either your work or school account or your personal Microsoft account, and then copy the associated verification code from the **Accounts** screen of the Microsoft Authenticator app. The verification code is also known as one-time passcode (OTP) authentication.

- **Passwordless sign-in.** Type your username into the device you're logging into for either your work or school account or your personal Microsoft account, and then use your mobile device to verify it's you by using your fingerprint, face, or PIN. For this method, you don't need to enter your password.

### Whether to use your device's biometric capabilities

If you use a PIN to complete the authentication process, you can set up the Microsoft Authenticator app to instead use your device's fingerprint or facial recognition (biometric) capabilities. You can set this up the first time you use the authenticator app to verify your account, by selecting the option to use your device biometric capabilities as identification instead of your PIN.

## Who decides if you use this feature?

Depending on your account type, your organization might decide that you must use two-factor verification, or you might be able to decide for yourself.

- **Work or school account.** If you're using a work or school account (for example, alain@contoso.com), it's up to your organization whether you must use two-factor verification, along with the specific verification methods. For more information about adding your work or school account to the Microsoft Authenticator app, see [Add your work or school accounts](user-help-auth-app-add-work-school-account.md).

- **Personal Microsoft account.** You can choose to set up two-factor verification for your personal Microsoft accounts (for example, alain@outlook.com). For more information about adding your personal Microsoft account, see [Add your personal accounts](user-help-auth-app-add-personal-ms-account.md).

- **Non-Microsoft account.** You can choose to set up two-factor verification for your non-Microsoft accounts (for example, alain@gmail.com). Your non-Microsoft accounts might not use the term, two-factor verification, but you should be able to find the feature within the **Security** or the **Sign-in** settings. The Microsoft Authenticator app works with any accounts that support the TOTP standards. For more information about adding your non-Microsoft accounts, see [Add your non-Microsoft accounts](user-help-auth-app-add-non-ms-account.md).

## In this section

| Article | Description |
| ------ | ------------ |
| [Download and install the app](user-help-auth-app-download-install.md) | Describes where and how to get and install the Microsoft Authenticator app for devices running Android and iOS. |
| [Add your work or school accounts](user-help-auth-app-add-work-school-account.md) | Describes how to add your various work or school and personal accounts to the Microsoft Authenticator app. |
| [Add your personal accounts](user-help-auth-app-add-personal-ms-account.md) | Describes how to add your personal Microsoft accounts to the Microsoft Authenticator app. |
| [Add your non-Microsoft accounts](user-help-auth-app-add-non-ms-account.md) | Describes how to add your non-Microsoft accounts to the Microsoft Authenticator app. |
| [Manually add your accounts](user-help-auth-app-add-account-manual.md) | Describes how to manually add your accounts to the Microsoft Authenticator app, if you're unable to scan the provided QR code. |
| [Sign-in using the app](user-help-auth-app-sign-in.md) | Describes how to sign in to your various accounts, using the Microsoft Authenticator app.|
| [Backup and recover account credentials](user-help-auth-app-backup-recovery.md) | Provides information about how to back up and recover your account credentials, using the Microsoft Authenticator app. |
| [Microsoft Authenticator app FAQ](user-help-auth-app-faq.md) | Provides answers to frequently asked questions about the app. |
