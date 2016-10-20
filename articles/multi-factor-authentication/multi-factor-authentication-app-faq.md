<properties
	pageTitle="Microsoft Authenticator app FAQ"
	description="Provides a list of frequently asked questions and answers related to the Microsoft Authentication app and Azure Multi-Factor Authentication."
	services="multi-factor-authentication"
	documentationCenter=""
	authors="kgremban"
	manager="femila"
	editor="pblachar, librown"/>

<tags
	ms.service="multi-factor-authentication"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/13/2016"
	ms.author="kgremban"/>

# Microsoft Authenticator application FAQ

The Microsoft Authenticator app replaced the Azure Authenticator app, and is the recommended app when you use Azure Multi-Factor Authentication. This app is available for Windows Phone, Android, and iOS.

## Frequently asked questions

- **What happened to the Azure Authenticator, Multi-Factor Auth, and Microsoft account apps?**

	The Microsoft Authenticator app replaces each other these apps. Azure Authenticator upgraded to Microsoft Authenticator. If you use the Multi-Factor Auth or Microsoft account apps, install Microsoft Authenticator and add your accounts again. Make sure to finish adding your accounts to the new app before deleting the old ones.

- **I'm already using the Microsoft Authenticator application for verification codes. How do I switch to one-click push notifications?**  

	Approving a sign-in through push notification is only available for Microsoft accounts, not for third-party accounts like Google or Facebook. For work or school Microsoft accounts, your organization can choose to disable this option, though.

	If you use a Microsoft account for your personal account, and want to switch over to push notifications, you need to add your account again. Re-register the device with your account, and set up push notifications.  

	If your account does not have two-step verification enabled, see [About two-step verification](https://support.microsoft.com/help/12408/microsoft-account-about-two-step-verification) to decide if it's right for you.  

- **When will I be able to use one-click push notifications on iPhone or iPad?**  

	This feature is in beta until the end of August, when it becomes broadly available for Microsoft accounts. If you want to join our beta program, send email to msauthenticator@microsoft.com. Include your first name, last name, and Apple ID in your message.  

- **Do one-click push notifications work for non-Microsoft accounts?**  

	No, push notifications only work with Microsoft accounts and Azure Active Directory accounts. If your work or school uses Azure AD accounts, they may disable this feature.  

- **I restored my device from a backup, and my account codes are missing or not working. What happened?**  

	For security purposes, we don't restore accounts from app backups. If you restore the iOS app from a backup, your accounts are still displayed but they don't work to receive sign-in verifications or generate security codes. After you restore the app, delete your accounts and add them again.

- **I got a new device. How do I remove the Microsoft Authenticator app from my old device and move to the new one?**

	Adding the Microsoft Authenticator app to a new device does not automatically remove it from any other devices. To manage which devices are configured for your account, visit the same website that you use to manage two-step verification, and choose to remove old apps.

	For personal Microsoft accounts, this website is your [account security](https://account.microsoft.com/security) page. For work or school Microsoft accounts, this website may be either [MyApps](https://myapps.microsoft.com) or a custom portal that your organization has set up.

## Contact us

If your question wasn't answered here, leave a comment at the bottom of the page. Or, [contact support](https://support.microsoft.com/contactus) and we'll respond to your problem as soon as we can.

If you contact support, include as much of the following information as you can:

- **User ID** – What's the email address you tried to sign in with?
- **General description of the error** – what exact error message did you see?  If there was no error message, describe the unexpected behavior you noticed, in detail.
- **Page** – what page were you on when you saw the error (include the URL)?
- **ErrorCode** - the specific error code you are receiving.
- **SessionId** - the specific session id you are receiving.
- **Correlation ID** – what was the correlation id code generated when the user saw the error.
- **Timestamp** – what was the precise date and time you saw the error (include the timezone)?

Much of this information can be found on your sign-in page. When you don't verify your sign-in in time, select **View details**.

![Sign in error details](./media/multi-factor-authentication-end-user-troubleshoot/view_details.png)

Including this information helps us to solve your problem as quickly as possible.

## Related topics

- [Azure Multi-Factor Authentication FAQ](multi-factor-authentication-faq.md)  
- [About two-step verification](https://support.microsoft.com/help/12408/microsoft-account-about-two-step-verification) for Microsoft accounts
- [Having trouble with two-step verification?](multi-factor-authentication-end-user-troubleshoot.md)
