<properties 
	pageTitle="Managing your Azure MFA settings" 
	description="This document will provide users information on where they need to go to manage their Azure MFA settings." 
	services="multi-factor-authentication" 
	documentationCenter="" 
	authors="billmath" 
	manager="stevenpo" 
	editor="curtland"/>

<tags 
	ms.service="multi-factor-authentication" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/22/2015" 
	ms.author="billmath"/>

# Having trouble with Azure Multi-Factor Authentication
The following information is provided to help you with some of the common issues that you may experience.



- [I have lost my phone or it was stolen](#i-have-lost-my-phone-or-it-was-stolen?)
- [I want to change my phone number](#i-want-to-change-my-phone-number)
- [I am not receiving a code on my phone](#i-am-not-receiving-a-code-on-my-phone)
- [App passwords are not working](#app-passwords-are-not-working)
- [Why is the Azure Authenticator app published by PhoneFactor?](#why-is-the-azure-authenticator-app-published-by-phonefactor)
- [How do I clean up Azure Authenticator from my old device and move to a new one?](#how-do-i-clean-up-azure-authenticator-from-my-old-device-and-move-to-a-new-one)

## I have lost my phone or it was stolen?
If your phone was lost or stolen, it is recommended that you have your administrator reset your [app passwords](multi-factor-authentication-manage-users-and-devices.md#delete-users-existing-app-passwords) and clear any [remembered devices](multi-factor-authentication-manage-users-and-devices.md#restore-mfa-on-all-suspended-devices-for-a-user).

In order to get back into your account you have two options.  The first is, if you have setup an alternate authentication phone number you can use this to get back into your account and change your security settings.

If you have specified a secondary authentication phone number you can sign-in using it. 
![Setup](./media/multi-factor-authentication-end-user-manage/altphone.png)
Notice in the screen shot above, two phone numbers have been setup.  One ending in 67 and the second ending in 30.
  
To sign in, simply choose **Use a different verification option**, and then select your other phone number.  In this case, you would select **Call me at +X XXXXXXXX30**

![Setup](./media/multi-factor-authentication-end-user-manage/altphone2.png)

>[AZURE.IMPORTANT]
>It is important to configure a secondary authentication phone number.  Because your primary phone number and your mobile app are probably on the same phone, the secondary phone number is the only way you will be able to get back into your account if your phone is lost or stolen.

If you have not configured a secondary authentication phone number then you will have to contact your administrator and have them clear you settings so the next time you sign-in, you will be prompted to [setup multi-factor authentication](multi-factor-authentication-manage-users-and-devices.md#require-selected-users-to-provide-contact-methods-again) again.

## I want to change my phone number
Depending on how you use mutli-factor authentication, there are a few places where you can change your settings like your phone number.   Use the table below to help you choose the one that best describes you.

How you use multi-factor authentiation|Description
:------------- | :------------- | 
[I use it with Office 365](#changing-your-settings-with-office-365)|  This means that you will want to change your settings through the Office 365 portal.
[I don't know](#changing-your-settings-with-the-myapps-portal)|This means you will want to sign-in to [http://myapps.microsoft.com](http://myapps.microsoft.com) and change your setting here.
[I use it with Microsoft Azure](#changing-your-settings-with-microsoft-azure)| This means that you will want to change your settings through the Azure portal.


 
### Changing your settings with Office 365


If you use multi-factor authentication with Office 365 you will want to manage your additional security verification settings through the Office 365 portal.

#### To change your settings in the Office 365 portal

1. Log on to the [Office 365 portal](https://login.microsoftonline.com/).
2. In the top right corner select the widget and choose Office 365 Settings.
3. Click on Additional security verification.
4. On the right, click the link that says **Update my phone numbers used for account security.**
![Setup](./media/multi-factor-authentication-end-user-manage/o365a.png)
5. This will take you to the page that will allow you to change your settings.
![Cloud](./media/multi-factor-authentication-end-user-manage/o365b.png)


### Changing your settings with the Myapps portal

If you are not sure how you use multi-factor authentication, then you can always change your settings through the myapps portal.

#### To change your settings in the Myapps portal

1. Sign-in to [https://myapps.microsoft.com](https://myapps.microsoft.com)	
2. At the top, select profile.
3. Select Additional Security Verification.
![Cloud](./media/multi-factor-authentication-end-user-manage/myapps1.png)
4. This will take you to the page that will allow you to change your settings.

![Setup](./media/multi-factor-authentication-end-user-manage-myapps/proofup.png)

### Changing your settings with Microsoft Azure

If you use multi-factor authentication with Azure you will want to change your settings through the Azure portal.

#### To access additional security verification settings in the Azure portal


1. Log on to the Azure portal.
2. At the top of the Azure portal, click on your username. This will bring up a drop-down box.
3. From the drop-down box, select Additional security verification.
![Setup](./media/multi-factor-authentication-end-user-manage/azure1.png)
4. This will take you to the page that will allow you to change your settings.
![Setup](./media/multi-factor-authentication-end-user-manage-azure/proofup.png)

##I am not receiving a code on my phone

First, you need to ensure the following:

- If you selected to receive verification codes by text message to your mobile phone, make sure your service plan and device supports text message delivery. Your delivery speed and availability may vary by location and service provider. Also make sure that you have an adequate cell signal when trying to receive these codes.
- If you chose to receive a verification via the mobile app, ensure that you have a significant cell signal.  Also remember that delivery speed and availability may vary by location and service provider. 

If you have a smartphone, we recommend you use the [Azure Authenticator app](multi-factor-authentication-azure-authenticator).

You can switch between receiving your verification codes via text messages through the mobile app by choosing **Use a different verification option** when you sign-in.  Sometimes delivery of one of these services is more reliable than the other.

Be aware that if you received multiple verification codes, only the newest one will work. 

If you previously configured a backup phone, it is recommended that you try again by selecting that phone when prompted from the sign in page. If you don’t have another method configured, contact your admin and ask them to clear you settings so the next time you sign-in, you will be prompted to [setup multi-factor authentication](multi-factor-authentication-manage-users-and-devices.md#require-selected-users-to-provide-contact-methods-again) again.

##App passwords are not working
First, make sure that you have entered the app password correctly.  If it is still not working try signing-in and [create a new app password](multi-factor-authentication-end-user-app-passwords).  If this does not work, contact your administrator and have them [delete your existing app passwords](multi-factor-authentication-manage-users-and-devices.md#delete-users-existing-app-passwords) and then create a new one and use that one.

##Why is the Azure Authenticator app published by PhoneFactor?
Microsoft acquired PhoneFactor in 2012, and some of the older versions of the app may show the previous company name as the publisher. This legacy branding has been transitioned and the old apps will be unpublished from each marketplace.

##How do I clean up Azure Authenticator from my old device and move to a new one?
When you uninstall the app from your device or reflash the device, it does not remove the activation on the back end. You should use the steps outlined in [moving to a new device.](multi-factor-authentication-azure-authenticator.md#how-to-move-to-the-new-azure-authenticator-app).
