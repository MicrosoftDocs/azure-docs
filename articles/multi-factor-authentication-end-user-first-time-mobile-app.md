<properties 
	pageTitle="Azure Multi-Factor Authentication - End Users Guide" 
	description="This is the Azure Multi-factor authentication page that will assist your end users with getting going with Azure Multi-Factor Authentication." 
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

# Use mobile app as your contact method

[End User Guide - Home](multi-factor-authenticatio-end-user.md)<br> 
[Signing in for the first time](multi-factor-authentication-end-user-first-time.md)<br>
[Sign in experience](multi-factor-authentication-end-user-signin.md)<br>
[Managing your settings](multi-factor-authentication-end-user-manage-settings.md)<br>
[Help with app passwords](multi-factor-authentication-end-user-app-passwords.md)


The following will walk you through setting up multi-factor authentication to use your mobile app as your primary contact method.

## To use a mobile app as your contact method
<ol>
<li>Select Mobile App from the drop-down.</li>

<center>![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/mobileapp.png)</center>

<li>Select either Notification or One-time password and click Set up</li>
<li>On the phone that has the Azure Authenticator app installed, launch the app.</li>
<li>Click scan barcode.</li>

<center>![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/scan.png)</center>


<li>Scan the barcode picture that came up with the configure mobile app screen.  Click Done to close the barcode screen.  If you cannot get the barcode to scan you can enter the information manually.</li>

<center>![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/barcode.png)</center>

<li>On the phone, it will begin to activate, once this has completed click Contact me.  This will send either a notification or a verification code to your phone.</li>
<li>Click verify.</li>

<center>![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/verify.png)</center>

<li>Click close.  At this point, your verification should be successful.</li>

<li></li>
<li>Now it is recommended that enter your mobile phone number in case you lose access to your mobile app.
<li>Specify your country from the drop-down.</li>
<li>Enter your mobile phone number in the box next to country.</li>
<li>Click Next.</li>
<li>At this point, you have setup your contact method and now it is time to setup app passwords for non-browser apps such as Outlook 2010 or older. If you do not use these apps click **Done**.  Otherwise continue to the next step.
<li>If you are using these apps then copy the app password provided.</li>

<li>Paste the password that was copied to the clipboard into your non-browser application. For steps on individual applications such as Outlook and Lync see How to change the password in your email to the app password and How to change the password in your application to the app password.</li>
<li>Click Done.</li>

<center>![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/step4.png)</center>

**Additional Resources**

* [How it Works](multi-factor-authentication-how-it-works.md)
* [Getting Started](multi-factor-authentication-get-started.md)
* [Whats Next](multi-factor-authentication-whats-next.md)
* [Learn More](multi-factor-authentication-learn-more.md)
* [End User Guide](multi-factor-authentication-end-user.md)
* [MFA Operations Guide](multi-factor-authentication-operations.md)
* [Azure Multi-Factor Authentication on MSDN](htts://msdn.microsoft.com/library/azure/dn249471.aspx)