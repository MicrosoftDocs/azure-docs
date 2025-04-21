---
title: Configure Google Authentication
description: Learn how to configure Google authentication as an identity provider for your App Service or Azure Functions app.
ms.assetid: 2b2f9abf-9120-4aac-ac5b-4a268d9b6e2b
ms.topic: how-to
ms.date: 03/29/2021
ms.custom: fasttrack-edit, AppServiceIdentity
author: cephalin
ms.author: cephalin
---

# Configure your App Service or Azure Functions app to use Google authentication

[!INCLUDE [app-service-mobile-selector-authentication](../../includes/app-service-mobile-selector-authentication.md)]

This article shows you how to configure Azure App Service or Azure Functions to use Google as an authentication provider.

To complete the procedure, you must have a Google account that has a verified email address. To create a new Google account, go to [accounts.google.com](https://go.microsoft.com/fwlink/p/?LinkId=268302).

## <a name="register"> </a>Register your application with Google

1. Follow the Google documentation at [Sign In with Google for Web - Setup](https://developers.google.com/identity/gsi/web/guides/fedcm-migration) to create a client ID and client secret. You don't need to make any code changes. Use the following information:
    - For **Authorized JavaScript Origins**, use `https://<app-name>.azurewebsites.net` with the name of your app in *\<app-name>*.
    - For **Authorized Redirect URI**, use `https://<app-name>.azurewebsites.net/.auth/login/google/callback`.
1. Copy the **App ID** and the **App Secret** values.

    > [!IMPORTANT]
    > The **App Secret** value is an important security credential. Don't share this secret with anyone or distribute it within a client application.

## <a name="secrets"> </a>Add Google information to your application

1. Sign in to the [Azure portal] and go to your app.
1. Select **Authentication** on the left menu. Select **Add identity provider**.
1. Select **Google** in the identity provider dropdown. Paste in the **App ID** and **App Secret** values that you obtained previously.

    The secret is stored as a slot-sticky [application setting](./configure-common.md#configure-app-settings) named `GOOGLE_PROVIDER_AUTHENTICATION_SECRET`. You can later update that setting to use [Key Vault references](./app-service-key-vault-references.md) if you wish to manage the secret in Azure Key Vault.

1. If this is the first identity provider configured for the application, you're also prompted with an **App Service authentication settings** section. Otherwise, you can move to the next step.
    
    The **App Service authentication settings** values determine how your application responds to unauthenticated requests. The default selections will redirect all requests to sign in with this new provider. You can customize this behavior now or adjust these settings later from the main **Authentication** screen by choosing **Edit** next to **Authentication settings**. To learn more about these options, see [Authentication flow](overview-authentication-authorization.md#authentication-flow).

1. Select **Add**.

> [!NOTE]
> For adding scope: You can define what permissions your application has in the provider's registration portal. The app can request scopes at the time of sign-in, which use these permissions.

You're now ready to use Google for authentication in your app. The provider is listed on the **Authentication** screen. From there, you can edit or delete this provider configuration.

## Related content

[!INCLUDE [app-service-mobile-related-content-get-started-users](../../includes/app-service-mobile-related-content-get-started-users.md)]

<!-- Anchors. -->

<!-- Images. -->

[0]: ./media/app-service-mobile-how-to-configure-google-authentication/mobile-app-google-redirect.png
[1]: ./media/app-service-mobile-how-to-configure-google-authentication/mobile-app-google-settings.png

<!-- URLs. -->

[Google APIs]: https://go.microsoft.com/fwlink/p/?LinkId=268303

[Azure portal]: https://portal.azure.com/
