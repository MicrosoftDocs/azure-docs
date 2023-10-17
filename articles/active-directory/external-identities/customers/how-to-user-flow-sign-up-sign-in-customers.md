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
ms.date: 09/04/2023
ms.author: mimart
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to
---

# Create a sign-up and sign-in user flow for customers  

You can create a simple sign-up and sign-in experience for your customers by adding a user flow to your application. The user flow defines the series of sign-up steps customers follow and the sign-in methods they can use (such as email and password, one-time passcodes, or social accounts from [Google](how-to-google-federation-customers.md) or [Facebook](how-to-facebook-federation-customers.md)). You can also collect information from customers during sign-up by selecting from a series of built-in user attributes or adding your own custom attributes.

You can create multiple user flows if you have multiple applications that you want to offer to customers. Or, you can use the same user flow for many applications. However, an application can have only one user flow.

## Prerequisites

- **a Microsoft Entra customer tenant**: Before you begin, create your Microsoft Entra customer tenant. You can set up a <a href="https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl" target="_blank">free trial</a>, or you can create a new customer tenant in Microsoft Entra ID.
- **Email one-time passcode enabled (optional)**: If you want customers to use their email address and a one-time passcode each time they sign in, make sure Email one-time passcode is enabled at the tenant level (in the [Microsoft Entra admin center](https://entra.microsoft.com/), navigate to **External Identities** > **All Identity Providers** > **Email One-time-passcode**).
- **Custom attributes defined (optional)**: User attributes are values collected from the user during self-service sign-up. Microsoft Entra ID comes with a built-in set of attributes, but you can [define custom attributes to collect during sign-up](how-to-define-custom-attributes.md). Define custom attributes in advance so they're available when you set up your user flow. Or you can create and add them later.
- **Identity providers defined (optional)**: You can set up federation with [Google](how-to-google-federation-customers.md) or [Facebook](how-to-facebook-federation-customers.md) in advance, and then select them as sign-in options as you create the user flow.

## Create and customize a user flow

Follow these steps to create a user flow a customer can use to sign in or sign up for an application. These steps describe how to add a new user flow, select the attributes you want to collect, and change the order of the attributes on the sign-up page.

### To add a new user flow

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com). 

1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to your customer tenant. 

1. Browse to **Identity** > **External Identities** > **User flows**.

1. Select **New user flow**.

   :::image type="content" source="media/how-to-user-flow-sign-up-sign-in-customers/new-user-flow.png" alt-text="Screenshot of the new user flow option.":::

1. On the **Create** page, enter a **Name** for the user flow (for example, "SignUpSignIn").

1. Under **Identity providers**, select the **Email Accounts** check box, and then select one of these options:

   - **Email with password**: Allows new users to sign up and sign in using an email address as the sign-in name and a password as their first-factor authentication method. You can also configure options for showing, hiding, or customizing the self-service password reset link on the sign-in page ([learn more](how-to-customize-branding-customers.md#to-customize-self-service-password-reset)).

   - **Email one-time passcode**: Allows new users to sign up and sign in using an email address as the sign-in name and email one-time passcode as their first-factor authentication method.

   > [!NOTE]
   > The **Microsoft Entra ID Sign up** option is unavailable because although customers can sign up for a local account using an email from another Microsoft Entra organization, Microsoft Entra federation isn't used to authenticate them. **[Google](how-to-google-federation-customers.md)** and **[Facebook](how-to-facebook-federation-customers.md)** become available only after you set up federation with them. [Learn more about authentication methods and identity providers](concept-authentication-methods-customers.md).

   :::image type="content" source="media/how-to-user-flow-sign-up-sign-in-customers/create-user-flow-identity-providers.png" alt-text="Screenshot of Identity provider options on the Create a user flow page.":::

1. Under **User attributes**, choose the attributes you want to collect from the user during sign-up.

   :::image type="content" source="media/how-to-user-flow-sign-up-sign-in-customers/user-attributes.png" alt-text="Screenshot of the user attribute options on the Create a user flow page." lightbox="media/how-to-user-flow-sign-up-sign-in-customers/user-attributes.png":::

1. Select **Show more** to choose from the full list of attributes, including **Job Title**, **Display Name**, and **Postal Code**.

   This list also includes any [custom attributes you defined](how-to-define-custom-attributes.md). Select the checkbox next to each attribute you want to collect from the user during sign-up

   :::image type="content" source="media/how-to-user-flow-sign-up-sign-in-customers/user-attributes-show-more.png" alt-text="Screenshot of the user attribute pane after selecting Show more." lightbox="media/how-to-user-flow-sign-up-sign-in-customers/user-attributes-show-more.png":::

1. Select **OK**.

1. Select **Create** to create the user flow.

##  Disable sign-up in a sign-up and sign-in user flow

If you want your customer users to only sign in and not sign up, you can disable sign-up experience in your user flow by using [Microsoft Graph API](microsoft-graph-operations.md). You need to know the ID of the user flow that you want whose sign-up you want to disable. You can't read the user flow ID from the Microsoft Entra Admin center, but you can retrieve it via Microsoft Graph API if you know the app associated with it.

1. Read the application ID associated with the user flow:
    1. Browse to **Identity > External Identities > User flows**.
    1. From the list, select your user flow.
    1. In the left menu, under **Use**, select **Applications**.
    1. From the list, under **Application (client) ID** column, copy the Application (client) ID.
    
1. Identify the ID of the user flow whose sign-up you want to disable. To do so, [List the user flow associated with the specific application](/graph/api/identitycontainer-list-authenticationeventsflows#example-4-list-user-flow-associated-with-specific-application-id). This's a Microsoft Graph API, which requires you to know the application ID you obtained from the previous step. 

1. [Update your user flow](/graph/api/authenticationeventsflow-update) to disable sign-up. 

    **Example**:
    
    ```http
    PATCH https://graph.microsoft.com/beta/identity/authenticationEventsFlows/{user-flow-id}    
    {    
        "@odata.type": "#microsoft.graph.externalUsersSelfServiceSignUpEventsFlow",    
        "onInteractiveAuthFlowStart": {    
            "@odata.type": "#microsoft.graph.onInteractiveAuthFlowStartExternalUsersSelfServiceSignUp",    
            "isSignUpAllowed": "false"    
      }    
    }
    ```

    Replace `{user-flow-id}` with the user flow ID that you obtained in the previous step. Notice the `isSignUpAllowed` parameter is set to *false*. To re-enable sign-up, make a call to the Microsoft Graph API endpoint, but set the `isSignUpAllowed` parameter to *true*.   

## Next steps

- [Add your application to the user flow](how-to-user-flow-add-application.md)
- [Create custom user attributes and customize the order of the attributes on the sign-up page](how-to-define-custom-attributes.md).
