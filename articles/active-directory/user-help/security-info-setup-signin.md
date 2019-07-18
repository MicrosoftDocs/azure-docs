---
title: Set up security info (preview) from your sign-in prompt - Azure Active Directory | Microsoft Docs
description: How to set up security info for your work or school account, if you're prompted from your organization's sign-in page.
services: active-directory
author: eross-msft
manager: daveba
ms.reviewer: sahenry

ms.service: active-directory
ms.workload: identity
ms.subservice: user-help
ms.topic: overview
ms.date: 02/13/2019
ms.author: lizross
ms.collection: M365-identity-device-management
---

# Set up your security info (preview) from the sign-in page prompt
You can follow these steps if you're prompted to set up your security info immediately after you sign-in to your work or school account.

You'll only see this prompt if you haven’t set up the security info required by your organization. If you've previously set up your security info, but you want to make changes, you can follow the steps in the various method-based how-to articles. For more information, see [Add or update your security info overview](security-info-add-update-methods-overview.md).

[!INCLUDE [preview-notice](../../../includes/active-directory-end-user-preview-notice-security-info.md)]

## Sign in to your work or school account
After you sign in to your work or school account, you'll see a prompt that asks you to provide more information before it lets you access your account.

![Prompt asking for more info](media/security-info/securityinfo-prompt.png)

## Set up your security info using the wizard
Follow these steps to set up your security info for your work or school account from the prompt.

>[!Important]
>This is only an example of the process. Depending on your organization's requirements, your administrator might have set up different verification methods that you'll need to set up during this process. For this example, we're requiring two methods, the Microsoft Authenticator app and a mobile phone number for verification calls or text messages.

1. After you select **Next** from the prompt, a **Keep your account secure wizard** appears, showing the first method your administrator and organization require you to set up. For this example, it's the Microsoft Authenticator app.

   > [!Note]
   > If you want to use an authenticator app other than the Microsoft Authenticator app, select the **I want to use a different authenticator app** link.
   > 
   > If your organization lets you choose a different method besides the authenticator app, you can select the **I want to set up a different method link**.

    ![Keep your account secure wizard, showing the auth app download page](media/security-info/securityinfo-prompt-get-auth-app.png)

2. Select **Download now** to download and install the Microsoft Authenticator app on your mobile device, and then select **Next**. For more information about how to download and install the app, see [Download and install the Microsoft Authenticator app](user-help-auth-app-download-install.md).

    ![Keep your account secure wizard, showing the authenticator Set up your account page](media/security-info/securityinfo-prompt-auth-app-setup-acct.png)

3. Remain on the **Set up your account** page while you set up the Microsoft Authenticator app on your mobile device.

4. Open the Microsoft Authenticator app, select to allow notifications (if prompted), select **Add account** from the **Customize and control** icon on the upper-right, and then select **Work or school account**.

5. Return to the **Set up your account** page on your computer, and then select **Next**.

    The **Scan the QR code** page appears.

    ![Scan the QR code using the Authenticator app](media/security-info/securityinfo-prompt-auth-app-qrcode.png)

6. Scan the provided code with the Microsoft Authenticator app QR code reader, which appeared on your mobile device after you created your work or school account in Step 5.

    The authenticator app should successfully add your work or school account without requiring any additional information from you. However, if the QR code reader can't read the code, you can select the **Can't scan the QR code link** and manually enter the code and URL into the Microsoft Authenticator app. For more information about manually adding a code, see [Manually add an account to the app](user-help-auth-app-add-account-manual.md).

7. Select **Next** on the **Scan the QR code** page on your computer.

    A notification is sent to the Microsoft Authenticator app on your mobile device, to test your account.

    ![Test your account with the authenticator app](media/security-info/securityinfo-prompt-test-app.png)

8. Approve the notification in the Microsoft Authenticator app, and then select **Next**.

    ![Success notification, connecting the app and your account](media/security-info/securityinfo-prompt-auth-app-success.png).

    Your security info is updated to use the Microsoft Authenticator app by default to verify your identity when using two-step verification or password reset.

9. On the **Phone** set up page, choose whether you want to receive a text message or a phone call, and then select **Next**. For the purposes of this example, we're using text messages, so you must use a phone number for a device that can accept text messages.

    ![Begin setting up your phone number for text messaging](media/security-info/securityinfo-prompt-text-msg.png)

    A text message is sent to your phone number. If would prefer to get a phone call, the process is the same. However, you'll receive a phone call with instructions, instead of a text message.

10. Enter the code provided by the text message sent to your mobile device, and then select **Next**.

    ![Test your account with the text message](media/security-info/securityinfo-prompt-text-msg-enter-code.png)

11. Review the success notification, and then select **Done**.

    ![Success notification](media/security-info/securityinfo-prompt-call-answered-success.png)

    Your security info is updated to use text messaging as a backup method to verify your identity when using two-step verification or password reset.

12. Review the **Success** page to verify that you've successfully set up both the Microsoft Authenticator app and a phone (either text message or phone call) method for your security info, and then select **Done**.

    ![Wizard successfully completed page](media/security-info/securityinfo-prompt-setup-success.png)

## Next steps

- To change, delete, or update default security info methods, see:

    - [Set up security info for an authenticator app](security-info-setup-auth-app.md).

    - [Set up security info for text messaging](security-info-setup-text-msg.md).

    - [Set up security info to use phone calls](security-info-setup-phone-number.md).

    - [Set up security info to use email](security-info-setup-email.md).

    - [Set up security info to use pre-defined security questions](security-info-setup-questions.md).

- For information about how to sign in using your specified method, see [How to sign in](user-help-sign-in.md).

- Reset your password if you've lost or forgotten it, from the [Password reset portal](https://passwordreset.microsoftonline.com/) or follow the steps in the [Reset your work or school password](user-help-reset-password.md) article.

- Get troubleshooting tips and help for sign-in problems in the [Can't sign in to your Microsoft account](https://support.microsoft.com/help/12429/microsoft-account-sign-in-cant) article.