---
title: Configure Google Authentication
description: Learn how to configure Google authentication as an identity provider for your App Service or Azure Functions app.
ms.assetid: 2b2f9abf-9120-4aac-ac5b-4a268d9b6e2b
ms.topic: how-to
ms.date: 07/10/2025
ms.custom: fasttrack-edit, AppServiceIdentity
author: cephalin
ms.author: cephalin
ms.service: azure-app-service
---

# Configure your App Service or Azure Functions app to use Google authentication

[!INCLUDE [app-service-mobile-selector-authentication](../../includes/app-service-mobile-selector-authentication.md)]

This article shows you how to configure Azure App Service or Azure Functions to use Google as an authentication provider.

To complete the procedure, you must have a Google account that has a verified email address. To create a new Google account, go to [accounts.google.com](https://go.microsoft.com/fwlink/p/?LinkId=268302).

## <a name="register"> </a>Register your application with Google

1. Follow the Google documentation at [Get your Google API client ID](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid) to create a client ID and client secret. You don't need to make any code changes.
   - For **Authorized JavaScript Origins**, use `https://<app-name>.azurewebsites.net`, replacing `<app-name>` with the name of your app.
   - For **Authorized Redirect URI**, use `https://<app-name>.azurewebsites.net/.auth/login/google/callback`.
1. Make a note of the **App ID** and the **App Secret** values to use in the Azure app configuration.

   > [!IMPORTANT]
   > The **App Secret** value is an important security credential. Don't share this secret with anyone or distribute it within a client application.

## <a name="secrets"> </a>Add Google information to your application

1. On the [Azure portal] page for your app, select **Authentication** under **Settings** in the left navigation menu.

1. On the **Authentication** page, select **Add identity provider**, or select **Add provider** in the **Identity provider** section.

1. On the **Add an identity provider** page, select **Google** in the identity provider dropdown.

1. Enter the **App ID** and **App Secret** values you obtained previously.

1. If this is the first identity provider for the application, the **App Service authentication settings** section appears with settings such as how your application responds to unauthenticated requests. The default selections redirect all requests to sign in with the new provider.

   If you already configured an identity provider for the app, this section doesn't appear. You can customize the settings later if necessary.

1. Select **Add**.

On the **Authentication** page, the **Google** provider now appears in the **Identity provider** section. You can edit the provider settings by selecting the pencil icon under **Edit**.

The **Authentication settings** section shows settings such as how the application responds to unauthenticated requests. You can edit these settings by selecting **Edit** next to **Authentication settings**. To learn more about the options, see [Authentication flow](overview-authentication-authorization.md#authentication-flow).

The application secret is stored as a slot-sticky [application setting](configure-common.md#configure-app-settings) named `GOOGLE_PROVIDER_AUTHENTICATION_SECRET`. You can see this setting on the **App Settings** tab of your app's **Environment variables** page in the portal. If you want to manage the secret in Azure Key Vault, you can update the setting to use [Key Vault references](app-service-key-vault-references.md).

> [!NOTE]
> To add scopes, define the permissions your application has in the provider's registration portal. The app can request scopes that use these permissions at sign-in time.

## Related content

[!INCLUDE [app-service-mobile-related-content-get-started-users](../../includes/app-service-mobile-related-content-get-started-users.md)]

<!-- Anchors. -->

<!-- Images. -->

[0]: ./media/app-service-mobile-how-to-configure-google-authentication/mobile-app-google-redirect.png
[1]: ./media/app-service-mobile-how-to-configure-google-authentication/mobile-app-google-settings.png

<!-- URLs. -->

[Google APIs]: https://go.microsoft.com/fwlink/p/?LinkId=268303

[Azure portal]: https://portal.azure.com/
