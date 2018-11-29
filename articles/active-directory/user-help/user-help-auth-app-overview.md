---
title: Microsoft Authenticator app overview - Azure Active Directory | Microsoft Docs
description: Learn about how to set up and use the Microsoft Authenticator app.
services: active-directory
author: eross-msft
manager: mtillman
ms.reviewer: sahenry

ms.service: active-directory
ms.component: user-help
ms.workload: identity
ms.topic: overview
ms.date: 11/29/2018
ms.author: lizross
---

# Microsoft Authenticator app overview

>[!Important]
>This content is intended for users. If you're an administrator, you can find more information about how to set up and manage your Azure Active Directory (Azure AD) environment in the [Azure Active Directory Documentation](https://docs.microsoft.com/azure/active-directory).

The Microsoft Authenticator app helps you prove your identity without needing to remember a password. Instead of a password, your sign-in using your username and your mobile device with your fingerprint, face, or PIN to confirm that you are in fact, you. Two-factor verification is considered more secure than just a password, especially while viewing sensitive info.

>[!NOTE]
>If you're having issues signing in to your account, see [When you can't sign in to your Microsoft account](https://support.microsoft.com/help/12429) for help.  Get more info about what to do when you receive the [“That Microsoft account doesn't exist”](https://support.microsoft.com/help/13811) message when you try to sign in to your Microsoft account.

## Terminology
|Term|Description|
|----|-----------|
|Two-factor verification |A verification process that requires you to specifically use only two pieces of verification info, like a password and a PIN. The Microsoft Authenticator app uses this form of verification.|
|Multi-factor authentication (MFA)|All two-factor verification is multi-factor authentication, requiring you to use *at least* two pieces of verification info, based on your organization's requirements.|
|Microsoft account (also called, MSA)|You create your own personal accounts, to get access to your consumer-oriented Microsoft products and cloud services, such as Outlook, OneDrive, Xbox LIVE, or Office 365. Your Microsoft account is created and stored in the Microsoft consumer identity account system that's run by Microsoft.|
|Work or school account|Your organization creates your work or school account (such as alain@contoso.com) to let you access internal and potentially restricted resources, such as Microsoft Azure, Windows Intune, and Office 365.|

## Who decides to use this feature?
Depending on your account type, your organization might decide that you have to use two-factor verification, or you might be able to decide for yourself.

- **Work or school account.** If you're using a work or school account (for example, alain@contoso.com), it's up to your organization whether you must use two-factor verification, along with the specific verification methods. For more information about multi-factor verification, see [What does Azure Multi-Factor Authentication mean for me](multi-factor-authentication-end-user.md). For more information about how to set up Security info to use the Microsoft Authentication app, see [Set up security info to use an authenticator app (preview)](security-info-setup-auth-app.md).

- **Personal Microsoft account.** You can choose to set up two-factor verification for your personal Microsoft accounts (for example, alain@outlook.com).

- **Non-Microsoft personal account.** You can choose to set up two-factor verification for your non-Microsoft personal accounts (for example, alain@gmail.com). Your non-Microsoft accounts might not use the term, two-factor verification, but you should be able to find the feature within the **Security** or the **Sign-in** settings. For more information, watch these [Microsoft Customer Support videos](https://www.youtube.com/playlist?list=PLyhj1WZ29G65QdD9NxTOAm8HwOS-OBUrX) to see how to add non-Microsoft personal accounts.

## How this feature works?
Two-factor verification specifically works in one of two ways:

- **Notification.** The Microsoft Authenticator app sends a notification asking you to **Approve sign-in**. Choose **Approve** if you recognize the sign-in attempt. Otherwise, choose **Deny**. If you choose **Deny**, you can also mark the request as fraudulent.

- **Verification code.** Type in your username and password for either your work or school account or your personal Microsoft account, and then copy the associated verification code from the **Accounts** screen of the Microsoft Authenticator app.

### Use your device's fingerprint or facial recognition capabilities

Your organization might require a PIN to complete your identity verification. You can set up the Microsoft Authenticator app to use your device's fingerprint or facial recognition capabilities instead of a PIN. You can set this up the first time you use the authenticator app to verify your account, by selecting the option to use your device biometric capabilities as identification instead of your PIN.

## In this section

|Article |Description |
|------|------------|
|[Download and install the app](microsoft-authenticator-app-how-to.md)|Describes where and how to get and install the Microsoft Authenticator app for devices running Android, iOS, and Windows Phone.|
|[Add your accounts](microsoft-authenticator-app-add-work-account.md)|Describes how to add your
|[Sign-in using the app]()
|[Backup and recover account credentials with the Microsoft Authenticator app](microsoft-authenticator-app-backup-and-recovery.md)| Provides information about how to back up and recover your account credentials, using the Microsoft Authenticator app.|
|[Microsoft Authenticator app FAQ](microsoft-authenticator-app-faq.md)|Provides answers to frequently asked questions about the app.|