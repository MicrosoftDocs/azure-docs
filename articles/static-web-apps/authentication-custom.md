---
title: Custom authentication in Azure Static Web Apps
description: Learn to configure custom authentication for Azure Static Web Apps
services: static-web-apps
author: aaronpowell
ms.author: aapowell
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 05/07/2021
---

# Custom authentication in Azure Static Web Apps

Azure Static Web Apps provides [managed authentication](authentication-authorization.md) that uses provider registrations managed by Azure. To enable more flexibility over the registration, you can override the defaults with a custom registration.

- Custom authentication also allows you to [configure custom providers](#configure-a-custom-openid-connect-provider) that support [OpenID Connect](https://openid.net/connect/). This configuration allows the registration of multiple external providers.

- Using any custom registrations disables all pre-configured providers.

- Specifically for Azure Active Directory (AAD) registrations, you have the option of providing a tenant, which allows you to bypass the [invitation flow](./authentication-authorization.md#role-management) for group management.

> [!NOTE]
> Custom authentication is only available in the Azure Static Web Apps Standard plan.

## Override pre-configured provider

The settings used to override a provider are configured in the `auth` section of the [configuration file](configuration.md).

To avoid putting secrets in source control, the configuration looks into [application settings](application-settings.md) for a matching name in the configuration file. You may also choose to store your secrets in [Azure Key Vault](./key-vault-secrets.md).

### Configuration

Setting up custom authentication requires that you reference a few secrets stored as [application settings](./application-settings.md). 

# [Azure Active Directory](#tab/aad)

Azure Active Directory providers are available in two different versions. Version 1 explicitly defines the `userDetailsClaim`, which allows the payload to return user information. By contrast, version 2 returns user information by default, and is designated by `v2.0` in the `openIdIssuer` URL.

To create the registration, begin by creating the following application settings:

| Setting Name | Value |
| --- | --- |
| `AAD_CLIENT_ID` | The Application (client) ID for the Azure AD app registration. |
| `AAD_CLIENT_SECRET` | The client secret for the Azure AD app registration. |

#### Azure Active Directory Version 1

```json
{
  "auth": {
    "identityProviders": {
      "azureActiveDirectory": {
        "userDetailsClaim": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
        "registration": {
          "openIdIssuer": "https://login.microsoftonline.com/<TENANT_ID>",
          "clientIdSettingName": "AAD_CLIENT_ID",
          "clientSecretSettingName": "AAD_CLIENT_SECRET"
        }
      }
    }
  }
}
```

Make sure to replace `<TENANT_ID>` with your Azure Active Directory tenant ID.

#### Azure Active Directory Version 2

```json
{
  "auth": {
    "identityProviders": {
      "azureActiveDirectory": {
        "registration": {
          "openIdIssuer": "https://login.microsoftonline.com/<TENANT_ID>/v2.0",
          "clientIdSettingName": "AAD_CLIENT_ID",
          "clientSecretSettingName": "AAD_CLIENT_SECRET"
        }
      }
    }
  }
}
```

Make sure to replace `<TENANT_ID>` with your Azure Active Directory tenant ID.

For more information on how to configure Azure Active Directory, see the [App Service Authentication/Authorization documentation](../app-service/configure-authentication-provider-aad.md).

> [!NOTE]
> While the configuration section for Azure Active Directory is `azureActiveDirectory`, the platform aliases this to `aad` in the URL's for login, logout and purging user information. Refer to the [authentication and authorisation](authentication-authorization.md) section for more information.

# [Apple](#tab/apple)

To create the registration, begin by creating the following application settings:

| Setting Name | Value |
| --- | --- |
| `APPLE_CLIENT_ID` | The Apple client ID. |
| `APPLE_CLIENT_SECRET` | The Apple client secret. |

Next, use the following sample to configure the provider.

```json
{
  "auth": {
    "identityProviders": {
      "apple": {
        "registration": {
          "clientIdSettingName": "APPLE_CLIENT_ID",
          "clientSecretSettingName": "APPLE_CLIENT_SECRET"
        }
      }
    }
  }
}
```

For more information on how to configure Apple as an authentication provider, see the [App Service Authentication/Authorization documentation](../app-service/configure-authentication-provider-apple.md).

# [Facebook](#tab/facebook)

To create the registration, begin by creating the following application settings:

| Setting Name | Value |
| --- | --- |
| `FACEBOOK_APP_ID` | The Facebook application ID. |
| `FACEBOOK_APP_SECRET` | The Facebook application secret. |

Next, use the following sample to configure the provider.

```json
{
  "auth": {
    "identityProviders": {
      "facebook": {
        "registration": {
          "appIdSettingName": "FACEBOOK_APP_ID",
          "appSecretSettingName": "FACEBOOK_APP_SECRET"
        }
      }
    }
  }
}
```

For more information on how to configure Facebook as an authentication provider, see the [App Service Authentication/Authorization documentation](../app-service/configure-authentication-provider-facebook.md).

# [GitHub](#tab/github)


To create the registration, begin by creating the following application settings:

| Setting Name | Value |
| --- | --- |
| `GITHUB_CLIENT_ID` | The GitHub client ID. |
| `GITHUB_CLIENT_SECRET` | The GitHub client secret. |

Next, use the following sample to configure the provider.

```json
{
  "auth": {
    "identityProviders": {
      "github": {
        "registration": {
          "clientIdSettingName": "GITHUB_CLIENT_ID",
          "clientSecretSettingName": "GITHUB_CLIENT_SECRET"
        }
      }
    }
  }
}
```

# [Google](#tab/google)


To create the registration, begin by creating the following application settings:

| Setting Name | Value |
| --- | --- |
| `GOOGLE_CLIENT_ID` | The Google client ID. |
| `GOOGLE_CLIENT_SECRET` | The Google client secret. |

Next, use the following sample to configure the provider.

```json
{
  "auth": {
    "identityProviders": {
      "google": {
        "registration": {
          "clientIdSettingName": "GOOGLE_CLIENT_ID",
          "clientSecretSettingName": "GOOGLE_CLIENT_SECRET"
        }
      }
    }
  }
}
```

For more information on how to configure Google as an authentication provider, see the [App Service Authentication/Authorization documentation](../app-service/configure-authentication-provider-google.md).

# [Twitter](#tab/twitter)

To create the registration, begin by creating the following application settings:

| Setting Name | Value |
| --- | --- |
| `TWITTER_CONSUMER_KEY` | The Twitter consumer key. |
| `TWITTER_CONSUMER_SECRET` | The Twitter consumer secret. |

Next, use the following sample to configure the provider.

```json
{
  "auth": {
    "identityProviders": {
      "twitter": {
        "registration": {
          "consumerKeySettingName": "TWITTER_CONSUMER_KEY",
          "consumerSecretSettingName": "TWITTER_CONSUMER_SECRET"
        }
      }
    }
  }
}
```

For more information on how to configure Twitter as an authentication provider, see the [App Service Authentication/Authorization documentation](../app-service/configure-authentication-provider-twitter.md).

---

## Configure a custom OpenID Connect provider

This section shows you how to configure Azure Static Web Apps to use a custom authentication provider that adheres to the [OpenID Connect (OIDC) specification](https://openid.net/connect/). The following steps are required to use an custom OIDC provider.

- One or more OIDC providers are allowed.
- Each provider must have a unique name in the configuration.
- Only one provider can serve as the default redirect target.

### Register your application with the identity provider

You're required to register your application's details with an identity provider. Check with the provider regarding the steps needed to generate a **client ID** and **client secret** for your application.

Once the application is registered with the identity provider, create the following application secrets in the [application settings](application-settings.md) of the Static Web App:

| Setting Name | Value |
| --- | --- |
| `MY_PROVIDER_CLIENT_ID` | The client ID generated by the authentication provider for your static web app. |
| `MY_PROVIDER_CLIENT_SECRET` | The client secret generated by the authentication provider's custom registration for your static web app. |

If you register additional providers, each one needs an associated client ID and client secret store in application settings.

> [!IMPORTANT]
> Application secrets are sensitive security credentials. Do not share this secret with anyone, distribute it within a client application, or check into source control.

Once you have the registration credentials, use the following steps to create a custom registration.

1. You need the OpenID Connect metadata for the provider. This information is often exposed via a [configuration metadata document](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig), which is the provider's _Issuer URL_ suffixed with `/.well-known/openid-configuration`. Gather this configuration URL.

1. Add an `auth` section of the [configuration file](configuration.md) with a configuration block for the OIDC providers, and your provider definition.

   ```json
   {
     "auth": {
       "identityProviders": {
         "customOpenIdConnectProviders": {
           "myProvider": {
             "registration": {
               "clientIdSettingName": "MY_PROVIDER_CLIENT_ID",
               "clientCredential": {
                 "clientSecretSettingName": "MY_PROVIDER_CLIENT_SECRET"
               },
               "openIdConnectConfiguration": {
                 "wellKnownOpenIdConfiguration": "https://<PROVIDER_ISSUER_URL>/.well-known/openid-configuration"
               }
             },
             "login": {
               "nameClaimType": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
               "scopes": [],
               "loginParameterNames": []
             }
           }
         }
       }
     }
   }
   ```

  - The provider name, `myProvider` in this example, is the unique identifier used by Azure Static Web Apps.
  - Make sure to replace `<PROVIDER_ISSUER_URL>` with the path to the _Issuer URL_ of the provider.
  - The `login` object allows you to provide values for: custom scopes, login parameters, or custom claims.

### Login, logout, and purging user details

To use a custom OIDC provider, use the following URL patterns.

| Action             | Pattern                                  |
| ------------------ | ---------------------------------------- |
| Login              | `/.auth/login/<PROVIDER_NAME_IN_CONFIG>` |
| Logout             | `/.auth/logout`                          |
| Purge user details | `/.auth/purge/<PROVIDER_NAME_IN_CONFIG>` |

If you are using Azure Active Directory, use `aad` as the value for the `<AUTHENTICATION_PROVIDER_NAME>` placeholder.

### Authentication callbacks

Custom OIDC providers require redirect URL to complete the login or logout request. The following endpoints are available as redirect destinations.

| Type   | URL pattern                                                 |
| ------ | ----------------------------------------------------------- |
| Login  | `https://<YOUR_SITE>/.auth/login/<PROVIDER_NAME_IN_CONFIG>/callback`  |
| Logout | `https://<YOUR_SITE>/.auth/logout/<PROVIDER_NAME_IN_CONFIG>/callback` |

If you are using Azure Active Directory, use `aad` as the value for the `<AUTHENTICATION_PROVIDER_NAME>` placeholder.

> [!Note]
> These URLs are provided by Azure Static Web Apps to receive the response from the authentication provider, you don't need to create pages at these routes.

## Next steps

> [!div class="nextstepaction"]
> [Securing authentication secrets in Azure Key Vault](./key-vault-secrets.md)
