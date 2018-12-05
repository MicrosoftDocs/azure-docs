---
title: Add your work or school account to the app - Azure Active Directory | Microsoft Docs
description: How to add your work or school account to the Microsoft Authenticator app for two-factor verification.
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

# Add your work or school account
You can add your work or school account, given to you by your organization, to the Microsoft Authenticator app for two-factor verification.

>[!Important]
>Before you can add your account, you have to download and install the Microsoft Authenticator app. If you haven't done that yet, follow the steps in the [Download and install the app](microsoft-authenticator-app-how-to.md) article.

## Add your work or school account

1. On your PC, go to the [Additional security verification](https://aka.ms/mfasetup) page.

    >[!Note]
    >If you don't see the **Additional security verification** page, it's possible that your administrator has turned on the security info preview experience. If that's the case, you should follow the instructions in the [Set up security info to use an authenticator app](security-info-setup-auth-app.md) section. If that's not the case, you will need to contact your organization's Help Desk for assistance. For more information about security info, see [Manage your security info](security-info-manage-settings.md).

2. Check the box next to **Authenticator app**, and then select **Configure**.

    The **Configure mobile app** page appears.
    
    ![Screen that provides the QR code](./media/microsoft-authenticator-app-how-to/auth-app-barcode.png)

3. Open the Microsoft Authenticator app, select **Add account** from the **Customize and control** icon in the upper-right, and then select **Work or school account**.

4. Use your device's camera to scan the QR code from the **Configure mobile app** screen on your PC, and then choose **Done**.

    >[!Note]
    >If your camera is unable to capture the QR code, you can manually add your account information to the Microsoft Authenticator app for two-factor verification. For more information and how to do it, see [Manually add your account](microsoft-authenticator-app-add-account-manual.md).

5. Review the **Accounts** screen of the app on your device, to make sure your account is right and that there's an associated six-digit verification code. For additional security, the verification code changes every 30 seconds preventing you from using the same code twice.

    ![Accounts screen](./media/microsoft-authenticator-app-how-to/auth-app-accounts.png)

## Next steps

- After you add your accounts to the app, you can sign in using the Authenticator app on your device. For more information, see [Sign in using the app](microsoft-authenticator-app-sign-in.md).

- For devices running iOS, you can also back up your account credentials and related app settings, such as the order of your accounts, to the cloud. For more information, see [Backup and recover with Microsoft Authenticator app](microsoft-authenticator-app-backup-and-recovery.md).