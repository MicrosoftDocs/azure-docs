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

In order to get back into your account you have two options. The first is, if you have set up an alternate authentication phone number you can use this to get back into your account and change your security settings. The second is to ask your administrator to clear your settings.

If your phone was lost or stolen, we also recommend that you have your administrator reset your app passwords and clear any remembered devices. If your admin isn't sure how to accomplish this, point them to this article: [Manage users and devices](multi-factor-authentication-manage-users-and-devices.md#delete-users-existing-app-passwords).


### Use an alternate phone number

If you have specified a secondary authentication phone number you can sign-in using it.

To sign in using the alternate phone number, follow these steps:

1. Sign in as you normally would.
2. When prompted to further verify your account, choose **Use a different verification option**.

	![Different Verification](./media/multi-factor-authentication-end-user-manage/differentverification.png)

3. Select the phone number that you have access to.

	![Alternate phone](./media/multi-factor-authentication-end-user-manage/altphone2.png)

4. After you're back in your account, [manage your settings](multi-factor-authentication-end-user-manage-settings.md) to change your authentication phone number.

>[AZURE.IMPORTANT]
>It is important to configure a secondary authentication phone number.  Because your primary phone number and your mobile app are probably on the same phone, the secondary phone number is the only way you will be able to get back into your account if your phone is lost or stolen.

### Clear your settings

If you have not configured a secondary authentication phone number then you will have to contact your administrator and have them clear you settings so the next time you sign-in, you will be prompted to [set up your account](multi-factor-authentication-end-user-first-time.md) again.


## I am not receiving a text or call on my phone

There are several reasons why you may try to sign in, but not receive the text or phone call. If you've successfully received texts or phone calls to your phone in the past, it means this is probably an issue with the phone provider, not the way your account is set up. Make sure that you have good cell signal, and if you are trying to receive a text message make sure that your phone and service plan support text messages.

If you've waited several minutes for a text or call, the fastest way to get into your account is to try a different option.

1. Select **Use a different verification option** on the page that's waiting for your verification.

	![Different Verification](./media/multi-factor-authentication-end-user-troubleshoot/diff_option.png)

2. Select the phone number or delivery method you want to use.

	Be aware that if you received multiple verification codes, only the newest one will work.

If you don’t have another method configured, contact your admin and ask them to clear you settings so the next time you sign-in, you will be prompted to [setup multi-factor authentication](multi-factor-authentication-end-user-first-time.md) again.


If you often have delays due to bad cell signal, we recommend you use the [Microsoft Authenticator app](multi-factor-authentication-microsoft-authenticator.md) on your smartphone. The app is capable of generating random security codes that you use to sign in, and these don't require any cell signal or internet connection.


## App passwords are not working

First, make sure that you have entered the app password correctly.  If it is still not working try signing-in and [create a new app password](multi-factor-authentication-end-user-app-passwords.md).  If this does not work, contact your administrator and have them [delete your existing app passwords](multi-factor-authentication-manage-users-and-devices.md#delete-users-existing-app-passwords) and then create a new one and use that one.

## I didn't find an answer to my problem.

If you've tried these troubleshooting steps but are still running into problems, contact your administrator or the person who set up multi-factor authentication for you and see if they can assist you.

Also, you can post a question on the [Azure AD Forums](https://social.msdn.microsoft.com/forums/azure/home?forum=WindowsAzureAD), [Search the Microsoft Knowledge Base (KB)](https://www.microsoft.com/en-us/Search/result.aspx?q=azure%20active%20directory%20connect&form=mssupport) or [contact support](https://support.microsoft.com/contactus) and we'll take a look at your problem as soon as we can.

When you contact support, include the following information:

- **User ID** – What's the email address you tried to sign in with??
- **General description of the error** – what exact error message did you see?  If there was no error message, describe the unexpected behavior you noticed, in detail.
- **Page** – what page were you on when you saw the error (include the URL)?
- **ErrorCode** - the specific error code you are receiving.
- **SessionId** - the specific session id you are receiving.
- **Correlation ID** – what was the correlation id code generated when the user saw the error.
- **Timestamp** – what was the precise date and time you saw the error (include the timezone)?

Much of this information can be found on your sign-in page. When you don't verify your sign-in in time, select **View details**.

![Sign in error details](./media/multi-factor-authentication-end-user-troubleshoot/view_details.png)

Including this information will help us to solve your problem as quickly as possible.
