---
title: Custom authentication in Azure Static Web Apps
description: Learn to configure custom authentication for Azure Static Web Apps
services: static-web-apps
author: aaronpowell
ms.author: aapowell
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 3/24/2021
---

# Custom authentication in Azure Static Web Apps

Azure Static Web Apps provides [managed authentication](authentication-authorization.md) which uses provider registrations managed by Azure. To enable more flexibility over the registration, you can override the defaults with a custom registration. By using your own provider registration, there is no need to use the [invitation flow](./authentication-authorization.md#role-management) within Static Web Apps for group management.

In addition, custom authentication allows you to [configure custom providers](#configure-a-custom-openid-connect-provider) that support [OpenID Connect](https://openid.net/connect/).

> [!NOTE]
> Custom authentication is only available in the Standard tier of Azure Static Web Apps.

## Override a default provider


The settings used to override the built-in providers are configured in the `auth` section of the [configuration file](configuration.md).

To avoid putting secrets in source control, the configuration looks into [application settings](application-settings.md) for a matching name in the configuration file.

### Default provider configuration

The following tables contain the different configuration options for each default provider.

# [Azure Active Directory](#tab/aad)

| Field Path                             | Description                                                                                                               |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `registration.openIdIssuer`            | The endpoint for the OpenID configuration of the AAD tenant.                                                              |
| `registration.clientIdSettingName`     | The name of an application setting that is configured with the Application (client) ID for the Azure AD app registration. |
| `registration.clientId`                | The value of the Application (client) ID. This can be used as an alternative to the `clientIdSecret`.                     |
| `registration.clientSecretSettingName` | The name of the application setting that is configured with a client secret for the Azure AD app registration.            |

```json
{
  "auth": {
    "azureActiveDirectory": {
      "registration": {
        "openIdIssuer": "https://login.microsoftonline.com/<TENANT_ID>",
        "clientIdSettingName": "<AAD_CLIENT_ID>",
        "clientSecretSettingName": "<AAD_CLIENT_SECRET>"
      }
    }
  }
}
```

For more information on how to configure Azure Active Directory refer to the [App Service Authentication/Authorization documentation](../app-service/configure-authentication-provider-aad.md).

# [Apple](#tab/apple)

| Field Path                             | Description                                                                             |
| -------------------------------------- | --------------------------------------------------------------------------------------- |
| `registration.clientIdSettingName`     | The name of the application setting for the Client ID.                                  |
| `registration.clientId`                | The value of the Client ID. This can be used as an alternative to the `clientIdSecret`. |
| `registration.clientSecretSettingName` | The name of the application setting for the Client Secret.                              |

```json
{
  "auth": {
    "apple": {
      "registration": {
        "clientIdSettingName": "<APPLE_CLIENT_ID>",
        "clientSecretSettingName": "<APPLE_CLIENT_SECRET>"
      }
    }
  }
}
```

For more information on how to configure Apple as an authentication provider refer to the [App Service Authentication/Authorization documentation](../app-service/configure-authentication-provider-apple.md).

# [Facebook](#tab/facebook)

| Field Path                          | Description                                                                       |
| ----------------------------------- | --------------------------------------------------------------------------------- |
| `registration.appIdSettingName`     | The name of the application setting for the App ID.                               |
| `registration.appId`                | The value of the App ID. This can be used as an alternative to the `appIdSecret`. |
| `registration.appSecretSettingName` | The name pf the application setting for the App Secret.                           |

```json
{
  "auth": {
    "facebook": {
      "registration": {
        "appIdSettingName": "<FACEBOOK_APP_ID>",
        "appSecretSettingName": "<FACEBOOK_APP_SECRET>"
      }
    }
  }
}
```

For more information on how to configure Facebook as an authentication provider refer to the [App Service Authentication/Authorization documentation](../app-service/configure-authentication-provider-facebook.md).

# [GitHub](#tab/github)

| Field Path                             | Description                                                                             |
| -------------------------------------- | --------------------------------------------------------------------------------------- |
| `registration.clientIdSettingName`     | The name of the application setting for the Client ID.                                  |
| `registration.clientId`                | The value of the Client ID. This can be used as an alternative to the `clientIdSecret`. |
| `registration.clientSecretSettingName` | The name of the application setting for the Client Secret.                              |

```json
{
  "auth": {
    "github": {
      "registration": {
        "clientIdSettingName": "<GITHUB_CLIENT_ID>",
        "clientSecretSettingName": "<GITHUB_CLIENT_SECRET>"
      }
    }
  }
}
```

For more information on how to configure GitHub as an authentication provider refer to the [App Service Authentication/Authorization documentation](../app-service/configure-authentication-provider-github.md).

# [Google](#tab/google)

| Field Path                             | Description                                                                             |
| -------------------------------------- | --------------------------------------------------------------------------------------- |
| `registration.clientIdSettingName`     | The name of the application setting for the Client ID.                                  |
| `registration.clientId`                | The value of the Client ID. This can be used as an alternative to the `clientIdSecret`. |
| `registration.clientSecretSettingName` | The name of the application setting for the Client Secret.                              |

```json
{
  "auth": {
    "google": {
      "registration": {
        "clientIdSettingName": "<GOOGLE_CLIENT_ID>",
        "clientSecretSettingName": "<GOOGLE_CLIENT_SECRET>"
      }
    }
  }
}
```

For more information on how to configure Google as an authentication provider refer to the [App Service Authentication/Authorization documentation](../app-service/configure-authentication-provider-google.md).

# [Twitter](#tab/twitter)

| Field Path                               | Description                                                                                   |
| ---------------------------------------- | --------------------------------------------------------------------------------------------- |
| `registration.consumerKeySettingName`    | The name of the application setting for the Consumer Key.                                     |
| `registration.consumerKey`               | The value of the Consumer Key. This can be used as an alternative to the `consumerKeySecret`. |
| `registration.consumerSecretSettingName` | The name of the application setting for the Consumer Secret.                                  |

```json
{
  "auth": {
    "twitter": {
      "registration": {
        "consumerKeySettingName": "<TWITTER_CONSUMER_KEY>",
        "consumerSecretSettingName": "<TWITTER_CONSUMER_SECRET>"
      }
    }
  }
}
```

For more information on how to configure Twitter as an authentication provider refer to the [App Service Authentication/Authorization documentation](../app-service/configure-authentication-provider-twitter.md).

---


## Configure a custom OpenID Connect provider

This section shows you how to configure Azure Static Web Apps to use a custom authentication provider that adheres to the [OpenID Connect (OIDC) specification](https://openid.net/connect/). This is required if you want to use an OIDC provider other than the built in providers provided by Azure Static Web Apps.

- One or more OIDC providers are allowed.
- Each provider must have a unique name in the configuration.
- Only one provider can serve as the default redirect target.

### Register your application with the identity provider

You are required to register your application's details with an identity provider. Check with your desired provider regarding the steps needed to generate a **client ID** and **client secret** for your application.

> [!IMPORTANT]
> Application secrets are sensitive security credentials. Do not share this secret with anyone, distribute it within a client application, or check into source control.

Once you have the registration credentials, use the following steps to create a custom registration.

1. Add the client ID and client secret as [application settings](application-settings.md) for the app, using setting names of your choice. Make note of these names for later. Alternatively, the client ID can be included in the configuration file, as with the built in providers.

1. You need the OpenID Connect metadata for the provider. This information is often exposed via a [configuration metadata document](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig), which is the provider's _Issuer URL_ suffixed with `/.well-known/openid-configuration`. Gather this configuration URL.

1. Add an `auth` section of the [configuration file](configuration.md) with a configuration block for the OIDC providers, and your provider definition. 

```json
{
  "auth": {
    "identityProviders": {
      "openIdConnectProviders": {
        "myProvider": {
          "registration": {
            "clientIdSettingName": "<MY_PROVIDER_CLIENT_ID>",
            "clientCredential": {
              "secretSettingName": "<MY_PROVIDER_CLIENT_SECRET>"
            },
            "openIdConnectConfiguration": {
              "wellKnownOpenIdConfiguration": "https://<MY_ID_SERVER>/.well-known/openid-configuration"
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
- The provider name,  `myProvider` in this example, is the unique identifier used by Azure Static Web Apps.
- The `registration` object that contains the client ID and client secret.
- The `wellKnownOpenIdConfiguration` uses the path to the _Issuer URL_ of the provider.
- The `login` object allows you to provide values for: custom scopes, login parameters, or custom claims.
## Authentication callbacks

Authentication providers require redirect URL to complete the login or logout request. The following endpoints are available as redirect destinations.

| Type   | URL pattern                                                 |
| ------ | ----------------------------------------------------------- |
| Login  | `https://<YOUR_SITE>/.auth/login/<PROVIDER_NAME>/callback`  |
| Logout | `https://<YOUR_SITE>/.auth/logout/<PROVIDER_NAME>/callback` |

> [!Note]
> These URLs are provided by Azure Static Web Apps to receive the response from the authentication provider, you don't need to create pages at these routes.
## Login, logout and purging user details

To use a custom OIDC provider, use the following URL patterns.

| Action             | Pattern                                  |
| ------------------ | ---------------------------------------- |
| Login              | `/.auth/login/<PROVIDER_NAME_IN_CONFIG>` |
| Logout             | `/.auth/logout`                          |
| Purge user details | `/.auth/purge/<PROVIDER_NAME_IN_CONFIG>` |

## Next steps

> [!div class="nextstepaction"]
> [Access user authentication and authorization data](user-information.md)
