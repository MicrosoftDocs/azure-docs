---
title: Authentication methods and identity providers for CIAM
description: Learn how to use different authentication methods for your customer sign-in and sign-up in CIAM. 
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: conceptual
ms.date: 05/31/2023
ms.author: mimart
ms.custom: it-pro
---

# Authentication methods and identity providers for customers

Microsoft Entra ID for customers offers several options for authenticating users of your applications. You can let customers create an account in your customer directory using their email and either a password or an email one-time passcode. You can also enable sign-in with a social account.

## Email and password sign-in

Email sign-up is enabled by default in your local account identity provider settings. With the email option, customers can sign up and sign in with their email address and a password.

- **Sign-up**: Customers are prompted for an email address, which is verified at sign-up with a one-time passcode. The customer then enters any other information requested on the sign-up page, for example, display name, given name, and surname. Then they select Continue to create an account.

- **Sign-in**: After the customer signs up and creates an account, they can sign in by entering their email address and password.

- **Password reset**: If you enable email and password sign-in, a password reset link appears on the password page. If the customer forgets their password, selecting this link sends a one-time passcode to their email address. After verification, the customer can choose a new password.

   :::image type="content" source="media/concept-authentication-methods-customers/email-password-sign-in.png" alt-text="Screenshots of the email with password sign-in screens." border="false":::

When you [create a sign-up and sign-in user flow](how-to-user-flow-sign-up-sign-in-customers.md#create-and-customize-a-user-flow), **Email with password** is the default option.

## Email with one-time passcode sign-in

Email with one-time passcode is an option in your local account identity provider settings. With this option, the customer signs in with a temporary passcode instead of a stored password each time they sign in.

- **Sign-up**: Customers can sign up with their email address and request a temporary code, which is sent to their email address. Then they enter this code to continue signing in.

- **Sign-in**: After the customer signs up and creates an account, each time they sign they'll enter their email address and receive a temporary passcode.

   :::image type="content" source="media/concept-authentication-methods-customers/email-passcode-sign-in.png" alt-text="Screenshots of the email with one-time passcode sign-in screens." border="false":::

> [!NOTE]
> If you want to enable [multifactor authentication (MFA)](how-to-multifactor-authentication-customers.md), set your local account authentication method to **Email with password**. If you set your local account option to **Email with one-time passcode**, customers who use this method won't be able to sign in because the one-time passcode is already their first-factor sign-in method and can't be used as a second factor. Currently, other verification methods aren't available for customer scenarios.

When you [create a sign-up and sign-in user flow](how-to-user-flow-sign-up-sign-in-customers.md#create-and-customize-a-user-flow), **Email one-time passcode** is one of the local account options.

## Social identity providers: Facebook and Google

For an optimal sign-in experience, federate with social identity providers whenever possible so you can give your customers a seamless sign-up and sign-in experience. In a customer tenant, you can allow a customer to sign up and sign in using their own Facebook or Google account. When a customer signs up for your app using their social account, the social identity provider creates, maintains, and manages identity information while providing authentication services to applications.

When you enable social identity providers, customers can select from the social identity providers options you've made available on the sign-up page. To set up social identity providers in your customer tenant, you create an application at the identity provider and configure credentials. You obtain a client or app ID and a client or app secret, which you can then add to your customer tenant.

### Google sign-in

By setting up federation with Google, you can allow customers to sign in to your applications with their own Gmail accounts. After you've added Google as one of your application's sign-in options, on the sign-in page, users can sign in to Microsoft Entra ID for customers with a Google account.

The following screenshots show the sign-in with Google experience. In the sign-in page, users select **Sign-in with Google**. At that point, the user is redirected to the Google identity provider to complete the sign-in.

   :::image type="content" source="media/concept-authentication-methods-customers/google-sign-in.png" alt-text="Screenshots of google sign-in screens." border="false":::

Learn how to [add Google as an identity provider](how-to-google-federation-customers.md).
### Facebook sign-in

By setting up federation with Facebook, you can allow invited users to sign in to your applications with their own Facebook accounts. After you've added Facebook as one of your application's sign-in options, on the sign-in page, users can sign-in to Microsoft Entra ID for customers with a Facebook account.

The following screenshots show the sign-in with Facebook experience. In the sign-in page, users select **Sign-in with Facebook**. Then the user is redirected to the Facebook identity provider to complete the sign-in.

   :::image type="content" source="media/concept-authentication-methods-customers/facebook-sign-in.png" alt-text="Screenshots of Facebook sign-in screens." border="false":::

Learn how to [add Facebook as an identity provider](how-to-facebook-federation-customers.md).

### Updating sign-in methods

At any time, you can update the sign-in options you've selected for an app. For example, you can add social identity providers or change the local account sign-in method.

Be aware that when you change sign-in methods, the change affects only new users. Existing users will continue to sign in using their original method. For example, suppose you start out with the email and password sign-in method, and then change to email with one-time passcode. New users will sign in using a one-time passcode, but any users who have already signed up with an email and password will continue to be prompted for their email and password.  

## Next steps

To learn how to add identity providers for sign-in to your applications, refer to the following articles:
- [Add Facebook as an identity provider](how-to-facebook-federation-customers.md)
- [Add Google as an identity provider](how-to-google-federation-customers.md)
