---
title: Set up security info to use a phone number - Azure Active Directory (Preview)| Microsoft Docs
description: Set up your security info to verify your identity using a mobile device or work phone number.
services: active-directory
author: eross-msft
manager: mtillman
ms.reviewer: sahenry

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 07/25/2018
ms.author: lizross
---

# How to: Set up your security info to use your phone number (Preview)

[!INCLUDE[preview-notice](../../../includes/active-directory-end-user-preview-notice-security-info.md)]

Setting up your security info verification method requires you to sign in to your work or school account and then complete the registration process. If you've never set up your verification methods, you'll be asked to do it now.

You have options for how your organization contacts you to verify your identity, based on what's you're trying to do. The options include:

- **Mobile device or work phone call.** Enter your mobile or work phone number to get a verification call or text message for two-step verification or self-service password reset verification. For step-by-step instructions about how to verify your identity with a phone number, see the [Set your verification method to your phone number](#set-your-verification-method-to-your-phone-number) section of this article.

- **Authenticator app.** Download and use an authenticator app to get either an approval notification or a randomly generated approval code for two-step verification or self-service password reset verification. For step-by-step instructions about how to verify your identity with the Microsoft Authenticator app, see the [Set your security info to use an authenticator app](security-info-setup-auth-app.md) article.

- **Mobile device text.** Enter your mobile device number and get a text a code you'll use for two-step verification or self-service password reset verification. For step-by-step instructions about how to verify your identity with a text message (SMS), see the [Set up your security info to use a text message](security-info-setup-text-msg.md) article.

- **Email address.** Enter your work or school email address to get a verification email for self-service password reset. For step-by-step instructions about how to set up your email verification, see the [Set up your security info to use email](security-info-setup-email.md) article.

- **Security questions.** Answer some security questions created by your administrator for your organization for self-service password reset. For step-by-step instructions about how to set up your security questions, see the [Set up your security info to use security questions](security-info-setup-questions.md) article.

>[!Note]
>If some of these options are missing, it's most likely because your organization doesn't allow those methods for secondary verification. If this is the case, you'll need to choose an available verification method or contact your administrator for more help.

## Set your verification method to your phone number

Follow this process to set your security info to use your mobile or office phone number for both two-step verification and self-service password reset.

### To use your phone number

1. Sign in to your work or school account.

    The **More information required** box appears.

    ![More info required box](media/security-info/security-info-more-info.png)

    Depending on your organization, you might be allowed to wait 14 before adding your security info. If you don't see this option, it means that it's not available.

2. Select **Next** to begin setting up your security info.

    The **Keep your account secure** page appears.

     ![Security info page, with two-step verification options](media/security-info/security-info-keep-secure-phone.png)

    >[!Note]
    >If you don't see the phone option, it's possible that your organization doesn't allow you to use a phone number for verification. If this is the case, you'll need to choose another verification method or contact your administrator for more help.

3. Select **Set up** for the **Phone** option.

    The **Setup your phone** wizard appears.

    ![Set up your country or region code and phone number](media/security-info/security-info-keep-secure-setup-phone.png)

4. Pick your **Country or Region** from the drop-down box, type your phone number (including area code, if applicable) into the **Phone Number** box, select the **Call me** option, and then select **Next**.

    You'll receive a phone call to make sure you typed the right phone number. At that time, you'll be asked to push the pound (#) key to confirm and to complete your setup.

    ![Verify your phone screen, showing that the call was successfully answered](media/security-info/security-info-keep-secure-verify-phone-call.png)

    Your security info is updated to use your phone number to verify your identity when using two-step verification or self-service password reset.

    >[!Note]
    >If you want to receive a text message instead of a phone call to your mobile device, follow the steps in the [Set up your security info to use a text message (SMS)](security-info-setup-text-msg.md) article.

## Next steps

- If you need to update your security info, follow the instructions in the [Manage your security info](security-info-manage-settings.md) article.

- Reset your password if you've lost or forgotten it, from the [Password reset portal](https://passwordreset.microsoftonline.com/) or follow the steps in the [Reset your work or school password](user-help-reset-password.md) article.

- Get troubleshooting tips and help for sign-in problems in the [Can't sign in to your Microsoft account](https://support.microsoft.com/help/12429/microsoft-account-sign-in-cant) article.