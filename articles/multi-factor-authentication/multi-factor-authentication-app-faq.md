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
	ms.date="09/20/2016"
	ms.author="kgremban"/>

# Microsoft Authenticator application FAQ

The Microsoft Authenticator app replaced the Azure Authenticator app, and is the recommended app when you use Azure Multi-Factor Authentication. This app is available for Windows Phone, Android, and iOS.

## Frequently asked questions

- **I'm already using the Microsoft Authenticator application for security codes. How do I switch to one-click push notifications?**  

	If you use a Microsoft account for your personal account, and want to switch over to push notifications, you need to add your account again. This is because the app uses a one-time password. Re-register the device with your account, and set up push notifications.  

	If your account does not have two-step verification enabled, see [About two-step verification](https://support.microsoft.com/help/12408/microsoft-account-about-two-step-verification) to decide if it's right for you.  

- **When will I be able to use one-click push notifications on iPhone or iPad?**  

	This feature is in beta until the end of August, when it becomes broadly available for Microsoft accounts. If you want to join our beta program, send email to msauthenticator@microsoft.com. Include your first name, last name, and Apple ID in your message.  

- **Do one-click push notifications work for non-Microsoft accounts?**  

	No, push notifications only work with Microsoft accounts and Azure Active Directory accounts. If your work or school uses Azure AD accounts, they may disable this feature.  

- **I restored my device from a backup, and my account codes are missing or not working. What happened?**  

	For security purposes, we don't restore accounts from app backups at this time. If you restore the iOS app from a backup, your accounts are still displayed but they don't work to receive sign-in verifications or generate security codes. After you restore the app, delete your accounts and add them again.

## Related topics

- [Azure Multi-Factor Authentication FAQ](multi-factor-authentication-faq.md)  
- [About two-step verification](https://support.microsoft.com/help/12408/microsoft-account-about-two-step-verification) for Microsoft account  
- [Identity verification apps FAQ](https://support.microsoft.com/help/12414/microsoft-account-identity-verification-apps-faq)
