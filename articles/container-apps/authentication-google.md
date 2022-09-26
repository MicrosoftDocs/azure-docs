---
title: Enable authentication and authorization in Azure Container Apps with Google
description: Learn to use the built-in Google authentication provider in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 04/20/2022
ms.author: cshoe
---

# Enable authentication and authorization in Azure Container Apps with Google

This article shows you how to configure Azure Container Apps to use Google as an authentication provider.

To complete the following procedure, you must have a Google account that has a verified email address. To create a new Google account, go to [accounts.google.com](https://go.microsoft.com/fwlink/p/?LinkId=268302).

## <a name="google-register"> </a>Register your application with Google

1. Follow the Google documentation at [Google Sign-In for server-side apps](https://developers.google.com/identity/sign-in/web/server-side-flow) to create a client ID and client secret. There's no need to make any code changes. Just use the following information:
    - For **Authorized JavaScript Origins**, use `https://<hostname>.azurecontainerapps.io` with the name of your app in *\<hostname>*.
    - For **Authorized Redirect URI**, use `https://<hostname>.azurecontainerapps.io/.auth/login/google/callback`.
1. Copy the App ID and the App secret values.

    > [!IMPORTANT]
    > The App secret is an important security credential. Do not share this secret with anyone or distribute it within a client application.

## <a name="google-secrets"> </a>Add Google information to your application

1. Sign in to the [Azure portal] and navigate to your app.
1. Select **Authentication** in the menu on the left. Select **Add identity provider**.
1. Select **Google** in the identity provider dropdown. Paste in the App ID and App Secret values that you obtained previously.

    The secret will be stored as a [secret](manage-secrets.md) in your container app.

1. If you're configuring the first identity provider for this application, you'll also be prompted with a **Container Apps authentication settings** section. Otherwise, you may move on to the next step.

    These options determine how your application responds to unauthenticated requests. The default selections redirect all requests to sign in with this new provider. You can change customize this behavior now or adjust these settings later from the main **Authentication** screen by choosing **Edit** next to **Authentication settings**. To learn more about these options, see [Authentication flow](authentication.md#authentication-flow).

1. Select **Add**.

    > [!NOTE]
    > For adding scope: You can define what permissions your application has in the provider's registration portal. The app can request scopes at login time which leverage these permissions.

You're now ready to use Google for authentication in your app. The provider will be listed on the **Authentication** screen. From there, you can edit or delete this provider configuration.

## Working with authenticated users

Use the following guides for details on working with authenticated users.

* [Customize sign-in and sign-out](authentication.md#customize-sign-in-and-sign-out)
* [Access user claims in application code](authentication.md#access-user-claims-in-application-code)

## Next steps

> [!div class="nextstepaction"]
> [Authentication and authorization overview](authentication.md)

<!-- URLs. -->
[Azure portal]: https://portal.azure.com/
