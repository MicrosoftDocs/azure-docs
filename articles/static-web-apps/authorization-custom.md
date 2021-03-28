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

Azure Static Web Apps provides managed authentication but also the option to provide your own settings for the providers and even a custom provider that supports [OpenID Connect](https://openid.net/connect/).

## Overriding a default provider

> [!NOTE]
> Custom authorization is only available in the Standard tier of Azure Static Web Apps.

The settings used to override the built-in providers is configured in the `auth` section of the [Configuration file](configuration.md). For example, the following snippet shows how a custom Azure Active Directory provider is configured.

```json
{
  "auth": {
    "azureActiveDirectory": {
      "enabled": true,
      "registration": {
        "openIdIssuer": "https://login.microsoftonline.com/<TENANT_ID>",
        "clientIdSettingName": "AAD_CLIENT_ID",
        "clientSecretSettingName": "AAD_CLIENT_SECRET"
      },
      "login": {
        "loginParameters": []
      },
      "userDetailsClaim": "name"
    }
  }
}
```

- `enabled`: Defaults to `true` on all the providers if the provider is configured to a non-null value (i.e. not `"azureActiveDirectory": null`).
- `userDetailsClaim`: The name of the claim that contains the `userDetails` identity value.
- To avoid putting secrets in source control, the configuration looks into [Application Settings](application-settings.md), for a matching name in the configuration file.
- The redirect endpoints required for login or logout are `https://<YOUR-SITE>/.auth/login/complete` and `https://<YOUR-SITE>/.auth/logout/complete`.

### Default provider configuration

The following tables contain the different configuration options for each default provider.

#### Azure Active Directory

| Field Path                             | Description                                                                                                              |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `registration.openIdIssuer`            | The endpoint for the OpenID configuration of the AAD tenant                                                              |
| `registration.clientIdSettingName`     | The name of an application setting that is configured with the Application (client) ID for the Azure AD app registration |
| `registration.clientSecretSettingName` | The name of the application setting that is configured with a client secret for the Azure AD app registration            |
| `userDetailsClaim`                     | The field to read from the Claims response and expose as user details. The value `name` is expected                      |

#### Apple

| Field Path                             | Description                                                                                         |
| -------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `registration.clientIdSettingName`     | The name of the Application Setting for the Client ID                                               |
| `registration.clientSecretSettingName` | The name of the Application Setting for the Client Secret                                           |
| `userDetailsClaim`                     | The field to read from the Claims response and expose as user details. The value `name` is expected |

#### Facebook

| Field Path                          | Description                                                                                          |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `registration.appIdSettingName`     | The name of the Application Setting for the App ID                                                   |
| `registration.appSecretSettingName` | The name pf the Application Setting for the App Secret                                               |
| `userDetailsClaim`                  | The field to read from the Claims response and expose as user details. The value `email` is expected |

#### GitHub

| Field Path                             | Description                                                                                         |
| -------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `registration.clientIdSettingName`     | The name of the Application Setting for the Client ID                                               |
| `registration.clientSecretSettingName` | The name of the Application Setting for the Client Secret                                           |
| `userDetailsClaim`                     | The field to read from the Claims response and expose as user details. The value `name` is expected |

#### Google

| Field Path                             | Description                                                                                         |
| -------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `registration.clientIdSettingName`     | The name of the Application Setting for the Client ID                                               |
| `registration.clientSecretSettingName` | The name of the Application Setting for the Client Secret                                           |
| `userDetailsClaim`                     | The field to read from the Claims response and expose as user details. The value `name` is expected |

#### Twitter

| Field Path                               | Description                                                                                           |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `registration.consumerKeySettingName`    | The name of the Application Setting for the Client ID                                                 |
| `registration.consumerSecretSettingName` | The name of the Application Setting for the Client Secret                                             |
| `userDetailsClaim`                       | The field to read from the Claims response and expose as user details. The value `handle` is expected |

## Configuring a custom OpenID Connect provider

This article shows you how to configure Azure Static Web Apps to use a custom authentication provider that adheres to the [OpenID Connect specification](https://openid.net/connect/). OpenID Connect (OIDC) is an industry standard used by many identity providers (IDPs). You do not need to understand the details of the specification in order to configure your app to use an adherent IDP.

You can configure your app to use one or more OIDC providers. Each must be given a unique name in the configuration, and only one can serve as the default redirect target.

### Register your application with the identity provider

You are required to register your application's details with an identity provider. Check with your desired provider regarding the steps needed to generate a **client ID** and **client secret** for your application.

> [!IMPORTANT]
> Application secrets are sensitive security credentials. Do not share this secret with anyone, distribute it within a client application, or check into source control.

Add the client ID and client secret as [application settings](application-settings.md) for the app, using setting names of your choice. Make note of these names for later.

Additionally, you will need the OpenID Connect metadata for the provider. This is often exposed via a [configuration metadata document](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig), which is the provider's Issuer URL suffixed with `/.well-known/openid-configuration`. Gather this configuration URL.

If you are unable to use a configuration metadata document, you will need to gather the following values separately:

- The issuer URL, sometimes shown as `issuer`.
- The [OAuth 2.0 Authorization endpoint](https://tools.ietf.org/html/rfc6749#section-3.1), sometimes shown as `authorization_endpoint`.
- The [OAuth 2.0 Token endpoint](https://tools.ietf.org/html/rfc6749#section-3.2), sometimes shown as `token_endpoint`.
- The URL of the [OAuth 2.0 JSON Web Key Set](https://tools.ietf.org/html/rfc8414#section-2) document, sometimes shown as `jwks_uri`.

Within the `openIdConnectConfiguration` object, provide the OpenID Connect metadata you gathered earlier. There are two options for this configuration, based on which information you collected:

- **Option 1**: Set the `wellKnownOpenIdConfiguration` property to the configuration metadata URL you gathered earlier.
- **Option 2**: Set the four individual values as follows:
  - Set `issuer` to the issuer URL
  - Set `authorizationEndpoint` to the authorization Endpoint
  - Set `tokenEndpoint` to the token endpoint
  - Set `certificationUri` to the URL of the JSON Web Key Set document

These two options are mutually exclusive.

Once the configuration is set, you are ready to use your OpenID Connect provider for authentication in your app.

## Example configuration

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

## Login, logout and purging user details

To allow users to login using a custom OIDC provider, have them navigate to `/.auth/<PROVIDER_NAME>/login`. To logout, use the URL `/.auth/<PROVIDER_NAME>/logout` and to purge the user details, use the URL `/.auth/<PROVIDER_NAME>/purge`.

## Next steps

> [!div class="nextstepaction"]
> [Access user authentication and authorization data](user-information.md)
