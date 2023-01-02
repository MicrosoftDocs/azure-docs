---
title: Enable authentication and authorization in Azure Container Apps with Twitter
description: Learn to use the built-in Twitter authentication provider in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 04/20/2022
ms.author: cshoe
---

# Enable authentication and authorization in Azure Container Apps with Twitter

This article shows how to configure Azure Container Apps to use Twitter as an authentication provider.

To complete the procedure in this article, you need a Twitter account that has a verified email address and phone number. To create a new Twitter account, go to [twitter.com].

## <a name="twitter-register"> </a>Register your application with Twitter

1. Sign in to the [Azure portal] and go to your application. Copy your **URL**. You'll use it to configure your Twitter app.
1. Go to the [Twitter Developers] website, sign in with your Twitter account credentials, and select **Create an app**.
1. Enter the **App name** and the **Application description** for your new app. Paste your application's **URL** into the **Website URL** field. In the **Callback URLs** section, enter the HTTPS URL of your container app and append the path `/.auth/login/twitter/callback`. For example, `https://<hostname>.azurecontainerapps.io/.auth/login/twitter/callback`.
1. At the bottom of the page, type at least 100 characters in **Tell us how this app will be used**, then select **Create**. Select **Create** again in the pop-up. The application details are displayed.
1. Select the **Keys and Access Tokens** tab.

   Make a note of these values:
   - API key
   - API secret key

   > [!IMPORTANT]
   > The API secret key is an important security credential. Do not share this secret with anyone or distribute it with your app.

## <a name="twitter-secrets"> </a>Add Twitter information to your application

1. Sign in to the [Azure portal] and navigate to your app.
1. Select **Authentication** in the menu on the left. Select **Add identity provider**.
1. Select **Twitter** in the identity provider dropdown. Paste in the `API key` and `API secret key` values that you obtained previously.

    The secret will be stored as [secret](manage-secrets.md) in your container app.

1. If you're configuring the first identity provider for this application, you'll also be prompted with a **Container Apps authentication settings** section. Otherwise, you may move on to the next step.

    These options determine how your application responds to unauthenticated requests. The default selections redirect all requests to sign in with this new provider. You can change customize this behavior now or adjust these settings later from the main **Authentication** screen by choosing **Edit** next to **Authentication settings**. To learn more about these options, see [Authentication flow](authentication.md#authentication-flow).

1. Select **Add**.

You're now ready to use Twitter for authentication in your app. The provider will be listed on the **Authentication** screen. From there, you can edit or delete this provider configuration.

## Working with authenticated users

Use the following guides for details on working with authenticated users.

* [Customize sign-in and sign-out](authentication.md#customize-sign-in-and-sign-out)
* [Access user claims in application code](authentication.md#access-user-claims-in-application-code)

## Next steps

> [!div class="nextstepaction"]
> [Authentication and authorization overview](authentication.md)

<!-- URLs. -->
[Azure portal]: https://portal.azure.com/
