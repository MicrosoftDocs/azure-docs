---
title: Add a self-service sign-up user flow
description: Create user flows for apps that are built by your organization. Then, users who visit that app can gain a guest account using the options configured in the user flow.
services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 01/16/2023

ms.author: mimart
author: msmimart
manager: CelesteDG
ms.custom: "it-pro"
ms.collection: engagement-fy23, M365-identity-device-management

# Customer intent: As a tenant administrator, I want to set up user flows that allow a user to sign up for an app and create a new guest account. 

---

# Add a self-service sign-up user flow to an app

> [!TIP]
> This article applies to B2B collaboration user flows. If your tenant is configured for customer identity and access management, see [Create a sign-up and sign-in user flow for customers](customers/how-to-user-flow-sign-up-sign-in-customers.md).

For applications you build, you can create user flows that allow a user to sign up for an app and create a new guest account. A self-service sign-up user flow defines the series of steps the user will follow during sign-up, the [identity providers](identity-providers.md) you'll allow them to use, and the user attributes you want to collect. You can associate one or more applications with a single user flow.

> [!NOTE]
> You can associate user flows with apps built by your organization. User flows can't be used for Microsoft apps, like SharePoint or Teams.

## Before you begin

### Add identity providers (optional)

Microsoft Entra ID is the default identity provider for self-service sign-up. This means that users are able to sign up by default with a Microsoft Entra account. In your self-service sign-up user flows, you can also include social identity providers like Google and Facebook, Microsoft Account, and the email one-time passcode feature. For more information, see these articles:

- [Add Google to your list of social identity providers](google-federation.md)
- [Add Facebook to your list of social identity providers](facebook-federation.md)
- [Add Microsoft account as an identity provider](microsoft-account.md)
- [Email one-time passcode authentication](one-time-passcode.md)

### Define custom attributes (optional)

User attributes are values collected from the user during self-service sign-up. Microsoft Entra External ID comes with a built-in set of attributes, but you can create custom attributes for use in your user flow. You can also read and write these attributes by using the Microsoft Graph API. See [Define custom attributes for user flows](user-flow-add-custom-attributes.md).

## Enable self-service sign-up for your tenant

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Before you can add a self-service sign-up user flow to your applications, you need to enable the feature for your tenant. After it's enabled, controls become available in the user flow that let you associate the user flow with an application.

> [!NOTE]
> This setting can also be configured with the [authenticationFlowsPolicy](/graph/api/resources/authenticationflowspolicy?view=graph-rest-1.0&preserve-view=true) resource type in the Microsoft Graph API.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **User settings**, and then under **External users**, select **Manage external collaboration settings**.
1. Set the **Enable guest self-service sign up via user flows** toggle to **Yes**.

   :::image type="content" source="media/self-service-sign-up-user-flow/enable-self-service-sign-up.png" alt-text="Screenshot of the enable guest self-service sign up toggle.":::

5. Select **Save**.
## Create the user flow for self-service sign-up

Next, you'll create the user flow for self-service sign-up and add it to an application.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **External Identities** > **User flows**, and then select **New user flow**.

   :::image type="content" source="media/self-service-sign-up-user-flow/new-user-flow.png" alt-text="Screenshot of the new user flow button.":::

1. Select the user flow type (for example, **Sign up and sign in**), and then select the version (**Recommended** or **Preview**).
1. On the **Create** page, enter a **Name** for the user flow. The name is automatically prefixed with **B2X_1_**.
1. In the **Identity providers** list, select one or more identity providers that your external users can use to log into your application. **Azure Active Directory Sign up** is selected by default. (See [Before you begin](#before-you-begin) earlier in this article to learn how to add identity providers.)
1. Under **User attributes**, choose the attributes you want to collect from the user. For more attributes, select **Show more**. For example, select **Show more**, and then choose attributes and claims for **Country/Region**, **Display Name**, and **Postal Code**. Select **OK**.

   :::image type="content" source="media/self-service-sign-up-user-flow/create-user-flow.png" alt-text="Screenshot of the new user flow creation page. ":::

   > [!NOTE]
   > You can only collect attributes when a user signs up for the first time. After a user signs up, they will no longer be prompted to collect attribute information, even if you change the user flow.

1. Select **Create**.
1. The new user flow appears in the **User flows** list. If necessary, refresh the page.

## Select the layout of the attribute collection form

You can choose order in which the attributes are displayed on the sign-up page. 

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **External Identities** > **User flows**.
3. Select the self-service sign-up user flow from the list.
4. Under **Customize**, select **Page layouts**.
5. The attributes you chose to collect are listed. To change the order of display, select an attribute, and then select **Move up**, **Move down**, **Move to top**, or **Move to bottom**.
6. Select **Save**.

## Add applications to the self-service sign-up user flow

Now you'll associate applications with the user flow to enable sign-up for those applications. New users who access the associated applications will be presented with your new self-service sign-up experience.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **External Identities** > **User flows**
1. Under **Self-service sign up**, select **User flows**.
1. Select the self-service sign-up user flow from the list.
1. In the left menu, under **Use**, select **Applications**.
1. Select **Add application**.

   :::image type="content" source="media/self-service-sign-up-user-flow/assign-app-to-user-flow.png" alt-text="Screenshot of adding an application to the user flow.":::

1. Select the application from the list. Or use the search box to find the application, and then select it.
1. Click **Select**.

## Next steps

- [Add Google to your list of social identity providers](google-federation.md)
- [Add Facebook to your list of social identity providers](facebook-federation.md)
- [Use API connectors to customize and extend your user flows via web APIs](api-connectors-overview.md)
- [Add custom approval workflow to your user flow](self-service-sign-up-add-approvals.md)
