<properties 
	pageTitle="Azure Authenticator app for mobile phones" 
	description="Learn how to upgrade to the latest version of Azure Authenticatior." 
	services="multi-factor-authentication" 
	documentationCenter="" 
	authors="billmath" 
	manager="swadhwa" 
	editor="curtand"/>

<tags 
	ms.service="multi-factor-authentication" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/30/2015" 
	ms.author="billmath"/>


#What is Azure Authenticator?
Azure Authenticator is simply a phone app, available for [Windows Phone](http://www.windowsphone.com/en-us/store/app/azure-authenticator/03a5b2bf-6066-418f-b569-e8aecbc06e50), [Android](https://play.google.com/store/apps/details?id=com.azure.authenticator), and [IOS](https://itunes.apple.com/us/app/azure-authenticator/id983156458) that allows the following:

- Multi-Factor Authentication - allows you to secure your accounts with two-step verification. With two-step verification, you sign in using something you know (your password) and something you have (your mobile device).
- Work Account - allows you to turn your Android phone or tablet into a trusted device and provide Single Sign-On (SSO) to company applications. Your IT administrator may require you to add a work account in order to access company resources. SSO lets you sign in once and automatically avail of signing in across all applications your company has made available to you. 

<center>![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/scan.png)</center>


##Why use Azure Multi-Factor Authenticator

The Azure Authenticator app is an easy to use, reliable solution that provides support for Azure Multi-Factor Authentication and other software tokens such as those used with Microsoft and Google accounts. 

It provides several options when used with Azure Multi-Factor Authentication. For example, you can either receive a push notification or use the verification code displayed for that account in the app.  

When used with other accounts such as Google, you simply use the verification code displayed for that account in the app.  It's that simple.


##Get Started with Azure Authenticator
First, download the app from any of the following:  [Windows Phone](http://www.windowsphone.com/en-us/store/app/azure-authenticator/03a5b2bf-6066-418f-b569-e8aecbc06e50), [Android](https://play.google.com/store/apps/details?id=com.azure.authenticator), and [IOS](https://itunes.apple.com/us/app/azure-authenticator/id983156458).

Next you need to add an account.  The easiest way to add an account is to scan a QR code presented by a system’s two-step verification enrollment page. Alternatively, you can enter an activation code and URL presented for Azure Multi-Factor Authentication enrollment or enter an account name and secret key presented by other systems. Multiple accounts and tokens are supported.  The following is an example of the Azure Multi-Factor Authentication verification enrollment.  Notice the QR code and the activation code and URL.

<center>![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/barcode.png)</center>

And that's it.  Now you are ready to use the app.  For a step-by-step example of setting up Azure Authentcator to use Azure Multi-Factor Authentication see [Use mobile app as your contact method with Azure Multi-Factor Authentication.](multi-factor-authentication-end-user-first-time-mobile-app.md)  For a step-by-step example of signing using the mobile app see [Signing in to the mobile app using notification with Azure Multi-Factor Authentication](multi-factor-authentication-end-user-signin-app-notify.md) and [Signing in to the mobile app using a verification code with Azure Multi-Factor Authentication](multi-factor-authentication-end-user-signin-app-verify.md)

## Moving from the Multi-Factor Authentication app to the new Azure Authenticator app

With the release of the Azure Authenticator app, available for [Windows Phone](http://www.windowsphone.com/en-us/store/app/azure-authenticator/03a5b2bf-6066-418f-b569-e8aecbc06e50), [Android](https://play.google.com/store/apps/details?id=com.azure.authenticator), and [IOS](https://itunes.apple.com/us/app/azure-authenticator/id983156458), the old Multi-Factor Authentication app is being replaced.  The Multi-Factor Authentication app will continue to work but should you decide to move to the new Azure Authenticator app then this article can assist you.  


## How to move to the new Azure Authenticator app 

**Step 1:** Install Azure Authenticator.

![Cloud](./media/multi-factor-authentication-azure-authenticator/home.png)

**Step 2:** Activate your accounts with the new app

First of all make sure, you have the QR code or code and URL for manual entry handy for the account you’d like to add to the app.

> [AZURE.NOTE] Not sure of how to get the QR code? Contact your administrator for assistance.
> 
> Unable to activate your account with the new app? Contact your administrator.
>


Once you have the QR code in front of you, launch the app. Click +. 


![Cloud](./media/multi-factor-authentication-azure-authenticator/addaccount.png)

This will launch the camera to scan the QR code.  If you are unable to scan the QR code, you always have the manual entry option. 

To confirm that the account is successfully activated, verify that the new account shows up on the accounts pages. 


Follow this step for all your accounts that you’d like to migrate to the new app.



**Step 3:**  Uninstall the old Multi-Factor Authentication app from your phone.

Once you have added all the accounts to the new app uninstall the old app from your phone.

Curious how to remove individual accounts from the old app?
Tap on the account. You’ll get an option to “Delete”. 

![Cloud](./media/multi-factor-authentication-azure-authenticator/remove.png)

## How to uninstall Azure Authenticator on Android devices.

Azure Authenticator is configured as a device administrator which must be disabled before the app can be uninstalled. To do thi, do the following:
<ol>
<li>Go to Settings > Security > Device administrators > uncheck “Azure Authenticator”</li>
<li>After that, you should be able to uninstall it as usual.</li> 


**Additional Resources**

* [Azure Multi-Factor Authentication on MSDN](https://msdn.microsoft.com/library/azure/dn249471.aspx) 
* Azure Authenticator app for [Windows Phone](http://www.windowsphone.com/en-us/store/app/azure-authenticator/03a5b2bf-6066-418f-b569-e8aecbc06e50), [Android](https://play.google.com/store/apps/details?id=com.azure.authenticator), and [IOS](https://itunes.apple.com/us/app/azure-authenticator/id983156458).
