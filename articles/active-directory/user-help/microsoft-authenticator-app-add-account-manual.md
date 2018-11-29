---
title: Manually add your accounts to the app - Azure Active Directory | Microsoft Docs
description: Learn how to manually add your accounts to the Microsoft Authenticator app for two-factor verification.
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

# Manually add your work or school account to the app
If your camera is unable to capture the QR code, you can manually add your account information to the Microsoft Authenticator app for two-factor verification.

>[!Important]
>Before you can add your account, you have to download and install the Microsoft Authenticator app. If you haven't done that yet, follow the steps in the [Download and install the app](microsoft-authenticator-app-how-to.md) article.

## To manually add your work or school account

1. On your PC, go to the [Additional security verification](https://aka.ms/mfasetup) page.

    >[!Note]
    >If you don't see the **Additional security verification** page, it's possible that your administrator has turned on the security info preview experience. If that's the case, you should follow the instructions in the [Set up security info to use an authenticator app](security-info-setup-auth-app.md) section. If that's not the case, you will need to contact your organization's Help Desk for assistance.

2. Check the box next to **Authenticator app**, and then select **Configure**.

    The **Configure mobile app** page appears.
    
    ![Screen that provides the QR code](./media/microsoft-authenticator-app-how-to/auth-app-barcode.png)

3. Open the Microsoft Authenticator app, select **Add account** from the **Customize and control** icon in the upper-right, and then select **Work or school account**.

5. In the QR scanner screen, select **Enter code manually**.

    ![Screen for scanning a QR code](./media/microsoft-authenticator-app-how-to/auth-app-manual-code.png)
   
6. Type the code and URL from the screen with the QR code into the **Add an account** screen, and then select **Finish**.

    ![Screen for entering code and URL](./media/microsoft-authenticator-app-how-to/auth-app-code-url.png)

    The **Accounts** screen of the app shows you your account name and a six-digit verification code. For additional security, the verification code changes every 30 seconds preventing you from using the same code twice.

## To manually add a personal, non-Microsoft account
[STEPS]

## Next steps

- After you add your accounts to the app, you can sign in using the Authenticator app on your device. For more information, see [Sign in using the app](microsoft-authenticator-app-phone-signin-faq.md).

- For devices running iOS, you can also back up your account credentials and related app settings, such as the order of your accounts, to the cloud. For more information, see [Backup and recover with Microsoft Authenticator app](microsoft-authenticator-app-backup-and-recovery.md).

- If you want more information about security info, see [Manage your security info](security-info-manage-settings.md)