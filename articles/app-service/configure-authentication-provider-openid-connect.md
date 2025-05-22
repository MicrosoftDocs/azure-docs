---
title: Configure an OpenID Connect Provider
description: Learn how to configure an OpenID Connect provider as an identity provider for your App Service or Azure Functions app.
ms.topic: how-to
ms.date: 04/02/2025
ms.reviewer: mahender
ms.custom: AppServiceIdentity
author: cephalin
ms.author: cephalin
#customer intent: As an app developer, I want to use a custom authentication provider that uses the OpenID Connect specification in Azure App Service.
---

# Configure your App Service or Azure Functions app to sign in by using an OpenID Connect provider

[!INCLUDE [app-service-mobile-selector-authentication](../../includes/app-service-mobile-selector-authentication.md)]

This article shows you how to configure Azure App Service or Azure Functions to use a custom authentication provider that adheres to the [OpenID Connect (OIDC) specification](https://openid.net/connect/). OIDC is an industry standard that many identity providers (IDPs) use. You don't need to understand the details of the specification for your app to use an OIDC identity provider.

You can configure your app to use one or more OIDC providers. Each provider must have a unique alphanumeric name in the configuration. Only one provider can serve as the default redirect target.

## <a name="register"> </a>Register your application with the identity provider

Your provider requires you to register the details of your application with it. One of these steps involves specifying a redirect URI that has the form `<app-url>/.auth/login/<provider-name>/callback`. Each identity provider should provide more instructions on how to complete the steps. The `<provider-name>` value refers to the friendly name that you give to the OpenID provider name in Azure.

> [!NOTE]
> Some providers might require extra steps for their configuration and for using the values that they provide. For example, Apple provides a private key that isn't itself used as the OIDC client secret. You use it to create a JSON Web Token (JWT). You use the web token as the secret that you provide in your app configuration. For more information, see [Creating a client secret](https://developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens).

You need to collect a *client ID* and a *client secret* for your application. The client secret is an important security credential. Don't share this secret with anyone or distribute it in a client application.

> [!NOTE]
> You only need to provide a client secret to the configuration if you would like to acquire access tokens for the user through interactive login flow using the authorization code flow. If this is not your case, collecting a secret is not required.

You also need the OIDC metadata for the provider. This metadata is often exposed in a [configuration metadata document](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig), which is the provider's issuer URL suffixed with `/.well-known/openid-configuration`. Get this configuration URL.

If you can't use a configuration metadata document, get the following values separately:

- The issuer URL (sometimes shown as `issuer`)
- The [OAuth 2.0 authorization endpoint](https://tools.ietf.org/html/rfc6749#section-3.1) (sometimes shown as `authorization_endpoint`)
- The [OAuth 2.0 token endpoint](https://tools.ietf.org/html/rfc6749#section-3.2) (sometimes shown as `token_endpoint`)
- The URL of the [OAuth 2.0 JSON Web Key set](https://tools.ietf.org/html/rfc8414#section-2) document (sometimes shown as `jwks_uri`)

## <a name="configure"> </a>Add provider information to your application

To add provider information for your OpenID Connect provider, follow these steps.

1. Sign in to the [Azure portal] and go to your app.

1. On the left menu, select **Settings** > **Authentication**. Then select **Add identity provider**.

1. For **Identity provider**, select **OpenID Connect**.

1. For **OpenID provider name**, provide the unique alphanumeric name that you selected earlier.

1. If you have the URL for the metadata document from the identity provider, provide that value for **Metadata URL**.

   Otherwise, select **Provide endpoints separately**. Put each URL from the identity provider in the appropriate field.

1. Provide the values that you collected earlier for **Client ID**. If the **Client secret** was also collected, provide it as part of the configuration process.

1. Specify an application setting name for your client secret. Your client secret is stored as an app setting to ensure that secrets are stored in a secure fashion. If you want to manage the secret in Azure Key vault, update that setting later to use [Azure Key Vault references](./app-service-key-vault-references.md).

1. Select **Add** to finish setting up the identity provider.

> [!NOTE]
> The OpenID provider name can't contain a hyphen (-) because an app setting is created based on this name. The app setting doesn't support hyphens. Use an underscore (_) instead.  
>
> It also requires that the `aud` scope in your token be the same as the **Client Id** as configured above. It is currently not possible to configure the allowed audiences for this provider at the moment.
>
> Azure requires `openid`, `profile`, and `email` scopes. Make sure that you configure your app registration in your ID provider with at least these scopes.

## <a name="related-content"> </a>Related content

[!INCLUDE [app-service-mobile-related-content-get-started-users](../../includes/app-service-mobile-related-content-get-started-users.md)]

[Azure portal]: https://portal.azure.com
