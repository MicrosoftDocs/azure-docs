---
title: Enable self-service password reset
description: Learn how to enable self-service password reset so your customers can reset their own passwords without admin assistance.
services: active-directory
author: csmulligan
manager: CelesteDG
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 07/28/2023
ms.author: cmulligan
ms.custom: it-pro

#Customer intent: As an it admin, I want to enable self-service password reset so my customers can reset their own passwords without admin assistance.
---

# Enable self-service password reset

Self-service password reset (SSPR) in Microsoft Entra ID for customers gives customers the ability to change or reset their password, with no administrator or help desk involvement. If a customer's account is locked or they forget their password, they can follow prompts to unblock themselves and get back to work.

## How does the password reset process work?

The self-service password uses the email one-time passcode (Email OTP) authentication. When enabled, customer users who forgot their passwords use Email OTP authentication. With one-time passcode authentication, users verify their identity by entering the one-time passcode sent to their email address, and are then prompted to change their password.

The following screenshots show the self-service password rest flow. From the app, the customer chooses to sign-in. On the sign-in page, the user types their email and selects **Next**. If users forgot their password, they choose the **Forgot password?** option. Microsoft Entra ID sends the passcode to email address provided on the first page. The customer needs to type the passcode to continue. 

:::image type="content" source="media/how-to-enable-password-reset-customers/sspr-flow.png" alt-text="Screenshot that shows the self-service password rest flow.":::

## Prerequisites

- If you haven't already created your own Microsoft Entra ID for customers tenant, create one now.
- If you haven't already created a User flow, [create one](how-to-user-flow-sign-up-sign-in-customers.md) now.

## Enable self-service password reset for customers

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com).
1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to the customer tenant you created earlier.
1. Browse to **Identity** > **External Identities** > **User flows**.
1. From the list of **User flows**, select the user flow you want to enable SSPR.
1. Make sure that the sign-up user flow registers **Email with password** as an authentication method under **Identity providers**.

    :::image type="content" source="media/how-to-enable-password-reset-customers/email-authentication-method.png" alt-text="Screenshot that shows how to enable email authentication.":::

### Enable email one-time passcode

To enable self-service password reset, you need to enable the email one-time passcode (Email OTP) authentication method for all users in your tenant. To ensure that the Email OTP feature is enabled follow the steps below:

   1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com).
   
   1. Browse to **Identity** > **Protection** > **Authentication methods**. 

   1. Under **Policies** > **Method** select **Email OTP (preview)**.
   
      :::image type="content" source="media/how-to-enable-password-reset-customers/authentication-methods.png" alt-text="Screenshot that shows authentication methods.":::
   
   1. Under **Enable and Target** enable Email OTP and select **All users** under **Include**.
   
      :::image type="content" source="media/how-to-enable-password-reset-customers/enable-otp.png" alt-text="Screenshot of enabling OTP.":::

1. Select **Save**.

### Enable the password reset link

You can hide, show or customize the self-service password reset link on the sign-in page. 

1. In the search bar, type and select **Company Branding**.
1. Under **Default sign-in** select **Edit**.
1. On the **Sign-in form** tab, scroll to the **Self-service password reset** section and select **Show self-service password reset**. 
   
   :::image type="content" source="media/how-to-customize-branding-customers/company-branding-self-service-password-reset.png" alt-text="Screenshot of the company branding Self-service password reset.":::

1. Select **Review + save** and **Save** on the **Review** tab. 

For more details, check out the [Customize the neutral branding in your customer tenant](how-to-customize-branding-customers.md#to-customize-self-service-password-reset) article.

## Test self-service password reset

To go through the self-service password reset flow:

1. Open your  application, and select **Sign-in**.

1. In the sign-in page, enter your **Email address** and select **Next**.
	
   :::image type="content" source="media/how-to-enable-password-reset-customers/sign-in.png" alt-text="Screenshot that shows the sign-in page.":::
    
1. Select the **Forgot password?** link.

   :::image type="content" source="media/how-to-enable-password-reset-customers/forgot-password.png" alt-text="Screenshot that shows the forgot password link.":::

1. Enter the one-time passcode sent to your email address.

   :::image type="content" source="media/how-to-enable-password-reset-customers/enter-code.png" alt-text="Screenshot that shows the enter code option.":::

1. Once you're authenticated, you're prompted to enter a new password. Provide a **New password**, and **Confirm password**, then select **Reset password** to sign in to your application.

   :::image type="content" source="media/how-to-enable-password-reset-customers/update-password.png" alt-text="Screenshot that shows the update password screen.":::

## Next steps

- Add [Google](how-to-google-federation-customers.md) or [Facebook](how-to-facebook-federation-customers.md) federation.
