---
title: Backup and recover accounts with the Microsoft Authenticator app - Azure AD
description: Learn how to back up and recover your backed up account credentials, using the Microsoft Authenticator app.
services: active-directory
author: eross-msft
manager: daveba

ms.subservice: user-help
ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 08/22/2019
ms.author: lizross
ms.reviewer: olhaun
---

# Backup and recover account credentials using the Microsoft Authenticator app

**Applies to:**

- iOS devices, running version 5.7.0 and later

- Android devices, running version 6.6.0 and later

The Microsoft Authenticator app backs up your account credentials and related app settings, such as the order of your accounts, to the cloud. After backup, you can also use the app to recover your information on a new device, potentially avoiding getting locked out or having to recreate accounts.

Each backup storage location requires you to have one personal Microsoft account, while iOS also requires you to have an iCloud account. You can have multiple accounts stored in that single location. For example, you can have a personal account, a work or school account, and a personal, non-Microsoft account like for Facebook, Google, and so on.

> [!IMPORTANT]
> Only your personal and 3rd-party account credentials are stored, which includes your username and the account verification code that’s required to prove your identity. We don’t store any other information associated with your accounts, including emails or files. We also don’t associate or share your accounts in any way or with any other product or service. And finally, your IT admin won’t get any information about any of these accounts.

## Back up your account credentials

Before you can back up your credentials, you must have:

- A personal [Microsoft account](https://account.microsoft.com/account) to act as your recovery account.

- **For iOS only,** you must have an [iCloud account](https://www.icloud.com/) for the actual storage location.

### To turn on cloud backup for iOS devices

- On your iOS device, select **Settings**, select **Backup**, and then turn on **iCloud backup**.

    Your account credentials are backed up to your iCloud account.

    ![iOS settings screen, showing the location of the iCloud backup settings](./media/user-help-auth-app-backup-recovery/backup-and-recovery-turn-on.png)

### To turn on cloud backup for Android devices

- On your Android device, select **Settings**, select **Backup**, and then turn on **Cloud backup**.

    Your account credentials are backed up to your cloud account.

    ![Android settings screen, showing the location of the backup settings](./media/user-help-auth-app-backup-recovery/backup-and-recovery-turn-on-android.png)

## Recover your account credentials on your new device

You can recover your account credentials from your cloud account, but you must first make sure that the account you're recovering doesn't exist in the Microsoft Authenticator app. For example, if you're recovering your personal Microsoft account, you must make sure you don't have a personal Microsoft account already set up in the authenticator app. This check is important so we can be sure we're not overwriting or erasing an existing account by mistake.

### To recover your information

1. On your mobile device, open the Microsoft Authenticator app, and select **Begin recovery** from the bottom of the screen.

    ![Microsoft Authenticator app, showing where to click Begin recovery](./media/user-help-auth-app-backup-recovery/backup-and-recovery-begin-recovery.png)

2. Sign in to your recovery account, using the same personal Microsoft account you used during the backup process.

    Your account credentials are recovered to the new device.

After you finish your recovery, you might notice that your personal Microsoft account verification codes in the Microsoft Authenticator app are different between your old and new phones. The codes are different because each device has its own unique credential, but both are valid and work while signing in using the associated phone.

## Recover additional accounts requiring more verification

If you use push notifications with your personal or work or school accounts, you'll get an on-screen alert that says you must provide additional verification before you can recover your information. Because push notifications require using a credential that’s tied to your specific device and never sent over the network, you must prove your identity before the credential is created on your device.

For personal Microsoft accounts, you can prove your identity by entering your password along with an alternate email or phone number. For work or school accounts, you must scan a QR code given to you by your account provider.

### To provide additional verification for personal accounts

1. In the **Accounts** screen of the Microsoft Authenticator app, select the drop-down arrow next to the account you want to recover.

    ![Microsoft Authenticator app, showing the available accounts with their associated drop-down arrows](./media/user-help-auth-app-backup-recovery/backup-and-recovery-arrow.png)

2. Select **Sign in to recover**, type your password, and then confirm your email address or phone number as additional verification.

    ![Microsoft Authenticator app, allowing you to enter your sign-in info](./media/user-help-auth-app-backup-recovery/backup-and-recovery-sign-in.png)

### To provide additional verification for work or school accounts

1. In the **Accounts** screen of the Microsoft Authenticator app, select the drop-down arrow next to the account you want to recover.

    ![Microsoft Authenticator app, showing the available accounts with their associated drop-down arrows](./media/user-help-auth-app-backup-recovery/backup-and-recovery-additional-accts.png)

2. Select **Scan QR code to recover**, and then scan the QR code.

    ![Microsoft Authenticator app, allowing you to scan your QR code](./media/user-help-auth-app-backup-recovery/backup-and-recovery-scan-qr-code.png)

    >[!NOTE]
    >For more info about QR codes and how to get one, see [Get started with the Microsoft Authenticator app](https://docs.microsoft.com/azure/active-directory/user-help/user-help-auth-app-download-install) or [Set up security info to use an authenticator app](https://docs.microsoft.com/azure/active-directory/user-help/security-info-setup-auth-app), based on whether your admin has turned on security info.
    >
    >If this is the first time you're setting up the Microsoft Authenticator app, you might receive a prompt asking whether to allow the app to access your camera (iOS) or to allow the app to take pictures and record video (Android). You must select **Allow** so the authenticator app can access your camera to take a picture of the QR code in the next step. If you don't allow the camera, you can still set up the authenticator app, but you'll need to add the code information manually. For information about how to add the code manually, see see [Manually add an account to the app](user-help-auth-app-add-account-manual.md).

## Troubleshoot backup and recovery problems

There are a few reasons why your backup might not be available:

- **Changing operating systems.** Your backup is stored in the iCloud for iOS and in Microsoft's cloud storage provider for Android. This means that your backup is unavailable if you switch between Android and iOS devices. If you make the switch, you must manually recreate your accounts within the Microsoft Authenticator app.

- **Network problems.** If you're experiencing network-related problems, make sure you're connected to the network and properly signed in to your account.

- **Account problems.** If you're experiencing account-related problems, make sure that you're properly signed in to your account. For iOS this means that you must be signed into iCloud using the same AppleID account as your iPhone.

- **Accidental deletion.** It’s possible that you deleted your backup account from your previous device or while managing your cloud storage account. In this situation, you must manually recreate your account within the app.

- **Existing Microsoft Authenticator accounts.** If you've already set up accounts in the Microsoft Authenticator app, the app won't be able to recover your backed-up accounts. Preventing recovery helps ensure that your account details aren't overwritten with out-of-date information. In this situation, you must remove any existing account information from the existing accounts set up in your Authenticator app before you can recover your backup.

- **Backup is out-of-date.** If your backup information is out-of-date, you might be asked to refresh the information by signing in to your Microsoft Recovery account again. Your recovery account is the personal Microsoft account you used initially to store your backup. If a sign-in is required, you’ll see a red dot on your menu or action bar. After you select the red dot, you’ll be prompted to sign in again to update your information.

## Next steps

Now that you've backed up and recovered your account credentials to your new device, you can continue to use the Microsoft Authenticator app to verify your identity. For more information, see [Sign in to your accounts using the Microsoft Authenticator app](user-help-sign-in.md).

## Related articles

- [What is the Microsoft Authenticator app?](user-help-auth-app-overview.md)

- [Microsoft Authenticator app FAQ](user-help-auth-app-faq.md)

- [Multi-factor Authentication](https://docs.microsoft.com/azure/multi-factor-authentication/)
