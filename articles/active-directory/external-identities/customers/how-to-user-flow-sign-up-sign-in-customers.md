---
title: Create a sign-up and sign-in user flow
description: Learn how to create a sign-up and sign-in user flow for your customer-facing app.
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

# Create a sign-up and sign-in user flow for customers  

You can easily create a simple sign-up and sign-in experience for your customers by adding a user flow to your application. The user flow defines the series of sign-up steps customers follow and the sign-in methods they can use (such as email and password, one-time passcodes, or social accounts from [Google](how-to-google-federation-customers.md) or [Facebook](how-to-facebook-federation-customers.md)). You can also collect information from customers during sign-up by selecting from a series of built-in attributes or adding your own custom attributes.

You can create multiple user flows if you have multiple applications that you want to offer to customers. Or, you can use the same user flow for many applications. However, an application can have only one user flow.

## Prerequisites

- **An Azure AD customer tenant**: Before you begin, create your Azure AD customer tenant. You can set up a [free trial](https://aka.ms/ciam-free-trial), or you can create a new customer tenant in Azure AD.
- **Email one-time passcode enabled (optional)**: If you want customers to use their email address and a one-time passcode each time they sign in, make sure Email one-time passcode is enabled at the tenant level (in the [Microsoft Entra admin center](https://entra.microsoft.com/), navigate to **External Identities** > **All Identity Providers** > **Email One-time-passcode**).
- **Custom attributes defined (optional)**: User attributes are values collected from the user during self-service sign-up. Azure AD comes with a built-in set of attributes, but you can [define custom attributes to collect during sign-up](how-to-define-custom-attributes.md). Define custom attributes in advance so they'll be available when you set up your user flow. Or you can create and add them later.

## Create and customize a user flow

Follow these steps to create a user flow a customer can use to sign in or sign up for an application. These steps describe how to add a new user flow, select the attributes you want to collect, and change the order of the attributes on the sign-up page.

### To add a new user flow

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/).

1. If you have access to multiple tenants, use the **Directories + subscriptions** filter in the top menu to switch to your customer tenant.

1. In the left pane, select **Azure Active Directory** > **External Identities** > **User flows**.

1. Select **New user flow**.

   :::image type="content" source="media/how-to-user-flow-sign-up-sign-in-customers/new-user-flow.png" alt-text="Screenshot of the new user flow option.":::

1. On the **Create** page, enter a **Name** for the user flow (for example, "SignUpSignIn").

1. Under **Identity providers**, select the **Email Accounts** check box, and then select one of these options:

   - **Email with password**: Allows new users to sign up and sign in using an email address as the sign-in name and a password as their first-factor authentication method.

   - **Email one-time passcode**: Allows new users to sign up and sign in using an email address as the sign-in name and email one-time passcode as their first-factor authentication method.

   :::image type="content" source="media/how-to-user-flow-sign-up-sign-in-customers/create-user-flow-identity-providers.png" alt-text="Screenshot of Identity provider options on the Create a user flow page.":::

1. Under **User attributes**, choose the attributes you want to collect from the user during sign-up. Select **Show more** to choose from additional attributes, such as **Job Title**, **Display Name**, and **Postal Code**.

   :::image type="content" source="media/how-to-user-flow-sign-up-sign-in-customers/user-attributes.png" alt-text="Screenshot of the user attribute options on the Create a user flow page.":::

1. Select **OK**.

1. Select **Create** to create the user flow.

### To select the layout of the attribute collection page

You can choose the order in which the attributes are displayed on the sign-up page.

1. In the [Microsoft Entra admin center](https://entra.microsoft.com/), select **Azure Active Directory**.

1. In the left pane, select **Azure Active Directory** > **External Identities** > **User flows**.

1. From the list, select your user flow.

1. Under **Customize**, select **Page layouts**.

   The attributes you chose to collect are listed. You can change the attribute label, type, and whether it’s required. You can also change the order of display by selecting an attribute, and then select **Move up**, **Move down**, **Move to the top**, or **Move to the bottom**.

   :::image type="content" source="media/how-to-user-flow-sign-up-sign-in-customers/page-layouts.png" alt-text="Screenshot of page layout options for a user flow.":::

1. Select **Save**.

1. Select **Create**. The new user flow appears in the user flows list. (You might need to refresh the page.)

## Add your application to the user flow

If you've already registered your application in your customer tenant, you can add it to the new user flow. This step activates the sign-up and sign-in experience for users who visit your application. An application can have only one user flow, but a user flow can be used by multiple applications.

1. In the [Microsoft Entra admin center](https://entra.microsoft.com/), select **Azure Active Directory** > **External Identities** > **User flows**.

1. From the list, select your user flow.

1. In the left menu, under **Use**, select **Applications**.

1. Select **Add application**.

   :::image type="content" source="media/how-to-user-flow-sign-up-sign-in-customers/assign-user-flow.png" alt-text="Screenshot showing selecting an application for the user flow.":::

1. Select the application from the list. Or use the search box to find the application, and then select it.

1. Choose **Select**.

## Next steps

- [Enable password reset](how-to-enable-password-reset-customers.md).
- Add [Google](how-to-google-federation-customers.md) or [Facebook](how-to-facebook-federation-customers.md) federation.