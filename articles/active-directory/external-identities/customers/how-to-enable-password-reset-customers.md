---
title: Enable self-service password reset
description: Learn how to enable self-service password reset so your customers can reset their own passwords without admin assistance.
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 03/03/2023
ms.author: mimart
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to
---

# Enable self-service password reset

Customer Identity Access Management (CIAM) in Azure Active Directory (Azure AD) self-service password reset (SSPR) gives users the ability to change or reset their password, with no administrator or help desk involvement. If a user's account is locked or they forget their password, they can follow prompts to unblock themselves and get back to work.

## How does the password reset process work?

The self-service password uses the **Email OTP (preview)** authentication. When enabled, customer users who forgot their passwords use one-time passcode authentication. With one-time passcode authentication, users verify their identity by entering the one-time passcode sent to their email address, and are then prompted to change their password.

The following screenshots show the self-service password rest flow. From the app, the user chooses to sign-in. On the Azure AD sign-in page, the user types their email and selects **Next**. If users forgot their password, they choose the **Forgot password?** option. Azure AD sends the passcode to email address provided on the first page. The user needs to type the passcode to continue. 

<!--[Screenshots that shows the self-service password rest flow.](./media/sspr/sspr-flow.png)-->

## Enable self-service password reset for customers

1. Sign in to your organization's Azure portal as an Azure AD global administrator, and switch to your customer directory.
1. In the navigation pane, select **Azure Active Directory**.
1. Select **External Identities** > **User flows**.
1. From the list of **User flows**, select the user flow you want to enable SSPR.
1. Make sure that the sign-up user flow registers **Email with password** as an authentication method.

   <!-- ![Screenshot that shows how to enable email authentication.](./media/sspr/email-authentication-method.png)-->

1. To ensure that the email one-time passcode (Email OTP) feature is enabled:

   1. On the Azure home page, select **Azure Active Directory**.

   1. Select **Security** > **Authentication methods** > **Policies**.

   1. Under **Method** select **Email OTP (preview)**.
   
   <!--   ![Screenshot that shows authentication methods.](./media/sspr/authentication-methods.png)-->
   
   1. Under **Enable and Target** enable Email OTP and select **All users** under **Include**.
   
   <!--   ![Screenshot of enabling OTP.](./media/sspr/enable-otp.png)-->

1. Select **Save**.

<!--## (Optional) Customize the SSPR user experience

To customize the self-service password reset experience, see [To customize self-service password reset](5-Customize-default-branding.md#to-customize-self-service-password-reset) in the customization documentation.
-->

## Test self-service password reset

To go through the self-service password reset flow:

1. Open your  application, and select **Sign-in**.

1. In the sign-in page, enter your **Email address** and select **Next**.
	
   <!-- ![Screenshot that shows the sign-in page.](./media/sspr/sign-in.png)-->
    
1. Select the **Forgot password?** link.

   <!-- ![Screenshot that shows the forgot password link.](./media/sspr/forgot-password.png)-->

1. Enter the one-time passcode sent to your email address.

   <!-- ![Screenshot that shows the enter code option.](./media/sspr/enter-code.png)-->

1. Once you're authenticated, you're prompted to enter a new password. Provide a **New password**, and **Confirm password**, then select **Reset password** to sign in to your application.

   <!-- ![Screenshot that shows the update password screen.](./media/sspr/update-password.png)-->

## Next steps

- [Customize the default branding](how-to-customize-branding-customers.md)
