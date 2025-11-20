---
title: Configure an OpenID Connect Provider
description: Learn how to configure an OpenID Connect provider as an identity provider for your App Service or Azure Functions app.
ms.topic: how-to
ms.date: 07/10/2025
ms.reviewer: mahender
ms.custom: AppServiceIdentity
author: cephalin
ms.author: cephalin
#customer intent: As an app developer, I want to use a custom authentication provider that uses the OpenID Connect specification in Azure App Service.
ms.service: azure-app-service
---

# Configure your App Service or Azure Functions app to use an OpenID Connect provider

[!INCLUDE [app-service-mobile-selector-authentication](../../includes/app-service-mobile-selector-authentication.md)]

This article shows you how to configure Azure App Service or Azure Functions to use a custom authentication provider that adheres to the [OpenID Connect (OIDC) specification](https://openid.net/connect/). OIDC is an industry standard that many identity providers use. You don't need to understand the details of the specification to use an OIDC identity provider for your app.

You can configure your app to use one or more OIDC providers. You must give each OIDC provider a unique friendly name in the app configuration. Only one provider can serve as the default redirect target.

## <a name="register"> </a>Register your app with the OIDC identity provider

Your provider requires you to register your application by specifying a redirect URI in the form `<app-url>/.auth/login/<provider-name>/callback`. In the redirect URI, replace `<app-url>` with your app URL and `<provider-name>` with the friendly name you're giving the OpenID provider in Azure.

> [!NOTE]
> The OpenID provider name can't contain a hyphen `-`, because an App Service application setting is created based on this name, and application settings don't support hyphens. You can use an underscore `_` instead.

When you register your app, you need to collect a *client ID* and a *client secret* for your application. Make a note of these values to use in the Azure app configuration.

> [!NOTE]
> - The client secret value is an important security credential. Don't share this secret with anyone or distribute it within a client application.
> - Your app must provide the client secret if you want users to acquire access tokens using the interactive authorization code flow. If you don't want to acquire access tokens, you don't need to use a secret.

You also need the provider's OIDC metadata. This metadata is often exposed in a [configuration metadata document](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig) that you can get at the path formed by appending `/.well-known/openid-configuration` to the provider's issuer URL.

If you can't access a configuration metadata document, get the following values separately:

- The issuer URL, sometimes shown as `issuer`.
- The [OAuth 2.0 authorization endpoint](https://tools.ietf.org/html/rfc6749#section-3.1), sometimes shown as `authorization_endpoint`.
- The [OAuth 2.0 token endpoint](https://tools.ietf.org/html/rfc6749#section-3.2), sometimes shown as `token_endpoint`.
- The URL of the [OAuth 2.0 JSON Web Key set](https://tools.ietf.org/html/rfc8414#section-2) document, sometimes shown as `jwks_uri`.

Each identity provider should provide instructions on how to complete the registration steps. Some providers might require extra steps for their configuration or for using the values that they provide. For example, Apple provides a private key that you use to create a JSON Web Token (JWT), which you enter as the secret in your app configuration. For more information, see [Creating a client secret](https://developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens).

## <a name="configure"> </a>Add provider information to your application

To configure the OpenID Connect provider in Azure, follow these steps:

1. On the [Azure portal](https://portal.azure.com) page for your app, select **Authentication** under **Settings** in the left navigation menu.

1. On the **Authentication** page, select **Add identity provider**, or select **Add provider** in the **Identity provider** section.

1. On the **Add an identity provider** page, select **OpenID Connect** as the provider.

1. For **OpenID provider name**, enter the friendly name you chose for your OIDC provider.

1. Under **OpenID Connect provider configuration**, if you have a metadata document from the identity provider, select **Document URL** for **Metadata entry**.

   If you don't have a metadata document, select **Enter metadata**, and enter each URL from the identity provider in the appropriate field.

1. Under **App registration**, provide the values you collected earlier for **Client ID** and **Client secret**.

1. If this is the first identity provider for the application, the **App Service authentication settings** section appears with settings such as how your application responds to unauthenticated requests. The default selections redirect all requests to sign in with the new provider.

   If you already configured an identity provider for the app, this section doesn't appear. You can customize the settings later if necessary.

1. Select **Add** to finish setting up the identity provider.

On the **Authentication** page, **\<oidc_friendly_name>(custom provider)** now appears in the **Identity provider** section. You can edit the provider's settings by selecting its pencil icon under **Edit**.

The **Authentication settings** section shows settings such as how the application responds to unauthenticated requests. You can edit these settings by selecting **Edit** next to **Authentication settings**. To learn more about the options, see [Authentication flow](overview-authentication-authorization.md#authentication-flow).

The application secret is stored as a slot-sticky [application setting](configure-common.md#configure-app-settings) named `<oidc_friendly_name>_AUTHENTICATION_SECRET`. You can see the setting on the **App Settings** tab of your app's **Environment variables** page in the portal. If you want to manage the secret in Azure Key Vault, you can edit the setting to use [Key Vault references](app-service-key-vault-references.md).

>[!NOTE]
>To add scopes, define the permissions your application has in the provider's registration portal. The app can request scopes that use these permissions at sign-in time.
>
>- Azure requires `openid`, `profile`, and `email` scopes. Make sure that you configure your app registration in your identity provider with at least these scopes.
>- The `aud` scope must be the same as the configured **Client Id**. You can't configure the allowed audiences for this provider.

## <a name="related-content"> </a>Related content

[!INCLUDE [app-service-mobile-related-content-get-started-users](../../includes/app-service-mobile-related-content-get-started-users.md)]

