---
title: Enable authentication and authorization in Azure Container Apps with GitHub
description: Learn to use the built-in GitHub authentication provider in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 04/20/2022
ms.author: cshoe
---

# Enable authentication and authorization in Azure Container Apps with GitHub

This article shows how to configure Azure Container Apps to use GitHub as an authentication provider.

To complete the procedure in this article, you need a GitHub account. To create a new GitHub account, go to [GitHub](https://github.com/).

## <a name="github-register"> </a>Register your application with GitHub

1. Sign in to the [Azure portal] and go to your application. Copy your **URL**. You'll use it to configure your GitHub app.
1. Follow the instructions for [creating an OAuth app on GitHub](https://docs.github.com/developers/apps/building-oauth-apps/creating-an-oauth-app). In the **Authorization callback URL** section, enter the HTTPS URL of your app and append the path `/.auth/login/github/callback`. For example, `https://<hostname>.azurecontainerapps.io/.auth/login/github/callback`.
1. On the application page, make note of the **Client ID**, which you'll need later.
1. Under **Client Secrets**, select **Generate a new client secret**.
1. Make note of the client secret value, which you'll need later.

   > [!IMPORTANT]
   > The client secret is an important security credential. Do not share this secret with anyone or distribute it with your app.

## <a name="github-secrets"> </a>Add GitHub information to your application

1. Sign in to the [Azure portal] and navigate to your app.
1. Select **Authentication** in the menu on the left. Select **Add identity provider**.
1. Select **GitHub** in the identity provider dropdown. Paste in the `Client ID` and `Client secret` values that you obtained previously.

    The secret will be stored as a secret in your container app.

1. If you're configuring the first identity provider for this application, you'll also be prompted with a **Container Apps authentication settings** section. Otherwise, you may move on to the next step.

    These options determine how your application responds to unauthenticated requests. The default selections redirect all requests to sign in with this new provider. You can change customize this behavior now or adjust these settings later from the main **Authentication** screen by choosing **Edit** next to **Authentication settings**. To learn more about these options, see [Authentication flow](./authentication.md#authentication-flow).

1. Select **Add**.

You're now ready to use GitHub for authentication in your app. The provider will be listed on the **Authentication** screen. From there, you can edit or delete this provider configuration.

## Working with authenticated users

Use the following guides for details on working with authenticated users.

* [Customize sign-in and sign-out](authentication.md#customize-sign-in-and-sign-out)
* [Access user claims in application code](authentication.md#access-user-claims-in-application-code)

## Next steps

> [!div class="nextstepaction"]
> [Authentication and authorization overview](authentication.md)

<!-- URLs. -->
[Azure portal]: https://portal.azure.com/
