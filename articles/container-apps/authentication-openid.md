---
title: Enable authentication and authorization in Azure Container Apps with a Custom OpenID Connect provider
description: Learn to use the built-in Custom OpenID Connect authentication provider in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 04/20/2022
ms.author: cshoe
---

# Enable authentication and authorization in Azure Container Apps with a Custom OpenID Connect provider

This article shows you how to configure Azure Container Apps to use a custom authentication provider that adheres to the [OpenID Connect specification](https://openid.net/connect/). OpenID Connect (OIDC) is an industry standard used by many identity providers (IDPs). You don't need to understand the details of the specification in order to configure your app to use an adherent IDP.

You can configure your app to use one or more OIDC providers. Each must be given a unique alphanumeric name in the configuration, and only one can serve as the default redirect target.

## <a name="openid-register"> </a>Register your application with the identity provider

Your provider will require you to register the details of your application with it. One of these steps involves specifying a redirect URI. This redirect URI will be of the form `<app-url>/.auth/login/<provider-name>/callback`. Each identity provider should provide more instructions on how to complete these steps.

> [!NOTE]
> Some providers may require additional steps for their configuration and how to use the values they provide. For example, Apple provides a private key which is not itself used as the OIDC client secret, and you instead must use it craft a JWT which is treated as the secret you provide in your app config (see the "Creating the Client Secret" section of the [Sign in with Apple documentation](https://developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens))
>

You'll need to collect a **client ID** and **client secret** for your application.

> [!IMPORTANT]
> The client secret is an important security credential. Do not share this secret with anyone or distribute it within a client application.
>

Additionally, you'll need the OpenID Connect metadata for the provider. This information is often exposed via a [configuration metadata document](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig), which is the provider's Issuer URL suffixed with `/.well-known/openid-configuration`. Gather this configuration URL.

If you're unable to use a configuration metadata document, you'll need to gather the following values separately:

- The issuer URL (sometimes shown as `issuer`)
- The [OAuth 2.0 Authorization endpoint](https://tools.ietf.org/html/rfc6749#section-3.1) (sometimes shown as `authorization_endpoint`)
- The [OAuth 2.0 Token endpoint](https://tools.ietf.org/html/rfc6749#section-3.2) (sometimes shown as `token_endpoint`)
- The URL of the [OAuth 2.0 JSON Web Key Set](https://tools.ietf.org/html/rfc8414#section-2) document (sometimes shown as `jwks_uri`)

## <a name="openid-configure"> </a>Add provider information to your application

1. Sign in to the [Azure portal] and navigate to your app.

1. Select **Authentication** in the menu on the left. Select **Add identity provider**.

1. Select **OpenID Connect** in the identity provider dropdown.

1. Provide the unique alphanumeric name selected earlier for **OpenID provider name**.

1. If you have the URL for the **metadata document** from the identity provider, provide that value for **Metadata URL**. Otherwise, select the **Provide endpoints separately** option and put each URL gathered from the identity provider in the appropriate field.

1. Provide the earlier collected **Client ID** and **Client Secret** in the appropriate fields.

1. Specify an application setting name for your client secret. Your client secret will be stored as a [secret](manage-secrets.md) in your container app.

1. Press the **Add** button to finish setting up the identity provider. 

## Working with authenticated users

Use the following guides for details on working with authenticated users.

* [Customize sign-in and sign-out](authentication.md#customize-sign-in-and-sign-out)
* [Access user claims in application code](authentication.md#access-user-claims-in-application-code)

## Next steps

> [!div class="nextstepaction"]
> [Authentication and authorization overview](authentication.md)

<!-- URLs. -->
[Azure portal]: https://portal.azure.com/
