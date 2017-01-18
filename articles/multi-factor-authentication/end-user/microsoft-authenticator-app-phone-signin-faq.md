---
title: Microsoft Authenticator phone sign-in FAQ | Microsoft Docs
description: Use your phone to sign in to your Microsoft account instead of typing your password. This article answers FAQs about this feature. 
services: multi-factor-authentication
documentationcenter: ''
author: kgremban
manager: femila
editor: librown

ms.assetid: ''
ms.service: multi-factor-authentication
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/18/2017
ms.author: kgremban

---
# Sign in with your phone - FAQ

The Microsoft Authenticator app helps you keep your accounts secure by performing two-step verification after you enter your password. But did you know that it can replace the password for your personal Microsoft account entirely? 

This feature is available on iOS and Android devices, and works with personal Microsoft accounts. 

## How do I get started?

To sign in to your personal Microsoft account with your phone, follow these steps: 

1. Install the Microsoft Authenticator app and add your personal Microsoft account if you haven't already. There are more details about this process on the [Microsoft Authenticator page](microsoft-authenticator-app-how-to.md)

2. Select your account, and use the drop-down menu to enable phone sign-in. 

3. Most pages where you would normally enter your Microsoft account password have a link that says **Use an app instead**. Select this to sign in with your phone. 

4. Microsoft sends a notification to your phone. Approve the notification to sign in to your account.   

## How is signing in with my phone more secure than typing a password?  
Today most people sign in to web sites or apps using a username and password.  Unfortunately, passwords are often lost, stolen, or guessed by hackers. When you set up the Microsoft Authenticator app to sign in, we generate a key on your phone. This key is tied directly to you via your PIN or biometric, and is stored securely on the device.  When you sign in with your phone, this key is used to prove your identity securely with two factors – the phone itself, and the ability to unlock it. 

The key used is similar to the keys used in Windows Hello and the FIDO Alliance UAF specifications. Your bio data is only used to protect the key locally, and is never sent to, or stored in, the cloud. 
 
## Where can I use my phone to replace my password, and where would I still need the password?  
Today, the phone sign-in feature only works with web apps and services that are powered by personal Microsoft accounts, iOS or Android apps that use a personal Microsoft account, and apps on Windows 10 that use a personal Microsoft account. When you sign in to one of these web sites or apps, on the page where you usually enter your password there's a link that says **Use an app instead**. 

Phone sign-in can't be used to unlock a Windows 10 PC, XBOX, or any desktop versions of Microsoft apps such as Office apps at this time. We’re working to add support for those systems and apps. 
 
## Does this replace two-step verification? Should I turn it off?   
Signing in with your phone provides the security of two-step verification without the step of typing your password first. However, we recommend keeping two-step verification on because turning it off would remove the protection offered by requiring a second factor. 
 
## Okay, if I keep two-step verification turned on for my account, will I have to approve two notifications?
No, you won't. Two-step verification usually requires a password and a code as your two factors. With phone sign-in, the fact that you have your phone with you and your ability to unlock it are the two factors. Signing in with your phone is as secure as the old method, but saves you a step. 

## What if I lose my phone or don’t have it with me, how can I access my account?  
If you don’t have your phone with you, you can always click **Use a password instead** on the sign-in page to switch back to using your password. 
 
## How do I stop using this feature and go back to entering my password?
Click **Use a password instead** the next time you sign in. Every time you sign in, you can change the method you use. If you want to go back to signing in with your phone, click **Use an app instead**. 
 
## Can I use the app to sign in to all my accounts with Microsoft?   
This functionality is only available for personal Microsoft accounts at this time. If you have a work or school account with Microsoft, you can’t use your phone to sign in to that account. This is a capability we plan to add in the future. Once we do support phone sign-in for work or school accounts, your IT department will decide whether to offer this feature. 

<!-- Please follow us (where?) to get more information about new phone sign-in capabilities and news. -->
 
## When can I sign into my PC with my phone?  
We are focusing on signing into apps right now. For your PC, we recommend signing in with Windows Hello on Windows 10 using your face, fingerprint, or a PIN.   
 
## When will you support these on Windows Phone?  
At this time, we are not developing this functionality for the Microsoft Authenticator on Windows Phone. 

## Next steps
- If you haven't downloaded the Microsoft Authenticator app, check it out. The app is available for [Windows Phone](http://go.microsoft.com/fwlink/?Linkid=825071), [Android](http://go.microsoft.com/fwlink/?Linkid=825072), and [IOS](http://go.microsoft.com/fwlink/?Linkid=825073).

- If you have questions about the app in general, take a look at the [Microsoft Authenticator FAQs](microsoft-authenticator-app-faq.md)