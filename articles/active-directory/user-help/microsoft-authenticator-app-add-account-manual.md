---
title: Manually add an account to the app - Azure Active Directory | Microsoft Docs
description: How to manually add your accounts to the Microsoft Authenticator app for two-factor verification.
services: active-directory
author: eross-msft
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.component: user-help
ms.topic: conceptual
ms.date: 11/29/2018
ms.author: lizross
ms.reviewer: librown
---

# Manually add an account to the app
If your camera is unable to capture the QR code, you can manually add your account information to the Microsoft Authenticator app for two-factor verification. This works for work or school accounts and non-Microsoft personal accounts.

The codes provided for your accounts aren't case-sensitive and don't require spaces when added into the Microsoft Authenticator app.

>[!Important]
>Before you can add your account, you must download and install the Microsoft Authenticator app. If you haven't done that yet, follow the steps in the [Download and install the app](microsoft-authenticator-app-how-to.md) article.

## Add your work or school account

1. From the **Configure mobile app** screen on your PC, note the **Code** and **Url** information. Keep this screen open so you can see the code and URL.
    
    ![Screen that provides the QR code](./media/microsoft-authenticator-app-add-account-manual/auth-app-barcode.png)

2. Open the Microsoft Authenticator app, select **Add account** from the **Customize and control** icon in the upper-right, and then select **Work or school account**.

3. Select **OR ENTER CODE MANUALLY** at the bottom of the screen.

    ![Screen for scanning a QR code](./media/microsoft-authenticator-app-add-account-manual/auth-app-manual-code.png)
   
4. Enter the **Code** and **URL** from Step 1, and then select **Finish**.

    ![Screen for entering code and URL](./media/microsoft-authenticator-app-add-account-manual/auth-app-code-url.png)

    The **Accounts** screen of the app shows you your account name and a six-digit verification code. For additional security, the verification code changes every 30 seconds preventing you from using the same code twice.

## Add your Google account

1. On your PC, select **CAN'T SCAN IT** from the **Set up Authenticator** screen with the QR code.

    The **Can't scan barcode** screen appears with the secret code. Keep this screen open so you can see the secret code.

2. Open the Microsoft Authenticator app, select **Add account** from the **Customize and control** icon in the upper-right, select **Other account (Google, Facebook, etc.)**, and then select **OR ENTER CODE MANUALLY** at the bottom of the screen.

3. Enter an **Account name** (for example, Google) and type the **Secret key** from Step 1, and then select **Finish**.

4. On the **Set up Authenticator** screen on your PC, type the six-digit verification code provided in the app for your Google account, and then select **Verify**.

    The **Accounts** screen of the app shows you your account name and a six-digit verification code. For additional security, the verification code changes every 30 seconds preventing you from using the same code twice.

## Add your Facebook account

1. On the **Set up via Third Party Authenticator** screen, which includes the QR code, and a code written out for entry into your app. Keep this screen open so you can see the code.

2. Open the Microsoft Authenticator app, select **Add account** from the **Customize and control** icon in the upper-right, select **Other account (Google, Facebook, etc.)**, and then select **OR ENTER CODE MANUALLY** at the bottom of the screen.

3. Enter an **Account name** (for example, Facebook) and type the **Secret key** from Step 1, and then select **Finish**.

4. On the **Two-Factor Authenticator** screen on your PC, type the six-digit verification code provided in the app for your Facebook account, and then select **Verify**.

    The **Accounts** screen of the app shows you your account name and a six-digit verification code. For additional security, the verification code changes every 30 seconds preventing you from using the same code twice.

## Next steps

- After you add your accounts to the app, you can sign in using the Authenticator app on your device. For more information, see [Sign in using the app](microsoft-authenticator-app-phone-signin-faq.md).

- For devices running iOS, you can also back up your account credentials and related app settings, such as the order of your accounts, to the cloud. For more information, see [Backup and recover with Microsoft Authenticator app](microsoft-authenticator-app-backup-and-recovery.md).