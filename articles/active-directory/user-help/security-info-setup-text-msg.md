---
title: Set up security info to use text messaging - Azure Active Directory | Microsoft Docs
description: Set up your security info to verify your identity using a text (SMS) message.
services: active-directory
author: eross-msft
manager: mtillman
ms.reviewer: sahenry

ms.service: active-directory
ms.workload: identity
ms.component: user-help
ms.topic: conceptual
ms.date: 07/30/2018
ms.author: lizross
---

# Set up security info to use text messaging (preview)

[!INCLUDE [preview-notice](../../../includes/active-directory-end-user-preview-notice-security-info.md)]

Setting up your security info requires you to sign in to your work or school account and then complete the registration process. If you've never set up your security info, you'll be asked to do it now.

## Set up text messaging

Depending on your organization’s settings, you may be prompted to add text messaging to your security info when you sign in. Otherwise, to begin setting up text messaging in security info, follow the steps in [Manage your security info](security-info-manage-settings.md).

The text message option is a part of the phone option, so you'll set everything up the same way you would for your phone number, but instead of having Microsoft call you, you'll choose to use a text message. If you don't see the phone option, it's possible that your organization doesn't allow you to use a phone number for verification. If this is the case, you'll need to choose another method or contact your administrator for more help.

### To use a text message

1. Select the **Phone** option.

    The **Set up your phone** wizard appears.

    ![Set up your country or region code and phone number](media/security-info/security-info-keep-secure-setup-text.png)

2. Pick your **Country or Region** from the drop-down box, type your phone number (including area code, if applicable) into the **Phone Number** box, select the **Text me a code** option, and then select **Next**.

    You'll receive a text message with a code you'll need to enter into a verification page.

    ![Verification page to enter text message code](media/security-info/security-info-keep-secure-verify-text-msg.png)

    Your security info updates to send you a text message to verify your identity when using two-step verification or self-service password reset.

    >[!Note]
    >If you want to receive a phone call instead of a text message, follow the steps in the [Set up security info to use phone calls](security-info-setup-phone-number.md) article.

## Additional security info options

You have options for how your organization contacts you to verify your identity, based on what's you're trying to do. The options include:

- **Authenticator app.** Download and use an authenticator app to get either an approval notification or a randomly generated approval code for two-step verification or password reset. For step-by-step instructions about how to set up and use the Microsoft Authenticator app, see [Set up security info to use an authenticator app](security-info-setup-auth-app.md).

- **Mobile device or work phone call.** Enter your mobile device number and get a phone call for two-step verification or password reset. For step-by-step instructions about how to verify your identity with a phone number, see [Set up security info to use phone calls](security-info-setup-phone-number.md).

- **Email address.** Enter your work or school email address to get an email for password reset. This option isn't available for two-step verification. For step-by-step instructions about how to set up your email, see [Set up security info to use email](security-info-setup-email.md).
   
    >[!Note]
    >If some of these options are missing, it's most likely because your organization doesn't allow those methods. If this is the case, you'll need to choose an available method or contact your administrator for more help.

- **Security questions.** Answer some security questions created by your administrator for your organization. This option is only available for password reset and not for two-step verification. For step-by-step instructions about how to set up your security questions, see the [Set up security info to use security questions](security-info-setup-questions.md) article.

## Next steps

- If you need to update your security info, follow the instructions in the [Manage your security info](security-info-manage-settings.md) article.

- Reset your password if you've lost or forgotten it, from the [Password reset portal](https://passwordreset.microsoftonline.com/) or follow the steps in the [Reset your work or school password](user-help-reset-password.md) article.

- Get troubleshooting tips and help for sign-in problems in the [Can't sign in to your Microsoft account](https://support.microsoft.com/help/12429/microsoft-account-sign-in-cant) article.