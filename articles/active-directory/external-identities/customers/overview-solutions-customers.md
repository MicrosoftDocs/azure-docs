---
title: Overview of the Woodgrove Groceries demo
description: Learn about the customer identity and access management solutions for your customer-facing apps that are provided by Microsoft Entra ID for customers.
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: conceptual
ms.date: 05/10/2023
ms.author: mimart
ms.custom: it-pro

---
# Overview of the Woodgrove Groceries demo

Microsoft Entra ID for customers offers solutions that let you quickly add intuitive, user-friendly sign-up and sign-up experiences for your customer apps. The Woodgrove Groceries demo environment illustrates several of the most common authentication experiences that can be configured for your customer-facing apps.

## Get started

To try out the demo environment, go to [Woodgrove Groceries](https://woodgrovedemo.com/) and select from a list of use cases that illustrate different sign-in options and business cases.

:::image type="content" source="media/overview-solutions-customers/demo-woodgrove.png" alt-text="Screenshot of the Woodgrove Groceries demo home page.":::

## Use cases

### Sign-up with an email and password

One of the most common ways for users to sign up for an app is by creating an account using their email and a password. The **Common use case** option illustrates how to create an account from the sign-in page by selecting **No account? Create one**.

:::image type="content" source="media/overview-solutions-customers/use-case-common.png" alt-text="Screenshot of the common use case demo.":::

When you enter an email address to create an account, your email is verified through a one-time passcode. Then you can create a new password and provide more details, such as your name, country or region, and other information. Once your account is create, your email becomes your sign-in ID.

### Self-service password reset

Self-service password reset (SSPR) gives users the ability to change or reset their password, with no administrator or help desk involvement. If a user's account is locked or they forget their password, they can follow prompts to unblock themselves and get back to work.

Before you start, make sure you've run one of the sign-up use cases to create an account with Woodgrove Groceries. Then select the password reset use case to try it out. On the sign-in page, enter your email, and select **Next**. Then, select the **Forgot password?** link. Enter the verification code sent to your mailbox, and select next. Then, enter a password, and reenter the password, and select next.

To set up self-service password reset for your customers see the [Enable self-service password reset](how-to-enable-password-reset-customers.md) article.

### Sign-in with a social account

You can offer your customers the ability to sign in with their existing social or enterprise accounts, without having to create a new account. On the sign-in page, select one of the identity providers, such as Google or Facebook. Then you're redirected to the selected provider's to complete the sign-in process.

:::image type="content" source="media/overview-solutions-customers/use-case-social.png" alt-text="Screenshot of the social sign-in use case.":::

To allow your customers to sign up and sign in using their social accounts, you can navigate to **External Identities** > **All identity providers** in the admin center. You can find the exact steps for adding Google and Facebook as identity providers in the following links for [Google](how-to-google-federation-customers.md) and for [Facebook](how-to-facebook-federation-customers.md).  

### Sign-up with a one-time passcode

Email one-time passcode sign-in method is a type of passwordless authentication option for your email account identity provider. With email one-time passcode, users can sign up and sign-in to your app using an email as their primary sign-in identifier. They don't need to create and remember passwords. During the sign-in, users are asked to enter their email address, to which Microsoft Entra ID sends a one-time passcode. The users then open they mailbox and enter the passcode set to them into the sign-in page.

:::image type="content" source="media/overview-solutions-customers/use-case-passcode.png" alt-text="Screenshot of the one-time passcode use case.":::

You can enable email one-time passcode in the admin center under **Authentication methods**. For the exact steps, see [Enable email one-time passcode](how-to-enable-password-reset-customers.md#enable-email-one-time-passcode).

### Sign-in using your own business logic

When users authenticate to your application with Microsoft Entra ID, a security token is returned to your application. The security token contains claims that are statements about the user, such as name, unique identifier, or application roles. Beyond the default set of claims that are contained in the security token you can define your own custom claims from external systems using a REST API you develop.
 
In this use case, you can sign in or sign up with your credentials. Then after you're successfully authenticated, from the top bar select your name and check your profile. It contains information that return by the Microsoft Entra custom extension REST API.

If you want to understand how custom extensions work, you can refer to the [Custom extension overview](/azure/active-directory/develop/custom-extension-overview) article. For information on custom claims providers, you can check out the [Custom claims provider](/azure/active-directory/develop/custom-claims-provider-overview) article.

### Edit your account

Profile editing policy lets you manage your profile attributes, like display name, surname, given name, city, and others. After you update your profile, sign out and sign in again.

To edit your profile on the **Woodgrove Groceries** page, select the icon with your name, located in the top-right corner of the page. After making your changes, select **Save**.

### Delete your account

If you would like to delete your account and personal information, visit the **Delete my account** page. Once you delete your account, you can't reactivate it. After a couple of minutes, you'll be able to sign up again with the same credentials.

To delete your account on the **Woodgrove Groceries** page, select the icon with your name located in the top-right corner of the page. On the **Edit your profile** page select **Delete your account**.

## Next steps

- Learn more about [planning for Microsoft Entra ID for customers](concept-planning-your-solution.md).
- [Create a tenant](quickstart-tenant-setup.md).
