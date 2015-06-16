<properties 
	pageTitle="Signing in for the first time with Azure Multi-Factor Authentication" 
	description="This page describes what the user experience will be the first time they signin." 
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

# Signing in for the first time with Azure Multi-Factor Authentication

[What does multi-factor-authentication mean to me?](multi-factor-authenticatio-end-user.md)<br> 
[Signing in for the first time](multi-factor-authentication-end-user-first-time.md)<br>
[Sign in experience](multi-factor-authentication-end-user-signin.md)<br>
[Help with app passwords](multi-factor-authentication-end-user-app-passwords.md)<br>
[Managing your settings](multi-factor-authentication-end-user-manage-settings.md)


## How will you use multi-factor authentication?

 Additional security verification settings are used when an admin has configured your account to require that both your password and a response from your phone must be used to verify your identity. If an administrator has configured your account to require additional security verification, you will be unable to sign-in until you have completed the auto-enrollment process. 

<center>![Setup](./media/multi-factor-authentication-end-user-first-time/first.png)</center>

Using the enrollment process you will be able to specify your preferred method of verification.  This can be any of the following:

Method|Description
:------------- | :------------- | 
Mobile Phone Call|  Places an automated voice call to the Authentication phone. The user answers the call and presses # in the phone keypad to authenticate. This phone number will not be synchronized to on-premises Active Directory.
Mobile Phone Text Message|Sends a text message containing a verification code to the user. The user is prompted to either reply to the text message with the verification code or to enter the verification code into the sign-in interface.
Office Phone Call|Places an automated voice call to the user. The user answers the call and presses # in the phone keypad to authenticate.
Mobile app|Pushes a notification to the Multi-Factor mobile app on the user’s smartphone or tablet. The user taps “Verify” in the app to authenticate. Alternately, the app can also be used as an OTP token for offline authentication. The user enters the token into the sign-in screen to authenticate.<br><p>  The Multi-Factor Authentication app can operate in 2 different modes to provide the additional security that a multi-factor authentication service can provide. These are the following:<li>**Notification** - In this mode, the Multi-Factor Authentication app prevents unauthorized access to accounts and stops fraudulent transactions. This is done using a push notification to your phone or registered device. Simply view the notification and if it is legitimate select Authenticate. Otherwise you may choose Deny or choose to deny and report the fraudulent notification. For information on reporting fraudulent notifications see How to use the Deny and Report Fraud Feature for Multi-Factor Authentication.</li><p><li>**One-Time Password** - In this mode, the Multi-Factor Authentication app can be used as a software token to generate an OATH verification code. This verification code can then be entered along with the username and password to provide the second form of authentication.</li><br><p> The Multi-Factor Authentication app is available for [Windows Phone](http://www.windowsphone.com/en-us/store/app/azure-authenticator/03a5b2bf-6066-418f-b569-e8aecbc06e50), [Android](https://play.google.com/store/apps/details?id=com.azure.authenticator), and [IOS](https://itunes.apple.com/us/app/phonefactor/id475844606?mt=8).

Once you have decided which verification method you are going to use as your preferred method, select one of the following for step-by-step instructions on how to set this up the first time.

- [use mobile phone as your contact method](multi-factor-authentication-end-user-first-time-mobile-phone.md)
- [use office phone as your contact method](multi-factor-authentication-end-user-first-time-office-phone.md)
- [use mobile app as your contact method](multi-factor-authentication-end-user-first-time-office-phone.md)

