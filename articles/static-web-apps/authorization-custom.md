---
title: Custom authorization in Azure Static Web Apps
description: Learn to configure custom authorization for Azure Static Web Apps
services: static-web-apps
author: aaronpowell
ms.author: aapowell
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 3/24/2021
---

# Custom authorization in Azure Static Web Apps

Azure Static Web Apps provides managed authentication but also the option to provide your own settings for the providers and even a custom provider that supports OpenID Connect.

## Overriding a default provider

> [!NOTE]
> Custom authorization is only available in the Standard tier of Azure Static Web Apps.

The settings used to override the build in providers is configured using the [Configuration file](configuration.md), within the `auth` section. The following snippet shows how a custom Twitter provider would be configured.

```json
{
  "auth": {
    "identityProviders": {
      "twitter": {
        "enabled": true,
        "registration": {
          "consumerKeySettingName": "TWITTER_CONSUMER_KEY",
          "consumerSecretSettingName": "TWITTER_SECRET"
        },
        "userDetailsClaim": "handle"
      }
    }
  }
}
```

> [!NOTE]
> To avoid putting secret information in source control, the configuration information will look into [Application Settings](application-settings.md), for settings matching the name provided in the configuration file.

## Configuring a custom OpenID Connect provider

This article shows you how to configure Azure Static Web Apps to use a custom authentication provider that adheres to the [OpenID Connect specification](https://openid.net/connect/). OpenID Connect (OIDC) is an industry standard used by many identity providers (IDPs). You do not need to understand the details of the specification in order to configure your app to use an adherent IDP.

Your can configure your app to use one or more OIDC providers. Each must be given a unique name in the configuration, and only one can serve as the default redirect target.

### Register your application with the identity provider

Your provider will require you to register the details of your application with it. Please see the instructions relevant to that provider. You will need to collect a **client ID** and **client secret** for your application.

> [!IMPORTANT]
> The app secret is an important security credential. Do not share this secret with anyone or distribute it within a client application.

> [!NOTE]
> Some providers may require additional steps for their configuration and how to use the values they provide. For example, Apple provides a private key which is not itself used as the OIDC client secret, and you instead must use it craft a JWT which is treated as the secret you provide in your app config (see the "Creating the Client Secret" section of the [Sign in with Apple documentation](https://developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens))

Add the client secret as an [application setting](application-settings.md) for the app, using a setting name of your choice. Make note of this name for later.

Additionally, you will need the OpenID Connect metadata for the provider. This is often exposed via a [configuration metadata document](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig), which is the provider's Issuer URL suffixed with `/.well-known/openid-configuration`. Gather this configuration URL.

If you are unable to use a configuration metadata document, you will need to gather the following values separately:

- The issuer URL (sometimes shown as `issuer`)
- The [OAuth 2.0 Authorization endpoint](https://tools.ietf.org/html/rfc6749#section-3.1) (sometimes shown as `authorization_endpoint`)
- The [OAuth 2.0 Token endpoint](https://tools.ietf.org/html/rfc6749#section-3.2) (sometimes shown as `token_endpoint`)
- The URL of the [OAuth 2.0 JSON Web Key Set](https://tools.ietf.org/html/rfc8414#section-2) document (sometimes shown as `jwks_uri`)

## <a name="configure"> </a>Add provider information to your application

> [!NOTE]
> The required configuration is in a new API format, currently only supported by [file-based configuration (preview)](.\app-service-authentication-how-to.md#config-file). You will need to follow the below steps using such a file.

This section will walk you through updating the configuration to include your new IDP. An example configuration follows.

1. Within the `identityProviders` object, add an `openIdConnectProviders` object if one does not already exist.
1. Within the `openIdConnectProviders` object, add a key for your new provider. This is a friendly name used to reference the provider in the rest of the configuration. For example, if you wanted to require all requests to be authenticated with this provider, you would set `globalValidation.unauthenticatedClientAction` to "RedirectToLoginPage" and set `redirectToProvider` to this same friendly name.
1. Assign an object to that key with a `registration` object within it, and optionally a `login` object:

   ```json
   "myCustomIDP" : {
      "registration" : {},
      "login": {
            "nameClaimType": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
            "scope": [],
            "loginParameterNames": [],
      }
   }
   ```

1. Within the registration object, set the `clientId` to the client ID you collected, set `clientCredential.secretSettingName` to the name of the application setting where you stored the client secret, and create a `openIdConnectConfiguration` object:

   ```json
   "registration": {
     "clientId": "bd96cf8a-3f2b-4806-b180-d3c5fd11a2be",
     "clientCredential": {
        "secretSettingName": "IDP_CLIENT_SECRET"
     },
     "openIdConnectConfiguration" : {}
   }
   ```

1. Within the `openIdConnectConfiguration` object, provide the OpenID Connect metadata you gathered earlier. There are two options for this, based on which information you collected:

   - Set the `wellKnownOpenIdConfiguration` property to the configuration metadata URL you gathered earlier.
   - Alternatively, set the four individual values gathered as follows:
     - Set `issuer` to the issuer URL
     - Set `authorizationEndpoint` to the authorization Endpoint
     - Set `tokenEndpoint` to the token endpoint
     - Set `certificationUri` to the URL of the JSON Web Key Set document

   These two options are mutually exclusive.

Once this configuration has been set, you are ready to use your OpenID Connect provider for authentication in your app.

An example configuration might look like the following (using Sign in with Apple as an example, where the APPLE_GENERATED_CLIENT_SECRET setting points to a generated JWT as per [Apple documentation](https://developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens)):

```json
{
  "auth": {
    "identityProviders": {
      "openIdConnectProviders": {
        "apple": {
          "registration": {
            "clientId": "com.contoso.example.client",
            "clientCredential": {
              "secretSettingName": "APPLE_GENERATED_CLIENT_SECRET"
            },
            "openIdConnectConfiguration": {
              "wellKnownOpenIdConfiguration": "https://appleid.apple.com/.well-known/openid-configuration"
            }
          },
          "login": {
            "nameClaimType": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
            "scope": [],
            "loginParameterNames": []
          }
        }
      }
    }
  }
}
```

## Next steps

> [!div class="nextstepaction"] > [Access user authentication and authorization data](user-information.md)
