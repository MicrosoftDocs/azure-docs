<properties 
	pageTitle="What are App Passwords in Azure MFA?" 
	description="This page will help users understand what app passwords are and what they are used for with regard to Azure MFA." 
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




# What are App Passwords in Azure Multi-Factor Authentication?

[What does multi-factor-authentication mean to me?](multi-factor-authenticatio-end-user.md)<br> 
[Signing in for the first time](multi-factor-authentication-end-user-first-time.md)<br>
[Sign in experience](multi-factor-authentication-end-user-signin.md)<br>
[Help with app passwords](multi-factor-authentication-end-user-app-passwords.md)<br>
[Managing your settings](multi-factor-authentication-end-user-manage-settings.md)

Certain non-browser apps, such as the Apple native email client that uses Exchange Active Sync, currently do not support multi-factor authentication. Multi-factor authentication is enabled per user. This means that if a user has been enabled for multi-factor authentication and they are attempting to use non-browser apps, they will be unable to do so. An app password allows this to occur.

## How to use app passwords

The following are some things to remember on how to use app passwords.

- The actual password is automatically generated and is not supplied by the user. This is because the automatically generated password, is harder for an attacker to guess and is more secure.
- Currently there is a limit of 40 passwords per user. If you attempt to create one after you have reached the limit, you will be prompted to delete one of your existing app passwords in order to create a new one.
- It is recommended that app passwords be created per device and not per application. For example, you can create one app password for your laptop and use that app password for all of your applications on that laptop.
- You are given an app password the first time you sign-in.  If you need additional ones, you can create them.
 
<center>![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-phone/app.png)</center>

Once you have an app password, you use this in place of your original password with these non-browser apps.  So for instance, if you are using multi-factor authentication and the Apple native email client on your phone.  Use the app password so that it can bypass multi-factor authentication and continue to work.

### Creating app passwords
During your initial sign-in you are given an app password that you can use.  Additionally you can also create app passwords later on.  How you do this depends on how you use multi-factor authentication.  Choose the one that most applies to you.

How you use multi-factor authentiation|Description
:------------- | :------------- | 
[I use it with Office 365](multi-factor-authentication-end-user-manage-o365.md)|  This means that you will want to create app passwords through the Office 365 portal.
[I use it with Microsoft Azure](multi-factor-authentication-end-user-manage-azure.md)| This means that you will want create app passwords through the Azure portal.
[I don't know](multi-factor-authentication-end-user-manage-myapps.md)|This means you will want create app passwords through [https://myapps.microsoft.com](https://myapps.microsoft.com)




