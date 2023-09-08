---
title: Add an application to a user flow
description: Learn how to add an application to a user flow to associate the application with a sign-up and sign-in user experience. Get guidance for updating the application configuration with application registration and tenant information.
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 07/24/2023
ms.author: mimart
ms.custom: it-pro

---

# Add your application to the user flow

A user flow defines the authentication methods a customer can use to sign in to your application and the information they need to provide during sign-up. After you [create a user flow](how-to-user-flow-sign-up-sign-in-customers.md), you can associate it with one or more of the applications registered in your customer tenant.

Because you might want the same sign-in experience for all of your customer-facing apps, you can add multiple apps to the same user flow. But only one sign-in experience is needed for an application, so you can add each application to just one user flow.

## Prerequisites

- **A sign-up and sign-in user flow**: Before you begin, [create the user flow](how-to-user-flow-sign-up-sign-in-customers.md) that you want to associate with your application.
- **Application registration**: In your customer tenant, [register your application](how-to-register-ciam-app.md).

## Add the application to the user flow

If you already registered your application in your customer tenant, you can add it to the new user flow. This step activates the sign-up and sign-in experience for users who visit your application. An application can have only one user flow, but a user flow can be used by multiple applications.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com).

1. Browse to **Identity** > **External Identities** > **User flows**.

1. From the list, select your user flow.

1. In the left menu, under **Use**, select **Applications**.

1. Select **Add application**.

   :::image type="content" source="media/how-to-user-flow-sign-up-sign-in-customers/assign-user-flow.png" alt-text="Screenshot showing selecting an application for the user flow.":::

1. Select the application from the list. Or use the search box to find the application, and then select it.

1. Choose **Select**.

## Extension app 

You might find an app named **b2c-extensions-app** in the application list. This app is created automatically inside the new directory, and it contains all extension attributes for your customer tenant.
If you want to collect information beyond the built-in attributes, you can create [custom user attributes](how-to-define-custom-attributes.md) and add them to your sign-up user flow. Custom attributes are also known as directory extension attributes, as they extend the user profile information stored in your customer directory. All extension attributes for your customer tenant are stored in the **b2c-extensions-app**. Do not delete this app.
You can learn more about this app [here](/azure/active-directory-b2c/extensions-app). 

## Next steps

- If you selected email with password sign-in, [enable password reset](how-to-enable-password-reset-customers.md).
- Add [Google](how-to-google-federation-customers.md) or [Facebook](how-to-facebook-federation-customers.md) federation.
- [Add multifactor authentication (MFA) to a customer-facing app](how-to-multifactor-authentication-customers.md).