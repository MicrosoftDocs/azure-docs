---
title: Authentication and authorization for Azure Static Web Apps
description: Learn to use different authorization providers to secure your static app.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 10/08/2021
ms.author: cshoe
---

# Authentication and authorization for Azure Static Web Apps

Azure Static Web Apps provides a streamlined authentication experience. By default, you have access to a series of pre-configured providers, or the option to [register a custom provider](./authentication-custom.md).

- Any user can authenticate with an enabled provider.
- Once logged in, users belong to the `anonymous` and `authenticated` roles by default.
- Authorized users gain access to restricted [routes](configuration.md#routes) by rules defined in the [staticwebapp.config.json file](./configuration.md).
- Users are assigned custom roles using the built-in [invitations](#invitations) system.
- Users can be programmatically assigned custom roles at login by an API function.
- All authentication providers are enabled by default.
  - To restrict an authentication provider, [block access](#block-an-authentication-provider) with a custom route rule. Configuring a custom provider also disables pre-configured providers.
- Pre-configured providers include:
  - Azure Active Directory<sup>1</sup>
  - GitHub
  - Twitter

<sup>1</sup> The preconfigured Azure Active Directory provider allows any Microsoft Account to sign in. To restrict login to a specific Active Directory tenant, configure a [custom Azure Active Directory provider](authentication-custom.md?tabs=aad).

The subjects of authentication and authorization significantly overlap with routing concepts, which are detailed in the [application configuration guide](configuration.md#routes).

## System folder

Azure Static Web Apps uses the `/.auth` system folder to provide access to authorization-related APIs. Rather than exposing any of the routes under the `/.auth` folder directly to end users, consider creating [routing rules](configuration.md#routes) to create friendly URLs.

## Login

Use the following table to find the provider-specific route.

| Authorization provider | Login route             |
| ---------------------- | ----------------------- |
| Azure Active Directory | `/.auth/login/aad`      |
| GitHub                 | `/.auth/login/github`   |
| Twitter                | `/.auth/login/twitter`  |

For example, to log in with GitHub you could include a link like the following snippet:

```html
<a href="/.auth/login/github">Login</a>
```

If you chose to support more than one provider, then you need to expose a provider-specific link for each on your website.

You can use a [route rule](./configuration.md#routes) to map a default provider to a friendly route like _/login_.

```json
{
  "route": "/login",
  "redirect": "/.auth/login/github"
}
```

### Post login redirect

If you want a user to return to a specific page after login, provide a full qualified URL in `post_login_redirect_uri` query string parameter.

For example:

```html
<a href="/.auth/login/github?post_login_redirect_uri=https://zealous-water.azurestaticapps.net/success">Login</a>
```

Additionally, you can redirect unauthenticated users back to the referring page after they log in. To configure this behavior, create a [response override](configuration.md#response-overrides) rule that sets `post_login_redirect_uri` to `.referrer`.

For example:

```json
{
  "responseOverrides": {
    "401": {
      "redirect": "/.auth/login/github?post_login_redirect_uri=.referrer",
      "statusCode": 302
    }
  }
}
```

## Logout

The `/.auth/logout` route logs users out from the website. You can add a link to your site navigation to allow the user to log out as shown in the following example.

```html
<a href="/.auth/logout">Log out</a>
```

You can use a [route rule](./configuration.md#routes) to map a friendly route like _/logout_.

```json
{
  "route": "/logout",
  "redirect": "/.auth/logout"
}
```

### Post logout redirect

If you want a user to return to a specific page after logout, provide a URL in `post_logout_redirect_uri` query string parameter.

## Block an authentication provider

You may want to restrict your app from using an authentication provider. For instance, your app may want to standardize only on [providers that expose email addresses](#provider-user-details).

To block a provider, you can create [route rules](configuration.md#routes) to return a 404 status code for requests to the blocked provider-specific route. For example, to restrict Twitter as provider, add the following route rule.

```json
{
  "route": "/.auth/login/twitter",
  "statusCode": 404
}
```

## Roles

Every user who accesses a static web app belongs to one or more roles. There are two built-in roles that users can belong to:

- **anonymous**: All users automatically belong to the _anonymous_ role.
- **authenticated**: All users who are logged in belong to the _authenticated_ role.

Beyond the built-in roles, you can assign custom roles to users, and reference them in the _staticwebapp.config.json_ file.

## Role management

# [Invitations](#tab/invitations)

### Add a user to a role

To add a user to a role, you generate invitations that allow you to associate users to specific roles. Roles are defined and maintained in the _staticwebapp.config.json_ file.

<a name="invitations" id="invitations"></a>

#### Create an invitation

Invitations are specific to individual authorization-providers, so consider the needs of your app as you select which providers to support. Some providers expose a user's email address, while others only provide the site's username.

<a name="provider-user-details" id="provider-user-details"></a>

| Authorization provider | Exposes a user's |
| ---------------------- | ---------------- |
| Azure Active Directory | email address    |
| GitHub                 | username         |
| Twitter                | username         |

1. Go to a Static Web Apps resource in the [Azure portal](https://portal.azure.com).
1. Under _Settings_, select **Role Management**.
2. Select **Invite**.
3. Select an _Authorization provider_ from the list of options.
4. Add either the username or email address of the recipient in the _Invitee details_ box.
   - For GitHub and Twitter, you enter the username. For all others, enter the recipient's email address.
5. Select the domain of your static site from the _Domain_ drop-down.
   - The domain you select is the domain that appears in the invitation. If you have a custom domain associated with your site, you probably want to choose the custom domain.
6. Add a comma-separated list of role names in the _Role_ box.
7. Enter the maximum number of hours you want the invitation to remain valid.
   - The maximum possible limit is 168 hours, which is 7 days.
8. Select **Generate**.
9. Copy the link from the _Invite link_ box.
10. Email the invitation link to the person you're granting access to your app.

When the user selects the link in the invitation, they're prompted to log in with their corresponding account. Once successfully logged-in, the user is associated with the selected roles.

> [!CAUTION]
> Make sure your route rules don't conflict with your selected authentication providers. Blocking a provider with a route rule would prevent users from accepting invitations.

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

1. Removing a user invalidates their permissions.
1. Worldwide propagation may take a few minutes.
1. If the user is added back to the app, the [`userId` changes](user-information.md).

# [Function (preview)](#tab/function)

Instead of using the built-in invitations system, you can use a serverless function to programmatically assign roles to users when they log in.

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

After defining the `rolesSource` property in your app's configuration, add an [API function](apis-functions.md) in your static web app at the path you specified. You can use a managed function app or a bring your own function app.

Each time a user successfully authenticates with an identity provider, the specified function is called via the POST method. The function is passed a JSON object in the request body that contains the user's information from the provider. For some identity providers, the user information also includes an `accessToken` that the function can use to make API calls using the user's identity.

This is an example payload from Azure Active Directory:

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

If you do not want to assign any additional roles to the user, return an empty `roles` array.

To learn more, see [Tutorial: Assign custom roles with a function and Microsoft Graph](assign-roles-microsoft-graph.md).

---

## Remove personal identifying information

When you grant consent to an application as an end user, the application has access to your email address or your username depending on the identity provider. Once this information is provided, the owner of the application decides how to manage personally identifying information.

End users need to contact administrators of individual web apps to revoke this information from their systems.

To remove personally identifying information from the Azure Static Web Apps platform, and prevent the platform from providing this information on future requests, submit a request using the URL:

```url
https://identity.azurestaticapps.net/.auth/purge/<AUTHENTICATION_PROVIDER_NAME>
```

To prevent the platform from providing this information on future requests to individual apps, submit a request to the following URL:

```url
https://<WEB_APP_DOMAIN_NAME>/.auth/purge/<AUTHENTICATION_PROVIDER_NAME>
```

Note that if you are using Azure Active Directory, use `aad` as the value for the `<AUTHENTICATION_PROVIDER_NAME>` placeholder.

## Restrictions

See the [Quotas article](quotas.md) for general restrictions and limitations.

## Next steps

> [!div class="nextstepaction"]
> [Access user authentication and authorization data](user-information.md)