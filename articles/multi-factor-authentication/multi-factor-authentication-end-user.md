<properties 
	pageTitle="What does Azure Multi-Factor Authentication mean for me?" 
	description="This is the Azure Multi-Factor authentication page that will assist your end users with getting going with Azure Multi-Factor Authentication." 
	services="multi-factor-authentication" 
	documentationCenter="" 
	authors="billmath" 
	manager="terrylan" 
	editor="bryanla"/>

<tags 
	ms.service="multi-factor-authentication" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/02/2015" 
	ms.author="billmath"/>

# What does Azure Multi-Factor Authentication mean for me?


So, you have gotten an email from someone in IT or perhaps even your boss saying that they have added additional security verification to your account.  But your like, what does that mean?

Not to worry.  That simply means that your organization wants to take some extra steps to ensure that you are who you say you are when signing in to things such as Office 365.  This is done by using a combination of your user name and password and a phone.  Either your office phone or a smart phone. 

So the first thing you are going to need to do is complete the enrollment process.  But before we start that process there are a few things to decide.

The first is whether or not to use an office phone or a smart phone.  Second, if using a smart phone, you need to decide between a call, a text, or a using the mobile app.  Finally, if you decide to use the mobile app, you need to choose whether to have notifications sent to you or to use a verification code.

I know this sounds like a lot but you can use the sections below to gain a little more insight into your choices.  Once these have been determined, then the enrollment process will be easy.

## Office phone or smart phone
This one is pretty straight forward.  You need to first decide whether you are going to use your office phone or a smart phone.  Now the office phone can be any phone number, so if you work from your home you could use your home phone number here.  Just remember when choosing that you will need your phone with you when you sign in.  So if you do sign in from anywhere other that your office, you want to make sure that phone is accessible.  For an example of this see [Signing in with mobile or office phone.](multi-factor-authentication-end-user-signin-phone.md)

## Smart phone call, text or mobile app
Now, if you decide to use your smart phone you have 3 options to choose from.

The first is using a phone call.  How this works is that when you sign in, a call is placed to your smart phone.  You answer the phone, press the # key and that is it.  You will automatically be signed in.

The second option is having a text message sent to your phone.  This works by sending a text to your phone when you sign in.  This text will contain a 6 digit code. You enter this code in the box that is displayed in the browser and you will be automatically signed in.

Finally, you can use the mobile app that is available.  The Azure Authenticator app is available for [Windows Phone](http://www.windowsphone.com/en-us/store/app/azure-authenticator/03a5b2bf-6066-418f-b569-e8aecbc06e50), [Android](https://play.google.com/store/apps/details?id=com.azure.authenticator), and [IOS](https://itunes.apple.com/us/app/azure-authenticator/id983156458).  See the next section for information on using the mobile app.

For an example of this see [Signing in with mobile or office phone.](multi-factor-authentication-end-user-signin-phone.md)

## Mobile app with a notification or verification code
If you decide to use the mobile app with your smart phone you have 2 options to choose from.

The first is having a notification sent to your phone.  How this works is that when you sign in, a notification is sent to the mobile app which comes up on your smart phone.  You are asked to either verify or cancel the notification.  If you select verify you are automatically signed in.  For an example of how this works see [Signing in with mobile app using notification.](multi-factor-authentication-end-user-signin-app-notify.md)

The second option is having a verification code sent to your phone.  This works by sending a verification code to the mobile app when you sign in.
For an example of how this works see [Signing in with the mobile app using verification code.](multi-factor-authentication-end-user-signin-app-verify.md)

## How to get going and use multi-factor authentication

Now that we have determined our primary verification method, we can start the enrollment process.  For information on how to do this see the sign-in for the first time link below.  Otherwise you can choose one of the other links for additional information that you may find useful.

Topic|Description
:------------- | :------------- | 
[Sign-in for the first time](multi-factor-authentication-end-user-first-time.md)|  Describes the process of signing in and getting setup for the first time.
[Sign in experience](multi-factor-authentication-end-user-signin.md)|Shows what you can expect from signing in using the various methods such as phone or app.
[Managing your settings](multi-factor-authentication-end-user-manage-settings.md)|Shows you how you can change your settings such as phone number or preferred enrollment method.
[Help with app passwords](multi-factor-authentication-end-user-app-passwords.md)| Find information on creating and using app passwords.

 