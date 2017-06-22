---
title: Microsoft Authenticator app help and support | Microsoft Docs
description: Provides a list of frequently asked questions and answers related to the Microsoft Authentication app and Azure Multi-Factor Authentication.
services: multi-factor-authentication
documentationcenter: ''
author: kgremban
manager: femila

ms.assetid: f04d5bce-e99e-4f75-82d1-ef6369be3402
ms.service: multi-factor-authentication
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/17/2017
ms.author: kgremban
ms.reviewer: librown
ms.custom: end-user
---
# Microsoft Authenticator app FAQ

This article answers common questions that we receive about the Microsoft Authenticator app. If you don't see an answer to your question, go to the [Microsoft Authenticator app forum](https://social.technet.microsoft.com/Forums/en-US/home?forum=MicrosoftAuthenticatorApp). We also have another FAQ about a specific feature on the app, [Sign in with your phone FAQ](microsoft-authenticator-app-phone-signin-faq.md).

The Microsoft Authenticator app replaced the Azure Authenticator app, and is the recommended app when you use Azure Multi-Factor Authentication. The Microsoft Authenticator app is available for [Windows Phone](http://go.microsoft.com/fwlink/?Linkid=825071), [Android](http://go.microsoft.com/fwlink/?Linkid=825072), and [IOS](http://go.microsoft.com/fwlink/?Linkid=825073).

## Frequently asked questions

### What are the codes in the app for? Why does the number keep counting down?

When you open the Microsoft Authenticator app, you see the accounts you've added and a six- or eight-digit number by each of them. You might see a 30-second timer counting down.

These codes are used when you sign in to your account. After you enter your username and password, you might be asked to enter a verification code. Open the Microsoft Authenticator app and copy the code that's currently showing. Enter that code in the sign-in page to finish.

The reason that the codes change every 30 seconds is so that you never use the same code twice. It's not like a password that you're supposed to remember. The idea is that only someone with access to your phone knows your verification code.

The codes don't require internet or data, so you don't have to worry about having phone service to sign in. When you close the app, it doesn't keep running in the background and it doesn't drain your battery. You can close the app and ignore it until the next time that you sign in.  

### I only get notifications when I have the app open. If the app isn't open, I don't get any notifications.

If you get notifications, but they don't make noise or vibrate despite your ringer being on, first check the app settings. Enable the app to use sound or vibrate with its notifications.

If you don't get notifications at all, check the following cases:

- Is your phone in Do Not Disturb or Quiet mode? That mode can keep apps from sending notifications.
- Can you receive notifications from other apps? If not, there may be an issue with the network connections on your phone, or the notifications channel from Android or Apple. You can address the first option in your phone settings, but you may need to talk to your service provider for help with the second option.
- Can you receive notifications for some accounts on the app, but not others? If yes, remove the problematic account from your app and add it again to enable push notifications. 

If you tried these troubleshooting suggestions but are still having issues, send us your logs for diagnostics. Go to the app settings, then select **Help & feedback** and **Send logs**. Then, go to the [Microsoft Authenticator app forum](https://social.technet.microsoft.com/Forums/en-US/home?forum=MicrosoftAuthenticatorApp) and let us know what problem you're seeing and what steps you've tried so far. 

### I'm already using the Microsoft Authenticator application for verification codes. How do I switch to one-click push notifications?
Approving a sign-in through push notification is only available for personal Microsoft accounts or work and school Microsoft accounts, not for third-party accounts like Google or Facebook. If you have a work or school Microsoft account, your organization can choose to disable this option.

If you use a Microsoft account for your personal account and want to switch over to push notifications, you need to add your account again. Re-register the device with your account, and set up push notifications.  

If you use Microsoft Authenticator for your work or school account, then your organization decides whether to allow one-click notifications.

### Do one-click push notifications work for non-Microsoft accounts?
No, push notifications only work with Microsoft accounts and Azure Active Directory accounts. If your work or school uses Azure AD accounts, they may disable this feature.  

### I restored my device from a backup, and my account codes are missing or not working. What happened?
For security purposes, we don't restore accounts from app backups.  After you restore the app, delete your accounts and add them again.

### I got a new device. How do I remove the Microsoft Authenticator app from my old device and move to the new one?
Adding the Microsoft Authenticator app to a new device does not automatically remove it from any other devices. To manage which devices are configured for your account, visit the same website that you use to manage two-step verification, and choose to remove old apps.

For personal Microsoft accounts, this website is your [account security](https://account.microsoft.com/security) page. For work or school Microsoft accounts, this website may be either [MyApps](https://myapps.microsoft.com) or a custom portal that your organization has set up.

### How do I remove an account from the app?
* iOS: From the main screen, swipe left on an account tile. Select **Delete**.
* Windows Phone: From the main screen, select the menu button, then **Edit accounts**. Tap the **X** next to the account name.
* Android: From the main screen, select the menu button, then **Edit accounts**. Tap the **X** next to the account name.

If you have a device that is registered with your organization, you may need to complete an extra step to remove your account. On these devices, the Microsoft Authenticator app is automatically registered as a device administrator. If you want to completely uninstall the app, you need to first unregister the app in the app settings.

### Why does the app request so many permissions?
Here is a full list of permissions we may ask for, and how they are used in the app. The specific permissions you see depend on the type of phone you have.

* **Camera**: We use your camera to scan QR codes when you add a work, school, or non-Microsoft account.
* **Contacts and phone**: When you sign in with your personal Microsoft account, we try to simplify the process by finding existing accounts that you use on your phone.
* **SMS**: When you sign in with your personal Microsoft account for the first time, we have to make sure that your phone number matches the one we have on record. We send a text message to the phone where you downloaded the app. The message contains a 6-8 digit verification code. Instead of asking you to find this code and enter it in the app, we find it in the text message for you.
* **Draw over other apps**: When you receive a notification to verify your identity, we display that notification over any other app that might be running.
* **Receive data from the internet**: This permission is required for sending notifications.
* **Prevent phone from sleeping**: If you register your device with your organization, they can change this policy on your phone.
* **Control vibration**: You can choose whether you would like a vibration whenever you receive a notification to verify your identity.
* **Use fingerprint hardware**: Some work and school accounts require an additional PIN whenever you verify your identity. TO make the process easier, we allow you to use your fingerprint instead of entering the PIN.
* **View network connections**: When you add a Microsoft account, the app requires network/internet connection.
* **Read the contents of your storage**: This permission is only used when you report a technical problem through the app settings. Some information from your storage is collected to diagnose the issue.
* **Full network access**: This permission is required for sending notifications to verify your identity.
* **Run at startup**: If you restart your phone, this permission ensures that you continue you receive notifications to verify your identity.

### Why does the Microsoft Authenticator App allow you to approve a request without unlocking the device?

You don't have to unlock your device to approve verification requests because all you need to prove is that you have your phone with you. Two-step verification requires proving two things – a thing you know, and a thing you have. The thing you know is your password. The thing you have is your phone (set up with the Microsoft Authenticator app and registered as an MFA proof.) Therefore, having the phone and approving the request meets the criteria for the second factor of authentication. 

### What does the lock icon in the account list mean?

The padlock icon indicates that the device is registered in Azure AD and registered to the account. Device registration for iOS takes place during Microsoft Intune enrollment.

## Next steps

### Contact us
If your question wasn't answered here, we want to hear from you. Go to the [Microsoft Authenticator app forum](https://social.technet.microsoft.com/Forums/en-US/home?forum=MicrosoftAuthenticatorApp) to post your question and get help from the community, or leave a comment on this page.


### Related topics
* [About two-step verification](https://support.microsoft.com/help/12408/microsoft-account-about-two-step-verification) for Microsoft accounts
* [Having trouble with two-step verification](multi-factor-authentication-end-user-troubleshoot.md) for your work or school account?
* [Use the Microsoft Authenticator to sign in from your phone](microsoft-authenticator-app-phone-signin-faq.md)

