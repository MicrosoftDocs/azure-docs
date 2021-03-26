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
    "azureActiveDirectory": {
      "enabled": true, // defaults to true on all the providers if the provider is configured to a non null value (i.e. not "azureActiveDirectory": null)
      "registration": {
        "openIdIssuer": "https://login.microsoftonline.com/<tenant id>",
        "clientIdSettingName": "AAD_CLIENT_ID",
        "clientSecretSettingName": "AAD_CLIENT_SECRET"
      },
      "login": {
        "loginParameters": []
      },
      "userDetailsClaim": "name" // the name of the claim that the provider will provide that contains the identity value you want to use as the "userDetails"
    }
  }
}
```

> [!NOTE]
> To avoid putting secret information in source control, the configuration information will look into [Application Settings](application-settings.md), for settings matching the name provided in the configuration file.

> [!NOTE]
> The redirect endpoints required for login/logout be `https://<your site>/.auth/login/complete` and `https://<your site>/.auth/logout/complete`.

### Default provider configuration mapping

The following table contains the different configuration options for each of the default providers.

| Provider Name | Field Path                               | Description                                                                                           |
| ------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| AAD           | `registration.openIdIssuer`              | The endpoint for the OpenID configuration of the AAD tenant                                           |
| &nbsp;        | `registration.clientIdSettingName`       | The name of the Application Setting for the Client ID                                                 |
| &nbsp;        | `registration.clientSecretSettingName`   | The name of the Application Setting for the Client Secret                                             |
| &nbsp;        | `userDetailsClaim`                       | The field to read from the Claims response and expose as user details. The value `name` is expected   |
| Apple         | `registration.clientIdSettingName`       | The name of the Application Setting for the Client ID                                                 |
| &nbsp;        | `registration.clientSecretSettingName`   | The name of the Application Setting for the Client Secret                                             |
| &nbsp;        | `userDetailsClaim`                       | The field to read from the Claims response and expose as user details. The value `name` is expected   |
| Facebook      | `registration.appIdSettingName`          | The name of the Application Setting for the App ID                                                    |
| &nbsp;        | `registration.appSecretSettingName`      | The name pf the Application Setting for the App Secret                                                |
| &nbsp;        | `userDetailsClaim`                       | The field to read from the Claims response and expose as user details. The value `email` is expected  |
| GitHub        | `registration.clientIdSettingName`       | The name of the Application Setting for the Client ID                                                 |
| &nbsp;        | `registration.clientSecretSettingName`   | The name of the Application Setting for the Client Secret                                             |
| &nbsp;        | `userDetailsClaim`                       | The field to read from the Claims response and expose as user details. The value `name` is expected   |
| Google        | `registration.clientIdSettingName`       | The name of the Application Setting for the Client ID                                                 |
| &nbsp;        | `registration.clientSecretSettingName`   | The name of the Application Setting for the Client Secret                                             |
| &nbsp;        | `userDetailsClaim`                       | The field to read from the Claims response and expose as user details. The value `name` is expected   |
| Twitter       | `registration.consumerKeySettingName`    | The name of the Application Setting for the Client ID                                                 |
| &nbsp;        | `registration.consumerSecretSettingName` | The name of the Application Setting for the Client Secret                                             |
| &nbsp;        | `userDetailsClaim`                       | The field to read from the Claims response and expose as user details. The value `handle` is expected |

## Configuring a custom OpenID Connect provider

This article shows you how to configure Azure Static Web Apps to use a custom authentication provider that adheres to the [OpenID Connect specification](https://openid.net/connect/). OpenID Connect (OIDC) is an industry standard used by many identity providers (IDPs). You do not need to understand the details of the specification in order to configure your app to use an adherent IDP.

Your can configure your app to use one or more OIDC providers. Each must be given a unique name in the configuration, and only one can serve as the default redirect target.

### Register your application with the identity provider

Your provider will require you to register the details of your application with it. Please see the instructions relevant to that provider. You will need to collect a **client ID** and **client secret** for your application.

> [!IMPORTANT]
> The app secret is an important security credential. Do not share this secret with anyone or distribute it within a client application.

Add the client id and client secret as [application settings](application-settings.md) for the app, using a setting name of your choice. Make note of this name for later.

Additionally, you will need the OpenID Connect metadata for the provider. This is often exposed via a [configuration metadata document](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig), which is the provider's Issuer URL suffixed with `/.well-known/openid-configuration`. Gather this configuration URL.

If you are unable to use a configuration metadata document, you will need to gather the following values separately:

- The issuer URL (sometimes shown as `issuer`)
- The [OAuth 2.0 Authorization endpoint](https://tools.ietf.org/html/rfc6749#section-3.1) (sometimes shown as `authorization_endpoint`)
- The [OAuth 2.0 Token endpoint](https://tools.ietf.org/html/rfc6749#section-3.2) (sometimes shown as `token_endpoint`)
- The URL of the [OAuth 2.0 JSON Web Key Set](https://tools.ietf.org/html/rfc8414#section-2) document (sometimes shown as `jwks_uri`)

Within the `openIdConnectConfiguration` object, provide the OpenID Connect metadata you gathered earlier. There are two options for this, based on which information you collected:

- Set the `wellKnownOpenIdConfiguration` property to the configuration metadata URL you gathered earlier.
- Alternatively, set the four individual values gathered as follows:
  - Set `issuer` to the issuer URL
  - Set `authorizationEndpoint` to the authorization Endpoint
  - Set `tokenEndpoint` to the token endpoint
  - Set `certificationUri` to the URL of the JSON Web Key Set document

These two options are mutually exclusive.

Once this configuration has been set, you are ready to use your OpenID Connect provider for authentication in your app.

An example configuration might look like the following:

```json
{
  "auth": {
    "identityProviders": {
      "openIdConnectProviders": {
        "myProvider": {
          "registration": {
            "clientIdSettingName": "MY_PROVIDER_ID",
            "clientCredential": {
              "secretSettingName": "MY_PROVIDER_CLIENT_SECRET"
            },
            "openIdConnectConfiguration": {
              "wellKnownOpenIdConfiguration": "https://my-id.server/.well-known/openid-configuration"
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

### Creating a browser login/logout

To allow users to login using a custom OIDC provider, navigate them to `/.auth/<provider name>/login`. For logout, use `/.auth/<provider name>/logout`.

## Next steps

> [!div class="nextstepaction"] > [Access user authentication and authorization data](user-information.md)
