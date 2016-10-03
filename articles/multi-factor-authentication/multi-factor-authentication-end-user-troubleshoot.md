<properties
	pageTitle="Troubleshoot two-step verification | Microsoft Azure"
	description="This document will provide users information on what to do if they run into an issue with Azure Multi-Factor Authentication."
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

# Having trouble with two-step verification

This article discusses some issues that you may experience with two-step verification. If the issue you're having is not included here, please provide detailed feedback in the comments section so that we can improve.

## I lost my phone or it was stolen

In order to get back into your account you have two options.  The first is, if you have set up an alternate authentication phone number you can use this to get back into your account and change your security settings.

If you have specified a secondary authentication phone number you can sign-in using it.
![Setup](./media/multi-factor-authentication-end-user-manage/altphone.png)
Notice in the screen shot above, two phone numbers have been setup.  One ending in 67 and the second ending in 30.

To sign in using the alternate phone number, sign-in as you normally would, then simply choose **Use a different verification option**.
![Different Verification](./media/multi-factor-authentication-end-user-manage/differentverification.png)

Then select your other phone number.  In this case, you would select **Call me at +X XXXXXXXX30**

![Alternate phone](./media/multi-factor-authentication-end-user-manage/altphone2.png)

>[AZURE.IMPORTANT]
>It is important to configure a secondary authentication phone number.  Because your primary phone number and your mobile app are probably on the same phone, the secondary phone number is the only way you will be able to get back into your account if your phone is lost or stolen.

If you have not configured a secondary authentication phone number then you will have to contact your administrator and have them clear you settings so the next time you sign-in, you will be prompted to [setup multi-factor authentication](multi-factor-authentication-manage-users-and-devices.md#require-selected-users-to-provide-contact-methods-again) again.

If your phone was lost or stolen, have your administrator reset your app passwords and clear any remembered devices. If your admin isn't sure how to accomplish this, point them to this article: [Manage users and devices](multi-factor-authentication-manage-users-and-devices.md#delete-users-existing-app-passwords).

##I am not receiving a code or a call on my phone

First, you need to ensure the following:



- If you have selected to receive a phone call to your mobile phone, ensure that you have an adequate cell signal.  Your delivery speed and availability may vary by location and service provider.
- If you selected to receive verification codes by text message to your mobile phone, make sure your service plan and device supports text message delivery. Your delivery speed and availability may vary by location and service provider. Also make sure that you have an adequate cell signal when trying to receive these codes.
- If you chose to receive a verification via the mobile app, ensure that you have a significant cell signal.  Also remember that delivery speed and availability may vary by location and service provider.

If you have a smartphone, we recommend you use the Microsoft Authenticator app which is available for [Windows Phone](http://go.microsoft.com/fwlink/?Linkid=825071), [Android](http://go.microsoft.com/fwlink/?Linkid=825072), and [IOS](http://go.microsoft.com/fwlink/?Linkid=825073).

You can switch between receiving your verification codes via text messages through the mobile app by choosing **Use a different verification option** when you sign-in.

![Different Verification](./media/multi-factor-authentication-end-user-manage/differentverification.png)

Sometimes delivery of one of these services is more reliable than the other.

Be aware that if you received multiple verification codes, only the newest one will work.

If you previously configured a backup phone, it is recommended that you try again by selecting that phone when prompted from the sign in page. If you don’t have another method configured, contact your admin and ask them to clear you settings so the next time you sign-in, you will be prompted to [setup multi-factor authentication](multi-factor-authentication-manage-users-and-devices.md#require-selected-users-to-provide-contact-methods-again) again.

##App passwords are not working
First, make sure that you have entered the app password correctly.  If it is still not working try signing-in and [create a new app password](multi-factor-authentication-end-user-app-passwords.md).  If this does not work, contact your administrator and have them [delete your existing app passwords](multi-factor-authentication-manage-users-and-devices.md#delete-users-existing-app-passwords) and then create a new one and use that one.

## Contact us

If you've tried these troubleshooting steps but are still running into problems, contact your administrator or the person who set up multi-factor authentication for you and see if they can assist you.

Also, you can post a question on the [Azure AD Forums](https://social.msdn.microsoft.com/forums/azure/home?forum=WindowsAzureAD), [Search the Microsoft Knowledge Base (KB)](https://www.microsoft.com/en-us/Search/result.aspx?q=azure%20active%20directory%20connect&form=mssupport) or [contact support](https://support.microsoft.com/en-us) and we'll take a look at your problem as soon as we can.

When you contact support, it is recommended to include the following information:

 - **General description of the error** – what exact error message did the user see?  If there was no error message, describe the unexpected behavior you noticed, in detail.
 - **Page** – what page were you on when you saw the error (include the URL)?
 - **ErrorCode** - the specific error code you are receiving.
 - **SessionId** - the specific session id you are receiving.
 - **Correlation ID** – what was the correlation id code generated when the user saw the error.
 - **Timestamp** – what was the precise date and time you saw the error (include the timezone)?

![Correlation ID](./media/multi-factor-authentication-end-user-manage/correlation.png)

 - **User ID** – what was the ID of the user who saw the error (e.g. user@contoso.com)?
 - **Information about the user** – was the user federated, password hash synced, cloud only?  Did the user have an Azure AD Premium, Enterprise Mobility, or Azure AD Basic license assigned?  Is the user using Office 365? etc.

Including this information will help us to solve your problem as quickly as possible.
