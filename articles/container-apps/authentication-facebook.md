---
title: Enable authentication and authorization in Azure Container Apps with Facebook
description: Learn to use the built-in Facebook authentication provider in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 04/06/2022
ms.author: cshoe
---

# Enable authentication and authorization in Azure Container Apps with Facebook

This article shows how to configure Azure Container Apps to use Facebook as an authentication provider.

To complete the procedure in this article, you need a Facebook account that has a verified email address and a mobile phone number. To create a new Facebook account, go to [facebook.com](https://facebook.com/).

## <a name="facebook-register"> </a>Register your application with Facebook

1. Go to the [Facebook Developers](https://go.microsoft.com/fwlink/p/?LinkId=268286) website and sign in with your Facebook account credentials.

   If you don't have a Facebook for Developers account, select **Get Started** and follow the registration steps.
1. Select **My Apps** > **Add New App**.
1. In **Display Name** field:
   1. Type a unique name for your app.
   1. Provide your **Contact Email**.
   1. Select **Create App ID**.
   1. Complete the security check.

   The developer dashboard for your new Facebook app opens.
1. Select **Dashboard** > **Facebook Login** > **Set up** > **Web**.
1. In the left navigation under **Facebook Login**, select **Settings**.
1. In the **Valid OAuth redirect URIs** field, enter `https://<hostname>.azurecontainerapps.io/.auth/login/facebook/callback`. Remember to use the hostname of your container app.
1. Select **Save Changes**.
1. In the left pane, select **Settings** > **Basic**. 
1. In the **App Secret** field, select **Show**. Copy the values of **App ID** and **App Secret**. You use them later to configure your container app in Azure.

   > [!IMPORTANT]
   > The app secret is an important security credential. Do not share this secret with anyone or distribute it within a client application.
   >

1. The Facebook account that you used to register the application is an administrator of the app. At this point, only administrators can sign in to this application.

   To authenticate other Facebook accounts, select **App Review** and enable **Make \<your-app-name> public** to enable the general public to access the app by using Facebook authentication.

## <a name="facebook-secrets"> </a>Add Facebook information to your application

1. Sign in to the [Azure portal] and navigate to your app.
1. Select **Authentication** in the menu on the left. Select **Add identity provider**.
1. Select **Facebook** in the identity provider dropdown. Paste in the App ID and App Secret values that you obtained previously.

    The secret will be stored as a [secret](manage-secrets.md) in your container app.

1. If you're configuring the first identity provider for this application, you'll be prompted with a **Container Apps authentication settings** section. Otherwise, you may move on to the next step.

    These options determine how your application responds to unauthenticated requests. The default selections redirect all requests to sign in with this new provider. You can change customize this behavior now or adjust these settings later from the main **Authentication** screen by choosing **Edit** next to **Authentication settings**. To learn more about these options, see [Authentication flow](authentication.md#authentication-flow).

1. (Optional) Select **Next: Scopes** and add any scopes needed by the application. These scopes are requested when a user signs in for browser-based flows.
1. Select **Add**.

You're now ready to use Facebook for authentication in your app. The provider will be listed on the **Authentication** screen. From there, you can edit or delete this provider configuration.

## Working with authenticated users

Use the following guides for details on working with authenticated users.

* [Customize sign-in and sign-out](authentication.md#customize-sign-in-and-sign-out)
* [Access user claims in application code](authentication.md#access-user-claims-in-application-code)

## Next steps

> [!div class="nextstepaction"]
> [Authentication and authorization overview](authentication.md)

<!-- URLs. -->
[Azure portal]: https://portal.azure.com/
