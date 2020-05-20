---
title: Add non-Microsoft accounts to the Microsoft Authenticator app - Azure AD
description: Add non-Microsoft accounts, such as for Google or Facebook to the Microsoft Authenticator app to verify your identity while using two-factor verification.
services: active-directory
author: curtand
manager: daveba

ms.service: active-directory
ms.workload: identity
ms.subservice: user-help
ms.topic: end-user-help
ms.date: 01/24/2019
ms.author: curtand
ms.reviewer: olhaun
---

# Add non-Microsoft accounts to the Microsoft Authenticator app

Add your non-Microsoft accounts, such as for Google, Facebook, or GitHub to the Microsoft Authenticator app for two-factor verification. The Microsoft Authenticator app works with any app that uses two-factor verification and any account that supports the time-based one-time password (TOTP) standards.

>[!Important]
>Before you can add your account, you must download and install the Microsoft Authenticator app. If you haven't done that yet, follow the steps in the [Download and install the app](user-help-auth-app-download-install.md) article.

## Add personal accounts

Generally, for all your personal accounts, you must:

1. Sign in to your account, and then turn on two-factor verification using either your device or your computer.

2. Add the account to the Microsoft Authenticator app. You might be asked to scan a QR code as part of this process.

    >[!Note]
    >If this is the first time you're setting up the Microsoft Authenticator app, you might receive a prompt asking whether to allow the app to access your camera (iOS) or to allow the app to take pictures and record video (Android). You must select **Allow** so the authenticator app can access your camera to take a picture of the QR code in the next step. If you don't allow the camera, you can still set up the authenticator app, but you'll need to add the code information manually. For information about how to add the code manually, see see [Manually add an account to the app](user-help-auth-app-add-account-manual.md).

We're providing the process here for your Facebook, Google, GitHub, and Amazon accounts, but this process is the same for any other app, such as Instagram, Netflix, or Adobe.

## Add your Google account

Add your Google account by turning on two-factor verification and then adding the account to the app.

### Turn on two-factor verification

1. On your computer, go to https://myaccount.google.com/signinoptions/two-step-verification/enroll-welcome, select **Get Started**, and then verify your identity.

2. Follow the on-page steps to turn on two-step verification for your personal Google account.

### Add your Google account to the app

1. On the Google page on your computer, go to the **Set up alternative second step** section, choose **Set up** from the **Authenticator app** section.

2. On the **Get codes from the Authenticator app** page, select either **Android** or **iPhone** based on your phone type, and then select **Next**.

    You're given a QR code that you can use to automatically associate your account with the Microsoft Authenticator app. Do not close this window.

3. Open the Microsoft Authenticator app, select **Add account** from the **Customize and control** icon in the upper right, and then select **Other account (Google, Facebook, etc.)**.

4. Use your device's camera to scan the QR code from the **Set up Authenticator** page on your computer.

    >[!Note]
    >If your camera isn't working properly, you can enter the QR code and URL manually.

5. Review the **Accounts** page of the Microsoft Authenticator app on your device, to make sure your account information is right and that there's an associated six-digit verification code.

    For additional security, the verification code changes every 30 seconds preventing someone from using a code multiple times.

6. Select **Next** on the **Set up Authenticator** page on your computer, type the six-digit verification code provided in the app for your Google account, and then select **Verify**.

7. Your account is verified, and you can select **Done** to close the **Set up Authenticator** page.

    >[!NOTE]
    >For more information about two-factor verification and your Google account, see [Turn on 2-Step Verification](https://support.google.com/accounts/answer/185839) and [Learn more about 2-Step Verification](https://www.google.com/landing/2step/help.html).

## Add your Facebook account

Add your Facebook account by turning on two-factor verification and then adding the account to the app.

### Turn on two-factor verification

1. On your computer, open Facebook, select the drop-down menu in the top-right corner, and then go to **Settings** > **Security and Login**.

    The **Security and Login** page appears.

2. Go down to the **Use two-factor authentication** option in the **Two-Factor Authentication** section, and then select **Edit**.

    The **Two-Factor Authentication** page appears.

3. Select **Turn On**.

### Add your Facebook account to the app

1. On the Facebook page on your computer, go to the **Add a backup** section, and then choose **Setup** from the **Authentication app** area.

    You're given a QR code that you can use to automatically associate your account with the Microsoft Authenticator app. Do not close this window.

2. Open the Microsoft Authenticator app, select **Add account** from the **Customize and control** icon in the upper right, and then select **Other account (Google, Facebook, etc.)**.

3. Use your device's camera to scan the QR code from the **Two factor authentication** page on your computer.

    >[!Note]
    >If your camera isn't working properly, you can enter the QR code and URL manually.

4. Review the **Accounts** page of the Microsoft Authenticator app on your device, to make sure your account information is right and that there's an associated six-digit verification code.

    For additional security, the verification code changes every 30 seconds preventing someone from using a code multiple times.

5. Select **Next** on the **Two factor authentication** page on your computer, and then type the six-digit verification code provided in the app for your Facebook account.

    Your account is verified, and you can now use the app to verify your account.

    >[!NOTE]
    >For more information about two-factor verification and your Facebook account, see [What is two-factor authentication and how does it work?](https://www.facebook.com/help/148233965247823).

## Add your GitHub account

Add your GitHub account by turning on two-factor verification and then adding the account to the app.

### Turn on two-factor verification

1. On your computer, open GitHub, select your image from top-right corner, and then select **Settings**.

    The **Two-factor authentication** page appears.

2. Select **Security** from the **Personal settings** sidebar, and then select **Enable two-factor authentication** from the **Two-factor authentication** area.

### Add your GitHub account to the app

1. On the **Two-factor authentication** page on your computer, select **Set up using an app**.

2. Save your recovery codes so you can get back into your account if you lose access, and then select **Next**. 

    You can save your codes by downloading them to your device, by printing a hard copy, or by copying them into a password manager tool.

3. On the **Two-factor authentication** page, select **Set up using an app**.

    The page changes to show you a QR code. Do not close this page.

4. Open the Microsoft Authenticator app, select **Add account** from the **Customize and control** icon in the upper right, select **Other account (Google, Facebook, etc.)**, and then select **enter this text code** from the text at the top of the page.

    The Microsoft Authenticator app is unable to scan the QR code, so you must manually enter the code.

5. Enter an **Account name** (for example, GitHub) and type the **Secret key** from Step 4, and then select **Finish**.

6. On the **Two-factor authenticator** page on your computer, type the six-digit verification code provided in the app for your GitHub account, and then select **Enable**.

    The **Accounts** page of the app shows you your account name and a six-digit verification code. For additional security, the verification code changes every 30 seconds preventing someone from using a code multiple times.

    >[!NOTE]
    >For more information about two-factor verification and your GitHub account, see [About two-factor authentication](https://help.github.com/articles/about-two-factor-authentication/).

## Add your Amazon account

Add your Amazon account by turning on two-factor verification and then adding the account to the app.

### Turn on two-factor verification

1. On your computer, open Amazon, select the **Account & Lists** drop-down menu, and then select **Your Account**.

2. Select **Login & security**, sign in to your Amazon account, and then select **Edit** in the **Advanced Security Settings** area.

    The **Advanced Security Settings** page appears.

3. Select **Get Started**.

4. Select **Authenticator App** from the **Choose how you'll receive codes** page.

    The page changes to show you a QR code. Do not close this page.

5. Open the Microsoft Authenticator app, select **Add account** from the **Customize and control** icon in the upper right, and then select **Other account (Google, Facebook, etc.)**.

6. Use your device's camera to scan the QR code from the **Choose how you'll receive codes** page on your computer.

    >[!Note]
    >If your camera isn't working properly, you can enter the QR code and URL manually.

7. Review the **Accounts** page of the Microsoft Authenticator app on your device, to make sure your account information is right and that there's an associated six-digit verification code.

    For additional security, the verification code changes every 30 seconds preventing someone from using a code multiple times.

8. On the **Choose how you'll receive codes** page on your computer, type the six-digit verification code provided in the app for your Amazon account, and then select **Verify code and continue**.

9. Complete the rest of the sign-up process, including adding a backup verification method such as a text message, and then select **Send code**.

10. On the **Add a backup verification method** page on your computer, type the six-digit verification code provided by your backup verification method for your Amazon account, and then select **Verify code and continue**.

11. On the **Almost done** page, decide whether to make your computer a trusted device, and then select **Got it. Turn on Two-Step Verification**.

    The **Advanced Security Settings** page appears, showing your updated two-factor verification details.

    >[!NOTE]
    >For more information about two-factor verification and your Amazon account, see [About Two-Step Verification](https://www.amazon.com/gp/help/customer/display.html?nodeId=201596330) and [Signing in with Two-Step Verification](https://www.amazon.com/gp/help/customer/display.html?nodeId=201962440).

## Next steps

- After you add your accounts to the app, you can sign in using the Authenticator app on your device. For more information, see [Sign in using the app](user-help-auth-app-sign-in.md).

- For devices running iOS, you can also back up your account credentials and related app settings, such as the order of your accounts, to the cloud. For more information, see [Backup and recover with Microsoft Authenticator app](user-help-auth-app-backup-recovery.md).
