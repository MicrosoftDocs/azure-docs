---
title: Custom authentication in Azure Static Web Apps
description: Learn to configure custom authentication for Azure Static Web Apps
services: static-web-apps
author: aaronpowell
ms.author: aapowell
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 10/08/2021
---

# Custom authentication in Azure Static Web Apps

Azure Static Web Apps provides [managed authentication](authentication-authorization.md) that uses provider registrations managed by Azure. To enable more flexibility over the registration, you can override the defaults with a custom registration.

- Custom authentication also allows you to [configure custom providers](./authentication-custom.md?tabs=openid-connect#configure-a-custom-identity-provider) that support [OpenID Connect](https://openid.net/connect/). This configuration allows the registration of multiple external providers.

- Using any custom registrations disables all pre-configured providers.

> [!NOTE]
> Custom authentication is only available in the Azure Static Web Apps Standard plan.

## Configure a custom identity provider

Custom identity providers are configured in the `auth` section of the [configuration file](configuration.md).

To avoid putting secrets in source control, the configuration looks into [application settings](application-settings.md#configure-application-settings) for a matching name in the configuration file. You may also choose to store your secrets in [Azure Key Vault](./key-vault-secrets.md).

# [Microsoft Entra ID](#tab/aad)

To create the registration, begin by creating the following [application settings](application-settings.md#configure-application-settings):

| Setting Name | Value |
| --- | --- |
| `AZURE_CLIENT_ID` | The Application (client) ID for the Microsoft Entra app registration. |
| `AZURE_CLIENT_SECRET` | The client secret for the Microsoft Entra app registration. |

Next, use the following sample to configure the provider in the [configuration file](configuration.md).

Microsoft Entra providers are available in two different versions. Version 1 explicitly defines the `userDetailsClaim`, which allows the payload to return user information. By contrast, version 2 returns user information by default, and is designated by `v2.0` in the `openIdIssuer` URL.

<a name='azure-active-directory-version-1'></a>

### Microsoft Entra Version 1

```json
{
  "auth": {
    "identityProviders": {
      "azureActiveDirectory": {
        "userDetailsClaim": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
        "registration": {
          "openIdIssuer": "https://login.microsoftonline.com/<TENANT_ID>",
          "clientIdSettingName": "AZURE_CLIENT_ID",
          "clientSecretSettingName": "AZURE_CLIENT_SECRET"
        }
      }
    }
  }
}
```

Make sure to replace `<TENANT_ID>` with your Microsoft Entra tenant ID.

<a name='azure-active-directory-version-2'></a>

### Microsoft Entra Version 2

```json
{
  "auth": {
    "identityProviders": {
      "azureActiveDirectory": {
        "registration": {
          "openIdIssuer": "https://login.microsoftonline.com/<TENANT_ID>/v2.0",
          "clientIdSettingName": "AZURE_CLIENT_ID",
          "clientSecretSettingName": "AZURE_CLIENT_SECRET"
        }
      }
    }
  }
}
```

Make sure to replace `<TENANT_ID>` with your Microsoft Entra tenant ID.

For more information on how to configure Microsoft Entra ID, see the [App Service Authentication/Authorization documentation](../app-service/configure-authentication-provider-aad.md#-option-2-use-an-existing-registration-created-separately) on using an existing registration.

To configure which accounts can sign in, see [Modify the accounts supported by an application](../active-directory/develop/howto-modify-supported-accounts.md) and [Restrict your Microsoft Entra app to a set of users in a Microsoft Entra tenant](../active-directory/develop/howto-restrict-your-app-to-a-set-of-users.md).

> [!NOTE]
> While the configuration section for Microsoft Entra ID is `azureActiveDirectory`, the platform aliases this to `aad` in the URL's for login, logout and purging user information. Refer to the [authentication and authorization](authentication-authorization.md) section for more information.

# [Apple](#tab/apple)

To create the registration, begin by creating the following [application settings](application-settings.md):

| Setting Name | Value |
| --- | --- |
| `APPLE_CLIENT_ID` | The Apple client ID. |
| `APPLE_CLIENT_SECRET` | The Apple client secret. |

Next, use the following sample to configure the provider in the [configuration file](configuration.md).

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

To create the registration, begin by creating the following [application settings](application-settings.md):

| Setting Name | Value |
| --- | --- |
| `FACEBOOK_APP_ID` | The Facebook application ID. |
| `FACEBOOK_APP_SECRET` | The Facebook application secret. |

Next, use the following sample to configure the provider in the [configuration file](configuration.md).

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


To create the registration, begin by creating the following [application settings](application-settings.md):

| Setting Name | Value |
| --- | --- |
| `GITHUB_CLIENT_ID` | The GitHub client ID. |
| `GITHUB_CLIENT_SECRET` | The GitHub client secret. |

Next, use the following sample to configure the provider in the [configuration file](configuration.md).

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


To create the registration, begin by creating the following [application settings](application-settings.md):

| Setting Name | Value |
| --- | --- |
| `GOOGLE_CLIENT_ID` | The Google client ID. |
| `GOOGLE_CLIENT_SECRET` | The Google client secret. |

Next, use the following sample to configure the provider in the [configuration file](configuration.md).

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

To create the registration, begin by creating the following [application settings](application-settings.md):

| Setting Name | Value |
| --- | --- |
| `TWITTER_CONSUMER_KEY` | The Twitter consumer key. |
| `TWITTER_CONSUMER_SECRET` | The Twitter consumer secret. |

Next, use the following sample to configure the provider in the [configuration file](configuration.md).

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

# [OpenID Connect](#tab/openid-connect)

You can configure Azure Static Web Apps to use a custom authentication provider that adheres to the [OpenID Connect (OIDC) specification](https://openid.net/connect/). The following steps are required to use an custom OIDC provider.

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

---

## Authentication callbacks

Identity providers require a redirect URL to complete the login or logout request. Most providers require that you add the callback URLs to an allowlist. The following endpoints are available as redirect destinations.

| Type   | URL pattern                                                 |
| ------ | ----------------------------------------------------------- |
| Login  | `https://<YOUR_SITE>/.auth/login/<PROVIDER_NAME_IN_CONFIG>/callback`  |
| Logout | `https://<YOUR_SITE>/.auth/logout/<PROVIDER_NAME_IN_CONFIG>/callback` |

If you are using Microsoft Entra ID, use `aad` as the value for the `<PROVIDER_NAME_IN_CONFIG>` placeholder.

> [!Note]
> These URLs are provided by Azure Static Web Apps to receive the response from the authentication provider, you don't need to create pages at these routes.

## Login, logout, and user details

To use a custom identity provider, use the following URL patterns.

| Action             | Pattern                                  |
| ------------------ | ---------------------------------------- |
| Login              | `/.auth/login/<PROVIDER_NAME_IN_CONFIG>` |
| Logout             | `/.auth/logout`                          |
| User details       | `/.auth/me`                              |
| Purge user details | `/.auth/purge/<PROVIDER_NAME_IN_CONFIG>` |

If you are using Microsoft Entra ID, use `aad` as the value for the `<PROVIDER_NAME_IN_CONFIG>` placeholder.

## Manage roles

Every user who accesses a static web app belongs to one or more roles. There are two built-in roles that users can belong to:

- **anonymous**: All users automatically belong to the _anonymous_ role.
- **authenticated**: All users who are signed in belong to the _authenticated_ role.

Beyond the built-in roles, you can assign custom roles to users, and reference them in the _staticwebapp.config.json_ file.

# [Invitations](#tab/invitations)

### Add a user to a role

To add a user to a role, you generate invitations that allow you to associate users to specific roles. Roles are defined and maintained in the _staticwebapp.config.json_ file.

<a name="invitations" id="invitations"></a>

#### Create an invitation

Invitations are specific to individual authorization-providers, so consider the needs of your app as you select which providers to support. Some providers expose a user's email address, while others only provide the site's username.

<a name="provider-user-details" id="provider-user-details"></a>

| Authorization provider | Exposes |
| ---------------------- | ---------------- |
| Microsoft Entra ID | email address    |
| GitHub                 | username         |
| Twitter                | username         |

Do the following steps to create an invitation.

1. Go to a Static Web Apps resource in the [Azure portal](https://portal.azure.com).
2. Under _Settings_, select **Role Management**.
3. Select **Invite**.
4. Select an _Authorization provider_ from the list of options.
5. Add either the username or email address of the recipient in the _Invitee details_ box.
   - For GitHub and Twitter, enter the username. For all others, enter the recipient's email address.
6. Select the domain of your static site from the _Domain_ drop-down menu.
   - The domain you select is the domain that appears in the invitation. If you have a custom domain associated with your site, choose the custom domain.
7. Add a comma-separated list of role names in the _Role_ box.
8. Enter the maximum number of hours you want the invitation to remain valid.
   - The maximum possible limit is 168 hours, which is seven days.
9. Select **Generate**.
10. Copy the link from the _Invite link_ box.
11. Email the invitation link to the user that you're granting access to.

When the user selects the link in the invitation, they're prompted to sign in with their corresponding account. Once successfully signed in, the user is associated with the selected roles.

> [!CAUTION]
> Make sure your route rules don't conflict with your selected authentication providers. Blocking a provider with a route rule prevents users from accepting invitations.

### Update role assignments

1. Go to a Static Web Apps resource in the [Azure portal](https://portal.azure.com).
1. Under _Settings_, select **Role Management**.
2. Select the user in the list.
3. Edit the list of roles in the _Role_ box.
4. Select **Update**.

### Remove user

1. Go to a Static Web Apps resource in the [Azure portal](https://portal.azure.com).
1. Under _Settings_, select **Role Management**.
1. Locate the user in the list.
1. Check the checkbox on the user's row.
2. Select **Delete**.

As you remove a user, keep in mind the following items:

- Removing a user invalidates their permissions.
- Worldwide propagation may take a few minutes.
- If the user is added back to the app, the [`userId` changes](user-information.md).

# [Function (preview)](#tab/function)

Instead of using the built-in invitations system, you can use a serverless function to programmatically assign roles to users when they sign in.

To assign custom roles in a function, you can define an API function that is automatically called after each time a user successfully authenticates with an identity provider. The function is passed the user's information from the provider. It must return a list of custom roles that are assigned to the user.

Example uses of this function include:

- Query a database to determine which roles a user should be assigned
- Call the [Microsoft Graph API](https://developer.microsoft.com/graph) to determine a user's roles based on their Active Directory group membership
- Determine a user's roles based on claims returned by the identity provider

> [!NOTE]
> The ability to assign roles via a function is only available when [custom authentication](authentication-custom.md) is configured.
>
> When this feature is enabled, any roles assigned via the built-in invitations system are ignored.

### Configure a function for assigning roles

To configure Static Web Apps to use an API function as the role assignment function, add a `rolesSource` property to the `auth` section of your app's [configuration file](configuration.md). The value of the `rolesSource` property is the path to the API function.

```json
{
  "auth": {
    "rolesSource": "/api/GetRoles",
    "identityProviders": {
      // ...
    }
  }
}
```

> [!NOTE]
> Once configured, the role assignment function can no longer be accessed by external HTTP requests.

### Create a function for assigning roles

After you define the `rolesSource` property in your app's configuration, add an [API function](apis-functions.md) in your static web app at the specified path. You can use a managed function app or [bring your own function app](functions-bring-your-own.md).

Each time a user successfully authenticates with an identity provider, the POST method calls the specified function. The function passes a JSON object in the request body that contains the user's information from the provider. For some identity providers, the user information also includes an `accessToken` that the function can use to make API calls using the user's identity.

See the following example payload from Microsoft Entra ID:

```json
{
  "identityProvider": "aad",
  "userId": "72137ad3-ae00-42b5-8d54-aacb38576d76",
  "userDetails": "ellen@contoso.com",
  "claims": [
      {
          "typ": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
          "val": "ellen@contoso.com"
      },
      {
          "typ": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
          "val": "Contoso"
      },
      {
          "typ": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname",
          "val": "Ellen"
      },
      {
          "typ": "name",
          "val": "Ellen Contoso"
      },
      {
          "typ": "http://schemas.microsoft.com/identity/claims/objectidentifier",
          "val": "7da753ff-1c8e-4b5e-affe-d89e5a57fe2f"
      },
      {
          "typ": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
          "val": "72137ad3-ae00-42b5-8d54-aacb38576d76"
      },
      {
          "typ": "http://schemas.microsoft.com/identity/claims/tenantid",
          "val": "3856f5f5-4bae-464a-9044-b72dc2dcde26"
      },
      {
          "typ": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
          "val": "ellen@contoso.com"
      },
      {
          "typ": "ver",
          "val": "1.0"
      }
  ],
  "accessToken": "eyJ0eXAiOiJKV..."
}
```

The function can use the user's information to determine which roles to assign to the user. It must return an HTTP 200 response with a JSON body containing a list of custom role names to assign to the user.

For example, to assign the user to the `Reader` and `Contributor` roles, return the following response:

```json
{
  "roles": [
    "Reader",
    "Contributor"
  ]
}
```

If you don't want to assign any other roles to the user, return an empty `roles` array.

To learn more, see [Tutorial: Assign custom roles with a function and Microsoft Graph](assign-roles-microsoft-graph.md).

---

## Next steps

> [!div class="nextstepaction"]
> [Set user roles programmatically](./assign-roles-microsoft-graph.md)
