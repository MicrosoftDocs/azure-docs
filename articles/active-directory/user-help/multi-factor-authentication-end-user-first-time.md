---
title: Set up your two-factor verification methods overview - Azure Active Directory | Microsoft Docs
description: Overview about how to set up your two-factor verification methods for two-factor verification.
services: active-directory
author: eross-msft
manager: daveba

ms.service: active-directory
ms.subservice: user-help
ms.workload: identity
ms.topic: overview
ms.date: 08/12/2019
ms.author: lizross
ms.collection: M365-identity-device-management
---

# Set up your two-factor verification methods overview

Your organization has turned on two-factor verification, meaning that your work or school account sign-in now requires a combination of your username, your password, and a mobile device or phone. Your organization turned on this extra verification because it's more secure than just a password, relying on two forms of authentication: something you know and something you have with you. Two-factor verification can help to prevent malicious hackers from pretending to be you, because even if they have your password, odds are that they don't have your device, too.

>[!Important]
>This content is intended for users. If you're an administrator, you can find more information about how to set up and manage your Azure Active Directory (Azure AD) environment in the [Azure Active Directory Documentation](https://docs.microsoft.com/azure/active-directory).

## Who decides if you use this feature?

Depending on your account type, your organization might decide that you must use two-factor verification, or you might be able to decide for yourself.

- **Work or school account.** If you're using a work or school account (for example, alain@contoso.com), it's up to your organization whether you must use two-factor verification, along with the specific verification methods. Because your organization has decided you must use this feature, there is no way for you to individually turn it off.

- **Personal Microsoft account.** You can choose to set up two-factor verification for your personal Microsoft accounts (for example, alain@outlook.com). If you're having problems with two-factor verification and your personal Microsoft account, see [Turning two-factor verification on or off for your Microsoft account](https://support.microsoft.com/help/4028586/microsoft-account-turning-two-step-verification-on-or-off). Because you choose whether to use this feature, you can turn it on and off whenever you want.

## Access the Additional security verification page

After your organization turns on and sets up two-factor verification, you’ll get a prompt telling you to provide more information to help keep your account secure.

![More info required prompt](media/multi-factor-authentication-verification-methods/multi-factor-authentication-initial-prompt.png)

### To access the Additional security verification page

1. Select **Next** from the **More information required** prompt.

    The **Additional security verification** page appears.

2. From the **Additional security verification** page, you must decide which two-factor verification method to use to verify you are who you say you are after signing into your work or school account. You can select:

    | Contact method | Description |
    | --- | --- |
    | Mobile app | <ul><li>**Receive notifications for verification.** This option pushes a notification to the authenticator app on your smartphone or tablet. View the notification and, if it is legitimate, select **Authenticate** in the app. Your work or school may require that you enter a PIN before you authenticate.</li><li>**Use verification code.** In this mode, the authenticator app generates a verification code that updates every 30 seconds. Enter the most current verification code in the sign-in screen.<br>The Microsoft Authenticator app is available for [Android](https://go.microsoft.com/fwlink/?linkid=866594) and [iOS](https://go.microsoft.com/fwlink/?linkid=866594).</li></ul> |
    | Authentication phone | <ul><li>**Phone call** places an automated voice call to the phone number you provide. Answer the call and press the pound key (#) on the phone keypad to authenticate.</li><li>**Text message** ends a text message containing a verification code. Following the prompt in the text, either reply to the text message or enter the verification code provided into the sign-in interface.</li></ul> |
    | Office phone | Places an automated voice call to the phone number you provide. Answer the call and press the pound key (#) on the phone keypad to authenticate. |

## Next steps

After you've accessed the **Additional security verification** page, you must select and set up your two-factor verification method:

- [Set up your mobile device as your verification method](multi-factor-authentication-setup-phone-number.md)

- [Set up your office phone as your verification method](multi-factor-authentication-setup-office-phone.md)

- [Set up the Microsoft Authenticator app as your verification method](multi-factor-authentication-setup-auth-app.md)

## Related resources

- [Manage your two-factor verification method settings](multi-factor-authentication-end-user-manage-settings.md)

- [Manage app passwords](multi-factor-authentication-end-user-app-passwords.md)

- [Sign-in using two-factor verification](multi-factor-authentication-end-user-signin.md)

- [Get help with two-factor verification](multi-factor-authentication-end-user-troubleshoot.md) 
