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



## Where to find the settings page
Depending on how your company set up Azure Multi-Factor Authentication, there are a few places where you can change your settings like your phone number.

If your IT admin sent out a specific URL or steps to manage two-step verification, follow those instructions. Otherwise, the following instructions should work for everybody else. If you follow these steps but don't see the same options, that means that your work or school customized their own portal. Ask your admin for the link to your Azure Multi-Factor Authentication portal.


1. Sign-in to [https://myapps.microsoft.com](https://myapps.microsoft.com)  
2. At the top, select **profile**.  
3. Select **Additional security verification**.  

	![Myapps](./media/multi-factor-authentication-end-user-manage/myapps1.png)

4. The Additional security verification page loads with your settings.

	![Proofup](./media/multi-factor-authentication-end-user-manage-myapps/proofup.png)


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
