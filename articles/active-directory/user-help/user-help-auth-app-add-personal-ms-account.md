---
title: Add your personal Microsoft accounts to the Microsoft Authenticator app - Azure Active Directory | Microsoft Docs
description: How to add your personal Microsoft accounts, such as for Outlook.com or Xbox LIVE to the Microsoft Authenticator app for two-factor verification.
services: active-directory
author: eross-msft
manager: daveba

ms.service: active-directory
ms.workload: identity
ms.subservice: user-help
ms.topic: conceptual
ms.date: 01/24/2019
ms.author: lizross
ms.reviewer: olhaun
ms.collection: M365-identity-device-management
---

# Add your personal Microsoft accounts
Add your personal Microsoft accounts, such as for Outlook.com and Xbox LIVE to the Microsoft Authenticator app for both the standard two-factor verification process and the passwordless phone sign-in method.

- **Standard two-factor verification method.** Type your username and password into the device you're logging in to, and then choose whether the Microsoft Authenticator app sends a notification or if you'd prefer to copy the associated verification code from the **Accounts** screen of the Microsoft Authenticator app.

- **Passwordless sign-in method.** Type your username into the device you're logging into for your personal Microsoft account, and then use your mobile device to verify it's you by using your fingerprint, face, or PIN. For this method, you don't need to enter your password.

>[!Important]
>Before you can add your account, you must download and install the Microsoft Authenticator app. If you haven't done that yet, follow the steps in the [Download and install the app](user-help-auth-app-download-install.md) article.

## Add your personal Microsoft account
You can add your personal Microsoft account by first turning on two-factor verification, and then by adding the account to the app.

>[!Note]
>if you plan to only use passwordless phone sign-in for your personal Microsoft account, you don't have to turn on two-factor verification. However, for additional account security, we recommend that you turn on two-factor verification.

### Turn on two-factor verification

1. On your computer, go to your [Security basics](https://account.microsoft.com/security) page and sign-in using your personal Microsoft account. For example, alain@outlook.com.

2. At the bottom of the **Security basics** page, choose the **more security options** link.

    ![Security basics page with the "more security options" link highlighted](./media/user-help-auth-app-add-personal-ms-account/more-security-options-link.png)

3. Go to the **Two-step verification** section and choose to turn the feature **On**. You can also turn it off here if you no longer want to use it with your personal account.

### Add your Microsoft account to the app

1. Open the Microsoft Authenticator app on your mobile device.

2. Select **Add account** from the **Customize and control** icon in the upper right.

    ![Accounts page, with the Customize and control icon highlighted](./media/user-help-auth-app-add-personal-ms-account/customize-and-control-icon.png)

3. In the **Add account** page, choose **Personal account**.

4. Sign in to your personal account, using the appropriate email address (such as alain@outlook.com), and then choose **Next**.

    >[!Note]
    >If you don't have a personal Microsoft account, you can to create one here.

5. Enter your password, and then choose **Sign in**.

    Your personal account is added to the Microsoft Authenticator app.

## Next steps

- After you add your accounts to the app, you can sign in using the Authenticator app on your device. For more information, see [Sign in using the app](user-help-auth-app-sign-in.md).

- If you're having trouble getting your verification code for your personal Microsoft account, see the **Troubleshooting verification code issues** section of the [Microsoft account security info & verification codes](https://support.microsoft.com/en-us/help/12428/microsoft-account-security-info-verification-codes) article.

- For devices running iOS, you can also back up your account credentials and related app settings, such as the order of your accounts, to the cloud. For more information, see [Backup and recover with Microsoft Authenticator app](user-help-auth-app-backup-recovery.md).
