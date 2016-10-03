<properties
	pageTitle="Manage your two-step verification settings | Microsoft Azure"
	description="Manage how you use Azure Multi-Factor Authentication including changing your contact information or configuring your devices."
	services="multi-factor-authentication"
	keywords = "multifactor authentication client, authentication problem, correlation ID"
	documentationCenter=""
	authors="kgremban"
	manager="femila"
	editor="pblachar"/>

<tags
	ms.service="multi-factor-authentication"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/03/2016"
	ms.author="kgremban"/>

# Manage your settings for two-step verification

If your work or school uses Azure Multi-Factor Authentication, then you 

>[AZURE.IMPORTANT]
>Help us make this page better.  If you do not find an answer to your issue on this page, please provide detailed feedback so that we can get this added.



## I want to change my phone number
Depending on how you use multi-factor authentication, there are a few places where you can change your settings like your phone number.   Use the table below to help you choose the one that best describes you.

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
![O365](./media/multi-factor-authentication-end-user-manage/o365a.png)
5. This will take you to the page that will allow you to change your settings.
![O365](./media/multi-factor-authentication-end-user-manage/o365b.png)


### Changing your settings with the Myapps portal

If you are not sure how you use multi-factor authentication, then you can always change your settings through the myapps portal.

#### To change your settings in the Myapps portal

1. Sign-in to [https://myapps.microsoft.com](https://myapps.microsoft.com)
2. At the top, select profile.
3. Select Additional Security Verification.
![Myapps](./media/multi-factor-authentication-end-user-manage/myapps1.png)
4. This will take you to the page that will allow you to change your settings.

![Proofup](./media/multi-factor-authentication-end-user-manage-myapps/proofup.png)

### Changing your settings with Microsoft Azure

If you use multi-factor authentication with Azure you will want to change your settings through the Azure portal.

#### To access additional security verification settings in the Azure portal


1. Log on to the Azure portal.
2. At the top of the Azure portal, click on your username. This will bring up a drop-down box.
3. From the drop-down box, select Additional security verification.
![Azure](./media/multi-factor-authentication-end-user-manage/azure1.png)
4. This will take you to the page that will allow you to change your settings.
![Proofup](./media/multi-factor-authentication-end-user-manage-azure/proofup.png)

## I have a new phone and need to change my phone number

If you have a new phone and need to change the primary contact number that mfa uses, you can do this in one of two ways.

>[AZURE.IMPORTANT]
>It is important to configure a secondary authentication phone number.  Because your primary phone number and your mobile app are probably on the same phone, the secondary phone number is the only way you will be able to get back into your account if your phone is lost or stolen.

The first is using a secondary authentication method.  If you have specified a secondary authentication phone number you can sign-in using it.
![Setup](./media/multi-factor-authentication-end-user-manage/altphone.png)
Notice in the screen shot above, two phone numbers have been setup.  One ending in 67 and the second ending in 30.

To sign in using the alternate phone number, sign-in as you normally would, then simply choose **Use a different verification option**.
![Different Verification](./media/multi-factor-authentication-end-user-manage/differentverification.png)

Then select your other phone number.  In this case, you would select **Call me at +X XXXXXXXX30**

![Alternate phone](./media/multi-factor-authentication-end-user-manage/altphone2.png)

The second is by contacting your administrator or the person who setup mfa for you.  You only need to do this if you have not configured a secondary authentication phone number.  Otherwise you will have to contact your administrator or the person who setup mfa and have them clear you settings so the next time you sign-in, you will be prompted to [setup multi-factor authentication](multi-factor-authentication-manage-users-and-devices.md#require-selected-users-to-provide-contact-methods-again) again.



## How do I clean up Microsoft Authenticator from my old device and move to a new one?
When you uninstall the app from your device or reflash the device, it does not remove the activation on the back end. You should use the steps outlined in [moving to a new device.](multi-factor-authentication-microsoft-authenticator.md#how-to-move-to-the-new-microsoft-authenticator-app).
