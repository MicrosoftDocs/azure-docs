---
title: Get started with the Microsoft Authenticator app - Azure Active Directory | Microsoft Docs
description: Learn how to download, install, and use the Microsoft Authenticator app for two-factor verification.
services: active-directory
author: eross-msft
manager: mtillman
ms.assetid: 3065a1ee-f253-41f0-a68d-2bd84af5ffba

ms.service: active-directory
ms.workload: identity
ms.component: user-help
ms.topic: conceptual
ms.date: 11/26/2018
ms.author: lizross
ms.reviewer: librown
---

# Get started with the Microsoft Authenticator app
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

## Install the app
Install the latest version of the Microsoft Authenticator app, based on your operating system:

- **Android.** On your Android device, go to [Google Play to download and install the Microsoft Authenticator app](https://play.google.com/store/apps/details?id=com.azure.authenticator).

- **iOS.** On your Apple iOS device, go to the [App Store to download and install the Microsoft Authenticator app](https://itunes.apple.com/app/microsoft-authenticator/id983156458).

- **Windows Phone.** On your Windows Phone, go to the [Microsoft Store to download and install the Microsoft Authenticator app](https://www.microsoft.com/en-us/p/microsoft-authenticator/9nblgggzmcj6).

## Add your accounts
You can add your work or school accounts and your personal accounts to the Microsoft Authenticator app.

>[!Important]
>Before you can add your account, you have to download and install the Microsoft Authenticator app. If you haven't done that yet, follow the steps in the [Install the app](#install-the-app) section of this article.

### To add a work or school account
You can add your work or school account, given to you by your organization.

1. On your PC, go to the [Additional security verification](https://aka.ms/mfasetup) page.

    >[!Note]
    >If you don't see the **Additional security verification** page, it's possible that your administrator has turned on the security info preview experience. If that's the case, you should follow the instructions in the [Set up security info to use an authenticator app](security-info-setup-auth-app.md) section. If that's not the case, you will need to contact your organization's Help Desk for assistance.

2. Check the box next to **Authenticator app**, and then select **Configure**.

    The **Configure mobile app** page appears.
    
    ![Screen that provides the QR code](./media/microsoft-authenticator-app-how-to/auth-app-barcode.png)

3. Open the Microsoft Authenticator app, select **Add account** from the **Customize and control** icon in the upper-right, and then select **Work or school account**.

4. Use your device's camera to scan the QR code from the **Configure mobile app** screen on your PC, and then choose **Done**.

    >[!Note]
    >If your camera isn't working properly, you can [enter the QR code and URL manually](#add-an-account-to-the-app-manually).

5. Review the **Accounts** screen of the app on your device, to make sure your account is right and that there's an associated six-digit verification code. For additional security, the verification code changes every 30 seconds preventing you from using the same code twice.

    ![Accounts screen](./media/microsoft-authenticator-app-how-to/auth-app-accounts.png)

### To add a personal Microsoft account
You can add your personal Microsoft accounts, such as for outlook.com, Xbox LIVE, OneDrive, and so on.

1. On your PC, go to your [Security basics](https://account.microsoft.com/security) page and sign-in using your personal Microsoft account.

2. At the bottom of the **Security basics** page, choose the **More security options** link.

3. Go to the **Two-step verification** section and choose to turn the feature **On**. You can also turn it off here if you no longer want to use it with your personal account.

4. Open the Microsoft Authenticator app on your mobile device.

5. Select **Add account** from the **Customize and control** icon in the upper-right, and then select **Personal account**.

6. Enter the email address for your personal account, (such as alain@outlook.com) and then choose **Next**.

    >[!Note]
    >If you don't have a personal Microsoft account, you have the ability to create one here.

7. Enter your password, and then choose **Sign in**.

    Your account is added to the Microsoft Authenticator app.

### To add a personal Google account
You can add your personal Google account to the Microsoft Authenticator app.

1. On your PC, go to the two-step verification section of your Google account.

2. Sign in to your account and follow all of the instructions to turn on two-factor verification.

For more information about two-factor verification and your Google account, see [Turn on 2-Step Verification](https://support.google.com/accounts/answer/185839).

3. Open the Microsoft Authenticator app, select **Add account** from the **Customize and control** icon in the upper-right, and then select **Other account (Google, Facebook, etc)**.

4. Use your device's camera to scan the QR code from the account screen on your PC (for example, the **Authenticator Set up** page of your Google account or the **Add a new app** section from your Facebook account), and then choose **Done**.

    >[!Note]
    >If your camera isn't working properly, you can [enter the QR code and URL manually](#add-an-account-to-the-app-manually).

5. Review the **Accounts** screen of the app on your device, to make sure your account is right and that there's an associated six-digit verification code. For additional security, the verification code changes every 30 seconds preventing you from using the same code twice.


### To add a personal Facebook account
You can add your personal Facebook account to the Microsoft Authenticator app.


For more information about two-factor verification and your Facebook account, see [What is two-factor authentication and how does it work?](https://www.facebook.com/help/148233965247823).

### To add other non-Microsoft personal accounts

### To manually add a work or school account
If your camera is unable to capture the QR code, you can enter the information manually into the app.

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

## To sign in using the app

After you add your accounts to the app, you can use the app to sign in to your accounts.

If you chose to use verification codes in the app, you'll start to see them on the **Accounts** page. The codes change every 30 seconds so that you always have a new code when you need one. But you don't need to do anything with them until you sign in and are prompted to enter a verification code.

### Using your device's fingerprint or facial recognition capabilities

Your organization might require a PIN to complete your identity verification. You can set up the Microsoft Authenticator app to use your device's fingerprint or facial recognition capabilities instead of a PIN. You can set this up the first time you use the authenticator app to verify your account, by selecting the option to use your device biometric capabilities as identification instead of your PIN.

## Next steps

- If you have more general questions about the app, see [Microsoft Authenticator FAQs](microsoft-authenticator-app-faq.md)

- If you want more information about two-step verification, see [Set up my account for two-step verification](multi-factor-authentication-end-user-first-time.md)

- If you want more information about security info, see [Manage your security info](security-info-manage-settings.md)
