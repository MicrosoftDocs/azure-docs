---
title: Questions & answers about Microsoft Authenticator app - Azure AD
description: Frequently asked questions and answers (FAQs) about the Microsoft Authentication app and two-factor verification.
services: active-directory
author: curtand
manager: daveba
ms.assetid: f04d5bce-e99e-4f75-82d1-ef6369be3402

ms.service: active-directory
ms.workload: identity
ms.subservice: user-help
ms.topic: end-user-help
ms.date: 06/21/2021
ms.author: curtand
ms.reviewer: olhaun
---

# Frequently asked questions (FAQ) about the Microsoft Authenticator app

This article answers common questions about the Microsoft Authenticator app. If you don't see an answer to your question, go to the [Microsoft Authenticator app forum](https://social.technet.microsoft.com/Forums/en-US/home?forum=MicrosoftAuthenticatorApp).

The Microsoft Authenticator app replaced the Azure Authenticator app, and it's the recommended app when you use Azure AD Multi-Factor Authentication. The Microsoft Authenticator app is available for [Android](https://app.adjust.com/e3rxkc_7lfdtm?fallback=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.azure.authenticator) and [iOS](https://app.adjust.com/e3rxkc_7lfdtm?fallback=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fmicrosoft-authenticator%2Fid983156458).

## Frequently asked questions

### Permission to access your location

**Q**: I got a prompt asking me to grant permission for the app to access my location. Why am I seeing this?

**A**: You will see a prompt from Microsoft Authenticator asking for access to your location if your IT admin has created a policy requiring you to share your GPS location before you are allowed to access specific resources. You’ll need to share your location once every hour to ensure you are still within a country where you are allowed to access the resource.

On iOS, Microsoft recommends allowing the app to access location always. Follow the iOS prompts to grant that permission. Here’s what each permission level will mean for you:

- **Allow while using the app**: If you choose this option, you’ll be prompted to select two more options.
- **Always allow (recommended)**: While you’re still accessing the protected resource, for the next 24 hours, your location will be shared silently once per hour from the device, so you will not need to get out your phone and manually approve each hour.
- **Keep only while using**: While you’re still accessing the protected resource, every hour, you’ll need to pull out your device and manually approve the request.
- **Allow once**: Once every hour that you’re still accessing the resource, or next time you try to access the resource, you’ll need to grant permission again. You will need to go to Settings and manually enable the permission. 
- **Don’t allow**: If you select this option, you’ll be blocked from accessing the resource. If you change your mind, you will need to go to Settings and manually enable the permission.

On Android, Microsoft recommends allowing the app to access location all the time. Follow the Android prompts to grant that permission. Here’s what each permission level will mean for you:

- **Allow all the time (recommended)**: While you’re still accessing the protected resource, for the next 24 hours, your location will be shared silently once per hour from the device, so you will not need to get out your phone and manually approve each hour.
- **Allow only while using the app**: While you’re still accessing the protected resource, every hour, you’ll need to pull out your device and manually approve the request.
- **Deny and don’t ask again**: If you select this option, you’ll be blocked from accessing the resource.

**Q**: How is my location information used and stored?

**A**: The Authenticator app collects your GPS information to determine what country you are located in. The country name and location coordinates are sent back to the system to determine if you are allowed to access the protected resource. The country name is stored and reported back to your IT admin, but your actual coordinates are never saved or stored on Microsoft servers.

### Notification blocks sign-in

**Q**: I’m trying to sign in and I need to select the number in my app that’s displayed on the sign- in screen. However, the notification prompt from Authenticator is blocking the sign-in screen. What do I do?  

**A**: Select the “Hide” option on the notification so you can see the sign-in screen and the number you need to select. The prompt will reappear after 5 seconds, and you can select the correct number then.

### Registering a device

**Q**: Is registering a device agreeing to give the company or service access to my device?

**A**: Registering a device gives your device access to your organization's services and doesn't allow your organization access to your device.

### Error adding account

**Q**: When I try to add my account, I get an error message saying “The account you're trying to add is not valid at this time. Contact your admin to fix this issue (uniqueness validation).” What should I do?

**A**: Reach out to your admin and let them know you’re prevented from adding your account to Authenticator because of a uniqueness validation issue. You’ll need to provide your sign-in username so that your admin can look you up in your organization.

### Legacy APNs support deprecated

**Q**: Because the legacy binary interface for Apple Push Notification service is being deprecated in November 2020, how can I continue to use Microsoft Authenticator/Phone Factor to sign-in?

**A**: [Apple announced deprecation](https://developer.apple.com/news/?id=11042019a) of push notifications that use its binary interface for iOS devices, such as those used by Phone Factor. To continue to receive push notifications, we recommend that users update their Authenticator app to the latest version of the app. In the meantime, you can work around it by manually checking for notifications in the Authenticator app.

### App Lock feature

**Q**: What is App Lock, and how can I use it to help to keep me more secure?

**A**: App Lock helps keep your one-time verification codes, app information, and app settings more secure. When App Lock is enabled, you’ll be asked to authenticate using your device PIN or biometric every time you open Authenticator. App Lock also helps ensure that you’re the only one who can approve notifications by prompting for your PIN or biometric any time you approve a sign-in notification. You can turn App Lock on or off on the Authenticator Settings page. By default, App Lock is turned on when you set up a PIN or biometric on your device.<br><br>Unfortunately, there's no guarantee that App Lock will stop someone from accessing Authenticator. That's because device registration can happen in other locations outside of Authenticator, such as in Android account settings or in the Company Portal app.

### Windows Mobile retired

**Q**: I have a Windows Mobile device, and the Microsoft Authenticator on Windows Mobile has been deprecated. Can I continue authenticating using the app?

**A**: All authentications using the Microsoft Authenticator on Windows Mobile will be retired after July 15, 2020. We strongly recommend that you use an alternate authentication method to avoid being locked out of your accounts.<br>Alternate options for enterprise users include:<br><ul><li>Setting up the Microsoft Authenticator for [Android](https://play.google.com/store/apps/details?id=com.azure.authenticator) or [iOS](https://apps.apple.com/app/microsoft-authenticator/id983156458).</li><li>[Setting up SMS](multi-factor-authentication-setup-phone-number.md) to receive verification codes.</li><li>Setting up phone number to receive [phone calls to verify their identity](multi-factor-authentication-setup-office-phone.md).</li></ul><br>Alternate options for personal Microsoft account users include:<br><ul><li>Setting up the Microsoft Authenticator for [Android](https://play.google.com/store/apps/details?id=com.azure.authenticator) or [iOS](https://apps.apple.com/app/microsoft-authenticator/id983156458).</li><li>Setting up an alternate sign-in method (SMS or email) by updating your security info from the [Microsoft Account Security page](https://account.microsoft.com/security/).</li></ul>

### Android screenshots

**Q**: Can I take screenshots of my one-time password (OTP) codes on the Android Authenticator?

**A**: Beginning with release 6.2003.1704 of Authenticator Android, by default all OTP codes are hidden anytime a screenshot of Authenticator is taken. If you want to see your OTP codes in screenshots or allow other apps to capture the Authenticator screen, you can. Just turn on the **Screen Capture** setting in Authenticator and restart the app.

### Delete stored data

**Q**: What data does the Authenticator store on my behalf and how can I delete it?

**A**: The Authenticator app collects three types of information:

- Account info you provide when you add your account. After adding your account, depending on the features you enable for the account, your account data might sync down to the app. This data can be removed by removing your account.
- Diagnostic log data that stays only in the app until you **Send feedback** in the app's top menu to send logs to Microsoft. These logs can contain personal data such as email addresses, server addresses, or IP addresses. They also can contain device data such as device name and operating system version. Any personal data collected is limited to info needed to help troubleshoot app issues. You can browse these log files in the app at any time to see the info being gathered. If you send your log files, Authentication app engineers will use them only to troubleshoot customer-reported issues.
- Non-personally identifiable usage data, such "started add account flow/successfully added account," or "notification approved." This data is an integral part of our engineering decisions. Your usage helps us determine where we can improve the apps in ways that are important to you. You see a notification of  this data collection when you use the app for the first time. It informs you that it can be turned off on the app's **Settings** page. You can turn this setting on or off at any time.

### Codes in the app

**Q**: What are the codes in the app for?

**A**: When you open Authenticator, you'll see your added accounts as tiles. Your work or school accounts and your personal Microsoft accounts will have six or eight digit numbers visible in the full screen view of the account (accessed by tapping the account tile). For other accounts, you’ll see a six or eight digit number in the **Accounts** page of the app.<br>You'll use these codes as single-use password to verify that you are who you say you are. After you sign in with your username and password, you'll type in the verification code that's associated with that account. For example, if you're Katy signing in to your Contoso account, you'd tap the account tile and then use the verification code 895823. For the Outlook account, you’d follow the same steps.<br>Tap the Contoso account tile.<br>![Account tiles in the Authenticator app](media/user-help-auth-app-faq/katy-signin.png)<br>After you tap the Contoso account tile, the verification code is visible in full screen.<br>![Verification code in the account tile in Authenticator](media/user-help-auth-app-faq/verification-code.png)

### Countdown timer

**Q**: Why does the number next to the code keep counting down?

**A**: You might see a 30-second timer counting down next to your active verification code. This timer is so that you never sign in using the same code twice. Unlike a password, we don't want you to remember this number. The idea is that only someone with access to your phone knows your code.

### Grayed account tile

**Q**: Why is my account tile gray?

**A**: Some organizations require Authenticator to work with single sign-on and to protect organizational resources. In this situation, the account isn't used for two-step verification and shows up as gray or inactive. This type of account is frequently called a "broker" account.

### Device registration

**Q**: What is device registration?

**A**: Your org might require you to register the device to track access to secured resources, such as files and apps. They also might turn on Conditional Access to reduce the risk of unwanted access to those resources. You can unregister your device in **Settings**, but you may lose access to emails in Outlook, files in OneDrive, and you'll lose the ability to use phone sign-in.

### Verification codes when connected

**Q**: Do I need to be connected to the Internet or my network to get and use the verification codes?

**A**: The codes don't require you to be on the Internet or connected to data, so you don't need phone service to sign in. Additionally, because the app stops running as soon as you close it, it won't drain your battery.

### No notifications when app is closed

**Q**: Why do I only get notifications when the app is open? When the app is closed, I don't get notifications.

**A**: If you're getting notifications, but not an alert, even with your ringer on, you should check your app settings. Make sure the app is turned on to use sound or to vibrate for notifications. If you don't get notifications at all, you should check the following conditions:<ul><li>Is your phone in Do Not Disturb or Quiet mode? These modes can prevent apps from sending notifications.</li><li>Can you get notifications from other apps? If not, it could be a problem with the network connections on your phone, or the notifications channel from Android or Apple. You can try to resolve your network connections through your phone settings. You might need to talk to your service provider to help with the Android or Apple notifications channel.</li><li>Can you get notifications for some accounts on the app, but not others? If yes, remove the problematic account from your app, add it again allowing notifications, and see if that fixes the problem.</li></ul>If you tried all of these steps and are still having issues, we recommend sending your log files for diagnostics. Open the app, go to app’s top-level menu, and then select **Send feedback**. After that, go to the [Microsoft Authenticator app forum](https://social.technet.microsoft.com/Forums/en-US/home?forum=MicrosoftAuthenticatorApp) and tell Microsoft the problem you're seeing and the steps you tried.

### Switch to push notifications

**Q**: I'm using the verification codes in the app, but how do I switch to the push notifications?

**A**: You can set up notifications for your work or school account (if allowed by your administrator) or for your personal Microsoft account. Notifications won't work for third-party accounts, like Google or Facebook.<br>To switch your personal account over to notifications, you'll have to re-register your device with the account. Go to **Add Account**, select **Personal Microsoft Account**, and then sign in using your username and password.<br>For your work or school account, your organization decides whether or not to allow one-click notifications.

### Notifications for other accounts

**Q**: Do notifications work for non-Microsoft accounts?

**A**: No, notifications only work with Microsoft accounts and Azure Active Directory accounts. If your work or school uses Azure AD accounts, they are able to turn off this feature.

### Backup and recovery

**Q**: I got a new device or restored my device from a backup. How do I set up my accounts in Authenticator again?

**A**: If you turned on **Cloud Backup** on your old device, you can use your old backup to recover your account credentials on your new iOS or an Android device. For more info, see the [Backup and recover account credentials with Authenticator](user-help-auth-app-backup-recovery.md) article.

### Lost device

**Q**: I lost my device or moved on to a new device. How do I make sure notifications don't continue to go to my old device?

**A**: Adding Authenticator to your new device doesn't automatically remove the app from your old device. Even deleting the app from your old device isn't enough. You must both delete the app from your old device AND tell Microsoft or your organization to forget and unregister the old device.<ul><li>**To remove the app from a device using a personal Microsoft account.** Go to the two-step verification area of your [Account Security](https://account.microsoft.com/security) page and choose to turn off verification for your old device.</li><li>**To remove the app from a device using a work or school Microsoft account.** Go to the two-step verification area of either your [MyApps page](https://myapps.microsoft.com/) or your organization's custom portal to turn off verification for your old device.</li></ul>

### Remove account from app

**Q**:How do I remove an account from the app?

**A**: Tap the account tile for the account you’d like to remove from the app to view the account full screen. Tap **Remove account** to remove the account from the app.<br>If you have a device that is registered with your organization, you might need an extra step to remove your account. On these devices, Authenticator is automatically registered as a device administrator. If you want to completely uninstall the app, you need to first unregister the app in the app settings.

### Too many permissions

**Q**: Why does the app request so many permissions?

**A**: Here's the full list of permissions that might be asked for, and how they're used by the app. The specific permissions you see will depend on the type of phone you have.<ul><li>**Location**. Sometimes your organization wants to know your location before allowing you to access certain resources. The app will request this permission only if your organization has a policy requiring location.</li><li>**Use biometric hardware.** Some work and school accounts require an additional PIN whenever you verify your identity. The app requires your consent to use biometric or facial recognition instead of entering the PIN.</li><li>**Camera.** Used to scan QR codes when you add a work, school, or non-Microsoft account.</li><li>**Contacts and phone.** The app requires this permission to search for work or school Microsoft accounts on your phone and add them to the app for you.</li><li>**SMS.** Used to make sure your phone number matches the number on record when you sign in with your personal Microsoft account for the first time. We send a text message to the phone on which you installed the app that includes a 6-8 digit verification code. You don't need to find this code and enter it because Authenticator finds it automatically in the text message.</li><li>**Draw over other apps.** The notification you get that verifies your identity is also displayed on any other running app.</li><li>**Receive data from the internet.** This permission is required for sending notifications.</li><li>**Prevent phone from sleeping.** If you register your device with your organization, your organization can change this policy on your phone.</li><li>**Control vibration.** You can choose whether you would like a vibration whenever you receive a notification to verify your identity.</li><li>**Use fingerprint hardware.** Some work and school accounts require an additional PIN whenever you verify your identity. To make the process easier, we allow you to use your fingerprint instead of entering the PIN.</li><li> **View network connections.** When you add a Microsoft account, the app requires network/internet connection.</li><li>**Read the contents of your storage**. This permission is only used when you report a technical problem through the app settings. Some information from your storage is collected to diagnose the issue.</li><li>**Full network access.** This permission is required for sending notifications to verify your identity.</li><li>**Run at startup.** If you restart your phone, this permission ensures that you continue you receive notifications to verify your identity.</li></ul>

### Approve requests without unlocking

**Q**: Why does Authenticator allow you to approve a request without unlocking the device?

**A**: You don't have to unlock your device to approve verification requests because all you need to prove is that you have your phone with you. Two-step verification requires proving two things--a thing you know, and a thing you have. The thing you know is your password. The thing you have is your phone (set up with Authenticator and registered as a multi-factor authentication proof.) Therefore, having the phone and approving the request meets the criteria for the second factor of authentication.

### Activity notifications

**Q**: Why am I getting notifications about my account activity?

**A**: Activity notifications are sent to Authenticator immediately whenever a change is made to your personal Microsoft accounts, helping to keep you more secure. We previously sent these notifications only through email and SMS. For more information about these activity notifications, see [What happens if there's an unusual sign-in to your account](https://support.microsoft.com/help/13967/microsoft-account-unusual-sign-in). To change where you receive your notifications, sign in to the [Where can we contact you with non-critical account alerts](https://account.live.com/SecurityNotifications/Update) page of your account.

### One-time passcodes

**Q**: My one-time passcodes are not working. What should I do?

**A**: Make sure the date and time on your device are correct and are being automatically synced. If the date and time is wrong, or out of sync, the code won't work.

### Windows 10 Mobile

**Q**: The Windows 10 Mobile operating system was deprecated December 2019. Will the Microsoft Authenticator on Windows Mobile operating systems be deprecated as well?

**A**: Authenticator on all Windows Mobile operating systems will not be supported after Feb 28, 2020. Users will not be eligible for receiving any new updates to the app post the aforementioned date. After Feb 28, 2020 Microsoft services that currently support authentications using the Microsoft Authenticator on all Windows Mobile operating systems will begin to retire their support. In order to authenticate into Microsoft services, we strongly encourage all our users to switch to an alternate authentication mechanism prior to this date.

### Default mail app

**Q**: While signing in to my work or school account using the default mail app that comes with iOS, I get prompted by Authenticator for my security verification information. After I enter that information and return to the mail app, I get an error. What can I do?

**A**: This most-likely happens because your sign-in and your mail app are occurring across two different apps, causing the initial background sign-in process to stop working and to fail. To try to fix this, we recommend you select the **Safari** icon on the bottom right side of the screen while signing in to your mail app. By moving to Safari, the whole sign-in process happens in a single app, allowing you to sign in to the app successfully.

### Apple Watch watchOS 7

**Q**: Why I am having issues with Apple Watch on watchOS 7?

**A**: Sometimes, approving or denying a session on watchOS 7 fails with the error message "Failed to communicate with the phone. Make sure to keep your Watch screen awake during future requests. See the FAQs for more info.". There is a known issue with notifications when app lock is enabled or when number matching is required, and we’re working with Apple to get this fixed. In the meantime, any notifications that require the Microsoft Authenticator watchOS app should be approved on your phone instead.

### Signing into an iOS app

**Q**: I’m trying to sign into an iOS app, and I need to approve a notification on the Authenticator app. When I go back to the iOS app, I get stuck. What can I do?

**A**: This is a known issue on iOS 13+. Reach out to your support admin for help, and provide the following details: `Use Azure MFA, not MFA server.`

### Apple Watch doesn't show accounts

**Q**: Why aren't all my accounts showing up when I open Authenticator on my Apple Watch?

**A**: Authenticator supports only Microsoft personal or school or work accounts with push notifications on the Apple Watch companion app. For your other accounts, like Google or Facebook, you have to open the Authenticator app on your phone to see your verification codes.

### Apple Watch notifications

**Q**: Why can't I approve or deny notifications on my Apple Watch?

**A**: First, make sure you've upgraded to Authenticator version 6.0.0 or higher on your iPhone. After that, open the Microsoft Authenticator companion app on your Apple Watch and look for any accounts with a **Set Up** button beneath them. Complete the setup process to approve notifications for those accounts.

### Apple Watch communication error

**Q**: I'm getting a communication error between the Apple Watch and my phone. What can I do to troubleshoot?

**A**: This error happens when your Watch screen goes to sleep before it finishes communicating with your phone.<br><b>If the error happens during setup:</b><br>Try to run setup again, making sure to keep your Watch awake until the process is done. At the same time, open the app on your phone and respond to any prompts that appear.<br>If your phone and Watch still aren't communicating, you can try the following actions:<ol><li>Force quit the Microsoft Authenticator phone app and open it again on your iPhone.</li><li>Force quit the companion app on your Apple Watch.<ol><li> Open the Microsoft Authenticator companion app on your Watch</li><li>Hold down the side button until the **Shutdown** screen appears.</li><li>Release the side button and hold down the Digital Crown to force quit the active app.</li></ol></li><li>Turn off both Bluetooth and Wi-Fi for both your phone and your Watch, and then turn them back on.</li><li>Restart your iPhone and your Watch.</li></ol><b>If the error occurs when you're trying to approve a notification:</b><br>The next time you try to approve a notification on your Apple Watch, keep the screen awake until the request is complete and you hear the sound that indicates it was successful.

### Apple Watch companion app not syncing

**Q**: Why isn't the Microsoft Authenticator companion app for Apple Watch syncing or showing up on my watch?

**A**: If the app isn't showing up on your Watch, try the following actions: <ol><li>Make sure your Watch is running watchOS 4.0 or higher.</li><li>Sync your Watch again.</li></ol>

### Apple Watch companion app crashed

**Q**: My Apple Watch companion app crashed. Can I send you my crash logs so you can investigate?

**A**: You first have to make sure you've chosen to share your analytics with us. If you're a TestFlight user, you're already signed up. Otherwise, you can go to **Settings > Privacy > Analytics** and select both the **Share iPhone & Watch analytics** and the **Share with App Developers** options.<br>After you sign up, you can try to reproduce your crash so your crash logs are automatically sent to us for investigation. However, if you can't reproduce your crash, you can manually copy your log files and send them to us.<ol><li>Open the Watch app on your phone, go to **Settings > General**, and then click **Copy Watch Analytics**.</li><li>Find the corresponding crash under **Settings > Privacy > Analytics > Analytics Data**, and then manually copy the entire text.</li><li>Open Authenticator on your phone and paste that copied text into the **Describe the issue you are facing** box under **Having trouble?** on the **Send feedback** page. </li></ol>

## Autofill with Authenticator

**Q**: What is Autofill with Authenticator?

**A**: The Authenticator app now securely stores and autofills passwords on apps and websites you visit on your phone. You can use Autofill to sync and autofill your passwords on your iOS and Android devices. After setting up the Authenticator app as an autofill provider on your phone, it offers to save your passwords when you enter them on a site or in an app sign-in page. The passwords are saved as part of [your personal Microsoft account](https://account.microsoft.com/account) and are also available when you sign in to Microsoft Edge with your personal Microsoft account.

**Q**: What information can Authenticator autofill for me?

**A**: Authenticator can autofill usernames and passwords on sites and apps you visit on your phone.

**Q**: How do I turn on password autofill in Authenticator on my phone?

**A**: Follow these steps:

1. Open the Authenticator app.
1. On the **Passwords** tab in Authenticator, select **Sign in with Microsoft** and sign in using [your Microsoft account](https://account.microsoft.com/account). This feature currently supports only Microsoft accounts and doesn't yet support work or school accounts.

**Q**: How do I make Authenticator the default autofill provider on my phone?

**A**: Follow these steps:

1. Open the Authenticator app.
1. On the **Passwords** tab inside the app, select **Sign in with Microsoft** and sign in using [your Microsoft account](https://account.microsoft.com/account).
1. Do one of the following:

   - On iOS, under **Settings**, select **How to turn on Autofill** in the Autofill settings section to learn how to set Authenticator as the default autofill provider.
   - On Android, under **Settings**, select **Set as Autofill provider** in the Autofill settings section.

**Q**: What if **Autofill** is not available for me in Settings?

**A**: If Autofill is not available for you in Authenticator, it might be because autofill has not yet been allowed for your organization or account type. You can use this feature on a device where your work or school account isn’t added. To learn more on how to allow Autofill for your organization, see [Autofill for IT admins](#autofill-for-it-admins).

**Q**: How do I stop syncing passwords?

**A**: To stop syncing passwords in the Authenticator app, open **Settings** > **Autofill settings** > **Sync account**. On the next screen, you can select on **Stop sync and remove all autofill data**. This will remove passwords and other autofill data from the device. Removing autofill data doesn't affect multi-factor authentication.

**Q**: How are my passwords protected by the Authenticator app?

**A**: Authenticator app already provides a high level of security for multi-factor authentication and account management, and the same high security bar is also extended to managing your passwords.

- **Strong authentication is needed by Authenticator app**: Signing into Authenticator requires a second factor. This means that your passwords inside Authenticator app are protected even if someone has your Microsoft account password.
- **Autofill data is protected with biometrics and passcode**: Before you can autofill password on an app or site, Authenticator requires biometric or device passcode. This helps add extra security so that even if someone else has access to your device, they can't fill or see your password, because they’re unable to provide the biometric or device PIN input. Also, a user cannot open the Passwords page unless they provide biometric or PIN, even if they turn off App Lock in app settings.
- **Encrypted Passwords on the device**: Passwords on device are encrypted, and encryption/decryption keys are never stored and always generated when needed. Passwords are only decrypted when user wants to, that is, during autofill or when user wants to see the password, both of which require biometric or PIN.
- **Cloud and network security**: Your passwords on the cloud are encrypted and decrypted only when they reach your device. Passwords are synced over an SSL-protected HTTPS connection, which helps prevent an attacker from eavesdropping on sensitive data when it is being synced. We also ensure we check the sanity of data being synced over network using cryptographic hashed functions (specifically, hash-based message authentication code).

## Autofill for IT admins

**Q**: Will my employees or students get to use password autofill in Authenticator app?

**A**: Yes, Autofill for your [personal Microsoft accounts](https://go.microsoft.com/fwlink/?linkid=2144423) now works for most enterprise users even when a work or school account is added to the Authenticator app. You can fill out a form to allow or deny Autofill for your organization and [send it to the Authenticator team](https://aka.ms/ConfigureAutofillInAuthenticator). Autofill is not currently available for work or school accounts.

**Q**: Will my users’ work or school account password get automatically synced?

**A**: No. Password autofill won't sync work or school account password for your users. When users visit a site or an app, Authenticator will offer to save the password for that site or app, and password is saved only when user chooses to.
  
**Q**: Can I allowlist only certain users of my organization for Autofill?

**A**: No. Enterprises can only enable passwords autofill for all or none of their employees at this time.

**Q**: What if my employee or student has multiple work or school accounts? For example, my employee has accounts from multiple enterprises or schools in their Microsoft Authenticator.

**A**: All enterprises or schools added in the Authenticator app need to be allow-listed for Autofill in Authenticator for the app owner to be able to use it. The one exception to this restriction is when your employee or student adds their work or school account into Microsoft cloud-based multi-factor authentication as an [external or third-party account](user-help-auth-app-add-non-ms-account.md).

## Next steps

- If you're having trouble getting your verification code for your personal Microsoft account, see the **Troubleshooting verification code issues** section of the [Microsoft account security info & verification codes](https://support.microsoft.com/help/12428/microsoft-account-security-info-verification-codes) article.

- If you want more information about two-step verification, see [Set up my account for two-step verification](multi-factor-authentication-end-user-first-time.md)

- If you want more information about security info, see [Security info (preview) overview](./security-info-setup-signin.md)

- If your question wasn't answered here, we want to hear from you. Go to the [Microsoft Authenticator app forum](https://social.technet.microsoft.com/Forums/en-us/home?forum=MicrosoftAuthenticatorApp) to post your question and get help from the community, or leave a comment on this page.
