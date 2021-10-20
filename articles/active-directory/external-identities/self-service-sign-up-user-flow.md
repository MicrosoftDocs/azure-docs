---
title: Add a self-service sign-up user flow - Azure AD
description: Create user flows for apps that are built by your organization. Then, users who visit that app can gain a guest account using the options configured in the user flow.
services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 07/26/2021

ms.author: mimart
author: msmimart
manager: CelesteDG
ms.custom: "it-pro"
ms.collection: M365-identity-device-management
---

# Add a self-service sign-up user flow to an app

For applications you build, you can create user flows that allow a user to sign up for an app and create a new guest account. A self-service sign-up user flow defines the series of steps the user will follow during sign-up, the identity providers you'll allow them to use, and the user attributes you want to collect. You can associate one or more applications with a single user flow.

> [!NOTE]
> You can associate user flows with apps built by your organization. User flows can't be used for Microsoft apps, like SharePoint or Teams.

## Before you begin

### Add identity providers (optional)

Azure AD is the default identity provider for self-service sign-up. This means that users are able to sign up by default with an Azure AD account. In your self-service sign-up user flows, you can also include social identity providers like Google and Facebook, Microsoft Account, and Email One-time Passcode. For more information, see these articles:

- [Microsoft Account identity provider](microsoft-account.md)
- [Email one-time passcode authentication](one-time-passcode.md)
- [Add Facebook to your list of social identity providers](facebook-federation.md)
- [Add Google to your list of social identity providers](google-federation.md)

### Define custom attributes (optional)

User attributes are values collected from the user during self-service sign-up. Azure AD comes with a built-in set of attributes, but you can create custom attributes for use in your user flow. You can also read and write these attributes by using the Microsoft Graph API. See [Define custom attributes for user flows](user-flow-add-custom-attributes.md).

## Enable self-service sign-up for your tenant

Before you can add a self-service sign-up user flow to your applications, you need to enable the feature for your tenant. After it's enabled, controls become available in the user flow that let you associate the user flow with an application.

1. Sign in to the [Azure portal](https://portal.azure.com) as an Azure AD administrator.
2. Under **Azure services**, select **Azure Active Directory**.
3. Select **User settings**, and then under **External users**, select **Manage external collaboration settings**.
4. Set the **Enable guest self-service sign up via user flows** toggle to **Yes**.

   ![Enable guest self-service sign-up](media/self-service-sign-up-user-flow/enable-self-service-sign-up.png)
5. Select **Save**.
## Create the user flow for self-service sign-up

Next, you'll create the user flow for self-service sign-up and add it to an application.

1. Sign in to the [Azure portal](https://portal.azure.com) as an Azure AD administrator.
2. Under **Azure services**, select **Azure Active Directory**.
3. In the left menu, select **External Identities**.
4. Select **User flows**, and then select **New user flow**.

   ![Add a new user flow button](media/self-service-sign-up-user-flow/new-user-flow.png)

5. On the **Create** page, enter a **Name** for the user flow. Note that the name is automatically prefixed with **B2X_1_**.
6. In the **Identity providers** list, select one or more identity providers that your external users can use to log into your application. **Azure Active Directory Sign up** is selected by default. (See [Before you begin](#before-you-begin) earlier in this article to learn how to add identity providers.)
7. Under **User attributes**, choose the attributes you want to collect from the user. For additional attributes, select **Show more**. For example, select **Show more**, and then choose attributes and claims for **Country/Region**, **Display Name**, and **Postal Code**. Select **OK**.

   ![Create a new user flow page](media/self-service-sign-up-user-flow/create-user-flow.png)

> [!NOTE]
> You can only collect attributes when a user signs up for the first time. After a user signs up, they will no longer be prompted to collect attribute information, even if you change the user flow.

8. Select **Create**.
9. The new user flow appears in the **User flows** list. If necessary, refresh the page.

## Select the layout of the attribute collection form

You can choose order in which the attributes are displayed on the sign-up page. 

1. In the [Azure portal](https://portal.azure.com), select **Azure Active Directory**.
2. Select **External Identities**, select **User flows**.
3. Select the self-service sign-up user flow from the list.
4. Under **Customize**, select **Page layouts**.
5. The attributes you chose to collect are listed. To change the order of display, select an attribute, and then select **Move up**, **Move down**, **Move to the top**, or **Move to the bottom**.
6. Select **Save**.

## Add applications to the self-service sign-up user flow

Now you can associate applications with the user flow.

1. Sign in to the [Azure portal](https://portal.azure.com) as an Azure AD administrator.
2. Under **Azure services**, select **Azure Active Directory**.
3. In the left menu, select **External Identities**.
4. Under **Self-service sign up**, select **User flows**.
5. Select the self-service sign-up user flow from the list.
6. In the left menu, under **Use**, select **Applications**.
7. Select **Add application**.

   ![Assign an application to the user flow](media/self-service-sign-up-user-flow/assign-app-to-user-flow.png)

8. Select the application from the list. Or use the search box to find the application, and then select it.
9. Click **Select**.

## Next steps

- [Add Google to your list of social identity providers](google-federation.md)
- [Add Facebook to your list of social identity providers](facebook-federation.md)
- [Use API connectors to customize and extend your user flows via web APIs](api-connectors-overview.md)
- [Add custom approval workflow to your user flow](self-service-sign-up-add-approvals.md)
